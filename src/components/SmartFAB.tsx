import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  Search, 
  Plane, 
  Sparkles,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartFABProps {
  onOpenAddExpense: () => void;
  onOpenSpotlight: () => void;
  onOpenTransports: () => void;
  onOpenAssistant?: () => void;
}

export const SmartFAB: React.FC<SmartFABProps> = ({
  onOpenAddExpense,
  onOpenSpotlight,
  onOpenTransports,
  onOpenAssistant
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-40 flex flex-col items-end">
      
      {/* Expanded Quick Actions Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="mb-3 space-y-2.5 min-w-[210px]"
          >
            {/* 1. Cargar Gasto Rápido */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAddExpense();
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-[var(--city-primary)] text-white font-bold text-xs shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4" />
                <span>Cargar Gasto</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* 2. Buscar (Spotlight Cmd+K) */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSpotlight();
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-[var(--bg-card)] backdrop-blur-2xl text-[var(--text-primary)] border border-[var(--border-card)] font-bold text-xs shadow-xl hover:border-[var(--city-primary)]/50 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-500" />
                <span>Buscar</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] px-1.5 py-0.5 rounded-full bg-[var(--bg-canvas)] border border-[var(--border-card)]">
                ⌘K
              </span>
            </button>

            {/* 3. Ver Billetes & PNRs */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenTransports();
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-[var(--bg-card)] backdrop-blur-2xl text-[var(--text-primary)] border border-[var(--border-card)] font-bold text-xs shadow-xl hover:border-[var(--city-primary)]/50 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4 text-emerald-500" />
                <span>Ver Billetes & PNRs</span>
              </div>
            </button>

            {/* 4. Asistente IA */}
            {onOpenAssistant && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-full bg-[var(--bg-card)] backdrop-blur-2xl text-[var(--text-primary)] border border-[var(--border-card)] font-bold text-xs shadow-xl hover:border-[var(--city-primary)]/50 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-purple-500" />
                  <span>Asistente IA</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Round Button (Apple Liquid Glass) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Acciones Rápidas"
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, #e11d48, #be123c)'
            : 'linear-gradient(135deg, var(--city-primary), var(--city-secondary))',
          boxShadow: '0 8px 32px var(--city-glow)'
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black shadow-2xl transition-all duration-300 border border-white/25 ring-4 ring-white/10 hover:scale-105 active:scale-95 ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
