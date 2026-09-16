import React from 'react';
import { Mail, HardDrive, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AssistantView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[var(--city-glow)] text-[var(--city-primary)] rounded-2xl">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Asistente Mágico</h2>
            <p className="text-sm text-[var(--text-secondary)]">Sincronización con Workspace</p>
          </div>
        </div>
        
        <p className="text-sm text-[var(--text-primary)] mb-6">
          Conecta tus cuentas para que la app lea automáticamente tus reservas de vuelos y hoteles desde Gmail, o escanee tus PDFs en Google Drive.
        </p>

        <div className="space-y-4">
          <motion.button 
            onClick={() => alert("Simulando escaneo de Google Drive...")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full glass-panel flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-canvas)] transition-colors border border-[var(--border-card)]"
          >
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
              <HardDrive size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm">Escanear Google Drive</h3>
              <p className="text-xs text-[var(--text-secondary)]">Buscar PDFs de Vouchers</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </motion.button>
          <motion.button 
            onClick={() => alert("Simulando lectura de Gmail...")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full glass-panel flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-canvas)] transition-colors border border-[var(--border-card)]"
          >
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
              <Mail size={24} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-sm">Leer Gmail</h3>
              <p className="text-xs text-[var(--text-secondary)]">Auto-cargar nuevos tickets</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
