import { BlurFade } from '@/components/magicui/blur-fade';

interface LegalSectionProps {
  /** ID para anchor navigation */
  id: string;
  /** Titulo de la seccion */
  title: string;
  /** Contenido de la seccion */
  children: React.ReactNode;
  /** Delay de la animacion BlurFade (default: 0.1) */
  delay?: number;
}

/**
 * Seccion reutilizable para paginas legales.
 * Incluye animacion BlurFade, anchor ID y estilos consistentes.
 */
export function LegalSection({
  id,
  title,
  children,
  delay = 0.1,
}: LegalSectionProps) {
  return (
    <BlurFade delay={delay} inView>
      <section id={id} className="border-b border-slate-800 pb-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        {children}
      </section>
    </BlurFade>
  );
}
