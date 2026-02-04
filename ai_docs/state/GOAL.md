# GOAL - Estado Actual del Proyecto

## Status: DEPLOY PENDIENTE - Unified Form + Availability Config

La landing page de StudioTek tiene el formulario unificado (contacto + booking inline) listo. Pendiente deploy a Vercel (CLI colgado, reintentar).

**Production URL:** https://studiotek.es
**GitHub:** https://github.com/CSBejarano/studiotek-landing
**Local Dev:** http://localhost:3000

## Ultimo Workflow Completado

| Campo | Valor |
|-------|-------|
| ID | `2026-02-03_e2e-playwright-booking-form` |
| Resultado | 6/6 E2E tests passed + 5/5 manual tests passed |

## Cambios Pendientes de Deploy

| Cambio | Commit |
|--------|--------|
| Unificar ContactForm + Booking en 1 flujo | `2a59719` |
| Booking solo miercoles (config Pau meeting) | `c70c2b6` |
| Email: "Consulta Estrategica" + boton azul | `2a59719` |

## Features Completos

| Phase | Status |
|-------|--------|
| 1-10. Landing Base | COMPLETE |
| Apple Cards / Expanding Card | COMPLETE |
| Cookie Banner + RGPD | COMPLETE |
| Supabase Integration | COMPLETE |
| Images Generation | COMPLETE (16+ imgs) |
| Voice Agent | COMPLETE |
| AI Chat Enhanced | COMPLETE |
| Mobile Fixes | COMPLETE |
| Benefits Surface Scroll | COMPLETE |
| Mobile Layout Optimization | COMPLETE |
| Hero Background Image | COMPLETE |
| Lead Funnel (Scoring + Nurturing) | COMPLETE |
| Admin Dashboard | COMPLETE |
| Google Calendar Booking | COMPLETE |
| Email Confirmations | COMPLETE |
| Unified Form + Booking Inline | COMPLETE (pending deploy) |
| Booking Availability Config | COMPLETE (pending deploy) |

## Git - Ultimos Commits

```text
ed91b38 chore: update testing agent metadata
c70c2b6 feat: add booking availability config (Wed only, per Pau meeting)
2a59719 feat: unify contact form + booking into single flow, rebrand email
3978acb docs: update session state after funnel deploy + booking system
ba9899a chore: restore fire-and-forget email after successful debug
30d4295 fix: use 'Add to Calendar' link instead of organizer htmlLink
```

## Integraciones Activas

| Servicio | Estado | Detalles |
|----------|--------|----------|
| OpenAI | ACTIVO | gpt-4o-mini, tts-1, whisper-1 |
| Supabase | ACTIVO | leads, lead_events, scheduled_emails |
| Google Calendar | ACTIVO | FreeBusy + events (Wed only auto-booking) |
| Resend | ACTIVO | Booking confirmations, nurturing, notifications |
| Gemini | ACTIVO | Generacion de imagenes (16+) |
| Vercel | ACTIVO | studiotek.es (8 env vars) |
| GitHub | ACTIVO | Repositorio de codigo |

## Quick Start

```bash
npm run dev           # Desarrollo
npm run build         # Build produccion
vercel --prod         # Deploy manual (reintentar si CLI se cuelga)

# Test APIs
curl "https://studiotek.es/api/booking/slots?date=2026-02-05"  # Miercoles
curl "https://studiotek.es/api/booking/slots?date=2026-02-04"  # Martes -> []
```

## Pendientes

- [ ] Deploy a Vercel (CLI se colgo, reintentar)
- [ ] Test email en produccion con nixaitech@gmail.com
- [ ] Limpiar leads de prueba de Supabase
- [ ] Google Workspace Business para Meet links
- [ ] Google Analytics

---

**Unified Form + Availability Config - Pending Deploy**

**Ultima actualizacion:** 2026-02-03
