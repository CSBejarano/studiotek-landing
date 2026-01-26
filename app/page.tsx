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

      {/* 2. Pain Points - Parallax sections */}
      <PainPointsParallax />

      {/* 3. Beneficios de automatizar */}
      <Benefits />

      {/* 4. Nuestros servicios */}
      <Services />

      {/* 5. Como trabajamos */}
      <HowItWorks />

      {/* 6. Resultados - Stats */}
      <Stats />

      {/* 7. Formulario de contacto */}
      <ContactForm />
    </main>
  );
}
