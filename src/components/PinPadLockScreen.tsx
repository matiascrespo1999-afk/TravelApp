import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Lock, Eye, ArrowRight, KeyRound } from 'lucide-react';
import { TripMember, Role } from '../types';
import { loginTraveler, loginGuest, resetPin } from '../lib/auth';

interface PinPadLockScreenProps {
  members: TripMember[];
  isOpen: boolean;
  onClose?: () => void;
}

export const PinPadLockScreen: React.FC<PinPadLockScreenProps> = ({
  members,
  isOpen,
  onClose
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (members.length > 0 && (!selectedMemberId || !members.some(m => m.id === selectedMemberId || m.uid === selectedMemberId))) {
      setSelectedMemberId(members[0].id || members[0].uid);
    }
  }, [members, selectedMemberId]);

  const activeMember = members.find(m => m.id === selectedMemberId || m.uid === selectedMemberId) || members[0];

  useEffect(() => {
    setPin('');
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [selectedMemberId]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6 && !isAuthenticating) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (isAuthenticating) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  // Physical keyboard listener (0-9, Backspace)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, isAuthenticating, activeMember]);

  const verifyPin = async (enteredPin: string) => {
    if (!activeMember) return;
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      // PIN is 6 digits long, perfectly compatible with Firebase Auth passwords
      await loginTraveler(activeMember.email, enteredPin);
      // Success! auth listener in TripStoreContext will close the modal.
    } catch (err: any) {
      setErrorShake(true);
      setErrorMessage('PIN incorrecto o error de red');
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 700);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsAuthenticating(true);
    try {
      await loginGuest();
    } catch (e) {
      setErrorMessage('Error accediendo como invitado');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleForgotPin = async () => {
    if (!activeMember || !activeMember.email) return;
    setIsAuthenticating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await resetPin(activeMember.email);
      setSuccessMessage('Email de restablecimiento enviado.');
    } catch (e) {
      setErrorMessage('Error al enviar el email.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-[2.5rem] bg-[var(--bg-canvas)] border border-[var(--border-card)] shadow-2xl p-6 sm:p-7 flex flex-col items-center relative overflow-hidden"
      >
        {/* Glow ambient */}
        <div 
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: activeMember?.color || 'var(--city-primary)' }}
        />

        {/* Header Branding */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/25 text-[11px] font-bold uppercase tracking-wider">
            <Lock size={12} />
            <span>Acceso Seguro Travel Hub</span>
          </div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
            ¿Quién eres?
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Elige tu perfil para personalizar tus vouchers y gastos
          </p>
        </div>

        {/* User Selection Chips */}
        {members.length === 0 ? (
          <div className="py-4 text-center text-xs text-[var(--text-secondary)] animate-pulse">
            Sincronizando perfiles del viaje desde Firestore...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
            {members.map((t) => {
              const memberKey = t.id || t.uid;
              const isSelected = selectedMemberId === memberKey || (!selectedMemberId && activeMember?.uid === t.uid);
              const isAdmin = t.role === 'ADMIN';
              return (
                <button
                  key={memberKey}
                  type="button"
                  onClick={() => setSelectedMemberId(memberKey)}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 relative cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-card)] border-[var(--city-primary)] shadow-md scale-[1.02] ring-1 ring-[var(--city-primary)]/40'
                      : 'bg-white/5 hover:bg-white/10 border-[var(--border-card)] opacity-70'
                  }`}
                >
                  <span className="text-2xl">{t.avatarUrl ? <img src={t.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full"/> : (isAdmin ? '👑' : '✈️')}</span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{t.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isAdmin ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {isAdmin ? 'Administrador' : 'Viajero'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* PIN Keyboard Indicator */}
        <div className="text-[11px] text-[var(--text-secondary)] mb-2 font-medium flex items-center gap-1.5 opacity-60">
          <span>Ingresa tu PIN de 6 dígitos</span>
        </div>

        {/* PIN Dots Indicator */}
        <motion.div
          animate={errorShake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3.5 mb-6"
        >
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[var(--city-primary)] scale-110 shadow-sm'
                    : 'border-2 border-[var(--border-card)] bg-white/5'
                }`}
              />
            );
          })}
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-bold text-rose-500 mb-4"
            >
              {errorMessage}
            </motion.p>
          )}
          {successMessage && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-bold text-emerald-400 mb-4"
            >
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Numeric Keypad 3x4 */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isAuthenticating}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] active:scale-95 border border-[var(--border-card)] text-[var(--text-primary)] font-bold text-lg transition-all flex items-center justify-center shadow-xs disabled:opacity-50"
            >
              {digit}
            </button>
          ))}

          {/* Guest Fast Button */}
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={handleGuestLogin}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-[var(--border-card)] text-[var(--text-secondary)] font-medium text-[11px] transition-all flex flex-col items-center justify-center p-1 disabled:opacity-50"
            title="Ingresar como invitado sin PIN"
          >
            <Eye size={16} className="text-slate-400 mb-0.5" />
            <span>Invitado</span>
          </button>

          <button
            type="button"
            disabled={isAuthenticating}
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] active:scale-95 border border-[var(--border-card)] text-[var(--text-primary)] font-bold text-lg transition-all flex items-center justify-center shadow-xs disabled:opacity-50"
          >
            0
          </button>

          <button
            type="button"
            disabled={isAuthenticating}
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 border border-[var(--border-card)] text-[var(--text-secondary)] transition-all flex items-center justify-center disabled:opacity-50"
            title="Borrar dígito"
          >
            <Delete size={18} />
          </button>
        </div>

        {/* Bottom Fast Guest Link & Forgot PIN */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-[var(--border-card)] text-[11px] text-[var(--text-secondary)]">
          <button
            type="button"
            disabled={isAuthenticating}
            onClick={handleForgotPin}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            <KeyRound size={11} />
            <span>¿Olvidaste el PIN?</span>
          </button>
          
          <button
            type="button"
            onClick={handleGuestLogin}
            className="text-[var(--city-primary)] font-bold hover:underline flex items-center gap-1"
          >
            <span>Modo Invitado</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
