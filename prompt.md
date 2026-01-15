# PROMPT: Apple Cards Carousel + Cookie Banner Fix

## Objetivo
Implementar mejoras en la landing de StudioTek con dos features principales.

## Variables
```yaml
PROJECT_NAME: 'StudioTek Landing - UX Improvements'
PROJECT_PATH: '/Users/cristianbejaranomendez/Documents/GitHub/studiotek-landing'
STACK: 'Next.js 16 + React 19 + Tailwind 4 + TypeScript'
```

---

## Feature 1: Cookie Banner - Fix Visibility

### Problema
Asegurar que el banner de cookies aparezca SIEMPRE para usuarios nuevos (cuando no hay consentimiento previo en localStorage).

### Estado Actual
```yaml
FILES:
  - 'components/cookies/CookieBanner.tsx'      # UI del banner
  - 'components/cookies/CookieContext.tsx'     # Provider con logica
  - 'lib/cookies.ts'                           # Funciones localStorage
  - 'lib/cookie-config.ts'                     # Configuracion
  - 'app/layout.tsx'                           # Monta el CookieProvider
```

### Logica Actual (CookieContext.tsx)
```tsx
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
```

### Requisitos
- Banner debe aparecer inmediatamente en primera visita
- NO debe haber flash/delay visible al cargar
- Debe respetar el consentimiento guardado
- Sin hydration mismatch
- Animacion suave al aparecer (fade-in desde abajo)

### Posibles Mejoras
1. Verificar si hay race condition entre mounted y showBanner
2. Considerar usar CSS para ocultar inicialmente y revelar con JS
3. Asegurar que el banner aparece ANTES del primer paint visible

---

## Feature 2: Apple Cards Carousel

### Fuente
https://ui.aceternity.com/components/apple-cards-carousel

### Descripcion
Carousel horizontal estilo Apple con cards que se expanden a fullscreen modal al clickear.

### Caracteristicas Tecnicas
```yaml
FEATURES:
  - Scroll/drag horizontal
  - Cards con imagen blur loading
  - Click para expandir a modal fullscreen
  - Layout animations con framer-motion
  - AnimatePresence para enter/exit
  - Responsive design
```

### Dependencias
```yaml
DEPENDENCIES:
  required:
    - 'framer-motion'  # Verificar si ya instalado
  hooks:
    - 'useOutsideClick'  # Para cerrar modal
```

### Estructura de Datos
```typescript
type Card = {
  src: string;           // URL de imagen
  title: string;         // Titulo de la card
  category: string;      // Categoria/tag
  content: React.ReactNode; // Contenido expandido
};

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

interface CardProps {
  card: Card;
  index: number;
  layout?: boolean;
}
```

### Componentes a Crear
```yaml
FILES_TO_CREATE:
  components/ui/:
    - 'AppleCarousel.tsx'     # Container principal
    - 'CarouselCard.tsx'      # Card individual expandible
    - 'BlurImage.tsx'         # Next/Image con blur loading

  hooks/:
    - 'useOutsideClick.ts'    # Detectar click fuera del modal
```

### Animaciones Clave (framer-motion)
```tsx
// Layout animations para transicion suave
<motion.div layout layoutId={`card-${card.title}`}>

// Exit animations para modal
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>

// Scroll container con drag
<motion.div
  className="flex overflow-x-scroll"
  drag="x"
  dragConstraints={containerRef}
/>
```

### Integracion Propuesta
Aplicar el carousel a la seccion **Services** existente:

```yaml
INTEGRATION:
  section: 'Services'
  current_file: 'components/sections/Services.tsx'
  services:
    - title: 'Consultorias de IA'
      category: 'Estrategia'
      content: 'Contenido expandido con mas detalles...'

    - title: 'Formaciones Personalizadas'
      category: 'Educacion'
      content: 'Contenido expandido...'

    - title: 'Automatizaciones Inteligentes'
      category: 'Desarrollo'
      content: 'Contenido expandido...'

    - title: 'Procesos de IA Personalizada'
      category: 'Innovacion'
      content: 'Contenido expandido...'
```

---

## Fases de Implementacion

### Fase 0: Verificacion y Setup (@infra)
```yaml
tasks:
  - Verificar package.json (framer-motion instalado?)
  - Revisar estado actual del cookie banner
  - Si falta framer-motion: npm install framer-motion
```

### Fase 1: Cookie Banner Fix (@frontend)
```yaml
tasks:
  - Analizar posible race condition en CookieContext
  - Implementar fix para visibilidad inmediata
  - Agregar animacion fade-in suave
  - Testing manual en incognito
```

### Fase 2: Hooks y Utilidades (@frontend)
```yaml
tasks:
  - Crear hooks/useOutsideClick.ts
  - Crear components/ui/BlurImage.tsx
```

### Fase 3: Carousel Components (@frontend)
```yaml
tasks:
  - Crear components/ui/CarouselCard.tsx
  - Crear components/ui/AppleCarousel.tsx
  - Implementar modal expandible con AnimatePresence
```

### Fase 4: Integracion Services (@frontend)
```yaml
tasks:
  - Adaptar data de Services al formato Card
  - Crear contenido expandido para cada servicio
  - Reemplazar grid por carousel en Services.tsx
  - Mantener responsive
```

### Fase 5: Polish y Testing (@testing)
```yaml
tasks:
  - Animaciones fluidas en todos los dispositivos
  - Responsive (mobile, tablet, desktop)
  - Keyboard navigation para accesibilidad
  - Build sin errores
```

---

## Criterios de Aceptacion

### Cookie Banner
- [ ] Banner aparece en primera visita (localStorage vacio)
- [ ] Banner NO aparece si ya hay consentimiento valido
- [ ] No hay hydration mismatch
- [ ] Animacion suave al aparecer

### Apple Cards Carousel
- [ ] Carousel horizontal con scroll/drag
- [ ] Cards expandibles a fullscreen modal
- [ ] Animaciones fluidas (layout, opacity, scale)
- [ ] Click fuera cierra el modal
- [ ] Responsive en todos los breakpoints
- [ ] Keyboard accessible (Escape cierra modal)

---

## Codigo de Referencia (Aceternity)

### useOutsideClick Hook
```typescript
import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
```

### BlurImage Pattern
```tsx
<Image
  src={src}
  alt={alt}
  fill
  className={cn(
    "object-cover transition-all duration-300",
    isLoaded ? "blur-0" : "blur-md"
  )}
  onLoad={() => setIsLoaded(true)}
/>
```

---

## Quick Reference

### URLs
- Local: http://localhost:3000
- Aceternity: https://ui.aceternity.com/components/apple-cards-carousel
- Motion Docs: https://motion.dev/docs

### Comandos
```bash
# Dev server
npm run dev

# Build
npm run build

# Instalar framer-motion (si falta)
npm install framer-motion
```

---

## Notas Adicionales

- Mantener consistencia con el design system existente (dark theme, gradients)
- Las Cards 3D actuales (`components/storytelling/Card3D.tsx`) pueden coexistir
- El carousel es para Services, no reemplaza PainPoints/Solution
- Priorizar performance: lazy loading, code splitting si necesario
