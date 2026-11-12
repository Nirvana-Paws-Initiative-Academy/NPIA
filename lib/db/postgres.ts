import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __npiaPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __npiaSchemaPromise: Promise<void> | undefined;
}

export interface EmailTemplateRow {
  key: string;
  name: string;
  category: string;
  subject_template: string;
  html_template: string;
  text_template: string;
}

const DEFAULT_TEMPLATES: EmailTemplateRow[] = [
  {
    key: "contact_inquiry",
    name: "NPIA General & Community Inquiry",
    category: "General Inquiry",
    subject_template: "[NPIA · {{category}}] New message from {{name}}",
    text_template: [
      "New inquiry received via npia.org.in Contact Desk",
      "",
      "Name: {{name}}",
      "Email: {{email}}",
      "Selected Topics: {{topics}}",
      "",
      "Message:",
      "{{message}}",
    ].join("\n"),
    html_template: `
      <div style="font-family:Inter,Arial,sans-serif;background:#F4FAF5;padding:24px;color:#102412;">
        <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #D4E8D6;border-radius:16px;padding:24px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B714C;">
            NPIA. · {{category}}
          </p>
          <h2 style="margin:0 0 18px;font-size:20px;color:#102412;">
            New message from {{name}}
          </h2>
          <p style="margin:0 0 8px;font-size:14px;">
            <strong>Email:</strong>
            <a href="mailto:{{email}}" style="color:#245736;">{{email}}</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;">
            <strong>Topics:</strong> {{topics}}
          </p>
          <div style="padding:14px 16px;border-radius:12px;background:#EAF5EB;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#102412;">{{message}}</div>
          <p style="margin:18px 0 0;font-size:12px;color:#4B714C;">
            Sent via npia.org.in · Reply directly to respond to {{name}}.
          </p>
        </div>
      </div>
    `.trim(),
  },
  {
    key: "partner_inquiry",
    name: "NPIA Allied Partner Network Submission",
    category: "Partner Network",
    subject_template: "[NPIA Partner Desk] Collaboration request from {{name}}",
    text_template: [
      "New Partner Network inquiry received via npia.org.in",
      "",
      "Name / Lead: {{name}}",
      "Email: {{email}}",
      "Partner Tracks: {{topics}}",
      "",
      "Proposal Details:",
      "{{message}}",
    ].join("\n"),
    html_template: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0B1C0E;padding:24px;color:#FAFFFD;">
        <div style="max-width:560px;margin:0 auto;background:#102412;border:1px solid #4AA552;border-radius:16px;padding:24px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#B2DCB3;">
            NPIA. · Partner Network
          </p>
          <h2 style="margin:0 0 18px;font-size:20px;color:#FAFFFD;">
            Partnership proposal from {{name}}
          </h2>
          <p style="margin:0 0 8px;font-size:14px;color:#E2FFE4;">
            <strong>Contact Email:</strong>
            <a href="mailto:{{email}}" style="color:#B2DCB3;">{{email}}</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;color:#E2FFE4;">
            <strong>Tracks Selected:</strong> {{topics}}
          </p>
          <div style="padding:14px 16px;border-radius:12px;background:#152916;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#FAFFFD;">{{message}}</div>
        </div>
      </div>
    `.trim(),
  },
  {
    key: "donation_pledge",
    name: "NPIA Sanctuary Donation Pledge",
    category: "Sanctuary Donations",
    subject_template: "[NPIA Sanctuary Fund] Support inquiry from {{name}}",
    text_template: [
      "New Sanctuary Donation inquiry received via npia.org.in",
      "",
      "Supporter Name: {{name}}",
      "Email: {{email}}",
      "Fund Focus: {{topics}}",
      "",
      "Pledge Details:",
      "{{message}}",
    ].join("\n"),
    html_template: `
      <div style="font-family:Inter,Arial,sans-serif;background:#EAF5EB;padding:24px;color:#102412;">
        <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #4B714C;border-radius:16px;padding:24px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#245736;">
            NPIA. · Sanctuary Fund Pledge
          </p>
          <h2 style="margin:0 0 18px;font-size:20px;color:#102412;">
            Contribution inquiry from {{name}}
          </h2>
          <p style="margin:0 0 8px;font-size:14px;">
            <strong>Supporter Email:</strong>
            <a href="mailto:{{email}}" style="color:#245736;">{{email}}</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;">
            <strong>Selected Area:</strong> {{topics}}
          </p>
          <div style="padding:14px 16px;border-radius:12px;background:#EAF5EB;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#102412;">{{message}}</div>
        </div>
      </div>
    `.trim(),
  },
];

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderTemplate(
  template: string,
  vars: Record<string, string>,
  escapeValues: boolean
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = vars[key] ?? "";
    return escapeValues ? escapeHtml(val) : val;
  });
}

export function getPool(): Pool {
  if (globalThis.__npiaPgPool) {
    return globalThis.__npiaPgPool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 8000,
  });

  globalThis.__npiaPgPool = pool;
  return pool;
}

export async function ensureDatabaseSchema(): Promise<void> {
  if (globalThis.__npiaSchemaPromise) {
    return globalThis.__npiaSchemaPromise;
  }

  const promise = (async () => {
    const pool = getPool();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        key TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subject_template TEXT NOT NULL,
        html_template TEXT NOT NULL,
        text_template TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS contact_submissions (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        topics TEXT[] NOT NULL DEFAULT '{}',
        category TEXT NOT NULL DEFAULT 'General Inquiry',
        message TEXT NOT NULL,
        mail_status TEXT NOT NULL DEFAULT 'pending',
        mail_error TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
        ON contact_submissions (created_at DESC);

      CREATE TABLE IF NOT EXISTS donation_pledges (
        id BIGSERIAL PRIMARY KEY,
        pledge_ref TEXT NOT NULL UNIQUE,
        frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'one-off')),
        cause TEXT NOT NULL CHECK (cause IN ('shelter', 'care', 'rescue')),
        cause_label TEXT NOT NULL,
        stage_ref TEXT NOT NULL,
        amount_inr INTEGER NOT NULL CHECK (amount_inr > 0),
        currency TEXT NOT NULL DEFAULT 'INR',
        donor_name TEXT,
        donor_email TEXT,
        status TEXT NOT NULL DEFAULT 'initiated',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_donation_pledges_created_at
        ON donation_pledges (created_at DESC);

      CREATE TABLE IF NOT EXISTS consent_records (
        id BIGSERIAL PRIMARY KEY,
        decision TEXT NOT NULL CHECK (decision IN ('accepted_all', 'rejected_non_essential', 'customized')),
        essential BOOLEAN NOT NULL DEFAULT TRUE,
        functional BOOLEAN NOT NULL DEFAULT FALSE,
        analytics BOOLEAN NOT NULL DEFAULT FALSE,
        communications BOOLEAN NOT NULL DEFAULT FALSE,
        language TEXT NOT NULL DEFAULT 'en',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS translation_cache (
        target_lang TEXT NOT NULL,
        source_hash TEXT NOT NULL,
        source_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (target_lang, source_hash)
      );
    `);

    for (const tpl of DEFAULT_TEMPLATES) {
      await pool.query(
        `
        INSERT INTO email_templates (key, name, category, subject_template, html_template, text_template)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (key) DO NOTHING;
        `,
        [
          tpl.key,
          tpl.name,
          tpl.category,
          tpl.subject_template,
          tpl.html_template,
          tpl.text_template,
        ]
      );
    }
  })().catch((err) => {
    globalThis.__npiaSchemaPromise = undefined;
    throw err;
  });

  globalThis.__npiaSchemaPromise = promise;
  return promise;
}

export async function getEmailTemplate(key: string): Promise<EmailTemplateRow> {
  const fallback =
    DEFAULT_TEMPLATES.find((t) => t.key === key) ?? DEFAULT_TEMPLATES[0];

  try {
    await ensureDatabaseSchema();
    const res = await getPool().query<EmailTemplateRow>(
      `SELECT key, name, category, subject_template, html_template, text_template
       FROM email_templates WHERE key = $1 LIMIT 1`,
      [key]
    );
    if (res.rows[0]) {
      return res.rows[0];
    }
  } catch (error) {
    console.error("Failed reading email template from PostgreSQL:", error);
  }

  return fallback;
}
