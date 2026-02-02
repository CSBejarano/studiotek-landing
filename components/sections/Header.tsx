'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
import { useAIChatPanel } from '../ui/AIChatPanelContext';

const NAV_LINKS = [
  { label: 'Beneficios', href: '#benefits' },
  { label: 'Servicios', href: '#services' },
  { label: 'Contacto', href: '#contact' },
  { label: 'Política IA', href: '/politica-ia' },
];

function scrollToSection(href: string) {
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPanelOpen } = useAIChatPanel();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileMenuOpen]);

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection('#contact');
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 z-50 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-white/10 transition-[right] duration-300 ease-in-out"
      style={{ right: isPanelOpen && isDesktop ? '440px' : '0px' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-3 lg:px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
          <Image
            src="/logo.svg"
            alt="StudioTek"
            width={120}
            height={30}
            priority
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-8" aria-label="Navegacion principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs lg:text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          {/* CTA Button - always visible */}
          <Button
            variant="primary"
            onClick={handleContactClick}
            className="py-2.5"
          >
            Contactar
          </Button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md"
          aria-label="Navegacion movil"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-white/60 hover:text-white transition-colors duration-200 py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
