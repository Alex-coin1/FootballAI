import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Search, 
  Cpu, 
  ChevronRight, 
  Radio, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Filter,
  RefreshCw,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getMatches, syncRealMatches, getGameWeeks } from '../services/footballApi';
import { Match, MatchStatus, LeagueId } from '../types';
import { TeamLogo } from '../components/common/TeamLogo';
import { MatchCountdown } from '../components/common/MatchCountdown';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { 
  localizeTeamName, 
  localizeLeagueName, 
  localizeWeekLabel, 
  localizeChoice 
} from '../i18n/localize';

export const MatchesPage: React.FC = () => {
  const { setSelectedMatch, settings, t } = useApp();
  const [activeStatus, setActiveStatus] = useState<MatchStatus | 'ALL'>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [gameWeeks, setGameWeeks] = useState<{ week: number; label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const leagueParam = selectedLeague === 'All' 
        ? undefined 
        : selectedLeague === 'Premier League' ? 'premier-league'
        : selectedLeague === 'La Liga' ? 'la-liga'
        : selectedLeague === 'UEFA Champions League' ? 'champions-league'
        : undefined;

      const weekParam = selectedWeek === 'ALL' ? undefined : selectedWeek;
      const data = await getMatches(activeStatus, leagueParam as LeagueId | undefined, weekParam);
      setMatches(data);

      const weeks = await getGameWeeks();
      setGameWeeks(weeks);
    } catch {
      setError('Unable to synchronize live football telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [activeStatus, selectedLeague, selectedWeek]);

  const handleWeeklySync = async () => {
    setIsSyncing(true);
    setSyncStatus(t.syncingWeeklyFixtures);
    try {
      const res = await syncRealMatches();
      await loadMatches();
      setSyncStatus(`${t.weeklySyncSuccess}${res.nextWeeklyUpdate}`);
      setTimeout(() => setSyncStatus(null), 4000);
    } catch {
      setSyncStatus(t.weeklySyncCached);
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Strictly Spanish League, English Premier League, and Champions League only
  const leagues = [
    { id: 'All', name: t.allLeagues, originalName: 'All', icon: '🏆', count: 3 },
    { id: 'Premier League', name: t.premierLeague, originalName: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sub: t.englishLeague },
    { id: 'La Liga', name: t.laLiga, originalName: 'La Liga', icon: '🇪🇸', sub: t.spanishLeague },
    { id: 'UEFA Champions League', name: t.championsLeague, originalName: 'UEFA Champions League', icon: '⭐', sub: t.europeanElite }
  ];

  const filteredMatches = matches.filter(match => {
    const matchesQuery = searchQuery === '' || 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizeTeamName(match.homeTeam.name, settings.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizeTeamName(match.awayTeam.name, settings.language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.leagueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localizeLeagueName(match.leagueName, settings.language).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Trophy className="h-5 w-5 text-cyan-400" />
            <span>{t.matches}</span>
          </h1>
          <button
            onClick={handleWeeklySync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-900/60 transition active:scale-95 disabled:opacity-50"
            title={t.weeklyRefresh}
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{t.weeklyRefresh}</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.matchesSubtitle}
        </p>
      </div>

      {/* Weekly Schedule Announcement Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-[#07152b] via-[#081a36] to-[#0a182c] p-3 text-xs shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white font-tech tracking-wide text-[11px]">
                <span>{t.weeklyFixturesActive}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">
                {t.weeklyFixturesSubtitle}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-tech text-cyan-300 border border-cyan-500/30">
            {t.threeEliteLeaguesOnly}
          </span>
        </div>
        {syncStatus && (
          <div className="mt-2 text-[10px] text-cyan-300 font-mono bg-slate-900/80 px-2 py-1 rounded-lg border border-cyan-500/30 animate-in fade-in">
            {syncStatus}
          </div>
        )}
      </div>

      {/* Status Tabs: ALL, LIVE, UPCOMING, FINISHED */}
      <div className="flex rounded-2xl bg-[#060e1d] p-1 border border-slate-800">
        <button
          onClick={() => setActiveStatus('ALL')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            activeStatus === 'ALL'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.all}
        </button>
        <button
          onClick={() => setActiveStatus('LIVE')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeStatus === 'LIVE'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20 animate-pulse'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="h-3 w-3 text-current" />
          <span>{t.live}</span>
        </button>
        <button
          onClick={() => setActiveStatus('UPCOMING')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            activeStatus === 'UPCOMING'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.upcoming}
        </button>
        <button
          onClick={() => setActiveStatus('FINISHED')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            activeStatus === 'FINISHED'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.finished}
        </button>
      </div>

      {/* Game Week Horizontal Pills */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-tech uppercase font-bold">
          <span className="flex items-center gap-1 text-slate-300">
            <Calendar className="h-3 w-3 text-cyan-400" />
            {t.gameWeekFilter}
          </span>
          <span className="text-[10px] text-slate-500">{t.weeklyRolls}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedWeek('ALL')}
            className={`rounded-xl px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition border ${
              selectedWeek === 'ALL'
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.allWeeks}
          </button>
          {gameWeeks.map((gw) => (
            <button
              key={gw.week}
              onClick={() => setSelectedWeek(gw.week)}
              className={`rounded-xl px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition border ${
                selectedWeek === gw.week
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {localizeWeekLabel(gw.label, settings.language)}
            </button>
          ))}
        </div>
      </div>

      {/* Search & 3 Leagues Filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchTeamsPlaceholder}
            className="w-full rounded-2xl border border-slate-800 bg-[#070e1c] pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* 3 Allowed Leagues Filter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {leagues.map((lg) => {
            const isSelected = selectedLeague === lg.originalName || (lg.id === 'All' && selectedLeague === 'All');
            return (
              <button
                key={lg.id}
                onClick={() => setSelectedLeague(lg.id === 'All' ? 'All' : lg.originalName)}
                className={`rounded-xl px-2.5 py-2 text-[11px] font-semibold transition border text-start flex items-center gap-2 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-md ring-1 ring-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-base">{lg.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-white text-[11px]">{lg.name}</div>
                  {lg.sub && <div className="text-[9px] text-slate-400 truncate">{lg.sub}</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <LoadingSpinner message={t.loadingFixtures} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadMatches} />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          title={
            activeStatus === 'LIVE' 
              ? t.noLiveMatchesTitle
              : t.noFixturesFoundTitle
          }
          description={
            activeStatus === 'LIVE' 
              ? t.noLiveMatchesDesc
              : t.noFixturesFoundDesc
          }
          actionText={activeStatus !== 'UPCOMING' ? t.viewUpcomingMatches : t.resetFilters}
          onAction={() => {
            setActiveStatus('UPCOMING');
            setSelectedLeague('All');
            setSelectedWeek('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="cursor-pointer rounded-2xl border border-slate-800/90 bg-[#070e1c] p-4 transition-all hover:border-cyan-500/40 hover:bg-[#081224] shadow-sm space-y-3"
            >
              {/* Header: League & Countdown Timer */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-tech font-bold text-slate-300 tracking-wider truncate">
                    {localizeLeagueName(match.leagueName, settings.language)}
                  </span>
                  {match.weekLabel && (
                    <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[9px] font-tech text-slate-400 shrink-0 border border-slate-700/50">
                      {localizeWeekLabel(match.weekLabel.split('•')[0].trim(), settings.language)}
                    </span>
                  )}
                </div>

                {/* Real-time Match Countdown Timer */}
                <MatchCountdown match={match} size="xs" />
              </div>

              {/* Match Scoreline / Matchup */}
              <div className="flex items-center justify-between py-1">
                {/* Home Team */}
                <div className="flex flex-1 items-center gap-2.5 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 shadow-inner">
                    <TeamLogo team={match.homeTeam} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {localizeTeamName(match.homeTeam.name, settings.language)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-tech">{match.homeTeam.shortName}</span>
                  </div>
                </div>

                {/* Score or VS */}
                <div className="px-3 text-center shrink-0">
                  {match.status !== 'UPCOMING' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black font-display text-white tracking-wider">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      {match.status === 'LIVE' && (
                        <span className="text-[9px] font-tech text-red-400 font-bold">{t.live} {match.minute}'</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-display font-black text-slate-500">
                        VS
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-tech">
                        {match.date}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-tech">
                        {match.time} UTC
                      </span>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-1 items-center justify-end gap-2.5 text-end min-w-0">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {localizeTeamName(match.awayTeam.name, settings.language)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-tech">{match.awayTeam.shortName}</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 shadow-inner">
                    <TeamLogo team={match.awayTeam} size="sm" />
                  </div>
                </div>
              </div>

              {/* Match Venue & Kickoff Date */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-tech">
                <span className="truncate max-w-[200px] text-slate-400">{match.venue}</span>
                <span className="text-cyan-400/90 font-mono">{match.date} • {match.time} UTC</span>
              </div>

              {/* AI Probability Strip */}
              <div className="flex items-center justify-between bg-[#050b18] px-3 py-2 rounded-xl border border-slate-800/60 text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-tech text-xs">
                    {t.aiPick}: <strong className="text-white">{localizeChoice(match.aiPrediction.recommendedChoice, settings.language)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-tech text-slate-400">
                    {match.aiPrediction.confidence}% {t.confidence}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 rtl:rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
