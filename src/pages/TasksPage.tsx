import React, { useState, useRef } from 'react';
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
  Compass,
  Upload,
  X,
  ShieldCheck,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { localizeTask } from '../i18n/localize';

export const TasksPage: React.FC = () => {
  const { 
    user,
    tasks, 
    completeTask, 
    submitTaskForVerification, 
    setCurrentTab, 
    openAuthModal, 
    showToast, 
    settings, 
    t 
  } = useApp();
  const isAr = settings.language === 'ar';

  const [filter, setFilter] = useState<'all' | 'daily' | 'social' | 'prediction'>('all');

  // Submit Evidence Modal State
  const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState<Task | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<string>('');
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const evidenceFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Screenshot Upload
  const handleEvidenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select an image file', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(isAr ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميغابايت)' : 'Image too large (max 5MB)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setEvidenceImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTaskAction = (task: Task) => {
    if (task.status === 'COMPLETED') return;

    if (!user.isWeb3Connected) {
      showToast(
        isAr 
          ? 'يرجى ربط محفظة Web3 أولاً لحفظ إنجاز المهام واستلام مكافآت FAI!' 
          : 'Please connect your Web3 wallet first to complete missions and earn FAI rewards!',
        'warning'
      );
      openAuthModal('register');
      return;
    }

    if (task.status === 'PENDING_VERIFICATION') {
      showToast(
        isAr 
          ? 'طلبك قيد مراجعة واعتماد المسؤول حالياً. سيتم إضافة نقاط FAI فور الموافقة.' 
          : 'Your submission is under admin review. FAI points will be awarded upon approval.',
        'info'
      );
      return;
    }

    if (task.id === 'task-1') {
      // Daily check in
      setCurrentTab('home');
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

    // For social, external, or custom tasks, open evidence submission modal
    if (task.actionUrl) {
      window.open(task.actionUrl, '_blank', 'noopener,noreferrer');
    }

    setSelectedTaskForEvidence(task);
    setEvidenceNote('');
    setEvidenceImage('');
  };

  // Submit Evidence Handler
  const handleSubmitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForEvidence) return;

    if (!evidenceNote.trim() && !evidenceImage) {
      showToast(
        isAr 
          ? 'يرجى كتابة معرف حسابك أو ملاحظة أو رفع صورة لإثبات إنجاز المهمة' 
          : 'Please provide proof note, handle, or upload a screenshot',
        'warning'
      );
      return;
    }

    setIsSubmittingEvidence(true);
    submitTaskForVerification(
      selectedTaskForEvidence.id,
      evidenceNote.trim(),
      evidenceImage || undefined
    );
    setIsSubmittingEvidence(false);
    setSelectedTaskForEvidence(null);
  };

  const filteredTasks = tasks.filter((taskItem: Task) => filter === 'all' || taskItem.category === filter);

  const completedCount = tasks.filter((taskItem: Task) => taskItem.status === 'COMPLETED').length;
  const pendingCount = tasks.filter((taskItem: Task) => taskItem.status === 'PENDING_VERIFICATION').length;
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
          {isAr 
            ? 'أكمل المهام المجتمعية وقدم الأدلة للاعتماد من قبل الإدارة لكسب نقاط FAI المعتمدة' 
            : 'Complete community missions, submit proof for Admin review, and earn verified FAI rewards'}
        </p>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#09152a] to-[#060c18] p-3.5">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.missionsDone}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black font-display text-white">{completedCount}</span>
            <span className="text-[10px] text-slate-400 font-tech">/ {tasks.length}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#1a1205] to-[#060c18] p-3.5">
          <span className="text-[10px] font-tech text-amber-300 uppercase">
            {isAr ? 'قيد المراجعة' : 'In Review'}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black font-display text-amber-400">{pendingCount}</span>
            <span className="text-[10px] text-amber-500/80 font-tech">
              {isAr ? 'بانتظار الإدارة' : 'Pending Admin'}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#09152a] to-[#060c18] p-3.5">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.earnedFromTasks}</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black font-display text-cyan-400">+{totalReward.toFixed(2)}</span>
            <span className="text-[10px] text-cyan-300 font-tech">FAI</span>
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
                  ? 'border-emerald-500/30 bg-emerald-950/10 opacity-90'
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
                        <span>{isAr ? `ينتهي: ${task.expiresAt}` : `Expires: ${task.expiresAt}`}</span>
                      </span>
                    )}
                    {task.durationMode === 'DAILY_RECURRING' && (
                      <span className="rounded bg-purple-500/10 px-1.5 py-0.2 font-tech text-[9px] font-bold text-purple-300 border border-purple-500/30">
                        {isAr ? 'تتجدد يومياً' : '24h Recurring'}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed font-sans max-w-sm">
                    {task.description}
                  </p>

                  {task.status === 'PENDING_VERIFICATION' && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400 font-tech">
                      <Clock className="h-3 w-3" />
                      <span>
                        {isAr 
                          ? 'قيد مراجعة المسؤول: سيتم إضافة نقاط FAI تلقائياً فور اعتماد الأدلة.' 
                          : 'Under Admin Review: FAI points will be awarded upon approval.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action State Button */}
              <div className="sm:shrink-0 flex items-center justify-end">
                {task.status === 'COMPLETED' ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-tech bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t.completed}</span>
                  </div>
                ) : task.status === 'PENDING_VERIFICATION' ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-tech bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/40">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>{isAr ? 'قيد المراجعة والاعتماد' : 'Pending Admin'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTaskAction(task)}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>{task.actionText || (isAr ? 'تنفيذ وتقديم الإثبات' : 'Submit Proof')}</span>
                    {task.isExternal && <ExternalLink className="h-3 w-3" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          SUBMIT MISSION EVIDENCE MODAL
          ===================================================================== */}
      {selectedTaskForEvidence && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          onClick={() => setSelectedTaskForEvidence(null)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {isAr ? 'تقديم إثبات إنجاز المهمة' : 'Submit Mission Evidence'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'مراجعة واعتماد المسؤول لمنح نقاط FAI' : 'Admin review & verification step'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTaskForEvidence(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Task Banner */}
            <div className="bg-[#09152a] p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  {selectedTaskForEvidence.title}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  {selectedTaskForEvidence.description}
                </span>
              </div>
              <span className="rounded-xl bg-cyan-500/20 px-3 py-1 font-tech text-xs font-black text-cyan-300 border border-cyan-400/40 shrink-0">
                +{selectedTaskForEvidence.reward.toFixed(2)} FAI
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEvidence} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-3 text-xs text-cyan-300 leading-relaxed">
                {isAr 
                  ? 'يرجى تزويدنا بمعرف حسابك (مثال: @اسم_المستخدم على X أو تيليجرام)، أو لقطة شاشة توثق إنجازك للمهمة، حتى يتمكن المسؤول من مراجعتها واعتماد مكافأة FAI لحسابك.' 
                  : 'Please provide your handle (e.g. @your_username on X/Telegram) or upload a screenshot confirming mission completion so Admin can verify and award your FAI points.'}
              </div>

              {/* Evidence Text / Handle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'معرف الحساب / تفاصيل الإثبات' : 'Account Handle / Evidence Note'} *
                </label>
                <textarea
                  rows={3}
                  value={evidenceNote}
                  onChange={(e) => setEvidenceNote(e.target.value)}
                  placeholder={isAr ? 'مثال: تابعت الحساب الرسمي بمعرف @FootballFan وأعدت نشر الإعلان...' : 'e.g. Followed from handle @MyXHandle and reposted the announcement...'}
                  className="w-full rounded-xl border border-slate-800 bg-[#060c18] p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  {isAr ? 'لقطة شاشة تثبت الإنجاز (اختياري / مستحسن)' : 'Screenshot Proof (Optional / Recommended)'}
                </label>

                <input
                  ref={evidenceFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEvidenceImageUpload}
                  className="hidden"
                />

                {!evidenceImage ? (
                  <button
                    type="button"
                    onClick={() => evidenceFileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 py-4 text-xs font-semibold text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isAr ? 'انقر لرفع لقطة الشاشة من هاتفك / حاسوبك' : 'Click to upload screenshot from device'}</span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-slate-950 p-1">
                    <img src={evidenceImage} alt="Proof" className="max-h-48 w-full object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setEvidenceImage('')}
                      className="absolute top-3 right-3 rounded-full bg-black/80 p-1.5 text-white hover:bg-rose-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForEvidence(null)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEvidence || (!evidenceNote.trim() && !evidenceImage)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-lg transition ${
                    !evidenceNote.trim() && !evidenceImage
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isAr ? 'إرسال الإثبات للاعتماد' : 'Submit for Admin Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
