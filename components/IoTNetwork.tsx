
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Sprout, Droplets, MapPin, Globe, Cpu, Radio, Battery, Signal, 
  Activity, History, X, Wrench, PlusCircle, LockKeyhole, Info,
  FlaskConical, Beaker, Navigation, Timer
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PlanTier, SensorData } from '../types';

interface MaintenanceLog {
  id: string;
  type: string;
  note: string;
  timestamp: string;
  user: string;
}

interface SensorNodeProps {
  sensor: SensorData;
  batteryThreshold: number;
  timeRange: string;
}

const generateHistory = (type: string, currentVal: number, range: string) => {
  const points = range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const data = [];
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (range === '24h' ? 3600000 : 86400000));
    const label = range === '24h' 
      ? time.getHours() + ':00' 
      : (time.getMonth() + 1) + '/' + time.getDate();
    
    const variance = type === 'water' ? 2 : type === 'soil' ? 5 : type === 'soil pH' ? 0.3 : type === 'nutrient' ? 10 : 1;
    const randomOffset = (Math.random() - 0.5) * variance * (i + 1) * 0.2;
    let val = currentVal + randomOffset;
    
    if (type === 'soil') val = Math.max(20, Math.min(80, val));
    if (type === 'water') val = Math.max(2, Math.min(25, val));
    if (type === 'crop') val = Math.max(70, Math.min(100, val));
    if (type === 'soil pH') val = Math.max(4, Math.min(9, val));
    if (type === 'nutrient') val = Math.max(100, Math.min(500, val));

    data.push({
      time: label,
      value: parseFloat(val.toFixed(1))
    });
  }
  return data;
};

const SensorNode: React.FC<SensorNodeProps> = ({ sensor, batteryThreshold, timeRange }) => {
  const [activePanel, setActivePanel] = useState<'none' | 'history' | 'maintenance' | 'location'>('none');
  const [heading, setHeading] = useState(45);
  const [latency, setLatency] = useState(Math.floor(Math.random() * 40) + 10);
  const prevLocation = useRef<[number, number]>(sensor.location);
  
  const [logs] = useState<MaintenanceLog[]>([
    { id: '1', type: 'Calibration', note: 'Standard seasonal recalibration completed.', timestamp: '12 days ago', user: 'Dr. Vance' },
  ]);

  useEffect(() => {
    if (sensor.status === 'online') {
      const interval = setInterval(() => {
        setLatency(Math.floor(Math.random() * 30) + 5);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sensor.status]);

  useEffect(() => {
    if (prevLocation.current[0] !== sensor.location[0] || prevLocation.current[1] !== sensor.location[1]) {
      const dy = sensor.location[0] - prevLocation.current[0];
      const dx = sensor.location[1] - prevLocation.current[1];
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      setHeading(90 - angle);
      prevLocation.current = sensor.location;
    }
  }, [sensor.location]);

  const historyData = useMemo(() => 
    generateHistory(sensor.type, sensor.value, timeRange), 
    [sensor.value, sensor.type, timeRange]
  );

  const getIcon = () => {
    switch (sensor.type) {
      case 'soil': return Sprout;
      case 'water': return Droplets;
      case 'crop': return Activity;
      case 'soil pH': return FlaskConical;
      case 'nutrient': return Beaker;
      default: return Sprout;
    }
  };
  const Icon = getIcon();

  const isLowBattery = sensor.battery < batteryThreshold;
  const isExpanded = activePanel !== 'none';

  const mapOffset = useMemo(() => ({
    x: ((sensor.location[1] % 0.01) * 10000) % 100,
    y: ((sensor.location[0] % 0.01) * 10000) % 100
  }), [sensor.location]);

  return (
    <div className={`glass-card p-6 rounded-2xl border transition-all duration-700 ${
      isExpanded ? 'col-span-1 md:col-span-2' : 'border-white/5'
    } ${isLowBattery ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'hover:border-emerald-500/20'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 rounded-xl border ${
          sensor.type === 'soil' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          sensor.type === 'water' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          sensor.type === 'soil pH' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
          sensor.type === 'nutrient' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }`}>
          <Icon size={20} />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActivePanel(activePanel === 'location' ? 'none' : 'location')}
            className={`p-2 rounded-lg transition-all border ${activePanel === 'location' ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            <MapPin size={14} />
          </button>
          <button 
            onClick={() => setActivePanel(activePanel === 'maintenance' ? 'none' : 'maintenance')}
            className={`p-2 rounded-lg transition-all border ${activePanel === 'maintenance' ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            <Wrench size={14} />
          </button>
          <button 
            onClick={() => setActivePanel(activePanel === 'history' ? 'none' : 'history')}
            className={`p-2 rounded-lg transition-all border ${activePanel === 'history' ? 'bg-emerald-500 text-slate-900 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            <History size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`flex-1 space-y-4 ${isExpanded ? 'max-w-[280px]' : ''}`}>
           <div className="flex justify-between items-start">
             <div>
               <h4 className="text-white font-bold text-lg tracking-tight">{sensor.id}</h4>
               <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{sensor.type} node</p>
               </div>
             </div>
             <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-xs font-bold text-white">
                   <Battery size={14} className={isLowBattery ? 'text-red-500 animate-pulse' : 'text-emerald-500'} />
                   {sensor.battery}%
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-bold uppercase mt-1">
                   <Signal size={12} className="text-emerald-500" />
                   {sensor.signal}% Signal
                </div>
             </div>
           </div>

           <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Live Telemetry</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white tracking-tighter tabular-nums">{sensor.value}</span>
                  <span className="text-sm text-slate-500 font-medium uppercase">{sensor.unit}</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mb-1">
                    <Timer size={12} /> {latency}ms
                 </div>
                 <div className="flex gap-0.5 items-end h-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-1 bg-emerald-500/40 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }} />
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {activePanel === 'location' && (
          <div className="flex-1 min-h-[280px] animate-in slide-in-from-right-4 duration-500 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Geospatial Bot Tracking</h5>
                  <span className="text-[8px] text-slate-500 font-mono">NAV-ALPHA-SYNC-OK</span>
                </div>
                <button onClick={() => setActivePanel('none')} className="text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"><X size={14} /></button>
             </div>
             <div className="flex-1 relative bg-[#0a0f0b] rounded-2xl border border-white/5 overflow-hidden group shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                   <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                     {Array.from({length: 144}).map((_, i) => (
                       <div key={i} className="border-[0.2px] border-emerald-500" />
                     ))}
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-emerald-500/20 rounded-full" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-emerald-500/20 rounded-full" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] border border-emerald-500/20 rounded-full" />
                </div>
                
                <div 
                  className="absolute w-14 h-14 -ml-7 -mt-7 transition-all duration-[3000ms] ease-linear flex items-center justify-center z-20"
                  style={{ 
                    left: `${mapOffset.x}%`, 
                    top: `${mapOffset.y}%` 
                  }}
                >
                   <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                   <div className="absolute inset-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 blur-[2px]" />
                   <div className="absolute inset-4 bg-emerald-500/5 rounded-full border border-emerald-500/50" />
                   
                   <div 
                    className="relative z-10 transition-transform duration-1000 ease-in-out"
                    style={{ transform: `rotate(${heading}deg)` }}
                   >
                     <Navigation size={18} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] fill-emerald-500/20" />
                   </div>
                </div>

                <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                   <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/5">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active Link</span>
                   </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 flex justify-between items-center shadow-xl">
                   <div className="flex flex-col">
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Precise Coordinates</span>
                      <span className="text-[10px] font-mono text-white tracking-tighter tabular-nums flex items-center gap-2">
                        <span className="text-emerald-500/50">LAT</span> {sensor.location[0].toFixed(6)}
                        <span className="text-emerald-500/50">LNG</span> {sensor.location[1].toFixed(6)}
                      </span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Velocity</span>
                      <span className="text-[10px] font-mono text-emerald-400 tabular-nums">0.02 m/s</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activePanel === 'history' && (
          <div className="flex-1 min-h-[250px] animate-in slide-in-from-right-4 duration-500">
             <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Biometric Trends ({timeRange})</h5>
                <button onClick={() => setActivePanel('none')} className="text-slate-500 hover:text-white"><X size={14} /></button>
             </div>
             <div className="h-40 w-full bg-white/[0.02] rounded-xl border border-white/5 p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={historyData}>
                   <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        )}

        {activePanel === 'maintenance' && (
          <div className="flex-1 min-h-[250px] animate-in slide-in-from-right-4 duration-500 flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Node Audit Logs</h5>
                <button onClick={() => setActivePanel('none')} className="text-slate-500 hover:text-white"><X size={14} /></button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {logs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-emerald-400 uppercase tracking-tighter">{log.type}</span>
                        <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                     </div>
                     <p className="text-slate-300 italic">"{log.note}"</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NetworkTopology: React.FC<{ sensors: SensorData[], locked?: boolean }> = ({ sensors, locked }) => {
  const nodes = useMemo(() => {
    const hub = { x: 400, y: 200, id: 'COMMAND_HUB', status: 'online', type: 'hub' };
    const sensorNodes = sensors.map((s, i) => {
      const angle = (i / sensors.length) * 2 * Math.PI;
      const seed = s.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const radius = 150 + (seed % 50);
      return {
        x: hub.x + radius * Math.cos(angle),
        y: hub.y + radius * Math.sin(angle),
        ...s
      };
    });
    return { hub, sensorNodes };
  }, [sensors.length, sensors]);

  if (locked) {
    return (
      <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] mb-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500/50">
           <LockKeyhole size={40} />
        </div>
        <div className="max-w-md">
          <h3 className="text-2xl font-prestige font-bold text-white uppercase tracking-tighter">Neural Topology Locked</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">Advanced mesh-net visualizations and signal latency mapping are restricted to <span className="text-emerald-400 font-bold">Industrial Apex</span> partners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 rounded-3xl mb-12 overflow-hidden relative border border-emerald-900/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="text-emerald-500" size={20} />
            Neural Mesh Topology
          </h3>
          <p className="text-sm text-slate-500">Live visualization of node connections and packet relay</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"/> Active</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"/> Offline</div>
        </div>
      </div>

      <div className="h-[400px] w-full relative">
        <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />

          {nodes.sensorNodes.map((node) => (
            <g key={`conn-${node.id}`}>
              <line 
                x1={nodes.hub.x} 
                y1={nodes.hub.y} 
                x2={node.x} 
                y2={node.y} 
                stroke={node.status === 'offline' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.15)'} 
                strokeWidth="1"
                strokeDasharray={node.status === 'offline' ? "4 4" : "0"}
              />
              {node.status !== 'offline' && (
                <circle r="2" fill="#10b981" className="animate-pulse">
                  <animateMotion 
                    dur={`${2 + (node.id.length % 3)}s`} 
                    repeatCount="indefinite" 
                    path={`M ${node.x} ${node.y} L ${nodes.hub.x} ${nodes.hub.y}`} 
                  />
                </circle>
              )}
            </g>
          ))}

          <g transform={`translate(${nodes.hub.x}, ${nodes.hub.y})`}>
            <circle r="30" fill="rgba(16,185,129,0.1)" className="animate-[ping_3s_infinite]" />
            <circle r="15" fill="#10b981" className="shadow-lg shadow-emerald-500/50" />
            <foreignObject x="-10" y="-10" width="20" height="20">
               <Cpu className="text-slate-900" size={20} />
            </foreignObject>
            <text y="35" textAnchor="middle" className="text-[10px] fill-emerald-400 font-bold uppercase tracking-widest">Command Hub</text>
          </g>

          {nodes.sensorNodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle r="10" fill={node.status === 'online' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'} />
              <circle r="5" fill={node.status === 'online' ? '#10b981' : '#ef4444'} />
              <text y="20" textAnchor="middle" className="text-[8px] fill-slate-500 font-mono">{node.id}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

interface IoTNetworkProps {
  sensors: SensorData[];
  batteryThreshold: number;
  setBatteryThreshold: (v: number) => void;
  userPlan: PlanTier;
}

const IoTNetwork: React.FC<IoTNetworkProps> = ({ sensors, batteryThreshold, setBatteryThreshold, userPlan }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const isBTE = userPlan === 'Boutique Estate';

  const visibleSensors = isBTE ? sensors.slice(0, 4) : sensors;

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-prestige font-bold text-white">Sovereign Mesh-Net</h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 text-sm">Managing {visibleSensors.length} distributed IoT nodes.</p>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
               <Globe size={12} className="text-emerald-500" />
               <span className="text-[9px] font-bold text-emerald-400 uppercase">94% Area Coverage</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="glass-card flex items-center gap-3 px-4 py-2 rounded-xl border-white/10">
              <Battery size={16} className="text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-500 uppercase">Alert Threshold</span>
                <div className="flex items-center gap-2">
                   <input 
                      type="range" min="0" max="100" 
                      value={batteryThreshold} 
                      onChange={(e) => setBatteryThreshold(parseInt(e.target.value))}
                      className="w-24 h-1 bg-emerald-900/40 rounded-full appearance-none accent-emerald-500"
                   />
                   <span className="text-[10px] font-bold text-white">{batteryThreshold}%</span>
                </div>
              </div>
           </div>
           
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
             {['24h', '7d', '30d'].map(range => (
               <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    timeRange === range ? 'bg-emerald-500 text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'
                  }`}
               >
                 {range}
               </button>
             ))}
           </div>
        </div>
      </header>

      <NetworkTopology sensors={visibleSensors} locked={isBTE} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleSensors.map(sensor => (
          <SensorNode 
            key={sensor.id} 
            sensor={sensor} 
            batteryThreshold={batteryThreshold} 
            timeRange={timeRange} 
          />
        ))}
        {isBTE && (
          <div className="glass-card p-10 rounded-[2rem] border border-dashed border-white/5 flex flex-col items-center justify-center text-center group opacity-40 hover:opacity-100 transition-opacity">
            <PlusCircle className="text-slate-500 group-hover:text-emerald-500 group-hover:rotate-90 transition-all" size={48} />
            <h3 className="text-lg font-bold text-white mt-4 uppercase tracking-tighter">Node Limit Reached</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs">Boutique Estates are limited to 4 primary mesh nodes. Upgrade for infinite sectoral scaling.</p>
          </div>
        )}
      </div>

      <div className="glass-card p-6 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10 flex items-start gap-4 shadow-[inset_0_0_20px_rgba(59,130,246,0.02)]">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
           <Info size={20} />
        </div>
        <div className="max-w-3xl">
           <h4 className="text-sm font-bold text-white uppercase tracking-tight">Institutional Maintenance Advisory</h4>
           <p className="text-xs text-slate-500 leading-relaxed mt-1 italic">
             All nodes are currently synchronized with the Global Agri-Registry. Routine health sweeps are conducted every 180 seconds to ensure sub-millisecond signal latency across the {userPlan} backbone.
           </p>
        </div>
      </div>
    </div>
  );
};

export default IoTNetwork;
