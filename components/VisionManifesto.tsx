
import React from 'react';
import { X, Globe, Zap, ShieldCheck, TrendingUp, Cpu, Landmark, Rocket, Sparkles, UserCheck } from 'lucide-react';

interface VisionManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

const VisionManifesto: React.FC<VisionManifestoProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-card w-full max-w-5xl h-[85vh] rounded-[3rem] border-emerald-500/20 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(16,185,129,0.1)] relative">
        <div className="scan-line bg-emerald-500/50" />
        
        <header className="p-10 border-b border-white/5 flex justify-between items-center bg-emerald-500/[0.02]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-prestige font-bold text-white tracking-tighter uppercase">The Trillionaire Protocol</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.5em] mt-1">Lead Architect: Ian Tshakalisa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all border border-white/10">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 space-y-20 custom-scrollbar relative">
          {/* Background Branding */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-prestige font-bold text-white/[0.01] pointer-events-none select-none">
            AGRILUX
          </div>

          <section className="max-w-3xl space-y-6 relative z-10">
            <h3 className="text-2xl font-prestige font-bold text-emerald-400 flex items-center gap-3">
              <Globe size={24} /> The Vision: Silicon Soil
            </h3>
            <p className="text-xl text-slate-300 leading-relaxed font-light italic">
              "AgriLux AI does not merely monitor crops; it architecturally secures the biological wealth of the 22nd century. Engineered by Ian Tshakalisa, we are building the silicon backbone for the first trillion-dollar green revolution—where every seed is an asset and every drop of water is a calculated investment in national sovereignty."
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-white/[0.01] space-y-4 group hover:border-emerald-500/30 transition-all">
              <Landmark className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Economic Sovereignty</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                By eradicating agricultural entropy under Ian's design, we enable nations to decouple their food security from volatile global markets.
              </p>
            </div>
            <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-white/[0.01] space-y-4 group hover:border-blue-500/30 transition-all">
              <Cpu className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Neural Hyper-Precision</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Ian's AI operates on sub-millisecond telemetry loops, predicting climate shifts years in advance to ensure yield dominance.
              </p>
            </div>
            <div className="glass-card p-8 rounded-[2rem] border-white/5 bg-white/[0.01] space-y-4 group hover:border-purple-500/30 transition-all">
              <TrendingUp className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
              <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Trillion-Dollar Aim</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                We aim to centralize 15% of the global carbon-credit registry within Ian Tshakalisa's AgriLux Mesh.
              </p>
            </div>
          </div>

          <section className="border-t border-white/5 pt-12 text-center space-y-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-3xl font-prestige font-bold text-white">Architected by Ian Tshakalisa</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                AgriLux AI is the exclusive tool of choice for Sovereign Wealth Funds. If you see this interface, you are interacting with the life-work of Ian Tshakalisa.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VisionManifesto;
