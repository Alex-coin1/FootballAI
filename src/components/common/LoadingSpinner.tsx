import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading neural data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="h-6 w-6 rounded-full border-2 border-blue-500/20 border-b-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-3 text-xs font-tech text-cyan-400/80 tracking-wider animate-pulse">
        {message}
      </p>
    </div>
  );
};
