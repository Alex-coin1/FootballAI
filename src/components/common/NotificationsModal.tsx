import React from 'react';
import { X, CheckCheck, Bell, Trophy, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { 
    notificationPanelOpen, 
    setNotificationPanelOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setCurrentTab,
    t,
    settings 
  } = useApp();

  const isAr = settings.language === 'ar';

  if (!notificationPanelOpen) return null;

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'sparkles': return <Sparkles className="h-4 w-4 text-cyan-400" />;
      case 'trophy': return <Trophy className="h-4 w-4 text-amber-400" />;
      case 'award': return <Award className="h-4 w-4 text-purple-400" />;
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getLocalizedNotification = (notif: { title: string; message: string; timestamp: string }) => {
    if (!isAr) return { title: notif.title, message: notif.message, timestamp: notif.timestamp };
    
    let title = notif.title;
    let message = notif.message;
    let timestamp = notif.timestamp;

    if (title.toLowerCase().includes('streak') || title.toLowerCase().includes('daily')) {
      title = 'مكافأة السلسلة اليومية جاهزة!';
      message = 'سجل دخولك اليوم للمطالبة بمكافأة الـ 24 ساعة ونقاط FAI.';
    } else if (title.toLowerCase().includes('kickoff') || title.toLowerCase().includes('match')) {
      title = 'تنبيه انطلاق مباراة قادمة!';
      message = 'المباراة المختارة ستبدأ قريباً. سجل توقعك قبل صافرة البداية.';
    } else if (title.toLowerCase().includes('welcome') || title.toLowerCase().includes('pilot')) {
      title = 'مرحباً بك في بروتوكول FootballAI!';
      message = 'تم تفعيل حسابك التجريبي. ابدأ باستكشاف المباريات والتوقعات بالذكاء الاصطناعي.';
    } else if (title.toLowerCase().includes('prediction') || title.toLowerCase().includes('reward')) {
      title = 'تم تسجيل توقعك بنجاح!';
      message = 'تم رصد توقعك على مصفوفة الذكاء الاصطناعي وإضافة نقاط خبرة إلى حسابك.';
    }

    if (timestamp.includes('ago')) {
      timestamp = timestamp.replace('h ago', ' ساعات مضت').replace('m ago', ' دقيقة مضت').replace('d ago', ' أيام مضت');
    }

    return { title, message, timestamp };
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => setNotificationPanelOpen(false)}
    >
      <div 
        className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#091122] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Bell className="h-4 w-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              {t.notifications}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-cyan-400 hover:bg-cyan-950/60 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{t.markAllAsRead}</span>
              </button>
            )}
            <button
              onClick={() => setNotificationPanelOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              {t.noNotifications}
            </div>
          ) : (
            notifications.map(notif => {
              const localized = getLocalizedNotification(notif);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.linkTab) {
                      setCurrentTab(notif.linkTab);
                      setNotificationPanelOpen(false);
                    }
                  }}
                  className={`group cursor-pointer rounded-xl border p-3 transition flex items-start gap-3 ${
                    notif.isRead
                      ? 'border-slate-800/60 bg-slate-900/30 text-slate-400 hover:bg-slate-800/30'
                      : 'border-cyan-500/30 bg-cyan-950/20 text-slate-200 hover:bg-cyan-950/40 shadow-sm shadow-cyan-950'
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/50">
                    {renderIcon(notif.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{localized.title}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 font-sans">{localized.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                      {localized.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
