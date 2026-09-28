import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Cpu, 
  ChevronRight, 
  Trophy, 
  TrendingUp, 
  Share2, 
  ShieldCheck, 
  AlertCircle,
  ArrowUpRight,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getFeaturedMatch } from '../services/footballApi';
import { Match, NavigationTab, ActivityItem } from '../types';
import { TeamLogo } from '../components/common/TeamLogo';
import { MatchCountdown } from '../components/common/MatchCountdown';
import { 
  localizeTeamName, 
  localizeLeagueName, 
  localizeWeekLabel, 
  localizeChoice, 
  localizeActivity 
} from '../i18n/localize';

export const HomePage: React.FC = () => {
  const { 
    user, 
    canClaimDaily, 
    dailyCountdownText, 
    claimDailyReward, 
    setCurrentTab, 
    setSelectedMatch,
    activities,
    settings,
    t 
  } = useApp();

  const [featuredMatch, setFeaturedMatch] = useState<Match | null>(null);

  useEffect(() => {
    getFeaturedMatch().then(setFeaturedMatch);
  }, []);

  const streakDays = [1, 2, 3, 4, 5, 6, 7];

  const displayUsername = user.username === 'Guest Player' ? t.guestPlayer : user.username;
  const displayLevelTitle = user.levelTitle === 'Beginner Analyst' ? t.beginnerAnalyst : user.levelTitle;

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 1. BALANCE CARD */}
      <section 
        id="home-balance-card"
        className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#08182e] via-[#061122] to-[#040813] p-5 sm:p-6 shadow-2xl shadow-cyan-950/40"
      >
        {/* Subtle cyber background grid effect */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {/* Guest Player & Level Header */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-tech font-bold text-cyan-300 border border-cyan-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                {displayUsername}
              </span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-tech font-bold text-amber-300 border border-amber-500/20">
                Lv.{user.level} {displayLevelTitle}
              </span>
            </div>

            {/* FAI Balance Metric */}
            <div className="mt-3">
              <span className="text-[11px] font-tech font-bold tracking-widest text-slate-400 uppercase">
                {t.pilotBalance}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  {user.faiBalance.toFixed(4)}
                </span>
                <span className="text-base sm:text-lg font-bold font-tech text-cyan-400">
                  FAI
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="sm:w-56 rounded-2xl border border-cyan-950/60 bg-[#050b17]/80 p-3">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-400">{t.xpLevelProgress}</span>
              <span className="text-cyan-400 font-tech">{user.xp}/{user.xpNextLevel} XP</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (user.xp / user.xpNextLevel) * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>{t.analystLevel} {user.level}</span>
              <span className="text-slate-400 font-tech">{t.nextLevel} {user.level + 1}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Non-crypto Disclaimer Pill */}
        <div className="mt-4 pt-3.5 border-t border-cyan-950/60 flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
          <AlertCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>{t.pilotDisclaimer}</span>
        </div>
      </section>

      {/* 2. DAILY CLAIM CARD */}
      <section 
        id="home-daily-claim-card"
        className="rounded-3xl border border-cyan-500/20 bg-[#070e1c] p-5 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
                {t.dailyCheckIn}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.currentStreak}: <strong className="text-amber-400 font-tech">{user.streakDays} {t.days}</strong>
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-tech font-bold text-emerald-400 border border-emerald-500/20">
            +0.05 FAI / {t.perDay}
          </span>
        </div>

        {/* 7-Day Visual Progress Track */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {streakDays.map((day) => {
            const isClaimed = (user.claimedDays || []).includes(day) || day < user.streakDays;
            const isCurrent = day === user.streakDays;
            const isDay7 = day === 7;

            return (
              <div 
                key={day}
                className={`flex flex-col items-center justify-center rounded-xl p-2 text-center transition-all border ${
                  isClaimed
                    ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                    : isCurrent
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/40'
                      : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                <span className="text-[9px] font-tech font-bold tracking-tight">
                  D{day}
                </span>
                <div className="my-1">
                  {isClaimed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  ) : (
                    <span className="text-xs font-black">{isDay7 ? '⭐' : '•'}</span>
                  )}
                </div>
                <span className={`text-[9px] font-bold ${isDay7 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {isDay7 ? '+0.25' : '+0.05'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Claim Button / Countdown Indicator */}
        <div className="pt-2">
          {canClaimDaily ? (
            <button
              id="claim-daily-fai-btn"
              onClick={claimDailyReward}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/25 hover:from-cyan-300 hover:to-blue-500 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 fill-current text-slate-950" />
              <span>{t.claimDailyFai} (+{user.streakDays === 7 ? '0.25' : '0.05'} FAI)</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-[#050b17] p-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{t.nextClaimAvailableIn}:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-cyan-400 font-tech tracking-widest bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
                  {dailyCountdownText}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  ✓ {t.claimedToday}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURED MATCH CARD */}
      {featuredMatch && (
        <section 
          id="home-featured-match"
          className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#08152c] to-[#050d1b] p-5 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
                {t.featuredMatch}
              </h3>
              {featuredMatch.weekLabel && (
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[9px] font-tech text-slate-300 border border-slate-700/60">
                  {localizeWeekLabel(featuredMatch.weekLabel.split('•')[0].trim(), settings.language)}
                </span>
              )}
            </div>
            <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[10px] font-tech text-cyan-300 border border-cyan-500/30">
              {localizeLeagueName(featuredMatch.leagueName, settings.language)}
            </span>
          </div>

          {/* Teams matchup */}
          <div className="flex items-center justify-around py-2">
            <div className="flex flex-1 flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-1 flex items-center justify-center shadow-md">
                <TeamLogo team={featuredMatch.homeTeam} size="md" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-white line-clamp-1">
                {localizeTeamName(featuredMatch.homeTeam.name, settings.language)}
              </span>
            </div>

            <div className="flex flex-col items-center px-3">
              <MatchCountdown match={featuredMatch} size="xs" />
              <span className="text-base font-display font-black text-slate-500 my-0.5">VS</span>
              <span className="text-[10px] font-mono text-cyan-400 font-tech">{featuredMatch.date} • {featuredMatch.time}</span>
            </div>

            <div className="flex flex-1 flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-slate-900/90 border border-slate-700/60 p-1 flex items-center justify-center shadow-md">
                <TeamLogo team={featuredMatch.awayTeam} size="md" />
              </div>
              <span className="mt-1.5 text-xs font-bold text-white line-clamp-1">
                {localizeTeamName(featuredMatch.awayTeam.name, settings.language)}
              </span>
            </div>
          </div>

          {/* AI Probability Distribution Bar */}
          <div className="space-y-1.5 rounded-2xl bg-[#050b18] p-3 border border-slate-800">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-cyan-300">1: {featuredMatch.aiPrediction.homeWinProb}%</span>
              <span className="text-slate-400">X: {featuredMatch.aiPrediction.drawProb}%</span>
              <span className="text-blue-300">2: {featuredMatch.aiPrediction.awayWinProb}%</span>
            </div>
            <div className="h-2 w-full flex rounded-full overflow-hidden bg-slate-800 gap-0.5">
              <div className="bg-cyan-400 rounded-l-full" style={{ width: `${featuredMatch.aiPrediction.homeWinProb}%` }} />
              <div className="bg-slate-500" style={{ width: `${featuredMatch.aiPrediction.drawProb}%` }} />
              <div className="bg-blue-500 rounded-r-full" style={{ width: `${featuredMatch.aiPrediction.awayWinProb}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-cyan-400">
                <Cpu className="h-3 w-3" />
                <span>{t.aiRecommendation}: {localizeChoice(featuredMatch.aiPrediction.recommendedChoice, settings.language)}</span>
              </span>
              <span className="font-tech text-slate-300">{featuredMatch.aiPrediction.confidence}% {t.confidence}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setSelectedMatch(featuredMatch)}
              className="rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              {t.viewMatch}
            </button>
            <button
              onClick={() => {
                setSelectedMatch(featuredMatch);
              }}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95 flex items-center justify-center gap-1"
            >
              <span>{t.predictMatch}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 4. QUICK NAVIGATION CARDS */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400 px-1">
          {t.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setCurrentTab('matches')}
            className="flex flex-col items-start rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 hover:border-cyan-500/40 transition group text-start"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition">
              <Trophy className="h-4 w-4" />
            </div>
            <span className="mt-2 text-xs font-bold text-white">{t.matches}</span>
            <span className="text-[10px] text-slate-400">{t.liveAndUpcoming}</span>
          </button>

          <button
            onClick={() => setCurrentTab('predict')}
            className="flex flex-col items-start rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 hover:border-cyan-500/40 transition group text-start"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="mt-2 text-xs font-bold text-white">{t.predict}</span>
            <span className="text-[10px] text-slate-400">{t.aiProbabilities}</span>
          </button>

          <button
            onClick={() => setCurrentTab('nfts')}
            className="flex flex-col items-start rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 hover:border-cyan-500/40 transition group text-start"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition">
              <Layers className="h-4 w-4" />
            </div>
            <span className="mt-2 text-xs font-bold text-white">{t.nfts}</span>
            <span className="text-[10px] text-slate-400">{t.collectibleCardsCount}</span>
          </button>

          <button
            onClick={() => setCurrentTab('referrals')}
            className="flex flex-col items-start rounded-2xl border border-slate-800/90 bg-[#070e1c] p-3.5 hover:border-cyan-500/40 transition group text-start"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="mt-2 text-xs font-bold text-white">{t.referrals}</span>
            <span className="text-[10px] text-slate-400">{t.inviteAndEarnDesc}</span>
          </button>
        </div>
      </section>

      {/* 5. RECENT ACTIVITY LIST */}
      <section className="rounded-3xl border border-slate-800 bg-[#070d1a] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
            {t.recentActivity}
          </h3>
          <button 
            onClick={() => setCurrentTab('wallet')}
            className="text-[11px] text-cyan-400 hover:underline"
          >
            {t.viewWallet}
          </button>
        </div>

        <div className="space-y-2">
          {activities.slice(0, 4).map((act: ActivityItem) => {
            const locAct = localizeActivity(act, settings.language);
            return (
              <div 
                key={act.id} 
                className="flex items-center justify-between rounded-xl bg-slate-900/40 border border-slate-800/60 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/20">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white block">{locAct.title}</span>
                    <span className="text-[10px] text-slate-400">{locAct.timestamp}</span>
                  </div>
                </div>
                <span className="font-tech text-xs font-bold text-emerald-400">
                  +{act.amount.toFixed(2)} FAI
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
