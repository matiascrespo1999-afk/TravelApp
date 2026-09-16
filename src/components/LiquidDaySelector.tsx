import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LiquidDaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  className?: string;
}

const CITIES_METADATA: Record<string, { name: string; flag: string; code: string }> = {
  ROMA: { name: 'Roma', flag: '🇮🇹', code: 'ROMA' },
  LONDRES: { name: 'Londres', flag: '🇬🇧', code: 'LONDRES' },
  OXFORD: { name: 'Oxford', flag: '🇬🇧', code: 'OXFORD' },
  BARCELONA: { name: 'Barcelona', flag: '🇪🇸', code: 'BARCELONA' },
  MADRID: { name: 'Madrid', flag: '🇪🇸', code: 'MADRID' },
  TRANSITO: { name: 'En Tránsito', flag: '✈️', code: 'TRANSITO' }
};

const DEFAULT_DAYS = Array.from({ length: 17 }, (_, i) => {
  const dayNum = i + 1;
  let code = 'ROMA';
  if (dayNum <= 4) code = 'ROMA';
  else if (dayNum <= 8) code = 'LONDRES';
  else if (dayNum <= 12) code = 'BARCELONA';
  else code = 'MADRID';

  // May 10, 2026 is Day 1
  const d = new Date(Date.UTC(2026, 4, 10 + i));
  const dateStr = d.toISOString().split('T')[0];
  const dateLabel = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

  return {
    day: dayNum,
    dayIndex: dayNum,
    cityCode: code,
    city: CITIES_METADATA[code]?.name || code,
    date: dateStr,
    dateLabel
  };
});

export const LiquidDaySelector: React.FC<LiquidDaySelectorProps> = ({
  selectedDay,
  onSelectDay,
  className = ''
}) => {
  const store = useTripStore();
  const [viewMode, setViewMode] = useState<'ribbon' | 'grid'>('ribbon');
  const [isFlipping, setIsFlipping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedPillRef = useRef<HTMLButtonElement>(null);

  // Merge store itinerary days with default fallback structure
  const days = React.useMemo(() => {
    if (store.itinerary && store.itinerary.length > 0) {
      return store.itinerary.map(item => ({
        day: Number(item.day || item.dayIndex),
        dayIndex: Number(item.dayIndex || item.day),
        cityCode: item.cityCode || 'ROMA',
        city: item.city || CITIES_METADATA[item.cityCode || 'ROMA']?.name || 'Destino',
        date: item.date,
        dateLabel: item.dateLabel || item.date
      }));
    }
    return DEFAULT_DAYS;
  }, [store.itinerary]);

  const currentDay = days.find(d => Number(d.day) === Number(selectedDay)) || days[0];

  // Auto-scroll selected day capsule into view with smooth trackpad alignment
  useEffect(() => {
    if (selectedPillRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = selectedPillRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const offsetLeft = element.offsetLeft;
      const scrollTarget = offsetLeft - container.clientWidth / 2 + element.clientWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth'
      });
    }
  }, [selectedDay, viewMode]);

  // Trackpad / mousewheel horizontal translation
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
      // Smoothly scroll horizontally when using standard mouse wheel
      scrollRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  const handlePrev = () => {
    if (selectedDay > 1) onSelectDay(selectedDay - 1);
  };

  const handleNext = () => {
    if (selectedDay < days.length) onSelectDay(selectedDay + 1);
  };

  const toggleViewWith360Flip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode(prev => (prev === 'ribbon' ? 'grid' : 'ribbon'));
      setTimeout(() => setIsFlipping(false), 300);
    }, 180);
  };

  const getCityFlag = (code?: string) => {
    return CITIES_METADATA[code || '']?.flag || '📍';
  };

  return (
    <div className={`w-full my-3 select-none ${className}`}>
      {/* Dynamic 360 Flip 3D Perspective Card Container */}
      <div style={{ perspective: 1200 }}>
        <motion.div
          animate={{
            rotateY: isFlipping ? 180 : 0,
            scale: isFlipping ? 0.94 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20
          }}
          className="relative w-full rounded-3xl p-3 sm:p-4 bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-card)] shadow-xl overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle Ambient Refraction Behind Capsule */}
          <div 
            className="absolute -top-10 left-1/3 w-64 h-24 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: 'var(--city-primary)' }}
          />

          {/* Top Control Header: Current Day summary + 360 Flip view switch */}
          <div className="flex items-center justify-between gap-3 mb-3 px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={selectedDay <= 1}
                aria-label="Día anterior"
                className="w-8 h-8 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] hover:border-[var(--city-primary)]/50 active:scale-90 disabled:opacity-25 disabled:pointer-events-none text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-lg filter drop-shadow-xs">
                  {getCityFlag(currentDay?.cityCode)}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
                    <span>Día {selectedDay}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[var(--city-primary)] font-bold">{currentDay?.city}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-mono">
                    {currentDay?.dateLabel}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={selectedDay >= days.length}
                aria-label="Día siguiente"
                className="w-8 h-8 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] hover:border-[var(--city-primary)]/50 active:scale-90 disabled:opacity-25 disabled:pointer-events-none text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 360 View Mode Flip Button */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] font-medium text-[var(--text-secondary)]">
                {viewMode === 'ribbon' ? 'Carrusel Trackpad' : 'Grilla Completa'}
              </span>

              <motion.button
                whileHover={{ scale: 1.08, rotate: 15 }}
                whileTap={{ scale: 0.9, rotate: 360 }}
                onClick={toggleViewWith360Flip}
                title={viewMode === 'ribbon' ? 'Ver grilla completa de 17 días' : 'Ver carrusel horizontal'}
                className="p-2 rounded-2xl bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30 hover:border-[var(--city-primary)] shadow-sm cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <RefreshCw size={14} className={isFlipping ? 'animate-spin' : ''} />
                {viewMode === 'ribbon' ? <LayoutGrid size={14} /> : <List size={14} />}
              </motion.button>
            </div>
          </div>

          {/* VIEW 1: HORIZONTAL LIQUID RIBBON (Apple Trackpad & Drag Carousel) */}
          {viewMode === 'ribbon' ? (
            <div 
              ref={scrollRef}
              onWheel={handleWheel}
              tabIndex={0}
              role="region"
              aria-label="Carrusel de días del viaje"
              className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 no-scrollbar cursor-grab active:cursor-grabbing focus:outline-none"
              style={{ scrollBehavior: 'smooth' }}
            >
              {days.map((item) => {
                const isSelected = Number(item.day) === Number(selectedDay);
                const flag = getCityFlag(item.cityCode);

                return (
                  <motion.button
                    key={item.day}
                    ref={isSelected ? selectedPillRef : null}
                    onClick={() => onSelectDay(Number(item.day))}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    className={`shrink-0 py-2 px-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-0.5 min-w-[72px] text-center cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[var(--city-primary)] text-white border-[var(--city-primary)] shadow-lg shadow-[var(--city-primary)]/25 ring-2 ring-[var(--city-primary)]/30'
                        : 'bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-card)]'
                    }`}
                  >
                    {/* Top flag + day */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{flag}</span>
                      <span className={`text-[11px] font-black tracking-tight ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        Día {item.day}
                      </span>
                    </div>

                    {/* City code/name */}
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/90' : 'text-[var(--text-secondary)]'}`}>
                      {item.cityCode}
                    </span>

                    {/* Date label */}
                    <span className={`text-[8px] font-mono whitespace-nowrap ${isSelected ? 'text-white/80' : 'opacity-60'}`}>
                      {typeof item.dateLabel === 'string' ? item.dateLabel.split(' ')[0] : (item.date ? String(item.date).slice(5) : '')}
                    </span>

                    {/* Active highlight dot */}
                    {isSelected && (
                      <motion.div 
                        layoutId="activeDayGlow"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-white shadow-xs"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* VIEW 2: FULL BENTO MATRIX GRID (All 17 Days) */
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 pb-1">
              {days.map((item) => {
                const isSelected = Number(item.day) === Number(selectedDay);
                const flag = getCityFlag(item.cityCode);

                return (
                  <motion.button
                    key={item.day}
                    onClick={() => {
                      onSelectDay(Number(item.day));
                      toggleViewWith360Flip();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[var(--city-primary)] text-white border-[var(--city-primary)] shadow-md'
                        : 'bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 text-[var(--text-primary)] border-[var(--border-card)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black">D{item.day}</span>
                      <span className="text-sm">{flag}</span>
                    </div>
                    <div className={`text-[11px] font-bold truncate ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                      {item.city}
                    </div>
                    <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-white/80' : 'text-[var(--text-secondary)]'}`}>
                      {item.dateLabel || item.date}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
