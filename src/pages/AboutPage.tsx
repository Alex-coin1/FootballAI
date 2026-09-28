import React from 'react';
import { Info, Cpu, Trophy, Sparkles, Shield, Flame, Layers, Globe, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { t, settings } = useApp();
  const isAr = settings.language === 'ar';

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Brand Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0a1b35] via-[#061122] to-[#040813] p-6 text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950 border border-cyan-400 p-2 shadow-lg shadow-cyan-500/20">
          <img src="/icon.svg" alt="FootballAI Logo" className="h-12 w-12" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight">
            FOOTBALL<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-cyan-300 font-tech uppercase tracking-widest mt-0.5">
            {t.slogan}
          </p>
        </div>
        <p className="max-w-md mx-auto text-xs text-slate-300 leading-relaxed font-sans">
          {t.aboutDesc}
        </p>
      </div>

      {/* Core Ecosystem Pillars */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400 px-1">
          {t.architecturalPillars}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Cpu className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white uppercase font-tech">
                {t.neuralProbabilisticEngine}
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.neuralEngineDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white uppercase font-tech">
                {t.dailyAnalystStreak}
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.dailyStreakDesc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400">
              <Layers className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white uppercase font-tech">
                {t.cards50Title}
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.cards50Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white uppercase font-tech">
                {t.communityAutonomy}
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.communityAutonomyDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Protocol Transparency Statement */}
      <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-5 space-y-2">
        <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{t.transparencyTitle}</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {t.transparencyDesc}
        </p>
      </div>

      {/* Official Community on X */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold font-tech text-cyan-400 uppercase tracking-wider block">
            {isAr ? 'المجتمع الرسمي على منصة X' : 'Official Community on X'}
          </span>
          <p className="text-xs text-slate-300 mt-1">
            {isAr ? 'تابع حسابنا الرسمي @FootballAIHQ لآخر الأخبار والتحليلات والتحديثات الحية' : 'Follow @FootballAIHQ for match predictions, tactical telemetry, and pilot rewards.'}
          </p>
        </div>
        <a
          href="https://x.com/FootballAIHQ"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-cyan-500/40 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-950 transition active:scale-95 shrink-0"
        >
          <span>@FootballAIHQ</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
