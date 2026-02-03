import { Resend } from 'resend'

interface LeadInfo {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  budget?: string
  service_interest?: string
  message?: string
  score: number
  classification: string
}

const BUDGET_LABELS: Record<string, string> = {
  'mas-50000': 'Mas de 50.000 EUR',
  '25000-50000': '25.000 - 50.000 EUR',
  '10000-25000': '10.000 - 25.000 EUR',
  '3000-10000': '3.000 - 10.000 EUR',
  'menos-3000': 'Menos de 3.000 EUR',
  'no-seguro': 'No definido',
}

const SERVICE_LABELS: Record<string, string> = {
  'implementacion': 'Implementacion de IA',
  'consultoria': 'Consultoria Estrategica',
  'formacion': 'Formacion y Capacitacion',
  'ia-personalizada': 'Procesos de IA Personalizada',
}

export async function notifyHotLead(lead: LeadInfo): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('[DEV] Would notify HOT lead:', lead.name, lead.email)
    return
  }

  const resend = new Resend(apiKey)
  const budgetLabel = lead.budget ? BUDGET_LABELS[lead.budget] || lead.budget : 'No indicado'
  const serviceLabel = lead.service_interest ? SERVICE_LABELS[lead.service_interest] || lead.service_interest : 'No indicado'

  try {
    await resend.emails.send({
      from: 'StudioTek Leads <noreply@studiotek.es>',
      to: ['hola@studiotek.es'],
      subject: `HOT LEAD: ${lead.name}${lead.company ? ` - ${lead.company}` : ''} (Score: ${lead.score})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e5e7eb; background: #111827; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .header .score { font-size: 48px; font-weight: bold; color: #fbbf24; }
            .content { background: #1f2937; padding: 24px; border-radius: 0 0 12px 12px; }
            .field { margin-bottom: 16px; }
            .field-label { color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .field-value { color: #f3f4f6; font-size: 16px; font-weight: 500; }
            .message-box { background: #374151; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .cta { display: block; background: #dc2626; color: #fff; text-align: center; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 24px; }
            .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NUEVO HOT LEAD</h1>
              <div class="score">${lead.score}/100</div>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Nombre</div>
                <div class="field-value">${lead.name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${lead.email}" style="color: #60a5fa;">${lead.email}</a></div>
              </div>
              ${lead.company ? `
              <div class="field">
                <div class="field-label">Empresa</div>
                <div class="field-value">${lead.company}</div>
              </div>
              ` : ''}
              ${lead.phone ? `
              <div class="field">
                <div class="field-label">Telefono</div>
                <div class="field-value"><a href="tel:${lead.phone}" style="color: #60a5fa;">${lead.phone}</a></div>
              </div>
              ` : ''}
              <div class="field">
                <div class="field-label">Presupuesto</div>
                <div class="field-value">${budgetLabel}</div>
              </div>
              <div class="field">
                <div class="field-label">Servicio de interes</div>
                <div class="field-value">${serviceLabel}</div>
              </div>
              ${lead.message ? `
              <div class="field">
                <div class="field-label">Mensaje</div>
                <div class="message-box">${lead.message}</div>
              </div>
              ` : ''}
              <a href="mailto:${lead.email}?subject=Re: Tu consulta en StudioTek" class="cta">
                Contactar en menos de 4 horas
              </a>
            </div>
            <div class="footer">
              StudioTek Lead Funnel - Notificacion automatica
            </div>
          </div>
        </body>
        </html>
      `,
    })
    console.log(`[LEADS] HOT lead notification sent for ${lead.name} (${lead.email})`)
  } catch (error) {
    // Fire-and-forget: don't block the form submission
    console.error('[LEADS] Failed to send HOT lead notification:', error)
  }
}
