/**
 * Email Templates para StudioTek - Nurturing Sequence
 *
 * Secuencia de 4 emails:
 * 1. Welcome Email (mejorado) - Confirmacion inmediata
 * 2. Case Study Email (+24h) - Caso de exito relevante
 * 3. ROI Proposal Email (+72h) - Propuesta de valor cuantificada
 * 4. CTA Meeting Email (+7 dias) - Llamada a la accion final
 *
 * Estilo: Dark theme, inline styles, RGPD compliant
 * Framework: AIDA (Attention, Interest, Desire, Action)
 */

// Valores de presupuesto para calculos ROI
const BUDGET_VALUES: Record<string, number> = {
  'mas-50000': 60000,
  '25000-50000': 37500,
  '10000-25000': 17500,
  '3000-10000': 6500,
  'menos-3000': 2000,
  'no-seguro': 10000,
}

// Casos de exito por tipo de servicio
const CASE_STUDIES: Record<string, { title: string; company: string; metrics: string[]; testimonial: string }> = {
  'implementacion': {
    title: 'Como una clinica dental ahorro 18 horas semanales automatizando reservas',
    company: 'Vitaeon Clinic',
    metrics: [
      'Reduccion del 70% en llamadas de confirmacion',
      '18 horas semanales ahorradas en gestion de agenda',
      'Tasa de no-show reducida del 25% al 8%'
    ],
    testimonial: 'Antes perdiamos horas en llamadas de confirmacion. Ahora el sistema automatico gestiona todo y nuestro equipo se enfoca en los pacientes.'
  },
  'consultoria': {
    title: 'Transformacion digital: De procesos manuales a automatizacion en 3 meses',
    company: 'Empresa del sector servicios',
    metrics: [
      '60% reduccion en tareas administrativas',
      '15 horas semanales recuperadas por empleado',
      'ROI positivo en 4 meses'
    ],
    testimonial: 'La consultoria nos ayudo a identificar procesos clave que ni sabiamos que podian automatizarse. El impacto fue inmediato.'
  },
  'formacion': {
    title: 'Capacitacion en IA: De resistencia al cambio a adopcion total',
    company: 'Equipo de 12 personas',
    metrics: [
      '100% del equipo usando herramientas IA en 2 semanas',
      '8 horas mensuales ahorradas por persona',
      'Incremento del 40% en productividad reportada'
    ],
    testimonial: 'La formacion fue practica y aplicable. Ahora el equipo usa IA en su dia a dia sin resistencia.'
  },
  'default': {
    title: 'Como empresas como la tuya automatizan y crecen con IA',
    company: 'Cliente StudioTek',
    metrics: [
      '60% reduccion en tareas manuales repetitivas',
      '15 horas semanales ahorradas',
      'ROI positivo en menos de 6 meses'
    ],
    testimonial: 'Automatizar fue la mejor decision. Recuperamos tiempo para lo importante: hacer crecer el negocio.'
  }
}

/**
 * Email 1: Welcome Email (version mejorada con branding dark theme)
 */
export function getWelcomeEmailHtml(name: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e5e7eb; background: #111827;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header con gradiente azul -->
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">StudioTek</h1>
      <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 16px;">Transformamos tu negocio con IA</p>
    </div>

    <!-- Content -->
    <div style="background: #1f2937; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #f3f4f6; margin: 0 0 16px 0; font-size: 24px;">Hola ${name},</h2>

      <p style="color: #e5e7eb; margin: 0 0 16px 0; font-size: 16px;">
        Gracias por contactarnos. Hemos recibido tu solicitud y estamos emocionados de conocer mas sobre tu proyecto.
      </p>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        Nuestro equipo revisara tu informacion y te contactaremos en <strong style="color: #3b82f6;">menos de 24 horas</strong>.
      </p>

      <!-- Caja destacada -->
      <div style="background: #374151; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 24px;">
        <p style="color: #d1d5db; margin: 0; font-size: 15px;">
          Mientras tanto, si tienes alguna pregunta urgente puedes escribirnos directamente a
          <a href="mailto:info@studiotek.es" style="color: #60a5fa; text-decoration: none;">info@studiotek.es</a>
        </p>
      </div>

      <p style="color: #e5e7eb; margin: 24px 0 0 0; font-size: 16px;">
        Hasta pronto,<br>
        <strong style="color: #f3f4f6;">El equipo de StudioTek</strong>
      </p>
    </div>

    <!-- Footer RGPD -->
    <div style="text-align: center; padding: 24px 16px; color: #6b7280; font-size: 13px;">
      <p style="margin: 0 0 8px 0;">StudioTek - Soluciones de IA para tu negocio</p>
      <p style="margin: 0 0 12px 0; font-size: 12px;">
        Recibes este email porque solicitaste informacion en studiotek.es
      </p>
      <p style="margin: 0; font-size: 12px;">
        <a href="https://studiotek.es/#contact?unsubscribe=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: none;">Cancelar suscripcion</a> |
        <a href="https://studiotek.es/politica-privacidad" style="color: #9ca3af; text-decoration: none;">Politica de privacidad</a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel -->
  <img src="{{TRACKING_PIXEL_URL}}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
  `.trim()
}

/**
 * Email 2: Case Study Email (+24h)
 * Framework: PAS (Problem, Agitate, Solution)
 */
export function getCaseStudyEmailHtml(
  name: string,
  email: string,
  serviceInterest?: string
): string {
  const caseStudy = CASE_STUDIES[serviceInterest || 'default'] || CASE_STUDIES['default']

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e5e7eb; background: #111827;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">StudioTek</h1>
    </div>

    <!-- Content -->
    <div style="background: #1f2937; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #f3f4f6; margin: 0 0 16px 0; font-size: 22px;">Hola ${name},</h2>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        Te escribo porque empresas similares a la tuya estan logrando resultados increibles automatizando procesos con IA.
      </p>

      <!-- Caso de exito -->
      <div style="background: #111827; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #374151;">
        <h3 style="color: #3b82f6; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
          ${caseStudy.title}
        </h3>

        <p style="color: #9ca3af; margin: 0 0 16px 0; font-size: 14px;">
          ${caseStudy.company}
        </p>

        <div style="margin-bottom: 20px;">
          ${caseStudy.metrics.map(metric => `
            <div style="display: flex; align-items: start; margin-bottom: 12px;">
              <span style="color: #10b981; font-size: 18px; margin-right: 8px;">✓</span>
              <span style="color: #d1d5db; font-size: 15px;">${metric}</span>
            </div>
          `).join('')}
        </div>

        <div style="background: #1f2937; padding: 16px; border-radius: 6px; border-left: 3px solid #3b82f6;">
          <p style="color: #d1d5db; margin: 0; font-size: 15px; font-style: italic;">
            "${caseStudy.testimonial}"
          </p>
        </div>
      </div>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        <strong style="color: #f3f4f6;">Imagina recuperar 15 horas semanales</strong> que ahora dedicas a tareas manuales.
        Tiempo que podrias invertir en hacer crecer tu negocio.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{TRACK_URL:https://studiotek.es/#contact}}" style="display: inline-block; background: #3b82f6; color: #fff; text-align: center; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Descubre como aplicarlo a tu negocio
        </a>
      </div>

      <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 14px; text-align: center;">
        Sin compromiso. Hablemos de tu caso especifico.
      </p>
    </div>

    <!-- Footer RGPD -->
    <div style="text-align: center; padding: 24px 16px; color: #6b7280; font-size: 13px;">
      <p style="margin: 0 0 8px 0;">StudioTek - Soluciones de IA para tu negocio</p>
      <p style="margin: 0 0 12px 0; font-size: 12px;">
        Recibes este email porque solicitaste informacion en studiotek.es
      </p>
      <p style="margin: 0; font-size: 12px;">
        <a href="https://studiotek.es/#contact?unsubscribe=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: none;">Cancelar suscripcion</a> |
        <a href="https://studiotek.es/politica-privacidad" style="color: #9ca3af; text-decoration: none;">Politica de privacidad</a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel -->
  <img src="{{TRACKING_PIXEL_URL}}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
  `.trim()
}

/**
 * Email 3: ROI Proposal Email (+72h)
 * Framework: AIDA (Attention, Interest, Desire, Action)
 */
export function getRoiProposalEmailHtml(
  name: string,
  email: string,
  budget?: string,
  company?: string
): string {
  const budgetValue = budget ? BUDGET_VALUES[budget] || 10000 : 10000
  const estimatedSavings = Math.round(budgetValue * 2.5) // ROI conservador 2.5x
  const monthlySavings = Math.round(estimatedSavings / 12)
  const hourlySavings = Math.round(15) // Horas semanales promedio

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e5e7eb; background: #111827;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">StudioTek</h1>
    </div>

    <!-- Content -->
    <div style="background: #1f2937; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #f3f4f6; margin: 0 0 16px 0; font-size: 22px;">Hola ${name},</h2>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        He preparado una estimacion de <strong style="color: #3b82f6;">ROI personalizada</strong> ${company ? `para ${company}` : 'para tu negocio'}
        basada en resultados reales de nuestros clientes.
      </p>

      <!-- ROI Table -->
      <div style="background: #111827; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #374151;">
        <h3 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
          Tu estimacion de ahorro anual
        </h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #374151;">
            <td style="padding: 16px 12px; color: #9ca3af; font-size: 14px;">Inversion estimada</td>
            <td style="padding: 16px 12px; color: #f3f4f6; font-size: 16px; font-weight: 600; text-align: right;">
              ${budgetValue.toLocaleString('es-ES')} EUR
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #374151;">
            <td style="padding: 16px 12px; color: #9ca3af; font-size: 14px;">Ahorro anual estimado</td>
            <td style="padding: 16px 12px; color: #10b981; font-size: 18px; font-weight: 700; text-align: right;">
              ${estimatedSavings.toLocaleString('es-ES')} EUR
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #374151;">
            <td style="padding: 16px 12px; color: #9ca3af; font-size: 14px;">Ahorro mensual</td>
            <td style="padding: 16px 12px; color: #d1d5db; font-size: 16px; font-weight: 600; text-align: right;">
              ${monthlySavings.toLocaleString('es-ES')} EUR/mes
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 12px; color: #9ca3af; font-size: 14px;">Horas recuperadas/semana</td>
            <td style="padding: 16px 12px; color: #d1d5db; font-size: 16px; font-weight: 600; text-align: right;">
              ${hourlySavings}h/semana
            </td>
          </tr>
        </table>

        <div style="background: #1f2937; padding: 16px; border-radius: 6px; margin-top: 20px; border-left: 3px solid #10b981;">
          <p style="color: #d1d5db; margin: 0; font-size: 14px;">
            <strong style="color: #10b981;">ROI positivo en 4-6 meses</strong> de media segun datos de clientes similares
          </p>
        </div>
      </div>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        Estos calculos son conservadores y se basan en resultados reales.
        <strong style="color: #f3f4f6;">En una llamada de 15 minutos</strong> puedo mostrarte exactamente como aplicaria esto a tu caso.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{TRACK_URL:https://studiotek.es/#contact}}" style="display: inline-block; background: #3b82f6; color: #fff; text-align: center; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Agenda tu llamada gratuita de 15 min
        </a>
      </div>

      <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 14px; text-align: center;">
        Sin compromiso. Hablamos, evaluamos y decides.
      </p>
    </div>

    <!-- Footer RGPD -->
    <div style="text-align: center; padding: 24px 16px; color: #6b7280; font-size: 13px;">
      <p style="margin: 0 0 8px 0;">StudioTek - Soluciones de IA para tu negocio</p>
      <p style="margin: 0 0 12px 0; font-size: 12px;">
        Recibes este email porque solicitaste informacion en studiotek.es
      </p>
      <p style="margin: 0; font-size: 12px;">
        <a href="https://studiotek.es/#contact?unsubscribe=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: none;">Cancelar suscripcion</a> |
        <a href="https://studiotek.es/politica-privacidad" style="color: #9ca3af; text-decoration: none;">Politica de privacidad</a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel -->
  <img src="{{TRACKING_PIXEL_URL}}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
  `.trim()
}

/**
 * Email 4: CTA Meeting Email (+7 dias)
 * Framework: FOMO + Valor (urgencia suave profesional)
 */
export function getCtaMeetingEmailHtml(name: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e5e7eb; background: #111827;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">StudioTek</h1>
    </div>

    <!-- Content -->
    <div style="background: #1f2937; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #f3f4f6; margin: 0 0 16px 0; font-size: 22px;">Hola ${name},</h2>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        Te he enviado varios emails en los ultimos dias mostrando como empresas similares a la tuya estan
        <strong style="color: #3b82f6;">automatizando procesos y recuperando mas de 15 horas semanales</strong>.
      </p>

      <p style="color: #e5e7eb; margin: 0 0 24px 0; font-size: 16px;">
        Esta es la <strong style="color: #f3f4f6;">ultima oportunidad esta semana</strong> para reservar una llamada estrategica gratuita.
      </p>

      <!-- Beneficios destacados -->
      <div style="background: #111827; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #374151;">
        <h3 style="color: #3b82f6; margin: 0 0 16px 0; font-size: 18px;">
          En 15 minutos te ayudo a:
        </h3>

        <div style="margin-bottom: 12px;">
          <div style="display: flex; align-items: start; margin-bottom: 12px;">
            <span style="color: #10b981; font-size: 18px; margin-right: 8px;">✓</span>
            <span style="color: #d1d5db; font-size: 15px;">Identificar 3-5 procesos automatizables en tu negocio</span>
          </div>
          <div style="display: flex; align-items: start; margin-bottom: 12px;">
            <span style="color: #10b981; font-size: 18px; margin-right: 8px;">✓</span>
            <span style="color: #d1d5db; font-size: 15px;">Estimar el ROI especifico para tu caso</span>
          </div>
          <div style="display: flex; align-items: start; margin-bottom: 12px;">
            <span style="color: #10b981; font-size: 18px; margin-right: 8px;">✓</span>
            <span style="color: #d1d5db; font-size: 15px;">Mostrar casos de exito en tu industria</span>
          </div>
          <div style="display: flex; align-items: start;">
            <span style="color: #10b981; font-size: 18px; margin-right: 8px;">✓</span>
            <span style="color: #d1d5db; font-size: 15px;">Responder todas tus dudas sobre IA y automatizacion</span>
          </div>
        </div>
      </div>

      <div style="background: #374151; padding: 20px; border-radius: 8px; border-left: 4px solid #fbbf24; margin-bottom: 24px;">
        <p style="color: #fbbf24; margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase;">
          Oferta limitada
        </p>
        <p style="color: #d1d5db; margin: 0; font-size: 15px;">
          Solo tengo <strong>3 huecos disponibles</strong> esta semana para llamadas estrategicas gratuitas.
          Reserva el tuyo antes de que se agoten.
        </p>
      </div>

      <!-- CTA Button destacado -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="{{TRACK_URL:https://studiotek.es/#contact}}" style="display: inline-block; background: #3b82f6; color: #fff; text-align: center; padding: 18px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          Reservar mi llamada ahora
        </a>
      </div>

      <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 14px; text-align: center;">
        15 minutos pueden cambiar la forma en que trabajas. Sin compromiso.
      </p>

      <p style="color: #6b7280; margin: 32px 0 0 0; font-size: 14px; text-align: center; font-style: italic;">
        Si prefieres no recibir mas emails, puedes cancelar la suscripcion en el footer.
      </p>
    </div>

    <!-- Footer RGPD -->
    <div style="text-align: center; padding: 24px 16px; color: #6b7280; font-size: 13px;">
      <p style="margin: 0 0 8px 0;">StudioTek - Soluciones de IA para tu negocio</p>
      <p style="margin: 0 0 12px 0; font-size: 12px;">
        Recibes este email porque solicitaste informacion en studiotek.es
      </p>
      <p style="margin: 0; font-size: 12px;">
        <a href="https://studiotek.es/#contact?unsubscribe=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: none;">Cancelar suscripcion</a> |
        <a href="https://studiotek.es/politica-privacidad" style="color: #9ca3af; text-decoration: none;">Politica de privacidad</a>
      </p>
    </div>
  </div>

  <!-- Tracking pixel -->
  <img src="{{TRACKING_PIXEL_URL}}" width="1" height="1" alt="" style="display:none;" />
</body>
</html>
  `.trim()
}

/**
 * Subjects para cada tipo de email
 */
export const EMAIL_SUBJECTS: Record<string, string> = {
  welcome: 'Gracias por contactar con StudioTek - Te respondemos en 24h',
  case_study: 'Como empresas como la tuya ahorran 15h/semana con IA',
  roi_proposal: '{name}, tu estimacion de ahorro con automatizacion',
  cta_meeting: '{name}, reserva tu llamada estrategica gratuita',
}

/**
 * Helper: Reemplazar {name} en subjects
 */
export function getEmailSubject(type: keyof typeof EMAIL_SUBJECTS, name: string): string {
  return EMAIL_SUBJECTS[type].replace('{name}', name)
}
