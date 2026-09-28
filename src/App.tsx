/**
 * FootballAI (FAI)
 * Slogan: "Where Football Meets Intelligence"
 * Modern Mobile-First Football + Artificial Intelligence Web Platform
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { ToastContainer } from './components/common/Toast';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { SplashScreen } from './components/common/SplashScreen';
import { NotificationsModal } from './components/common/NotificationsModal';
import { MatchDetailModal } from './components/matches/MatchDetailModal';
import { NewsDetailModal } from './components/news/NewsDetailModal';
import { NFTDetailModal } from './components/nfts/NFTDetailModal';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { PredictPage } from './pages/PredictPage';
import { TasksPage } from './pages/TasksPage';
import { RankPage } from './pages/RankPage';
import { NewsPage } from './pages/NewsPage';
import { NFTsPage } from './pages/NFTsPage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { ReferralsPage } from './pages/ReferralsPage';

const AppContent: React.FC = () => {
  const { 
    currentTab, 
    showSplash, 
    dismissSplash,
    authModalOpen,
    setAuthModalOpen,
    authModalTab
  } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomePage />;
      case 'matches':
        return <MatchesPage />;
      case 'predict':
        return <PredictPage />;
      case 'tasks':
        return <TasksPage />;
      case 'rank':
        return <RankPage />;
      case 'news':
        return <NewsPage />;
      case 'nfts':
        return <NFTsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutPage />;
      case 'admin':
        return <AdminPage />;
      case 'referrals':
        return <ReferralsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Splash screen on initial launch */}
      {showSplash && <SplashScreen onFinish={dismissSplash} />}

      {/* Main App Bar */}
      <Header />

      {/* Primary Layout Structure (Desktop Sidebar + Center Stage) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Center Stage */}
        <main 
          id="main-viewport" 
          className="flex-1 min-w-0 px-3 sm:px-5 md:px-8 pt-4 sm:pt-6 pb-20 lg:pb-10 max-w-4xl"
        >
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNavigation />

      {/* Global Interactive Modals & Drawers */}
      <NotificationsModal />
      <MatchDetailModal />
      <NewsDetailModal />
      <NFTDetailModal />
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab}
      />

      {/* System Feedback & Connectivity */}
      <ToastContainer />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
