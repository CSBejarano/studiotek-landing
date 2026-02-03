import { NextRequest, NextResponse } from 'next/server'
import { getLeadById, updateLead, insertLeadEvent, createSupabaseServerClient } from '@/lib/supabase'
import { z } from 'zod'

type RouteContext = { params: Promise<{ id: string }> }

// ============================================================
// Auth helper
// ============================================================

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get('x-api-key') === process.env.ADMIN_API_KEY
}

// ============================================================
// GET /api/leads/[id] - Lead detail with recent events
// ============================================================

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  const { id } = await context.params

  try {
    const lead = await getLeadById(id)
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Fetch last 20 events
    let events: Record<string, unknown>[] = []
    const supabase = createSupabaseServerClient()
    if (supabase) {
      const { data, error } = await supabase
        .from('lead_events')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        events = data
      }
    }

    return NextResponse.json({ success: true, lead, events })
  } catch (error) {
    console.error('[LEADS] GET detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================================
// PATCH /api/leads/[id] - Update lead (partial)
// ============================================================

const patchLeadSchema = z.object({
  status: z.string().optional(),
  classification: z.enum(['hot', 'warm', 'cold']).optional(),
  last_contacted_at: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict()

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  const { id } = await context.params

  try {
    // Verify lead exists
    const existingLead = await getLeadById(id)
    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = patchLeadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      )
    }

    const updates = parsed.data

    // Merge metadata if provided (shallow merge with existing)
    if (updates.metadata && existingLead.metadata) {
      const existingMeta = existingLead.metadata as Record<string, unknown>
      updates.metadata = { ...existingMeta, ...updates.metadata }
    }

    const updatedLead = await updateLead(id, updates)

    // Log update event with changed fields
    const changedFields = Object.keys(parsed.data)
    insertLeadEvent({
      lead_id: id,
      event_type: 'lead_updated',
      metadata: {
        changed_fields: changedFields,
        updates: parsed.data,
      },
    }).catch(err => console.error('[LEADS] Event log failed:', err))

    return NextResponse.json({ success: true, lead: updatedLead })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
    console.error('[LEADS] PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
