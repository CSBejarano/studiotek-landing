// ---------------------------------------------------------------------------
// Benefits Data Sources — Estudios que respaldan los claims de la landing
// ---------------------------------------------------------------------------

export interface SourceReference {
  name: string;
  study: string;
  year: number;
  finding: string;
  url: string;
}

export interface DataSource {
  claim: string;
  displayValue: string;
  sources: SourceReference[];
}

// ---------------------------------------------------------------------------
// Fuentes organizadas por claim
// ---------------------------------------------------------------------------

export const benefitsSources: DataSource[] = [
  // =========================================================================
  // AHORRO: 2.500€/mes
  // =========================================================================
  {
    claim: 'ahorro-mensual',
    displayValue: '2.500€/mes',
    sources: [
      {
        name: 'McKinsey',
        study: 'GenAI & Productivity Report',
        year: 2024,
        finding:
          'Empresas que adoptan automatización reducen costes operativos 20-30% y mejoran eficiencia >40%',
        url: 'https://www.makebot.ai/blog-en/mckinsey-report-how-generative-ai-is-reshaping-global-productivity-and-the-future-of-work',
      },
      {
        name: 'Deloitte',
        study: 'Automation Survey',
        year: 2024,
        finding:
          'Productividad aumenta hasta 40% con herramientas de automatización',
        url: 'https://blogs.vorecol.com/blog-how-can-process-automation-significantly-reduce-operational-costs-and-improve-efficiency-151724',
      },
      {
        name: 'Gartner',
        study: 'Agentic AI Predictions',
        year: 2025,
        finding:
          '30% reducción en costes operativos con IA agéntica en servicio al cliente',
        url: 'https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290',
      },
      {
        name: 'Kit Digital (Gobierno de España)',
        study: 'Resultados programa Kit Digital',
        year: 2025,
        finding:
          '9 millones de horas ahorradas en trámites administrativos con automatización',
        url: 'https://www.acelerapyme.gob.es/en/kit-digital',
      },
    ],
  },

  // =========================================================================
  // HORAS PERDIDAS: 12h/semana en tareas manuales
  // =========================================================================
  {
    claim: 'horas-tareas-manuales',
    displayValue: '12h/semana',
    sources: [
      {
        name: 'HR Magazine',
        study: 'Administrative Tasks Survey',
        year: 2024,
        finding:
          '636.6 horas/año en tareas administrativas o repetitivas (≈12.2h/semana)',
        url: 'https://www.businesswire.com/news/home/20170628005817/en/Office-workers-lose-a-third-of-their-work-time-to-admin-according-to-independent-research',
      },
      {
        name: 'Smartsheet',
        study: 'Workers & Automation Survey',
        year: 2024,
        finding:
          '60% de trabajadores estiman ahorrar 6+ horas/semana con automatización',
        url: 'https://www.smartsheet.com/content-center/product-news/automation/workers-waste-quarter-work-week-manual-repetitive-tasks',
      },
      {
        name: 'Formstack',
        study: 'Manager Productivity Report',
        year: 2024,
        finding: 'Managers pierden 8 horas/semana en tareas manuales',
        url: 'https://www.recruiter.com/recruiting/time-to-automate-managers-are-losing-8-hours-per-week-to-manual-tasks/',
      },
      {
        name: 'ONTSI (Gobierno de España)',
        study: 'Indicadores IA España 2024',
        year: 2024,
        finding:
          '39% de empresas automatizan flujos de trabajo o ayudan en toma de decisiones con IA',
        url: 'https://www.ontsi.es/es/publicaciones/indicadores-de-uso-de-inteligencia-artificial-en-espana-2024',
      },
    ],
  },

  // =========================================================================
  // CAPACIDAD: 3x más sin contratar
  // =========================================================================
  {
    claim: 'capacidad-3x',
    displayValue: '3x',
    sources: [
      {
        name: 'HubSpot',
        study: 'Chatbot Efficiency Report',
        year: 2024,
        finding:
          '80% aumento en eficiencia del equipo de ventas con chatbots',
        url: 'https://blog.hubspot.com/service/customer-service-chatbots',
      },
      {
        name: 'HubSpot',
        study: 'Customer Service Automation',
        year: 2024,
        finding:
          'Chatbots manejan 70-80% de solicitudes rutinarias del día a día',
        url: 'https://blog.hubspot.com/service/customer-service-chatbots',
      },
      {
        name: 'Gartner',
        study: 'AI Customer Service Predictions',
        year: 2025,
        finding:
          'IA resolverá autónomamente 80% de issues comunes de servicio al cliente para 2029',
        url: 'https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290',
      },
      {
        name: 'Gartner',
        study: 'GenAI Agent Replacement',
        year: 2024,
        finding:
          'Organizaciones reemplazarán 20-30% de agentes humanos con IA generativa',
        url: 'https://www.gartner.com/en/newsroom/press-releases/2024-12-09-gartner-survey-reveals-85-percent-of-customer-service-leaders-will-explore-or-pilot-customer-facing-conversational-genai-in-2025',
      },
    ],
  },

  // =========================================================================
  // SATISFACCIÓN: 95%
  // =========================================================================
  {
    claim: 'satisfaccion-95',
    displayValue: '95%',
    sources: [
      {
        name: 'IBM Think',
        study: 'Virgin Money AI Case Study',
        year: 2024,
        finding:
          'Virgin Money AI "Redi" alcanzó 94% satisfacción del cliente, rivalizando con agentes humanos',
        url: 'https://agentiveaiq.com/blog/how-ai-is-revolutionizing-customer-service-in-2024',
      },
      {
        name: 'Industry Benchmark',
        study: 'Top AI Implementations',
        year: 2024,
        finding:
          'Top performers: 96% resolution rate con 97% CSAT scores',
        url: 'https://www.fullview.io/blog/ai-chatbot-statistics',
      },
      {
        name: 'IBM Think',
        study: 'Hybrid Human-AI Model',
        year: 2024,
        finding:
          'Modelo híbrido humano-IA reduce coste por contacto 23.5% y aumenta satisfacción 17%',
        url: 'https://agentiveaiq.com/blog/how-ai-is-revolutionizing-customer-service-in-2024',
      },
      {
        name: 'Zendesk',
        study: 'CX Trends 2025',
        year: 2025,
        finding:
          '87% CSAT promedio en live chat (vs 61% email, 44% teléfono)',
        url: 'https://www.usepylon.com/blog/50-customer-support-statistics-trends-for-2025',
      },
      {
        name: 'ONTSI (Gobierno de España)',
        study: 'Digitalización Pymes 2024',
        year: 2024,
        finding:
          '61% de pymes españolas con nivel básico de digitalización, superando media UE del 58%',
        url: 'https://www.ontsi.es/es/publicaciones/Informedigitalizacionpymes2024',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper: get sources for a specific claim
// ---------------------------------------------------------------------------

export function getSourcesForClaim(claimId: string): DataSource | undefined {
  return benefitsSources.find((s) => s.claim === claimId);
}

// ---------------------------------------------------------------------------
// Attribution text for UI (optional use in stat-tickers)
// ---------------------------------------------------------------------------

export const attributions: Record<string, string> = {
  'ahorro-mensual': 'Fuente: McKinsey & Deloitte (2024)',
  'horas-tareas-manuales': 'Fuente: HR Magazine & Smartsheet (2024)',
  'capacidad-3x': 'Fuente: Gartner & HubSpot (2024-2025)',
  'satisfaccion-95': 'Fuente: IBM Think & Zendesk (2024)',
};
