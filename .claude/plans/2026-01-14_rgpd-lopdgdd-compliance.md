# Plan de Ejecucion: RGPD/LOPDGDD Compliance System

> **Generado:** 2026-01-14
> **Issue:** N/A (Compliance Legal)
> **Phase:** N/A
> **Modo:** Ralph Wiggum Loop

## Variables

```yaml
WORKFLOW_ID: "2026-01-14_rgpd-lopdgdd-compliance"
DOMAIN: "frontend"
BRANCH: "main"
COMPLETION_PROMISE: "RGPD COMPLIANCE COMPLETE"
MAX_ITERATIONS: 50
JURISDICTION: "Espana - AEPD Guidelines 2023"
```

## Purpose

Implementar sistema completo de compliance RGPD/LOPDGDD para la landing page de StudioTek, incluyendo:

1. **Cookie Consent System** - Banner con 3 capas segun AEPD
2. **Politica de Cookies** - Pagina completa LSSI
3. **Politica de Privacidad** - Pagina completa RGPD Art. 13
4. **Formulario de Contacto** - Checkboxes de aceptacion
5. **Comunicaciones Comerciales** - Opt-in LSSI Art. 21

## Code Structure

### CREATE (Nuevos archivos):

```
components/cookies/
├── CookieBanner.tsx           # Banner principal (1ra capa AEPD)
├── CookieSettingsModal.tsx    # Modal configuracion (2da capa)
├── CookieDetailsList.tsx      # Lista detallada (3ra capa)
└── CookieContext.tsx          # Context para estado global

components/ui/
└── Checkbox.tsx               # Componente checkbox reutilizable

app/
├── politica-cookies/
│   └── page.tsx               # Pagina politica de cookies
└── politica-privacidad/
    └── page.tsx               # Pagina politica de privacidad

lib/
├── cookies.ts                 # Utilities para cookies (get/set/remove)
└── cookie-config.ts           # Configuracion de cookies del sitio
```

### MODIFY (Archivos existentes):

```
app/layout.tsx                          # + CookieBanner + CookieProvider
components/sections/ContactForm.tsx     # + Checkboxes privacidad/comercial
components/sections/Footer.tsx          # + Links a politicas
lib/validations.ts                      # + Schema campos legales
```

### TESTS:

```
# Validacion visual y funcional manual
- npm run build (sin errores)
- Verificar banner visible/oculto
- Verificar botones mismo nivel
- Verificar formulario con validacion
- Verificar links funcionando
```

---

## WORKFLOW

### FASE 0: Infraestructura Base

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 0: Infraestructura de cookies",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Buscar SL001-SL033 para patrones establecidos
     - blockers: SLB001-SLB003 para problemas conocidos
     - file_patterns_discovered: Estructura de componentes

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes

  # CONTEXTO

  - Branch: main
  - Stack: Next.js 16 + React 19 + Tailwind 4
  - Archivos relacionados: lib/, components/

  # TAREA

  Crear la infraestructura base para el sistema de cookies:

  ## Archivos a crear:

  ### 1. lib/cookie-config.ts
  ```typescript
  // Configuracion de cookies del sitio
  export const COOKIE_CONSENT_KEY = 'studiotek_cookie_consent';
  export const COOKIE_MAX_AGE_DAYS = 395; // ~13 meses (AEPD recommendation)

  export type CookieCategory = 'technical' | 'analytics' | 'marketing';

  export interface CookieConsent {
    technical: boolean;  // Siempre true, no se puede desactivar
    analytics: boolean;
    marketing: boolean;
    timestamp: string;   // ISO date
    version: string;     // Version de la politica
  }

  export const COOKIES_CONFIG = {
    technical: {
      name: 'Tecnicas',
      description: 'Necesarias para el funcionamiento basico del sitio web',
      required: true,
      cookies: [
        { name: 'studiotek_cookie_consent', provider: 'StudioTek', purpose: 'Recordar preferencias de cookies', duration: '13 meses' }
      ]
    },
    analytics: {
      name: 'Analiticas',
      description: 'Nos ayudan a entender como los usuarios interactuan con el sitio',
      required: false,
      cookies: []  // Agregar cuando se implemente Analytics
    },
    marketing: {
      name: 'Marketing',
      description: 'Utilizadas para mostrarte publicidad relevante',
      required: false,
      cookies: []  // Agregar cuando se implementen
    }
  };
  ```

  ### 2. lib/cookies.ts
  ```typescript
  // Utilities para manejo de cookies
  import { COOKIE_CONSENT_KEY, COOKIE_MAX_AGE_DAYS, CookieConsent } from './cookie-config';

  export function getCookieConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as CookieConsent;
    } catch {
      return null;
    }
  }

  export function setCookieConsent(consent: CookieConsent): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  }

  export function clearCookieConsent(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  }

  export function hasValidConsent(): boolean {
    const consent = getCookieConsent();
    if (!consent) return false;
    // Verificar que no haya expirado (13 meses)
    const consentDate = new Date(consent.timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < COOKIE_MAX_AGE_DAYS;
  }
  ```

  ### 3. components/cookies/CookieContext.tsx
  ```typescript
  'use client';

  import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
  import { CookieConsent, COOKIE_CONSENT_KEY } from '@/lib/cookie-config';
  import { getCookieConsent, setCookieConsent, hasValidConsent } from '@/lib/cookies';

  interface CookieContextType {
    consent: CookieConsent | null;
    showBanner: boolean;
    showSettings: boolean;
    acceptAll: () => void;
    rejectAll: () => void;
    saveSettings: (consent: Partial<CookieConsent>) => void;
    openSettings: () => void;
    closeSettings: () => void;
  }

  const CookieContext = createContext<CookieContextType | undefined>(undefined);

  export function CookieProvider({ children }: { children: ReactNode }) {
    const [consent, setConsent] = useState<CookieConsent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      const stored = getCookieConsent();
      if (stored && hasValidConsent()) {
        setConsent(stored);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    }, []);

    const createConsent = (analytics: boolean, marketing: boolean): CookieConsent => ({
      technical: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
      version: '1.0'
    });

    const acceptAll = () => {
      const newConsent = createConsent(true, true);
      setCookieConsent(newConsent);
      setConsent(newConsent);
      setShowBanner(false);
      setShowSettings(false);
    };

    const rejectAll = () => {
      const newConsent = createConsent(false, false);
      setCookieConsent(newConsent);
      setConsent(newConsent);
      setShowBanner(false);
      setShowSettings(false);
    };

    const saveSettings = (partialConsent: Partial<CookieConsent>) => {
      const newConsent = createConsent(
        partialConsent.analytics ?? false,
        partialConsent.marketing ?? false
      );
      setCookieConsent(newConsent);
      setConsent(newConsent);
      setShowBanner(false);
      setShowSettings(false);
    };

    const openSettings = () => setShowSettings(true);
    const closeSettings = () => setShowSettings(false);

    // Evitar hydration mismatch
    if (!mounted) {
      return <>{children}</>;
    }

    return (
      <CookieContext.Provider value={{
        consent,
        showBanner,
        showSettings,
        acceptAll,
        rejectAll,
        saveSettings,
        openSettings,
        closeSettings
      }}>
        {children}
      </CookieContext.Provider>
    );
  }

  export function useCookieConsent() {
    const context = useContext(CookieContext);
    if (!context) {
      throw new Error('useCookieConsent must be used within CookieProvider');
    }
    return context;
  }
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` (si tomaste decisiones importantes):
     - id: "SL034"
       context: "Cookie consent storage"
       decision: "localStorage para persistir consentimiento con CookieContext"
       confidence: 0.95
       validated_in: "RGPD Compliance"

     En `blockers:` (si encontraste problemas):
     - Documentar cualquier blocker encontrado

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso sin errores de TypeScript

---

### FASE 1: Cookie Banner System

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Cookie Banner (3 capas AEPD)",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL015 (VitaEonCard), SL032 (dark theme)
     - file_patterns_discovered: components/ui/, components/magicui/

  2. Leer archivos de referencia:
     - components/ui/Button.tsx (patron de botones)
     - components/ui/VitaEonCard.tsx (estilo glassmorphism)

  # CONTEXTO

  - AEPD Guidelines 2023 requiere:
    - Boton ACEPTAR y RECHAZAR al MISMO nivel visual
    - Mismo color, tamano, contraste
    - Link a configuracion (2da capa)
    - NO pre-marcar opciones

  # TAREA

  Crear el sistema completo de banner de cookies:

  ## Archivos a crear:

  ### 1. components/cookies/CookieBanner.tsx
  ```typescript
  'use client';

  import { useCookieConsent } from './CookieContext';
  import { Button } from '@/components/ui/Button';
  import Link from 'next/link';
  import { CookieSettingsModal } from './CookieSettingsModal';

  export function CookieBanner() {
    const { showBanner, showSettings, acceptAll, rejectAll, openSettings } = useCookieConsent();

    if (!showBanner && !showSettings) return null;

    return (
      <>
        {showBanner && (
          <div
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
            role="dialog"
            aria-label="Configuracion de cookies"
            aria-modal="false"
          >
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1 text-sm text-slate-300">
                <p className="mb-2">
                  <strong className="text-white">Utilizamos cookies</strong> propias y de terceros para mejorar
                  tu experiencia, analizar el trafico y personalizar contenidos.
                </p>
                <p>
                  Puedes aceptar todas, rechazarlas o configurar tus preferencias.
                  <Link
                    href="/politica-cookies"
                    className="text-blue-400 hover:text-blue-300 underline ml-1"
                  >
                    Mas informacion
                  </Link>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {/* IMPORTANTE: Botones al mismo nivel visual - AEPD compliance */}
                <Button
                  variant="secondary"
                  onClick={rejectAll}
                  className="min-w-[140px]"
                >
                  Rechazar todo
                </Button>
                <Button
                  variant="secondary"
                  onClick={openSettings}
                  className="min-w-[140px]"
                >
                  Configurar
                </Button>
                <Button
                  variant="primary"
                  onClick={acceptAll}
                  className="min-w-[140px]"
                >
                  Aceptar todo
                </Button>
              </div>
            </div>
          </div>
        )}

        <CookieSettingsModal />
      </>
    );
  }
  ```

  ### 2. components/cookies/CookieSettingsModal.tsx
  Modal de 2da capa con toggles por categoria.
  - Usar VitaEonCard para el contenedor
  - Toggle para cada categoria (tecnicas siempre ON y disabled)
  - Botones: "Solo necesarias", "Guardar configuracion"

  ### 3. components/cookies/CookieDetailsList.tsx
  Tabla/lista de cookies para 3ra capa.
  - Nombre, proveedor, finalidad, duracion
  - Importar desde COOKIES_CONFIG

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe con archivos creados
  2. Actualizar frontend.yaml:
     - SL035: "CookieBanner AEPD-compliant con botones mismo nivel"
     - SL036: "CookieSettingsModal con toggles por categoria"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run dev`
- Criterio: Banner visible, botones funcionan, modal abre/cierra

---

### FASE 2: Paginas Legales

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Paginas de Politicas",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL001 (Tailwind 4 @theme), SL003 (smooth scroll)
     - file_patterns_discovered: app/**/*.tsx para estructura de paginas

  2. Leer archivos de referencia:
     - app/page.tsx (estructura de pagina)
     - app/layout.tsx (layout compartido)

  # CONTEXTO

  - RGPD Art. 13: Informacion obligatoria en politica de privacidad
  - LSSI Art. 22.2: Contenido de politica de cookies
  - Datos del responsable: StudioTek (placeholder para datos reales)

  # TAREA

  Crear las paginas legales:

  ## Archivos a crear:

  ### 1. app/politica-cookies/page.tsx

  Estructura:
  1. Que son las cookies
  2. Tipos de cookies (por finalidad, origen, duracion)
  3. Cookies que utilizamos (tabla con COOKIES_CONFIG)
  4. Como gestionar cookies (browser settings)
  5. Actualizaciones de la politica

  Estilo: Reutilizar BlurFade, fondo dark gradient

  ### 2. app/politica-privacidad/page.tsx

  Contenido RGPD Art. 13 completo:

  1. IDENTIDAD DEL RESPONSABLE
     - Nombre: StudioTek (o razon social)
     - CIF: [PLACEHOLDER]
     - Direccion: [PLACEHOLDER]
     - Email: contacto@studiotek.es

  2. FINALIDADES DEL TRATAMIENTO
     - Gestionar consultas del formulario de contacto
     - Enviar comunicaciones comerciales (si consiente)
     - Analizar uso del sitio web (si acepta cookies analiticas)

  3. BASE JURIDICA
     - Consentimiento (Art. 6.1.a RGPD) - comunicaciones
     - Interes legitimo (Art. 6.1.f) - responder consultas

  4. DESTINATARIOS
     - Proveedor de hosting
     - No cedemos datos a terceros

  5. TRANSFERENCIAS INTERNACIONALES
     - Si aplica (ej: Vercel USA)

  6. PLAZO DE CONSERVACION
     - Datos contacto: mientras dure relacion + periodo legal
     - Consentimiento marketing: hasta revocacion

  7. DERECHOS (ARSOPOL)
     - Acceso, Rectificacion, Supresion
     - Oposicion, Portabilidad, Limitacion
     - Como ejercerlos: email a [EMAIL]

  8. RECLAMACION AEPD
     - www.aepd.es
     - C/ Jorge Juan 6, 28001 Madrid

  9. ACTUALIZACIONES
     - Fecha ultima revision

  # POST-TAREA (OBLIGATORIO)

  1. Verificar navegacion a ambas paginas
  2. Actualizar frontend.yaml:
     - SL037: "Legal pages structure with BlurFade sections"
     - Agregar file_pattern: "app/politica-*/page.tsx"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Ambas paginas accesibles en /politica-cookies y /politica-privacidad

---

### FASE 3: Actualizacion ContactForm

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Formulario con checkboxes legales",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL008 (forwardRef forms), SL009 (Zod), SL011 (a11y)
     - blockers: SLB003 (dark theme forms)

  2. Leer archivos existentes:
     - components/sections/ContactForm.tsx
     - components/ui/Input.tsx (patron de componentes form)
     - lib/validations.ts (schema actual)

  # CONTEXTO

  - RGPD requiere consentimiento explicito para tratar datos
  - LSSI Art. 21 requiere opt-in separado para comunicaciones comerciales
  - Checkboxes NO pueden estar pre-marcados

  # TAREA

  ## 1. Crear components/ui/Checkbox.tsx

  ```typescript
  'use client';

  import { forwardRef, InputHTMLAttributes } from 'react';
  import { cn } from '@/lib/utils';

  interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: React.ReactNode;
    error?: string;
  }

  export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, error, id, ...props }, ref) => {
      const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

      return (
        <div className="flex flex-col gap-1">
          <label
            htmlFor={inputId}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              className={cn(
                "mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800/50",
                "text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900",
                "cursor-pointer",
                error && "border-red-500",
                className
              )}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
            <span className="text-sm text-slate-300 group-hover:text-slate-200">
              {label}
            </span>
          </label>
          {error && (
            <p
              id={`${inputId}-error`}
              className="text-sm text-red-400 ml-7"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      );
    }
  );

  Checkbox.displayName = 'Checkbox';
  ```

  ## 2. Actualizar lib/validations.ts

  Agregar campos al schema:
  ```typescript
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar la politica de privacidad para enviar el formulario' })
  }),
  commercialAccepted: z.boolean().optional().default(false),
  ```

  ## 3. Modificar components/sections/ContactForm.tsx

  Agregar despues del campo "message":

  ```tsx
  {/* Primera capa informativa RGPD */}
  <div className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg">
    <p><strong>Responsable:</strong> StudioTek</p>
    <p><strong>Finalidad:</strong> Gestionar tu consulta y, si lo autorizas, enviarte comunicaciones comerciales</p>
    <p><strong>Derechos:</strong> Acceso, rectificacion, supresion, oposicion, portabilidad, limitacion</p>
    <p><strong>Mas info:</strong> <Link href="/politica-privacidad" className="text-blue-400 hover:underline">Politica de Privacidad</Link></p>
  </div>

  {/* Checkbox privacidad - OBLIGATORIO */}
  <Checkbox
    {...register('privacyAccepted')}
    label={
      <>
        He leido y acepto la{' '}
        <Link href="/politica-privacidad" className="text-blue-400 hover:underline">
          Politica de Privacidad
        </Link>
        {' '}*
      </>
    }
    error={errors.privacyAccepted?.message}
  />

  {/* Checkbox comunicaciones - OPCIONAL */}
  <Checkbox
    {...register('commercialAccepted')}
    label="Deseo recibir comunicaciones comerciales sobre productos y servicios de StudioTek"
  />
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Verificar que form no envia sin checkbox privacidad
  2. Verificar que checkbox comercial es opcional
  3. Actualizar frontend.yaml:
     - SL038: "Checkbox component with forwardRef for react-hook-form"
     - SL039: "ContactForm RGPD compliant with privacy + commercial checkboxes"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Formulario valida checkbox privacidad, comercial es opcional

---

### FASE 4: Footer y Links

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 4: Footer con links legales",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - file_patterns_discovered: components/sections/Footer.tsx

  2. Leer archivo existente:
     - components/sections/Footer.tsx

  # CONTEXTO

  Los usuarios deben poder acceder facilmente a las politicas desde cualquier parte del sitio.

  # TAREA

  Modificar components/sections/Footer.tsx para agregar seccion de links legales:

  ```tsx
  // Agregar seccion "Legal" con links a:
  <div className="...">
    <h4 className="text-white font-semibold mb-4">Legal</h4>
    <ul className="space-y-2 text-slate-400">
      <li>
        <Link href="/politica-privacidad" className="hover:text-white transition">
          Politica de Privacidad
        </Link>
      </li>
      <li>
        <Link href="/politica-cookies" className="hover:text-white transition">
          Politica de Cookies
        </Link>
      </li>
    </ul>
  </div>
  ```

  Tambien agregar al footer copyright:
  ```tsx
  <p className="text-xs text-slate-500 mt-2">
    <button
      onClick={() => openCookieSettings()}
      className="hover:text-slate-400 underline"
    >
      Configurar cookies
    </button>
  </p>
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Verificar links funcionan
  2. Actualizar frontend.yaml:
     - SL040: "Footer legal section with privacy and cookies links"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev`
- Criterio: Links en footer navegan correctamente

---

### FASE 5: Integracion y Layout

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 5: Integracion en Layout",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - file_patterns_discovered: app/layout.tsx

  2. Leer archivo existente:
     - app/layout.tsx

  # CONTEXTO

  El CookieBanner debe estar disponible en todas las paginas.

  # TAREA

  Modificar app/layout.tsx:

  ```tsx
  import { CookieProvider } from '@/components/cookies/CookieContext';
  import { CookieBanner } from '@/components/cookies/CookieBanner';

  export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <body>
          <CookieProvider>
            <Header />
            {children}
            <Footer />
            <CookieBanner />
          </CookieProvider>
        </body>
      </html>
    );
  }
  ```

  Asegurarse de:
  - CookieProvider envuelve todo el contenido
  - CookieBanner esta DESPUES del Footer (para z-index correcto)
  - lang="es" en el html tag

  # POST-TAREA (OBLIGATORIO)

  1. Verificar banner aparece en todas las paginas
  2. Actualizar frontend.yaml:
     - SL041: "CookieProvider wraps entire app in layout.tsx"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run dev`
- Criterio: Banner visible en home y paginas legales

---

### FASE 6: Validacion y QA

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 6: Validacion QA",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml` (si existe)
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  Validar compliance AEPD y funcionamiento correcto.

  # TAREA

  ## Checklist de Validacion:

  ### Build
  - [ ] `npm run build` sin errores
  - [ ] `npm run lint` sin errores criticos

  ### Cookie Banner (AEPD Compliance)
  - [ ] Banner visible al cargar pagina (sin consent previo)
  - [ ] Boton "Aceptar todo" y "Rechazar todo" MISMO TAMANO
  - [ ] Boton "Aceptar todo" y "Rechazar todo" MISMO COLOR de fondo
  - [ ] Botones al mismo nivel (no uno mas destacado que otro)
  - [ ] Link "Mas informacion" lleva a /politica-cookies
  - [ ] Banner desaparece tras aceptar
  - [ ] Banner desaparece tras rechazar
  - [ ] Banner NO aparece al recargar si ya hay consent

  ### Modal Configuracion
  - [ ] Modal abre al click "Configurar"
  - [ ] Toggle "Tecnicas" siempre ON y deshabilitado
  - [ ] Toggles "Analiticas" y "Marketing" OFF por defecto
  - [ ] "Guardar configuracion" cierra modal y oculta banner

  ### Paginas Legales
  - [ ] /politica-cookies carga correctamente
  - [ ] /politica-privacidad carga correctamente
  - [ ] Ambas tienen estilo consistente con landing
  - [ ] Links internos funcionan

  ### ContactForm
  - [ ] Checkbox privacidad NO esta pre-marcado
  - [ ] Checkbox comercial NO esta pre-marcado
  - [ ] Form NO envia sin aceptar privacidad
  - [ ] Form SI envia sin marcar comercial
  - [ ] Mensaje de error visible si falta checkbox

  ### Footer
  - [ ] Link "Politica de Privacidad" funciona
  - [ ] Link "Politica de Cookies" funciona
  - [ ] Link/boton "Configurar cookies" abre modal

  ## Resultado

  Si TODOS los checks pasan: OUTPUT "RGPD COMPLIANCE COMPLETE"
  Si alguno falla: Documentar y volver a FASE correspondiente

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe de QA
  2. Si hay problemas, crear tasks de fix
  3. Actualizar testing.yaml si existe:
     - Agregar test checklist para RGPD
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: TODOS los checks del checklist pasados

---

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | 0 | Build exitoso | `npm run build` |
| CP1 | 1 | Banner funcional | `npm run dev` + test visual |
| CP2 | 2 | Paginas accesibles | `curl localhost:3000/politica-*` |
| CP3 | 3 | Form valida | Test manual submit |
| CP4 | 4 | Links footer | Click test |
| CP5 | 5 | Layout integrado | `npm run build` |
| CP6 | 6 | QA completo | Checklist 100% |

---

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Botones no al mismo nivel visual | ALTO (multa AEPD) | Test visual obligatorio, mismas clases CSS |
| Pre-checked checkboxes | ALTO (invalida consentimiento) | defaultChecked={false}, QA check |
| Falta info 1ra capa | MEDIO | Template AEPD-compliant |
| Duracion cookie > 13 meses | MEDIO | COOKIE_MAX_AGE_DAYS = 395 |
| Links rotos | BAJO | Test navegacion |
| Modal no accesible | MEDIO | role="dialog", aria-modal, focus trap |
| Hydration mismatch | MEDIO | 'use client' + mounted state |

---

## Ralph Wiggum Configuration

```yaml
loop: true
max_iterations: 50
completion_promise: "RGPD COMPLIANCE COMPLETE"
overnight: false

retry_rules:
  - on_fail: "build"
    retry_from: "FASE 0"
  - on_fail: "lint"
    retry_from: "FASE 5"
  - on_fail: "qa_checklist"
    retry_from: "FASE correspondiente"

max_retries_per_phase: 3
```

---

## References

- AEPD Cookie Guidelines 2023: https://www.aepd.es/guias/cookies
- RGPD Art. 13: Informacion al interesado
- LOPDGDD Art. 11: Transparencia e informacion
- LSSI Art. 21: Comunicaciones comerciales
- LSSI Art. 22.2: Cookies

---

**Generado por:** /plan-task v3.2
**Fecha:** 2026-01-14
**Workflow ID:** 2026-01-14_rgpd-lopdgdd-compliance
