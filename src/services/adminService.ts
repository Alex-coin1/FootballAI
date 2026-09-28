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

import { NFTCard, User } from '../types';
import { ENRICHED_NFT_CARDS } from './nftApi';
import { getUsersRegistry, saveUsersRegistry, getStoredUser, saveStoredUser } from './userApi';

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
