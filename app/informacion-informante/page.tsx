'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalHighlight } from '@/components/legal/LegalHighlight';
import { LegalExternalLink } from '@/components/legal/LegalExternalLink';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';
import {
  FileText,
  ShieldCheck,
  Search,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

export default function InformacionInformante() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <BlurFade delay={0}>
          <nav className="mb-8">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>
        </BlurFade>

        <BlurFade delay={0.1}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Informacion al Informante
          </h1>
          <p className="text-slate-400 mb-12">
            Ultima actualizacion: {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* 1. Objeto y Marco Legal */}
        <LegalSection
          id="objeto-marco-legal"
          title="1. Objeto y Marco Legal"
          delay={0.1}
        >
          <p className="text-slate-300 mb-4">
            El presente documento tiene por objeto informar a los potenciales
            informantes sobre sus derechos, garantias y el procedimiento del
            canal de denuncias de {STUDIOTEK_LEGAL.tradeName}, en cumplimiento
            de la obligacion legal de facilitar esta informacion de forma clara
            y accesible.
          </p>
          <p className="text-slate-300 mb-4">
            <strong className="text-white">Marco legal aplicable:</strong>
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              <strong className="text-white">
                Ley 2/2023, de 20 de febrero
              </strong>
              , reguladora de la proteccion de las personas que informen sobre
              infracciones normativas y de lucha contra la corrupcion
              (transposicion de la Directiva UE 2019/1937).
            </li>
            <li>
              <strong className="text-white">
                Directiva (UE) 2019/1937
              </strong>{' '}
              del Parlamento Europeo y del Consejo, de 23 de octubre de 2019,
              relativa a la proteccion de las personas que informen sobre
              infracciones del Derecho de la Union.
            </li>
            <li>
              <strong className="text-white">
                Reglamento (UE) 2016/679 (RGPD)
              </strong>
              , en particular los articulos 6.1.c y 13, relativos a la base
              juridica de obligacion legal y al deber de informacion.
            </li>
            <li>
              <strong className="text-white">
                Ley Organica 3/2018 (LOPDGDD)
              </strong>
              , de Proteccion de Datos Personales y garantia de los derechos
              digitales.
            </li>
          </ul>
          <p className="text-slate-300">
            Este documento va dirigido a todas las personas comprendidas en el
            ambito personal definido en la Seccion 2.
          </p>
        </LegalSection>

        {/* 2. Ambito Personal */}
        <LegalSection
          id="ambito-personal"
          title="2. Ambito Personal — Quien Puede Informar (Art. 3)"
          delay={0.15}
        >
          <p className="text-slate-300 mb-4">
            Pueden utilizar el canal de denuncias de{' '}
            {STUDIOTEK_LEGAL.tradeName} las siguientes personas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              Trabajadores por cuenta ajena (incluidos temporales y a tiempo
              parcial)
            </li>
            <li>Funcionarios y personal estatutario</li>
            <li>Trabajadores autonomos y colaboradores</li>
            <li>
              Accionistas, participes y miembros del organo de administracion,
              direccion o supervision
            </li>
            <li>Contratistas, subcontratistas y proveedores</li>
            <li>Voluntarios y becarios (remunerados o no)</li>
            <li>Personas en proceso de seleccion (candidatos)</li>
            <li>
              Ex-trabajadores (sin limite temporal para hechos conocidos durante
              la relacion)
            </li>
            <li>
              Cualquier persona que haya obtenido informacion en un contexto
              laboral o profesional
            </li>
          </ul>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Cualquier persona que tenga relacion laboral, profesional o
              comercial — actual, pasada o futura — con{' '}
              {STUDIOTEK_LEGAL.tradeName} puede utilizar este canal.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 3. Que se Puede Denunciar */}
        <LegalSection
          id="que-denunciar"
          title="3. Que se Puede Denunciar"
          delay={0.2}
        >
          <p className="text-slate-300 mb-4">
            El canal admite comunicaciones sobre las siguientes categorias de
            infracciones:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              <strong className="text-white">
                Infracciones del Derecho de la UE
              </strong>{' '}
              en las materias del Anexo de la Directiva 2019/1937
            </li>
            <li>
              <strong className="text-white">
                Infracciones penales o administrativas graves o muy graves
              </strong>
            </li>
            <li>
              <strong className="text-white">
                Incumplimientos del Codigo Etico
              </strong>{' '}
              o normas internas de {STUDIOTEK_LEGAL.tradeName}
            </li>
          </ul>
          <p className="text-slate-300 mb-4">
            <strong className="text-white">Categorias especificas:</strong>
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>Acoso laboral, sexual o por razon de sexo</li>
            <li>Fraude, corrupcion o apropiacion indebida</li>
            <li>
              Blanqueo de capitales y financiacion del terrorismo (Ley 10/2010)
            </li>
            <li>
              Seguridad de productos, servicios y sistemas de informacion
            </li>
            <li>Proteccion del medio ambiente</li>
            <li>
              Proteccion de datos personales y privacidad (RGPD, LOPDGDD)
            </li>
            <li>Discriminacion por cualquier causa</li>
            <li>Incumplimiento de normativa fiscal o contable</li>
            <li>Seguridad y salud en el trabajo</li>
            <li>Proteccion de consumidores y usuarios</li>
            <li>Cualquier otra infraccion normativa grave</li>
          </ul>
        </LegalSection>

        {/* 4. Derechos del Informante */}
        <LegalSection
          id="derechos-informante"
          title="4. Derechos del Informante (Arts. 17-21)"
          delay={0.25}
        >
          {/* 4.1 Confidencialidad */}
          <h3 className="text-xl font-semibold text-white mb-4">
            4.1. Confidencialidad de Identidad (Art. 33)
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              La identidad del informante{' '}
              <strong className="text-white">NO sera revelada</strong> a
              terceros sin consentimiento expreso.
            </li>
            <li>
              Solo tendran acceso a la identidad: el Responsable del Sistema, el
              DPO (si existe), y en su caso la autoridad judicial.
            </li>
            <li>
              La identidad no se comunicara al denunciado ni durante la
              investigacion.
            </li>
            <li>
              En procedimiento penal: el Art. 33.3 remite a la legislacion
              procesal aplicable.
            </li>
          </ul>

          {/* 4.2 Proteccion represalias */}
          <h3 className="text-xl font-semibold text-white mb-4">
            4.2. Proteccion frente a Represalias (Art. 17)
          </h3>
          <p className="text-slate-300 mb-4">
            Queda{' '}
            <strong className="text-white">
              prohibida cualquier forma de represalia
            </strong>{' '}
            contra el informante. El articulo 18 de la Ley 2/2023 establece un
            listado exhaustivo de conductas prohibidas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>Suspension, despido o extincion de la relacion laboral</li>
            <li>
              Degradacion, denegacion de ascensos o no renovacion de contrato
            </li>
            <li>Modificacion sustancial de condiciones de trabajo</li>
            <li>Acoso, ostracismo o trato desfavorable</li>
            <li>Danos reputacionales (incluidos en redes sociales)</li>
            <li>Inclusion en listas negras sectoriales</li>
            <li>Anulacion de licencias o permisos</li>
            <li>Denegacion de formacion</li>
            <li>Discriminacion, trato desfavorable o injusto</li>
            <li>Evaluacion o referencia negativa de desempeno</li>
            <li>
              Imposicion de medidas disciplinarias, sanciones economicas o
              penalizaciones
            </li>
            <li>Coacciones e intimidaciones</li>
            <li>
              No conversion de contrato temporal en indefinido (si existe
              expectativa legitima)
            </li>
            <li>
              <em>
                Cualquier acto u omision que cause o pueda causar perjuicio
                injustificado
              </em>
            </li>
          </ul>

          {/* 4.3 Duracion */}
          <h3 className="text-xl font-semibold text-white mb-4">
            4.3. Duracion de la Proteccion
          </h3>
          <p className="text-slate-300 mb-6">
            La proteccion frente a represalias tiene una duracion de{' '}
            <strong className="text-white">2 anos</strong> desde la ultima
            represalia conocida.
          </p>

          {/* 4.4 Inversion carga prueba */}
          <h3 className="text-xl font-semibold text-white mb-4">
            4.4. Inversion de la Carga de la Prueba (Art. 18.4)
          </h3>
          <p className="text-slate-300 mb-6">
            Si el informante sufre un perjuicio tras haber realizado una
            denuncia, corresponde a la persona que adopto la medida demostrar
            que fue por razones justificadas y completamente ajenas a la
            denuncia.
          </p>

          {/* 4.5 Exencion responsabilidad */}
          <h3 className="text-xl font-semibold text-white mb-4">
            4.5. Exencion de Responsabilidad (Art. 21)
          </h3>
          <p className="text-slate-300">
            El informante no incurrira en responsabilidad por la obtencion o
            acceso a la informacion comunicada, siempre que dicha obtencion no
            constituya delito por si misma. Asimismo, queda exento de
            responsabilidad por la violacion de restricciones de divulgacion
            cuando la comunicacion se realice a traves de los canales previstos.
          </p>
        </LegalSection>

        {/* 5. Medidas de Apoyo */}
        <LegalSection
          id="medidas-apoyo"
          title="5. Medidas de Apoyo (Art. 19)"
          delay={0.3}
        >
          <p className="text-slate-300 mb-4">
            El informante tiene derecho a las siguientes medidas de apoyo:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-3 ml-4">
            <li>
              <strong className="text-white">Asistencia letrada:</strong> El
              informante puede solicitar abogado para recibir asesoramiento
              confidencial sobre sus derechos y protecciones.
            </li>
            <li>
              <strong className="text-white">Apoyo financiero:</strong> En el
              marco de procedimientos judiciales derivados de la denuncia, si
              aplica.
            </li>
            <li>
              <strong className="text-white">Apoyo psicologico:</strong> En caso
              de represalias o situaciones de estres derivadas de la denuncia.
              La empresa puede facilitar informacion sobre servicios disponibles.
            </li>
            <li>
              <strong className="text-white">
                Medidas provisionales de proteccion:
              </strong>{' '}
              Posibilidad de solicitar medidas cautelares ante los tribunales.
            </li>
          </ul>
        </LegalSection>

        {/* 6. Canales Disponibles */}
        <LegalSection
          id="canales-disponibles"
          title="6. Canales Disponibles"
          delay={0.35}
        >
          {/* 6.1 Canal interno */}
          <h3 className="text-xl font-semibold text-white mb-4">
            6.1. Canal Interno de {STUDIOTEK_LEGAL.tradeName}
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-6">
            <ul className="text-slate-300 space-y-2">
              <li>
                <strong className="text-white">Via preferente</strong> (Art.
                7.2: se fomenta el recurso prioritario al canal interno)
              </li>
              <li>
                Disponible{' '}
                <strong className="text-white">24/7</strong> a traves del portal
                web
              </li>
              <li>Permite denuncias anonimas e identificadas</li>
              <li>
                Gestionado por el Responsable del Sistema designado
              </li>
              <li>
                Acceso:{' '}
                <Link
                  href="/canal-denuncias"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  /canal-denuncias
                </Link>
              </li>
            </ul>
          </div>

          {/* 6.2 Canal externo */}
          <h3 className="text-xl font-semibold text-white mb-4">
            6.2. Canal Externo: Autoridad Independiente de Proteccion al
            Informante (A.A.I.)
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-6">
            <ul className="text-slate-300 space-y-2">
              <li>
                Autoridad creada por los articulos 35-39 de la Ley 2/2023
              </li>
              <li>
                Referencia:{' '}
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2023-4513">
                  Ley 2/2023 en el BOE
                </LegalExternalLink>
              </li>
              <li>
                El informante puede acudir directamente al canal externo{' '}
                <strong className="text-white">
                  sin necesidad de usar primero el interno
                </strong>
              </li>
            </ul>
          </div>

          {/* 6.3 Revelacion publica */}
          <h3 className="text-xl font-semibold text-white mb-4">
            6.3. Revelacion Publica (Art. 28)
          </h3>
          <p className="text-slate-300 mb-4">
            La revelacion publica esta protegida unicamente cuando se cumpla al
            menos una de estas condiciones:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              No se han adoptado medidas apropiadas tras denuncia interna o
              externa
            </li>
            <li>
              Existe riesgo inminente o manifiesto para el interes publico
            </li>
            <li>
              Existe riesgo de represalias o destruccion de pruebas
            </li>
          </ul>
          <LegalHighlight type="warning">
            <p>
              La revelacion publica es el ultimo recurso. Antes de divulgar
              publicamente, le recomendamos utilizar los canales interno o
              externo.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 7. Protocolo de Denuncias */}
        <LegalSection
          id="protocolo-denuncias"
          title="7. Protocolo de Denuncias"
          delay={0.4}
        >
          <p className="text-slate-300 mb-6">
            Procedimiento basado en el protocolo PCO-04, adaptado a la Ley
            2/2023.
          </p>

          {/* 7.1 Organo gestor */}
          <h3 className="text-xl font-semibold text-white mb-4">
            7.1. Organo Gestor: Responsable del Sistema
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-6">
            <dl className="space-y-3 text-slate-300">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[160px]">
                  Designacion:
                </dt>
                <dd>
                  Por el organo de administracion de{' '}
                  {STUDIOTEK_LEGAL.tradeName} (Art. 8)
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[160px]">
                  Independencia:
                </dt>
                <dd>
                  Persona independiente y autonoma; no recibe instrucciones, no
                  puede ser removida ni sancionada por el ejercicio de sus
                  funciones
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[160px]">
                  Responsable:
                </dt>
                <dd>{STUDIOTEK_LEGAL.responsableSistema}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[160px]">
                  Contacto:
                </dt>
                <dd>
                  <a
                    href={`mailto:${STUDIOTEK_LEGAL.whistleblowerEmail}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {STUDIOTEK_LEGAL.whistleblowerEmail}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[160px]">
                  Funciones:
                </dt>
                <dd>
                  Recepcion, acuse, admision, investigacion, resolucion y
                  comunicacion
                </dd>
              </div>
            </dl>
          </div>

          {/* 7.2 Vias de comunicacion */}
          <h3 className="text-xl font-semibold text-white mb-4">
            7.2. Vias de Comunicacion
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              <strong className="text-white">Formulario web:</strong>{' '}
              <Link
                href="/canal-denuncias"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                /canal-denuncias
              </Link>{' '}
              (via preferente, disponible 24/7)
            </li>
            <li>
              <strong className="text-white">Correo electronico:</strong>{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.whistleblowerEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.whistleblowerEmail}
              </a>
            </li>
            <li>
              <strong className="text-white">Presencial y verbal:</strong>{' '}
              Solicitud de reunion con el Responsable del Sistema (se levantara
              acta con firma)
            </li>
          </ul>

          {/* 7.3 Tipos de denuncia */}
          <h3 className="text-xl font-semibold text-white mb-4">
            7.3. Tipos de Denuncia Admitidos
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              <strong className="text-white">Identificada:</strong> El
              informante proporciona su correo electronico. Recomendada para
              facilitar la investigacion.
            </li>
            <li>
              <strong className="text-white">Anonima:</strong> Admitida conforme
              al Art. 7.3 de la Ley 2/2023. El sistema genera un codigo de
              seguimiento para comunicaciones posteriores.
            </li>
          </ul>

          {/* 7.4 Requisitos minimos */}
          <h3 className="text-xl font-semibold text-white mb-4">
            7.4. Requisitos Minimos de la Denuncia
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-8">
            <li>
              Descripcion detallada de los hechos{' '}
              <span className="text-amber-400">(obligatorio)</span>
            </li>
            <li>
              Fecha y lugar (departamento/contexto) donde ocurrieron los hechos{' '}
              <span className="text-amber-400">(obligatorio)</span>
            </li>
            <li>
              Identificacion de personas involucradas (si se conocen)
            </li>
            <li>
              Evidencias o documentacion de apoyo (si se dispone, max. 10MB)
            </li>
            <li>Datos del informante (si denuncia identificada)</li>
            <li>Categoria de infraccion (segun Seccion 3)</li>
          </ul>

          {/* 7.5 Fases del procedimiento - Visual Steps */}
          <h3 className="text-xl font-semibold text-white mb-6">
            7.5. Fases del Procedimiento
          </h3>
          <div
            className="space-y-4 mb-8"
            role="list"
            aria-label="Fases del procedimiento de denuncias"
          >
            {/* Fase A */}
            <div
              className="bg-slate-900/50 rounded-xl p-6 border border-blue-500/30 relative"
              role="listitem"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <FileText size={24} className="text-blue-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Fase A: Recepcion y Acuse de Recibo
                    </h4>
                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mt-1 sm:mt-0 w-fit">
                      Max. 7 dias naturales
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Se envia acuse de recibo al informante confirmando la
                    recepcion de la denuncia (Art. 9.2.d). Si es anonima, el
                    acuse se comunica a traves del codigo de seguimiento. Se
                    abre expediente numerado con referencia interna.
                  </p>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 to-indigo-500/50" />
            </div>

            {/* Fase B */}
            <div
              className="bg-slate-900/50 rounded-xl p-6 border border-indigo-500/30"
              role="listitem"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-indigo-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Fase B: Admision o Desestimacion Motivada
                    </h4>
                  </div>
                  <p className="text-slate-300 mb-3">
                    El Responsable del Sistema evalua si la denuncia cumple los
                    requisitos minimos.
                  </p>
                  <p className="text-slate-300 mb-2">
                    <strong className="text-white">
                      Causas de desestimacion (motivada por escrito):
                    </strong>
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2 text-sm">
                    <li>
                      Los hechos no son constitutivos de infraccion segun el
                      ambito de la Ley 2/2023
                    </li>
                    <li>
                      La comunicacion es manifiestamente inverosimil o infundada
                    </li>
                    <li>
                      No contiene informacion suficiente y no es posible
                      recabarla
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500/50 to-purple-500/50" />
            </div>

            {/* Fase C */}
            <div
              className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/30"
              role="listitem"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Search size={24} className="text-purple-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Fase C: Investigacion Interna
                    </h4>
                    <span className="text-sm font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full mt-1 sm:mt-0 w-fit">
                      Max. 30 dias habiles
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">
                    Actuaciones de investigacion siguiendo los principios de
                    proporcionalidad e idoneidad:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2 text-sm">
                    <li>
                      Identificacion de normativa afectada y riesgos asociados
                    </li>
                    <li>
                      Recopilacion de informacion y documentacion relevante
                    </li>
                    <li>
                      Entrevista al informante (si no es anonimo y es necesario)
                    </li>
                    <li>
                      Entrevista al denunciado (derecho de audiencia, sin
                      revelar identidad del informante)
                    </li>
                    <li>
                      Entrevistas a posibles testigos (con compromiso de
                      confidencialidad)
                    </li>
                    <li>
                      Analisis de evidencias documentales y digitales
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-500/50 to-emerald-500/50" />
            </div>

            {/* Fase D */}
            <div
              className="bg-slate-900/50 rounded-xl p-6 border border-emerald-500/30"
              role="listitem"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-emerald-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Fase D: Resolucion
                    </h4>
                    <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mt-1 sm:mt-0 w-fit">
                      Max. 3 meses total
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">
                    El Responsable del Sistema emite informe de conclusiones.
                    Resoluciones posibles:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2 text-sm">
                    <li>
                      <strong className="text-slate-300">Archivo:</strong> no se
                      acreditan los hechos o no constituyen infraccion
                    </li>
                    <li>
                      <strong className="text-slate-300">
                        Propuesta de sancion:
                      </strong>{' '}
                      traslado al organo competente
                    </li>
                    <li>
                      <strong className="text-slate-300">
                        Medida correctora urgente:
                      </strong>{' '}
                      si hay riesgo inminente
                    </li>
                    <li>
                      <strong className="text-slate-300">
                        Medida correctora definitiva:
                      </strong>{' '}
                      nuevos procesos, controles o politicas
                    </li>
                    <li>
                      <strong className="text-slate-300">
                        Denuncia ante autoridad:
                      </strong>{' '}
                      si hay indicios de ilicito penal
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center" aria-hidden="true">
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500/50 to-cyan-500/50" />
            </div>

            {/* Fase E */}
            <div
              className="bg-slate-900/50 rounded-xl p-6 border border-cyan-500/30"
              role="listitem"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-cyan-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      Fase E: Comunicacion al Informante
                    </h4>
                  </div>
                  <p className="text-slate-300">
                    Se comunica al informante el resultado de la investigacion y
                    las medidas adoptadas. Si la denuncia es anonima, la
                    comunicacion se realiza a traves del sistema de seguimiento
                    con codigo. Se informa de la posibilidad de acudir al canal
                    externo (A.A.I.) si no esta conforme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7.6 Diagrama de flujo visual */}
          <h3 className="text-xl font-semibold text-white mb-6">
            7.6. Diagrama de Flujo del Procedimiento
          </h3>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 overflow-x-auto">
            <div className="min-w-[320px] flex flex-col items-center gap-3">
              {/* Inicio */}
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg px-6 py-3 text-center">
                <p className="text-white font-semibold text-sm">
                  DENUNCIA RECIBIDA
                </p>
                <p className="text-slate-400 text-xs">
                  (web / email / presencial)
                </p>
              </div>

              <div className="w-0.5 h-4 bg-slate-600" aria-hidden="true" />

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-6 py-3 text-center">
                <p className="text-blue-400 font-medium text-sm">
                  Acuse de recibo (max. 7 dias)
                </p>
              </div>

              <div className="w-0.5 h-4 bg-slate-600" aria-hidden="true" />

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-6 py-3 text-center">
                <p className="text-white font-medium text-sm">
                  Responsable del Sistema evalua admisibilidad
                </p>
              </div>

              <div className="w-0.5 h-4 bg-slate-600" aria-hidden="true" />

              {/* Branch */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-start sm:items-center">
                <div className="flex-1 max-w-[200px] mx-auto">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-red-400 font-medium text-sm">
                      DESESTIMA
                    </p>
                    <p className="text-slate-400 text-xs">(motivada)</p>
                  </div>
                  <div className="flex justify-center">
                    <div
                      className="w-0.5 h-4 bg-slate-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg px-4 py-2 text-center">
                    <p className="text-slate-400 text-xs">
                      Comunica al informante
                    </p>
                  </div>
                </div>

                <div className="flex-1 max-w-[200px] mx-auto">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-emerald-400 font-medium text-sm">
                      ADMITE
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div
                      className="w-0.5 h-4 bg-slate-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-purple-400 font-medium text-sm">
                      Investigacion Interna
                    </p>
                    <p className="text-slate-400 text-xs">
                      (max. 30 dias habiles)
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-4 bg-slate-600" aria-hidden="true" />

              {/* Second branch */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-start sm:items-center">
                <div className="flex-1 max-w-[200px] mx-auto">
                  <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-slate-300 font-medium text-sm">
                      NO acreditada
                    </p>
                    <p className="text-slate-400 text-xs">Archivo</p>
                  </div>
                </div>
                <div className="flex-1 max-w-[200px] mx-auto">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-center">
                    <p className="text-emerald-400 font-medium text-sm">
                      SI acreditada
                    </p>
                    <p className="text-slate-400 text-xs">
                      Resolucion / Sancion / Denuncia penal
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-0.5 h-4 bg-slate-600" aria-hidden="true" />

              {/* Fin */}
              <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-lg px-6 py-3 text-center">
                <p className="text-white font-semibold text-sm">
                  COMUNICACION AL INFORMANTE
                </p>
                <p className="text-slate-400 text-xs">
                  (max. 3 meses desde recepcion)
                </p>
              </div>
            </div>
          </div>
        </LegalSection>

        {/* 8. Aseguramiento Confidencialidad por Fases */}
        <LegalSection
          id="confidencialidad-fases"
          title="8. Aseguramiento de Confidencialidad por Fases"
          delay={0.45}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-white font-semibold">Fase</th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Medida de Confidencialidad
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Recepcion y acuse
                  </td>
                  <td className="px-4 py-3">
                    Informar al denunciante del tratamiento de datos conforme a
                    RGPD
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Comunicacion
                  </td>
                  <td className="px-4 py-3">
                    Aceptacion de obligaciones de confidencialidad por el
                    comunicante
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Registro
                  </td>
                  <td className="px-4 py-3">
                    Aceptacion de normas de confidencialidad por el Responsable
                    del Sistema
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Investigacion
                  </td>
                  <td className="px-4 py-3">
                    Compromiso de confidencialidad firmado por todos los
                    participantes
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Testimonios
                  </td>
                  <td className="px-4 py-3">
                    Obligacion de confidencialidad para testigos y demas
                    intervinientes
                  </td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Deliberacion
                  </td>
                  <td className="px-4 py-3">
                    Aplicacion de normas de confidencialidad por el Responsable
                    del Sistema
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    Resolucion
                  </td>
                  <td className="px-4 py-3">
                    Comunicacion sin identificacion de las partes
                    (informante/denunciado)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        {/* 9. Tratamiento Datos Personales */}
        <LegalSection
          id="tratamiento-datos"
          title="9. Tratamiento de Datos Personales del Informante"
          delay={0.5}
        >
          <div className="space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Base juridica:</strong> Obligacion
              legal (Art. 6.1.c RGPD en relacion con la Ley 2/2023).
            </p>
            <p>
              <strong className="text-white">
                Responsable del tratamiento:
              </strong>{' '}
              {STUDIOTEK_LEGAL.companyName}
            </p>
            <p>
              <strong className="text-white">
                Confidencialidad reforzada:
              </strong>{' '}
              Los datos del informante son reservados (Arts. 32-33).
            </p>
            <p>
              <strong className="text-white">Acceso restringido:</strong> Solo
              el Responsable del Sistema, el DPO (si existe) y, en su caso, la
              autoridad judicial.
            </p>
            <p>
              <strong className="text-white">Datos del denunciado:</strong>{' '}
              Conforme al Art. 32.3, podra comunicarsele la existencia de la
              informacion, pero{' '}
              <strong className="text-white">
                nunca la identidad del informante
              </strong>
              .
            </p>

            <h3 className="text-lg font-semibold text-white pt-4">
              Plazos de Conservacion
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">
                  Si hechos NO probados:
                </strong>{' '}
                cancelacion en{' '}
                <strong className="text-white">2 meses</strong> tras fin de
                investigacion
              </li>
              <li>
                <strong className="text-white">Si hechos probados:</strong>{' '}
                conservacion hasta adopcion de medidas correctivas/sanciones
              </li>
              <li>
                <strong className="text-white">Si acciones judiciales:</strong>{' '}
                conservacion mientras sea necesario para el ejercicio de derechos
              </li>
              <li>
                <strong className="text-white">Maximo absoluto:</strong>{' '}
                <strong className="text-white">10 anos</strong> (Art. 32)
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white pt-4">
              Derechos ARCO-POL
            </h3>
            <p>
              Puede ejercer sus derechos de acceso, rectificacion, supresion,
              limitacion, portabilidad y oposicion dirigiendose a{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.privacyEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.privacyEmail}
              </a>
            </p>
          </div>
        </LegalSection>

        {/* 10. Buena Fe y Denuncias Falsas */}
        <LegalSection
          id="buena-fe"
          title="10. Buena Fe y Denuncias Falsas"
          delay={0.55}
        >
          <p className="text-slate-300 mb-4">
            La proteccion de la Ley 2/2023 se aplica unicamente cuando el
            informante actua de{' '}
            <strong className="text-white">buena fe</strong>, es decir, tiene
            motivos razonables para creer que la informacion es veraz en el
            momento de la comunicacion. No se exige certeza absoluta: basta con
            indicios razonables.
          </p>
          <p className="text-slate-300 mb-4">
            <strong className="text-white">
              Denuncias manifiestamente falsas (Art. 63.1):
            </strong>{' '}
            Constituyen infraccion muy grave de la Ley 2/2023. Las sanciones
            previstas son:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              <strong className="text-white">Personas juridicas:</strong> multa
              de 600.001 a 1.000.000 EUR
            </li>
            <li>
              <strong className="text-white">Personas fisicas:</strong> multa de
              60.001 a 300.000 EUR
            </li>
          </ul>
          <p className="text-slate-300 mb-6">
            Comunicar informacion falsa a sabiendas podra dar lugar a
            responsabilidad penal (calumnias, denuncia falsa).
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Este canal protege a quienes informan de buena fe. No es necesario
              tener pruebas concluyentes, pero si motivos razonables para creer
              que los hechos son ciertos.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 11. Regimen Sancionador */}
        <LegalSection
          id="regimen-sancionador"
          title="11. Regimen Sancionador (Arts. 63-68)"
          delay={0.6}
        >
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-white font-semibold">
                    Tipo de Infraccion
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Persona Juridica
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Persona Fisica
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800 bg-red-500/5">
                  <td className="px-4 py-3 font-medium text-red-400">
                    Muy grave
                  </td>
                  <td className="px-4 py-3">600.001 — 1.000.000 EUR</td>
                  <td className="px-4 py-3">60.001 — 300.000 EUR</td>
                </tr>
                <tr className="border-b border-slate-800 bg-amber-500/5">
                  <td className="px-4 py-3 font-medium text-amber-400">
                    Grave
                  </td>
                  <td className="px-4 py-3">100.001 — 600.000 EUR</td>
                  <td className="px-4 py-3">30.001 — 60.000 EUR</td>
                </tr>
                <tr className="bg-yellow-500/5">
                  <td className="px-4 py-3 font-medium text-yellow-400">
                    Leve
                  </td>
                  <td className="px-4 py-3">Hasta 100.000 EUR</td>
                  <td className="px-4 py-3">Hasta 30.000 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-white mb-3">
            Sanciones Accesorias (Art. 67)
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              Prohibicion de obtencion de subvenciones publicas: hasta{' '}
              <strong className="text-white">4 anos</strong> (infracciones muy
              graves)
            </li>
            <li>
              Prohibicion de contratacion con el sector publico: hasta{' '}
              <strong className="text-white">3 anos</strong> (infracciones muy
              graves)
            </li>
            <li>Amonestacion publica (infracciones graves)</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-3">
            Prescripcion
          </h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              Infracciones muy graves:{' '}
              <strong className="text-white">3 anos</strong>
            </li>
            <li>
              Infracciones graves:{' '}
              <strong className="text-white">2 anos</strong>
            </li>
            <li>
              Infracciones leves:{' '}
              <strong className="text-white">1 ano</strong>
            </li>
          </ul>
        </LegalSection>

        {/* 12. Proteccion Personas Afectadas */}
        <LegalSection
          id="proteccion-afectados"
          title="12. Proteccion de las Personas Afectadas (Art. 20)"
          delay={0.65}
        >
          <p className="text-slate-300 mb-4">
            Las personas afectadas por las denuncias (denunciados) gozan de las
            siguientes garantias:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-3 ml-4">
            <li>
              <strong className="text-white">
                Presuncion de inocencia y derecho al honor:
              </strong>{' '}
              El hecho de ser objeto de una denuncia no prejuzga la culpabilidad
              de la persona afectada.
            </li>
            <li>
              <strong className="text-white">
                Derecho a ser informado:
              </strong>{' '}
              De los hechos que se le imputan, sin que se revele la identidad del
              informante.
            </li>
            <li>
              <strong className="text-white">Derecho a ser oido:</strong>{' '}
              Durante la investigacion, el denunciado tiene derecho de audiencia.
            </li>
            <li>
              <strong className="text-white">
                Derecho a la tutela judicial efectiva:
              </strong>{' '}
              El denunciado puede ejercer las acciones legales que considere
              oportunas para la defensa de sus derechos.
            </li>
          </ul>
        </LegalSection>

        {/* 13. Documentos de Referencia */}
        <LegalSection
          id="documentos-referencia"
          title="13. Documentos de Referencia"
          delay={0.7}
        >
          <ul className="space-y-3 text-slate-300">
            <li>
              <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2023-4513">
                Ley 2/2023, de 20 de febrero, reguladora de la proteccion de
                las personas que informen sobre infracciones normativas y de
                lucha contra la corrupcion
              </LegalExternalLink>
            </li>
            <li>
              <LegalExternalLink href="https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32019L1937">
                Directiva (UE) 2019/1937 del Parlamento Europeo y del Consejo
              </LegalExternalLink>
            </li>
            <li>
              <LegalExternalLink href="https://www.boe.es/doue/2016/119/L00001-00088.pdf">
                Reglamento (UE) 2016/679 General de Proteccion de Datos (RGPD)
              </LegalExternalLink>
            </li>
            <li>
              <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">
                Ley Organica 3/2018 de Proteccion de Datos Personales y garantia
                de los derechos digitales (LOPDGDD)
              </LegalExternalLink>
            </li>
            <li>
              <LegalExternalLink href="https://www.aepd.es/guias-y-herramientas/guias">
                Guias y herramientas de la AEPD
              </LegalExternalLink>
            </li>
            <li className="text-slate-400">
              PCO-04 Canal de Denuncias (procedimiento interno)
            </li>
            <li className="text-slate-400">
              Ficha Tecnica del Sistema de Informacion (DOC-INT-1)
            </li>
            <li className="text-slate-400">
              Codigo Etico de {STUDIOTEK_LEGAL.tradeName}
            </li>
            <li>
              Formulario de denuncias via web:{' '}
              <Link
                href="/canal-denuncias"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                /canal-denuncias
              </Link>
            </li>
          </ul>
        </LegalSection>

        {/* Disclaimer */}
        <BlurFade delay={0.75} inView>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm">
              <strong className="text-amber-400">Aviso:</strong> Esta
              informacion es de caracter informativo basado en la Ley 2/2023, la
              Directiva UE 2019/1937 y las directrices de la Agencia Espanola de
              Proteccion de Datos (AEPD). No constituye asesoramiento legal
              vinculante. Se recomienda la revision por un abogado colegiado o
              DPO certificado.
            </p>
          </div>
        </BlurFade>

        {/* Back link */}
        <BlurFade delay={0.8} inView>
          <div className="pt-8 border-t border-slate-700/50">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
