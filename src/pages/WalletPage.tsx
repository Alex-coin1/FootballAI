import React, { useState } from 'react';
import { 
  Wallet, 
  Copy, 
  Check, 
  Lock, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  X,
  Coins,
  QrCode,
  Share2,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityItem } from '../types';
import { localizeActivity } from '../i18n/localize';
import { formatBnbAddress, getBscScanUrl } from '../services/web3BnbService';
import { getReferralStats } from '../services/userApi';

export const WalletPage: React.FC = () => {
  const { 
    user, 
    activities, 
    showToast, 
    settings, 
    openAuthModal, 
    depositOnBnbChain, 
    t 
  } = useApp();

  const isAr = settings.language === 'ar';
  const [copiedDeposit, setCopiedDeposit] = useState(false);
  const [copiedRefLink, setCopiedRefLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showTestDepositModal, setShowTestDepositModal] = useState(false);

  // Test deposit form state
  const [depositAsset, setDepositAsset] = useState<'BNB' | 'USDT' | 'FAI'>('BNB');
  const [depositAmount, setDepositAmount] = useState('0.1');

  const stats = getReferralStats(user);
  const depositAddr = user.bnbDepositAddress || '0x71C8F4a29B56e9c90C88De541a7dE3C8451839A4';

  const handleCopyDeposit = () => {
    navigator.clipboard.writeText(depositAddr);
    setCopiedDeposit(true);
    showToast(t.pilotAddressCopied, 'info');
    setTimeout(() => setCopiedDeposit(false), 2000);
  };

  const handleCopyRefLink = () => {
    navigator.clipboard.writeText(stats.referralLink);
    setCopiedRefLink(true);
    showToast(t.linkCopied, 'success');
    setTimeout(() => setCopiedRefLink(false), 2000);
  };

  const handleExecuteTestDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) {
      showToast(isAr ? 'يرجى إدخال مبلغ إيداع صالح' : 'Please enter a valid deposit amount', 'warning');
      return;
    }

    depositOnBnbChain(depositAsset, val);
    setShowTestDepositModal(false);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Wallet className="h-5 w-5 text-cyan-400" />
            <span>{t.walletTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {t.walletSubtitle}
          </p>
        </div>

        {/* Auth / Link Wallet Trigger */}
        {!user.isWeb3Connected ? (
          <button
            onClick={() => openAuthModal('register')}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition active:scale-95"
          >
            <Coins className="h-4 w-4" />
            <span>{isAr ? 'ربط محفظة BNB' : 'Link BNB Wallet'}</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-1.5 text-xs text-amber-300 hover:border-amber-400 transition"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-xs">{formatBnbAddress(user.walletAddress)}</span>
          </button>
        )}
      </div>

      {/* 1. Pilot Balance Card with Network Badge */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#09182f] via-[#061122] to-[#040813] p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-tech font-bold uppercase tracking-wider text-slate-400">
            {t.pilotBalance}
          </span>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-tech text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>BNB SMART CHAIN (BEP-20)</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-display text-white tracking-tight">
            {user.faiBalance.toFixed(4)}
          </span>
          <span className="text-xl font-bold font-tech text-cyan-400">FAI</span>
        </div>

        {/* Linked BNB Deposit Address Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#060c18] p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-tech uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              <span>{isAr ? 'عنوان الإيداع المخصص لك على شبكة BNB' : 'Your BNB Chain Deposit Address (BEP-20)'}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQrModal(true)}
                className="text-slate-400 hover:text-white transition"
                title={isAr ? 'عرض رمز QR' : 'Show QR Code'}
              >
                <QrCode className="h-4 w-4" />
              </button>
              <a
                href={getBscScanUrl('address', depositAddr)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition"
                title={isAr ? 'عرض على BSCScan' : 'View on BSCScan'}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900/90 p-2.5 border border-slate-800 text-xs">
            <span className="font-mono text-cyan-300 font-medium truncate">
              {depositAddr}
            </span>
            <button
              onClick={handleCopyDeposit}
              className="flex items-center gap-1 shrink-0 rounded-lg bg-cyan-950 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 transition"
            >
              {copiedDeposit ? <Check className="h-3.5 w-3.5 text-cyan-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedDeposit ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <span>{isAr ? 'العملات المدعومة للإيداع: BNB, USDT, FAI' : 'Accepted Assets: BNB, USDT (BEP-20), FAI'}</span>
            <button
              onClick={() => setShowTestDepositModal(true)}
              className="text-amber-400 hover:underline font-tech font-bold"
            >
              + {isAr ? 'محاكاة إيداع تجريبي' : 'Simulate Deposit'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Unique Referral Link Box inside Wallet */}
      <div className="rounded-3xl border border-cyan-500/30 bg-[#070e1c] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
                {isAr ? 'رابط الإحالة المميز الخاص بك' : 'Your Unique Referral Link'}
              </h3>
              <span className="text-[10px] text-slate-400 font-tech">
                {isAr ? `الرمز: ${stats.referralCode}` : `Code: ${stats.referralCode}`}
              </span>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-tech text-emerald-400 border border-emerald-500/30">
            {stats.totalReferrals} {isAr ? 'أصدقاء مدعوون' : 'Invited'}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#050a14] p-2.5 text-xs">
          <span className="font-mono text-slate-300 truncate max-w-[220px] sm:max-w-none">
            {stats.referralLink}
          </span>
          <button
            onClick={handleCopyRefLink}
            className="flex items-center gap-1 shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition"
          >
            {copiedRefLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedRefLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
          </button>
        </div>
      </div>

      {/* 3. Mandatory Withdrawals Locked Banner */}
      <div className="rounded-3xl border border-amber-500/40 bg-[#160f04] p-5 space-y-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-amber-300">
            {t.withdrawalsLocked}
          </h3>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
          {t.withdrawalsLockedNotice}
        </p>
      </div>

      {/* 4. BNB Chain Deposit History (if user has any) */}
      {user.depositHistory && user.depositHistory.length > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-[#080d19] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-amber-400 flex items-center gap-1.5">
              <Coins className="h-4 w-4" />
              <span>{isAr ? 'سجل الإيداعات عبر BNB Chain' : 'BNB Chain Deposit History'}</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-tech">BEP-20</span>
          </div>

          <div className="space-y-2">
            {user.depositHistory.map(dep => (
              <div 
                key={dep.id} 
                className="flex items-center justify-between rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      +{dep.amount} {dep.asset}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {dep.txHash.slice(0, 10)}...{dep.txHash.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-tech font-bold text-emerald-400 block">
                    +{dep.faiEquivalent.toFixed(2)} FAI
                  </span>
                  <span className="text-[10px] text-emerald-400 font-tech">CONFIRMED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Internal Ledger Activity */}
      <div className="rounded-3xl border border-slate-800 bg-[#070d1a] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white">
            {t.pilotLedgerActivity}
          </h3>
          <span className="text-[10px] text-slate-500 font-tech">{t.internalLedger}</span>
        </div>

        <div className="space-y-2">
          {activities.map((rawAct: ActivityItem) => {
            const act = localizeActivity(rawAct, settings.language);
            return (
              <div
                key={act.id}
                className="flex items-center justify-between rounded-xl bg-slate-900/40 border border-slate-800/80 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">{act.title}</span>
                    <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                  </div>
                </div>

                <span className="font-tech text-xs font-bold text-emerald-400">
                  +{act.amount.toFixed(2)} FAI
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal for Deposit Address */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="w-full max-w-xs rounded-3xl border border-amber-500/40 bg-[#081224] p-5 shadow-2xl space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold font-tech text-amber-400 uppercase">
                BNB Chain Deposit QR
              </span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Generated QR Placeholder Matrix */}
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3 shadow-inner">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddr}`} 
                alt="Deposit QR" 
                className="h-full w-full"
              />
            </div>

            <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              {depositAddr}
            </p>

            <button
              onClick={handleCopyDeposit}
              className="w-full rounded-xl bg-cyan-500 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              {copiedDeposit ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ العنوان' : 'Copy Address')}
            </button>
          </div>
        </div>
      )}

      {/* Test Deposit Simulator Modal */}
      {showTestDepositModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowTestDepositModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl border border-amber-500/40 bg-[#081224] p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  {isAr ? 'محاكاة إيداع عبر شبكة BNB Chain' : 'BNB Chain Deposit Simulator'}
                </h3>
              </div>
              <button onClick={() => setShowTestDepositModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTestDeposit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300 block mb-1">
                  {isAr ? 'اختر العملة (BEP-20)' : 'Select Asset (BEP-20)'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['BNB', 'USDT', 'FAI'] as const).map(asset => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setDepositAsset(asset)}
                      className={`rounded-xl py-2 text-xs font-bold font-tech transition border ${
                        depositAsset === asset
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300 block mb-1">
                  {isAr ? 'المبلغ' : 'Amount'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div className="rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>{isAr ? 'المقابل في نقاط FAI:' : 'FAI Pilot Equivalent:'}</span>
                  <span className="font-tech font-bold text-emerald-400">
                    +{depositAsset === 'BNB' 
                      ? (parseFloat(depositAmount || '0') * 600).toFixed(2) 
                      : parseFloat(depositAmount || '0').toFixed(2)} FAI
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Network:</span>
                  <span className="font-tech text-amber-400">BNB Smart Chain (56)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-300 hover:to-amber-400 transition shadow-md shadow-amber-500/20"
              >
                {isAr ? 'تأكيد الإيداع وإضافة الرصيد' : 'Confirm Deposit & Credit Balance'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
