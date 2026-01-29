/**
 * Categorias de denuncia segun Ley 2/2023.
 * Ley reguladora de la proteccion de las personas que informen sobre
 * infracciones normativas y de lucha contra la corrupcion.
 */

export interface WhistleblowerCategory {
  id: string;
  label: string;
  description: string;
  /** Nombre del icono de lucide-react */
  icon: string;
}

export const WHISTLEBLOWER_CATEGORIES: WhistleblowerCategory[] = [
  {
    id: 'acoso_laboral',
    label: 'Acoso laboral',
    description:
      'Conductas de hostigamiento, intimidacion o acoso en el entorno de trabajo.',
    icon: 'UserX',
  },
  {
    id: 'fraude_corrupcion',
    label: 'Fraude y corrupcion',
    description:
      'Actos de fraude, soborno, malversacion de fondos o corrupcion en la organizacion.',
    icon: 'ShieldAlert',
  },
  {
    id: 'blanqueo_capitales',
    label: 'Blanqueo de capitales',
    description:
      'Actividades relacionadas con el blanqueo de capitales o financiacion del terrorismo.',
    icon: 'Banknote',
  },
  {
    id: 'seguridad_productos',
    label: 'Seguridad de productos',
    description:
      'Infracciones relativas a la seguridad y conformidad de productos y servicios.',
    icon: 'PackageCheck',
  },
  {
    id: 'medio_ambiente',
    label: 'Medio ambiente',
    description:
      'Infracciones medioambientales, vertidos ilegales o danos a la naturaleza.',
    icon: 'TreePine',
  },
  {
    id: 'datos_personales',
    label: 'Proteccion de datos',
    description:
      'Vulneraciones de la normativa de proteccion de datos personales (RGPD/LOPDGDD).',
    icon: 'DatabaseZap',
  },
  {
    id: 'discriminacion',
    label: 'Discriminacion',
    description:
      'Actos de discriminacion por razon de genero, raza, orientacion sexual, religion u otros motivos.',
    icon: 'Scale',
  },
  {
    id: 'incumplimiento_normativo',
    label: 'Incumplimiento normativo',
    description:
      'Infracciones de legislacion nacional o de la Union Europea en materia regulatoria.',
    icon: 'FileWarning',
  },
  {
    id: 'seguridad_laboral',
    label: 'Seguridad laboral',
    description:
      'Infracciones en materia de prevencion de riesgos laborales y seguridad en el trabajo.',
    icon: 'HardHat',
  },
  {
    id: 'proteccion_consumidores',
    label: 'Proteccion de consumidores',
    description:
      'Infracciones de los derechos de consumidores y usuarios.',
    icon: 'ShoppingBag',
  },
  {
    id: 'otros',
    label: 'Otros',
    description:
      'Otras infracciones normativas no incluidas en las categorias anteriores.',
    icon: 'MoreHorizontal',
  },
] as const;
