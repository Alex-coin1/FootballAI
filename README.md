# FootballAI (FAI) — Where Football Meets Intelligence

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Network](https://img.shields.io/badge/BNB%20Chain-BEP--20-F0B90B.svg)](https://binance.org)

FootballAI is a high-performance, mobile-first Web3 football intelligence platform. It fuses authentic live match telemetry, machine learning probabilistic predictions, daily analyst engagement, digital collectibles, and BNB Smart Chain wallet integration.

---

## 🚀 Key Features

### 1. Web3 & BNB Smart Chain Authentication
- **1-Click Wallet Connection**: Connect seamlessly via MetaMask, Trust Wallet, Binance Web3 Wallet, or enter any valid BEP-20 address.
- **BNB Chain Network Detection**: Enforces BSC Mainnet (Chain ID `56` / `0x38`) with automated chain-switch prompts.
- **Dedicated BEP-20 Deposit Vault**: Derives and links a deterministic deposit address for each registered user on BNB Chain.
- **Multi-Account Support**: Store multiple registered analyst accounts on the device with seamless profile switching and logout.

### 2. Unique Referral Architecture
- **Automatic Unique Referral Links**: Every registered user immediately receives an exclusive referral link (`/?ref=REFERRAL_CODE`).
- **Dynamic Referral Tracking**: Automatically detects incoming referral query parameters upon registration and awards both inviter (+0.20 FAI) and new registrant (+0.05 FAI).
- **Referral Milestones & Tiers**: Multi-tier milestone progression (Bronze, Silver, Gold Ambassador) with one-click link copying and native mobile sharing.

### 3. Authentic Football Telemetry & AI Predictions
- **Real Match Fixtures**: Real match schedule, team details, live scores, and game week timings pulled from real football data feeds.
- **Probabilistic Forecast Engine**: AI-calculated win/draw/loss probabilities, key players, and head-to-head match breakdowns.
- **Forecast Submission**: Users submit predictions, track win rates, and climb global analyst leaderboards.

### 4. Daily Engagement & Missions
- **24-Hour Claim Timer**: Claim daily FAI pilot points with streak multipliers.
- **Official Social Tasks**: Follow the official channel [@FootballAIHQ on X](https://x.com/FootballAIHQ) with verified link tracking.
- **NFT Collectibles**: Discover and unlock digital player trading cards with rarity tiers (Legendary, Epic, Rare, Common).

### 5. Full Bilingual Arabic & English Support (RTL/LTR)
- **Native Arabic Experience**: Complete right-to-left layout alignment, translated team names, leagues, countdown timers (أيام/ساعات/دقائق/ثوانٍ), notifications, and UI elements.
- **Instant Language Switcher**: Toggle smoothly between English and Arabic at any time.

---

## 🛠️ Project Structure

```
├── public/                 # Static assets, icons, PWA manifest, and service worker
├── src/
│   ├── components/
│   │   ├── auth/           # AuthModal (Web3 BNB Chain login & registration)
│   │   ├── common/         # Header, Sidebar, BottomNav, Toasts, Offline indicator
│   │   ├── matches/        # MatchCard, MatchList, MatchDetailModal
│   │   ├── nfts/           # NFTCard, NFTDetailModal
│   │   ├── news/           # NewsCard, NewsDetailModal
│   │   └── predict/        # Prediction slips, AI probability engine
│   ├── context/            # AppContext (global state, auth, balance, claim timer)
│   ├── data/               # Authentic football matches, NFT cards, mock news
│   ├── i18n/               # Arabic & English translations and localized helpers
│   ├── pages/              # Home, Matches, Predict, Tasks, Rank, Wallet, Referrals, Profile, Settings, About, Admin
│   ├── services/           # web3BnbService, footballApi, userApi, predictionApi
│   ├── types.ts            # TypeScript interfaces (User, DepositRecord, Match, etc.)
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # React DOM entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite build configuration
└── metadata.json           # Applet metadata & capabilities
```

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/FootballAI.git
   cd FootballAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Connecting to GitHub

### Method 1: Export Directly via Google AI Studio
1. In the upper toolbar of **Google AI Studio**, look for the **Export** or **GitHub** icon.
2. Select **Export to GitHub**.
3. Authorize your GitHub account if prompted.
4. Set the repository name to `FootballAI` and click **Create Repository**.

### Method 2: Push via Git Command Line
```bash
git init
git add .
git commit -m "Initial commit of FootballAI platform"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/FootballAI.git
git push -u origin main
```

---

## 📄 License
This project is released under the MIT License.
