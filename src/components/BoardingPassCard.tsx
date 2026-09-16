import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Copy, 
  Check, 
  Luggage, 
  Clock, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Maximize2, 
  X,
  Bell,
  Navigation
} from 'lucide-react';
import { Transport } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '../context/TripStoreContext';

interface BoardingPassCardProps {
  transport: Transport;
  variant?: 'compact' | 'full';
  onOpenDetails?: () => void;
}

export const BoardingPassCard: React.FC<BoardingPassCardProps> = ({
  transport,
  variant = 'compact',
  onOpenDetails
}) => {
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { members } = useTripStore();

  const copyText = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedPnr(text);
    setTimeout(() => setCopiedPnr(null), 2000);
  };

  const isFlight = transport.type !== 'TREN';
  const flightStatus = transport.flightStatus || 'ON_TIME';

  // Status badge config
  const statusConfig = {
    ON_TIME: { label: 'A Tiempo', bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
    BOARDING: { label: 'Embarcando', bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
    DELAYED: { label: 'Demorado', bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' },
    SCHEDULED: { label: 'Programado', bg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' }
  }[flightStatus];

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group relative cursor-pointer select-none rounded-2xl sm:rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] backdrop-blur-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:border-[var(--city-primary)]/40 overflow-hidden"
      >
        {/* Glow corner subtle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--city-glow)] rounded-full blur-3xl opacity-30 pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--city-primary)]/10 text-[var(--city-primary)] border border-[var(--city-primary)]/20 text-xs font-black">
              {isFlight ? <Plane className="w-3.5 h-3.5" /> : <Train className="w-3.5 h-3.5" />}
              <span>{transport.company}</span>
            </span>

            <span className="font-mono text-xs font-bold text-[var(--text-primary)] px-2 py-0.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-card)]">
              {transport.number}
            </span>

            {/* Live Flight Status Badge */}
            <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${statusConfig.bg}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[var(--text-secondary)]">
            <span className="text-xs font-semibold hidden sm:inline">Día {transport.dayNumber}</span>
            <Maximize2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Check-in Alert Banner if available */}
        {(transport.checkinAvailable || transport.checkinUrl) && (
          <div 
            onClick={(e) => {
              if (transport.checkinUrl) {
                e.stopPropagation();
                window.open(transport.checkinUrl, '_blank');
              }
            }}
            className="mb-3.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Check-in Online Abierto</span>
            </div>
            {transport.checkinUrl && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold underline hover:opacity-80">
                <span>Hacer Check-in</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>
        )}

        {/* Route Row: Origin -> Flight Track -> Destination */}
        <div className="flex items-center justify-between gap-2 py-2 px-1">
          {/* Origin */}
          <div className="text-left min-w-[70px]">
            <div className="text-xl sm:text-2xl font-black font-mono text-[var(--text-primary)]">
              {(() => {
                const raw = transport.originCity || transport.departureCity || '';
                if (!raw) return '---';
                const match = raw.match(/\(([A-Z0-9]+)\)/i);
                if (match) return match[1].toUpperCase();
                return raw.includes('(') ? (raw.split('(')[1]?.replace(')', '').trim().slice(0, 3).toUpperCase() || '---') : raw.slice(0, 3).toUpperCase();
              })()}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-medium truncate max-w-[100px]">
              {(() => {
                const raw = transport.originCity || transport.departureCity || 'Origen';
                return raw.includes('(') ? raw.split('(')[0].trim() : raw;
              })()}
            </div>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[var(--city-primary)] mt-1">
              <Clock className="w-3 h-3" />
              <span>
                {transport.depTime || (transport.departureTime ? (transport.departureTime.includes('T') ? transport.departureTime.split('T')[1].slice(0, 5) : transport.departureTime) : '--:--')} h
              </span>
            </div>
          </div>

          {/* Animated Route Line */}
          <div className="flex-1 flex flex-col items-center justify-center px-3 relative">
            <span className="text-[10px] text-[var(--text-secondary)] font-mono font-semibold mb-1">
              {transport.routeSubtitle || (isFlight ? 'Vuelo Directo' : 'Tren')}
            </span>
            <div className="w-full relative flex items-center justify-center h-5">
              <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-[var(--border-card)]" />
              <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--city-primary)] text-[var(--city-primary)] shadow-sm z-10">
                {isFlight ? <Plane className="w-3 h-3" /> : <Train className="w-3 h-3" />}
              </div>
            </div>
            {transport.terminal && (
              <span className="text-[10px] font-bold text-[var(--text-secondary)] mt-1">
                T{transport.terminal} {transport.gate ? `• Puerta ${transport.gate}` : ''}
              </span>
            )}
          </div>

          {/* Destination */}
          <div className="text-right min-w-[70px]">
            <div className="text-xl sm:text-2xl font-black font-mono text-[var(--text-primary)]">
              {(() => {
                const raw = transport.destCity || transport.arrivalCity || '';
                if (!raw) return '---';
                const match = raw.match(/\(([A-Z0-9]+)\)/i);
                if (match) return match[1].toUpperCase();
                return raw.includes('(') ? (raw.split('(')[1]?.replace(')', '').trim().slice(0, 3).toUpperCase() || '---') : raw.slice(0, 3).toUpperCase();
              })()}
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-medium truncate max-w-[100px]">
              {(() => {
                const raw = transport.destCity || transport.arrivalCity || 'Destino';
                return raw.includes('(') ? raw.split('(')[0].trim() : raw;
              })()}
            </div>
            <div className="flex items-center justify-end gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <Clock className="w-3 h-3" />
              <span>
                {transport.arrTime || (transport.arrivalTime ? (transport.arrivalTime.includes('T') ? transport.arrivalTime.split('T')[1].slice(0, 5) : transport.arrivalTime) : '--:--')} h
              </span>
            </div>
          </div>
        </div>

        {/* Traveler PNRs Quick Chips */}
        <div className="mt-3 pt-3 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(transport.tickets || []).map((t, idx) => {
            const memberName = t.name || t.travelerName || '';
            const member = members.find(m => m.uid === t.travelerId || (m.name && memberName && m.name.toLowerCase() === memberName.toLowerCase()));
            const color = member?.color || '#7c3aed';
            const isCopied = copiedPnr === t.pnr;
            const displayName = memberName || member?.name || 'Viajero';
            const firstName = displayName.split(' ')[0] || displayName;

            return (
              <div
                key={idx}
                onClick={(e) => copyText(t.pnr, e)}
                className="p-2 sm:p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between gap-2 text-xs hover:border-[var(--city-primary)]/40 transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: color }} 
                  />
                  <span className="font-bold text-[var(--text-primary)] truncate">{firstName}</span>
                  {t.seat && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold px-1 rounded bg-emerald-500/10">
                      {t.seat}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 font-mono font-black text-[var(--city-primary)]">
                  <span className="text-[11px] tracking-wider">{t.pnr}</span>
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liquid Glass Detail Modal Pop-up */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg rounded-3xl bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-card)] shadow-2xl p-6 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[var(--city-primary)]/10 text-[var(--city-primary)] border border-[var(--city-primary)]/20 text-xs font-black flex items-center gap-1.5">
                    {isFlight ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />}
                    <span>{transport.company}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-[var(--text-primary)] px-2 py-0.5 rounded-lg bg-[var(--bg-canvas)] border border-[var(--border-card)]">
                    {transport.number}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold ${statusConfig.bg}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)]">
                    {transport.routeTitle || transport.route || `${transport.originCity || transport.departureCity || 'Origen'} → ${transport.destCity || transport.arrivalCity || 'Destino'}`}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Día {transport.dayNumber || transport.dayIndex || ''} de 17 • Salida {transport.depTime || (transport.departureTime ? (transport.departureTime.includes('T') ? transport.departureTime.split('T')[1].slice(0, 5) : transport.departureTime) : '--:--')} h → Llegada {transport.arrTime || (transport.arrivalTime ? (transport.arrivalTime.includes('T') ? transport.arrivalTime.split('T')[1].slice(0, 5) : transport.arrivalTime) : '--:--')} h
                  </p>
                </div>

                {/* Baggage info */}
                {transport.baggage && (
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
                    <Luggage className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[var(--text-primary)] font-bold">Franquicia de Equipaje:</strong>
                      <span className="text-[var(--text-secondary)]">{transport.baggage}</span>
                    </div>
                  </div>
                )}

                {/* Passenger tickets & PNRs */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                    Pasajeros & Localizadores
                  </span>
                  {(transport.tickets || []).map((t, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">{t.name || t.travelerName || 'Viajero'}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">Asiento: <strong className="text-emerald-500">{t.seat || 'Por asignar'}</strong></div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-[var(--city-primary)]">{t.pnr}</span>
                        <button
                          onClick={(e) => copyText(t.pnr, e)}
                          className="p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] hover:border-[var(--city-primary)]"
                        >
                          {copiedPnr === t.pnr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  {transport.checkinUrl && (
                    <a
                      href={transport.checkinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--city-primary)] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Web Check-in Aerolínea</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {transport.voucherUrl && (
                    <a
                      href={transport.voucherUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] font-bold text-xs flex items-center justify-center gap-1.5 hover:border-[var(--city-primary)] transition-all"
                    >
                      <span>Ver Voucher / PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
