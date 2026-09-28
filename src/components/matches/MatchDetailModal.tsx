import React from 'react';
import { 
  X, 
  Cpu, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Shield, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PredictionChoice } from '../../types';
import { TeamLogo } from '../common/TeamLogo';
import { MatchCountdown } from '../common/MatchCountdown';
import { 
  localizeTeamName, 
  localizeLeagueName, 
  localizeRecommendedChoice 
} from '../../i18n/localize';

export const MatchDetailModal: React.FC = () => {
  const { selectedMatch, setSelectedMatch, submitPrediction, setCurrentTab, t, settings } = useApp();
  const isAr = settings.language === 'ar';

  if (!selectedMatch) return null;

  const homeTeamName = localizeTeamName(selectedMatch.homeTeam.name, settings.language);
  const homeTeamShortName = localizeTeamName(selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name, settings.language);
  const awayTeamName = localizeTeamName(selectedMatch.awayTeam.name, settings.language);
  const awayTeamShortName = localizeTeamName(selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name, settings.language);
  const leagueName = localizeLeagueName(selectedMatch.leagueName, settings.language);
  const recommendedText = localizeRecommendedChoice(selectedMatch.aiPrediction.recommendedChoice, settings.language);

  const handlePredict = (choice: PredictionChoice) => {
    submitPrediction(selectedMatch, choice, selectedMatch.aiPrediction.recommendedChoice);
    setSelectedMatch(null);
    setCurrentTab('predict');
  };

  const getFormBadge = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'D': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'L': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  const getFormLetter = (result: 'W' | 'D' | 'L') => {
    if (!isAr) return result;
    switch (result) {
      case 'W': return 'ف';
      case 'D': return 'ت';
      case 'L': return 'خ';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={() => setSelectedMatch(null)}
    >
      <div 
        className="w-full max-w-xl rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5 bg-[#050912]/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-cyan-400">
              {leagueName}
            </span>
            {selectedMatch.weekLabel && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300 font-semibold">{selectedMatch.weekLabel}</span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-tech">{selectedMatch.date} • {selectedMatch.time} UTC</span>
          </div>
          <button
            onClick={() => setSelectedMatch(null)}
            className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* Teams Header Display */}
          <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0b172a] to-[#070f1e] p-5 text-center">
            <div className="flex items-center justify-around">
              {/* Home Team */}
              <div className="flex flex-1 flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-900/80 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg">
                  <TeamLogo team={selectedMatch.homeTeam} size="lg" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{homeTeamName}</h3>
                <div className="mt-1 flex gap-1">
                  {selectedMatch.homeTeam.form ? selectedMatch.homeTeam.form.map((res, i) => (
                    <span key={i} className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] font-bold ${getFormBadge(res)}`}>
                      {getFormLetter(res)}
                    </span>
                  )) : ['W', 'D', 'W'].map((res, i) => (
                    <span key={i} className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] font-bold ${getFormBadge(res as 'W'|'D'|'L')}`}>
                      {getFormLetter(res as 'W'|'D'|'L')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score / VS Center */}
              <div className="px-3 flex flex-col items-center">
                {selectedMatch.status === 'LIVE' ? (
                  <>
                    <MatchCountdown match={selectedMatch} size="sm" />
                    <div className="mt-1 font-display text-2xl font-black text-white">
                      {selectedMatch.homeScore} - {selectedMatch.awayScore}
                    </div>
                  </>
                ) : selectedMatch.status === 'FINISHED' ? (
                  <>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-tech text-slate-400">
                      {t.finishedStatus}
                    </span>
                    <div className="mt-1 font-display text-2xl font-black text-white">
                      {selectedMatch.homeScore} - {selectedMatch.awayScore}
                    </div>
                  </>
                ) : (
                  <>
                    <MatchCountdown match={selectedMatch} size="sm" />
                    <div className="text-xl font-display font-black text-slate-500 mt-1">VS</div>
                  </>
                )}
                {selectedMatch.venue && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="truncate max-w-[120px]">{selectedMatch.venue}</span>
                  </span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-1 flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-900/80 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg">
                  <TeamLogo team={selectedMatch.awayTeam} size="lg" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{awayTeamName}</h3>
                <div className="mt-1 flex gap-1">
                  {selectedMatch.awayTeam.form ? selectedMatch.awayTeam.form.map((res, i) => (
                    <span key={i} className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] font-bold ${getFormBadge(res)}`}>
                      {getFormLetter(res)}
                    </span>
                  )) : ['D', 'W', 'W'].map((res, i) => (
                    <span key={i} className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] font-bold ${getFormBadge(res as 'W'|'D'|'L')}`}>
                      {getFormLetter(res as 'W'|'D'|'L')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Probability Engine Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#081324] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider">
                    {t.aiConfidence}
                  </h4>
                  <span className="text-[10px] text-cyan-300">
                    {t.recommendedLabel}: <strong>{recommendedText}</strong>
                  </span>
                </div>
              </div>
              <span className="font-tech text-base font-bold text-cyan-400">
                {selectedMatch.aiPrediction.confidence}%
              </span>
            </div>

            {/* Probability 3-Bar Distribution */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>1: {selectedMatch.aiPrediction.homeWinProb}%</span>
                <span>X: {selectedMatch.aiPrediction.drawProb}%</span>
                <span>2: {selectedMatch.aiPrediction.awayWinProb}%</span>
              </div>
              <div className="h-2.5 w-full flex rounded-full overflow-hidden bg-slate-800 p-0.5 gap-0.5">
                <div 
                  className="h-full bg-cyan-400 rounded-l-full transition-all" 
                  style={{ width: `${selectedMatch.aiPrediction.homeWinProb}%` }} 
                  title={`Home: ${selectedMatch.aiPrediction.homeWinProb}%`}
                />
                <div 
                  className="h-full bg-slate-500 transition-all" 
                  style={{ width: `${selectedMatch.aiPrediction.drawProb}%` }} 
                  title={`Draw: ${selectedMatch.aiPrediction.drawProb}%`}
                />
                <div 
                  className="h-full bg-blue-500 rounded-r-full transition-all" 
                  style={{ width: `${selectedMatch.aiPrediction.awayWinProb}%` }} 
                  title={`Away: ${selectedMatch.aiPrediction.awayWinProb}%`}
                />
              </div>
            </div>

            {/* AI Key Match Insight */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.tacticalBreakdown}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedMatch.aiPrediction.keyInsight}
              </p>
            </div>
          </div>

          {/* Head-to-Head & Projected Lineups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* H2H Stats */}
            <div className="rounded-2xl border border-slate-800 bg-[#080f1d] p-4">
              <h5 className="flex items-center gap-2 text-xs font-bold text-white uppercase font-tech tracking-wider mb-3">
                <BarChart2 className="h-4 w-4 text-cyan-400" />
                {t.headToHead}
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{homeTeamShortName} {isAr ? 'فوز' : 'Wins'}</span>
                  <span className="font-bold text-cyan-400">{selectedMatch.headToHead.homeWins}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{isAr ? 'تعادلات' : 'Draws'}</span>
                  <span className="font-bold text-slate-400">{selectedMatch.headToHead.draws}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{awayTeamShortName} {isAr ? 'فوز' : 'Wins'}</span>
                  <span className="font-bold text-blue-400">{selectedMatch.headToHead.awayWins}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                  <span>{isAr ? 'آخر مواجهة:' : 'Last Match:'}</span>
                  <span className="text-white font-mono">{selectedMatch.headToHead.lastMatchResult}</span>
                </div>
              </div>
            </div>

            {/* Projected Lineups */}
            <div className="rounded-2xl border border-slate-800 bg-[#080f1d] p-4">
              <h5 className="flex items-center gap-2 text-xs font-bold text-white uppercase font-tech tracking-wider mb-3">
                <Users className="h-4 w-4 text-cyan-400" />
                {t.keySquadPlayers}
              </h5>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400">{homeTeamName}</span>
                  <p className="text-[11px] text-slate-400 truncate">
                    {selectedMatch.predictedLineups?.home.slice(0, 3).join(', ')}...
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-400">{awayTeamName}</span>
                  <p className="text-[11px] text-slate-400 truncate">
                    {selectedMatch.predictedLineups?.away.slice(0, 3).join(', ')}...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Submit Prediction Buttons */}
          <div className="rounded-2xl border border-slate-800 bg-[#080e1b] p-4">
            <h5 className="text-xs font-bold text-white uppercase font-tech tracking-wider mb-2">
              {t.submitForecast}
            </h5>
            <p className="text-[11px] text-slate-400 mb-3">
              {t.chooseOutcomeDesc}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePredict('HOME_WIN')}
                className="flex flex-col items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 py-2.5 hover:bg-cyan-900/60 transition active:scale-95"
              >
                <span className="text-xs font-bold text-cyan-300">1</span>
                <span className="text-[10px] text-slate-300 truncate max-w-[80px]">{homeTeamShortName}</span>
              </button>
              <button
                onClick={() => handlePredict('DRAW')}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 py-2.5 hover:bg-slate-800 transition active:scale-95"
              >
                <span className="text-xs font-bold text-slate-300">X</span>
                <span className="text-[10px] text-slate-400">{t.draw}</span>
              </button>
              <button
                onClick={() => handlePredict('AWAY_WIN')}
                className="flex flex-col items-center justify-center rounded-xl border border-blue-500/40 bg-blue-950/40 py-2.5 hover:bg-blue-900/60 transition active:scale-95"
              >
                <span className="text-xs font-bold text-blue-300">2</span>
                <span className="text-[10px] text-slate-300 truncate max-w-[80px]">{awayTeamShortName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
