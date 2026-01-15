import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Cookies | StudioTek',
  description:
    'Informacion sobre las cookies que utilizamos en StudioTek, tipos de cookies, finalidades y como gestionarlas. Cumplimiento LSSI Art. 22.2.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaCookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
