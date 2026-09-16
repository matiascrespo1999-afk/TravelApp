import React, { useState } from 'react';
import { 
  Calendar, 
  Wallet, 
  Ticket, 
  Plane, 
  Map, 
  Building2, 
  HelpCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ActiveTab } from '../App';
import { useTripStore } from '../context/TripStoreContext';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { trip, itinerary, destinations, isGuest } = useTripStore();

  // Primary navigation items
  const primaryItems = [
    { id: 'today', label: 'Hoy', icon: Compass },
    { id: 'itinerary', label: 'Itinerario', icon: Calendar },
    { id: 'vouchers', label: 'Vouchers & Entradas', icon: Ticket },
    ...(!isGuest ? [{ id: 'expenses', label: 'Gastos Compartidos', icon: Wallet }] : []),
  ] as const;

  const secondaryItems = [
    { id: 'transports', label: 'Vuelos & Trenes', icon: Plane },
    { id: 'accommodations', label: 'Alojamientos', icon: Building2 },
    { id: 'tours', label: 'Recorridos & Museos', icon: Map },
    { id: 'guide', label: 'Guía de Supervivencia', icon: HelpCircle },
    { id: 'emergency', label: 'Emergencias & Salud', icon: ShieldAlert },
    ...(!isGuest ? [{ id: 'settings', label: 'Configuración & Perfil', icon: Settings }] : []),
  ] as const;

  return (
    <div className={cn(
      "hidden md:flex flex-col h-full glass-panel border-r border-[var(--border-card)] z-20 transition-all duration-300 relative select-none",
      isCollapsed ? "w-20 p-3" : "w-64 p-5"
    )}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
        className="absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)] shadow-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 transition-all z-50 cursor-pointer"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "gap-3")}>
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg relative overflow-hidden transition-all duration-700 shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--city-primary), var(--city-secondary))',
            boxShadow: '0 4px 16px var(--city-glow)'
          }}
        >
          <Plane className="w-5 h-5 -rotate-45" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <h1 className="font-black text-base leading-tight tracking-tight text-[var(--text-primary)] truncate">{trip?.name || 'Viaje Activo'}</h1>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium truncate">{(itinerary || []).length} Días • {Object.keys(destinations || {}).length} Destinos</p>
          </div>
        )}
      </div>

      {/* Core Navigation */}
      <div className="space-y-1 mb-6">
        {!isCollapsed && (
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 px-3">
            Principal
          </h3>
        )}
        {primaryItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              title={isCollapsed ? item.label : undefined}
              onClick={() => onTabChange(item.id as ActiveTab)}
              className={cn(
                "flex items-center rounded-2xl transition-all duration-200 text-xs font-bold w-full cursor-pointer",
                isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5",
                isActive 
                  ? "bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30 shadow-xs" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] border border-transparent"
              )}
            >
              <Icon size={isCollapsed ? 20 : 17} className={isActive ? "text-[var(--city-primary)]" : ""} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Details & Secondary Modules */}
      <div className="space-y-1 mt-auto pt-4 border-t border-[var(--border-card)]">
        {!isCollapsed && (
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 px-3">
            Detalles & Herramientas
          </h3>
        )}
        {secondaryItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              title={isCollapsed ? item.label : undefined}
              onClick={() => onTabChange(item.id as ActiveTab)}
              className={cn(
                "flex items-center rounded-2xl transition-all duration-200 text-xs font-semibold w-full cursor-pointer",
                isCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2",
                isActive 
                  ? "bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30 shadow-xs" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] border border-transparent"
              )}
            >
              <Icon size={isCollapsed ? 18 : 16} className={isActive ? "text-[var(--city-primary)]" : ""} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
