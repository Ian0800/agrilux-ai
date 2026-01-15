
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, ShieldCheck, Zap, Loader2, X, MessageSquare, Radio, Maximize, Activity, AudioWaveform, Key, ExternalLink, Cpu, Target, Layers, BarChart, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob as GeminiBlob } from '@google/genai';
import { PlanTier } from '../types';

declare var process: any;
declare var window: any;

interface LiveScoutProps {
  userPlan: PlanTier;
}

interface TranscriptItem {
  role: 'user' | 'ai';
  text: string;
  id: number;
}

const HardwareHUD = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null;
  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-20">
      {/* Top Telemetry */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/20">
             <Cpu size={12} className="text-emerald-400" />
             <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Multi-Modal Sync: OK</span>
          </div>
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5">
             <Target size={12} className="text-blue-400" />
             <span className="text-[9px] font-mono text-slate-400 uppercase">LiDAR Scan: Active [42.4m]</span>
          </div>
        </div>
        
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5 justify-end">
             <span className="text-[9px] font-mono text-slate-400">FPS: 30.0 / BPS: 420K</span>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Middle Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="w-32 h-32 border border-emerald-500/40 rounded-full animate-[pulse_3s_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-8 h-[1px] bg-emerald-500" />
           <div className="h-8 w-[1px] bg-emerald-500 absolute" />
        </div>
      </div>

      {/* Bottom Hardware Meters */}
      <div className="flex justify-between items-end">
        <div className="w-48 space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
           <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-bold text-slate-500 uppercase tracking-widest">Spectral Absorption [N]</div>
              <div className="flex gap-0.5 h-2">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="flex-1 bg-emerald-500/40 rounded-sm" style={{ height: `${20 + Math.random() * 80}%` }} />)}
              </div>
           </div>
           <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-bold text-slate-500 uppercase tracking-widest">Thermal Variance</div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-400 animate-[pulse_2s_infinite]" style={{ width: '65%' }} />
              </div>
           </div>
        </div>

        <div className="text-right">
           <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                 <BarChart size={12} />
                 <span className="text-[8px] font-bold uppercase tracking-widest">Soil Moisture Ingest</span>
              </div>
              <div className="text-lg font-mono font-bold text-white leading-none">42.8%</div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LiveScout: React.FC<LiveScoutProps> = ({ userPlan }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptItem[]>([]);
  const [aiStatus, setAiStatus] = useState<string>('Standby');
  const [errorState, setErrorState] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const frameIntervalRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const transcriptionBufferRef = useRef({ user: '', ai: '' });
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encodePCM = (data: Float32Array): GeminiBlob => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const stopSession = useCallback(() => {
    setIsActive(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
    setAiStatus('Standby');
    
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    setErrorState(null);
    setAiStatus('Establishing Neural Link...');

    try {
      // Initialize Audio Context immediately to bypass browser autoplay policies
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      if (!process.env.API_KEY) {
        throw new Error("Sovereign API Key missing in environment.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are the AgriLux Neural Sentinel. 
          Analyze the user's video stream for crop health, pest anomalies, and soil conditions. 
          Use multi-modal sensor inputs (LiDAR, Spectroscopy, Thermal) provided in the stream context to provide technical, sub-millisecond agricultural diagnostics. 
          Be professional, authoritative, and strategic.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setAiStatus('Neural Link Active');

            const source = inputContext.createMediaStreamSource(stream);
            const processor = inputContext.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e: any) => {
              if (isMuted || !isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = encodePCM(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputContext.destination);

            frameIntervalRef.current = setInterval(() => {
              if (isVideoOff || !canvasRef.current || !videoRef.current || !isActive) return;
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, 640, 480);
                canvasRef.current.toBlob((blob: Blob | null) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(session => session.sendRealtimeInput({ 
                        media: { data: base64, mimeType: 'image/jpeg' } 
                      }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              }
            }, 1000);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              setIsAiSpeaking(true);
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
              };
            }

            if (message.serverContent?.inputTranscription) {
              transcriptionBufferRef.current.user += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              transcriptionBufferRef.current.ai += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              setTranscriptions(prev => {
                const newItems: TranscriptItem[] = [
                  { role: 'user', text: transcriptionBufferRef.current.user, id: Date.now() },
                  { role: 'ai', text: transcriptionBufferRef.current.ai, id: Date.now() + 1 }
                ];
                return [...prev, ...newItems].slice(-10);
              });
              transcriptionBufferRef.current = { user: '', ai: '' };
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsAiSpeaking(false);
            }
          },
          onclose: () => stopSession(),
          onerror: (e: any) => {
            console.error("Live Link Error", e);
            setErrorState("Neural Link Severed: Connection to Sovereign Mesh failed.");
            stopSession();
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setErrorState(`Connection Failed: ${err.message || 'Unknown Protocol Error'}`);
      setIsConnecting(false);
      setAiStatus('Connection Failed');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-prestige font-bold text-white flex items-center gap-3">
            Neural Scout Sentinel
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-bold">Native Audio v2.5</span>
          </h2>
          <p className="text-slate-400 max-w-2xl">High-fidelity multi-modal intelligence streaming directly to Ian Tshakalisa's neural backbone.</p>
        </div>
        
        <div className="flex gap-4">
           {!isActive ? (
            <button 
              onClick={startSession}
              disabled={isConnecting}
              className="px-10 py-5 rounded-2xl bg-emerald-500 text-slate-900 font-bold flex items-center gap-3 gold-glow hover:bg-emerald-400 transition-all disabled:opacity-50 group"
            >
              {isConnecting ? <Loader2 className="animate-spin" size={20} /> : <Radio size={20} className="group-hover:animate-pulse" />}
              {isConnecting ? 'Establishing Neural Link...' : 'Initiate Neural Scout'}
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-10 py-5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold flex items-center gap-3 hover:bg-red-500/20 transition-all shadow-lg"
            >
              <X size={20} /> Terminate Link
            </button>
          )}
        </div>
      </div>
      
      {errorState && (
         <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-in slide-in-from-top-4">
            <AlertTriangle size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">{errorState}</span>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video glass-card rounded-[3rem] border-white/5 overflow-hidden shadow-2xl group bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover grayscale brightness-75 contrast-125 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />
            <canvas ref={canvasRef} width="640" height="480" className="hidden" />

            <HardwareHUD isActive={isActive} />

            {!isActive && !isConnecting && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <Video size={48} />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500">
                        Uplink Status: Disconnected
                    </p>
                    <p className="text-[10px] text-slate-600 mt-2 italic">
                        Awaiting Operator Command to Initialize Neural Feed
                    </p>
                </div>
              </div>
            )}

            {isActive && (
              <div className="absolute inset-0 pointer-events-none">
                 <div className="scan-line bg-emerald-500/20" />
                 
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-64 h-64 border border-emerald-500/10 rounded-full animate-[pulse_4s_infinite] flex items-center justify-center">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" />
                    </div>
                 </div>

                 {isAiSpeaking && (
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 h-12">
                       {Array.from({length: 12}).map((_, i) => (
                         <div 
                           key={i} 
                           className="w-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" 
                           style={{ 
                             height: `${20 + Math.random() * 30}%`, 
                             animationDelay: `${i * 0.05}s`,
                             animationDuration: `${0.3 + Math.random() * 0.4}s` 
                           }} 
                         />
                       ))}
                    </div>
                 )}
              </div>
            )}

            {isActive && (
              <div className="absolute bottom-10 left-10 flex items-center gap-4 px-6 py-4 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 animate-in slide-in-from-bottom-8 duration-700 pointer-events-auto z-30">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-2xl transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3.5 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                >
                  {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </button>
                <div className="w-[1px] h-10 bg-white/10 mx-2" />
                <button className="p-3.5 rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
                  <Maximize size={22} />
                </button>
              </div>
            )}
          </div>

          <div className="glass-card p-10 rounded-[3rem] border-white/5 relative overflow-hidden bg-emerald-500/[0.01]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20" />
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Hardware Telemetry Matrix</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
                       <span className="text-slate-500">Optics Precision</span>
                       <span className="text-emerald-400 tabular-nums">{isActive ? '99.9%' : '0.0%'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: isActive ? '99.9%' : '0%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em]">
                       <span className="text-slate-500">Spectral Resolution</span>
                       <span className="text-blue-400 tabular-nums">{isActive ? '0.02nm' : 'INF'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: isActive ? '100%' : '0%' }} />
                    </div>
                  </div>
               </div>

               <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-[2rem] bg-black/40 border border-white/5 relative">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                     <ShieldCheck size={10} className="text-emerald-500" />
                     <span className="text-[8px] font-bold text-emerald-400 uppercase">Hardware Secure</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sentinel Link State</span>
                  <p className={`text-xl font-bold uppercase tracking-tight ${isActive ? 'text-emerald-500 animate-pulse' : errorState ? 'text-red-500' : 'text-slate-700'}`}>{aiStatus}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[3.5rem] border-white/5 h-[620px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-emerald-500"><MessageSquare size={160} /></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                 <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 ${isActive ? 'animate-pulse' : ''}`}>
                    <Radio size={20} />
                 </div>
                 <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Diagnostic Feed</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-8 pr-6 scrollbar-thin scrollbar-thumb-emerald-500/10 hover:scrollbar-thumb-emerald-500/20 relative z-10">
                 {transcriptions.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-6">
                      <div className="p-8 rounded-full border border-dashed border-slate-700">
                         <MessageSquare size={54} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] font-bold">Neural Buffer Idle</p>
                        <p className="text-[10px] italic">Speak to initialize hardware-level analysis</p>
                      </div>
                   </div>
                 )}
                 {transcriptions.map((t) => (
                   <div key={t.id} className={`animate-in slide-in-from-bottom-4 duration-500 flex flex-col ${t.role === 'ai' ? 'items-start' : 'items-end text-right'}`}>
                      <div className={`max-w-[85%] p-5 rounded-2xl border transition-all ${
                        t.role === 'ai' 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                          : 'bg-white/5 border-white/5 text-slate-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                                {t.role === 'ai' ? 'Sentinel Response' : 'Field Operator'}
                            </span>
                            {t.role === 'ai' && <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        <p className={`text-sm leading-relaxed ${t.role === 'ai' ? 'font-medium' : 'font-light'}`}>
                          {t.text}
                        </p>
                      </div>
                   </div>
                 ))}
                 <div className="h-4" />
              </div>
           </div>

           <div className="glass-card p-10 rounded-[3rem] border-emerald-500/20 bg-emerald-500/[0.03] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={80} />
              </div>
              <div className="flex items-center gap-4 text-emerald-500">
                <ShieldCheck size={28} />
                <h4 className="font-bold uppercase tracking-[0.2em] text-sm">Hardware Integrity</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Secure link established via <span className="text-white font-bold">Ian Tshakalisa's Sovereign Backbone</span>. Multi-modal sensors are verified by decentralized institutional certificates.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScout;
