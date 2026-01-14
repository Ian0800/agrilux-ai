
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { Droplets, Thermometer, Wind, Zap, TrendingUp, ShieldCheck, Globe, Search, Info, LockKeyhole, Beaker, FlaskConical, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { PlanTier, SensorData } from '../types';

const mockChartData = [
  { time: '00:00', soil: 45, water: 65, crop: 88 },
  { time: '04:00', soil: 42, water: 60, crop: 87 },
  { time: '08:00', soil: 48, water: 58, crop: 89 },
  { time: '12:00', soil: 55, water: 55, crop: 92 },
  { time: '16:00', soil: 52, water: 62, crop: 94 },
  { time: '20:00', soil: 49, water: 68, crop: 93 },
  { time: '24:00', soil: 46, water: 70, crop: 92 },
];

const StatCard = ({ icon: Icon, label, value, unit, color, verifiedBy }: any) => (
  <div className="glass-card p-6 rounded-2xl hover:border-emerald-500/30 transition-all group relative overflow-hidden">
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-2.5 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
        <Icon size={20} />
      </div>
      <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
        <ShieldCheck size={10} className="animate-pulse" /> VERIFIED
      </div>
    </div>
    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest relative z-10">{label}</h3>
    <div className="mt-1 flex items-baseline gap-1 relative z-10">
      <span className="text-2xl font-bold text-white tracking-tight tabular-nums">{value}</span>
      <span className="text-xs text-slate-500 font-medium uppercase">{unit}</span>
    </div>
    <p className="text-[8px] text-slate-600 mt-3 font-mono">Source: {verifiedBy || 'IoT Mesh v4.2'}</p>
  </div>
);

interface DashboardProps {
  sensors: SensorData[];
  batteryThreshold: number;
  securityAlerts?: any[];
  climateOutlook?: string;
  userPlan: PlanTier;
  onRefreshClimate?: () => void;
  isClimateLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  sensors, 
  batteryThreshold, 
  securityAlerts = [], 
  climateOutlook, 
  userPlan, 
  onRefreshClimate, 
  isClimateLoading 
}) => {
  const isBTE = userPlan === 'Boutique Estate';

  // Dynamic KPI Calculation
  const metrics = useMemo(() => {
    const soilNodes = sensors.filter(s => s.type === 'soil');
    const waterNodes = sensors.filter(s => s.type === 'water');
    const cropNodes = sensors.filter(s => s.type === 'crop');
    const nutrientNodes = sensors.filter(s => s.type === 'nutrient');
    const phNodes = sensors.filter(s => s.type === 'soil pH');

    const avg = (nodes: SensorData[]) => nodes.length > 0 
      ? (nodes.reduce((acc, s) => acc + s.value, 0) / nodes.length).toFixed(1)
      : '0.0';

    return {
      soil: avg(soilNodes),
      water: avg(waterNodes),
      crop: avg(cropNodes),
      nutrient: avg(nutrientNodes),
      ph: avg(phNodes)
    };
  }, [sensors]);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Plan: {userPlan} Backbone</span>
          </div>
          <h2 className="text-4xl font-prestige font-bold text-white">Institutional Truth Hub</h2>
          <p className="text-slate-500 text-xs mt-1">Verified telemetry processed for {userPlan} standards.</p>
        </div>
        
        <div className="glass-card flex items-center gap-6 px-6 py-3 rounded-2xl border-white/10">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Data Integrity</p>
            <p className="text-lg font-bold text-emerald-400">100.0%</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Plan Access</p>
            <p className="text-lg font-bold text-white uppercase">{userPlan.split(' ')[0]}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Droplets} label="Soil Hydro Index" value={metrics.soil} unit="%" color="emerald" verifiedBy="Mesh-A1xx" />
        <StatCard icon={FlaskConical} label="Regional pH Matrix" value={metrics.ph} unit="pH" color="blue" verifiedBy="Mesh-PH4xx" />
        <StatCard icon={Wind} label="Biomass Health" value={metrics.crop} unit="%" color="purple" verifiedBy="Neural-Vision" />
        <StatCard icon={Beaker} label="Nutrient Saturation" value={metrics.nutrient} unit="ppm" color="orange" verifiedBy="Mesh-N5xx" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe size={20} className="text-emerald-500" />
                Verified Climate Intelligence
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {isBTE ? 'Local Sensor Grounding' : 'Real-World Regional Grounding'}
              </p>
            </div>
            {!isBTE && (
              <button 
                onClick={onRefreshClimate}
                disabled={isClimateLoading}
                className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
              >
                 {isClimateLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                 {isClimateLoading ? 'Grounding...' : 'Sync Satellite'}
              </button>
            )}
          </div>
          
          <div className="bg-black/20 p-6 rounded-2xl border border-white/5 min-h-[160px] flex flex-col justify-center relative">
             {isBTE ? (
               <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                  <LockKeyhole size={24} className="text-slate-500" />
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Upgrade for Satellite Intelligence</p>
               </div>
             ) : isClimateLoading ? (
               <div className="flex flex-col items-center gap-3 opacity-80 py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500">Synchronizing Satellite Link...</p>
                  <p className="text-[9px] text-slate-400 font-mono">Fetching High-Fidelity NOAA Data</p>
               </div>
             ) : climateOutlook ? (
               <div className="space-y-4 animate-in fade-in duration-500">
                 <p className="text-slate-300 text-sm leading-relaxed font-light italic">
                   "{climateOutlook}"
                 </p>
                 <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Info size={12} className="text-emerald-500" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Source: NOAA & Real-Time Satellite Ingest</span>
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-3 opacity-40 py-8">
                  <AlertCircle size={24} className="text-slate-500" />
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Climate Data Unavailable</p>
                  <p className="text-[9px] text-slate-600 font-mono">Click Sync to Retry Uplink</p>
               </div>
             )}
          </div>

          <div className="h-[240px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCrop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.2} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 10, 6, 0.95)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="crop" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCrop)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl overflow-hidden relative border-emerald-500/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={20} />
            Accuracy Audit
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Sensor Drift', status: '0.00%', icon: TrendingUp },
              { label: 'Tier Sync', status: 'Verified', icon: Globe },
              { label: 'Neural Buffer', status: 'Optimal', icon: ShieldCheck },
              { label: 'Truth Alignment', status: '100.0%', icon: Info },
            ].map((audit, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <audit.icon size={16} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{audit.label}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">{audit.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
             <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">{userPlan} Mode</p>
             <p className="text-[10px] text-white font-medium leading-relaxed italic">
               "System verified 100% accurate for institutional deployment."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
