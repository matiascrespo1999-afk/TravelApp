import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Shirt, 
  Backpack, 
  Plane, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Compass, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Train,
  Landmark,
  Footprints,
  Utensils,
  Leaf,
  Ticket,
  Eye,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '../context/TripStoreContext';
import { Activity, DayItinerary, CityCode, WalkingTour } from '../types';
import { LiquidDaySelector } from './LiquidDaySelector';
import { BoardingPassCard } from './BoardingPassCard';

interface TodayViewProps {
  onGoToItinerary: (dayNumber?: number) => void;
  onOpenTransport: (transportId?: string) => void;
  onOpenAccommodation: (hotelId?: string) => void;
  onSelectWalkingTour?: (tour: any) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  onGoToItinerary,
  onOpenTransport,
  onOpenAccommodation,
  onSelectWalkingTour
}) => {
  const store = useTripStore();
  const [activeDayNum, setActiveDayNum] = useState<number>(() => {
    const saved = localStorage.getItem('today_selected_day');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [checkedBackpack, setCheckedBackpack] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('today_backpack_checked');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Local & Argentina real-time clock
  const [localTime, setLocalTime] = useState<string>('');
  const [localSeconds, setLocalSeconds] = useState<string>('');
  const [argentinaTime, setArgentinaTime] = useState<string>('');

  // Selected custom activity index in Now & Next (defaults to 0 or current time match)
  const [nowIndex, setNowIndex] = useState<number>(0);

  const itineraryDays = store.itinerary || [];
  const currentDayData = itineraryDays.find(d => Number(d.day) === Number(activeDayNum)) || itineraryDays[0];

  const cityCode = (currentDayData?.cityCode || 'ROMA') as CityCode;
  const destination = store.destinations[cityCode] || store.destinations.ROMA;

  // Sync theme city when active day changes
  useEffect(() => {
    if (currentDayData?.cityCode) {
      store.setThemeCity(currentDayData.cityCode as CityCode);
    }
    localStorage.setItem('today_selected_day', activeDayNum.toString());
  }, [activeDayNum, currentDayData?.cityCode]);

  // Dual clock ticking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tz = currentDayData?.timezone || destination?.timezone || 'Europe/Rome';
      
      try {
        const localFormatted = now.toLocaleTimeString('es-ES', { 
          timeZone: tz, 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        });
        const secFormatted = now.toLocaleTimeString('es-ES', { 
          timeZone: tz, 
          second: '2-digit'
        });
        const argFormatted = now.toLocaleTimeString('es-AR', { 
          timeZone: 'America/Argentina/Buenos_Aires', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        });
        setLocalTime(localFormatted);
        setLocalSeconds(secFormatted);
        setArgentinaTime(argFormatted);
      } catch {
        setLocalTime('12:00');
        setLocalSeconds('00');
        setArgentinaTime('07:00');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [currentDayData?.timezone, destination?.timezone]);

  // Activities for this day
  const dayActivities: Activity[] = (store.activities || [])
    .filter(a => Number(a.day) === Number(activeDayNum))
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Day's transport and accommodation via smart lookup
  const transportList = Object.values(store.transports || {}) as any[];
  const hotelList = Object.values(store.accommodations || {}) as any[];

  const dayTransport = currentDayData?.transportId 
    ? store.transports[currentDayData.transportId] 
    : transportList.find(t => Number(t.dayNumber) === Number(activeDayNum));

  const dayAccommodation = currentDayData?.accommodationId 
    ? store.accommodations[currentDayData.accommodationId] 
    : hotelList.find(h => h.cityCode === currentDayData?.cityCode);

  // Auto-select initial Now activity based on day change
  useEffect(() => {
    setNowIndex(0);
  }, [activeDayNum]);

  const nowActivity: Activity | undefined = dayActivities[nowIndex] || dayActivities[0];
  const nextActivity: Activity | undefined = dayActivities[nowIndex + 1];

  const toggleBackpackItem = (item: string) => {
    setCheckedBackpack(prev => {
      const updated = { ...prev, [item]: !prev[item] };
      localStorage.setItem('today_backpack_checked', JSON.stringify(updated));
      return updated;
    });
  };

  const backpackList: string[] = React.useMemo(() => {
    if (!currentDayData?.backpackChecklist) {
      return ['Pasaporte y DNI físico', 'Powerbank 10.000 mAh', 'Tarjeta Contactless / Apple Pay', 'Auriculares'];
    }
    if (Array.isArray(currentDayData.backpackChecklist)) {
      return currentDayData.backpackChecklist.map((i: any) => String(i).trim()).filter(Boolean);
    }
    if (typeof currentDayData.backpackChecklist === 'string') {
      return currentDayData.backpackChecklist.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return ['Pasaporte y DNI físico', 'Powerbank 10.000 mAh', 'Tarjeta Contactless / Apple Pay', 'Auriculares'];
  }, [currentDayData?.backpackChecklist]);

  // Weather representation
  const weatherString = currentDayData?.weather || (
    cityCode === 'LONDRES' || cityCode === 'OXFORD'
      ? '17°C • Llovizna y fresco'
      : cityCode === 'BARCELONA' || cityCode === 'GIRONA'
      ? '23°C • Brisa mediterránea y sol'
      : cityCode === 'MADRID' || cityCode === 'TOLEDO'
      ? '24°C • Despejado y cálido'
      : '22°C • Soleado y templado'
  );

  const getActivityIcon = (act: Activity) => {
    const title = (act?.title || '').toLowerCase();
    const type = (act?.type || '').toLowerCase();
    if (title.includes('vuelo') || type.includes('flight') || type === 'traslado') return <Plane className="w-5 h-5 text-sky-400" />;
    if (title.includes('tren') || type.includes('train')) return <Train className="w-5 h-5 text-emerald-400" />;
    if (type.includes('food') || title.includes('cena') || title.includes('almuerzo')) return <Utensils className="w-5 h-5 text-amber-400" />;
    if (act.internalTourId || title.includes('museo') || title.includes('coliseo') || title.includes('vaticano')) return <Landmark className="w-5 h-5 text-[var(--city-primary)]" />;
    return <Footprints className="w-5 h-5 text-[var(--city-primary)]" />;
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* 1. APPLE LIQUID GLASS DAY SELECTOR */}
      <LiquidDaySelector
        selectedDay={activeDayNum}
        onSelectDay={setActiveDayNum}
      />

      {/* 2. COMPACT INTEGRATED AMBIENT HUD: SUBTLE DUAL TIME & WEATHER */}
      <div className="glass-panel px-4 py-3 rounded-2xl border border-[var(--border-card)] shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Local City Time with Active Seconds Pulse */}
        <div className="flex items-center gap-2.5">
          <span className="text-base">{destination?.flagEmoji || '🏛️'}</span>
          <div>
            <div className="flex items-baseline gap-1 font-mono font-bold text-[var(--text-primary)]">
              <span className="text-sm">{localTime || '12:00'}</span>
              <span className="text-[11px] text-[var(--city-primary)]">:{localSeconds || '00'}</span>
              <span className="text-[11px] text-[var(--text-secondary)] font-normal ml-1 font-sans">
                • {destination?.name || currentDayData?.city || 'Destino'}
              </span>
            </div>
          </div>
        </div>

        {/* Argentina Home Time */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[11px] font-medium text-[var(--text-secondary)]">
          <span>🇦🇷</span>
          <span className="font-mono font-bold text-[var(--text-primary)]">{argentinaTime || '07:00'} hs</span>
          <span className="opacity-70 text-[10px]">(-5h)</span>
        </div>

        {/* Weather & Dress Code */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-bold text-[var(--text-primary)]">{weatherString}</span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline text-[var(--text-secondary)] truncate max-w-[200px]">
            {currentDayData?.dressCode || currentDayData?.clothingAdvice || 'Calzado cómodo'}
          </span>
        </div>
      </div>

      {/* 3. HERO APPLE CARD: "NOW & NEXT" (ACTIVIDAD EN CURSO & PRÓXIMA) */}
      <div className="relative overflow-hidden rounded-[2.2rem] glass-panel border border-[var(--border-card)] shadow-2xl p-5 sm:p-7">
        
        {/* Ambient liquid glow background */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
          style={{ background: 'var(--city-gradient, var(--city-primary))' }}
        />

        {/* Card Header with Step controls */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--border-card)]/60 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-[var(--city-primary)] animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--city-primary)] absolute" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-[var(--city-primary)]">
                Modo En Ruta • Now & Next
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Seguimiento inteligente paso a paso de tu jornada en {currentDayData?.city || 'Europa'}
              </p>
            </div>
          </div>

          {/* Stepper buttons if multiple activities */}
          {dayActivities.length > 1 && (
            <div className="flex items-center gap-1.5 bg-[var(--bg-card)] p-1 rounded-2xl border border-[var(--border-card)]">
              <button
                onClick={() => setNowIndex(Math.max(0, nowIndex - 1))}
                disabled={nowIndex === 0}
                className="p-1.5 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[var(--text-primary)] transition-all"
                title="Actividad previa"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] font-mono font-bold px-2 text-[var(--text-primary)]">
                {nowIndex + 1} / {dayActivities.length}
              </span>
              <button
                onClick={() => setNowIndex(Math.min(dayActivities.length - 1, nowIndex + 1))}
                disabled={nowIndex >= dayActivities.length - 1}
                className="p-1.5 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-[var(--text-primary)] transition-all"
                title="Siguiente actividad"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* NOW & NEXT Interactive Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* A. NOW (AHORA) - Primary Focus (7 cols on large screens) */}
          <div className="lg:col-span-7 rounded-3xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--city-primary)]/40 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between gap-4">
            
            {/* Top badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--city-primary)] text-white shadow-md flex items-center gap-1.5">
                <Radio size={12} className="animate-pulse" />
                <span>AHORA • NOW</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-white/10 font-mono text-xs sm:text-sm font-black text-[var(--city-primary)] border border-[var(--border-card)]">
                  {nowActivity?.time || nowActivity?.timeSlot || '09:00'} h
                </span>
                {nowActivity?.isHardDeadline && (
                  <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                    Pase Confirmado
                  </span>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] leading-snug tracking-tight">
                {nowActivity?.title || 'Comenzando la jornada en ' + (currentDayData?.city || 'Europa')}
              </h2>

              {nowActivity?.locationName && (
                <div className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                  <MapPin size={14} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{nowActivity.locationName}</span>
                </div>
              )}

              {nowActivity?.notes && (
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-canvas)]/60 p-3 rounded-2xl border border-[var(--border-card)]">
                  {nowActivity.notes}
                </p>
              )}
            </div>

            {/* Highlights (Pop culture or veggie) */}
            {nowActivity?.popCultureTrivia && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
                <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{nowActivity.popCultureTrivia}</div>
              </div>
            )}

            {nowActivity?.superVeggieTip && !nowActivity?.popCultureTrivia && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-emerald-300">
                <Leaf size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-snug">{nowActivity.superVeggieTip}</div>
              </div>
            )}

            {/* Quick Actions for NOW */}
            <div className="pt-2 border-t border-[var(--border-card)] flex items-center gap-2 flex-wrap">
              {nowActivity?.mapsUrl && (
                <a
                  href={nowActivity.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[var(--city-primary)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Compass size={13} />
                  <span>Abrir Mapa</span>
                  <ExternalLink size={11} className="opacity-80" />
                </a>
              )}

              {nowActivity?.voucherUrl && (
                <a
                  href={nowActivity.voucherUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 border border-[var(--border-card)] transition-all"
                >
                  <Ticket size={13} className="text-amber-400" />
                  <span>Ver Entrada / Voucher</span>
                </a>
              )}

              {nowActivity?.internalTourId && (
                <button
                  onClick={() => {
                    const tour = store.getTourById(nowActivity.internalTourId!);
                    if (tour && onSelectWalkingTour) onSelectWalkingTour(tour);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center gap-1.5 border border-purple-500/40 transition-all ml-auto"
                >
                  <Eye size={13} />
                  <span>Modo Baraja Monumento</span>
                </button>
              )}
            </div>
          </div>

          {/* B. NEXT (A CONTINUACIÓN) - Upcoming Activity (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[var(--bg-canvas)]/80 backdrop-blur-md border border-[var(--border-card)] p-5 sm:p-6 flex flex-col justify-between gap-4">
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-[var(--text-secondary)] border border-[var(--border-card)]">
                  A CONTINUACIÓN • NEXT
                </span>
                {nextActivity && (
                  <span className="text-xs font-mono font-bold text-[var(--city-primary)]">
                    {nextActivity.time || nextActivity.timeSlot} h
                  </span>
                )}
              </div>

              {nextActivity ? (
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-snug">
                    {nextActivity.title}
                  </h3>
                  {nextActivity.locationName && (
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                      <MapPin size={12} className="text-rose-400 shrink-0" />
                      <span className="truncate">{nextActivity.locationName}</span>
                    </p>
                  )}
                  {nextActivity.notes && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mt-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      {nextActivity.notes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[var(--text-secondary)]">
                  🎉 ¡Última actividad programada de este día! Tiempo libre para relajarse o pasear.
                </div>
              )}
            </div>

            {/* Next actions & Quick Jump */}
            {nextActivity && (
              <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between">
                <button
                  onClick={() => setNowIndex(nowIndex + 1)}
                  className="text-xs font-bold text-[var(--city-primary)] hover:underline flex items-center gap-1"
                >
                  <span>Ver detalle completo</span>
                  <ChevronRight size={13} />
                </button>

                {nextActivity.mapsUrl && (
                  <a
                    href={nextActivity.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-card)]"
                    title="Ver mapa"
                  >
                    <Compass size={14} />
                  </a>
                )}
              </div>
            )}

            {/* Quick Link to Itinerary */}
            <div className="mt-auto pt-2">
              <button
                onClick={() => onGoToItinerary(activeDayNum)}
                className="w-full py-2.5 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Ver cronograma completo ({dayActivities.length} actividades)</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 3.5. BOARDING PASS IF DAY HAS FLIGHT OR TRAIN */}
      {dayTransport && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--city-primary)]">
              Pase de Embarque del Día
            </span>
            <button
              onClick={() => onOpenTransport(dayTransport.id)}
              className="text-xs font-bold text-[var(--city-primary)] hover:underline"
            >
              Ver todos los billetes ➔
            </button>
          </div>
          <BoardingPassCard transport={dayTransport} />
        </div>
      )}

      {/* 4. LOGISTICS ROW: HOTEL WITH PIN, TRANSPORT PASS & BACKPACK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Hotel & Keypad Door PIN */}
        <div className="glass-panel p-4.5 rounded-3xl border border-[var(--border-card)] flex flex-col justify-between gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Building2 size={15} />
              <span>Alojamiento & PIN</span>
            </div>
            {dayAccommodation && (
              <button
                onClick={() => onOpenAccommodation(dayAccommodation.id)}
                className="text-[11px] text-[var(--city-primary)] font-bold hover:underline"
              >
                Ver Ficha ➔
              </button>
            )}
          </div>

          {dayAccommodation ? (
            <div className="space-y-2">
              <div>
                <h4 className="text-sm font-black text-[var(--text-primary)] truncate">
                  {dayAccommodation.name}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                  {dayAccommodation.address}
                </p>
              </div>

              {dayAccommodation.doorPin && (
                <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-bold">PIN Cerradura:</span>
                  <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                    {dayAccommodation.doorPin}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-xs text-[var(--text-secondary)]">
              Día de viaje en tránsito o sin check-in nuevo.
            </div>
          )}

          <div className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-card)]">
            Check-in autónomo disponible 24/7 con código.
          </div>
        </div>

        {/* Transport Ticket / Boarding Pass */}
        <div className="glass-panel p-4.5 rounded-3xl border border-[var(--border-card)] flex flex-col justify-between gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <Plane size={15} />
              <span>Transporte del Día</span>
            </div>
            {dayTransport && (
              <button
                onClick={() => onOpenTransport(dayTransport.id)}
                className="text-[11px] text-sky-400 font-bold hover:underline"
              >
                Ver Pasajes ➔
              </button>
            )}
          </div>

          {dayTransport ? (
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--text-primary)]">
                  <span>{dayTransport.company}</span>
                  <span className="text-[var(--text-secondary)]">({dayTransport.number})</span>
                </div>
                <p className="text-xs font-black text-[var(--text-primary)] mt-0.5">
                  {dayTransport.routeTitle}
                </p>
                <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                  Salida: <strong className="text-[var(--text-primary)]">{dayTransport.depTime}</strong> ➔ Llegada: <strong className="text-[var(--text-primary)]">{dayTransport.arrTime}</strong>
                </div>
              </div>

              {dayTransport.tickets && dayTransport.tickets.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                  {dayTransport.tickets.map(tk => (
                    <span key={tk.travelerId} className="px-2 py-0.5 rounded-lg bg-white/10 text-[var(--text-primary)] border border-white/10">
                      {tk.travelerName}: {tk.pnr}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-xs text-[var(--text-secondary)]">
              No hay vuelos ni trenes interurbanos para hoy. Recorridos urbanos a pie y metro.
            </div>
          )}

          <div className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-card)]">
            En Londres el Tube se paga directo con tarjeta contactless.
          </div>
        </div>

        {/* Interactive Backpack Checklist */}
        <div className="glass-panel p-4.5 rounded-3xl border border-[var(--border-card)] flex flex-col justify-between gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Backpack size={15} />
              <span>Mochila Lista</span>
            </div>
            <span className="text-xs font-bold font-mono text-[var(--text-secondary)]">
              {Object.values(checkedBackpack).filter(Boolean).length} / {backpackList.length}
            </span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {backpackList.map((item, idx) => {
              const isDone = !!checkedBackpack[item];
              return (
                <button
                  key={idx}
                  onClick={() => toggleBackpackItem(item)}
                  className="w-full flex items-center gap-2 text-left text-xs py-1 hover:opacity-80 transition-opacity"
                >
                  {isDone ? (
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={15} className="text-[var(--text-secondary)] shrink-0" />
                  )}
                  <span className={`truncate text-xs ${isDone ? 'line-through text-[var(--text-secondary)]' : 'font-medium text-[var(--text-primary)]'}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-card)]">
            Toca cada elemento al guardarlo antes de salir.
          </div>
        </div>

      </div>

      {/* 5. FULL DAY ACTIVITIES CHRONOGRAM */}
      <div className="glass-panel rounded-[2rem] p-5 sm:p-6 border border-[var(--border-card)] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--city-primary)]" />
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Todas las actividades del Día {activeDayNum} ({dayActivities.length})
            </h3>
          </div>

          <button
            onClick={() => onGoToItinerary(activeDayNum)}
            className="text-xs font-bold text-[var(--city-primary)] hover:underline flex items-center gap-1"
          >
            <span>Abrir en Itinerario</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="space-y-2.5">
          {dayActivities.map((act, index) => {
            const isCurrent = index === nowIndex;
            return (
              <div
                key={act.id || index}
                onClick={() => setNowIndex(index)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[var(--city-glow)]/40 border-[var(--city-primary)] shadow-md ring-1 ring-[var(--city-primary)]/40'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] border border-[var(--border-card)]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-[var(--border-card)] flex items-center justify-center shrink-0">
                    {getActivityIcon(act)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[var(--city-primary)]">
                        {act.time || act.timeSlot || '--:--'} h
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                        {act.title}
                      </h4>
                      {act.isHardDeadline && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
                          Horario Fijo
                        </span>
                      )}
                    </div>

                    {act.locationName && (
                      <p className="text-[11px] text-[var(--text-secondary)] truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-rose-400 shrink-0" />
                        <span>{act.locationName}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {act.mapsUrl && (
                    <a
                      href={act.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-card)] flex items-center gap-1"
                    >
                      <Compass size={12} />
                      <span>Mapa</span>
                    </a>
                  )}
                  <ChevronRight size={14} className="text-[var(--text-secondary)]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
