'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

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

interface LeadEvent {
  id: string;
  lead_id: string;
  event_type: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
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

const BUDGET_LABELS: Record<string, string> = {
  'mas-50000': '+50.000\u20AC',
  '25000-50000': '25-50K\u20AC',
  '10000-25000': '10-25K\u20AC',
  '3000-10000': '3-10K\u20AC',
  'menos-3000': '-3.000\u20AC',
  'no-seguro': 'No definido',
};

const SERVICE_LABELS: Record<string, string> = {
  implementacion: 'Implementacion IA',
  consultoria: 'Consultoria',
  formacion: 'Formacion',
  'ia-personalizada': 'IA Personalizada',
};

const EVENT_ICONS: Record<string, string> = {
  form_submit: '\uD83D\uDCCB',
  email_sent: '\uD83D\uDCE7',
  email_opened: '\uD83D\uDC41\uFE0F',
  email_clicked: '\uD83D\uDD17',
  hot_lead_notified: '\uD83D\uDD25',
  call: '\uD83D\uDCDE',
  meeting: '\uD83E\uDD1D',
  proposal: '\uD83D\uDCC4',
  note: '\uD83D\uDCDD',
  status_change: '\uD83D\uDD04',
  lead_updated: '\u270F\uFE0F',
};

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
// API helpers
// ---------------------------------------------------------------------------

function getApiKey(): string {
  return sessionStorage.getItem('admin_api_key') ?? '';
}

async function apiPatch(
  id: string,
  body: Record<string, unknown>
): Promise<boolean> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
    },
    body: JSON.stringify(body),
  });
  return res.ok;
}

async function apiPostEvent(
  id: string,
  event_type: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const res = await fetch(`/api/leads/${id}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
    },
    body: JSON.stringify({ event_type, metadata }),
  });
  return res.ok;
}

// ---------------------------------------------------------------------------
// Action Button
// ---------------------------------------------------------------------------

interface ActionButtonProps {
  label: string;
  variant: 'blue' | 'green' | 'orange' | 'red';
  loading: boolean;
  onClick: () => void;
}

function ActionButton({ label, variant, loading, onClick }: ActionButtonProps) {
  const colors: Record<string, string> = {
    blue: 'bg-[#3b82f6] hover:bg-[#2563eb] focus:ring-[#3b82f6]',
    green: 'bg-[#10b981] hover:bg-[#059669] focus:ring-[#10b981]',
    orange: 'bg-[#f59e0b] hover:bg-[#d97706] focus:ring-[#f59e0b] text-gray-900',
    red: 'bg-[#dc2626] hover:bg-[#b91c1c] focus:ring-[#dc2626]',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712] disabled:opacity-50 ${colors[variant]}`}
      type="button"
    >
      {loading ? 'Procesando...' : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

function EventTimeline({
  events,
  expandedId,
  onToggle,
}: {
  events: LeadEvent[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No hay eventos registrados.</p>;
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 h-full w-px bg-gray-800" />

      {events.map((event, idx) => (
        <div key={event.id} className="relative flex gap-4 pb-6">
          {/* Icon */}
          <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-800 bg-[#111827] text-lg">
            {EVENT_ICONS[event.event_type] ?? '\u2022'}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">
                {event.event_type.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-gray-500">
                {event.created_at ? timeAgo(event.created_at) : ''}
              </span>
            </div>

            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <button
                onClick={() => onToggle(event.id)}
                className="mt-1 text-xs text-[#3b82f6] hover:underline"
                type="button"
              >
                {expandedId === event.id ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
            )}

            {expandedId === event.id && event.metadata && (
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-gray-800 bg-[#030712] p-3 text-xs text-gray-400">
                {JSON.stringify(event.metadata, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-800/50" />
      <div className="h-40 animate-pulse rounded-xl bg-gray-800/50" />
      <div className="h-32 animate-pulse rounded-xl bg-gray-800/50" />
      <div className="h-64 animate-pulse rounded-xl bg-gray-800/50" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<LeadEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Check auth
  useEffect(() => {
    const key = sessionStorage.getItem('admin_api_key');
    if (!key) {
      router.push('/admin/leads');
    }
  }, [router]);

  // Fetch lead + events
  const fetchData = useCallback(async () => {
    const key = getApiKey();
    if (!key || !id) return;

    setLoading(true);
    setError(null);

    try {
      const [leadRes, eventsRes] = await Promise.all([
        fetch(`/api/leads/${id}`, {
          headers: { 'x-api-key': key },
        }),
        fetch(`/api/leads/${id}/events?limit=50&offset=0`, {
          headers: { 'x-api-key': key },
        }),
      ]);

      if (!leadRes.ok) {
        throw new Error(leadRes.status === 404 ? 'Lead no encontrado' : `Error ${leadRes.status}`);
      }

      const leadJson = await leadRes.json();
      setLead(leadJson.lead ?? leadJson.data);

      if (eventsRes.ok) {
        const eventsJson = await eventsRes.json();
        setEvents(eventsJson.events ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar lead');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Action handlers
  const handleMarkContacted = async () => {
    setActionLoading(true);
    await apiPatch(id, { status: 'contacted', last_contacted_at: new Date().toISOString() });
    await apiPostEvent(id, 'status_change', { from: lead?.status, to: 'contacted' });
    await fetchData();
    setActionLoading(false);
  };

  const handleScheduleMeeting = async () => {
    const notes = prompt('Notas para la reunion:');
    if (notes === null) return;
    setActionLoading(true);
    await apiPostEvent(id, 'meeting', { notes });
    await fetchData();
    setActionLoading(false);
  };

  const handleSendProposal = async () => {
    setActionLoading(true);
    await apiPatch(id, { status: 'proposal' });
    await apiPostEvent(id, 'proposal', { from: lead?.status, to: 'proposal' });
    await fetchData();
    setActionLoading(false);
  };

  const handleMarkLost = async () => {
    const confirmed = confirm('Seguro que quieres marcar este lead como perdido?');
    if (!confirmed) return;
    setActionLoading(true);
    await apiPatch(id, { status: 'lost' });
    await apiPostEvent(id, 'status_change', { from: lead?.status, to: 'lost' });
    await fetchData();
    setActionLoading(false);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-red-400">{error}</p>
        <button
          onClick={() => router.push('/admin/leads')}
          className="text-sm text-[#3b82f6] hover:underline"
          type="button"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push('/admin/leads')}
        className="mb-6 flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-200"
        type="button"
      >
        <span aria-hidden="true">&larr;</span> Volver a leads
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-100">{lead.name}</h1>
            {lead.score != null && (
              <span
                className={`font-mono text-lg font-bold ${scoreColor(lead.score)}`}
              >
                {lead.score}
              </span>
            )}
            {lead.classification && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${classificationColor(lead.classification)}`}
              >
                {lead.classification}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {lead.company && <span>{lead.company}</span>}
            {lead.status && (
              <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs">
                {STATUS_LABELS[lead.status] ?? lead.status}
              </span>
            )}
            {lead.created_at && (
              <span className="text-gray-500">{timeAgo(lead.created_at)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact info */}
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Datos de contacto
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-gray-500">Email</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm text-[#3b82f6] hover:underline"
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Telefono</p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-sm text-[#3b82f6] hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.budget && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Presupuesto</p>
                  <p className="text-sm text-gray-200">
                    {BUDGET_LABELS[lead.budget] ?? lead.budget}
                  </p>
                </div>
              )}
              {lead.service_interest && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Servicio</p>
                  <p className="text-sm text-gray-200">
                    {SERVICE_LABELS[lead.service_interest] ?? lead.service_interest}
                  </p>
                </div>
              )}
              {lead.source && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Fuente</p>
                  <p className="text-sm text-gray-200">{lead.source}</p>
                </div>
              )}
              {lead.last_contacted_at && (
                <div>
                  <p className="mb-1 text-xs text-gray-500">Ultimo contacto</p>
                  <p className="text-sm text-gray-200">
                    {timeAgo(lead.last_contacted_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Mensaje
              </h2>
              <blockquote className="border-l-2 border-gray-700 pl-4 text-sm leading-relaxed text-gray-300 italic">
                {lead.message}
              </blockquote>
            </div>
          )}

          {/* Metadata */}
          {lead.metadata && Object.keys(lead.metadata).length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Metadata
              </h2>
              <pre className="max-h-64 overflow-auto rounded-lg bg-[#030712] p-4 text-xs text-gray-400">
                {JSON.stringify(lead.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Acciones
            </h2>
            <div className="flex flex-wrap gap-3">
              <ActionButton
                label="Marcar contactado"
                variant="blue"
                loading={actionLoading}
                onClick={handleMarkContacted}
              />
              <ActionButton
                label="Agendar reunion"
                variant="green"
                loading={actionLoading}
                onClick={handleScheduleMeeting}
              />
              <ActionButton
                label="Enviar propuesta"
                variant="orange"
                loading={actionLoading}
                onClick={handleSendProposal}
              />
              <ActionButton
                label="Marcar perdido"
                variant="red"
                loading={actionLoading}
                onClick={handleMarkLost}
              />
            </div>
          </div>
        </div>

        {/* Right column - Timeline */}
        <div>
          <div className="rounded-xl border border-gray-800 bg-[#111827] p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Timeline
            </h2>
            <EventTimeline
              events={events}
              expandedId={expandedEvent}
              onToggle={(eventId) =>
                setExpandedEvent((prev) => (prev === eventId ? null : eventId))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
