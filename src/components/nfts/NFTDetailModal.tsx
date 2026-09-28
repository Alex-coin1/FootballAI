import React from 'react';
import { X, Shield, Star, Zap, Info, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { localizePosition, localizeRarityTier, localizeTeamName } from '../../i18n/localize';

export const NFTDetailModal: React.FC = () => {
  const { selectedNFT, setSelectedNFT, showToast, t, settings } = useApp();
  const isAr = settings.language === 'ar';

  if (!selectedNFT) return null;

  const positionLabel = localizePosition(selectedNFT.position, settings.language);
  const rarityLabel = localizeRarityTier(selectedNFT.rarity, settings.language);
  const clubLabel = localizeTeamName(selectedNFT.club, settings.language);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-amber-500/30';
      case 'Epic':
        return 'border-purple-400 bg-purple-500/20 text-purple-300 shadow-purple-500/30';
      case 'Rare':
        return 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-cyan-500/30';
      default:
        return 'border-slate-500 bg-slate-500/20 text-slate-300 shadow-slate-500/30';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/50';
      case 'Epic': return 'shadow-[0_0_35px_rgba(168,85,247,0.25)] border-purple-500/50';
      case 'Rare': return 'shadow-[0_0_35px_rgba(6,182,212,0.25)] border-cyan-500/50';
      default: return 'shadow-xl border-slate-700/60';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={() => setSelectedNFT(null)}
    >
      <div 
        className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#070e1c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-[#050912]/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {selectedNFT.edition}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {selectedNFT.cardId || selectedNFT.serialNumber || `#${selectedNFT.tokenId}`}
            </span>
          </div>
          <button
            onClick={() => setSelectedNFT(null)}
            className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
          {/* Card Presentation */}
          <div className={`relative rounded-3xl border-2 bg-gradient-to-b from-[#0e1f38] to-[#081224] p-5 text-center transition-all ${getRarityGlow(selectedNFT.rarity)}`}>
            {/* Top Row: Rating, Position, Serial */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start leading-none">
                <span className="text-3xl font-black font-display text-white">
                  {selectedNFT.overallRating || selectedNFT.rating}
                </span>
                <span className="text-xs font-bold text-cyan-400 uppercase font-tech mt-0.5">{positionLabel}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase font-tech ${getRarityBadge(selectedNFT.rarity)}`}>
                {rarityLabel}
              </span>
            </div>

            {/* Player Avatar */}
            <div className="my-3 flex justify-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-2 border-cyan-400/30 bg-slate-900/80 shadow-inner">
                <img 
                  src={selectedNFT.imageUrl} 
                  alt={selectedNFT.playerName} 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>

            {/* Player Name and Club */}
            <h3 className="text-lg font-bold font-display text-white">
              {selectedNFT.playerName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 mt-0.5">
              <span>{clubLabel}</span>
              <span>•</span>
              <span className="text-cyan-400">{selectedNFT.nationality}</span>
            </div>

            {/* 6 Core Stats Radar / Grid */}
            <div className="mt-4 grid grid-cols-6 gap-1 border-t border-slate-800/80 pt-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'سرعة' : 'PAC'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.pace ?? selectedNFT.pace}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'تسديد' : 'SHO'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.shooting ?? selectedNFT.shooting}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'تمرير' : 'PAS'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.passing ?? selectedNFT.passing}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'مراوغة' : 'DRI'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.dribbling ?? selectedNFT.dribbling}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'دفاع' : 'DEF'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.defense ?? selectedNFT.defending}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400">{isAr ? 'بدني' : 'PHY'}</span>
                <span className="text-xs font-black text-white">
                  {selectedNFT.stats?.physical ?? selectedNFT.physical}
                </span>
              </div>
            </div>
          </div>

          {/* Minting & Disclaimer Info */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-[#080e1a] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{isAr ? 'حالة السك الرقمي' : 'Minting Status'}</span>
                <span className="text-[11px] text-cyan-400 font-tech">{isAr ? 'مجموعة معاينة تجريبية • غير مسكوكة' : 'Preview Collection • Non-Minted'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400">
                <Lock className="h-3.5 w-3.5" />
                <span>{isAr ? 'السوق مقفل' : 'Market Locked'}</span>
              </div>
            </div>

            {/* Card Description if present */}
            {selectedNFT.description && (
              <p className="text-xs text-slate-300 italic pt-2 border-t border-slate-800/80 leading-relaxed">
                "{selectedNFT.description}"
              </p>
            )}

            {/* Price & Trading Status Box */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-tech block">{isAr ? 'سعر البطاقة' : 'Card Price'}</span>
                <span className="text-base font-bold font-tech text-amber-300">
                  {selectedNFT.priceFai ?? (selectedNFT.rarity === 'Legendary' ? 100 : selectedNFT.rarity === 'Epic' ? 50 : 25)} FAI
                </span>
              </div>

              {selectedNFT.scheduledTradingDate ? (
                <div className="text-end">
                  <span className="text-[10px] text-cyan-400 uppercase font-tech block">{isAr ? 'موعد التداول' : 'Launch Date'}</span>
                  <span className="text-xs font-mono text-white">{selectedNFT.scheduledTradingDate}</span>
                </div>
              ) : (
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-tech text-emerald-400 border border-emerald-500/30">
                  {selectedNFT.tradingStatus || 'LISTED'}
                </span>
              )}
            </div>

            {/* Mandated Disclaimers */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3.5 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.marketplaceNotice}
              </p>
            </div>

            <button
              onClick={() => {
                showToast(isAr ? 'تمت إضافة البطاقة إلى قائمة المتابعة!' : 'Card added to your saved watchlist!', 'success');
                setSelectedNFT(null);
              }}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition active:scale-95"
            >
              {isAr ? 'إضافة إلى قائمة متابعة FootballAI' : 'Add to FootballAI Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
