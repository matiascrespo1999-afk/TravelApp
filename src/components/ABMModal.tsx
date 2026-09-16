import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, Key, MapPin, Clock, FileText, Compass } from 'lucide-react';
import { useTripStore } from '../context/TripStoreContext';

export interface ABMModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'activity' | 'accommodation' | 'transport' | 'voucher' | 'tour';
  entityId: string;
  initialData?: any;
}

export const ABMModal: React.FC<ABMModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  initialData
}) => {
  const store = useTripStore();
  const [formData, setFormData] = useState<any>(initialData || {});

  // Update internal form data whenever initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    switch (entityType) {
      case 'accommodation':
        store.updateAccommodation(entityId, formData);
        break;
      case 'activity':
        store.updateActivity(entityId, formData);
        break;
      case 'transport':
        store.updateTransport(entityId, formData);
        break;
      case 'voucher':
        store.updateVoucher(entityId, formData);
        break;
      case 'tour':
        store.updateTour(entityId, formData);
        break;
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      switch (entityType) {
        case 'accommodation':
          store.deleteAccommodation(entityId);
          break;
        case 'activity':
          store.deleteActivity(entityId);
          break;
        case 'transport':
          store.deleteTransport(entityId);
          break;
        case 'voucher':
          store.deleteVoucher(entityId);
          break;
        case 'tour':
          store.deleteTour(entityId);
          break;
      }
      onClose();
    }
  };

  const getTitle = () => {
    switch (entityType) {
      case 'accommodation': return 'Editar Alojamiento & PIN';
      case 'activity': return 'Editar Actividad / Hito';
      case 'transport': return 'Editar Transporte & Logística';
      case 'voucher': return 'Editar Voucher & Reserva';
      case 'tour': return 'Editar Recorrido o Walking Tour';
      default: return 'Editar Registro';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl overflow-hidden glass-dock shadow-2xl border border-white/20 z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm">
                ABM
              </span>
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">{getTitle()}</h3>
                <p className="text-xs text-white/50">ID: {entityId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-sm">
            {entityType === 'accommodation' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Nombre del Alojamiento</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                    <Key className="w-4 h-4" /> PIN / Código de Puerta (Teclado)
                  </label>
                  <input
                    type="text"
                    value={formData.doorPin || ''}
                    onChange={e => handleChange('doorPin', e.target.value)}
                    placeholder="Ej: 5688 o HA-SW0P31"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-amber-500/40 text-amber-200 font-mono text-base font-bold focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    Este PIN se sincroniza en toda la app y en los vouchers de forma inmediata.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Localizador Reserva</label>
                    <input
                      type="text"
                      value={formData.bookingCode || ''}
                      onChange={e => handleChange('bookingCode', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Horario Check-in</label>
                    <input
                      type="text"
                      value={formData.checkInTime || ''}
                      onChange={e => handleChange('checkInTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Dirección Exacta</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={e => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Enlace Google Maps</label>
                  <input
                    type="text"
                    value={formData.mapsUrl || ''}
                    onChange={e => handleChange('mapsUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Instrucciones de Acceso</label>
                  <textarea
                    rows={3}
                    value={formData.instructions || ''}
                    onChange={e => handleChange('instructions', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </>
            )}

            {entityType === 'activity' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-white/70 mb-1">Título de la Actividad</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={e => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Horario</label>
                    <input
                      type="text"
                      value={formData.time || ''}
                      onChange={e => handleChange('time', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Etiqueta de Tipo</label>
                  <input
                    type="text"
                    value={formData.typeLabel || ''}
                    onChange={e => handleChange('typeLabel', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Notas / Reserva</label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={e => handleChange('notes', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Secreto de Viajero (Tip Experto)</label>
                  <textarea
                    rows={2}
                    value={formData.insiderSecret || ''}
                    onChange={e => handleChange('insiderSecret', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Enlace Google Maps</label>
                  <input
                    type="text"
                    value={formData.maps || ''}
                    onChange={e => handleChange('maps', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">ID Walking Tour Vinculado</label>
                    <input
                      type="text"
                      value={formData.walkingTourId || ''}
                      onChange={e => handleChange('walkingTourId', e.target.value)}
                      placeholder="Ej: d2_walk_roma"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">ID Recorrido Interno Vinculado</label>
                    <input
                      type="text"
                      value={formData.internalTourId || ''}
                      onChange={e => handleChange('internalTourId', e.target.value)}
                      placeholder="Ej: internal_vaticano"
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {entityType === 'voucher' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Título del Voucher</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Código / PIN / Localizador</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={e => handleChange('code', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Detalle / Instrucciones</label>
                  <textarea
                    rows={2}
                    value={formData.detail || ''}
                    onChange={e => handleChange('detail', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">URL de Descarga / Drive / Web</label>
                  <input
                    type="text"
                    value={formData.fileUrl || ''}
                    onChange={e => handleChange('fileUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  />
                </div>
              </>
            )}

            {entityType === 'transport' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Nombre / Trayecto</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Origen</label>
                    <input
                      type="text"
                      value={formData.origin || ''}
                      onChange={e => handleChange('origin', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">Destino</label>
                    <input
                      type="text"
                      value={formData.destination || ''}
                      onChange={e => handleChange('destination', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Detalles / Pasajes</label>
                  <textarea
                    rows={2}
                    value={formData.details || ''}
                    onChange={e => handleChange('details', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition-colors text-xs font-medium"
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-colors text-xs"
              >
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
