import { Resend } from 'resend'

interface EmailData {
  to: string
  name: string
}

export async function sendConfirmationEmail({ to, name }: EmailData) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[DEV] Resend not configured, would send email to:', to, name)
    return { id: 'dev-email-' + Date.now() }
  }

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from: 'StudioTek <noreply@studiotek.es>',
    to: [to],
    subject: '¡Gracias por contactarnos! - StudioTek',
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
            <h2>Hola ${name},</h2>
            <p>Hemos recibido tu solicitud y estamos emocionados de conocer mas sobre tu proyecto.</p>
            <p>Nuestro equipo revisara tu informacion y te contactaremos en <span class="highlight">menos de 24 horas</span>.</p>
            <p>Mientras tanto, si tienes alguna pregunta urgente puedes escribirnos directamente a <a href="mailto:info@studiotek.es" style="color: #3b82f6;">info@studiotek.es</a></p>
            <p style="margin-top: 30px;">¡Hasta pronto!<br><strong>El equipo de StudioTek</strong></p>
          </div>
          <div class="footer">
            <p>StudioTek - Soluciones de IA para tu negocio</p>
            <p style="font-size: 12px; color: #999;">Este email fue enviado porque completaste nuestro formulario de contacto.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })

  if (error) throw error
  return data
}
