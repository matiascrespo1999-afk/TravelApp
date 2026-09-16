import React, { useState } from 'react';
import { 
  Building2, 
  Key, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  ShoppingCart, 
  AlertTriangle,
  Plus,
  Coins,
  Luggage,
  Sparkles,
  Ticket
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { Accommodation } from '../types';
import { ABMMenu } from './ABMMenu';
import { ABMModal } from './ABMModal';

interface AccommodationsViewProps {
  initialHotelId?: string;
}

export const AccommodationsView: React.FC<AccommodationsViewProps> = ({ initialHotelId }) => {
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTabs, setActiveTabs] = useState<Record<string, 'access' | 'times' | 'market'>>({});
  const { accommodations } = useTripStore();

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPin(text);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const hotelList: Accommodation[] = Object.values(accommodations || {});

  const setHotelTab = (hotelId: string, tab: 'access' | 'times' | 'market') => {
    setActiveTabs(prev => ({ ...prev, [hotelId]: tab }));
  };

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--city-primary)] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Alojamientos & Códigos de Acceso</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Hoteles, Apartamentos & Claves Autónomas
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            PINs de portales, cajetines de llaves, supermercados y checkout directo para cada ciudad.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--city-primary)] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Alojamiento</span>
        </button>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hotelList.map((hotel) => {
          const activeTab = activeTabs[hotel.id] || 'access';
          const isSelected = initialHotelId === hotel.id;

          return (
            <div
              key={hotel.id}
              id={`hotel-card-${hotel.id}`}
              className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden ${
                isSelected ? 'border-[var(--city-primary)] ring-2 ring-[var(--city-primary)]/40' : 'border-[var(--border-card)]'
              }`}
            >
              <div className="space-y-3">
                {/* Header: City pill, Timings & ABM */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30">
                    {hotel.cityName}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[var(--city-primary)]" />
                      <span>In {hotel.checkInTime} · Out {hotel.checkOutTime}</span>
                    </div>
                    <ABMMenu
                      entityType="accommodation"
                      entityId={hotel.id}
                      initialData={hotel}
                    />
                  </div>
                </div>

                {/* Hotel Name & Address */}
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>{hotel.address}</span>
                  </p>
                </div>

                {/* Segmented Tab Navigation for clean, non-invasive UX */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs">
                  <button
                    onClick={() => setHotelTab(hotel.id, 'access')}
                    className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'access' 
                        ? 'bg-[var(--bg-card)] text-[var(--city-primary)] shadow-sm' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{hotel.doorPin ? 'Clave de Entrada' : 'Check-in & Recepción'}</span>
                  </button>

                  <button
                    onClick={() => setHotelTab(hotel.id, 'times')}
                    className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'times' 
                        ? 'bg-[var(--bg-card)] text-[var(--city-primary)] shadow-sm' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Horarios</span>
                  </button>

                  <button
                    onClick={() => setHotelTab(hotel.id, 'market')}
                    className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'market' 
                        ? 'bg-[var(--bg-card)] text-[var(--city-primary)] shadow-sm' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Supermercado</span>
                  </button>
                </div>

                {/* Tab 1: Access & PIN */}
                {activeTab === 'access' && (
                  <div className="space-y-3 pt-1">
                    {hotel.doorPin ? (
                      <div className="p-3.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between gap-2 shadow-inner">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider block">
                            PIN / Código de Entrada Autónomo
                          </span>
                          <span className="font-mono text-lg font-black text-[var(--city-primary)] select-all">
                            {hotel.doorPin}
                          </span>
                        </div>
                        <button
                          onClick={() => copyText(hotel.doorPin)}
                          className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] border border-[var(--border-card)] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                          title="Copiar PIN al portapapeles"
                        >
                          {copiedPin === hotel.doorPin ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px] text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold block text-emerald-300">
                            Recepción Presencial 24 Horas
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            No requiere código ni PIN. Check-in presencial en mostrador presentando Pasaporte / DNI.
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold shrink-0">
                          24h
                        </span>
                      </div>
                    )}

                    <div className="text-xs text-[var(--text-secondary)] leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10 space-y-1">
                      <span className="font-bold text-[var(--text-primary)] block">Instrucciones de llegada:</span>
                      <p>{hotel.instructions || 'Presentar confirmación de reserva y documento de identidad en recepción.'}</p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Times & Tourist Tax */}
                {activeTab === 'times' && (
                  <div className="space-y-2.5 pt-1 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)]">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Check-in</span>
                        <span className="text-sm font-mono font-bold text-[var(--text-primary)]">{hotel.checkInTime}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)]">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block">Check-out</span>
                        <span className="text-sm font-mono font-bold text-rose-400">{hotel.checkOutTime}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        <Luggage className="w-3.5 h-3.5 text-amber-400" />
                        <span>Guardaequipaje (Luggage Storage)</span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-[11px]">
                        Disponible en la propiedad o en consignas cercanas recomendadas (Radical Storage / Nannybag).
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tasa Turística de la Ciudad</span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-[11px]">
                        {hotel.cityName.includes('Roma') ? 'Roma: 3.50€ a 6.00€ por persona/noche.' :
                         hotel.cityName.includes('Barcelona') ? 'Barcelona: ~5.50€ por persona/noche (tasa municipal + autonómica).' :
                         hotel.cityName.includes('Madrid') ? 'Madrid: Sin tasa turística municipal.' :
                         'Londres: Sin tasa turística directa (IVA 20% ya incluido).'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Supermarket & Environment */}
                {activeTab === 'market' && (
                  <div className="space-y-3 pt-1 text-xs">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Supermercados Cercanos Recomendados</span>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {hotel.supermarketTips || "Supermercados y tiendas de conveniencia a menos de 5 minutos caminando."}
                      </p>
                    </div>

                    {hotel.supermarketsUrl && (
                      <a
                        href={hotel.supermarketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[var(--text-primary)] font-semibold border border-white/15 transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Buscar Supermercados en Google Maps</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Action: Google Maps Button */}
              <div className="pt-2 border-t border-[var(--border-card)]">
                <a
                  href={hotel.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--city-primary)] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ver Ubicación en Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* New Accommodation Modal */}
      {isAddModalOpen && (
        <ABMModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          entityType="accommodation"
          mode="create"
          initialData={{}}
        />
      )}

    </div>
  );
};
