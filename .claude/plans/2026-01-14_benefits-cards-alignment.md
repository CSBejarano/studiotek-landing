# Plan: Alinear Cards de Benefits al Mismo Nivel

## Problema Identificado

Las tres cards de la sección "Por que automatizar" (Benefits.tsx) tienen alturas diferentes:
- Los botones "Descubrir cómo" no están alineados al mismo nivel
- Las descripciones tienen longitudes diferentes, empujando los botones a posiciones distintas
- La altura visual de las cards es inconsistente

## Causa Raíz

1. **VitaEonCard.tsx línea 94**: El contenedor interno `<div className="relative z-10">` no tiene `h-full`, por lo que no propaga la altura disponible al contenido
2. **Benefits.tsx línea 68**: El div flex interno no tiene `h-full` para ocupar toda la altura de la card
3. **Benefits.tsx línea 76-84**: El `ShimmerButton` usa `mt-6` (margen fijo) en lugar de `mt-auto` para anclarse al fondo

## Solución Propuesta

### Paso 1: Modificar VitaEonCard.tsx
Añadir `h-full` al contenedor de contenido para que propague la altura:
- Línea 94: `<div className="relative z-10">` → `<div className="relative z-10 h-full">`

### Paso 2: Modificar Benefits.tsx
1. Añadir `h-full` al div flex interno (línea 68)
2. Cambiar `mt-6` por `mt-auto` en el ShimmerButton (línea 81)
3. Opcionalmente añadir `flex-grow` a la descripción para que ocupe el espacio disponible

## Cambios Específicos

### VitaEonCard.tsx
```diff
- <div className="relative z-10">
+ <div className="relative z-10 h-full">
```

### Benefits.tsx
```diff
- <div className="flex flex-col items-center text-center">
+ <div className="flex flex-col items-center text-center h-full">

  ...

- <p className="text-slate-400 leading-relaxed">{benefit.description}</p>
+ <p className="text-slate-400 leading-relaxed flex-grow">{benefit.description}</p>

  <ShimmerButton
    ...
-   className="mt-6 w-full"
+   className="mt-auto pt-6 w-full"
  >
```

## Resultado Esperado

- Todas las cards tendrán la misma altura (la del contenido más alto)
- Los botones "Descubrir cómo" estarán perfectamente alineados en la parte inferior
- Las descripciones ocuparán el espacio variable, manteniendo la estructura visual consistente

## Archivos a Modificar

1. `components/ui/VitaEonCard.tsx` - 1 línea
2. `components/sections/Benefits.tsx` - 3 líneas

## Riesgo

**Bajo**: Los cambios son puramente de CSS/layout y no afectan la lógica o funcionalidad. Solo ajustan cómo flexbox distribuye el espacio vertical.
