# Politica Interna de Uso de Inteligencia Artificial

| Campo | Valor |
|-------|-------|
| **Documento** | DOC-INT-2 |
| **Titulo** | Politica Interna de Uso de Inteligencia Artificial |
| **Version** | 1.0 |
| **Fecha** | 29 de enero de 2026 |
| **Autor** | StudioTek S.L. (generado con apoyo de IA) |
| **Base Legal** | Reglamento (UE) 2024/1689 (AI Act), RGPD (UE 2016/679), LOPDGDD (LO 3/2018), Guias AEPD sobre IA (nov. 2025), Politica IA AEPD |
| **Estado** | Borrador - Pendiente revision legal por Isabel Perez |
| **Clasificacion** | Documento interno - Uso restringido |

---

## Indice

1. [Introduccion y Objetivos](#1-introduccion-y-objetivos)
2. [Ambito de Aplicacion](#2-ambito-de-aplicacion)
3. [Clasificacion de Riesgo AI Act](#3-clasificacion-de-riesgo-ai-act)
4. [Gobernanza de la IA](#4-gobernanza-de-la-ia)
5. [Tratamiento de Datos Personales](#5-tratamiento-de-datos-personales)
6. [Transparencia](#6-transparencia)
7. [Seguridad Tecnica](#7-seguridad-tecnica)
8. [Casos de Uso Autorizados](#8-casos-de-uso-autorizados)
9. [Casos de Uso Prohibidos](#9-casos-de-uso-prohibidos)
10. [Gestion de Incidentes](#10-gestion-de-incidentes)
11. [Formacion](#11-formacion)
12. [Revision y Actualizacion](#12-revision-y-actualizacion)

---

## 1. Introduccion y Objetivos

### 1.1. Introduccion

StudioTek S.L. (en adelante, "StudioTek" o "la Empresa"), a traves de su producto KairosAI y sus servicios de agencia de automatizacion con inteligencia artificial, utiliza sistemas de IA en la prestacion de sus servicios y en sus procesos internos.

La presente Politica establece el marco normativo interno para el uso responsable, etico y conforme a la legislacion vigente de los sistemas de inteligencia artificial en la organizacion.

### 1.2. Marco normativo

Esta Politica se fundamenta en:

| Normativa | Referencia | Aplicacion |
|-----------|-----------|------------|
| **Reglamento (UE) 2024/1689** | AI Act | Clasificacion de riesgo, obligaciones de transparencia, documentacion |
| **Reglamento (UE) 2016/679** | RGPD | Tratamiento de datos personales en sistemas IA |
| **Ley Organica 3/2018** | LOPDGDD | Complemento nacional RGPD |
| **Guias AEPD sobre IA** | Nov. 2025 | Adecuacion RGPD para tratamientos con IA |
| **Politica IA AEPD** | Nov. 2025 | Modelo de politica interna de uso de IAG |
| **Ley 34/2002** | LSSI-CE | Servicios de la sociedad de la informacion |

### 1.3. Objetivos

a) Garantizar el cumplimiento del Reglamento (UE) 2024/1689 (AI Act) en todas las fases de aplicacion.

b) Proteger los derechos y libertades fundamentales de las personas afectadas por decisiones asistidas o generadas por IA.

c) Establecer controles internos para el uso responsable de modelos de IA generativa.

d) Minimizar los riesgos derivados de alucinaciones, sesgos, filtraciones de datos y uso indebido.

e) Fomentar la transparencia y la supervision humana en todos los sistemas de IA.

f) Cumplir las recomendaciones de la AEPD sobre tratamiento de datos personales con IA.

---

## 2. Ambito de Aplicacion

### 2.1. Sistemas de IA cubiertos

Esta Politica aplica a los siguientes sistemas de IA utilizados por StudioTek:

| Sistema | Proveedor | Modelo | Uso |
|---------|-----------|--------|-----|
| **Landing StudioTek - Asistente IA** | OpenAI | GPT-4o-mini | Chat de asistencia en la landing page de StudioTek |
| **KairosAI - Asistente de voz** | OpenAI | GPT-4 + Whisper + TTS-1 | Chatbot de gestion de reservas via WhatsApp para clientes B2B |
| **KairosAI - Chatbot WhatsApp** | OpenAI | GPT-4 | Atencion al cliente y gestion de citas via WhatsApp Business API |
| **Herramientas internas** | OpenAI / Anthropic | GPT-4, Claude | Desarrollo de software, documentacion, analisis |

### 2.2. Personas vinculadas

Esta Politica vincula a:

a) Administradores y directivos de StudioTek S.L.

b) Empleados, con independencia de su cargo o tipo de contrato.

c) Colaboradores externos, freelancers y consultores con acceso a sistemas de IA.

d) Clientes B2B de KairosAI, en la medida en que utilizan el sistema IA como "deployers" conforme al AI Act.

### 2.3. Ambito territorial

Esta Politica aplica a todos los usos de IA realizados desde el territorio espanol y de la Union Europea, asi como a los usos que afecten a personas ubicadas en la UE, conforme al Art. 2 del AI Act.

---

## 3. Clasificacion de Riesgo AI Act

Conforme al Reglamento (UE) 2024/1689, cada sistema de IA debe clasificarse segun su nivel de riesgo:

### 3.1. Mapeo de riesgo por caso de uso

| Caso de Uso | Nivel de Riesgo | Justificacion | Obligaciones |
|-------------|----------------|---------------|-------------|
| **Chat asistencia landing StudioTek** | **Riesgo limitado** | Chatbot que interactua con personas, sin toma de decisiones con efectos legales | Transparencia (Art. 50 AI Act): informar que se interactua con IA |
| **Asistente de voz KairosAI** | **Riesgo limitado** | Asistente conversacional para gestion de reservas | Transparencia + etiquetado de contenido generado por IA |
| **Chatbot WhatsApp KairosAI** | **Riesgo limitado** | Chatbot de atencion al cliente; no toma decisiones juridicamente significativas de forma autonoma | Transparencia + supervision humana accesible |
| **Chatbot WhatsApp Vitaeon (datos salud)** | **Riesgo limitado con agravante** | Interaccion con datos de salud (Art. 9 RGPD); no es alto riesgo AI Act pero requiere EIPD RGPD | Transparencia + EIPD obligatoria + supervision humana reforzada |
| **Herramientas internas desarrollo** | **Riesgo minimo** | Uso interno para desarrollo de software, sin impacto en personas externas | Sin obligaciones especificas AI Act |

### 3.2. Revision de clasificacion

La clasificacion de riesgo sera revisada:

- **Anualmente**: En la revision periodica de esta Politica.
- **Ante cambios**: Al incorporar nuevos modelos, nuevas funcionalidades o nuevos casos de uso.
- **Ante cambios normativos**: Cuando se publiquen nuevas guias de la AEPD o nuevos actos delegados del AI Act.
- **Tras incidentes**: Cuando un incidente de IA sugiera que el nivel de riesgo ha cambiado.

---

## 4. Gobernanza de la IA

### 4.1. Responsable de IA

Se designa un Responsable de IA en la organizacion:

| Campo | Detalle |
|-------|---------|
| **Nombre** | TODO: Designar Responsable de IA |
| **Cargo** | TODO: CTO o equivalente tecnico |
| **Funciones** | Supervision del cumplimiento de esta Politica, clasificacion de riesgo, revision de nuevos usos, coordinacion con DPO (si existe) |
| **Reporte** | Informa al organo de administracion |

### 4.2. Human-in-the-Loop (HITL)

a) Todos los sistemas de IA de StudioTek/KairosAI operan bajo el principio de supervision humana.

b) Ningun sistema de IA tomara decisiones autonomas con efectos juridicos o significativos para las personas sin intervencion humana previa (Art. 22 RGPD).

c) Se establece un mecanismo de escalado a persona humana accesible en todo momento durante la interaccion con el sistema de IA:
   - Via email de contacto del negocio cliente.
   - Via formulario web del negocio cliente.
   - Via telefono del negocio cliente (si disponible).

d) Los siguientes casos requieren escalado automatico a humano:
   - Quejas formales del usuario.
   - Solicitudes de ejercicio de derechos ARCO-POL.
   - Deteccion de datos de categorias especiales (Art. 9 RGPD).
   - Situaciones de emergencia o riesgo para la seguridad de personas.
   - Cualquier solicitud del usuario de hablar con una persona.

### 4.3. Aprobacion de nuevos usos de IA

Antes de implementar un nuevo caso de uso de IA, se requiere:

| Paso | Accion | Responsable |
|------|--------|-------------|
| 1 | Descripcion del caso de uso (finalidad, datos, usuarios) | Equipo tecnico |
| 2 | Clasificacion de riesgo AI Act | Responsable de IA |
| 3 | Evaluacion de proteccion de datos (EIPD si alto riesgo) | DPO / Responsable de IA |
| 4 | Revision de transparencia y derechos | Asesor juridico |
| 5 | Aprobacion formal | Organo de administracion |
| 6 | Documentacion y registro | Responsable de IA |

---

## 5. Tratamiento de Datos Personales

### 5.1. Principios aplicables (Art. 5 RGPD)

| Principio | Aplicacion en sistemas IA |
|-----------|--------------------------|
| **Licitud, lealtad, transparencia** | Los datos se tratan con base legal valida (Art. 6 RGPD). Se informa al usuario de que interactua con IA. |
| **Limitacion de la finalidad** | Los datos enviados a la IA se utilizan exclusivamente para la finalidad declarada (gestion de reservas, asistencia). No se reutilizan para entrenamiento sin consentimiento. |
| **Minimizacion** | Solo se envian al modelo IA los datos estrictamente necesarios. Se excluyen datos de categorias especiales salvo EIPD aprobada. |
| **Exactitud** | Se implementan mecanismos de correccion de errores. Las alucinaciones son tratadas como datos inexactos. |
| **Limitacion del plazo** | Los datos procesados por la IA tienen plazos de conservacion definidos (12 meses mensajes, 6 meses embeddings). |
| **Integridad y confidencialidad** | Cifrado en transito (TLS 1.3) y en reposo (AES-256). Control de acceso por RLS. |
| **Responsabilidad proactiva** | Esta Politica, la EIPD y el RAT documentan el cumplimiento. |

### 5.2. Base legal por tratamiento

| Tratamiento | Base legal | Articulo RGPD |
|-------------|-----------|---------------|
| Gestion de reservas via chatbot | Ejecucion de contrato | Art. 6.1.b |
| Asistencia al usuario en landing | Consentimiento | Art. 6.1.a |
| Analisis de conversaciones para mejora | Interes legitimo | Art. 6.1.f |
| Datos de salud (Vitaeon) | Consentimiento explicito | Art. 9.2.a |

### 5.3. Prohibicion de tratamiento de datos sensibles sin EIPD

Queda **prohibido** el tratamiento de datos de categorias especiales (Art. 9 RGPD) por sistemas de IA sin:

a) EIPD aprobada conforme al Art. 35 RGPD (ver DOC-INT-3).

b) Base legal reforzada (Art. 9.2 RGPD).

c) Medidas tecnicas y organizativas adicionales documentadas.

d) Aprobacion expresa del Responsable de IA y del DPO (si existe).

### 5.4. Transferencias internacionales

Los datos procesados por OpenAI son transferidos a Estados Unidos. Las garantias aplicables son:

| Proveedor | Mecanismo | Verificacion |
|-----------|-----------|-------------|
| **OpenAI** | Data Privacy Framework (DPF) + Standard Contractual Clauses (SCCs) | Verificacion anual en https://www.dataprivacyframework.gov/list |
| **OpenAI** | DPA firmado | Politica de no-entrenamiento con datos de API activada |
| **Meta (WhatsApp)** | DPF + SCCs | Verificacion anual |
| **Supabase** | SCCs (EU: Frankfurt) | Datos en region UE |

---

## 6. Transparencia

### 6.1. Informacion al usuario (Art. 50 AI Act)

a) **Toda interaccion con un sistema de IA** debe incluir un aviso claro e inequivoco de que el usuario interactua con una inteligencia artificial, no con una persona.

b) El aviso se proporcionara en la **primera interaccion** y sera visible/legible sin necesidad de acciones adicionales del usuario.

c) **Modelo de aviso para chatbot WhatsApp (KairosAI):**

```text
Hola! Soy un asistente de inteligencia artificial de [NOMBRE NEGOCIO].
Te ayudo a gestionar tus citas y reservas.

Informacion importante:
- Soy una IA, no una persona real.
- Tus datos se tratan para gestionar tu reserva.
- Para hablar con una persona: [EMAIL/TELEFONO DEL NEGOCIO]
- Mas info: [URL PRIVACIDAD]
```

d) **Modelo de aviso para chat landing StudioTek:**

```text
Soy el asistente virtual de StudioTek, impulsado por inteligencia artificial.
Puedo responder preguntas sobre nuestros servicios de automatizacion.
Este chat utiliza tecnologia de OpenAI. Para mas info: studiotek.es/politica-ia
```

### 6.2. Etiquetado de contenido generado por IA

a) El contenido generado por IA que pueda confundirse con contenido humano sera etiquetado como generado por IA.

b) Las respuestas de los chatbots no requieren etiquetado individual (ya se ha informado de que es IA en la primera interaccion).

c) El contenido de marketing o documentacion generado con apoyo de IA para publicacion externa incluira mencion de uso de IA cuando sea material (por ejemplo, "Contenido generado con apoyo de IA y revisado por el equipo de StudioTek").

### 6.3. Documentacion publica

StudioTek publica la siguiente informacion sobre su uso de IA:

| Documento | URL | Contenido |
|-----------|-----|-----------|
| Politica de IA (publica) | studiotek.es/politica-ia | Descripcion de sistemas IA, derechos del usuario, contacto |
| Politica de privacidad | studiotek.es/politica-privacidad | Tratamiento de datos incluyendo IA |
| Politica de cookies | studiotek.es/politica-cookies | Cookies y tecnologias de rastreo |

---

## 7. Seguridad Tecnica

### 7.1. Gestion de API Keys

| Medida | Descripcion |
|--------|-------------|
| **Almacenamiento** | Las API keys de OpenAI y otros proveedores se almacenan exclusivamente en variables de entorno del servidor (nunca en codigo fuente o en el cliente) |
| **Rotacion** | Las API keys se rotan con periodicidad trimestral o ante sospecha de compromiso |
| **Acceso** | Solo el personal tecnico autorizado tiene acceso a las API keys |
| **Registro** | Se mantiene un registro de todas las API keys activas, su fecha de creacion y su uso asignado |

### 7.2. Cifrado

| Capa | Protocolo | Implementacion |
|------|-----------|----------------|
| **En transito** | TLS 1.3 | Toda comunicacion entre servicios |
| **En reposo** | AES-256 | Base de datos Supabase |
| **Hashing** | SHA-256 | IPs en canal de denuncias |

### 7.3. Logging y monitorizacion

a) Se registran logs de todas las interacciones con sistemas de IA, incluyendo:
   - Timestamp de la solicitud y respuesta.
   - Modelo utilizado (sin incluir la API key).
   - Tokens consumidos.
   - Resultado de la interaccion (exito/error).
   - **No se registra el contenido de la conversacion en logs de produccion**, salvo en la base de datos con acceso restringido.

b) Los logs se conservan durante **6 meses** y se eliminan automaticamente.

c) Se implementa monitorizacion de uso anormal (picos de consumo, errores recurrentes, posibles ataques).

### 7.4. Sanitizacion de inputs y outputs

a) **Inputs**: Todos los mensajes de usuario son sanitizados antes de enviarse al modelo IA para prevenir:
   - Prompt injection (intentos de manipulacion del comportamiento del modelo).
   - Inyeccion de codigo o instrucciones maliciosas.
   - Envio de datos no autorizados.

b) **Outputs**: Las respuestas del modelo IA son validadas antes de enviarse al usuario para:
   - Detectar contenido inapropiado o danino.
   - Verificar coherencia con las funciones autorizadas.
   - Prevenir filtracion de informacion interna o de otros usuarios.

c) Se implementa un **system prompt** con instrucciones claras sobre el comportamiento esperado del modelo, incluyendo restricciones de tema y tono.

---

## 8. Casos de Uso Autorizados

Los siguientes casos de uso de IA estan autorizados por StudioTek:

| ID | Caso de Uso | Modelo | Nivel Riesgo AI Act | Datos Tratados | Aprobacion |
|----|-------------|--------|---------------------|----------------|------------|
| AU-01 | Chat asistencia landing StudioTek | GPT-4o-mini | Limitado | Mensajes del usuario, contexto de la conversacion | Aprobado |
| AU-02 | Chatbot WhatsApp KairosAI (clientes estandar) | GPT-4 | Limitado | Nombre, telefono, mensajes, datos de reserva | Aprobado |
| AU-03 | Asistente de voz KairosAI | GPT-4 + Whisper + TTS-1 | Limitado | Audio, transcripcion, datos de reserva | Aprobado |
| AU-04 | Chatbot WhatsApp Vitaeon (datos salud) | GPT-4 | Limitado con agravante | Datos de salud (Art. 9 RGPD) | Aprobado con EIPD obligatoria |
| AU-05 | Desarrollo interno con IA generativa | GPT-4 / Claude | Minimo | Codigo fuente, documentacion (sin datos personales) | Aprobado |
| AU-06 | Generacion de contenido marketing | GPT-4 / Claude | Minimo | Textos comerciales (sin datos personales) | Aprobado con revision humana |

### 8.1. Condiciones generales de uso autorizado

a) Todo uso debe estar registrado en la tabla anterior.

b) Cualquier nuevo caso de uso requiere aprobacion segun el procedimiento de la Seccion 4.3.

c) Los datos personales solo se procesan con base legal valida y con los controles de la Seccion 5.

d) El uso de IA para tratamiento de datos de salud (AU-04) requiere EIPD vigente y aprobada (DOC-INT-3).

---

## 9. Casos de Uso Prohibidos

Los siguientes usos de IA estan **terminantemente prohibidos** en StudioTek, conforme al Art. 5 del AI Act y a los principios eticos de la Empresa:

| ID | Uso Prohibido | Base Legal | Sancion AI Act |
|----|---------------|-----------|----------------|
| PR-01 | **Puntuacion social** (scoring de personas por comportamiento) | Art. 5.1.c AI Act | Hasta 35M EUR o 7% facturacion |
| PR-02 | **Manipulacion subliminal o enganosa** de usuarios a traves de IA | Art. 5.1.a AI Act | Hasta 35M EUR o 7% facturacion |
| PR-03 | **Explotacion de vulnerabilidades** de grupos especificos (menores, discapacidad) | Art. 5.1.b AI Act | Hasta 35M EUR o 7% facturacion |
| PR-04 | **Identificacion biometrica remota en tiempo real** en espacios publicos | Art. 5.1.d AI Act | Hasta 35M EUR o 7% facturacion |
| PR-05 | **Categorizacion biometrica** por raza, religion, orientacion sexual | Art. 5.1.g AI Act | Hasta 35M EUR o 7% facturacion |
| PR-06 | **Reconocimiento de emociones** en el ambito laboral o educativo | Art. 5.1.f AI Act | Hasta 35M EUR o 7% facturacion |
| PR-07 | **Creacion de deepfakes** sin etiquetado (imagenes, audio, video falsos) | Art. 50.4 AI Act | Sancion proporcional |
| PR-08 | **Uso de datos personales de usuarios para entrenar modelos** sin consentimiento explicito | Art. 5.1.b RGPD | Hasta 20M EUR o 4% facturacion |
| PR-09 | **Toma de decisiones automatizadas con efectos juridicos** sin intervencion humana | Art. 22 RGPD | Nulidad de la decision + sancion |
| PR-10 | **Perfilado discriminatorio** basado en datos de categorias especiales | Arts. 9, 22 RGPD | Hasta 20M EUR o 4% facturacion |

### 9.1. Consecuencias del incumplimiento

El uso de IA para fines prohibidos constituye una infraccion muy grave y dara lugar a:

a) Medidas disciplinarias conforme a la legislacion laboral (hasta despido disciplinario).

b) Comunicacion al canal de denuncias interno (DOC-INT-1).

c) Posible comunicacion a la AEPD o a la autoridad nacional de supervision del AI Act.

d) Responsabilidad civil y penal del infractor conforme a la legislacion vigente.

---

## 10. Gestion de Incidentes

### 10.1. Tipos de incidentes de IA

| Tipo | Descripcion | Severidad |
|------|-------------|-----------|
| **Alucinacion critica** | El modelo genera informacion falsa que causa dano (ej. confirmar cita inexistente) | Alta |
| **Sesgo discriminatorio** | El modelo genera respuestas discriminatorias por razon de genero, raza, etc. | Alta |
| **Filtracion de datos** | El modelo expone datos personales de otros usuarios o datos internos | Critica |
| **Prompt injection** | Un usuario manipula el comportamiento del modelo para obtener informacion no autorizada | Alta |
| **Fallo de disponibilidad** | El modelo IA no responde o genera errores sistematicos | Media |
| **Contenido inapropiado** | El modelo genera contenido ofensivo, violento o inapropiado | Alta |
| **Uso no autorizado** | Un empleado o tercero usa la IA para fines no aprobados | Alta |

### 10.2. Protocolo de respuesta

| Fase | Acciones | Plazo | Responsable |
|------|---------|-------|-------------|
| **1. Deteccion** | Identificar el incidente (usuario, monitorizacion, auditor) | Inmediato | Cualquier persona |
| **2. Contencion** | Desactivar o limitar el sistema IA afectado si es necesario | 1 hora | Equipo tecnico |
| **3. Evaluacion** | Determinar gravedad, datos afectados, alcance | 4 horas | Responsable de IA |
| **4. Notificacion interna** | Informar al organo de administracion y al DPO (si existe) | 12 horas | Responsable de IA |
| **5. Notificacion AEPD** | Si hay brecha de datos personales: notificar en 72 horas (Art. 33 RGPD) | 72 horas | DPO / Responsable |
| **6. Correccion** | Implementar medidas correctivas (ajustar prompt, actualizar filtros, etc.) | Variable | Equipo tecnico |
| **7. Documentacion** | Registrar el incidente en el registro de incidentes de IA | 1 semana | Responsable de IA |
| **8. Revision** | Analizar lecciones aprendidas y actualizar esta Politica si necesario | 1 mes | Responsable de IA |

### 10.3. Registro de incidentes de IA

Se mantiene un registro de incidentes de IA que incluye:

| Campo | Descripcion |
|-------|-------------|
| ID del incidente | Identificador unico |
| Fecha y hora | Timestamp del incidente |
| Tipo de incidente | Segun clasificacion 10.1 |
| Sistema afectado | Modelo y caso de uso |
| Descripcion | Detalle de lo ocurrido |
| Impacto | Personas afectadas, datos comprometidos |
| Medidas adoptadas | Acciones de contencion y correccion |
| Estado | Abierto / En investigacion / Resuelto |
| Lecciones aprendidas | Mejoras implementadas |

---

## 11. Formacion

### 11.1. Plan de formacion en IA

| Audiencia | Contenido | Periodicidad | Modalidad |
|-----------|-----------|-------------|-----------|
| **Todo el personal** | Conceptos basicos IA, esta Politica, casos de uso autorizados/prohibidos, riesgos | Anual + onboarding | Sesion online/presencial (1h) |
| **Equipo tecnico** | AI Act en detalle, seguridad de modelos, sanitizacion, prompt engineering seguro | Semestral | Taller tecnico (3h) |
| **Responsable de IA** | Gobernanza IA, clasificacion de riesgos, EIPD, actualizaciones normativas | Trimestral | Formacion especializada |
| **Clientes B2B (KairosAI)** | Uso responsable del chatbot, obligaciones como deployers, transparencia | En onboarding + anual | Documentacion + sesion |

### 11.2. Evaluacion de conocimientos

a) Tras cada sesion formativa se realizara una evaluacion basica de comprension.

b) Los resultados de la evaluacion se registraran para evidencia de cumplimiento.

c) El personal que no supere la evaluacion recibira formacion de refuerzo.

### 11.3. Registro de formacion

Se mantiene un registro de formacion que incluye: fecha, asistentes, contenido, resultado de evaluacion y firma.

---

## 12. Revision y Actualizacion

### 12.1. Revision periodica

| Tipo | Periodicidad | Alcance | Responsable |
|------|-------------|---------|-------------|
| **Revision ordinaria** | Anual | Revision completa de la Politica | Responsable de IA + Asesor juridico |
| **Revision extraordinaria** | Ante cambios | Seccion afectada | Responsable de IA |

### 12.2. Triggers de revision extraordinaria

Esta Politica sera revisada de forma extraordinaria cuando se produzca:

a) Publicacion de nuevas guias de la AEPD sobre IA.

b) Entrada en vigor de nuevas fases del AI Act (agosto 2026: aplicacion completa).

c) Incorporacion de nuevos modelos de IA (por ejemplo, cambio de GPT-4 a GPT-5).

d) Incidente grave de IA (segun clasificacion de la Seccion 10).

e) Cambio significativo en los servicios de StudioTek/KairosAI.

f) Requerimiento de la AEPD o de la autoridad nacional de supervision del AI Act.

g) Cambios en la legislacion nacional o europea aplicable.

### 12.3. Historial de versiones

| Version | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 29/01/2026 | Version inicial | StudioTek S.L. |

### 12.4. Aprobacion

| Campo | Detalle |
|-------|---------|
| **Aprobado por** | TODO: Organo de administracion de StudioTek S.L. |
| **Fecha de aprobacion** | TODO: Fecha de aprobacion formal |
| **Proxima revision** | Enero 2027 (o antes si se activa un trigger) |

---

## Anexo A: Referencias Normativas y Herramientas

| Recurso | URL |
|---------|-----|
| AI Act (Reglamento UE 2024/1689) | https://artificialintelligenceact.eu/es/ |
| AEPD - Guias sobre IA | https://www.aepd.es/guias-y-herramientas/guias |
| AEPD - Herramientas | https://www.aepd.es/guias-y-herramientas/herramientas |
| Data Privacy Framework (DPF) | https://www.dataprivacyframework.gov/list |
| RGPD (UE 2016/679) | https://eur-lex.europa.eu/eli/reg/2016/679/oj/spa |

---

> **DISCLAIMER:** Este documento tiene caracter orientativo y ha sido elaborado como apoyo para el cumplimiento del Reglamento (UE) 2024/1689 (AI Act), el RGPD y las guias de la AEPD sobre inteligencia artificial. No constituye asesoramiento legal vinculante. Debe ser revisado y validado por un abogado colegiado especializado en regulacion de IA y proteccion de datos antes de su aprobacion e implementacion. Se recomienda la consulta de la normativa vigente en www.aepd.es.
