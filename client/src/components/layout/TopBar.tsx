import React from 'react';
import { useLocation } from 'react-router';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard';
      case '/advisor': return 'AI Purchase Advisor';
      case '/chat': return 'AI Benefits Chatbot';
      case '/wallet': return 'My Card Wallet';
      case '/compare': return 'Card Comparison';
      case '/settings': return 'Settings';
      default: return 'CardWise AI';
    }
  };

  return (
    <header className="sticky top-0 z-10 glass border-b border-surface-800/80 px-6 py-4 flex items-center justify-between">
      {/* Title / Section Name */}
      <div>
        <h2 className="text-xl font-bold text-surface-500 md:text-surface-100 flex items-center gap-2">
          {getPageTitle(location.pathname)}
          {location.pathname === '/advisor' && (
            <span className="flex items-center gap-1 text-[11px] bg-accent/15 border border-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 animate-pulse" /> AI Powered
            </span>
          )}
        </h2>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Search Input - Desktop only */}
        <div className="hidden sm:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-surface-500" />
          <input 
            type="text" 
            placeholder="Search transactions, cards..."
            className="bg-surface-900/50 border border-surface-800 text-sm rounded-xl pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all placeholder:text-surface-600"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 rounded-xl transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent border-2 border-slate-950 rounded-full" />
        </button>

        {/* User profile dropdown trigger - mobile only */}
        {user && (
          <div className="md:hidden w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center font-bold text-accent border border-surface-700/50">
            {user.displayName ? user.displayName.charAt(0) : 'U'}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
