// ---------------------------------------------------------------------------
// Surface Layout — Continuous horizontal surface (vicio.com style)
// ---------------------------------------------------------------------------
// All elements are positioned absolutely on a 500vw x 100vh surface.
// Coordinates: x in vw, y in vh. Parallax speed: 1 = normal, <1 = background, >1 = foreground.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SURFACE_WIDTH = 500; // in vw
export const SURFACE_HEIGHT = 100; // in vh

// ---------------------------------------------------------------------------
// Type System — Discriminated Unions
// ---------------------------------------------------------------------------

export type ElementType =
  | 'headline'
  | 'image'
  | 'copy'
  | 'stat-watermark'
  | 'stat-ticker'
  | 'badge'
  | 'cta-headline'
  | 'cta-button'
  | 'cta-link';

export type Zone = 'ahorro' | 'clientes' | 'satisfaccion' | 'cta';

// --- Attribution link ---

export interface AttributionLink {
  text: string;
  url: string;
}

// --- Content interfaces per element type ---

export interface HeadlineContent {
  text: string;
}

export interface ImageContent {
  src: string;
  alt: string;
  width: number; // in vw
}

export interface CopyContent {
  text: string;
  maxWidth: number; // in vw
  attribution?: AttributionLink[];
}

export interface StatContent {
  value: number;
  suffix: string;
  label: string;
  attribution?: AttributionLink[];
}

export interface CTAContent {
  text: string;
  href?: string;
}

export interface BadgeContent {
  label: string;
}

// --- Discriminated union: SurfaceElement ---

interface BaseElement {
  id: string;
  zone: Zone;
  x: number; // position in vw
  y: number; // position in vh
  parallaxSpeed: number; // 1 = normal, <1 = slow (background), >1 = fast (foreground)
  zIndex: number;
  rotation?: string; // CSS rotate value
  opacity?: number; // 0-1, defaults to 1
}

interface HeadlineElement extends BaseElement {
  type: 'headline';
  content: HeadlineContent;
}

interface ImageElement extends BaseElement {
  type: 'image';
  content: ImageContent;
}

interface CopyElement extends BaseElement {
  type: 'copy';
  content: CopyContent;
}

interface StatWatermarkElement extends BaseElement {
  type: 'stat-watermark';
  content: StatContent;
}

interface StatTickerElement extends BaseElement {
  type: 'stat-ticker';
  content: StatContent;
}

interface BadgeElement extends BaseElement {
  type: 'badge';
  content: BadgeContent;
}

interface CTAHeadlineElement extends BaseElement {
  type: 'cta-headline';
  content: CTAContent;
}

interface CTAButtonElement extends BaseElement {
  type: 'cta-button';
  content: CTAContent;
}

interface CTALinkElement extends BaseElement {
  type: 'cta-link';
  content: CTAContent;
}

export type SurfaceElement =
  | HeadlineElement
  | ImageElement
  | CopyElement
  | StatWatermarkElement
  | StatTickerElement
  | BadgeElement
  | CTAHeadlineElement
  | CTAButtonElement
  | CTALinkElement;

// ---------------------------------------------------------------------------
// Surface Elements Array (~24 elements across 4 zones + 2 bridge badges)
// ---------------------------------------------------------------------------

export const surfaceElements: SurfaceElement[] = [
  // =========================================================================
  // ZONE: AHORRO (0-150vw)
  // =========================================================================
  {
    id: 'ahorro-headline',
    type: 'headline',
    zone: 'ahorro',
    x: 5,
    y: 8,
    parallaxSpeed: 1.0,
    zIndex: 20,
    content: {
      text: 'AHORRA\n2.500 EUR.\nCADA MES.',
    },
  },
  {
    id: 'ahorro-img-dashboard',
    type: 'image',
    zone: 'ahorro',
    x: 65,
    y: 8,
    parallaxSpeed: 0.8,
    zIndex: 10,
    rotation: '-2deg',
    content: {
      src: '/images/generated/benefit-ahorro-dashboard.webp',
      alt: 'Dashboard de ahorro con graficas descendentes de costes',
      width: 38,
    },
  },
  {
    id: 'ahorro-img-equipo',
    type: 'image',
    zone: 'ahorro',
    x: 32,
    y: 58,
    parallaxSpeed: 1.15,
    zIndex: 5,
    rotation: '3deg',
    content: {
      src: '/images/generated/benefit-ahorro-equipo.webp',
      alt: 'Equipo trabajando eficientemente sin tareas manuales',
      width: 28,
    },
  },
  {
    id: 'ahorro-copy-1',
    type: 'copy',
    zone: 'ahorro',
    x: 6,
    y: 76,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      text: 'Si tu equipo pierde 12 horas a la semana en tareas manuales, no es un problema de personas. Es un problema de procesos.',
      maxWidth: 22,
      attribution: [
        { text: 'HR Magazine, 2024', url: 'https://www.businesswire.com/news/home/20170628005817/en/Office-workers-lose-a-third-of-their-work-time-to-admin-according-to-independent-research' },
        { text: 'Smartsheet, 2024', url: 'https://www.smartsheet.com/content-center/product-news/automation/workers-waste-quarter-work-week-manual-repetitive-tasks' },
      ],
    },
  },
  {
    id: 'ahorro-copy-2',
    type: 'copy',
    zone: 'ahorro',
    x: 68,
    y: 72,
    parallaxSpeed: 0.9,
    zIndex: 15,
    content: {
      text: 'Automatizamos lo repetitivo. Tu equipo se enfoca en lo que genera ingresos reales.',
      maxWidth: 20,
    },
  },
  {
    id: 'ahorro-stat-ticker',
    type: 'stat-ticker',
    zone: 'ahorro',
    x: 72,
    y: 85,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      value: 2500,
      suffix: 'EUR',
      label: 'ahorro medio/mes',
      attribution: [
        { text: 'McKinsey, 2024', url: 'https://www.makebot.ai/blog-en/mckinsey-report-how-generative-ai-is-reshaping-global-productivity-and-the-future-of-work' },
        { text: 'Deloitte, 2024', url: 'https://blogs.vorecol.com/blog-how-can-process-automation-significantly-reduce-operational-costs-and-improve-efficiency-151724' },
        { text: 'Kit Digital, Gob. España', url: 'https://www.acelerapyme.gob.es/en/kit-digital' },
      ],
    },
  },
  {
    id: 'ahorro-watermark',
    type: 'stat-watermark',
    zone: 'ahorro',
    x: 85,
    y: 60,
    parallaxSpeed: 0.6,
    zIndex: 0,
    content: {
      value: 2500,
      suffix: '',
      label: '2500',
    },
  },


  // =========================================================================
  // ZONE: CLIENTES (130-280vw)
  // =========================================================================
  {
    id: 'clientes-headline',
    type: 'headline',
    zone: 'clientes',
    x: 165,
    y: 5,
    parallaxSpeed: 1.0,
    zIndex: 20,
    content: {
      text: 'ATIENDE\n3X M\u00C1S.\nSIN CONTRATAR.',
    },
  },
  {
    id: 'clientes-img-chatbot',
    type: 'image',
    zone: 'clientes',
    x: 115,
    y: 28,
    parallaxSpeed: 0.75,
    zIndex: 10,
    rotation: '2deg',
    content: {
      src: '/images/generated/benefit-capacidad-chatbot.webp',
      alt: 'Mockup de chatbot WhatsApp con IA y badge 24/7',
      width: 35,
    },
  },
  {
    id: 'clientes-img-canales',
    type: 'image',
    zone: 'clientes',
    x: 190,
    y: 52,
    parallaxSpeed: 1.1,
    zIndex: 8,
    rotation: '-3deg',
    content: {
      src: '/images/generated/benefit-capacidad-canales-dark.webp',
      alt: 'Hub de IA conectando multiples canales de comunicacion',
      width: 30,
    },
  },
  {
    id: 'clientes-copy-1',
    type: 'copy',
    zone: 'clientes',
    x: 125,
    y: 15,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      text: 'Cada consulta sin responder es un cliente que llama a tu competencia.',
      maxWidth: 22,
    },
  },
  {
    id: 'clientes-copy-2',
    type: 'copy',
    zone: 'clientes',
    x: 230,
    y: 70,
    parallaxSpeed: 0.95,
    zIndex: 15,
    content: {
      text: 'Un asistente IA que responde 24/7, cualifica leads y agenda citas.',
      maxWidth: 20,
    },
  },
  {
    id: 'clientes-stat-ticker',
    type: 'stat-ticker',
    zone: 'clientes',
    x: 250,
    y: 82,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      value: 3,
      suffix: 'x',
      label: 'm\u00E1s capacidad',
      attribution: [
        { text: 'Gartner, 2025', url: 'https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290' },
        { text: 'HubSpot, 2024', url: 'https://blog.hubspot.com/service/customer-service-chatbots' },
      ],
    },
  },
  {
    id: 'clientes-watermark',
    type: 'stat-watermark',
    zone: 'clientes',
    x: 200,
    y: 55,
    parallaxSpeed: 0.55,
    zIndex: 0,
    content: {
      value: 3,
      suffix: 'x',
      label: '3x',
    },
  },

  // =========================================================================
  // ZONE: SATISFACCION (260-400vw)
  // =========================================================================
  {
    id: 'satisfaccion-headline',
    type: 'headline',
    zone: 'satisfaccion',
    x: 290,
    y: 6,
    parallaxSpeed: 1.0,
    zIndex: 20,
    content: {
      text: 'NUNCA\nPIERDAS UN\nCLIENTE.',
    },
  },
  {
    id: 'satisfaccion-img-reviews',
    type: 'image',
    zone: 'satisfaccion',
    x: 240,
    y: 10,
    parallaxSpeed: 0.8,
    zIndex: 20,
    rotation: '-1deg',
    content: {
      src: '/images/generated/benefit-satisfaccion-reviews-v2.webp',
      alt: 'Dashboard de NPS y metricas de satisfaccion del cliente',
      width: 40,
    },
  },
  {
    id: 'satisfaccion-img-retencion',
    type: 'image',
    zone: 'satisfaccion',
    x: 340,
    y: 50,
    parallaxSpeed: 1.2,
    zIndex: 8,
    rotation: '2deg',
    content: {
      src: '/images/generated/benefit-satisfaccion-retencion.webp',
      alt: 'Dashboard de retencion de clientes con metricas de fidelizacion',
      width: 40,
    },
  },
  {
    id: 'satisfaccion-img-nps',
    type: 'image',
    zone: 'satisfaccion',
    x: 300,
    y: 55,
    parallaxSpeed: 1.05,
    zIndex: 6,
    rotation: '-2deg',
    content: {
      src: '/images/generated/benefit-satisfaccion-nps.webp',
      alt: 'Gauge holografico de NPS al 98% con reviews de 5 estrellas',
      width: 25,
    },
  },
  {
    id: 'satisfaccion-copy-1',
    type: 'copy',
    zone: 'satisfaccion',
    x: 275,
    y: 72,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      text: 'El 95% de clientes reporta mayor satisfacci\u00F3n con atenci\u00F3n automatizada.',
      maxWidth: 22,
      attribution: [
        { text: 'IBM Think, 2024', url: 'https://agentiveaiq.com/blog/how-ai-is-revolutionizing-customer-service-in-2024' },
        { text: 'Zendesk, 2025', url: 'https://www.usepylon.com/blog/50-customer-support-statistics-trends-for-2025' },
      ],
    },
  },
  {
    id: 'satisfaccion-copy-2',
    type: 'copy',
    zone: 'satisfaccion',
    x: 365,
    y: 50,
    parallaxSpeed: 0.9,
    zIndex: 15,
    content: {
      text: 'Respuesta instant\u00E1nea.\nSin esperas.\nSin horarios.\nSin excusas.',
      maxWidth: 12,
    },
  },
  {
    id: 'satisfaccion-stat-ticker',
    type: 'stat-ticker',
    zone: 'satisfaccion',
    x: 370,
    y: 80,
    parallaxSpeed: 1.0,
    zIndex: 15,
    content: {
      value: 95,
      suffix: '%',
      label: 'satisfacci\u00F3n',
      attribution: [
        { text: 'IBM Think, 2024', url: 'https://agentiveaiq.com/blog/how-ai-is-revolutionizing-customer-service-in-2024' },
        { text: 'Zendesk CX Trends, 2025', url: 'https://www.usepylon.com/blog/50-customer-support-statistics-trends-for-2025' },
      ],
    },
  },
  {
    id: 'satisfaccion-watermark',
    type: 'stat-watermark',
    zone: 'satisfaccion',
    x: 330,
    y: 50,
    parallaxSpeed: 0.5,
    zIndex: 0,
    content: {
      value: 95,
      suffix: '%',
      label: '95%',
    },
  },

  // =========================================================================
  // ZONE: CTA (380-500vw)
  // =========================================================================

   {
    id: 'ahorro-img-automation',
    type: 'image',
    zone: 'ahorro',
    x: 352,
    y: 10,
    parallaxSpeed: 0.85,
    zIndex: 8,
    rotation: '2deg',
    content: {
      src: '/images/generated/benefit-ahorro-automation.webp',
      alt: 'Nodos de automatizacion de workflows conectados con IA',
      width: 35,
    },
  },

  {
    id: 'cta-img-background',
    type: 'image',
    zone: 'cta',
    x: 390,
    y: 5,
    parallaxSpeed: 0.85,
    zIndex: 1,
    opacity: 0.15,
    content: {
      src: '/images/generated/benefit-cta-launch.webp',
      alt: 'Equipo profesional analizando metricas de crecimiento holograficas',
      width: 90,
    },
  },
  {
    id: 'cta-headline',
    type: 'cta-headline',
    zone: 'cta',
    x: 430,
    y: 20,
    parallaxSpeed: 1.0,
    zIndex: 10,
    content: {
      text: 'SI HAS LLEGADO\nHASTA AQU\u00CD\nES PORQUE SABES QUE\nNECESITAS AUTOMATIZAR.',
    },
  },
  {
    id: 'cta-button',
    type: 'cta-button',
    zone: 'cta',
    x: 440,
    y: 60,
    parallaxSpeed: 1.0,
    zIndex: 25,
    content: {
      text: 'Empieza ahora',
      href: '#contacto',
    },
  },

  // =========================================================================
  // BRIDGE ELEMENTS (cross between zones)
  // =========================================================================
];

// ---------------------------------------------------------------------------
// Derived Constants
// ---------------------------------------------------------------------------

export const NUM_ELEMENTS = surfaceElements.length;
