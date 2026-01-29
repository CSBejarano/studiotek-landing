import { ExternalLink } from 'lucide-react';

interface LegalExternalLinkProps {
  /** URL del enlace externo (BOE, AEPD, EUR-Lex, etc.) */
  href: string;
  /** Texto del enlace */
  children: React.ReactNode;
}

/**
 * Link externo para paginas legales.
 * Abre en nueva pestana con icono ExternalLink de lucide-react.
 */
export function LegalExternalLink({ href, children }: LegalExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
    >
      {children}
      <ExternalLink size={16} aria-hidden="true" />
    </a>
  );
}
