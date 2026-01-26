import { Hero } from '@/components/sections/Hero';
import { PainPointsParallax } from '@/components/sections/PainPointsParallax';
import { Benefits } from '@/components/sections/Benefits';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ContactForm } from '@/components/sections/ContactForm';

export default function Home() {
  return (
    <main>
      {/* 1. Hero con Asistente IA central */}
      <Hero />

      {/* 2. Pain Points - 4 Parallax Separados */}
      <PainPointsParallax />

      {/* 3. Por que automatizar? - Beneficios */}
      <Benefits />

      {/* 4. Nuestros servicios */}
      <Services />

      {/* 5. Como trabajamos */}
      <HowItWorks />

      {/* 7. Resultados que hablan - Stats */}
      <Stats />

      {/* 8. Formulario de contacto */}
      <ContactForm />
    </main>
  );
}
