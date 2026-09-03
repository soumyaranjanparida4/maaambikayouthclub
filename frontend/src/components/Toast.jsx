import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-600 border-emerald-400 text-white',
    error: 'bg-rose-600 border-rose-400 text-white',
    info: 'bg-amber-500 border-amber-300 text-brand-blue-950',
  };

  const Icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = Icons[type] || CheckCircle2;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl transition-all duration-300 animate-fade-in ${bgColors[type] || bgColors.success}`}>
      <Icon className="w-6 h-6 shrink-0" />
      <span className="text-sm font-bold tracking-wide">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-80 transition-opacity ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
