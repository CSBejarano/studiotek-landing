import { Hero } from '@/components/sections/Hero';
// import { PainPointsPAS } from '@/components/sections/PainPointsPAS';
import { Benefits } from '@/components/sections/Benefits';
import { Services } from '@/components/sections/Services';
// import { HowItWorks } from '@/components/sections/HowItWorks';
import { ContactForm } from '@/components/sections/ContactForm';

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

      {/* 6. Formulario de contacto (con booking integrado) */}
      <ContactForm />
    </main>
  );
}
