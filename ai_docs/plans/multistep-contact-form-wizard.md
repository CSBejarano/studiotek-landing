# Plan: Formulario de Contacto Multi-Paso (Wizard)

## Task Description

Optimizar el formulario de contacto de StudioTek Landing dividiendolo en 4 pasos progresivos para reducir la friccion de captura de leads. El formulario actual muestra todos los campos de golpe (nombre, email, empresa, telefono, presupuesto, servicio, mensaje, booking, checkboxes RGPD) lo cual resulta abrumador. Se reorganizara la misma informacion en 4 pasos secuenciales con indicador de progreso, validaciones parciales por paso y animaciones fluidas entre pasos.

**Tipo de tarea**: mejora (UX refactoring)
**Complejidad**: media

### Distribucion de Pasos

| Paso | Titulo | Campos | Obligatorios |
|------|--------|--------|--------------|
| 1 | Informacion de Contacto | nombre, email, empresa, telefono | nombre, email, empresa |
| 2 | Tu Proyecto | servicioInteres, presupuesto, mensaje, preguntas condicionales | presupuesto |
| 3 | Agendar Llamada | wantsBooking checkbox, bookingDate, bookingTime | Solo si wantsBooking=true |
| 4 | Confirmacion | Capa RGPD info, privacyAccepted, commercialAccepted, boton submit | privacyAccepted |

## Objective

Al completar este plan, el formulario de contacto de StudioTek Landing sera un wizard de 4 pasos con:
- Indicador de progreso visual (barra + labels + paso actual)
- Validaciones parciales antes de avanzar cada paso
- Animaciones fluidas de transicion entre pasos
- Submit final en paso 4 con payload identico al actual
- Compatibilidad 100% con APIs existentes (`/api/leads`, `/api/booking/create`, `/api/send-email`)
- Sin cambios en archivos backend

## Problem Statement

El formulario actual de `ContactForm.tsx` (695 lineas) presenta todos los campos en una sola vista, lo que genera:
1. **Sobrecarga cognitiva**: El usuario ve 10+ campos simultaneamente
2. **Abandono probable**: La cantidad de informacion solicitada de entrada desmotiva la conversion
3. **Sin guia visual**: No hay indicador de progreso ni sensacion de avance

Esto impacta directamente la tasa de conversion de leads, que es el objetivo principal de la landing page.

## Solution Approach

### Arquitectura de la Solucion

Refactorizar `ContactForm.tsx` manteniendo un unico componente con renderizado condicional por paso (NO sub-componentes separados, ya que comparten el mismo `useForm` context y state).

```
ContactForm (componente principal)
├── StepIndicator (indicador de progreso visual)
├── Step 1: Contacto (nombre, email, empresa, telefono)
├── Step 2: Proyecto (servicio, presupuesto, mensaje, preguntas condicionales)
├── Step 3: Llamada (checkbox booking + date/time pickers)
├── Step 4: RGPD (capa informativa + checkboxes + submit)
└── NavigationButtons (anterior/siguiente/submit)
```

### State Management

```tsx
const [currentStep, setCurrentStep] = useState(1);
const TOTAL_STEPS = 4;
const STEP_LABELS = ['Contacto', 'Proyecto', 'Llamada', 'Confirmacion'];

// Campos a validar por paso (para trigger() de react-hook-form)
const STEP_FIELDS: Record<number, (keyof ContactFormData)[]> = {
  1: ['nombre', 'email', 'empresa'],
  2: ['presupuesto'],
  3: [], // Validacion condicional manual (si wantsBooking -> bookingDate, bookingTime)
  4: ['privacyAccepted'],
};
```

### Navegacion entre Pasos

```tsx
const handleNext = async () => {
  const fieldsToValidate = STEP_FIELDS[currentStep];

  // Paso 3: validacion condicional
  if (currentStep === 3 && wantsBooking) {
    fieldsToValidate.push('bookingDate', 'bookingTime');
  }

  const isValid = await trigger(fieldsToValidate);
  if (isValid) {
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  }
};

const handlePrev = () => {
  setCurrentStep(prev => Math.max(prev - 1, 1));
};
```

### Animaciones

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {/* Contenido del paso actual */}
  </motion.div>
</AnimatePresence>
```

### Indicador de Progreso

```tsx
{/* Progress bar */}
<div className="mb-8">
  <div className="flex justify-between mb-2">
    {STEP_LABELS.map((label, i) => (
      <span key={label} className={cn(
        "text-xs font-medium",
        i + 1 <= currentStep ? "text-blue-400" : "text-white/40"
      )}>
        {label}
      </span>
    ))}
  </div>
  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
    />
  </div>
  <p className="text-center text-xs text-white/50 mt-2">
    Paso {currentStep} de {TOTAL_STEPS}
  </p>
</div>
```

### Reset tras Submit Exitoso

```tsx
// Dentro de onSubmit, tras exito:
setStatus('success');
reset();
setWantsBooking(false);
setCurrentStep(1); // <-- Agregar esta linea
```

## Relevant Files

Usa estos archivos para completar la tarea:

- **`components/sections/ContactForm.tsx`** (695 lineas) - Archivo PRINCIPAL a refactorizar. Contiene el formulario completo, options de presupuesto/servicios (lineas 21-36), preguntas condicionales (lineas 50-114), logica de booking (lineas 119-143), useForm setup (lineas 155-179), onSubmit (lineas 219-287), y todo el JSX del formulario (lineas 289-693).
- **`lib/validations.ts`** (34 lineas) - Schema Zod `contactSchema`. NO necesita modificacion ya que las validaciones parciales se hacen con `trigger()` de react-hook-form sobre el mismo schema completo.
- **`components/ui/Input.tsx`** (55 lineas) - Componente Input con `label`, `error`, `ref`. Props: `InputHTMLAttributes<HTMLInputElement>`.
- **`components/ui/Select.tsx`** (70 lineas) - Componente Select con `label`, `error`, `options`. Props: `SelectHTMLAttributes<HTMLSelectElement>`.
- **`components/ui/Textarea.tsx`** (55 lineas) - Componente Textarea con `label`, `error`. Props: `TextareaHTMLAttributes<HTMLTextAreaElement>`.
- **`components/ui/Checkbox.tsx`** (56 lineas) - Componente Checkbox con `label` (ReactNode), `error`. Props: `InputHTMLAttributes<HTMLInputElement>`.
- **`components/magicui/shimmer-button.tsx`** - Boton con efecto shimmer usado para submit.
- **`components/ui/VitaEonCard.tsx`** - Card wrapper con `variant="form"`, `glowColor="blue"`.

### Archivos de Referencia (NO modificar)
- **`app/api/leads/route.ts`** - POST endpoint. Payload: `{ name, email, company, phone, budget, message, service_interest, metadata, privacy_accepted, commercial_accepted, source }`.
- **`app/api/booking/slots`** - GET con query param `?date=YYYY-MM-DD`. Devuelve `{ success: true, slots: string[] }`.
- **`app/api/booking/create`** - POST con `{ lead_id, date, time }`.
- **`app/api/send-email`** - POST con `{ to, name }`.

## Implementation Phases

### Phase 1: Foundation
- Agregar state `currentStep` y constantes `TOTAL_STEPS`, `STEP_LABELS`, `STEP_FIELDS`
- Implementar indicador de progreso visual (barra + labels + "Paso X de 4")
- Implementar renderizado condicional basico de los 4 pasos (mover campos existentes a su paso correspondiente)
- Implementar botones "Siguiente" y "Anterior" con navegacion basica
- Mantener `useForm` y `onSubmit` intactos

### Phase 2: Core Implementation
- Implementar validaciones parciales por paso usando `trigger()` de react-hook-form
- Paso 1: trigger(['nombre', 'email', 'empresa']) antes de avanzar
- Paso 2: trigger(['presupuesto']) antes de avanzar
- Paso 3: si wantsBooking, trigger(['bookingDate', 'bookingTime']) antes de avanzar; si no, avanzar libre
- Paso 4: validacion en submit con privacyAccepted (ya manejado por el schema)
- Agregar animaciones con `AnimatePresence` + `motion.div` entre pasos
- Mantener animaciones existentes de preguntas condicionales intactas (lineas 456-523 actuales)

### Phase 3: Integration & Polish
- Verificar que el submit final en paso 4 envia payload identico al original
- Agregar `setCurrentStep(1)` al reset tras exito
- Verificar responsive: grids 1 col en movil, 2 col en md
- Verificar accesibilidad: aria-labels, roles, focus management
- Ejecutar type-check, lint, build
- Prueba manual end-to-end del flujo completo

## Team Orchestration

- Operas como el lider del equipo y orquestas al equipo para ejecutar el plan.
- Eres responsable de desplegar a los miembros del equipo adecuados con el contexto correcto para ejecutar el plan.
- IMPORTANTE: NUNCA operas directamente sobre el codigo base. Usas las herramientas `Task` y `Task*` para desplegar a los miembros del equipo para construir, validar, probar, desplegar y otras tareas.
  - Esto es critico. Tu trabajo es actuar como un director de alto nivel del equipo, no como un constructor.
  - Tu rol es validar que todo el trabajo vaya bien y asegurarte de que el equipo este en camino para completar el plan.
  - Orquestaras esto usando las Herramientas Task* para gestionar la coordinacion entre los miembros del equipo.
  - La comunicacion es primordial. Usaras las Herramientas Task* para comunicarte con los miembros del equipo y asegurar que esten en camino para completar el plan.
- Toma nota del ID de sesion de cada miembro del equipo. Asi es como los referenciaras.

### Team Members

- Builder
  - Name: builder-frontend
  - Role: Implementar el formulario multi-paso en `ContactForm.tsx`. Especialista en React 19, Next.js 16, Tailwind CSS v4, React Hook Form, Framer Motion. Escribe codigo, implementa los 4 pasos, indicador de progreso, validaciones parciales y animaciones.
  - Agent Type: frontend
  - Resume: true

- Validator
  - Name: validator-qa
  - Role: QA read-only que valida cada entrega del builder. Verifica criterios de aceptacion, busca regresiones, ejecuta comandos de verificacion (`npx tsc --noEmit`, `npm run lint`, `npm run build`). NUNCA escribe codigo.
  - Agent Type: general-purpose
  - Resume: true

## Step by Step Tasks

- IMPORTANTE: Las tareas SIEMPRE siguen el patron alternante **Builder -> Validator**. Cada paso de construccion es seguido por un paso de validacion.
- Ejecuta cada paso en orden, de arriba a abajo. Cada tarea se mapea directamente a una llamada `TaskCreate`.
- Antes de comenzar, ejecuta `TaskCreate` para crear la lista de tareas inicial.

### 1. Implementar Estructura Base Multi-Paso con Indicador de Progreso
- **Task ID**: build-multistep-structure
- **Depends On**: none
- **Assigned To**: builder-frontend
- **Agent Type**: frontend
- **Parallel**: false
- Leer `components/sections/ContactForm.tsx` completo para entender estructura actual
- Agregar state: `const [currentStep, setCurrentStep] = useState(1)`
- Agregar constantes: `TOTAL_STEPS = 4`, `STEP_LABELS = ['Contacto', 'Proyecto', 'Llamada', 'Confirmacion']`
- Implementar componente de indicador de progreso arriba del formulario:
  - Labels de cada paso con color activo (`text-blue-400`) vs inactivo (`text-white/40`)
  - Barra de progreso: `h-1 bg-white/10` con fill `bg-blue-500` y `width: (currentStep/4)*100%`
  - Texto "Paso X de 4" centrado debajo
- Reorganizar campos del formulario en 4 bloques renderizados condicionalmente segun `currentStep`:
  - **Paso 1** (currentStep === 1): Nombre, Email, Empresa, Telefono (mover lineas 364-424 actuales)
  - **Paso 2** (currentStep === 2): Presupuesto, Servicio de interes, preguntas condicionales, Mensaje (mover lineas 427-537)
  - **Paso 3** (currentStep === 3): Seccion de booking inline completa (mover lineas 540-606)
  - **Paso 4** (currentStep === 4): Capa RGPD, checkbox privacidad, checkbox comercial, boton submit (mover lineas 608-684)
- Implementar botones de navegacion:
  - Paso 1: solo boton "Siguiente"
  - Pasos 2-3: botones "Anterior" y "Siguiente"
  - Paso 4: boton "Anterior" y boton submit "Solicitar consulta gratuita"
- Estilos de botones "Siguiente"/"Anterior": usar clases coherentes con el dark theme existente
- NO implementar validaciones parciales aun (solo navegacion basica)
- NO implementar animaciones aun

### 2. Validar Estructura Base Multi-Paso
- **Task ID**: validate-multistep-structure
- **Depends On**: build-multistep-structure
- **Assigned To**: validator-qa
- **Agent Type**: general-purpose
- **Parallel**: false
- Leer `components/sections/ContactForm.tsx` modificado completo
- Verificar que existen exactamente 4 bloques de renderizado condicional (`currentStep === 1/2/3/4`)
- Verificar que el indicador de progreso esta implementado con barra, labels y "Paso X de 4"
- Verificar que los botones de navegacion estan presentes:
  - Paso 1: solo "Siguiente"
  - Pasos 2-3: "Anterior" + "Siguiente"
  - Paso 4: "Anterior" + submit
- Verificar que TODOS los campos originales estan presentes (ninguno perdido en la reorganizacion)
- Verificar que el `useForm` y `onSubmit` no fueron modificados
- Ejecutar `npx tsc --noEmit` - debe pasar sin errores
- Ejecutar `npm run lint` - debe pasar sin errores
- Reportar PASS/FAIL con detalle

### 3. Implementar Validaciones Parciales por Paso y Animaciones
- **Task ID**: build-validations-and-animations
- **Depends On**: validate-multistep-structure
- **Assigned To**: builder-frontend
- **Agent Type**: frontend
- **Parallel**: false
- Agregar constante `STEP_FIELDS` que mapea cada paso a los campos que se deben validar:
  ```tsx
  const STEP_FIELDS: Record<number, (keyof ContactFormData)[]> = {
    1: ['nombre', 'email', 'empresa'],
    2: ['presupuesto'],
    3: [],
    4: ['privacyAccepted'],
  };
  ```
- Implementar funcion `handleNext`:
  - Obtener campos del paso actual de `STEP_FIELDS`
  - Para paso 3: si `wantsBooking`, agregar `bookingDate` y `bookingTime` a la lista
  - Llamar `trigger(fieldsToValidate)` de react-hook-form
  - Solo avanzar si `trigger` devuelve `true`
- Implementar funcion `handlePrev`: `setCurrentStep(prev => Math.max(prev - 1, 1))`
- Conectar `handleNext` al boton "Siguiente" (reemplazar navegacion basica)
- Envolver los 4 bloques de paso en `<AnimatePresence mode="wait">` + `<motion.div>`:
  - `key={currentStep}` para que AnimatePresence detecte cambios
  - `initial={{ opacity: 0, x: 30 }}`
  - `animate={{ opacity: 1, x: 0 }}`
  - `exit={{ opacity: 0, x: -30 }}`
  - `transition={{ duration: 0.3, ease: 'easeInOut' }}`
- Mantener las animaciones existentes de preguntas condicionales intactas dentro del paso 2
- Agregar `setCurrentStep(1)` al bloque de exito en `onSubmit` (junto al `reset()` existente)

### 4. Validar Validaciones Parciales y Animaciones
- **Task ID**: validate-validations-and-animations
- **Depends On**: build-validations-and-animations
- **Assigned To**: validator-qa
- **Agent Type**: general-purpose
- **Parallel**: false
- Leer `components/sections/ContactForm.tsx` modificado
- Verificar que `STEP_FIELDS` esta correctamente definido con los campos de cada paso
- Verificar que `handleNext` usa `trigger()` de react-hook-form correctamente
- Verificar la logica condicional del paso 3 (booking fields solo si wantsBooking)
- Verificar que `AnimatePresence` envuelve los pasos con `mode="wait"` y `key={currentStep}`
- Verificar que las animaciones existentes de preguntas condicionales no fueron afectadas
- Verificar que `setCurrentStep(1)` se agrego al reset tras submit exitoso
- Ejecutar `npx tsc --noEmit` - type-check
- Ejecutar `npm run lint` - lint
- Ejecutar `npm run build` - build completo
- Reportar PASS/FAIL con detalle

### 5. Integracion Final y Polish
- **Task ID**: build-integration-polish
- **Depends On**: validate-validations-and-animations
- **Assigned To**: builder-frontend
- **Agent Type**: frontend
- **Parallel**: false
- Verificar que el payload enviado a `/api/leads` en `onSubmit` es IDENTICO al original:
  ```json
  { "name", "email", "company", "phone", "budget", "service_interest", "message", "metadata", "privacy_accepted", "commercial_accepted", "source" }
  ```
- Verificar que la logica de booking (crear evento en Google Calendar) funciona:
  - `wantsBooking && data.bookingDate && data.bookingTime` -> POST `/api/booking/create`
  - Email de confirmacion solo si NO hay booking
- Verificar responsive:
  - Paso 1: grid 2 cols en md (nombre|email, empresa|telefono)
  - Paso 2: grid 2 cols en md (presupuesto|servicio), mensaje full width
  - Paso 3: grid 2 cols en md para fecha|hora
  - Paso 4: stack vertical
- Verificar accesibilidad: `aria-label` en el formulario, `role="alert"` en errores
- Ajustar el paso 3 para que sea mas invitador: agregar texto descriptivo "Este paso es opcional. Si prefieres, puedes saltarlo." y estilizar el boton "Siguiente" como "Saltar" cuando no hay booking
- Verificar que el estado de exito/error (lineas 329-354 originales) se muestra correctamente (en cualquier paso, o resetear a paso 1)

### 6. Validacion Final Integral
- **Task ID**: validate-all
- **Depends On**: build-integration-polish
- **Assigned To**: validator-qa
- **Agent Type**: general-purpose
- **Parallel**: false
- Ejecutar `npx tsc --noEmit` (type-check final)
- Ejecutar `npm run lint` (lint final)
- Ejecutar `npm run build` (build completo final)
- Leer `components/sections/ContactForm.tsx` completo y verificar CADA criterio de aceptacion:
  1. [ ] El formulario se divide en exactamente 4 pasos secuenciales
  2. [ ] Indicador de progreso visible en todos los pasos (barra + labels + "Paso X de 4")
  3. [ ] Botones "Siguiente" y "Anterior" funcionan correctamente con logica de pasos
  4. [ ] Validacion por paso: `trigger()` impide avanzar si hay errores en campos obligatorios
  5. [ ] Los 4 pasos capturan la misma informacion que el formulario original (ningun campo perdido)
  6. [ ] El submit final (paso 4) envia payload completo a `/api/leads` sin cambios en formato
  7. [ ] La logica de booking (paso 3) se mantiene funcional (checkbox, date picker, time slots)
  8. [ ] La logica de preguntas condicionales (paso 2) se mantiene funcional
  9. [ ] El estado de exito/error tras submit se muestra correctamente
  10. [ ] Responsive en movil (1 col), tablet y desktop (2 cols donde aplica)
  11. [ ] Animaciones fluidas entre pasos usando AnimatePresence + motion.div
  12. [ ] No hay regresiones: type-check, lint y build exitosos
- Verificar que `lib/validations.ts` NO fue modificado (o si fue modificado, que el schema es compatible)
- Verificar que NINGUN archivo en `app/api/` fue modificado
- Reporte final: PASS si todos los 12 criterios pasan, FAIL con detalle por cada criterio que falle

## Acceptance Criteria

1. El formulario se divide en exactamente 4 pasos secuenciales
2. Indicador de progreso visible en todos los pasos (paso actual destacado + barra de progreso animada + "Paso X de 4")
3. Botones de navegacion "Siguiente" y "Anterior" funcionan correctamente (Paso 1: solo Siguiente, Pasos 2-3: Anterior+Siguiente, Paso 4: Anterior+Submit)
4. Validacion por paso: no avanza si hay errores en campos obligatorios del paso actual (usa `trigger()`)
5. Los 4 pasos capturan la misma informacion que el formulario original (nombre, email, empresa, telefono, presupuesto, servicio, mensaje, metadata, booking, privacy, commercial)
6. El submit final (paso 4) envia el payload completo a `/api/leads` sin cambios en el formato del body
7. La logica de booking (opcional, paso 3) se mantiene funcional (checkbox, fetch slots, date/time selectors)
8. La logica de preguntas condicionales por servicio (paso 2) se mantiene funcional (AnimatePresence existente)
9. El estado de exito/error tras submit se muestra correctamente con los mismos estilos actuales
10. Responsive en movil, tablet y desktop (grids adaptativos)
11. Animaciones fluidas entre pasos usando Framer Motion (AnimatePresence + motion.div)
12. No hay regresiones: `npx tsc --noEmit`, `npm run lint` y `npm run build` exitosos

## Validation Commands

Ejecuta estos comandos para validar que la tarea esta completa:

- `npx tsc --noEmit` - Type checking sin errores
- `npm run lint` - Linting sin errores
- `npm run build` - Build de produccion exitoso
- Verificacion manual en `http://localhost:3000/#contact`:
  - Completar paso 1 con datos validos, verificar que avanza a paso 2
  - Intentar avanzar paso 1 sin nombre -> debe mostrar error y no avanzar
  - Completar paso 2 con presupuesto seleccionado, verificar que avanza a paso 3
  - En paso 3, avanzar sin booking (opcional) -> debe avanzar a paso 4
  - En paso 4, aceptar privacidad y hacer submit -> debe enviar a `/api/leads` y mostrar exito
  - Verificar que tras exito, el formulario vuelve a paso 1

## Notes

- **NO se necesitan nuevas librerias**: Todo lo necesario ya esta instalado (react-hook-form, zod, framer-motion, lucide-react)
- **NO modificar archivos backend**: `app/api/leads/route.ts`, `app/api/booking/*`, `app/api/send-email/*`
- **NO modificar `lib/validations.ts`**: Las validaciones parciales se hacen con `trigger()` de react-hook-form, que valida campos individuales contra el schema completo
- Los bookable days son miercoles unicamente (`BOOKABLE_DAYS_FRONTEND = new Set([3])`, linea 121)
- El indicador de progreso debe usar `transition-all duration-500 ease-out` para la barra de progreso (animacion suave)
- Considerar focus management: al avanzar/retroceder paso, hacer scroll al inicio del formulario
- La seccion de exito/error (`status === 'success'` / `status === 'error'`) debe mostrarse fuera de los pasos (visible siempre, independiente del currentStep)
- **IMPORTANTE**: En el paso 3, para el boton "Siguiente" considerar mostrar "Saltar" si el usuario no marco el checkbox de booking, y "Siguiente" si lo marco y completo fecha/hora
