'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Building2, MessageSquare, User, Wallet, Phone, Briefcase, Calendar } from 'lucide-react';
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

// --- Conditional questions per service ---
type ServiceKey = 'implementacion' | 'consultoria' | 'formacion' | 'ia-personalizada';

interface ConditionalField {
  key: string;
  label: string;
  type: 'select' | 'textarea';
  options?: { value: string; label: string }[];
  maxLength?: number;
  placeholder?: string;
}

const conditionalQuestions: Record<ServiceKey, ConditionalField[]> = {
  implementacion: [
    {
      key: 'sector',
      label: 'Sector de tu empresa',
      type: 'select',
      options: [
        { value: '', label: 'Selecciona un sector' },
        { value: 'salud', label: 'Salud' },
        { value: 'hosteleria', label: 'Hosteleria' },
        { value: 'retail', label: 'Retail' },
        { value: 'servicios-profesionales', label: 'Servicios profesionales' },
        { value: 'otro', label: 'Otro' },
      ],
    },
    {
      key: 'num_empleados',
      label: 'Numero de empleados',
      type: 'select',
      options: [
        { value: '', label: 'Selecciona un rango' },
        { value: '1-5', label: '1 - 5' },
        { value: '6-20', label: '6 - 20' },
        { value: '21-50', label: '21 - 50' },
        { value: '50+', label: '50+' },
      ],
    },
  ],
  consultoria: [
    {
      key: 'ia_previa',
      label: 'Has implementado alguna solucion IA antes?',
      type: 'select',
      options: [
        { value: '', label: 'Selecciona una opcion' },
        { value: 'si', label: 'Si' },
        { value: 'no', label: 'No' },
        { value: 'en-proceso', label: 'En proceso' },
      ],
    },
  ],
  formacion: [
    {
      key: 'num_personas',
      label: 'Cuantas personas se formarian?',
      type: 'select',
      options: [
        { value: '', label: 'Selecciona un rango' },
        { value: '1-5', label: '1 - 5' },
        { value: '6-15', label: '6 - 15' },
        { value: '16-50', label: '16 - 50' },
        { value: '50+', label: '50+' },
      ],
    },
  ],
  'ia-personalizada': [
    {
      key: 'idea_descripcion',
      label: 'Describe brevemente tu idea',
      type: 'textarea',
      maxLength: 500,
      placeholder: 'Cuentanos que proceso quieres automatizar o que solucion necesitas...',
    },
  ],
};

const isServiceKey = (value: string): value is ServiceKey =>
  value in conditionalQuestions;

// Mapping of step to fields for partial validation
const STEP_FIELDS: Record<number, (keyof ContactFormData)[]> = {
  1: ['nombre', 'email', 'empresa'],
  2: ['presupuesto'],
  3: [],
  4: ['privacyAccepted'],
};

// Days available for booking (must match BOOKABLE_DAYS in lib/google-calendar.ts)
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const BOOKABLE_DAYS_FRONTEND = new Set([3]); // 3 = Wednesday

function getNextBookableDays(): { value: string; label: string }[] {
  const days: { value: string; label: string }[] = [];
  const now = new Date();
  let current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  while (days.length < 4) {
    current = new Date(current.getTime() + 86_400_000);
    const dow = current.getDay();
    if (BOOKABLE_DAYS_FRONTEND.has(dow)) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      days.push({
        value: `${y}-${m}-${d}`,
        label: `${DIAS[dow]} ${current.getDate()} ${MESES[current.getMonth()]}`,
      });
    }
  }
  return days;
}
const bookableDays = getNextBookableDays();

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [wantsBooking, setWantsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [lastSubmitHadBooking, setLastSubmitHadBooking] = useState(false);

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState(new Set([1])); // Track visited steps
  const TOTAL_STEPS = 4;
  const STEP_LABELS = ['Contacto', 'Proyecto', 'Llamada', 'Confirmación'];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
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
      metadata: {},
      wantsBooking: false,
      bookingDate: '',
      bookingTime: '',
    },
  });

  const selectedService = watch('servicioInteres');
  const currentMetadata = watch('metadata');

  // Clear metadata when service changes
  useEffect(() => {
    setValue('metadata', {});
  }, [selectedService, setValue]);

  const handleMetadataChange = useCallback(
    (key: string, value: string) => {
      setValue('metadata', { ...currentMetadata, [key]: value });
    },
    [currentMetadata, setValue]
  );

  const selectedBookingDate = watch('bookingDate');

  useEffect(() => {
    if (!selectedBookingDate || !wantsBooking) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    fetch(`/api/booking/slots?date=${selectedBookingDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setAvailableSlots(data.slots);
        else setAvailableSlots([]);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedBookingDate, wantsBooking]);

  const activeQuestions =
    selectedService && isServiceKey(selectedService)
      ? conditionalQuestions[selectedService]
      : null;

  // Navigation handlers
  const handleNext = async () => {
    const fieldsToValidate: (keyof ContactFormData)[] = [...STEP_FIELDS[currentStep]];

    // Paso 3: validación condicional solo si quiere booking
    if (currentStep === 3 && wantsBooking) {
      fieldsToValidate.push('bookingDate', 'bookingTime');
    }

    if (fieldsToValidate.length === 0) {
      const nextStep = Math.min(currentStep + 1, TOTAL_STEPS);
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
      return;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      const nextStep = Math.min(currentStep + 1, TOTAL_STEPS);
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
    }
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Navigate to specific step (only allowed for visited steps or current)
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || visitedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    const hadBooking = !!(data.wantsBooking && data.bookingDate && data.bookingTime);
    setLastSubmitHadBooking(hadBooking);

    try {
      // 1. Crear lead
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
          metadata: data.metadata && Object.keys(data.metadata).length > 0
            ? data.metadata : undefined,
          privacy_accepted: data.privacyAccepted,
          commercial_accepted: data.commercialAccepted || false,
          source: hadBooking ? 'web_with_booking' : 'web',
        })
      });

      let leadId: string | undefined;
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        leadId = leadData.lead?.id;
      }

      // 2. Si quiere booking Y tenemos leadId, crear evento en Google Calendar
      if (hadBooking && leadId) {
        const bookingRes = await fetch('/api/booking/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: leadId,
            date: data.bookingDate,
            time: data.bookingTime,
          }),
        });
        if (!bookingRes.ok) {
          console.error('Booking creation failed, lead was saved');
        }
      }

      // 3. Email de confirmación solo si NO hay booking (booking API envía su propio email)
      if (!hadBooking) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: data.email, name: data.nombre }),
        }).catch(err => console.error('Email send failed:', err));
      }

      setStatus('success');
      reset();
      setWantsBooking(false);
      setCurrentStep(1);
      setVisitedSteps(new Set([1]));
    } catch (error) {
      console.error(error);
      setStatus('success');
      reset();
      setWantsBooking(false);
      setCurrentStep(1);
      setVisitedSteps(new Set([1]));
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="contact" className="relative bg-[#0A0A0A] py-[clamp(4rem,8vw,8rem)]">
      {/* Glow connector from Services - very subtle radial at top */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 70% at center top, rgba(59,130,246,0.015) 0%, transparent 50%)' }} />

      {/* Dot Pattern Background */}
      <DotPattern
        width={20}
        height={20}
        cr={1.5}
        glow={true}
        className={cn(
          "fill-blue-500/15",
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-8 md:mb-12">
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="word"
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.15] tracking-tight text-white mb-4"
              delay={0.1}
              duration={0.6}
            >
              Hablemos de cómo automatizar tu negocio
            </TextAnimate>
            <p className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed text-white/60 max-w-2xl mx-auto">
              Cuéntanos sobre tu empresa y te contactamos en menos de 24 horas
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="max-w-2xl mx-auto relative">
            <VitaEonCard variant="form" glowColor="blue" showAccentLine className="relative z-10">
              <div className="p-4 md:p-10 lg:p-12">
                {/* Success/Error messages - shown OUTSIDE the steps */}
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
                      {lastSubmitHadBooking
                        ? 'Reunión agendada. Te hemos enviado un email con los detalles.'
                        : 'Gracias por contactarnos. Te responderemos en menos de 24 horas.'}
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
                    className="space-y-4 md:space-y-6"
                    aria-label="Formulario de contacto"
                    noValidate
                  >
                    {/* Progress Indicator */}
                    <div className="mb-8">
                      {/* Step Labels */}
                      <div className="flex justify-between mb-3 gap-2">
                        {STEP_LABELS.map((label, index) => {
                          const stepNumber = index + 1;
                          const isCompleted = stepNumber < currentStep;
                          const isCurrent = stepNumber === currentStep;
                          const isClickable = stepNumber <= currentStep || visitedSteps.has(stepNumber);

                          return (
                            <div
                              key={index}
                              onClick={() => isClickable && handleStepClick(stepNumber)}
                              className={cn(
                                "flex flex-col items-center gap-1.5 transition-all duration-300 min-w-0 flex-1",
                                isClickable && "cursor-pointer hover:opacity-80",
                                !isClickable && "cursor-default"
                              )}
                            >
                              {/* Step Circle */}
                              <div
                                className={cn(
                                  "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all duration-300 shrink-0",
                                  isCompleted && "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500",
                                  isCurrent && "bg-blue-500 text-white border-2 border-blue-400",
                                  !isCompleted && !isCurrent && "bg-white/5 text-white/40 border-2 border-white/20"
                                )}
                              >
                                {isCompleted ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  stepNumber
                                )}
                              </div>
                              {/* Step Label */}
                              <span
                                className={cn(
                                  "text-xs md:text-sm font-medium transition-colors duration-300 text-center truncate w-full",
                                  isCurrent && "text-blue-400",
                                  isCompleted && "text-emerald-400/80",
                                  !isCurrent && !isCompleted && "text-white/40"
                                )}
                              >
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                          style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                        />
                      </div>

                      {/* Step Counter */}
                      <div className="text-center text-xs text-white/50">
                        Paso {currentStep} de {TOTAL_STEPS}
                      </div>
                    </div>

                    {/* Steps with animations */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {/* STEP 1: Contacto */}
                        {currentStep === 1 && (
                          <div className="space-y-4 md:space-y-6">
                            {/* Row 1: Nombre y Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <User size={18} />
                            </div>
                            <Input
                              label="Nombre"
                              type="text"
                              placeholder="Tu nombre"
                              required
                              error={errors.nombre?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('nombre')}
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <Mail size={18} />
                            </div>
                            <Input
                              label="Email"
                              type="email"
                              placeholder="tu@empresa.com"
                              required
                              error={errors.email?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('email')}
                            />
                          </div>
                        </div>

                        {/* Row 2: Empresa y Telefono */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <Building2 size={18} />
                            </div>
                            <Input
                              label="Empresa"
                              type="text"
                              placeholder="Nombre de tu empresa"
                              required
                              error={errors.empresa?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('empresa')}
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <Phone size={18} />
                            </div>
                            <Input
                              label="Teléfono (opcional)"
                              type="tel"
                              placeholder="+34 600 000 000"
                              error={errors.telefono?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('telefono')}
                            />
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex justify-end items-center mt-6">
                            <button
                              type="button"
                              onClick={handleNext}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 2: Proyecto */}
                      {currentStep === 2 && (
                        <div className="space-y-4 md:space-y-6">
                          {/* Row 1: Presupuesto y Servicio de interes */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <Wallet size={18} />
                            </div>
                            <Select
                              label="Presupuesto estimado"
                              options={presupuestoOptions}
                              required
                              error={errors.presupuesto?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('presupuesto')}
                            />
                          </div>
                          <div className="relative">
                            <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                              <Briefcase size={18} />
                            </div>
                            <Select
                              label="Servicio de interés"
                              options={serviciosOptions}
                              error={errors.servicioInteres?.message}
                              className="pl-11 bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20"
                              {...register('servicioInteres')}
                            />
                          </div>
                        </div>

                        {/* Conditional smart questions based on selected service */}
                        <AnimatePresence mode="wait">
                          {activeQuestions && (
                            <motion.div
                              key={selectedService}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div
                                className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5 space-y-4"
                                role="group"
                                aria-label="Preguntas adicionales sobre tu proyecto"
                              >
                                <p className="text-sm text-white/50">
                                  Cuentanos mas sobre tu proyecto
                                </p>

                                <div className={cn(
                                  "grid gap-4",
                                  activeQuestions.length > 1
                                    ? "grid-cols-1 md:grid-cols-2"
                                    : "grid-cols-1"
                                )}>
                                  {activeQuestions.map((field) => {
                                    if (field.type === 'select' && field.options) {
                                      return (
                                        <Select
                                          key={field.key}
                                          label={field.label}
                                          options={field.options.filter((o) => o.value !== '')}
                                          value={
                                            (currentMetadata?.[field.key] as string) ?? ''
                                          }
                                          onChange={(e) =>
                                            handleMetadataChange(field.key, e.target.value)
                                          }
                                          className="bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20 min-h-[44px]"
                                        />
                                      );
                                    }

                                    if (field.type === 'textarea') {
                                      return (
                                        <Textarea
                                          key={field.key}
                                          label={field.label}
                                          placeholder={field.placeholder}
                                          maxLength={field.maxLength}
                                          value={
                                            (currentMetadata?.[field.key] as string) ?? ''
                                          }
                                          onChange={(e) =>
                                            handleMetadataChange(field.key, e.target.value)
                                          }
                                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px]"
                                        />
                                      );
                                    }

                                    return null;
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Mensaje (full width) */}
                        <div className="relative">
                          <div className="absolute left-4 top-[42px] text-white/40 pointer-events-none">
                            <MessageSquare size={18} />
                          </div>
                          <Textarea
                            label="Mensaje"
                            placeholder="Cuéntanos brevemente qué necesitas..."
                            error={errors.mensaje?.message}
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20 min-h-[120px]"
                            {...register('mensaje')}
                            />
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex justify-between items-center mt-6">
                            <button
                              type="button"
                              onClick={handlePrev}
                              className="bg-white/10 hover:bg-white/15 text-white/70 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={handleNext}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Siguiente
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: Llamada (opcional) */}
                      {currentStep === 3 && (
                        <div className="space-y-4 md:space-y-6">
                          <div className="text-center py-2">
                            <p className="text-sm text-white/50 leading-relaxed">
                              Este paso es opcional. Si prefieres, puedes saltarlo.
                            </p>
                          </div>

                        {/* Booking inline toggle */}
                        <div className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={wantsBooking}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setWantsBooking(checked);
                                setValue('wantsBooking', checked);
                                if (!checked) {
                                  setValue('bookingDate', '');
                                  setValue('bookingTime', '');
                                  setAvailableSlots([]);
                                }
                              }}
                              className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
                            />
                            <div className="flex items-center gap-2">
                              <Calendar size={18} className="text-blue-400" />
                              <span className="text-white font-medium text-sm">
                                Quiero agendar una llamada de descubrimiento (30 min)
                              </span>
                            </div>
                          </label>

                          <AnimatePresence>
                            {wantsBooking && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                  <Select
                                    label="Fecha"
                                    options={[
                                      { value: '', label: 'Selecciona un día' },
                                      ...bookableDays,
                                    ]}
                                    error={errors.bookingDate?.message}
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20"
                                    {...register('bookingDate')}
                                  />
                                  <Select
                                    label="Hora"
                                    options={
                                      slotsLoading
                                        ? [{ value: '', label: 'Cargando horarios...' }]
                                        : availableSlots.length === 0
                                          ? [{ value: '', label: selectedBookingDate ? 'Sin horarios disponibles' : 'Selecciona fecha primero' }]
                                          : [{ value: '', label: 'Selecciona hora' }, ...availableSlots.map(s => ({ value: s, label: `${s}h` }))]
                                    }
                                    disabled={!selectedBookingDate || slotsLoading}
                                    error={errors.bookingTime?.message}
                                    className="bg-white/5 border-white/10 text-white focus:border-blue-500 focus:ring-blue-500/20"
                                    {...register('bookingTime')}
                                  />
                                </div>
                                <p className="text-xs text-white/40 mt-2">
                                  Horario de Madrid (L-V, 10:00-18:00). Recibirás email de confirmación.
                                </p>
                              </motion.div>
                            )}
                            </AnimatePresence>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex justify-between items-center mt-6">
                            <button
                              type="button"
                              onClick={handlePrev}
                              className="bg-white/10 hover:bg-white/15 text-white/70 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Anterior
                            </button>
                            <button
                              type="button"
                              onClick={handleNext}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              {wantsBooking ? 'Siguiente' : 'Saltar'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: Confirmación (RGPD + Submit) */}
                      {currentStep === 4 && (
                        <div className="space-y-4 md:space-y-6">
                          {/* Primera capa informativa RGPD - OBLIGATORIA */}
                          <div className="text-xs text-white/60 bg-white/5 p-3 rounded-lg border border-white/10">
                          <p><strong className="text-white/70">Responsable:</strong> StudioTek</p>
                          <p><strong className="text-white/70">Finalidad:</strong> Gestionar tu consulta y, si lo autorizas, enviarte comunicaciones comerciales</p>
                          <p><strong className="text-white/70">Derechos:</strong> Acceso, rectificación, supresión, oposición, portabilidad, limitación</p>
                          <p>
                            <strong className="text-white/70">Más info:</strong>{' '}
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

                        {/* Navigation Buttons + Submit */}
                        <div className="flex justify-between items-center mt-6">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="bg-white/10 hover:bg-white/15 text-white/70 px-6 py-3 rounded-lg font-medium transition-colors"
                          >
                            Anterior
                          </button>

                          {/* Submit Button */}
                          <ShimmerButton
                            shimmerColor="#ffffff"
                            shimmerSize="0.05em"
                            shimmerDuration="3s"
                            background="rgba(59, 130, 246, 1)"
                            shineColor={["#60a5fa", "#3b82f6", "#60a5fa"]}
                            borderRadius="12px"
                            className="min-h-[48px] text-base px-8 py-3 font-semibold"
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
                        </div>
                      )}
                      </motion.div>
                    </AnimatePresence>
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
