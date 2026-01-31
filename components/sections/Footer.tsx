import Image from 'next/image';
import Link from 'next/link';
import { CookieSettingsButton } from '@/components/cookies/CookieSettingsButton';

const navigationLinks = [
  {
    title: 'Inicio',
    links: [
      { label: 'Beneficios', href: '#benefits' },
      { label: 'Servicios', href: '#services' },
      { label: 'Proceso', href: '#how-it-works' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'comunicacion@studiotek.es', href: 'mailto:comunicacion@studiotek.es' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Aviso Legal', href: '/aviso-legal' },
      { label: 'Politica de Privacidad', href: '/politica-privacidad' },
      { label: 'Politica de Cookies', href: '/politica-cookies' },
      { label: 'Condiciones de Contratacion', href: '/condiciones-contratacion' },
    ],
  },
  {
    title: 'Compliance',
    links: [
      { label: 'Canal de Denuncias', href: '/canal-denuncias' },
      { label: 'Informacion al Informante', href: '/informacion-informante' },
    ],
  },
  {
    title: 'IA y Tecnologia',
    links: [
      { label: 'Politica de IA', href: '/politica-ia' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-950">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-8 md:pt-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-10">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="StudioTek"
                width={120}
                height={30}
                sizes="140px"
                className="md:w-[140px] md:h-[35px]"
              />
            </Link>
            <p className="text-slate-500 text-sm mt-1">
              Automatización e Inteligencia Artificial
            </p>
          </div>

          {/* Navigation columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            {navigationLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-white font-medium text-sm mb-4">
                  {column.title}
                </h4>
                <nav className="flex flex-col gap-1">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm py-1.5 md:py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="border-t border-white/5" />
      </div>

      {/* Bottom section: Copyright + Legal */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 StudioTek. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <Link
              href="/politica-privacidad"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-xs py-2"
            >
              Privacidad
            </Link>
            <Link
              href="/politica-cookies"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-xs py-2"
            >
              Cookies
            </Link>
            <Link
              href="/aviso-legal"
              className="text-slate-500 hover:text-white transition-colors duration-200 text-xs py-2"
            >
              Aviso Legal
            </Link>
            <CookieSettingsButton className="text-slate-500 hover:text-white transition-colors duration-200 text-xs py-2" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
