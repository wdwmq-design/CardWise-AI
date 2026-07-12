import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  LayoutDashboard, 
  Sparkles, 
  MessageSquare, 
  Wallet, 
  ArrowLeftRight, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Purchase Advisor', path: '/advisor', icon: Sparkles },
    { name: 'AI Chatbot', path: '/chat', icon: MessageSquare },
    { name: 'My Wallet', path: '/wallet', icon: Wallet },
    { name: 'Compare Cards', path: '/compare', icon: ArrowLeftRight },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col border-r border-surface-800/50 transition-all duration-300 ease-in-out h-screen sticky top-0 z-20
        ${isCollapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
      style={{
        background: 'linear-gradient(180deg, #060e1e 0%, #08132a 60%, #060e1e 100%)',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Header / Logo */}
      <div className={`flex items-center border-b border-surface-800/40 transition-all duration-300 ${isCollapsed ? 'justify-center p-4' : 'justify-between px-5 py-5'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-surface-50">CardWise</span>
              <span className="text-[9px] bg-accent/15 border border-accent/25 text-accent font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">AI</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 flex items-center justify-center text-surface-500 hover:text-surface-200 hover:bg-surface-800/60 rounded-lg transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-3 w-8 h-6 flex items-center justify-center text-surface-600 hover:text-surface-300 hover:bg-surface-800/40 rounded-lg transition-all cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="text-[10px] font-bold text-surface-600 uppercase tracking-widest px-3 pb-2 pt-1">
            Navigation
          </p>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl font-medium transition-all duration-200 group relative
                ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-accent/12 text-accent'
                  : 'text-surface-500 hover:text-surface-200 hover:bg-surface-800/40'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
                  )}
                  <Icon className={`shrink-0 transition-all duration-200 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' : ''}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={`border-t border-surface-800/40 ${isCollapsed ? 'px-2 py-3 space-y-1' : 'px-3 py-4 space-y-0.5'}`}>
        <NavLink
          to="/settings"
          title={isCollapsed ? 'Settings' : undefined}
          className={({ isActive }) => `
            flex items-center gap-3 rounded-xl font-medium transition-all duration-200 relative
            ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
            ${isActive
              ? 'bg-accent/12 text-accent'
              : 'text-surface-500 hover:text-surface-200 hover:bg-surface-800/40'
            }
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
              )}
              <Settings className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
            </>
          )}
        </NavLink>

        <button
          onClick={logout}
          title={isCollapsed ? 'Log Out' : undefined}
          className={`
            w-full flex items-center gap-3 rounded-xl font-medium text-surface-500 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-200 cursor-pointer
            ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
          `}
        >
          <LogOut className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
          {!isCollapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>

        {/* User Card */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-3 mt-2 border-t border-surface-800/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/25 flex items-center justify-center font-bold text-accent text-sm shrink-0">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-surface-200 truncate">{user.displayName || 'CardWise User'}</h4>
              <p className="text-[10px] text-surface-500 truncate">{user.email}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
