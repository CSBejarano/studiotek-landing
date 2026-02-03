import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, insertLead, insertLeadEvent, scheduleNurturingEmails } from '@/lib/supabase'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { notifyHotLead } from '@/lib/lead-notifications'
import { z } from 'zod'

// ============================================================
// GET /api/leads - List leads with filters, search & pagination
// ============================================================

const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'score', 'name', 'email', 'classification', 'status'] as const

const getLeadsQuerySchema = z.object({
  status: z.string().optional(),
  classification: z.enum(['hot', 'warm', 'cold']).optional(),
  source: z.string().optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(ALLOWED_SORT_FIELDS).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(request: NextRequest) {
  try {
    // Auth
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse & validate query params
    const { searchParams } = new URL(request.url)
    const parsed = getLeadsQuerySchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      classification: searchParams.get('classification') ?? undefined,
      source: searchParams.get('source') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      order: searchParams.get('order') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      )
    }

    const { status, classification, source, search, sort, order, page, limit } = parsed.data
    const offset = (page - 1) * limit

    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Build query
    let query = supabase.from('leads').select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (classification) {
      query = query.eq('classification', classification)
    }
    if (source) {
      query = query.eq('source', source)
    }
    if (search) {
      const sanitized = search.replace(/%/g, '')
      query = query.or(
        `name.ilike.%${sanitized}%,email.ilike.%${sanitized}%,company.ilike.%${sanitized}%`
      )
    }

    query = query.order(sort, { ascending: order === 'asc' })
    query = query.range(offset, offset + limit - 1)

    const { data: leads, error, count } = await query

    if (error) {
      console.error('[LEADS] GET query error:', error)
      return NextResponse.json(
        { success: false, error: 'Error fetching leads' },
        { status: 500 }
      )
    }

    const total = count ?? 0

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[LEADS] GET unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

const leadSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email invalido'),
  company: z.string().optional(),
  phone: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  service_interest: z.string().optional(),
  privacy_accepted: z.boolean(),
  commercial_accepted: z.boolean().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // 1. Calculate lead score
    const { score, classification, breakdown } = calculateLeadScore({
      budget: validatedData.budget,
      service_interest: validatedData.service_interest,
      phone: validatedData.phone,
      company: validatedData.company,
      message: validatedData.message,
      source: validatedData.source,
    })

    // 2. Insert lead with score
    const lead = await insertLead({
      ...validatedData,
      score,
      classification,
      source: validatedData.source || 'web',
      metadata: {
        ...validatedData.metadata,
        scoring_breakdown: breakdown,
      },
    })

    // 3. Fire-and-forget: log event + notifications + nurturing
    // These run in the background and don't block the response
    const leadId = lead?.id

    if (leadId) {
      // Log form_submit event
      insertLeadEvent({
        lead_id: leadId,
        event_type: 'form_submit',
        metadata: { score, classification, source: validatedData.source || 'web' },
      }).catch(err => console.error('[LEADS] Event log failed:', err))

      // HOT lead: notify team immediately
      if (classification === 'hot') {
        notifyHotLead({
          id: leadId,
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          phone: validatedData.phone,
          budget: validatedData.budget,
          service_interest: validatedData.service_interest,
          message: validatedData.message,
          score,
          classification,
        }).catch(err => console.error('[LEADS] HOT notification failed:', err))

        insertLeadEvent({
          lead_id: leadId,
          event_type: 'hot_lead_notified',
          metadata: { score, channel: 'email' },
        }).catch(err => console.error('[LEADS] Event log failed:', err))
      }

      // WARM/COLD leads with commercial consent: schedule nurturing
      if (classification !== 'hot' && validatedData.commercial_accepted) {
        scheduleNurturingEmails(leadId)
          .catch(err => console.error('[LEADS] Nurturing schedule failed:', err))
      }
    }

    return NextResponse.json({
      success: true,
      lead: { id: leadId, score, classification },
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Error saving lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
