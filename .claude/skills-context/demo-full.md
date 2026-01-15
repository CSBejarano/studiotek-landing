---
description: Guía interactiva para ejecutar demo en vivo del bot de Telegram con validación E2E (Telegram → DB → Google Calendar). Ideal para presentaciones de producto.
argument-hint: "[start|setup|verify|test|cleanup|troubleshoot]"
model: claude-sonnet-4-5-20250929
tools: bash, read, write, askuserquestion
---

# /demo - Demo Interactiva de Telegram Bot E2E

Ejecuta una demo profesional del sistema de booking via Telegram con validación completa de integración (Telegram → PostgreSQL → Google Calendar).

**Demo diseñada para:** Presentaciones de producto (< 10 minutos)
**Estado validado:** Issue #33 cerrado (9/9 bugs fixed) - Production Ready
**Última actualización:** 2025-12-06 (Problemas de Token Encryption, Timezone y Connection Pool resueltos)

## 🎯 Objetivo

Demostrar el flujo E2E completo del sistema:

1. Usuario envía mensaje a Telegram bot
2. Webhook procesa y AI responde
3. Booking se crea en PostgreSQL (Supabase)
4. Evento se sincroniza con Google Calendar
5. Notificación se envía al cliente

## 📋 Uso del Comando

```bash
# Ejecutar demo completa (recomendado)
/demo start

# Solo verificar pre-requisitos
/demo setup

# Solo verificar estado del sistema
/demo verify

# Solo ejecutar tests de conversación
/demo test

# Limpiar estado de la demo
/demo cleanup

# Ver soluciones rápidas para problemas comunes
/demo troubleshoot
```

---

## 🔄 Flujo de Ejecución

{{COMMAND}} = "{{argument}}"

### Determinar Acción

Si `{{COMMAND}}` está vacío o es "start":
  → Ejecutar flujo completo (Fase 0 → Fase 1 → Fase 2 → Fase 3)

Si `{{COMMAND}}` = "setup":
  → Solo ejecutar Fase 0 + Fase 1: Limpieza + Pre-requisitos

Si `{{COMMAND}}` = "verify":
  → Solo ejecutar Fase 2: Verificación

Si `{{COMMAND}}` = "test":
  → Solo ejecutar Fase 3: Tests

Si `{{COMMAND}}` = "cleanup":
  → Ejecutar limpieza de estado

Si `{{COMMAND}}` = "troubleshoot":
  → Mostrar guía de troubleshooting

---

## 🧹 Fase 0: Limpieza del Entorno (CRÍTICO)

**IMPORTANTE:** Esta fase previene problemas de conexiones saturadas y tokens con SECRET_KEY incorrecto.

### 0.1 Matar Procesos Anteriores

```bash
# Matar todos los procesos uvicorn anteriores
pkill -9 -f uvicorn 2>/dev/null || echo "No uvicorn processes found"

# Matar procesos Python que puedan tener conexiones a BD abiertas
# (Excluimos el proceso actual)
pkill -9 -f "python.*app" 2>/dev/null || echo "No app processes found"

# Esperar a que las conexiones se liberen en Supabase (30 segundos)
echo "⏳ Esperando 30 segundos para liberar conexiones de BD..."
sleep 30
```

### 0.2 Limpiar PIDs Antiguos

```bash
# Eliminar PIDs de demos anteriores
rm -f /tmp/fastapi_demo.pid /tmp/ngrok_demo.pid 2>/dev/null
rm -f /tmp/fastapi_demo.log /tmp/ngrok_demo.log 2>/dev/null
echo "✅ Archivos temporales limpiados"
```

### 0.3 Matar ngrok Anterior

```bash
# Matar ngrok anterior si existe
pkill -9 -f ngrok 2>/dev/null || echo "No ngrok processes found"
```

**Resultado esperado:** Entorno limpio sin procesos zombie ni conexiones saturadas.

---

## 📝 Fase 1: Pre-requisitos y Setup

### 1.1 Verificar Variables de Entorno

Lee el archivo `.env` y valida que las siguientes variables estén configuradas:

**CRÍTICAS (obligatorias):**
```bash
# ✅ Verificar que existan y no estén vacías
DATABASE_URL         # PostgreSQL con asyncpg driver
SECRET_KEY          # Min 32 chars - IMPORTANTE: Debe ser el mismo que se usó para encriptar tokens
OPENAI_API_KEY      # Para PydanticAI agents
TELEGRAM_BOT_TOKEN  # Format: 123456789:ABC-DEF...
TELEGRAM_WEBHOOK_SECRET  # Min 32 chars para validación
```

**OPCIONALES (para E2E completo):**
```bash
# ⚠️ Advertir si faltan (Google Calendar sync no funcionará)
GOOGLE_TEST_ACCESS_TOKEN   # OAuth2 access token
GOOGLE_TEST_REFRESH_TOKEN  # OAuth2 refresh token
GOOGLE_TEST_CALENDAR_ID    # Calendar ID target
```

**Acción:**
- Si ALGUNA variable CRÍTICA falta → DETENER y mostrar error claro
- Si variables OPCIONALES faltan → Advertir pero continuar (demo funcionará sin Calendar sync)

### 1.2 Verificar Conectividad de Base de Datos

```bash
# Test database connection
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def test():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('SELECT 1'))
        print('✅ Database connected')

asyncio.run(test())
"
```

**Resultado esperado:** `✅ Database connected`

Si falla → Ver sección Troubleshooting (Problema 8: Connection Pool Exhausted)

### 1.3 Verificar Timezone del Business (CRÍTICO)

**IMPORTANTE:** El timezone DEBE ser `Europe/Madrid` para que los eventos de Calendar se creen en la hora correcta.

```bash
# Verificar timezone del business
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('''
            SELECT id, name, timezone FROM businesses LIMIT 1
        '''))
        business = result.first()
        if business:
            tz = business[2]
            if tz == 'Europe/Madrid':
                print(f'✅ Timezone correcto: {tz}')
            else:
                print(f'❌ Timezone INCORRECTO: {tz}')
                print(f'   DEBE ser: Europe/Madrid')
                print(f'   Ejecutar: UPDATE businesses SET timezone = '\''Europe/Madrid'\'' WHERE id = '\''{business[0]}'\'';')
        else:
            print('❌ No business found')

asyncio.run(check())
"
```

**Resultado esperado:** `✅ Timezone correcto: Europe/Madrid`

**Si el timezone es incorrecto, corregirlo ANTES de continuar:**
```sql
UPDATE businesses SET timezone = 'Europe/Madrid', updated_at = NOW()
WHERE id = '<business_id>';
```

### 1.4 Re-encriptar Tokens OAuth con SECRET_KEY Actual (CRÍTICO)

**IMPORTANTE:** uvicorn con `--reload` NO recarga cuando cambia `.env`, solo cuando cambia código Python.
Si el servidor estaba corriendo y cambiaste SECRET_KEY en `.env`, los tokens se desencriptarán con una key incorrecta.

```bash
# Re-encriptar tokens y actualizar en BD
python -c "
import asyncio
import os
import sys
from dotenv import load_dotenv

# Forzar recarga de .env
load_dotenv('.env', override=True)

from app.infrastructure.auth.google_oauth import GoogleOAuth2Handler
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text
from datetime import datetime, UTC, timedelta

async def setup():
    access_token = os.getenv('GOOGLE_TEST_ACCESS_TOKEN')
    refresh_token = os.getenv('GOOGLE_TEST_REFRESH_TOKEN')

    if not access_token or not refresh_token:
        print('⚠️ GOOGLE_TEST tokens no configurados - Calendar sync no funcionará')
        return

    handler = GoogleOAuth2Handler()

    # Encriptar tokens con SECRET_KEY actual
    encrypted_access = handler.encrypt_token(access_token)
    encrypted_refresh = handler.encrypt_token(refresh_token)

    async with AsyncSessionLocal() as session:
        # Obtener employee_calendar activo
        result = await session.execute(text('''
            SELECT ec.employee_id, ec.calendar_id
            FROM employee_calendars ec
            WHERE ec.is_active = true
            LIMIT 1
        '''))
        ec = result.first()

        if ec:
            # Actualizar tokens encriptados
            await session.execute(text('''
                UPDATE employee_calendars
                SET
                    access_token_encrypted = :access,
                    refresh_token_encrypted = :refresh,
                    token_expires_at = :expires,
                    updated_at = NOW()
                WHERE employee_id = :emp_id
            '''), {
                'access': encrypted_access,
                'refresh': encrypted_refresh,
                'expires': datetime.now(UTC) + timedelta(hours=1),
                'emp_id': str(ec[0])
            })
            await session.commit()
            print(f'✅ Tokens re-encriptados para employee: {ec[0]}')
            print(f'   Calendar ID: {ec[1]}')
        else:
            print('⚠️ No hay employee_calendar activo - ejecutar setup_employee_calendar.py')

asyncio.run(setup())
"
```

**Resultado esperado:** `✅ Tokens re-encriptados para employee: <UUID>`

### 1.5 Setup Employee Calendar (si no existe)

Si el paso anterior indicó que no hay employee_calendar:

```bash
# Configurar employee_calendar record con tokens OAuth2
python scripts/setup_employee_calendar.py
```

**Resultado esperado:**
```
Found business: [Nombre] (ID: [UUID])
Found employee: [Nombre] (ID: [UUID])
Employee calendar configured successfully!
  Employee ID: [UUID]
  Calendar ID: [calendar_id]
  Token expires: [timestamp]
```

### 1.6 Verificar Estado de Migraciones

```bash
# Verificar que todas las migraciones están aplicadas
alembic current
alembic check
```

**Resultado esperado:**
```
[revision_id] (head)
No new upgrade operations detected.
```

Si hay migraciones pendientes:
```bash
alembic upgrade head
```

---

## 🚀 Fase 2: Iniciar Servidores y Configurar Webhook

### 2.1 Iniciar FastAPI Server

**Acción:** Iniciar servidor en modo background

**IMPORTANTE:** El servidor cargará SECRET_KEY desde .env al iniciar. Si luego cambias .env, debes REINICIAR el servidor.

```bash
# Iniciar servidor FastAPI en puerto 8000 (background)
nohup uvicorn app.presentation.main:app --host 0.0.0.0 --port 8000 --reload > /tmp/fastapi_demo.log 2>&1 &

# Guardar PID para cleanup posterior
echo $! > /tmp/fastapi_demo.pid
```

**Esperar 5 segundos para startup**

```bash
sleep 5
```

**Verificar que el servidor está corriendo:**

```bash
# Health check
curl -s http://localhost:8000/health || echo "❌ FastAPI no respondió"
```

**Resultado esperado:** `{"status": "healthy"}` o similar

**Ver logs si falla:**
```bash
tail -n 50 /tmp/fastapi_demo.log
```

**Si ves error `MaxClientsInSessionMode`:** Ver Troubleshooting Problema 8.

### 2.2 Iniciar ngrok Tunnel

**Acción:** Iniciar ngrok para exponer webhook público

```bash
# Iniciar ngrok en puerto 8000 (background)
nohup ngrok http 8000 --log=stdout > /tmp/ngrok_demo.log 2>&1 &

# Guardar PID
echo $! > /tmp/ngrok_demo.pid
```

**Esperar 5 segundos para que ngrok establezca el tunnel**

```bash
sleep 5
```

**Obtener URL pública de ngrok:**

```bash
# Obtener URL del tunnel via API de ngrok
curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4
```

**Guardar la URL en variable de ambiente para uso posterior:**

```bash
export NGROK_URL="<url_obtenida>"
echo "🌐 ngrok URL: $NGROK_URL"
```

**Resultado esperado:** `https://abc123.ngrok.io` (URL cambia en cada ejecución)

### 2.3 Configurar Webhook de Telegram

**Acción:** Registrar webhook URL en Telegram Bot API

```bash
# Construir webhook URL completa
WEBHOOK_URL="${NGROK_URL}/api/v1/webhooks/telegram"

# Configurar webhook con secret token
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\",
    \"allowed_updates\": [\"message\", \"edited_message\"]
  }"
```

**Resultado esperado:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

**Verificar que el webhook está configurado:**

```bash
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo" | jq
```

**Resultado esperado:**
```json
{
  "ok": true,
  "result": {
    "url": "https://abc123.ngrok.io/api/v1/webhooks/telegram",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

### 2.4 Reporte de Estado

**Mostrar resumen al usuario:**

```markdown
## ✅ Servidores Iniciados

**FastAPI:**
- Status: ✅ Running
- URL: http://localhost:8000
- Logs: /tmp/fastapi_demo.log
- PID: [PID_VALUE]

**ngrok:**
- Status: ✅ Running
- Public URL: [NGROK_URL]
- Logs: /tmp/ngrok_demo.log
- PID: [PID_VALUE]

**Telegram Webhook:**
- Status: ✅ Configured
- Webhook URL: [NGROK_URL]/api/v1/webhooks/telegram
- Secret Token: Configured
- Allowed Updates: message, edited_message

## 🎯 Sistema Listo para Demo

Todo está configurado y funcionando. Procede a Fase 3: Tests.
```

---

## 🧪 Fase 3: Ejecutar Tests de Conversación

### 3.1 Presentar Mensajes de Prueba

**Mostrar al usuario:**

```markdown
## 📱 Mensajes para Enviar al Bot

Envía los siguientes mensajes EN ORDEN a tu bot de Telegram:
(Usa la app de Telegram en tu teléfono o escritorio)

### Test 1: CREATE Booking
**Mensaje:**
> Quiero cortarme el pelo el martes que viene a las 10

**Resultado esperado:**
- Bot responde con confirmación
- Booking creado en DB
- Evento creado en Google Calendar (si configurado)

---

### Test 2: UPDATE Booking
**Mensaje:**
> Cambiar mi cita a las 2pm

**Resultado esperado:**
- Bot responde con confirmación
- Booking actualizado en DB (end_time cambia)
- Evento actualizado en Google Calendar (si configurado)

---

### Test 3: CANCEL Booking
**Mensaje:**
> Cancelar mi cita

**Resultado esperado:**
- Bot responde con confirmación
- Booking marcado como CANCELLED en DB
- Evento eliminado en Google Calendar (si configurado)

---

### Test 4: QUERY - Horarios Disponibles
**Mensaje:**
> ¿Qué horarios tienen disponibles mañana?

**Resultado esperado:**
- Bot responde con slots disponibles

---

### Test 5: QUERY - Servicios
**Mensaje:**
> ¿Qué servicios ofrecen?

**Resultado esperado:**
- Bot responde con lista de servicios y precios

---

## ⏸️ Pausa

**IMPORTANTE:** NO continúes automáticamente.

Espera a que el usuario confirme que ha enviado los mensajes.

Pregunta: "¿Has enviado los mensajes de prueba al bot?"
```

**Acción:** Usar `AskUserQuestion` para confirmar

```
¿Has enviado los mensajes de prueba al bot de Telegram? (responde 'sí' cuando hayas terminado)
```

**DETENER EJECUCIÓN AQUÍ** hasta recibir confirmación del usuario.

### 3.2 Verificar Resultados en Base de Datos

Una vez que el usuario confirma, ejecutar queries de verificación:

**Query 1: Verificar último booking creado con estado de sync**

```bash
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def verify():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('''
            SELECT
                id, customer_id, status, start_time, end_time,
                google_event_id, sync_status, synced_at, created_at
            FROM bookings
            ORDER BY created_at DESC
            LIMIT 1
        '''))
        booking = result.first()
        if booking:
            print(f'✅ Último Booking:')
            print(f'  ID: {booking[0]}')
            print(f'  Customer: {booking[1]}')
            print(f'  Status: {booking[2]}')
            print(f'  Time: {booking[3]} → {booking[4]}')
            print(f'  Google Event ID: {booking[5] or \"❌ No sincronizado\"}')
            print(f'  Sync Status: {booking[6] or \"pending\"}')
            print(f'  Synced At: {booking[7] or \"N/A\"}')

            # Verificar si el sync falló
            if not booking[5] and booking[2] == 'confirmed':
                print('')
                print('⚠️ ADVERTENCIA: Booking confirmado pero NO sincronizado con Calendar')
                print('   Ver Troubleshooting Problema 6 (Token Encryption Mismatch)')
        else:
            print('❌ No bookings found')

asyncio.run(verify())
"
```

**Query 2: Verificar mensajes en conversation_messages**

```bash
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def verify():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('''
            SELECT
                role, content, created_at
            FROM conversation_messages
            ORDER BY created_at DESC
            LIMIT 5
        '''))
        messages = result.fetchall()
        print(f'✅ Últimos 5 mensajes:')
        for msg in messages:
            print(f'  [{msg[0]}] {msg[1][:50]}... ({msg[2]})')

asyncio.run(verify())
"
```

**Query 3: Verificar eventos de Telegram recibidos**

```bash
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def verify():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('''
            SELECT
                update_id, event_type, processed, created_at
            FROM telegram_events
            ORDER BY created_at DESC
            LIMIT 5
        '''))
        events = result.fetchall()
        print(f'✅ Últimos 5 eventos de Telegram:')
        for evt in events:
            status = '✅' if evt[2] else '⏳'
            print(f'  {status} Update {evt[0]} - {evt[1]} ({evt[3]})')

asyncio.run(verify())
"
```

### 3.3 Verificar Google Calendar Sync (si configurado)

Si las variables `GOOGLE_TEST_*` están configuradas:

```bash
# Verificar eventos en Google Calendar
python scripts/trigger_calendar_sync.py --verify
```

**Resultado esperado:**
- Lista de eventos recientes en el calendar
- Debe incluir el evento creado/actualizado/eliminado según los tests

**Si el evento no aparece o tiene hora incorrecta:** Ver Troubleshooting Problemas 6 y 7.

### 3.4 Mostrar Logs de Debug

**Mostrar logs del servidor FastAPI:**

```bash
# Ver últimas 50 líneas de logs
tail -n 50 /tmp/fastapi_demo.log
```

**Buscar errores:**

```bash
# Buscar líneas con ERROR o WARNING
grep -E "(ERROR|WARNING)" /tmp/fastapi_demo.log | tail -20
```

**Buscar específicamente errores de token encryption:**

```bash
# Buscar error de Fernet InvalidToken
grep -E "(InvalidToken|Fernet|decrypt)" /tmp/fastapi_demo.log | tail -10
```

### 3.5 Reporte de Validación

**Mostrar resumen al usuario:**

```markdown
## ✅ Validación E2E Completada

### 📊 Resultados

**Database:**
- ✅ Bookings creados: [COUNT]
- ✅ Mensajes procesados: [COUNT]
- ✅ Eventos Telegram recibidos: [COUNT]

**Google Calendar Sync:**
- [✅ o ⚠️] Estado: [Configurado/No configurado]
- [✅ o ❌] Eventos sincronizados: [SÍ/NO]
- [✅ o ❌] Hora correcta (Europe/Madrid): [SÍ/NO]

**Logs del Sistema:**
- ✅ FastAPI logs disponibles en: /tmp/fastapi_demo.log
- [✅ o ⚠️] Errores detectados: [COUNT]

### 🎉 Demo Finalizada

El sistema está funcionando correctamente. Todos los flujos E2E validados:
- Telegram → Webhook → AI Processing
- Database persistence (RLS multi-tenancy)
- Google Calendar sync (si configurado)
- Notificaciones enviadas

**Próximos pasos:**
1. Si quieres limpiar el estado: `/demo cleanup`
2. Si hubo problemas: `/demo troubleshoot`
```

---

## 🧹 Cleanup: Limpiar Estado de la Demo

**Acción:** Detener servidores y limpiar archivos temporales

### 1. Detener FastAPI Server

```bash
# Leer PID y terminar proceso
if [ -f /tmp/fastapi_demo.pid ]; then
  kill $(cat /tmp/fastapi_demo.pid) 2>/dev/null || echo "FastAPI ya estaba detenido"
  rm /tmp/fastapi_demo.pid
fi

# También matar cualquier proceso uvicorn residual
pkill -9 -f uvicorn 2>/dev/null || true
```

### 2. Detener ngrok

```bash
# Leer PID y terminar proceso
if [ -f /tmp/ngrok_demo.pid ]; then
  kill $(cat /tmp/ngrok_demo.pid) 2>/dev/null || echo "ngrok ya estaba detenido"
  rm /tmp/ngrok_demo.pid
fi

# También matar cualquier proceso ngrok residual
pkill -9 -f ngrok 2>/dev/null || true
```

### 3. Eliminar Webhook de Telegram

```bash
# Remover webhook configurado
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook"
```

### 4. Limpiar Logs Temporales

```bash
# Eliminar archivos de log
rm -f /tmp/fastapi_demo.log /tmp/ngrok_demo.log
```

### 5. Reporte de Cleanup

```markdown
## ✅ Cleanup Completado

**Acciones realizadas:**
- ✅ FastAPI server detenido
- ✅ ngrok tunnel cerrado
- ✅ Telegram webhook eliminado
- ✅ Logs temporales eliminados

**Estado final:**
- Sistema limpio y listo para nueva demo
- Base de datos conserva los bookings de prueba (puedes eliminarlos manualmente si deseas)
- Las conexiones a Supabase se liberarán automáticamente en ~5 minutos
```

---

## 🔧 Troubleshooting: Soluciones Rápidas

### Problema 1: Webhook no recibe eventos

**Síntomas:**
- Envías mensajes al bot pero no hay respuesta
- Logs de FastAPI no muestran requests entrantes
- `telegram_events` table vacía

**Posibles causas y soluciones:**

**A) ngrok URL cambió:**
```bash
# Verificar URL actual de ngrok
curl -s http://localhost:4040/api/tunnels | grep public_url

# Reconfigurar webhook con nueva URL
NGROK_URL="<nueva_url>"
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${NGROK_URL}/api/v1/webhooks/telegram\", \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\"}"
```

**B) Secret token incorrecto:**
```bash
# Verificar que TELEGRAM_WEBHOOK_SECRET en .env coincide con el configurado
grep TELEGRAM_WEBHOOK_SECRET .env

# Reconfigurar webhook con secret correcto
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${NGROK_URL}/api/v1/webhooks/telegram\", \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\"}"
```

**C) FastAPI no está escuchando:**
```bash
# Verificar que el servidor está corriendo
curl http://localhost:8000/health

# Si no responde, reiniciar:
/demo cleanup
/demo start
```

---

### Problema 2: RLS Context no configurado

**Síntomas:**
- Error en logs: `Row Level Security context not set`
- Queries fallan con permisos insuficientes

**Solución:**

El middleware `RLSMiddleware` debe estar configurado correctamente. Verificar:

```bash
# Verificar que el middleware está registrado
grep -r "RLSMiddleware" app/presentation/main.py
```

**Si falta, agregar en `app/presentation/main.py`:**

```python
from app.presentation.middleware.rls_middleware import RLSMiddleware

app.add_middleware(RLSMiddleware)
```

---

### Problema 3: Google Calendar Sync falla

**Síntomas:**
- Bookings se crean en DB pero no aparecen en Calendar
- Error en logs: `No employee_calendar found`

**Soluciones:**

**A) employee_calendar no configurado:**
```bash
# Verificar si existe el record
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('SELECT COUNT(*) FROM employee_calendars WHERE is_active = true'))
        count = result.scalar()
        print(f'Active employee_calendars: {count}')

asyncio.run(check())
"

# Si count = 0, ejecutar setup:
python scripts/setup_employee_calendar.py
```

**B) Access token expirado:**
```bash
# Verificar expiración del token
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text
from datetime import datetime, UTC

async def check():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('SELECT token_expires_at FROM employee_calendars WHERE is_active = true LIMIT 1'))
        expires_at = result.scalar()
        if expires_at:
            now = datetime.now(UTC)
            if expires_at < now:
                print(f'❌ Token expired at {expires_at}')
            else:
                print(f'✅ Token valid until {expires_at}')
        else:
            print('❌ No employee_calendar found')

asyncio.run(check())
"

# Si expiró, renovar con setup:
python scripts/setup_employee_calendar.py
```

**C) Credenciales de Google inválidas:**

Verificar que las variables en `.env` son correctas:
```bash
grep GOOGLE_TEST .env

# Deben estar configuradas:
# GOOGLE_TEST_ACCESS_TOKEN=ya29.a0...
# GOOGLE_TEST_REFRESH_TOKEN=1//0...
# GOOGLE_TEST_CALENDAR_ID=abc123@group.calendar.google.com
```

Si faltan, obtener nuevas credenciales siguiendo: `tests/e2e/REAL_APIS_SETUP.md`

---

### Problema 4: AI no responde

**Síntomas:**
- Bot recibe mensajes pero no genera respuestas
- Error en logs: `OpenAI API error`

**Soluciones:**

**A) API Key inválida o expirada:**
```bash
# Verificar que la key está configurada
grep OPENAI_API_KEY .env

# Testear la key:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"

# Si falla, actualizar key en .env
```

**B) Rate limit o cuota excedida:**

Ver logs de FastAPI:
```bash
grep "OpenAI" /tmp/fastapi_demo.log | tail -20
```

Si ves `rate_limit_exceeded` o `insufficient_quota`:
- Esperar 1 minuto y reintentar
- Verificar cuota en: https://platform.openai.com/usage

---

### Problema 5: Database connection error

**Síntomas:**
- Error: `could not connect to server`
- Error: `SSL connection has been closed unexpectedly`

**Soluciones:**

**A) Verificar DATABASE_URL en .env:**
```bash
grep DATABASE_URL .env

# Debe tener formato:
# postgresql+asyncpg://postgres.PROJECT_ID:PASSWORD@aws-0-region.pooler.supabase.com:5432/postgres?ssl=require
```

**B) Verificar conectividad:**
```bash
# Ping al host de Supabase
ping -c 3 aws-0-us-east-1.pooler.supabase.com

# Si falla, verificar DNS y conexión de red
```

**C) Verificar credenciales de Supabase:**

Ir a Supabase Dashboard → Settings → Database → Connection String

Copiar el "Session mode" connection string y actualizar en `.env`

---

### Problema 6: Token Encryption Mismatch (InvalidToken) ⭐ NUEVO

**Síntomas:**
- Error en logs: `cryptography.fernet.InvalidToken`
- Booking se crea pero `sync_status` queda como "pending"
- `google_event_id` y `synced_at` quedan NULL

**Causa Raíz:**
- uvicorn con `--reload` NO recarga cuando cambia `.env`, solo cuando cambia código Python
- El servidor tiene cacheado un SECRET_KEY diferente al que se usó para encriptar los tokens

**Solución Paso a Paso:**

**Paso 1: Matar completamente el servidor**
```bash
pkill -9 -f uvicorn
```

**Paso 2: Re-encriptar tokens con SECRET_KEY correcto**
```bash
python -c "
import os
import sys
from dotenv import load_dotenv

# Forzar recarga de .env
load_dotenv('.env', override=True)

from app.infrastructure.auth.google_oauth import GoogleOAuth2Handler

handler = GoogleOAuth2Handler()
access_token = os.getenv('GOOGLE_TEST_ACCESS_TOKEN')
refresh_token = os.getenv('GOOGLE_TEST_REFRESH_TOKEN')

if access_token and refresh_token:
    encrypted_access = handler.encrypt_token(access_token)
    encrypted_refresh = handler.encrypt_token(refresh_token)
    print('Encrypted Access Token:')
    print(encrypted_access)
    print('')
    print('Encrypted Refresh Token:')
    print(encrypted_refresh)
else:
    print('❌ GOOGLE_TEST tokens no encontrados en .env')
"
```

**Paso 3: Actualizar tokens en Supabase**
```sql
UPDATE employee_calendars
SET
    access_token_encrypted = '<encrypted_access_del_paso_2>',
    refresh_token_encrypted = '<encrypted_refresh_del_paso_2>',
    token_expires_at = NOW() + INTERVAL '1 hour',
    updated_at = NOW()
WHERE employee_id = '<employee_uuid>';
```

**Paso 4: Esperar 30 segundos para que las conexiones se liberen**
```bash
sleep 30
```

**Paso 5: Reiniciar servidor**
```bash
uvicorn app.presentation.main:app --host 0.0.0.0 --port 8000 --reload
```

**Prevención Futura:**
- SIEMPRE reiniciar el servidor después de cambiar `.env`
- Usar el paso 1.4 de esta guía antes de iniciar la demo

---

### Problema 7: Timezone Mismatch (Eventos en Hora Incorrecta) ⭐ NUEVO

**Síntomas:**
- El evento en Google Calendar se crea a una hora diferente a la solicitada
- Ejemplo: Usuario pide 17:00 pero evento aparece a las 21:00

**Causa Raíz:**
- El business tiene configurado un timezone incorrecto (ej: `America/Argentina/Buenos_Aires` en vez de `Europe/Madrid`)
- La diferencia es de 4 horas (UTC-3 vs UTC+1)

**Diagnóstico:**
```bash
# Verificar timezone del business
python -c "
import asyncio
from app.infrastructure.database.connection import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text('SELECT id, name, timezone FROM businesses'))
        for row in result.fetchall():
            print(f'{row[1]}: {row[2]}')

asyncio.run(check())
"
```

**Solución:**

**Paso 1: Actualizar timezone del business**
```sql
UPDATE businesses
SET timezone = 'Europe/Madrid', updated_at = NOW()
WHERE id = '<business_uuid>';
```

**Paso 2: Eliminar el evento incorrecto de Google Calendar (manualmente o vía API)**

**Paso 3: Recrear el booking o triggear sync manualmente**
```bash
python scripts/trigger_calendar_sync.py --booking-id <booking_uuid>
```

**Configuración Correcta:**
- Timezone para este proyecto: `Europe/Madrid`
- UTC Offset: UTC+1 (invierno) / UTC+2 (verano)
- Documentación: `ai_docs/config/TIMEZONE_CONFIG.md`

---

### Problema 8: Database Connection Pool Exhausted ⭐ NUEVO

**Síntomas:**
- Error: `asyncpg.exceptions.InternalServerError: MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size`
- El servidor no puede conectarse a la base de datos
- Error al iniciar FastAPI

**Causa Raíz:**
- Supabase en "Session Mode" tiene un límite de conexiones en el pool
- Múltiples scripts de prueba o servidores abiertos consumen todas las conexiones

**Solución Inmediata:**

**Opción 1: Esperar**
Las conexiones expiran automáticamente después de ~5 minutos de inactividad.

**Opción 2: Reiniciar desde Supabase Dashboard**
1. Ir a Supabase Dashboard → Database → Connection Pooling
2. Click "Restart" en el pooler

**Opción 3: Matar todos los procesos locales**
```bash
# Matar todos los procesos Python que puedan tener conexiones
pkill -9 -f python
pkill -9 -f uvicorn

# Esperar 30 segundos para que las conexiones se liberen
sleep 30

# Reiniciar servidor
uvicorn app.presentation.main:app --host 0.0.0.0 --port 8000 --reload
```

**Prevención Futura:**

**1. Reducir pool size en .env**
```env
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=3
```

**2. Usar context managers correctamente**
```python
async with async_session() as session:
    # La conexión se cierra automáticamente al salir
    pass
```

**3. No ejecutar múltiples scripts de prueba simultáneamente**

**4. Usar Fase 0 de esta guía antes de cada demo**
La Fase 0 mata procesos anteriores y espera para liberar conexiones.

---

## 📚 Referencias Rápidas

**Documentación del Proyecto:**
- `CLAUDE.md` - Overview y quick reference
- `app/infrastructure/telegram/README.md` - Telegram integration details
- `app/infrastructure/ai/README.md` - PydanticAI multi-agent system
- `tests/e2e/REAL_APIS_SETUP.md` - Setup guide para APIs reales

**Documentación de Troubleshooting:**
- `ai_docs/reports/E2E_DEMO_TROUBLESHOOTING_2025-12-06.md` - Reporte detallado de problemas y soluciones
- `ai_docs/config/TIMEZONE_CONFIG.md` - Configuración de timezone

**Scripts Útiles:**
- `scripts/setup_employee_calendar.py` - Configurar Google Calendar OAuth
- `scripts/trigger_calendar_sync.py` - Trigger manual sync

**Comandos Make:**
```bash
make run      # Start development server (puerto 8000)
make test     # Run full test suite
make migrate  # Apply pending migrations
```

**Telegram Bot API:**
- Docs: https://core.telegram.org/bots/api
- BotFather: https://t.me/BotFather
- Webhook guide: https://core.telegram.org/bots/webhooks

**Comandos Útiles de Verificación:**
```bash
# Health check del servidor
curl -s http://localhost:8000/health

# URL de ngrok
curl -s http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'

# Estado del webhook de Telegram
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"

# Refrescar token de Google
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id=<CLIENT_ID>" \
  -d "client_secret=<CLIENT_SECRET>" \
  -d "refresh_token=<REFRESH_TOKEN>" \
  -d "grant_type=refresh_token"
```

---

## ✅ Checklist Pre-Demo (Para Imprimir)

Usa esta checklist antes de tu presentación:

```
Pre-Demo Checklist
==================

Configuración (.env):
☐ DATABASE_URL configurado
☐ SECRET_KEY configurado (min 32 chars)
☐ OPENAI_API_KEY configurado
☐ TELEGRAM_BOT_TOKEN configurado
☐ TELEGRAM_WEBHOOK_SECRET configurado (min 32 chars)
☐ GOOGLE_TEST_* configurado (opcional pero recomendado)

Base de Datos:
☐ Migraciones aplicadas (alembic current = head)
☐ employee_calendar configurado (python scripts/setup_employee_calendar.py)
☐ Test connection exitoso (SELECT 1)
☐ Business timezone = 'Europe/Madrid' (CRÍTICO)

Tokens OAuth:
☐ Tokens re-encriptados con SECRET_KEY actual (Fase 1.4)
☐ Token no expirado (< 1 hora desde refresh)

Telegram Bot:
☐ Bot creado con @BotFather
☐ Bot token guardado en .env
☐ Webhook secret generado y guardado en .env

Sistema:
☐ ngrok instalado (brew install ngrok o similar)
☐ Puerto 8000 disponible (no usado por otro proceso)
☐ Puerto 4040 disponible (ngrok API)
☐ Procesos anteriores terminados (Fase 0 ejecutada)
☐ Conexiones de BD liberadas (esperar 30 seg después de pkill)

Durante Demo:
☐ Fase 0 ejecutada (limpieza)
☐ FastAPI server iniciado (/demo start)
☐ ngrok tunnel activo
☐ Telegram webhook configurado
☐ Health check pasó (curl localhost:8000/health)
☐ Mensajes de prueba preparados
☐ Logs visibles en terminal secundaria (tail -f /tmp/fastapi_demo.log)

Post-Demo:
☐ Cleanup ejecutado (/demo cleanup)
☐ Servidores detenidos
☐ Webhook eliminado
```

---

**Nota Final:**

Este comando está diseñado para ser **interactivo y guiado**. No asumas el resultado de pasos críticos - siempre verifica y reporta al usuario antes de continuar.

**Principios de la demo:**
1. ✅ Verificar antes de ejecutar
2. ✅ Reportar estado después de cada paso
3. ✅ Pausar y preguntar cuando sea necesario (AskUserQuestion)
4. ✅ Proveer troubleshooting específico para cada error
5. ✅ Limpiar estado al finalizar
6. ✅ **NUEVO:** Ejecutar Fase 0 para prevenir problemas de conexiones y tokens

**¡Buena suerte en tu demo!** 🚀
