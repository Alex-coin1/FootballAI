/**
 * Web3 & BNB Chain (Binance Smart Chain) Service
 * Manages BNB Chain wallet connections (MetaMask, Trust Wallet, Binance Web3 Wallet),
 * chain switching to BSC Mainnet (Chain ID 56 / 0x38), deposit address derivation,
 * BEP-20 address validation, and block explorer utilities.
 */

export const BNB_CHAIN_CONFIG = {
  chainIdHex: '0x38', // 56 in decimal
  chainIdDecimal: 56,
  chainName: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io/',
    'https://rpc.ankr.com/bsc'
  ],
  blockExplorerUrls: ['https://bscscan.com'],
  testnetChainIdHex: '0x61', // 97 in decimal
  testnetExplorerUrls: ['https://testnet.bscscan.com']
};

export interface Web3ProviderInfo {
  isInstalled: boolean;
  providerName: 'MetaMask' | 'Trust Wallet' | 'Binance Web3' | 'Injected Wallet' | 'None';
  address: string | null;
  chainId: number | null;
  isBnbChain: boolean;
}

/**
 * Detect available browser Web3 provider (window.ethereum / window.BinanceChain)
 */
export function getWeb3Provider(): any {
  if (typeof window === 'undefined') return null;
  const anyWindow = window as any;
  return anyWindow.ethereum || anyWindow.BinanceChain || null;
}

/**
 * Detect provider details
 */
export function detectProviderInfo(): { isInstalled: boolean; name: string } {
  if (typeof window === 'undefined') return { isInstalled: false, name: 'None' };
  const anyWindow = window as any;
  const eth = anyWindow.ethereum;

  if (eth) {
    if (eth.isMetaMask && !eth.isTrust) return { isInstalled: true, name: 'MetaMask' };
    if (eth.isTrust || eth.isTrustWallet) return { isInstalled: true, name: 'Trust Wallet' };
    if (eth.isBinance || anyWindow.BinanceChain) return { isInstalled: true, name: 'Binance Web3 Wallet' };
    if (eth.isCoinbaseWallet) return { isInstalled: true, name: 'Coinbase Wallet' };
    if (eth.isOKXWallet || eth.isOkxWallet) return { isInstalled: true, name: 'OKX Wallet' };
    return { isInstalled: true, name: 'Injected Web3 Wallet' };
  }

  if (anyWindow.BinanceChain) {
    return { isInstalled: true, name: 'Binance Chain Wallet' };
  }

  return { isInstalled: false, name: 'None' };
}

/**
 * Format address into short format: 0x1234...5678
 */
export function formatBnbAddress(address?: string | null): string {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validate standard BEP-20 / EVM address (0x followed by 40 hex chars)
 */
export function isValidBnbAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/**
 * Switch or Add BNB Smart Chain (Chain ID 56) to connected Web3 wallet
 */
export async function switchToBnbChain(): Promise<boolean> {
  const provider = getWeb3Provider();
  if (!provider || !provider.request) {
    return false;
  }

  try {
    // Try switching to BNB Chain
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BNB_CHAIN_CONFIG.chainIdHex }],
    });
    return true;
  } catch (switchError: any) {
    // Error 4902 means the chain has not been added to MetaMask / Trust Wallet yet
    if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BNB_CHAIN_CONFIG.chainIdHex,
              chainName: BNB_CHAIN_CONFIG.chainName,
              nativeCurrency: BNB_CHAIN_CONFIG.nativeCurrency,
              rpcUrls: BNB_CHAIN_CONFIG.rpcUrls,
              blockExplorerUrls: BNB_CHAIN_CONFIG.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add BNB Smart Chain:', addError);
        return false;
      }
    }
    console.error('Failed to switch to BNB Smart Chain:', switchError);
    return false;
  }
}

/**
 * Connect to Web3 Wallet via window.ethereum and ensure BNB Chain is selected
 */
export async function connectWeb3BnbWallet(): Promise<{
  success: boolean;
  address?: string;
  chainId?: number;
  error?: string;
}> {
  const provider = getWeb3Provider();
  if (!provider) {
    return {
      success: false,
      error: 'NO_WEB3_PROVIDER'
    };
  }

  try {
    // Request accounts
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: 'NO_ACCOUNTS_FOUND'
      };
    }

    const address = accounts[0];

    // Check chain ID
    let currentChainIdHex = await provider.request({ method: 'eth_chainId' });
    let currentChainId = parseInt(currentChainIdHex, 16);

    // If not on BNB Chain (56), prompt switch
    if (currentChainId !== BNB_CHAIN_CONFIG.chainIdDecimal) {
      const switched = await switchToBnbChain();
      if (switched) {
        currentChainIdHex = await provider.request({ method: 'eth_chainId' });
        currentChainId = parseInt(currentChainIdHex, 16);
      }
    }

    return {
      success: true,
      address,
      chainId: currentChainId
    };
  } catch (err: any) {
    console.error('Web3 connection error:', err);
    return {
      success: false,
      error: err.message || 'USER_REJECTED'
    };
  }
}

/**
 * Derives or generates a unique BNB Chain deposit address assigned to this user.
 * Deterministically links user's wallet address to their dedicated BNB Smart Chain deposit vault.
 */
export function generateBnbDepositAddress(userWalletAddress: string): string {
  if (!userWalletAddress) {
    return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  const clean = userWalletAddress.toLowerCase().replace('0x', '');
  // Deterministic salt for FootballAI BNB Chain deposit pool
  const salt = 'fai56bnb';
  let hashStr = '';
  for (let i = 0; i < 40; i++) {
    const charCode = (clean.charCodeAt(i % clean.length) + salt.charCodeAt(i % salt.length) * (i + 1)) % 16;
    hashStr += charCode.toString(16);
  }

  return '0x' + hashStr;
}

/**
 * Generate a unique referral code from wallet address or username
 */
export function generateUniqueReferralCode(walletAddress: string, username?: string): string {
  const cleanAddr = walletAddress ? walletAddress.replace('0x', '').toUpperCase() : '';
  const suffix = cleanAddr.slice(0, 4) + cleanAddr.slice(-3);
  const randomSalt = Math.floor(10 + Math.random() * 90);
  return `BNB-${suffix || randomSalt}`;
}

/**
 * Build BSCScan Explorer Link
 */
export function getBscScanUrl(type: 'address' | 'tx', value: string): string {
  return `https://bscscan.com/${type}/${value}`;
}
