/**
 * FootballAI Super Admin Service
 * Restricts access to authorized admin wallet:
 * 0xf609ca4b709cae5304547a1345a29d31565a19a5
 * 
 * Provides:
 * - Admin authorization checks
 * - Full NFT Studio: Create, Edit, Price Control, Schedule Trading, Delist, Upload Images
 * - Wallet & Users Inspector: View all registered users, balances, deposit addresses, referrals
 */

import { NFTCard, User, Task, TaskSubmission, Notification, ActivityItem } from '../types';
import { ENRICHED_NFT_CARDS } from './nftApi';
import { 
  getUsersRegistry, 
  saveUsersRegistry, 
  getStoredUser, 
  saveStoredUser, 
  DEFAULT_TASKS,
  getStoredTasks,
  saveStoredTasks,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredActivities,
  saveStoredActivities
} from './userApi';

export const ADMIN_WALLET_ADDRESS = '0xf609ca4b709cae5304547a1345a29d31565a19a5'.toLowerCase();

/**
 * Checks if the given address is the authorized Super Admin
 */
export function isUserAdmin(walletAddress?: string): boolean {
  if (!walletAddress) return false;
  return walletAddress.toLowerCase().trim() === ADMIN_WALLET_ADDRESS;
}

const STORAGE_KEY_CUSTOM_NFTS = 'footballai_custom_nfts';

/**
 * Get all NFTs merged with any admin customizations / newly created cards
 */
export function getManagedNFTs(): NFTCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_NFTS);
    if (raw) {
      const customCards: NFTCard[] = JSON.parse(raw);
      // Map existing base cards with custom overrides, and append brand-new tokens
      const customMap = new Map<number, NFTCard>();
      customCards.forEach(c => customMap.set(c.tokenId, c));

      const merged = ENRICHED_NFT_CARDS.map(base => {
        if (customMap.has(base.tokenId)) {
          const override = customMap.get(base.tokenId)!;
          customMap.delete(base.tokenId);
          return override;
        }
        return {
          ...base,
          priceFai: base.priceFai ?? (base.rarity === 'Legendary' ? 100 : base.rarity === 'Epic' ? 50 : base.rarity === 'Rare' ? 25 : 10),
          tradingStatus: base.tradingStatus ?? ('LISTED' as const)
        };
      });

      // Any remaining new custom cards added by admin
      customMap.forEach(newCard => {
        merged.unshift(newCard);
      });

      return merged;
    }
  } catch (e) {
    console.error('Failed to parse custom NFTs', e);
  }

  // Default with default prices and LISTED status
  return ENRICHED_NFT_CARDS.map(base => ({
    ...base,
    priceFai: base.priceFai ?? (base.rarity === 'Legendary' ? 100 : base.rarity === 'Epic' ? 50 : base.rarity === 'Rare' ? 25 : 10),
    tradingStatus: base.tradingStatus ?? ('LISTED' as const)
  }));
}

/**
 * Save all custom NFTs to localStorage
 */
export function saveAllManagedNFTs(cards: NFTCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_NFTS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save custom NFTs', e);
  }
}

/**
 * Create or update an NFT card
 */
export function saveOrUpdateNFT(cardData: Partial<NFTCard> & { playerName: string }): NFTCard {
  const allCards = getManagedNFTs();
  
  let targetTokenId = cardData.tokenId;
  if (!targetTokenId) {
    // Generate new tokenId higher than max
    const maxTokenId = allCards.reduce((max, c) => Math.max(max, c.tokenId), 2000);
    targetTokenId = maxTokenId + 1;
  }

  const existingIdx = allCards.findIndex(c => c.tokenId === targetTokenId);

  const fullCard: NFTCard = {
    tokenId: targetTokenId,
    id: cardData.id || `nft-card-${targetTokenId}`,
    cardId: cardData.cardId || `FAI-${targetTokenId}`,
    playerName: cardData.playerName,
    club: cardData.club || 'FootballAI Select',
    nationality: cardData.nationality || 'International',
    rarity: cardData.rarity || 'Epic',
    rating: cardData.rating || 90,
    overallRating: cardData.overallRating || cardData.rating || 90,
    position: cardData.position || 'ST',
    pace: cardData.pace ?? 88,
    shooting: cardData.shooting ?? 85,
    passing: cardData.passing ?? 82,
    dribbling: cardData.dribbling ?? 86,
    defending: cardData.defending ?? 60,
    physical: cardData.physical ?? 80,
    ability: cardData.ability || 'Tactical Dominance',
    imageUrl: cardData.imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    metadataUrl: cardData.metadataUrl || `ipfs://bafybeifai${targetTokenId}/metadata.json`,
    contractAddress: cardData.contractAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    chainId: cardData.chainId || 56, // BNB Smart Chain
    status: cardData.status || 'preview',
    edition: cardData.edition || `#${targetTokenId % 100 || 1}/100`,
    priceFai: cardData.priceFai !== undefined ? cardData.priceFai : 50,
    description: cardData.description || `${cardData.playerName} official digital collectible for FootballAI on BNB Chain.`,
    tradingStatus: cardData.tradingStatus || 'LISTED',
    scheduledTradingDate: cardData.scheduledTradingDate || '',
    customFeatures: cardData.customFeatures || []
  };

  if (existingIdx >= 0) {
    allCards[existingIdx] = fullCard;
  } else {
    allCards.unshift(fullCard);
  }

  saveAllManagedNFTs(allCards);
  return fullCard;
}

/**
 * Delete or permanently archive an NFT
 */
export function deleteNFT(tokenId: number): void {
  const allCards = getManagedNFTs();
  const filtered = allCards.filter(c => c.tokenId !== tokenId);
  saveAllManagedNFTs(filtered);
}

/**
 * Update price of an NFT
 */
export function updateNFTPrice(tokenId: number, newPriceFai: number): void {
  const allCards = getManagedNFTs();
  const card = allCards.find(c => c.tokenId === tokenId);
  if (card) {
    card.priceFai = Math.max(0, newPriceFai);
    saveAllManagedNFTs(allCards);
  }
}

/**
 * Update trading status and schedule
 */
export function updateNFTTradingStatus(
  tokenId: number, 
  status: 'LISTED' | 'UNLISTED' | 'SCHEDULED', 
  scheduledDate?: string
): void {
  const allCards = getManagedNFTs();
  const card = allCards.find(c => c.tokenId === tokenId);
  if (card) {
    card.tradingStatus = status;
    if (scheduledDate !== undefined) {
      card.scheduledTradingDate = scheduledDate;
    }
    saveAllManagedNFTs(allCards);
  }
}

/**
 * Get all registered user wallets for admin inspection
 */
export function getAllRegisteredWallets(): User[] {
  const registry = getUsersRegistry();
  const usersList: User[] = Object.values(registry).map(b => b.user);

  // Also include the currently active user if not already present
  const current = getStoredUser();
  if (current.isWeb3Connected && current.walletAddress) {
    const exists = usersList.some(u => u.walletAddress?.toLowerCase() === current.walletAddress?.toLowerCase());
    if (!exists) {
      usersList.unshift(current);
    }
  }

  return usersList;
}

/**
 * Admin adjustments to a user's balance
 */
export function adminSetUserBalance(walletAddress: string, newBalance: number): boolean {
  const norm = walletAddress.toLowerCase().trim();
  const registry = getUsersRegistry();

  const userKey = Object.keys(registry).find(
    k => registry[k].user.walletAddress?.toLowerCase() === norm
  );

  if (userKey) {
    registry[userKey].user.faiBalance = Math.max(0, Number(newBalance.toFixed(4)));
    saveUsersRegistry(registry);
  }

  const current = getStoredUser();
  if (current.walletAddress?.toLowerCase() === norm) {
    current.faiBalance = Math.max(0, Number(newBalance.toFixed(4)));
    saveStoredUser(current);
  }

  return true;
}

// ============================================================================
// TASKS & MISSIONS MANAGEMENT (Admin Controlled)
// ============================================================================
const STORAGE_KEY_CUSTOM_TASKS = 'footballai_custom_tasks';

/**
 * Get all tasks merged with custom admin tasks and modifications
 */
export function getManagedTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_TASKS);
    if (raw) {
      const customTasks: Task[] = JSON.parse(raw);
      const customMap = new Map<string, Task>();
      customTasks.forEach(t => customMap.set(t.id, t));

      const merged = DEFAULT_TASKS.map(base => {
        if (customMap.has(base.id)) {
          const override = customMap.get(base.id)!;
          customMap.delete(base.id);
          return override;
        }
        return {
          ...base,
          durationMode: base.durationMode || 'PERMANENT',
          isActive: base.isActive !== false
        };
      });

      // Append newly added admin tasks
      customMap.forEach(newTask => {
        merged.push(newTask);
      });

      return merged;
    }
  } catch (e) {
    console.error('Failed to parse custom tasks', e);
  }

  return DEFAULT_TASKS.map(base => ({
    ...base,
    durationMode: base.durationMode || 'PERMANENT',
    isActive: true
  }));
}

/**
 * Save all managed tasks
 */
export function saveAllManagedTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save managed tasks', e);
  }
}

/**
 * Create or update a task
 */
export function saveOrUpdateTask(taskData: Partial<Task> & { title: string; reward: number }): Task {
  const allTasks = getManagedTasks();
  const taskId = taskData.id || `task_admin_${Date.now()}`;

  const fullTask: Task = {
    id: taskId,
    title: taskData.title.trim(),
    description: taskData.description?.trim() || 'Complete this task to earn FAI rewards.',
    reward: Math.max(0, Number((taskData.reward || 0.05).toFixed(4))),
    status: taskData.status || 'AVAILABLE',
    category: taskData.category || 'social',
    actionUrl: taskData.actionUrl?.trim() || undefined,
    actionText: taskData.actionText?.trim() || 'Start Mission',
    isExternal: Boolean(taskData.actionUrl),
    durationMode: taskData.durationMode || 'PERMANENT',
    expiresAt: taskData.expiresAt?.trim() || undefined,
    isActive: taskData.isActive !== false
  };

  const existingIdx = allTasks.findIndex(t => t.id === taskId);
  if (existingIdx >= 0) {
    allTasks[existingIdx] = fullTask;
  } else {
    allTasks.push(fullTask);
  }

  saveAllManagedTasks(allTasks);
  return fullTask;
}

/**
 * Delete a task
 */
export function deleteManagedTask(taskId: string): void {
  const allTasks = getManagedTasks();
  const filtered = allTasks.filter(t => t.id !== taskId);
  saveAllManagedTasks(filtered);
}

/**
 * Quick toggle task active / inactive
 */
export function toggleTaskActive(taskId: string): void {
  const allTasks = getManagedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (task) {
    task.isActive = task.isActive === false ? true : false;
    saveAllManagedTasks(allTasks);
  }
}

/**
 * Quick update task reward
 */
export function updateTaskReward(taskId: string, newReward: number): void {
  const allTasks = getManagedTasks();
  const task = allTasks.find(t => t.id === taskId);
  if (task) {
    task.reward = Math.max(0, Number(newReward.toFixed(4)));
    saveAllManagedTasks(allTasks);
  }
}

// ============================================================================
// TASK EVIDENCE VERIFICATION (Admin Approval & Rejection Workflow)
// ============================================================================
const STORAGE_KEY_TASK_SUBMISSIONS = 'footballai_task_submissions';

export const INITIAL_SAMPLE_SUBMISSIONS: TaskSubmission[] = [
  {
    id: 'sub_sample_101',
    taskId: 'task-2',
    taskTitle: 'Follow @FootballAIHQ on X',
    userId: 'user_0x4b8a',
    userAddress: '0x4b8a78216cb03d2994e0193bbcf3924765a08912',
    username: 'TacticalScout',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    reward: 0.20,
    submittedAt: '12 minutes ago',
    evidenceNote: 'Followed with handle @TacticalScoutHQ and retweeted the pinned launch announcement.',
    evidenceImage: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=600&q=80',
    status: 'PENDING'
  },
  {
    id: 'sub_sample_102',
    taskId: 'task-3',
    taskTitle: 'Share FootballAI with Friends',
    userId: 'user_0x91d2',
    userAddress: '0x91d227a840c4f826315582c9748b61e204cba719',
    username: 'StrikerAI',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    reward: 0.15,
    submittedAt: '35 minutes ago',
    evidenceNote: 'Shared in football Telegram channel (1,400 members) with my referral code.',
    evidenceImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80',
    status: 'PENDING'
  },
  {
    id: 'sub_sample_103',
    taskId: 'task-5',
    taskTitle: 'Complete 3 AI Match Predictions',
    userId: 'user_0x78fe',
    userAddress: '0x78fe98c19904981121d55e378f82873c915f0120',
    username: 'BernabeuOracle',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    reward: 0.10,
    submittedAt: '2 hours ago',
    evidenceNote: 'Predicted UCL matches: Real Madrid vs Man City, Arsenal vs Bayern, PSG vs Barca.',
    status: 'APPROVED',
    reviewedAt: '1 hour ago'
  }
];

/**
 * Get all task submissions
 */
export function getTaskSubmissions(): TaskSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASK_SUBMISSIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse task submissions', e);
  }
  // Initialize with samples if first load
  saveTaskSubmissions(INITIAL_SAMPLE_SUBMISSIONS);
  return INITIAL_SAMPLE_SUBMISSIONS;
}

/**
 * Save task submissions
 */
export function saveTaskSubmissions(submissions: TaskSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TASK_SUBMISSIONS, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save task submissions', e);
  }
}

/**
 * User submits evidence for a task
 */
export function submitTaskEvidence(params: {
  taskId: string;
  taskTitle: string;
  userId: string;
  userAddress: string;
  username: string;
  userAvatar?: string;
  reward: number;
  evidenceNote?: string;
  evidenceImage?: string;
}): TaskSubmission {
  const submissions = getTaskSubmissions();
  
  // Check if there is an existing pending submission for this task by this user
  const existingIdx = submissions.findIndex(
    s => s.taskId === params.taskId && 
    (s.userId === params.userId || s.userAddress.toLowerCase() === params.userAddress.toLowerCase()) &&
    s.status === 'PENDING'
  );

  const newSubmission: TaskSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    taskId: params.taskId,
    taskTitle: params.taskTitle,
    userId: params.userId,
    userAddress: params.userAddress.toLowerCase(),
    username: params.username,
    userAvatar: params.userAvatar,
    reward: params.reward,
    submittedAt: 'Just now',
    evidenceNote: params.evidenceNote?.trim(),
    evidenceImage: params.evidenceImage,
    status: 'PENDING'
  };

  if (existingIdx >= 0) {
    submissions[existingIdx] = newSubmission;
  } else {
    submissions.unshift(newSubmission);
  }

  saveTaskSubmissions(submissions);
  return newSubmission;
}

/**
 * Admin approves a task submission and automatically awards FAI points
 */
export function approveTaskSubmission(submissionId: string): { 
  success: boolean; 
  submission?: TaskSubmission; 
  message?: string 
} {
  const submissions = getTaskSubmissions();
  const submission = submissions.find(s => s.id === submissionId);

  if (!submission) {
    return { success: false, message: 'Submission not found' };
  }

  if (submission.status === 'APPROVED') {
    return { success: false, message: 'Submission has already been approved' };
  }

  // Update submission status
  submission.status = 'APPROVED';
  submission.reviewedAt = 'Just now';
  delete submission.rejectionReason;
  saveTaskSubmissions(submissions);

  const normAddress = submission.userAddress.toLowerCase().trim();

  // 1. Credit reward to User Registry
  const registry = getUsersRegistry();
  const userKey = Object.keys(registry).find(
    k => registry[k].user.walletAddress?.toLowerCase() === normAddress
  );

  if (userKey) {
    registry[userKey].user.faiBalance = Number(
      ((registry[userKey].user.faiBalance || 0) + submission.reward).toFixed(4)
    );
    registry[userKey].user.xp = (registry[userKey].user.xp || 0) + 25;
    
    // Mark task as completed in user's bundle
    if (registry[userKey].tasks) {
      registry[userKey].tasks = registry[userKey].tasks.map(tk => 
        tk.id === submission.taskId ? { ...tk, status: 'COMPLETED' as const } : tk
      );
    }
    saveUsersRegistry(registry);
  }

  // 2. If the submitter is the currently logged-in user in localStorage, update current user too
  const currentUser = getStoredUser();
  if (currentUser.walletAddress?.toLowerCase() === normAddress) {
    currentUser.faiBalance = Number(((currentUser.faiBalance || 0) + submission.reward).toFixed(4));
    currentUser.xp = (currentUser.xp || 0) + 25;
    saveStoredUser(currentUser);

    // Update stored tasks
    const currentTasks = getStoredTasks();
    const updatedTasks = currentTasks.map(tk => 
      tk.id === submission.taskId ? { ...tk, status: 'COMPLETED' as const } : tk
    );
    saveStoredTasks(updatedTasks);

    // Add activity
    const newAct: ActivityItem = {
      id: 'act_' + Date.now(),
      type: 'task',
      title: `Verified Mission: ${submission.taskTitle}`,
      amount: submission.reward,
      timestamp: 'Just now'
    };
    saveStoredActivities([newAct, ...getStoredActivities()]);

    // Add notification
    const newNotif: Notification = {
      id: 'notif_sub_' + Date.now(),
      type: 'MISSION_COMPLETED',
      title: 'Mission Evidence Approved! 🎉',
      message: `Your proof for "${submission.taskTitle}" was verified by Admin. +${submission.reward} FAI has been added to your balance!`,
      timestamp: 'Just now',
      isRead: false,
      iconType: 'task',
      linkTab: 'wallet'
    };
    saveStoredNotifications([newNotif, ...getStoredNotifications()]);
  }

  return { success: true, submission };
}

/**
 * Admin rejects a task submission with an optional reason
 */
export function rejectTaskSubmission(
  submissionId: string, 
  reason?: string
): { 
  success: boolean; 
  submission?: TaskSubmission 
} {
  const submissions = getTaskSubmissions();
  const submission = submissions.find(s => s.id === submissionId);

  if (!submission) {
    return { success: false };
  }

  submission.status = 'REJECTED';
  submission.reviewedAt = 'Just now';
  submission.rejectionReason = reason?.trim() || 'Evidence provided was insufficient or could not be verified.';
  saveTaskSubmissions(submissions);

  const normAddress = submission.userAddress.toLowerCase().trim();

  // Reset task back to AVAILABLE in registry
  const registry = getUsersRegistry();
  const userKey = Object.keys(registry).find(
    k => registry[k].user.walletAddress?.toLowerCase() === normAddress
  );
  if (userKey && registry[userKey].tasks) {
    registry[userKey].tasks = registry[userKey].tasks.map(tk => 
      tk.id === submission.taskId ? { ...tk, status: 'AVAILABLE' as const } : tk
    );
    saveUsersRegistry(registry);
  }

  // Reset task in current user if matching
  const currentUser = getStoredUser();
  if (currentUser.walletAddress?.toLowerCase() === normAddress) {
    const currentTasks = getStoredTasks();
    const updatedTasks = currentTasks.map(tk => 
      tk.id === submission.taskId ? { ...tk, status: 'AVAILABLE' as const } : tk
    );
    saveStoredTasks(updatedTasks);

    // Send notification
    const newNotif: Notification = {
      id: 'notif_rej_' + Date.now(),
      type: 'MISSION_COMPLETED',
      title: 'Mission Verification Update',
      message: `Your proof for "${submission.taskTitle}" was not approved: ${submission.rejectionReason}. You can re-submit valid evidence.`,
      timestamp: 'Just now',
      isRead: false,
      iconType: 'task',
      linkTab: 'tasks'
    };
    saveStoredNotifications([newNotif, ...getStoredNotifications()]);
  }

  return { success: true, submission };
}


