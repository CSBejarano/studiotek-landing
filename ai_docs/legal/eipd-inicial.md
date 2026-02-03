# Evaluacion Inicial de Impacto en Proteccion de Datos (EIPD)

| Campo | Valor |
|-------|-------|
| **Documento** | DOC-INT-3 |
| **Titulo** | Evaluacion Inicial de Impacto en Proteccion de Datos (EIPD) |
| **Version** | 1.0 |
| **Fecha** | 29 de enero de 2026 |
| **Autor** | StudioTek S.L. (generado con apoyo de IA) |
| **Base Legal** | RGPD Art. 35, LOPDGDD Art. 28, Guia AEPD "Gestion del riesgo y evaluacion de impacto" (Junio 2021), Directrices WP248 rev.01 del GT29/CEPD |
| **Estado** | Borrador - Pendiente revision legal por Isabel Perez |
| **Clasificacion** | Documento interno - Confidencial |
| **Herramientas AEPD** | EVALUA-RIESGO RGPD v2, GESTIONA-EIPD |

---

## Indice

1. [Descripcion Sistematica del Tratamiento](#1-descripcion-sistematica-del-tratamiento)
2. [Necesidad y Proporcionalidad](#2-necesidad-y-proporcionalidad)
3. [Identificacion y Evaluacion de Riesgos](#3-identificacion-y-evaluacion-de-riesgos)
4. [Medidas de Mitigacion](#4-medidas-de-mitigacion)
5. [Opinion de los Interesados](#5-opinion-de-los-interesados)
6. [Consulta Previa a la AEPD](#6-consulta-previa-a-la-aepd)
7. [Plan de Accion y Seguimiento](#7-plan-de-accion-y-seguimiento)

---

## Resumen Ejecutivo

StudioTek S.L. realiza esta Evaluacion Inicial de Impacto en Proteccion de Datos (EIPD) conforme al Art. 35 del RGPD, al identificar que sus tratamientos de datos personales, especialmente los que incorporan inteligencia artificial, pueden entraner un alto riesgo para los derechos y libertades de las personas fisicas.

**Tratamientos evaluados:**
- Landing page StudioTek (captacion de leads, chat IA, cookies, canal de denuncias).
- Producto KairosAI (chatbot WhatsApp con IA para gestion de reservas).
- Cliente Vitaeon (datos de salud - Art. 9 RGPD).

**Conclusion preliminar:**
- StudioTek landing: riesgo residual **MEDIO** - aceptable con condiciones.
- KairosAI general: riesgo residual **MEDIO** - aceptable con mejoras planificadas.
- Vitaeon (datos salud): riesgo residual **ALTO** - requiere medidas adicionales antes de despliegue.

---

## 1. Descripcion Sistematica del Tratamiento

### 1.1. Responsable del tratamiento

| Campo | Valor |
|-------|-------|
| **Denominacion social** | StudioTek S.L. |
| **CIF** | B-XXXXXXXX (TODO: CIF real) |
| **Direccion** | Calle XXXXX, N, Barcelona (TODO: direccion real) |
| **Email de contacto** | info@studiotek.es |
| **Email de privacidad** | privacidad@studiotek.es |
| **DPO** | No designado formalmente (hasDPO: false). Se recomienda designacion si se tratan datos de salud a gran escala (Art. 37.1.b RGPD) |

### 1.2. Inventario de tratamientos

| ID | Tratamiento | Sistema | Datos | Base Legal | Interesados |
|----|-------------|---------|-------|------------|-------------|
| T-01 | **Captacion de leads** | Formulario web + Supabase | Nombre, email, empresa, telefono, presupuesto, mensaje, servicio de interes | Consentimiento (Art. 6.1.a) | Visitantes web |
| T-02 | **Chat IA landing** | OpenAI GPT-4o-mini + Next.js | Mensajes del usuario, contexto de conversacion | Consentimiento (Art. 6.1.a) | Visitantes web |
| T-03 | **Asistente de voz** | OpenAI GPT-4 + Whisper + TTS-1 | Audio, transcripcion, mensajes | Consentimiento (Art. 6.1.a) | Visitantes web |
| T-04 | **Cookies y analitica** | Google Analytics, cookies funcionales | IP (anonimizada en GA4), comportamiento navegacion, preferencias cookies | Consentimiento (Art. 6.1.a) / Interes legitimo (Art. 6.1.f) para cookies tecnicas | Visitantes web |
| T-05 | **Canal de denuncias** | Formulario web + Supabase | Identidad informante (opcional), hechos denunciados, documentacion | Obligacion legal (Art. 6.1.c - Ley 2/2023) | Informantes |
| T-06 | **Chatbot WhatsApp KairosAI** | WhatsApp Business API + OpenAI GPT-4 + Supabase | Nombre, telefono, mensajes, datos reserva, historial conversacional | Ejecucion contrato (Art. 6.1.b) + Consentimiento (Art. 6.1.a) | Clientes finales B2C |
| T-07 | **KairosAI - Vitaeon** | WhatsApp + GPT-4 + Supabase | Datos de salud (Art. 9 RGPD), tipo tratamiento medico | Consentimiento explicito (Art. 9.2.a) | Pacientes de Vitaeon |
| T-08 | **Envio de emails** | Resend | Email, nombre, contenido del email | Ejecucion contrato (Art. 6.1.b) | Leads, clientes |

### 1.3. Flujo de datos

```text
VISITANTE WEB (StudioTek Landing)
    |
    |-- Formulario contacto --> Supabase (EU-Frankfurt) --> Resend (email)
    |-- Chat IA --> OpenAI API (EE.UU. - DPF) --> Respuesta al usuario
    |-- Asistente voz --> OpenAI Whisper (EE.UU.) --> OpenAI GPT-4 --> TTS-1 --> Audio
    |-- Cookies --> Google Analytics (anonimizado) / localStorage
    |-- Canal denuncias --> Supabase (EU-Frankfurt) --> Notificacion Responsable
    |
USUARIO FINAL (KairosAI via WhatsApp)
    |
    |-- WhatsApp Business API (Meta - EE.UU./Irlanda)
    |       |
    |       v
    |-- KairosAI Backend (Supabase EU)
    |       |
    |       |-- OpenAI GPT-4 (EE.UU. - DPF/SCCs)
    |       |-- PostgreSQL Supabase (EU-Frankfurt, RLS)
    |       |
    |       v
    |-- Respuesta al usuario via WhatsApp
    |
    |-- Dashboard cliente B2B (Vitaeon, etc.)
```

### 1.4. Encargados del tratamiento

| Encargado | Servicio | Ubicacion | Mecanismo TID | DPA |
|-----------|----------|-----------|---------------|-----|
| **Vercel** | Hosting frontend | EE.UU. / Global | DPF | Si |
| **Supabase** | Base de datos PostgreSQL | EU (Frankfurt) | SCCs | Si |
| **OpenAI** | GPT-4, GPT-4o-mini, Whisper, TTS-1 | EE.UU. | DPF + SCCs | Si (API data not used for training) |
| **Resend** | Envio de emails transaccionales | EU | SCCs | Si |
| **Google** | Google Analytics 4 | EE.UU. / Global | DPF | Si (datos anonimizados en GA4) |
| **Meta (WhatsApp)** | Canal de comunicacion WhatsApp Business | EE.UU. / Irlanda | DPF + SCCs | Si |

### 1.5. Categorias de datos

| Categoria | Datos Especificos | Art. 9 RGPD | Tratamiento(s) |
|-----------|-------------------|-------------|----------------|
| **Identificativos** | Nombre, email, telefono, empresa | No | T-01, T-06, T-07, T-08 |
| **Profesionales** | Cargo, empresa, presupuesto | No | T-01 |
| **Comunicaciones** | Mensajes de chat, mensajes WhatsApp, historial conversacional | No | T-02, T-03, T-06, T-07 |
| **Audio** | Grabaciones de voz (Whisper) | No | T-03 |
| **Comportamiento web** | Paginas visitadas, tiempo de sesion, clics | No | T-04 |
| **Denuncias** | Hechos denunciados, identidad informante (opcional) | No | T-05 |
| **Datos de salud** | Tipo de tratamiento medico, historial clinico parcial | **Si (Art. 9)** | T-07 (Vitaeon) |
| **Datos generados por IA** | Embeddings, respuestas generadas, clasificaciones | No | T-02, T-03, T-06, T-07 |

### 1.6. Plazos de conservacion

| Tipo de dato | Plazo | Justificacion |
|--------------|-------|---------------|
| Leads (formulario contacto) | 24 meses | Finalidad comercial |
| Mensajes de chat IA (landing) | Sesion (no persistidos) | Minimizacion |
| Conversaciones WhatsApp (KairosAI) | 12 meses | Mejora del servicio |
| Datos de reservas | 5 anos | Obligaciones fiscales y contractuales |
| Datos de salud (Vitaeon) | 10 anos | Obligacion legal sanitaria (Ley 41/2002) |
| Cookies analiticas | 13 meses | Guia AEPD cookies |
| Canal de denuncias | Max. 10 anos | Art. 26 Ley 2/2023 |
| Logs de IA (embeddings) | 6 meses | Depuracion y mejora |
| Emails transaccionales | 5 anos | Obligaciones fiscales |

---

## 2. Necesidad y Proporcionalidad

### 2.1. Juicio de idoneidad

**Pregunta:** Los tratamientos son adecuados para conseguir las finalidades perseguidas?

| Tratamiento | Finalidad | Idoneidad |
|-------------|-----------|-----------|
| T-01 Leads | Captacion comercial | **SI** - El formulario web es el canal estandar para captacion de leads B2B |
| T-02 Chat IA | Asistencia al visitante | **SI** - La IA permite responder consultas 24/7 con informacion relevante |
| T-03 Asistente voz | Accesibilidad e interaccion | **SI** - El reconocimiento de voz mejora la accesibilidad |
| T-04 Cookies | Analitica y mejora web | **SI** - GA4 proporciona metricas necesarias para mejorar la experiencia |
| T-05 Canal denuncias | Cumplimiento Ley 2/2023 | **SI** - Obligacion legal para empresas |
| T-06 Chatbot WhatsApp | Gestion de reservas | **SI** - WhatsApp tiene >90% penetracion en Espana; IA entiende lenguaje natural |
| T-07 Vitaeon | Atencion sanitaria con IA | **SI** - Permite atencion personalizada y reduccion de errores humanos |
| T-08 Emails | Comunicacion con leads/clientes | **SI** - Canal estandar de comunicacion empresarial |

### 2.2. Juicio de necesidad

**Pregunta:** Existen alternativas menos intrusivas que logren el mismo objetivo?

| Tratamiento | Alternativa menos intrusiva | Equivalente? | Conclusion |
|-------------|----------------------------|--------------|------------|
| T-02 Chat IA | FAQ estatica | No (no entiende lenguaje natural) | IA necesaria para la experiencia deseada |
| T-03 Voz | Solo texto | Parcialmente (excluye accesibilidad) | Audio necesario, se elimina tras transcripcion |
| T-04 Cookies | Sin analitica | No (sin metricas no hay mejora) | Analitica con IP anonimizada y consentimiento |
| T-06 WhatsApp IA | Chatbot basado en reglas | No (no comprende consultas complejas) | IA necesaria, datos minimizados |
| T-07 Vitaeon | Procesamiento manual | No escalable, mas errores | IA necesaria con EIPD y medidas reforzadas |

### 2.3. Juicio de proporcionalidad en sentido estricto

**Pregunta:** El beneficio del tratamiento supera la injerencia en los derechos de los interesados?

| Tratamiento | Beneficio | Injerencia | Balance |
|-------------|-----------|------------|---------|
| T-01 a T-05 (Landing) | Captacion comercial, asistencia, cumplimiento legal | Datos basicos, IA con OpenAI (DPF), cookies con consentimiento | **Favorable** |
| T-06 (KairosAI) | Gestion 24/7, reduccion errores, satisfaccion cliente | Transferencia a OpenAI (EE.UU.), perfilado basico | **Favorable con DPF+SCCs** |
| T-07 (Vitaeon) | Atencion sanitaria personalizada, reduccion errores clinicos | Datos Art. 9 con IA, transferencia internacional | **Favorable CON condiciones** (DPO, cifrado adicional, auditoria) |

### 2.4. Datos estrictamente necesarios

Para cada tratamiento se ha verificado que solo se recogen los datos estrictamente necesarios:

- **T-01 (Leads)**: `privacy_accepted` es obligatorio; `commercial_accepted` es opcional. Solo campos necesarios para contacto comercial.
- **T-02/T-03 (Chat IA)**: No se persisten conversaciones de chat de la landing en base de datos. Solo se envian al modelo para respuesta inmediata.
- **T-04 (Cookies)**: IP anonimizada en GA4. Consentimiento granular (analiticas separadas de marketing).
- **T-05 (Canal denuncias)**: IP hasheada (irreversible). Identidad del informante opcional.
- **T-06 (KairosAI)**: Solo datos de reserva y conversacion necesarios. Embeddings con TTL de 6 meses.
- **T-07 (Vitaeon)**: Datos de salud limitados al tipo de tratamiento medico solicitado.

---

## 3. Identificacion y Evaluacion de Riesgos

### 3.1. Criterios AEPD para obligatoriedad de EIPD

La AEPD establece una lista de 10 criterios (basados en las Directrices WP248). Si un tratamiento cumple 2 o mas, la EIPD es obligatoria:

| # | Criterio | StudioTek/KairosAI | Cumple |
|---|----------|-------------------|--------|
| 1 | Evaluacion o puntuacion (scoring/profiling) | Chatbot analiza preferencias del usuario | Parcial |
| 2 | Toma de decisiones automatizadas con efectos legales | Gestion de reservas (efecto limitado, no juridico) | No |
| 3 | Observacion sistematica | Analisis continuo de conversaciones WhatsApp 24/7 | **Si** |
| 4 | Datos sensibles o altamente personales | Vitaeon: datos de salud (Art. 9) | **Si** |
| 5 | Datos a gran escala | 10.000+ usuarios anuales estimados | **Si** |
| 6 | Combinacion de conjuntos de datos | Conversaciones + datos reserva + embeddings IA | Parcial |
| 7 | Datos de personas vulnerables | Posibles menores, pacientes | **Si** |
| 8 | Uso innovador o aplicacion de nuevas tecnologias | IA generativa (GPT-4) en WhatsApp | **Si** |
| 9 | Transferencias internacionales | OpenAI (EE.UU.) | **Si** |
| 10 | El tratamiento impide ejercer derechos | Opacidad del modelo IA (dificultad de explicabilidad) | Parcial |

**Resultado: StudioTek/KairosAI cumple los criterios 3, 4, 5, 7, 8 y 9 (6 de 10). La EIPD es OBLIGATORIA.**

### 3.2. Matriz de riesgos

| ID | Riesgo | Probabilidad | Gravedad | Nivel |
|----|--------|-------------|----------|-------|
| R01 | **Acceso no autorizado a datos de leads/conversaciones** | Media | Alta | **ALTO** |
| R02 | **Exposicion de datos de salud (Vitaeon)** | Baja | Muy Alta | **CRITICO** |
| R03 | **Transferencia ilegal a EE.UU. (invalidacion DPF/SCCs)** | Baja | Alta | **MEDIO** |
| R04 | **Sesgo discriminatorio en respuestas IA** | Media | Alta | **ALTO** |
| R05 | **Falta de transparencia en decisiones IA (caja negra)** | Alta | Media | **MEDIO** |
| R06 | **Retencion excesiva de datos (falta de automatizacion)** | Media | Media | **MEDIO** |
| R07 | **Alucinaciones de IA con impacto en usuarios** | Media | Alta | **ALTO** |
| R08 | **Consentimiento invalido de menores (<14 anos)** | Media | Alta | **ALTO** |
| R09 | **Fallo en ejercicio de derechos ARCO-POL** | Media | Media | **MEDIO** |
| R10 | **Filtracion de datos via prompt injection** | Baja | Alta | **MEDIO** |
| R11 | **Cookies sin consentimiento valido** | Baja | Media | **BAJO** |
| R12 | **Brecha en canal de denuncias (exposicion identidad)** | Baja | Muy Alta | **ALTO** |

### 3.3. Riesgos especificos por transferencias internacionales

| Proveedor | Pais destino | Mecanismo | Riesgo especifico |
|-----------|-------------|-----------|-------------------|
| **OpenAI** | EE.UU. | DPF + SCCs + DPA (no-training) | Posible acceso por autoridades EE.UU. (FISA 702). Mitigado por DPF y politica no-entrenamiento. Riesgo residual aceptable con revision trimestral. |
| **Vercel** | EE.UU. | DPF | Hosting de contenido estatico. Datos personales minimos (IPs en logs). Riesgo bajo. |
| **Meta (WhatsApp)** | EE.UU./Irlanda | DPF + SCCs | Metadatos de comunicacion. Cifrado E2E en WhatsApp. Riesgo medio por volumen. |
| **Google (GA4)** | EE.UU. | DPF | IP anonimizada en GA4. Riesgo bajo con consentimiento granular. |
| **Supabase** | EU (Frankfurt) | SCCs | Base de datos en EU. Sin transferencia a terceros paises. Riesgo bajo. |
| **Resend** | EU | SCCs | Envio de emails transaccionales. Datos basicos (email, nombre). Riesgo bajo. |

### 3.4. Riesgos especificos de IA generativa

| Riesgo IA | Descripcion | Impacto en derechos | Probabilidad |
|-----------|-------------|---------------------|-------------|
| **Alucinaciones** | GPT-4 genera informacion falsa (ej. confirma cita inexistente) | Dano economico, perdida de confianza | Media |
| **Sesgo** | Respuestas discriminatorias por genero, edad, origen | Discriminacion (Art. 21 Carta UE) | Media |
| **Opacidad** | Imposibilidad de explicar la decision del modelo | Limitacion derecho Art. 22 RGPD | Alta |
| **Data leakage** | Modelo filtra datos de otros usuarios en respuestas | Perdida de confidencialidad | Baja |
| **Prompt injection** | Usuario manipula el modelo para extraer informacion | Acceso no autorizado a datos | Baja |

---

## 4. Medidas de Mitigacion

### 4.1. Medidas tecnicas

| Riesgo | Medida | Tipo | Estado |
|--------|--------|------|--------|
| R01 (Acceso no autorizado) | RLS en PostgreSQL + cifrado AES-256 + TLS 1.3 | Preventiva | Implementado |
| R01 | MFA para administradores | Preventiva | Pendiente Q1 2026 |
| R02 (Datos salud) | RLS dedicado + cifrado capa aplicacion + consentimiento explicito | Preventiva | Parcial |
| R02 | Auditoria trimestral accesos datos salud | Detectiva | Pendiente |
| R03 (Transferencia ilegal) | DPF + SCCs + revision trimestral + alternativa EU en standby | Preventiva | Implementado |
| R04 (Sesgo IA) | Validacion de respuestas con reglas + testing diversidad | Preventiva/Detectiva | Parcial |
| R05 (Transparencia) | Aviso IA en primera interaccion + opcion atencion humana | Correctiva | Implementado |
| R06 (Retencion excesiva) | Cron de supresion automatica por plazos definidos | Preventiva | Pendiente |
| R07 (Alucinaciones) | System prompt restrictivo + validacion backend de acciones criticas | Preventiva | Parcial |
| R08 (Menores) | Verificacion de edad + consentimiento parental | Preventiva | Pendiente |
| R09 (Derechos ARCO-POL) | Portal automatizado + registro de solicitudes | Correctiva | Pendiente |
| R10 (Prompt injection) | Sanitizacion inputs + system prompt robusto + output filtering | Preventiva | Implementado |
| R11 (Cookies) | Banner RGPD con consentimiento granular + persistencia en DB | Preventiva | Implementado |
| R12 (Canal denuncias) | IP hasheada + UUID tracking + RLS + acceso solo Responsable | Preventiva | Implementado |

### 4.2. Medidas organizativas

| Medida | Descripcion | Estado |
|--------|-------------|--------|
| **Politica interna de uso de IA** (DOC-INT-2) | Marco normativo para uso de IA en la organizacion | Este sprint |
| **Codigo Etico** (DOC-INT-5) | Principios eticos con capitulo especifico de IA | Este sprint |
| **Formacion RGPD + IA** | Formacion anual para todo el personal | Planificada |
| **DPO** | Designacion de Delegado de Proteccion de Datos (obligatorio si datos salud a gran escala) | Pendiente |
| **DPA con encargados** | Contratos Art. 28 con todos los encargados | Firmados |
| **Protocolo de brechas** | Procedimiento de notificacion en 72h (Art. 33 RGPD) | Pendiente formalizacion |
| **Revision periodica** | Revision anual de esta EIPD | Planificada (Julio 2026) |

### 4.3. Medidas contractuales

| Encargado | Medida | Estado |
|-----------|--------|--------|
| **OpenAI** | DPA firmado + politica no-entrenamiento con datos API + DPF + SCCs | Activo |
| **Supabase** | DPA firmado + ISO 27001 + SOC 2 + datos en EU | Activo |
| **Vercel** | DPA firmado + DPF | Activo |
| **Meta (WhatsApp)** | DPA + SCCs + cifrado E2E | Activo |
| **Resend** | DPA + SCCs | Activo |
| **Google (GA4)** | DPA + DPF + anonimizacion IP | Activo |

### 4.4. Aplicacion de las 8 estrategias Privacy by Design (Art. 25 RGPD)

| Estrategia | Aplicacion en StudioTek |
|------------|------------------------|
| **MINIMIZAR** | Solo datos necesarios. Chat landing no persiste. Audio eliminado tras transcripcion. Embeddings con TTL 6 meses. |
| **OCULTAR** | Cifrado AES-256 reposo, TLS 1.3 transito, IP hasheada en denuncias, seudonimizacion en logs. |
| **SEPARAR** | RLS por tenant en PostgreSQL. Datos salud en tablas con politicas RLS reforzadas. |
| **ABSTRAER** | Estadisticas agregadas (k-anonimato). No datos individuales en dashboards. |
| **INFORMAR** | Aviso IA en primera interaccion. Politica privacidad completa. Informacion en 2 capas (Art. 11 LOPDGDD). |
| **CONTROLAR** | Derechos ARCO-POL via privacidad@studiotek.es. Opcion de atencion humana. Consentimiento granular cookies. |
| **CUMPLIR** | Esta EIPD, DOC-INT-2 (Politica IA), DOC-INT-5 (Codigo Etico), RAT, DPAs. |
| **DEMOSTRAR** | Documentacion completa. Registros de consentimiento. Logs de acceso. Evidencia auditable. |

---

## 5. Opinion de los Interesados

### 5.1. Consulta a representantes

Conforme al Art. 35.9 RGPD, se recabara la opinion de los interesados o sus representantes cuando sea posible:

| Grupo | Metodo de consulta | Estado | Resultado |
|-------|-------------------|--------|-----------|
| **Visitantes web** | Encuesta de satisfaccion con pregunta sobre privacidad | Planificada Q2 2026 | Pendiente |
| **Clientes B2B (KairosAI)** | Reunion informativa sobre tratamiento de datos | Planificada Q1 2026 | Pendiente |
| **Pacientes Vitaeon** | Consentimiento informado especifico + consulta | Pendiente | Pendiente |
| **Empleados StudioTek** | Comunicacion interna + sesion formativa | Planificada Q1 2026 | Pendiente |

### 5.2. Justificacion de no consulta previa completa

Al tratarse de una EIPD inicial, y dada la fase temprana de implantacion de algunos tratamientos, no se ha podido realizar una consulta completa a todos los grupos de interesados. Se planifica completar este punto en la primera revision (Julio 2026).

---

## 6. Consulta Previa a la AEPD

### 6.1. Evaluacion de necesidad

Conforme al Art. 36 RGPD, la consulta previa a la AEPD es obligatoria cuando el riesgo residual sigue siendo alto tras la EIPD.

| Tratamiento | Riesgo Residual | Consulta Previa? | Justificacion |
|-------------|----------------|------------------|---------------|
| **Landing StudioTek** | MEDIO | **NO** | Riesgo aceptable con medidas implementadas |
| **KairosAI general** | MEDIO | **NO** | Riesgo aceptable con mejoras planificadas en Q1-Q2 2026 |
| **Vitaeon (datos salud)** | ALTO | **RECOMENDADA** | Datos Art. 9 + IA + transferencias internacionales. Consulta voluntaria aconsejable |

### 6.2. Plan para consulta previa Vitaeon

Si se decide realizar consulta previa voluntaria para Vitaeon:

| Paso | Accion | Plazo |
|------|--------|-------|
| 1 | Designar DPO | Inmediato |
| 2 | Completar cifrado adicional capa aplicacion | 2 semanas |
| 3 | Completar esta EIPD con opinion de interesados | 1 mes |
| 4 | Preparar documentacion para Sede Electronica AEPD | 2 semanas |
| 5 | Presentar consulta en https://sedeagpd.gob.es | Tras paso 4 |
| 6 | Esperar respuesta AEPD (8-14 semanas) | Variable |

---

## 7. Plan de Accion y Seguimiento

### 7.1. Riesgo residual tras medidas

| Riesgo | Nivel Inicial | Medidas Clave | Efectividad | Nivel Residual | Aceptable? |
|--------|--------------|---------------|-------------|----------------|------------|
| R01 | ALTO | RLS + cifrado + TLS | Significativa | **MEDIO** | Si (con MFA pendiente) |
| R02 | CRITICO | RLS + consentimiento + acceso limitado | Limitada | **ALTO** | **NO sin DPO y auditoria** |
| R03 | MEDIO | DPF + SCCs + revision trimestral | Significativa | **BAJO** | Si |
| R04 | ALTO | Validacion + logs + revision humana | Significativa | **MEDIO** | Si (con comite etica) |
| R05 | MEDIO | Aviso IA + opcion humana | Significativa | **BAJO** | Si |
| R06 | MEDIO | Supresion manual | Limitada | **MEDIO** | **NO sin automatizacion** |
| R07 | ALTO | System prompt + validacion backend | Significativa | **MEDIO** | Si |
| R08 | ALTO | Verificacion basica | Despreciable | **ALTO** | **NO sin proceso parental** |
| R09 | MEDIO | Proceso manual | Limitada | **MEDIO** | Si (con portal Q2) |
| R10 | MEDIO | Sanitizacion + system prompt | Significativa | **BAJO** | Si |
| R11 | BAJO | Banner RGPD + granularidad | Maxima | **BAJO** | Si |
| R12 | ALTO | IP hasheada + UUID + RLS | Significativa | **MEDIO** | Si |

### 7.2. Plan de accion con calendario

| ID | Accion | Prioridad | Plazo | Responsable | Estado |
|----|--------|-----------|-------|-------------|--------|
| A01 | Designar DPO (si datos salud a gran escala) | **Critica** | Febrero 2026 | CEO / Legal | Pendiente |
| A02 | Implementar MFA para administradores | Alta | Marzo 2026 | CTO | Pendiente |
| A03 | Automatizar supresion de datos por TTL | Alta | Marzo 2026 | Equipo tecnico | Pendiente |
| A04 | Implementar proceso consentimiento parental menores | Alta | Marzo 2026 | Producto + Legal | Pendiente |
| A05 | Cifrado adicional capa aplicacion (datos salud) | Alta | Marzo 2026 | CTO | Pendiente |
| A06 | Crear comite de etica IA | Media | Junio 2026 | Responsable IA | Pendiente |
| A07 | Portal automatizado ARCO-POL | Media | Junio 2026 | Equipo tecnico | Pendiente |
| A08 | Auditoria externa RGPD | Media | Junio 2026 | DPO | Pendiente |
| A09 | Formacion RGPD + IA equipo completo | Media | Julio 2026 | RRHH + Legal | Pendiente |
| A10 | Primera revision de esta EIPD | Alta | Julio 2026 | Responsable IA + DPO | Planificada |
| A11 | Consulta previa AEPD para Vitaeon (voluntaria) | Media | Q2 2026 | DPO + Legal | Pendiente evaluacion |

### 7.3. Calendario de revisiones

| Tipo | Fecha | Alcance |
|------|-------|---------|
| **EIPD Inicial** | Enero 2026 | Este documento |
| **Primera revision** | Julio 2026 | Revision completa + evaluacion de acciones |
| **Revision anual** | Enero 2027 | Revision completa + actualizacion riesgos |
| **Revision extraordinaria** | Ante triggers | Cambio de proveedor, brecha, nueva tecnologia, cambio normativo |

### 7.4. Indicadores de seguimiento

| Indicador | Frecuencia | Objetivo |
|-----------|-----------|----------|
| Acciones del plan completadas | Mensual | 100% en plazo |
| Incidentes de IA registrados | Mensual | < 5/mes |
| Solicitudes ARCO-POL atendidas en plazo | Trimestral | 100% |
| Formacion completada por personal | Anual | 100% |
| Brechas de seguridad notificadas | Continuo | 0 |

---

## Anexo A: Referencias y Herramientas AEPD

| Recurso | URL |
|---------|-----|
| EVALUA-RIESGO RGPD v2 | https://www.aepd.es/guias-y-herramientas/herramientas/evalua-riesgo-rgpd |
| GESTIONA-EIPD | https://www.aepd.es/guias-y-herramientas/herramientas/gestiona-eipd |
| Guia practica EIPD | https://www.aepd.es/guias-y-herramientas/guias/guia-evaluaciones-de-impacto-en-la-proteccion-de-los-datos-personales |
| Guia Gestion del Riesgo (2021) | https://www.aepd.es/guias-y-herramientas/guias/gestion-riesgo-evaluacion-impacto |
| Lista Art. 35.4 AEPD | https://www.aepd.es/documento/eipd-listas-dpia-es.pdf |
| Guia IA y proteccion de datos | https://www.aepd.es/guias-y-herramientas/guias/adecuacion-al-rgpd-de-tratamientos-que-incorporan-inteligencia-artificial |

---

> **DISCLAIMER:** Este documento tiene caracter orientativo y ha sido elaborado como apoyo para el cumplimiento del Art. 35 del RGPD y las directrices de la AEPD sobre evaluaciones de impacto. No constituye asesoramiento legal vinculante. Debe ser revisado y validado por un abogado colegiado especializado en proteccion de datos y, en su caso, por el Delegado de Proteccion de Datos (DPO). Se recomienda complementar esta evaluacion con las herramientas oficiales de la AEPD (EVALUA-RIESGO, GESTIONA-EIPD). Consultar siempre la normativa vigente en www.aepd.es.
