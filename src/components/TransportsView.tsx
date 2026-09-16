import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { Transport } from '../types';
import { BoardingPassCard } from './BoardingPassCard';
import { ABMModal } from './ABMModal';

interface TransportsViewProps {
  initialTransportId?: string;
}

export const TransportsView: React.FC<TransportsViewProps> = ({ initialTransportId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { transports } = useTripStore();

  const transportList: Transport[] = (Object.values(transports || {}) as Transport[]).sort((a, b) => Number(a.dayNumber) - Number(b.dayNumber));

  const handleSimulateStatusCheck = () => {
    setIsCheckingStatus(true);
    setStatusMessage('Consultando servicio de radar y API de aerolíneas...');
    setTimeout(() => {
      setIsCheckingStatus(false);
      setStatusMessage('✓ Todos los vuelos y trenes sincronizados. Vuelo Roma-Londres: ON TIME (Puerta B12).');
      setTimeout(() => setStatusMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-28">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--city-primary)] text-xs font-bold uppercase tracking-wider">
            <Plane className="w-4 h-4" />
            <span>Vuelos & Trenes de Alta Velocidad</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Billetes & Tarjetas de Embarque
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Todos los tramos del viaje con PNRs individuales, asientos, franquicia de equipaje, estado en vivo y check-in directo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleSimulateStatusCheck}
            disabled={isCheckingStatus}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[var(--bg-canvas)] hover:border-[var(--city-primary)]/40 border border-[var(--border-card)] text-xs font-bold text-[var(--text-primary)] shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--city-primary)] ${isCheckingStatus ? 'animate-spin' : ''}`} />
            <span>Verificar Estado Online</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--city-primary)] hover:opacity-90 text-white text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Billete</span>
          </button>
        </div>
      </div>

      {/* Online Status Live Notification Banner */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-[var(--city-glow)] border border-[var(--city-primary)]/30 text-xs font-bold text-[var(--city-primary)] flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Transport Boarding Passes (Uniform BoardingPassCard component) */}
      <div className="space-y-6">
        {transportList.map((tr) => (
          <BoardingPassCard
            key={tr.id}
            transport={tr}
            isSelected={initialTransportId === tr.id}
          />
        ))}
      </div>

      {/* ABM Modal for adding new transport */}
      <ABMModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="create"
        entityType="transport"
        initialData={{}}
      />
    </div>
  );
};
