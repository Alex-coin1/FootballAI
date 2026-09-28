/**
 * User & Community Service
 * Manages guest player profile, 24-hour daily check-in claims, 7-day streak logic,
 * tasks completion state, achievements, and notifications stored in localStorage.
 */

import { User, Task, Achievement, Notification, ActivityItem, ReferralStats } from '../types';

const STORAGE_KEYS = {
  USER: 'footballai_user_profile',
  TASKS: 'footballai_tasks',
  NOTIFICATIONS: 'footballai_notifications',
  ACTIVITIES: 'footballai_activities',
  ACHIEVEMENTS: 'footballai_achievements',
  USERS_REGISTRY: 'footballai_users_registry',
  ACTIVE_USER_ID: 'footballai_active_user_id',
  PENDING_REFERRER: 'footballai_pending_referrer'
};

export interface UserDataBundle {
  user: User;
  tasks: Task[];
  notifications: Notification[];
  activities: ActivityItem[];
  achievements?: Achievement[];
}

const DEFAULT_USER: User = {
  id: 'guest_unlinked',
  username: 'Guest Player',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  level: 1,
  levelTitle: 'Unlinked',
  xp: 0,
  xpNextLevel: 100,
  faiBalance: 0, // Clean 0 starting balance - mining unlocks upon linking wallet
  streakDays: 0,
  lastClaimTimestamp: null,
  totalPredictions: 0,
  wonPredictions: 0,
  totalReferrals: 0,
  referralCode: '',
  joinedDate: 'September 2026',
  claimedDays: [],
  isWeb3Connected: false,
  walletAddress: undefined,
  bnbDepositAddress: undefined,
  bnbChainId: 56,
  depositHistory: []
};

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Daily Check-in',
    description: 'Claim your daily FAI pilot points and maintain your active streak.',
    reward: 0.05,
    status: 'AVAILABLE',
    category: 'daily'
  },
  {
    id: 'task-2',
    title: 'Follow FootballAI on X',
    description: 'Join the community on X (Twitter) for match insights and updates.',
    reward: 0.05,
    status: 'AVAILABLE',
    category: 'social',
    actionUrl: 'https://x.com/FootballAIHQ',
    actionText: 'Follow on X',
    isExternal: true
  },
  {
    id: 'task-3',
    title: 'Share FootballAI',
    description: 'Share FootballAI with football friends on social platforms.',
    reward: 0.05,
    status: 'AVAILABLE',
    category: 'social',
    actionText: 'Share App',
    isExternal: true
  },
  {
    id: 'task-4',
    title: 'Invite a Friend',
    description: 'Share your unique referral link with football enthusiasts.',
    reward: 0.10,
    status: 'AVAILABLE',
    category: 'social',
    actionText: 'Invite Friends'
  },
  {
    id: 'task-5',
    title: 'Complete 3 Predictions',
    description: 'Submit predictions on any 3 upcoming football matches.',
    reward: 0.15,
    status: 'AVAILABLE',
    category: 'prediction'
  },
  {
    id: 'task-6',
    title: 'Read Football News',
    description: 'Explore the latest AI in football and tactical analysis reports.',
    reward: 0.05,
    status: 'AVAILABLE',
    category: 'daily',
    actionText: 'Browse News'
  },
  {
    id: 'task-7',
    title: '7-Day Streak',
    description: 'Check in for 7 consecutive days to unlock the milestone multiplier.',
    reward: 0.25,
    status: 'AVAILABLE',
    category: 'special'
  }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Check-in',
    description: 'Completed first daily FAI pilot points check-in.',
    icon: '⚡',
    unlocked: true,
    unlockedAt: 'Today',
    progress: 1,
    maxProgress: 1,
    rewardFai: 0.05
  },
  {
    id: 'ach-2',
    title: 'First Prediction',
    description: 'Submitted your first football match outcome forecast.',
    icon: '🎯',
    unlocked: true,
    unlockedAt: 'Yesterday',
    progress: 1,
    maxProgress: 1,
    rewardFai: 0.05
  },
  {
    id: 'ach-3',
    title: '7-Day Streak',
    description: 'Maintain an uninterrupted 7-day daily check-in sequence.',
    icon: '🔥',
    unlocked: false,
    progress: 1,
    maxProgress: 7,
    rewardFai: 0.25
  },
  {
    id: 'ach-4',
    title: '10 Predictions',
    description: 'Submit 10 match outcome forecasts with AI analytics.',
    icon: '🤖',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
    rewardFai: 0.50
  },
  {
    id: 'ach-5',
    title: 'First Referral',
    description: 'Successfully invite a qualified friend to FootballAI.',
    icon: '👥',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardFai: 0.20
  },
  {
    id: 'ach-6',
    title: 'NFT Collector',
    description: 'Preview and inspect digital football collectible player cards.',
    icon: '🎴',
    unlocked: true,
    unlockedAt: 'Today',
    progress: 1,
    maxProgress: 1,
    rewardFai: 0.05
  }
];

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-welcome',
    type: 'DAILY_REWARD',
    title: 'Welcome to FootballAI',
    message: 'Link your Web3 wallet via BNB Chain to create your account, activate daily mining, and unlock predictions.',
    timestamp: 'Just now',
    isRead: false,
    iconType: 'sparkles',
    linkTab: 'wallet'
  }
];

export const DEFAULT_ACTIVITIES: ActivityItem[] = [];

export const REFERRAL_TIERS = [
  { referralsRequired: 1, rewardBonus: 0.20, perks: 'Unlock Community Scout Badge', completed: false },
  { referralsRequired: 3, rewardBonus: 0.60, perks: 'Access VIP Match Predictions', completed: false },
  { referralsRequired: 5, rewardBonus: 1.25, perks: '+5% Bonus on Daily Claims', completed: false },
  { referralsRequired: 10, rewardBonus: 3.00, perks: 'Silver FAI Collector Status', completed: false },
  { referralsRequired: 25, rewardBonus: 8.50, perks: 'Gold FAI Ambassador Role', completed: false },
  { referralsRequired: 50, rewardBonus: 20.00, perks: 'Priority Access to Digital Minting', completed: false },
  { referralsRequired: 100, rewardBonus: 50.00, perks: 'Legendary FAI Council Status', completed: false }
];

export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate away from old mock guest user
      if (!parsed.isWeb3Connected || parsed.id === 'guest_fai_001') {
        return DEFAULT_USER;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load user from localStorage', e);
  }
  return DEFAULT_USER;
}

export function saveStoredUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    let userTaskList: Task[] = raw ? JSON.parse(raw) : DEFAULT_TASKS;

    // Check if custom tasks managed by admin exist
    const customRaw = localStorage.getItem('footballai_custom_tasks');
    if (customRaw) {
      const managedTasks: Task[] = JSON.parse(customRaw);
      const userStatusMap = new Map<string, Task['status']>();
      userTaskList.forEach(t => userStatusMap.set(t.id, t.status));

      // Return managed tasks preserving any user's completed status, filtering out inactive
      return managedTasks
        .filter(t => t.isActive !== false)
        .map(t => ({
          ...t,
          status: userStatusMap.get(t.id) || t.status || 'AVAILABLE'
        }));
    }

    return userTaskList.map(t => {
      if (t.id === 'task-2') {
        return { ...t, actionUrl: 'https://x.com/FootballAIHQ' };
      }
      return t;
    });
  } catch (e) {
    console.error('Failed to load tasks', e);
  }
  return DEFAULT_TASKS;
}

export function saveStoredTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getStoredNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notifications', e);
  }
  return DEFAULT_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: Notification[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function getStoredActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load activities', e);
  }
  return DEFAULT_ACTIVITIES;
}

export function saveStoredActivities(activities: ActivityItem[]): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load achievements', e);
  }
  return DEFAULT_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[]): void {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function getReferralStats(user: User): ReferralStats {
  const currentReferrals = user.totalReferrals || 0;
  const baseUrl = typeof window !== 'undefined' && window.location?.origin 
    ? window.location.origin 
    : 'https://footballai.app';
  const code = user.referralCode || 'FAI2026';
  return {
    referralCode: code,
    referralLink: `${baseUrl}/?ref=${code}`,
    totalReferrals: currentReferrals,
    qualifiedReferrals: currentReferrals,
    rewardsEarned: currentReferrals * 0.20,
    tiers: REFERRAL_TIERS.map(tier => ({
      ...tier,
      completed: currentReferrals >= tier.referralsRequired
    }))
  };
}

/**
 * Multi-user Accounts Registry
 * Stores all accounts registered on this device, mapping account id -> UserDataBundle
 */
export function getUsersRegistry(): Record<string, UserDataBundle> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load users registry', e);
  }
  return {};
}

export function saveUsersRegistry(registry: Record<string, UserDataBundle>): void {
  localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(registry));
}

/**
 * Pending Referrer handling from URL (?ref=CODE)
 */
export function getPendingReferrer(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.PENDING_REFERRER);
  } catch (e) {
    return null;
  }
}

export function setPendingReferrer(code: string): void {
  try {
    if (code && code.trim()) {
      localStorage.setItem(STORAGE_KEYS.PENDING_REFERRER, code.trim().toUpperCase());
    }
  } catch (e) {}
}

/**
 * Register a user via Web3 wallet on BNB Chain
 */
export function registerUserWithBnbWallet(params: {
  walletAddress: string;
  bnbDepositAddress: string;
  username: string;
  referralCode?: string;
  avatarUrl?: string;
}): { user: User; bundle: UserDataBundle; isNew: boolean } {
  const normAddress = params.walletAddress.toLowerCase().trim();
  const registry = getUsersRegistry();

  // Check if wallet already registered
  const existingKey = Object.keys(registry).find(
    k => registry[k].user.walletAddress?.toLowerCase() === normAddress
  );

  if (existingKey) {
    const existing = registry[existingKey];
    // Set as active user
    saveStoredUser(existing.user);
    saveStoredTasks(existing.tasks);
    saveStoredNotifications(existing.notifications);
    saveStoredActivities(existing.activities);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, existing.user.id);
    return { user: existing.user, bundle: existing, isNew: false };
  }

  // Create new unique user
  const userId = `user_bnb_${normAddress.slice(2, 8)}_${Date.now().toString(36)}`;
  const cleanAddr = normAddress.replace('0x', '').toUpperCase();
  const generatedRefCode = `BNB-${cleanAddr.slice(0, 4)}${cleanAddr.slice(-3)}`;
  const baseUrl = typeof window !== 'undefined' && window.location?.origin 
    ? window.location.origin 
    : 'https://footballai.app';
  
  const refLink = `${baseUrl}/?ref=${generatedRefCode}`;
  const inviterCode = (params.referralCode || getPendingReferrer() || '').trim().toUpperCase();

  const newUser: User = {
    id: userId,
    username: params.username.trim() || `Analyst_${normAddress.slice(2, 6)}`,
    avatarUrl: params.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    level: 1,
    levelTitle: 'BNB Web3 Analyst',
    xp: 0,
    xpNextLevel: 100,
    faiBalance: 0, // Clean 0 starting balance - user begins mining directly
    streakDays: 0,
    lastClaimTimestamp: null,
    totalPredictions: 0,
    wonPredictions: 0,
    totalReferrals: 0,
    referralCode: generatedRefCode,
    referralLink: refLink,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    claimedDays: [],
    
    // Web3 & BNB Chain
    isWeb3Connected: true,
    walletAddress: params.walletAddress,
    bnbDepositAddress: params.bnbDepositAddress,
    bnbChainId: 56, // BNB Smart Chain
    referredBy: inviterCode || null,
    depositHistory: []
  };

  const initialActivities: ActivityItem[] = [
    {
      id: `act_${Date.now()}_1`,
      type: 'claim',
      title: 'Web3 Wallet Connected (BNB Smart Chain)',
      amount: 0,
      timestamp: 'Just now'
    }
  ];

  const initialNotifications: Notification[] = [
    {
      id: `notif_${Date.now()}_1`,
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Web3 Account Registered',
      message: `Your BNB Smart Chain wallet (${params.walletAddress.slice(0, 6)}...${params.walletAddress.slice(-4)}) is linked. Your unique referral link is ready!`,
      timestamp: 'Just now',
      isRead: false,
      iconType: 'shield-check',
      linkTab: 'referrals'
    }
  ];

  // If referred by another user registered in this system, credit the inviter!
  if (inviterCode) {
    const inviterKey = Object.keys(registry).find(
      k => registry[k].user.referralCode?.toUpperCase() === inviterCode
    );
    if (inviterKey) {
      const inviterBundle = registry[inviterKey];
      inviterBundle.user.totalReferrals = (inviterBundle.user.totalReferrals || 0) + 1;
      inviterBundle.user.faiBalance = (inviterBundle.user.faiBalance || 0) + 0.20;
      inviterBundle.activities.unshift({
        id: `act_ref_${Date.now()}`,
        type: 'referral',
        title: `Friend Invited via Code ${inviterCode}`,
        amount: 0.20,
        timestamp: 'Just now'
      });
      inviterBundle.notifications.unshift({
        id: `notif_ref_${Date.now()}`,
        type: 'ACHIEVEMENT_UNLOCKED',
        title: 'Referral Bonus Received (+0.20 FAI)',
        message: `A new football analyst registered using your unique referral code ${inviterCode}!`,
        timestamp: 'Just now',
        isRead: false,
        iconType: 'award',
        linkTab: 'referrals'
      });
    }
  }

  const bundle: UserDataBundle = {
    user: newUser,
    tasks: [...DEFAULT_TASKS],
    notifications: initialNotifications,
    activities: initialActivities,
    achievements: [...DEFAULT_ACHIEVEMENTS]
  };

  registry[userId] = bundle;
  saveUsersRegistry(registry);

  // Set active user
  saveStoredUser(newUser);
  saveStoredTasks(bundle.tasks);
  saveStoredNotifications(bundle.notifications);
  saveStoredActivities(bundle.activities);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);

  // Clear pending referrer
  try {
    localStorage.removeItem(STORAGE_KEYS.PENDING_REFERRER);
  } catch (e) {}

  return { user: newUser, bundle, isNew: true };
}

/**
 * Log in with an existing Web3 wallet
 */
export function loginUserWithBnbWallet(walletAddress: string): UserDataBundle | null {
  const normAddress = walletAddress.toLowerCase().trim();
  const registry = getUsersRegistry();

  const key = Object.keys(registry).find(
    k => registry[k].user.walletAddress?.toLowerCase() === normAddress
  );

  if (!key) return null;

  const bundle = registry[key];
  saveStoredUser(bundle.user);
  saveStoredTasks(bundle.tasks);
  saveStoredNotifications(bundle.notifications);
  saveStoredActivities(bundle.activities);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, bundle.user.id);

  return bundle;
}

/**
 * Switch active account to another registered user or guest
 */
export function switchActiveUser(userId: string): UserDataBundle | null {
  const registry = getUsersRegistry();
  if (registry[userId]) {
    const bundle = registry[userId];
    saveStoredUser(bundle.user);
    saveStoredTasks(bundle.tasks);
    saveStoredNotifications(bundle.notifications);
    saveStoredActivities(bundle.activities);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    return bundle;
  }
  return null;
}

/**
 * Log out current user and return to guest mode
 */
export function logoutCurrentUser(): User {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  saveStoredUser(DEFAULT_USER);
  saveStoredTasks(DEFAULT_TASKS);
  saveStoredNotifications(DEFAULT_NOTIFICATIONS);
  saveStoredActivities(DEFAULT_ACTIVITIES);
  return DEFAULT_USER;
}

/**
 * Simulate or record a deposit via BNB Smart Chain
 */
export function recordBnbChainDeposit(
  user: User,
  asset: 'BNB' | 'USDT' | 'FAI',
  amount: number
): { updatedUser: User; depositRecord: any } {
  // Exchange rate to FAI pilot points for demonstration
  // 1 BNB = 600 FAI, 1 USDT = 1 FAI, 1 FAI = 1 FAI
  const multipliers: Record<string, number> = {
    BNB: 600,
    USDT: 1.0,
    FAI: 1.0
  };

  const faiCredit = amount * (multipliers[asset] || 1);
  const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const depositRecord = {
    id: `dep_${Date.now()}`,
    txHash,
    asset,
    amount,
    faiEquivalent: faiCredit,
    timestamp: 'Just now',
    status: 'CONFIRMED' as const,
    fromAddress: user.walletAddress || '0x71C8...39A4'
  };

  const updatedUser: User = {
    ...user,
    faiBalance: user.faiBalance + faiCredit,
    depositHistory: [depositRecord, ...(user.depositHistory || [])]
  };

  saveStoredUser(updatedUser);

  // Update registry
  const registry = getUsersRegistry();
  if (registry[user.id]) {
    registry[user.id].user = updatedUser;
    registry[user.id].activities.unshift({
      id: `act_${Date.now()}`,
      type: 'claim',
      title: `BNB Chain Deposit (${amount} ${asset})`,
      amount: faiCredit,
      timestamp: 'Just now'
    });
    registry[user.id].notifications.unshift({
      id: `notif_${Date.now()}`,
      type: 'DAILY_REWARD',
      title: `Deposit Confirmed on BNB Chain`,
      message: `Successfully received ${amount} ${asset} (+${faiCredit.toFixed(2)} FAI credited to your account).`,
      timestamp: 'Just now',
      isRead: false,
      iconType: 'check-circle',
      linkTab: 'wallet'
    });
    saveUsersRegistry(registry);
  }

  return { updatedUser, depositRecord };
}
