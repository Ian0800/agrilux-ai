
import React from 'react';
import { X, Award, Globe, CheckCircle2, FileText, Landmark, Mail, UserCheck, Scale } from 'lucide-react';
import { PlanTier } from '../types';

interface RegistryComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan: PlanTier;
}

const RegistryComplianceModal: React.FC<RegistryComplianceModalProps> = ({ isOpen, onClose, userPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card w-full max-w-2xl rounded-[3rem] border-blue-500/30 overflow-hidden flex flex-col shadow-[0_0_80px_rgba(59,130,246,0.15)]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-blue-500/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-prestige font-bold text-white uppercase tracking-tighter">Registry Compliance</h2>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.3em]">Compliance Tier: AAA Elite</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>

        <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Globe size={14} /> Active Certifications
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'UN-SDG 2025 Standard', status: 'Verified', desc: 'Zero Hunger & Climate Action goals' },
                { label: 'World Bank ESG Framework', status: 'Compliant', desc: 'AAA+ Sustainability Rating' },
                { label: 'ISO-AGRI-MESH-40', status: 'Active', desc: 'Distributed IoT Mesh standards' },
                { label: 'Global Carbon Registry', status: 'Verified', desc: 'Tier-1 Offset Validation' },
              ].map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                   <div>
                      <p className="text-xs font-bold text-white uppercase">{cert.label}</p>
                      <p className="text-[9px] text-slate-500 italic">{cert.desc}</p>
                   </div>
                   <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase">
                      <CheckCircle2 size={12} /> {cert.status}
                   </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Scale size={14} /> Compliance Architect
            </h3>
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <UserCheck size={32} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Ian Tshakalisa</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">Chief Regulatory Officer & ESG Strategist</p>
                <div className="flex gap-4 mt-2">
                  <a href="mailto:tshakalisa15@gmail.com" className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1">
                    <Mail size={12} /> tshakalisa15@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
             <FileText className="text-blue-500 flex-shrink-0" size={20} />
             <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-bold">
               System verified for {userPlan} deployment. For regulatory documentation or registry inquiries, contact the platform architect, <span className="text-white">Ian Tshakalisa</span>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryComplianceModal;
