import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  TrendingUp,
  History,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUpcomingMatches } from '../services/footballApi';
import { Match, PredictionChoice, UserPredictionRecord, LeagueId } from '../types';
import { TeamLogo } from '../components/common/TeamLogo';
import { MatchCountdown } from '../components/common/MatchCountdown';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  localizeTeamName, 
  localizeLeagueName, 
  localizeWeekLabel, 
  localizeChoice 
} from '../i18n/localize';

export const PredictPage: React.FC = () => {
  const { predictions, submitPrediction, settings, t } = useApp();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [selectedChoices, setSelectedChoices] = useState<Record<string, PredictionChoice>>({});

  useEffect(() => {
    getUpcomingMatches().then((data: Match[]) => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  const handleSelectChoice = (matchId: string, choice: PredictionChoice) => {
    setSelectedChoices(prev => ({ ...prev, [matchId]: choice }));
  };

  const handleSubmit = (match: Match) => {
    const choice = selectedChoices[match.id];
    if (!choice) return;
    submitPrediction(match, choice, match.aiPrediction.recommendedChoice);
  };

  const leagues = [
    { id: 'All', name: t.allLeagues, originalName: 'All', icon: '🏆' },
    { id: 'Premier League', name: t.premierLeague, originalName: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'La Liga', name: t.laLiga, originalName: 'La Liga', icon: '🇪🇸' },
    { id: 'UEFA Champions League', name: t.championsLeague, originalName: 'UEFA Champions League', icon: '⭐' },
  ];

  const filteredMatches = matches.filter(match => {
    if (selectedLeague === 'All') return true;
    return match.leagueName === selectedLeague;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header with mandatory disclaimer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <span>{t.aiPredictorTitle}</span>
          </h1>
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[11px] font-tech text-cyan-400 border border-cyan-500/30">
            {t.probabilisticModel}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.predictSubtitle}
        </p>

        {/* Mandatory Disclaimer */}
        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-[11px] text-cyan-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-cyan-400" />
          <span>{t.aiDisclaimer}</span>
        </div>
      </div>

      {/* League Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {leagues.map((lg) => (
          <button
            key={lg.id}
            onClick={() => setSelectedLeague(lg.id === 'All' ? 'All' : lg.originalName)}
            className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
              (selectedLeague === lg.originalName || (lg.id === 'All' && selectedLeague === 'All'))
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-sm'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{lg.icon}</span>
            <span>{lg.name}</span>
          </button>
        ))}
      </div>

      {/* Match Prediction Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400">
            {t.upcomingAvailableForPrediction}
          </h3>
          <span className="text-[11px] font-tech text-cyan-400">
            {filteredMatches.length} {t.fixturesCount}
          </span>
        </div>

        {loading ? (
          <LoadingSpinner message={t.calculatingProbabilities} />
        ) : filteredMatches.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-6 text-center text-xs text-slate-400">
            {t.noFixturesAwaitingPrediction}
          </div>
        ) : (
          filteredMatches.map((match: Match) => {
            const hasPredicted = predictions.some((p: UserPredictionRecord) => p.matchId === match.id);
            const userPick = selectedChoices[match.id];

            return (
              <div
                key={match.id}
                className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#081428] to-[#050c18] p-5 shadow-xl space-y-4"
              >
                {/* League, Week & Live Countdown */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-tech font-bold text-slate-300 uppercase tracking-wider text-xs truncate">
                      {localizeLeagueName(match.leagueName, settings.language)}
                    </span>
                    {match.weekLabel && (
                      <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[9px] font-tech text-slate-400 shrink-0 border border-slate-700/50">
                        {localizeWeekLabel(match.weekLabel.split('•')[0].trim(), settings.language)}
                      </span>
                    )}
                  </div>
                  {/* Countdown Timer */}
                  <MatchCountdown match={match} size="xs" />
                </div>

                {/* Matchup Banner */}
                <div className="flex items-center justify-around py-1">
                  <div className="flex flex-1 flex-col items-center text-center min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-md">
                      <TeamLogo team={match.homeTeam} size="md" />
                    </div>
                    <span className="mt-1 text-xs font-bold text-white line-clamp-1">
                      {localizeTeamName(match.homeTeam.name, settings.language)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-tech">{match.homeTeam.shortName}</span>
                  </div>

                  <div className="flex flex-col items-center px-2 shrink-0">
                    <span className="text-base font-display font-black text-slate-500">VS</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-tech text-center">{match.date}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-tech">{match.time} UTC</span>
                  </div>

                  <div className="flex flex-1 flex-col items-center text-center min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-md">
                      <TeamLogo team={match.awayTeam} size="md" />
                    </div>
                    <span className="mt-1 text-xs font-bold text-white line-clamp-1">
                      {localizeTeamName(match.awayTeam.name, settings.language)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-tech">{match.awayTeam.shortName}</span>
                  </div>
                </div>

                {/* AI Probability Insight */}
                <div className="rounded-2xl border border-cyan-500/20 bg-[#060e1d] p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold font-tech">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      {t.aiRecommendation}: {localizeChoice(match.aiPrediction.recommendedChoice, settings.language)}
                    </span>
                    <span className="font-tech font-bold text-white">
                      {match.aiPrediction.confidence}% {t.confidence}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {match.aiPrediction.keyInsight}
                  </p>
                </div>

                {/* 1 X 2 Selection Buttons */}
                {hasPredicted ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 p-3 text-xs font-bold text-cyan-300">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>{t.forecastLogged}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSelectChoice(match.id, 'HOME_WIN')}
                        className={`flex flex-col items-center justify-center rounded-2xl py-3 border transition active:scale-95 ${
                          userPick === 'HOME_WIN'
                            ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-[#070f20] text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-tech font-bold">{t.homeWinShort}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[80px] mt-0.5">
                          {localizeTeamName(match.homeTeam.shortName || match.homeTeam.name, settings.language)}
                        </span>
                        <span className="text-[9px] text-cyan-400 mt-1 font-tech">{match.aiPrediction.homeWinProb}%</span>
                      </button>

                      <button
                        onClick={() => handleSelectChoice(match.id, 'DRAW')}
                        className={`flex flex-col items-center justify-center rounded-2xl py-3 border transition active:scale-95 ${
                          userPick === 'DRAW'
                            ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-[#070f20] text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-tech font-bold">{t.drawShort}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{t.draw}</span>
                        <span className="text-[9px] text-slate-400 mt-1 font-tech">{match.aiPrediction.drawProb}%</span>
                      </button>

                      <button
                        onClick={() => handleSelectChoice(match.id, 'AWAY_WIN')}
                        className={`flex flex-col items-center justify-center rounded-2xl py-3 border transition active:scale-95 ${
                          userPick === 'AWAY_WIN'
                            ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                            : 'border-slate-800 bg-[#070f20] text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs font-tech font-bold">{t.awayWinShort}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[80px] mt-0.5">
                          {localizeTeamName(match.awayTeam.shortName || match.awayTeam.name, settings.language)}
                        </span>
                        <span className="text-[9px] text-blue-400 mt-1 font-tech">{match.aiPrediction.awayWinProb}%</span>
                      </button>
                    </div>

                    <button
                      disabled={!userPick}
                      onClick={() => handleSubmit(match)}
                      className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                    >
                      {userPick ? `${t.lockInPrediction} (${localizeChoice(userPick, settings.language)})` : t.selectOutcomeToSubmit}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
