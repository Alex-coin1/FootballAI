import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#070e1b]/40 py-12 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 mb-3">
        {icon || <SearchX className="h-6 w-6" />}
      </div>
      <h4 className="text-sm font-bold text-white font-display">{title}</h4>
      <p className="mt-1 max-w-xs text-xs text-slate-400 font-sans">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
