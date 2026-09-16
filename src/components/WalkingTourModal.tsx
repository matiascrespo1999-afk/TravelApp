import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Camera, 
  CameraOff, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Compass,
  Landmark,
  Footprints,
  Sparkles,
  Map as MapIcon,
  List
} from 'lucide-react';
import { WalkingTour, WalkingTourStop } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface WalkingTourModalProps {
  tour: WalkingTour | null;
  onClose: () => void;
}

export const WalkingTourModal: React.FC<WalkingTourModalProps> = ({ tour, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'cards' | 'route'>('cards');

  if (!tour) return null;

  const stops = tour.stops || [];
  const activeStop: WalkingTourStop | undefined = stops[activeIndex];
  const isMonument = tour.tourType === 'monument';

  // Build direct Google Maps navigation URL for current stop
  const getStopMapsUrl = (stop?: WalkingTourStop) => {
    if (!stop) return tour.fullMapsUrl || '';
    if (stop.lat && stop.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.name} ${tour.cityCode}`)}`;
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-[2.5rem] bg-[var(--bg-card)] backdrop-blur-3xl border border-[var(--border-card)] shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30 flex items-center justify-center shrink-0">
                {isMonument ? <Landmark size={20} /> : <Footprints size={20} />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[var(--city-primary)]">
                    {tour.cityCode} • {isMonument ? 'Recorrido Monumental' : 'Circuito Urbano a Pie'}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    • {tour.duration} ({stops.length} paradas)
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] truncate">
                  {tour.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Tab Switcher: Ficha vs Recorrido */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs font-bold">
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'cards' 
                      ? 'bg-[var(--city-primary)] text-white shadow-xs' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <List size={13} className="inline mr-1" />
                  Paso a Paso
                </button>
                <button
                  onClick={() => setActiveTab('route')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'route' 
                      ? 'bg-[var(--city-primary)] text-white shadow-xs' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <MapIcon size={13} className="inline mr-1" />
                  Ruta & Mapa
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 text-[var(--text-primary)] border border-[var(--border-card)] flex items-center justify-center shadow-xs transition-colors"
                title="Cerrar ventana"
                aria-label="Cerrar modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Progress Indicator Bar */}
          <div className="w-full bg-[var(--border-card)]/40 h-1 shrink-0">
            <div 
              className="h-1 bg-[var(--city-primary)] transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / Math.max(1, stops.length)) * 100}%` }}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {activeTab === 'cards' ? (
              /* TAB 1: STEP-BY-STEP TOUR STOP */
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {/* Number & Room / Location Tag */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[var(--city-primary)] text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {activeIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-[var(--city-primary)] uppercase tracking-wider">
                        {activeStop?.roomOrHall || `Parada ${activeIndex + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeStop?.photoAllowed !== undefined && (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                          activeStop.photoAllowed 
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        }`}>
                          {activeStop.photoAllowed ? (
                            <>
                              <Camera size={13} />
                              <span>Fotos OK</span>
                            </>
                          ) : (
                            <>
                              <CameraOff size={13} />
                              <span>Sin Fotos</span>
                            </>
                          )}
                        </span>
                      )}

                      <a
                        href={getStopMapsUrl(activeStop)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs font-bold text-[var(--city-primary)] hover:border-[var(--city-primary)]/40 flex items-center gap-1 transition-colors"
                      >
                        <Compass size={12} />
                        <span>Abrir GPS</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Stop Title */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] leading-tight tracking-tight">
                      {activeStop?.name || `Punto ${activeIndex + 1}`}
                    </h3>
                    {activeStop?.mustSeeArtwork && (
                      <p className="text-xs font-bold text-[var(--city-primary)] mt-1">
                        ★ Clave visual imprescindible: {activeStop.mustSeeArtwork}
                      </p>
                    )}
                  </div>

                  {/* Description & Direction */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-3 shadow-xs">
                    {activeStop?.direction && (
                      <div className="text-xs text-[var(--text-secondary)] flex items-start gap-2 pb-2.5 border-b border-[var(--border-card)]">
                        <Navigation size={14} className="text-[var(--city-primary)] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--text-primary)] block">Cómo llegar:</strong>
                          <span>{activeStop.direction}</span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-normal">
                      {activeStop?.description || activeStop?.orientation || 'Avanza hacia la siguiente parada siguiendo las indicaciones del recorrido.'}
                    </p>
                  </div>

                  {/* Photo Angle Tip */}
                  {activeStop?.photoAngle && (
                    <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-start gap-2.5 text-xs">
                      <Camera size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-sky-700 dark:text-sky-300 block mb-0.5 font-bold">Ángulo Fotográfico Recomendado:</strong>
                        <span className="text-[var(--text-primary)]">{activeStop.photoAngle}</span>
                      </div>
                    </div>
                  )}

                  {/* Pop Culture / Trivia box */}
                  {activeStop?.trivia && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                      <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <strong className="text-amber-600 dark:text-amber-400 font-bold block">
                          Dato Curioso / Historia
                        </strong>
                        <p className="text-[var(--text-primary)] leading-relaxed">
                          {activeStop.trivia}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              /* TAB 2: COMPLETE ROUTE & MAP SEGMENTS */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h4 className="text-sm font-black text-[var(--text-primary)]">Mapa del Recorrido Completo</h4>
                    <p className="text-xs text-[var(--text-secondary)]">Optimizado para seguir en vivo a pie sin perderte</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {tour.mapsUrlSegment1 && (
                      <a
                        href={tour.mapsUrlSegment1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[var(--city-primary)] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90"
                      >
                        <span>Tramo 1 (Google Maps)</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {tour.mapsUrlSegment2 && (
                      <a
                        href={tour.mapsUrlSegment2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 shadow-sm hover:border-[var(--city-primary)]/50"
                      >
                        <span>Tramo 2</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stops Timeline Overview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] px-1">
                    Lista de Todas las Paradas ({stops.length})
                  </span>
                  <div className="space-y-2">
                    {stops.map((stop, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setActiveIndex(index);
                          setActiveTab('cards');
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          index === activeIndex
                            ? 'bg-[var(--city-glow)] border-[var(--city-primary)] shadow-sm'
                            : 'bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 border-[var(--border-card)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[var(--city-primary)] text-white text-xs font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-[var(--text-primary)] block">
                              {stop.name}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)]">
                              {stop.roomOrHall || `Parada ${index + 1}`}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[var(--city-primary)]">
                          Ver Detalle →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Dock Controls */}
          <div className="p-4 sm:p-5 border-t border-[var(--border-card)] bg-[var(--bg-card)] flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="px-4 py-2.5 rounded-full bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 disabled:opacity-25 disabled:pointer-events-none text-[var(--text-primary)] border border-[var(--border-card)] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>

            {/* Quick dot indicator */}
            <span className="text-xs font-bold text-[var(--text-secondary)] font-mono">
              {activeIndex + 1} / {stops.length}
            </span>

            <button
              onClick={() => setActiveIndex(prev => Math.min(stops.length - 1, prev + 1))}
              disabled={activeIndex === stops.length - 1}
              className="px-5 py-2.5 rounded-full bg-[var(--city-primary)] hover:opacity-90 disabled:opacity-25 disabled:pointer-events-none text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Siguiente</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
