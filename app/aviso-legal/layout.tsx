import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal | StudioTek',
  description:
    'Aviso legal de StudioTek S.L. Datos identificativos, condiciones de uso y propiedad intelectual conforme a la LSSI-CE.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function AvisoLegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
