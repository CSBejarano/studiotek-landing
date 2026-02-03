# Ficha Tecnica del Sistema de Informacion - Canal de Denuncias

| Campo | Valor |
|-------|-------|
| **Documento** | DOC-INT-1 |
| **Titulo** | Ficha Tecnica del Sistema Interno de Informacion (Canal de Denuncias) |
| **Version** | 1.0 |
| **Fecha** | 29 de enero de 2026 |
| **Autor** | StudioTek S.L. (generado con apoyo de IA) |
| **Base Legal** | Ley 2/2023, de 20 de febrero, reguladora de la proteccion de las personas que informen sobre infracciones normativas y de lucha contra la corrupcion (Arts. 5-9) |
| **Estado** | Borrador - Pendiente revision legal por Isabel Perez |
| **Clasificacion** | Documento interno - Confidencial |

---

## Indice

1. [Identificacion del Sistema](#1-identificacion-del-sistema)
2. [Responsable del Sistema](#2-responsable-del-sistema)
3. [Canales Habilitados](#3-canales-habilitados)
4. [Descripcion Tecnica del Flujo de Datos](#4-descripcion-tecnica-del-flujo-de-datos)
5. [Medidas de Seguridad](#5-medidas-de-seguridad)
6. [Conservacion de Datos](#6-conservacion-de-datos)
7. [Procedimiento de Gestion de Informaciones](#7-procedimiento-de-gestion-de-informaciones)
8. [Libro-Registro de Informaciones](#8-libro-registro-de-informaciones)
9. [Protocolo de Actuacion](#9-protocolo-de-actuacion)
10. [Formacion del Personal](#10-formacion-del-personal)
11. [Auditorias Periodicas](#11-auditorias-periodicas)
12. [Fecha de Implantacion y Ultima Revision](#12-fecha-de-implantacion-y-ultima-revision)

---

## 1. Identificacion del Sistema

| Campo | Detalle |
|-------|---------|
| **Nombre del Sistema** | Sistema Interno de Informacion de StudioTek S.L. |
| **Nombre comercial** | Canal de Denuncias StudioTek |
| **Version** | 1.0 |
| **Tipo** | Sistema interno de informacion conforme a la Ley 2/2023 |
| **Responsable del tratamiento** | StudioTek S.L. (CIF: B-XXXXXXXX) |
| **Ubicacion tecnica** | Infraestructura cloud: Vercel (hosting frontend) + Supabase (base de datos PostgreSQL, region EU-Frankfurt) |
| **Dominio publico** | https://studiotek.es/canal-denuncias |
| **Email del canal** | canal.denuncias@studiotek.es |
| **Fecha de implantacion** | Enero 2026 |

### 1.1. Normativa aplicable

- **Ley 2/2023**, de 20 de febrero, reguladora de la proteccion de las personas que informen sobre infracciones normativas y de lucha contra la corrupcion.
- **Directiva (UE) 2019/1937** del Parlamento Europeo y del Consejo, de 23 de octubre de 2019, relativa a la proteccion de las personas que informen sobre infracciones del Derecho de la Union.
- **Reglamento (UE) 2016/679** (RGPD) - Tratamiento de datos personales en el contexto del canal.
- **Ley Organica 3/2018** (LOPDGDD) - Complemento nacional al RGPD.

### 1.2. Ambito material

El sistema cubre informaciones sobre:

a) Infracciones del Derecho de la Union Europea en los ambitos del Art. 2 de la Ley 2/2023 (contratacion publica, servicios financieros, seguridad de productos, proteccion del medio ambiente, proteccion de datos, etc.).

b) Acciones u omisiones que puedan constituir infraccion penal o administrativa grave o muy grave.

c) Incumplimientos del Codigo Etico de StudioTek S.L. (DOC-INT-5).

d) Incumplimientos de la normativa interna de la empresa, incluida la Politica Interna de Uso de IA (DOC-INT-2).

---

## 2. Responsable del Sistema

Conforme al Art. 8 de la Ley 2/2023, se designa como Responsable del Sistema Interno de Informacion:

| Campo | Detalle |
|-------|---------|
| **Nombre** | TODO: Designar nombre del Responsable del Sistema |
| **Cargo** | TODO: Cargo del Responsable |
| **Email de contacto** | canal.denuncias@studiotek.es |
| **Fecha de nombramiento** | TODO: Fecha de designacion formal |
| **Organo que designa** | Organo de administracion de StudioTek S.L. |

### 2.1. Funciones del Responsable del Sistema (Art. 8.1 Ley 2/2023)

a) Gestionar las comunicaciones recibidas a traves del sistema.

b) Acusar recibo de las informaciones al informante en un plazo maximo de **7 dias naturales** desde la recepcion (Art. 9.2.b).

c) Dar seguimiento diligente a las informaciones recibidas.

d) Comunicar al informante el plazo para responder, que no podra exceder de **3 meses** desde el acuse de recibo (Art. 9.2.e).

e) Garantizar la confidencialidad de la identidad del informante y de cualquier tercero mencionado en la comunicacion (Art. 33).

f) Mantener la comunicacion con el informante, solicitando informacion adicional si fuera necesario.

g) Remitir al Ministerio Fiscal las informaciones que pudieran ser constitutivas de delito (Art. 9.2.i).

h) Archivar motivadamente aquellas informaciones que no tengan fundamento suficiente.

### 2.2. Requisitos del Responsable

- Ejercicio independiente de sus funciones (Art. 8.2).
- No recibira instrucciones de ningun tipo en el ejercicio de sus funciones.
- Dotacion de medios personales y materiales adecuados.
- Todas las personas de la organizacion colaboraran con el Responsable cuando sea requerido.

### 2.3. Suplencia

En caso de ausencia, enfermedad o vacante del Responsable del Sistema, se designa como suplente:

| Campo | Detalle |
|-------|---------|
| **Nombre suplente** | TODO: Designar suplente |
| **Cargo** | TODO: Cargo del suplente |

---

## 3. Canales Habilitados

Conforme al Art. 5 de la Ley 2/2023, se habilitan los siguientes canales para la presentacion de informaciones:

### 3.1. Canal web (principal)

| Campo | Detalle |
|-------|---------|
| **URL** | https://studiotek.es/canal-denuncias |
| **Tipo** | Formulario web multi-step |
| **Disponibilidad** | 24/7 |
| **Anonimato** | Permite comunicaciones anonimas (Art. 7.3 Ley 2/2023) |
| **Acuse de recibo** | Automatico, con codigo de seguimiento UUID |
| **Cifrado** | TLS 1.3 en transito |
| **Almacenamiento** | Supabase PostgreSQL (EU-Frankfurt), cifrado en reposo |

### 3.2. Canal email

| Campo | Detalle |
|-------|---------|
| **Direccion** | canal.denuncias@studiotek.es |
| **Acceso** | Exclusivo del Responsable del Sistema |
| **Cifrado** | TLS en transito |
| **Respuesta** | Acuse de recibo manual en 7 dias naturales |

### 3.3. Canal presencial

| Campo | Detalle |
|-------|---------|
| **Modalidad** | Reunion presencial con el Responsable del Sistema |
| **Solicitud** | Via email a canal.denuncias@studiotek.es |
| **Plazo** | La reunion se celebrara en un plazo maximo de 7 dias desde la solicitud |
| **Documentacion** | Se levantara acta de la reunion, que el informante podra revisar, rectificar y aceptar mediante firma |
| **Ubicacion** | Domicilio social de StudioTek S.L. (Calle XXXXX, N, Barcelona) |

### 3.4. Garantias comunes a todos los canales

- **Confidencialidad**: La identidad del informante no sera revelada a terceros sin su consentimiento expreso (Art. 33).
- **Anonimato**: Se admiten comunicaciones anonimas (Art. 7.3).
- **Proteccion frente a represalias**: Conforme al Titulo VII de la Ley 2/2023.
- **Accesibilidad**: El sistema es accesible para personas con discapacidad.
- **Idiomas**: Espanol (castellano).

---

## 4. Descripcion Tecnica del Flujo de Datos

### 4.1. Diagrama del flujo

```text
Informante
    |
    | (1) Accede a https://studiotek.es/canal-denuncias
    |
    v
Formulario Web (Next.js 16 - Vercel)
    |
    | (2) Envia formulario multi-step con datos de la comunicacion
    |     - Tipo de infraccion (categoria)
    |     - Descripcion de los hechos
    |     - Datos del informante (opcional si anonimo)
    |     - Documentacion adjunta (opcional)
    |
    | [TLS 1.3 cifrado en transito]
    |
    v
API Route Next.js (/api/whistleblower)
    |
    | (3) Validacion Zod del formulario
    |     - Sanitizacion de inputs
    |     - Verificacion de tamano de archivos
    |
    v
Supabase PostgreSQL (EU-Frankfurt)
    |
    | (4) Almacenamiento en tabla whistleblower_reports
    |     - UUID como identificador unico
    |     - IP hasheada (SHA-256, no reversible)
    |     - Timestamp de creacion
    |     - Estado inicial: "recibida"
    |     - Codigo de seguimiento generado
    |
    v
Responsable del Sistema
    |
    | (5) Notificacion por email (canal.denuncias@studiotek.es)
    |     - Sin datos del contenido de la denuncia en el email
    |     - Solo notificacion de nueva entrada
    |
    | (6) Accede al panel de gestion (acceso restringido)
    |     - Revisa comunicacion completa
    |     - Acusa recibo en max. 7 dias
    |     - Investiga y gestiona
    |     - Responde en max. 3 meses
    |
    v
Informante
    |
    | (7) Puede consultar estado via:
    |     - Codigo de seguimiento en /canal-denuncias
    |     - Email de contacto
```

### 4.2. Componentes tecnicos

| Componente | Tecnologia | Ubicacion | Funcion |
|------------|-----------|-----------|---------|
| **Frontend** | Next.js 16.1.1 + React 19 | Vercel (global CDN) | Formulario web del canal |
| **Validacion** | Zod + React Hook Form | Cliente + Servidor | Validacion de datos de entrada |
| **API** | Next.js API Routes | Vercel Serverless | Procesamiento de comunicaciones |
| **Base de datos** | PostgreSQL 16+ (Supabase) | EU-Frankfurt | Almacenamiento persistente |
| **Seguridad BD** | RLS (Row Level Security) | Supabase | Aislamiento de datos |
| **Email notificaciones** | Resend | EU | Notificaciones al Responsable |
| **Tracking** | UUID v4 | Generado en servidor | Codigo de seguimiento |

---

## 5. Medidas de Seguridad

### 5.1. Medidas tecnicas

| Medida | Descripcion | Estado |
|--------|-------------|--------|
| **Cifrado en transito** | TLS 1.3 para toda comunicacion entre cliente y servidor | Implementado |
| **Cifrado en reposo** | AES-256 en la base de datos Supabase | Implementado |
| **Hashing de IPs** | Las direcciones IP se almacenan hasheadas con SHA-256 (irreversibles) | Implementado |
| **UUID tracking** | Codigos de seguimiento con UUID v4 (no secuenciales, no predecibles) | Implementado |
| **RLS Supabase** | Row Level Security para aislamiento de datos por roles | Implementado |
| **Sanitizacion de inputs** | Validacion Zod en servidor + sanitizacion contra XSS/SQLi | Implementado |
| **Control de acceso** | Acceso al panel de gestion solo por el Responsable del Sistema | Implementado |
| **Logs de acceso** | Registro de todos los accesos al sistema (whistleblower_access_logs) | Implementado |
| **Backups automaticos** | Copias de seguridad diarias automaticas (Supabase) | Implementado |
| **MFA** | Autenticacion multifactor para acceso al panel de gestion | Pendiente |

### 5.2. Medidas organizativas

| Medida | Descripcion | Estado |
|--------|-------------|--------|
| **Acceso restringido** | Solo el Responsable del Sistema y su suplente pueden acceder a las comunicaciones | Activo |
| **Deber de confidencialidad** | Todo el personal con acceso firma clausula de confidencialidad reforzada | Pendiente formalizacion |
| **Separacion funcional** | El Responsable del Sistema ejerce sus funciones de forma independiente | Activo |
| **Formacion** | Formacion especifica para el Responsable sobre Ley 2/2023 | Planificada |
| **Protocolo de actuacion** | Procedimiento documentado de gestion de informaciones (Seccion 9) | Este documento |

### 5.3. Medidas de proteccion de datos (RGPD)

| Aspecto | Detalle |
|---------|---------|
| **Base legal** | Art. 6.1.c) RGPD (obligacion legal - Ley 2/2023) |
| **Responsable** | StudioTek S.L. |
| **Finalidad** | Gestion de informaciones sobre infracciones conforme a Ley 2/2023 |
| **Datos tratados** | Identidad del informante (si no anonimo), hechos denunciados, identidad del investigado, documentacion aportada |
| **Destinatarios** | Responsable del Sistema; Ministerio Fiscal si procede; Autoridad Judicial si procede |
| **Derechos** | Acceso, rectificacion, supresion, limitacion, oposicion (con las limitaciones del Art. 32 Ley 2/2023) |
| **Plazos conservacion** | Ver seccion 6 |

---

## 6. Conservacion de Datos

Conforme al Art. 26 de la Ley 2/2023 y al principio de limitacion del plazo de conservacion (Art. 5.1.e RGPD):

| Tipo de dato | Plazo de conservacion | Base legal |
|--------------|----------------------|------------|
| **Comunicaciones recibidas y documentacion** | Tiempo imprescindible para la investigacion + prescripcion de acciones legales, maximo **10 anos** | Art. 26 Ley 2/2023 |
| **Datos del informante** | Mismo plazo que la comunicacion asociada | Art. 26 Ley 2/2023 |
| **Datos del investigado** | Mismo plazo que la comunicacion asociada | Art. 26 Ley 2/2023 |
| **Logs de acceso al sistema** | **5 anos** | Art. 32 RGPD + buenas practicas |
| **Comunicaciones archivadas sin fundamento** | **3 meses** tras decision de archivo (anonimizacion posterior) | Art. 26 Ley 2/2023 |

### 6.1. Procedimiento de supresion

a) Transcurrido el plazo de conservacion, los datos seran suprimidos de forma segura (eliminacion criptografica o sobreescritura).

b) Se generara un registro de la supresion que incluya: fecha, datos suprimidos (categorias), motivo y responsable de la supresion.

c) Los datos anonimizados podran conservarse con fines estadisticos.

---

## 7. Procedimiento de Gestion de Informaciones

### 7.1. Recepcion y acuse de recibo

| Paso | Accion | Plazo | Responsable |
|------|--------|-------|-------------|
| 1 | Recepcion de la comunicacion | Inmediato (automatico) | Sistema |
| 2 | Generacion de codigo de seguimiento UUID | Inmediato (automatico) | Sistema |
| 3 | Registro en libro-registro | Inmediato (automatico) | Sistema |
| 4 | Notificacion al Responsable del Sistema | Inmediato (automatico via email) | Sistema |
| 5 | Acuse de recibo al informante | Max. **7 dias naturales** | Responsable |

### 7.2. Admision a tramite

| Paso | Accion | Plazo | Responsable |
|------|--------|-------|-------------|
| 6 | Evaluacion preliminar de la comunicacion | 15 dias habiles | Responsable |
| 7a | **Si se admite**: Inicio de investigacion | Inmediato tras admision | Responsable |
| 7b | **Si no se admite**: Archivo motivado | Comunicar al informante en 15 dias | Responsable |

### 7.3. Investigacion

| Paso | Accion | Plazo | Responsable |
|------|--------|-------|-------------|
| 8 | Investigacion de los hechos | Max. **3 meses** desde acuse de recibo | Responsable |
| 9 | Solicitud de informacion adicional al informante (si necesario) | Durante la investigacion | Responsable |
| 10 | Audiencia al investigado (si procede, preservando confidencialidad) | Antes de conclusion | Responsable |
| 11 | Conclusion e informe final | Dentro del plazo de 3 meses | Responsable |

### 7.4. Resolucion

| Paso | Accion | Plazo | Responsable |
|------|--------|-------|-------------|
| 12 | Comunicacion del resultado al informante | Inmediato tras conclusion | Responsable |
| 13 | **Si hay indicio delito**: Remision al Ministerio Fiscal | Sin dilacion indebida | Responsable |
| 14 | **Si hay infraccion administrativa**: Comunicacion al organo competente | Sin dilacion indebida | Responsable |
| 15 | **Si hay infraccion interna**: Propuesta de medidas disciplinarias | Segun normativa interna | Responsable |
| 16 | Archivo de la comunicacion con toda la documentacion | Tras resolucion | Responsable |

---

## 8. Libro-Registro de Informaciones

Conforme al Art. 26 de la Ley 2/2023, se mantiene un libro-registro de todas las informaciones recibidas. La estructura del registro es la siguiente:

| Campo | Descripcion | Tipo |
|-------|-------------|------|
| **ID** | Identificador unico UUID | UUID v4 |
| **Codigo de seguimiento** | Codigo proporcionado al informante | UUID v4 |
| **Fecha de recepcion** | Timestamp de entrada en el sistema | Datetime (UTC) |
| **Canal de entrada** | Web / Email / Presencial | Enum |
| **Categoria** | Tipo de infraccion segun catalogo | Enum |
| **Anonimo** | Indica si la comunicacion es anonima | Boolean |
| **Estado** | Estado actual de la comunicacion | Enum (recibida, en_tramite, investigacion, resuelta, archivada) |
| **Fecha acuse de recibo** | Fecha en que se confirmo recepcion al informante | Datetime |
| **Fecha resolucion** | Fecha de cierre de la comunicacion | Datetime |
| **Resultado** | Resultado de la investigacion | Texto |
| **Remision externa** | Si fue remitida a Ministerio Fiscal u otra autoridad | Boolean |
| **Notas internas** | Observaciones del Responsable (confidencial) | Texto |

### 8.1. Acceso al libro-registro

- **Acceso de lectura/escritura**: Unicamente el Responsable del Sistema y su suplente.
- **Acceso de lectura (resumen estadistico)**: Organo de administracion, previa solicitud motivada.
- **Auditoria**: El libro-registro sera revisado en las auditorias periodicas (Seccion 11).

---

## 9. Protocolo de Actuacion

### 9.1. Principios rectores

a) **Diligencia debida**: Toda comunicacion sera gestionada con la maxima diligencia y celeridad.

b) **Confidencialidad**: La identidad del informante y del investigado sera tratada como confidencial en todo momento.

c) **Imparcialidad**: La investigacion sera objetiva e imparcial.

d) **Presuncion de inocencia**: El investigado goza de presuncion de inocencia hasta que se acredite la infraccion.

e) **Proteccion del informante**: Se garantiza la indemnidad del informante conforme al Titulo VII de la Ley 2/2023.

f) **Proporcionalidad**: Las medidas adoptadas seran proporcionales a la gravedad de los hechos denunciados.

### 9.2. Conflictos de interes

a) Si el Responsable del Sistema tiene un conflicto de interes con la comunicacion recibida (por ejemplo, si es el investigado o tiene vinculo personal con el investigado), debera abstenerse y trasladar la gestion al suplente.

b) Si ambos (Responsable y suplente) estan afectados, la comunicacion sera remitida directamente al organo de administracion.

### 9.3. Proteccion frente a represalias

Conforme al Art. 36 de la Ley 2/2023, queda prohibida cualquier forma de represalia contra el informante, incluyendo:

- Suspension, despido o medidas equivalentes.
- Degradacion o denegacion de promocion.
- Cambio de puesto de trabajo, ubicacion o reduccion de salario.
- Danos reputacionales.
- Inclusion en listas negras.
- Cualquier otra forma de penalizacion o discriminacion.

### 9.4. Comunicaciones de mala fe

Las comunicaciones realizadas de mala fe, con conocimiento de su falsedad, no gozaran de las protecciones de la Ley 2/2023 y podran dar lugar a responsabilidad disciplinaria, civil o penal del comunicante (Art. 36.3 Ley 2/2023).

---

## 10. Formacion del Personal

### 10.1. Formacion del Responsable del Sistema

| Aspecto | Detalle |
|---------|---------|
| **Contenido** | Ley 2/2023, procedimiento de gestion, proteccion de datos en canal de denuncias, investigacion interna, derechos del informante e investigado |
| **Periodicidad** | Formacion inicial + actualizacion anual |
| **Modalidad** | Presencial o en linea con evaluacion |
| **Responsable de la formacion** | Asesor juridico externo (Isabel Perez) |

### 10.2. Formacion general del personal

| Aspecto | Detalle |
|---------|---------|
| **Contenido** | Existencia del canal, como utilizarlo, derechos del informante, prohibicion de represalias |
| **Periodicidad** | En el onboarding + recordatorio anual |
| **Modalidad** | Comunicacion interna + sesion informativa |
| **Alcance** | Todo el personal vinculado a StudioTek S.L. |

### 10.3. Registro de formacion

Se mantendra un registro de las acciones formativas que incluya: fecha, asistentes, contenido impartido, evaluacion (si procede) y firma de los asistentes.

---

## 11. Auditorias Periodicas

### 11.1. Auditoria interna

| Aspecto | Detalle |
|---------|---------|
| **Periodicidad** | Anual |
| **Alcance** | Cumplimiento del procedimiento, estado del libro-registro, medidas de seguridad, plazos de respuesta, proteccion de datos |
| **Responsable** | Organo de administracion (o persona designada distinta del Responsable del Sistema) |
| **Resultado** | Informe de auditoria con hallazgos y recomendaciones |

### 11.2. Auditoria externa

| Aspecto | Detalle |
|---------|---------|
| **Periodicidad** | Bianual (cada 2 anos) o ante incidentes relevantes |
| **Alcance** | Revision integral del sistema: normativa, tecnica, organizativa |
| **Responsable** | Auditor externo independiente |
| **Resultado** | Informe con certificacion de conformidad |

### 11.3. Indicadores de seguimiento

| Indicador | Frecuencia de medicion |
|-----------|----------------------|
| Numero de comunicaciones recibidas | Trimestral |
| Tiempo medio de acuse de recibo | Trimestral |
| Tiempo medio de resolucion | Trimestral |
| Porcentaje de comunicaciones anonimas | Anual |
| Numero de remisiones a Ministerio Fiscal | Anual |
| Incidencias de seguridad del sistema | Continuo |

---

## 12. Fecha de Implantacion y Ultima Revision

| Campo | Detalle |
|-------|---------|
| **Fecha de implantacion del sistema** | Enero 2026 |
| **Fecha de aprobacion de esta ficha** | TODO: Fecha de aprobacion formal |
| **Ultima revision** | 29 de enero de 2026 |
| **Proxima revision programada** | Julio 2026 (semestral) |
| **Responsable de la revision** | Responsable del Sistema + Asesor juridico externo |

### 12.1. Historial de versiones

| Version | Fecha | Cambios | Autor |
|---------|-------|---------|-------|
| 1.0 | 29/01/2026 | Version inicial | StudioTek S.L. |

---

## Anexos

### Anexo A: Categorias de infraccion

Las categorias de infraccion admitidas en el sistema, conforme al Art. 2 de la Ley 2/2023, incluyen:

1. Contratacion publica
2. Servicios, productos y mercados financieros
3. Prevencion del blanqueo de capitales y financiacion del terrorismo
4. Seguridad de los productos y conformidad
5. Seguridad del transporte
6. Proteccion del medio ambiente
7. Proteccion frente a las radiaciones y seguridad nuclear
8. Seguridad de los alimentos y los piensos, sanidad animal y bienestar de los animales
9. Salud publica
10. Proteccion de los consumidores
11. Proteccion de la privacidad y datos personales, y seguridad de las redes y sistemas de informacion
12. Infracciones del Codigo Etico de StudioTek (DOC-INT-5)
13. Infracciones de la Politica de Uso de IA (DOC-INT-2)
14. Otras infracciones graves o muy graves de la normativa interna

### Anexo B: Modelo de acuse de recibo

```text
Estimado/a informante:

Confirmamos la recepcion de su comunicacion, registrada con el codigo de
seguimiento [CODIGO UUID].

Su comunicacion ha sido recibida el [FECHA] a traves del canal [WEB/EMAIL/PRESENCIAL].

Le informamos de que:
- Su comunicacion sera gestionada conforme a la Ley 2/2023.
- Su identidad esta protegida por el deber de confidencialidad.
- Recibira respuesta en un plazo maximo de 3 meses.
- Puede consultar el estado de su comunicacion en:
  https://studiotek.es/canal-denuncias

Para cualquier consulta adicional: canal.denuncias@studiotek.es

Atentamente,
Responsable del Sistema Interno de Informacion
StudioTek S.L.
```

---

> **DISCLAIMER:** Este documento tiene caracter orientativo y ha sido elaborado como apoyo para el cumplimiento de la Ley 2/2023 y la normativa aplicable. No constituye asesoramiento legal vinculante. Debe ser revisado y validado por un abogado colegiado especializado antes de su aprobacion e implementacion. Se recomienda la consulta de la normativa vigente en www.aepd.es y en el BOE.
