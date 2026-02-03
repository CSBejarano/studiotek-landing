-- Migration 003: Create email_sequences table for nurturing automation
-- Run in Supabase SQL Editor
-- Date: 2026-02-02

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  template_id TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  opened BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status values: pending, sent, opened, clicked, failed, cancelled
COMMENT ON TABLE email_sequences IS 'Scheduled nurturing emails for leads';
COMMENT ON COLUMN email_sequences.step IS 'Email step: 2 (+24h), 3 (+72h), 4 (+7d). Step 1 is sent immediately.';
COMMENT ON COLUMN email_sequences.status IS 'pending | sent | opened | clicked | failed | cancelled';

-- Index for cron job: find pending emails ready to send
CREATE INDEX IF NOT EXISTS idx_email_sequences_pending
  ON email_sequences(status, scheduled_at)
  WHERE status = 'pending';

-- Index for lead's email history
CREATE INDEX IF NOT EXISTS idx_email_sequences_lead
  ON email_sequences(lead_id, step);

-- Unique constraint: one email per step per lead
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_sequences_unique_step
  ON email_sequences(lead_id, step);
