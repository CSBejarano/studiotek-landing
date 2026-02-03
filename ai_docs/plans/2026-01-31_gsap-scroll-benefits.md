# Plan: Migrar Scroll Horizontal a GSAP ScrollTrigger

## Contexto

La sección Benefits tiene un scroll horizontal implementado con Framer Motion (sticky + transform) que no funciona correctamente. Los paneles se apilan en lugar de moverse horizontalmente al hacer scroll.

**Problemas identificados:**
1. Desfase entre ancho del track (400vw) y rango del transform (-300vw)
2. `100vw` incluye scrollbar causando acumulación de desfase
3. `overflow-hidden` en el section puede interferir con sticky
4. Approach frágil que se rompe con resize/zoom

**Solución:** Migrar a GSAP ScrollTrigger para pinning robusto y control preciso del scroll horizontal.

---

## Arquitectura de la Solución

### Nuevo Approach

```
Benefits Section (pin container)
├── ScrollTrigger pin: true (fija la sección durante el scroll)
├── Track horizontal (flex container)
│   ├── Panel 1 (100vw)
│   ├── Panel 2 (100vw)
│   ├── Panel 3 (100vw)
│   └── CTA Panel (100vw)
└── Animación: x: 0 → -300vw (scrub: 1)
```

### Cambios Principales

1. **Nueva dependencia:** `gsap` + `@gsap/react`
2. **Hook refactorizado:** `useHorizontalScroll.ts` usa ScrollTrigger
3. **Componente simplificado:** `Benefits/index.tsx` sin sticky manual
4. **Paneles ajustados:** Ancho fijo basado en window.innerWidth

---

## Fases

### Fase 1: Instalar Dependencias
- **Agente:** @frontend
- **Archivos:** `package.json`, `package-lock.json`
- **Checkpoint:** `npm list gsap @gsap/react`
- **Prompt:** 
  Instala GSAP y @gsap/react en el proyecto:
  - `npm install gsap @gsap/react`
  - Verifica que se agreguen a package.json
  - No modifiques otros archivos

### Fase 2: Refactorizar Hook useHorizontalScroll
- **Agente:** @frontend
- **Archivos:** `components/sections/Benefits/hooks/useHorizontalScroll.ts`
- **Checkpoint:** `grep -n "ScrollTrigger" components/sections/Benefits/hooks/useHorizontalScroll.ts`
- **Prompt:**
  Refactoriza el hook useHorizontalScroll para usar GSAP ScrollTrigger:
  
  1. Importa gsap y ScrollTrigger
  2. Registra el plugin: gsap.registerPlugin(ScrollTrigger)
  3. Usa useGSAP() de @gsap/react
  4. Crea un tween que anime el track horizontal:
     - x: 0 → -(numPanels - 1) * window.innerWidth
     - ease: 'none'
     - scrollTrigger: { pin: true, scrub: 1, end: () => `+=${totalWidth}` }
  5. Limpia los ScrollTriggers en el cleanup
  6. Retorna { containerRef, trackRef }
  
  El hook debe funcionar con 4 paneles (3 benefits + 1 CTA).

### Fase 3: Actualizar Benefits/index.tsx
- **Agente:** @frontend
- **Archivos:** `components/sections/Benefits/index.tsx`
- **Checkpoint:** `grep -n "trackRef" components/sections/Benefits/index.tsx`
- **Prompt:**
  Actualiza el componente Benefits para usar el nuevo hook:
  
  1. Importa el hook useHorizontalScroll actualizado
  2. Usa trackRef en el motion.div del track horizontal
  3. Elimina el sticky wrapper (ya no es necesario con ScrollTrigger pin)
  4. Mantén el ProgressIndicator funcionando con scrollYProgress
  5. Asegúrate de que los 4 paneles se rendericen correctamente
  6. Mantén el MobileBenefits para responsive
  
  La estructura debe ser:
  - section (containerRef)
  - div track horizontal (trackRef) con los 4 paneles
  - ProgressIndicator
  - MobileBenefits (fallback)

### Fase 4: Ajustar Paneles para Ancho Correcto
- **Agente:** @frontend
- **Archivos:** `components/sections/Benefits/BenefitPanel.tsx`, `components/sections/Benefits/CTAPanel.tsx`
- **Checkpoint:** `grep -n "w-screen\|w-full" components/sections/Benefits/BenefitPanel.tsx components/sections/Benefits/CTAPanel.tsx`
- **Prompt:**
  Ajusta los paneles para que tengan el ancho correcto:
  
  1. En BenefitPanel.tsx: Cambia `w-screen` a `w-full` y asegúrate que el padre controle el ancho
  2. En CTAPanel.tsx: Cambia `w-screen` a `w-full`
  3. Los paneles deben ocupar el 100% del ancho del track, que será 400vw total
  4. Mantén todos los estilos existentes (colores, posicionamiento, etc.)

### Fase 5: Testing y Validación
- **Agente:** @frontend
- **Archivos:** N/A (testing visual)
- **Checkpoint:** `npm run build`
- **Prompt:**
  Realiza testing visual del scroll horizontal:
  
  1. Verifica que el build pase sin errores
  2. Lista los checks para testing manual:
     - Scroll horizontal suave con 4 paneles
     - Cada panel ocupa 100vw exacto
     - Progress indicator actualiza correctamente
     - La línea SVG animada funciona
     - Mobile fallback se muestra en <768px
     - Reduced motion respeta preferencias
  
  No ejecutes el servidor, solo prepara el checklist.

---

## Security Considerations

- GSAP es una librería de animación confiable (usada por millones de sitios)
- No hay procesamiento de input del usuario en esta implementación
- No afecta autenticación ni autorización

---

## Risk Matrix

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| GSAP no compatible con Next.js SSR | Media | Alto | Usar 'use client' y @gsap/react que maneja hydration |
| ScrollTrigger pin causa problemas en móvil | Baja | Medio | Mantener MobileBenefits como fallback |
| Performance issues con scrub | Baja | Medio | Usar scrub: 1 (suave) en lugar de true (instant) |
| Build falla por dependencias | Baja | Alto | Verificar instalación antes de commitear |

---

## Dependencies

- **GSAP:** ^3.12.0 (core animation library)
- **@gsap/react:** ^2.1.0 (React integration with useGSAP hook)

---

## Notas de Implementación

### GSAP ScrollTrigger Config

```typescript
scrollTrigger: {
  trigger: containerRef.current,
  pin: true,           // Fija la sección
  scrub: 1,            // Suaviza el scroll (1 segundo de lag)
  end: () => `+=${totalWidth}`, // Scroll distance = ancho total
  invalidateOnRefresh: true,    // Recalcula en resize
}
```

### Cleanup Importante

```typescript
return () => {
  tween.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());
};
```

---

## Success Criteria

- [ ] Scroll horizontal funciona suavemente con 4 paneles
- [ ] Cada panel se ve completamente al hacer scroll
- [ ] Progress indicator actualiza correctamente
- [ ] Build pasa sin errores
- [ ] Mobile fallback funciona correctamente
- [ ] Reduced motion respeta preferencias del usuario
