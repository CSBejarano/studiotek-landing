-- Migration 001: Add scoring and tracking fields to leads table
-- Run in Supabase SQL Editor
-- Date: 2026-02-02

-- Add new columns to existing leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web',
  ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'cold',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Update status column to support new values (if it was constrained)
-- Status values: new, contacted, qualified, proposal, customer, lost
COMMENT ON COLUMN leads.status IS 'Lead status: new | contacted | qualified | proposal | customer | lost';
COMMENT ON COLUMN leads.source IS 'Lead source: web | ai_chat | referral | ads';
COMMENT ON COLUMN leads.classification IS 'Auto-classification: hot | warm | cold';
COMMENT ON COLUMN leads.score IS 'Lead score 0-100 calculated from form data';
COMMENT ON COLUMN leads.metadata IS 'Additional form data (smart form answers)';

-- Index for filtering by status and score
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_classification ON leads(classification);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();
