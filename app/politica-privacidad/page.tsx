'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Politica de Privacidad
          </h1>
          <p className="text-slate-400">
            Ultima actualizacion: Enero 2026
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <article className="prose prose-invert prose-slate max-w-none">
          {/* Section 1 - Identidad del Responsable */}
          <BlurFade delay={0.15} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Identidad del Responsable del Tratamiento
              </h2>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <dl className="space-y-3 text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[140px]">Responsable:</dt>
                    <dd>StudioTek Soluciones Digitales S.L.</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[140px]">CIF/NIF:</dt>
                    <dd>B12345678</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[140px]">Domicilio:</dt>
                    <dd>Calle Innovacion 42, 28001 Madrid, Espana</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[140px]">Email:</dt>
                    <dd>
                      <a
                        href="mailto:contacto@studiotek.es"
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        contacto@studiotek.es
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </BlurFade>

          {/* Section 2 - Finalidades */}
          <BlurFade delay={0.2} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Finalidades del Tratamiento
              </h2>
              <p className="text-slate-300 mb-4">
                En StudioTek tratamos sus datos personales con las siguientes finalidades:
              </p>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Gestion de consultas:</strong> Gestionar y
                  responder las consultas recibidas a traves del formulario de contacto de nuestra
                  web.
                </li>
                <li>
                  <strong className="text-white">Comunicaciones comerciales:</strong> Enviar
                  comunicaciones comerciales sobre nuestros productos y servicios, unicamente si
                  nos ha dado su consentimiento expreso para ello.
                </li>
                <li>
                  <strong className="text-white">Analisis del sitio web:</strong> Analizar el uso
                  del sitio web mediante cookies analiticas para mejorar su experiencia de
                  navegacion, siempre que haya aceptado estas cookies.
                </li>
              </ul>
            </section>
          </BlurFade>

          {/* Section 3 - Base Juridica */}
          <BlurFade delay={0.25} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Base Juridica del Tratamiento
              </h2>
              <p className="text-slate-300 mb-4">
                La base legal para el tratamiento de sus datos es:
              </p>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Art. 6.1.a RGPD - Consentimiento:</strong> Para el
                  envio de comunicaciones comerciales y el uso de cookies opcionales (analiticas y
                  de marketing). Usted puede retirar su consentimiento en cualquier momento.
                </li>
                <li>
                  <strong className="text-white">Art. 6.1.b RGPD - Ejecucion de contrato:</strong>{' '}
                  Para responder a sus consultas y solicitudes de informacion sobre nuestros
                  servicios, en el marco de medidas precontractuales.
                </li>
                <li>
                  <strong className="text-white">Art. 6.1.f RGPD - Interes legitimo:</strong> Para
                  garantizar el correcto funcionamiento y seguridad de nuestro sitio web mediante
                  cookies tecnicas necesarias.
                </li>
              </ul>
            </section>
          </BlurFade>

          {/* Section 4 - Destinatarios */}
          <BlurFade delay={0.3} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Destinatarios de los Datos
              </h2>
              <p className="text-slate-300 mb-4">
                Sus datos podran ser comunicados a los siguientes destinatarios:
              </p>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Proveedor de hosting:</strong> Vercel Inc. (USA),
                  que actua como encargado del tratamiento. La transferencia se realiza al amparo
                  de Clausulas Contractuales Tipo aprobadas por la Comision Europea.
                </li>
                <li>
                  <strong className="text-white">Autoridades publicas:</strong> Cuando exista una
                  obligacion legal de comunicar los datos.
                </li>
              </ul>
              <p className="text-slate-400 text-sm mt-4">
                No se ceden datos a terceros salvo obligacion legal o en los casos indicados
                anteriormente.
              </p>
            </section>
          </BlurFade>

          {/* Section 5 - Transferencias Internacionales */}
          <BlurFade delay={0.35} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Transferencias Internacionales
              </h2>
              <p className="text-slate-300 mb-4">
                Algunos de nuestros proveedores de servicios estan ubicados fuera del Espacio
                Economico Europeo (EEE):
              </p>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <dl className="space-y-3 text-slate-300">
                  <div>
                    <dt className="font-medium text-white">Vercel Inc. (Estados Unidos)</dt>
                    <dd className="text-sm text-slate-400 mt-1">
                      Transferencia realizada al amparo de las Clausulas Contractuales Tipo (SCCs)
                      aprobadas por la Comision Europea, que garantizan un nivel adecuado de
                      proteccion de sus datos personales.
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </BlurFade>

          {/* Section 6 - Plazo de Conservacion */}
          <BlurFade delay={0.4} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Plazo de Conservacion
              </h2>
              <p className="text-slate-300 mb-4">
                Conservaremos sus datos personales durante los siguientes plazos:
              </p>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Datos de contacto:</strong> Mientras dure la
                  relacion comercial y, posteriormente, durante 3 anos adicionales para atender
                  posibles responsabilidades derivadas del tratamiento (plazo de prescripcion
                  legal).
                </li>
                <li>
                  <strong className="text-white">Consentimiento para comunicaciones comerciales:</strong>{' '}
                  Hasta que revoque su consentimiento.
                </li>
                <li>
                  <strong className="text-white">Datos de cookies:</strong> Maximo 13 meses, con
                  renovacion periodica del consentimiento conforme a las recomendaciones de la
                  AEPD.
                </li>
              </ul>
            </section>
          </BlurFade>

          {/* Section 7 - Derechos ARSOPOL */}
          <BlurFade delay={0.45} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Derechos del Interesado (ARSOPOL)
              </h2>
              <p className="text-slate-300 mb-4">
                Como titular de los datos, usted tiene derecho a:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Acceso</h3>
                  <p className="text-slate-400 text-sm">
                    Conocer que datos personales estamos tratando sobre usted.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Rectificacion</h3>
                  <p className="text-slate-400 text-sm">
                    Corregir datos inexactos o completar datos incompletos.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Supresion</h3>
                  <p className="text-slate-400 text-sm">
                    Solicitar la eliminacion de sus datos cuando ya no sean necesarios.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Oposicion</h3>
                  <p className="text-slate-400 text-sm">
                    Oponerse al tratamiento de sus datos en determinadas circunstancias.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Portabilidad</h3>
                  <p className="text-slate-400 text-sm">
                    Recibir sus datos en un formato estructurado y de uso comun.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <h3 className="text-white font-medium mb-2">Limitacion</h3>
                  <p className="text-slate-400 text-sm">
                    Limitar el tratamiento de sus datos en determinados supuestos.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 mt-6">
                <h3 className="text-white font-medium mb-3">
                  ¿Como ejercer sus derechos?
                </h3>
                <p className="text-slate-300 text-sm">
                  Puede ejercer sus derechos enviando un correo electronico a{' '}
                  <a
                    href="mailto:contacto@studiotek.es"
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    contacto@studiotek.es
                  </a>
                  , indicando el derecho que desea ejercer y adjuntando copia de su DNI o documento
                  equivalente que acredite su identidad.
                </p>
              </div>

              <p className="text-slate-400 text-sm mt-4">
                <strong>Nota:</strong> No aplicamos decisiones automatizadas ni elaboramos perfiles
                con sus datos personales.
              </p>
            </section>
          </BlurFade>

          {/* Section 8 - Derecho a Reclamar */}
          <BlurFade delay={0.5} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Derecho a Reclamar ante la Autoridad de Control
              </h2>
              <p className="text-slate-300 mb-4">
                Si considera que el tratamiento de sus datos personales vulnera la normativa de
                proteccion de datos, tiene derecho a presentar una reclamacion ante la Agencia
                Espanola de Proteccion de Datos (AEPD):
              </p>
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <dl className="space-y-2 text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[100px]">Nombre:</dt>
                    <dd>Agencia Espanola de Proteccion de Datos</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[100px]">Direccion:</dt>
                    <dd>C/ Jorge Juan, 6 - 28001 Madrid</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-medium text-white min-w-[100px]">Web:</dt>
                    <dd>
                      <a
                        href="https://www.aepd.es"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-hover transition-colors"
                      >
                        www.aepd.es
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </BlurFade>

          {/* Section 9 - Actualizaciones */}
          <BlurFade delay={0.55} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Actualizaciones de esta Politica
              </h2>
              <p className="text-slate-300">
                Nos reservamos el derecho de modificar esta politica de privacidad para adaptarla a
                novedades legislativas, jurisprudenciales o a cambios en nuestros servicios. Las
                modificaciones seran publicadas en esta pagina con una razonable antelacion a su
                entrada en vigor.
              </p>
              <p className="text-slate-400 mt-4">
                <strong>Ultima revision:</strong> Enero 2026
              </p>
            </section>
          </BlurFade>

          {/* Back link */}
          <BlurFade delay={0.6} inView>
            <div className="pt-8 border-t border-slate-700/50">
              <Link
                href="/"
                className="text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-2"
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
        </article>
      </div>
    </div>
  );
}
