import React from 'react';
import { 
  Home, 
  Trophy, 
  Cpu, 
  CheckSquare, 
  BarChart3, 
  Newspaper,
  Layers,
  Wallet,
  User as UserIcon,
  Settings,
  Info,
  Share2,
  ShieldAlert,
  Zap,
  ExternalLink,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { formatBnbAddress } from '../../services/web3BnbService';
import { isUserAdmin } from '../../services/adminService';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, user, openAuthModal, t, settings } = useApp();
  const isAr = settings.language === 'ar';
  const isAdmin = isUserAdmin(user.walletAddress);

  const mainNav = [
    { id: 'home' as NavigationTab, label: t.home, icon: Home },
    { id: 'matches' as NavigationTab, label: t.matches, icon: Trophy },
    { id: 'predict' as NavigationTab, label: t.predict, icon: Cpu, badge: 'AI' },
    { id: 'tasks' as NavigationTab, label: t.tasks, icon: CheckSquare },
    { id: 'rank' as NavigationTab, label: t.rank, icon: BarChart3 },
    { id: 'referrals' as NavigationTab, label: t.referrals, icon: Share2 },
  ];

  const secondaryNav = [
    { id: 'news' as NavigationTab, label: t.news, icon: Newspaper },
    { id: 'nfts' as NavigationTab, label: t.nfts, icon: Layers, count: 'NFT' },
    { id: 'wallet' as NavigationTab, label: t.wallet, icon: Wallet },
    { id: 'profile' as NavigationTab, label: t.profile, icon: UserIcon },
    { id: 'settings' as NavigationTab, label: t.settings, icon: Settings },
    { id: 'about' as NavigationTab, label: t.about, icon: Info },
    ...(isAdmin ? [{ 
      id: 'admin' as NavigationTab, 
      label: isAr ? '👑 لوحة التحكم' : '👑 Admin Studio', 
      icon: ShieldAlert, 
      badge: 'OWNER' 
    }] : []),
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-cyan-950/60 bg-[#050912]/90 p-4 h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="space-y-6 overflow-y-auto no-scrollbar">
        {/* User Mini Card */}
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#09152b] to-[#060c18] p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-cyan-400/50">
              <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">{user.username}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {t.levelPrefix}{user.level}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-tech text-cyan-300">
                <span>{user.faiBalance.toFixed(2)} FAI</span>
                <span className="text-amber-400">🔥 {user.streakDays}{isAr ? ' يوم متتالي' : 'd Streak'}</span>
              </div>
            </div>
          </div>

          {/* Web3 BNB Chain Status / Connect Button */}
          {user.isWeb3Connected && user.walletAddress ? (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-950/20 px-2.5 py-1.5 text-[11px] text-amber-300 hover:border-amber-400 transition"
              title={isAr ? 'محفظة متصلة - اضغط لتبديل الحساب' : 'Wallet connected - click to switch'}
            >
              <div className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">{formatBnbAddress(user.walletAddress)}</span>
              </div>
              <span className="text-[9px] font-tech text-emerald-400">BNB</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-300 hover:to-amber-400 transition"
            >
              <Wallet className="h-3.5 w-3.5 shrink-0" />
              <span>{isAr ? 'ربط محفظة BNB Chain' : 'Connect BNB Wallet'}</span>
            </button>
          )}
        </div>

        {/* Main Navigation Group */}
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-tech">
            {t.coreProtocol}
          </span>
          <div className="mt-2 space-y-1">
            {mainNav.map(item => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    active
                      ? 'border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300 font-tech">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ecosystem Navigation Group */}
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-tech">
            {t.ecosystem}
          </span>
          <div className="mt-2 space-y-1">
            {secondaryNav.map(item => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    active
                      ? 'border border-cyan-400/40 bg-cyan-950/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-tech">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Pilot Status Card */}
      <div className="rounded-xl border border-slate-800 bg-[#070d18] p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-[11px] font-tech text-cyan-400 font-bold">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>{t.pilotNetworkActive}</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">
          {t.pilotNetworkDesc}
        </p>
      </div>
    </aside>
  );
};
