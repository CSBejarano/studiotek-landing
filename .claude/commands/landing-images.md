# Landing Images Generator

Genera imagenes profesionales para tu landing page usando Gemini API.

## Invocacion

```
/landing-images
```

## Descripcion

Este comando activa el skill `landing-image-generator` que automatiza la creacion de imagenes para landing pages:

1. Analiza la estructura de tu landing page
2. Identifica secciones que necesitan imagenes
3. Genera prompts profesionales optimizados
4. Conecta con Gemini API para crear las imagenes
5. Integra las imagenes en tu codigo

## Pre-requisitos

### 1. API Key de Gemini

Configurar la variable de entorno:

```bash
export GEMINI_API_KEY="tu-api-key-aqui"
```

Obtener en: https://makersuite.google.com/app/apikey

### 2. Dependencias Python

```bash
pip install google-generativeai
```

## Flujo de Trabajo

### Paso 1: Analisis

El skill analizara tu landing page para detectar:

- **Framework**: Next.js, React, Vue, HTML estatico, etc.
- **Secciones**: Hero, Features, Testimonials, Pricing, CTA
- **Contenido**: Headlines, subheadlines, CTAs
- **Contexto**: Industria, tono, audiencia objetivo

### Paso 2: Generacion de Prompts

Se crean prompts optimizados para cada imagen necesaria:

- Prompts en ingles para mejor calidad
- Aspect ratios correctos por tipo de seccion
- Estilos coherentes con el branding

### Paso 3: Confirmacion de Costos

Antes de generar, se muestra:

```
========================================
ESTIMACION DE COSTOS
========================================
Imagenes a generar: 5
Costo por imagen:   $0.039 USD
Costo total:        $0.195 USD
========================================

Proceder? (yes/no):
```

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

## Opciones de Uso

### Analisis Solo

Para solo analizar sin generar:

```
/landing-images --analyze-only
```

### Regenerar Imagenes Especificas

Para regenerar una imagen:

```
/landing-images --regenerate hero_main
```

### Especificar Directorio de Salida

```
/landing-images --output public/images/landing
```

## Tipos de Imagenes

| Seccion | Tipo | Cantidad Tipica |
|---------|------|-----------------|
| Hero | Ilustracion principal | 1 |
| Features | Iconos | 3-6 |
| Testimonials | Avatares | 1-4 |
| CTA | Grafico de fondo | 1 |
| About | Ilustracion | 1 |

## Costos Estimados

| Escenario | Imagenes | Costo |
|-----------|----------|-------|
| Landing minima | 3 | ~$0.12 |
| Landing tipica | 7 | ~$0.27 |
| Landing completa | 15 | ~$0.59 |

## Archivos del Skill

```
.claude/skills/landing-image-generator/
├── SKILL.md                    # Definicion del skill
├── workflows/
│   ├── 01-analyze-landing.md   # Analisis
│   ├── 02-generate-prompts.md  # Prompts
│   ├── 03-gemini-integration.md # API
│   └── 04-integrate-images.md  # Integracion
├── templates/
│   ├── prompt-templates.md     # Plantillas
│   └── section-types.md        # Secciones
├── scripts/
│   └── gemini_client.py        # Cliente Python
└── README.md                   # Documentacion
```

## Ejemplo de Sesion

```
Usuario: /landing-images

Claude: Voy a analizar tu landing page para generar imagenes.

[Analisis]
- Framework detectado: Next.js (App Router)
- Archivo principal: app/page.tsx
- Secciones encontradas: hero, features (4), testimonials (2), cta

[Imagenes necesarias]
1. hero_main - Hero illustration (16:9)
2. feature_speed - Speed icon (1:1)
3. feature_security - Security icon (1:1)
4. feature_scale - Scale icon (1:1)
5. feature_api - API icon (1:1)
6. avatar_testimonial_1 - Avatar (1:1)
7. avatar_testimonial_2 - Avatar (1:1)
8. cta_background - CTA graphic (16:9)

Costo estimado: $0.312 USD (8 imagenes x $0.039)

Proceder con la generacion? (si/no)
```

## Notas de Seguridad

- La API key NUNCA se muestra en logs
- Siempre se confirma el costo antes de generar
- Limite de 10 imagenes por sesion sin confirmacion adicional

## Troubleshooting

### API Key no configurada
```bash
export GEMINI_API_KEY="tu-key"
```

### Error de rate limit
Esperar 60 segundos y reintentar.

### Imagenes bloqueadas
Modificar el prompt para evitar contenido flaggeado.

---

Skill: `landing-image-generator`
Modelo: `gemini-2.5-flash-image-preview`
Costo: ~$0.039/imagen
