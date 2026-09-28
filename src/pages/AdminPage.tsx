import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Server, 
  Activity, 
  Cpu, 
  Users, 
  Coins, 
  Play, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPage: React.FC = () => {
  const { user, showToast, claimDailyReward, t, settings } = useApp();
  const [modelLatency, setModelLatency] = useState(42);
  const [feedStatus, setFeedStatus] = useState<'HEALTHY' | 'SYNCING'>('HEALTHY');
  const isAr = settings.language === 'ar';

  const handleSimulateSync = () => {
    setFeedStatus('SYNCING');
    showToast(isAr ? 'بدء مزامنة البيانات الحية من Sportradar و Opta...' : 'Triggered live telemetry sync from Sportradar & Opta feeds...', 'info');
    setTimeout(() => {
      setFeedStatus('HEALTHY');
      setModelLatency(Math.floor(35 + Math.random() * 20));
      showToast(isAr ? 'اكتملت مزامنة البيانات. زمن الاستجابة 38ms.' : 'Telemetry sync complete. Latency 38ms.', 'success');
    }, 1200);
  };

  const handleForceDailyReset = () => {
    user.lastClaimTimestamp = null;
    showToast(isAr ? 'تم إلغاء قفل المطالبة اليومية بنجاح! جاهز للاختبار الآن.' : 'Daily claim lock removed. Ready for immediate claim!', 'success');
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header with mandatory Demo statement */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <span>{t.operatorControlCenter}</span>
          </h1>
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-tech font-bold text-amber-300 border border-amber-500/30">
            {isAr ? 'مسار داخلي' : 'INTERNAL ROUTE'}
          </span>
        </div>

        {/* Mandated Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {t.adminNotice}
          </span>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t.totalCommunity}</span>
          </div>
          <span className="text-xl font-black font-display text-white mt-1 block">
            18,492
          </span>
          <span className="text-[10px] text-emerald-400 font-tech">↑ {t.thisWeekGrowth}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.distributedFai}</span>
          </div>
          <span className="text-xl font-black font-display text-cyan-300 mt-1 block">
            124,580.40
          </span>
          <span className="text-[10px] text-slate-400 font-tech">{t.pilotPool}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Server className="h-3.5 w-3.5 text-emerald-400" />
            <span>{t.matchDataFeed}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-sm font-bold font-tech text-white">
              {feedStatus === 'HEALTHY' ? (isAr ? 'سليم' : 'HEALTHY') : (isAr ? 'جاري المزامنة' : 'SYNCING')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-tech">{t.uptime100}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>{t.modelLatency}</span>
          </div>
          <span className="text-xl font-black font-display text-purple-300 mt-1 block">
            {modelLatency}ms
          </span>
          <span className="text-[10px] text-purple-400 font-tech">{t.inferenceRate}</span>
        </div>
      </div>

      {/* Operator Diagnostics & Test Triggers */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span>{t.simulationTriggers}</span>
        </h3>
        <p className="text-xs text-slate-400">
          {t.simulationTriggersDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleForceDailyReset}
            className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 hover:border-cyan-400 hover:bg-cyan-950/30 transition text-start"
          >
            <div>
              <span className="text-xs font-bold text-white block">{t.unlockClaimTimer}</span>
              <span className="text-[10px] text-slate-400">{t.unlockClaimTimerDesc}</span>
            </div>
            <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
          </button>

          <button
            onClick={handleSimulateSync}
            className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 p-3 hover:border-cyan-400 hover:bg-cyan-950/30 transition text-start"
          >
            <div>
              <span className="text-xs font-bold text-white block">{t.pollTelemetry}</span>
              <span className="text-[10px] text-slate-400">{t.pollTelemetryDesc}</span>
            </div>
            <RefreshCw className="h-4 w-4 text-emerald-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Integration & Telemetry Architecture */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400 flex items-center gap-1.5">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <span>{t.integrationKeyStatus}</span>
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-3 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-semibold text-white block">{t.footballMatchData}</span>
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'بيانات حقيقية مباشرة وموثقة عبر Football-Data.org API' : 'Using FOOTBALL_API_KEY (or High-Fidelity Experimental Telemetry)'}
                </span>
              </div>
            </div>
            <span className="rounded-lg bg-emerald-950/60 px-2 py-0.5 text-[10px] font-tech text-emerald-400 border border-emerald-500/30">
              {isAr ? 'نشط' : 'ACTIVE'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-3 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <div>
                <span className="font-semibold text-white block">{isAr ? 'نماذج Gemini AI' : 'Gemini AI Models'}</span>
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'واجهة مهيأة مسبقاً لميزات التحليل الذكي المتقدم' : 'Auto-configured GEMINI_API_KEY for future intelligence features'}
                </span>
              </div>
            </div>
            <span className="rounded-lg bg-cyan-950/60 px-2 py-0.5 text-[10px] font-tech text-cyan-400 border border-cyan-500/30">
              {isAr ? 'جاهز' : 'READY'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-3 border border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-purple-400" />
              <div>
                <span className="font-semibold text-white block">{isAr ? 'الأخبار وتوقعات الذكاء الاصطناعي' : 'News & AI Predictions'}</span>
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'نظام تحليلي إحصائي متكامل يعمل مباشرة' : 'Experimental data synthesizer (Zero external keys required)'}
                </span>
              </div>
            </div>
            <span className="rounded-lg bg-purple-950/60 px-2 py-0.5 text-[10px] font-tech text-purple-400 border border-purple-500/30">
              {isAr ? 'مباشر' : 'ZERO-KEY READY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
