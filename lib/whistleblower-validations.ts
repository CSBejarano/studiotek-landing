import { z } from 'zod';

/**
 * Zod schemas para el formulario multi-step del canal de denuncias.
 * Cada step tiene su propio schema para validacion parcial.
 */

/** Step 1: Tipo de denuncia */
export const StepTypeSchema = z.enum(['anonima', 'identificada'], {
  error: 'Debe seleccionar el tipo de denuncia.',
});

/** Step 2: Categoria de la denuncia */
export const StepCategorySchema = z.object({
  category: z.string().min(1, 'Debe seleccionar una categoria.'),
});

/** Step 3: Descripcion de los hechos */
export const StepDescriptionSchema = z.object({
  description: z
    .string()
    .min(50, 'La descripcion debe tener al menos 50 caracteres.')
    .max(5000, 'La descripcion no puede superar los 5000 caracteres.'),
  dateOfEvents: z
    .string()
    .min(1, 'Debe indicar la fecha o periodo de los hechos.'),
  location: z.string().min(1, 'Debe indicar el lugar de los hechos.'),
  involvedPersons: z.string().optional(),
});

/** Step 4: Archivos adjuntos y datos de contacto (si identificada) */
export const StepAttachmentsSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= 10 * 1024 * 1024,
          'Cada archivo no puede superar los 10 MB.'
        )
    )
    .optional(),
  /** Solo requerido si la denuncia es identificada */
  contactName: z.string().optional(),
  /** Solo requerido si la denuncia es identificada */
  contactEmail: z.string().email('Introduzca un email valido.').optional(),
});

/** Step 5: Confirmacion y aceptacion de terminos */
export const StepConfirmationSchema = z.object({
  acceptTerms: z.literal(true, {
    error: 'Debe aceptar los terminos y condiciones del canal.',
  }),
  acceptPrivacy: z.literal(true, {
    error: 'Debe aceptar la politica de privacidad.',
  }),
});

/** Schema completo combinando todos los steps */
export const WhistleblowerReportSchema = z.object({
  type: StepTypeSchema,
  ...StepCategorySchema.shape,
  ...StepDescriptionSchema.shape,
  ...StepAttachmentsSchema.shape,
  ...StepConfirmationSchema.shape,
});

/** Tipo inferido del reporte completo */
export type WhistleblowerReport = z.infer<typeof WhistleblowerReportSchema>;

/** Tipos inferidos de cada step */
export type StepType = z.infer<typeof StepTypeSchema>;
export type StepCategory = z.infer<typeof StepCategorySchema>;
export type StepDescription = z.infer<typeof StepDescriptionSchema>;
export type StepAttachments = z.infer<typeof StepAttachmentsSchema>;
export type StepConfirmation = z.infer<typeof StepConfirmationSchema>;
