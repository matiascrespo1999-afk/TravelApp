import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Sun, 
  Moon, 
  User, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Lock,
  Sparkles,
  Sliders,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { CityCode } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    config, 
    theme, 
    setTheme, 
    travelers, 
    userSession,
    setIsLockScreenOpen,
    customPalettes,
    setCityPalette,
    itinerary,
    expenses,
    transports,
    accommodations,
    vouchers
  } = useTripStore();

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [selectedCityToEdit, setSelectedCityToEdit] = useState<CityCode>('ROMA');

  const showNotification = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const citiesList: { code: CityCode; name: string; flag: string; defaultPrimary: string; defaultSecondary: string }[] = [
    { code: 'ROMA', name: 'Roma', flag: '🇮🇹', defaultPrimary: '#ea580c', defaultSecondary: '#eab308' },
    { code: 'LONDRES', name: 'Londres', flag: '🇬🇧', defaultPrimary: '#2563eb', defaultSecondary: '#dc2626' },
    { code: 'OXFORD', name: 'Oxford', flag: '🇬🇧', defaultPrimary: '#1e3a8a', defaultSecondary: '#7e22ce' },
    { code: 'BARCELONA', name: 'Barcelona', flag: '🇪🇸', defaultPrimary: '#0891b2', defaultSecondary: '#f59e0b' },
    { code: 'GIRONA', name: 'Girona', flag: '🇪🇸', defaultPrimary: '#059669', defaultSecondary: '#b45309' },
    { code: 'MADRID', name: 'Madrid', flag: '🇪🇸', defaultPrimary: '#dc2626', defaultSecondary: '#f97316' },
    { code: 'TOLEDO', name: 'Toledo', flag: '🇪🇸', defaultPrimary: '#d97706', defaultSecondary: '#78350f' }
  ];

  const activePal = customPalettes[selectedCityToEdit] || {
    primary: '#ea580c',
    secondary: '#eab308'
  };

  const handleExportFullBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      config,
      itinerary,
      expenses,
      transports,
      accommodations,
      vouchers,
      customPalettes
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_europa_2026_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('¡Copia de seguridad descargada exitosamente!');
  };

  const handleClearCache = () => {
    localStorage.clear();
    showNotification('Caché local reiniciada. Recargando datos...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[var(--border-card)] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--city-primary)] text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Panel de Configuración & Preferencias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Ajustes del Viaje & Personalización
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Control de tema (Claro / Oscuro), personalización de gradientes de ciudad y gestión de sesión con PIN.
          </p>
        </div>

        {savedNotice && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in flex items-center gap-1.5">
            <Check size={14} />
            <span>{savedNotice}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Apariencia & Modo Dual */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <Palette className="w-5 h-5 text-[var(--city-primary)]" />
              <h3 className="text-base font-black">Tema Visual</h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30">
              {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            El tema conmuta entre modo oscuro translúcido y modo claro con acabado satinado. Los colores de la ciudad cambian automáticamente día a día según el itinerario.
          </p>

          {/* Light / Dark Buttons */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[var(--bg-canvas)] rounded-2xl border border-[var(--border-card)]">
            <button
              onClick={() => {
                setTheme('light');
                showNotification('Modo Claro activado');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                theme === 'light' 
                  ? 'bg-[var(--bg-card)] text-amber-500 shadow-sm border border-[var(--border-card)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun size={16} />
              <span>Modo Claro</span>
            </button>

            <button
              onClick={() => {
                setTheme('dark');
                showNotification('Modo Oscuro activado');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                theme === 'dark' 
                  ? 'bg-[var(--bg-card)] text-sky-400 shadow-sm border border-[var(--border-card)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon size={16} />
              <span>Modo Oscuro</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-[var(--border-card)] flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
            <Compass size={16} className="text-[var(--city-primary)] shrink-0" />
            <span>
              <strong>Cambio cromático automático:</strong> Roma, Londres, Oxford, Barcelona, Girona, Madrid y Toledo adoptan sus colores al consultar el día correspondiente.
            </span>
          </div>
        </div>

        {/* 2. Personalización de Gradientes por Ciudad */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <Sliders className="w-5 h-5 text-[var(--city-primary)]" />
              <h3 className="text-base font-black">Gradientes por Ciudad</h3>
            </div>
            <span className="text-[10px] font-bold uppercase text-[var(--city-primary)]">
              7 Ciudades
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            Configura los tonos de color característicos y gradiente para cada ciudad (4 principales + 3 secundarias).
          </p>

          {/* City selector pills */}
          <div className="flex flex-wrap gap-1.5">
            {citiesList.map(c => {
              const isSelected = selectedCityToEdit === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setSelectedCityToEdit(c.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[var(--city-glow)] border-[var(--city-primary)] text-[var(--city-primary)]'
                      : 'bg-white/5 border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Color inputs for active selected city */}
          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Ajustar tonos de {citiesList.find(c => c.code === selectedCityToEdit)?.name}:
              </span>
              {/* Preview chip */}
              <div 
                className="w-16 h-6 rounded-full border border-white/20 shadow-xs"
                style={{
                  background: `linear-gradient(135deg, ${activePal.primary}, ${activePal.secondary})`
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                  Color Primario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activePal.primary}
                    onChange={(e) => setCityPalette(selectedCityToEdit, e.target.value, activePal.secondary)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-[var(--text-primary)] font-bold uppercase">
                    {activePal.primary}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[var(--text-secondary)] block mb-1">
                  Color Secundario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activePal.secondary}
                    onChange={(e) => setCityPalette(selectedCityToEdit, activePal.primary, e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-[var(--text-primary)] font-bold uppercase">
                    {activePal.secondary}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const found = citiesList.find(c => c.code === selectedCityToEdit);
                if (found) {
                  setCityPalette(selectedCityToEdit, found.defaultPrimary, found.defaultSecondary);
                  showNotification(`Restablecidos colores originales de ${found.name}`);
                }
              }}
              className="text-[10px] text-[var(--city-primary)] font-bold hover:underline block pt-1"
            >
              Restablecer valores originales de fábrica
            </button>
          </div>
        </div>

        {/* 3. Seguridad & Sesión de Usuario */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
              <Lock className="w-5 h-5 text-[var(--city-primary)]" />
              <h3 className="text-base font-black">Sesión & Control de Acceso</h3>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
              userSession?.role === 'ADMIN' 
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' 
                : userSession?.role === 'TRAVELER'
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
            }`}>
              {userSession?.role === 'ADMIN' ? 'Administrador' : userSession?.role === 'TRAVELER' ? 'Viajero' : 'Invitado'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{userSession?.avatarEmoji || '👦🏻'}</span>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {userSession?.name || 'Usuario Activo'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {userSession?.role === 'ADMIN' ? 'Permisos totales para editar, añadir vouchers y gastos' : 'Modo visualización y registro de gastos'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsLockScreenOpen(true)}
              className="px-3 py-2 rounded-xl bg-[var(--city-primary)] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <Lock size={13} />
              <span>Bloquear / Cambiar</span>
            </button>
          </div>

          <div className="text-[11px] text-[var(--text-secondary)] space-y-1">
            <p>• <strong>Modo Administrador:</strong> Permite modificar vouchers, editar paradas e ingresar ajustes bancarios.</p>
            <p>• <strong>Modo Invitado:</strong> Solo lectura; bloquea alteraciones accidentales de datos.</p>
          </div>
        </div>

        {/* 4. Respaldo de Datos & Caché */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl space-y-4">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <ShieldCheck className="w-5 h-5 text-[var(--city-primary)]" />
            <h3 className="text-base font-black">Copia de Seguridad & Portabilidad</h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Descarga una copia completa en JSON de todo el itinerario, hoteles, vouchers y gastos para respaldarlo o migrarlo a otro dispositivo.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handleExportFullBackup}
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-card)] text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Download size={15} className="text-[var(--city-primary)]" />
              <span>Descargar Backup JSON</span>
            </button>

            <button
              onClick={handleClearCache}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RefreshCw size={14} />
              <span>Limpiar Caché Local</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
