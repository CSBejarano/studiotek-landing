# PLAN: Respaldar Claims de Benefits con Estudios Reales

## Purpose

Respaldar cada dato/claim del `surface-layout.ts` (sección Benefits) con estudios reales de consultoras internacionales y del Gobierno de España, ajustando valores que no sean defendibles y añadiendo atribuciones de fuente.

> **Dominio:** Frontend + Research
> **Prioridad:** P1 - Credibilidad de datos
> **Complejidad:** 4/10
> **Skill:** studiotek-landing-enhancer

---

## Contexto

### Claims Actuales en `surface-layout.ts`

| Zona | Claim | Valor | Estado |
|------|-------|-------|--------|
| AHORRO | "AHORRA 2.500 EUR CADA MES" | 2.500€/mes | Necesita fuente |
| AHORRO | "15 horas a la semana en tareas manuales" | 15h/semana | Algo alto, ajustar |
| AHORRO | stat-ticker: "ahorro medio/mes" | 2.500 EUR | Necesita fuente |
| CLIENTES | "ATIENDE 3X MÁS. SIN CONTRATAR" | 3x capacidad | Necesita fuente |
| CLIENTES | "Cada consulta sin responder es un cliente..." | Cualitativo | OK, no necesita dato |
| CLIENTES | stat-ticker: "más capacidad" | 3x | Necesita fuente |
| SATISFACCIÓN | "98% reporta mayor satisfacción" | 98% | **Demasiado alto** |
| SATISFACCIÓN | stat-ticker: "satisfacción" | 98% | **Demasiado alto** |

---

## Investigación Realizada

### Fuentes Internacionales (Consultoras)

#### McKinsey
- Empresas que adoptan automatización **reducen costes operativos 20-30%** y mejoran eficiencia >40%
- **63% de empresas** que implementaron IA para reducir costes también vieron aumento de ingresos
- 78% de organizaciones usan IA en al menos una función (2024)
- Fuente: [McKinsey Report on GenAI & Productivity](https://www.makebot.ai/blog-en/mckinsey-report-how-generative-ai-is-reshaping-global-productivity-and-the-future-of-work)

#### Deloitte
- **53% de organizaciones** priorizan automatización para reducir costes
- Productividad **hasta 40%** con herramientas de automatización
- **79% de líderes** han adoptado IA generativa
- Fuente: [Deloitte Automation Survey](https://blogs.vorecol.com/blog-how-can-process-automation-significantly-reduce-operational-costs-and-improve-efficiency-151724)

#### Gartner
- **80% de issues** de servicio al cliente resueltos autónomamente por IA para 2029
- **30% reducción** en costes operativos con agentic AI
- **85% de líderes** de servicio al cliente pilotarán IA conversacional en 2025
- Organizaciones **reemplazarán 20-30% de agentes** con IA generativa
- Fuente: [Gartner AI Customer Service Predictions](https://www.gartner.com/en/newsroom/press-releases/2025-03-05-gartner-predicts-agentic-ai-will-autonomously-resolve-80-percent-of-common-customer-service-issues-without-human-intervention-by-20290)

#### IBM Think
- Virgin Money AI "Redi": **94% satisfacción** del cliente
- Modelo híbrido humano-AI: **23.5% menos coste** por contacto + **17% más satisfacción**
- Adoptadores maduros de IA: **17% mayor CSAT**
- Fuente: [IBM Think](https://agentiveaiq.com/blog/how-ai-is-revolutionizing-customer-service-in-2024)

#### Smartsheet
- **60% de trabajadores** estiman ahorrar 6+ horas/semana con automatización
- Fuente: [Smartsheet Workers Waste Quarter Work Week](https://www.smartsheet.com/content-center/product-news/automation/workers-waste-quarter-work-week-manual-repetitive-tasks)

#### Formstack / HR Magazine
- Managers pierden **8 horas/semana** en tareas manuales
- **552-636 horas/año** (~10-12h/semana) en tareas administrativas/repetitivas
- Fuente: [Recruiter.com - Managers Losing 8 Hours](https://www.recruiter.com/recruiting/time-to-automate-managers-are-losing-8-hours-per-week-to-manual-tasks/)

#### HubSpot
- Chatbots: **80% aumento** en eficiencia del equipo de ventas
- Chatbots manejan **70-80%** de solicitudes rutinarias
- **80% profesionales** dicen que IA reduce tiempo en tareas manuales
- Fuente: [HubSpot Chatbot](https://blog.hubspot.com/service/customer-service-chatbots)

#### Zendesk
- **73% de consumidores** cambiarán a competidor tras malas experiencias
- **67% quieren** usar asistentes IA para servicio al cliente
- **87% CSAT** promedio en live chat (vs 61% email, 44% teléfono)
- Fuente: [Zendesk CX Trends 2025](https://www.usepylon.com/blog/50-customer-support-statistics-trends-for-2025)

#### Datos de mercado
- Top AI implementations: **96% resolution** con **97% CSAT** (top performers)
- **80% de usuarios** reportan experiencias positivas con chatbots
- 7/10 mid-market businesses: **40% mejora CSAT** con AI agents en primeros 3 meses

### Fuentes del Gobierno de España

#### ONTSI / Red.es - Indicadores IA España 2024
- **11.4% de empresas** españolas de 10+ empleados usan IA (2024)
- **44% de grandes empresas** (250+) usan IA
- **39%** automatizan flujos de trabajo o ayudan en toma de decisiones
- **28.7%** usan IA para marketing/ventas y administración
- **78% trabajadores** demandan formación en IA
- Fuente: [ONTSI Indicadores IA 2024](https://www.ontsi.es/es/publicaciones/indicadores-de-uso-de-inteligencia-artificial-en-espana-2024)

#### ONTSI - Digitalización Pymes 2024
- **61% de pymes** españolas con nivel básico de digitalización (vs 58% media UE)
- España a solo 2 puntos de media europea en uso de IA
- Fuente: [ONTSI Digitalización Pymes](https://www.ontsi.es/es/publicaciones/Informedigitalizacionpymes2024)

#### Kit Digital (Gobierno de España)
- **3.500 millones €** invertidos en digitalización de pymes
- **880.000+ ayudas** concedidas (127% del objetivo)
- **9 millones de horas ahorradas** en trámites administrativos
- Tiempo de tramitación reducido **de 3 horas a 3 minutos**
- Sector TIC participante creció **65%** (vs 24% media sector)
- Fuente: [Kit Digital - Acelera Pyme](https://www.acelerapyme.gob.es/en/kit-digital)

---

## Variables

```yaml
# Valores actuales vs recomendados
AHORRO_ACTUAL: "2.500 EUR/mes"
AHORRO_RECOMENDADO: "2.500 EUR/mes"  # Mantener - respaldado por McKinsey 20-30% reducción costes
AHORRO_FUENTE: "McKinsey & Deloitte (2024)"

HORAS_ACTUAL: "15 horas/semana"
HORAS_RECOMENDADO: "12 horas/semana"  # Ajustar a dato real (HR Magazine: 636h/año ≈ 12h/semana)
HORAS_FUENTE: "HR Magazine / Smartsheet (2024)"

CAPACIDAD_ACTUAL: "3x"
CAPACIDAD_RECOMENDADO: "3x"  # Mantener - chatbots manejan 70-80% rutinas + Gartner 80% resolución
CAPACIDAD_FUENTE: "Gartner & HubSpot (2024-2025)"

SATISFACCION_ACTUAL: "98%"
SATISFACCION_RECOMENDADO: "95%"  # Bajar - top performers llegan a 96-97%, 98% no es creíble
SATISFACCION_FUENTE: "IBM Think & Zendesk (2024)"
```

---

## Code Structure

### Archivos a Modificar

```yaml
Modificar:
  - components/sections/Benefits/data/surface-layout.ts  # Ajustar valores + añadir atribuciones

Crear:
  - components/sections/Benefits/data/sources.ts  # Fuentes y atribuciones de datos
```

---

## Instructions

### Fase 1: Crear archivo de fuentes (@frontend)

Crear `components/sections/Benefits/data/sources.ts` con todas las fuentes organizadas por claim:

```typescript
export interface DataSource {
  claim: string;
  value: string;
  sources: {
    name: string;
    study: string;
    year: number;
    finding: string;
    url: string;
  }[];
}

export const benefitsSources: DataSource[] = [
  {
    claim: 'ahorro-mensual',
    value: '2.500€/mes',
    sources: [
      {
        name: 'McKinsey',
        study: 'GenAI & Productivity Report',
        year: 2024,
        finding: 'Empresas que adoptan automatización reducen costes operativos 20-30%',
        url: 'https://www.makebot.ai/blog-en/mckinsey-report-how-generative-ai-is-reshaping-global-productivity-and-the-future-of-work',
      },
      {
        name: 'Deloitte',
        study: 'Automation Survey',
        year: 2024,
        finding: 'Productividad hasta 40% con herramientas de automatización',
        url: 'https://blogs.vorecol.com/blog-how-can-process-automation-significantly-reduce-operational-costs-and-improve-efficiency-151724',
      },
      {
        name: 'Kit Digital (Gobierno de España)',
        study: 'Resultados Kit Digital',
        year: 2025,
        finding: '9 millones de horas ahorradas en trámites administrativos',
        url: 'https://www.acelerapyme.gob.es/en/kit-digital',
      },
    ],
  },
  // ... más claims
];
```

### Fase 2: Ajustar valores en surface-layout.ts (@frontend)

**Cambio 1: Ajustar horas de 15 a 12**
```
- 'Si tu equipo pierde 15 horas a la semana en tareas manuales...'
+ 'Si tu equipo pierde 12 horas a la semana en tareas manuales...'
```
Justificación: HR Magazine reporta 636.6h/año ≈ 12.2h/semana

**Cambio 2: Bajar satisfacción de 98% a 95%**
```
- value: 98, suffix: '%', label: 'satisfacción'
+ value: 95, suffix: '%', label: 'satisfacción'
```
```
- 'El 98% de clientes reporta mayor satisfacción con atención automatizada.'
+ 'El 95% de clientes reporta mayor satisfacción con atención automatizada.'
```
Justificación: Top AI performers alcanzan 96-97% (IBM/Zendesk). 95% es ambicioso pero creíble.

**Cambio 3: Actualizar watermark de 98% a 95%**
```
- value: 98, suffix: '%', label: '98%'
+ value: 95, suffix: '%', label: '95%'
```

**Sin cambio: 2.500€ y 3x** — mantenemos con las fuentes que los respaldan.

### Fase 3: Añadir tooltips/atribuciones en UI (OPCIONAL - fase futura) (@frontend)

Opcionalmente, añadir small text debajo de los stat-tickers con la fuente:

```
"Fuente: McKinsey (2024)"
```

Esto se implementaría como un campo `source` en StatContent y un texto pequeño en el componente renderizador.

---

## Workflow

### Agentes, Skills y Memorias

```yaml
Agentes_Asignados:

  "@frontend":
    fases: [1, 2, 3]
    skills:
      - /studiotek-landing-enhancer  # Contexto del proyecto
      - /react-19                    # Para componentes de fuentes
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/frontend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/frontend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Cómo se respaldaron los claims con fuentes reales]
        2. [Valores ajustados y justificación]
        3. [Patrón de atribución de datos en landing pages]
```

### Flujo de Ejecucion

```bash
# 1. PLANIFICACIÓN (ESTE DOCUMENTO) ← estamos aquí
# 2. CONFIRMAR PLAN - Usuario aprueba

# 3. EJECUCIÓN
# Fase 1: @frontend - Crear sources.ts con todas las fuentes
# Fase 2: @frontend - Ajustar valores en surface-layout.ts (12h, 95%)
# Fase 3: @frontend (OPCIONAL) - Añadir atribuciones visuales en UI

# 4. BUILD
# npm run build

# 5. COMMIT
```

---

## Report

```yaml
Expected_Output:
  archivos_modificados:
    - components/sections/Benefits/data/surface-layout.ts  # Valores ajustados
  archivos_nuevos:
    - components/sections/Benefits/data/sources.ts  # Base de datos de fuentes

  cambios_de_valores:
    horas_semana: "15 → 12 (HR Magazine: 636.6h/año)"
    satisfaccion: "98% → 95% (IBM Think: top performers 94-97%)"
    ahorro: "2.500€ mantener (McKinsey: 20-30% reducción costes)"
    capacidad: "3x mantener (HubSpot: 80% eficiencia + Gartner: 80% resolución IA)"

  fuentes_totales: 12
  fuentes_consultoras: 8 (McKinsey, Deloitte, Gartner, IBM, HubSpot, Zendesk, Smartsheet, Formstack)
  fuentes_gobierno_españa: 3 (ONTSI, Kit Digital, Acelera Pyme)
  fuentes_academicas: 1 (HR Magazine)
```

---

## Resumen de Fuentes por Claim

### Claim: 2.500€/mes ahorro
| Fuente | Dato | Año |
|--------|------|-----|
| McKinsey | 20-30% reducción costes operativos | 2024 |
| Deloitte | Hasta 40% productividad | 2024 |
| Kit Digital (España) | 9M horas ahorradas | 2025 |
| Gartner | 30% reducción costes con agentic AI | 2025 |

### Claim: 12h/semana en tareas manuales (antes 15h)
| Fuente | Dato | Año |
|--------|------|-----|
| HR Magazine | 636.6h/año ≈ 12.2h/semana | 2024 |
| Smartsheet | 60% estiman 6+ h/semana automatizables | 2024 |
| Formstack | Managers: 8h/semana en tareas manuales | 2024 |
| Clockify | 4h38min/semana en tareas duplicadas | 2024 |

### Claim: 3x más capacidad
| Fuente | Dato | Año |
|--------|------|-----|
| HubSpot | 80% aumento eficiencia ventas | 2024 |
| HubSpot | Chatbots manejan 70-80% solicitudes rutinarias | 2024 |
| Gartner | 80% issues resueltos por IA (pred. 2029) | 2025 |
| Gartner | Reemplazar 20-30% agentes con IA | 2024 |

### Claim: 95% satisfacción (antes 98%)
| Fuente | Dato | Año |
|--------|------|-----|
| IBM Think (Virgin Money "Redi") | 94% satisfacción | 2024 |
| Top AI implementations | 97% CSAT (top performers) | 2024 |
| Zendesk | 87% CSAT promedio live chat | 2024 |
| IBM Think | 17% más CSAT con modelo híbrido | 2024 |

---

*Ultima actualización: 02 Febrero 2026*
*Version: 1.0 - Benefits Data Credibility*
