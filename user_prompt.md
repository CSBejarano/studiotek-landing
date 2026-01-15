# Modal Navigation Carousel - COMPLETADO

> **Fecha:** 2026-01-15
> **Branch:** main
> **Plan:** .claude/plans/2026-01-15_modal-navigation-carousel.md
> **Modo:** WORKFLOW COMPLETE

## Estado: COMPLETE + HOTFIX APLICADO

| Phase | Status   | Agent     | Description                                            |
| ----- | -------- | --------- | ------------------------------------------------------ |
| 0     | COMPLETE | @infra    | Pre-flight check - verificar archivos y build          |
| 1     | COMPLETE | @frontend | Crear ServiceModal.tsx con navegacion                  |
| 2     | COMPLETE | @frontend | Simplificar CarouselCard.tsx (sin modal)               |
| 3     | COMPLETE | @frontend | Integrar modal en Services.tsx con estado centralizado |
| 4     | COMPLETE | @testing  | QA y build final                                       |
| 5     | COMPLETE | @frontend | Hotfix: botones dentro de containerRef                 |

## Completion Promise ACHIEVED

```
Modal navigation implementado - usuario puede navegar entre servicios sin cerrar modal
```

## Features Implementadas

### Navegacion en Modal
- Botones de flecha a los lados del modal (izquierda/derecha)
- Estilo consistente con botones del carousel
- Transicion suave entre servicios (AnimatePresence mode="wait")

### Keyboard Navigation
- ArrowLeft -> servicio anterior
- ArrowRight -> servicio siguiente
- Escape -> cerrar modal

### Accesibilidad
- aria-label en botones de navegacion
- role="dialog" en modal
- aria-modal="true"

### Hotfix Aplicado
- Botones de navegacion movidos dentro de containerRef
- Fix: useOutsideClick ya no cierra modal al clickear botones de navegacion

## Arquitectura Final

```
Services.tsx (estado centralizado: openIndex)
    |
    +-- CarouselCard (solo tarjeta, onClick -> handleOpen)
    |
    +-- Portal -> ServiceModal (navegacion: onNext, onPrev)
                  |
                  +-- Botones navegacion (DENTRO de containerRef)
```

## Archivos

```yaml
CREATED:
  - components/ui/ServiceModal.tsx

MODIFIED:
  - components/ui/CarouselCard.tsx (simplificado 68%)
  - components/sections/Services.tsx (estado + portal)
```

## Decisiones Implementadas

| ID    | Decision                                                              |
| ----- | --------------------------------------------------------------------- |
| SL044 | Estado centralizado en padre, modal unico via portal                  |
| SL045 | ArrowLeft/ArrowRight para navegar, Escape para cerrar                 |
| SL046 | AnimatePresence mode="wait" para transiciones suaves                  |
| SL047 | Botones de navegacion dentro de containerRef para evitar useOutsideClick |

## Quick Commands

```bash
# Development
npm run dev

# Test modal navigation
# 1. Ir a seccion Services
# 2. Click en cualquier card -> modal se abre
# 3. Click en flechas laterales -> navegar entre servicios
# 4. Teclas ←/→ -> navegacion por teclado
# 5. Escape o click fuera -> cerrar modal

# Build
npm run build
```

---

**Last Updated:** 2026-01-15T17:30:00Z
