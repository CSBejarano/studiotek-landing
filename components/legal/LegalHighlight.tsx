interface LegalHighlightProps {
  /** Tipo de recuadro: info (azul) o warning (ambar) */
  type: 'info' | 'warning';
  /** Titulo opcional del recuadro */
  title?: string;
  /** Contenido del recuadro */
  children: React.ReactNode;
}

const highlightStyles = {
  info: 'bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg p-4',
  warning: 'bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4',
} as const;

/**
 * Recuadro destacado para paginas legales.
 * Usado para resumenes "En pocas palabras: ..." y avisos importantes.
 */
export function LegalHighlight({ type, title, children }: LegalHighlightProps) {
  return (
    <div className={highlightStyles[type]}>
      {title && (
        <p className="font-semibold text-white mb-2">{title}</p>
      )}
      <div className="text-slate-300">{children}</div>
    </div>
  );
}
