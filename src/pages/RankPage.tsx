import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Trophy, 
  Medal, 
  Sparkles, 
  Info, 
  Users, 
  Cpu, 
  TrendingUp 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLeaderboard } from '../services/leaderboardApi';
import { LeaderboardCategory, LeaderboardEntry, UserPredictionRecord } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const RankPage: React.FC = () => {
  const { user, predictions, t } = useApp();
  const [category, setCategory] = useState<LeaderboardCategory>('points');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(category, {
      points: user.faiBalance,
      referrals: user.totalReferrals || 0,
      predictions: predictions.filter((p: UserPredictionRecord) => p.status === 'WON').length
    }).then(({ list, currentUserRank }: { list: LeaderboardEntry[]; currentUserRank: LeaderboardEntry }) => {
      setEntries(list);
      setCurrentUserEntry(currentUserRank);
      setLoading(false);
    });
  }, [category, user.faiBalance, user.totalReferrals, predictions]);

  const renderBadge = (entry: LeaderboardEntry) => {
    if (entry.rank === 1) {
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 border border-amber-400 text-xs font-black shadow-sm shadow-amber-400/40">
          🥇
        </span>
      );
    }
    if (entry.rank === 2) {
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-200 border border-slate-300 text-xs font-black">
          🥈
        </span>
      );
    }
    if (entry.rank === 3) {
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 border border-amber-700 text-xs font-black">
          🥉
        </span>
      );
    }
    return (
      <span className="font-tech text-xs font-bold text-slate-500 w-5 text-center">
        #{entry.rank}
      </span>
    );
  };

  const getMetricLabel = () => {
    if (category === 'referrals') return t.invites;
    if (category === 'predictions') return t.wins;
    return 'FAI';
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <span>{t.leaderboardTitle}</span>
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.leaderboardSubtitle}
        </p>

        {/* Mandated Demo Leaderboard Notice */}
        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-[11px] text-cyan-300">
          <Info className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{t.leaderboardSubtitle}</span>
        </div>
      </div>

      {/* Tabs: FAI POINTS, REFERRALS, PREDICTIONS */}
      <div className="flex rounded-2xl bg-[#060e1d] p-1 border border-slate-800">
        <button
          onClick={() => setCategory('points')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            category === 'points'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.faiPoints}
        </button>
        <button
          onClick={() => setCategory('referrals')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            category === 'referrals'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.referrals}
        </button>
        <button
          onClick={() => setCategory('predictions')}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
            category === 'predictions'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.predictionsTab}
        </button>
      </div>

      {/* Current User Sticky Highlight Card */}
      {currentUserEntry && (
        <div className="rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-r from-cyan-950/70 via-[#071325] to-cyan-950/70 p-3.5 shadow-lg shadow-cyan-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center font-tech text-xs font-black text-cyan-300 bg-cyan-500/20 rounded-lg border border-cyan-400/40">
              #{currentUserEntry.rank}
            </div>
            <div className="h-9 w-9 rounded-xl overflow-hidden border border-cyan-400">
              <img src={currentUserEntry.avatarUrl} alt={currentUserEntry.username} className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {currentUserEntry.username === 'Guest Player' ? t.guestPlayer : currentUserEntry.username}
              </span>
              <span className="text-[10px] text-cyan-400 font-tech">
                {t.currentCommunityTier}
              </span>
            </div>
          </div>

          <div className="text-right rtl:text-left">
            <span className="font-tech text-sm font-black text-cyan-300">
              {currentUserEntry.points.toFixed(category === 'points' ? 2 : 0)}
            </span>
            <span className="block text-[10px] text-slate-400 font-tech uppercase">
              {getMetricLabel()}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="rounded-3xl border border-slate-800 bg-[#070d1a] p-3 space-y-1">
        {loading ? (
          <LoadingSpinner message={t.aggregatingRankings} />
        ) : (
          entries.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center justify-between rounded-xl p-2.5 transition ${
                entry.isCurrentUser
                  ? 'bg-cyan-950/40 border border-cyan-500/30'
                  : 'hover:bg-slate-900/50'
              }`}
            >
              {/* Left: Rank, Avatar, Name */}
              <div className="flex items-center gap-3">
                <div className="flex w-6 justify-center">
                  {renderBadge(entry)}
                </div>
                <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-700/80 shrink-0">
                  <img src={entry.avatarUrl} alt={entry.username} className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {entry.username === 'Guest Player' ? t.guestPlayer : entry.username}
                  </span>
                  <span className="text-[10px] text-slate-500 font-tech">
                    {entry.predictionsWon || 0} {t.wins} • {entry.referralCount || 0} {t.rankUserRefs}
                  </span>
                </div>
              </div>

              {/* Right: Score */}
              <div className="text-right rtl:text-left">
                <span className="font-tech text-xs font-bold text-white">
                  {entry.points.toFixed(category === 'points' ? 2 : 0)}
                </span>
                <span className="text-[9px] text-slate-400 ml-1 rtl:mr-1 rtl:ml-0 font-tech uppercase">
                  {getMetricLabel()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
