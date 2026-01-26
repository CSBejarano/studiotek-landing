# Proximas Tareas - Unificar PainPoints + Solution con Parallax Scroll

> **Fecha:** 2026-01-26
> **Plan:** ai_docs/plans/2026-01-26_unificar-painpoints-solution-parallax.md
> **Mode:** FAST
> **Estado:** READY FOR EXECUTION

## Resumen del Proyecto

Mejora visual de la landing page unificando las secciones PainPoints y Solution:
- Crear componente TextParallaxContent con framer-motion
- Crear componente ProblemSolutionParallax que unifica problema y solucion
- Eliminar SocialProof (redundante con Stats)
- Eliminar imports de PainPointsSection y SolutionSection
- Efecto parallax scroll con sticky images y text overlays

## Fases

| Phase | Status | Agent | Description |
|-------|--------|-------|-------------|
| 1 | PENDING | @frontend | Crear TextParallaxContent.tsx |
| 2 | PENDING | @frontend | Crear ProblemSolutionParallax.tsx |
| 3 | PENDING | @frontend | Actualizar app/page.tsx |
| 4 | PENDING | @testing | Testing Visual |
| 5 | PENDING | @gentleman | Code Review Final |

## Archivos

```yaml
CREATE:
  - components/sections/TextParallaxContent.tsx
  - components/sections/ProblemSolutionParallax.tsx

MODIFY:
  - app/page.tsx

REMOVE_FROM_PAGE (imports):
  - SocialProof
  - PainPointsSection
  - SolutionSection
```

## Para Ejecutar

Usa el comando `/ralph-execute` para ejecutar este plan.

```bash
/ralph-execute
```

Opciones disponibles:
- `--max-iterations=N` - Limitar numero de iteraciones
- `--resume` - Continuar desde ultima fase completada

## Quick Commands

```bash
# Ver plan completo
cat ai_docs/plans/2026-01-26_unificar-painpoints-solution-parallax.md

# Ver estado del workflow
cat ai_docs/state/WORKFLOW-STATUS.yaml

# Ejecutar el plan
/ralph-execute
```

## Checkpoints de Verificacion

| Fase | Checkpoint | Comando |
|------|------------|---------|
| 1 | TextParallaxContent compila | `npm run build` |
| 2 | ProblemSolutionParallax compila | `npm run build` |
| 3 | page.tsx actualizado | `npm run build` |
| 4 | Visual test pass | `npm run dev` |
| 5 | Review approved | `echo APPROVED` |

## Nuevo Orden de Secciones (post-ejecucion)

1. Hero
2. **ProblemSolutionParallax** (NUEVO - reemplaza SocialProof + PainPoints + Solution)
3. Benefits
4. Services
5. SectionDivider
6. HowItWorks
7. Stats
8. ContactForm

## Estimaciones

- **Tiempo total:** 10-20 minutos de ejecucion
- **Complejidad:** 5/10 (FAST mode)
- **Fases:** 5
- **Agentes:** @frontend (3 fases), @testing (1 fase), @gentleman (1 fase)
- **Archivos creados:** 2
- **Archivos modificados:** 1

## Dependencias Verificadas

- framer-motion: ^12.26.2 (instalado)
- lucide-react: ^0.562.0 (instalado)

## Riesgos Identificados

| Riesgo | Probabilidad | Mitigacion |
|--------|--------------|------------|
| framer-motion API changed | Baja | Verificar docs v12.x |
| Sticky positioning fails | Media | Probar overflow settings |
| Performance jank on mobile | Media | Test en dispositivos |
| Import paths incorrect | Baja | Usar @/ alias |

---
*Generado por /plan-task v5.0 - 2026-01-26*
