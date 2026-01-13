
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ShieldCheck, Activity, ShieldAlert, RefreshCw, Network, Archive, Box, Map as MapIcon,
  Navigation, Crosshair, Loader2, CheckCircle2, Binary, LockKeyhole, Search, Filter, Fingerprint, Zap,
  Landmark
} from 'lucide-react';
import { analyzeSystemSecurity } from '../services/geminiService';
import { PlanTier } from '../types';

interface AuditLog {
  id: string;
  event: string;
  actor: string;
  status: 'Authorized' | 'Denied' | 'Flagged';
  timestamp: string;
}

const LIVE_BACKHAUL_LOGS: AuditLog[] = [
  { id: 'TX-8821', event: 'Encryption Key Rotation', actor: 'System Auto-Task', status: 'Authorized', timestamp: '2m ago' },
  { id: 'TX-8820', event: 'Biometric Access Sector 4', actor: 'Dr. Elena Vance', status: 'Authorized', timestamp: '15m ago' },
  { id: 'TX-8819', event: 'Mesh-Net Firmware Update', actor: 'Command Hub Alpha', status: 'Authorized', timestamp: '1h ago' },
  { id: 'TX-8818', event: 'Unauthorized SSH Attempt', actor: 'IP: 192.168.1.204', status: 'Denied', timestamp: '3h ago' },
];

const INSTITUTIONAL_ARCHIVE_LOGS: AuditLog[] = [
  { id: 'AX-1022', event: 'System-Wide Entropy Audit', actor: 'UN Compliance Bot', status: 'Authorized', timestamp: '2d ago' },
  { id: 'AX-1021', event: 'Credential Escalation Attempt', actor: 'Guest-VPN-02', status: 'Flagged', timestamp: '3d ago' },
];

const CRITICAL_NODE_LOGS: AuditLog[] = [
  { id: 'NX-440', event: 'Hardware Tamper Triggered', actor: 'Sensor-A102', status: 'Flagged', timestamp: '10m ago' },
];

type DataSource = 'live' | 'archive' | 'nodes';

const GeographicIntelligence: React.FC<{ threatLevel: string }> = ({ threatLevel }) => {
  const dots = Array.from({ length: 480 }).map((_, i) => ({
    x: (i % 40) * 20 + 10,
    y: Math.floor(i / 40) * 20 + 10,
    active: Math.random() > 0.85,
  }));

  const activeHubs = [
    { x: 440, y: 220, label: 'Nairobi Hub (Primary)' },
    { x: 380, y: 140, label: 'London Relay' },
    { x: 140, y: 160, label: 'NY Exit Node' },
  ];

  return (
    <div className="relative h-[440px] w-full bg-[#050a06] rounded-3xl overflow-hidden border border-white/5 shadow-2xl group">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_100%)] pointer-events-none" />
      <svg className="w-full h-full opacity-20">
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.active ? 1.2 : 0.6} fill={dot.active ? '#10b981' : '#1e293b'} />
        ))}
      </svg>
      <svg className="absolute inset-0 w-full h-full">
        {activeHubs.map((hub, i) => (
          <line key={`l-${i}`} x1={activeHubs[0].x} y1={activeHubs[0].y} x2={hub.x} y2={hub.y} stroke="#10b981" strokeWidth="0.5" strokeDasharray="6 4" opacity="0.4" />
        ))}
      </svg>
      {activeHubs.map((hub, i) => (
        <div key={i} className="absolute" style={{ left: hub.x, top: hub.y }}>
          <div className="w-4 h-4 -ml-2 -mt-2 rounded-full bg-emerald-500/20 animate-ping" />
          <div className="w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
          <div className="absolute top-4 left-0 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
            <span className="text-[8px] font-bold text-emerald-400 bg-black/80 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">{hub.label}</span>
          </div>
        </div>
      ))}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
         <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10">
            <div className={`w-2 h-2 rounded-full ${threatLevel.toLowerCase() === 'critical' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Global Backbone</span>
         </div>
      </div>
    </div>
  );
};

interface SystemIntegrityProps {
  externalThreatData?: any;
  isExternalScanning?: boolean;
  triggerSentinelScan?: () => void;
  userPlan: PlanTier;
}

const SystemIntegrity: React.FC<SystemIntegrityProps> = ({ externalThreatData, isExternalScanning, triggerSentinelScan, userPlan }) => {
  const [selectedSource, setSelectedSource] = useState<DataSource>('live');
  const [isLocalScanning, setIsLocalScanning] = useState(false);
  const [localThreatData, setLocalThreatData] = useState<any>(null);

  const canAccessSecurity = userPlan === 'Sovereign Protocol' || userPlan === 'Master';
  const threatData = useMemo(() => (selectedSource === 'live' && !localThreatData ? externalThreatData : localThreatData), [selectedSource, localThreatData, externalThreatData]);
  const isAnyScanning = isLocalScanning || (selectedSource === 'live' && isExternalScanning);

  const runAISecurityScan = useCallback(async () => {
    if (!canAccessSecurity) return;
    setIsLocalScanning(true);
    try {
      const logs = selectedSource === 'archive' ? INSTITUTIONAL_ARCHIVE_LOGS : selectedSource === 'nodes' ? CRITICAL_NODE_LOGS : LIVE_BACKHAUL_LOGS;
      const result = await analyzeSystemSecurity(logs);
      setLocalThreatData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLocalScanning(false);
    }
  }, [selectedSource, canAccessSecurity]);

  const sourceConfig = [
    { id: 'live', label: 'Backhaul', icon: Network, desc: 'Real-time' },
    { id: 'archive', label: 'Archive', icon: Archive, desc: 'Institutional' },
    { id: 'nodes', label: 'Nodes', icon: Box, desc: 'Hardware' },
  ];

  if (!canAccessSecurity) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in duration-1000">
         <div className="w-24 h-24 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Landmark size={40} className="text-purple-500" />
            <div className="absolute top-2 right-2">
               <LockKeyhole size={14} className="text-purple-500/50" />
            </div>
         </div>
         <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-prestige font-bold text-white uppercase tracking-tighter">Sovereign Clearance Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed">The Cyber-Fortress global monitoring backbone and neural threat sweeps are restricted to verified <span className="text-purple-400 font-bold">Sovereign Protocol</span> institutional partners.</p>
            <div className="pt-6">
               <button className="bg-purple-500 text-white px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-purple-400 transition-all">
                  Request Sovereign Handshake
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div>
          <h2 className="text-4xl font-prestige font-bold text-white">Cyber-Fortress Protocol</h2>
          <p className="text-slate-500 mt-2 text-sm max-w-2xl">Advanced neural watchdog monitoring the AgriLux global mesh-net. Institutional-grade RSA-4096 backbone with zero-trust architecture.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => selectedSource === 'live' ? triggerSentinelScan?.() : runAISecurityScan()}
            disabled={isAnyScanning}
            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 hover:border-emerald-500/30 transition-all disabled:opacity-50"
          >
            {isAnyScanning ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="text-emerald-400" />}
            <span className="text-xs uppercase tracking-widest">Neural Sweep</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <GeographicIntelligence threatLevel={threatData?.threatLevel || 'Normal'} />
        </div>
        <div className="space-y-6">
           <div className="glass-card p-6 rounded-3xl border-white/5 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                 <ShieldCheck className="text-emerald-400" size={24} />
              </div>
              <p className="text-2xl font-bold text-white">99.8%</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Integrity Rating</p>
           </div>
           <div className="glass-card p-6 rounded-3xl border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Binary size={20} /></div>
                 <h3 className="text-xs font-bold text-white uppercase tracking-widest">Blockchain Ledger</h3>
              </div>
              <p className="text-[9px] text-slate-500 font-mono leading-relaxed truncate mb-2">0x9fA...42e8 (Syncing...)</p>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full w-2/3 animate-pulse" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
           {isAnyScanning && <div className="scan-line" />}
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 relative z-10">
              <div className="flex items-center gap-4">
                 <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400"><Activity size={24} /></div>
                 <div>
                    <h3 className="text-xl font-bold text-white">Intelligence Summary</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Neural Guard v4.2 HEURISTIC</p>
                 </div>
              </div>
              <div className={`px-5 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${
                threatData?.threatLevel?.toLowerCase() === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              }`}>
                 Status: {threatData?.threatLevel || 'SECURE'}
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4 mb-10">
              {sourceConfig.map((source) => (
                <button
                  key={source.id}
                  onClick={() => { setSelectedSource(source.id as DataSource); setLocalThreatData(null); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${
                    selectedSource === source.id ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  <source.icon size={24} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{source.label}</span>
                </button>
              ))}
           </div>

           <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 tracking-[0.2em]">AI Assessment</p>
              <p className="text-lg text-slate-200 leading-relaxed italic font-light tracking-wide">
                "{threatData?.summary || "Initiate neural sweep to synchronize global security states."}"
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><LockKeyhole size={140} /></div>
           <div className="space-y-6 relative z-10">
              <h3 className="text-2xl font-bold text-white">Neural Shield Active</h3>
              <p className="text-sm text-slate-500 leading-relaxed">The AgriLux autonomous sentinel is protecting 14,284 sensitive data points across the Nairobi Hub.</p>
              <div className="pt-6 flex flex-col gap-3">
                 {[
                   { l: 'Encryption Layer', s: 'Hardened' },
                   { l: 'Packet Scrubbing', s: 'Active' },
                   { l: 'Origin Sanitization', s: 'Enabled' }
                 ].map((mod, i) => (
                   <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-500">{mod.l}</span>
                      <span className="text-emerald-400">{mod.s}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrity;
