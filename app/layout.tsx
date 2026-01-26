import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { CookieProvider } from '@/components/cookies/CookieContext';
import { CookieBanner } from '@/components/cookies/CookieBanner';
import { VoiceAgentProvider } from '@/components/voice/VoiceAgentProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://studiotek.es'),
  title: 'StudioTek | Automatización con IA para PYMEs en España',
  description:
    'Automatiza tu negocio con IA. Reduce un 40% los costes operativos y atiende clientes 24/7. Consulta gratuita sin compromiso.',
  keywords:
    'automatización IA, inteligencia artificial empresas, chatbot WhatsApp, reducir costes, PYMEs España, automatizar procesos',
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
          <VoiceAgentProvider>
            <Header />
            <main className="pt-16">{children}</main>
            <Footer />
            <CookieBanner />
          </VoiceAgentProvider>
        </CookieProvider>
      </body>
    </html>
  );
}
