'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function Header() {
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Click to scroll to top */}
        <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
          <Image
            src="/logo.svg"
            alt="StudioTek"
            width={120}
            height={30}
            priority
          />
        </button>

        {/* CTA Button */}
        <Button
          variant="primary"
          onClick={handleContactClick}
          className="py-2.5"
        >
          Contactar
        </Button>
      </div>
    </header>
  );
}
