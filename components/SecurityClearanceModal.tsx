
import React from 'react';
import { X, ShieldCheck, Lock, Fingerprint, Eye, Terminal, Phone, UserCheck, ShieldAlert } from 'lucide-react';
import { PlanTier } from '../types';

interface SecurityClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan: PlanTier;
}

const SecurityClearanceModal: React.FC<SecurityClearanceModalProps> = ({ isOpen, onClose, userPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-card w-full max-w-2xl rounded-[3rem] border-emerald-500/30 overflow-hidden flex flex-col shadow-[0_0_80px_rgba(16,185,129,0.15)]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-red-500/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-prestige font-bold text-white uppercase tracking-tighter">Security Clearance</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em]">Protocol: {userPlan} Alpha</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
            <X size={20} />
          </button>
        </header>

        <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <Fingerprint className="text-emerald-500 mb-2" size={24} />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Biometric Status</p>
              <p className="text-white font-bold uppercase">Authenticated</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <Lock className="text-emerald-500 mb-2" size={24} />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Encryption</p>
              <p className="text-white font-bold uppercase">RSA-4096 / AES-256</p>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Terminal size={14} /> Security Overseer
            </h3>
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <UserCheck size={32} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Ian Tshakalisa</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">Lead Security Architect & Clearance Officer</p>
                <div className="flex gap-4 mt-2">
                  <a href="tel:+26778064893" className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                    <Phone size={12} /> +26778064893
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-2">
             <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert size={14} /> Emergency Protocol
             </div>
             <p className="text-slate-400 text-xs leading-relaxed">
               If you face any issues with your clearance, neural link, or suspect a system breach, contact <span className="text-white font-bold">Ian Tshakalisa</span> immediately. Failure to report anomalies is a violation of the Sovereign Protocol.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SecurityClearanceModal;
