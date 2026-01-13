
import React from 'react';
import { X, Download, BookOpen, Info, ShieldCheck, Zap, Leaf, Globe, Rocket, Landmark, Radio, AlertTriangle, Cpu, TrendingUp, Sparkles, LockKeyhole, Mail, Phone, UserCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PlanTier } from '../types';

interface UserManualProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan: PlanTier;
}

const UserManual: React.FC<UserManualProps> = ({ isOpen, onClose, userPlan }) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header Branding
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('AGRILUX AI', margin, 30);
    
    doc.setFontSize(10);
    doc.text('OFFICIAL MASTER PROTOCOL GUIDE', margin, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(240, 240, 240);
    doc.text(`Lead Architect: Ian Tshakalisa`, pageWidth - margin - 50, 30);
    doc.text(`Contact: +267 78064893`, pageWidth - margin - 50, 36);

    let y = 60;
    const writeSection = (title: string, content: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(16, 185, 129);
      doc.text(title, margin, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(content, pageWidth - (margin * 2));
      doc.text(lines, margin, y);
      y += (lines.length * 6) + 15;
      if (y > 270) { doc.addPage(); y = 30; }
    };

    writeSection("I. PLATFORM ARCHITECTURE", "Engineered by Ian Tshakalisa, AgriLux AI is a smart tool that uses a high-fidelity computer brain (AI) and distributed machines (IoT Mesh Nodes) to look after your farm. It prevents agricultural entropy and secures yield dominance.");
    writeSection("II. ACCESS PROTOCOLS", "Authentication is via the 'Sovereign Key.' Boutique (BTE) keys manage private estates. Industrial (IAX) keys manage regional hubs. Sovereign (SVP) keys manage national assets.");
    writeSection("III. NEURAL SCOUT SENTINEL", "Initiate the Neural Scout to engage in real-time vision/voice diagnostics. Point the camera at a specimen and ask for biometrics. The AI will respond with 99.8% precision.");
    writeSection("IV. IOT MESH-NET TOPOLOGY", "This shows your sensors in the field. Check the battery bars. If they are red, the node requires immediate service to maintain data integrity.");
    writeSection("V. STRATEGIC EMERGENCY", "If you face any issues with the platform, neural link, or security, contact the Lead Architect Ian Tshakalisa immediately at +267 78064893.");

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("© 2025 Ian Tshakalisa | Sovereign Precision Engineering", pageWidth / 2, 285, { align: 'center' });

    doc.save('AgriLux_Master_Protocol_Guide.pdf');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] rounded-[3rem] border-white/10 overflow-hidden flex flex-col shadow-2xl">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-prestige font-bold text-white leading-tight">AgriLux Master Manual</h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em] mt-1">Institutional Plan: {userPlan}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-900 hover:bg-emerald-400 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg"
            >
              <Download size={16} /> Save Guide PDF
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {/* Creator Recognition Section */}
          <section className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
              <UserCheck size={40} />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-prestige font-bold text-white">Engineered by Ian Tshakalisa</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                This trillionaire-tier AI protocol was architected by Ian Tshakalisa. For technical inquiries, system failures, or bespoke agricultural neural training, reach out directly via the channels below.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                 <a href="tel:+26778064893" className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors">
                    <Phone size={14} /> +267 78064893
                 </a>
                 <a href="mailto:tshakalisa15@gmail.com" className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors">
                    <Mail size={14} /> tshakalisa15@gmail.com
                 </a>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <Cpu size={20} />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Using the Tools</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Leaf size={16} className="text-emerald-500" /> Plant Doctor
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Go to <span className="text-white font-semibold">Neural Intelligence</span>. Click the box and pick a photo of your leaf. The AI will tell you if the plant is thirsty or sick.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Radio size={16} className="text-emerald-500" /> Machine Watch
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Go to <span className="text-white font-semibold">IoT Mesh-Net</span>. Look at the battery icon. If it's <span className="text-red-500 font-bold">Red</span>, go to the field and charge the sensor!
                </p>
              </div>
            </div>
          </section>

          {/* Safety Warning */}
          <section className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Emergency Lockdown</h4>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                If the system turns <span className="text-red-500 font-bold">RED</span>, you are locked out for safety. You must contact <span className="text-white font-bold">Ian Tshakalisa</span> immediately to regain access.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManual;
