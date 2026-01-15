# Prompt para Ejecutar Plan en Nueva Sesión

Copia y pega este prompt en una nueva sesión de Claude Code:

---

```
Ejecuta el plan en `.claude/plans/2026-01-13_phase3-hero-section.md` para crear la landing page de StudioTek.

## Instrucciones

1. Lee el plan completo en `.claude/plans/2026-01-13_phase3-hero-section.md`
2. Lee el PRD en `PRD.md` para contexto completo
3. Ejecuta las 4 fases en orden usando subagentes expertos:

### FASE 1: Project Setup
- Agente: @frontend
- Inicializar Next.js con Tailwind
- Instalar dependencias del PRD
- Configurar colores custom en tailwind.config.ts
- Checkpoint: `npm run dev` funciona

### FASE 2: Layout, Header, Footer
- Agente: @frontend
- Crear app/layout.tsx con Inter font y SEO
- Crear Header.tsx (sticky, logo + CTA)
- Crear Footer.tsx (logo, email, links, copyright)
- Checkpoint: `npm run build` sin errores

### FASE 3: Hero Section
- Agente: @frontend
- Crear Button.tsx (primary/secondary variants)
- Crear Hero.tsx con:
  - H1: "Automatiza tu negocio con Inteligencia Artificial"
  - Subheadline
  - 2 CTAs con smooth scroll
- Checkpoint: Hero visible y responsive

### FASE 4: Validation
- Agente: @testing
- Run `npm run build` y `npm run lint`
- Verificar responsive en 375px, 768px, 1280px
- Verificar smooth scroll funciona

## Modo de Ejecución

Para cada fase:
1. Lanza un subagente con Task tool usando el prompt del plan
2. Espera a que complete
3. Verifica el checkpoint
4. Si falla, corrige y reintenta
5. Continúa con la siguiente fase

## Completion

Cuando todas las fases pasen y el build sea exitoso, output:

**HERO COMPLETE**

## Archivos de Referencia

- Plan: `.claude/plans/2026-01-13_phase3-hero-section.md`
- PRD: `PRD.md`
- Estado: `user_prompt.md`

## Notas

- El proyecto está vacío, FASE 1 crea todo desde cero
- Backup PRD.md antes de create-next-app (puede sobrescribir)
- Colores: primary #0066FF, primary-hover #0052CC
- Font: Inter via next/font/google
```

---

## Versión Corta (One-liner)

```
Lee y ejecuta `.claude/plans/2026-01-13_phase3-hero-section.md` - son 4 fases (@frontend x3, @testing x1) para crear Hero section de landing page. PRD completo en PRD.md. Al terminar exitosamente, output "HERO COMPLETE".
```

---

## Versión con Ralph Loop (si tienes el plugin)

```
/plan-task "Ejecutar plan existente en .claude/plans/2026-01-13_phase3-hero-section.md" --loop --max-iterations=15 --completion-promise="HERO COMPLETE"
```
