import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Sparkles, 
  AlertCircle, 
  Shield, 
  Star,
  Lock,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAllNFTCards } from '../services/nftApi';
import { NFTCard, NFTRarity } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { localizePosition, localizeRarity } from '../i18n/localize';

export const NFTsPage: React.FC = () => {
  const { setSelectedNFT, settings, t } = useApp();
  const [cards, setCards] = useState<NFTCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');

  useEffect(() => {
    getAllNFTCards().then((data: NFTCard[]) => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const rarities = [
    { id: 'All', label: t.rarityAll },
    { id: 'Common', label: t.common },
    { id: 'Rare', label: t.rare },
    { id: 'Epic', label: t.epic },
    { id: 'Legendary', label: t.legendary }
  ];

  const positions = [
    { id: 'All', label: t.posAll },
    { id: 'ATT', label: t.posATT },
    { id: 'MID', label: t.posMID },
    { id: 'DEF', label: t.posDEF },
    { id: 'GK', label: t.posGK }
  ];

  const filteredCards = cards.filter((card: NFTCard) => {
    const matchesRarity = selectedRarity === 'All' || card.rarity === selectedRarity;
    const matchesPos = selectedPosition === 'All' || card.position === selectedPosition;
    const matchesQuery = searchQuery === '' || 
      card.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRarity && matchesPos && matchesQuery;
  });

  const getRarityBadgeStyle = (rarity: NFTRarity) => {
    switch (rarity) {
      case 'Legendary':
        return 'border-amber-400/80 bg-amber-500/20 text-amber-300';
      case 'Epic':
        return 'border-purple-400/80 bg-purple-500/20 text-purple-300';
      case 'Rare':
        return 'border-cyan-400/80 bg-cyan-500/20 text-cyan-300';
      default:
        return 'border-slate-500/80 bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <span>{t.marketplaceTitle}</span>
          </h1>
          <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[11px] font-tech text-cyan-400 border border-cyan-500/30">
            50 PLAYERS
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          {t.marketplaceSubtitle}
        </p>

        {/* Mandated Trading & Minting Notice */}
        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-950/30 p-2.5 text-[11px] text-cyan-300">
          <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{t.marketplaceNotice}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlayer}
          className="w-full rounded-2xl border border-slate-800 bg-[#070e1c] pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      {/* Rarity & Position Filter Rows */}
      <div className="space-y-2">
        {/* Rarity Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {rarities.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRarity(r.id)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold whitespace-nowrap transition border ${
                selectedRarity === r.id
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Position Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {positions.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPosition(p.id)}
              className={`rounded-xl px-3 py-1 text-[11px] font-semibold whitespace-nowrap transition border ${
                selectedPosition === p.id
                  ? 'border-blue-400 bg-blue-950/60 text-blue-300'
                  : 'border-slate-800/80 bg-slate-900/20 text-slate-500 hover:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <LoadingSpinner message={t.loadingNFTs} />
      ) : filteredCards.length === 0 ? (
        <EmptyState
          title={t.noNFTsFoundTitle}
          description={t.noNFTsFoundDesc}
          actionText={t.resetFilters}
          onAction={() => {
            setSelectedRarity('All');
            setSelectedPosition('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredCards.map((card, idx) => (
            <div
              key={`nft-card-${card.tokenId || idx}-${card.playerName}`}
              onClick={() => setSelectedNFT(card)}
              className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#0b172a] to-[#070e1c] p-3 transition-all duration-200 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98] flex flex-col justify-between"
            >
              {/* Card Header: Rating, Position, Rarity */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base font-black text-white">{card.overallRating || card.rating}</span>
                  <span className="text-[10px] font-bold text-cyan-400 font-tech uppercase">
                    {localizePosition(card.position, settings.language)}
                  </span>
                </div>
                <span className={`rounded-full border px-1.5 py-0.2 text-[9px] font-bold font-tech uppercase ${getRarityBadgeStyle(card.rarity)}`}>
                  {localizeRarity(card.rarity, settings.language)}
                </span>
              </div>

              {/* Player Image */}
              <div className="my-2 flex justify-center">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl bg-slate-900 border border-slate-700/60 group-hover:scale-105 transition-transform duration-200">
                  <img src={card.imageUrl} alt={card.playerName} className="h-full w-full object-cover" />
                </div>
              </div>

              {/* Player Info */}
              <div className="text-center">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                  {card.playerName}
                </h4>
                <span className="text-[10px] text-slate-400 block truncate">
                  {card.club}
                </span>
              </div>

              {/* Price & Schedule or Inspect Action */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 font-tech font-bold text-amber-400">
                  <span className="text-xs">{card.priceFai ?? (card.rarity === 'Legendary' ? 100 : card.rarity === 'Epic' ? 50 : 25)}</span>
                  <span className="text-[10px] text-amber-500">FAI</span>
                </div>
                {card.tradingStatus === 'SCHEDULED' ? (
                  <span className="rounded bg-cyan-950/80 px-1.5 py-0.2 text-[9px] font-tech text-cyan-300 border border-cyan-500/30">
                    {card.scheduledTradingDate || 'SOON'}
                  </span>
                ) : (
                  <span className="text-cyan-400 font-bold group-hover:underline text-[10px]">
                    {t.inspect}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
