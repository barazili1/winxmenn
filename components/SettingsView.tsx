
import React, { useState } from 'react';
import { Copy, Check, ArrowRight, Download, Smartphone, ShieldCheck, Server, Crown, Fingerprint, Database, Terminal, Scan, Shield, Activity, Lock, Image, Unlock, Cog, Send, Plane } from 'lucide-react';
import { Language } from '../utils/translations';
import { Platform, GameMode } from '../types';
import { audioManager } from '../utils/audioManager';

interface SettingsViewProps {
  onComplete: (userId: string, gameMode: GameMode) => void;
  lang: Language;
  t: any;
  platform: Platform;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onComplete, lang, t, platform }) => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState('');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('aviator');
  const [errors, setErrors] = useState<{ userId?: boolean; userIdLength?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [statusText, setStatusText] = useState("UPLINKING...");
  
  const isAvabet = platform === 'avabet';
  const platformName = isAvabet ? "AVABET" : "GreenBet";
  const platformImg = isAvabet 
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMDs0txrRSa046mCupMfUgd9moJCQWtzvzLQagnfGG-w&s=10"
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEj5eP5tNE8iMZoLHE9i4q-JYLMiLmHaIMKatrmBePA&s=10";

  const xbetDownloadUrl = isAvabet 
    ? "https://avb-direct.org/L?tag=d_4846299m_134472c_&site=4846299&ad=134472"
    : "https://refpa79184.com/L?tag=d_5831611m_132250c_&site=5831611&ad=132250";

  const handleCopy = () => {
    audioManager.playCopy();
    navigator.clipboard.writeText("TOP1");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 15) setUserId(val);
  };

  const validateAndSubmit = async () => {
    audioManager.playClick();
    const trimmedId = userId.trim();
    const isLengthValid = trimmedId.length >= 8 && trimmedId.length <= 15;
    
    const newErrors = {
      userId: !trimmedId,
      userIdLength: !isLengthValid && !!trimmedId
    };

    setErrors(newErrors);

    if (!newErrors.userId && !newErrors.userIdLength) {
      setIsSubmitting(true);
      setStatusText("SYSTEM UPLINK...");
      
      let isAdminVerified = false;
      try {
        // Fetch IDs from the specific Firebase path: ids/ids/id
        const response = await fetch('https://crazy-12-default-rtdb.firebaseio.com/ids/ids/id.json');
        const dbData = await response.json();
        
        if (dbData) {
          // Check if ID exists as a value or a key in the returned data
          const authorizedIds = Array.isArray(dbData) ? dbData.map(v => String(v)) : Object.values(dbData).map(v => String(v));
          const keys = !Array.isArray(dbData) ? Object.keys(dbData).map(k => String(k)) : [];
          
          if (authorizedIds.includes(trimmedId) || keys.includes(trimmedId) || dbData === trimmedId) {
            isAdminVerified = true;
          }
        }
      } catch (err) { console.error("Validation sync fail", err); }

      const timer = setInterval(() => {
        setOverallProgress(prev => {
            const next = prev + 1.25;
            if (next >= 100) { clearInterval(timer); return 100; }
            if (next >= 35 && next < 70) setStatusText("VERIFYING DEPOSIT...");
            if (next >= 70) setStatusText("VERIFYING ID...");
            return next;
        });
      }, 35);

      setTimeout(() => {
        const finalId = isAdminVerified ? `ADMIN_SESS_PROTOCOL_${trimmedId}` : trimmedId;
        onComplete(finalId, selectedGameMode);
      }, 3800);
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-20 overflow-y-auto custom-scrollbar relative bg-transparent">
      <div className="mb-6 text-center relative z-10">
        <div className="inline-flex flex-col items-center">
            <div className="w-14 h-14 mb-3 rounded-2xl bg-zinc-950 border border-green-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <Crown className="w-7 h-7 text-green-500 drop-shadow-[0_0_6px_#22c55e]" />
            </div>
            <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase">{t.activation_required}</h2>
            <p className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-mono mt-1">{t.complete_steps}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 pb-8">
        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 backdrop-blur-xl">
           <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                 <img src={platformImg} className="w-10 h-10 rounded-xl border border-zinc-800 object-cover" />
                 <div>
                    <h3 className="text-sm font-black text-white uppercase">{t.install_app}</h3>
                    <span className="text-[8px] font-mono text-green-500 font-bold">Node Integrity: Verified</span>
                 </div>
              </div>
              <Smartphone className="w-4 h-4 text-zinc-700" />
           </div>
           <p className="text-[11px] text-zinc-400 mb-4 font-medium">{t.install_desc}</p>
           <a href={xbetDownloadUrl} target="_blank" className="w-full h-10 rounded-xl bg-white text-black font-black text-[9px] tracking-[0.2em] uppercase flex items-center justify-center gap-2">{t.install_btn}</a>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 backdrop-blur-xl">
           <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Send className="w-4 h-4 text-green-500" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white uppercase">{t.telegram_sub}</h3>
                    <span className="text-[8px] font-mono text-green-500 font-bold">Channel Connection: Active</span>
                 </div>
              </div>
              <Send className="w-4 h-4 text-zinc-700" />
           </div>
           <p className="text-[11px] text-zinc-400 mb-4 font-medium">{t.telegram_sub_desc}</p>
           <a href="https://t.me/+n2KMMZlp34kzNTBk" target="_blank" rel="noopener noreferrer" className="w-full h-10 rounded-xl bg-white text-black font-black text-[9px] tracking-[0.2em] uppercase flex items-center justify-center gap-2">{t.telegram_btn}</a>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
           <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-black text-white uppercase">{t.registration}</h3>
              <Lock className="w-4 h-4 text-zinc-700" />
           </div>
           <p className="text-[11px] text-zinc-400 mb-4">{t.reg_desc}</p>
           <div onClick={handleCopy} className="bg-black/60 rounded-xl border border-zinc-800 border-dashed p-3 flex items-center justify-between cursor-pointer">
              <span className="text-lg font-mono font-black text-white tracking-[0.2em]">TOP1</span>
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
           </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 backdrop-blur-xl">
           <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-green-500" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-white uppercase">{t.activation_deposit}</h3>
                    <span className="text-[8px] font-mono text-green-500 font-bold">Requirement: Pending Activation</span>
                 </div>
              </div>
              <Unlock className="w-4 h-4 text-zinc-700" />
           </div>
           <p className="text-[11px] text-zinc-400 mb-4 font-medium">{t.min_deposit}</p>
           <div className="bg-black/60 rounded-xl border border-zinc-800 p-4 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                 <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                    {t.deposit_condition}
                 </span>
              </div>
              <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                 Required
              </div>
           </div>
        </div>

        <div className={`p-5 rounded-2xl border bg-zinc-900/40 ${errors.userId ? 'border-red-500/30' : 'border-zinc-800'}`}>
           <h3 className="font-black text-lg text-white uppercase mb-4">{t.verify_account}</h3>
           <div className="space-y-4">
              <div className="relative">
                  <label className="block text-[9px] text-zinc-500 mb-1.5 uppercase font-black tracking-widest">{t.userid_label}</label>
                  <input type="tel" value={userId} onChange={handleUserIdChange} placeholder="1729018123" className="w-full bg-black/60 border border-zinc-800 text-white font-mono text-sm p-3 rounded-xl focus:border-green-500 transition-all outline-none" />
              </div>

              {/* Game Platform Selection Condition (التفاحه أو الطياره) */}
              <div className="pt-2">
                 <label className="block text-[9px] text-zinc-400 mb-2 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    {t.select_game_platform || 'اختيار المنصة (التفاحة أو الطيارة)'}
                 </label>
                 <div className="grid grid-cols-2 gap-3">
                    {/* Apple Choice */}
                    <button
                       type="button"
                       onClick={() => { audioManager.playClick(); setSelectedGameMode('apple'); }}
                       className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group ${
                          selectedGameMode === 'apple'
                             ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] ring-1 ring-emerald-500/50'
                             : 'bg-black/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                       }`}
                    >
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          🍎
                       </div>
                       <div className="text-center">
                          <span className="block text-xs font-black uppercase tracking-wide font-sans text-emerald-400">
                             {t.apple_game || 'منصة التفاحة'}
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono mt-0.5 block">Apple of Fortune</span>
                       </div>
                       {selectedGameMode === 'apple' && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                       )}
                    </button>

                    {/* Aviator / Plane Choice */}
                    <button
                       type="button"
                       onClick={() => { audioManager.playClick(); setSelectedGameMode('aviator'); }}
                       className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group ${
                          selectedGameMode === 'aviator'
                             ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] ring-1 ring-red-500/50'
                             : 'bg-black/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                       }`}
                    >
                       <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          ✈️
                       </div>
                       <div className="text-center">
                          <span className="block text-xs font-black uppercase tracking-wide font-sans text-red-400">
                             {t.aviator_game || 'منصة الطيارة'}
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono mt-0.5 block">Aviator Signal</span>
                       </div>
                       {selectedGameMode === 'aviator' && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444]" />
                       )}
                    </button>
                 </div>
              </div>
           </div>
           <button onClick={validateAndSubmit} disabled={isSubmitting} className="w-full mt-6 h-12 rounded-xl bg-white text-black font-black text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer">
               <span>{t.submit_verification}</span>
               <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6">
           <div className="bg-zinc-950 border border-green-500/20 rounded-[4rem] p-12 w-full max-w-sm text-center shadow-[0_0_100px_rgba(34,197,94,0.1)]">
              <h2 className="text-4xl font-display font-black text-white uppercase mb-6 leading-tight">VERIFYING<br/><span className="text-green-500">SESSION</span></h2>
              <div className="w-full mt-8">
                 <div className="flex justify-between mb-3"><span className="text-[10px] font-mono text-zinc-400 animate-pulse">{statusText}</span><span className="text-[14px] font-black text-green-500">{Math.round(overallProgress)}%</span></div>
                 <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5"><div className="h-full bg-green-500 rounded-full shadow-[0_0_15px_#22c55e]" style={{ width: `${overallProgress}%` }} /></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
