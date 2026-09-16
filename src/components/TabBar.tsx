import React, { useState } from 'react';
import { 
  Calendar, 
  Wallet, 
  Ticket, 
  Compass,
  Map, 
  Plane, 
  Building2, 
  Settings,
  MoreHorizontal,
  X,
  ShieldAlert,
  BookOpen,
  Bot
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ActiveTab } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { useTripStore } from '../context/TripStoreContext';

interface TabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const { isGuest } = useTripStore();

  // Core tabs visible on dock
  const primaryTabs = [
    { id: 'today', label: 'Hoy', icon: Compass },
    { id: 'itinerary', label: 'Itinerario', icon: Calendar },
    { id: 'transports', label: 'Billetes', icon: Plane },
    ...(!isGuest ? [{ id: 'expenses', label: 'Gastos', icon: Wallet }] : []),
    { id: 'more', label: 'Más', icon: MoreHorizontal }
  ] as const;

  const moreMenuItems = [
    { id: 'vouchers', label: 'Vouchers & Entradas', icon: Ticket, desc: 'Códigos QR y accesos a atracciones' },
    { id: 'accommodations', label: 'Alojamientos & PINs', icon: Building2, desc: 'Hoteles, apartamentos y llaves' },
    { id: 'tours', label: 'Recorridos & Museos', icon: Map, desc: 'Tours urbanos y salas de museos' },
    { id: 'assistant', label: 'Asistente IA (Chatbot)', icon: Bot, desc: 'Consejos en vivo y traducción' },
    { id: 'guide', label: 'Guía de Supervivencia', icon: BookOpen, desc: 'Metro, trenes, contactless y tips' },
    { id: 'emergency', label: 'Emergencias & Consulados', icon: ShieldAlert, desc: 'Hospitales, farmacias y policía' },
    ...(!isGuest ? [{ id: 'settings', label: 'Ajustes & Paletas', icon: Settings, desc: 'Modo claro/oscuro, temas y perfiles' }] : []),
  ] as const;

  const isMoreActive = ['vouchers', 'accommodations', 'tours', 'assistant', 'guide', 'emergency', 'settings'].includes(activeTab);

  return (
    <>
      {/* Floating Apple Liquid Glass Dock (Uniform across mobile, tablet, and desktop) */}
      <nav 
        aria-label="Barra de navegación principal"
        className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md sm:max-w-xl md:max-w-2xl px-2.5 py-1.5 rounded-full bg-[var(--bg-card)] backdrop-blur-3xl border border-[var(--border-card)] shadow-2xl flex items-center justify-between gap-1 select-none"
        style={{
          boxShadow: '0 12px 40px -4px rgba(0, 0, 0, 0.22)'
        }}
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'more' ? isMoreActive : activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => {
                if (tab.id === 'more') {
                  setIsMoreMenuOpen(true);
                } else {
                  setIsMoreMenuOpen(false);
                  onTabChange(tab.id as ActiveTab);
                }
              }}
              className="relative flex flex-col sm:flex-row items-center justify-center flex-1 py-1 sm:py-2 px-1.5 sm:px-3 rounded-full focus:outline-none transition-all"
            >
              {/* Liquid Glass sliding pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-[var(--city-glow)] border border-[var(--city-primary)]/40 shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <div className={cn(
                "relative z-10 transition-transform duration-200",
                isActive ? "scale-105 text-[var(--city-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}>
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              
              <span className={cn(
                "relative z-10 text-[10px] sm:text-xs font-bold tracking-tight transition-colors duration-200 sm:ml-1.5 whitespace-nowrap",
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* "Más" iOS Action Sheet / Liquid Glass Modal */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsMoreMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-[var(--bg-card)] backdrop-blur-3xl border-t sm:border border-[var(--border-card)] rounded-t-[2.5rem] sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
                <div>
                  <h3 className="font-black text-lg text-[var(--text-primary)]">Módulos & Herramientas</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Accesos directos complementarios del viaje</p>
                </div>
                <button
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-2 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id as ActiveTab);
                        setIsMoreMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl border text-left transition-all",
                        isItemActive
                          ? "bg-[var(--city-glow)] border-[var(--city-primary)] shadow-sm text-[var(--text-primary)] font-bold ring-1 ring-[var(--city-primary)]/30"
                          : "bg-[var(--bg-canvas)] border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--city-primary)]/40"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl shrink-0",
                        isItemActive ? "bg-[var(--city-primary)] text-white" : "bg-[var(--city-primary)]/10 text-[var(--city-primary)]"
                      )}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-[var(--text-primary)]">{item.label}</span>
                        <span className="block text-[10px] text-[var(--text-secondary)] truncate">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
