// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CopyBlock {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-right';
  text: string;
}

export interface ImageData {
  src: string;
  alt: string;
  position: string;
  size: 'large' | 'medium' | 'small';
  rotation: string;
  priority?: boolean;
}

export interface PanelData {
  id: string;
  headline: string;
  copyBlocks: CopyBlock[];
  stat: {
    value: number;
    suffix: string;
    label: string;
  };
  images: ImageData[];
  bgVariant: 'dark' | 'light';
  layoutVariant: 'editorial-left' | 'editorial-right' | 'editorial-center';
  watermarkValue: string;
}

// ---------------------------------------------------------------------------
// Size Classes Mapping
// ---------------------------------------------------------------------------

export const sizeClasses: Record<'large' | 'medium' | 'small', string> = {
  large: 'w-[35%] max-w-[450px]',
  medium: 'w-[28%] max-w-[350px]',
  small: 'w-[20%] max-w-[250px]',
};

// ---------------------------------------------------------------------------
// Panel Data
// ---------------------------------------------------------------------------

export const panels: PanelData[] = [
  {
    id: 'ahorro',
    headline: 'AHORRA\n2.500 EUR.\nCADA MES.',
    copyBlocks: [
      {
        position: 'top-left',
        text: 'Si tu equipo pierde 15 horas a la semana en tareas manuales, no es un problema de personas. Es un problema de procesos.',
      },
      {
        position: 'bottom-right',
        text: 'Automatizamos lo repetitivo. Tu equipo se enfoca en lo que genera ingresos reales.',
      },
    ],
    stat: { value: 2500, suffix: 'EUR', label: 'ahorro medio/mes' },
    images: [
      {
        src: '/images/generated/benefit-ahorro-dashboard.webp',
        alt: 'Dashboard de ahorro con gráficas descendentes de costes',
        position: 'top-[20%] right-[8%]',
        size: 'large',
        rotation: '-2deg',
        priority: true,
      },
      {
        src: '/images/generated/benefit-ahorro-equipo.webp',
        alt: 'Equipo trabajando eficientemente sin tareas manuales',
        position: 'bottom-[15%] left-[5%]',
        size: 'medium',
        rotation: '3deg',
      },
    ],
    bgVariant: 'dark',

    layoutVariant: 'editorial-left',
    watermarkValue: '2500',
  },
  {
    id: 'clientes',
    headline: 'ATIENDE\n3X M\u00C1S.\nSIN CONTRATAR.',
    copyBlocks: [
      {
        position: 'top-right',
        text: 'Cada consulta sin responder es un cliente que llama a tu competencia. O peor: desaparece para siempre.',
      },
      {
        position: 'bottom-left',
        text: 'Un asistente IA que responde 24/7, cualifica leads y agenda citas mientras duermes.',
      },
    ],
    stat: { value: 3, suffix: 'x', label: 'm\u00E1s capacidad' },
    images: [
      {
        src: '/images/generated/benefit-capacidad-chatbot.webp',
        alt: 'Mockup de chatbot WhatsApp con IA y badge 24/7',
        position: 'top-[15%] left-[8%]',
        size: 'large',
        rotation: '2deg',
      },
      {
        src: '/images/generated/benefit-capacidad-canales-dark.webp',
        alt: 'Hub de IA conectando múltiples canales de comunicación',
        position: 'bottom-[20%] right-[10%]',
        size: 'medium',
        rotation: '-3deg',
      },
    ],
    bgVariant: 'dark',

    layoutVariant: 'editorial-right',
    watermarkValue: '3x',
  },
  {
    id: 'satisfaccion',
    headline: 'NUNCA\nPIERDAS UN\nCLIENTE.',
    copyBlocks: [
      {
        position: 'top-left',
        text: 'El 98% de clientes reporta mayor satisfacci\u00F3n con atenci\u00F3n automatizada.',
      },
      {
        position: 'center-right',
        text: 'Respuesta instant\u00E1nea. Sin esperas. Sin horarios. Sin excusas.',
      },
    ],
    stat: { value: 98, suffix: '%', label: 'satisfacci\u00F3n' },
    images: [
      {
        src: '/images/generated/benefit-satisfaccion-reviews-v2.webp',
        alt: 'Dashboard de NPS y métricas de satisfacción del cliente',
        position: 'top-[25%] right-[12%]',
        size: 'large',
        rotation: '-1deg',
      },
      {
        src: '/images/generated/benefit-satisfaccion-retencion.webp',
        alt: 'Dashboard de retención de clientes con métricas de fidelización',
        position: 'bottom-[15%] left-[8%]',
        size: 'medium',
        rotation: '2deg',
      },
    ],
    bgVariant: 'dark',

    layoutVariant: 'editorial-center',
    watermarkValue: '98%',
  },
];

export const NUM_PANELS = panels.length + 1; // +1 para CTA panel
