---
model: opus
description: Sincroniza y documenta MCP servers locales y globales. Lista herramientas disponibles.
argument-hint: [--docs] [server-name]
allowed-tools: read, write, glob, bash
context: fork
agent: general-purpose
disable-model-invocation: false
hooks: {}
---

# Purpose

Escanea configuraciones MCP y genera documentacion de servidores y herramientas disponibles.

## Variables

Argumentos recibidos: $ARGUMENTS

Descompuestos:
- SERVER_NAME: $ARGUMENTS[0] (nombre de server especifico, opcional)
- FLAGS: Flags opcionales:
  - --docs: Generar documentacion

Configuracion MCP:
- MCP_GLOBAL: ~/.mcp.json (MCPs globales)
- MCP_LOCAL: .mcp.json (MCPs especificos del proyecto)

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (para detectar skills que usan MCP)
- AGENTS_DIR: .claude/agents/ (para detectar agents que usan MCP)

## Codebase Structure

Estructura del proyecto:
.claude/
├── agents/                  # Agentes que pueden usar MCPs
│   ├── backend.md          # Usa MCPs: serena (codebase analysis)
│   ├── testing.md          # Usa MCPs: playwright-mcp
│   └── codebase-analyst.md # Usa MCPs: serena
│
├── skills/
│   └── mcp-tools/          # /mcp-tools - Patrones para usar MCPs
│       └── SKILL.md
│
├── commands/
│   └── mcp-sync.md         # Este comando
│
└── .mcp.json              # Config local (si existe)

~/.mcp.json               # Config global (si existe)

Archivos de configuracion MCP:
- ~/.mcp.json: Scope Global - MCPs compartidos entre proyectos
- .mcp.json: Scope Local - MCPs especificos del proyecto

MCP Servers comunes en este proyecto:
- serena: Analisis de codigo (usado por @backend, @codebase-analyst)
- playwright-mcp: Testing E2E (usado por @testing)
- server-sequential-thinking: Pensamiento estructurado (usado en /plan-task)

## Instructions

### Paso 1: Verificar archivos de configuracion

Leer los archivos de configuracion MCP:
- ~/.mcp.json (Global)
- .mcp.json (Local)

### Paso 2: Parsear configuraciones

Para cada archivo que exista:
1. Parsear el JSON
2. Extraer lista de mcpServers
3. Identificar tipo de cada server:
   - command: Ejecuta proceso local (npx, python, etc)
   - http: Conecta a servidor HTTP
   - stdio: Comunicacion por stdin/stdout

### Paso 3: Listar servidores

Mostrar tabla consolidada con:
- Server name
- Tipo (command/http/stdio)
- Scope (global/local)
- Comando/URL

### Paso 4: Documentar herramientas

Para cada server, intentar listar sus herramientas conocidas.

### Paso 5: Generar documentacion (opcional)

Si el usuario solicita --docs, crear archivo de documentacion con:
- Configuracion Global y Local
- Herramientas por Server
- Uso en Comandos
- Skills y Agents que utilizan cada MCP

## Workflow

Flujo de trabajo:
1. Verificar existencia de archivos de config
2. Parsear JSON de cada archivo
3. Extraer mcpServers y sus propiedades
4. Identificar tipo de cada server
5. Listar en tabla consolidada
6. Documentar herramientas conocidas
7. Opcionalmente generar archivo de docs

## Report

Al finalizar mostrar:

MCP SYNC COMPLETADO

Archivos escaneados:
- ~/.mcp.json: {ENCONTRADO|NO EXISTE}
- .mcp.json: {ENCONTRADO|NO EXISTE}

Servers encontrados: {N}
- Global: {N}
- Local: {N}

Tabla de servers con nombre, tipo, scope y comando/URL.

Para generar documentacion, ejecuta: /mcp-sync --docs

Version: 1.0.0 | Creado: 2026-01-16
