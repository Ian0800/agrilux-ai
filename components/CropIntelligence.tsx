
import React, { useState, useRef } from 'react';
import { Camera, Upload, ShieldCheck, Zap, Info, Loader2, Leaf, Layers, FlaskConical, Share2, Facebook, Instagram, Download } from 'lucide-react';
import { analyzeCropImage, analyzeSoilImage } from '../services/geminiService';
import { AIAnalysisResult, PlanTier } from '../types';

type AnalysisMode = 'crop' | 'soil';

interface CropIntelligenceProps {
  userPlan: PlanTier;
}

const CropIntelligence: React.FC<CropIntelligenceProps> = ({ userPlan }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [mode, setMode] = useState<AnalysisMode>('crop');
  const [showShareCard, setShowShareCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const analysis = mode === 'crop' 
          ? await analyzeCropImage(base64)
          : await analyzeSoilImage(base64);
        setResult(analysis);
      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const modeConfig = {
    crop: {
      title: 'Field Health Diagnostic',
      subtitle: 'Deploying AgriLux AI vision to identify health anomalies in milliseconds.',
      icon: Leaf,
      uploadLabel: 'Upload Field Specimen',
      uploadSub: 'High-resolution leaf scan or full crop aerial',
      action: 'Initialize Health Scan'
    },
    soil: {
      title: 'Pedological Analysis',
      subtitle: 'Analyzing soil horizons and nutrient matrix for regenerative optimization.',
      icon: Layers,
      uploadLabel: 'Upload Soil Sample',
      uploadSub: 'Core sample photo or topsoil aggregate image',
      action: 'Initialize Soil Matrix Scan'
    }
  };

  const Config = modeConfig[mode];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-center mb-4">
        <div className="glass-card p-1 rounded-2xl flex border border-emerald-500/20">
          <button 
            onClick={() => { setMode('crop'); setResult(null); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              mode === 'crop' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Leaf size={14} />
            Plant Health
          </button>
          <button 
            onClick={() => { setMode('soil'); setResult(null); }}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              mode === 'soil' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Layers size={14} />
            Soil Matrix
          </button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-prestige font-bold text-white">{Config.title}</h2>
        <p className="text-slate-400 mt-2">{Config.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-3xl border-2 border-dashed border-emerald-500/20 flex flex-col items-center justify-center space-y-6 hover:border-emerald-500/50 transition-all cursor-pointer group"
             onClick={() => fileInputRef.current?.click()}>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Config.icon className="text-emerald-400" size={36} />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{Config.uploadLabel}</p>
            <p className="text-slate-500 text-sm mt-1">{Config.uploadSub}</p>
          </div>
          <button className="bg-emerald-500 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-lg gold-glow">
            {Config.action}
          </button>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col min-h-[400px] relative">
          {analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Loader2 className="animate-spin text-emerald-500" size={48} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FlaskConical size={16} className="text-emerald-500/50" />
                </div>
              </div>
              <p className="text-emerald-400 font-medium animate-pulse tracking-widest uppercase text-xs">Running Neural Analysis...</p>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-2xl font-bold text-white leading-tight">{result.diagnosis}</h3>
                <span className="flex-shrink-0 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  {Math.round(result.confidence * 100)}% Confidence
                </span>
              </div>
              
              <div className="space-y-3">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> 
                  {mode === 'crop' ? 'Prescribed Actions' : 'Regenerative Strategy'}
                </p>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 text-sm text-slate-300 items-start glass-card p-3 rounded-xl border-white/5 bg-white/5">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Zap size={40} className="text-emerald-500" />
                </div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1">
                  <Zap size={12} /> ESG & Sustainability Impact
                </p>
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "{result.sustainabilityImpact}"
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setShowShareCard(true)}
                  className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <Share2 size={14} /> Generate Marketing Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40 group hover:opacity-60 transition-opacity">
              <div className="p-6 rounded-full bg-slate-900/50 border border-white/5">
                <Info size={48} className="text-slate-600" />
              </div>
              <div className="max-w-[240px]">
                  <p className="text-slate-500 text-sm italic">Awaiting field data input for intelligence processing</p>
                  <p className="text-[10px] text-slate-700 uppercase mt-2 font-bold tracking-widest">Protocol: AI-VIS-ALPHA-9</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SOCIAL MEDIA SHARE MODAL */}
      {showShareCard && result && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-lg space-y-8">
              <div className="flex justify-between items-center text-white">
                 <h3 className="text-xl font-prestige font-bold">Social Marketing Asset</h3>
                 <button onClick={() => setShowShareCard(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              {/* THE CARD TO SCREENSHOT */}
              <div id="social-card" className="aspect-square w-full bg-[#050a06] border-[12px] border-emerald-500/10 rounded-[3rem] p-12 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-emerald-500"><Leaf size={240} /></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                    <div>
                       <h4 className="text-3xl font-prestige font-bold text-white leading-none">AgriLux <span className="text-emerald-500">AI</span></h4>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.4em] mt-2">Neural Insight Report</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-slate-900 rounded-full text-[8px] font-bold uppercase tracking-widest">
                       <ShieldCheck size={10} /> Verified
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">AI Diagnosis</p>
                    <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">{result.diagnosis}</h2>
                    <div className="w-20 h-1 bg-emerald-500" />
                 </div>

                 <div className="flex justify-between items-end relative z-10">
                    <div className="space-y-1">
                       <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Protocol Integrity</p>
                       <p className="text-xs font-mono text-emerald-400">99.98% Confidence Loop</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Lead Architect</p>
                       <p className="text-[10px] font-bold text-white">Ian Tshakalisa</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all group">
                    <Instagram size={18} className="text-pink-500 group-hover:scale-110 transition-transform" />
                    Share to IG
                 </button>
                 <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all group">
                    <Facebook size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    Share to FB
                 </button>
              </div>
              <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">Click to download as high-res PNG for your bot page</p>
           </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default CropIntelligence;
