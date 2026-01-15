import { createClient } from '@supabase/supabase-js'

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
  created_at?: string
  status?: string
}

// Cliente para el servidor (bypass RLS)
export function createSupabaseServerClient() {
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

export async function insertLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>) {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    console.log('[DEV] Supabase not configured, would save:', lead)
    return { id: 'dev-' + Date.now(), ...lead }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([{ ...lead, status: 'new' }])
    .select()
    .single()

  if (error) throw error
  return data
}
