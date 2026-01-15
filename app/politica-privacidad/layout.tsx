import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de Privacidad | StudioTek',
  description:
    'Politica de privacidad de StudioTek. Informacion sobre el tratamiento de datos personales, derechos ARSOPOL y cumplimiento RGPD Art. 13.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PoliticaPrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
