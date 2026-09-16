import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Clock, CheckCircle2, AlertTriangle, Shirt, Backpack, 
  Camera, Footprints, Compass, Coins, Sparkles, ShieldAlert, Headphones, 
  ExternalLink, Key, Plane, Search, Leaf, Building2, Landmark,
  ChevronLeft, ChevronRight, ChevronDown, Train, Utensils, Info, Check, HelpCircle,
  Ticket
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { Activity, WalkingTour, CityCode } from '../types';
import { ABMMenu } from './ABMMenu';
import { LiquidDaySelector } from './LiquidDaySelector';
import { BoardingPassCard } from './BoardingPassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface ItineraryViewProps {
  onOpenWalkingTour: (tour: WalkingTour) => void;
  onOpenTransport: (transportId?: string) => void;
  onOpenAccommodation: (hotelId?: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  onOpenWalkingTour,
  onOpenTransport,
  onOpenAccommodation
}) => {
  const store = useTripStore();
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const saved = localStorage.getItem('last_opened_day');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBackpack, setShowBackpack] = useState(false);

  // Auto-day logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tripDay = store.itinerary.find(d => d.date === today);
    if (tripDay) {
      setSelectedDay(Number(tripDay.day));
    }
  }, [store.itinerary]);

  useEffect(() => {
    localStorage.setItem('last_opened_day', selectedDay.toString());
  }, [selectedDay]);

  const rawDayData = store.getDayData(selectedDay);
  
  // Robust fallback: if dayData.activities is empty, query store.activities directly
  const dayActivities = React.useMemo(() => {
    if (rawDayData?.activities && rawDayData.activities.length > 0) {
      return rawDayData.activities;
    }
    return (store.activities || [])
      .filter(a => Number(a.day) === Number(selectedDay))
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [rawDayData?.activities, store.activities, selectedDay]);

  const dayData = rawDayData ? { ...rawDayData, activities: dayActivities } : null;

  // Parse backpack checklist safely
  const backpackItems: string[] = React.useMemo(() => {
    if (!dayData?.backpackChecklist) return [];
    if (Array.isArray(dayData.backpackChecklist)) {
      return dayData.backpackChecklist.map((i: any) => String(i).trim()).filter(Boolean);
    }
    if (typeof dayData.backpackChecklist === 'string') {
      return dayData.backpackChecklist.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  }, [dayData?.backpackChecklist]);

  // Theme auto-update based on day
  useEffect(() => {
    if (dayData && dayData.cityCode) {
      store.setThemeCity(dayData.cityCode as CityCode);
    }
  }, [selectedDay, dayData?.cityCode]);

  // Tours available for this day's city
  const allWalkingTours: WalkingTour[] = Array.isArray(store.walkingTours)
    ? store.walkingTours
    : Object.values(store.walkingTours || {});

  const cityTours = allWalkingTours.filter(t => 
    t.cityCode === dayData?.cityCode || 
    (dayData?.cityCode === 'ROMA' && t.cityCode === 'ROMA') ||
    (dayData?.cityCode === 'LONDRES' && (t.cityCode === 'LONDRES' || t.cityCode === 'OXFORD')) ||
    (dayData?.cityCode === 'BCN' && (t.cityCode === 'BARCELONA' || t.cityCode === 'BCN' || t.cityCode === 'GIRONA')) ||
    (dayData?.cityCode === 'BARCELONA' && (t.cityCode === 'BARCELONA' || t.cityCode === 'BCN' || t.cityCode === 'GIRONA')) ||
    (dayData?.cityCode === 'MADRID' && (t.cityCode === 'MADRID' || t.cityCode === 'TOLEDO'))
  );

  const filteredActivities = (dayActivities || []).filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const term = (searchTerm || '').toLowerCase().trim();
    const actTitle = (activity?.title || '').toLowerCase();
    const actLoc = (activity?.locationName || '').toLowerCase();
    const actNotes = (activity?.notes || '').toLowerCase();
    const matchesSearch = !term || 
      actTitle.includes(term) ||
      actLoc.includes(term) ||
      actNotes.includes(term);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      
      {/* 1. APPLE LIQUID GLASS CENTERED DAY SELECTOR CAPSULE */}
      <LiquidDaySelector
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {dayData && (
        <motion.div 
          key={selectedDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* 2. DAY HERO BANNER (Summary, Weather, Dress code, Hotel PIN) */}
          <div className="relative overflow-hidden rounded-[2rem] glass-panel border border-[var(--border-card)] p-5 sm:p-6 shadow-xl">
            <div 
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-25 pointer-events-none" 
              style={{ background: 'var(--city-primary)' }}
            />
            
            <div className="relative z-10 space-y-4">
              {/* Top row: City pill, Date, Weather */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30 flex items-center gap-1.5 shadow-sm">
                    <MapPin size={13} />
                    <span>{dayData.city}</span>
                  </span>
                  <span className="text-xs font-bold text-[var(--text-secondary)]">
                    {dayData.dateLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[var(--text-primary)] border border-[var(--border-card)]">
                  <span>🌤️</span>
                  <span>{dayData.weather || '22°C • Clima templado'}</span>
                </div>
              </div>

              {/* Day title & summary */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                  {dayData.dayTitle || dayData.summary}
                </h2>
                {dayData.summary && dayData.summary !== dayData.dayTitle && (
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {dayData.summary}
                  </p>
                )}
              </div>

              {/* Logistical Quick Tags */}
              <div className="pt-2 border-t border-[var(--border-card)] grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                
                {/* Hotel & Door PIN */}
                {dayData.accommodation ? (
                  <div 
                    onClick={() => onOpenAccommodation(dayData.accommodation?.id)}
                    className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between cursor-pointer hover:border-[var(--city-primary)] transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-purple-400 block">Hotel & PIN</span>
                      <span className="font-bold text-[var(--text-primary)] truncate block text-xs">
                        {dayData.accommodation.name}
                      </span>
                    </div>
                    {dayData.accommodation.doorPin && (
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        PIN: {dayData.accommodation.doorPin}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-secondary)]">
                    <Building2 size={16} />
                    <span>Alojamiento continuado</span>
                  </div>
                )}

                {/* Transport of the day */}
                {dayData.transport ? (
                  <div 
                    onClick={() => onOpenTransport(dayData.transport?.id)}
                    className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between cursor-pointer hover:border-sky-400 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] uppercase font-bold text-sky-400 block">Transporte Crítico</span>
                      <span className="font-bold text-[var(--text-primary)] truncate block text-xs">
                        {dayData.transport.company} ({dayData.transport.depTime})
                      </span>
                    </div>
                    <Plane size={15} className="text-sky-400 shrink-0" />
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-secondary)]">
                    <Footprints size={16} />
                    <span>Desplazamientos urbanos</span>
                  </div>
                )}

                {/* Backpack checklist button */}
                <button
                  onClick={() => setShowBackpack(!showBackpack)}
                  className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between hover:border-emerald-400 transition-all text-left"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Mochila ({backpackItems.length})</span>
                    <span className="font-bold text-[var(--text-primary)] truncate block text-xs">
                      {backpackItems[0] || 'Artículos esenciales'}
                    </span>
                  </div>
                  <Backpack size={16} className="text-emerald-400 shrink-0" />
                </button>

              </div>

              {/* Backpack Checklist Accordion */}
              <AnimatePresence>
                {showBackpack && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Backpack size={14} />
                          <span>Checklist para la Mochila de este Día</span>
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {dayData.dressCode || 'Ropa cómoda y zapatillas'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[var(--text-primary)]">
                        {backpackItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Boarding Pass if day has critical transport */}
          {dayData.transport && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--city-primary)] px-1">
                Pase de Embarque del Día
              </span>
              <BoardingPassCard transport={dayData.transport} />
            </div>
          )}

          {/* 3. SEARCH & CATEGORY FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Buscar actividades, lugares, metros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--city-primary)] shadow-sm transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['all', 'Vuelo', 'Tren', 'Museo', 'Paseo'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    filterType === type 
                      ? 'bg-[var(--city-primary)] text-white shadow-md' 
                      : 'bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-card)]'
                  }`}
                >
                  {type === 'all' ? 'Todos' : type}
                </button>
              ))}
            </div>
          </div>

          {/* 4. CHRONOLOGICAL ACTIVITIES LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Cronograma Detallado ({filteredActivities.length} de {dayActivities.length} actividades)
              </span>
            </div>

            {filteredActivities.length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 text-center space-y-2 border border-[var(--border-card)]">
                <Clock className="w-8 h-8 text-[var(--city-primary)] mx-auto opacity-70" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  No se encontraron actividades con ese filtro
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Prueba cambiando la búsqueda o seleccionando "Todos".
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActivities.map((activity, index) => (
                  <ExpandableActivityCard
                    key={activity.id || index}
                    activity={activity}
                    onOpenWalkingTour={onOpenWalkingTour}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 5. WALKING TOURS FOR THIS CITY (If any) */}
          {cityTours.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Footprints size={16} className="text-[var(--city-primary)]" />
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
                  Circuitos a Pie Recomendados en {dayData.city}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cityTours.map(tour => (
                  <div
                    key={tour.id}
                    onClick={() => onOpenWalkingTour(tour)}
                    className="glass-panel p-4 rounded-3xl border border-[var(--border-card)] hover:border-[var(--city-primary)] cursor-pointer transition-all shadow-sm flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)] group-hover:text-[var(--city-primary)] transition-colors">
                        {tour.title}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {tour.duration || '2-3 horas'} • {tour.distance || 'Paseo escénico'}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-[var(--city-glow)] text-[var(--city-primary)] shrink-0">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
};

// Sub-component for individual activity cards with rich inline data
const ExpandableActivityCard: React.FC<{
  activity: Activity;
  onOpenWalkingTour: (tour: WalkingTour) => void;
}> = ({ activity, onOpenWalkingTour }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const store = useTripStore();
  
  const walkingTour = activity.walkingTourId ? store.getTourById(activity.walkingTourId) : null;
  const internalTour = activity.internalTourId ? store.getTourById(activity.internalTourId) : null;

  const getActivityIcon = () => {
    const title = (activity?.title || '').toLowerCase();
    const type = (activity?.type || '').toLowerCase();

    if (title.includes('vuelo') || type.includes('flight') || type === 'traslado' || type.includes('transit')) {
      return <Plane size={20} className="text-sky-400" />;
    }
    if (title.includes('tren') || type.includes('train')) {
      return <Train size={20} className="text-emerald-400" />;
    }
    if (type.includes('food') || title.includes('cena') || title.includes('almuerzo') || title.includes('gastronomía')) {
      return <Utensils size={20} className="text-amber-400" />;
    }
    if (activity.internalTourId || title.includes('museo') || title.includes('coliseo') || title.includes('vaticano') || title.includes('prado')) {
      return <Landmark size={20} className="text-[var(--city-primary)]" />;
    }
    if (activity.walkingTourId || title.includes('tour') || title.includes('recorrido')) {
      return <Footprints size={20} className="text-[var(--city-primary)]" />;
    }
    return <Clock size={20} className="text-[var(--city-primary)]" />;
  };

  const timeDisplay = activity.timeSlot || activity.time || 'Horario flexible';

  return (
    <motion.div 
      layout
      className={cn(
        "glass-panel rounded-3xl border transition-all overflow-hidden shadow-sm",
        isExpanded ? "border-[var(--city-primary)] bg-[var(--bg-card)] shadow-xl ring-1 ring-[var(--city-primary)]/30" : "border-[var(--border-card)] hover:border-[var(--city-primary)]/50"
      )}
    >
      {/* Primary Card View (always rich & informative) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex flex-col gap-3 cursor-pointer"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[var(--bg-canvas)] shadow-inner border border-[var(--border-card)] flex items-center justify-center shrink-0 mt-0.5">
            {getActivityIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono font-black text-[var(--city-primary)]">
                  {timeDisplay}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-canvas)] text-[var(--text-secondary)] font-bold border border-[var(--border-card)]">
                  {activity.typeLabel || activity.type || 'Paseo'}
                </span>
              </div>

              {activity.isHardDeadline && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  <span>Horario Fijo Confirmado</span>
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug mt-1">
              {activity.title}
            </h3>

            {activity.locationName && (
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-1 truncate">
                <MapPin size={12} className="text-rose-400 shrink-0" />
                <span className="truncate">{activity.locationName}</span>
              </p>
            )}

            {/* Notes preview if not expanded */}
            {activity.notes && !isExpanded && (
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1.5 leading-relaxed">
                {activity.notes}
              </p>
            )}
          </div>
        </div>

        {/* Instant Action Row (always visible) */}
        <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {activity.mapsUrl && (
              <a
                href={activity.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] text-xs font-bold border border-[var(--border-card)] transition-all"
              >
                <Compass size={12} className="text-[var(--city-primary)]" />
                <span>Google Maps</span>
                <ExternalLink size={10} className="opacity-70" />
              </a>
            )}

            {activity.voucherUrl && (
              <a
                href={activity.voucherUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-sm"
              >
                <Ticket size={12} />
                <span>Entrada / Voucher</span>
              </a>
            )}

            {walkingTour && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenWalkingTour(walkingTour);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold hover:bg-purple-500/25 transition-all"
              >
                <Footprints size={12} />
                <span>Tour a Pie</span>
              </button>
            )}

            {internalTour && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenWalkingTour(internalTour);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--city-primary)] to-[var(--city-secondary)] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
              >
                <Landmark size={12} />
                <span>Baraja de Salas</span>
              </button>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded)}
            }
            className="text-xs font-semibold text-[var(--city-primary)] hover:underline flex items-center gap-1 ml-auto"
          >
            <span>{isExpanded ? 'Menos detalles' : 'Más detalles & tips'}</span>
            <ChevronDown size={14} className={cn("transition-transform duration-200", isExpanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Expanded Details: Notes, Restrooms, Veggie tips, Trivia */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 sm:px-5 pb-5 pt-1 space-y-3 border-t border-[var(--border-card)]/60 bg-[var(--bg-canvas)]/50"
          >
            {/* Full Notes */}
            {activity.notes && (
              <div className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-card)] p-3.5 rounded-2xl border border-[var(--border-card)]">
                <span className="font-bold text-[var(--text-primary)] block mb-1">Indicaciones & Consejos:</span>
                {activity.notes}
              </div>
            )}

            {/* Restrooms (WC) Guidance */}
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <span>🚻</span>
                <span>Baños Cercanos & Servicios</span>
              </div>
              <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                Utilizar sanitarios dentro de las estaciones principales o museos antes de comenzar la caminata.
              </p>
            </div>

            {/* Veggie Recommendation (Super Veggie Tip) */}
            {activity.superVeggieTip && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Leaf size={14} />
                  <span>Opción Vegetariana Recomendada</span>
                </div>
                <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                  {activity.superVeggieTip}
                </p>
              </div>
            )}

            {/* Pop Culture Trivia & Secrets */}
            {activity.popCultureTrivia && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Sparkles size={14} />
                  <span>Curiosidad de Cine & Historia</span>
                </div>
                <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                  {activity.popCultureTrivia}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
