import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-surface-950 text-surface-100">
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopBar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-surface-950">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav - Mobile Only */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;
