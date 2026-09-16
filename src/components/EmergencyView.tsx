import React from 'react';
import { 
  ShieldAlert, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Mail, 
  Clock, 
  ExternalLink, 
  Building 
} from 'lucide-react';
const CONSULATES: any[] = [];
const GENERAL_EMERGENCIES: any = { ROMA: {country: '', emergencyNumber: '', policeNumber: '', medicalNumber: '', notes: ''} };
const CITY_SCAMS: Record<string, {title: string; desc: string; solution: string;}[]> = { ROMA: [], LONDRES: [], BARCELONA: [], MADRID: [] };

export const EmergencyView: React.FC = () => {
  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Seguridad, Consulados & Asistencia 24 Horas</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Contactos de Emergencia & Prevención
        </h2>
        <p className="text-xs text-slate-400">
          Guardias consulares 24 hs de Argentina en Roma, Londres, Barcelona y Madrid, números de policía y catálogo de estafas frecuentes.
        </p>
      </div>

      {/* European & British General Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GENERAL_EMERGENCIES.map((em, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {em.country}
              </h3>
              <span className="font-mono text-xl font-black text-rose-400">
                {em.emergencyNumber}
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <p><strong>Policía:</strong> {em.policeNumber}</p>
              <p><strong>Médico / Ambulancia:</strong> {em.medicalNumber}</p>
              <p className="text-slate-400 pt-1 border-t border-slate-800/80">{em.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Consulates Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">
          Consulados Argentinos (Guardias de Emergencia 24 hs)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONSULATES.map((consulate) => (
            <div
              key={consulate.cityCode}
              id={`consulate-card-${consulate.cityCode}`}
              className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {consulate.country}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    Consulado en {consulate.city}
                  </h4>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>{consulate.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{consulate.hours}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{consulate.email}</span>
                </p>
              </div>

              {/* Emergency Hotline Button */}
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-300 block">
                    Guardia de Emergencia 24hs
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {consulate.emergencyPhone}
                  </span>
                </div>
                <a
                  href={`tel:${typeof consulate.emergencyPhone === 'string' ? consulate.emergencyPhone.split(' ')[0] : ''}`}
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                  title="Llamar ahora"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Google Maps link */}
              <a
                href={consulate.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Ver ubicación del Consulado</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Scams Catalog */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Catálogo de Estafas Frecuentes por Ciudad
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(CITY_SCAMS).map(([cityCode, scams]) => (
            <div key={cityCode} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {cityCode}
              </span>
              <div className="space-y-3">
                {scams.map((scam, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <h5 className="font-bold text-white">{scam.title}</h5>
                    <p className="text-slate-400">{scam.desc}</p>
                    <p className="text-emerald-400">
                      <strong>Cómo actuar: </strong>{scam.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
