import { NextRequest, NextResponse } from "next/server";
import {
  ensureDatabaseSchema,
  getEmailTemplate,
  getPool,
  renderTemplate,
} from "@/lib/db/postgres";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  topics?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let submissionId: number | null = null;
  try {
    await ensureDatabaseSchema();
    const insertRes = await getPool().query<{ id: number }>(
      `INSERT INTO contact_submissions (name, email, topics, category, message, mail_status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id`,
      [name, email, topics, category, message]
    );
    submissionId = insertRes.rows[0]?.id ?? null;
  } catch (dbErr) {
    console.error("Failed storing contact submission in PostgreSQL:", dbErr);
  }

  const token = process.env.MAILTRAP_API_TOKEN;
  if (!token) {
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

  const subject = renderTemplate(template.subject_template, templateVars, false);
  const textBody = renderTemplate(template.text_template, templateVars, false);
  const htmlBody = renderTemplate(template.html_template, templateVars, true);

  const senderEmail = process.env.MAILTRAP_SENDER_EMAIL || "hello@npia.org.in";
  const senderName =
    process.env.MAILTRAP_SENDER_NAME || "Nirvana Paws Initiative & Academy";
  const recipientEmail =
    process.env.MAILTRAP_RECIPIENT_EMAIL || "gajakoushik@gmail.com";

  try {
    const mailtrapRes = await fetch("https://send.api.mailtrap.io/api/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: senderEmail, name: senderName },
        to: [{ email: recipientEmail }],
        reply_to: { email, name },
        subject,
        text: textBody,
        html: htmlBody,
        category,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!mailtrapRes.ok) {
      const errorDetail = await mailtrapRes.text();
      console.error("Mailtrap send error:", mailtrapRes.status, errorDetail);
      if (submissionId !== null) {
        await getPool()
          .query(
            `UPDATE contact_submissions SET mail_status = 'failed', mail_error = $1 WHERE id = $2`,
            [`HTTP ${mailtrapRes.status}: ${errorDetail.slice(0, 400)}`, submissionId]
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
    }

    return NextResponse.json({ ok: true, submissionId });
  } catch (error) {
    console.error("Mailtrap network error:", error);
    if (submissionId !== null) {
      await getPool()
        .query(
          `UPDATE contact_submissions SET mail_status = 'failed', mail_error = $1 WHERE id = $2`,
          ["Network error while sending", submissionId]
        )
        .catch(() => {});
    }
    return NextResponse.json(
      { error: "Network error while delivering message." },
      { status: 502 }
    );
  }
}
