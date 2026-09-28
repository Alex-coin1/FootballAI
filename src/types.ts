/**
 * FootballAI (FAI) Data Models & TypeScript Interfaces
 * Architecture ready for future real Football APIs, News Feeds, and Blockchain integrations.
 */

export type NavigationTab = 
  | 'home' 
  | 'matches' 
  | 'predict' 
  | 'tasks' 
  | 'rank' 
  | 'news' 
  | 'nfts' 
  | 'wallet' 
  | 'profile' 
  | 'settings' 
  | 'about' 
  | 'admin'
  | 'referrals';

export type Language = 'en' | 'ar';
export type ThemeMode = 'dark' | 'system';

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface DepositRecord {
  id: string;
  txHash: string;
  asset: 'BNB' | 'USDT' | 'FAI';
  amount: number;
  faiEquivalent: number;
  timestamp: string;
  status: 'CONFIRMED' | 'PENDING';
  fromAddress: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpNextLevel: number;
  faiBalance: number; // Pilot points
  streakDays: number;
  lastClaimTimestamp: number | null; // ms timestamp
  totalPredictions: number;
  wonPredictions: number;
  totalReferrals: number;
  referralCode: string;
  joinedDate: string;
  claimedDays: number[]; // e.g. [1, 2] for 7-day streak tracking
  
  // Web3 & BNB Chain integration
  walletAddress?: string;
  bnbDepositAddress?: string;
  bnbChainId?: number; // 56 for BSC Mainnet
  isWeb3Connected?: boolean;
  referredBy?: string | null;
  referralLink?: string;
  depositHistory?: DepositRecord[];
}

export type MatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED';
export type LeagueId = 'premier-league' | 'la-liga' | 'champions-league';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  logoUrl?: string;
  primaryColor: string;
  form?: ('W' | 'D' | 'L')[];
}

export interface MatchStatistic {
  label: string;
  homeValue: number;
  awayValue: number;
  unit?: string;
}

export interface TimelineEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface AIPredictionData {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  recommendedChoice: 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';
  confidence: number;
  keyInsight: string;
}

export interface HeadToHeadData {
  homeWins: number;
  draws: number;
  awayWins: number;
  lastMatchResult: string;
}

export interface Match {
  id: string;
  matchday?: number;
  weekLabel?: string;
  leagueId: LeagueId;
  leagueName: string;
  leagueLogo: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  kickoff: string;
  time?: string;
  timestamp: number;
  venue: string;
  status: MatchStatus;
  currentMinute?: number;
  minute?: number;
  statistics?: MatchStatistic[];
  timeline?: TimelineEvent[];
  aiPredictedOutcome?: 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';
  aiConfidence?: number;
  aiAnalysis?: string;
  aiPrediction: AIPredictionData;
  headToHead: HeadToHeadData;
  predictedLineups?: {
    home: string[];
    away: string[];
  };
}

export type PredictionChoice = 'HOME_WIN' | 'DRAW' | 'AWAY_WIN';

export interface Prediction {
  id: string;
  matchId: string;
  match: Match;
  aiPrediction: PredictionChoice;
  confidence: number;
  analysis: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}

export interface UserPredictionRecord {
  id: string;
  matchId: string;
  matchTitle: string;
  matchDate: string;
  leagueName: string;
  userChoice: PredictionChoice;
  aiChoice: PredictionChoice;
  result?: PredictionChoice;
  status: 'PENDING' | 'WON' | 'LOST';
  pointsEarned: number;
  submittedAt: string;
}

export type NewsCategory = 
  | 'All' 
  | 'Football' 
  | 'Transfers' 
  | 'Champions League' 
  | 'Premier League' 
  | 'La Liga' 
  | 'AI Analysis'
  | 'Tactical'
  | 'AI in Sports' 
  | 'Technology';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  source: string;
  publishedAt: string;
  imageUrl: string;
  readTime: string;
  url?: string;
  tags?: string[];
  viewsCount?: string;
  author?: string;
}

export type TaskStatus = 'AVAILABLE' | 'PENDING_VERIFICATION' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number; // in FAI
  status: TaskStatus;
  category: 'daily' | 'social' | 'prediction' | 'special';
  actionUrl?: string;
  actionText?: string;
  isExternal?: boolean;
  durationMode?: 'PERMANENT' | 'TIME_LIMITED' | 'DAILY_RECURRING';
  expiresAt?: string;
  isActive?: boolean;
}

export interface ReferralTier {
  referralsRequired: number;
  rewardBonus: number;
  perks: string;
  completed: boolean;
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  qualifiedReferrals: number;
  rewardsEarned: number;
  tiers: ReferralTier[];
}

export type LeaderboardCategory = 'points' | 'referrals' | 'predictions';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string;
  points: number;
  predictionsWon?: number;
  referralCount?: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export type NFTRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type NFTFilter = 'All' | NFTRarity;

export interface NFTCardStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

export interface NFTCard {
  id?: string;
  cardId?: string;
  tokenId: number;
  playerName: string;
  club: string;
  nationality: string;
  rarity: NFTRarity;
  rating: number;
  overallRating?: number;
  position: 'ST' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  ability: string;
  imageUrl: string;
  metadataUrl: string;
  contractAddress: string;
  chainId: number;
  status: 'preview' | 'minted';
  edition: string;
  serialNumber?: string;
  stats?: NFTCardStats;
  priceFai?: number;
  description?: string;
  tradingStatus?: 'LISTED' | 'UNLISTED' | 'SCHEDULED';
  scheduledTradingDate?: string;
  customFeatures?: string[];
}

export type NotificationType = 
  | 'DAILY_REWARD' 
  | 'PREDICTION_SUBMITTED' 
  | 'MISSION_COMPLETED' 
  | 'FOOTBALL_NEWS' 
  | 'MATCH_AVAILABLE' 
  | 'ACHIEVEMENT_UNLOCKED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  iconType: string;
  linkTab?: NavigationTab;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rewardFai: number;
}

export interface WalletState {
  balance: number;
  walletAddress: string | null;
  status: 'PILOT BALANCE';
  withdrawalsLocked: boolean;
  network: string;
}

export interface ActivityItem {
  id: string;
  type: 'claim' | 'prediction' | 'task' | 'referral';
  title: string;
  amount: number;
  timestamp: string;
}
