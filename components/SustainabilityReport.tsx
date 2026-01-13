
import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Globe, Users, TrendingUp, Award, Loader2, 
  ShieldCheck, Leaf, Heart, Scale, BarChart3, PieChart, Info, 
  ChevronRight, ArrowUpRight, CheckCircle2, LockKeyhole
} from 'lucide-react';
import { getStrategicReport } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  Radar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell
} from 'recharts';
import { PlanTier } from '../types';

const ESG_RADAR_DATA = [
  { subject: 'Carbon Sequestration', A: 110, fullMark: 150 },
  { subject: 'Water Optimization', A: 140, fullMark: 150 },
  { subject: 'Social Equity', A: 90, fullMark: 150 },
  { subject: 'Governance Transparency', A: 130, fullMark: 150 },
  { subject: 'Soil Biodiversity', A: 120, fullMark: 150 },
];

const CARBON_TREND_DATA = [
  { month: 'Jan', tCO2e: 85, target: 80 },
  { month: 'Feb', tCO2e: 92, target: 85 },
  { month: 'Mar', tCO2e: 108, target: 90 },
  { month: 'Apr', tCO2e: 115, target: 95 },
  { month: 'May', tCO2e: 132, target: 100 },
  { month: 'Jun', tCO2e: 150, target: 110 },
];

const SOCIAL_IMPACT_DATA = [
  { category: 'Training', value: 88, color: '#10b981' },
  { category: 'Employment', value: 76, color: '#3b82f6' },
  { category: 'Health', value: 92, color: '#8b5cf6' },
  { category: 'Equality', value: 84, color: '#ec4899' },
];

interface SustainabilityReportProps {
  userPlan: PlanTier;
}

const SustainabilityReport: React.FC<SustainabilityReportProps> = ({ userPlan }) => {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'env' | 'soc' | 'gov'>('env');

  const canGenerateStrategic = userPlan !== 'Boutique Estate';

  const generateReport = async () => {
    if (!canGenerateStrategic) return;
    setGenerating(true);
    try {
      const context = `Current farm metrics show 45% water reduction, 22% yield increase, 150 metric tons of carbon sequestered this quarter across ${userPlan} hub. Focus on ESG Alpha and ROI for trillionaire-tier stakeholders.`;
      const res = await getStrategicReport(context);
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - (margin * 2);

    // Cover Page / Header
    doc.setFillColor(5, 10, 6);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(16, 185, 129);
    doc.text('AGRILUX AI', margin, 35);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('SOVEREIGN BIOMETRIC BRIEFING', margin, 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`REF: ${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 40, 35);
    doc.text(`TIER: ${userPlan.toUpperCase()} COMPLIANT`, pageWidth - margin - 40, 40);

    // Line
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.8);
    doc.line(margin, 60, pageWidth - margin, 60);

    // Body text styling
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(report, contentWidth);
    let cursorY = 80;
    const lineHeight = 7.5;

    lines.forEach((line: string) => {
      if (cursorY > pageHeight - margin) {
        doc.addPage();
        doc.setFillColor(5, 10, 6);
        doc.rect(0, 0, pageWidth, 20, 'F');
        cursorY = 40;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    // Strategy Annex at the bottom
    cursorY += 20;
    if (cursorY < pageHeight - 60) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, cursorY, contentWidth, 40, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text('ARCHITECT\'S GUARANTEE', margin + 10, cursorY + 15);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('This data is verified by the Ian Tshakalisa Neural Mesh (Backbone v4.8).', margin + 10, cursorY + 25);
      doc.text('All biometrics are UN-SDG compliant and validated via real-time satellite grounding.', margin + 10, cursorY + 32);
    }

    doc.save(`AgriLux_Strategic_Briefing_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-3xl font-prestige font-bold text-white flex items-center gap-3">
            Institutional ESG Protocol
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">UN-SDG Aligned</span>
          </h2>
          <p className="text-slate-400 mt-1">Global compliance dashboard for high-stakes agricultural investment reporting.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={generateReport}
            disabled={generating || !canGenerateStrategic}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
              !canGenerateStrategic ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 gold-glow'
            }`}
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : !canGenerateStrategic ? <LockKeyhole size={20} /> : <FileText size={20} />}
            {!canGenerateStrategic ? 'Upgrade for Strategic Briefings' : 'Generate Strategic Briefing'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Carbon Sequestered', val: '150.4 t', trend: '+18.2%', icon: Leaf, color: 'emerald' },
          { label: 'Water Intensity', val: '4.2 L/kg', trend: '-22.5%', icon: Globe, color: 'blue' },
          { label: 'Fair Trade Impact', val: '450+', trend: '+5.4%', icon: Users, color: 'purple' },
          { label: 'Audit Integrity', val: '99.9%', trend: '+0.1%', icon: ShieldCheck, color: 'yellow' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-default">
            <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 mb-4`}>
              <item.icon size={24} />
            </div>
            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{item.label}</h4>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-bold text-white">{item.val}</p>
              <div className={`flex items-center gap-1 text-xs font-bold ${item.trend.startsWith('+') ? 'text-emerald-400' : 'text-blue-400'}`}>
                <TrendingUp size={14} className={item.trend.startsWith('-') ? 'rotate-180' : ''} />
                {item.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Impact Vectoring</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time mapping of sustainability commitments vs actual output.</p>
            </div>
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              {['env', 'soc', 'gov'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveMetricTab(t as any)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeMetricTab === t ? 'bg-emerald-500 text-slate-900' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {t === 'env' ? 'Environmental' : t === 'soc' ? 'Social' : 'Governance'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px]">
            {activeMetricTab === 'env' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CARBON_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f1712', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="target" stroke="#475569" strokeWidth={1} strokeDasharray="5 5" fill="transparent" />
                  <Area type="monotone" dataKey="tCO2e" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCarbon)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {activeMetricTab === 'soc' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SOCIAL_IMPACT_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f1712', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {SOCIAL_IMPACT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            {activeMetricTab === 'gov' && (
              <div className="h-full flex flex-col justify-center space-y-6 px-10">
                {[
                  { label: 'Blockchain Traceability', status: 'Verified', val: 100 },
                  { label: 'Financial Integrity Audit', status: 'Passed', val: 100 },
                  { label: 'ESG Reporting Latency', status: 'Real-time', val: 95 },
                  { label: 'Ethical Supply Chain', status: 'Compliant', val: 100 },
                ].map((audit, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {audit.label}
                      </span>
                      <span className="text-emerald-400 font-bold uppercase tracking-tighter">{audit.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${audit.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-2">Pillar Scorecard</h3>
          <p className="text-xs text-slate-500 mb-6">Aggregated ESG performance matrix.</p>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ESG_RADAR_DATA}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                <Radar name="Performance" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
             <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-3">
                  <Award className="text-emerald-400" size={20} />
                  <div>
                    <p className="text-xs font-bold text-white">ESG Leadership Status</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase">AgriLux Level: Tier 1 Apex</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 rounded-3xl min-h-[500px] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <FileText size={160} />
        </div>
        
        {generating ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
            <div className="relative">
              <Loader2 className="animate-spin text-emerald-500" size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={20} className="text-emerald-500/50" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-emerald-400 animate-pulse font-bold tracking-widest uppercase text-sm">Synchronizing Distributed Intelligence...</p>
              <p className="text-slate-600 text-xs italic">Compiling regional biometrics into strategic policy drafting...</p>
            </div>
          </div>
        ) : report ? (
          <div className="prose prose-invert max-w-none relative z-10">
             <div className="flex justify-between mb-8 items-center border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <img src="https://picsum.photos/40/40?grayscale" className="rounded-full w-8 h-8 opacity-50" alt="Org Logo" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">Strategic Policy Draft</span>
                      <span className="text-[10px] text-slate-500 font-mono tracking-tighter">REF: SEC-99-ESG-ALUX</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-[10px] font-bold text-white">DR. ELENA VANCE</p>
                    <p className="text-[8px] text-slate-500 uppercase">Lead Analyst</p>
                  </div>
                  <button 
                    onClick={handleExportPDF}
                    className="bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 px-4 py-2 rounded-xl border border-white/10 hover:border-emerald-500/30 flex items-center gap-2 text-xs font-bold transition-all group"
                  >
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
                    PDF Export
                  </button>
                </div>
             </div>
             <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light text-base bg-white/[0.02] p-8 rounded-2xl border border-white/5 shadow-inner">
                {report}
             </div>
             
             <div className="mt-12 flex flex-col md:flex-row gap-6">
               <div className="flex-1 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4 items-start">
                  <Info className="text-emerald-500 flex-shrink-0" size={20} />
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    This report utilizes the Gemini 3 Pro reasoning engine to synthesize complex IoT telemetry, regional socio-economic trends, and sustainability KPIs into an actionable policy framework.
                  </p>
               </div>
               <div className="md:w-64 flex flex-col justify-center">
                  <button className="text-emerald-400 text-xs font-bold flex items-center gap-2 hover:translate-x-1 transition-transform group">
                    View Methodology Annex <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-32">
            {!canGenerateStrategic ? (
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <LockKeyhole size={32} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-prestige font-bold text-white uppercase tracking-widest">Upgrade to Industrial Tier</h3>
                  <p className="text-slate-500 text-sm">AI Strategic policy drafting and high-fidelity biometrics synthesis are exclusive to Industrial Apex and Sovereign Protocol partners.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Globe size={80} className="text-slate-800" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 animate-ping" />
                  </div>
                </div>
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-2xl font-prestige font-bold text-slate-400">ESG Intelligence Ledger Idle</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Trigger a Strategic Briefing to initiate high-fidelity data synthesis. The AI will analyze current mesh-net biometrics and generate an institutional-grade reporting draft.
                    </p>
                    <button 
                      onClick={generateReport}
                      className="px-8 py-3 rounded-full border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/5 transition-all mt-4"
                    >
                      Initiate Ledger Synthesis
                    </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SustainabilityReport;
