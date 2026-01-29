/**
 * Datos legales centralizados de StudioTek.
 * Usado por todas las paginas legales (privacidad, cookies, aviso legal, canal de denuncias).
 *
 * Los campos marcados con TODO deben completarse con datos reales antes de publicar.
 */
export const STUDIOTEK_LEGAL = {
  companyName: 'StudioTek S.L.',
  tradeName: 'StudioTek',
  cif: 'B-XXXXXXXX', // TODO: CIF real
  address: 'Calle XXXXX, N', // TODO: Direccion real
  city: 'Barcelona',
  postalCode: '08XXX',
  province: 'Barcelona',
  country: 'Espana',
  registroMercantil:
    'Registro Mercantil de Barcelona, Tomo XXXX, Folio XXX, Hoja B-XXXXXX',
  email: 'info@studiotek.es',
  privacyEmail: 'privacidad@studiotek.es',
  supportEmail: 'soporte@studiotek.es',
  phone: '+34 XXX XXX XXX',
  siteUrl: 'https://studiotek.es',
  whistleblowerEmail: 'canal.denuncias@studiotek.es',
  responsableSistema: 'NOMBRE RESPONSABLE', // TODO: Designar
  hasDPO: false,
  dpoEmail: 'dpd@studiotek.es',
  lastUpdated: '2026-01-29',
} as const;

/** Tipo inferido de la configuracion legal */
export type StudioTekLegal = typeof STUDIOTEK_LEGAL;
