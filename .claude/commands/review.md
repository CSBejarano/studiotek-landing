---
description: Realiza una Code Review técnica de un Pull Request de GitHub, buscando bugs, problemas de seguridad y estilo.
argument-hint: "[pr-number-or-url]"
model: opus
ultrathink: true
tools: bash, read, mcp__serena__read_file, askuserquestion
---

# /review - Auditoría de Código y PRs

## 🧐 Objetivo
Actuar como Tech Lead. Descargar un PR, analizar el "Diff", ejecutar los tests para asegurar que nada explota, y generar un reporte de revisión.

## 🔄 Workflow de Revisión

### 1. Ingesta del PR
1.  **Checkout del PR:**
    ```bash
    gh pr checkout {{argument}}
    ```
2.  **Obtener Contexto:**
    ```bash
    gh pr view {{argument}} --json title,body,author > .context/pr_info.md
    ```

### 2. Análisis Diferencial (The Diff)
1.  **Generar Diff legible:**
    ```bash
    gh pr diff {{argument}} > .context/changes.diff
    ```
2.  **Lectura Crítica:**
    Analiza `.context/changes.diff` buscando:
    * 🔴 **Hardcoded secrets:** (API Keys, passwords).
    * 🔴 **Performance:** Bucles anidados innecesarios, lecturas de archivos completas.
    * 🔴 **Seguridad:** Inyecciones SQL/XSS potenciales.
    * 🟡 **Legibilidad:** Nombres de variables confusos, falta de comentarios en lógica compleja.

### 3. Validación Dinámica
1.  **Smoke Test:**
    Ejecuta el comando de test del proyecto (detectado automáticamente o pregunta al usuario).
    *Si los tests fallan, la revisión es automáticamente "REQUEST CHANGES".*

### 4. Generación del Reporte
Genera un output en Markdown con:

```markdown
# Review PR #{{argument}}

## 🚦 Veredicto: [APPROVE / REQUEST CHANGES / COMMENT]

## 🔍 Hallazgos Principales
- [Crítico/Mejora/Pregunta] Archivo X: Descripción del hallazgo.

## 🧪 Estado de Tests
- Pasaron: [Sí/No]

## 💡 Sugerencias de Código
(Bloques de código con la mejora sugerida)