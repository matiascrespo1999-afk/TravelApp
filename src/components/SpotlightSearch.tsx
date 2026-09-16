import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Plane, 
  Hotel, 
  Ticket, 
  Footprints, 
  Clock, 
  ExternalLink, 
  Key, 
  X,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { WalkingTour, Accommodation, Transport } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWalkingTour?: (tour: WalkingTour) => void;
  onSelectDay?: (day: number) => void;
  onSelectTransport?: (transportId: string) => void;
  onSelectHotel?: (hotelId: string) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onSelectWalkingTour,
  onSelectDay,
  onSelectTransport,
  onSelectHotel
}) => {
  const [query, setQuery] = useState('');
  const { activities, transports, accommodations, vouchers, walkingTours, internalTours, itinerary } = useTripStore();

  const transportList = Object.values(transports || {}) as Transport[];
  const accommodationList = Object.values(accommodations || {}) as Accommodation[];
  const toursList = [
    ...(Object.values(walkingTours || {}) as WalkingTour[]),
    ...(Object.values(internalTours || {}) as WalkingTour[])
  ];

  // Keyboard shortcut listener for ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = (query || '').toLowerCase().trim();
  const matches = (val?: any) => val ? String(val).toLowerCase().includes(cleanQuery) : false;

  // Filter activities
  const matchingActivities = cleanQuery ? (activities || []).filter(a => 
    matches(a?.title) ||
    matches(a?.notes) ||
    matches(a?.insiderSecret) ||
    matches(a?.photoAngle) ||
    matches(a?.locationName)
  ).slice(0, 5) : [];

  // Filter transports by company, number or traveler PNR
  const matchingTransports = cleanQuery ? (transportList || []).filter(t => 
    matches(t?.company) ||
    matches(t?.number) ||
    matches(t?.flightNumber) ||
    matches(t?.originCity) ||
    matches(t?.departureCity) ||
    matches(t?.destCity) ||
    matches(t?.arrivalCity) ||
    (t?.tickets || []).some(tick => matches(tick?.pnr) || matches(tick?.travelerName) || matches(tick?.name))
  ).slice(0, 4) : [];

  // Filter accommodations by name, address or PIN
  const matchingHotels = cleanQuery ? (accommodationList || []).filter(h => 
    matches(h?.name) ||
    matches(h?.cityName) ||
    matches(h?.doorPin) ||
    matches(h?.address)
  ).slice(0, 4) : [];

  // Filter vouchers by title, code or provider
  const matchingVouchers = cleanQuery ? (vouchers || []).filter(v => 
    matches(v?.title) ||
    matches(v?.bookingCode) ||
    matches(v?.provider)
  ).slice(0, 4) : [];

  // Filter tours (street and monument works of art)
  const matchingTours = cleanQuery ? (toursList || []).filter(t => 
    matches(t?.title) ||
    (t?.stops || []).some(s => matches(s?.name) || matches(s?.mustSeeArtwork) || matches(s?.trivia) || matches(s?.description))
  ).slice(0, 4) : [];

  // Filter itinerary days
  const matchingDays = cleanQuery ? (itinerary || []).filter(d => 
    matches(`día ${d.day}`) ||
    matches(d.city) ||
    matches(d.cityCode) ||
    matches(d.dateLabel)
  ).slice(0, 3) : [];

  const totalResults = matchingActivities.length + matchingTransports.length + matchingHotels.length + matchingVouchers.length + matchingTours.length + matchingDays.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 pt-14 sm:pt-20"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-2xl rounded-3xl bg-[var(--bg-card)] backdrop-blur-3xl border border-[var(--border-card)] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-card)] flex items-center gap-3 relative">
          <Search className="w-5 h-5 text-[var(--city-primary)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar PNR, PIN de hotel, obra de arte, vuelo o día..."
            className="w-full bg-transparent text-base sm:text-lg font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 border border-[var(--border-card)] text-[var(--text-secondary)] rounded-xl transition-colors ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!cleanQuery ? (
            <div className="py-12 text-center space-y-2 text-[var(--text-secondary)]">
              <Sparkles className="w-8 h-8 mx-auto text-[var(--city-primary)] opacity-80" />
              <p className="text-sm font-bold text-[var(--text-primary)]">Buscador Global Spotlight</p>
              <p className="text-xs max-w-xs mx-auto">
                Escribe un PNR (ej: CRPGEF), nombre de obra (ej: Guernica, Meninas), PIN de acceso o día.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)] text-sm">
              No se encontraron coincidencias para "{query}".
            </div>
          ) : (
            <>
              {/* Days Results */}
              {matchingDays.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--city-primary)] px-1">
                    Días del Itinerario ({matchingDays.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingDays.map(d => (
                      <div
                        key={d.day}
                        onClick={() => {
                          onSelectDay?.(Number(d.day));
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/50 border border-[var(--border-card)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-[var(--city-primary)]" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              Día {d.day}: {d.city}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              {d.dateLabel || d.date}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[var(--city-primary)]">Ver Día →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transports Results */}
              {matchingTransports.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--city-primary)] px-1">
                    Vuelos & Trenes ({matchingTransports.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingTransports.map(tr => (
                      <div
                        key={tr.id}
                        onClick={() => {
                          onSelectTransport?.(tr.id);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/50 border border-[var(--border-card)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Plane className="w-4 h-4 text-[var(--city-primary)]" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              {tr.company} {tr.number || tr.flightNumber || ''}: {tr.originCity || tr.departureCity || 'Origen'} ➔ {tr.destCity || tr.arrivalCity || 'Destino'}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              Día {tr.dayNumber || tr.dayIndex || ''} · Salida: {tr.depTime || (tr.departureTime ? (tr.departureTime.includes('T') ? tr.departureTime.split('T')[1].slice(0, 5) : tr.departureTime) : '--:--')} h
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black text-[var(--city-primary)]">
                            {(tr.tickets || []).map(t => `${((t.name || t.travelerName || 'Viajero') as string).split(' ')[0]}: ${t.pnr || '---'}`).join(' | ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodations Results */}
              {matchingHotels.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--city-primary)] px-1">
                    Alojamientos & PINs ({matchingHotels.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingHotels.map(h => (
                      <div
                        key={h.id}
                        onClick={() => {
                          onSelectHotel?.(h.id);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/50 border border-[var(--border-card)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Hotel className="w-4 h-4 text-[var(--city-primary)]" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              {h.name} ({h.cityName})
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] truncate max-w-sm block">
                              {h.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--city-glow)] text-[var(--city-primary)] font-mono text-xs font-bold border border-[var(--city-primary)]/30">
                          <Key className="w-3 h-3" />
                          <span>PIN: {h.doorPin}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Walking Tours & Artworks Results */}
              {matchingTours.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-1">
                    Recorridos & Obras de Arte ({matchingTours.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingTours.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectWalkingTour?.(t);
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-[var(--bg-canvas)] hover:border-emerald-500/50 border border-[var(--border-card)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Footprints className="w-4 h-4 text-emerald-500" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              {t.title}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              {t.cityCode} · {t.stops?.length || 0} paradas · {t.duration}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Ver Tour →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Results */}
              {matchingActivities.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-1">
                    Actividades del Itinerario ({matchingActivities.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchingActivities.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onSelectDay?.(Number(a.day));
                          onClose();
                        }}
                        className="p-3 rounded-2xl bg-[var(--bg-canvas)] hover:border-sky-500/50 border border-[var(--border-card)] cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-sky-500" />
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              {a.title}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              Día {a.day} · {a.time} h {a.locationName ? `· ${a.locationName}` : ''}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Día {a.day} →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
