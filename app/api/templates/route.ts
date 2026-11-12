import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseSchema, getPool } from "@/lib/db/postgres";

interface TemplateUpsertBody {
  key?: unknown;
  name?: unknown;
  category?: unknown;
  subjectTemplate?: unknown;
  htmlTemplate?: unknown;
  textTemplate?: unknown;
}

export async function GET() {
  try {
    await ensureDatabaseSchema();
    const res = await getPool().query(
      `SELECT key, name, category, subject_template, updated_at
       FROM email_templates ORDER BY key ASC`
    );
    return NextResponse.json({ templates: res.rows });
  } catch (error) {
    console.error("Failed listing email templates:", error);
    return NextResponse.json(
      { error: "Unable to list email templates." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const adminKey = process.env.NPIA_ADMIN_KEY;
  const providedKey = req.headers.get("x-npia-admin-key");

  if (!adminKey || providedKey !== adminKey) {
    return NextResponse.json(
      { error: "Unauthorized template update. Set NPIA_ADMIN_KEY to manage templates." },
      { status: 403 }
    );
  }

  let body: TemplateUpsertBody;
  try {
    body = (await req.json()) as TemplateUpsertBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const subjectTemplate =
    typeof body.subjectTemplate === "string" ? body.subjectTemplate.trim() : "";
  const htmlTemplate =
    typeof body.htmlTemplate === "string" ? body.htmlTemplate.trim() : "";
  const textTemplate =
    typeof body.textTemplate === "string" ? body.textTemplate.trim() : "";

  if (!/^[a-z0-9_]{2,64}$/.test(key) || !name || !category || !subjectTemplate || !htmlTemplate || !textTemplate) {
    return NextResponse.json(
      { error: "All template fields and a valid lowercase key are required." },
      { status: 400 }
    );
  }

  try {
    await ensureDatabaseSchema();
    await getPool().query(
      `
      INSERT INTO email_templates (key, name, category, subject_template, html_template, text_template, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (key) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        subject_template = EXCLUDED.subject_template,
        html_template = EXCLUDED.html_template,
        text_template = EXCLUDED.text_template,
        updated_at = NOW()
      `,
      [key, name, category, subjectTemplate, htmlTemplate, textTemplate]
    );
    return NextResponse.json({ ok: true, key });
  } catch (error) {
    console.error("Failed saving template:", error);
    return NextResponse.json(
      { error: "Unable to save template." },
      { status: 500 }
    );
  }
}
