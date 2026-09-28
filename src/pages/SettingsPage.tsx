import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Moon, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  ChevronRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, toggleLanguage, showToast, t } = useApp();
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  const handleResetData = () => {
    if (window.confirm(t.resetDataConfirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const isAr = settings.language === 'ar';

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
          <Settings className="h-5 w-5 text-cyan-400" />
          <span>{t.settings}</span>
        </h1>
        <p className="text-xs text-slate-400">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Preferences Section */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400">
          {t.appPreferences}
        </h3>

        <div className="space-y-3">
          {/* Language Switcher */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.language}</span>
                <span className="text-[10px] text-slate-400">
                  {settings.language === 'en' ? 'English (LTR)' : 'العربية (RTL)'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition uppercase font-tech"
            >
              {settings.language === 'en' ? 'Switch to العربية' : 'التحويل للإنجليزية'}
            </button>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.theme}</span>
                <span className="text-[10px] text-slate-400">
                  {isAr ? 'مصفوفة السايبر الداكنة لكرة القدم' : 'Cyber Dark Football Matrix'}
                </span>
              </div>
            </div>
            <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-tech text-cyan-400 border border-slate-800">
              {isAr ? 'داكن (محدد)' : 'DARK (LOCKED)'}
            </span>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.notifications}</span>
                <span className="text-[10px] text-slate-400">{t.kickoffAlertsDesc}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              className="h-4 w-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{t.sound}</span>
                <span className="text-[10px] text-slate-400">{t.hapticSoundDesc}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="h-4 w-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Legal & Governance */}
      <div className="rounded-3xl border border-slate-800 bg-[#070e1c] p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-slate-400">
          {t.governanceDocs}
        </h3>

        <button
          onClick={() => setActiveModal('terms')}
          className="w-full flex items-center justify-between rounded-xl bg-slate-900/40 p-3 hover:bg-slate-900 transition text-start"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">{t.terms}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 rtl:rotate-180" />
        </button>

        <button
          onClick={() => setActiveModal('privacy')}
          className="w-full flex items-center justify-between rounded-xl bg-slate-900/40 p-3 hover:bg-slate-900 transition text-start"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">{t.privacy}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 rtl:rotate-180" />
        </button>
      </div>

      {/* Developer Reset Zone */}
      <div className="rounded-3xl border border-rose-950/60 bg-[#140609] p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase font-tech tracking-wider text-rose-400">
          {t.localStorageManagement}
        </h3>
        <p className="text-xs text-rose-200/70">
          {t.clearStorageDesc}
        </p>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/60 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{t.resetCachedState}</span>
        </button>
      </div>

      {/* Legal Text Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-[#081224] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold font-display text-white">
                {activeModal === 'terms' ? t.termsOfServiceModalTitle : t.privacyPolicyModalTitle}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              {activeModal === 'terms' ? (
                isAr ? (
                  <>
                    <p><strong>١. طبيعة منصة FootballAI التجريبية</strong>: توفر FootballAI تحليلات رياضية مدعومة بالذكاء الاصطناعي ومعلومات مباشرة للمباريات ونقاط مكافآت للمشجعين وعشاق كرة القدم.</p>
                    <p><strong>٢. ليست نصيحة مالية أو مراهنات</strong>: جميع التوقعات الذكية وتوزيعات الاحتمالات الإحصائية مصممة لأغراض التحليل والفضول الرياضي والترفيه فقط. لا تدعم المنصة أي نوع من المراهنات أو المضاربات المالية.</p>
                    <p><strong>٣. نقاط ومكافآت FAI غير الوصائية</strong>: نقاط FAI في هذا الإصدار تمثل مكافآت مشاركة مجتمعية تجريبية، ولا تملك قيمة نقدية مضمونة ولا تباع في أسواق ثانوية.</p>
                  </>
                ) : (
                  <>
                    <p><strong>1. Pilot Nature of FootballAI (FAI)</strong>: FootballAI provides experimental artificial intelligence football analysis, match information, and community pilot points for sports enthusiasts.</p>
                    <p><strong>2. Not Financial Advice</strong>: All AI predictions, probability distributions, and match insights are generated purely for statistical curiosity and entertainment. FootballAI does not offer gambling or financial advice.</p>
                    <p><strong>3. Non-Custodial Points</strong>: FAI tokens in this version are community pilot participation points. They carry no monetary value, no promise of profit, and cannot be traded on secondary markets.</p>
                  </>
                )
              ) : (
                isAr ? (
                  <>
                    <p><strong>١. خصوصية البيانات</strong>: تلتزم FootballAI باحترام استقلالية بياناتك الرقمية. يعمل الإصدار الحالي بنظام الضيف المباشر دون تعقب الهوية الشخصية.</p>
                    <p><strong>٢. التخزين المحلي الآمن</strong>: تفضيلاتك وسلسلة تسجيل الدخول وسجل التوقعات يتم حفظها محلياً على متصفحك الخاص.</p>
                    <p><strong>٣. عدم وجود متتبعات إعلانية لأطراف ثالثة</strong>: لا نقوم ببيع أو مشاركة بيانات المستخدمين مع سماسرة الإعلانات أو أطراف خارجية.</p>
                  </>
                ) : (
                  <>
                    <p><strong>1. Data Privacy</strong>: FootballAI respects your digital autonomy. Current versions operate in client-first guest mode without tracking personal identity.</p>
                    <p><strong>2. Local Storage</strong>: User preferences, claimed streaks, and prediction histories are stored locally in your web browser.</p>
                    <p><strong>3. Zero Third-Party Advertising Trackers</strong>: We do not sell user data to advertising brokers.</p>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
