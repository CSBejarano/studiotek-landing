import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { CookieProvider } from '@/components/cookies/CookieContext';
import { CookieBanner } from '@/components/cookies/CookieBanner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://studiotek.es'),
  title: 'StudioTek | Automatizacion e Inteligencia Artificial para PYMEs',
  description:
    'Ayudamos a empresas espanolas a automatizar procesos y reducir costes con soluciones de IA personalizadas. Consultoria, implementacion y formacion.',
  keywords: [
    'automatizacion',
    'inteligencia artificial',
    'IA',
    'PYME',
    'reduccion costes',
    'eficiencia',
    'consultoria',
  ],
  authors: [{ name: 'StudioTek' }],
  openGraph: {
    title: 'StudioTek | Automatizacion e IA para PYMEs',
    description:
      'Soluciones de automatizacion e inteligencia artificial para empresas espanolas',
    url: 'https://studiotek.es',
    siteName: 'StudioTek',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StudioTek - Automatizacion e IA',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioTek | Automatizacion e IA para PYMEs',
    description:
      'Soluciones de automatizacion e inteligencia artificial para empresas espanolas',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <CookieProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <CookieBanner />
        </CookieProvider>
      </body>
    </html>
  );
}
