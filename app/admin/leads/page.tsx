'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  budget?: string;
  message?: string;
  service_interest?: string;
  privacy_accepted: boolean;
  commercial_accepted?: boolean;
  source?: string;
  score?: number;
  classification?: string;
  metadata?: Record<string, unknown>;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_contacted_at?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationInfo;
}

// ---------------------------------------------------------------------------
// Labels & Helpers
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  qualified: 'Cualificado',
  proposal: 'Propuesta',
  customer: 'Cliente',
  lost: 'Perdido',
};

const CLASSIFICATION_OPTIONS = ['hot', 'warm', 'cold'] as const;
const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'proposal', 'customer', 'lost'] as const;

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'hace unos segundos';
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} dias`;
  return new Date(date).toLocaleDateString('es-ES');
}

function classificationColor(classification?: string): string {
  switch (classification) {
    case 'hot':
      return 'bg-[#dc2626]/20 text-[#dc2626] border border-[#dc2626]/30';
    case 'warm':
      return 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30';
    case 'cold':
      return 'bg-[#6b7280]/20 text-[#6b7280] border border-[#6b7280]/30';
    default:
      return 'bg-gray-800 text-gray-400 border border-gray-700';
  }
}

function scoreColor(score?: number): string {
  if (!score) return 'text-gray-500';
  if (score >= 70) return 'text-[#dc2626]';
  if (score >= 40) return 'text-[#f59e0b]';
  return 'text-[#6b7280]';
}

// ---------------------------------------------------------------------------
// API Key Form
// ---------------------------------------------------------------------------

function ApiKeyForm({ onSubmit }: { onSubmit: (key: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-[#111827] p-8">
        <h2 className="mb-2 text-xl font-semibold text-gray-100">
          Admin Dashboard
        </h2>
        <p className="mb-6 text-sm text-gray-400">
          Introduce tu API Key para acceder al panel de leads.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) onSubmit(value.trim());
          }}
        >
          <label htmlFor="api-key" className="mb-1 block text-sm text-gray-300">
            API Key
          </label>
          <input
            id="api-key"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="sk-..."
            className="mb-4 w-full rounded-lg border border-gray-700 bg-[#030712] px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
            autoFocus
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[#3b82f6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#111827]"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats Cards
// ---------------------------------------------------------------------------

interface StatsProps {
  leads: Lead[];
  total: number;
}

function StatsCards({ leads, total }: StatsProps) {
  const hot = leads.filter((l) => l.classification === 'hot').length;
  const warm = leads.filter((l) => l.classification === 'warm').length;
  const cold = leads.filter((l) => l.classification === 'cold').length;

  const sorted = [...leads].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
  const lastLead = sorted[0];

  const cards = [
    { label: 'Total Leads', value: total, color: 'text-[#3b82f6]' },
    { label: 'HOT', value: hot, color: 'text-[#dc2626]' },
    { label: 'WARM', value: warm, color: 'text-[#f59e0b]' },
    { label: 'COLD', value: cold, color: 'text-[#6b7280]' },
    {
      label: 'Ultimo lead',
      value: lastLead?.created_at ? timeAgo(lastLead.created_at) : '-',
      color: 'text-gray-300',
      isText: true,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-800 bg-[#111827] p-4 transition-colors hover:border-gray-700"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            {card.label}
          </p>
          <p
            className={`${card.color} ${card.isText ? 'text-sm' : 'text-2xl font-bold font-mono'}`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

interface FiltersProps {
  classification: string;
  status: string;
  search: string;
  onClassificationChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

function Filters({
  classification,
  status,
  search,
  onClassificationChange,
  onStatusChange,
  onSearchChange,
}: FiltersProps) {
  const selectClasses =
    'rounded-lg border border-gray-700 bg-[#030712] px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]';

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex gap-3">
        <select
          aria-label="Filtrar por clasificacion"
          value={classification}
          onChange={(e) => onClassificationChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Clasificacion</option>
          {CLASSIFICATION_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Estado</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <input
        type="search"
        aria-label="Buscar leads"
        placeholder="Buscar por nombre, email, empresa..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-gray-700 bg-[#030712] px-4 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] sm:max-w-xs"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lead Row (Desktop)
// ---------------------------------------------------------------------------

function LeadRow({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-gray-800 transition-colors hover:bg-gray-800/50"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <td className="px-4 py-3 text-sm font-medium text-gray-100">
        {lead.name}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {lead.company ?? '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">{lead.email}</td>
      <td className="px-4 py-3">
        {lead.score != null ? (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold ${scoreColor(lead.score)}`}
          >
            {lead.score}
          </span>
        ) : (
          <span className="text-sm text-gray-600">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        {lead.classification ? (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${classificationColor(lead.classification)}`}
          >
            {lead.classification}
          </span>
        ) : (
          <span className="text-sm text-gray-600">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {lead.status ? STATUS_LABELS[lead.status] ?? lead.status : '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {lead.created_at ? timeAgo(lead.created_at) : '-'}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Lead Card (Mobile)
// ---------------------------------------------------------------------------

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-gray-800 bg-[#111827] p-4 text-left transition-colors hover:border-gray-700"
      type="button"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-100">{lead.name}</span>
        {lead.classification && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${classificationColor(lead.classification)}`}
          >
            {lead.classification}
          </span>
        )}
      </div>
      <div className="space-y-1 text-xs text-gray-400">
        {lead.company && <p>{lead.company}</p>}
        <p>{lead.email}</p>
        <div className="flex items-center justify-between pt-1">
          <span>
            {lead.status ? STATUS_LABELS[lead.status] ?? lead.status : '-'}
          </span>
          <span className="text-gray-500">
            {lead.created_at ? timeAgo(lead.created_at) : ''}
          </span>
        </div>
        {lead.score != null && (
          <span className={`font-mono font-semibold ${scoreColor(lead.score)}`}>
            Score: {lead.score}
          </span>
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-lg bg-gray-800/50"
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LeadsDashboard() {
  const router = useRouter();

  // Auth
  const [apiKey, setApiKey] = useState<string>('');

  // Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [classification, setClassification] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore apiKey from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_api_key');
    if (stored) setApiKey(stored);
  }, []);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '20');
    if (classification) params.set('classification', classification);
    if (status) params.set('status', status);
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/leads?${params.toString()}`, {
        headers: { 'x-api-key': apiKey },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('API Key invalida. Verifica e intenta de nuevo.');
          setApiKey('');
          sessionStorage.removeItem('admin_api_key');
          return;
        }
        throw new Error(`Error ${res.status}`);
      }

      const json: LeadsResponse = await res.json();
      setLeads(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar leads');
    } finally {
      setLoading(false);
    }
  }, [apiKey, page, classification, status, search]);

  // Fetch on filter/page change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!apiKey) return;
    const interval = setInterval(fetchLeads, 30_000);
    return () => clearInterval(interval);
  }, [apiKey, fetchLeads]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [classification, status, search]);

  // Handle API key submit
  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem('admin_api_key', key);
    setApiKey(key);
  };

  // Navigate to detail
  const goToLead = (id: string) => {
    router.push(`/admin/leads/${id}`);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!apiKey) {
    return <ApiKeyForm onSubmit={handleApiKeySubmit} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Leads Dashboard</h1>
          <p className="text-sm text-gray-400">
            Gestion de leads de StudioTek
          </p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem('admin_api_key');
            setApiKey('');
          }}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-300"
          type="button"
        >
          Cerrar sesion
        </button>
      </div>

      {/* Stats */}
      <StatsCards leads={leads} total={pagination.total} />

      {/* Filters */}
      <Filters
        classification={classification}
        status={status}
        search={search}
        onClassificationChange={setClassification}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      {/* Error */}
      {error && (
        <div
          className="mb-4 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && leads.length === 0 ? (
        <TableSkeleton />
      ) : leads.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No se encontraron leads con los filtros actuales.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto rounded-xl border border-gray-800 bg-[#111827] md:block">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Empresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Clasificacion
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onClick={() => goToLead(lead.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => goToLead(lead.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-400">
                Pagina {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page >= pagination.totalPages}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading indicator for refresh */}
      {loading && leads.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-600">
          Actualizando...
        </div>
      )}
    </div>
  );
}
