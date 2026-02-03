'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Calendar, Clock, Video, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  leadName?: string;
}

type Step = 'contact' | 'date' | 'time' | 'confirming' | 'confirmed' | 'error';

interface SlotResponse {
  success: boolean;
  date: string;
  slots: string[];
  timezone: string;
  error?: string;
}

interface BookingResponse {
  success: boolean;
  booking?: {
    eventId: string;
    meetLink: string;
    startTime: string;
    endTime: string;
  };
  error?: string;
}

interface LeadResponse {
  success: boolean;
  lead?: { id: string };
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIAS_SEMANA_CORTO = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getNext7Workdays(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  let current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (days.length < 7) {
    current = new Date(current.getTime() + 86_400_000);
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(current));
    }
  }
  return days;
}

function formatDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateLong(d: Date): string {
  const dow = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return `${dow[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

// ---------------------------------------------------------------------------
// Slide animation variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BookingModal({ isOpen, onClose, leadId, leadName }: BookingModalProps) {
  // State
  const [step, setStep] = useState<Step>(leadId ? 'date' : 'contact');
  const [resolvedLeadId, setResolvedLeadId] = useState<string | undefined>(leadId);
  const [contactName, setContactName] = useState(leadName ?? '');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingResult, setBookingResult] = useState<BookingResponse['booking'] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const workdays = useRef(getNext7Workdays()).current;

  // ---------------------------------------------------------------------------
  // Reset when modal opens/closes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      setStep(leadId ? 'date' : 'contact');
      setResolvedLeadId(leadId);
      setContactName(leadName ?? '');
      setContactEmail('');
      setContactError('');
      setSelectedDate(null);
      setSlots([]);
      setSelectedTime(null);
      setNotes('');
      setBookingResult(null);
      setErrorMessage('');
    }
  }, [isOpen, leadId, leadName]);

  // ---------------------------------------------------------------------------
  // Escape key handler
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleContactSubmit = useCallback(async () => {
    if (!contactName.trim() || !contactEmail.trim()) {
      setContactError('Nombre y email son obligatorios');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setContactError('Introduce un email valido');
      return;
    }

    setContactLoading(true);
    setContactError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          privacy_accepted: true,
          source: 'booking_modal',
        }),
      });

      const data: LeadResponse = await res.json();

      if (!res.ok || !data.success || !data.lead?.id) {
        setContactError('No se pudo registrar tu informacion. Intentalo de nuevo.');
        return;
      }

      setResolvedLeadId(data.lead.id);
      setStep('date');
    } catch {
      setContactError('Error de conexion. Intentalo de nuevo.');
    } finally {
      setContactLoading(false);
    }
  }, [contactName, contactEmail]);

  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlotsLoading(true);
    setStep('time');

    try {
      const res = await fetch(`/api/booking/slots?date=${formatDateISO(date)}`);
      const data: SlotResponse = await res.json();

      if (!res.ok || !data.success) {
        setSlots([]);
      } else {
        setSlots(data.slots);
      }
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
    setStep('confirming');
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!resolvedLeadId || !selectedDate || !selectedTime) return;

    setBookingLoading(true);

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: resolvedLeadId,
          date: formatDateISO(selectedDate),
          time: selectedTime,
          notes: notes.trim() || undefined,
        }),
      });

      const data: BookingResponse = await res.json();

      if (!res.ok || !data.success || !data.booking) {
        setErrorMessage(data.error ?? 'No se pudo crear la reunion. Intentalo de nuevo.');
        setStep('error');
        return;
      }

      setBookingResult(data.booking);
      setStep('confirmed');
    } catch {
      setErrorMessage('Error de conexion. Intentalo de nuevo.');
      setStep('error');
    } finally {
      setBookingLoading(false);
    }
  }, [resolvedLeadId, selectedDate, selectedTime, notes]);

  const handleRetry = useCallback(() => {
    setErrorMessage('');
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Step titles
  // ---------------------------------------------------------------------------

  const stepTitles: Record<Step, string> = {
    contact: 'Tus datos',
    date: 'Elige una fecha',
    time: 'Elige una hora',
    confirming: 'Confirmar reunion',
    confirmed: 'Reunion confirmada',
    error: 'Ha ocurrido un error',
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Agendar llamada"
            className={cn(
              'relative z-10 w-full max-w-md overflow-hidden rounded-2xl',
              'border border-[#1f2937] bg-[#111827] shadow-2xl'
            )}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f2937] px-6 py-4">
              <h2 className="text-lg font-semibold text-white">{stepTitles[step]}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
              <AnimatePresence mode="wait">
                {/* ---- STEP: CONTACT ---- */}
                {step === 'contact' && (
                  <motion.div
                    key="contact"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-white/60">
                      Necesitamos tu nombre y email para agendar la llamada.
                    </p>

                    <div>
                      <label htmlFor="booking-name" className="mb-1 block text-sm font-medium text-slate-300">
                        Nombre *
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-colors focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label htmlFor="booking-email" className="mb-1 block text-sm font-medium text-slate-300">
                        Email *
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-colors focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleContactSubmit(); }}
                      />
                    </div>

                    {contactError && (
                      <p className="text-sm text-red-400" role="alert">{contactError}</p>
                    )}

                    <button
                      onClick={handleContactSubmit}
                      disabled={contactLoading}
                      className="w-full rounded-lg bg-[#3b82f6] px-4 py-3 font-medium text-white transition-colors hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 disabled:opacity-50"
                    >
                      {contactLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner /> Registrando...
                        </span>
                      ) : (
                        'Continuar'
                      )}
                    </button>
                  </motion.div>
                )}

                {/* ---- STEP: DATE ---- */}
                {step === 'date' && (
                  <motion.div
                    key="date"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-white/60">
                      Selecciona un dia para tu llamada de descubrimiento (30 min).
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {workdays.map((day) => (
                        <button
                          key={formatDateISO(day)}
                          onClick={() => handleDateSelect(day)}
                          className={cn(
                            'flex flex-col items-center rounded-xl border px-3 py-3 transition-all',
                            'border-white/10 bg-white/5 text-white hover:border-[#3b82f6] hover:bg-[#3b82f6]/10',
                            'focus:outline-none focus:ring-2 focus:ring-[#3b82f6]'
                          )}
                          aria-label={`${DIAS_SEMANA_CORTO[day.getDay()]} ${day.getDate()} de ${MESES[day.getMonth()]}`}
                        >
                          <span className="text-xs font-medium text-white/50">
                            {DIAS_SEMANA_CORTO[day.getDay()]}
                          </span>
                          <span className="mt-0.5 text-xl font-bold">
                            {day.getDate()}
                          </span>
                          <span className="text-[10px] text-white/40">
                            {MESES[day.getMonth()].slice(0, 3)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ---- STEP: TIME ---- */}
                {step === 'time' && (
                  <motion.div
                    key="time"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {selectedDate && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar size={14} />
                        <span>{formatDateLong(selectedDate)}</span>
                      </div>
                    )}

                    {slotsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner />
                        <span className="ml-2 text-sm text-white/50">Cargando horarios...</span>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="py-6 text-center">
                        <Clock size={32} className="mx-auto mb-2 text-white/30" />
                        <p className="text-sm text-white/50">
                          No hay horarios disponibles para este dia.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleTimeSelect(slot)}
                            className={cn(
                              'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all',
                              'border-white/10 bg-white/5 text-white',
                              'hover:border-[#3b82f6] hover:bg-[#3b82f6]/10 hover:text-[#60a5fa]',
                              'focus:outline-none focus:ring-2 focus:ring-[#3b82f6]'
                            )}
                            aria-label={`Hora ${slot}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setStep('date')}
                      className="flex items-center gap-1 text-sm text-[#60a5fa] transition-colors hover:text-[#93bbfd] focus:outline-none focus:underline"
                    >
                      <ChevronLeft size={14} />
                      Cambiar fecha
                    </button>
                  </motion.div>
                )}

                {/* ---- STEP: CONFIRMING ---- */}
                {step === 'confirming' && selectedDate && selectedTime && (
                  <motion.div
                    key="confirming"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Summary */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar size={16} className="text-[#3b82f6]" />
                        <span className="font-medium">{formatDateLong(selectedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Clock size={16} className="text-[#3b82f6]" />
                        <span className="font-medium">{selectedTime}h (hora de Madrid)</span>
                      </div>
                      {contactName && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Video size={16} className="text-[#3b82f6]" />
                          <span className="text-sm">Llamada con {contactName}</span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="booking-notes" className="mb-1 block text-sm font-medium text-slate-300">
                        Notas para la reunion (opcional)
                      </label>
                      <textarea
                        id="booking-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Cuentanos brevemente sobre tu negocio o que necesitas..."
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep('time')}
                        disabled={bookingLoading}
                        className="flex-1 rounded-lg border border-[#374151] bg-[#374151] px-4 py-3 font-medium text-white transition-colors hover:bg-[#4b5563] focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={bookingLoading}
                        className="flex-1 rounded-lg bg-[#3b82f6] px-4 py-3 font-medium text-white transition-colors hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 disabled:opacity-50"
                      >
                        {bookingLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Spinner /> Confirmando...
                          </span>
                        ) : (
                          'Confirmar reunion'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ---- STEP: CONFIRMED ---- */}
                {step === 'confirmed' && bookingResult && selectedDate && selectedTime && (
                  <motion.div
                    key="confirmed"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5 text-center"
                  >
                    {/* Success icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">Tu reunion esta confirmada</h3>
                      <p className="mt-1 text-sm text-white/50">
                        {formatDateLong(selectedDate)} a las {selectedTime}h
                      </p>
                    </div>

                    {/* Meet link */}
                    {bookingResult.meetLink && (
                      <a
                        href={bookingResult.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-5 py-3 text-sm font-medium text-[#60a5fa] transition-colors hover:bg-[#3b82f6]/20 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                      >
                        <Video size={18} />
                        Unirse a Google Meet
                      </a>
                    )}

                    <p className="text-xs text-white/40">
                      Te hemos enviado un email con los detalles de la reunion.
                    </p>

                    <button
                      onClick={onClose}
                      className="w-full rounded-lg border border-[#374151] bg-[#374151] px-4 py-3 font-medium text-white transition-colors hover:bg-[#4b5563] focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Cerrar
                    </button>
                  </motion.div>
                )}

                {/* ---- STEP: ERROR ---- */}
                {step === 'error' && (
                  <motion.div
                    key="error"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                      <AlertCircle size={32} className="text-red-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">Algo salio mal</h3>
                      <p className="mt-1 text-sm text-white/50">{errorMessage}</p>
                    </div>

                    <button
                      onClick={handleRetry}
                      className="w-full rounded-lg bg-[#3b82f6] px-4 py-3 font-medium text-white transition-colors hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
                    >
                      Reintentar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

BookingModal.displayName = 'BookingModal';

// ---------------------------------------------------------------------------
// Spinner sub-component
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
