'use client';

import { useState } from 'react';
import {
  Search,
  Inbox,
  ScanSearch,
  CheckCircle,
  Archive,
  Info,
} from 'lucide-react';

const TRACKING_CODE_PATTERN = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;

interface TimelineStep {
  label: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
}

export function WhistleblowerStatus() {
  const [trackingCode, setTrackingCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!trackingCode.trim()) {
      setError('Introduzca el codigo de seguimiento.');
      return;
    }
    if (!TRACKING_CODE_PATTERN.test(trackingCode.trim())) {
      setError('El formato del codigo debe ser XXX-XXXX-XXXX.');
      return;
    }
    setError('');
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const timelineSteps: TimelineStep[] = [
    {
      label: 'Recibida',
      description: 'La denuncia ha sido registrada en el sistema.',
      icon: <Inbox size={20} />,
      isActive: true,
    },
    {
      label: 'En investigacion',
      description: 'El Responsable del Sistema esta analizando los hechos.',
      icon: <ScanSearch size={20} />,
      isActive: false,
    },
    {
      label: 'Resuelta',
      description: 'La investigacion ha concluido con una resolucion.',
      icon: <CheckCircle size={20} />,
      isActive: false,
    },
    {
      label: 'Archivada',
      description: 'El expediente ha sido archivado.',
      icon: <Archive size={20} />,
      isActive: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="tracking-code" className="sr-only">
            Codigo de seguimiento
          </label>
          <input
            id="tracking-code"
            type="text"
            value={trackingCode}
            onChange={(e) => {
              setTrackingCode(e.target.value);
              if (error) setError('');
              if (hasSearched) setHasSearched(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ej: A1B-C2D3-E4F5"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-describedby={error ? 'tracking-error' : undefined}
            aria-invalid={!!error}
          />
          {error && (
            <p
              id="tracking-error"
              role="alert"
              className="text-red-400 text-sm mt-2"
            >
              {error}
            </p>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
          aria-label="Consultar estado de la denuncia"
        >
          <Search size={18} />
          Consultar Estado
        </button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-sm">
              Codigo:{' '}
              <span className="font-mono text-white">{trackingCode}</span>
            </span>
          </div>

          {/* Timeline */}
          <div
            className="space-y-0"
            role="list"
            aria-label="Estado de la denuncia"
          >
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="flex gap-4" role="listitem">
                {/* Vertical line + icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      step.isActive
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        step.isActive ? 'bg-green-600/30' : 'bg-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1.5 pb-6">
                  <p
                    className={`font-medium ${
                      step.isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Info message */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
            <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300">
              Sistema de seguimiento disponible proximamente. Para consultas,
              contacte a{' '}
              <a
                href="mailto:canal.denuncias@studiotek.es"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                canal.denuncias@studiotek.es
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
