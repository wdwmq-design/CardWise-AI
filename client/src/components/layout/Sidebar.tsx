import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { motion } from 'motion/react';
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
  Zap,
  ShieldCheck
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
        hidden md:flex flex-col border-r border-[#1e293b]/40 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) h-screen sticky top-0 z-20
        ${isCollapsed ? 'w-[78px]' : 'w-[250px]'}
      `}
      style={{
        background: 'rgba(6, 14, 30, 0.45)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
      }}
    >
      {/* Top accent glowing line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-[0_1px_10px_rgba(16,185,129,0.3)]" />

      {/* Header / Logo */}
      <div className={`flex items-center border-b border-surface-800/30 transition-all duration-300 ${isCollapsed ? 'justify-center p-4' : 'justify-between px-6 py-5'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-emerald-400 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-accent/35 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <Zap className="w-4 h-4 text-accent fill-accent animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-white uppercase">CardWise</span>
                <span className="text-[8px] bg-accent/15 border border-accent/30 text-accent font-bold px-1 py-0.25 rounded-md uppercase tracking-wider">AI</span>
              </div>
              <span className="text-[9px] text-surface-500 font-medium">Enterprise Hub</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-emerald-400 blur-md opacity-60" />
            <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-accent/35">
              <Zap className="w-5 h-5 text-accent fill-accent" />
            </div>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800/40 rounded-lg border border-transparent hover:border-surface-700/30 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mt-4 w-9 h-7 flex items-center justify-center text-surface-500 hover:text-white hover:bg-surface-800/40 rounded-lg border border-surface-800/30 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="text-[9px] font-bold text-surface-500 uppercase tracking-widest px-3 pb-3">
            Core Operations
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
                flex items-center gap-3.5 rounded-xl font-semibold transition-all duration-300 group relative
                ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-3'}
                ${isActive
                  ? 'bg-gradient-to-r from-accent/12 to-accent/2 text-accent border border-accent/15 shadow-[0_0_15px_rgba(16,185,129,0.06)]'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800/30 border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-accent to-emerald-400 rounded-r-full" />
                  )}
                  <Icon className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}`} />
                  {!isCollapsed && (
                    <span className="text-xs tracking-wide">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={`border-t border-surface-850/60 ${isCollapsed ? 'px-2 py-4 space-y-1' : 'px-4 py-5 space-y-1.5'}`}>
        <NavLink
          to="/settings"
          title={isCollapsed ? 'Settings' : undefined}
          className={({ isActive }) => `
            flex items-center gap-3.5 rounded-xl font-semibold transition-all duration-300 relative
            ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-3'}
            ${isActive
              ? 'bg-gradient-to-r from-accent/12 to-accent/2 text-accent border border-accent/15 shadow-[0_0_15px_rgba(16,185,129,0.06)]'
              : 'text-surface-400 hover:text-white hover:bg-surface-800/30 border border-transparent'
            }
          `}
        >
          {({ isActive }) => (
            <>
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-accent to-emerald-400 rounded-r-full" />
              )}
              <Settings className={`shrink-0 transition-transform duration-300 hover:rotate-45 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
              {!isCollapsed && <span className="text-xs tracking-wide">Settings</span>}
            </>
          )}
        </NavLink>

        <button
          onClick={logout}
          title={isCollapsed ? 'Log Out' : undefined}
          className={`
            w-full flex items-center gap-3.5 rounded-xl font-semibold text-surface-400 hover:text-rose-400 hover:bg-rose-500/8 border border-transparent hover:border-rose-500/10 transition-all duration-300 cursor-pointer
            ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3.5 py-3'}
          `}
        >
          <LogOut className={`shrink-0 transition-transform duration-300 hover:translate-x-0.5 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
          {!isCollapsed && <span className="text-xs tracking-wide">Log Out</span>}
        </button>

        {/* User Card */}
        {!isCollapsed && user && (
          <div className="flex flex-col gap-2 p-3 mt-3 rounded-2xl bg-surface-900/30 border border-surface-850/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent to-indigo-500 blur-sm opacity-50" />
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-accent/35 to-accent/10 border border-accent/35 flex items-center justify-center font-black text-accent text-xs">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{user.displayName || 'CardWise User'}</h4>
                <p className="text-[10px] text-surface-500 truncate font-mono">{user.email}</p>
              </div>
            </div>
            
            {/* Savings Tier Badge */}
            <div className="flex items-center justify-between gap-1 pt-2 mt-1.5 border-t border-surface-850/40">
              <span className="text-[9px] text-surface-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-accent" />
                Saver Tier
              </span>
              <span className="text-[9px] bg-accent/10 text-accent font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                PRO
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

