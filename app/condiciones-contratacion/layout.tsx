import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Condiciones de Contratacion | StudioTek',
  description:
    'Condiciones generales de contratacion del servicio SaaS KairosAI de StudioTek. Lectura facil con resumenes.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CondicionesContratacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
