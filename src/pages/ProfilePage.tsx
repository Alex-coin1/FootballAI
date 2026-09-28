import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Sparkles, 
  Flame, 
  Award, 
  Trophy, 
  TrendingUp, 
  Share2, 
  ShieldCheck, 
  Edit3, 
  Check, 
  CheckCircle2,
  Calendar,
  Wallet,
  Coins,
  LogOut,
  Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_ACHIEVEMENTS, getReferralStats } from '../services/userApi';
import { UserPredictionRecord, Achievement } from '../types';
import { localizeAchievement } from '../i18n/localize';
import { formatBnbAddress } from '../services/web3BnbService';

export const ProfilePage: React.FC = () => {
  const { user, predictions, showToast, settings, openAuthModal, logout, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [copiedLink, setCopiedLink] = useState(false);
  const isAr = settings.language === 'ar';
  const stats = getReferralStats(user);

  const wonCount = predictions.filter((p: UserPredictionRecord) => p.status === 'WON').length;
  const winRate = predictions.length > 0 
    ? Math.round((wonCount / predictions.length) * 100) 
    : 66;

  const handleSaveName = () => {
    if (!usernameInput.trim()) return;
    user.username = usernameInput.trim();
    setIsEditing(false);
    showToast(t.usernameUpdatedToast, 'success');
  };

  const displayUsername = user.username === 'Guest Player' ? t.guestPlayer : user.username;
  const displayLevelTitle = user.levelTitle === 'Beginner Analyst' ? t.beginnerAnalyst : user.levelTitle;

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Profile Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#09172f] to-[#050b18] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with cyber frame */}
          <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20">
            <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover rounded-xl" />
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-start min-w-0">
            {isEditing ? (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="rounded-xl border border-cyan-400 bg-slate-900 px-3 py-1 text-sm text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950"
                >
                  {t.save}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg font-bold font-display text-white truncate">
                  {displayUsername}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-slate-400 hover:text-cyan-400"
                  title={t.editUsername}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 font-tech font-bold text-cyan-400 border border-cyan-500/30">
                Lv.{user.level} {displayLevelTitle}
              </span>
              <span className="text-slate-400 font-sans flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t.joined} {user.joinedDate}
              </span>
            </div>

            {/* Level XP Bar */}
            <div className="mt-3 max-w-sm">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>{t.experienceProgress}</span>
                <span className="text-cyan-400 font-tech">{user.xp}/{user.xpNextLevel} XP</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                  style={{ width: `${(user.xp / user.xpNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web3 & BNB Chain Account Card */}
      <div className="rounded-3xl border border-amber-500/30 bg-[#070e1c] p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
                {isAr ? 'حساب محفظة Web3 (شبكة BNB)' : 'Web3 Wallet Account (BNB Chain)'}
              </h3>
              <span className="text-[10px] text-amber-400 font-tech">
                BNB SMART CHAIN (BEP-20) • ID 56
              </span>
            </div>
          </div>

          {user.isWeb3Connected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="text-xs text-cyan-400 hover:underline font-tech"
              >
                {t.switchAccount}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-900/30 transition"
                title={t.logout}
              >
                <LogOut className="h-3 w-3" />
                <span className="text-[10px]">{t.logout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition"
            >
              {isAr ? 'ربط المحفظة' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase font-tech block">
              {isAr ? 'محفظة Web3 المرتبطة:' : 'Linked Web3 Address:'}
            </span>
            <span className="font-mono text-cyan-300 font-medium">
              {user.walletAddress ? formatBnbAddress(user.walletAddress) : (isAr ? 'غير مرتبطة (ضيف)' : 'Not Connected (Guest)')}
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
            <span className="text-[10px] text-slate-400 uppercase font-tech block">
              {isAr ? 'عنوان إيداع BNB Chain المخصص:' : 'Designated BNB Deposit Address:'}
            </span>
            <span className="font-mono text-amber-300 font-medium">
              {formatBnbAddress(user.bnbDepositAddress || '0x71C8F4a29B56e9c90C88De541a7dE3C8451839A4')}
            </span>
          </div>
        </div>
      </div>

      {/* Unique Referral Link Card */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[#070e1c] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Share2 className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
                {isAr ? 'رابط الإحالة المميز الخاص بك' : 'Your Unique Referral Link'}
              </h3>
              <span className="text-[10px] text-slate-400 font-tech">
                {isAr ? `رمز الإحالة: ${stats.referralCode}` : `Referral Code: ${stats.referralCode}`}
              </span>
            </div>
          </div>
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-tech text-cyan-400 border border-cyan-500/30">
            {stats.totalReferrals} {isAr ? 'أصدقاء مدعوون' : 'Invited'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#040915] p-2.5 text-xs">
          <span className="font-mono text-slate-300 truncate max-w-[200px] sm:max-w-none">
            {stats.referralLink}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(stats.referralLink);
              setCopiedLink(true);
              showToast(t.linkCopied, 'success');
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="flex items-center gap-1 shrink-0 rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* Analyst Overview Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.pilotBalance}</span>
          <span className="text-xl font-black font-display text-white mt-1 block">
            {user.faiBalance.toFixed(2)}
          </span>
          <span className="text-[9px] text-cyan-400 font-tech">{t.pilotPoints}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.activeStreak}</span>
          <span className="text-xl font-black font-display text-amber-400 mt-1 block">
            {user.streakDays} {t.days}
          </span>
          <span className="text-[9px] text-slate-400 font-tech">{t.unbroken}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.predictionsTab}</span>
          <span className="text-xl font-black font-display text-white mt-1 block">
            {user.totalPredictions}
          </span>
          <span className="text-[9px] text-slate-400 font-tech">{t.submitted}</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase">{t.forecastAccuracy}</span>
          <span className="text-xl font-black font-display text-emerald-400 mt-1 block">
            {winRate}%
          </span>
          <span className="text-[9px] text-emerald-400 font-tech">{t.communityRate}</span>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="rounded-3xl border border-slate-800 bg-[#070d1a] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white flex items-center gap-1.5">
            <Award className="h-4 w-4 text-purple-400" />
            <span>{t.communityAchievements}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-tech">{t.ecosystemBadges}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEFAULT_ACHIEVEMENTS.map((rawAch: Achievement) => {
            const ach = localizeAchievement(rawAch, settings.language);
            return (
              <div
                key={ach.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  ach.unlocked
                    ? 'border-cyan-500/30 bg-cyan-950/20'
                    : 'border-slate-800/80 bg-slate-900/30 opacity-60'
                }`}
              >
                <span className="text-2xl">{ach.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{ach.title}</span>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-tech font-bold text-cyan-400">{t.unlocked}</span>
                    ) : (
                      <span className="text-[10px] font-tech text-slate-500">
                        {ach.progress}/{ach.maxProgress}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
