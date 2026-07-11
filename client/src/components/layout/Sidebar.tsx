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
  LogOut
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
        hidden md:flex flex-col bg-surface-950 border-r border-surface-800/80 transition-all duration-300 h-screen sticky top-0 z-20
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-6 border-b border-surface-800/50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight gradient-text">CardWise</span>
            <span className="text-[10px] bg-accent/10 border border-accent/20 text-accent font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-accent-light flex items-center justify-center font-bold text-slate-950 text-sm">C</div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-surface-500 hover:text-surface-100 p-1 hover:bg-surface-800/50 rounded-lg transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-accent/10 border border-accent/20 text-accent' 
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-850 border border-transparent'
                }
              `}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings & User info at bottom */}
      <div className="p-4 border-t border-surface-800/50 space-y-1.5">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
            ${isActive 
              ? 'bg-accent/10 border border-accent/20 text-accent' 
              : 'text-surface-400 hover:text-surface-100 hover:bg-surface-850 border border-transparent'
            }
          `}
        >
          <Settings className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Log Out</span>}
        </button>

        {/* User Card */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-2 py-3 mt-4 border-t border-surface-800/40">
            <div className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center font-bold text-accent border border-surface-700/50">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-semibold text-surface-200 truncate">{user.displayName || 'CardWise User'}</h4>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
