import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseSchema, getPool } from "@/lib/db/postgres";
import { ALLOWED_LANGUAGE_CODES } from "@/lib/i18n/languages";

interface ConsentLogBody {
  decision?: unknown;
  functional?: unknown;
  analytics?: unknown;
  communications?: unknown;
  language?: unknown;
}

const VALID_DECISIONS = new Set([
  "accepted_all",
  "rejected_non_essential",
  "customized",
]);

export async function POST(req: NextRequest) {
  let body: ConsentLogBody;
  try {
    body = (await req.json()) as ConsentLogBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const decision =
    typeof body.decision === "string" && VALID_DECISIONS.has(body.decision)
      ? body.decision
      : null;

  if (!decision) {
    return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  }

  const language =
    typeof body.language === "string" && ALLOWED_LANGUAGE_CODES.has(body.language)
      ? body.language
      : "en";

  try {
    await ensureDatabaseSchema();
    await getPool().query(
      `INSERT INTO consent_records (decision, essential, functional, analytics, communications, language)
       VALUES ($1, TRUE, $2, $3, $4, $5)`,
      [
        decision,
        Boolean(body.functional),
        Boolean(body.analytics),
        Boolean(body.communications),
        language,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed storing DPDP consent record:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
