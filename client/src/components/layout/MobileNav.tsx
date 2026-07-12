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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-surface-800/50 px-2 py-2 flex items-center justify-around"
      style={{
        background: 'rgba(6, 14, 30, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 relative
              ${isActive
                ? 'text-accent'
                : 'text-surface-500 hover:text-surface-300'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`relative transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-accent/15 blur-sm scale-125" />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}`} />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide transition-colors ${isActive ? 'text-accent' : 'text-surface-600'}`}>
                  {tab.name}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
