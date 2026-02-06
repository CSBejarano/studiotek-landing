---
model: opus
description: OWASP Top 10 2025 Security Audit - Auditoria de seguridad con las 10 categorias
argument-hint: [quick|full|A01-A10]
allowed-tools: read, write, glob, grep, bash
context: fork
agent: security-reviewer
disable-model-invocation: false
hooks: {}
---

# Purpose

Realizar auditorias de seguridad basadas en OWASP Top 10:2025, el estandar de facto para seguridad de aplicaciones web.

## Variables

Argumentos recibidos: $ARGUMENTS

Descompuestos:
- AUDIT_MODE: $ARGUMENTS[0] (quick | full | A01-A10)
  - quick: Auditoria rapida (30 min)
  - full: Auditoria completa de las 10 categorias
  - A01-A10: Categoria especifica de OWASP

Configuracion:
- SKILL_PATH: .claude/skills/owasp/

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (acceso a /owasp, /rls, /aepd-privacidad)
- AGENTS_DIR: .claude/agents/ (invocar @security-reviewer si es necesario)

## Codebase Structure

Skill location: .claude/skills/owasp/

Estructura de .claude/:
.claude/
├── agents/
│   ├── security-reviewer.md    # @security-reviewer - Auditor especializado
│   ├── testing.md              # @testing - Tests de seguridad
│   └── backend.md              # @backend - Implementacion de fixes
│
├── skills/
│   ├── owasp/                  # /owasp - Este skill A01-A10
│   │   ├── SKILL.md
│   │   ├── checklists/audit-checklist.md
│   │   ├── workflows/01-auditoria-rapida.md
│   │   ├── workflows/02-auditoria-completa.md
│   │   ├── workflows/03-remediation-plan.md
│   │   ├── workflows/04-ci-cd-integration.md
│   │   ├── referencias/A0X-*.md
│   │   └── plantillas/templates.md
│   │
│   ├── rls/                    # /rls - Row Level Security (A01)
│   ├── aepd-privacidad/        # /aepd-privacidad - RGPD compliance
│   └── pytest/                 # /pytest - Security testing
│
└── commands/
    └── owasp.md               # Este comando

Skills relacionadas:
- /owasp: OWASP Top 10 A01-A10 (skill principal)
- /rls: Row Level Security (para A01 Broken Access Control)
- /aepd-privacidad: Compliance RGPD/LGPD (relacionado con A07, A09)
- /pytest: Tests de seguridad automatizados

Archivos clave del skill owasp:
- SKILL.md - Punto de entrada y resumen
- checklists/audit-checklist.md - Checklist ejecutable A01-A10
- workflows/01-auditoria-rapida.md - Guia 30 min
- workflows/02-auditoria-completa.md - Guia exhaustiva
- workflows/03-remediation-plan.md - Plan de remediacion
- workflows/04-ci-cd-integration.md - Automatizacion
- referencias/A0X-*.md - Detalle de cada categoria
- plantillas/templates.md - Templates de documentacion

## Instructions

### Paso 1: Cargar Skills de Seguridad

PRE-TAREA: Cargar skills de seguridad relevantes
- /owasp (skill principal - OWASP Top 10 A01-A10)
- /rls (para auditorias de A01 Broken Access Control)
- /aepd-privacidad (si el proyecto maneja datos personales)

Leer el skill OWASP ubicado en .claude/skills/owasp/ para obtener contexto.

Opcionalmente invocar @security-reviewer para auditorias complejas o cuando se detecten vulnerabilidades criticas.

### Paso 2: Determinar Modo de Auditoria

Basado en argumento:
- quick: Ejecuta revision de los 5 riesgos mas criticos (30 min)
- full: Revision exhaustiva de las 10 categorias con documentacion
- A01-A10: Revision especifica de una categoria

### Paso 3: Ejecutar Herramientas de Escaneo

Herramientas recomendadas:
- SAST: bandit -r src/ (Python), semgrep scan src/ (Multi-lenguaje)
- SCA: pip-audit (Python), npm audit (Node.js)
- Secrets: gitleaks detect --source .

### Paso 4: Revisar Checklist por Categoria

OWASP Top 10:2025:
- A01: Broken Access Control - Control de acceso, RBAC, SSRF
- A02: Security Misconfiguration - Hardening, headers, configuracion
- A03: Software Supply Chain Failures - SBOM, SCA, CI/CD security (NUEVO)
- A04: Cryptographic Failures - TLS, hashing, key management
- A05: Injection - SQL, XSS, Command injection
- A06: Insecure Design - Threat modeling, secure SDLC
- A07: Authentication Failures - MFA, session management
- A08: Software & Data Integrity - Signatures, deserializacion
- A09: Security Logging & Alerting - SIEM, incident response
- A10: Mishandling Exceptional Conditions - Error handling, fail secure (NUEVO)

### Paso 5: Documentar Hallazgos

Usar templates del skill para documentar hallazgos con severidad.

### Paso 6: Priorizar Remediacion

Ordenar hallazgos por severidad y crear plan de remediacion.

## Workflow

Uso con argumentos:
- /owasp quick: Auditoria rapida (30 min)
- /owasp full: Auditoria completa
- /owasp A01: Categoria especifica (Broken Access Control)
- /owasp A03: Supply Chain Failures (NUEVO 2025)
- /owasp A10: Exceptional Conditions (NUEVO 2025)

Flujo tipico:
1. Leer SKILL.md para contexto
2. Ejecutar herramientas de escaneo automatizado
3. Revisar checklist por categoria
4. Documentar hallazgos con templates
5. Priorizar remediacion por severidad

## Report

Resultado de la auditoria con:
- Resumen ejecutivo
- Hallazgos por categoria OWASP
- Severidad de cada hallazgo (CRITICA/ALTA/MEDIA/BAJA)
- Recomendaciones de remediacion
- Plan de accion priorizado

Skill: owasp
Version: 1.0.0
