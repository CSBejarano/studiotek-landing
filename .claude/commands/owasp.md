---
name: owasp
description: OWASP Top 10 2025 Security Audit - Auditoria de seguridad con las 10 categorias incluyendo A03 Supply Chain y A10 Exceptional Conditions
---

# /owasp - OWASP Top 10:2025 Security Audit

## Purpose

Realizar auditorias de seguridad basadas en OWASP Top 10:2025, el estandar de facto para seguridad de aplicaciones web.

## Skill Reference

Este comando carga el skill OWASP ubicado en:
`.claude/skills/owasp/`

## Quick Start

### Auditoria Rapida (30 min)
```
/owasp quick
```
Ejecuta revision de los 5 riesgos mas criticos.

### Auditoria Completa
```
/owasp full
```
Revision exhaustiva de las 10 categorias con documentacion.

### Categoria Especifica
```
/owasp A01  # Broken Access Control
/owasp A03  # Supply Chain Failures (NUEVO 2025)
/owasp A10  # Exceptional Conditions (NUEVO 2025)
```

## OWASP Top 10:2025

| # | Categoria | Descripcion |
|---|-----------|-------------|
| A01 | Broken Access Control | Control de acceso, RBAC, SSRF |
| A02 | Security Misconfiguration | Hardening, headers, configuracion |
| A03 | **Software Supply Chain Failures** | SBOM, SCA, CI/CD security (NUEVO) |
| A04 | Cryptographic Failures | TLS, hashing, key management |
| A05 | Injection | SQL, XSS, Command injection |
| A06 | Insecure Design | Threat modeling, secure SDLC |
| A07 | Authentication Failures | MFA, session management |
| A08 | Software & Data Integrity | Signatures, deserializacion |
| A09 | Security Logging & Alerting | SIEM, incident response |
| A10 | **Mishandling Exceptional Conditions** | Error handling, fail secure (NUEVO) |

## Workflow

1. **Leer SKILL.md** para contexto
2. **Ejecutar herramientas** de escaneo automatizado
3. **Revisar checklist** por categoria
4. **Documentar hallazgos** con templates
5. **Priorizar remediacion** por severidad

## Archivos Clave

- `SKILL.md` - Punto de entrada y resumen
- `checklists/audit-checklist.md` - Checklist ejecutable A01-A10
- `workflows/01-auditoria-rapida.md` - Guia 30 min
- `workflows/02-auditoria-completa.md` - Guia exhaustiva
- `workflows/03-remediation-plan.md` - Plan de remediacion
- `workflows/04-ci-cd-integration.md` - Automatizacion
- `referencias/A0X-*.md` - Detalle de cada categoria
- `plantillas/templates.md` - Templates de documentacion

## Herramientas Recomendadas

```bash
# SAST
bandit -r src/           # Python
semgrep scan src/        # Multi-lenguaje

# SCA
pip-audit               # Python
npm audit               # Node.js

# Secrets
gitleaks detect --source .
```

## Uso con Argumentos

```
$ARGUMENTS
```
