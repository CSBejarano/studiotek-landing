'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Upload,
  X,
  Copy,
  FileText,
  Calendar,
  MapPin,
  Users,
  UserX,
  ShieldAlert,
  Banknote,
  PackageCheck,
  TreePine,
  DatabaseZap,
  Scale,
  FileWarning,
  HardHat,
  ShoppingBag,
  MoreHorizontal,
} from 'lucide-react';
import { WHISTLEBLOWER_CATEGORIES } from '@/lib/whistleblower-categories';
import type { WhistleblowerCategory } from '@/lib/whistleblower-categories';

/* ---------- Icon map for category icons ---------- */
const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  UserX,
  ShieldAlert,
  Banknote,
  PackageCheck,
  TreePine,
  DatabaseZap,
  Scale,
  FileWarning,
  HardHat,
  ShoppingBag,
  MoreHorizontal,
};

/* ---------- Types ---------- */
interface FormData {
  type: 'anonima' | 'identificada' | '';
  category: string;
  description: string;
  dateOfEvents: string;
  location: string;
  involvedPersons: string;
  files: File[];
  contactName: string;
  contactEmail: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  type: '',
  category: '',
  description: '',
  dateOfEvents: '',
  location: '',
  involvedPersons: '',
  files: [],
  contactName: '',
  contactEmail: '',
  acceptTerms: false,
  acceptPrivacy: false,
};

const STEPS = [
  { number: 1, label: 'Tipo' },
  { number: 2, label: 'Categoria' },
  { number: 3, label: 'Descripcion' },
  { number: 4, label: 'Evidencias' },
  { number: 5, label: 'Confirmacion' },
] as const;

const ACCEPTED_FILE_TYPES =
  '.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/* ---------- Utility: format bytes ---------- */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ---------- Utility: generate tracking code ---------- */
function generateTrackingCode(): string {
  const uuid = crypto.randomUUID().replace(/-/g, '').toUpperCase();
  return `${uuid.slice(0, 3)}-${uuid.slice(3, 7)}-${uuid.slice(7, 11)}`;
}

/* ---------- Category card icon ---------- */
function CategoryIcon({
  category,
  size = 24,
}: {
  category: WhistleblowerCategory;
  size?: number;
}) {
  const IconComponent = iconMap[category.icon];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function WhistleblowerForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  /* ---------- Updater helper ---------- */
  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  /* ---------- Validation per step ---------- */
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 1:
          if (!formData.type) {
            newErrors.type = 'Debe seleccionar el tipo de denuncia.';
          }
          break;
        case 2:
          if (!formData.category) {
            newErrors.category = 'Debe seleccionar una categoria.';
          }
          break;
        case 3:
          if (!formData.description || formData.description.length < 50) {
            newErrors.description =
              'La descripcion debe tener al menos 50 caracteres.';
          }
          if (formData.description.length > 5000) {
            newErrors.description =
              'La descripcion no puede superar los 5000 caracteres.';
          }
          if (!formData.dateOfEvents) {
            newErrors.dateOfEvents =
              'Debe indicar la fecha o periodo de los hechos.';
          }
          if (!formData.location) {
            newErrors.location = 'Debe indicar el lugar de los hechos.';
          }
          break;
        case 4:
          if (formData.type === 'identificada') {
            if (!formData.contactName.trim()) {
              newErrors.contactName =
                'Debe introducir su nombre para denuncias identificadas.';
            }
            if (!formData.contactEmail.trim()) {
              newErrors.contactEmail =
                'Debe introducir su email para denuncias identificadas.';
            } else if (
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
            ) {
              newErrors.contactEmail = 'Introduzca un email valido.';
            }
          }
          // Validate file sizes
          for (const file of formData.files) {
            if (file.size > MAX_FILE_SIZE) {
              newErrors.files = `El archivo "${file.name}" supera los 10 MB.`;
              break;
            }
          }
          break;
        case 5:
          if (!formData.acceptTerms) {
            newErrors.acceptTerms =
              'Debe aceptar los terminos y condiciones del canal.';
          }
          if (!formData.acceptPrivacy) {
            newErrors.acceptPrivacy = 'Debe aceptar la politica de privacidad.';
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  /* ---------- Navigation ---------- */
  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  }, [currentStep, validateStep]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  /* ---------- Submit ---------- */
  const handleSubmit = useCallback(async () => {
    if (!validateStep(5)) return;
    setIsSubmitting(true);
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const code = generateTrackingCode();
    setTrackingCode(code);
    setIsSubmitted(true);
    setIsSubmitting(false);
  }, [validateStep]);

  /* ---------- Copy to clipboard ---------- */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
    }
  }, [trackingCode]);

  /* ---------- File handling ---------- */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;
      const newFiles = Array.from(selected);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.files;
        return next;
      });
      // Reset input so same file can be re-selected
      e.target.value = '';
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  }, []);

  /* ---------- Handle drag & drop ---------- */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...droppedFiles],
    }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  /* ---------- Category label for summary ---------- */
  const selectedCategoryLabel = useMemo(() => {
    const cat = WHISTLEBLOWER_CATEGORIES.find(
      (c) => c.id === formData.category
    );
    return cat?.label ?? '';
  }, [formData.category]);

  /* ============================================================
     POST-SUBMIT: SUCCESS SCREEN
     ============================================================ */
  if (isSubmitted) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600/20 text-green-400 mb-2">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-2xl font-bold text-white">
          Denuncia enviada correctamente
        </h3>
        <p className="text-slate-300 max-w-md mx-auto">
          Guarde este codigo para consultar el estado de su denuncia. No sera
          posible recuperarlo posteriormente.
        </p>

        {/* Tracking code */}
        <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-600 rounded-xl px-6 py-4">
          <span className="font-mono text-xl text-white tracking-wider">
            {trackingCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            aria-label="Copiar codigo de seguimiento"
          >
            {copied ? (
              <CheckCircle size={20} className="text-green-400" />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>
        {copied && (
          <p className="text-green-400 text-sm">Codigo copiado al portapapeles</p>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 max-w-lg mx-auto">
          <p className="text-sm text-slate-300">
            Recibira acuse de recibo en un plazo maximo de{' '}
            <strong className="text-white">7 dias naturales</strong> conforme al
            articulo 9 de la Ley 2/2023.
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     FORM STEPS RENDER
     ============================================================ */
  return (
    <div className="space-y-8">
      {/* ---- Progress indicator ---- */}
      <nav aria-label="Progreso del formulario">
        <ol className="flex items-center justify-between gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <li
                key={step.number}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckCircle size={18} aria-hidden="true" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    isCurrent ? 'text-white font-medium' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* ---- Step content ---- */}
      <div className="min-h-[320px]">
        {/* STEP 1: Type */}
        {currentStep === 1 && (
          <fieldset>
            <legend className="text-lg font-semibold text-white mb-2">
              Tipo de denuncia
            </legend>
            <p className="text-slate-400 text-sm mb-6">
              Seleccione si desea realizar la denuncia de forma anonima o
              identificada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Anonymous card */}
              <button
                type="button"
                onClick={() => updateField('type', 'anonima')}
                className={`text-left bg-slate-800/50 border rounded-xl p-5 transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.type === 'anonima'
                    ? 'border-blue-500 ring-1 ring-blue-500/50'
                    : 'border-slate-700'
                }`}
                aria-pressed={formData.type === 'anonima'}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === 'anonima'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Shield size={20} />
                  </div>
                  <span className="font-semibold text-white">Anonima</span>
                </div>
                <p className="text-sm text-slate-400">
                  No se requieren datos personales. Su identidad permanecera
                  completamente protegida.
                </p>
              </button>

              {/* Identified card */}
              <button
                type="button"
                onClick={() => updateField('type', 'identificada')}
                className={`text-left bg-slate-800/50 border rounded-xl p-5 transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formData.type === 'identificada'
                    ? 'border-blue-500 ring-1 ring-blue-500/50'
                    : 'border-slate-700'
                }`}
                aria-pressed={formData.type === 'identificada'}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.type === 'identificada'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    <User size={20} />
                  </div>
                  <span className="font-semibold text-white">Identificada</span>
                </div>
                <p className="text-sm text-slate-400">
                  Proporciona nombre y email para facilitar el seguimiento de su
                  denuncia.
                </p>
              </button>
            </div>
            {errors.type && (
              <p role="alert" className="text-red-400 text-sm mt-3">
                {errors.type}
              </p>
            )}
          </fieldset>
        )}

        {/* STEP 2: Category */}
        {currentStep === 2 && (
          <fieldset>
            <legend className="text-lg font-semibold text-white mb-2">
              Categoria de la denuncia
            </legend>
            <p className="text-slate-400 text-sm mb-6">
              Seleccione la categoria que mejor describe los hechos que desea
              denunciar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WHISTLEBLOWER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateField('category', cat.id)}
                  className={`text-left bg-slate-800/50 border rounded-xl p-4 transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.category === cat.id
                      ? 'border-blue-500 ring-1 ring-blue-500/50'
                      : 'border-slate-700'
                  }`}
                  aria-pressed={formData.category === cat.id}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`${
                        formData.category === cat.id
                          ? 'text-blue-400'
                          : 'text-slate-400'
                      }`}
                    >
                      <CategoryIcon category={cat} size={20} />
                    </span>
                    <span className="font-medium text-white text-sm">
                      {cat.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {cat.description}
                  </p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p role="alert" className="text-red-400 text-sm mt-3">
                {errors.category}
              </p>
            )}
          </fieldset>
        )}

        {/* STEP 3: Description */}
        {currentStep === 3 && (
          <fieldset className="space-y-5">
            <legend className="text-lg font-semibold text-white mb-2">
              Descripcion de los hechos
            </legend>

            {/* Description textarea */}
            <div>
              <label
                htmlFor="wb-description"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Describa los hechos detalladamente{' '}
                <span className="text-red-400">*</span>
              </label>
              <textarea
                id="wb-description"
                rows={6}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Relate los hechos con el mayor detalle posible: que ocurrio, como, cuando y quienes estaban involucrados..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-colors"
                aria-describedby="wb-description-count"
                aria-invalid={!!errors.description}
                maxLength={5000}
              />
              <div
                id="wb-description-count"
                className="flex justify-between text-xs mt-1"
              >
                <span
                  className={
                    formData.description.length < 50
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }
                >
                  {formData.description.length < 50
                    ? `Minimo 50 caracteres (faltan ${50 - formData.description.length})`
                    : `${formData.description.length} caracteres`}
                </span>
                <span className="text-slate-500">
                  {formData.description.length}/5000
                </span>
              </div>
              {errors.description && (
                <p role="alert" className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="wb-date"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                <Calendar size={14} className="inline mr-1" aria-hidden="true" />
                Fecha de los hechos <span className="text-red-400">*</span>
              </label>
              <input
                id="wb-date"
                type="date"
                value={formData.dateOfEvents}
                onChange={(e) => updateField('dateOfEvents', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors [color-scheme:dark]"
                aria-invalid={!!errors.dateOfEvents}
              />
              {errors.dateOfEvents && (
                <p role="alert" className="text-red-400 text-sm mt-1">
                  {errors.dateOfEvents}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="wb-location"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                <MapPin size={14} className="inline mr-1" aria-hidden="true" />
                Lugar o departamento <span className="text-red-400">*</span>
              </label>
              <input
                id="wb-location"
                type="text"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Ej: Departamento de finanzas, Oficina de Barcelona..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                aria-invalid={!!errors.location}
              />
              {errors.location && (
                <p role="alert" className="text-red-400 text-sm mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Involved persons */}
            <div>
              <label
                htmlFor="wb-persons"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                <Users size={14} className="inline mr-1" aria-hidden="true" />
                Personas involucradas{' '}
                <span className="text-slate-500">(opcional)</span>
              </label>
              <textarea
                id="wb-persons"
                rows={3}
                value={formData.involvedPersons}
                onChange={(e) =>
                  updateField('involvedPersons', e.target.value)
                }
                placeholder="Nombres, cargos u otra informacion relevante sobre las personas involucradas..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y transition-colors"
              />
            </div>
          </fieldset>
        )}

        {/* STEP 4: Attachments & Contact */}
        {currentStep === 4 && (
          <fieldset className="space-y-6">
            <legend className="text-lg font-semibold text-white mb-2">
              Evidencias y datos de contacto
            </legend>

            {/* Drag & drop zone */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-1.5">
                <Upload size={14} className="inline mr-1" aria-hidden="true" />
                Adjuntar evidencias{' '}
                <span className="text-slate-500">(opcional, max 10 MB)</span>
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Zona para arrastrar archivos o hacer clic para seleccionar"
                onClick={() =>
                  document.getElementById('wb-file-input')?.click()
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('wb-file-input')?.click();
                  }
                }}
              >
                <Upload
                  size={32}
                  className="mx-auto text-slate-500 mb-3"
                  aria-hidden="true"
                />
                <p className="text-slate-400 text-sm">
                  Arrastre archivos aqui o{' '}
                  <span className="text-blue-400 underline">
                    haga clic para seleccionar
                  </span>
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  PDF, DOC, DOCX, JPG, PNG, ZIP
                </p>
                <input
                  id="wb-file-input"
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Seleccionar archivos"
                />
              </div>
              {errors.files && (
                <p role="alert" className="text-red-400 text-sm mt-2">
                  {errors.files}
                </p>
              )}

              {/* File list */}
              {formData.files.length > 0 && (
                <ul className="mt-3 space-y-2" aria-label="Archivos adjuntos">
                  {formData.files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText
                          size={16}
                          className="text-slate-400 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-slate-300 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-500 shrink-0">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors shrink-0"
                        aria-label={`Eliminar archivo ${file.name}`}
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact fields (only if identified) */}
            {formData.type === 'identificada' && (
              <div className="space-y-4 border-t border-slate-700 pt-6">
                <p className="text-sm font-medium text-white">
                  Datos de contacto (denuncia identificada)
                </p>
                <div>
                  <label
                    htmlFor="wb-name"
                    className="block text-sm font-medium text-slate-300 mb-1.5"
                  >
                    Nombre completo <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="wb-name"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) =>
                      updateField('contactName', e.target.value)
                    }
                    placeholder="Su nombre y apellidos"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    aria-invalid={!!errors.contactName}
                  />
                  {errors.contactName && (
                    <p role="alert" className="text-red-400 text-sm mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="wb-email"
                    className="block text-sm font-medium text-slate-300 mb-1.5"
                  >
                    Email de contacto <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="wb-email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      updateField('contactEmail', e.target.value)
                    }
                    placeholder="su.email@ejemplo.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    aria-invalid={!!errors.contactEmail}
                  />
                  {errors.contactEmail && (
                    <p role="alert" className="text-red-400 text-sm mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
              </div>
            )}
          </fieldset>
        )}

        {/* STEP 5: Summary & Confirmation */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Resumen de la denuncia
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Revise los datos antes de enviar. Una vez enviada, no podra
                modificar la denuncia.
              </p>
            </div>

            {/* Summary cards */}
            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo
                </span>
                <p className="text-white mt-1 capitalize">{formData.type}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Categoria
                </span>
                <p className="text-white mt-1">{selectedCategoryLabel}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Descripcion
                </span>
                <p className="text-slate-300 mt-1 text-sm line-clamp-3">
                  {formData.description}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha
                  </span>
                  <p className="text-white mt-1">{formData.dateOfEvents}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Lugar
                  </span>
                  <p className="text-white mt-1">{formData.location}</p>
                </div>
              </div>
              {formData.files.length > 0 && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Archivos adjuntos
                  </span>
                  <p className="text-white mt-1">
                    {formData.files.length} archivo
                    {formData.files.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
              {formData.type === 'identificada' && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contacto
                  </span>
                  <p className="text-white mt-1">
                    {formData.contactName} &middot; {formData.contactEmail}
                  </p>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 border-t border-slate-700 pt-6">
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      updateField('acceptTerms', e.target.checked)
                    }
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-2 shrink-0"
                    aria-invalid={!!errors.acceptTerms}
                  />
                  <span className="text-sm text-slate-300">
                    He leido y acepto las condiciones del canal de denuncias
                    conforme a la Ley 2/2023.{' '}
                    <span className="text-red-400">*</span>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p role="alert" className="text-red-400 text-sm mt-1 ml-7">
                    {errors.acceptTerms}
                  </p>
                )}
              </div>
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptPrivacy}
                    onChange={(e) =>
                      updateField('acceptPrivacy', e.target.checked)
                    }
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-2 shrink-0"
                    aria-invalid={!!errors.acceptPrivacy}
                  />
                  <span className="text-sm text-slate-300">
                    Autorizo el tratamiento de mis datos segun la{' '}
                    <a
                      href="/politica-privacidad"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                    >
                      politica de privacidad
                    </a>
                    . <span className="text-red-400">*</span>
                  </span>
                </label>
                {errors.acceptPrivacy && (
                  <p role="alert" className="text-red-400 text-sm mt-1 ml-7">
                    {errors.acceptPrivacy}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---- Navigation buttons ---- */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Siguiente
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
                Enviando...
              </>
            ) : (
              'Enviar Denuncia'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
