'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalHighlight } from '@/components/legal/LegalHighlight';
import { LegalExternalLink } from '@/components/legal/LegalExternalLink';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';

export default function AvisoLegal() {
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
            Aviso Legal
          </h1>
          <p className="text-slate-400 mb-12">
            Ultima actualizacion: {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* 1. Datos Identificativos */}
        <LegalSection
          id="datos-identificativos"
          title="1. Datos Identificativos del Titular del Sitio Web"
          delay={0.1}
        >
          <p className="text-slate-300 mb-4">
            En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio,
            de Servicios de la Sociedad de la Informacion y de Comercio
            Electronico (LSSI-CE), se informan los datos identificativos del
            titular de este sitio web:
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
                <dt className="font-medium text-white min-w-[200px]">
                  Nombre comercial:
                </dt>
                <dd>{STUDIOTEK_LEGAL.tradeName}</dd>
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
                  Email de contacto:
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
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[200px]">
                  Sitio web:
                </dt>
                <dd>
                  <a
                    href={STUDIOTEK_LEGAL.siteUrl}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {STUDIOTEK_LEGAL.siteUrl}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </LegalSection>

        {/* 2. Objeto del Sitio Web */}
        <LegalSection
          id="objeto-sitio-web"
          title="2. Objeto del Sitio Web"
          delay={0.2}
        >
          <p className="text-slate-300 mb-4">
            El presente sitio web tiene por objeto proporcionar informacion
            sobre los servicios ofrecidos por {STUDIOTEK_LEGAL.tradeName},
            agencia especializada en automatizacion de procesos empresariales
            mediante inteligencia artificial.
          </p>
          <p className="text-slate-300 mb-4">
            En particular, a traves de este sitio web se informa sobre:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">Servicios de automatizacion con IA:</strong>{' '}
              chatbots empresariales, agentes de voz, integraciones con
              plataformas de terceros y automatizacion de flujos de trabajo.
            </li>
            <li>
              <strong className="text-white">KairosAI:</strong> plataforma SaaS
              (Software como Servicio) de gestion inteligente de reservas y
              atencion al cliente, comercializada bajo modelo de suscripcion.
            </li>
            <li>
              <strong className="text-white">Consultoria estrategica:</strong>{' '}
              analisis de procesos y diseno de soluciones de IA a medida para
              PYMEs espanolas.
            </li>
          </ul>
        </LegalSection>

        {/* 3. Condiciones Generales de Uso */}
        <LegalSection
          id="condiciones-uso"
          title="3. Condiciones Generales de Uso"
          delay={0.3}
        >
          <p className="text-slate-300 mb-4">
            El acceso y uso de este sitio web atribuye la condicion de usuario e
            implica la aceptacion plena y sin reservas de todas las
            disposiciones incluidas en este Aviso Legal, asi como en la{' '}
            <Link
              href="/politica-privacidad"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Politica de Privacidad
            </Link>{' '}
            y la{' '}
            <Link
              href="/politica-cookies"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
            >
              Politica de Cookies
            </Link>
            .
          </p>
          <p className="text-slate-300 mb-4">
            El usuario se compromete a hacer un uso adecuado del sitio web, de
            conformidad con la ley, el presente Aviso Legal, la moral y las
            buenas costumbres generalmente aceptadas, y el orden publico. En
            particular, el usuario se compromete a:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              No utilizar el sitio web con fines ilicitos o contrarios a lo
              establecido en este Aviso Legal, lesivos de derechos e intereses de
              terceros, o que puedan danar, inutilizar, sobrecargar o deteriorar
              el sitio web o impedir su normal utilizacion.
            </li>
            <li>
              No introducir ni difundir virus informaticos, gusanos, troyanos u
              otro tipo de software malicioso que pueda causar danos en los
              sistemas informaticos del titular o de terceros.
            </li>
            <li>
              No intentar acceder, utilizar o manipular los datos del titular,
              terceros proveedores u otros usuarios del sitio web.
            </li>
            <li>
              No reproducir, copiar, distribuir, transformar o modificar los
              contenidos del sitio web salvo que se disponga de autorizacion
              expresa del titular.
            </li>
          </ul>
          <LegalHighlight type="warning">
            <p>
              {STUDIOTEK_LEGAL.tradeName} se reserva el derecho de retirar el
              acceso al sitio web, sin necesidad de previo aviso, a cualquier
              usuario que incumpla las presentes condiciones.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 4. Propiedad Intelectual e Industrial */}
        <LegalSection
          id="propiedad-intelectual"
          title="4. Propiedad Intelectual e Industrial"
          delay={0.4}
        >
          <p className="text-slate-300 mb-4">
            Todos los contenidos del sitio web, incluyendo a titulo enunciativo
            pero no limitativo, textos, fotografias, graficos, imagenes, iconos,
            software, tecnologia, enlaces y demas contenidos audiovisuales o
            sonoros, asi como su diseno grafico y codigos fuente, son propiedad
            intelectual de {STUDIOTEK_LEGAL.companyName} o de terceros que han
            autorizado su uso, sin que puedan entenderse cedidos al usuario
            ninguno de los derechos de explotacion sobre los mismos mas alla de
            lo estrictamente necesario para el correcto uso del sitio web.
          </p>
          <p className="text-slate-300 mb-4">
            En particular, estan protegidos por las leyes de propiedad
            intelectual e industrial:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              <strong className="text-white">
                La marca &ldquo;{STUDIOTEK_LEGAL.tradeName}&rdquo;
              </strong>{' '}
              y la marca &ldquo;KairosAI&rdquo;, asi como los logotipos
              asociados.
            </li>
            <li>
              <strong className="text-white">El software</strong> de la
              plataforma KairosAI, incluidos sus algoritmos de inteligencia
              artificial, modulos de chatbot, motores de reservas y cualquier
              otro componente tecnologico.
            </li>
            <li>
              <strong className="text-white">Los contenidos del sitio web:</strong>{' '}
              textos, disenos, elementos graficos, codigo fuente y estructura de
              navegacion.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            Queda expresamente prohibida la reproduccion, distribucion,
            comunicacion publica, transformacion o cualquier otra forma de
            explotacion de los contenidos del sitio web sin la autorizacion
            expresa y por escrito de {STUDIOTEK_LEGAL.companyName}.
          </p>
        </LegalSection>

        {/* 5. Responsabilidad y Exclusion de Garantias */}
        <LegalSection
          id="responsabilidad"
          title="5. Responsabilidad y Exclusion de Garantias"
          delay={0.5}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} no se hace responsable, en ningun caso,
            de los danos y perjuicios de cualquier naturaleza que pudieran
            derivarse de:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
            <li>
              La falta de disponibilidad o accesibilidad al sitio web o la
              interrupcion en su funcionamiento, ya sea por causas tecnicas,
              mantenimiento o cualquier otra circunstancia.
            </li>
            <li>
              La falta de utilidad, adecuacion o validez del sitio web o de sus
              contenidos para satisfacer necesidades, actividades o resultados
              concretos del usuario.
            </li>
            <li>
              La existencia de virus, programas maliciosos o lesivos en los
              contenidos.
            </li>
            <li>
              El uso ilicito, negligente, fraudulento o contrario al presente
              Aviso Legal que del sitio web pudiera hacer el usuario.
            </li>
            <li>
              La falta de licitud, calidad, fiabilidad, utilidad y
              disponibilidad de los servicios prestados por terceros y puestos a
              disposicion de los usuarios a traves del sitio web.
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            {STUDIOTEK_LEGAL.tradeName} se compromete a adoptar las medidas
            razonables para evitar la existencia de errores en los contenidos del
            sitio web, pero no garantiza la ausencia absoluta de los mismos ni
            que el contenido este permanentemente actualizado.
          </p>
        </LegalSection>

        {/* 6. Enlaces a Terceros */}
        <LegalSection
          id="enlaces-terceros"
          title="6. Enlaces a Terceros"
          delay={0.6}
        >
          <p className="text-slate-300 mb-4">
            El sitio web puede contener enlaces (links) a otros sitios web
            gestionados por terceros. {STUDIOTEK_LEGAL.tradeName} no ejerce
            ningun tipo de control sobre dichos sitios y contenidos, y en ningun
            caso asumira responsabilidad alguna por los contenidos de algun
            enlace perteneciente a un sitio web ajeno.
          </p>
          <p className="text-slate-300">
            La inclusion de estos enlaces no implica asociacion, fusion o
            vinculacion alguna con las entidades conectadas. El acceso a estas
            paginas externas se realiza bajo la exclusiva responsabilidad y
            riesgo del usuario, quedando sujeto a las condiciones de uso y
            politicas de privacidad de dichos terceros.
          </p>
        </LegalSection>

        {/* 7. Modificaciones del Aviso Legal */}
        <LegalSection
          id="modificaciones"
          title="7. Modificaciones del Aviso Legal"
          delay={0.7}
        >
          <p className="text-slate-300">
            {STUDIOTEK_LEGAL.tradeName} se reserva el derecho de modificar el
            presente Aviso Legal en cualquier momento, con el objeto de adaptarlo
            a novedades legislativas, jurisprudenciales, asi como a practicas de
            la industria o cambios en los servicios ofrecidos. Las
            modificaciones seran publicadas en esta misma pagina y entraran en
            vigor desde el momento de su publicacion. Se recomienda al usuario
            que revise periodicamente el presente Aviso Legal.
          </p>
        </LegalSection>

        {/* 8. Legislacion Aplicable y Jurisdiccion */}
        <LegalSection
          id="legislacion-jurisdiccion"
          title="8. Legislacion Aplicable y Jurisdiccion"
          delay={0.8}
        >
          <p className="text-slate-300 mb-4">
            El presente Aviso Legal se rige en todos y cada uno de sus extremos
            por la legislacion espanola. Para la resolucion de cualesquiera
            controversias o cuestiones relacionadas con el presente sitio web o
            las actividades en el desarrolladas, seran competentes los Juzgados
            y Tribunales de {STUDIOTEK_LEGAL.city}, renunciando expresamente el
            usuario a cualquier otro fuero que pudiera corresponderle.
          </p>
          <LegalHighlight type="info">
            <p>
              Si usted es consumidor o usuario conforme al Real Decreto
              Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el
              texto refundido de la Ley General para la Defensa de los
              Consumidores y Usuarios (TRLGDCU), seran competentes los Juzgados
              y Tribunales de su domicilio.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* Referencias Legales */}
        <BlurFade delay={0.9} inView>
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
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">
                  Ley Organica 3/2018, de 5 de diciembre, de Proteccion de Datos
                  Personales y garantia de los derechos digitales (LOPDGDD)
                </LegalExternalLink>
              </li>
            </ul>
          </section>
        </BlurFade>

        {/* Disclaimer */}
        <BlurFade delay={1.0} inView>
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
        <BlurFade delay={1.1} inView>
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
