import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  X, 
  Table, 
  Calendar, 
  Plane, 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';
import { Transport, Accommodation, TravelerTicket } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

interface AdminDbInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDbInspectorModal: React.FC<AdminDbInspectorModalProps> = ({ isOpen, onClose }) => {
  const store = useTripStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'transports' | 'accommodations' | 'travelers' | 'raw'>('overview');
  const [cloudStatus, setCloudStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [copied, setCopied] = useState(false);
  const [firestoreRaw, setFirestoreRaw] = useState<any>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const checkLiveFirestore = async () => {
    setCloudStatus('checking');
    try {
      const tripId = store.trip?.id || 'TRIP_CURRENT';
      const docRef = doc(db, 'trips', tripId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setCloudStatus('connected');
        setFirestoreRaw(snap.data());
      } else {
        setCloudStatus('connected');
        setFirestoreRaw(null);
      }
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Firestore check error:', e);
      setCloudStatus('error');
      setLastCheckTime(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkLiveFirestore();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-white/15 shadow-2xl overflow-hidden bg-slate-950/95 text-slate-100">
        
        {/* Compact, clean Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Base de Datos Firestore</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 ${
                  cloudStatus === 'connected' 
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' 
                    : cloudStatus === 'checking'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25 animate-pulse'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/25'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {cloudStatus === 'connected' ? 'En Vivo' : cloudStatus === 'checking' ? 'Consultando...' : 'Reconectando'}
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono mt-0.5 truncate max-w-[260px] sm:max-w-md">
                {firebaseConfig.projectId} • {firebaseConfig.firestoreDatabaseId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={checkLiveFirestore}
              title="Refrescar"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Cerrar"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Minimal metrics row */}
        <div className="grid grid-cols-4 gap-1.5 px-4 py-2.5 bg-white/[0.01] border-b border-white/10 text-[11px]">
          <div className="text-center py-1.5 px-1 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/50">Días</div>
            <strong className="text-white font-mono text-sm">{(store.itinerary || []).length}</strong>
          </div>
          <div className="text-center py-1.5 px-1 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/50">Actividades</div>
            <strong className="text-white font-mono text-sm">{(store.activities || []).length}</strong>
          </div>
          <div className="text-center py-1.5 px-1 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/50">Transportes</div>
            <strong className="text-white font-mono text-sm">{Object.keys(store.transports || {}).length}</strong>
          </div>
          <div className="text-center py-1.5 px-1 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/50">Hoteles</div>
            <strong className="text-white font-mono text-sm">{Object.keys(store.accommodations || {}).length}</strong>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 pt-2 border-b border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Estado', icon: ShieldCheck },
            { id: 'itinerary', label: 'Itinerario', icon: Calendar },
            { id: 'transports', label: 'Transportes', icon: Plane },
            { id: 'accommodations', label: 'Hoteles', icon: Building2 },
            { id: 'travelers', label: 'Viajeros', icon: Users },
            { id: 'raw', label: 'JSON', icon: Table },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 leading-relaxed text-xs">
                La base de datos está activa en <strong>Google Cloud Firestore</strong>. Todo cambio que hagas en la aplicación (gastos, notas o PINs) se sincroniza en vivo con la nube de forma bidireccional.
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <h4 className="font-semibold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Datos de Conexión
                </h4>
                <div className="space-y-2 font-mono text-[11px] text-white/80">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Proyecto:</span>
                    <span className="text-amber-300 truncate max-w-[200px]">{firebaseConfig.projectId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Base de Datos:</span>
                    <span className="text-sky-300 truncate max-w-[200px]">{firebaseConfig.firestoreDatabaseId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/50">Documento:</span>
                    <span className="text-emerald-300">trips/europa-2026</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/50">Última lectura:</span>
                    <span className="text-white/90">{lastCheckTime || 'Conectado'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                <span className="text-white/70 text-xs">Consola de Firebase (Google Cloud)</span>
                <a 
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex-shrink-0"
                >
                  <span>Abrir Consola</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* 2. ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <div className="space-y-2">
              <div className="text-xs text-white/60 mb-2">
                Mostrando los 17 días cargados en la base de datos con sus destinos y actividades asociadas:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {store.itinerary.map(day => (
                  <div key={day.day} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center font-mono">
                        {day.day}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>{day.date}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-amber-400">{day.city}</span>
                        </div>
                        <p className="text-white/60 text-[11px] truncate max-w-md">
                          {day.summary}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {store.activities.filter(a => a.day === day.day).length} actividades
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TRANSPORTS TAB */}
          {activeTab === 'transports' && (
            <div className="space-y-3">
              <div className="text-xs text-white/60 mb-2">
                Todos los vuelos y trenes con sus números de servicio, localizadores PNR y franquicia de equipaje:
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.values(store.transports || {}) as Transport[]).map((t: Transport) => (
                  <div key={t.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold font-mono">
                          {t.type}
                        </span>
                        <strong className="text-white text-sm">{t.company} ({t.number})</strong>
                      </div>
                      <span className="text-white/60 font-mono">Día {t.dayNumber}</span>
                    </div>
                    <div className="text-white/80">
                      <strong>Ruta:</strong> {t.routeTitle} • Salida: <strong>{t.depTime}</strong> → Llegada: <strong>{t.arrTime}</strong>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      {t.tickets.map((ticket: TravelerTicket) => (
                        <span key={ticket.travelerId} className="px-2 py-1 rounded bg-white/10 font-mono text-amber-300 border border-white/10">
                          {ticket.travelerName}: PNR <strong>{ticket.pnr}</strong> {ticket.seat ? `(Asiento ${ticket.seat})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. ACCOMMODATIONS TAB */}
          {activeTab === 'accommodations' && (
            <div className="space-y-3">
              <div className="text-xs text-white/60 mb-2">
                Hoteles y departamentos de Roma, Londres, Barcelona y Madrid con direcciones y PINs de acceso autónomo:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(Object.values(store.accommodations || {}) as Accommodation[]).map((acc: Accommodation) => (
                  <div key={acc.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">{acc.name}</strong>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {acc.cityName}
                      </span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-snug">
                      <MapPin className="w-3 h-3 inline mr-1 text-amber-400" />
                      {acc.address}
                    </p>
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                      <span className="text-amber-200">PIN Acceso Autónomo:</span>
                      <strong className="font-mono text-sm text-amber-300 font-black">{acc.doorPin}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TRAVELERS TAB */}
          {activeTab === 'travelers' && (
            <div className="space-y-3">
              <div className="text-xs text-white/60 mb-2">
                Viajeros configurados en la entidad compartida:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {store.travelers.map(tr => (
                  <div key={tr.id} className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/20"
                        style={{ backgroundColor: tr.colorHex }}
                      >
                        {tr.avatarEmoji}
                      </div>
                      <div>
                        <strong className="text-white text-sm block">{tr.name}</strong>
                        <span className="text-[11px] text-amber-300 font-semibold">{tr.role}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-white/70 space-y-1">
                      <div>PIN Personal: <strong className="font-mono text-white">{tr.pin}</strong></div>
                      <div>Emails vinculados: {tr.emails.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. RAW JSON TAB */}
          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Payload completo sincronizado con Firestore:</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(store, null, 2))}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-[50vh] leading-relaxed">
                {JSON.stringify({
                  cloudProject: firebaseConfig.projectId,
                  databaseId: firebaseConfig.firestoreDatabaseId,
                  documentPath: 'trips/europa-2026',
                  tripTitle: store.config.title,
                  totalDays: store.itinerary.length,
                  totalActivities: store.activities.length,
                  totalTransports: Object.keys(store.transports || {}).length,
                  totalAccommodations: Object.keys(store.accommodations || {}).length,
                  travelers: store.travelers,
                  currencyRates: store.config.currencyRates
                }, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-white/5 text-xs">
          <span className="text-white/50">
            Sincronización bidireccional activa • Google Cloud Firestore
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
