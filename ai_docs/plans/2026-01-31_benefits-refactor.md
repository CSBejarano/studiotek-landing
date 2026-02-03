# Plan: Refactorizar Benefits.tsx a Arquitectura Componentizada VICIO-style

## Contexto

El archivo `components/sections/Benefits.tsx` tiene 618 líneas, violando el principio SRP (Single Responsibility Principle). Contiene:

- Hook de scroll horizontal inline (~25 líneas)
- 3 paneles de beneficios hardcodeados (~195 líneas, ~65 cada uno)
- Panel CTA final (~35 líneas)
- Fallback mobile DUPLICADO (~115 líneas de código repetido)
- Data inline (~100 líneas)
- Subcomponentes ProgressIndicator inline

### Problemas Identificados

1. **Scroll horizontal NO funciona correctamente** - Posible issue con el cálculo de `useTransform`
2. **618 líneas violan SRP** - Archivo gigante e inmanejable
3. **Mobile fallback duplica 115 líneas** - Mismo contenido hardcodeado 2 veces
4. **Imágenes con position absolute** - Generan layout thrashing
5. **Paneles hardcodeados** - En vez de mapeados desde data

### Stack Técnico

- Next.js 16.1.1 + React 19.2.3
- Framer Motion / Motion (animaciones)
- Tailwind CSS v4
- TypeScript

## Arquitectura de la Solución

### Estructura Final

```
components/
  sections/
    Benefits/
      index.tsx              # Orquestador principal (~50 líneas)
      BenefitPanel.tsx       # Panel individual reutilizable (~80 líneas)
      CTAPanel.tsx           # Panel CTA final (~40 líneas)
      MobileBenefits.tsx     # Versión mobile (~60 líneas)
      ProgressIndicator.tsx  # Indicador de progreso (~35 líneas)
      hooks/
        useHorizontalScroll.ts  # Hook extraído (~50 líneas)
      data/
        benefits-data.ts     # Datos de paneles (~100 líneas)
```

### Diagrama de Dependencias

```
Benefits/index.tsx
├── hooks/useHorizontalScroll.ts
├── data/benefits-data.ts (types + data)
├── BenefitPanel.tsx (recibe PanelData)
├── CTAPanel.tsx (scrollToContact)
├── MobileBenefits.tsx (mapea data)
└── ProgressIndicator.tsx (scrollYProgress)
```

### Interface del Hook

```typescript
interface UseHorizontalScrollReturn {
  containerRef: RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
  x: MotionValue<string>;
  smoothX: MotionValue<string>;
  pathLength: MotionValue<number>;
}
```

## Fases

### Fase 1: Crear Estructura y Extraer Data

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/data/benefits-data.ts` (crear)
- **Checkpoint:** `ls components/sections/Benefits/data/benefits-data.ts`
- **Prompt:**

Crea la estructura de carpetas y extrae los datos de Benefits.tsx.

1. Crear carpeta `components/sections/Benefits/`
2. Crear subcarpetas `hooks/` y `data/`
3. Crear `data/benefits-data.ts` con:
   - Interface `PanelData` (copiar del original)
   - Interface `CopyBlock` con position types
   - Interface `ImageData` con size types
   - Constante `panels: PanelData[]` (copiar los 3 paneles)
   - Constante `NUM_PANELS = 4`
   - Constante `sizeClasses` (mapeo de tamaños)
   - Export todo

---

### Fase 2: Extraer Hook useHorizontalScroll

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/hooks/useHorizontalScroll.ts` (crear)
- **Checkpoint:** `grep -l "useHorizontalScroll" components/sections/Benefits/hooks/`
- **Prompt:**

Extrae la lógica del scroll horizontal a un hook reutilizable.

1. Crear `hooks/useHorizontalScroll.ts`
2. El hook debe recibir `numPanels: number` como parámetro
3. Incluir toda la lógica:
   - `containerRef` para el contenedor
   - `scrollYProgress` con `useScroll`
   - `x` con `useTransform` que mapea scroll vertical a horizontal
   - `smoothX` con `useSpring` (respetando `useReducedMotion`)
   - `pathLength` para el SVG animado
4. Exportar interface `UseHorizontalScrollReturn`
5. Asegurar que la lógica sea EXACTA al original para no romper el scroll

---

### Fase 3: Crear Componente BenefitPanel

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/BenefitPanel.tsx` (crear)
- **Checkpoint:** `grep -l "BenefitPanel" components/sections/Benefits/`
- **Prompt:**

Crea el componente reutilizable BenefitPanel que renderiza un panel individual.

1. Crear `BenefitPanel.tsx`
2. Props interface:
   ```typescript
   interface BenefitPanelProps {
     panel: PanelData;
     sizeClasses: Record<'large' | 'medium' | 'small', string>;
   }
   ```
3. El componente debe:
   - Renderizar el headline con split por `\n`
   - Renderizar copyBlocks en posiciones correctas
   - Renderizar imágenes con motion animation
   - Renderizar stat ticker con NumberTicker
   - Aplicar bgVariant (dark/light) con colores correctos
4. Usar clases condicionales para variantes dark/light
5. Importar de `motion/react` y `next/image`

---

### Fase 4: Crear Componente CTAPanel

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/CTAPanel.tsx` (crear)
- **Checkpoint:** `grep -l "CTAPanel" components/sections/Benefits/`
- **Prompt:**

Crea el componente CTAPanel para el panel final.

1. Crear `CTAPanel.tsx`
2. Props: `{ scrollToContact: () => void }`
3. Contenido:
   - Headline "SI HAS LLEGADO HASTA AQUÍ..." con span azul
   - Botón "Empieza ahora" con motion hover/tap
   - Link secundario a email
4. Estilos: fondo oscuro, centrado, responsive
5. ~40 líneas máximo

---

### Fase 5: Crear MobileBenefits sin Duplicación

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/MobileBenefits.tsx` (crear)
- **Checkpoint:** `grep -l "MobileBenefits" components/sections/Benefits/`
- **Prompt:**

Crea el componente MobileBenefits que NO duplica código.

1. Crear `MobileBenefits.tsx`
2. Props: `{ panels: PanelData[], scrollToContact: () => void }`
3. **CRÍTICO**: Mapear `panels` en vez de hardcodear contenido
4. Renderizar cada panel:
   - Headline
   - Primer copyBlock
   - Primera imagen (aspect-video)
   - Stat ticker
5. Renderizar CTA móvil al final
6. ~60 líneas máximo
7. El componente entero tiene `md:hidden`

---

### Fase 6: Mover ProgressIndicator

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/ProgressIndicator.tsx` (crear)
- **Checkpoint:** `grep -l "ProgressIndicator" components/sections/Benefits/ProgressIndicator.tsx`
- **Prompt:**

Mueve el ProgressIndicator a su propio archivo.

1. Crear `ProgressIndicator.tsx`
2. Copiar `ProgressIndicator` y `ProgressDot` del original
3. Asegurar tipos correctos para `scrollYProgress`
4. Exportar solo `ProgressIndicator`
5. ProgressDot es interno al archivo

---

### Fase 7: Crear index.tsx Orquestador

- **Agente:** @frontend
- **Archivos:**
  - `components/sections/Benefits/index.tsx` (crear)
- **Checkpoint:** `npm run build`
- **Prompt:**

Crea el orquestador principal que une todos los componentes.

1. Crear `index.tsx` (~50 líneas)
2. Importar:
   - `useHorizontalScroll` del hook
   - `panels, NUM_PANELS, sizeClasses` de data
   - Todos los componentes
3. Estructura:
   ```tsx
   <section ref={containerRef} style={{ height: `${NUM_PANELS * 100}vh` }}>
     <div className="sticky top-0 h-screen overflow-hidden">
       {/* SVG path animado */}
       <motion.div style={{ x: smoothX }}>
         {panels.map(panel => <BenefitPanel />)}
         <CTAPanel />
       </motion.div>
       <ProgressIndicator />
     </div>
     <MobileBenefits /> {/* Posición absoluta con md:hidden */}
   </section>
   ```
4. Exportar `Benefits` como named export
5. Verificar que `npm run build` pasa

---

### Fase 8: Actualizar Import en page.tsx

- **Agente:** @frontend
- **Archivos:**
  - `app/page.tsx` (modificar)
  - `components/sections/Benefits.tsx` (eliminar)
- **Checkpoint:** `npm run dev` sin errores
- **Prompt:**

Actualiza el import y elimina el archivo original.

1. En `app/page.tsx`, cambiar import de:
   ```tsx
   import { Benefits } from '@/components/sections/Benefits';
   ```
   A:
   ```tsx
   import { Benefits } from '@/components/sections/Benefits';
   ```
   (El path es el mismo porque index.tsx se auto-resuelve)
2. Eliminar el archivo original `components/sections/Benefits.tsx`
3. Ejecutar `npm run dev` y verificar que funciona
4. Verificar scroll horizontal en browser

---

### Fase 9: Review de Arquitectura

- **Agente:** @gentleman
- **Archivos:**
  - `components/sections/Benefits/` (todos)
- **Checkpoint:** Revisión manual de patrones
- **Prompt:**

Revisa la arquitectura componentizada final.

1. Verificar que cada archivo cumple SRP
2. Verificar que no hay código duplicado
3. Verificar tipos TypeScript correctos
4. Verificar que el hook es reutilizable
5. Verificar que MobileBenefits usa data (no hardcode)
6. Sugerir mejoras si las hay
7. Aprobar o solicitar cambios

## Security Considerations

N/A - Este refactor es puramente de estructura, no toca auth ni datos sensibles.

## Risk Matrix

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Scroll horizontal rompe | Alta | Alto | Copiar lógica exacta al hook, probar inmediatamente |
| Tipos incorrectos | Media | Medio | Usar interfaces existentes, TypeScript strict |
| Mobile no renderiza | Media | Alto | Probar en responsive después de cada fase |
| Build falla | Baja | Alto | Checkpoint npm run build en fase 7 |
| Regresión visual | Media | Medio | Comparar screenshots antes/después |

## Dependencies

```
Fase 1 (data) ─┬─> Fase 2 (hook) ──> Fase 7 (index)
               │
               ├─> Fase 3 (BenefitPanel) ──> Fase 7
               │
               ├─> Fase 4 (CTAPanel) ──> Fase 7
               │
               ├─> Fase 5 (MobileBenefits) ──> Fase 7
               │
               └─> Fase 6 (ProgressIndicator) ──> Fase 7

Fase 7 ──> Fase 8 (cleanup) ──> Fase 9 (review)
```

Las fases 2-6 pueden ejecutarse en paralelo después de la fase 1.
