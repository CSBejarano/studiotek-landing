---
description: "Sincroniza y documenta MCP servers locales y globales. Lista herramientas disponibles."
---

# /mcp-sync - Documentar MCP Servers

Escanea configuraciones MCP y genera documentacion de servidores y herramientas disponibles.

## Instrucciones

### Paso 1: Verificar archivos de configuracion

Leer los archivos de configuracion MCP:

| Archivo | Scope | Proposito |
|---------|-------|-----------|
| `.mcp.json` | Proyecto local | MCPs especificos del proyecto |
| `~/.mcp.json` | Global | MCPs compartidos entre proyectos |

### Paso 2: Parsear configuraciones

Para cada archivo que exista:

1. Parsear el JSON
2. Extraer lista de `mcpServers`
3. Identificar tipo de cada server:
   - **command**: Ejecuta proceso local (npx, python, etc)
   - **http**: Conecta a servidor HTTP
   - **stdio**: Comunicacion por stdin/stdout

### Paso 3: Listar servidores

Mostrar tabla consolidada:

```
## MCP Servers Disponibles

| Server | Tipo | Scope | Comando/URL |
|--------|------|-------|-------------|
| server-sequential-thinking | command | global | npx @modelcontextprotocol/server-sequential-thinking |
| serena | command | local | python -m serena |
```

### Paso 4: Documentar herramientas

Para cada server, intentar listar sus herramientas conocidas:

```
### server-sequential-thinking
- `mcp__server-sequential-thinking__sequentialthinking`: Pensamiento paso a paso

### serena
- `mcp__serena__read_file`: Leer archivo
- `mcp__serena__find_symbol`: Buscar simbolo
- `mcp__serena__search_for_pattern`: Buscar patron
```

### Paso 5: Generar documentacion (opcional)

Si el usuario lo solicita, crear archivo de documentacion:

```markdown
# MCP Servers - {proyecto}

> Generado: {fecha}

## Configuracion

### Global (~/.mcp.json)
{lista de servers globales}

### Local (.mcp.json)
{lista de servers locales}

## Herramientas por Server

{documentacion de cada server}

## Uso en Comandos

Para usar en comandos .claude/commands/:

tools:
  - mcp__{server}__{tool}
```

## Output Esperado

Al finalizar, mostrar:

```
============================================================
MCP SYNC COMPLETADO
============================================================

Archivos escaneados:
- ~/.mcp.json: {ENCONTRADO|NO EXISTE}
- .mcp.json: {ENCONTRADO|NO EXISTE}

Servers encontrados: {N}
- Global: {N}
- Local: {N}

{tabla de servers}

------------------------------------------------------------
Para generar documentacion, ejecuta:
  /mcp-sync --docs
------------------------------------------------------------
```

## Ejemplos

### Listar servers

```
/mcp-sync
```

### Generar documentacion

```
/mcp-sync --docs
```

### Verificar server especifico

```
/mcp-sync serena
```

## Notas

- No modifica archivos de configuracion
- Solo lectura y documentacion
- Util para verificar que MCPs estan configurados correctamente
- Ayuda a descubrir herramientas disponibles para usar en comandos

---

**Version:** 1.0.0 | **Creado:** 2026-01-16
