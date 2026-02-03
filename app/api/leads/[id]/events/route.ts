import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, getLeadById, insertLeadEvent } from '@/lib/supabase'
import { z } from 'zod'

type RouteContext = { params: Promise<{ id: string }> }

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function isAuthorized(request: NextRequest): boolean {
  return request.headers.get('x-api-key') === process.env.ADMIN_API_KEY
}

// ============================================================
// GET /api/leads/[id]/events - List lead events
// ============================================================

const getEventsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  const { id } = await context.params

  try {
    // Verify lead exists
    const lead = await getLeadById(id)
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsed = getEventsQuerySchema.safeParse({
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      )
    }

    const { limit, offset } = parsed.data

    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { data: events, error, count } = await supabase
      .from('lead_events')
      .select('*', { count: 'exact' })
      .eq('lead_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[LEADS] GET events error:', error)
      return NextResponse.json(
        { success: false, error: 'Error fetching events' },
        { status: 500 }
      )
    }

    const total = count ?? 0

    return NextResponse.json({
      success: true,
      events: events ?? [],
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error('[LEADS] GET events unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================================
// POST /api/leads/[id]/events - Create manual event
// ============================================================

const ALLOWED_EVENT_TYPES = ['call', 'meeting', 'proposal', 'note', 'status_change'] as const

const createEventSchema = z.object({
  event_type: z.enum(ALLOWED_EVENT_TYPES),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isAuthorized(request)) return unauthorized()

  const { id } = await context.params

  try {
    // Verify lead exists
    const lead = await getLeadById(id)
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const parsed = createEventSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      )
    }

    const { event_type, metadata } = parsed.data

    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Insert and return the created event
    const { data: event, error } = await supabase
      .from('lead_events')
      .insert([{
        lead_id: id,
        event_type,
        metadata: metadata ?? {},
      }])
      .select()
      .single()

    if (error) {
      console.error('[LEADS] POST event error:', error)
      return NextResponse.json(
        { success: false, error: 'Error creating event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
    console.error('[LEADS] POST event unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
