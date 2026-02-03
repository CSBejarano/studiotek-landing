import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createSupabaseServerClient, insertLeadEvent, getLeadById } from '@/lib/supabase'
import {
  getCaseStudyEmailHtml,
  getRoiProposalEmailHtml,
  getCtaMeetingEmailHtml,
  getEmailSubject,
} from '@/lib/email-templates'

interface EmailSequence {
  id: string
  lead_id: string
  step: number
  template_id: string
  scheduled_at: string
  sent_at: string | null
  opened: boolean
  clicked: boolean
  status: string
  created_at: string
}

interface Lead {
  id: string
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
}

function getEmailHtml(
  templateId: string,
  lead: Lead
): string | null {
  switch (templateId) {
    case 'case_study':
      return getCaseStudyEmailHtml(
        lead.name,
        lead.email,
        lead.service_interest
      )
    case 'roi_proposal':
      return getRoiProposalEmailHtml(
        lead.name,
        lead.email,
        lead.budget,
        lead.company
      )
    case 'cta_meeting':
      return getCtaMeetingEmailHtml(lead.name, lead.email)
    default:
      return null
  }
}

export async function GET(request: NextRequest) {
  // 1. Verify authorization with CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503 }
    )
  }

  const resend = new Resend(resendApiKey)

  // 2. Query pending emails that are due
  const { data: pendingEmails, error: queryError } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(50)

  if (queryError) {
    console.error('[CRON/NURTURE] Failed to query pending emails:', queryError)
    return NextResponse.json(
      { error: 'Failed to query pending emails' },
      { status: 500 }
    )
  }

  const sequences = (pendingEmails ?? []) as EmailSequence[]

  if (sequences.length === 0) {
    return NextResponse.json({
      success: true,
      processed: 0,
      sent: 0,
      failed: 0,
    })
  }

  // 3. Process each pending email
  let sent = 0
  let failed = 0
  const errors: Array<{ sequenceId: string; error: string }> = []

  for (const sequence of sequences) {
    try {
      // 3a. Get lead data
      const lead = (await getLeadById(sequence.lead_id)) as Lead | null
      if (!lead) {
        await supabase
          .from('email_sequences')
          .update({ status: 'failed' })
          .eq('id', sequence.id)
        failed++
        errors.push({
          sequenceId: sequence.id,
          error: `Lead ${sequence.lead_id} not found`,
        })
        continue
      }

      // 3b. Double-check RGPD: commercial_accepted must be true
      if (lead.commercial_accepted !== true) {
        await supabase
          .from('email_sequences')
          .update({ status: 'cancelled' })
          .eq('id', sequence.id)
        failed++
        errors.push({
          sequenceId: sequence.id,
          error: `Lead ${lead.email} has not accepted commercial communications`,
        })
        continue
      }

      // 3c. Select template based on template_id
      const html = getEmailHtml(sequence.template_id, lead)
      if (!html) {
        await supabase
          .from('email_sequences')
          .update({ status: 'failed' })
          .eq('id', sequence.id)
        failed++
        errors.push({
          sequenceId: sequence.id,
          error: `Unknown template: ${sequence.template_id}`,
        })
        continue
      }

      // 3d. Replace tracking placeholders
      const trackingPixelUrl = `https://studiotek.es/api/track/open?sid=${sequence.id}`
      const finalHtml = html
        .replace('{{TRACKING_PIXEL_URL}}', trackingPixelUrl)
        .replace(
          /\{\{TRACK_URL:(.*?)\}\}/g,
          (_, originalUrl: string) =>
            `https://studiotek.es/api/track/click?sid=${sequence.id}&url=${encodeURIComponent(originalUrl)}`
        )

      // 3e. Get subject and send via Resend
      const templateType = sequence.template_id as
        | 'case_study'
        | 'roi_proposal'
        | 'cta_meeting'
      const subject = getEmailSubject(templateType, lead.name)

      const { error: sendError } = await resend.emails.send({
        from: 'StudioTek <noreply@studiotek.es>',
        to: [lead.email],
        subject,
        html: finalHtml,
      })

      if (sendError) {
        throw new Error(sendError.message)
      }

      // 3f. Mark as sent
      await supabase
        .from('email_sequences')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', sequence.id)

      // 3g. Log lead event
      await insertLeadEvent({
        lead_id: sequence.lead_id,
        event_type: 'email_sent',
        metadata: {
          step: sequence.step,
          template_id: sequence.template_id,
          sequence_id: sequence.id,
        },
      })

      sent++
    } catch (error) {
      // 4. Individual failure: mark as failed, log, continue
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      console.error(
        `[CRON/NURTURE] Failed to send email for sequence ${sequence.id}:`,
        errorMessage
      )

      await supabase
        .from('email_sequences')
        .update({ status: 'failed' })
        .eq('id', sequence.id)

      failed++
      errors.push({ sequenceId: sequence.id, error: errorMessage })
    }
  }

  // 5. Return summary
  console.log(
    `[CRON/NURTURE] Processed: ${sequences.length}, Sent: ${sent}, Failed: ${failed}`
  )

  return NextResponse.json({
    success: true,
    processed: sequences.length,
    sent,
    failed,
    ...(errors.length > 0 && { errors }),
  })
}
