'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalHighlight } from '@/components/legal/LegalHighlight';
import { LegalExternalLink } from '@/components/legal/LegalExternalLink';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';

export default function PoliticaIA() {
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
            Politica de Inteligencia Artificial
          </h1>
          <p className="text-slate-400 mb-12">
            Ultima actualizacion: {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* 1. Nuestro Compromiso con la IA Responsable */}
        <LegalSection
          id="compromiso-ia"
          title="1. Nuestro Compromiso con la IA Responsable"
          delay={0.1}
        >
          <p className="text-slate-300 mb-4">
            En {STUDIOTEK_LEGAL.tradeName} creemos que la inteligencia
            artificial es una herramienta poderosa que debe utilizarse de forma
            etica, transparente y conforme a la regulacion europea. Nuestro uso
            de IA se rige por cinco principios fundamentales:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              <strong className="text-white">Beneficencia:</strong> La IA debe
              generar valor y mejorar la experiencia del usuario.
            </li>
            <li>
              <strong className="text-white">No maleficencia:</strong> La IA no
              debe causar dano ni perjuicio a las personas.
            </li>
            <li>
              <strong className="text-white">Autonomia:</strong> Las personas
              mantienen el control sobre las decisiones que les afectan.
            </li>
            <li>
              <strong className="text-white">Justicia:</strong> Los sistemas de
              IA no deben discriminar ni generar sesgos injustos.
            </li>
            <li>
              <strong className="text-white">Explicabilidad:</strong> Los
              usuarios tienen derecho a entender como funciona la IA que les
              afecta.
            </li>
          </ul>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Usamos inteligencia artificial para mejorar nuestros servicios,
              pero siempre de forma responsable, transparente y cumpliendo la ley
              europea.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 2. Marco Normativo */}
        <LegalSection
          id="marco-normativo"
          title="2. Marco Normativo que Cumplimos"
          delay={0.15}
        >
          <ul className="space-y-4 text-slate-300 mb-6">
            <li>
              <strong className="text-white">
                AI Act (Reglamento UE 2024/1689):
              </strong>{' '}
              Primera ley integral de inteligencia artificial del mundo. Vigente
              por fases desde febrero 2025, con aplicacion completa en agosto
              2026. Establece obligaciones segun el nivel de riesgo del sistema
              de IA.{' '}
              <LegalExternalLink href="https://artificialintelligenceact.eu/es/">
                Ver texto completo
              </LegalExternalLink>
            </li>
            <li>
              <strong className="text-white">
                RGPD (Reglamento UE 2016/679):
              </strong>{' '}
              Proteccion de datos personales, incluido su tratamiento por
              sistemas de inteligencia artificial. Aplica a todo tratamiento de
              datos personales, tambien cuando interviene IA.{' '}
              <LegalExternalLink href="https://www.boe.es/doue/2016/119/L00001-00088.pdf">
                Ver texto completo
              </LegalExternalLink>
            </li>
            <li>
              <strong className="text-white">
                LOPDGDD (Ley Organica 3/2018):
              </strong>{' '}
              Adaptacion espanola del RGPD con disposiciones adicionales sobre
              derechos digitales.{' '}
              <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">
                Ver texto completo
              </LegalExternalLink>
            </li>
            <li>
              <strong className="text-white">Guias AEPD sobre IA:</strong>{' '}
              Recomendaciones y directrices de la Agencia Espanola de Proteccion
              de Datos sobre uso responsable de inteligencia artificial.{' '}
              <LegalExternalLink href="https://www.aepd.es/guias-y-herramientas/guias">
                Ver guias
              </LegalExternalLink>
            </li>
          </ul>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Cumplimos con el Reglamento Europeo de IA, el Reglamento de
              Proteccion de Datos y las guias de la Agencia Espanola de
              Proteccion de Datos.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 3. Sistemas de IA que Utilizamos */}
        <LegalSection
          id="sistemas-ia"
          title="3. Que Sistemas de IA Utilizamos (Transparencia — Art. 50 AI Act)"
          delay={0.2}
        >
          <ul className="space-y-4 text-slate-300 mb-6">
            <li>
              <strong className="text-white">
                Asistente conversacional (Chatbot):
              </strong>{' '}
              Utiliza modelos de lenguaje de OpenAI (GPT-4) para responder
              consultas, gestionar reservas y ofrecer informacion comercial a
              traves de WhatsApp y web.
            </li>
            <li>
              <strong className="text-white">Asistente de voz:</strong> Utiliza
              tecnologia de reconocimiento de voz (Whisper) para transcribir
              mensajes de audio a texto.
            </li>
            <li>
              <strong className="text-white">Generacion de contenido:</strong>{' '}
              Algunos textos de soporte pueden ser generados o asistidos por
              inteligencia artificial.
            </li>
          </ul>
          <p className="text-slate-300 mb-6">
            <strong className="text-white">
              Informamos SIEMPRE cuando interactuas con una IA.
            </strong>{' '}
            No simulamos ser una persona real.
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Usamos IA para nuestro chatbot de reservas y asistente de voz.
              Siempre te informamos cuando hablas con una IA, nunca fingimos ser
              una persona.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 4. Clasificacion de Riesgo */}
        <LegalSection
          id="clasificacion-riesgo"
          title="4. Clasificacion de Riesgo de Nuestros Sistemas"
          delay={0.25}
        >
          <p className="text-slate-300 mb-6">
            El AI Act clasifica los sistemas de IA en cuatro niveles de riesgo.
            A continuacion detallamos como se clasifican nuestros sistemas:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-white font-semibold">
                    Nivel de Riesgo
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Descripcion
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Nuestros Sistemas
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Obligaciones
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800 bg-red-500/5">
                  <td className="px-4 py-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2" aria-hidden="true" />
                    <span className="font-medium text-red-400">
                      Inaceptable
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    Prohibidos (scoring social, manipulacion)
                  </td>
                  <td className="px-4 py-3 font-medium">NO aplicamos</td>
                  <td className="px-4 py-3">Prohibicion total</td>
                </tr>
                <tr className="border-b border-slate-800 bg-orange-500/5">
                  <td className="px-4 py-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2" aria-hidden="true" />
                    <span className="font-medium text-orange-400">Alto</span>
                  </td>
                  <td className="px-4 py-3">
                    Afectan derechos fundamentales (salud, empleo, justicia)
                  </td>
                  <td className="px-4 py-3 font-medium">NO tenemos</td>
                  <td className="px-4 py-3">
                    Evaluacion de conformidad, registro UE
                  </td>
                </tr>
                <tr className="border-b border-slate-800 bg-blue-500/10 border-l-4 border-l-blue-500">
                  <td className="px-4 py-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2" aria-hidden="true" />
                    <span className="font-bold text-blue-400">Limitado</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    Interactuan con personas (chatbots, generacion de contenido)
                  </td>
                  <td className="px-4 py-3 font-bold text-white">
                    Chatbot WhatsApp, asistente de voz
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-400">
                    Transparencia (Art. 50)
                  </td>
                </tr>
                <tr className="bg-emerald-500/5">
                  <td className="px-4 py-3">
                    <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2" aria-hidden="true" />
                    <span className="font-medium text-emerald-400">Minimo</span>
                  </td>
                  <td className="px-4 py-3">
                    Sin riesgo significativo (filtros spam, juegos)
                  </td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">Sin obligaciones especificas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Nuestros sistemas de IA son de{' '}
              <strong>riesgo limitado</strong> segun la ley europea. La
              principal obligacion es informarte de que usas IA, y eso es
              exactamente lo que hacemos.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 5. Proteccion de Datos con IA */}
        <LegalSection
          id="proteccion-datos-ia"
          title="5. Como Protegemos tus Datos cuando Usamos IA"
          delay={0.3}
        >
          <ul className="space-y-4 text-slate-300 mb-6">
            <li>
              <strong className="text-white">
                Minimizacion de datos (Art. 5 RGPD):
              </strong>{' '}
              Solo enviamos a los modelos de IA la informacion estrictamente
              necesaria para responder tu consulta. No compartimos datos
              innecesarios.
            </li>
            <li>
              <strong className="text-white">No entrenamiento:</strong> Tus
              datos NO se utilizan para entrenar modelos de IA. OpenAI no
              entrena con datos enviados a traves de su API empresarial.
            </li>
            <li>
              <strong className="text-white">Base juridica:</strong> El
              tratamiento de datos mediante IA se basa en el{' '}
              <strong className="text-white">
                interes legitimo (Art. 6.1.f RGPD)
              </strong>{' '}
              para el chatbot comercial, o en la{' '}
              <strong className="text-white">
                ejecucion contractual (Art. 6.1.b)
              </strong>{' '}
              para gestion de reservas.
            </li>
            <li>
              <strong className="text-white">Retencion limitada:</strong> Los
              logs de conversaciones se conservan durante un periodo limitado
              conforme al Registro de Actividades de Tratamiento y despues se
              eliminan automaticamente.
            </li>
            <li>
              <strong className="text-white">Pseudonimizacion:</strong> Cuando
              es posible, los datos se pseudonimizan antes de enviarlos al
              modelo de IA.
            </li>
            <li>
              <strong className="text-white">Cifrado:</strong> Todas las
              comunicaciones con proveedores de IA utilizan cifrado{' '}
              <strong className="text-white">TLS 1.3</strong> en transito.
            </li>
          </ul>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Enviamos a la IA solo lo necesario, no entrenamos modelos con tus
              datos, y los eliminamos pasado un plazo. Todo cifrado y protegido.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 6. Supervision Humana */}
        <LegalSection
          id="supervision-humana"
          title="6. Supervision Humana y Decisiones Automatizadas (Art. 22 RGPD)"
          delay={0.35}
        >
          <p className="text-slate-300 mb-4">
            Nuestros sistemas de IA{' '}
            <strong className="text-white">
              NO toman decisiones con efectos juridicos o significativos
            </strong>{' '}
            sobre las personas. El chatbot{' '}
            <strong className="text-white">sugiere y facilita</strong> (por
            ejemplo: buscar disponibilidad, proponer horarios), pero la reserva
            final siempre requiere confirmacion del usuario.
          </p>

          <h3 className="text-lg font-semibold text-white mb-3 mt-6">
            Derecho a Intervencion Humana
          </h3>
          <p className="text-slate-300 mb-4">
            Puedes solicitar en cualquier momento hablar con una persona real a
            traves de:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-6">
            <li>
              <strong className="text-white">Email:</strong>{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.email}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.email}
              </a>
            </li>
            <li>
              <strong className="text-white">Formulario web:</strong>{' '}
              <Link
                href="/#contacto"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Formulario de contacto
              </Link>
            </li>
            <li>
              Indicando{' '}
              <strong className="text-white">
                &ldquo;quiero hablar con una persona&rdquo;
              </strong>{' '}
              al chatbot
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-white mb-3">
            Escalado Automatico
          </h3>
          <p className="text-slate-300 mb-6">
            El sistema escala automaticamente a un humano cuando detecta:
            quejas, datos sensibles, solicitudes de derechos RGPD, o consultas
            que exceden su capacidad.
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              La IA no decide por ti. Te ayuda y te sugiere, pero tu tienes el
              control. Y siempre puedes hablar con una persona si lo prefieres.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 7. Lo que NUNCA Haremos */}
        <LegalSection
          id="usos-prohibidos"
          title="7. Lo que NUNCA Haremos con IA (Usos Prohibidos — Art. 5 AI Act)"
          delay={0.4}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} se compromete a NO realizar y a NO
            implementar los siguientes usos de inteligencia artificial,
            prohibidos por el Reglamento Europeo:
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Puntuacion social (social scoring):
                </strong>{' '}
                Evaluar o clasificar personas por su comportamiento social.
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Manipulacion subliminal o enganosa:
                </strong>{' '}
                Tecnicas que alteren el comportamiento de las personas sin su
                conocimiento.
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Explotacion de vulnerabilidades:
                </strong>{' '}
                Aprovechar la vulnerabilidad de personas o grupos especificos
                (edad, discapacidad, situacion economica).
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Identificacion biometrica remota en tiempo real.
                </strong>
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Categorizacion biometrica
                </strong>{' '}
                por raza, religion, orientacion sexual u otras caracteristicas
                protegidas.
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Reconocimiento de emociones
                </strong>{' '}
                en el ambito laboral o educativo.
              </p>
            </div>
            <div className="flex items-start gap-3 text-slate-300">
              <span className="text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                &#10060;
              </span>
              <p>
                <strong className="text-white">
                  Perfilado con efectos juridicos
                </strong>{' '}
                sin intervencion humana.
              </p>
            </div>
          </div>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Hay cosas que la ley europea prohibe hacer con IA, y nosotros
              estamos 100% comprometidos con esas prohibiciones. Nunca usaremos
              IA para manipularte, categorizarte o tomar decisiones sobre ti sin
              tu conocimiento.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 8. Tus Derechos con IA */}
        <LegalSection
          id="derechos-ia"
          title="8. Tus Derechos en Relacion con la IA"
          delay={0.45}
        >
          <p className="text-slate-300 mb-4">
            Ademas de los derechos ARCO-POL del RGPD (acceso, rectificacion,
            supresion, portabilidad, oposicion, limitacion), tienes derechos
            especificos relacionados con la inteligencia artificial:
          </p>
          <ul className="space-y-3 text-slate-300 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">1.</span>
              <div>
                <strong className="text-white">
                  Derecho a saber que interactuas con IA
                </strong>{' '}
                (Art. 50 AI Act) — Te lo informamos siempre en la primera
                interaccion.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">2.</span>
              <div>
                <strong className="text-white">
                  Derecho a no ser objeto de decisiones automatizadas
                </strong>{' '}
                (Art. 22 RGPD) — Nuestros sistemas no toman decisiones con
                efectos juridicos.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">3.</span>
              <div>
                <strong className="text-white">
                  Derecho a solicitar intervencion humana
                </strong>{' '}
                — Disponible en todo momento por email, formulario o indicandolo
                al chatbot.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">4.</span>
              <div>
                <strong className="text-white">
                  Derecho a explicacion
                </strong>{' '}
                — Puedes preguntar como funciona nuestro sistema de IA y que
                datos utiliza.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5">5.</span>
              <div>
                <strong className="text-white">
                  Derecho de oposicion al perfilado
                </strong>{' '}
                — No realizamos perfilado, pero si lo hicieramos, puedes
                oponerte.
              </div>
            </li>
          </ul>
          <p className="text-slate-300 mb-4">
            Para ejercer estos derechos, contacta con nosotros en{' '}
            <a
              href={`mailto:${STUDIOTEK_LEGAL.privacyEmail}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {STUDIOTEK_LEGAL.privacyEmail}
            </a>
          </p>
          <p className="text-slate-300 mb-6">
            <strong className="text-white">Autoridad de control:</strong>{' '}
            <LegalExternalLink href="https://www.aepd.es">
              Agencia Espanola de Proteccion de Datos (www.aepd.es)
            </LegalExternalLink>
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Tienes derecho a saber cuando hablas con una IA, a pedir hablar
              con una persona, a que te expliquemos como funciona, y a todos los
              derechos de proteccion de datos. Escribenos a{' '}
              {STUDIOTEK_LEGAL.privacyEmail} si tienes dudas.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 9. Proveedores de IA */}
        <LegalSection
          id="proveedores-ia"
          title="9. Nuestros Proveedores de Tecnologia IA"
          delay={0.5}
        >
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-white font-semibold">
                    Proveedor
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Servicio
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">Pais</th>
                  <th className="px-4 py-3 text-white font-semibold">
                    Mecanismo TID
                  </th>
                  <th className="px-4 py-3 text-white font-semibold">DPA</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white">OpenAI</td>
                  <td className="px-4 py-3">
                    Modelos de lenguaje (GPT-4) e Imagen
                  </td>
                  <td className="px-4 py-3">EE.UU.</td>
                  <td className="px-4 py-3">SCCs + TIA</td>
                  <td className="px-4 py-3 text-emerald-400">Si</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-white">OpenAI</td>
                  <td className="px-4 py-3">
                    Reconocimiento de voz (Whisper)
                  </td>
                  <td className="px-4 py-3">EE.UU.</td>
                  <td className="px-4 py-3">SCCs + TIA</td>
                  <td className="px-4 py-3 text-emerald-400">Si</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4 text-slate-300 mb-6">
            <p>
              <strong className="text-white">
                Transferencias internacionales:
              </strong>{' '}
              Las transferencias a proveedores estadounidenses estan protegidas
              mediante Clausulas Contractuales Tipo (SCCs) aprobadas por la
              Comision Europea, complementadas con una Evaluacion de Impacto de
              Transferencia (TIA).
            </p>
            <p>
              <strong className="text-white">
                Contratos de tratamiento (DPA):
              </strong>{' '}
              Todos los proveedores tienen firmado un contrato de encargado de
              tratamiento conforme al Art. 28 RGPD.
            </p>
            <p>
              <strong className="text-white">
                Politica de no entrenamiento:
              </strong>{' '}
              Verificamos contractualmente que nuestros proveedores no utilizan
              los datos enviados a traves de sus APIs para entrenar sus modelos.
            </p>
          </div>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Usamos tecnologia de OpenAI. Tienen firmado un contrato de
              proteccion de datos con nosotros, sus servidores estan en EE.UU.
              protegidos por clausulas europeas, y no entrenan sus modelos con
              tus datos.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 10. Gobernanza Interna */}
        <LegalSection
          id="gobernanza-ia"
          title="10. Gobernanza Interna de IA"
          delay={0.55}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} dispone de los siguientes instrumentos
            de gobernanza interna para garantizar el uso responsable de la
            inteligencia artificial:
          </p>
          <ul className="space-y-3 text-slate-300 mb-6">
            <li>
              <strong className="text-white">
                Politica interna de uso de IA (DOC-INT-2):
              </strong>{' '}
              Define usos autorizados y prohibidos, procedimientos operativos y
              reglas de seguridad para el uso de sistemas de IA en la
              organizacion.
            </li>
            <li>
              <strong className="text-white">
                Codigo Etico con Capitulo de IA (DOC-INT-5):
              </strong>{' '}
              Establece principios de IA responsable, transparencia algoritmica,
              no discriminacion y supervision humana.
            </li>
            <li>
              <strong className="text-white">
                Evaluacion de Impacto (DOC-INT-3):
              </strong>{' '}
              Evaluacion periodica de riesgos para los derechos y libertades de
              los usuarios derivados del uso de IA.
            </li>
            <li>
              <strong className="text-white">
                Formacion del equipo:
              </strong>{' '}
              Todo el personal que trabaja con IA recibe formacion sobre uso
              responsable y normativa vigente.
            </li>
          </ul>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              No solo cumplimos la ley, tambien tenemos politicas internas, un
              codigo etico con capitulo de IA, y formamos a nuestro equipo para
              usar la IA de forma responsable.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 11. Auditoria y Mejora Continua */}
        <LegalSection
          id="auditoria-mejora"
          title="11. Auditoria y Mejora Continua"
          delay={0.6}
        >
          <ul className="space-y-3 text-slate-300 mb-6">
            <li>
              <strong className="text-white">Revision anual:</strong> Revisamos
              esta politica y nuestros sistemas de IA al menos una vez al ano.
            </li>
            <li>
              <strong className="text-white">
                Monitorizacion de sesgos:
              </strong>{' '}
              Evaluamos periodicamente que nuestros sistemas no produzcan
              resultados discriminatorios.
            </li>
            <li>
              <strong className="text-white">
                Actualizacion normativa:
              </strong>{' '}
              Seguimos las actualizaciones del AI Act, las guias AEPD y las
              resoluciones europeas para adaptar nuestros procesos.
            </li>
            <li>
              <strong className="text-white">Gestion de incidentes:</strong>{' '}
              Disponemos de un protocolo para gestionar fallos, sesgos o
              filtraciones relacionados con IA.
            </li>
          </ul>
          <p className="text-slate-300">
            <strong className="text-white">
              Ultima revision de esta politica:
            </strong>{' '}
            {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </LegalSection>

        {/* 12. Contacto y Reclamaciones */}
        <LegalSection
          id="contacto-reclamaciones"
          title="12. Contacto y Reclamaciones"
          delay={0.65}
        >
          <div className="space-y-4 text-slate-300 mb-6">
            <p>
              <strong className="text-white">
                Consultas sobre nuestra politica de IA:
              </strong>{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.privacyEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.privacyEmail}
              </a>
            </p>
            <p>
              <strong className="text-white">
                Ejercer tus derechos:
              </strong>{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.privacyEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.privacyEmail}
              </a>
            </p>
            <p>
              <strong className="text-white">
                Reclamar ante la autoridad de control:
              </strong>{' '}
              <LegalExternalLink href="https://www.aepd.es">
                Agencia Espanola de Proteccion de Datos (www.aepd.es)
              </LegalExternalLink>
            </p>
            <p>
              <strong className="text-white">
                Informacion sobre AI Act:
              </strong>{' '}
              <LegalExternalLink href="https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence">
                Oficina Europea de Inteligencia Artificial
              </LegalExternalLink>
            </p>
          </div>
        </LegalSection>

        {/* Disclaimer */}
        <BlurFade delay={0.7} inView>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm">
              <strong className="text-amber-400">Aviso:</strong> El contenido de
              esta pagina es de caracter informativo basado en el Reglamento (UE)
              2024/1689 (AI Act), el Reglamento (UE) 2016/679 (RGPD), la Ley
              Organica 3/2018 (LOPDGDD) y las directrices de la Agencia Espanola
              de Proteccion de Datos (AEPD). No constituye asesoramiento legal
              vinculante. Se recomienda la revision por un abogado colegiado o
              DPO certificado para su adaptacion a cada caso concreto.
            </p>
          </div>
        </BlurFade>

        {/* Back link */}
        <BlurFade delay={0.75} inView>
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
