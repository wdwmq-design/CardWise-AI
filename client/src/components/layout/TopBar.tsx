import React from 'react';
import { useLocation } from 'react-router';
import { Bell, Sparkles, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageInfo = (pathname: string): { title: string; subtitle: string } => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of your card benefits' };
      case '/advisor':
        return { title: 'Purchase Advisor', subtitle: 'Get AI-powered card recommendations' };
      case '/chat':
        return { title: 'AI Chatbot', subtitle: 'Ask anything about your cards' };
      case '/wallet':
        return { title: 'My Wallet', subtitle: 'Manage your credit card portfolio' };
      case '/compare':
        return { title: 'Compare Cards', subtitle: 'Side-by-side benefit analysis' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Manage your account and preferences' };
      default:
        return { title: 'CardWise AI', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <header
      className="sticky top-0 z-10 border-b border-surface-800/40 px-6 py-3.5 flex items-center justify-between"
      style={{
        background: 'rgba(6, 14, 30, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Left: Page Title */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-surface-100 tracking-tight">
            {title}
          </h2>
          {location.pathname === '/advisor' && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-accent/10 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              AI
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-surface-500 font-medium hidden sm:block">{subtitle}</p>
        )}
      </div>

      {/* Right: Global Actions */}
      <div className="flex items-center gap-2">
        {/* Search - Desktop */}
        <div className="hidden lg:flex items-center relative">
          <div className="absolute left-3 flex items-center gap-1.5 text-surface-600">
            <Command className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">K</span>
          </div>
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-surface-900/50 hover:bg-surface-900/70 border border-surface-800/70 hover:border-surface-700/60 text-sm rounded-xl pl-9 pr-4 py-2 w-48 focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/40 focus:w-56 transition-all duration-300 placeholder:text-surface-600 font-medium text-surface-300"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-surface-500 hover:text-surface-200 hover:bg-surface-800/50 rounded-xl transition-all duration-200 cursor-pointer group">
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent border-2 border-[#060e1e] rounded-full shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-surface-800/60" />

        {/* User avatar - visible on mobile and as complement on desktop */}
        {user && (
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/25 flex items-center justify-center font-bold text-accent text-sm group-hover:border-accent/50 transition-colors">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-surface-200 leading-none">
                {user.displayName?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[10px] text-surface-500 mt-0.5">Premium Plan</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
