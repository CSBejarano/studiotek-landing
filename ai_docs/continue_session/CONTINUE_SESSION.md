# CONTINUE SESSION - StudioTek Landing

<compact_context>
Project: studiotek-landing
Stack: Next.js 16 + React 19 + Tailwind 4 + TypeScript
Status: IDLE - FUNNEL COMPLETE + BOOKING DEPLOYED
Updated: 2026-02-03
</compact_context>

## Quick Context

**Proyecto:** StudioTek Landing Page - Consultora de IA
**Stack:** Next.js 16 + React 19 + Tailwind 4 + TypeScript
**Estado:** IDLE - FUNNEL COMPLETE + BOOKING SYSTEM LIVE
**Production URL:** https://studiotek.es
**GitHub:** https://github.com/CSBejarano/studiotek-landing
**Local Dev:** http://localhost:3000

## Ultimo Workflow Completado

| Campo | Valor |
|-------|-------|
| ID | `2026-02-03_funnel-deploy-test` |
| Estado | COMPLETE |
| Resultado | Lead funnel deployed + Google Calendar booking + email confirmations |

## Cambios Recientes (2026-02-03)

### Lead Funnel (Phases 1-4) - Deployed & Tested
- **Lead scoring**: Budget(40pts), service_interest(15pts), phone(10pts), company(10pts), message(15pts)
- **Lead notifications**: HOT leads trigger instant email to admin
- **Nurturing emails**: 4-email AIDA sequence for WARM/COLD leads
- **Admin dashboard**: /admin/leads with stats, filters, lead detail
- **Booking system**: Google Calendar integration with FreeBusy API
- **Email confirmations**: Via Resend with "Add to Calendar" link

### Google Calendar Booking
- Service Account auth (studiotek-calendar@studiotek-booking.iam.gserviceaccount.com)
- 3-level fallback: Meet+attendees → no-Meet+attendees → basic event
- "Add to Calendar" link in email (action=TEMPLATE URL)
- Business hours: 10:00-18:00 Mon-Fri, 30-min slots, Europe/Madrid
- Meet links NOT available (requires Workspace Business with Domain-Wide Delegation)

### Environment Variables (Vercel)
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (pre-existing)
- RESEND_API_KEY, CRON_SECRET, ADMIN_API_KEY
- GOOGLE_SERVICE_ACCOUNT_KEY (base64), GOOGLE_CALENDAR_ID

## Features Implementados

### Landing Base (Phases 1-10)
- Hero Section con AI Chat + background neural network
- Services con expanding card (desktop) + carousel (mobile)
- Benefits con horizontal scroll surface (desktop) + vertical (mobile)
- PainPoints, Stats, HowItWorks, FAQ, Contact Form
- Footer + Cookie Banner RGPD

### Lead Funnel
- Smart contact form with conditional questions
- Lead scoring (HOT/WARM/COLD)
- Admin dashboard with analytics
- Email nurturing (4-email AIDA sequence)
- Cron job for daily email sending (9:00 UTC)

### Booking System
- BookCallButton + BookingModal (multi-step)
- Google Calendar FreeBusy for real-time availability
- Event creation with 3-level fallback
- Confirmation email with "Add to Calendar" link

### Voice Agent & AI Chat
- Web Speech API + Whisper fallback
- Function Calling, TTS, hybrid recognition

### Integraciones
| Servicio | Estado |
|----------|--------|
| OpenAI | ACTIVO (gpt-4o-mini, tts-1, whisper-1) |
| Supabase | ACTIVO (leads + events + RLS) |
| Gemini | ACTIVO (imagen-4.0, 16+ imgs) |
| Google Calendar | ACTIVO (Service Account, FreeBusy, events) |
| Resend | ACTIVO (booking confirmations, nurturing, notifications) |
| Vercel | ACTIVO (studiotek.es) |
| GitHub | ACTIVO |

## Git - Ultimos Commits

```text
ba9899a chore: restore fire-and-forget email after successful debug
30d4295 fix: use 'Add to Calendar' link instead of organizer htmlLink
24286c5 fix: add 3-level fallback for calendar event creation
1f989f5 feat: add calendar event link to booking confirmation email
afa7c61 fix: graceful fallback when Google Meet unavailable (non-Workspace)
9c594ab feat: implement complete lead funnel (Phases 1-4)
a8a4355 feat: add hero background image + optimize mobile layout across sections
```

## Pendientes Opcionales

- Google Workspace Business (dominio studiotek.es) para Meet links automaticos
- Test manual del cron job nurturing
- Limpiar leads de prueba de Supabase
- Google Analytics

## Quick Start

```bash
npm run dev           # Desarrollo
npm run build         # Build produccion
vercel --prod         # Deploy manual

# Test cron job
curl -H "Authorization: Bearer $CRON_SECRET" https://studiotek.es/api/cron/nurture

# Test booking slots
curl "https://studiotek.es/api/booking/slots?date=2026-02-04"
```

---

**Funnel Complete + Booking Live - Ready for New Features**

**Ultima actualizacion:** 2026-02-03
