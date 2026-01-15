# Plan: PRD StudioTek Landing Page

> **Generado:** 2026-01-13
> **Dominio:** frontend
> **Target:** Repo separado (StudioTek-landing)

## Purpose

Crear un PRD (Product Requirements Document) completo y ejecutable para la Landing Page de StudioTek, una agencia de automatizacion e IA. El documento debe ser autocontenido y permitir que otra sesion de Claude Code lo ejecute desde cero en un repositorio nuevo.

## Output

Un archivo PRD ejecutable con:
- Especificaciones de diseno completas
- Contenido/copy en espanol
- Estructura tecnica detallada
- Fases de implementacion claras
- Criterios de aceptacion

---

# PRD: StudioTek Landing Page

## 1. Overview

### 1.1 Company
**StudioTek** - Agencia de automatizacion y consultoria en Inteligencia Artificial

### 1.2 Product
Landing page para generacion de leads dirigida a PYMEs espanolas que necesitan automatizar procesos para reducir costos operativos.

### 1.3 Goals
| Goal | Metric | Target |
|------|--------|--------|
| Lead Generation | Form submissions/month | 50+ |
| Engagement | Time on page | >2 min |
| Performance | Lighthouse score | >90 |
| Conversion | Visitor → Lead | >3% |

---

## 2. Design Specifications

### 2.1 Visual Style
- **Estilo:** Minimalista moderno
- **Fondo:** Claro (blanco/gris muy suave)
- **Acentos:** Azul tecnologico
- **Logo:** Existente (proporcionado)

### 2.2 Color Palette

```css
/* Primary */
--primary: #0066FF;
--primary-hover: #0052CC;
--primary-light: #E6F0FF;

/* Neutrals */
--background: #FFFFFF;
--surface: #F8FAFC;
--text-primary: #1E293B;
--text-secondary: #64748B;
--border: #E2E8F0;

/* Feedback */
--success: #10B981;
--error: #EF4444;
```

**Tailwind Config:**
```javascript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          hover: '#0052CC',
          light: '#E6F0FF',
        },
      },
    },
  },
}
```

### 2.3 Typography

| Element | Size | Weight | Line Height | Tailwind Class |
|---------|------|--------|-------------|----------------|
| H1 (Hero) | 48px | Bold | 1.25 | text-5xl font-bold |
| H2 (Section) | 36px | Semibold | 1.22 | text-4xl font-semibold |
| H3 (Card) | 24px | Semibold | 1.33 | text-2xl font-semibold |
| Body | 16px | Regular | 1.5 | text-base |
| Small | 14px | Regular | 1.43 | text-sm |

**Font:** Inter (via next/font/google)

### 2.4 Spacing

| Element | Desktop | Mobile | Tailwind |
|---------|---------|--------|----------|
| Section padding | 80px | 48px | py-20 md:py-12 |
| Container | 1280px max | 100% | max-w-7xl mx-auto px-4 |
| Card gap | 32px | 24px | gap-8 md:gap-6 |
| Element spacing | 8px units | 8px units | space-y-2, space-y-4, etc |

### 2.5 Components

**Buttons:**
```jsx
// Primary Button
className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"

// Secondary Button
className="border border-primary text-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors duration-200"
```

**Cards:**
```jsx
className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
```

**Inputs:**
```jsx
className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
```

---

## 3. Content (Spanish Copy)

### 3.1 Hero Section

```yaml
headline: "Automatiza tu negocio con Inteligencia Artificial"
subheadline: "Ayudamos a PYMEs a reducir costes y escalar operaciones mediante soluciones de IA personalizadas"
cta_primary: "Solicita una consulta gratuita"
cta_secondary: "Ver servicios"
```

### 3.2 Benefits Section

```yaml
section_title: "Por que automatizar"
section_subtitle: "La automatizacion inteligente transforma tu negocio"

benefits:
  - title: "Ahorro de Costes"
    description: "Reduce hasta un 40% los costes operativos automatizando tareas repetitivas y liberando tiempo de tu equipo para lo que realmente importa."
    icon: "piggy-bank" # Lucide icon

  - title: "Eficiencia Operativa"
    description: "Optimiza tus procesos con flujos de trabajo inteligentes que eliminan errores y reducen tiempos de ejecucion."
    icon: "zap"

  - title: "Escalabilidad"
    description: "Crece sin aumentar proporcionalmente tu equipo. La automatizacion te permite atender mas clientes con los mismos recursos."
    icon: "trending-up"
```

### 3.3 Services Section

```yaml
section_title: "Nuestros Servicios"
section_subtitle: "Soluciones adaptadas a las necesidades de tu negocio"

services:
  - title: "Implementacion de IA"
    description: "Desplegamos soluciones de automatizacion e inteligencia artificial adaptadas a las necesidades especificas de tu negocio."
    icon: "rocket"

  - title: "Consultoria Estrategica"
    description: "Analizamos tus procesos actuales e identificamos oportunidades de mejora con un roadmap claro de implementacion."
    icon: "lightbulb"

  - title: "Formacion y Capacitacion"
    description: "Formamos a tu equipo en el uso de herramientas de IA para maximizar el retorno de tu inversion."
    icon: "graduation-cap"
```

### 3.4 Contact Form Section

```yaml
section_title: "Hablemos de tu proyecto"
section_subtitle: "Cuentanos sobre tu negocio y te contactaremos en menos de 24 horas"

fields:
  - name: "nombre"
    label: "Nombre"
    type: "text"
    placeholder: "Tu nombre"
    required: true

  - name: "email"
    label: "Email"
    type: "email"
    placeholder: "tu@empresa.com"
    required: true

  - name: "empresa"
    label: "Empresa"
    type: "text"
    placeholder: "Nombre de tu empresa"
    required: true

  - name: "presupuesto"
    label: "Presupuesto estimado"
    type: "select"
    required: true
    options:
      - value: "menos-3000"
        label: "Menos de 3.000 EUR"
      - value: "3000-10000"
        label: "3.000 EUR - 10.000 EUR"
      - value: "10000-25000"
        label: "10.000 EUR - 25.000 EUR"
      - value: "25000-50000"
        label: "25.000 EUR - 50.000 EUR"
      - value: "mas-50000"
        label: "Mas de 50.000 EUR"
      - value: "no-seguro"
        label: "No estoy seguro"

  - name: "mensaje"
    label: "Mensaje"
    type: "textarea"
    placeholder: "Cuentanos brevemente que necesitas..."
    required: false

submit_button: "Enviar mensaje"
success_message: "Gracias por contactarnos. Te responderemos en menos de 24 horas."
error_message: "Ha ocurrido un error. Por favor, intentalo de nuevo."
```

### 3.5 Footer

```yaml
company_name: "StudioTek"
tagline: "Automatizacion e Inteligencia Artificial"
contact_email: "comunicacion@StudioTek.es"
copyright: "2026 StudioTek. Todos los derechos reservados."

links:
  - label: "Politica de Privacidad"
    href: "/privacidad"
  - label: "Aviso Legal"
    href: "/legal"
```

---

## 4. Technical Specifications

### 4.1 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x (App Router) | Framework |
| React | 18.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| Resend | Latest | Email Service |
| Zod | Latest | Validation |
| React Hook Form | Latest | Form Handling |
| Lucide React | Latest | Icons |

### 4.2 Project Structure

```
StudioTek-landing/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page (landing)
│   ├── globals.css             # Tailwind + custom styles
│   ├── privacidad/
│   │   └── page.tsx            # Privacy policy (placeholder)
│   ├── legal/
│   │   └── page.tsx            # Legal notice (placeholder)
│   └── api/
│       └── contact/
│           └── route.ts        # Form submission API
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   ├── sections/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Benefits.tsx
│   │   ├── Services.tsx
│   │   ├── ContactForm.tsx
│   │   └── Footer.tsx
│   └── icons/
│       └── index.tsx           # Re-export Lucide icons
├── lib/
│   ├── email.ts                # Resend integration
│   └── validations.ts          # Zod schemas
├── public/
│   ├── logo.svg                # Company logo
│   └── og-image.png            # Open Graph image (1200x630)
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local                  # Environment variables
```

### 4.3 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "resend": "^2.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@tailwindcss/forms": "^0.5.0"
  }
}
```

---

## 5. Implementation Phases

### PHASE 1: Project Setup (30 min)

**Agente:** @frontend

**Tasks:**
1. Create Next.js project:
   ```bash
   npx create-next-app@latest StudioTek-landing --typescript --tailwind --eslint --app --src-dir=false
   ```

2. Install dependencies:
   ```bash
   npm install resend zod react-hook-form @hookform/resolvers lucide-react
   npm install -D @tailwindcss/forms
   ```

3. Configure tailwind.config.ts with custom colors

4. Setup Inter font in layout.tsx using next/font

5. Create folder structure

**Checkpoint:** `npm run dev` starts without errors

---

### PHASE 2: Layout and Header (20 min)

**Agente:** @frontend

**Tasks:**
1. Create root layout.tsx with:
   - Inter font
   - SEO metadata
   - Body structure

2. Create Header.tsx:
   - Fixed/sticky header
   - Logo (left)
   - CTA button (right)
   - Transparent → solid on scroll

3. Create Footer.tsx:
   - Logo and tagline
   - Contact email
   - Legal links
   - Copyright

**Checkpoint:** Header and Footer render correctly

---

### PHASE 3: Hero Section (30 min)

**Agente:** @frontend

**Tasks:**
1. Create Hero.tsx component:
   - Full viewport height (min-h-screen)
   - Gradient or abstract background
   - Headline (H1)
   - Subheadline
   - Two CTA buttons (primary + secondary)

2. Implement smooth scroll to contact form

3. Responsive design:
   - Desktop: Large text, centered
   - Mobile: Smaller text, stacked CTAs

**Checkpoint:** Hero displays correctly on desktop and mobile

---

### PHASE 4: Benefits Section (25 min)

**Agente:** @frontend

**Tasks:**
1. Create Benefits.tsx component:
   - Section title and subtitle
   - 3-column grid (1 column on mobile)
   - Benefit cards with icons

2. Create Card.tsx UI component

3. Implement hover animations

**Checkpoint:** Benefits section with 3 cards renders correctly

---

### PHASE 5: Services Section (25 min)

**Agente:** @frontend

**Tasks:**
1. Create Services.tsx component:
   - Section title and subtitle
   - 3-column grid
   - Service cards with icons

2. Add subtle background color differentiation

3. Implement hover effects

**Checkpoint:** Services section displays correctly

---

### PHASE 6: Contact Form (45 min)

**Agente:** @frontend

**Tasks:**
1. Create form UI components:
   - Input.tsx
   - Select.tsx
   - Textarea.tsx

2. Create ContactForm.tsx:
   - Form layout (2 columns on desktop)
   - All fields with labels
   - Validation with Zod + react-hook-form

3. Create lib/validations.ts:
   ```typescript
   import { z } from 'zod';

   export const contactSchema = z.object({
     nombre: z.string().min(2, 'El nombre es requerido'),
     email: z.string().email('Email invalido'),
     empresa: z.string().min(2, 'La empresa es requerida'),
     presupuesto: z.string().min(1, 'Selecciona un presupuesto'),
     mensaje: z.string().optional(),
   });
   ```

4. Create API route app/api/contact/route.ts:
   - Validate input
   - Send email via Resend
   - Return success/error

5. Create lib/email.ts:
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function sendContactEmail(data: ContactFormData) {
     return resend.emails.send({
       from: 'StudioTek <noreply@StudioTek.es>',
       to: process.env.CONTACT_EMAIL!,
       subject: `Nuevo contacto: ${data.nombre} - ${data.empresa}`,
       html: `...email template...`,
     });
   }
   ```

6. Implement loading state and success/error feedback

**Checkpoint:** Form submits and email is received at comunicacion@StudioTek.es

---

### PHASE 7: Polish and Deploy (30 min)

**Agente:** @frontend

**Tasks:**
1. Add scroll animations (optional - CSS only or framer-motion)

2. Test responsive design on all breakpoints

3. Run Lighthouse audit and fix issues

4. Configure Vercel:
   - Connect GitHub repo
   - Set environment variables
   - Deploy

5. Configure custom domain (if needed)

6. Test live form submission

**Checkpoint:**
- Lighthouse score > 90
- Form works in production
- Site loads under 3 seconds

---

## 6. SEO & Metadata

### 6.1 Meta Tags

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'StudioTek | Automatizacion e Inteligencia Artificial para PYMEs',
  description: 'Ayudamos a empresas espanolas a automatizar procesos y reducir costes con soluciones de IA personalizadas. Consultoria, implementacion y formacion.',
  keywords: ['automatizacion', 'inteligencia artificial', 'IA', 'PYME', 'reduccion costes', 'eficiencia', 'consultoria'],
  authors: [{ name: 'StudioTek' }],
  openGraph: {
    title: 'StudioTek | Automatizacion e IA para PYMEs',
    description: 'Soluciones de automatizacion e inteligencia artificial para empresas espanolas',
    url: 'https://StudioTek.es',
    siteName: 'StudioTek',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudioTek - Automatizacion e IA',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioTek | Automatizacion e IA para PYMEs',
    description: 'Soluciones de automatizacion e inteligencia artificial para empresas espanolas',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### 6.2 Structured Data

```typescript
// JSON-LD for Organization
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'StudioTek',
  description: 'Agencia de automatizacion e inteligencia artificial',
  url: 'https://StudioTek.es',
  email: 'comunicacion@StudioTek.es',
  areaServed: 'ES',
  serviceType: ['Consultoria IA', 'Automatizacion', 'Formacion'],
};
```

---

## 7. Environment Variables

### 7.1 Local Development (.env.local)

```bash
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=comunicacion@StudioTek.es

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7.2 Production (Vercel)

| Variable | Value | Description |
|----------|-------|-------------|
| `RESEND_API_KEY` | `re_xxx...` | Resend API key |
| `CONTACT_EMAIL` | `comunicacion@StudioTek.es` | Where to send form submissions |
| `NEXT_PUBLIC_SITE_URL` | `https://StudioTek.es` | Production URL |

---

## 8. Deployment

### 8.1 Vercel Setup

1. Connect GitHub repository to Vercel
2. Framework preset: Next.js (auto-detected)
3. Build settings: Default
4. Environment variables: Add all from section 7.2

### 8.2 Domain Configuration

If using custom domain:
1. Add domain in Vercel dashboard
2. Configure DNS records in DonDominio:
   - A record: `76.76.21.21` (Vercel)
   - CNAME www: `cname.vercel-dns.com`

### 8.3 Post-Deployment Checklist

- [ ] SSL certificate active
- [ ] Form submission works
- [ ] Email received at comunicacion@StudioTek.es
- [ ] Mobile responsive
- [ ] Lighthouse score > 90
- [ ] OG image displays correctly (Facebook debugger)
- [ ] Google Search Console submitted

---

## 9. Acceptance Criteria

### 9.1 Functional

| Criteria | Test |
|----------|------|
| Hero displays correctly | Visual inspection |
| Benefits section shows 3 cards | Visual inspection |
| Services section shows 3 cards | Visual inspection |
| Form validates all required fields | Submit empty form |
| Form shows error for invalid email | Enter "abc" in email |
| Form submits successfully | Fill all fields, submit |
| Email received | Check comunicacion@StudioTek.es |
| Success message displays | After form submit |
| Navigation works | Click "Ver servicios" |

### 9.2 Non-Functional

| Criteria | Target | Tool |
|----------|--------|------|
| Performance (LCP) | < 2.5s | Lighthouse |
| Performance (FID) | < 100ms | Lighthouse |
| Performance (CLS) | < 0.1 | Lighthouse |
| Accessibility | WCAG 2.1 AA | Lighthouse |
| SEO Score | > 90 | Lighthouse |
| Mobile Responsive | All breakpoints | Manual test |

---

## 10. Quick Start for Claude Code

Para ejecutar este PRD en una nueva sesion de Claude Code:

```bash
# 1. Create project
npx create-next-app@latest StudioTek-landing --typescript --tailwind --eslint --app --src-dir=false

# 2. Navigate and install
cd StudioTek-landing
npm install resend zod react-hook-form @hookform/resolvers lucide-react
npm install -D @tailwindcss/forms

# 3. Start development
npm run dev
```

Luego, seguir las fases 2-7 en orden, creando los componentes segun las especificaciones de este documento.

---

**PRD Version:** 1.0
**Created:** 2026-01-13
**Author:** Claude Code
**Status:** READY FOR EXECUTION
