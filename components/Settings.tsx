
import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Zap, Globe, Cpu, Lock, Fingerprint, Award, Save,
  Plus, Key, Trash2, ShieldAlert, Terminal, AlertTriangle, Send, Mail, Phone, LockKeyhole,
  ChevronRight, Timer, History, Wifi, ShieldX, Radio, CheckCircle2, Building2, Landmark, Rocket,
  Info
} from 'lucide-react';
import { PlanTier } from '../types';

interface License {
  id: string;
  key: string;
  entity: string;
  tier: 'Boutique Estate' | 'Industrial Apex' | 'Sovereign Protocol';
  issuedAt: number;
  status: 'active' | 'revoked' | 'permanent';
  isClaimed: boolean;
}

interface SettingsProps {
  userPlan: PlanTier;
}

const Settings: React.FC<SettingsProps> = ({ userPlan }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'neural' | 'security' | 'strategic'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  const [strategicAuth, setStrategicAuth] = useState(false);
  const [showStrategicChallenge, setShowStrategicChallenge] = useState(false);
  const [strategicPassword, setStrategicPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [protocolStep, setProtocolStep] = useState(0);

  // Authorization Check
  const hasStrategicClearance = userPlan === 'Sovereign Protocol' || userPlan === 'Master';

  // Key Generation State
  const [selectedPlan, setSelectedPlan] = useState<'Boutique Estate' | 'Industrial Apex' | 'Sovereign Protocol'>('Industrial Apex');

  const MASTER_SIGNATURE = 'tshakalisa0800';
  const KEY_EXPIRY_MS = 5 * 60 * 1000;
  const PRUNE_BUFFER_MS = 60 * 1000;
  
  const OWNER_CONTACT = {
    whatsapp: '+26778064893',
    email: 'tshakalisa15@gmail.com'
  };

  const [licenses, setLicenses] = useState<License[]>([
    { id: '1', key: 'SVP-MASTER-HUB-25', entity: 'Master Admin', tier: 'Sovereign Protocol', issuedAt: Date.now(), status: 'permanent', isClaimed: true },
    { id: '2', key: 'IAX-8821-XP9', entity: 'Ministry of Ag (Kenya)', tier: 'Industrial Apex', issuedAt: Date.now() - 1000000, status: 'permanent', isClaimed: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      
      setLicenses(prev => {
        return prev
          .map(lic => {
            if (lic.status === 'active' && !lic.isClaimed && (now - lic.issuedAt > KEY_EXPIRY_MS)) {
              return { ...lic, status: 'revoked' as const };
            }
            return lic;
          })
          .filter(lic => {
            if (lic.status === 'revoked' && (now - lic.issuedAt > KEY_EXPIRY_MS + PRUNE_BUFFER_MS)) {
              return false;
            }
            return true;
          });
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerSecurityProtocol = () => {
    setIsBlocked(true);
    const steps = [
      "Identifying Breach Origin...",
      "Encrypting Location Coordinates...",
      `Uplink Established to ${OWNER_CONTACT.whatsapp}...`,
      `Dispatching Alert to ${OWNER_CONTACT.email}...`,
      "Sovereign Key Purge Initiated.",
      "SYSTEM HARD-LOCKED."
    ];
    
    steps.forEach((_, i) => {
      setTimeout(() => setProtocolStep(i + 1), (i + 1) * 1200);
    });
  };

  const handleStrategicAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (strategicPassword === MASTER_SIGNATURE) {
      setStrategicAuth(true);
      setShowStrategicChallenge(false);
      setActiveSection('strategic');
      setFailedAttempts(0);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setStrategicPassword('');
      if (newAttempts >= 2) {
        triggerSecurityProtocol();
      }
    }
  };

  const generateLicense = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let prefix = '';
    
    switch(selectedPlan) {
      case 'Boutique Estate': prefix = 'BTE-'; break;
      case 'Industrial Apex': prefix = 'IAX-'; break;
      case 'Sovereign Protocol': prefix = 'SVP-'; break;
    }

    let newKey = prefix;
    for(let i = 0; i < 4; i++) newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    newKey += '-';
    for(let i = 0; i < 3; i++) newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    
    const newLicense: License = {
      id: Date.now().toString(),
      key: newKey,
      entity: 'Institutional Pending',
      tier: selectedPlan,
      issuedAt: Date.now(),
      status: 'active',
      isClaimed: false
    };
    setLicenses([newLicense, ...licenses]);
  };

  const deleteLicense = (id: string) => {
    setLicenses(prev => prev.filter(l => l.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleTabChange = (id: string) => {
    if (id === 'strategic') {
      if (!hasStrategicClearance) return;
      if (!strategicAuth) {
        if (!isBlocked) setShowStrategicChallenge(true);
        else setActiveSection('strategic');
      } else {
        setActiveSection('strategic');
      }
    } else {
      setActiveSection(id as any);
      setShowStrategicChallenge(false);
    }
  };

  const formatTimeRemaining = (lic: License) => {
    if (lic.status === 'permanent') return 'INFINITY';
    if (lic.status === 'revoked') return 'STALE';
    
    const elapsed = currentTime - lic.issuedAt;
    const remaining = Math.max(0, KEY_EXPIRY_MS - elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const protocolMessages = [
    "Awaiting Security Event...",
    "Breach Origin Located: IP 104.28.14.92",
    "Uplink Established: Transmitting to +26778064893",
    "E-Mail Dispatched: tshakalisa15@gmail.com",
    "Purging Temporal Memory...",
    "EMERGENCY UNLINK COMPLETE"
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-prestige font-bold text-white">Strategic Parameters</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Plan: {userPlan} | Protocol: ACTIVE</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-500 text-slate-900 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg gold-glow disabled:opacity-50"
        >
          {isSaving ? <Zap className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'Syncing...' : 'Commit Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Identity', icon: User, desc: 'Institutional profile & branding' },
            { id: 'neural', label: 'Intelligence', icon: Cpu, desc: 'AI models & thinking budgets' },
            { id: 'security', label: 'Fortress', icon: Shield, desc: 'Access control & encryption' },
            { id: 'strategic', label: 'Licensing', icon: Award, desc: 'Key management & sales', classified: true, locked: !hasStrategicClearance },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleTabChange(s.id)}
              disabled={s.locked}
              className={`w-full flex flex-col p-5 rounded-2xl border transition-all text-left group relative ${
                s.locked ? 'opacity-30 cursor-not-allowed' :
                activeSection === s.id 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {s.classified && (
                <div className={`absolute top-4 right-4 ${activeSection === 'strategic' ? 'text-emerald-500' : 'text-slate-600'}`}>
                   {s.locked ? <LockKeyhole size={14} /> : <ShieldAlert size={14} />}
                </div>
              )}
              <div className="flex items-center gap-3 mb-1">
                <s.icon size={20} className={activeSection === s.id ? 'text-emerald-400' : 'group-hover:text-emerald-400'} />
                <span className="text-sm font-bold uppercase tracking-widest">{s.label}</span>
              </div>
              <p className="text-[10px] opacity-60 font-medium leading-tight">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass-card rounded-[2.5rem] border-white/5 p-10 min-h-[600px] relative overflow-hidden">
          {showStrategicChallenge ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 animate-pulse">
                  <ShieldAlert size={40} />
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-prestige font-bold text-white tracking-widest uppercase">Classified Access</h3>
                  <p className="text-xs text-red-500/70 font-bold uppercase tracking-[0.3em]">Level 5 Clearance Required</p>
               </div>

               <form onSubmit={handleStrategicAccess} className="w-full max-w-sm space-y-4">
                  <div className="relative">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={16} />
                    <input 
                      type="password"
                      autoFocus
                      placeholder="Enter Master Signature..."
                      value={strategicPassword}
                      onChange={(e) => setStrategicPassword(e.target.value)}
                      className={`w-full bg-black/40 border rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-sm outline-none transition-all ${failedAttempts > 0 ? 'border-red-500 animate-shake shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-red-500/50'}`}
                    />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Attempts Left: {2 - failedAttempts}</span>
                    <button type="submit" className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400">Verify Signature →</button>
                  </div>
               </form>
            </div>
          ) : isBlocked && activeSection === 'strategic' ? (
            <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000">
               <div className="absolute inset-0 bg-red-950/10 pointer-events-none" />
               <div className="scan-line bg-red-500" />
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-red-500/20 flex items-center justify-center relative">
                    <ShieldX className="text-red-500 animate-pulse" size={36} />
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-prestige font-bold text-white uppercase tracking-tighter">Emergency Lockdown</h3>
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.4em] mt-1">Breach Protocol Engaged</p>
                  </div>
               </div>

               <div className="w-full max-w-lg space-y-4">
                  <div className="p-8 rounded-[2rem] bg-black/40 border border-red-500/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                    <div className="space-y-6">
                       {protocolMessages.map((msg, idx) => (
                         <div key={idx} className={`flex items-center gap-4 transition-all duration-700 ${idx < protocolStep ? 'opacity-100' : 'opacity-10'}`}>
                            {idx < protocolStep ? <CheckCircle2 size={16} className="text-red-500" /> : <div className="w-4 h-4 rounded-full border border-red-500/20" />}
                            <span className={`text-xs font-mono font-bold ${idx === protocolStep - 1 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>{msg}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500 h-full">
              {activeSection === 'strategic' && strategicAuth ? (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-white/5 pb-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Neural Licensing Ledger</h3>
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-emerald-500" />
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Temporal cleanup cycle active</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                           {[
                             { id: 'Boutique Estate', icon: Building2 },
                             { id: 'Industrial Apex', icon: Rocket },
                             { id: 'Sovereign Protocol', icon: Landmark }
                           ].map((plan) => (
                             <button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                  selectedPlan === plan.id 
                                    ? 'bg-emerald-500 text-slate-900 shadow-lg' 
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                             >
                                <plan.icon size={12} />
                                {plan.id.split(' ')[0]}
                             </button>
                           ))}
                        </div>
                        <button 
                          onClick={generateLicense} 
                          className="bg-emerald-500 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-lg group"
                        >
                          <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Issue Key
                        </button>
                      </div>
                   </div>

                   <div className="overflow-hidden glass-card border-white/5 rounded-3xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-white/5 border-b border-white/10">
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plan / Status</th>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Institutional Key</th>
                              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Protocol Clock</th>
                              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registry</th>
                           </tr>
                        </thead>
                        <tbody>
                           {licenses.map((lic) => (
                             <tr key={lic.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors group ${lic.status === 'revoked' ? 'opacity-30' : ''}`}>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        lic.tier === 'Sovereign Protocol' ? 'bg-amber-500/10 text-amber-500' :
                                        lic.tier === 'Industrial Apex' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                      }`}>
                                        {lic.tier === 'Sovereign Protocol' ? <Landmark size={14} /> : 
                                         lic.tier === 'Industrial Apex' ? <Rocket size={14} /> : <Building2 size={14} />}
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-white">{lic.tier}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <div className={`w-1 h-1 rounded-full ${lic.status === 'revoked' ? 'bg-red-500' : lic.status === 'permanent' ? 'bg-blue-400' : 'bg-emerald-500'}`} />
                                          <p className={`text-[8px] font-bold uppercase tracking-tighter ${lic.status === 'revoked' ? 'text-red-500' : 'text-slate-500'}`}>
                                            {lic.status === 'revoked' ? 'STALE - PRUNING' : lic.status === 'permanent' ? 'MASTER CORE' : 'SECTOR ACTIVE'}
                                          </p>
                                        </div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <span className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border bg-black/40 border-white/10 ${
                                        lic.tier === 'Sovereign Protocol' ? 'text-amber-400 border-amber-500/20' : 'text-slate-400'
                                      }`}>
                                        {lic.key}
                                      </span>
                                      {lic.tier === 'Sovereign Protocol' && <Award size={12} className="text-amber-500 animate-pulse" />}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                   <div className={`text-[11px] font-mono font-bold ${lic.status === 'revoked' ? 'text-red-500' : lic.status === 'permanent' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                      {formatTimeRemaining(lic)}
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button onClick={() => deleteLicense(lic.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                   </button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                  <div className={`p-8 rounded-[2rem] bg-white/[0.02] border transition-all ${activeSection === 'profile' ? 'border-emerald-500/20' : 'border-white/5'}`}>
                    <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Identity Management</h3>
                    <p className="text-slate-500 text-sm max-w-sm">Institutional branding and regional sector identifiers are managed here. Changes require Master Commit signature.</p>
                  </div>
                  <div className="pt-8 opacity-20">
                     <Fingerprint size={48} className="text-slate-600 mx-auto" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
