import React from 'react';
import { Bell, Globe, Sparkles, Wallet, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { formatBnbAddress } from '../../services/web3BnbService';

export const Header: React.FC = () => {
  const { 
    user, 
    unreadNotificationsCount, 
    setNotificationPanelOpen, 
    setCurrentTab, 
    toggleLanguage, 
    settings,
    openAuthModal,
    t 
  } = useApp();

  const isAr = settings.language === 'ar';

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 w-full border-b border-cyan-950/60 bg-[#050912]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Brand Logo & Name */}
        <button 
          id="header-brand-btn"
          onClick={() => setCurrentTab('home')}
          className="group flex items-center gap-2.5 transition active:scale-95 text-start"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 p-0.5 border border-cyan-500/40 shadow-sm shadow-cyan-500/30 group-hover:border-cyan-400">
            <img 
              src="/icon.svg" 
              alt="FootballAI" 
              className="h-6 w-6 transition group-hover:scale-105" 
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display text-base font-extrabold tracking-tight text-white">
                FOOTBALL<span className="text-cyan-400">AI</span>
              </span>
              <span className="rounded bg-cyan-950/80 px-1 py-0.5 font-tech text-[9px] font-bold text-cyan-400 border border-cyan-500/30">
                {t.shortBrand}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans tracking-tight truncate max-w-[120px] sm:max-w-none">
              {t.slogan}
            </span>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Web3 BNB Chain Wallet Button / Badge */}
          {user.isWeb3Connected && user.walletAddress ? (
            <button
              onClick={() => openAuthModal('login')}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/30 px-2 sm:px-2.5 text-xs text-amber-300 hover:border-amber-400 transition"
              title={isAr ? 'محفظة BNB متصلة - اضغط لتبديل الحساب' : 'Connected to BNB Chain - Click to switch'}
            >
              <Coins className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-[11px] font-semibold">
                {formatBnbAddress(user.walletAddress)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-2 sm:px-3 text-xs font-bold text-slate-950 shadow-sm shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition active:scale-95"
            >
              <Wallet className="h-3.5 w-3.5 text-slate-950 shrink-0" />
              <span className="hidden sm:inline">{isAr ? 'ربط محفظة BNB' : 'Connect BNB'}</span>
              <span className="sm:hidden">{isAr ? 'دخول' : 'Web3'}</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Switcher */}
          <button
            id="header-lang-btn"
            onClick={toggleLanguage}
            title={t.toggleLanguage}
            className="flex h-8 items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] uppercase">{settings.language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Notification Button with badge */}
          <button
            id="header-notifications-btn"
            onClick={() => setNotificationPanelOpen(true)}
            aria-label={t.notifications}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-slate-950 shadow-sm shadow-cyan-500/50 animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Quick Avatar */}
          <button
            id="header-user-btn"
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-1 hover:border-cyan-500/40 transition active:scale-95"
          >
            <div className="relative h-6 w-6 overflow-hidden rounded-md border border-cyan-400/40">
              <img 
                src={user.avatarUrl} 
                alt={user.username} 
                className="h-full w-full object-cover" 
              />
            </div>
            <div className="hidden sm:flex items-center gap-1 pr-1.5">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[80px]">
                {user.username}
              </span>
              <span className="flex items-center text-[10px] text-amber-400 font-tech">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                Lv.{user.level}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
