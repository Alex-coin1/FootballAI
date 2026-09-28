import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Copy, 
  Share2, 
  Sparkles, 
  AlertCircle, 
  ExternalLink,
  Coins,
  QrCode,
  User as UserIcon,
  RefreshCw,
  Zap,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  connectWeb3BnbWallet, 
  detectProviderInfo, 
  formatBnbAddress, 
  generateBnbDepositAddress, 
  isValidBnbAddress, 
  switchToBnbChain, 
  BNB_CHAIN_CONFIG,
  getBscScanUrl 
} from '../../services/web3BnbService';
import { getPendingReferrer, getUsersRegistry } from '../../services/userApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'register' 
}) => {
  const { 
    user, 
    registerWithBnbWallet, 
    loginWithWallet, 
    showToast, 
    settings, 
    t 
  } = useApp();

  const isAr = settings.language === 'ar';
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  
  // Registration Form State
  const [walletAddress, setWalletAddress] = useState('');
  const [bnbDepositAddress, setBnbDepositAddress] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [detectedProvider, setDetectedProvider] = useState<{ isInstalled: boolean; name: string }>({ isInstalled: false, name: 'None' });
  const [isNetworkCorrect, setIsNetworkCorrect] = useState(true);
  
  // Post-registration success screen
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Manual input mode toggle
  const [manualInputMode, setManualInputMode] = useState(false);

  // Load existing accounts for quick login
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);

  useEffect(() => {
    setTab(initialTab);
    setRegistrationSuccess(null);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const info = detectProviderInfo();
      setDetectedProvider(info);

      // Check pending referrer
      const pendingRef = getPendingReferrer();
      if (pendingRef) {
        setReferralCode(pendingRef);
      }

      // Load registered accounts
      const registry = getUsersRegistry();
      const accounts = Object.values(registry).map(bundle => bundle.user);
      setSavedAccounts(accounts);
    }
  }, [isOpen]);

  // When wallet address changes, dynamically derive unique BNB Chain deposit address
  useEffect(() => {
    if (walletAddress && isValidBnbAddress(walletAddress)) {
      const depAddr = generateBnbDepositAddress(walletAddress);
      setBnbDepositAddress(depAddr);
      if (!username) {
        setUsername(`Analyst_${walletAddress.slice(2, 6).toUpperCase()}`);
      }
    }
  }, [walletAddress]);

  if (!isOpen) return null;

  // Handle Connect Web3 Wallet
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      const res = await connectWeb3BnbWallet();
      if (res.success && res.address) {
        setWalletAddress(res.address);
        setIsNetworkCorrect(res.chainId === BNB_CHAIN_CONFIG.chainIdDecimal);
        showToast(
          isAr 
            ? `تم ربط محفظة Web3 بنجاح: ${formatBnbAddress(res.address)}` 
            : `Connected Web3 wallet: ${formatBnbAddress(res.address)}`,
          'success'
        );
      } else {
        if (res.error === 'NO_WEB3_PROVIDER') {
          setManualInputMode(true);
          showToast(
            isAr 
              ? 'لم يتم العثور على محفظة متصفح. يمكنك إدخال عنوان BEP-20 يدوياً.' 
              : 'No browser wallet detected. You can enter your BEP-20 address manually.',
            'info'
          );
        } else {
          showToast(
            isAr ? 'تم إلغاء الاتصال أو رفضه في المحفظة.' : 'Wallet connection cancelled or rejected.',
            'warning'
          );
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Connection failed', 'warning');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Switch to BNB Chain
  const handleSwitchToBnbChain = async () => {
    const success = await switchToBnbChain();
    if (success) {
      setIsNetworkCorrect(true);
      showToast(
        isAr ? 'تم التحويل إلى شبكة BNB Smart Chain (Chain ID 56) بنجاح!' : 'Switched to BNB Smart Chain (Chain ID 56)!',
        'success'
      );
    } else {
      showToast(
        isAr ? 'فشل تحويل الشبكة، يرجى اختيار BNB Chain في محفظتك.' : 'Failed to switch network. Please select BNB Chain in your wallet.',
        'warning'
      );
    }
  };

  // Submit Registration
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress || !isValidBnbAddress(walletAddress)) {
      showToast(
        isAr ? 'يرجى إدخال عنوان محفظة BEP-20 صالح على شبكة BNB (يبدأ بـ 0x ويحتوي على 42 رمزاً).' : 'Please connect or enter a valid BEP-20 BNB Chain address (0x...).',
        'warning'
      );
      return;
    }

    const finalDepositAddress = bnbDepositAddress || generateBnbDepositAddress(walletAddress);

    try {
      const result = registerWithBnbWallet({
        walletAddress,
        bnbDepositAddress: finalDepositAddress,
        username: username.trim() || `Analyst_${walletAddress.slice(2, 6)}`,
        referralCode: referralCode.trim()
      });

      setRegistrationSuccess(result.user);
      showToast(
        isAr 
          ? 'تم إنشاء حسابك وربطه بشبكة BNB Chain بنجاح! تم إنشاء رابط إحالتك المميز.' 
          : 'Account registered and linked to BNB Chain! Your unique referral link is ready.',
        'success'
      );
    } catch (e: any) {
      showToast(e.message || 'Registration failed', 'warning');
    }
  };

  // Quick Login with existing wallet
  const handleLoginSubmit = (addr: string) => {
    if (!addr || !isValidBnbAddress(addr)) {
      showToast(
        isAr ? 'عنوان محفظة غير صالح.' : 'Invalid wallet address.',
        'warning'
      );
      return;
    }

    const ok = loginWithWallet(addr);
    if (ok) {
      showToast(
        isAr ? 'تم تسجيل الدخول واستعادة بياناتك بنجاح!' : 'Logged in successfully! Welcome back.',
        'success'
      );
      onClose();
    } else {
      showToast(
        isAr 
          ? 'هذا العنوان غير مسجل بعد. يمكنك إنشاء حساب جديد خلال ثوانٍ!' 
          : 'Wallet not registered yet. Switch to the Register tab to create your account!',
        'info'
      );
      setWalletAddress(addr);
      setTab('register');
    }
  };

  // Copy Referral Link
  const handleCopyLink = () => {
    if (registrationSuccess?.referralLink) {
      navigator.clipboard.writeText(registrationSuccess.referralLink);
      setCopiedLink(true);
      showToast(t.linkCopied, 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Share Referral Link
  const handleShareLink = () => {
    if (registrationSuccess?.referralLink && navigator.share) {
      navigator.share({
        title: isAr ? 'FootballAI - توقعات كرة القدم بالذكاء الاصطناعي' : 'FootballAI - AI Football Predictions & BNB Rewards',
        text: isAr 
          ? `سجل في FootballAI باستخدام رابط إحالتي المميز واربح مكافآت FAI عبر شبكة BNB Chain!` 
          : `Join FootballAI with my unique referral link and earn pilot rewards on BNB Chain!`,
        url: registrationSuccess.referralLink
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4 bg-[#050a16]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm shadow-amber-500/20">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold font-display text-white">
                  {registrationSuccess 
                    ? (isAr ? 'تم التسجيل بنجاح' : 'Registration Complete') 
                    : tab === 'register' 
                      ? (isAr ? 'ربط محفظة Web3 وعنوان إيداع BNB' : 'Web3 Registration & BNB Deposit')
                      : (isAr ? 'تسجيل الدخول بمحفظة Web3' : 'Web3 Wallet Login')}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-tech text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>BNB SMART CHAIN (BEP-20) • CHAIN ID 56</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Post-Registration Success View */}
        {registrationSuccess ? (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
                <Check className="h-7 w-7 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold font-display text-white">
                {isAr ? 'أهلاً بك في منظومة FootballAI!' : 'Welcome to FootballAI!'}
              </h4>
              <p className="text-xs text-slate-300">
                {isAr 
                  ? 'تم ربط محفظتك وعنوان الإيداع بنجاح. تم إنشاء رابط الإحالة الفريد الخاص بك!' 
                  : 'Your Web3 wallet and BNB Chain deposit address are linked. Your unique referral link is ready!'}
              </p>
            </div>

            {/* Unique Referral Link Card */}
            <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase font-tech tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isAr ? 'رابط الإحالة المميز الخاص بك' : 'Your Unique Referral Link'}</span>
                </span>
                <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-tech text-cyan-300 border border-cyan-500/30">
                  {registrationSuccess.referralCode}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 text-xs">
                <span className="font-mono text-slate-200 truncate pr-2">
                  {registrationSuccess.referralLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 shrink-0 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{isAr ? 'مكافأة كل صديق مدعو:' : 'Reward per invited friend:'}</span>
                <span className="font-tech font-bold text-amber-400">+0.20 FAI</span>
              </div>
            </div>

            {/* Linked Data Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>{isAr ? 'المحفظة المرتبطة:' : 'Linked Web3 Wallet:'}</span>
                <span className="font-mono text-white">{formatBnbAddress(registrationSuccess.walletAddress)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>{isAr ? 'عنوان إيداع BNB Chain:' : 'BNB Deposit Address:'}</span>
                <span className="font-mono text-cyan-400">{formatBnbAddress(registrationSuccess.bnbDepositAddress)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>{isAr ? 'رصيد الانطلاق الترحيبي:' : 'Welcome Balance Grant:'}</span>
                <span className="font-tech font-bold text-emerald-400">+{registrationSuccess.faiBalance} FAI</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShareLink}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition"
              >
                <Share2 className="h-4 w-4" />
                <span>{t.share}</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition shadow-md shadow-cyan-500/20"
              >
                {isAr ? 'الدخول للمنظومة' : 'Enter Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
              <button
                onClick={() => setTab('register')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold font-tech uppercase tracking-wider transition ${
                  tab === 'register'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'إنشاء حساب وربط محفظة' : 'Register & Link'}
              </button>
              <button
                onClick={() => setTab('login')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold font-tech uppercase tracking-wider transition ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isAr ? 'تسجيل الدخول' : 'Log In'}
              </button>
            </div>

            {/* TAB 1: REGISTRATION */}
            {tab === 'register' && (
              <form onSubmit={handleSubmitRegister} className="space-y-4">
                {/* Step 1: Connect Web3 Wallet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] text-cyan-400 font-bold">1</span>
                      <span>{isAr ? 'ربط محفظة Web3 (شبكة BNB)' : 'Connect Web3 Wallet (BNB Chain)'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setManualInputMode(!manualInputMode)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {manualInputMode 
                        ? (isAr ? 'استخدام المحفظة التلقائية' : 'Auto-detect Wallet') 
                        : (isAr ? 'إدخال العنوان يدوياً' : 'Manual Address')}
                    </button>
                  </div>

                  {!manualInputMode ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleConnectWallet}
                        disabled={isConnectingWallet}
                        className="w-full flex items-center justify-between rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-blue-950/30 p-3 hover:border-cyan-400 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                            <Wallet className="h-4 w-4" />
                          </div>
                          <div className="text-start">
                            <span className="text-xs font-bold text-white block">
                              {walletAddress 
                                ? formatBnbAddress(walletAddress) 
                                : detectedProvider.isInstalled 
                                  ? `${isAr ? 'ربط' : 'Connect'} ${detectedProvider.name}` 
                                  : (isAr ? 'ربط محفظة Web3' : 'Connect Web3 Wallet')}
                            </span>
                            <span className="text-[10px] text-cyan-300">
                              {walletAddress 
                                ? (isAr ? 'تم ربط المحفظة بنجاح' : 'Wallet connected & verified') 
                                : (isAr ? 'MetaMask / Trust / Binance Web3' : 'MetaMask, Trust, Binance Web3')}
                            </span>
                          </div>
                        </div>

                        {walletAddress ? (
                          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-tech text-emerald-400 border border-emerald-500/30">
                            <Check className="h-3 w-3" />
                            <span>{isAr ? 'متصل' : 'CONNECTED'}</span>
                          </div>
                        ) : (
                          <span className="rounded-xl bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950">
                            {isConnectingWallet ? '...' : (isAr ? 'اتصال' : 'Connect')}
                          </span>
                        )}
                      </button>

                      {/* Network Warning & Switcher */}
                      {walletAddress && !isNetworkCorrect && (
                        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 flex items-center justify-between text-xs text-amber-300">
                          <span>{isAr ? 'المحفظة ليست على شبكة BNB (Chain ID 56)' : 'Wallet not on BNB Smart Chain'}</span>
                          <button
                            type="button"
                            onClick={handleSwitchToBnbChain}
                            className="rounded-lg bg-amber-500 px-2.5 py-1 text-slate-950 font-bold text-[11px] hover:bg-amber-400"
                          >
                            {isAr ? 'تحويل للشبكة' : 'Switch Network'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={e => setWalletAddress(e.target.value.trim())}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {isAr ? 'أدخل عنوان BEP-20 الخاص بمحفظتك على شبكة BNB' : 'Enter your 42-character BEP-20 address on BNB Smart Chain'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Step 2: Linked BNB Chain Deposit Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[10px] text-amber-400 font-bold">2</span>
                    <span>{isAr ? 'عنوان الإيداع المرتبط (شبكة BNB)' : 'Linked BNB Chain Deposit Address'}</span>
                  </label>
                  <div className="rounded-2xl border border-amber-500/30 bg-[#0d0d17] p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-tech block">
                        {isAr ? 'عنوان إيداع BEP-20 المخصص لك' : 'Designated BEP-20 Deposit Vault'}
                      </span>
                      <span className="font-mono text-amber-300 font-medium">
                        {bnbDepositAddress ? formatBnbAddress(bnbDepositAddress) : '0x71C8... (Auto-assigned)'}
                      </span>
                    </div>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-tech text-amber-400 border border-amber-500/20">
                      BNB CHAIN
                    </span>
                  </div>
                </div>

                {/* Step 3: Username & Referral Code */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500/20 text-[10px] text-purple-400 font-bold">3</span>
                      <span>{isAr ? 'اسم المحلل الرياضي' : 'Analyst Username'}</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CyberStriker_7"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-300">
                        {isAr ? 'رمز الإحالة (اختياري)' : 'Referral Code (Optional)'}
                      </label>
                      {referralCode && (
                        <span className="text-[10px] font-tech text-emerald-400">
                          ✓ {isAr ? 'مكافأة الدعوة مفعلة (+0.05 FAI)' : 'Inviter bonus active (+0.05 FAI)'}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. BNB-7F9A or FAI2026"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!walletAddress}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isAr ? 'إتمام التسجيل وتوليد رابط الإحالة المميز' : 'Register & Generate Unique Referral Link'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN */}
            {tab === 'login' && (
              <div className="space-y-4">
                {/* 1-Click Browser Wallet Login */}
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Zap className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase font-tech tracking-wider">
                      {isAr ? 'تسجيل دخول سريع بمحفظة المتصفح' : '1-Click Web3 Wallet Login'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {isAr 
                      ? 'قم بالاتصال بمحفظتك المسجلة للوصول الفوري إلى رصيدك وتوقعاتك ورابط إحالتك.' 
                      : 'Connect with your registered Web3 wallet to access your balance, predictions, and unique referral stats.'}
                  </p>
                  <button
                    onClick={async () => {
                      setIsConnectingWallet(true);
                      const res = await connectWeb3BnbWallet();
                      setIsConnectingWallet(false);
                      if (res.success && res.address) {
                        handleLoginSubmit(res.address);
                      } else {
                        showToast(
                          isAr ? 'تعذر قراءة المحفظة أو تم الإلغاء.' : 'Failed to connect wallet or user cancelled.',
                          'warning'
                        );
                      }
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>{isConnectingWallet ? '...' : (isAr ? 'تسجيل الدخول بمحفظة Web3' : 'Log In with Web3 Wallet')}</span>
                  </button>
                </div>

                {/* Previously Saved Accounts */}
                {savedAccounts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400">
                      {isAr ? 'الحسابات المسجلة على هذا الجهاز' : 'Accounts on this Device'}
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {savedAccounts.map((acc: any) => (
                        <div
                          key={acc.id}
                          onClick={() => handleLoginSubmit(acc.walletAddress || '')}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 hover:border-cyan-500/40 hover:bg-slate-800/80 cursor-pointer transition text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg overflow-hidden border border-slate-700">
                              <img src={acc.avatarUrl} alt={acc.username} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{acc.username}</span>
                              <span className="font-mono text-[10px] text-cyan-400">{formatBnbAddress(acc.walletAddress)}</span>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="font-tech font-bold text-amber-400 block">{acc.faiBalance.toFixed(2)} FAI</span>
                            <span className="text-[10px] text-slate-500">{acc.referralCode}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual BEP-20 Address Input */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <label className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400">
                    {isAr ? 'أو أدخل عنوان BEP-20 الخاص بك' : 'Or Enter Your BEP-20 Address'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value.trim())}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
                    />
                    <button
                      onClick={() => handleLoginSubmit(walletAddress)}
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-950 transition"
                    >
                      {isAr ? 'دخول' : 'Go'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
