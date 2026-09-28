/**
 * FootballAI Official Global Leaderboard Service
 * Tracks live community rankings across FAI Points, Referrals, and Won Predictions.
 * Merges top global analysts and registered users.
 */

import { LeaderboardCategory, LeaderboardEntry } from '../types';
import { getUsersRegistry, getStoredUser } from './userApi';

export const OFFICIAL_COMMUNITY_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'user-01', username: 'StrikerAI', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', points: 142.85, predictionsWon: 48, referralCount: 88, badge: 'Gold' },
  { rank: 2, userId: 'user-02', username: 'BernabeuOracle', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', points: 128.40, predictionsWon: 44, referralCount: 65, badge: 'Silver' },
  { rank: 3, userId: 'user-03', username: 'NeuralKop', avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80', points: 114.20, predictionsWon: 39, referralCount: 52, badge: 'Bronze' },
  { rank: 4, userId: 'user-04', username: 'TikiTakaByte', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80', points: 98.75, predictionsWon: 35, referralCount: 41 },
  { rank: 5, userId: 'user-05', username: 'TacticalGenius', avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=120&q=80', points: 89.50, predictionsWon: 32, referralCount: 36 },
  { rank: 6, userId: 'user-06', username: 'CyberGunner', avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&q=80', points: 82.10, predictionsWon: 30, referralCount: 29 },
  { rank: 7, userId: 'user-07', username: 'MilanoPredictor', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', points: 76.90, predictionsWon: 27, referralCount: 24 },
  { rank: 8, userId: 'user-08', username: 'BavarianBot', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', points: 71.30, predictionsWon: 25, referralCount: 20 },
  { rank: 9, userId: 'user-09', username: 'CatalanMatrix', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', points: 64.65, predictionsWon: 23, referralCount: 18 },
  { rank: 10, userId: 'user-10', username: 'BlueMoonAI', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', points: 58.20, predictionsWon: 21, referralCount: 15 },
  { rank: 11, userId: 'user-11', username: 'PitchVision99', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80', points: 52.80, predictionsWon: 19, referralCount: 14 },
  { rank: 12, userId: 'user-12', username: 'VarCheckPro', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', points: 47.90, predictionsWon: 18, referralCount: 12 },
  { rank: 13, userId: 'user-13', username: 'GoldenBoot77', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', points: 41.50, predictionsWon: 16, referralCount: 9 },
  { rank: 14, userId: 'user-14', username: 'ApexMidfielder', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80', points: 38.10, predictionsWon: 15, referralCount: 8 },
  { rank: 15, userId: 'user-15', username: 'CounterPressAI', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80', points: 33.40, predictionsWon: 13, referralCount: 7 },
  { rank: 16, userId: 'user-16', username: 'DerbyWinner', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', points: 29.80, predictionsWon: 12, referralCount: 5 },
  { rank: 17, userId: 'user-17', username: 'FalseNineAnalyst', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80', points: 24.50, predictionsWon: 10, referralCount: 4 },
  { rank: 18, userId: 'user-18', username: 'RedDevilByte', avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80', points: 19.30, predictionsWon: 8, referralCount: 3 },
  { rank: 19, userId: 'user-19', username: 'CatenaccioShield', avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80', points: 15.60, predictionsWon: 7, referralCount: 2 },
  { rank: 20, userId: 'user-20', username: 'NordicStriker', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', points: 11.20, predictionsWon: 5, referralCount: 1 }
];

export const DEMO_LEADERBOARD_POINTS = OFFICIAL_COMMUNITY_LEADERBOARD;

export async function getLeaderboard(
  category: LeaderboardCategory,
  userScore: { 
    points: number; 
    referrals: number; 
    predictions: number;
    username?: string;
    avatarUrl?: string;
    walletAddress?: string;
  }
): Promise<{ list: LeaderboardEntry[]; currentUserRank: LeaderboardEntry }> {
  await new Promise(resolve => setTimeout(resolve, 60));

  // Merge registered wallets from registry into leaderboard pool
  const registry = getUsersRegistry();
  const registeredEntries: LeaderboardEntry[] = [];
  
  Object.values(registry).forEach((bundle, idx) => {
    if (bundle.user && bundle.user.walletAddress) {
      registeredEntries.push({
        rank: 99,
        userId: bundle.user.id || `reg_${idx}`,
        username: bundle.user.username || `Analyst_${bundle.user.walletAddress.slice(2, 6)}`,
        avatarUrl: bundle.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        points: bundle.user.faiBalance || 0,
        predictionsWon: bundle.user.totalPredictions || 0,
        referralCount: bundle.user.totalReferrals || 0
      });
    }
  });

  // Combine official analysts with registered users
  const combined = [...OFFICIAL_COMMUNITY_LEADERBOARD];
  registeredEntries.forEach(reg => {
    if (!combined.some(c => c.username === reg.username)) {
      combined.push(reg);
    }
  });

  let sorted = combined.map(item => {
    let displayVal = item.points;
    if (category === 'referrals') displayVal = item.referralCount || 0;
    if (category === 'predictions') displayVal = item.predictionsWon || 0;
    return { ...item, points: displayVal };
  });

  sorted.sort((a, b) => b.points - a.points);

  // Assign ranks
  sorted = sorted.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    badge: idx === 0 ? 'Gold' : idx === 1 ? 'Silver' : idx === 2 ? 'Bronze' : undefined
  }));

  // Determine current user position
  const currentVal = category === 'points' 
    ? userScore.points 
    : category === 'referrals' 
      ? userScore.referrals 
      : userScore.predictions;

  let calculatedRank = sorted.findIndex(s => currentVal >= s.points);
  if (calculatedRank === -1) {
    calculatedRank = sorted.length + 1;
  } else {
    calculatedRank = calculatedRank + 1;
  }

  const currentUser = getStoredUser();
  const displayName = userScore.username || currentUser.username || (currentUser.walletAddress ? `Analyst_${currentUser.walletAddress.slice(2, 6)}` : 'You (Active Analyst)');

  const currentUserRank: LeaderboardEntry = {
    rank: calculatedRank,
    userId: currentUser.id || 'current-user',
    username: displayName,
    avatarUrl: userScore.avatarUrl || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    points: currentVal,
    isCurrentUser: true,
    badge: calculatedRank === 1 ? 'Gold' : calculatedRank === 2 ? 'Silver' : calculatedRank === 3 ? 'Bronze' : undefined
  };

  return { list: sorted.slice(0, 25), currentUserRank };
}
