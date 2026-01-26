'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Building2, MessageSquare, User, Wallet, Phone, Briefcase } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { VitaEonCard } from '@/components/ui/VitaEonCard';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';

const presupuestoOptions = [
  { value: 'menos-3000', label: 'Menos de 3.000 EUR' },
  { value: '3000-10000', label: '3.000 EUR - 10.000 EUR' },
  { value: '10000-25000', label: '10.000 EUR - 25.000 EUR' },
  { value: '25000-50000', label: '25.000 EUR - 50.000 EUR' },
  { value: 'mas-50000', label: 'Más de 50.000 EUR' },
  { value: 'no-seguro', label: 'No estoy seguro' },
];

const serviciosOptions = [
  { value: '', label: 'Selecciona un servicio (opcional)' },
  { value: 'implementacion', label: 'Implementación de IA' },
  { value: 'consultoria', label: 'Consultoría Estratégica' },
  { value: 'formacion', label: 'Formación y Capacitación' },
  { value: 'ia-personalizada', label: 'Procesos de IA Personalizada' },
];

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: '',
      email: '',
      empresa: '',
      telefono: '',
      presupuesto: '',
      servicioInteres: '',
      mensaje: '',
      privacyAccepted: undefined as unknown as true,
      commercialAccepted: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      // 1. Guardar lead en Supabase
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.nombre,
          email: data.email,
          company: data.empresa,
          phone: data.telefono,
          budget: data.presupuesto,
          service_interest: data.servicioInteres,
          message: data.mensaje,
          privacy_accepted: data.privacyAccepted,
          commercial_accepted: data.commercialAccepted || false,
        })
      });

      if (!leadRes.ok) {
        console.error('Lead save failed, continuing...');
      }

      // 2. Enviar email de confirmacion
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          name: data.nombre,
        })
      });

      setStatus('success');
      reset();
    } catch (error) {
      console.error(error);
      // UX: mostrar exito de todas formas
      setStatus('success');
      reset();
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="relative bg-slate-950 pt-32 pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950 to-slate-950 pointer-events-none" />

      {/* Dot Pattern Background */}
      <DotPattern
        width={20}
        height={20}
        cr={1.5}
        glow={true}
        className={cn(
          "fill-blue-500/30",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-12">
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="word"
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              delay={0.1}
              duration={0.6}
            >
              Hablemos de cómo automatizar tu negocio
            </TextAnimate>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Cuéntanos sobre tu empresa y te contactamos en menos de 24 horas
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="max-w-2xl mx-auto relative">
            <VitaEonCard variant="form" glowColor="blue" showAccentLine className="relative z-10">
              <div className="p-10 md:p-12">
                {status === 'success' ? (
                  <div
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center"
                    role="alert"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-emerald-400 font-medium text-lg">
                      Gracias por contactarnos. Te responderemos en menos de 24 horas.
                    </p>
                  </div>
                ) : status === 'error' ? (
                  <div
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-6"
                    role="alert"
                  >
                    <p className="text-red-400 font-medium">
                      Ha ocurrido un error. Por favor, inténtalo de nuevo.
                    </p>
                  </div>
                ) : null}

                {status !== 'success' && (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    aria-label="Formulario de contacto"
                    noValidate
                  >
                    {/* Row 1: Nombre y Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <User size={18} />
                        </div>
                        <Input
                          label="Nombre"
                          type="text"
                          placeholder="Tu nombre"
                          required
                          error={errors.nombre?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('nombre')}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <Mail size={18} />
                        </div>
                        <Input
                          label="Email"
                          type="email"
                          placeholder="tu@empresa.com"
                          required
                          error={errors.email?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('email')}
                        />
                      </div>
                    </div>

                    {/* Row 2: Empresa y Telefono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <Building2 size={18} />
                        </div>
                        <Input
                          label="Empresa"
                          type="text"
                          placeholder="Nombre de tu empresa"
                          required
                          error={errors.empresa?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('empresa')}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <Phone size={18} />
                        </div>
                        <Input
                          label="Teléfono (opcional)"
                          type="tel"
                          placeholder="+34 600 000 000"
                          error={errors.telefono?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('telefono')}
                        />
                      </div>
                    </div>

                    {/* Row 3: Presupuesto y Servicio de interes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <Wallet size={18} />
                        </div>
                        <Select
                          label="Presupuesto estimado"
                          options={presupuestoOptions}
                          required
                          error={errors.presupuesto?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('presupuesto')}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                          <Briefcase size={18} />
                        </div>
                        <Select
                          label="Servicio de interés"
                          options={serviciosOptions}
                          error={errors.servicioInteres?.message}
                          className="pl-11 bg-slate-800/50 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                          {...register('servicioInteres')}
                        />
                      </div>
                    </div>

                    {/* Row 4: Mensaje (full width) */}
                    <div className="relative">
                      <div className="absolute left-4 top-[42px] text-slate-500 pointer-events-none">
                        <MessageSquare size={18} />
                      </div>
                      <Textarea
                        label="Mensaje"
                        placeholder="Cuéntanos brevemente qué necesitas..."
                        error={errors.mensaje?.message}
                        className="pl-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px]"
                        {...register('mensaje')}
                      />
                    </div>

                    {/* Primera capa informativa RGPD - OBLIGATORIA */}
                    <div className="text-xs text-slate-400 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                      <p><strong className="text-slate-300">Responsable:</strong> StudioTek</p>
                      <p><strong className="text-slate-300">Finalidad:</strong> Gestionar tu consulta y, si lo autorizas, enviarte comunicaciones comerciales</p>
                      <p><strong className="text-slate-300">Derechos:</strong> Acceso, rectificación, supresión, oposición, portabilidad, limitación</p>
                      <p>
                        <strong className="text-slate-300">Más info:</strong>{' '}
                        <Link href="/politica-privacidad" className="text-blue-400 hover:underline">
                          Política de Privacidad
                        </Link>
                      </p>
                    </div>

                    {/* Checkbox privacidad - OBLIGATORIO */}
                    <Checkbox
                      {...register('privacyAccepted')}
                      label={
                        <>
                          He leído y acepto la{' '}
                          <Link href="/politica-privacidad" className="text-blue-400 hover:underline">
                            Política de Privacidad
                          </Link>
                          {' '}*
                        </>
                      }
                      error={errors.privacyAccepted?.message}
                    />

                    {/* Checkbox comunicaciones comerciales - OPCIONAL */}
                    <Checkbox
                      {...register('commercialAccepted')}
                      label="Deseo recibir comunicaciones comerciales sobre productos y servicios de StudioTek"
                    />

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                      <ShimmerButton
                        shimmerColor="#ffffff"
                        shimmerSize="0.05em"
                        shimmerDuration="3s"
                        background="rgba(59, 130, 246, 1)"
                        shineColor={["#60a5fa", "#3b82f6", "#60a5fa"]}
                        borderRadius="12px"
                        className="w-full md:w-auto text-lg px-12 py-4 font-semibold"
                        type="submit"
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          'Solicitar consulta gratuita'
                        )}
                      </ShimmerButton>
                    </div>
                  </form>
                )}
              </div>
            </VitaEonCard>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
