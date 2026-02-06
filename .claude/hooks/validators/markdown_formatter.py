# /// script
# requires-python = ">=3.12"
# dependencies = []
# ///

#!/usr/bin/env python3
import json
import sys
import re
import os
from pathlib import Path

def detect_language(code: str) -> str:
    """Detecta el lenguaje de programación basado en el contenido del bloque."""
    s = code.strip()
    
    # Detección de JSON
    if re.search(r'^\s*[{\[]', s):
        try:
            json.loads(s)
            return 'json'
        except: pass
    
    # Detección de Python (mejorada con keywords comunes)
    if re.search(r'^\s*(def|class|import|from|if __name__ ==)\b', s, re.M):
        return 'python'
    
    # Detección de JS/TS
    if re.search(r'\b(function|const|let|async|await|console\.|export)\b', s):
        return 'javascript'
    
    # Detección de Bash/Shell
    if re.search(r'^#!.*\b(bash|sh|zsh)\b', s, re.M) or re.search(r'\b(sudo|apt|git|chmod)\b', s):
        return 'bash'
    
    # Detección de SQL
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|FROM|WHERE)\b', s, re.I):
        return 'sql'
        
    return 'text'

def format_markdown(content: str) -> str:
    """Corrige fences sin lenguaje y espaciado excesivo."""
    def add_lang_to_fence(match):
        indent, info, body, closing = match.groups()
        if not info.strip():
            lang = detect_language(body)
            return f"{indent}```{lang}\n{body}{closing}"
        return match.group(0)
    
    # Pattern para capturar bloques de código Markdown
    fence_pattern = r'(?ms)^([ \t]{0,3})```([^\n]*)\n(.*?)(\n\1```)'
    content = re.sub(fence_pattern, add_lang_to_fence, content)
    
    # Normalizar saltos de línea (máximo 2 seguidos fuera de bloques)
    # Nota: Esta regex es simplificada para no romper el contenido interno de los bloques
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.rstrip() + '\n'

def main():
    try:
        # Claude Code envía el contexto de la herramienta por stdin
        raw_input = sys.stdin.read()
        if not raw_input:
            return

        input_data = json.loads(raw_input)
        
        # En PostToolUse, el input original está en tool_use['input']
        # Los matchers 'Edit' y 'Write' usan la clave 'file_path'
        tool_use = input_data.get('tool_use', {})
        tool_input = tool_use.get('input', {})
        file_path = tool_input.get('file_path')

        if not file_path:
            return

        # Validar si es un archivo Markdown
        path = Path(file_path)
        if path.suffix.lower() not in ('.md', '.mdx'):
            return

        # Asegurar que el path sea absoluto usando el contexto del proyecto
        project_dir = os.environ.get('CLAUDE_PROJECT_DIR', '.')
        full_path = Path(project_dir) / path

        if full_path.exists():
            content = full_path.read_text(encoding='utf-8')
            formatted = format_markdown(content)
            
            if formatted != content:
                full_path.write_text(formatted, encoding='utf-8')
                # El stdout de este script será visible en el log de Claude
                print(f"✨ Formatter: Lenguajes detectados y espacios corregidos en {path.name}")

    except Exception as e:
        # Los errores a stderr no rompen la ejecución de Claude pero notifican al dev
        print(f"⚠️ Error en markdown_formatter: {e}", file=sys.stderr)
        sys.exit(0) # Salimos con 0 para no bloquear el flujo de trabajo de Claude

if __name__ == "__main__":
    main()