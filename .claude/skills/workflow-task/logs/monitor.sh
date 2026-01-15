#!/bin/bash
# Monitor de logs de hooks workflow-task
# Uso: ./monitor.sh [opciones]
#   -f, --follow    Seguir logs en tiempo real (tail -f)
#   -n NUM          Mostrar últimas NUM líneas (default: 50)
#   -e, --errors    Solo mostrar errores
#   -t, --today     Solo logs de hoy
#   -s, --stats     Mostrar estadísticas

LOGS_DIR="$(cd "$(dirname "$0")" && pwd)"
MAIN_LOG="$LOGS_DIR/hooks.log"
TODAY=$(date +%Y-%m-%d)
SESSION_LOG="$LOGS_DIR/session_$TODAY.log"

show_help() {
    echo "Monitor de Hooks Workflow-Task"
    echo ""
    echo "Uso: ./monitor.sh [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -f, --follow    Seguir logs en tiempo real"
    echo "  -n NUM          Mostrar últimas NUM líneas (default: 50)"
    echo "  -e, --errors    Solo mostrar errores y warnings"
    echo "  -t, --today     Solo logs de hoy"
    echo "  -s, --stats     Mostrar estadísticas de hooks"
    echo "  -c, --clear     Limpiar logs (mantiene últimas 1000 líneas)"
    echo "  -h, --help      Mostrar esta ayuda"
}

show_stats() {
    echo "📊 Estadísticas de Hooks"
    echo "========================"

    if [ -f "$MAIN_LOG" ]; then
        total=$(grep -c "\[INFO\]" "$MAIN_LOG" 2>/dev/null || echo "0")
        errors=$(grep -c "\[ERROR\]" "$MAIN_LOG" 2>/dev/null || echo "0")
        warns=$(grep -c "\[WARN\]" "$MAIN_LOG" 2>/dev/null || echo "0")

        pre_workflow=$(grep -c "\[pre_workflow\]" "$MAIN_LOG" 2>/dev/null || echo "0")
        post_phase=$(grep -c "\[post_phase\]" "$MAIN_LOG" 2>/dev/null || echo "0")
        post_workflow=$(grep -c "\[post_workflow\]" "$MAIN_LOG" 2>/dev/null || echo "0")

        echo "Total eventos: $total"
        echo "Errores: $errors"
        echo "Warnings: $warns"
        echo ""
        echo "Por hook:"
        echo "  pre_workflow:  $pre_workflow"
        echo "  post_phase:    $post_phase"
        echo "  post_workflow: $post_workflow"
    else
        echo "No hay logs disponibles"
    fi
}

clear_logs() {
    echo "🧹 Limpiando logs..."
    if [ -f "$MAIN_LOG" ]; then
        tail -n 1000 "$MAIN_LOG" > "$MAIN_LOG.tmp"
        mv "$MAIN_LOG.tmp" "$MAIN_LOG"
        echo "✅ Logs truncados a últimas 1000 líneas"
    fi
}

# Parse arguments
FOLLOW=false
LINES=50
ERRORS_ONLY=false
TODAY_ONLY=false
LOG_FILE="$MAIN_LOG"

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n)
            LINES="$2"
            shift 2
            ;;
        -e|--errors)
            ERRORS_ONLY=true
            shift
            ;;
        -t|--today)
            TODAY_ONLY=true
            LOG_FILE="$SESSION_LOG"
            shift
            ;;
        -s|--stats)
            show_stats
            exit 0
            ;;
        -c|--clear)
            clear_logs
            exit 0
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file no existe: $LOG_FILE"
    exit 1
fi

# Build filter
FILTER="cat"
if [ "$ERRORS_ONLY" = true ]; then
    FILTER="grep -E '\[(ERROR|WARN)\]'"
fi

# Show logs
echo "📋 Logs: $LOG_FILE"
echo "================================"

if [ "$FOLLOW" = true ]; then
    if [ "$ERRORS_ONLY" = true ]; then
        tail -f "$LOG_FILE" | grep --line-buffered -E '\[(ERROR|WARN)\]'
    else
        tail -f "$LOG_FILE"
    fi
else
    if [ "$ERRORS_ONLY" = true ]; then
        tail -n "$LINES" "$LOG_FILE" | grep -E '\[(ERROR|WARN)\]'
    else
        tail -n "$LINES" "$LOG_FILE"
    fi
fi
