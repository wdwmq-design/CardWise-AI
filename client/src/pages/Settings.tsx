import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { Card, Button, Input } from '../components/ui';
import { User, Bell, Shield, HelpCircle, Save, Moon, Sun } from 'lucide-react';

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
    }, 800); // 800ms
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
          <Card className="p-4 space-y-2">
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider px-2">Account Settings</h4>
            <button className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg bg-accent/10 border border-transparent text-accent flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Profile
            </button>
            <button className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-surface-400 hover:text-surface-150 hover:bg-surface-850 flex items-center gap-2 cursor-pointer">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-surface-400 hover:text-surface-150 hover:bg-surface-850 flex items-center gap-2 cursor-pointer">
              <Shield className="w-4 h-4" /> Security & Keys
            </button>
          </Card>
        </div>

        {/* Right column: Settings panels (2/3 width) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-bold text-surface-150 flex items-center gap-2">
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
                <p className="text-xs font-bold text-success bg-success/10 border border-success/20 p-2.5 rounded-lg">
                  {successMsg}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isLoading} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Notifications Card */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-surface-150 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" /> Smart Notifications
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-surface-850/60">
                <div>
                  <h5 className="text-sm font-bold text-surface-200">Expiring Reward Points Alerts</h5>
                  <p className="text-xs text-surface-500 mt-0.5">Notify me 30 days before reward points expire.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.expiringPoints}
                  onChange={() => toggleNotification('expiringPoints')}
                  className="w-4 h-4 accent-accent rounded border-surface-800"
                />
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-surface-850/60">
                <div>
                  <h5 className="text-sm font-bold text-surface-200">Fee Waiver Target Milestones</h5>
                  <p className="text-xs text-surface-500 mt-0.5">Notify me when approaching card spending milestones.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.feeMilestones}
                  onChange={() => toggleNotification('feeMilestones')}
                  className="w-4 h-4 accent-accent rounded border-surface-800"
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h5 className="text-sm font-bold text-surface-200">Limited-Time Category Promos</h5>
                  <p className="text-xs text-surface-500 mt-0.5">Notify me of bank reward booster updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.limitedOffers}
                  onChange={() => toggleNotification('limitedOffers')}
                  className="w-4 h-4 accent-accent rounded border-surface-800"
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
