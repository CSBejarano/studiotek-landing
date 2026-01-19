import { Hero } from '@/components/sections/Hero';
import { PainPointsSection, SolutionSection } from '@/components/storytelling';
import { Benefits } from '@/components/sections/Benefits';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ContactForm } from '@/components/sections/ContactForm';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function Home() {
  return (
    <main>
      {/* 1. Hero con Asistente IA central */}
      <Hero />

      {/* 2. ¿Te identificas? - Problemas del cliente */}
      <PainPointsSection />

      {/* 3. Nuestra solucion (menos espacio con PainPoints) */}
      <SolutionSection />

      {/* 4. ¿Por que automatizar? - Beneficios */}
      <Benefits />

      {/* 5. Nuestros servicios */}
      <Services />

      {/* 6. Resultados que hablan - Stats */}
      <SectionDivider color="blue" variant="line" />
      <Stats />

      {/* 7. Como trabajamos */}
      <HowItWorks />

      {/* 8. Formulario de contacto */}
      <ContactForm />
    </main>
  );
}
