'use client';

import { COOKIES_CONFIG, CookieCategory, CookieInfo } from '@/lib/cookie-config';

interface CookieDetailsListProps {
  category?: CookieCategory;
  compact?: boolean;
}

function CookieRow({ cookie, compact }: { cookie: CookieInfo; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 text-xs text-slate-400 border-b border-slate-700/30 last:border-b-0">
        <span className="font-mono">{cookie.name}</span>
        <span>{cookie.duration}</span>
      </div>
    );
  }

  return (
    <tr className="border-b border-slate-700/30 last:border-b-0">
      <td className="py-2 pr-4 font-mono text-sm text-slate-300">{cookie.name}</td>
      <td className="py-2 pr-4 text-sm text-slate-400">{cookie.provider}</td>
      <td className="py-2 pr-4 text-sm text-slate-400">{cookie.purpose}</td>
      <td className="py-2 text-sm text-slate-400">{cookie.duration}</td>
    </tr>
  );
}

function CategorySection({
  category,
  config,
  compact
}: {
  category: CookieCategory;
  config: typeof COOKIES_CONFIG[CookieCategory];
  compact?: boolean;
}) {
  if (config.cookies.length === 0) {
    return compact ? null : (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">{config.name}</h3>
        <p className="text-sm text-slate-400 mb-3">{config.description}</p>
        <p className="text-sm text-slate-500 italic">No hay cookies configuradas en esta categoria.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-slate-900/50 rounded-lg p-3">
        {config.cookies.map((cookie) => (
          <CookieRow key={cookie.name} cookie={cookie} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-2">
        {config.name}
        {config.required && (
          <span className="ml-2 text-xs text-slate-500">(Requeridas)</span>
        )}
      </h3>
      <p className="text-sm text-slate-400 mb-3">{config.description}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="py-2 pr-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Finalidad
              </th>
              <th className="py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Duracion
              </th>
            </tr>
          </thead>
          <tbody>
            {config.cookies.map((cookie) => (
              <CookieRow key={cookie.name} cookie={cookie} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CookieDetailsList({ category, compact = false }: CookieDetailsListProps) {
  // Si se especifica una categoria, mostrar solo esa
  if (category) {
    return (
      <CategorySection
        category={category}
        config={COOKIES_CONFIG[category]}
        compact={compact}
      />
    );
  }

  // Mostrar todas las categorias
  const categories: CookieCategory[] = ['technical', 'analytics', 'marketing'];

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {categories.map((cat) => (
        <CategorySection
          key={cat}
          category={cat}
          config={COOKIES_CONFIG[cat]}
          compact={compact}
        />
      ))}
    </div>
  );
}
