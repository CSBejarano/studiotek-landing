import { Hero } from '@/components/sections/Hero';
// import { PainPointsPAS } from '@/components/sections/PainPointsPAS';
import { Benefits } from '@/components/sections/Benefits';
import { Services } from '@/components/sections/Services';
// import { HowItWorks } from '@/components/sections/HowItWorks';
import { ContactForm } from '@/components/sections/ContactForm';
import { BookCallButton } from '@/components/BookCallButton';

export default function Home() {
  return (
    <main>
      {/* 1. Hero con Asistente IA central */}
      <Hero />

      {/* 2. Pain Points - TEMPORALMENTE DESACTIVADO */}
      {/* <PainPointsPAS /> */}

      {/* 3. Beneficios de automatizar */}
      <Benefits />

      {/* 4. Nuestros servicios */}
      <Services />

      {/* 5. Como trabajamos - TEMPORALMENTE DESACTIVADO */}
      {/* <HowItWorks /> */}

      {/* 6. Formulario de contacto */}
      <ContactForm />

      {/* 7. CTA de agendar llamada */}
      <section className="relative bg-[#0A0A0A] py-12 text-center">
        <p className="mb-4 text-white/60 text-sm">
          Prefiere hablar directamente con nuestro equipo?
        </p>
        <BookCallButton variant="primary" />
      </section>
    </main>
  );
}
