
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Globe, Zap, Leaf, Award, ChevronRight, LockKeyhole, ArrowRight, User, 
  CheckCircle2, AlertCircle, Loader2, TrendingUp, DollarSign, Database, Shield, 
  Search, Server, Scale, Map, Landmark, Gavel, Cpu, Info, Facebook, Instagram
} from 'lucide-react';
import { PlanTier } from '../types';

interface AuthProps {
  onLogin: (tier: PlanTier) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const MASTER_KEY = 'AGRILUX-GOLD-2025';

  const pricingTiers = [
    {
      id: 'BTE',
      name: 'Boutique Estate',
      price: '$2,400',
      period: '/year',
      desc: 'Precision for private estates and high-value boutique collectives.',
      roi: '15% Yield Increase',
      carbon: '50t Carbon/yr',
      specs: {
        nodes: '10 Max',
        satellite: 'Weekly Update',
        support: 'Email (24h)',
        retention: '12 Months',
        encryption: 'AES-128'
      },
      features: ['Neural Plant Health Scans', 'Local Dashboard', 'Basic ESG Compliance', 'Manual Export'],
      color: 'blue'
    },
    {
      id: 'IAX',
      name: 'Industrial Apex',
      price: '$24,000',
      period: '/year',
      desc: 'The global standard for commercial mega-farms and regional hubs.',
      roi: '28% Efficiency',
      carbon: '500t Carbon/yr',
      specs: {
        nodes: 'Unlimited',
        satellite: 'Daily Grounding',
        support: 'Neural (4h)',
        retention: '5 Years',
        encryption: 'RSA-2048'
      },
      features: ['Predictive Analytics', 'Market Hedging', 'Daily Satellite Sync', 'Automated Audits'],
      color: 'emerald',
      popular: true
    },
    {
      id: 'SVP',
      name: 'Sovereign Protocol',
      price: '$120,000+',
      period: '/year',
      desc: 'National-level food security for governments and NGOs.',
      roi: 'Risk Mitigation',
      carbon: 'Unlimited Registry',
      specs: {
        nodes: 'Global Mesh',
        satellite: 'Real-time',
        support: 'Direct (1h)',
        retention: 'Perpetual',
        encryption: 'Quantum-4096'
      },
      features: ['National Backbone', 'AI Policy Drafting', 'World Bank Audits', '24/7 War-Room'],
      color: 'purple'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    setTimeout(() => {
      const up = password.toUpperCase();
      if (up === MASTER_KEY) onLogin('Master');
      else if (up.startsWith('BTE-')) onLogin('Boutique Estate');
      else if (up.startsWith('IAX-')) onLogin('Industrial Apex');
      else if (up.startsWith('SVP-')) onLogin('Sovereign Protocol');
      else {
        setError('INVALID SOVEREIGN KEY: Access Denied');
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  if (isLoginView) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050a06] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)] pointer-events-none" />
        <div className={`w-full max-w-md glass-card rounded-[2.5rem] p-10 border-white/5 relative z-10 animate-in fade-in zoom-in-95 duration-500 ${error ? 'animate-shake' : ''}`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-prestige font-bold text-white mb-2">Institutional Entry</h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">Secure Command Hub Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Access Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all" placeholder="name@agrilux.ai" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Secure Sovereign Key</label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className={`w-full bg-white/5 border rounded-2xl py-3 pl-12 pr-4 text-white focus:border-emerald-500/50 outline-none transition-all ${error ? 'border-red-500/50' : 'border-white/10'}`} placeholder="••••••••" />
              </div>
            </div>
            {error && <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/5 p-3 rounded-xl border border-red-500/20"><AlertCircle size={14} /> {error}</div>}
            <button type="submit" disabled={isAuthenticating} className="w-full bg-emerald-500 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all gold-glow disabled:opacity-50">
              {isAuthenticating ? <><Loader2 className="animate-spin" size={18} /> Syncing...</> : <>Authorize Session <ChevronRight size={18} /></>}
            </button>
          </form>
          <button onClick={() => setIsLoginView(false)} disabled={isAuthenticating} className="w-full mt-10 text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] hover:text-white transition-colors">← Back to Licensing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050a06] text-slate-200 scroll-smooth">
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <Zap size={12} /> The Future of Global Agriculture
          </div>
          <h1 className="text-6xl md:text-8xl font-prestige font-bold text-white tracking-tight leading-[0.9]">
            Agricultural <br /> <span className="text-emerald-500">Sovereign Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Architecting Global Biological Wealth. Eradicating Agricultural Entropy with Ian Tshakalisa's Neural Mesh Infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button onClick={() => setIsLoginView(true)} className="px-10 py-4 rounded-2xl bg-emerald-500 text-slate-900 font-bold text-sm gold-glow hover:bg-emerald-400 transition-all flex items-center gap-2">
              Access Command Hub <ArrowRight size={18} />
            </button>
            <a href="#pricing" className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
              View Global Licensing
            </a>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-prestige font-bold text-white">Global Licensing Architecture</h2>
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Value-Driven Intelligence for Institutional Stakeholders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`glass-card p-10 rounded-[2.5rem] border transition-all relative overflow-hidden flex flex-col ${tier.popular ? 'border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] scale-105 z-10' : 'border-white/5 hover:border-white/10'}`}>
                {tier.popular && <div className="absolute top-0 right-0 p-6"><span className="bg-emerald-500 text-slate-900 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">Most Scaled</span></div>}
                <div className={`w-12 h-12 rounded-2xl bg-${tier.color}-500/10 text-${tier.color}-400 flex items-center justify-center mb-8 border border-${tier.color}-500/20`}>
                   {i === 0 ? <Leaf size={24} /> : i === 1 ? <Zap size={24} /> : <Globe size={24} />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-slate-500 text-sm">{tier.period}</span>
                </div>
                <div className="space-y-1 mb-6">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest"><TrendingUp size={10} /> {tier.roi} ROI Projection</div>
                  <div className="flex items-center gap-2 text-[9px] font-bold text-blue-400 uppercase tracking-widest"><Globe size={10} /> {tier.carbon} Validation</div>
                </div>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed font-light italic">"{tier.desc}"</p>
                <div className="space-y-4 mb-10 flex-1">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 size={14} className="text-emerald-500" /> {feat}</div>
                  ))}
                </div>
                <button onClick={() => setIsLoginView(true)} className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${tier.popular ? 'bg-emerald-500 text-slate-900 gold-glow hover:bg-emerald-400' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                  Initiate Deployment
                </button>
              </div>
            ))}
          </div>

          {/* Institutional Comparison Matrix */}
          <div className="mb-32 overflow-hidden rounded-[3rem] border border-white/5 glass-card">
            <div className="bg-white/5 px-10 py-8 border-b border-white/10 flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-prestige font-bold text-white uppercase tracking-tighter">Institutional Matrix</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Direct Tier Breakdown for Strategic Planning</p>
               </div>
               <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20">
                  <Scale size={24} />
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5">
                    <th className="px-10 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Capability</th>
                    {pricingTiers.map(t => (
                      <th key={t.id} className={`px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-center ${t.id === 'IAX' ? 'text-emerald-400' : 'text-white'}`}>{t.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { label: 'Max Node Capacity', vals: ['10 Units', 'Unlimited', 'Unlimited'] },
                    { label: 'Data Sovereignty', vals: ['Local Only', 'Sector Cloud', 'National Archive'] },
                    { label: 'Neural Latency', vals: ['< 1s', '< 250ms', '< 50ms'] },
                    { label: 'Satellite Sync', vals: ['Weekly', 'Daily', 'Real-Time'] },
                    { label: 'Encryption Standard', vals: ['AES-128', 'RSA-2048', 'Quantum-Safe'] },
                    { label: 'Strategic Consulting', vals: ['No', 'Yes (Standard)', 'Yes (Direct)'] },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-5 text-slate-400 font-medium">{row.label}</td>
                      {row.vals.map((v, idx) => (
                        <td key={idx} className="px-10 py-5 text-white font-bold text-center tabular-nums">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal & Regulatory Framework */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col justify-between">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20"><Gavel size={24} /></div>
                    <h3 className="text-2xl font-prestige font-bold text-white">Sovereign Regulatory Sandbox</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed italic font-light">
                    "AgriLux AI is engineered to integrate seamlessly with national food security policies. Our framework operates within a 'Regulatory Sandbox' mode, allowing governments to test AI-driven market stabilization and carbon-credit issuance without system risk."
                  </p>
                  <div className="space-y-4 pt-4">
                     {[
                       { icon: ShieldCheck, label: 'GDPR & Africa Data Act Compliance' },
                       { icon: Landmark, label: 'World Bank ESG 2025 Standard' },
                       { icon: Database, label: 'Zero-Knowledge Archive Protocol' }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <item.icon size={14} className="text-blue-500" /> {item.label}
                       </div>
                     ))}
                  </div>
               </div>
               <div className="pt-10">
                  <button className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-1 transition-transform">
                     Request Legal Manifest <ArrowRight size={14} />
                  </button>
               </div>
            </div>

            <div className="glass-card p-10 rounded-[3rem] border border-emerald-500/20 bg-emerald-500/[0.02] flex flex-col justify-between">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20"><Landmark size={24} /></div>
                    <h3 className="text-2xl font-prestige font-bold text-white">Institutional Support SLAs</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Response Time</p>
                        <p className="text-xl font-bold text-emerald-400">Sub-1h</p>
                     </div>
                     <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">System Uptime</p>
                        <p className="text-xl font-bold text-emerald-400">99.999%</p>
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sovereign Protocol and Industrial Apex clients receive direct access to <span className="text-white font-bold">Ian Tshakalisa's Strategic War-Room</span>. This includes custom neural training and 24/7 hardware telemetry scrubbing.
                  </p>
               </div>
               <div className="pt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Info size={20} /></div>
                     <div className="flex-1">
                        <p className="text-[10px] font-bold text-white uppercase">Contact Lead Engineer</p>
                        <p className="text-[10px] text-slate-500 italic">Ian Tshakalisa | +26778064893</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION WITH SOCIAL LINKS */}
      <footer className="py-20 px-6 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Strategic Social Presence */}
          <div className="space-y-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.4em]">Sovereign Strategic Connections</p>
            <div className="flex justify-center items-center gap-8">
               <a 
                 href="https://web.facebook.com/profile.php?id=61584428452010" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group flex flex-col items-center gap-3"
               >
                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all shadow-xl">
                   <Facebook size={24} />
                 </div>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-blue-400 transition-colors">Facebook Portal</span>
               </a>
               <a 
                 href="https://www.instagram.com/prestige_auto_hub/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="group flex flex-col items-center gap-3"
               >
                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-pink-400 group-hover:border-pink-500/30 group-hover:bg-pink-500/5 transition-all shadow-xl">
                   <Instagram size={24} />
                 </div>
                 <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-pink-400 transition-colors">Instagram Intelligence</span>
               </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 pt-12">
            <span className="text-2xl font-prestige font-bold text-white">WORLD BANK</span>
            <span className="text-2xl font-prestige font-bold text-white">UNEP</span>
            <span className="text-2xl font-prestige font-bold text-white">WTO</span>
            <span className="text-2xl font-prestige font-bold text-white">FAO</span>
          </div>
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-bold">Trusted by global leaders in food security. Engineered by Ian Tshakalisa.</p>
          <p className="text-[8px] text-slate-800 uppercase tracking-widest">© 2025 Ian Tshakalisa | Sovereign Precision Engineering Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
