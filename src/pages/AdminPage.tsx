import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck,
  Server, 
  Activity, 
  Cpu, 
  Users, 
  Coins, 
  Play, 
  CheckCircle2, 
  RefreshCw,
  Clock,
  Radio,
  Layers,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  EyeOff,
  DollarSign,
  Search,
  Upload,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Lock,
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  ADMIN_WALLET_ADDRESS, 
  isUserAdmin, 
  getManagedNFTs, 
  saveOrUpdateNFT, 
  deleteNFT, 
  updateNFTPrice, 
  updateNFTTradingStatus, 
  getAllRegisteredWallets, 
  adminSetUserBalance 
} from '../services/adminService';
import { NFTCard, NFTRarity, User } from '../types';
import { formatBnbAddress, getBscScanUrl } from '../services/web3BnbService';
import { localizePosition, localizeRarity } from '../i18n/localize';

export const AdminPage: React.FC = () => {
  const { user, showToast, openAuthModal, setCurrentTab, settings, t } = useApp();
  const isAr = settings.language === 'ar';
  const isAdmin = isUserAdmin(user.walletAddress);

  // Active Tab: 'nfts' | 'wallets' | 'diagnostics'
  const [activeTab, setActiveTab] = useState<'nfts' | 'wallets' | 'diagnostics'>('nfts');

  // Diagnostics State
  const [modelLatency, setModelLatency] = useState(38);
  const [feedStatus, setFeedStatus] = useState<'HEALTHY' | 'SYNCING'>('HEALTHY');

  // NFTs State
  const [nftsList, setNftsList] = useState<NFTCard[]>([]);
  const [nftSearch, setNftSearch] = useState('');
  const [nftRarityFilter, setNftRarityFilter] = useState<string>('All');
  const [nftStatusFilter, setNftStatusFilter] = useState<string>('All');

  // NFT Modal State (Create / Edit)
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<NFTCard> | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Price Modal State
  const [quickPriceCard, setQuickPriceCard] = useState<NFTCard | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');

  // Quick Schedule Modal State
  const [quickScheduleCard, setQuickScheduleCard] = useState<NFTCard | null>(null);
  const [scheduleDateInput, setScheduleDateInput] = useState<string>('');

  // Wallets State
  const [walletsList, setWalletsList] = useState<User[]>([]);
  const [walletSearch, setWalletSearch] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [adjustBalanceUser, setAdjustBalanceUser] = useState<User | null>(null);
  const [adjustedBalanceValue, setAdjustedBalanceValue] = useState<string>('');

  // Load data on mount and when admin is verified
  const refreshData = () => {
    const cards = getManagedNFTs();
    setNftsList(cards);
    const users = getAllRegisteredWallets();
    setWalletsList(users);
  };

  useEffect(() => {
    refreshData();
  }, [user.walletAddress]);

  // Handle Image File Upload (converts file to base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setImagePreview(base64Url);
      setEditingCard(prev => ({ ...prev, imageUrl: base64Url }));
    };
    reader.readAsDataURL(file);
  };

  // Open Create NFT Modal
  const handleOpenCreateModal = () => {
    setEditingCard({
      playerName: '',
      club: '',
      position: 'ST',
      nationality: '',
      rarity: 'Epic',
      rating: 88,
      pace: 86,
      shooting: 84,
      passing: 80,
      dribbling: 85,
      defending: 50,
      physical: 75,
      ability: 'Tactical Precision',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      priceFai: 50,
      tradingStatus: 'LISTED',
      scheduledTradingDate: '',
      edition: '#01/100'
    });
    setImagePreview('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80');
    setIsNftModalOpen(true);
  };

  // Open Edit NFT Modal
  const handleOpenEditModal = (card: NFTCard) => {
    setEditingCard({ ...card });
    setImagePreview(card.imageUrl);
    setIsNftModalOpen(true);
  };

  // Save NFT Submit
  const handleSaveNftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard?.playerName?.trim()) {
      showToast(isAr ? 'يرجى إدخال اسم اللاعب' : 'Please enter player name', 'warning');
      return;
    }

    const saved = saveOrUpdateNFT(editingCard as any);
    refreshData();
    setIsNftModalOpen(false);
    showToast(
      isAr 
        ? `تم حفظ بطاقة "${saved.playerName}" بنجاح!` 
        : `NFT "${saved.playerName}" saved successfully!`, 
      'success'
    );
  };

  // Delete NFT
  const handleDeleteNft = (card: NFTCard) => {
    const confirmMsg = isAr 
      ? `هل أنت متأكد من حذف بطاقة "${card.playerName}" نهائياً من السوق؟`
      : `Are you sure you want to delete "${card.playerName}" from the marketplace?`;
    if (window.confirm(confirmMsg)) {
      deleteNFT(card.tokenId);
      refreshData();
      showToast(isAr ? 'تم حذف البطاقة بنجاح' : 'NFT deleted successfully', 'info');
    }
  };

  // Toggle Listing Status
  const handleToggleListing = (card: NFTCard) => {
    const newStatus = card.tradingStatus === 'LISTED' ? 'UNLISTED' : 'LISTED';
    updateNFTTradingStatus(card.tokenId, newStatus);
    refreshData();
    showToast(
      isAr 
        ? `تم تحديث حالة البطاقة إلى: ${newStatus === 'LISTED' ? 'معروض للبيع' : 'غير مدرج'}` 
        : `Updated trading status to: ${newStatus}`,
      'success'
    );
  };

  // Submit Quick Price Update
  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceCard) return;
    const p = parseFloat(newPriceInput);
    if (isNaN(p) || p < 0) {
      showToast(isAr ? 'أدخل سعراً صالحاً' : 'Enter a valid price', 'warning');
      return;
    }

    updateNFTPrice(quickPriceCard.tokenId, p);
    refreshData();
    setQuickPriceCard(null);
    showToast(isAr ? `تم تحديث السعر إلى ${p} FAI` : `Price updated to ${p} FAI`, 'success');
  };

  // Submit Quick Schedule Update
  const handleSaveQuickSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScheduleCard) return;

    updateNFTTradingStatus(quickScheduleCard.tokenId, 'SCHEDULED', scheduleDateInput);
    refreshData();
    setQuickScheduleCard(null);
    showToast(isAr ? 'تمت جدولة موعد إطلاق وتداول البطاقة!' : 'Scheduled trading launch date set!', 'success');
  };

  // Copy Address helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    showToast(isAr ? 'تم نسخ العنوان بنجاح' : 'Address copied to clipboard', 'info');
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Submit Balance Adjustment
  const handleSaveBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustBalanceUser || !adjustBalanceUser.walletAddress) return;
    const b = parseFloat(adjustedBalanceValue);
    if (isNaN(b) || b < 0) {
      showToast(isAr ? 'أدخل رصيداً صالحاً' : 'Enter a valid balance', 'warning');
      return;
    }

    adminSetUserBalance(adjustBalanceUser.walletAddress, b);
    refreshData();
    setAdjustBalanceUser(null);
    showToast(
      isAr 
        ? `تم تعديل رصيد المحفظة إلى ${b} FAI بنجاح!` 
        : `User balance adjusted to ${b} FAI!`, 
      'success'
    );
  };

  // Simulate Telemetry sync
  const handleSimulateSync = () => {
    setFeedStatus('SYNCING');
    showToast(isAr ? 'بدء مزامنة البيانات الحية وتحديث الاحتماليات...' : 'Triggered live telemetry sync...', 'info');
    setTimeout(() => {
      setFeedStatus('HEALTHY');
      setModelLatency(Math.floor(32 + Math.random() * 15));
      showToast(isAr ? 'اكتملت المزامنة بنجاح. زمن الاستجابة 34ms.' : 'Telemetry sync complete. Latency 34ms.', 'success');
    }, 1000);
  };

  // =========================================================================
  // ACCESS RESTRICTED SCREEN (If wallet is not the authorized Super Admin)
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-[#18090b] via-[#0e0709] to-[#060408] p-6 sm:p-8 text-center space-y-5 shadow-2xl shadow-rose-950/50 animate-in fade-in zoom-in-95">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-500/20">
            <Lock className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-tech font-bold text-rose-400 border border-rose-500/30 uppercase tracking-widest">
              {isAr ? 'منطقة مقيدة للمشرف فقط' : 'ADMIN PRIVILEGES REQUIRED'}
            </span>
            <h2 className="text-xl font-bold font-display text-white">
              {isAr ? 'لوحة التحكم مقيدة بالكامل' : 'Access Restricted'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr 
                ? 'لوحة تحكم المنصة وسوق الـ NFTs مخصصة حصرياً لعنوان محفظة المشرف المعتمد. يرجى التبديل لمحفظتك المصرح لها للوصول.'
                : 'This portal is strictly protected and accessible only by the verified administrator wallet.'}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-black/50 p-3.5 space-y-1.5 text-start">
            <span className="text-[10px] font-tech uppercase text-slate-400 block">
              {isAr ? 'عنوان المحفظة المصرح لها (Admin Wallet):' : 'Authorized Admin Address:'}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-amber-300 font-semibold truncate">
                {ADMIN_WALLET_ADDRESS}
              </span>
              <button
                onClick={() => handleCopyText(ADMIN_WALLET_ADDRESS)}
                className="text-slate-400 hover:text-white p-1"
                title="Copy Address"
              >
                {copiedAddress === ADMIN_WALLET_ADDRESS ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {user.walletAddress && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-400 flex justify-between items-center">
              <span>{isAr ? 'محفظتك الحالية:' : 'Your current wallet:'}</span>
              <span className="font-mono text-slate-300">{formatBnbAddress(user.walletAddress)}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition"
            >
              <Coins className="h-4 w-4" />
              <span>{isAr ? 'تبديل لمحفظة المشرف' : 'Switch to Admin Wallet'}</span>
            </button>
            <button
              onClick={() => setCurrentTab('home')}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/80 py-3 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHORIZED SUPER ADMIN CONTROL CENTER
  // =========================================================================
  const filteredNfts = nftsList.filter(card => {
    const matchesRarity = nftRarityFilter === 'All' || card.rarity === nftRarityFilter;
    const matchesStatus = nftStatusFilter === 'All' || 
      (nftStatusFilter === 'LISTED' && card.tradingStatus === 'LISTED') ||
      (nftStatusFilter === 'UNLISTED' && card.tradingStatus === 'UNLISTED') ||
      (nftStatusFilter === 'SCHEDULED' && card.tradingStatus === 'SCHEDULED');
    const matchesQuery = nftSearch === '' || 
      card.playerName.toLowerCase().includes(nftSearch.toLowerCase()) ||
      card.club.toLowerCase().includes(nftSearch.toLowerCase()) ||
      card.position.toLowerCase().includes(nftSearch.toLowerCase());
    return matchesRarity && matchesStatus && matchesQuery;
  });

  const filteredWallets = walletsList.filter(u => {
    const q = walletSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.username?.toLowerCase().includes(q) ||
      u.walletAddress?.toLowerCase().includes(q) ||
      u.bnbDepositAddress?.toLowerCase().includes(q) ||
      u.referralCode?.toLowerCase().includes(q)
    );
  });

  const totalListed = nftsList.filter(c => c.tradingStatus === 'LISTED').length;
  const totalScheduled = nftsList.filter(c => c.tradingStatus === 'SCHEDULED').length;
  const totalUnlisted = nftsList.filter(c => c.tradingStatus === 'UNLISTED').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-[#1b1206] via-[#0d1628] to-[#060c18] p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/30">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display text-white tracking-wide">
                  {isAr ? 'مركز التحكم والإدارة الفائقة' : 'Super Admin Control Studio'}
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-tech font-bold text-amber-300 border border-amber-500/40">
                  OWNER VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5 truncate max-w-sm sm:max-w-none">
                {ADMIN_WALLET_ADDRESS}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-tech text-emerald-400 font-bold uppercase">
              {isAr ? 'جلسة المشرف نشطة' : 'ADMIN SESSION ACTIVE'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs between Admin Features */}
        <div className="flex rounded-2xl bg-slate-900/90 p-1 border border-slate-800 gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('nfts')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold font-tech uppercase tracking-wider transition ${
              activeTab === 'nfts'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{isAr ? 'إدارة وسوق الـ NFTs' : 'NFT Studio & Market'}</span>
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold font-tech uppercase tracking-wider transition ${
              activeTab === 'wallets'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{isAr ? 'المحافظ والمستخدمين' : 'Wallets & Users'}</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold font-tech uppercase tracking-wider transition ${
              activeTab === 'diagnostics'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>{isAr ? 'تشخيصات المنصة' : 'Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: NFT STUDIO & MANAGEMENT
          ===================================================================== */}
      {activeTab === 'nfts' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* NFT Stats Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{isAr ? 'إجمالي البطاقات' : 'Total NFTs'}</span>
              <span className="text-2xl font-black font-display text-white mt-1 block">{nftsList.length}</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-[#06140e] p-3.5">
              <span className="text-[10px] font-tech text-emerald-400 uppercase block">{isAr ? 'معروض للبيع' : 'Active Listed'}</span>
              <span className="text-2xl font-black font-display text-emerald-300 mt-1 block">{totalListed}</span>
            </div>
            <div className="rounded-2xl border border-cyan-500/30 bg-[#06121f] p-3.5">
              <span className="text-[10px] font-tech text-cyan-400 uppercase block">{isAr ? 'مجدول للإطلاق' : 'Scheduled Drops'}</span>
              <span className="text-2xl font-black font-display text-cyan-300 mt-1 block">{totalScheduled}</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-[#0e0f14] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{isAr ? 'غير مدرج' : 'Unlisted Vault'}</span>
              <span className="text-2xl font-black font-display text-slate-300 mt-1 block">{totalUnlisted}</span>
            </div>
          </div>

          {/* Action Header: Search & + Create NFT */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
              <input
                type="text"
                placeholder={isAr ? 'البحث عن لاعب أو نادي أو مركز...' : 'Search player, club, or position...'}
                value={nftSearch}
                onChange={e => setNftSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-[#070e1c] pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition shrink-0"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>{isAr ? 'رفع / إنشاء بطاقة جديدة' : '+ Upload New NFT'}</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Rarity */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {['All', 'Legendary', 'Epic', 'Rare', 'Common'].map(r => (
                <button
                  key={r}
                  onClick={() => setNftRarityFilter(r)}
                  className={`rounded-xl px-3 py-1 text-xs font-semibold whitespace-nowrap transition border ${
                    nftRarityFilter === r
                      ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar sm:ml-auto">
              {[
                { id: 'All', label: isAr ? 'الكل' : 'All' },
                { id: 'LISTED', label: isAr ? 'المعروض' : 'Listed' },
                { id: 'SCHEDULED', label: isAr ? 'المجدول' : 'Scheduled' },
                { id: 'UNLISTED', label: isAr ? 'المخفي' : 'Unlisted' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setNftStatusFilter(s.id)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition border ${
                    nftStatusFilter === s.id
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* NFTs Management Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredNfts.map(card => (
              <div
                key={`admin-nft-${card.tokenId}`}
                className="rounded-2xl border border-slate-800 bg-gradient-to-b from-[#0b1424] to-[#070d18] p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-all shadow-md"
              >
                {/* Card Top: Avatar + Info */}
                <div className="flex items-start gap-3">
                  <div className="relative h-18 w-18 sm:h-20 sm:w-20 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shrink-0">
                    <img src={card.imageUrl} alt={card.playerName} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] font-bold text-white font-tech">
                      {card.position}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-bold text-white text-sm truncate">
                        {card.playerName}
                      </span>
                      <span className="font-display font-black text-amber-400 text-sm">
                        {card.overallRating || card.rating}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate">{card.club}</span>
                    <span className="text-[10px] text-cyan-300 font-tech block truncate">{card.ability}</span>

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold font-tech uppercase border ${
                        card.rarity === 'Legendary' ? 'border-amber-400 bg-amber-500/20 text-amber-300' :
                        card.rarity === 'Epic' ? 'border-purple-400 bg-purple-500/20 text-purple-300' :
                        card.rarity === 'Rare' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' :
                        'border-slate-500 bg-slate-500/20 text-slate-300'
                      }`}>
                        {card.rarity}
                      </span>

                      <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold font-tech uppercase ${
                        card.tradingStatus === 'LISTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        card.tradingStatus === 'SCHEDULED' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {card.tradingStatus || 'LISTED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Schedule Info */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-tech block">{isAr ? 'السعر الحالي' : 'Listing Price'}</span>
                    <span className="font-tech font-bold text-amber-300 text-sm">
                      {card.priceFai ?? 50} FAI
                    </span>
                  </div>

                  {card.scheduledTradingDate ? (
                    <div className="text-end">
                      <span className="text-[10px] text-cyan-400 uppercase font-tech block flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        <span>{isAr ? 'موعد الإطلاق' : 'Scheduled'}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-300">
                        {card.scheduledTradingDate}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">#{card.tokenId}</span>
                  )}
                </div>

                {/* Card Controls Grid */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => handleOpenEditModal(card)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 py-1.5 text-xs text-white transition"
                    title={isAr ? 'تعديل البيانات والصورة' : 'Edit details & image'}
                  >
                    <Edit className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-[11px] font-semibold">{isAr ? 'تعديل' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickPriceCard(card);
                      setNewPriceInput((card.priceFai ?? 50).toString());
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 py-1.5 text-xs text-amber-300 transition"
                    title={isAr ? 'تعديل السعر' : 'Adjust price'}
                  >
                    <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-[11px] font-semibold">{isAr ? 'السعر' : 'Price'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleListing(card)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 py-1.5 text-xs text-slate-300 transition"
                    title={card.tradingStatus === 'LISTED' ? (isAr ? 'إخفاء من السوق' : 'Delist') : (isAr ? 'عرض بالسوق' : 'List')}
                  >
                    {card.tradingStatus === 'LISTED' ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-semibold">{isAr ? 'إخفاء' : 'Delist'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[11px] font-semibold">{isAr ? 'عرض' : 'List'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteNft(card)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/20 py-1.5 text-xs text-rose-300 transition"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-[11px] font-semibold">{isAr ? 'حذف' : 'Del'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: REGISTERED WALLETS & USERS
          ===================================================================== */}
      {activeTab === 'wallets' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Wallets Overview Header */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#070e1c] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span>{isAr ? 'سجل المحافظ والمستخدمين المسجلين' : 'Registered Web3 Wallets Directory'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'عرض وإدارة كافة المحافظ المرتبطة بالمنظومة، وأرصدة FAI، وعناوين الإيداع المخصصة.' 
                  : 'Inspect and manage all linked wallets, FAI balances, and designated BNB deposit vaults.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-tech text-cyan-300 border border-cyan-500/30">
                {walletsList.length} {isAr ? 'محافظ مسجلة' : 'Registered'}
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
            <input
              type="text"
              placeholder={isAr ? 'البحث عن محفظة (0x...)، اسم المستخدم، أو رمز الإحالة...' : 'Search wallet address (0x...), username, or referral code...'}
              value={walletSearch}
              onChange={e => setWalletSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-[#070e1c] pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          {/* Wallets Cards List */}
          <div className="space-y-3">
            {filteredWallets.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-8 text-center text-slate-400 text-xs">
                {isAr ? 'لم يتم العثور على محافظ مطابقة للبحث' : 'No wallets found matching your search'}
              </div>
            ) : (
              filteredWallets.map(u => (
                <div
                  key={`wallet-user-${u.id}-${u.walletAddress}`}
                  className="rounded-2xl border border-slate-800 bg-gradient-to-r from-[#070f1e] to-[#050a14] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-cyan-500/30 transition"
                >
                  {/* User Avatar & Identity */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      <img src={u.avatarUrl} alt={u.username} className="h-full w-full object-cover" />
                      {u.walletAddress?.toLowerCase() === ADMIN_WALLET_ADDRESS && (
                        <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[9px] px-1 font-bold">
                          👑
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">{u.username}</span>
                        <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[10px] font-tech text-cyan-400 border border-cyan-500/30">
                          Lv.{u.level}
                        </span>
                        {u.streakDays > 0 && (
                          <span className="text-[10px] text-amber-400 font-tech">🔥 {u.streakDays}d</span>
                        )}
                      </div>

                      {/* Wallet Address */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-tech uppercase text-[10px]">{isAr ? 'المحفظة:' : 'Wallet:'}</span>
                        <span className="font-mono text-cyan-300 font-medium truncate max-w-[200px] sm:max-w-none">
                          {u.walletAddress || 'Unlinked'}
                        </span>
                        {u.walletAddress && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleCopyText(u.walletAddress!)}
                              className="text-slate-400 hover:text-white p-0.5"
                              title="Copy"
                            >
                              {copiedAddress === u.walletAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            </button>
                            <a
                              href={getBscScanUrl('address', u.walletAddress)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-cyan-400 p-0.5"
                              title="View on BSCScan"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* BNB Deposit Vault */}
                      {u.bnbDepositAddress && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-amber-300/80">
                          <span className="text-slate-500 font-tech uppercase text-[10px]">{isAr ? 'الإيداع:' : 'Vault:'}</span>
                          <span className="font-mono text-[11px] truncate max-w-[200px] sm:max-w-none">
                            {u.bnbDepositAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial & Activity Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center min-w-[100px]">
                      <span className="text-[10px] text-slate-400 uppercase font-tech block">{isAr ? 'الرصيد' : 'Balance'}</span>
                      <span className="font-tech font-bold text-amber-400 text-sm block">
                        {(u.faiBalance || 0).toFixed(4)} FAI
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-center min-w-[80px]">
                      <span className="text-[10px] text-slate-400 uppercase font-tech block">{isAr ? 'الإحالات' : 'Referrals'}</span>
                      <span className="font-tech font-bold text-cyan-400 text-sm block">
                        {u.totalReferrals || 0}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">{u.referralCode}</span>
                    </div>

                    {/* Admin Balance Action */}
                    {u.walletAddress && (
                      <button
                        onClick={() => {
                          setAdjustBalanceUser(u);
                          setAdjustedBalanceValue((u.faiBalance || 0).toString());
                        }}
                        className="rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 px-3 py-2 text-xs font-bold text-cyan-300 transition"
                      >
                        {isAr ? 'تعديل الرصيد' : 'Adjust FAI'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DIAGNOSTICS & SYSTEM CONTROLS
          ===================================================================== */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{isAr ? 'المحافظ المسجلة' : 'Registered Wallets'}</span>
              <span className="text-xl font-black font-display text-white mt-1 block">{walletsList.length}</span>
              <span className="text-[10px] text-emerald-400 font-tech">BNB Smart Chain</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.distributedFai}</span>
              <span className="text-xl font-black font-display text-cyan-300 mt-1 block">
                {walletsList.reduce((sum, u) => sum + (u.faiBalance || 0), 0).toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-tech">FAI in circulation</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.matchDataFeed}</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm font-bold font-tech text-white">
                  {feedStatus === 'HEALTHY' ? (isAr ? 'سليم' : 'HEALTHY') : (isAr ? 'جاري المزامنة' : 'SYNCING')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-tech">Football-Data.org API</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-3.5">
              <span className="text-[10px] font-tech text-slate-400 uppercase block">{t.modelLatency}</span>
              <span className="text-xl font-black font-display text-purple-300 mt-1 block">
                {modelLatency}ms
              </span>
              <span className="text-[10px] text-purple-400 font-tech">Inference Time</span>
            </div>
          </div>

          {/* Operational Triggers */}
          <div className="rounded-2xl border border-slate-800 bg-[#070e1c] p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>{isAr ? 'أدوات التحكم السريع' : 'Operational Commands'}</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulateSync}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-white transition"
              >
                <RefreshCw className="h-4 w-4 text-cyan-400" />
                <span>{isAr ? 'إعادة مزامنة بيانات كرة القدم' : 'Force Telemetry Sync'}</span>
              </button>

              <button
                onClick={() => {
                  user.lastClaimTimestamp = null;
                  showToast(isAr ? 'تم إلغاء قفل مؤقت التعدين لغايات الفحص الفوري!' : 'Claim lock reset for immediate testing!', 'success');
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-amber-300 transition"
              >
                <Clock className="h-4 w-4 text-amber-400" />
                <span>{isAr ? 'إلغاء قفل مؤقت التعدين (24h)' : 'Unlock 24h Claim Timer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CREATE / EDIT NFT STUDIO MODAL
          ===================================================================== */}
      {isNftModalOpen && editingCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsNftModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl rounded-3xl border border-amber-500/40 bg-[#091122] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#060c18]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    {editingCard.tokenId 
                      ? (isAr ? `تعديل بطاقة: ${editingCard.playerName}` : `Edit NFT: ${editingCard.playerName}`) 
                      : (isAr ? 'رفع وإنشاء بطاقة NFT جديدة' : 'Upload & Create New Football NFT')}
                  </h3>
                  <span className="text-[10px] font-tech text-amber-400">
                    BEP-20 COMPATIBLE • METADATA STANDARD
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsNftModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveNftSubmit} className="p-6 overflow-y-auto space-y-4 no-scrollbar">
              {/* Image Preview & Upload Row */}
              <div className="rounded-2xl border border-slate-800 bg-[#050a14] p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-28 w-28 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-slate-900 shrink-0 shadow-lg shadow-amber-500/10">
                  <img src={imagePreview || editingCard.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>

                <div className="flex-1 w-full space-y-2">
                  <span className="text-xs font-bold font-tech text-slate-300 block uppercase">
                    {isAr ? 'صورة بطاقة الـ NFT' : 'NFT Card Artwork'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-300 hover:to-amber-400 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isAr ? 'رفع صورة من الجهاز' : 'Upload File from Device'}</span>
                    </button>
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageFileUpload} 
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="https://... (or image URL)"
                    value={editingCard.imageUrl || ''}
                    onChange={e => {
                      setEditingCard(prev => ({ ...prev, imageUrl: e.target.value }));
                      setImagePreview(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Basic Details: Name, Club, Position, Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'اسم اللاعب' : 'Player Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lionel Messi, Lamine Yamal"
                    value={editingCard.playerName || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, playerName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'النادي / الفريق' : 'Club / Team'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Real Madrid, Barcelona"
                    value={editingCard.club || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, club: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'المركز' : 'Position'}
                  </label>
                  <select
                    value={editingCard.position || 'ST'}
                    onChange={e => setEditingCard(prev => ({ ...prev, position: e.target.value as any }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    {['ST', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'GK'].map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'الجنسية' : 'Nationality'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brazil, Spain, France"
                    value={editingCard.nationality || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rarity, Rating & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'درجة الندرة' : 'Rarity Tier'}
                  </label>
                  <select
                    value={editingCard.rarity || 'Epic'}
                    onChange={e => setEditingCard(prev => ({ ...prev, rarity: e.target.value as NFTRarity }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Legendary">Legendary (أسطوري)</option>
                    <option value="Epic">Epic (ملحمي)</option>
                    <option value="Rare">Rare (نادر)</option>
                    <option value="Common">Common (شائع)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'التقييم الإجمالي (OVR)' : 'Overall Rating (OVR)'}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={99}
                    value={editingCard.rating || 90}
                    onChange={e => {
                      const v = parseInt(e.target.value) || 90;
                      setEditingCard(prev => ({ ...prev, rating: v, overallRating: v }));
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    {isAr ? 'سعر البيع (نقاط FAI)' : 'Price in FAI'} *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={editingCard.priceFai !== undefined ? editingCard.priceFai : 50}
                    onChange={e => setEditingCard(prev => ({ ...prev, priceFai: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-amber-500/50 bg-slate-900/80 px-3 py-2 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none font-tech"
                  />
                </div>
              </div>

              {/* Trading Status & Scheduled Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-[#050a14] p-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'حالة التداول والإدراج' : 'Marketplace Status'}
                  </label>
                  <select
                    value={editingCard.tradingStatus || 'LISTED'}
                    onChange={e => setEditingCard(prev => ({ ...prev, tradingStatus: e.target.value as any }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="LISTED">{isAr ? 'معروض للبيع فوراً (Listed)' : 'Listed (Available Now)'}</option>
                    <option value="SCHEDULED">{isAr ? 'مجدول للإطلاق في موعد محدد (Scheduled)' : 'Scheduled Drop'}</option>
                    <option value="UNLISTED">{isAr ? 'غير مدرج / مخفي مؤقتاً (Unlisted)' : 'Unlisted (Hidden)'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'موعد بدء التداول المجدول' : 'Scheduled Launch Date / Countdown'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-10-01 20:00 UTC or October 2026"
                    value={editingCard.scheduledTradingDate || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, scheduledTradingDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ability & Custom Description */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'الميزة الخاصة / المهارة الخارقة' : 'Special Ability / Trait'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Supersonic Sprint, Telepathic Playmaker"
                    value={editingCard.ability || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, ability: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isAr ? 'الوصف الكامل للبطاقة' : 'Card Description'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the card rarity, in-game utility, or collection traits..."
                    value={editingCard.description || ''}
                    onChange={e => setEditingCard(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Detailed Attributes (Pace, Shooting, etc.) */}
              <div>
                <span className="text-xs font-bold font-tech text-slate-400 uppercase block mb-2">
                  {isAr ? 'إحصائيات البطاقة الستة (Card Stats):' : 'Card Attributes:'}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { key: 'pace', label: 'PAC' },
                    { key: 'shooting', label: 'SHO' },
                    { key: 'passing', label: 'PAS' },
                    { key: 'dribbling', label: 'DRI' },
                    { key: 'defending', label: 'DEF' },
                    { key: 'physical', label: 'PHY' },
                  ].map(stat => (
                    <div key={stat.key} className="rounded-xl border border-slate-800 bg-slate-900/90 p-2 text-center">
                      <span className="text-[10px] font-bold text-slate-400 block font-tech">{stat.label}</span>
                      <input
                        type="number"
                        min={30}
                        max={99}
                        value={(editingCard as any)[stat.key] ?? 80}
                        onChange={e => {
                          const v = parseInt(e.target.value) || 80;
                          setEditingCard(prev => ({ ...prev, [stat.key]: v }));
                        }}
                        className="w-full bg-transparent text-center font-bold text-white font-tech text-xs mt-1 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Submit Actions */}
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNftModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition"
                >
                  {editingCard.tokenId ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إنشاء وإدراج البطاقة' : 'Create & List NFT')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: QUICK PRICE ADJUSTMENT MODAL
          ===================================================================== */}
      {quickPriceCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setQuickPriceCard(null)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl border border-amber-500/40 bg-[#091122] p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <span>{isAr ? 'تعديل سعر البطاقة' : 'Adjust NFT Price'}</span>
              </h3>
              <button onClick={() => setQuickPriceCard(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {quickPriceCard.playerName} ({quickPriceCard.rarity} - {quickPriceCard.club})
            </p>

            <form onSubmit={handleSaveQuickPrice} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {isAr ? 'السعر الجديد (FAI)' : 'New Price (FAI)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={newPriceInput}
                  onChange={e => setNewPriceInput(e.target.value)}
                  className="w-full rounded-xl border border-amber-500/50 bg-slate-900 px-3 py-2 text-sm font-bold text-amber-300 focus:outline-none font-tech"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuickPriceCard(null)}
                  className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 py-2 text-xs font-bold text-slate-950"
                >
                  {isAr ? 'حفظ السعر' : 'Update Price'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: ADJUST USER WALLET BALANCE
          ===================================================================== */}
      {adjustBalanceUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setAdjustBalanceUser(null)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl border border-cyan-500/40 bg-[#091122] p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-cyan-400" />
                <span>{isAr ? 'تعديل رصيد المحفظة' : 'Adjust Wallet Balance'}</span>
              </h3>
              <button onClick={() => setAdjustBalanceUser(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-0.5">
              <span className="font-bold text-white block">{adjustBalanceUser.username}</span>
              <span className="font-mono text-cyan-400 block text-[11px] truncate">
                {adjustBalanceUser.walletAddress}
              </span>
            </div>

            <form onSubmit={handleSaveBalanceAdjustment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {isAr ? 'الرصيد الجديد (FAI)' : 'New Balance (FAI)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.05}
                  required
                  value={adjustedBalanceValue}
                  onChange={e => setAdjustedBalanceValue(e.target.value)}
                  className="w-full rounded-xl border border-cyan-500/50 bg-slate-900 px-3 py-2 text-sm font-bold text-cyan-300 focus:outline-none font-tech"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustBalanceUser(null)}
                  className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-semibold text-slate-300"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2 text-xs font-bold text-slate-950"
                >
                  {isAr ? 'حفظ الرصيد' : 'Save Balance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
