import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Trash2, Copy, Check } from 'lucide-react';
import { ABMModal } from './ABMModal';

export interface ABMMenuProps {
  entityType: 'activity' | 'accommodation' | 'transport' | 'voucher' | 'tour';
  entityId: string;
  initialData?: any;
  className?: string;
  buttonSize?: 'sm' | 'md';
}

export const ABMMenu: React.FC<ABMMenuProps> = ({
  entityType,
  entityId,
  initialData,
  className = '',
  buttonSize = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsModalOpen(true);
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(initialData || { id: entityId }, null, 2));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1200);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        title="Opciones y Edición (ABM)"
        className={`p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors ${
          buttonSize === 'sm' ? 'w-7 h-7' : 'w-8 h-8'
        } flex items-center justify-center`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div 
          onClick={e => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-44 rounded-2xl p-1.5 glass-dock shadow-2xl border border-white/20 z-40 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95"
        >
          <button
            onClick={handleOpenEdit}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-white/90 hover:bg-white/15 hover:text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Editar (ABM)</span>
          </button>

          <button
            onClick={handleCopyId}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copiar Datos JSON</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* The Universal Edit Modal */}
      <ABMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entityType={entityType}
        entityId={entityId}
        initialData={initialData}
      />
    </div>
  );
};
