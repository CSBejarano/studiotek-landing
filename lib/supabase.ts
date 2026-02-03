import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface Lead {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  budget?: string
  message?: string
  service_interest?: string
  privacy_accepted: boolean
  commercial_accepted?: boolean
  source?: string
  score?: number
  classification?: string
  metadata?: Record<string, unknown>
  status?: string
  created_at?: string
  updated_at?: string
  last_contacted_at?: string
}

export interface LeadEvent {
  id?: string
  lead_id: string
  event_type: string
  metadata?: Record<string, unknown>
  created_at?: string
}

// Cliente para el servidor (bypass RLS)
export function createSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export interface InsertLeadData {
  name: string
  email: string
  company?: string
  phone?: string
  budget?: string
  message?: string
  service_interest?: string
  privacy_accepted: boolean
  commercial_accepted?: boolean
  source?: string
  score?: number
  classification?: string
  metadata?: Record<string, unknown>
}

export async function insertLead(lead: InsertLeadData) {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    console.log('[DEV] Supabase not configured, would save:', lead)
    return { id: 'dev-' + Date.now(), ...lead }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      ...lead,
      status: 'new',
      source: lead.source || 'web',
      score: lead.score || 0,
      classification: lead.classification || 'cold',
      metadata: lead.metadata || {},
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function insertLeadEvent(event: Omit<LeadEvent, 'id' | 'created_at'>) {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    console.log('[DEV] Would log event:', event)
    return
  }

  const { error } = await supabase
    .from('lead_events')
    .insert([event])

  if (error) {
    console.error('[LEADS] Failed to log event:', error)
  }
}

export async function getLeadById(id: string) {
  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function scheduleNurturingEmails(leadId: string) {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    console.log('[DEV] Would schedule nurturing for lead:', leadId)
    return
  }

  const now = new Date()
  const emails = [
    { step: 2, template_id: 'case_study', delay_hours: 24 },
    { step: 3, template_id: 'roi_proposal', delay_hours: 72 },
    { step: 4, template_id: 'cta_meeting', delay_hours: 168 }, // 7 days
  ]

  const records = emails.map(e => ({
    lead_id: leadId,
    step: e.step,
    template_id: e.template_id,
    scheduled_at: new Date(now.getTime() + e.delay_hours * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  }))

  const { error } = await supabase
    .from('email_sequences')
    .insert(records)

  if (error) {
    console.error('[LEADS] Failed to schedule nurturing:', error)
  }
}
