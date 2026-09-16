import React, { useState } from 'react';
import { 
  Footprints, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Camera, 
  Compass,
  Landmark,
  Plus
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { WalkingTour } from '../types';
import { ABMMenu } from './ABMMenu';
import { ABMModal } from './ABMModal';

interface ToursListViewProps {
  onSelectTour: (tour: WalkingTour) => void;
}

export const ToursListView: React.FC<ToursListViewProps> = ({ onSelectTour }) => {
  const [cityFilter, setCityFilter] = useState<string>('TODAS');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'STREET' | 'MONUMENT'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { walkingTours = {}, internalTours = {} } = useTripStore();
  const tourList: WalkingTour[] = [
    ...Object.values(walkingTours || {}),
    ...Object.values(internalTours || {})
  ] as WalkingTour[];

  const filteredTours = tourList.filter(t => {
    const matchesCity = cityFilter === 'TODAS' || t.cityCode === cityFilter;
    const matchesType = 
      typeFilter === 'ALL' || 
      (typeFilter === 'MONUMENT' && t.tourType === 'monument') ||
      (typeFilter === 'STREET' && t.tourType !== 'monument');
    return matchesCity && matchesType;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Footprints className="w-4 h-4" />
            <span>Circuitos Urbanos & Recorridos Monumentales</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {tourList.length} Itinerarios a Pie y Museos
          </h2>
          <p className="text-xs text-white/70">
            Navegación paso a paso pensada para la calle o el interior de monumentos con ángulos de foto y obras maestras.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Tour</span>
        </button>
      </div>

      {/* Category Type Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('ALL')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            typeFilter === 'ALL'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'glass-panel text-white/70 hover:text-white'
          }`}
        >
          Todos ({tourList.length})
        </button>

        <button
          onClick={() => setTypeFilter('MONUMENT')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            typeFilter === 'MONUMENT'
              ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black shadow-md'
              : 'glass-panel text-amber-300/80 hover:text-amber-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>🏛️ Recorridos Monumentales (Salas & Obras)</span>
        </button>

        <button
          onClick={() => setTypeFilter('STREET')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            typeFilter === 'STREET'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
              : 'glass-panel text-emerald-300/80 hover:text-emerald-200'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>🚶 Walking Tours Urbanos</span>
        </button>
      </div>

      {/* City Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 glass-card rounded-2xl w-full sm:w-auto">
        {['TODAS', 'ROMA', 'LONDRES', 'BARCELONA', 'MADRID'].map(city => (
          <button
            key={city}
            onClick={() => setCityFilter(city)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              cityFilter === city
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTours.map((tour) => {
          const isMonument = tour.tourType === 'monument';

          return (
            <div
              key={tour.id}
              id={`walking-tour-card-${tour.id}`}
              className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all shadow-md flex flex-col justify-between gap-4 relative ${
                isMonument 
                  ? 'border-amber-500/30 hover:border-amber-400/60 bg-gradient-to-br from-white/5 to-amber-950/20' 
                  : 'border-white/10 hover:border-emerald-500/50'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isMonument 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {isMonument ? '🏛️ RECORRIDO INTERNO' : '🚶 WALKING TOUR'} · {tour.cityCode}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60 font-medium">
                      {tour.duration} · {tour.distance}
                    </span>
                    <ABMMenu
                      entityType="tour"
                      entityId={tour.id}
                      initialData={tour}
                    />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {tour.title}
                </h3>

                {tour.attractionName && (
                  <p className="text-xs text-amber-300/80 font-medium">
                    🏛️ Monumento: {tour.attractionName}
                  </p>
                )}

                <div className="text-xs text-white/70 space-y-1">
                  <p><strong>Ritmo:</strong> {tour.pace}</p>
                  <p><strong>Paradas clave ({(tour.stops || []).length}):</strong> {(tour.stops || []).map(s => typeof s?.name === 'string' ? s.name.split('(')[0].trim() : (s?.description ? s.description.slice(0, 20) : '---')).join(' ➔ ')}</p>
                </div>

                {tour.tip && (
                  <p className="text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    💡 {tour.tip}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onSelectTour(tour)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isMonument
                      ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{isMonument ? 'Explorar Salas & Obras' : 'Abrir Navegador de Calle'}</span>
                </button>

                <a
                  href={tour.fullMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                  title="Abrir ruta directa en Google Maps"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Tour Modal */}
      {isAddModalOpen && (
        <ABMModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          entityType="tour"
          isNew={true}
        />
      )}

    </div>
  );
};
