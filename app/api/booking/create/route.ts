import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getLeadById, updateLead, insertLeadEvent } from '@/lib/supabase'
import { getAvailableSlots, createMeetingEvent } from '@/lib/google-calendar'
import { Resend } from 'resend'

// ============================================================
// POST /api/booking/create
// Creates a Google Calendar event + Meet link for a lead
// ============================================================

const bookingSchema = z.object({
  lead_id: z.string().uuid('Invalid lead_id format'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format'),
  notes: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      )
    }

    const { lead_id, date, time, notes } = parsed.data

    // 1. Verify lead exists
    const lead = await getLeadById(lead_id)
    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    // 2. Validate date is not in the past and within 14 days
    const nowMadrid = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })
    )
    const todayStr = [
      nowMadrid.getFullYear(),
      String(nowMadrid.getMonth() + 1).padStart(2, '0'),
      String(nowMadrid.getDate()).padStart(2, '0'),
    ].join('-')

    if (date < todayStr) {
      return NextResponse.json(
        { success: false, error: 'Date must be today or in the future' },
        { status: 400 }
      )
    }

    const todayDate = new Date(`${todayStr}T00:00:00`)
    const requestedDate = new Date(`${date}T00:00:00`)
    const diffDays = Math.round(
      (requestedDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays > 14) {
      return NextResponse.json(
        { success: false, error: 'Date must be within the next 14 days' },
        { status: 400 }
      )
    }

    // 3. Verify slot is available
    const availableSlots = await getAvailableSlots(date)
    if (!availableSlots.includes(time)) {
      return NextResponse.json(
        { success: false, error: 'Selected time slot is not available' },
        { status: 409 }
      )
    }

    // 4. Create Google Calendar event with Meet link
    const booking = await createMeetingEvent({
      leadName: lead.name as string,
      leadEmail: lead.email as string,
      company: (lead.company as string) ?? undefined,
      date,
      time,
      notes,
    })

    // 5. Update lead status
    updateLead(lead_id, {
      status: 'qualified',
      last_contacted_at: new Date().toISOString(),
    }).catch((err) =>
      console.error('[BOOKING] Failed to update lead status:', err)
    )

    // 6. Log event
    insertLeadEvent({
      lead_id,
      event_type: 'meeting_scheduled',
      metadata: {
        eventId: booking.eventId,
        meetLink: booking.meetLink,
        calendarLink: booking.calendarLink,
        date,
        time,
      },
    }).catch((err) =>
      console.error('[BOOKING] Failed to log meeting event:', err)
    )

    // 7. Send confirmation email (fire-and-forget)
    sendBookingConfirmationEmail({
      to: lead.email as string,
      name: lead.name as string,
      date,
      time,
      meetLink: booking.meetLink,
      calendarLink: booking.calendarLink,
    }).catch((err) =>
      console.error('[BOOKING] Failed to send confirmation email:', err)
    )

    return NextResponse.json(
      {
        success: true,
        booking: {
          eventId: booking.eventId,
          meetLink: booking.meetLink,
          calendarLink: booking.calendarLink,
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error('[BOOKING] Create error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// ============================================================
// Confirmation Email (fire-and-forget)
// ============================================================

interface BookingEmailData {
  to: string
  name: string
  date: string
  time: string
  meetLink: string
  calendarLink: string
}

async function sendBookingConfirmationEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[DEV] Resend not configured, would send booking email to:', data.to)
    return
  }

  const resend = new Resend(apiKey)

  // Format date for display (e.g., "lunes, 3 de febrero de 2026")
  const dateObj = new Date(`${data.date}T12:00:00`)
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Madrid',
  })

  const { error } = await resend.emails.send({
    from: 'StudioTek <noreply@studiotek.es>',
    to: [data.to],
    subject: `Tu reunion esta confirmada - ${formattedDate} a las ${data.time}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6; }
          .content { background: #f9fafb; padding: 30px; border-radius: 12px; margin: 20px 0; }
          .meeting-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .meet-link { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { color: #3b82f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #3b82f6; margin: 0;">StudioTek</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Transformamos tu negocio con IA</p>
          </div>
          <div class="content">
            <h2>Hola ${data.name},</h2>
            <p>Tu reunion de descubrimiento esta confirmada.</p>
            <div class="meeting-box">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">Discovery Call</p>
              <p style="margin: 8px 0; color: #666;">
                <span class="highlight">${formattedDate}</span><br>
                a las <span class="highlight">${data.time}h</span> (hora de Madrid)
              </p>
              <p style="margin: 8px 0; color: #666;">Duracion: 30 minutos</p>
              ${data.meetLink
                ? `<a href="${data.meetLink}" class="meet-link">Unirse a Google Meet</a>`
                : data.calendarLink
                  ? `<a href="${data.calendarLink}" class="meet-link" style="background: #059669;">Añadir a mi Google Calendar</a>`
                  : ''}
            </div>
            <p>En esta reunion hablaremos sobre como la IA puede transformar tu negocio. No necesitas preparar nada especial, solo tener claros tus principales retos.</p>
            <p>Si necesitas reprogramar, escribenos a <a href="mailto:info@studiotek.es" style="color: #3b82f6;">info@studiotek.es</a></p>
            <p style="margin-top: 30px;">¡Nos vemos pronto!<br><strong>El equipo de StudioTek</strong></p>
          </div>
          <div class="footer">
            <p>StudioTek - Soluciones de IA para tu negocio</p>
            <p style="font-size: 12px; color: #999;">Este email fue enviado porque agendaste una reunion con nosotros.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })

  if (error) {
    console.error('[BOOKING] Email send error:', error)
    throw error
  }
}
