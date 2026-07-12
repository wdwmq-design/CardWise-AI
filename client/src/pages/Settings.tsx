import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { Card, Button, Input } from '../components/ui';
import { User, Bell, Shield, HelpCircle, Save, Moon, Sun, CheckCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { walletCards } = useWallet();

  const [displayName, setDisplayName] = useState(user?.displayName || 'CardWise User');
  const [email, setEmail] = useState(user?.email || 'user@cardwise.ai');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [notifications, setNotifications] = useState({
    expiringPoints: true,
    feeMilestones: true,
    limitedOffers: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSuccessMsg('Profile updated successfully!');
      setIsLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Menu options */}
        <div className="space-y-4">
          <Card className="p-4 space-y-2 glass-card">
            <h4 className="text-[10px] font-bold text-surface-500 uppercase tracking-widest px-2.5 py-1">Account Settings</h4>
            <button className="w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl bg-accent/10 border border-transparent text-accent flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Profile
            </button>
            <button className="w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl text-surface-500 hover:text-surface-200 hover:bg-surface-850 flex items-center gap-2 cursor-pointer transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full text-left text-xs font-bold py-2.5 px-3.5 rounded-xl text-surface-500 hover:text-surface-200 hover:bg-surface-850 flex items-center gap-2 cursor-pointer transition-colors">
              <Shield className="w-4 h-4" /> Security & Keys
            </button>
          </Card>
        </div>

        {/* Right column: Settings panels (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <Card className="p-6 space-y-6 glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <h3 className="text-sm font-bold text-surface-150 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" /> Profile Information
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                disabled
              />

              {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl animate-fade-in">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading} icon={<Save className="w-4 h-4" />} className="font-bold text-xs">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Notifications Card */}
          <Card className="p-6 space-y-4 glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <h3 className="text-sm font-bold text-surface-150 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" /> Smart Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-surface-850/60">
                <div className="max-w-[85%]">
                  <h5 className="text-xs font-bold text-surface-200">Expiring Reward Points Alerts</h5>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5 leading-relaxed">Notify me 30 days before reward points expire.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.expiringPoints}
                  onChange={() => toggleNotification('expiringPoints')}
                  className="w-4 h-4 accent-accent rounded border-surface-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-surface-850/60">
                <div className="max-w-[85%]">
                  <h5 className="text-xs font-bold text-surface-200">Fee Waiver Target Milestones</h5>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5 leading-relaxed">Notify me when approaching card spending milestones.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.feeMilestones}
                  onChange={() => toggleNotification('feeMilestones')}
                  className="w-4 h-4 accent-accent rounded border-surface-800 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="max-w-[85%]">
                  <h5 className="text-xs font-bold text-surface-200">Limited-Time Category Promos</h5>
                  <p className="text-[11px] text-surface-500 font-medium mt-0.5 leading-relaxed">Notify me of bank reward booster updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.limitedOffers}
                  onChange={() => toggleNotification('limitedOffers')}
                  className="w-4 h-4 accent-accent rounded border-surface-800 cursor-pointer"
                />
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default Settings;
