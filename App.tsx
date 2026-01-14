
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropIntelligence from './components/CropIntelligence';
import SustainabilityReport from './components/SustainabilityReport';
import IoTNetwork from './components/IoTNetwork';
import YieldAnalytics from './components/YieldAnalytics';
import SystemIntegrity from './components/SystemIntegrity';
import Settings from './components/Settings';
import Auth from './components/Auth';
import UserManual from './components/UserManual';
import VisionManifesto from './components/VisionManifesto';
import SecurityClearanceModal from './components/SecurityClearanceModal';
import RegistryComplianceModal from './components/RegistryComplianceModal';
import LiveScout from './components/LiveScout';
import { Bell, Search, Globe, ShieldCheck, BookOpen, Download, Sparkles, Zap, ArrowUpRight, Timer } from 'lucide-react';
import { analyzeSystemSecurity, getClimateVerification } from './services/geminiService';
import { PlanTier, SensorData } from './types';

const INITIAL_SENSORS: SensorData[] = [
  { id: 'SN-A101', type: 'soil', value: 42.4, unit: '%', timestamp: 'Live', location: [-1.2863, 36.8172], battery: 88, signal: 95, status: 'online', verified: true },
  { id: 'SN-A102', type: 'soil', value: 38.1, unit: '%', timestamp: 'Live', location: [-1.2855, 36.8210], battery: 12, signal: 82, status: 'low-power', verified: true },
  { id: 'SN-W201', type: 'water', value: 8.4, unit: 'L/m', timestamp: 'Live', location: [-1.2900, 36.8150], battery: 95, signal: 98, status: 'online', verified: true },
  { id: 'SN-PH401', type: 'soil pH', value: 6.8, unit: 'pH', timestamp: 'Live', location: [-1.2880, 36.8200], battery: 92, signal: 91, status: 'online', verified: true },
  { id: 'SN-C301', type: 'crop', value: 94.2, unit: '%', timestamp: 'Live', location: [-1.2820, 36.8190], battery: 76, signal: 45, status: 'online', verified: true },
  { id: 'SN-A103', type: 'soil', value: 45.9, unit: '%', timestamp: 'Live', location: [-1.2875, 36.8185], battery: 81, signal: 89, status: 'online', verified: true },
  { id: 'SN-W202', type: 'water', value: 12.1, unit: 'L/m', timestamp: 'Live', location: [-1.2915, 36.8160], battery: 74, signal: 92, status: 'online', verified: true },
  { id: 'SN-PH402', type: 'soil pH', value: 6.2, unit: 'pH', timestamp: 'Live', location: [-1.2890, 36.8215], battery: 89, signal: 85, status: 'online', verified: true },
  { id: 'SN-C302', type: 'crop', value: 88.5, unit: '%', timestamp: 'Live', location: [-1.2835, 36.8195], battery: 62, signal: 78, status: 'online', verified: true },
  { id: 'SN-N501', type: 'nutrient', value: 240, unit: 'ppm', timestamp: 'Live', location: [-1.2850, 36.8220], battery: 97, signal: 99, status: 'online', verified: true },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState<PlanTier>('Boutique Estate');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [batteryThreshold, setBatteryThreshold] = useState(25);
  const [sensors, setSensors] = useState<SensorData[]>(INITIAL_SENSORS);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [climateOutlook, setClimateOutlook] = useState<string>('');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(12);
  
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [globalThreat, setGlobalThreat] = useState<any>(null);
  const [isSentinelScanning, setIsSentinelScanning] = useState(false);
  const [isClimateLoading, setIsClimateLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      setNetworkLatency(Math.floor(Math.random() * 20) + 8);
      setSensors(prevSensors => prevSensors.map(sensor => {
        if (sensor.status === 'offline') return sensor;
        
        const variance = sensor.type === 'soil pH' ? 0.05 : sensor.type === 'water' ? 0.2 : 0.5;
        const change = (Math.random() - 0.5) * variance;
        const newValue = parseFloat((sensor.value + change).toFixed(sensor.type === 'soil pH' ? 2 : 1));
        
        const latDrift = (Math.random() - 0.5) * 0.0001;
        const lngDrift = (Math.random() - 0.5) * 0.0001;
        const newLocation: [number, number] = [
          sensor.location[0] + latDrift,
          sensor.location[1] + lngDrift
        ];
        
        let finalValue = newValue;
        if (sensor.type === 'soil') finalValue = Math.max(20, Math.min(80, newValue));
        if (sensor.type === 'water') finalValue = Math.max(1, Math.min(30, newValue));
        if (sensor.type === 'soil pH') finalValue = Math.max(4, Math.min(9, newValue));
        if (sensor.type === 'crop') finalValue = Math.max(60, Math.min(100, newValue));
        if (sensor.type === 'nutrient') finalValue = Math.max(100, Math.min(500, newValue));

        return { ...sensor, value: finalValue, location: newLocation };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const refreshClimate = useCallback(async (forcedLoc?: {lat: number, lng: number}) => {
    const loc = forcedLoc || userLocation;
    if (!loc) return;
    setIsClimateLoading(true);
    try {
      const outlook = await getClimateVerification(loc.lat, loc.lng);
      setClimateOutlook(outlook);
    } catch (err) {
      console.error("Climate sync failed", err);
    } finally {
      setIsClimateLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (isAuthenticated && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          refreshClimate(loc);
        },
        (err) => {
          console.warn("Location access denied. Using fallback coordinates.");
          const fallback = { lat: -1.2863, lng: 36.8172 };
          setUserLocation(fallback);
          refreshClimate(fallback);
        }
      );
    }
  }, [isAuthenticated, refreshClimate]);

  const runSentinelScan = useCallback(async () => {
    if (!isAuthenticated || (userPlan !== 'Sovereign Protocol' && userPlan !== 'Master')) return;
    setIsSentinelScanning(true);
    try {
      const result = await analyzeSystemSecurity([]);
      setGlobalThreat(result);
    } catch (err) {
      console.error("Sentinel Fail", err);
    } finally {
      setIsSentinelScanning(false);
    }
  }, [isAuthenticated, userPlan]);

  useEffect(() => {
    if (isAuthenticated) {
      runSentinelScan();
      const interval = setInterval(runSentinelScan, 180000);
      return () => clearInterval(interval);
    }
  }, [runSentinelScan, isAuthenticated]);

  const handleLogin = (tier: PlanTier) => {
    setUserPlan(tier);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          sensors={sensors} 
          batteryThreshold={batteryThreshold} 
          securityAlerts={securityAlerts} 
          climateOutlook={climateOutlook} 
          userPlan={userPlan} 
          onRefreshClimate={() => refreshClimate()}
          isClimateLoading={isClimateLoading}
        />;
      case 'scout':
        return <LiveScout userPlan={userPlan} />;
      case 'crops':
        return <CropIntelligence userPlan={userPlan} />;
      case 'sensors':
        return <IoTNetwork sensors={sensors} batteryThreshold={batteryThreshold} setBatteryThreshold={setBatteryThreshold} userPlan={userPlan} />;
      case 'analytics':
        return <YieldAnalytics userPlan={userPlan} />;
      case 'sustainability':
        return <SustainabilityReport userPlan={userPlan} />;
      case 'security':
        return <SystemIntegrity externalThreatData={globalThreat} isExternalScanning={isSentinelScanning} triggerSentinelScan={runSentinelScan} userPlan={userPlan} />;
      case 'settings':
        return <Settings userPlan={userPlan} />;
      default:
        return <Dashboard sensors={sensors} batteryThreshold={batteryThreshold} userPlan={userPlan} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userPlan={userPlan} />
      <main className="flex-1 ml-64 p-8 flex flex-col">
        <header className="flex items-center justify-between mb-12 glass-card px-8 py-4 rounded-2xl border-white/5">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Truth Sentinel Active</span>
            </div>
            <div className="relative w-full max-sm ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Query Verified Neural Network..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 mr-4 border-r border-white/5 pr-6">
               <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mesh Latency</p>
                     <p className="text-xs font-bold text-emerald-400 tabular-nums">{networkLatency}ms</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                     <Timer size={16} className="animate-pulse" />
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">Dr. Elena Vance</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">{userPlan}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 overflow-hidden">
                <img src="https://picsum.photos/id/64/40/40" alt="User Profile" />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto flex-1 w-full">
          {renderContent()}
        </div>

        <footer className="mt-20 py-12 border-t border-white/5 flex flex-col gap-10 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 max-w-xl">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em]">Engineered by Ian Tshakalisa</span>
               </div>
               <p className="text-xl md:text-2xl font-prestige font-bold text-white leading-tight">
                  "Architecting Global Biological Wealth. Eradicating Agricultural Entropy."
               </p>
               <button 
                onClick={() => setIsVisionOpen(true)}
                className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform group"
               >
                  Unveil Ian's Strategic Manifesto <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</p>
                  <div className="flex items-center gap-2">
                     <Zap size={14} className="text-emerald-500" />
                     <span className="text-xs font-bold text-white">14.28 Exa-Flops</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sovereignty</p>
                  <div className="flex items-center gap-2">
                     <Globe size={14} className="text-blue-400" />
                     <span className="text-xs font-bold text-white">Tier-1 Apex</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
            <div className="flex items-center gap-4">
              <span className="text-slate-700 text-[10px] font-bold uppercase tracking-[0.3em]">AgriLux Hub v4.8</span>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <button 
                onClick={() => setIsManualOpen(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group"
              >
                <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Guide by Ian Tshakalisa (PDF)</span>
              </button>
            </div>

            <div className="flex items-center gap-8">
              <button 
                onClick={() => setIsSecurityModalOpen(true)}
                className="text-slate-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
              >
                Security Clearance
              </button>
              <button 
                onClick={() => setIsRegistryModalOpen(true)}
                className="text-slate-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
              >
                Registry Compliance
              </button>
              <span className="text-slate-800 text-[10px] font-bold uppercase tracking-widest">© 2025 Ian Tshakalisa | Sovereign Command</span>
            </div>
          </div>
        </footer>
      </main>

      <UserManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} userPlan={userPlan} />
      <VisionManifesto isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <SecurityClearanceModal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} userPlan={userPlan} />
      <RegistryComplianceModal isOpen={isRegistryModalOpen} onClose={() => setIsRegistryModalOpen(false)} userPlan={userPlan} />
    </div>
  );
};

export default App;
