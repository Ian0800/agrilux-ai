
import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Target, DollarSign, Scale, Zap, Info, 
  ArrowUpRight, Calculator, ChevronRight, BarChart3, PieChart, LockKeyhole, Rocket
} from 'lucide-react';
import { PlanTier } from '../types';

const PREDICTIVE_DATA = [
  { month: 'Jan', historical: 4000, projected: 4100, upper: 4200, lower: 3900 },
  { month: 'Feb', historical: 3000, projected: 3200, upper: 3400, lower: 3000 },
  { month: 'Mar', historical: 2000, projected: 2600, upper: 2800, lower: 2400 },
  { month: 'Apr', historical: 2780, projected: 3908, upper: 4200, lower: 3600 },
  { month: 'May', historical: 1890, projected: 4800, upper: 5200, lower: 4400 },
  { month: 'Jun', historical: 2390, projected: 3800, upper: 4100, lower: 3500 },
  { month: 'Jul', historical: 3490, projected: 4300, upper: 4600, lower: 4000 },
];

const FACTOR_DATA = [
  { subject: 'Soil Health', A: 120, B: 110, fullMark: 150 },
  { subject: 'Water ROI', A: 98, B: 130, fullMark: 150 },
  { subject: 'Pest Resilience', A: 86, B: 130, fullMark: 150 },
  { subject: 'Nutrient Bio', A: 99, B: 100, fullMark: 150 },
  { subject: 'Growth Index', A: 85, B: 90, fullMark: 150 },
];

const QUADRANT_DATA = [
  { name: 'Sector A', yield: 450, efficiency: 88, quality: 92 },
  { name: 'Sector B', yield: 380, efficiency: 94, quality: 85 },
  { name: 'Sector C', yield: 520, efficiency: 82, quality: 78 },
  { name: 'Sector D', yield: 410, efficiency: 91, quality: 95 },
];

interface YieldAnalyticsProps {
  userPlan: PlanTier;
}

const YieldAnalytics: React.FC<YieldAnalyticsProps> = ({ userPlan }) => {
  const [irrigationBoost, setIrrigationBoost] = useState(15);
  const [nutrientPrecision, setNutrientPrecision] = useState(85);

  const isBTE = userPlan === 'Boutique Estate';

  const estimatedROI = useMemo(() => {
    const baseYield = 4200;
    const pricePerTon = 320;
    const efficiencyFactor = (irrigationBoost * 0.4) + (nutrientPrecision * 0.6);
    return Math.round(baseYield * (1 + efficiencyFactor / 100) * pricePerTon);
  }, [irrigationBoost, nutrientPrecision]);

  if (isBTE) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 text-center animate-in fade-in duration-1000">
         <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Rocket size={40} className="text-emerald-500" />
            <div className="absolute top-2 right-2">
               <LockKeyhole size={14} className="text-emerald-500/50" />
            </div>
         </div>
         <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-prestige font-bold text-white uppercase tracking-tighter">Apex Analytics Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Predictive yield intelligence, market ROI simulators, and quadrant performance matrices are exclusive to our <span className="text-emerald-400 font-bold">Industrial Apex</span> partners.</p>
            <div className="pt-6">
               <button className="bg-emerald-500 text-slate-900 px-8 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest gold-glow hover:bg-emerald-400 transition-all">
                  Request Tier Escalation
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-prestige font-bold text-white flex items-center gap-3">
            Predictive Yield Intelligence
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Alpha Forecast</span>
          </h2>
          <p className="text-slate-400 mt-1">Deep-learning projections based on 5-year longitudinal soil data.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Info size={18} />
           </button>
           <button className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-900 text-xs font-bold uppercase tracking-widest gold-glow hover:scale-105 transition-all">
              Re-calibrate Model
           </button>
        </div>
      </header>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Forecasted Harvest', value: '4.8k', unit: 'Tons', trend: '+12.4%', icon: Target },
          { label: 'Market Valuation', value: '$1.54M', unit: 'USD', trend: '+8.2%', icon: DollarSign },
          { label: 'Efficiency Index', value: '94.2', unit: '/100', trend: '+3.1%', icon: Scale },
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <kpi.icon size={64} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{kpi.value}</span>
              <span className="text-sm text-slate-500 font-medium">{kpi.unit}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp size={10} /> {kpi.trend}
              </div>
              <span className="text-[10px] text-slate-600 font-medium italic">Vs. Seasonal Avg</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Projection Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Yield Flux & Projections</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time harvest confidence intervals</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-[10px] text-slate-400 uppercase font-bold">Projected</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"/> <span className="text-[10px] text-slate-400 uppercase font-bold">Historical</span></div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PREDICTIVE_DATA}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1712', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="historical" stroke="#475569" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#colorRange)" />
                <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={3} fill="url(#colorProjected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Radar Chart */}
        <div className="glass-card p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Growth Matrix</h3>
          <p className="text-xs text-slate-500 mb-6">Comparative Pillar Analysis</p>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={FACTOR_DATA}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Radar name="Current" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-500">Pest Resilience</span>
                <span className="text-yellow-500">Cautionary (86%)</span>
             </div>
             <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[86%]" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Economic ROI Simulator */}
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.02]">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Calculator size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">Agri-Economic Simulator</h3>
                <p className="text-xs text-slate-500">Projected Market ROI based on resource allocation</p>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-300">Precision Irrigation Boost</label>
                    <span className="text-emerald-400 font-mono text-xs font-bold">+{irrigationBoost}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" max="50" 
                    value={irrigationBoost}
                    onChange={(e) => setIrrigationBoost(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-emerald-900/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                 />
                 <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-300">Nutrient Delivery Matrix</label>
                    <span className="text-emerald-400 font-mono text-xs font-bold">{nutrientPrecision}% Accuracy</span>
                 </div>
                 <input 
                    type="range" 
                    min="50" max="100" 
                    value={nutrientPrecision}
                    onChange={(e) => setNutrientPrecision(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-emerald-900/30 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                 />
                 <div className="flex justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    <span>Manual</span>
                    <span>AI-Optimized</span>
                 </div>
              </div>

              <div className="pt-8 border-t border-emerald-500/10 flex flex-col items-center">
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Projected Seasonal Revenue</p>
                 <div className="text-5xl font-prestige font-bold text-white flex items-baseline gap-2">
                    <span className="text-2xl text-emerald-500">$</span>
                    {estimatedROI.toLocaleString()}
                 </div>
                 <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full animate-pulse border border-emerald-500/20">
                    <Zap size={14} /> Neural Network Confidence: 92.4%
                 </div>
              </div>
           </div>
        </div>

        {/* Quadrant Performance */}
        <div className="glass-card p-8 rounded-3xl border border-white/5">
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="text-emerald-500" size={20} />
              Sector Performance Quadrant
           </h3>
           <div className="space-y-6">
              {QUADRANT_DATA.map((sector, i) => (
                <div key={i} className="group cursor-pointer">
                   <div className="flex justify-between items-end mb-2">
                      <div>
                         <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{sector.name}</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{sector.yield} Tons Harvested</p>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-mono font-bold text-emerald-400">{sector.efficiency}% Efficiency</span>
                      </div>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000" 
                        style={{ width: `${sector.efficiency}%` }}
                      />
                      <div 
                        className="bg-white/10 h-full transition-all duration-1000" 
                        style={{ width: `${100 - sector.efficiency}%` }}
                      />
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-12 p-5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <ArrowUpRight size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">Strategic Lead: Sector D</p>
                    <p className="text-xs text-slate-500">Highest quality-to-yield ratio this quarter.</p>
                 </div>
                 <button className="ml-auto p-2 rounded-lg hover:bg-white/5 transition-all">
                    <ChevronRight size={18} className="text-slate-500" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default YieldAnalytics;
