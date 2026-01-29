'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { CookieDetailsList } from '@/components/cookies/CookieDetailsList';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';

export default function PoliticaCookies() {
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
            Politica de Cookies
          </h1>
          <p className="text-slate-400">
            Ultima actualizacion: {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <article className="prose prose-invert prose-slate max-w-none">
          {/* Section 1 */}
          <BlurFade delay={0.15} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. ¿Que son las cookies?
              </h2>
              <p className="text-slate-300 leading-relaxed">
                Las cookies son pequenos archivos de texto que los sitios web almacenan en tu
                dispositivo (ordenador, tablet o movil) cuando los visitas. Estas cookies permiten
                que el sitio web recuerde tus acciones y preferencias (como el idioma, tamano de
                fuente y otras opciones de visualizacion) durante un periodo de tiempo, para que
                no tengas que volver a configurarlas cada vez que visites el sitio o navegues de
                una pagina a otra.
              </p>
            </section>
          </BlurFade>

          {/* Section 2 */}
          <BlurFade delay={0.2} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Tipos de cookies
              </h2>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                Por finalidad
              </h3>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Cookies tecnicas:</strong> Son esenciales para el
                  funcionamiento del sitio web. Permiten la navegacion y el uso de las diferentes
                  opciones o servicios del sitio.
                </li>
                <li>
                  <strong className="text-white">Cookies analiticas:</strong> Permiten hacer
                  seguimiento y analisis del comportamiento de los usuarios en el sitio web. La
                  informacion recogida se utiliza para mejorar la experiencia de navegacion.
                </li>
                <li>
                  <strong className="text-white">Cookies publicitarias:</strong> Permiten gestionar
                  los espacios publicitarios y mostrar publicidad personalizada segun el perfil de
                  navegacion del usuario.
                </li>
              </ul>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                Por origen
              </h3>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Cookies propias:</strong> Son las generadas y
                  gestionadas directamente por el titular del sitio web.
                </li>
                <li>
                  <strong className="text-white">Cookies de terceros:</strong> Son las generadas
                  por entidades externas al sitio web (proveedores de servicios, redes
                  publicitarias, etc.).
                </li>
              </ul>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                Por duracion
              </h3>
              <ul className="text-slate-300 space-y-3">
                <li>
                  <strong className="text-white">Cookies de sesion:</strong> Se eliminan cuando
                  cierras el navegador. Solo recopilan informacion durante tu visita.
                </li>
                <li>
                  <strong className="text-white">Cookies persistentes:</strong> Permanecen
                  almacenadas durante un tiempo determinado (dias, meses o anos) y permiten
                  recordar tus preferencias entre visitas.
                </li>
              </ul>
            </section>
          </BlurFade>

          {/* Section 3 - Cookie Table */}
          <BlurFade delay={0.25} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Cookies que utilizamos
              </h2>
              <p className="text-slate-300 mb-6">
                A continuacion, te detallamos las cookies que utilizamos en nuestro sitio web,
                clasificadas por categoria:
              </p>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <CookieDetailsList />
              </div>
            </section>
          </BlurFade>

          {/* Section 4 */}
          <BlurFade delay={0.3} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. ¿Como gestionar las cookies?
              </h2>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                Desde nuestro banner de configuracion
              </h3>
              <p className="text-slate-300 mb-4">
                Puedes gestionar tus preferencias de cookies en cualquier momento a traves de
                nuestro banner de configuracion de cookies que aparece al visitar el sitio web.
                Desde ahi podras aceptar o rechazar las diferentes categorias de cookies segun tus
                preferencias.
              </p>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                Desde la configuracion del navegador
              </h3>
              <p className="text-slate-300 mb-4">
                Tambien puedes configurar tu navegador para aceptar, rechazar o eliminar cookies.
                A continuacion, te facilitamos los enlaces a las instrucciones de los navegadores
                mas utilizados:
              </p>

              <ul className="text-slate-300 space-y-2">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647?hl=es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover transition-colors"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <p className="text-slate-400 text-sm mt-4">
                Ten en cuenta que si desactivas las cookies, algunas funcionalidades del sitio web
                podrian no estar disponibles o no funcionar correctamente.
              </p>
              <p className="text-slate-400 text-sm mt-3">
                Para mas informacion sobre como tratamos tus datos personales, consulta nuestra{' '}
                <Link href="/politica-privacidad" className="text-primary hover:text-primary-hover transition-colors">
                  Politica de Privacidad
                </Link>.
              </p>
            </section>
          </BlurFade>

          {/* Section 5 */}
          <BlurFade delay={0.35} inView>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Actualizaciones de esta politica
              </h2>
              <p className="text-slate-300">
                Nos reservamos el derecho de modificar esta politica de cookies para adaptarla a
                novedades legislativas o jurisprudenciales, asi como a practicas de la industria.
                En esos supuestos, anunciaremos los cambios en esta pagina con una razonable
                antelacion a su puesta en practica.
              </p>
              <p className="text-slate-400 mt-4">
                <strong>Ultima revision:</strong> {STUDIOTEK_LEGAL.lastUpdated}
              </p>
            </section>
          </BlurFade>

          {/* Back link */}
          <BlurFade delay={0.4} inView>
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
