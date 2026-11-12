-- NPIA Sanctuary PostgreSQL Schema (Supabase / PostgreSQL)
-- Covers contact/partner forms, donation pledges, reusable email templates,
-- DPDP Act 2023 cookie consent records, and multi-language translation caching.

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
