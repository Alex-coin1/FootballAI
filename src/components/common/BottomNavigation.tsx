import React from 'react';
import { 
  Home, 
  Trophy, 
  Cpu, 
  CheckSquare, 
  BarChart3, 
  MoreHorizontal,
  Newspaper,
  Layers,
  Wallet,
  User as UserIcon,
  Settings,
  Info,
  ShieldAlert,
  Share2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, moreMenuOpen, setMoreMenuOpen, t, settings } = useApp();
  const isAr = settings.language === 'ar';

  const navItems = [
    { id: 'home' as NavigationTab, label: t.home, icon: Home },
    { id: 'matches' as NavigationTab, label: t.matches, icon: Trophy },
    { id: 'predict' as NavigationTab, label: t.predict, icon: Cpu },
    { id: 'tasks' as NavigationTab, label: t.tasks, icon: CheckSquare },
    { id: 'rank' as NavigationTab, label: t.rank, icon: BarChart3 },
  ];

  const moreItems = [
    { 
      id: 'news' as NavigationTab, 
      label: t.news, 
      icon: Newspaper, 
      desc: isAr ? 'تحليلات ذكية وتقارير تكتيكية' : 'AI Tactical & Transfer reports' 
    },
    { 
      id: 'nfts' as NavigationTab, 
      label: t.nfts, 
      icon: Layers, 
      desc: isAr ? '٥٠ بطاقة رقمية نادرة للاعبين' : '50 Collectible Football cards' 
    },
    { 
      id: 'wallet' as NavigationTab, 
      label: t.wallet, 
      icon: Wallet, 
      desc: isAr ? 'رصيد FAI وحالة المحفظة' : 'Pilot balance & Web3 status' 
    },
    { 
      id: 'referrals' as NavigationTab, 
      label: t.referrals, 
      icon: Share2, 
      desc: isAr ? 'دعوة الأصدقاء ومكافآت FAI' : 'Invite friends & earn FAI' 
    },
    { 
      id: 'profile' as NavigationTab, 
      label: t.profile, 
      icon: UserIcon, 
      desc: isAr ? 'الإحصائيات والإنجازات والسلسلة' : 'Stats, achievements & streak' 
    },
    { 
      id: 'settings' as NavigationTab, 
      label: t.settings, 
      icon: Settings, 
      desc: isAr ? 'اللغات والأصوات والمظهر' : 'Languages, sound & theme' 
    },
    { 
      id: 'about' as NavigationTab, 
      label: t.about, 
      icon: Info, 
      desc: isAr ? 'بروتوكول المنصة والتحليلات' : 'Platform protocol & intelligence' 
    },
    { 
      id: 'admin' as NavigationTab, 
      label: t.admin, 
      icon: ShieldAlert, 
      desc: isAr ? 'لوحة تحكم المشغل والاختبارات' : 'Operator panel & diagnostics' 
    },
  ];

  const isMoreActive = moreItems.some(item => item.id === currentTab);

  return (
    <>
      {/* "More" Drawer Modal */}
      {moreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-t-3xl border-t border-cyan-500/30 bg-[#080e1b] p-5 shadow-2xl pb-10 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  {t.brandName} {t.more}
                </h3>
              </div>
              <button 
                onClick={() => setMoreMenuOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`more-menu-${item.id}`}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMoreMenuOpen(false);
                    }}
                    className={`flex flex-col items-start gap-1 rounded-xl p-3 border transition text-start ${
                      active
                        ? 'border-cyan-400/60 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-white mt-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Bar */}
      <nav 
        id="mobile-bottom-nav" 
        className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-cyan-950/80 bg-[#050912]/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMoreMenuOpen(false);
                }}
                className={`relative flex flex-1 flex-col items-center justify-center py-1 transition ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                  )}
                </div>
                <span className="mt-1 text-[10px] font-medium tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* "More" Trigger Button */}
          <button
            id="bottom-nav-more"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={`relative flex flex-1 flex-col items-center justify-center py-1 transition ${
              isMoreActive || moreMenuOpen ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <MoreHorizontal className={`h-5 w-5 transition-transform ${moreMenuOpen ? 'rotate-90 scale-110' : ''}`} />
              {(isMoreActive || moreMenuOpen) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
              )}
            </div>
            <span className="mt-1 text-[10px] font-medium tracking-tight">
              {t.more}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
