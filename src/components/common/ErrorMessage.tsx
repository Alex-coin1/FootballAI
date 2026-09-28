import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Unable to connect to football data network.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/20 p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-red-400 mb-2" />
      <h4 className="text-sm font-bold text-red-200">Connection Interrupted</h4>
      <p className="mt-1 text-xs text-red-300/80 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 rounded-xl bg-red-900/60 border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-800 transition"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-800 rounded-full" />
            <div className="h-3 w-12 bg-slate-800 rounded-full" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="h-5 w-28 bg-slate-800 rounded" />
            <div className="h-6 w-10 bg-slate-800 rounded" />
            <div className="h-5 w-28 bg-slate-800 rounded" />
          </div>
          <div className="h-8 w-full bg-slate-800/60 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
