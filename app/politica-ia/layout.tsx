import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Inteligencia Artificial | StudioTek',
  description:
    'Politica de transparencia sobre el uso de inteligencia artificial en StudioTek. Cumplimiento del Reglamento Europeo de IA (AI Act), RGPD y guias de la AEPD.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
