# Guia de Periodicidad de la EIPD

| Campo | Valor |
|-------|-------|
| **Documento** | DOC-INT-4 |
| **Titulo** | Guia de Periodicidad de la Evaluacion de Impacto en Proteccion de Datos (EIPD) |
| **Version** | 1.0 |
| **Fecha** | 29 de enero de 2026 |
| **Autor** | StudioTek S.L. (generado con apoyo de IA) |
| **Base Legal** | RGPD Art. 35.11, Directrices WP248 rev.01 del GT29/CEPD, Guia AEPD "Gestion del riesgo y evaluacion de impacto" (Junio 2021) |
| **Estado** | Borrador - Pendiente revision legal por Isabel Perez |
| **Clasificacion** | Documento interno |

---

## Indice

1. [Objeto de esta Guia](#1-objeto-de-esta-guia)
2. [Cuando es Obligatoria la EIPD](#2-cuando-es-obligatoria-la-eipd)
3. [Triggers de Revision de la EIPD](#3-triggers-de-revision-de-la-eipd)
4. [Calendario de StudioTek](#4-calendario-de-studiotek)
5. [Responsables de la Revision](#5-responsables-de-la-revision)
6. [Herramientas AEPD](#6-herramientas-aepd)
7. [Procedimiento de Revision](#7-procedimiento-de-revision)

---

## 1. Objeto de esta Guia

### 1.1. Finalidad

Esta Guia establece los criterios, la periodicidad y el procedimiento para la revision de la Evaluacion de Impacto en Proteccion de Datos (EIPD) de StudioTek S.L. (DOC-INT-3), conforme al Art. 35.11 del RGPD:

> *"El responsable del tratamiento llevara a cabo una revision para evaluar si el tratamiento se realiza de conformidad con la evaluacion de impacto relativa a la proteccion de datos, al menos cuando exista un cambio del riesgo que representen las operaciones de tratamiento."*

### 1.2. Principio clave

La EIPD **no es un documento estatico**. Es una herramienta viva que forma parte de un proceso continuo de gestion del riesgo (Guia AEPD, Cap. II). Debe revisarse periodicamente y ante cualquier cambio significativo en el tratamiento, la tecnologia, el contexto normativo o el nivel de riesgo.

### 1.3. Alcance

Esta Guia aplica a todos los tratamientos de datos personales de StudioTek S.L. que hayan sido objeto de una EIPD, incluyendo:

- Landing page StudioTek (leads, chat IA, cookies, canal de denuncias).
- Producto KairosAI (chatbot WhatsApp con IA).
- Cliente Vitaeon (datos de salud).
- Cualquier futuro tratamiento que requiera EIPD.

---

## 2. Cuando es Obligatoria la EIPD

### 2.1. Los 10 criterios AEPD (basados en Directrices WP248)

La AEPD establece 10 criterios para determinar si un tratamiento requiere EIPD. Si un tratamiento cumple **2 o mas criterios**, la EIPD es obligatoria:

| # | Criterio | Descripcion | StudioTek |
|---|----------|-------------|-----------|
| 1 | Evaluacion o puntuacion | Scoring, profiling, prediccion | Parcial (IA analiza preferencias) |
| 2 | Decisiones automatizadas con efectos juridicos | Decisiones que afectan significativamente al interesado | No (reservas no tienen efecto juridico) |
| 3 | Observacion sistematica | Monitorizacion continua de personas | **SI** (WhatsApp 24/7) |
| 4 | Datos sensibles | Categorias especiales Art. 9 RGPD | **SI** (Vitaeon: datos salud) |
| 5 | Datos a gran escala | Gran volumen de datos o interesados | **SI** (10.000+ usuarios anuales) |
| 6 | Combinacion de conjuntos de datos | Cruce de fuentes de datos | Parcial (conversaciones + reservas + embeddings) |
| 7 | Personas vulnerables | Menores, pacientes, empleados | **SI** (menores, pacientes Vitaeon) |
| 8 | Uso innovador o nuevas tecnologias | Tecnologias emergentes | **SI** (IA generativa GPT-4) |
| 9 | Transferencias internacionales | Datos fuera del EEE | **SI** (OpenAI, Meta en EE.UU.) |
| 10 | Impide ejercicio de derechos | Dificulta el control del interesado | Parcial (opacidad modelo IA) |

### 2.2. Aplicacion a StudioTek

| Tratamiento | Criterios cumplidos | EIPD obligatoria? |
|-------------|--------------------|--------------------|
| **Landing StudioTek** | 3 (observacion), 8 (IA), 9 (transferencias) = 3 criterios | **SI** |
| **KairosAI general** | 3, 5, 7, 8, 9 = 5 criterios | **SI** |
| **Vitaeon (salud)** | 3, 4, 5, 7, 8, 9 = 6 criterios | **SI (CRITICA)** |

### 2.3. Lista Art. 35.4 AEPD

Ademas de los 10 criterios, la AEPD publica una lista de tratamientos que **siempre** requieren EIPD (Art. 35.4 RGPD). StudioTek encaja en:

- Tratamientos que impliquen el uso de categorias especiales de datos (Art. 9) a gran escala.
- Tratamientos que impliquen perfilado de personas con tecnologias innovadoras (IA generativa).
- Tratamientos de datos de personas vulnerables (menores, pacientes).

Fuente: https://www.aepd.es/documento/eipd-listas-dpia-es.pdf

---

## 3. Triggers de Revision de la EIPD

### 3.1. Tabla de triggers

La EIPD debe revisarse cuando se produzca cualquiera de los siguientes eventos:

| ID | Trigger | Tipo | Ejemplo StudioTek | Alcance Revision | Plazo |
|----|---------|------|-------------------|-----------------|-------|
| TR-01 | **Nuevo tratamiento de datos** | Planificado | Nueva funcionalidad en KairosAI (ej. pagos via chatbot) | Fases 1, 2, 3, 4, 5 completas | Antes de iniciar el tratamiento |
| TR-02 | **Cambio de proveedor/encargado** | Planificado | Cambio de OpenAI a Anthropic/Claude, o cambio de Supabase a otro | Fases 1 (encargados), 3 (riesgos TID), 4 (medidas contractuales) | Antes del cambio |
| TR-03 | **Brecha de seguridad** | Incidente | Acceso no autorizado a datos, filtracion de conversaciones | Revision completa de emergencia (todas las fases) | 72 horas (coordinado con Art. 33 RGPD) |
| TR-04 | **Nueva tecnologia incorporada** | Planificado | Cambio de GPT-4 a GPT-5, incorporacion de modelo de vision, nuevo canal (Telegram) | Fases 1, 3, 4, 5 | Antes de la incorporacion |
| TR-05 | **Cambio normativo relevante** | Externo | Nueva fase AI Act (ago 2026), nueva guia AEPD, invalidacion DPF | Seccion afectada + Fases 3, 4 | 3 meses desde la publicacion |
| TR-06 | **Aumento significativo de volumen** | Operativo | Superar 50.000 usuarios anuales, nuevo cliente con datos sensibles | Fases 1 (escala), 3 (riesgos), 4 (medidas) | 1 mes |
| TR-07 | **Nuevo cliente con datos especiales** | Planificado | Nuevo cliente del sector salud similar a Vitaeon | EIPD especifica para el nuevo tratamiento | Antes de iniciar el servicio |
| TR-08 | **Incidente de IA** | Incidente | Alucinacion con impacto real, sesgo discriminatorio detectado | Fases 3 (riesgos IA), 4 (medidas IA), 5 (riesgo residual) | 1 semana |
| TR-09 | **Cambio en la finalidad del tratamiento** | Planificado | Uso de datos de conversaciones para publicidad personalizada | Fases 1, 2 completas + revision de base legal | Antes del cambio |
| TR-10 | **Resultado de auditoria** | Interno | Hallazgos en auditoria interna o externa | Seccion afectada | 1 mes tras informe |
| TR-11 | **Revision periodica programada** | Periodico | Revision semestral / anual | Revision completa | Segun calendario |
| TR-12 | **Requerimiento AEPD** | Externo | Solicitud de informacion o inspeccion de la AEPD | Revision completa + documentacion | Segun plazo AEPD |

### 3.2. Priorizacion de triggers

| Prioridad | Triggers | Plazo maximo de revision |
|-----------|---------|------------------------|
| **Critica** | TR-03 (brecha), TR-12 (requerimiento AEPD) | 72 horas - 1 semana |
| **Alta** | TR-01 (nuevo tratamiento), TR-04 (nueva tecnologia), TR-07 (datos especiales), TR-08 (incidente IA), TR-09 (cambio finalidad) | Antes de implementar el cambio |
| **Media** | TR-02 (cambio proveedor), TR-05 (cambio normativo), TR-06 (aumento volumen), TR-10 (auditoria) | 1-3 meses |
| **Normal** | TR-11 (revision periodica) | Segun calendario |

---

## 4. Calendario de StudioTek

### 4.1. Calendario 2026-2027

| Fecha | Hito | Tipo | Alcance | Responsable |
|-------|------|------|---------|-------------|
| **Enero 2026** | EIPD inicial (DOC-INT-3) | Inicial | Evaluacion completa de todos los tratamientos | StudioTek (apoyo IA + legal) |
| **Febrero 2026** | Designacion DPO (si procede) | Organizativo | Cumplimiento Art. 37 si datos salud | CEO / Legal |
| **Marzo 2026** | Implementacion medidas criticas | Tecnico | MFA, automatizacion supresion, cifrado | CTO |
| **Julio 2026** | **Revision semestral** | Periodica | Revision completa + evaluacion plan de accion | Responsable IA + DPO |
| **Agosto 2026** | Revision por AI Act (aplicacion completa) | Normativo | Actualizacion clasificacion de riesgo y obligaciones AI Act | Responsable IA + Legal |
| **Enero 2027** | **Revision anual** | Periodica | Revision completa + actualizacion riesgos + plan 2027 | Responsable IA + DPO + Legal |
| **Julio 2027** | Revision semestral | Periodica | Seguimiento + nuevos riesgos | Responsable IA + DPO |

### 4.2. Periodicidad por tipo de tratamiento

| Tratamiento | Periodicidad minima | Justificacion |
|-------------|--------------------|-|-|
| **Landing StudioTek** | Anual | Riesgo residual MEDIO; tratamiento estable |
| **KairosAI general** | Semestral | Riesgo residual MEDIO; tecnologia IA en evolucion rapida |
| **Vitaeon (datos salud)** | Semestral (minimo) | Riesgo residual ALTO; datos Art. 9 RGPD; requiere supervision continua |
| **Canal de denuncias** | Anual | Riesgo residual MEDIO; tratamiento estable |

### 4.3. Eventos clave 2026

| Mes | Evento externo | Impacto en EIPD |
|-----|---------------|-----------------|
| **Febrero 2026** | -- | Implementacion medidas pendientes |
| **Agosto 2026** | **AI Act aplicacion completa** (UE 2024/1689) | Revision obligatoria de clasificacion de riesgo y medidas AI Act |
| **Q3-Q4 2026** | Posibles nuevas guias AEPD sobre IA | Revision si afectan a tratamientos de StudioTek |
| **Continuo** | Verificacion DPF anual (dataprivacyframework.gov) | Confirmar que OpenAI, Vercel, Meta siguen certificados |

---

## 5. Responsables de la Revision

### 5.1. Roles y responsabilidades

| Rol | Persona | Responsabilidad |
|-----|---------|-----------------|
| **Responsable de IA** | TODO: Designar | Liderar la revision tecnica. Evaluar riesgos IA. Coordinar con equipo tecnico. |
| **DPO** (si designado) | TODO: Designar | Supervisar el proceso. Evaluar cumplimiento RGPD. Asesorar sobre medidas. |
| **Responsable del tratamiento** | StudioTek S.L. (organo de administracion) | Aprobar la EIPD revisada. Decidir sobre riesgo aceptable. |
| **Asesor juridico externo** | Isabel Perez (abogada) | Revisar aspectos legales. Validar base legal. Asesorar sobre consulta previa AEPD. |
| **Equipo tecnico** | CTO + desarrollo | Informar sobre cambios tecnicos. Implementar medidas. Proporcionar datos de logs y metricas. |

### 5.2. Proceso de decision

```text
Trigger detectado
    |
    v
Responsable de IA evalua impacto
    |
    |--> Sin impacto significativo --> Documentar y archivar
    |
    |--> Impacto significativo
            |
            v
        Revision de EIPD (parcial o completa)
            |
            v
        Informe de revision
            |
            v
        Aprobacion por Responsable del tratamiento
            |
            |--> Riesgo residual aceptable --> Implementar medidas + documentar
            |
            |--> Riesgo residual NO aceptable --> Medidas adicionales o consulta previa AEPD
```

---

## 6. Herramientas AEPD

### 6.1. Herramientas oficiales

La AEPD proporciona herramientas gratuitas que deben utilizarse en el proceso de evaluacion:

| Herramienta | URL | Uso | Cuando usarla |
|-------------|-----|-----|---------------|
| **FACILITA RGPD** | https://www.aepd.es/guias-y-herramientas/herramientas/facilita-rgpd | Evaluacion basica de cumplimiento RGPD para pymes | Evaluacion inicial rapida |
| **GESTIONA RGPD** | https://www.aepd.es/guias-y-herramientas/herramientas/gestiona-rgpd | Gestion integral del cumplimiento RGPD (RAT, politicas, medidas) | Gestion continua del cumplimiento |
| **EVALUA-RIESGO RGPD v2** | https://www.aepd.es/guias-y-herramientas/herramientas/evalua-riesgo-rgpd | Evaluacion cuantitativa de riesgos para derechos y libertades | En cada revision de la EIPD (Fase 3) |
| **GESTIONA-EIPD** | https://www.aepd.es/guias-y-herramientas/herramientas/gestiona-eipd | Documentacion estructurada de la EIPD | Para documentar la EIPD completa |
| **ASESORA BRECHA** | https://www.aepd.es/guias-y-herramientas/herramientas/asesora-brecha | Evaluacion de brechas y necesidad de notificacion | Ante brechas de seguridad (TR-03) |

### 6.2. Guias complementarias

| Guia | URL | Relevancia |
|------|-----|-----------|
| Guia practica EIPD | https://www.aepd.es/guias-y-herramientas/guias/guia-evaluaciones-de-impacto-en-la-proteccion-de-los-datos-personales | Metodologia paso a paso |
| Guia Gestion del Riesgo (2021, 160 pags.) | https://www.aepd.es/guias-y-herramientas/guias/gestion-riesgo-evaluacion-impacto | Metodologia cuantitativa completa |
| Guia IA y proteccion de datos | https://www.aepd.es/guias-y-herramientas/guias/adecuacion-al-rgpd-de-tratamientos-que-incorporan-inteligencia-artificial | Evaluacion especifica para IA |
| Lista Art. 35.4 AEPD | https://www.aepd.es/documento/eipd-listas-dpia-es.pdf | Tratamientos obligatoriamente con EIPD |
| Guia de cookies | https://www.aepd.es/guias-y-herramientas/guias/guia-cookies | Cookies y consentimiento |

### 6.3. Recomendacion de uso

| Fase de la EIPD | Herramienta AEPD recomendada |
|-----------------|------------------------------|
| Descripcion del tratamiento | GESTIONA RGPD (RAT) + GESTIONA-EIPD |
| Evaluacion de riesgos | **EVALUA-RIESGO RGPD v2** (cuantitativa) |
| Documentacion de la EIPD | **GESTIONA-EIPD** |
| Gestion de brechas | ASESORA BRECHA |
| Evaluacion basica pymes | FACILITA RGPD |

---

## 7. Procedimiento de Revision

### 7.1. Pasos del procedimiento

| Paso | Accion | Responsable | Plazo |
|------|--------|-------------|-------|
| 1 | **Deteccion del trigger** (periodico o extraordinario) | Cualquier persona / Sistema automatico | Inmediato |
| 2 | **Evaluacion inicial del impacto** del trigger en la EIPD | Responsable de IA | 1 semana |
| 3 | **Determinacion del alcance** de la revision (parcial o completa) | Responsable de IA + DPO | 1 semana |
| 4 | **Actualizacion de la descripcion** del tratamiento (Fase 1 EIPD) | Equipo tecnico | 2 semanas |
| 5 | **Re-evaluacion de riesgos** con EVALUA-RIESGO v2 (Fase 3 EIPD) | Responsable de IA | 2 semanas |
| 6 | **Actualizacion de medidas** de mitigacion (Fase 4 EIPD) | Equipo tecnico + DPO | 2 semanas |
| 7 | **Calculo de riesgo residual** actualizado (Fase 5 EIPD) | Responsable de IA + DPO | 1 semana |
| 8 | **Informe de revision** con conclusiones y recomendaciones | Responsable de IA | 1 semana |
| 9 | **Revision legal** del informe | Asesor juridico externo | 2 semanas |
| 10 | **Aprobacion** por el organo de administracion | Responsable del tratamiento | 1 semana |
| 11 | **Implementacion** de medidas y actualizacion del documento EIPD | Equipo tecnico | Variable |
| 12 | **Registro** de la revision en el historial del documento | Responsable de IA | 1 dia |

### 7.2. Documentacion de la revision

Cada revision de la EIPD generara un registro que incluya:

| Campo | Contenido |
|-------|-----------|
| **Fecha de revision** | Fecha de finalizacion de la revision |
| **Trigger** | Que origino la revision (ID del trigger) |
| **Alcance** | Parcial (secciones revisadas) o Completa |
| **Cambios identificados** | Que ha cambiado desde la ultima revision |
| **Riesgos nuevos o modificados** | Nuevos riesgos o cambios en nivel de riesgos existentes |
| **Medidas nuevas** | Nuevas medidas de mitigacion incorporadas |
| **Riesgo residual** | Nivel de riesgo residual actualizado |
| **Decision** | Aceptable / Requiere medidas adicionales / Requiere consulta previa |
| **Aprobado por** | Nombre y cargo de quien aprueba |
| **Proxima revision** | Fecha programada de la siguiente revision |

### 7.3. Comunicacion de resultados

| Destinatario | Informacion | Frecuencia |
|-------------|-------------|------------|
| **Organo de administracion** | Informe completo de revision + recomendaciones | Cada revision |
| **Equipo tecnico** | Medidas tecnicas a implementar | Cuando proceda |
| **Personal (general)** | Cambios en politicas o procedimientos que les afecten | Cuando proceda |
| **Clientes B2B afectados** | Cambios relevantes en tratamiento de datos | Si cambio significativo |
| **AEPD** | Solo si se requiere consulta previa (Art. 36 RGPD) | Excepcional |

---

## Anexo: Checklist de Revision Rapida

Utilizar esta checklist en cada revision periodica:

### Contexto
- [ ] Se han producido cambios en los tratamientos de datos?
- [ ] Se han incorporado nuevos modelos de IA o nuevas funcionalidades?
- [ ] Se han cambiado proveedores o encargados de tratamiento?
- [ ] Se han producido brechas de seguridad desde la ultima revision?

### Normativo
- [ ] Se han publicado nuevas guias de la AEPD relevantes?
- [ ] Se han producido cambios normativos aplicables (AI Act, RGPD, LOPDGDD)?
- [ ] Se han producido resoluciones sancionadoras relevantes de la AEPD?
- [ ] El DPF sigue vigente para los proveedores de EE.UU.?

### Riesgos
- [ ] Los riesgos identificados siguen vigentes?
- [ ] Han aparecido nuevos riesgos?
- [ ] El nivel de riesgo de alguno ha cambiado?
- [ ] Las medidas de mitigacion estan implementadas segun el plan?
- [ ] El riesgo residual sigue siendo aceptable?

### Operativo
- [ ] El volumen de datos/usuarios ha cambiado significativamente?
- [ ] Se han recibido solicitudes de derechos ARCO-POL?
- [ ] Se han producido incidentes de IA (alucinaciones, sesgos)?
- [ ] La formacion del personal esta al dia?

### Resultado
- [ ] Documentar hallazgos y actualizar EIPD si procede
- [ ] Programar proxima revision
- [ ] Comunicar resultados a interesados internos

---

> **DISCLAIMER:** Este documento tiene caracter orientativo y ha sido elaborado como apoyo para el cumplimiento del Art. 35.11 del RGPD y las directrices de la AEPD. No constituye asesoramiento legal vinculante. Debe ser revisado por un abogado colegiado especializado en proteccion de datos. Se recomienda complementar esta guia con las herramientas oficiales de la AEPD. Consultar siempre la normativa vigente en www.aepd.es.
