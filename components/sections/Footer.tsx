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
];

const legalLinks = [
  { label: 'Política de Privacidad', href: '/politica-privacidad' },
  { label: 'Política de Cookies', href: '/politica-cookies' },
];

export function Footer() {
  return (
    <footer className="bg-slate-950">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo and Tagline */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="StudioTek"
                width={140}
                height={35}
              />
            </Link>
            <p className="text-slate-500 text-sm mt-1">
              Automatización e Inteligencia Artificial
            </p>
          </div>

          {/* Navigation columns */}
          <div className="flex flex-wrap gap-12 md:gap-16">
            {navigationLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-white font-medium text-sm mb-4">
                  {column.title}
                </h4>
                <nav className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
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
          <nav className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-500 hover:text-white transition-colors duration-200 text-xs"
              >
                {link.label}
              </Link>
            ))}
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
