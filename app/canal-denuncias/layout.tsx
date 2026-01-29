import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canal de Denuncias | StudioTek',
  description:
    'Canal de denuncias de StudioTek S.L. conforme a la Ley 2/2023. Denuncias anonimas o identificadas con garantia de confidencialidad.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CanalDenunciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
