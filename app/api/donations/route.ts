import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseSchema, getPool } from "@/lib/db/postgres";

interface DonationPayload {
  frequency?: unknown;
  cause?: unknown;
  causeLabel?: unknown;
  stageRef?: unknown;
  amountInr?: unknown;
  donorName?: unknown;
  donorEmail?: unknown;
}

const VALID_FREQUENCIES = new Set(["monthly", "one-off"]);
const VALID_CAUSES = new Set(["shelter", "care", "rescue"]);

export async function GET() {
  try {
    await ensureDatabaseSchema();
    const res = await getPool().query<{
      total_pledges: string;
      monthly_count: string;
      one_off_count: string;
    }>(`
      SELECT
        COUNT(*)::text AS total_pledges,
        COUNT(*) FILTER (WHERE frequency = 'monthly')::text AS monthly_count,
        COUNT(*) FILTER (WHERE frequency = 'one-off')::text AS one_off_count
      FROM donation_pledges
    `);
    const row = res.rows[0];
    return NextResponse.json({
      totalPledges: Number(row?.total_pledges ?? 0),
      monthlyCount: Number(row?.monthly_count ?? 0),
      oneOffCount: Number(row?.one_off_count ?? 0),
    });
  } catch (error) {
    console.error("Donation summary fetch error:", error);
    return NextResponse.json(
      { error: "Database unavailable" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: DonationPayload;
  try {
    body = (await req.json()) as DonationPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const frequency =
    typeof body.frequency === "string" && VALID_FREQUENCIES.has(body.frequency)
      ? body.frequency
      : null;
  const cause =
    typeof body.cause === "string" && VALID_CAUSES.has(body.cause)
      ? body.cause
      : null;
  const causeLabel =
    typeof body.causeLabel === "string" ? body.causeLabel.trim().slice(0, 80) : "";
  const stageRef =
    typeof body.stageRef === "string" ? body.stageRef.trim().slice(0, 80) : "";
  const amountInr =
    typeof body.amountInr === "number" && Number.isFinite(body.amountInr)
      ? Math.round(body.amountInr)
      : 0;

  if (!frequency || !cause || !causeLabel || !stageRef || amountInr <= 0 || amountInr > 100000000) {
    return NextResponse.json(
      { error: "Invalid donation pledge details" },
      { status: 400 }
    );
  }

  const donorName =
    typeof body.donorName === "string" ? body.donorName.trim().slice(0, 140) || null : null;
  const donorEmail =
    typeof body.donorEmail === "string" ? body.donorEmail.trim().slice(0, 200) || null : null;

  const pledgeRef = `NPIA-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  try {
    await ensureDatabaseSchema();
    const res = await getPool().query<{ id: number; pledge_ref: string }>(
      `INSERT INTO donation_pledges (
        pledge_ref, frequency, cause, cause_label, stage_ref, amount_inr, donor_name, donor_email, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'initiated')
      RETURNING id, pledge_ref`,
      [
        pledgeRef,
        frequency,
        cause,
        causeLabel,
        stageRef,
        amountInr,
        donorName,
        donorEmail,
      ]
    );

    return NextResponse.json({
      ok: true,
      id: res.rows[0]?.id,
      pledgeRef: res.rows[0]?.pledge_ref ?? pledgeRef,
    });
  } catch (error) {
    console.error("Failed storing donation pledge in PostgreSQL:", error);
    return NextResponse.json(
      { error: "Unable to record donation pledge right now." },
      { status: 500 }
    );
  }
}
