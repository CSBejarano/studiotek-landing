# PLAN: Deploy SEO & Google Indexación - StudioTek

## Purpose

Desplegar los cambios de optimización SEO a producción y solicitar indexación en Google para posicionar StudioTek en búsquedas de "automatización IA para empresas".

> **Dominio:** Infra + SEO
> **Prioridad:** P0 - Critical SEO Launch
> **Complejidad:** 3/10

---

## Contexto

### Cambios Realizados (Pendientes de Deploy)

```yaml
Optimizaciones_SEO:
  title_tag: "Automatización IA para Empresas | Ahorra 40% - StudioTek"
  meta_description: "Automatización IA para empresas españolas: reduce 40% costes..."
  h1_principal: "Automatización IA para empresas: ahorra 40% en costes operativos"

  schemas_agregados:
    - FAQPage (4 preguntas optimizadas)
    - Service (Automatización IA para Empresas)

  keywords_nuevas:
    - "automatización IA para empresas"
    - "automatización inteligente"
    - "IA para empresas España"
    - "automatizar procesos con IA"
    - "agentes IA empresariales"
    - "software IA empresas"

  ortografia_corregida:
    - PainPointsParallax.tsx (9 errores)
    - ProblemSolutionParallax.tsx (6 errores)
    - Footer.tsx (2 errores)

Estado_Actual:
  build: "SUCCESS"
  branch: "main (con cambios locales)"
  google_cache: "Versión anterior sin tildes"
```

### Objetivos

```yaml
Métricas_Target:
  indexacion_google: "< 48 horas"
  posicion_keyword: "Top 10 para 'automatización IA para empresas'"
  rich_snippets: "FAQs visibles en SERP"

Acciones_Requeridas:
  - Deploy a Vercel producción
  - Ping sitemap a Google
  - Solicitar indexación en GSC
  - Verificar cache de Google actualizado
```

---

## Variables

```yaml
DOMAIN: "studiotek.es"
VERCEL_PROJECT: "studiotek-landing"
SITEMAP_URL: "https://studiotek.es/sitemap.xml"
GSC_PROPERTY: "https://studiotek.es/"

URLS_TO_INDEX:
  - "https://studiotek.es/"
  - "https://studiotek.es/sitemap.xml"

KEYWORD_TARGET: "automatización IA para empresas"

GOOGLE_PING_URL: "https://www.google.com/ping?sitemap=https://studiotek.es/sitemap.xml"
BING_PING_URL: "https://www.bing.com/ping?sitemap=https://studiotek.es/sitemap.xml"
```

---

## Code Structure

### Archivos Modificados (Pendientes de Commit)

```yaml
SEO_Changes:
  - app/layout.tsx           # Meta tags, schemas, keywords
  - components/sections/Hero.tsx  # H1 optimizado
  - components/sections/PainPointsParallax.tsx  # Ortografía
  - components/sections/ProblemSolutionParallax.tsx  # Ortografía
  - components/sections/Footer.tsx  # Ortografía

Build_Status: "Verified - No errors"
```

### Script de Verificación Post-Deploy

```bash
#!/bin/bash
# scripts/verify_seo_deploy.sh

DOMAIN="studiotek.es"

echo "=== Verificación SEO Post-Deploy ==="

# 1. Verificar que el sitio responde
echo "1. Verificando respuesta del sitio..."
curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN

# 2. Verificar meta tags
echo "2. Verificando title tag..."
curl -s https://$DOMAIN | grep -o '<title>[^<]*</title>'

# 3. Verificar schema FAQ
echo "3. Verificando schema FAQPage..."
curl -s https://$DOMAIN | grep -o '"@type":"FAQPage"' && echo "✅ FAQPage encontrado"

# 4. Ping sitemap
echo "4. Haciendo ping al sitemap..."
curl -s "https://www.google.com/ping?sitemap=https://$DOMAIN/sitemap.xml"
curl -s "https://www.bing.com/ping?sitemap=https://$DOMAIN/sitemap.xml"

echo "=== Verificación completada ==="
```

---

## Instructions

### Fase 1: Commit de Cambios SEO (@infra)
1. Verificar todos los archivos modificados con `git status`
2. Revisar diff de cambios: `git diff app/layout.tsx`
3. Crear commit con mensaje descriptivo
4. NO hacer push aún (esperar verificación)

### Fase 2: Build de Verificación (@frontend)
1. Ejecutar `pnpm build` para verificar compilación
2. Ejecutar `pnpm start` y verificar en http://localhost:3000
3. Inspeccionar source HTML para confirmar:
   - Title tag correcto
   - Meta description correcta
   - Schema FAQPage presente
   - Schema Service presente
4. Capturar screenshot de evidencia

### Fase 3: Deploy a Producción (@infra)
1. Push a rama main: `git push origin main`
2. **Opción A (Vercel Auto-Deploy):** Esperar deploy automático
3. **Opción B (Manual):** `npx vercel --prod`
4. Verificar URL de deploy en Vercel Dashboard
5. Confirmar que https://studiotek.es muestra cambios

### Fase 4: Ping Sitemap a Buscadores (@infra)
1. Ping a Google:
   ```bash
   curl "https://www.google.com/ping?sitemap=https://studiotek.es/sitemap.xml"
   ```
2. Ping a Bing:
   ```bash
   curl "https://www.bing.com/ping?sitemap=https://studiotek.es/sitemap.xml"
   ```
3. Verificar respuesta OK de ambos

### Fase 5: Google Search Console (@infra)
1. Ir a https://search.google.com/search-console
2. Seleccionar propiedad `studiotek.es`
3. En "Inspección de URLs":
   - Introducir: `https://studiotek.es/`
   - Click "Solicitar indexación"
4. En "Sitemaps":
   - Verificar que `sitemap.xml` está enviado
   - Si no, agregar: `https://studiotek.es/sitemap.xml`
5. Capturar screenshot de confirmación

### Fase 6: Verificación de Indexación (@testing)
1. Esperar 24-48 horas
2. Buscar en Google: `site:studiotek.es`
3. Verificar que el title nuevo aparece
4. Buscar: `"automatización IA para empresas" studiotek`
5. Documentar posición actual

### Fase 7: Validación Final (@gentleman)
1. Verificar rich snippets con: https://search.google.com/test/rich-results
2. Verificar Open Graph con: https://www.opengraph.xyz/
3. Verificar Twitter Card con: https://cards-dev.twitter.com/validator
4. VERDICT: APPROVED / NEEDS_REVISION

---

## Workflow

```bash
# 1. PLANIFICACIÓN (ESTE DOCUMENTO)
# Revisar y aprobar este plan

# 2. CONFIRMAR PLAN
# Usuario aprueba: "Procede con el deploy"

# 3. EJECUCIÓN CON TRACKING
/ralph-execute

# 4. VERIFICACIÓN POST-DEPLOY
# - Verificar sitio en producción
# - Verificar indexación en GSC
# - Monitorear posiciones

# 5. SEGUIMIENTO (48-72h después)
# - Verificar cache de Google actualizado
# - Verificar posición para keyword target
# - Documentar resultados
```

---

## Report

```yaml
Expected_Output:
  commits:
    - message: "feat(seo): optimizar meta tags y schemas para 'automatización IA para empresas'"
      files:
        - app/layout.tsx
        - components/sections/Hero.tsx
        - components/sections/PainPointsParallax.tsx
        - components/sections/ProblemSolutionParallax.tsx
        - components/sections/Footer.tsx

  deploy:
    platform: "Vercel"
    url: "https://studiotek.es"
    status: "PENDING"

  indexacion:
    google_ping: "PENDING"
    bing_ping: "PENDING"
    gsc_request: "PENDING"
    sitemap_submitted: "PENDING"

  verificacion:
    rich_results_test: "PENDING"
    opengraph_preview: "PENDING"
    twitter_card_preview: "PENDING"

  metricas_esperadas:
    tiempo_indexacion: "24-48 horas"
    posicion_inicial: "Top 20"
    posicion_objetivo_30d: "Top 10"

  validation:
    - "Deploy exitoso en Vercel"
    - "Sitemap pingueado a Google y Bing"
    - "URL enviada a indexación en GSC"
    - "Rich snippets validados"
    - "Title tag visible en SERP"

  workflow_status: PENDING_APPROVAL
  phases_completed: 0/7
```

---

## Comandos Útiles

```bash
# Ver archivos modificados
git status

# Ver cambios en detalle
git diff app/layout.tsx

# Commit de cambios SEO
git add -A && git commit -m "feat(seo): optimizar meta tags para 'automatización IA para empresas'

- Title: Automatización IA para Empresas | Ahorra 40% - StudioTek
- H1 optimizado con keyword principal
- Schema FAQPage con 4 preguntas
- Schema Service agregado
- Correcciones ortográficas en 4 archivos
- Keywords long-tail agregadas

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Push a main
git push origin main

# Deploy manual a Vercel
npx vercel --prod

# Ping sitemap a Google
curl "https://www.google.com/ping?sitemap=https://studiotek.es/sitemap.xml"

# Ping sitemap a Bing
curl "https://www.bing.com/ping?sitemap=https://studiotek.es/sitemap.xml"

# Verificar title tag en producción
curl -s https://studiotek.es | grep -o '<title>[^<]*</title>'

# Verificar schema FAQPage
curl -s https://studiotek.es | grep -c '"@type":"FAQPage"'

# Test de Rich Results
open "https://search.google.com/test/rich-results?url=https://studiotek.es"

# Test de Open Graph
open "https://www.opengraph.xyz/?url=https://studiotek.es"

# Buscar en Google (después de indexación)
open "https://www.google.es/search?q=site:studiotek.es"
open "https://www.google.es/search?q=automatización+IA+para+empresas"
```

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Deploy falla en Vercel | Baja | Alto | Build local verificado, rollback disponible |
| Google no indexa rápido | Media | Medio | Ping manual + GSC request |
| Cache de Google persistente | Media | Bajo | Esperar 48-72h, forzar con GSC |
| Rich snippets no aparecen | Media | Bajo | Validar con Rich Results Test |
| Posición no mejora | Media | Medio | Monitorear 30 días, ajustar si necesario |

---

## Notes

### Tiempo de Indexación
- Google puede tardar 24h-2 semanas en actualizar cache
- GSC "Solicitar indexación" acelera el proceso
- Sitios con autoridad indexan más rápido

### Rich Snippets
- FAQPage schema puede tardar 1-2 semanas en aparecer
- No garantiza aparición (Google decide)
- Aumenta CTR cuando aparece

### Monitoreo Post-Deploy
- Usar GSC para ver impresiones/clicks
- Revisar posición diariamente primera semana
- Ajustar meta description si CTR es bajo

### Rollback Plan
- Si algo falla: `git revert HEAD && git push`
- Vercel permite rollback desde dashboard
- Mantener nota del deploy ID anterior

---

*Última actualización: 26 Enero 2026*
*Version: 1.0 - SEO Deploy & Indexación Plan*
