import React, { useState } from 'react';
import { 
  Ticket, 
  Copy, 
  Check, 
  ExternalLink, 
  Plane, 
  Building2, 
  Train, 
  Landmark, 
  MapPin, 
  FolderOpen,
  Plus
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { Voucher, Accommodation, Transport } from '../types';
import { ABMMenu } from './ABMMenu';
import { ABMModal } from './ABMModal';

export const VouchersView: React.FC = () => {
  const [cityFilter, setCityFilter] = useState<string>('TODAS');
  const [typeFilter, setTypeFilter] = useState<string>('TODOS');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const { vouchers, transports, accommodations, config } = useTripStore();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Synthesize vouchers from accommodations and transports
  const derivedVouchers: Voucher[] = [];

  (Object.values(accommodations || {}) as Accommodation[]).forEach(acc => {
    derivedVouchers.push({
      id: `acc_${acc.id}`,
      type: 'HOTEL',
      title: acc.name || 'Alojamiento',
      cityCode: acc.cityCode,
      cityName: acc.cityName || acc.cityCode,
      date: acc.checkInTime ? String(acc.checkInTime).split('T')[0] : 'Fechas en itinerario',
      code: acc.bookingCode || acc.doorPin || 'Sin PIN',
      detail: acc.address || 'Ver dirección en detalle',
      link: acc.mapsUrl || config.driveFolderUrl,
      btnText: 'Abrir Maps',
      maps: acc.mapsUrl
    });
  });

  (Object.values(transports || {}) as Transport[]).forEach(trans => {
    derivedVouchers.push({
      id: `trans_${trans.id}`,
      type: trans.type || 'VUELO',
      title: trans.routeTitle || `${trans.company} ${trans.number || ''}`.trim(),
      cityCode: trans.originCity as any,
      cityName: trans.originCity,
      date: trans.depTime ? String(trans.depTime).split('T')[0] : 'Fecha en itinerario',
      code: trans.pnrDisplay || 'Consultar App',
      detail: `${trans.originCity} ➔ ${trans.destCity} | Equipaje: ${trans.baggage || 'N/A'}`,
      link: trans.ticketDriveUrl || trans.checkinUrl || config.driveFolderUrl,
      btnText: 'Ver Documento'
    });
  });

  const allVouchers = [...vouchers, ...derivedVouchers];

  const filteredVouchers = allVouchers.filter(v => {
    const matchesCity = cityFilter === 'TODAS' || v.cityCode === cityFilter;
    const matchesType = typeFilter === 'TODOS' || v.type === typeFilter;
    return matchesCity && matchesType;
  });

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-4 h-4" />
            <span>Centro de Reservas y Vouchers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {allVouchers.length} Billetes, Entradas y Alojamientos
          </h2>
          <p className="text-xs text-white/70">
            Localizadores oficiales, PINs de acceso y PDFs en Google Drive. Editables mediante el menú de 3 puntos.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Voucher</span>
          </button>

          <a
            href={config.driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all shadow-md"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Carpeta Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filters: Cities & Types */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* City Filter Pills */}
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

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 glass-card rounded-2xl w-full sm:w-auto">
          {['TODOS', 'VUELO', 'HOTEL', 'TOUR', 'TREN'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === type
                  ? 'bg-orange-500 text-slate-950 font-bold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {type === 'TODOS' ? 'Todos los tipos' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVouchers.map((voucher) => (
          <VoucherCard
            key={voucher.id}
            voucher={voucher}
            onCopy={copyToClipboard}
            copied={copiedId === voucher.id}
          />
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <ABMModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          entityType="voucher"
          isNew={true}
        />
      )}

    </div>
  );
};

interface VoucherCardProps {
  voucher: Voucher;
  onCopy: (text: string, id: string) => void;
  copied: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onCopy, copied }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'VUELO': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'HOTEL': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'TREN': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'TOUR': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all shadow-md flex flex-col justify-between gap-4 relative">
      
      {/* Top: City, Type, Date & ABM */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTypeBadge(voucher.type)}`}>
            {voucher.type} · {voucher.cityCode}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/60">
              {voucher.date}
            </span>
            <ABMMenu
              entityType="voucher"
              entityId={voucher.id}
              initialData={voucher}
            />
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {voucher.title}
        </h3>

        <p className="text-xs text-white/80 leading-relaxed">
          {voucher.detail}
        </p>
      </div>

      {/* Middle: Copyable Code box */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">
            Código / PIN / Localizador
          </span>
          <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 select-all">
            {voucher.code}
          </span>
        </div>
        <button
          onClick={() => onCopy(voucher.code, voucher.id)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Copiar código"
        >
          {copied ? (
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

      {/* Bottom: Action buttons (Drive link, Maps link) */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={voucher.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
        >
          <span>{voucher.btnText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {voucher.maps && (
          <a
            href={voucher.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            title="Ver ubicación en Google Maps"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
          </a>
        )}
      </div>

    </div>
  );
};
