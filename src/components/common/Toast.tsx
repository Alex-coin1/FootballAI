import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm sm:w-80">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl p-3 shadow-xl backdrop-blur-md border text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#081820]/95 border-cyan-400/50 text-cyan-200 shadow-cyan-950/40'
                : toast.type === 'warning'
                  ? 'bg-[#201406]/95 border-amber-400/50 text-amber-200 shadow-amber-950/40'
                  : 'bg-[#0b1324]/95 border-blue-400/50 text-blue-200 shadow-blue-950/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-blue-400 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
