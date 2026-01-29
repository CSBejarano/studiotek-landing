'use client';

import Link from 'next/link';
import { BlurFade } from '@/components/magicui/blur-fade';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalHighlight } from '@/components/legal/LegalHighlight';
import { LegalExternalLink } from '@/components/legal/LegalExternalLink';
import { WhistleblowerForm } from '@/components/legal/WhistleblowerForm';
import { WhistleblowerStatus } from '@/components/legal/WhistleblowerStatus';
import { STUDIOTEK_LEGAL } from '@/lib/legal-config';

export default function CanalDenuncias() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-slate-900 to-background">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <BlurFade delay={0}>
          <nav className="mb-8">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al inicio
            </Link>
          </nav>
        </BlurFade>

        <BlurFade delay={0.1}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Canal de Denuncias
          </h1>
          <p className="text-slate-400 mb-12">
            Ley 2/2023, de 20 de febrero &middot; Ultima actualizacion:{' '}
            {STUDIOTEK_LEGAL.lastUpdated}
          </p>
        </BlurFade>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* 1. Que es el Canal de Denuncias */}
        <LegalSection
          id="que-es"
          title="1. Que es el Canal de Denuncias"
          delay={0.1}
        >
          <p className="text-slate-300 mb-4">
            El Canal de Denuncias de {STUDIOTEK_LEGAL.companyName} es un
            mecanismo interno de informacion establecido en cumplimiento de la{' '}
            <strong className="text-white">
              Ley 2/2023, de 20 de febrero
            </strong>
            , reguladora de la proteccion de las personas que informen sobre
            infracciones normativas y de lucha contra la corrupcion. Esta ley
            transpone la Directiva (UE) 2019/1937 del Parlamento Europeo y del
            Consejo.
          </p>
          <p className="text-slate-300 mb-4">
            Su objeto es permitir la comunicacion de informaciones sobre
            acciones u omisiones que puedan constituir infracciones del Derecho
            de la Union Europea o infracciones penales o administrativas graves
            o muy graves en el ambito de la organizacion.
          </p>
          <LegalHighlight type="info">
            <p>
              Este canal garantiza la <strong className="text-white">confidencialidad</strong> de la
              identidad del informante y de cualquier tercero mencionado en la
              comunicacion, asi como de las actuaciones que se desarrollen en la
              tramitacion de la misma.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 2. Quien Puede Denunciar */}
        <LegalSection
          id="quien-puede-denunciar"
          title="2. Quien Puede Denunciar"
          delay={0.2}
        >
          <p className="text-slate-300 mb-4">
            Conforme al articulo 3 de la Ley 2/2023, pueden utilizar este canal
            las siguientes personas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              <strong className="text-white">Trabajadores</strong> por cuenta
              ajena, incluyendo funcionarios y personal estatutario.
            </li>
            <li>
              <strong className="text-white">Autoempleados</strong> y
              trabajadores autonomos que presten servicios a{' '}
              {STUDIOTEK_LEGAL.tradeName}.
            </li>
            <li>
              <strong className="text-white">Accionistas, participes</strong> y
              personas pertenecientes al organo de administracion, direccion o
              supervision.
            </li>
            <li>
              <strong className="text-white">
                Proveedores, contratistas y subcontratistas.
              </strong>
            </li>
            <li>
              <strong className="text-white">Becarios y voluntarios</strong>,
              con independencia de que perciban o no remuneracion.
            </li>
            <li>
              <strong className="text-white">
                Ex-trabajadores y candidatos
              </strong>{' '}
              a un puesto de trabajo cuya relacion laboral aun no haya comenzado.
            </li>
          </ul>
          <LegalHighlight type="info">
            <p>
              Cualquier persona con relacion laboral, profesional o comercial
              con {STUDIOTEK_LEGAL.tradeName} puede utilizar este canal de
              denuncias.
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 3. Que se Puede Denunciar */}
        <LegalSection
          id="que-denunciar"
          title="3. Que se Puede Denunciar"
          delay={0.3}
        >
          <p className="text-slate-300 mb-4">
            A traves de este canal podra comunicar informaciones sobre acciones
            u omisiones que:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              Constituyan <strong className="text-white">infracciones del Derecho de la Union Europea</strong>{' '}
              en los ambitos previstos en la Directiva (UE) 2019/1937.
            </li>
            <li>
              Sean constitutivas de{' '}
              <strong className="text-white">
                infraccion penal o administrativa grave o muy grave
              </strong>
              , incluyendo las que supongan quebranto economico para la Hacienda
              Publica y la Seguridad Social.
            </li>
            <li>
              <strong className="text-white">Acoso laboral</strong> o sexual en
              el ambito de la organizacion.
            </li>
            <li>
              <strong className="text-white">Fraude, corrupcion o soborno</strong>{' '}
              en cualquiera de sus formas.
            </li>
            <li>
              <strong className="text-white">Discriminacion</strong> por razon
              de genero, raza, orientacion sexual, religion u otros motivos.
            </li>
            <li>
              Infracciones relativas a la{' '}
              <strong className="text-white">proteccion de datos</strong>,{' '}
              <strong className="text-white">seguridad laboral</strong>,{' '}
              <strong className="text-white">medio ambiente</strong> o{' '}
              <strong className="text-white">proteccion de consumidores</strong>.
            </li>
          </ul>
          <p className="text-slate-300">
            No seran admitidas comunicaciones relativas a conflictos personales
            del informante que no tengan relevancia publica, ni aquellas que
            resulten manifiestamente infundadas.
          </p>
        </LegalSection>

        {/* 4. Garantia de Confidencialidad */}
        <LegalSection
          id="confidencialidad"
          title="4. Garantia de Confidencialidad"
          delay={0.4}
        >
          <p className="text-slate-300 mb-4">
            {STUDIOTEK_LEGAL.tradeName} garantiza la mas absoluta
            confidencialidad en el tratamiento de las comunicaciones recibidas,
            conforme a lo establecido en los articulos 32 y 33 de la Ley
            2/2023:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              La <strong className="text-white">identidad del informante</strong>{' '}
              no sera comunicada a las personas afectadas por la comunicacion ni
              a terceros no autorizados.
            </li>
            <li>
              Solo tendran acceso a los datos del sistema el{' '}
              <strong className="text-white">Responsable del Sistema</strong> y,
              en su caso, el{' '}
              <strong className="text-white">
                Delegado de Proteccion de Datos (DPO)
              </strong>
              .
            </li>
            <li>
              Los datos seran tratados de acuerdo con el{' '}
              <strong className="text-white">
                Reglamento General de Proteccion de Datos (RGPD)
              </strong>{' '}
              y la{' '}
              <strong className="text-white">
                Ley Organica 3/2018 (LOPDGDD)
              </strong>
              .
            </li>
            <li>
              Se adoptaran las medidas tecnicas y organizativas adecuadas para
              preservar la identidad y garantizar la confidencialidad de los
              datos.
            </li>
          </ul>
          <p className="text-slate-300">
            Los datos personales contenidos en las comunicaciones se conservaran
            unicamente durante el tiempo imprescindible para la tramitacion del
            procedimiento y, en todo caso, por un plazo maximo de{' '}
            <strong className="text-white">10 anos</strong> conforme al
            articulo 26 de la Ley 2/2023.
          </p>
        </LegalSection>

        {/* 5. Prohibicion de Represalias */}
        <LegalSection
          id="prohibicion-represalias"
          title="5. Prohibicion de Represalias"
          delay={0.5}
        >
          <p className="text-slate-300 mb-4">
            La Ley 2/2023 prohibe expresamente cualquier forma de represalia
            contra las personas que presenten una comunicacion a traves del
            canal de denuncias. Esta proteccion se extiende durante un periodo
            minimo de <strong className="text-white">2 anos</strong> desde la
            presentacion de la comunicacion e incluye:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>
              Suspension, despido o medidas equivalentes contra el informante.
            </li>
            <li>
              Degradacion, denegacion de ascensos o modificacion sustancial de
              condiciones laborales.
            </li>
            <li>Coacciones, intimidacion, acoso u ostracismo.</li>
            <li>
              Discriminacion, trato desfavorable o inclusion en listas negras.
            </li>
            <li>Denegacion de formacion o evaluaciones negativas.</li>
            <li>
              Cancelacion de contratos, licencias o permisos.
            </li>
          </ul>
          <p className="text-slate-300 mb-4">
            En caso de represalia, se producira la{' '}
            <strong className="text-white">
              inversion de la carga de la prueba
            </strong>
            : sera la organizacion quien debera demostrar que las medidas
            adoptadas no constituyen represalia (articulo 36.3 Ley 2/2023).
          </p>
          <LegalHighlight type="warning">
            <p>
              <strong className="text-white">Atencion:</strong> Adoptar
              represalias contra un informante constituye una{' '}
              <strong className="text-white">
                infraccion muy grave
              </strong>{' '}
              sancionable con multa de hasta{' '}
              <strong className="text-white">1.000.000 EUR</strong> para
              personas juridicas, ademas de la prohibicion de obtener
              subvenciones durante 4 anos y de contratar con el sector publico
              durante 3 anos (articulos 63-65 Ley 2/2023).
            </p>
          </LegalHighlight>
        </LegalSection>

        {/* 6. Responsable del Sistema */}
        <LegalSection
          id="responsable-sistema"
          title="6. Responsable del Sistema"
          delay={0.6}
        >
          <p className="text-slate-300 mb-4">
            Conforme al articulo 8 de la Ley 2/2023,{' '}
            {STUDIOTEK_LEGAL.companyName} ha designado como Responsable del
            Sistema de informacion interna a:
          </p>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 mb-4">
            <dl className="space-y-3 text-slate-300">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[180px]">
                  Responsable:
                </dt>
                <dd>{STUDIOTEK_LEGAL.responsableSistema}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[180px]">
                  Email de contacto:
                </dt>
                <dd>
                  <a
                    href={`mailto:${STUDIOTEK_LEGAL.whistleblowerEmail}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {STUDIOTEK_LEGAL.whistleblowerEmail}
                  </a>
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-white min-w-[180px]">
                  Entidad responsable:
                </dt>
                <dd>{STUDIOTEK_LEGAL.companyName}</dd>
              </div>
            </dl>
          </div>
          <p className="text-slate-300">
            El Responsable del Sistema es el encargado de la tramitacion
            diligente de las comunicaciones recibidas, garantizando la
            confidencialidad, la imparcialidad y la ausencia de conflictos de
            interes.
          </p>
        </LegalSection>

        {/* 7. Plazos */}
        <LegalSection id="plazos" title="7. Plazos" delay={0.7}>
          <p className="text-slate-300 mb-4">
            La Ley 2/2023 establece los siguientes plazos para la gestion de
            las comunicaciones:
          </p>
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-white font-medium px-4 py-3">
                    Concepto
                  </th>
                  <th className="text-left text-white font-medium px-4 py-3">
                    Plazo
                  </th>
                  <th className="text-left text-white font-medium px-4 py-3 hidden sm:table-cell">
                    Referencia
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/50">
                  <td className="px-4 py-3">Acuse de recibo</td>
                  <td className="px-4 py-3 font-medium text-white">
                    7 dias naturales
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">Art. 9.1</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="px-4 py-3">Admision o inadmision</td>
                  <td className="px-4 py-3 font-medium text-white">
                    Plazo razonable
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">Art. 18</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="px-4 py-3">Resolucion</td>
                  <td className="px-4 py-3 font-medium text-white">
                    3 meses maximo
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">Art. 9.2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Conservacion de datos</td>
                  <td className="px-4 py-3 font-medium text-white">
                    10 anos maximo
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">Art. 26</td>
                </tr>
              </tbody>
            </table>
          </div>
        </LegalSection>

        {/* ---- Separator ---- */}
        <div className="border-t border-slate-700 my-12" />

        {/* ---- Whistleblower Form ---- */}
        <BlurFade delay={0.8} inView>
          <section id="formulario" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-3">
              Presentar una Denuncia
            </h2>
            <p className="text-slate-400 mb-8">
              Complete el formulario paso a paso. Puede realizar la denuncia de
              forma anonima o identificada.
            </p>
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
              <WhistleblowerForm />
            </div>
          </section>
        </BlurFade>

        {/* ---- Separator ---- */}
        <div className="border-t border-slate-700 my-12" />

        {/* ---- Status Check ---- */}
        <BlurFade delay={0.9} inView>
          <section id="consulta-estado" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-3">
              Consultar Estado de una Denuncia
            </h2>
            <p className="text-slate-400 mb-8">
              Introduzca el codigo de seguimiento que recibio al enviar su
              denuncia para conocer su estado actual.
            </p>
            <WhistleblowerStatus />
          </section>
        </BlurFade>

        {/* ---- Legal References ---- */}
        <BlurFade delay={1.0} inView>
          <section className="border-b border-slate-800 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Referencias Legales
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2023-4513">
                  Ley 2/2023, de 20 de febrero, reguladora de la proteccion de
                  las personas que informen sobre infracciones normativas y de
                  lucha contra la corrupcion
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/doue/2019/305/L00017-00056.pdf">
                  Directiva (UE) 2019/1937 del Parlamento Europeo y del Consejo
                  (Directiva Whistleblowing)
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/doue/2016/119/L00001-00088.pdf">
                  Reglamento (UE) 2016/679 General de Proteccion de Datos
                  (RGPD)
                </LegalExternalLink>
              </li>
              <li>
                <LegalExternalLink href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">
                  Ley Organica 3/2018 de Proteccion de Datos Personales y
                  garantia de los derechos digitales (LOPDGDD)
                </LegalExternalLink>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-slate-300 mb-2">
                <strong className="text-white">Canal externo:</strong> Si lo
                desea, tambien puede dirigirse a la Autoridad Independiente de
                Proteccion al Informante (A.A.I.):
              </p>
              <LegalExternalLink href="https://www.aai.gob.es">
                Autoridad Independiente de Proteccion al Informante (A.A.I.)
              </LegalExternalLink>
            </div>
          </section>
        </BlurFade>

        {/* Disclaimer */}
        <BlurFade delay={1.1} inView>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-8">
            <p className="text-slate-400 text-sm">
              <strong className="text-amber-400">Aviso:</strong> El contenido de
              esta pagina es de caracter informativo basado en la Ley 2/2023 y
              la normativa vigente en materia de proteccion de datos. No
              constituye asesoramiento legal vinculante. Se recomienda la
              revision por un abogado colegiado o DPO certificado para su
              adaptacion a cada caso concreto. Para consultas generales sobre el
              canal de denuncias, contacte a{' '}
              <a
                href={`mailto:${STUDIOTEK_LEGAL.whistleblowerEmail}`}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                {STUDIOTEK_LEGAL.whistleblowerEmail}
              </a>
              .
            </p>
          </div>
        </BlurFade>

        {/* Back link */}
        <BlurFade delay={1.2} inView>
          <div className="pt-8 border-t border-slate-700/50">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
