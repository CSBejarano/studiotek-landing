# Vercel Deploy - Guía Paso a Paso

Ayuda al usuario a desplegar proyectos del monorepo a Vercel.

## Contexto del Monorepo

```
ideas-frontend/
├── .vercel/project.json          # Proyecto principal (vitaeon-landing)
├── apps/
│   ├── landing-next/             # Next.js 15 landing pages
│   │   ├── .vercel/project.json  # Debe apuntar al mismo proyecto
│   │   └── vercel.json           # Configuración monorepo
│   └── dashboard/                # Vite + React dashboard
└── packages/                     # Shared packages
```

## Instrucciones

### PASO 1: Verificar Configuración

Primero verifica que los archivos de configuración de Vercel estén correctos:

1. Lee `/.vercel/project.json` para obtener el proyecto actual
2. Lee `/apps/landing-next/.vercel/project.json` y verifica que coincida
3. Lee `/apps/landing-next/vercel.json` y verifica la configuración de monorepo

Si hay discrepancias, pregunta al usuario cuál proyecto usar.

### PASO 2: Verificar Build Local

Antes de desplegar, verifica que el proyecto compile:

```bash
pnpm turbo build --filter=@ideas/landing-next
```

Si hay errores de TypeScript, ayuda a resolverlos antes de continuar.

### PASO 3: Verificar Git Status

Verifica si hay cambios sin commitear:

```bash
git status --short
```

Pregunta al usuario si quiere commitear los cambios antes del deploy.

### PASO 4: Ejecutar Deploy

El deploy SIEMPRE debe ejecutarse desde la raíz del monorepo:

```bash
cd /Users/cristianbejaranomendez/Documents/GitHub/ideas-frontend
vercel --prod
```

**IMPORTANTE:** No ejecutar desde `apps/landing-next` porque el proyecto tiene configurado `Root Directory: apps/landing-next` en Vercel.

### PASO 5: Verificar Deploy

Una vez completado el deploy:

1. Muestra la URL de producción
2. Sugiere verificar la página en el navegador
3. Si es la landing de Vitaeon, verificar: https://vitaeon-landing.vercel.app/vitaeon

## Configuración de Referencia

### vercel.json (apps/landing-next/)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm turbo build --filter=@ideas/landing-next",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### project.json (ambos .vercel/)

```json
{
  "projectId": "prj_aYAIzS4sgOrYUGbWdciQuyJQQL7H",
  "orgId": "team_xN3AddViEOEHmXBmsH1lLg7m",
  "projectName": "vitaeon-landing"
}
```

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "No Next.js version detected" | `.vercel/project.json` incorrecto | Verificar que apunte al proyecto correcto |
| "Path does not exist" | Deploy desde directorio incorrecto | Ejecutar desde raíz del monorepo |
| "pnpm install failed" | Falta `vercel.json` con installCommand | Crear/verificar vercel.json |

## Preview vs Production

- `vercel` → Deploy a preview (branch actual)
- `vercel --prod` → Deploy a producción

## Proyectos Configurados

| Proyecto | URL | Directorio |
|----------|-----|------------|
| vitaeon-landing | vitaeon-landing.vercel.app | apps/landing-next |

---

Ejecuta cada paso secuencialmente y reporta el resultado al usuario.
