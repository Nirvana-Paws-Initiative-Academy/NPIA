import { NextRequest, NextResponse } from "next/server";
import {
  ensureDatabaseSchema,
  getEmailTemplate,
  getPool,
  renderTemplate,
} from "@/lib/db/postgres";
import {
  EMAIL_REGEX,
  buildRelayAddress,
  generateRelayToken,
  getMailConfig,
  sendMailtrapEmail,
} from "@/lib/mail/relay";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  topics?: unknown;
}

function resolveRouteContext(topics: string[]): {
  category: string;
  templateKey: string;
} {
  if (
    topics.some((t) =>
      [
        "Partner Organization",
        "Veterinary / Clinic Partner",
        "Allied Individual",
        "Institutional Sponsorship",
      ].includes(t)
    )
  ) {
    return { category: "Partner Network", templateKey: "partner_inquiry" };
  }
  if (topics.includes("Sanctuary Donation")) {
    return { category: "Sanctuary Donations", templateKey: "donation_pledge" };
  }
  if (topics.length > 0) {
    return { category: "Community & Volunteer", templateKey: "contact_inquiry" };
  }
  return { category: "General Inquiry", templateKey: "contact_inquiry" };
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const topics = Array.isArray(body.topics)
    ? body.topics
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];

  if (name.length < 2 || name.length > 140) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 }
    );
  }
  if (!EMAIL_REGEX.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (message.length < 3 || message.length > 5000) {
    return NextResponse.json(
      { error: "Please include a brief message." },
      { status: 400 }
    );
  }

  const { category, templateKey } = resolveRouteContext(topics);
  const topicLine =
    topics.length > 0 ? topics.join(", ") : "General Contact / Partnership";
  const relayToken = generateRelayToken();

  let submissionId: number | null = null;
  try {
    await ensureDatabaseSchema();
    const insertRes = await getPool().query<{ id: number }>(
      `INSERT INTO contact_submissions (name, email, topics, category, message, mail_status, relay_token)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING id`,
      [name, email, topics, category, message, relayToken]
    );
    submissionId = insertRes.rows[0]?.id ?? null;
  } catch (dbErr) {
    console.error("Failed storing contact submission in PostgreSQL:", dbErr);
  }

  const config = getMailConfig();
  if (!config.token) {
    if (submissionId !== null) {
      await getPool()
        .query(
          `UPDATE contact_submissions SET mail_status = 'failed', mail_error = $1 WHERE id = $2`,
          ["MAILTRAP_API_TOKEN missing", submissionId]
        )
        .catch(() => {});
    }
    return NextResponse.json(
      { error: "Mail service is not configured." },
      { status: 500 }
    );
  }

  const template = await getEmailTemplate(templateKey);
  const templateVars = {
    name,
    email,
    topics: topicLine,
    category,
    message,
  };

  const baseSubject = renderTemplate(template.subject_template, templateVars, false);
  const subject = config.relayDomain
    ? `${baseSubject} [Ref: ${relayToken}]`
    : baseSubject;

  const renderedText = renderTemplate(template.text_template, templateVars, false);
  const textBody = config.relayDomain
    ? `${renderedText}\n\n[Ref: ${relayToken}]`
    : renderedText;

  const renderedHtml = renderTemplate(template.html_template, templateVars, true);
  const htmlBody = config.relayDomain
    ? `${renderedHtml}<div style="display:none;font-size:0;line-height:0;color:transparent;mso-hide:all;" aria-hidden="true">[Ref: ${relayToken}]</div>`
    : renderedHtml;

  const replyToAddress = config.relayDomain
    ? {
        email: buildRelayAddress(relayToken, config.relayDomain),
        name: `${name} via NPIA Desk`,
      }
    : { email, name };

  // Keep all team personal mailboxes completely hidden from each other by delivering via BCC.
  // The visible To: is addressed to the per-thread desk relay address, which ensures:
  // 1. Team personal emails are 100% private (BCC).
  // 2. Any "Reply" or "Reply All" is strictly targeted to reply+<token>@inbound.npia.org.in,
  //    preventing any bounce from an unhosted root hello@npia.org.in address.
  const teamInboxes = config.allTeamRecipients.filter(
    (addr) => addr !== config.senderEmail
  );
  const targetBcc =
    teamInboxes.length > 0
      ? teamInboxes.map((addr) => ({ email: addr }))
      : config.bccRecipients.map((addr) => ({ email: addr }));

  const targetTo = config.relayDomain
    ? [
        {
          email: buildRelayAddress(relayToken, config.relayDomain),
          name: `${name} via NPIA Desk`,
        },
      ]
    : config.primaryRecipients.map((addr) => ({ email: addr }));

  const sendResult = await sendMailtrapEmail({
    token: config.token,
    from: { email: config.senderEmail, name: config.senderName },
    to: targetTo,
    bcc: targetBcc,
    replyTo: replyToAddress,
    subject,
    text: textBody,
    html: htmlBody,
    category,
  });

  if (!sendResult.ok) {
    console.error("Mailtrap send error:", sendResult.error);
    if (submissionId !== null) {
      await getPool()
        .query(
          `UPDATE contact_submissions SET mail_status = 'failed', mail_error = $1 WHERE id = $2`,
          [sendResult.error.slice(0, 400), submissionId]
        )
        .catch(() => {});
    }
    return NextResponse.json(
      { error: "Unable to send email through Mailtrap right now." },
      { status: 502 }
    );
  }

  if (submissionId !== null) {
    await getPool()
      .query(`UPDATE contact_submissions SET mail_status = 'sent' WHERE id = $1`, [
        submissionId,
      ])
      .catch(() => {});

    await getPool()
      .query(
        `INSERT INTO contact_messages (
          submission_id, direction, from_email, from_name, to_emails, subject, text_body, mail_status
        ) VALUES ($1, 'inbound_from_visitor', $2, $3, $4, $5, $6, 'sent')`,
        [
          submissionId,
          email.toLowerCase(),
          name,
          config.allTeamRecipients,
          subject,
          message,
        ]
      )
      .catch(() => {});
  }

  return NextResponse.json({ ok: true, submissionId });
}
