/**
 * Main Application Context & State Provider
 * Handles user state, local persistence, daily 24h countdown, streak,
 * prediction history, tasks, notifications, language & RTL, and navigation.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  NavigationTab, 
  User, 
  Task, 
  Notification, 
  ActivityItem, 
  UserPredictionRecord, 
  AppSettings, 
  Match, 
  NewsItem, 
  NFTCard,
  PredictionChoice
} from '../types';
import { 
  getStoredUser, 
  saveStoredUser, 
  getStoredTasks, 
  saveStoredTasks, 
  getStoredNotifications, 
  saveStoredNotifications, 
  getStoredActivities, 
  saveStoredActivities,
  registerUserWithBnbWallet as apiRegisterBnb,
  loginUserWithBnbWallet as apiLoginBnb,
  logoutCurrentUser as apiLogout,
  recordBnbChainDeposit as apiRecordDeposit,
  setPendingReferrer
} from '../services/userApi';
import { getUserStoredPredictions, saveUserPrediction } from '../services/predictionApi';
import { submitTaskEvidence } from '../services/adminService';
import { translations } from '../i18n/translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  moreMenuOpen: boolean;
  setMoreMenuOpen: (open: boolean) => void;
  user: User;
  tasks: Task[];
  notifications: Notification[];
  activities: ActivityItem[];
  predictions: UserPredictionRecord[];
  settings: AppSettings;
  t: typeof translations['en'];
  
  // Daily claim & Countdown
  canClaimDaily: boolean;
  dailyCountdownText: string;
  claimDailyReward: () => boolean;
  
  // Actions
  completeTask: (taskId: string) => void;
  submitTaskForVerification: (taskId: string, evidenceNote?: string, evidenceImage?: string) => void;
  submitPrediction: (match: Match, choice: PredictionChoice, aiChoice: PredictionChoice) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleLanguage: () => void;
  
  // Modals & Details
  selectedMatch: Match | null;
  setSelectedMatch: (match: Match | null) => void;
  selectedNews: NewsItem | null;
  setSelectedNews: (news: NewsItem | null) => void;
  selectedNFT: NFTCard | null;
  setSelectedNFT: (card: NFTCard | null) => void;
  notificationPanelOpen: boolean;
  setNotificationPanelOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  
  // Web3 & BNB Chain Auth
  registerWithBnbWallet: (params: { walletAddress: string; bnbDepositAddress: string; username: string; referralCode?: string }) => { user: User; isNew: boolean };
  loginWithWallet: (walletAddress: string) => boolean;
  logout: () => void;
  depositOnBnbChain: (asset: 'BNB' | 'USDT' | 'FAI', amount: number) => void;
  
  // UI & Feedback
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  showSplash: boolean;
  dismissSplash: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CLAIM_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Hours

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  const [user, setUser] = useState<User>(getStoredUser);
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [notifications, setNotifications] = useState<Notification[]>(getStoredNotifications);
  const [activities, setActivities] = useState<ActivityItem[]>(getStoredActivities);
  const [predictions, setPredictions] = useState<UserPredictionRecord[]>(getUserStoredPredictions);
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  // Modals
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFTCard | null>(null);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('register');

  const openAuthModal = (initialTab: 'login' | 'register' = 'register') => {
    setAuthModalTab(initialTab);
    setAuthModalOpen(true);
  };

  // Check URL ?ref=CODE parameter on startup
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location?.search) {
        const params = new URLSearchParams(window.location.search);
        const refParam = params.get('ref');
        if (refParam && refParam.trim()) {
          setPendingReferrer(refParam.trim());
        }
      }
    } catch (e) {
      console.error('Failed to parse ref url param', e);
    }
  }, []);

  // App Settings with initial load from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('footballai_settings');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      language: 'en',
      theme: 'dark',
      notificationsEnabled: true,
      soundEnabled: true
    };
  });

  const t = translations[settings.language] || translations.en;

  // Language RTL application
  useEffect(() => {
    const isRtl = settings.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    document.body.dir = isRtl ? 'rtl' : 'ltr';
    localStorage.setItem('footballai_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissSplash = () => {
    setShowSplash(false);
  };

  // Real 24-hour Daily Claim countdown calculation
  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(true);
  const [dailyCountdownText, setDailyCountdownText] = useState<string>('24:00:00');

  useEffect(() => {
    const calculateCountdown = () => {
      if (!user.lastClaimTimestamp) {
        setCanClaimDaily(true);
        setDailyCountdownText('00:00:00');
        return;
      }

      const nextClaimAt = user.lastClaimTimestamp + CLAIM_INTERVAL_MS;
      const now = Date.now();
      const diff = nextClaimAt - now;

      if (diff <= 0) {
        setCanClaimDaily(true);
        setDailyCountdownText('00:00:00');
      } else {
        setCanClaimDaily(false);
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        const ss = seconds.toString().padStart(2, '0');
        setDailyCountdownText(`${hh}:${mm}:${ss}`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [user.lastClaimTimestamp]);

  // Claim Daily FAI
  const claimDailyReward = (): boolean => {
    if (!user.isWeb3Connected) {
      showToast(
        settings.language === 'ar'
          ? 'يرجى ربط محفظة Web3 (شبكة BNB) أولاً لإنشاء حسابك وتفعيل تعدين FAI!'
          : 'Please connect your Web3 wallet (BNB Chain) first to create your account and activate FAI mining!',
        'warning'
      );
      openAuthModal('register');
      return false;
    }

    if (!canClaimDaily) {
      showToast(`${t.nextClaimAvailableIn} ${dailyCountdownText}`, 'warning');
      return false;
    }

    const currentStreak = user.streakDays || 0;
    const isDay7 = (currentStreak + 1) % 7 === 0;
    const rewardAmount = isDay7 ? 0.25 : 0.05;

    const nextStreak = currentStreak >= 7 ? 1 : currentStreak + 1;
    const nextClaimedDays = currentStreak >= 7 ? [1] : [...(user.claimedDays || []), nextStreak];

    const updatedUser: User = {
      ...user,
      faiBalance: Number((user.faiBalance + rewardAmount).toFixed(4)),
      streakDays: nextStreak,
      lastClaimTimestamp: Date.now(),
      xp: user.xp + 20,
      claimedDays: nextClaimedDays
    };

    setUser(updatedUser);
    saveStoredUser(updatedUser);

    // Record activity
    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'claim',
      title: isDay7 ? `Day 7 Mega Claim (+${rewardAmount} FAI)` : `Daily FAI Check-in (+${rewardAmount} FAI)`,
      amount: rewardAmount,
      timestamp: 'Just now'
    };
    const updatedActivities = [newAct, ...activities];
    setActivities(updatedActivities);
    saveStoredActivities(updatedActivities);

    // Update daily task if exists
    const updatedTasks = tasks.map(tk => tk.id === 'task-1' ? { ...tk, status: 'COMPLETED' as const } : tk);
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);

    showToast(`Successfully claimed +${rewardAmount} FAI! Streak: ${nextStreak} Days`, 'success');
    return true;
  };

  // Submit evidence for a task to Admin review
  const submitTaskForVerification = (taskId: string, evidenceNote?: string, evidenceImage?: string) => {
    if (!user.isWeb3Connected) {
      showToast(
        settings.language === 'ar'
          ? 'يرجى ربط محفظة Web3 أولاً لإرسال إثبات المهمة!'
          : 'Please connect your Web3 wallet first to submit mission proof!',
        'warning'
      );
      openAuthModal('register');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'COMPLETED') {
      showToast(settings.language === 'ar' ? 'المهمة مكتملة بالفعل!' : 'Mission already completed!', 'info');
      return;
    }

    // Submit to persistent admin queue
    submitTaskEvidence({
      taskId: task.id,
      taskTitle: task.title,
      userId: user.id,
      userAddress: user.walletAddress || '0x0000000000000000000000000000000000000000',
      username: user.username,
      userAvatar: user.avatarUrl,
      reward: task.reward,
      evidenceNote,
      evidenceImage
    });

    // Update local task state to PENDING_VERIFICATION
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'PENDING_VERIFICATION' as const } : t
    );
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);

    showToast(
      settings.language === 'ar'
        ? `تم إرسال إثبات المهمة بنجاح! طلبك قيد مراجعة واعتماد المسؤول لمنح مكافأة +${task.reward} FAI.`
        : `Mission proof submitted! It is now awaiting admin review before +${task.reward} FAI is awarded.`,
      'info'
    );
  };

  // Complete a Task
  const completeTask = (taskId: string) => {
    if (!user.isWeb3Connected) {
      showToast(
        settings.language === 'ar'
          ? 'يرجى ربط محفظة Web3 أولاً لحفظ إنجاز المهام واستلام مكافآت FAI!'
          : 'Please connect your Web3 wallet first to complete missions and earn FAI rewards!',
        'warning'
      );
      openAuthModal('register');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'COMPLETED') {
      showToast('Task already completed!', 'info');
      return;
    }

    if (task.status === 'PENDING_VERIFICATION') {
      showToast(
        settings.language === 'ar'
          ? 'المهمة قيد مراجعة واعتماد المسؤول حالياً.'
          : 'This mission is currently under review by Admin.',
        'info'
      );
      return;
    }

    if (task.isExternal || task.category === 'social') {
      // Transition to pending verification through admin review
      submitTaskForVerification(taskId, 'Task action completed by user');
      return;
    }

    // Immediate complete (internal task)
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, status: 'COMPLETED' as const } : t
    );
    setTasks(updatedTasks);
    saveStoredTasks(updatedTasks);

    const updatedUser = {
      ...user,
      faiBalance: Number((user.faiBalance + task.reward).toFixed(4)),
      xp: user.xp + 25
    };
    setUser(updatedUser);
    saveStoredUser(updatedUser);

    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'task',
      title: `Mission: ${task.title}`,
      amount: task.reward,
      timestamp: 'Just now'
    };
    const updatedActivities = [newAct, ...activities];
    setActivities(updatedActivities);
    saveStoredActivities(updatedActivities);

    showToast(`Mission completed! +${task.reward} FAI awarded.`, 'success');
  };

  // Submit AI Prediction
  const submitPrediction = (match: Match, choice: PredictionChoice, aiChoice: PredictionChoice) => {
    if (!user.isWeb3Connected) {
      showToast(
        settings.language === 'ar'
          ? 'يرجى ربط محفظة Web3 للمشاركة في التوقعات وحفظ سجلك التحليلي!'
          : 'Please connect your Web3 wallet first to participate in predictions and record stats!',
        'warning'
      );
      openAuthModal('register');
      return;
    }

    const record: UserPredictionRecord = {
      id: 'pred_' + Date.now(),
      matchId: match.id,
      matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      matchDate: match.date,
      leagueName: match.leagueName,
      userChoice: choice,
      aiChoice: aiChoice,
      status: 'PENDING',
      pointsEarned: 0.10,
      submittedAt: 'Just now'
    };

    const updatedPredictions = saveUserPrediction(record);
    setPredictions(updatedPredictions);

    // Update user stats
    const updatedUser = {
      ...user,
      totalPredictions: user.totalPredictions + 1,
      xp: user.xp + 15
    };
    setUser(updatedUser);
    saveStoredUser(updatedUser);

    // Add activity
    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'prediction',
      title: `Forecast: ${match.homeTeam.shortName} vs ${match.awayTeam.shortName} (${choice})`,
      amount: 0.10,
      timestamp: 'Just now'
    };
    const updatedActivities = [newAct, ...activities];
    setActivities(updatedActivities);
    saveStoredActivities(updatedActivities);

    // Notification
    const newNotif: Notification = {
      id: 'notif_' + Date.now(),
      type: 'PREDICTION_SUBMITTED',
      title: t.predictionSubmitted,
      message: `Your prediction for ${match.homeTeam.name} vs ${match.awayTeam.name} has been submitted!`,
      timestamp: 'Just now',
      isRead: false,
      iconType: 'check-circle',
      linkTab: 'predict'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);

    showToast(t.predictionSubmitted, 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Settings
  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem('footballai_settings', JSON.stringify(next));
      return next;
    });
  };

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'en' ? 'ar' : 'en' });
  };

  // Web3 & BNB Chain Authentication Handlers
  const registerWithBnbWallet = (params: {
    walletAddress: string;
    bnbDepositAddress: string;
    username: string;
    referralCode?: string;
  }) => {
    const res = apiRegisterBnb(params);
    setUser(res.user);
    setTasks(res.bundle.tasks);
    setNotifications(res.bundle.notifications);
    setActivities(res.bundle.activities);
    return res;
  };

  const loginWithWallet = (walletAddress: string): boolean => {
    const bundle = apiLoginBnb(walletAddress);
    if (bundle) {
      setUser(bundle.user);
      setTasks(bundle.tasks);
      setNotifications(bundle.notifications);
      setActivities(bundle.activities);
      return true;
    }
    return false;
  };

  const logout = () => {
    const defaultUser = apiLogout();
    setUser(defaultUser);
    setTasks(getStoredTasks());
    setNotifications(getStoredNotifications());
    setActivities(getStoredActivities());
    showToast(
      settings.language === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Logged out. Returned to guest mode.',
      'info'
    );
  };

  const depositOnBnbChain = (asset: 'BNB' | 'USDT' | 'FAI', amount: number) => {
    const res = apiRecordDeposit(user, asset, amount);
    setUser(res.updatedUser);
    setActivities(getStoredActivities());
    setNotifications(getStoredNotifications());
    showToast(
      settings.language === 'ar'
        ? `تم تأكيد إيداع ${amount} ${asset} بنجاح على شبكة BNB Chain!`
        : `Confirmed deposit of ${amount} ${asset} on BNB Smart Chain!`,
      'success'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        moreMenuOpen,
        setMoreMenuOpen,
        user,
        tasks,
        notifications,
        activities,
        predictions,
        settings,
        t,
        canClaimDaily,
        dailyCountdownText,
        claimDailyReward,
        completeTask,
        submitTaskForVerification,
        submitPrediction,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        updateSettings,
        toggleLanguage,
        selectedMatch,
        setSelectedMatch,
        selectedNews,
        setSelectedNews,
        selectedNFT,
        setSelectedNFT,
        notificationPanelOpen,
        setNotificationPanelOpen,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        registerWithBnbWallet,
        loginWithWallet,
        logout,
        depositOnBnbChain,
        toasts,
        showToast,
        showSplash,
        dismissSplash
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
