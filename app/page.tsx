import { Hero } from '@/components/sections/Hero';
import { PainPointsSection, SolutionSection } from '@/components/storytelling';
import { Benefits } from '@/components/sections/Benefits';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ContactForm } from '@/components/sections/ContactForm';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { VoiceAgent } from '@/components/voice/VoiceAgent';

export default function Home() {
  return (
    <main>
      {/* 1. Impacto inicial */}
      <Hero />

      {/* 2. Storytelling: Problemas del cliente */}
      <PainPointsSection />

      {/* 3. Storytelling: Nuestra solucion */}
      <SolutionSection />

      {/* 4. Beneficios de automatizar */}
      <Benefits />

      {/* 5. Numeros de impacto */}
      <SectionDivider color="blue" variant="line" />
      <Stats />

      {/* 6. Servicios detallados */}
      <Services />

      {/* 7. Como trabajamos (6 pasos) */}
      <HowItWorks />

      {/* 8. Formulario de contacto */}
      <ContactForm />

      {/* 9. Agente de voz */}
      <VoiceAgent />
    </main>
  );
}
