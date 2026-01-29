import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informacion al Informante | StudioTek',
  description:
    'Informacion sobre derechos y protecciones del informante conforme a la Ley 2/2023 reguladora de la proteccion de las personas que informen sobre infracciones normativas.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function InformacionInformanteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
