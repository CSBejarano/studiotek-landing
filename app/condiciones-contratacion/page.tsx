'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalHighlight } from '@/components/legal/LegalHighlight';
import { LegalExternalLink } from '@/components/legal/LegalExternalLink';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';

export default function CondicionesContratacion() {
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
            Condiciones Generales de Contratacion
          </h1>
          <p className="text-slate-400 mb-12">
            Ultima actualizacion: {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* 1. Identificacion del Prestador */}
        <LegalSection
          id="identificacion-prestador"
          title="1. Identificacion del Prestador"
          delay={0.1}
        >
          <p className="text-slate-300 mb-4">
            En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de
            la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE),
            se identifican los datos del prestador del servicio:
          </p>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            <dl className="space-y-3 text-slate-300">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Denominacion social:
                </dt>
                <dd>{STUDIOTEK_LEGAL.companyName}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">CIF:</dt>
                <dd>{STUDIOTEK_LEGAL.cif}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Domicilio social:
                </dt>
                <dd>
                  {STUDIOTEK_LEGAL.address}, {STUDIOTEK_LEGAL.postalCode}{' '}
                  {STUDIOTEK_LEGAL.city}, {STUDIOTEK_LEGAL.province} (
                  {STUDIOTEK_LEGAL.country})
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Registro Mercantil:
                </dt>
                <dd>{STUDIOTEK_LEGAL.registroMercantil}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Email:
                </dt>
                <dd>
                  <a
                    href={`mailto:${STUDIOTEK_LEGAL.email}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {STUDIOTEK_LEGAL.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Telefono:
                </dt>
                <dd>{STUDIOTEK_LEGAL.phone}</dd>
              </div>
            </dl>
          </div>
        </LegalSection>

        {/* 2. Objeto del Contrato */}
        <LegalSection
          id="objeto-contrato"
          title="2. Objeto del Contrato - Licencia SaaS"
          delay={0.15}
        >
          <p className="text-slate-300 mb-4">
            Las presentes Condiciones Generales regulan la contratacion y el uso
            de la plataforma <strong className="text-white">KairosAI</strong>,
            un servicio SaaS (Software as a Service) de gestion inteligente de
            reservas y atencion al cliente proporcionado por{' '}
            {STUDIOTEK_LEGAL.companyName}.
          </p>
          <p className="text-slate-300 mb-4">
            Mediante la contratacion, el usuario (en adelante, el
            &ldquo;Cliente&rdquo;) obtiene una licencia de uso temporal, no
            exclusiva, intransferible y revocable para acceder a la plataforma a
            traves de Internet durante la vigencia de su suscripcion.
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Te damos acceso a nuestro software de gestion de reservas por
              Internet mientras pagues tu suscripcion. No vendes ni compras
              software, sino que usas un servicio en la nube.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 3. Proceso de Contratacion */}
        <LegalSection
          id="proceso-contratacion"
          title="3. Proceso de Contratacion"
          delay={0.2}
        >
          <p className="text-slate-300 mb-4">
            De conformidad con los articulos 23 y 27 de la LSSI-CE, el proceso
            de contratacion se compone de los siguientes pasos:
          </p>
          <ol className="list-decimal list-inside text-slate-300 space-y-3 ml-4">
            <li>
              <strong className="text-white">Seleccion del plan:</strong> El
              Cliente selecciona el plan de suscripcion que mejor se adapte a sus
              necesidades entre los ofrecidos en la pagina web.
            </li>
            <li>
              <strong className="text-white">Registro:</strong> El Cliente crea
              una cuenta proporcionando sus datos identificativos y de
              facturacion.
            </li>
            <li>
              <strong className="text-white">Revision y aceptacion:</strong> El
              Cliente revisa el resumen del pedido, incluyendo precio, IVA
              aplicable y condiciones, y acepta expresamente las presentes
              Condiciones Generales marcando la casilla correspondiente.
            </li>
            <li>
              <strong className="text-white">Pago:</strong> El Cliente completa
              el pago mediante los metodos disponibles.
            </li>
            <li>
              <strong className="text-white">Confirmacion:</strong> El Cliente
              recibe un email de confirmacion con los datos del contrato, acceso
              al servicio y copia de estas condiciones en formato duradero (Art.
              28 LSSI-CE).
            </li>
          </ol>
          <p className="text-slate-300 mt-4">
            El contrato se perfecciona en el momento en que el Cliente hace clic
            en el boton de confirmacion del pedido, de conformidad con el
            articulo 1261 del Codigo Civil espanol.
          </p>
        </LegalSection>

        {/* 4. Precios y Forma de Pago */}
        <LegalSection
          id="precios-pago"
          title="4. Precios y Forma de Pago"
          delay={0.25}
        >
          <p className="text-slate-300 mb-4">
            Los precios de los planes de suscripcion se indican en la pagina web
            en euros (EUR). Todos los precios mostrados son{' '}
            <strong className="text-white">sin IVA</strong>, salvo que se
            indique expresamente lo contrario. El IVA aplicable (actualmente el
            21%) se anadira al importe en el momento de la facturacion.
          </p>
          <p className="text-slate-300 mb-4">
            El pago se realiza mediante suscripcion periodica (mensual o anual,
            segun el plan seleccionado) a traves de los siguientes metodos:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>Tarjeta de credito o debito (Visa, Mastercard)</li>
            <li>Domiciliacion bancaria (SEPA)</li>
          </ul>
          <LegalHighlight type="info" title="Ejemplo:">
            <p>
              Si contratas el plan Profesional a 49 EUR/mes + IVA, se cobrara
              59,29 EUR/mes (49 EUR + 21% IVA). Los precios pueden variar segun
              el plan y la modalidad de pago (mensual o anual).
            </p>
          </LegalHighlight>
          <p className="text-slate-300 mt-4">
            {STUDIOTEK_LEGAL.tradeName} se reserva el derecho de modificar los
            precios. Cualquier cambio de precio sera comunicado con un minimo de
            30 dias naturales de antelacion y se aplicara a partir del siguiente
            periodo de facturacion.
          </p>
        </LegalSection>

        {/* 5. Duracion, Renovacion y Cancelacion */}
        <LegalSection
          id="duracion-renovacion"
          title="5. Duracion, Renovacion y Cancelacion"
          delay={0.3}
        >
          <p className="text-slate-300 mb-4">
            La suscripcion se contrata por el periodo seleccionado (mensual o
            anual) y se{' '}
            <strong className="text-white">renueva automaticamente</strong> al
            final de cada periodo, salvo que el Cliente cancele la suscripcion
            antes de la fecha de renovacion.
          </p>
          <p className="text-slate-300 mb-4">
            El Cliente puede cancelar su suscripcion en cualquier momento desde
            el panel de control (dashboard) de la plataforma o enviando un email
            a{' '}
            <a
              href={`mailto:${STUDIOTEK_LEGAL.supportEmail}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {STUDIOTEK_LEGAL.supportEmail}
            </a>
            . La cancelacion surtira efecto al final del periodo de facturacion
            en curso, manteniendose el acceso al servicio hasta dicha fecha.
          </p>
          <p className="text-slate-300">
            No se realizan reembolsos por periodos parciales no utilizados, salvo
            en los supuestos contemplados en la clausula de derecho de
            desistimiento.
          </p>
        </LegalSection>

        {/* 6. Derecho de Desistimiento */}
        <LegalSection
          id="derecho-desistimiento"
          title="6. Derecho de Desistimiento"
          delay={0.35}
        >
          <p className="text-slate-300 mb-4">
            De conformidad con el articulo 102 del Real Decreto Legislativo
            1/2007, de 16 de noviembre, por el que se aprueba el Texto Refundido
            de la Ley General para la Defensa de los Consumidores y Usuarios
            (TRLGDCU), si el Cliente tiene la condicion de consumidor o usuario,
            dispone de un plazo de{' '}
            <strong className="text-white">14 dias naturales</strong> desde la
            contratacion para ejercer su derecho de desistimiento sin necesidad
            de indicar el motivo y sin penalizacion alguna.
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Tienes 14 dias desde la contratacion para cancelar sin dar
              explicaciones. Te devolvemos el dinero en un plazo maximo de 14
              dias desde que recibamos tu solicitud.
            </p>
          </LegalHighlight>
          <p className="text-slate-300 mt-4 mb-4">
            Para ejercer el derecho de desistimiento, el Cliente puede:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              Enviar un email a{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.supportEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.supportEmail}
              </a>{' '}
              indicando claramente su voluntad de desistir del contrato.
            </li>
            <li>
              Utilizar el formulario de desistimiento disponible en el panel de
              control de la plataforma.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            <strong className="text-white">Excepciones:</strong> El derecho de
            desistimiento no sera aplicable cuando el servicio haya sido
            completamente ejecutado con el consentimiento expreso del consumidor,
            habiendo este reconocido que pierde su derecho de desistimiento una
            vez el contrato haya sido completamente ejecutado (Art. 103.a
            TRLGDCU).
          </p>
        </LegalSection>

        {/* 7. Niveles de Servicio (SLA) */}
        <LegalSection
          id="niveles-servicio"
          title="7. Niveles de Servicio (SLA)"
          delay={0.4}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} se compromete a mantener una{' '}
            <strong className="text-white">
              disponibilidad del servicio del 99,5%
            </strong>{' '}
            mensual, medida excluyendo las ventanas de mantenimiento
            programado.
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Mantenimiento programado:</strong>{' '}
              Se comunicara con al menos 48 horas de antelacion por email. Se
              realizara preferentemente en horario de minimo impacto (madrugada
              CET).
            </li>
            <li>
              <strong className="text-white">Soporte tecnico:</strong>{' '}
              Disponible por email en{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.supportEmail}`}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {STUDIOTEK_LEGAL.supportEmail}
              </a>{' '}
              en horario laboral (lunes a viernes, 9:00 a 18:00 CET). Tiempo de
              respuesta objetivo: 24 horas habiles.
            </li>
            <li>
              <strong className="text-white">Incidencias criticas:</strong>{' '}
              Indisponibilidad total del servicio. Se atendera con la mayor
              celeridad posible.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            En caso de incumplimiento sostenido del SLA (disponibilidad inferior
            al 99,5% durante dos meses consecutivos), el Cliente podra resolver
            el contrato sin penalizacion.
          </p>
        </LegalSection>

        {/* 8. Propiedad Intelectual del Software */}
        <LegalSection
          id="propiedad-intelectual-software"
          title="8. Propiedad Intelectual del Software"
          delay={0.45}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.companyName} es titular exclusiva de todos los
            derechos de propiedad intelectual e industrial sobre la plataforma
            KairosAI, incluyendo su codigo fuente, algoritmos, bases de datos,
            interfaces de usuario, diseno, documentacion tecnica y cualquier
            otro componente.
          </p>
          <p className="text-slate-300 mb-4">
            La licencia otorgada al Cliente es{' '}
            <strong className="text-white">
              no exclusiva, intransferible y revocable
            </strong>
            , limitada al uso del servicio conforme a estas Condiciones durante
            la vigencia de la suscripcion. Queda expresamente prohibido:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>Copiar, reproducir o duplicar el software o sus componentes.</li>
            <li>
              Realizar ingenieria inversa, descompilacion o desensamblaje del
              software.
            </li>
            <li>Modificar, adaptar o crear obras derivadas del software.</li>
            <li>
              Sublicenciar, alquilar, arrendar o ceder a terceros el uso del
              software.
            </li>
            <li>
              Eliminar o alterar avisos de propiedad intelectual, marcas o
              atribuciones.
            </li>
          </ul>
        </LegalSection>

        {/* 9. Datos del Cliente y Portabilidad */}
        <LegalSection
          id="datos-portabilidad"
          title="9. Datos del Cliente y Portabilidad"
          delay={0.5}
        >
          <p className="text-slate-300 mb-4">
            Los datos introducidos por el Cliente en la plataforma (reservas,
            datos de sus clientes finales, configuraciones, etc.) son y seguiran
            siendo{' '}
            <strong className="text-white">propiedad del Cliente</strong>.{' '}
            {STUDIOTEK_LEGAL.tradeName} no adquiere ningun derecho sobre dichos
            datos mas alla de los estrictamente necesarios para la prestacion
            del servicio.
          </p>
          <p className="text-slate-300 mb-4">
            El Cliente tiene derecho a:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Exportacion de datos:</strong>{' '}
              Solicitar la exportacion de sus datos en formatos estandar (CSV,
              JSON) en cualquier momento durante la vigencia del contrato.
            </li>
            <li>
              <strong className="text-white">Portabilidad:</strong> Obtener una
              copia de sus datos para migrarlos a otro servicio.
            </li>
            <li>
              <strong className="text-white">
                Eliminacion tras fin de contrato:
              </strong>{' '}
              Una vez finalizado el contrato, los datos del Cliente se
              conservaran durante un periodo de{' '}
              <strong className="text-white">30 dias naturales</strong> para
              facilitar su recuperacion. Transcurrido dicho plazo, seran
              eliminados de forma segura e irreversible, salvo obligacion legal
              de conservacion.
            </li>
          </ul>
        </LegalSection>

        {/* 10. Proteccion de Datos */}
        <LegalSection
          id="proteccion-datos"
          title="10. Proteccion de Datos - Encargado de Tratamiento"
          delay={0.55}
        >
          <p className="text-slate-300 mb-4">
            En la medida en que {STUDIOTEK_LEGAL.tradeName} acceda a datos
            personales de los clientes finales del Cliente en el marco de la
            prestacion del servicio KairosAI,{' '}
            {STUDIOTEK_LEGAL.tradeName} actuara como{' '}
            <strong className="text-white">encargado de tratamiento</strong> de
            conformidad con el articulo 28 del Reglamento (UE) 2016/679
            (RGPD).
          </p>
          <p className="text-slate-300 mb-4">
            En calidad de encargado de tratamiento,{' '}
            {STUDIOTEK_LEGAL.tradeName} se compromete a:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              Tratar los datos unicamente conforme a las instrucciones
              documentadas del Cliente (responsable del tratamiento).
            </li>
            <li>
              Garantizar que las personas autorizadas para tratar datos se hayan
              comprometido a respetar la confidencialidad.
            </li>
            <li>
              Aplicar las medidas tecnicas y organizativas apropiadas para
              garantizar un nivel de seguridad adecuado al riesgo (Art. 32
              RGPD).
            </li>
            <li>
              No recurrir a otro encargado (subencargado) sin la autorizacion
              previa por escrito del Cliente.
            </li>
            <li>
              Asistir al Cliente en el cumplimiento de sus obligaciones respecto
              a los derechos de los interesados (Arts. 15-22 RGPD).
            </li>
            <li>
              Suprimir o devolver todos los datos personales una vez finalizada
              la prestacion del servicio.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            Para mas informacion, consulte nuestra{' '}
            <Link
              href="/politica-privacidad"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Politica de Privacidad
            </Link>
            .
          </p>
        </LegalSection>

        {/* 11. Responsabilidad y Limitaciones */}
        <LegalSection
          id="responsabilidad-limitaciones"
          title="11. Responsabilidad y Limitaciones"
          delay={0.6}
        >
          <p className="text-slate-300 mb-4">
            La responsabilidad total acumulada de{' '}
            {STUDIOTEK_LEGAL.companyName} frente al Cliente por todos los
            conceptos derivados del contrato estara limitada, como maximo, al{' '}
            <strong className="text-white">
              importe total pagado por el Cliente durante los 12 meses anteriores
            </strong>{' '}
            al hecho que origine la reclamacion.
          </p>
          <p className="text-slate-300 mb-4">
            En ningun caso {STUDIOTEK_LEGAL.tradeName} sera responsable de:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              Danos indirectos, incidentales, especiales, consecuentes o
              punitivos, incluyendo pero no limitandose a la perdida de
              beneficios, ingresos, datos o uso del servicio.
            </li>
            <li>
              Danos derivados de causas de fuerza mayor (incluyendo desastres
              naturales, guerras, pandemias, fallos de infraestructura de
              terceros, decisiones gubernamentales).
            </li>
            <li>
              Danos causados por el uso indebido o negligente del servicio por
              parte del Cliente.
            </li>
            <li>
              Perdida o dano en datos del Cliente derivados de la falta de
              realizacion de copias de seguridad por parte del mismo.
            </li>
          </ul>
        </LegalSection>

        {/* 12. Modificacion de Condiciones */}
        <LegalSection
          id="modificacion-condiciones"
          title="12. Modificacion de Condiciones"
          delay={0.65}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} se reserva el derecho de modificar las
            presentes Condiciones Generales. Cualquier modificacion sera
            comunicada al Cliente con un preaviso minimo de{' '}
            <strong className="text-white">30 dias naturales</strong> mediante
            email a la direccion asociada a su cuenta.
          </p>
          <p className="text-slate-300 mb-4">
            Si el Cliente no esta de acuerdo con las nuevas condiciones, podra
            resolver el contrato sin penalizacion dentro de los 30 dias
            siguientes a la comunicacion del cambio. La continuacion del uso del
            servicio tras la entrada en vigor de las nuevas condiciones se
            entendera como aceptacion tacita de las mismas.
          </p>
        </LegalSection>

        {/* 13. Resolucion del Contrato */}
        <LegalSection
          id="resolucion-contrato"
          title="13. Resolucion del Contrato"
          delay={0.7}
        >
          <p className="text-slate-300 mb-4">
            El contrato podra resolverse por las siguientes causas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Por el Cliente:</strong>{' '}
              Cancelacion voluntaria de la suscripcion en cualquier momento
              (efectiva al final del periodo facturado).
            </li>
            <li>
              <strong className="text-white">
                Por {STUDIOTEK_LEGAL.tradeName}:
              </strong>{' '}
              En caso de incumplimiento grave de estas Condiciones por parte del
              Cliente, previa comunicacion y otorgamiento de un plazo razonable
              de subsanacion (15 dias).
            </li>
            <li>
              <strong className="text-white">Por impago:</strong> La falta de
              pago de dos cuotas consecutivas facultara a{' '}
              {STUDIOTEK_LEGAL.tradeName} para suspender el acceso al servicio y
              resolver el contrato.
            </li>
            <li>
              <strong className="text-white">Por mutuo acuerdo</strong> de ambas
              partes.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            En caso de resolucion, se aplicara lo dispuesto en la clausula 9
            (Datos del Cliente y Portabilidad) respecto a la conservacion y
            eliminacion de datos.
          </p>
        </LegalSection>

        {/* 14. Confidencialidad */}
        <LegalSection
          id="confidencialidad"
          title="14. Confidencialidad"
          delay={0.75}
        >
          <p className="text-slate-300 mb-4">
            Ambas partes se comprometen a mantener en estricta confidencialidad
            toda informacion de naturaleza comercial, tecnica, financiera u
            operativa que hayan obtenido con motivo de la relacion contractual,
            de conformidad con la Ley 1/2019, de 20 de febrero, de Secretos
            Empresariales.
          </p>
          <p className="text-slate-300 mb-4">
            Esta obligacion de confidencialidad permanecera vigente durante la
            duracion del contrato y durante un periodo de{' '}
            <strong className="text-white">2 anos</strong> tras su finalizacion.
          </p>
          <p className="text-slate-300">
            Quedan excluidas de esta obligacion la informacion que sea de dominio
            publico, que haya sido obtenida de forma legitima de un tercero sin
            obligacion de confidencialidad, o cuya divulgacion sea requerida por
            ley o resolucion judicial.
          </p>
        </LegalSection>

        {/* 15. Legislacion Aplicable y Jurisdiccion */}
        <LegalSection
          id="legislacion-jurisdiccion"
          title="15. Legislacion Aplicable y Jurisdiccion"
          delay={0.8}
        >
          <p className="text-slate-300 mb-4">
            Las presentes Condiciones Generales se rigen por la legislacion
            espanola. En particular, seran de aplicacion la Ley 34/2002
            (LSSI-CE), el Real Decreto Legislativo 1/2007 (TRLGDCU), el
            Reglamento (UE) 2016/679 (RGPD) y la Ley Organica 3/2018
            (LOPDGDD), asi como el Codigo Civil y el Codigo de Comercio en lo
            que resulte aplicable.
          </p>
          <p className="text-slate-300 mb-4">
            Para la resolucion de cualesquiera controversias derivadas de estas
            Condiciones, ambas partes se someten a los Juzgados y Tribunales de{' '}
            {STUDIOTEK_LEGAL.city}.
          </p>
          <LegalHighlight type="info" title="En pocas palabras:">
            <p>
              Si eres consumidor, puedes acudir a los Juzgados de tu domicilio.
              Si eres empresa, seran competentes los de{' '}
              {STUDIOTEK_LEGAL.city}.
            </p>
          </LegalHighlight>
          <p className="text-slate-300 mt-4">
            Asimismo, informamos de la existencia de la plataforma de resolucion
            de litigios en linea de la Comision Europea, accesible en{' '}
            <LegalExternalLink href="https://ec.europa.eu/consumers/odr">
              https://ec.europa.eu/consumers/odr
            </LegalExternalLink>
            , a la que pueden acudir los consumidores para resolver sus
            reclamaciones.
          </p>
        </LegalSection>

        {/* Referencias Legales */}
        <BlurFade delay={0.85} inView>
          <section className="border-b border-slate-800 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Referencias Legales
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758">
                  Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
                  Informacion y de Comercio Electronico (LSSI-CE)
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/doue/2016/119/L00001-00088.pdf">
                  Reglamento (UE) 2016/679 General de Proteccion de Datos
                  (RGPD)
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555">
                  Real Decreto Legislativo 1/2007 - Texto Refundido de la Ley
                  General para la Defensa de los Consumidores y Usuarios
                  (TRLGDCU)
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2019-2364">
                  Ley 1/2019, de 20 de febrero, de Secretos Empresariales
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">
                  Ley Organica 3/2018, de Proteccion de Datos Personales y
                  garantia de los derechos digitales (LOPDGDD)
                </LegalExternalLink>
              </li>
            </ul>
          </section>
        </BlurFade>

        {/* Disclaimer */}
        <BlurFade delay={0.9} inView>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm">
              <strong className="text-amber-400">Aviso:</strong> El contenido de
              esta pagina es de caracter informativo basado en la normativa
              vigente y las directrices de la Agencia Espanola de Proteccion de
              Datos (AEPD). No constituye asesoramiento legal vinculante. Se
              recomienda la revision por un abogado colegiado o DPO certificado
              para su adaptacion a cada caso concreto.
            </p>
          </div>
        </BlurFade>

        {/* Back link */}
        <BlurFade delay={0.95} inView>
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
