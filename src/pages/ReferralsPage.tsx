import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Sparkles, 
  Gift, 
  Award, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getReferralStats } from '../services/userApi';
import { ReferralTier } from '../types';

export const ReferralsPage: React.FC = () => {
  const { user, showToast, t, settings } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const isAr = settings.language === 'ar';

  const stats = getReferralStats(user);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    setCopiedCode(true);
    showToast(t.codeCopied, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(stats.referralLink);
    setCopiedLink(true);
    showToast(t.linkCopied, 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isAr ? 'FootballAI - توقعات كرة القدم بالذكاء الاصطناعي ونقاط FAI' : 'FootballAI - AI Football Predictions & Points',
        text: isAr ? `انضم إلى FootballAI باستخدام رمز دعوتي ${stats.referralCode} لتحليل مباريات كرة القدم بالذكاء الاصطناعي وربح نقاط FAI!` : `Join FootballAI with my invitation code ${stats.referralCode} to analyze football with AI and earn FAI pilot points!`,
        url: stats.referralLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
          <Share2 className="h-5 w-5 text-cyan-400" />
          <span>{t.inviteEarn}</span>
        </h1>
        <p className="text-xs text-slate-400">
          {t.inviteSubtitle}
        </p>
      </div>

      {/* Referral Code & Link Card */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#08152c] to-[#040914] p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Code Row */}
        <div>
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
            {t.referralCode}
          </span>
          <div className="mt-1 flex items-center justify-between rounded-2xl border border-cyan-500/40 bg-[#060d1b] p-3">
            <span className="font-mono text-xl font-extrabold text-cyan-400 tracking-widest">
              {stats.referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-950 px-3 py-1.5 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 transition"
            >
              {copiedCode ? <Check className="h-4 w-4 text-cyan-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedCode ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Link Row */}
        <div>
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
            {t.referralLink}
          </span>
          <div className="mt-1 flex items-center justify-between rounded-2xl border border-slate-800 bg-[#060d1b] p-3 text-xs">
            <span className="font-mono text-slate-300 truncate max-w-[200px] sm:max-w-none">
              {stats.referralLink}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
              </button>
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.totalReferrals}</span>
          <span className="text-xl font-black font-display text-white mt-1 block">
            {stats.totalReferrals}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.qualifiedReferrals}</span>
          <span className="text-xl font-black font-display text-cyan-400 mt-1 block">
            {stats.qualifiedReferrals}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5 text-center">
          <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.rewardsEarned}</span>
          <span className="text-xl font-black font-display text-emerald-400 mt-1 block">
            {stats.rewardsEarned.toFixed(2)}
          </span>
          <span className="text-[9px] text-emerald-400 font-tech">FAI</span>
        </div>
      </div>

      {/* Referral Milestones & Tiers */}
      <div className="rounded-3xl border border-slate-800 bg-[#070d1a] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            <span>{t.milestones}</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-tech">{t.tierUnlocks}</span>
        </div>

        <div className="space-y-2">
          {stats.tiers.map((tier: ReferralTier, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                tier.completed
                  ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300'
                  : 'border-slate-800/80 bg-slate-900/30 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                  tier.completed 
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400' 
                    : 'border-slate-700 bg-slate-800 text-slate-500'
                }`}>
                  {tier.completed ? <CheckCircle2 className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr 
                      ? `${tier.referralsRequired} ${tier.referralsRequired === 1 ? 'صديق مدعو' : 'أصدقاء مدعوون'}`
                      : `${tier.referralsRequired} ${tier.referralsRequired === 1 ? 'Friend' : 'Friends'} Invited`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isAr 
                      ? (tier.perks === 'Starter bonus unlocked' ? 'مكافأة الانطلاق مفتوحة' :
                         tier.perks === 'Bronze analyst status' ? 'رتبة المحلل البرونزي' :
                         tier.perks === 'Silver badge + 2x weekly rewards' ? 'شارة فضية + مضاعفة المكافآت الأسبوعية' :
                         tier.perks === 'Gold ambassador + VIP AI telemetry' ? 'سفير ذهبي + بيانات تكتيكية خاصة' : tier.perks)
                      : tier.perks}
                  </span>
                </div>
              </div>

              <span className="font-tech text-xs font-bold text-cyan-400">
                +{tier.rewardBonus.toFixed(2)} FAI
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
