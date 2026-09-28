import React, { useState } from 'react';
import { Team } from '../../types';
import { Shield } from 'lucide-react';

interface TeamLogoProps {
  team: Team;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  imgClassName?: string;
}

const sizeClasses = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const badgeClasses = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-sm',
  xl: 'h-16 w-16 text-base',
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  team,
  size = 'md',
  className = '',
  imgClassName = ''
}) => {
  const [useProxy, setUseProxy] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const rawUrl = team?.logoUrl || team?.logo;
  const initialLogoUrl = rawUrl?.trim();

  const currentSrc = useProxy && initialLogoUrl
    ? `/api/crest-proxy?url=${encodeURIComponent(initialLogoUrl)}`
    : initialLogoUrl;

  const handleImageError = () => {
    if (!useProxy && initialLogoUrl && initialLogoUrl.includes('crests.football-data.org')) {
      setUseProxy(true);
    } else {
      setHasError(true);
    }
  };

  // Generate fallback club abbreviation (e.g. "ARS", "RMA")
  const getAbbreviation = () => {
    if (team?.shortName && team.shortName.length <= 4) {
      return team.shortName.toUpperCase();
    }
    if (team?.name) {
      const parts = team.name.replace(/(FC|CF|SC|AC|SS|BSC|SV)/gi, '').trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return team.name.slice(0, 3).toUpperCase();
    }
    return 'FC';
  };

  const primaryColor = team?.primaryColor || '#00f0ff';

  if (!initialLogoUrl || hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl font-bold font-tech select-none shrink-0 border border-slate-700/60 shadow-inner ${badgeClasses[size]} ${className}`}
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))`,
          color: primaryColor,
          boxShadow: `inset 0 0 12px ${primaryColor}22`
        }}
        title={team?.name || 'Club'}
      >
        <span className="tracking-tighter drop-shadow-sm flex items-center justify-center gap-0.5">
          {getAbbreviation()}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!isLoaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/60 animate-pulse border border-slate-800 ${sizeClasses[size]}`}
        >
          <Shield className="h-3 w-3 text-slate-600" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={team?.name || 'Team crest'}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`${sizeClasses[size]} object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
