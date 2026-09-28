import React, { useState, useEffect } from 'react';
import { Timer, Radio, CheckCircle2 } from 'lucide-react';
import { Match } from '../../types';
import { useApp } from '../../context/AppContext';

interface MatchCountdownProps {
  match: Match;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const MatchCountdown: React.FC<MatchCountdownProps> = ({
  match,
  size = 'sm',
  showIcon = true,
  className = ''
}) => {
  const { settings, t } = useApp();
  const isAr = settings.language === 'ar';

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = match.timestamp || (match.date ? new Date(`${match.date} ${match.time || match.kickoff || '20:00'}`).getTime() : Date.now());
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: diff,
          isPast: true
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalMs: diff,
          isPast: false
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [match.timestamp, match.date, match.time, match.kickoff]);

  // If match is explicitly LIVE
  if (match.status === 'LIVE') {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-0.5 font-tech text-emerald-400 text-xs font-bold ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Radio className="h-3 w-3 animate-pulse" />
        <span>{isAr ? 'مباشر' : 'LIVE'} {match.minute || match.currentMinute || 65}'</span>
      </div>
    );
  }

  // If match is FINISHED
  if (match.status === 'FINISHED') {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-slate-900/60 px-2.5 py-0.5 font-tech text-slate-400 text-xs ${className}`}>
        <CheckCircle2 className="h-3 w-3 text-slate-500" />
        <span>{isAr ? 'انتهت' : 'FT • Finished'}</span>
      </div>
    );
  }

  // If kickoff time has arrived but not marked live yet
  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-2.5 py-0.5 font-tech text-amber-300 text-xs font-bold animate-pulse ${className}`}>
        <Timer className="h-3 w-3 text-amber-400" />
        <span>{isAr ? 'صافرة البداية وشيكة' : 'Kickoff Imminent'}</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2; // Under 2 hours
  const isToday = timeLeft.days === 0;

  // Format countdown string
  const pad = (n: number) => n.toString().padStart(2, '0');

  let countdownText = '';
  if (isAr) {
    if (timeLeft.days > 0) {
      countdownText = `${timeLeft.days}ي ${pad(timeLeft.hours)}س ${pad(timeLeft.minutes)}د ${pad(timeLeft.seconds)}ث`;
    } else {
      countdownText = `${pad(timeLeft.hours)}س ${pad(timeLeft.minutes)}د ${pad(timeLeft.seconds)}ث`;
    }
  } else {
    if (timeLeft.days > 0) {
      countdownText = `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
    } else {
      countdownText = `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;
    }
  }

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2',
    lg: 'text-base px-4 py-1.5 gap-2.5'
  };

  const colorStyles = isUrgent
    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/80 to-amber-950/80 text-rose-300 shadow-sm shadow-rose-900/20'
    : isToday
    ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
    : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300';

  return (
    <div
      className={`inline-flex items-center rounded-full border font-tech font-bold tracking-tight select-none ${sizeStyles[size]} ${colorStyles} ${className}`}
      title={isAr ? `تبدأ المباراة خلال ${countdownText}` : `Match kicks off in ${countdownText}`}
    >
      {showIcon && (
        <Timer className={`shrink-0 ${size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} ${isUrgent ? 'animate-bounce text-rose-400' : 'text-cyan-400'}`} />
      )}
      <span className="flex items-center gap-1 font-mono">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-sans mr-0.5">
          {isAr ? 'يبدأ خلال' : 'Starts In'}
        </span>
        <span className="font-extrabold">{countdownText}</span>
      </span>
    </div>
  );
};
