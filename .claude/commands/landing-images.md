---
model: opus
description: Genera imagenes profesionales para landing pages usando Gemini API
argument-hint: [path] [--analyze-only] [--regenerate=name] [--output=dir]
allowed-tools: read, write, edit, glob, grep, bash, webfetch, websearch
context: fork
agent: frontend,marketing-expert,seo-expert
disable-model-invocation: false
hooks: {}
---

# Purpose

Genera imagenes profesionales para landing pages usando Gemini API. Analiza la estructura de la landing, identifica secciones que necesitan imagenes, genera prompts optimizados y conecta con Gemini API para crear las imagenes.

## Variables

Argumentos recibidos: $ARGUMENTS

Descompuestos:
- PATH: $ARGUMENTS[0] (ruta de la landing, opcional)
- FLAGS: Flags opcionales extraidos de $ARGUMENTS:
  - --analyze-only: Solo analizar sin generar
  - --regenerate=name: Regenerar imagen especifica
  - --output=dir: Directorio de salida (default: public/images/landing)

Requerido:
- GEMINI_API_KEY: API key para Gemini

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (incluye landing-image-generator/)
- AGENTS_DIR: .claude/agents/ (para invocar @marketing-expert si es necesario)

## Codebase Structure

Skill location: .claude/skills/landing-image-generator/

Estructura de .claude/:
.claude/
├── agents/
│   ├── marketing-expert.md    # @marketing-expert - Para estrategia de contenido
│   ├── frontend.md            # @frontend - Para integracion en React/Next.js
│   └── seo-expert.md          # @seo-expert - Para optimizacion SEO de imagenes
│
├── skills/
│   └── landing-image-generator/  # Este skill
│       ├── SKILL.md
│       ├── workflows/01-analyze-landing.md
│       ├── workflows/02-generate-prompts.md
│       ├── workflows/03-gemini-integration.md
│       ├── workflows/04-integrate-images.md
│       ├── templates/prompt-templates.md
│       ├── templates/section-types.md
│       └── scripts/gemini_client.py
│
└── commands/
    └── landing-images.md      # Este comando

Archivos del skill:
- SKILL.md - Definicion del skill
- workflows/01-analyze-landing.md - Analisis
- workflows/02-generate-prompts.md - Prompts
- workflows/03-gemini-integration.md - API
- workflows/04-integrate-images.md - Integracion
- templates/prompt-templates.md - Plantillas
- templates/section-types.md - Secciones
- scripts/gemini_client.py - Cliente Python

Skills relacionadas:
- /landing-image-generator (este skill)
- /marketing-content - Para copywriting de la landing
- /linkedin-publisher - Para compartir en redes
- /seo-toolkit - Para optimizacion SEO
- /studiotek-landing-enhancer - Para optimizaciones especificas

## Instructions

### Paso 1: Analisis

PRE-TAREA: Cargar skills relacionadas
- /landing-image-generator (skill principal)
- /marketing-content (si requiere copy optimizado)
- /seo-toolkit (si requiere optimizacion SEO)

El skill analizara la landing page para detectar:
- Framework: Next.js, React, Vue, HTML estatico
- Secciones: Hero, Features, Testimonials, Pricing, CTA
- Contenido: Headlines, subheadlines, CTAs
- Contexto: Industria, tono, audiencia objetivo

Opcionalmente, invocar @marketing-expert si se necesita estrategia de contenido adicional.

### Paso 2: Generacion de Prompts

Se crean prompts optimizados para cada imagen:
- Prompts en ingles para mejor calidad
- Aspect ratios correctos por tipo de seccion
- Estilos coherentes con el branding

### Paso 3: Confirmacion de Costos

Antes de generar, mostrar estimacion de costos y pedir confirmacion.

### Paso 4: Generacion

Las imagenes se generan secuencialmente con:
- Reintentos automaticos en caso de error
- Logging detallado del proceso
- Guardado en directorio especificado

### Paso 5: Integracion

Las imagenes se integran en el codigo:
- Optimizacion a WebP
- Actualizacion de referencias
- Configuracion responsive

## Workflow

Pre-requisitos:
1. Configurar GEMINI_API_KEY
2. Instalar dependencia: pip install google-generativeai

Tipos de imagenes:
- Hero: Ilustracion principal (16:9) - 1 tipica
- Features: Iconos (1:1) - 3-6 tipicos
- Testimonials: Avatares (1:1) - 1-4 tipicos
- CTA: Grafico de fondo (16:9) - 1 tipico
- About: Ilustracion - 1 tipica

Costos estimados:
- Landing minima (3 imagenes): ~$0.12
- Landing tipica (7 imagenes): ~$0.27
- Landing completa (15 imagenes): ~$0.59

## Report

Mostrar resumen de:
- Framework detectado
- Secciones encontradas
- Imagenes necesarias con nombres y aspect ratios
- Costo estimado total
- Confirmacion para proceder

Skill: landing-image-generator
Modelo: gemini-2.5-flash-image-preview
Costo: ~$0.039/imagen
