import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Gift, 
  ChevronRight,
  Flame,
  Share2,
  Users,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { localizeTask } from '../i18n/localize';

export const TasksPage: React.FC = () => {
  const { tasks, completeTask, setCurrentTab, showToast, settings, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'daily' | 'social' | 'prediction'>('all');

  const handleTaskAction = (task: Task) => {
    if (task.status === 'COMPLETED') return;

    if (task.id === 'task-1') {
      // Daily check in
      setCurrentTab('home');
      return;
    }

    if (task.id === 'task-2') {
      // Follow on X
      const targetUrl = task.actionUrl || 'https://x.com/FootballAIHQ';
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      completeTask(task.id);
      return;
    }

    if (task.id === 'task-3') {
      // Share
      if (navigator.share) {
        navigator.share({
          title: 'FootballAI (FAI)',
          text: t.shareReferral,
          url: window.location.href,
        }).then(() => completeTask(task.id)).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast(t.linkCopied, 'success');
        completeTask(task.id);
      }
      return;
    }

    if (task.id === 'task-4') {
      // Invite friend
      setCurrentTab('referrals');
      return;
    }

    if (task.id === 'task-5') {
      // Complete 3 predictions
      setCurrentTab('predict');
      return;
    }

    if (task.id === 'task-6') {
      // Read news
      setCurrentTab('news');
      return;
    }

    if (task.id === 'task-7') {
      // 7 day streak
      setCurrentTab('home');
      return;
    }

    if (task.actionUrl) {
      window.open(task.actionUrl, '_blank', 'noopener,noreferrer');
      completeTask(task.id);
      return;
    }

    completeTask(task.id);
  };

  const filteredTasks = tasks.filter((taskItem: Task) => filter === 'all' || taskItem.category === filter);

  const completedCount = tasks.filter((taskItem: Task) => taskItem.status === 'COMPLETED').length;
  const totalReward = tasks.reduce((sum: number, taskItem: Task) => sum + (taskItem.status === 'COMPLETED' ? taskItem.reward : 0), 0);

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-cyan-400" />
          <span>{t.missionsTitle}</span>
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.missionsSubtitle}
        </p>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#09152a] to-[#060c18] p-4">
          <span className="text-[11px] font-tech text-slate-400 uppercase">{t.missionsDone}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-display text-white">{completedCount}</span>
            <span className="text-xs text-slate-400 font-tech">/ {tasks.length}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#09152a] to-[#060c18] p-4">
          <span className="text-[11px] font-tech text-slate-400 uppercase">{t.earnedFromTasks}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black font-display text-cyan-400">+{totalReward.toFixed(2)}</span>
            <span className="text-xs text-cyan-300 font-tech">FAI</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: t.allMissions },
          { id: 'daily', label: t.dailyAndHabits },
          { id: 'social', label: t.communityCategory },
          { id: 'prediction', label: t.analysisCategory }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as typeof filter)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition border ${
              filter === item.id
                ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((rawTask: Task) => {
          const task = localizeTask(rawTask, settings.language);
          return (
            <div
              key={task.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                task.status === 'COMPLETED'
                  ? 'border-slate-800/80 bg-slate-900/30 opacity-80'
                  : task.status === 'PENDING_VERIFICATION'
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-cyan-500/20 bg-[#070e1c] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                    : task.status === 'PENDING_VERIFICATION'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 animate-pulse'
                      : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                }`}>
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : task.status === 'PENDING_VERIFICATION' ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <Gift className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-white">{task.title}</h3>
                    <span className="rounded bg-cyan-950 px-1.5 py-0.2 font-tech text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                      +{task.reward.toFixed(2)} FAI
                    </span>
                    {task.durationMode === 'TIME_LIMITED' && task.expiresAt && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.2 font-tech text-[9px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{settings.language === 'ar' ? `ينتهي: ${task.expiresAt}` : `Expires: ${task.expiresAt}`}</span>
                      </span>
                    )}
                    {task.durationMode === 'DAILY_RECURRING' && (
                      <span className="rounded bg-purple-500/10 px-1.5 py-0.2 font-tech text-[9px] font-bold text-purple-300 border border-purple-500/30">
                        {settings.language === 'ar' ? 'تتجدد يومياً' : '24h Recurring'}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed font-sans max-w-sm">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Action State Button */}
              <div className="sm:shrink-0 flex items-center justify-end">
                {task.status === 'COMPLETED' ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-tech">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t.completed}</span>
                  </div>
                ) : task.status === 'PENDING_VERIFICATION' ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-tech">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>{t.verifying}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTaskAction(task)}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>{task.actionText || t.completeMission}</span>
                    {task.isExternal && <ExternalLink className="h-3 w-3" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
