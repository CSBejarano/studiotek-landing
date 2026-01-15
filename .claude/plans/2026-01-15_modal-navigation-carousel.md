# Plan de Ejecucion: Navegacion entre Modales del Apple Cards Carousel

> **Generado:** 2026-01-15
> **Branch:** main
> **Dominio:** frontend

## Variables

```yaml
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Agregar botones de navegacion dentro del modal expandido del Apple Cards Carousel para permitir al usuario pasar de un servicio a otro sin necesidad de cerrar el modal. Esto mejora significativamente la experiencia de usuario al explorar los servicios disponibles.

## Code Structure

```yaml
CREATE:
  - "components/ui/ServiceModal.tsx"

MODIFY:
  - "components/ui/CarouselCard.tsx"
  - "components/sections/Services.tsx"

TESTS:
  - "npm run build"
```

## WORKFLOW

### FASE 0: Pre-flight Check

**Agente:** @infra

**Task:**

~~~~markdown
Task(
  subagent_type: "infra",
  description: "FASE 0: Pre-flight Check",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/infra.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes

  # CONTEXTO

  - Branch: main
  - Archivos existentes a verificar

  # TAREA

  Verificar que los archivos necesarios existen y el proyecto compila:

  1. Verificar existencia de archivos:
     - components/ui/CarouselCard.tsx
     - components/ui/AppleCarousel.tsx
     - components/sections/Services.tsx
     - hooks/useOutsideClick.ts

  2. Ejecutar: npm run build

  ## Criterio de exito

  - Todos los archivos existen
  - Build pasa sin errores

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos verificados
     - Estado del build
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/infra.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso sin errores

---

### FASE 1: Crear ServiceModal Component

**Agente:** @frontend

**Task:**

~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Crear ServiceModal Component",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL041 (React Portal), SL042 (z-index layering), SL043 (Modal sizing)
     - blockers: Problemas conocidos con modales

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relevantes sobre modales

  # CONTEXTO

  - Branch: main
  - Archivos: components/ui/ServiceModal.tsx (NUEVO)

  # TAREA

  Crear componente ServiceModal con navegacion entre servicios.

  ## Especificaciones

  1. **Props interface:**
  ```typescript
  interface ServiceModalProps {
    card: CardData | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    hasNext: boolean;
    hasPrev: boolean;
  }
  ```

  2. **UI de navegacion:**
     - Botones de flecha a los lados del modal (fuera del contenedor)
     - Estilo consistente con AppleCarousel: bg-slate-800/90, border-slate-700/50
     - ChevronLeft/ChevronRight de lucide-react, size={28}
     - Solo mostrar si hasNext/hasPrev es true

  3. **Keyboard navigation:**
     - ArrowLeft -> onPrev()
     - ArrowRight -> onNext()
     - Escape -> onClose() (ya existente)

  4. **Transiciones:**
     - AnimatePresence mode="wait" para transicion suave entre cards
     - key={card.title} para trigger de animacion

  5. **Accesibilidad:**
     - aria-label="Servicio anterior" / "Servicio siguiente"
     - role="dialog" en el modal
     - aria-modal="true"

  ## Archivos

  CREATE: components/ui/ServiceModal.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivo creado
     - Props implementadas
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL044"
       context: "Modal navigation pattern for carousel"
       decision: "Estado centralizado en padre, modal unico via portal con botones de navegacion laterales"
       confidence: 0.95
       validated_in: "modal-navigation-carousel"

     En `decisions:` agregar:
     - id: "SL045"
       context: "Keyboard navigation in modal"
       decision: "ArrowLeft/ArrowRight para navegar entre items, Escape para cerrar"
       confidence: 0.95
       validated_in: "modal-navigation-carousel"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~

**Checkpoint:**

- Comando: `ls components/ui/ServiceModal.tsx`
- Criterio: Archivo existe

---

### FASE 2: Simplificar CarouselCard

**Agente:** @frontend

**Task:**

~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Simplificar CarouselCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL039 (Apple-style carousel implementation)
     - file_patterns_discovered: Patrones de componentes

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Archivos: components/ui/CarouselCard.tsx

  # TAREA

  Simplificar CarouselCard para que solo renderice la tarjeta del carousel (sin modal).

  ## Cambios requeridos

  1. **Eliminar:**
     - ExpandedModal function (movido a ServiceModal)
     - useState para `open`
     - useEffect para mounted, keydown, body scroll
     - createPortal import y uso
     - useOutsideClick import

  2. **Modificar props:**
  ```typescript
  interface CarouselCardProps {
    card: CardData;
    index: number;
    onClick?: () => void;
  }
  ```

  3. **Actualizar onClick:**
     - Cambiar `onClick={() => setOpen(true)}` por `onClick={onClick}`

  4. **Mantener:**
     - Animaciones de hover (whileHover, whileTap)
     - Estilo visual de la tarjeta
     - CardData interface (exportarla)

  ## Archivos

  MODIFY: components/ui/CarouselCard.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Lineas eliminadas vs agregadas
     - Props modificadas
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~

**Checkpoint:**

- Comando: `grep -c "createPortal" components/ui/CarouselCard.tsx || echo "0"`
- Criterio: Resultado debe ser 0 (createPortal eliminado)

---

### FASE 3: Integrar en Services

**Agente:** @frontend

**Task:**

~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Integrar en Services",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL040 (Services carousel integration), SL044 (Modal navigation)
     - blockers: Problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Archivos: components/sections/Services.tsx

  # TAREA

  Agregar estado centralizado y portal del modal en Services.

  ## Cambios requeridos

  1. **Imports nuevos:**
  ```typescript
  import { useState, useEffect } from 'react';
  import { createPortal } from 'react-dom';
  import { ServiceModal } from '@/components/ui/ServiceModal';
  ```

  2. **Estado:**
  ```typescript
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);
  ```

  3. **Handlers:**
  ```typescript
  const handleOpen = (index: number) => setOpenIndex(index);
  const handleClose = () => setOpenIndex(null);
  const handleNext = () => {
    if (openIndex !== null && openIndex < servicesCarouselData.length - 1) {
      setOpenIndex(openIndex + 1);
    }
  };
  const handlePrev = () => {
    if (openIndex !== null && openIndex > 0) {
      setOpenIndex(openIndex - 1);
    }
  };
  ```

  4. **CarouselCard update:**
  ```tsx
  <CarouselCard
    key={card.title}
    card={card}
    index={index}
    onClick={() => handleOpen(index)}
  />
  ```

  5. **Portal del modal (al final del componente, antes del cierre de section):**
  ```tsx
  {mounted && createPortal(
    <ServiceModal
      card={openIndex !== null ? servicesCarouselData[openIndex] : null}
      onClose={handleClose}
      onNext={handleNext}
      onPrev={handlePrev}
      hasNext={openIndex !== null && openIndex < servicesCarouselData.length - 1}
      hasPrev={openIndex !== null && openIndex > 0}
    />,
    document.body
  )}
  ```

  ## Archivos

  MODIFY: components/sections/Services.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Lineas agregadas
     - Estado del componente
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~

**Checkpoint:**

- Comando: `grep -c "ServiceModal" components/sections/Services.tsx`
- Criterio: Resultado >= 1

---

### FASE 4: QA y Build

**Agente:** @testing

**Task:**

~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 4: QA y Build",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`:
     - decisions: Decisiones de testing previas
     - blockers: Problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Feature: Modal navigation in carousel

  # TAREA

  Verificar que la implementacion funciona correctamente.

  ## Verificaciones

  1. **Build:**
     - npm run build
     - Debe pasar sin errores ni warnings criticos

  2. **Funcionalidad (manual si hay dev server):**
     - Click en card -> modal se abre
     - Botones de navegacion visibles a los lados
     - Click en flecha derecha -> siguiente servicio
     - Click en flecha izquierda -> servicio anterior
     - Transicion suave entre servicios
     - Escape cierra el modal
     - Click fuera cierra el modal

  3. **Edge cases:**
     - Primer servicio: no hay boton izquierdo
     - Ultimo servicio: no hay boton derecho
     - Scroll del body bloqueado cuando modal abierto

  ## Archivos

  - components/ui/ServiceModal.tsx
  - components/ui/CarouselCard.tsx
  - components/sections/Services.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Resultado del build
     - Issues encontrados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Exit code 0

---

## Checkpoints

| CP  | Fase   | Criterio                  | Comando                                                        |
| --- | ------ | ------------------------- | -------------------------------------------------------------- |
| CP0 | FASE 0 | Build inicial exitoso     | `npm run build`                                                |
| CP1 | FASE 1 | ServiceModal creado       | `ls components/ui/ServiceModal.tsx`                            |
| CP2 | FASE 2 | CarouselCard simplificado | `grep -c "createPortal" components/ui/CarouselCard.tsx`        |
| CP3 | FASE 3 | Services integrado        | `grep -c "ServiceModal" components/sections/Services.tsx`      |
| CP4 | FASE 4 | Build final exitoso       | `npm run build`                                                |

## Risk Matrix

| Riesgo                              | Impacto | Mitigacion                                       |
| ----------------------------------- | ------- | ------------------------------------------------ |
| Dos modales visibles en transicion  | Medio   | AnimatePresence mode="wait" en ServiceModal      |
| Body scroll no bloqueado            | Bajo    | useEffect en Services con openIndex dependency   |
| Keyboard navigation interfiere      | Bajo    | Solo activo cuando modal esta abierto            |
| TypeScript errors por props changes | Medio   | Actualizar interfaces antes de implementar      |

## Decisiones Nuevas

| ID    | Contexto                      | Decision                                                                 |
| ----- | ----------------------------- | ------------------------------------------------------------------------ |
| SL044 | Modal navigation pattern      | Estado centralizado en padre, modal unico via portal                     |
| SL045 | Keyboard navigation in modal  | ArrowLeft/ArrowRight para navegar, Escape para cerrar                    |
| SL046 | AnimatePresence mode="wait"   | Transicion suave entre modales sin solapamiento                          |

---

**Completion Promise:** "Modal navigation implementado - usuario puede navegar entre servicios sin cerrar modal"
