import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_LANGUAGE_CODES } from "@/lib/i18n/languages";
import { ensureDatabaseSchema, getPool } from "@/lib/db/postgres";

interface TranslateRequestBody {
  targetLang?: string;
  texts?: unknown;
}

const serverCache = new Map<string, Map<string, string>>();

function getLangCache(lang: string): Map<string, string> {
  let map = serverCache.get(lang);
  if (!map) {
    map = new Map<string, string>();
    serverCache.set(lang, map);
  }
  return map;
}

function hashSource(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 32);
}

async function readDbTranslations(
  targetLang: string,
  texts: string[]
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (texts.length === 0) return result;

  try {
    await ensureDatabaseSchema();
    const hashes = texts.map(hashSource);
    const dbRes = await getPool().query<{
      source_text: string;
      translated_text: string;
    }>(
      `SELECT source_text, translated_text
       FROM translation_cache
       WHERE target_lang = $1 AND source_hash = ANY($2::text[])`,
      [targetLang, hashes]
    );

    const langCache = getLangCache(targetLang);
    for (const row of dbRes.rows) {
      result[row.source_text] = row.translated_text;
      if (langCache.size < 4000) {
        langCache.set(row.source_text, row.translated_text);
      }
    }
  } catch {
    // Gracefully fall back to live translation if DB read fails temporarily
  }

  return result;
}

async function saveDbTranslations(
  targetLang: string,
  entries: Array<{ source: string; translated: string }>
): Promise<void> {
  if (entries.length === 0) return;

  try {
    await ensureDatabaseSchema();
    const pool = getPool();
    for (const item of entries) {
      await pool.query(
        `INSERT INTO translation_cache (target_lang, source_hash, source_text, translated_text, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (target_lang, source_hash) DO UPDATE SET
           translated_text = EXCLUDED.translated_text,
           updated_at = NOW()`,
        [targetLang, hashSource(item.source), item.source, item.translated]
      );
    }
  } catch {
    // Non-fatal if cache write fails
  }
}

async function translateSingle(text: string, targetLang: string): Promise<string> {
  const langCache = getLangCache(targetLang);
  const hit = langCache.get(text);
  if (hit !== undefined) return hit;

  try {
    const body = new URLSearchParams({
      client: "gtx",
      sl: "en",
      tl: targetLang,
      dt: "t",
      q: text,
    });

    const res = await fetch(
      "https://translate.googleapis.com/translate_a/single",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: body.toString(),
        signal: AbortSignal.timeout(4500),
      }
    );

    if (!res.ok) return text;

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) return text;

    const segments = data[0] as unknown[];
    const translated = segments
      .map((seg) => (Array.isArray(seg) && typeof seg[0] === "string" ? seg[0] : ""))
      .join("")
      .trim();

    if (!translated) return text;

    if (langCache.size < 4000) {
      langCache.set(text, translated);
    }
    return translated;
  } catch {
    return text;
  }
}

export async function POST(req: NextRequest) {
  let payload: TranslateRequestBody;
  try {
    payload = (await req.json()) as TranslateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const targetLang =
    typeof payload.targetLang === "string" ? payload.targetLang.trim() : "en";

  if (!ALLOWED_LANGUAGE_CODES.has(targetLang)) {
    return NextResponse.json(
      { error: "Unsupported target language" },
      { status: 400 }
    );
  }

  const rawTexts = Array.isArray(payload.texts) ? payload.texts : [];
  const cleanTexts = Array.from(
    new Set(
      rawTexts
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.length <= 1200)
    )
  ).slice(0, 60);

  if (targetLang === "en" || cleanTexts.length === 0) {
    const identity: Record<string, string> = {};
    for (const t of cleanTexts) identity[t] = t;
    return NextResponse.json({ translations: identity });
  }

  const langCache = getLangCache(targetLang);
  const translations: Record<string, string> = {};
  const needDbCheck: string[] = [];

  for (const text of cleanTexts) {
    const mem = langCache.get(text);
    if (mem !== undefined) {
      translations[text] = mem;
    } else {
      needDbCheck.push(text);
    }
  }

  const dbHits = await readDbTranslations(targetLang, needDbCheck);
  Object.assign(translations, dbHits);

  const missing = needDbCheck.filter((t) => translations[t] === undefined);
  const newlyTranslated: Array<{ source: string; translated: string }> = [];
  const CONCURRENCY = 6;

  for (let i = 0; i < missing.length; i += CONCURRENCY) {
    const slice = missing.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      slice.map(async (text) => ({
        source: text,
        translated: await translateSingle(text, targetLang),
      }))
    );
    for (const pair of results) {
      translations[pair.source] = pair.translated;
      if (pair.translated !== pair.source) {
        newlyTranslated.push(pair);
      }
    }
  }

  if (newlyTranslated.length > 0) {
    await saveDbTranslations(targetLang, newlyTranslated);
  }

  return NextResponse.json({ translations });
}
