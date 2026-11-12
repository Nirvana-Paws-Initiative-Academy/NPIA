import crypto from "node:crypto";
import { escapeHtml } from "@/lib/db/postgres";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes an email for comparison: lowercase, trim, and equate googlemail.com to gmail.com.
 */
export function normalizeEmail(email: string | undefined | null): string {
  if (!email) return "";
  const lower = email.trim().toLowerCase();
  return lower.replace(/@googlemail\.com$/, "@gmail.com");
}

export interface MailAddress {
  email: string;
  name?: string;
}

export interface MailConfig {
  token: string | undefined;
  senderEmail: string;
  senderName: string;
  primaryRecipients: string[];
  bccRecipients: string[];
  allTeamRecipients: string[];
  allowedTeamSenders: Set<string>;
  relayDomain: string;
  syncTeamOnReply: boolean;
}

/**
 * Parses a comma-, semicolon-, or whitespace-separated list of email strings
 * into unique, lowercase, valid email addresses.
 */
export function parseEmailList(raw: string | undefined): string[] {
  if (!raw) return [];
  const parts = raw
    .split(/[\s,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0 && item.length <= 200 && EMAIL_REGEX.test(item));

  return Array.from(new Set(parts));
}

/**
 * Resolves Mailtrap + multi-recipient + reply-relay settings from environment variables.
 */
export function getMailConfig(): MailConfig {
  const senderEmail = (
    process.env.MAILTRAP_SENDER_EMAIL || "hello@npia.org.in"
  )
    .trim()
    .toLowerCase();
  const senderName =
    process.env.MAILTRAP_SENDER_NAME?.trim() || "Nirvana Paws Initiative & Academy";

  const parsedPrimary = parseEmailList(process.env.MAILTRAP_RECIPIENT_EMAIL);
  const primaryRecipients =
    parsedPrimary.length > 0 ? parsedPrimary : [senderEmail];

  const rawTeam = [
    process.env.MAILTRAP_TEAM_EMAILS,
    process.env.MAILTRAP_BCC_EMAILS,
  ]
    .filter(Boolean)
    .join(",");

  const primarySet = new Set(primaryRecipients);
  const bccRecipients = parseEmailList(rawTeam).filter(
    (email) => !primarySet.has(email)
  );

  const allTeamRecipients = Array.from(
    new Set([...primaryRecipients, ...bccRecipients])
  );

  const extraAllowed = parseEmailList(process.env.MAILTRAP_ALLOWED_REPLY_FROM);
  const rawAllowed = [...allTeamRecipients, ...extraAllowed];
  const allowedTeamSenders = new Set<string>(rawAllowed.map(normalizeEmail));

  const relayDomain = (process.env.MAILTRAP_RELAY_DOMAIN || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();

  return {
    token: process.env.MAILTRAP_API_TOKEN?.trim() || undefined,
    senderEmail,
    senderName,
    primaryRecipients,
    bccRecipients,
    allTeamRecipients,
    allowedTeamSenders,
    relayDomain,
    syncTeamOnReply: process.env.MAILTRAP_RELAY_SYNC_TEAM !== "false",
  };
}

/**
 * Generates an unguessable per-submission thread token used in reply+<token>@<relayDomain>.
 */
export function generateRelayToken(): string {
  return `npia-${crypto.randomBytes(8).toString("hex")}`;
}

export function buildRelayAddress(relayToken: string, relayDomain: string): string {
  return `reply+${relayToken}@${relayDomain}`;
}

/**
 * Extracts a submission relay token from recipient email addresses, subject line, or body.
 */
export function extractRelayToken(
  addresses: string[],
  subject?: string,
  body?: string
): string | null {
  for (const addr of addresses) {
    const match = addr.match(/(?:reply[+._-]?)?(npia-[a-f0-9]{12,32})/i);
    if (match?.[1]) {
      return match[1].toLowerCase();
    }
  }
  if (subject) {
    const subjMatch = subject.match(/\b(npia-[a-f0-9]{12,32})\b/i);
    if (subjMatch?.[1]) {
      return subjMatch[1].toLowerCase();
    }
  }
  if (body) {
    const bodyMatch = body.match(/\b(npia-[a-f0-9]{12,32})\b/i);
    if (bodyMatch?.[1]) {
      return bodyMatch[1].toLowerCase();
    }
  }
  return null;
}

/**
 * Parses an RFC-style address entry ("Name <a@b.com>" or { email, name }) into a normalized MailAddress.
 */
export function parseAddressEntry(input: unknown): MailAddress | null {
  if (!input) return null;

  if (typeof input === "string") {
    const trimmed = input.trim();
    const angleMatch = trimmed.match(/^(.*?)\s*<([^<>\s]+@[^<>\s]+)>$/);
    if (angleMatch) {
      const email = angleMatch[2].trim().toLowerCase();
      const name = angleMatch[1].replace(/^["']|["']$/g, "").trim();
      return EMAIL_REGEX.test(email) ? { email, name: name || undefined } : null;
    }
    const bare = trimmed.toLowerCase();
    return EMAIL_REGEX.test(bare) ? { email: bare } : null;
  }

  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (Array.isArray(obj.value) && obj.value.length > 0) {
      return parseAddressEntry(obj.value[0]);
    }
    const rawEmail =
      (typeof obj.email === "string" && obj.email) ||
      (typeof obj.Email === "string" && obj.Email) ||
      (typeof obj.address === "string" && obj.address) ||
      "";
    const email = rawEmail.trim().toLowerCase();
    if (EMAIL_REGEX.test(email)) {
      const rawName =
        (typeof obj.name === "string" && obj.name) ||
        (typeof obj.Name === "string" && obj.Name) ||
        "";
      const name = rawName.trim() || undefined;
      return { email, name };
    }
    if (typeof obj.text === "string") {
      return parseAddressEntry(obj.text);
    }
    return null;
  }

  return null;
}

/**
 * Collects all normalized email strings from arrays, comma-separated strings, or address objects.
 */
export function collectEmailStrings(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .flatMap((item) => collectEmailStrings(item))
      .filter((v, idx, arr) => arr.indexOf(v) === idx);
  }
  if (typeof input === "string") {
    const single = parseAddressEntry(input);
    if (single) return [single.email];
    return input
      .split(",")
      .map((part) => parseAddressEntry(part)?.email ?? "")
      .filter(Boolean);
  }
  const single = parseAddressEntry(input);
  return single ? [single.email] : [];
}

/**
 * Removes email-client reply quote history ("On ... wrote:", "-----Original Message-----", "> quotes")
 * while keeping the newly written message intact.
 */
export function stripQuotedReply(rawText: string): string {
  const normalized = rawText.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  const lines = normalized.split("\n");
  const kept: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const nextLine = lines[i + 1] ?? "";
    const trimmed = line.trim();

    if (
      /^On .+wrote:\s*$/i.test(trimmed) ||
      (/^On /i.test(trimmed) && /wrote:\s*$/i.test(nextLine.trim()))
    ) {
      break;
    }
    if (
      /^-{2,}\s*Original Message\s*-{2,}$/i.test(trimmed) ||
      /^_{10,}$/.test(trimmed) ||
      /^From:\s.+@/i.test(trimmed)
    ) {
      break;
    }
    if (/^>/.test(trimmed) && kept.length > 0) {
      break;
    }

    kept.push(line);
  }

  const cleaned = kept.join("\n").trim();
  return cleaned || normalized;
}

/**
 * Lightweight HTML-to-plain-text fallback when inbound emails only include HTML.
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanReplySubject(subject: string): string {
  const stripped = subject
    .replace(/^(re|fwd?):\s*/gi, "")
    .replace(/^(re|fwd?):\s*/gi, "")
    .trim();
  return stripped || "Your inquiry with NPIA";
}

export function formatNpiaReplyEmail(params: {
  visitorName: string;
  replyText: string;
  category: string;
  subject: string;
}): { subject: string; text: string; html: string } {
  const baseSubject = cleanReplySubject(params.subject);
  const subject = `Re: ${baseSubject}`;
  const cleanBody = params.replyText.trim();

  const text = [
    cleanBody,
    "",
    "--",
    "Nirvana Paws Initiative & Academy (NPIA.)",
    "hello@npia.org.in · https://npia.org.in",
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#F4FAF5;padding:24px;color:#102412;">
      <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border:1px solid #D4E8D6;border-radius:16px;padding:24px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B714C;">
          NPIA. · ${escapeHtml(params.category)}
        </p>
        <div style="font-size:15px;line-height:1.65;color:#102412;white-space:pre-wrap;">${escapeHtml(cleanBody)}</div>
        <hr style="margin:22px 0 16px;border:0;border-top:1px solid #E2EDE3;" />
        <p style="margin:0;font-size:13px;font-weight:600;color:#102412;">
          Nirvana Paws Initiative &amp; Academy
        </p>
        <p style="margin:4px 0 0;font-size:12px;color:#4B714C;">
          hello@npia.org.in · <a href="https://npia.org.in" style="color:#245736;text-decoration:none;">npia.org.in</a>
        </p>
      </div>
    </div>
  `.trim();

  return { subject, text, html };
}

export function formatTeamRelayEmail(params: {
  heading: string;
  category: string;
  senderLabel: string;
  visitorName: string;
  visitorEmail: string;
  replyText: string;
  subject: string;
}): { subject: string; text: string; html: string } {
  const cleanBody = params.replyText.trim();

  const text = [
    params.heading,
    `From: ${params.senderLabel}`,
    `Visitor: ${params.visitorName} (${params.visitorEmail})`,
    "",
    cleanBody,
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#F4FAF5;padding:24px;color:#102412;">
      <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border:1px solid #D4E8D6;border-radius:16px;padding:24px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B714C;">
          NPIA. · ${escapeHtml(params.category)}
        </p>
        <h2 style="margin:0 0 14px;font-size:18px;color:#102412;">
          ${escapeHtml(params.heading)}
        </h2>
        <p style="margin:0 0 6px;font-size:13px;color:#355638;">
          <strong>From:</strong> ${escapeHtml(params.senderLabel)}
        </p>
        <p style="margin:0 0 16px;font-size:13px;color:#355638;">
          <strong>Visitor Thread:</strong> ${escapeHtml(params.visitorName)} (${escapeHtml(params.visitorEmail)})
        </p>
        <div style="padding:14px 16px;border-radius:12px;background:#EAF5EB;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#102412;">${escapeHtml(cleanBody)}</div>
        <p style="margin:16px 0 0;font-size:12px;color:#4B714C;">
          Reply directly to this email to respond as hello@npia.org.in.
        </p>
      </div>
    </div>
  `.trim();

  return { subject: params.subject, text, html };
}

export interface SendMailtrapOptions {
  token: string;
  from: MailAddress;
  to: MailAddress[];
  bcc?: MailAddress[];
  replyTo?: MailAddress;
  subject: string;
  text: string;
  html: string;
  category: string;
}

export async function sendMailtrapEmail(
  opts: SendMailtrapOptions
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const payload: Record<string, unknown> = {
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    category: opts.category,
  };

  if (opts.bcc && opts.bcc.length > 0) {
    payload.bcc = opts.bcc;
  }
  if (opts.replyTo) {
    payload.reply_to = opts.replyTo;
  }

  try {
    const res = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const errorDetail = await res.text();
      return {
        ok: false,
        status: res.status,
        error: `HTTP ${res.status}: ${errorDetail.slice(0, 400)}`,
      };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      error: err instanceof Error ? err.message : "Network error while sending",
    };
  }
}
