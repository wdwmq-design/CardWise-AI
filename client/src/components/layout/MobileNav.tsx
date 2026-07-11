import React from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Sparkles, 
  MessageSquare, 
  Wallet, 
  ArrowLeftRight 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const tabs = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Advisor', path: '/advisor', icon: Sparkles },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Compare', path: '/compare', icon: ArrowLeftRight },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t border-surface-800/80 px-4 py-2 flex items-center justify-around pb-safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'text-accent' 
                : 'text-surface-400 hover:text-surface-200'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
