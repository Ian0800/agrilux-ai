
import React from 'react';
import { LayoutDashboard, Leaf, Sprout, BarChart3, Settings as SettingsIcon, ShieldCheck, Globe, Trophy, LogOut, LockKeyhole, Eye, Facebook, Instagram } from 'lucide-react';
import { PlanTier } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
  userPlan: PlanTier;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, userPlan }) => {
  const isBTE = userPlan === 'Boutique Estate';
  const isIAX = userPlan === 'Industrial Apex';

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Command Hub' },
    { id: 'scout', icon: Eye, label: 'Neural Scout', pulse: true },
    { id: 'crops', icon: Leaf, label: 'Field Vision' },
    { id: 'sensors', icon: Sprout, label: 'IoT Mesh-Net' },
    { 
      id: 'analytics', 
      icon: BarChart3, 
      label: 'Market Yields', 
      locked: isBTE 
    },
    { id: 'sustainability', icon: Globe, label: 'ESG Protocol' },
    { 
      id: 'security', 
      icon: ShieldCheck, 
      label: 'Cyber Fortress', 
      locked: isBTE || isIAX 
    },
  ];

  return (
    <div className="w-64 h-screen glass-card flex flex-col fixed left-0 top-0 border-r border-white/5 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-prestige font-bold text-white flex items-center gap-2">
          AgriLux <span className="text-emerald-500">AI</span>
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{userPlan} Mode</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.locked && setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
              item.locked ? 'opacity-40 cursor-not-allowed' :
              activeTab === item.id 
                ? 'bg-emerald-500 text-slate-900 font-bold shadow-lg gold-glow' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <item.icon size={18} className={activeTab === item.id ? 'text-slate-900' : 'group-hover:text-emerald-400 transition-colors'} />
                {item.pulse && !item.locked && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-xs uppercase tracking-wider">{item.label}</span>
            </div>
            {item.locked ? (
              <LockKeyhole size={12} className="text-slate-600" />
            ) : (
              activeTab === item.id && <div className="w-1 h-4 bg-slate-900/20 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Official Strategic Presence - Linked to User's Pages */}
      <div className="px-6 py-4 flex items-center justify-center gap-4 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
         <a 
           href="https://web.facebook.com/profile.php?id=61584428452010" 
           target="_blank" 
           rel="noopener noreferrer"
           className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 transition-all"
           title="AgriLux Facebook Presence"
         >
           <Facebook size={16} />
         </a>
         <a 
           href="https://www.instagram.com/prestige_auto_hub/" 
           target="_blank" 
           rel="noopener noreferrer"
           className="p-2 rounded-lg bg-white/5 hover:bg-pink-500/10 hover:text-pink-400 transition-all"
           title="AgriLux Instagram Presence"
         >
           <Instagram size={16} />
         </a>
      </div>

      <div className="p-6 mt-auto space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-amber-500" size={16} />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sector Influence</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isBTE ? 'Managing private estate biometrics.' : 'Contributing to global food security backbone.'}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border border-transparent ${
              activeTab === 'settings' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold' 
                : 'text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/5'
            }`}
          >
            <SettingsIcon size={18} />
            <span className="text-xs uppercase tracking-wider">Parameters</span>
          </button>
          
          {onLogout && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={18} />
              <span className="text-xs uppercase tracking-wider font-bold">Logout Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
