import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseSchema, getPool } from "@/lib/db/postgres";
import {
  buildRelayAddress,
  collectEmailStrings,
  extractRelayToken,
  formatNpiaReplyEmail,
  formatTeamRelayEmail,
  getMailConfig,
  htmlToPlainText,
  normalizeEmail,
  parseAddressEntry,
  sendMailtrapEmail,
  stripQuotedReply,
} from "@/lib/mail/relay";

interface NormalizedInboundMessage {
  fromEmail: string;
  fromName?: string;
  recipientAddresses: string[];
  subject: string;
  text: string;
  html: string;
}

interface SubmissionRecord {
  id: number;
  name: string;
  email: string;
  category: string;
  message: string;
  relay_token: string;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyWebhookAuth(req: NextRequest, rawBody: string): {
  authorized: boolean;
  configured: boolean;
} {
  const mailtrapSecret = process.env.MAILTRAP_WEBHOOK_SECRET?.trim();
  const sharedSecret = process.env.INBOUND_WEBHOOK_SECRET?.trim();

  if (!mailtrapSecret && !sharedSecret) {
    return { authorized: false, configured: false };
  }

  const mailtrapSig = req.headers.get("mailtrap-signature")?.trim();
  if (mailtrapSecret && mailtrapSig) {
    const expectedHex = crypto
      .createHmac("sha256", mailtrapSecret)
      .update(rawBody)
      .digest("hex");
    const expectedB64 = crypto
      .createHmac("sha256", mailtrapSecret)
      .update(rawBody)
      .digest("base64");
    const normalizedSig = mailtrapSig.replace(/^sha256=/i, "");
    if (
      safeEqual(normalizedSig.toLowerCase(), expectedHex.toLowerCase()) ||
      safeEqual(normalizedSig, expectedB64)
    ) {
      return { authorized: true, configured: true };
    }
  }

  if (sharedSecret) {
    const headerSecret =
      req.headers.get("x-webhook-secret")?.trim() ||
      req.headers.get("x-inbound-secret")?.trim() ||
      "";
    const authHeader = req.headers.get("authorization")?.trim() || "";
    const bearerSecret = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";
    const querySecret = req.nextUrl.searchParams.get("secret")?.trim() || "";

    if (
      (headerSecret && safeEqual(headerSecret, sharedSecret)) ||
      (bearerSecret && safeEqual(bearerSecret, sharedSecret)) ||
      (querySecret && safeEqual(querySecret, sharedSecret))
    ) {
      return { authorized: true, configured: true };
    }
  }

  return { authorized: false, configured: true };
}

function readHeaderAddresses(headers: unknown): string[] {
  if (!headers) return [];

  if (Array.isArray(headers)) {
    // Postmark style [{ Name: "Delivered-To", Value: "..." }]
    return headers
      .filter((h): h is { Name?: unknown; Value?: unknown; name?: unknown; value?: unknown } =>
        Boolean(h && typeof h === "object")
      )
      .filter((h) => {
        const key = String(h.Name ?? h.name ?? "").toLowerCase();
        return (
          key === "to" ||
          key === "cc" ||
          key === "delivered-to" ||
          key === "x-original-to" ||
          key === "x-forwarded-to"
        );
      })
      .flatMap((h) => collectEmailStrings(h.Value ?? h.value));
  }

  if (typeof headers === "object") {
    const obj = headers as Record<string, unknown>;
    const collected: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (
        lower === "to" ||
        lower === "cc" ||
        lower === "delivered-to" ||
        lower === "x-original-to" ||
        lower === "x-forwarded-to"
      ) {
        collected.push(...collectEmailStrings(val));
      }
    }
    return collected;
  }

  return [];
}

function normalizeSinglePayload(item: Record<string, unknown>): NormalizedInboundMessage | null {
  const envelope =
    item.envelope && typeof item.envelope === "object"
      ? (item.envelope as Record<string, unknown>)
      : undefined;

  const fromParsed =
    parseAddressEntry(item.from) ||
    parseAddressEntry(item.FromFull) ||
    parseAddressEntry(item.From) ||
    parseAddressEntry(item.sender) ||
    parseAddressEntry(envelope?.from) ||
    parseAddressEntry(envelope?.mailFrom) ||
    (typeof item.from_email === "string"
      ? parseAddressEntry({ email: item.from_email, name: item.from_name })
      : null);

  if (!fromParsed) return null;

  const fromName =
    fromParsed.name ||
    (typeof item.FromName === "string" ? item.FromName.trim() : undefined);

  const recipientAddresses = Array.from(
    new Set([
      ...collectEmailStrings(item.to),
      ...collectEmailStrings(item.cc),
      ...collectEmailStrings(item.bcc),
      ...collectEmailStrings(item.recipients),
      ...collectEmailStrings(item.rcptTo),
      ...collectEmailStrings(item.recipient),
      ...collectEmailStrings(item.destination),
      ...collectEmailStrings(item.ToFull),
      ...collectEmailStrings(item.CcFull),
      ...collectEmailStrings(item.To),
      ...collectEmailStrings(item.OriginalRecipient),
      ...collectEmailStrings(envelope?.to),
      ...collectEmailStrings(envelope?.recipients),
      ...readHeaderAddresses(item.headers ?? item.Headers),
    ])
  );

  const subject = String(item.subject ?? item.Subject ?? "").trim();
  const text = String(
    item.StrippedTextReply ?? item.text ?? item.TextBody ?? item.plain ?? ""
  );
  const html = String(item.html ?? item.HtmlBody ?? "");

  return {
    fromEmail: fromParsed.email,
    fromName,
    recipientAddresses,
    subject,
    text,
    html,
  };
}

function extractInboundMessages(payload: unknown): NormalizedInboundMessage[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;

  if (Array.isArray(root.events)) {
    return root.events
      .filter((ev): ev is Record<string, unknown> => Boolean(ev && typeof ev === "object"))
      .filter((ev) => {
        const eventName = typeof ev.event === "string" ? ev.event : "";
        return !eventName || eventName.includes("inbound");
      })
      .map(normalizeSinglePayload)
      .filter((msg): msg is NormalizedInboundMessage => msg !== null);
  }

  const single = normalizeSinglePayload(root);
  return single ? [single] : [];
}

export async function POST(req: NextRequest) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Unable to read payload" }, { status: 400 });
  }

  const auth = verifyWebhookAuth(req, rawBody);
  if (!auth.configured) {
    return NextResponse.json(
      { error: "Inbound webhook secret is not configured." },
      { status: 503 }
    );
  }
  if (!auth.authorized) {
    return NextResponse.json(
      { error: "Unauthorized inbound webhook request." },
      { status: 401 }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const messages = extractInboundMessages(parsedBody);
  if (messages.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, status: "no_messages" });
  }

  const config = getMailConfig();
  if (!config.token) {
    return NextResponse.json(
      { error: "MAILTRAP_API_TOKEN is missing." },
      { status: 500 }
    );
  }

  try {
    await ensureDatabaseSchema();
  } catch (dbInitErr) {
    console.error("Warning: ensureDatabaseSchema error in inbound-reply:", dbInitErr);
  }

  const pool = getPool();
  const results: Array<{ status: string; submissionId?: number }> = [];

  for (const msg of messages) {
    const combinedContent = `${msg.text}\n${msg.html}`;
    const relayToken = extractRelayToken(
      msg.recipientAddresses,
      msg.subject,
      combinedContent
    );

    if (!relayToken) {
      console.warn("Ignored inbound email: no relay token found in recipients, subject, or body", {
        recipients: msg.recipientAddresses,
        subject: msg.subject,
      });
      results.push({ status: "ignored_no_relay_token" });
      continue;
    }

    // Ignore loop/self-originated messages
    if (
      msg.fromEmail === config.senderEmail ||
      (config.relayDomain && msg.fromEmail.endsWith(`@${config.relayDomain}`))
    ) {
      results.push({ status: "ignored_self_sender" });
      continue;
    }

    let submission: SubmissionRecord | null = null;
    try {
      const subRes = await pool.query<SubmissionRecord>(
        `SELECT id, name, email, category, message, relay_token
         FROM contact_submissions
         WHERE relay_token = $1
         LIMIT 1`,
        [relayToken]
      );
      submission = subRes.rows[0] || null;
    } catch (queryErr) {
      console.error("Failed querying contact_submissions for relay token:", queryErr);
    }

    // Fallback: If submission wasn't found in DB (e.g. historical test prior to DB pooler fix),
    // extract visitor email and name from the quoted email thread
    if (!submission) {
      const emailMatch = combinedContent.match(
        /(?:<strong>Email:<\/strong>|\bEmail:)\s*<?(?:mailto:)?([^\s<>"'@]+@[^\s<>"']+\.[^\s<>"']+)>?/i
      );
      const nameMatch = combinedContent.match(
        /(?:<strong>Name:<\/strong>|\bName:)\s*([^\n<]+)/i
      );
      if (emailMatch) {
        submission = {
          id: 0,
          name: nameMatch ? nameMatch[1].trim() : "Visitor",
          email: emailMatch[1].trim().toLowerCase(),
          category: "General Inquiry",
          message: "",
          relay_token: relayToken,
        };
      }
    }

    if (!submission) {
      results.push({ status: "ignored_unknown_token" });
      continue;
    }

    const rawText = msg.text.trim()
      ? msg.text
      : msg.html
      ? htmlToPlainText(msg.html)
      : "";
    const replyText = stripQuotedReply(rawText);
    if (!replyText) {
      results.push({ status: "ignored_empty_body", submissionId: submission.id });
      continue;
    }

    const visitorEmail = submission.email.trim().toLowerCase();
    const relayAddress =
      config.relayDomain
        ? buildRelayAddress(relayToken, config.relayDomain)
        : msg.recipientAddresses.find((a) => a.toLowerCase().includes(relayToken)) ||
          config.senderEmail;

    const fromNormalized = normalizeEmail(msg.fromEmail);
    const isTeamSender = config.allowedTeamSenders.has(fromNormalized);
    const isVisitorSender = fromNormalized === normalizeEmail(visitorEmail);

    // Route 1: Authorized NPIA team member replying from personal inbox -> send to visitor as NPIA
    if (isTeamSender) {
      const formatted = formatNpiaReplyEmail({
        visitorName: submission.name,
        replyText,
        category: submission.category,
        subject: msg.subject,
      });

      const sendResult = await sendMailtrapEmail({
        token: config.token,
        from: { email: config.senderEmail, name: config.senderName },
        to: [{ email: submission.email, name: submission.name }],
        replyTo: { email: relayAddress, name: config.senderName },
        subject: formatted.subject,
        text: formatted.text,
        html: formatted.html,
        category: `${submission.category} Reply`,
      });

      if (submission.id > 0) {
        await pool
          .query(
            `INSERT INTO contact_messages (
              submission_id, direction, from_email, from_name, to_emails, subject, text_body, mail_status, mail_error
            ) VALUES ($1, 'outbound_to_visitor', $2, $3, $4, $5, $6, $7, $8)`,
            [
              submission.id,
              msg.fromEmail,
              msg.fromName || null,
              [visitorEmail],
              formatted.subject,
              replyText,
              sendResult.ok ? "sent" : "failed",
              sendResult.ok ? null : sendResult.error.slice(0, 400),
            ]
          )
          .catch(() => {});
      }

      if (!sendResult.ok) {
        return NextResponse.json(
          { error: "Failed forwarding reply to visitor via Mailtrap." },
          { status: 502 }
        );
      }

      // Sync other team recipients internally so nobody double-replies
      if (config.syncTeamOnReply) {
        const otherTeam = config.allTeamRecipients.filter(
          (addr) => addr !== msg.fromEmail && addr !== config.senderEmail
        );
        if (otherTeam.length > 0) {
          const teamCopy = formatTeamRelayEmail({
            heading: `Team reply sent to ${submission.name}`,
            category: `${submission.category} · Team Sync`,
            senderLabel: msg.fromName
              ? `${msg.fromName} (${msg.fromEmail})`
              : msg.fromEmail,
            visitorName: submission.name,
            visitorEmail: submission.email,
            replyText,
            subject: `[Team Replied] ${formatted.subject}`,
          });

          await sendMailtrapEmail({
            token: config.token,
            from: { email: config.senderEmail, name: config.senderName },
            to: [{ email: config.senderEmail, name: config.senderName }],
            bcc: otherTeam.map((addr) => ({ email: addr })),
            replyTo: { email: relayAddress, name: config.senderName },
            subject: teamCopy.subject,
            text: teamCopy.text,
            html: teamCopy.html,
            category: "Team Sync",
          }).catch(() => {});
        }
      }

      results.push({ status: "relayed_to_visitor", submissionId: submission.id });
      continue;
    }

    // Route 2: Original visitor replying back -> fan out to all team recipients
    if (isVisitorSender) {
      const forward = formatTeamRelayEmail({
        heading: `Follow-up reply from ${submission.name}`,
        category: submission.category,
        senderLabel: `${submission.name} <${submission.email}>`,
        visitorName: submission.name,
        visitorEmail: submission.email,
        replyText,
        subject: `[NPIA Reply · ${submission.name}] ${msg.subject || submission.category}`,
      });

      const sendResult = await sendMailtrapEmail({
        token: config.token,
        from: { email: config.senderEmail, name: config.senderName },
        to: config.primaryRecipients.map((addr) => ({ email: addr })),
        bcc: config.bccRecipients.map((addr) => ({ email: addr })),
        replyTo: { email: relayAddress, name: `${submission.name} via NPIA Desk` },
        subject: forward.subject,
        text: forward.text,
        html: forward.html,
        category: `${submission.category} Follow-up`,
      });

      if (submission.id > 0) {
        await pool
          .query(
            `INSERT INTO contact_messages (
              submission_id, direction, from_email, from_name, to_emails, subject, text_body, mail_status, mail_error
            ) VALUES ($1, 'inbound_from_visitor', $2, $3, $4, $5, $6, $7, $8)`,
            [
              submission.id,
              msg.fromEmail,
              submission.name,
              config.allTeamRecipients,
              forward.subject,
              replyText,
              sendResult.ok ? "sent" : "failed",
              sendResult.ok ? null : sendResult.error.slice(0, 400),
            ]
          )
          .catch(() => {});
      }

      if (!sendResult.ok) {
        return NextResponse.json(
          { error: "Failed forwarding visitor reply to team." },
          { status: 502 }
        );
      }

      results.push({ status: "relayed_to_team", submissionId: submission.id });
      continue;
    }

    results.push({ status: "ignored_unauthorized_sender", submissionId: submission.id });
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
