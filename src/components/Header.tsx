import React, { useState, useEffect } from 'react';
import { 
  Clock, Plane, Compass, ChevronDown, Sun, Moon, Search, LogOut
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { TripMember } from '../types';

interface HeaderProps {
  activeMember: TripMember | null;
  onOpenSpotlight?: () => void;
  onOpenDbInspector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMember,
  onOpenSpotlight,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [bueTime, setBueTime] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { theme, toggleTheme, currentDestination, handleLogout, trip } = useTripStore();

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // European Time for current city
      const tz = currentDestination?.timezone || 'Europe/Rome';
      setCurrentTime(
        now.toLocaleTimeString('es-ES', { 
          timeZone: tz, 
          hour: '2-digit', 
          minute: '2-digit'
        })
      );
      // Buenos Aires Time
      setBueTime(
        now.toLocaleTimeString('es-AR', { 
          timeZone: 'America/Argentina/Buenos_Aires', 
          hour: '2-digit', 
          minute: '2-digit'
        })
      );
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [currentDestination?.timezone]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-card)] px-3 sm:px-6 py-3 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand / Trip Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg text-white font-black shrink-0 relative overflow-hidden transition-all duration-700 ring-1 ring-white/20"
            style={{
              background: 'linear-gradient(135deg, var(--city-primary), var(--city-secondary))',
              boxShadow: '0 4px 20px var(--city-glow)'
            }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-40 pointer-events-none" />
            <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white -rotate-45 drop-shadow-md relative z-10" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-[var(--text-primary)] tracking-tight truncate leading-none">
                {trip?.name || 'Viaje Activo'}
              </h1>
              <span className="hidden lg:inline-flex items-center shrink-0 gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30">
                {currentDestination?.flagEmoji || '🇪🇺'} {currentDestination?.name || 'Europa'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
              <span className="truncate hidden sm:block">17 Días • Roma · Londres · BCN · Madrid</span>
              <span className="hidden xl:inline text-white/30">•</span>
              <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-[var(--text-primary)] font-semibold">
                  <Clock className="w-3 h-3 text-[var(--city-primary)]" />
                  {currentTime} h ({currentDestination?.name || 'Local'})
                </span>
                <span className="text-white/40">|</span>
                <span>{bueTime} h (ARG)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Unified single-row control bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {onOpenSpotlight && (
            <button
              onClick={onOpenSpotlight}
              id="btn-open-spotlight-search"
              title="Buscar (Cmd + K)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] border border-[var(--border-card)] rounded-xl transition-all shadow-sm"
            >
              <Search className="w-4 h-4 text-[var(--city-primary)]" />
              <span className="hidden sm:inline">Buscar</span>
              <kbd className="hidden lg:inline text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-canvas)] text-[var(--text-secondary)] font-mono border border-[var(--border-card)]">⌘K</kbd>
            </button>
          )}

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            className="p-2 sm:p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              id="btn-traveler-profile-selector"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] border border-[var(--border-card)] text-xs font-semibold text-[var(--text-primary)] transition-all shadow-sm"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-inner"
                style={{ backgroundColor: activeMember?.color || '#0284c7' }}
              />
              <span className="truncate max-w-[60px] sm:max-w-none">{activeMember?.name || 'Invitado'}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[var(--bg-card)] backdrop-blur-3xl border border-[var(--border-card)] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-card)] mb-1">
                  Sesión Actual
                </div>
                <div className="px-3 py-2 text-sm text-[var(--text-primary)] font-medium mb-1">
                  {activeMember?.name || 'Modo Invitado'}
                  <div className="text-[10px] text-[var(--text-secondary)]">{activeMember?.role || 'Solo lectura'}</div>
                </div>
                
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
