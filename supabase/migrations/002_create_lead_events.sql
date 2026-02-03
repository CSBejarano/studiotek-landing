-- Migration 002: Create lead_events table for tracking lead activity
-- Run in Supabase SQL Editor
-- Date: 2026-02-02

CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event types: form_submit, email_sent, email_opened, email_clicked,
--              hot_lead_notified, call, meeting_scheduled, proposal_sent, contract_signed

COMMENT ON TABLE lead_events IS 'Timeline of events for each lead';
COMMENT ON COLUMN lead_events.event_type IS 'form_submit | email_sent | email_opened | email_clicked | hot_lead_notified | call | meeting_scheduled | proposal_sent | contract_signed';

-- Index for querying events by lead (timeline view)
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_created
  ON lead_events(lead_id, created_at DESC);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_lead_events_type
  ON lead_events(event_type, created_at DESC);
