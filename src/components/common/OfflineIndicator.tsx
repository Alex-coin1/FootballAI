import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { t } = useApp();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-6 md:right-auto z-50 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-[#171306]/95 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-amber-300 shadow-xl shadow-amber-950/50 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>{t.offlineNotice}</span>
    </div>
  );
};
