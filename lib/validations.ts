import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Introduce un email valido'),
  empresa: z.string().min(1, 'La empresa es requerida'),
  telefono: z.string().optional(),
  presupuesto: z.string().min(1, 'Selecciona un presupuesto'),
  servicioInteres: z.string().optional(),
  mensaje: z.string().optional(),
  privacyAccepted: z.literal(true, {
    message: 'Debes aceptar la politica de privacidad'
  }),
  commercialAccepted: z.boolean().optional(),
  // Smart form additional answers
  metadata: z.record(z.string(), z.unknown()).optional(),
  // Booking fields (optional)
  wantsBooking: z.boolean().optional(),
  bookingDate: z.string().optional(),
  bookingTime: z.string().optional(),
}).refine(
  (data) => {
    if (data.wantsBooking) {
      return !!data.bookingDate && !!data.bookingTime;
    }
    return true;
  },
  {
    message: 'Selecciona fecha y hora para agendar la llamada',
    path: ['bookingTime'],
  }
);

export type ContactFormData = z.infer<typeof contactSchema>;
