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
  title: 'Automatización IA para Empresas | Ahorra 40% - StudioTek',
  description:
    'Automatización IA para empresas españolas: reduce 40% costes, atiende 3x más clientes 24/7. Implementación en 4 semanas. Consulta estratégica gratuita.',
  keywords: [
    'automatización IA para empresas',
    'automatización inteligente',
    'IA para empresas España',
    'automatizar procesos con IA',
    'agentes IA empresariales',
    'software IA empresas',
    'inteligencia artificial empresas',
    'chatbot WhatsApp empresas',
    'automatización atención cliente',
    'reducir costes operativos IA',
    'PYMEs España',
  ],
  authors: [{ name: 'StudioTek' }],
  alternates: {
    canonical: 'https://studiotek.es',
  },
  openGraph: {
    title: 'Automatización IA para Empresas | StudioTek España',
    description:
      'Automatización IA para empresas españolas: reduce 40% costes, atiende 3x más clientes 24/7. Implementación en 4 semanas.',
    url: 'https://studiotek.es',
    siteName: 'StudioTek',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automatización IA para Empresas | StudioTek España',
    description:
      'Automatización IA para empresas españolas: reduce 40% costes, atiende 3x más clientes 24/7. Implementación en 4 semanas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization Schema JSON-LD for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'StudioTek',
  url: 'https://studiotek.es',
  logo: 'https://studiotek.es/logo.svg',
  description:
    'StudioTek ofrece soluciones de automatizacion e inteligencia artificial para PYMEs en Espana. Reduce costes operativos hasta un 40% y atiende a tus clientes 24/7 con nuestros agentes de IA.',
  foundingDate: '2024',
  areaServed: {
    '@type': 'Country',
    name: 'Spain',
  },
  serviceType: [
    'Automatizacion con IA',
    'Chatbots empresariales',
    'Agentes de voz IA',
    'Integraciones empresariales',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://studiotek.es/#contacto',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [],
};

// Service Schema JSON-LD for SEO
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automatización IA para Empresas',
  description:
    'Servicios de automatización con inteligencia artificial para empresas españolas. Chatbots, agentes IA y automatización de procesos.',
  provider: {
    '@type': 'Organization',
    name: 'StudioTek',
    url: 'https://studiotek.es',
  },
  areaServed: {
    '@type': 'Country',
    name: 'España',
  },
  serviceType: 'Automatización con IA',
};

// FAQ Schema JSON-LD for SEO
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta la automatización con IA para empresas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La inversión en automatización IA varía según el alcance. Nuestros clientes recuperan la inversión en 2-3 meses gracias al ahorro del 40% en costes operativos. Ofrecemos consultoría estratégica gratuita para evaluar tu caso.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo tarda en implementarse la IA en una empresa?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Implementamos soluciones de automatización IA en 4 semanas. Desde el análisis inicial hasta chatbots funcionando 24/7 y procesos automatizados en producción.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué tipo de empresas pueden automatizar con IA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cualquier PYME o empresa española con procesos repetitivos, atención al cliente, o gestión documental. Especialmente efectivo en retail, servicios profesionales, e-commerce y hostelería.',
      },
    },
    {
      '@type': 'Question',
      name: '¿La IA reemplazará a mis empleados?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. La IA automatiza tareas repetitivas liberando a tu equipo para trabajo de mayor valor. El 70% de empresas españolas reportan beneficios sin reducir plantilla.',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </head>
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
