/**
 * Landing Section Template
 *
 * Standard patterns for marketing landing page sections.
 * Includes hero, features, pricing, and testimonials patterns.
 *
 * Features:
 * - Responsive design (mobile-first)
 * - Smooth animations
 * - Accessible markup
 * - SEO-friendly structure
 * - High conversion optimization
 *
 * Usage:
 * Copy the pattern you need (Hero, Features, etc.) and customize
 */

import { Button, Card, CardContent, Badge, cn } from '@ideas/ui';
import {
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Check,
  ArrowRight,
  Star
} from 'lucide-react';

// ============================================================================
// Hero Section Pattern
// ============================================================================

/**
 * Primary hero for landing page
 * - Large headline with gradient accent
 * - Subheading with value proposition
 * - Dual CTA (primary + secondary)
 * - Optional illustration/screenshot
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-background" />
      <div
        className="absolute top-20 right-20 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-20 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-float-delayed"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            {/* Badge (optional) */}
            <Badge className="mb-4" variant="secondary">
              ✨ Nuevo: Integraciones con IA
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Gestiona tus reservas{' '}
              <span className="text-primary">sin esfuerzo</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl">
              Plataforma todo-en-uno para spas, salones y centros de bienestar.
              Automatiza reservas, gestiona staff y aumenta ingresos.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="text-base">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Ver demo
              </Button>
            </div>

            {/* Social proof (optional) */}
            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-slate-200 border-2 border-background"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p>
                Más de <span className="font-semibold text-foreground">500+ negocios</span> confían en nosotros
              </p>
            </div>
          </div>

          {/* Visual (screenshot, illustration, or video) */}
          <div className="relative lg:h-[600px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm" />
            {/* Replace with actual screenshot or illustration */}
            <div className="relative h-full rounded-2xl border-2 border-border bg-background/80 backdrop-blur-sm shadow-2xl p-8">
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-32 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-48 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Features Section Pattern
// ============================================================================

/**
 * Feature grid with icons
 * - 3-column responsive grid
 * - Icon + title + description
 * - Hover effects
 */
export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Calendario Inteligente',
      description: 'Visualiza disponibilidad en tiempo real y gestiona reservas con un solo click.'
    },
    {
      icon: Users,
      title: 'Gestión de Staff',
      description: 'Administra horarios, servicios y disponibilidad de tu equipo fácilmente.'
    },
    {
      icon: MessageSquare,
      title: 'Notificaciones Automáticas',
      description: 'Recordatorios por WhatsApp y email para reducir cancelaciones.'
    },
    {
      icon: BarChart3,
      title: 'Reportes y Analítica',
      description: 'Insights en tiempo real sobre ingresos, ocupación y desempeño.'
    }
  ];

  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Características
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Todo lo que necesitas para crecer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Herramientas profesionales diseñadas para negocios de wellness
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="relative overflow-hidden hover-lift transition-all duration-300 cursor-pointer"
            >
              <CardContent className="pt-6">
                {/* Icon */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground">
                  {feature.description}
                </p>

                {/* Decorative gradient */}
                <div
                  className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl"
                  aria-hidden="true"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Pricing Section Pattern
// ============================================================================

/**
 * Pricing cards with features comparison
 * - 3-tier pricing (Starter, Professional, Enterprise)
 * - Feature checkmarks
 * - Highlighted recommended plan
 */
export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfecto para empezar',
      features: [
        'Hasta 100 reservas/mes',
        '2 usuarios',
        'Notificaciones email',
        'Soporte por email'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: '79',
      description: 'Para negocios en crecimiento',
      features: [
        'Reservas ilimitadas',
        '10 usuarios',
        'WhatsApp + Email',
        'Reportes avanzados',
        'Integraciones',
        'Soporte prioritario'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Para grandes operaciones',
      features: [
        'Todo en Professional',
        'Usuarios ilimitados',
        'Multi-ubicación',
        'API personalizada',
        'Gerente de cuenta dedicado',
        'SLA garantizado'
      ],
      recommended: false
    }
  ];

  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Precios transparentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elige el plan perfecto para tu negocio
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative",
                plan.recommended && "border-primary shadow-xl scale-105"
              )}
            >
              {plan.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Recomendado
                </Badge>
              )}

              <CardContent className="pt-6">
                {/* Plan name */}
                <h3 className="text-2xl font-bold mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {plan.price === 'Custom' ? (
                    <div className="text-4xl font-bold">
                      Contáctanos
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        ${plan.price}
                        <span className="text-lg font-normal text-muted-foreground">
                          /mes
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className="w-full mb-6"
                  variant={plan.recommended ? 'default' : 'outline'}
                >
                  {plan.price === 'Custom' ? 'Hablar con ventas' : 'Empezar ahora'}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Testimonials Section Pattern
// ============================================================================

/**
 * Customer testimonials
 * - 3-column grid
 * - Avatar + name + role
 * - Star rating
 * - Quote
 */
export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Dueña, Spa Zen',
      avatar: 'MG',
      rating: 5,
      quote: 'Ideas transformó nuestro negocio. Ahora gestionamos el doble de reservas con la mitad del esfuerzo.'
    },
    {
      name: 'Carlos Ruiz',
      role: 'Director, Wellness Center',
      avatar: 'CR',
      rating: 5,
      quote: 'La mejor inversión que hemos hecho. El ROI fue positivo en el primer mes.'
    },
    {
      name: 'Ana Martínez',
      role: 'Gerente, Beauty Salon',
      avatar: 'AM',
      rating: 5,
      quote: 'Soporte excepcional y funcionalidades que realmente necesitamos. Altamente recomendado.'
    }
  ];

  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Adorado por negocios como el tuyo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Lee lo que nuestros clientes dicen sobre Ideas
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="hover-lift">
              <CardContent className="pt-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA Section Pattern
// ============================================================================

/**
 * Final call-to-action section
 * - Centered content
 * - Strong headline
 * - Primary CTA
 */
export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden">
          {/* Background decoration */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
            aria-hidden="true"
          />

          <CardContent className="relative py-16 px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a cientos de negocios que ya gestionan sus reservas con Ideas.
              Prueba gratis durante 14 días, sin tarjeta de crédito.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button size="lg" className="text-base">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Hablar con ventas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ============================================================================
// Usage Notes
// ============================================================================

/**
 * CUSTOMIZATION GUIDE:
 *
 * 1. Update copy (headlines, descriptions) for your product
 * 2. Replace placeholder icons with relevant ones
 * 3. Add real testimonials and avatars
 * 4. Update pricing tiers and features
 * 5. Add proper images/screenshots
 * 6. Implement analytics tracking
 * 7. A/B test headlines and CTAs
 * 8. Optimize for SEO (add meta tags, structured data)
 *
 * ANIMATION TIPS:
 *
 * - Use animate-float for decorative elements
 * - Add stagger delays for list animations
 * - Implement scroll-triggered animations (intersection observer)
 * - Keep animations subtle (reduce motion for accessibility)
 *
 * ACCESSIBILITY:
 *
 * - All sections have proper heading hierarchy (h1 > h2 > h3)
 * - Images have alt text
 * - CTAs are descriptive
 * - Color contrast meets WCAG AA
 * - Keyboard navigation works throughout
 */
