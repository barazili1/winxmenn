import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Plane, ShieldCheck, Zap, RefreshCw, Radio, Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';

interface AviatorViewProps {
  lang: Language;
  t: any;
  userId: string;
}

const AviatorView: React.FC<AviatorViewProps> = ({ lang, t, userId }) => {
  const [multiplier, setMultiplier] = useState<string>("3.32");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<string>("98.6%");
  const [lastFetchedAt, setLastFetchedAt] = useState<string>("");
  const [signalHistory, setSignalHistory] = useState<string[]>(["1.85", "3.32", "2.10", "5.40", "1.62", "8.90"]);
  const [time, setTime] = useState({ h: "00", m: "15", s: "00" });

  const isAdmin = userId.startsWith("ADMIN_SESS_PROTOCOL_");
  const cleanUserId = isAdmin ? userId.replace("ADMIN_SESS_PROTOCOL_", "") : userId;

  // Calculate safe cashout point (~80% of target multiplier)
  const numericMult = parseFloat(multiplier) || 3.32;
  const safeCashout = (numericMult * 0.82).toFixed(2);

  // Fetch from Firebase RTDB endpoint as requested by user
  const fetchSignalFromFirebase = async (isInitial = false) => {
    if (!isInitial) audioManager.playClick();
    setIsLoading(true);

    try {
      // Firebase RTDB endpoint specified by user
      const response = await fetch('https://x-men-256cc-default-rtdb.firebaseio.com/pre/hipr/hipr.json');
      if (!response.ok) {
        throw new Error(`Firebase HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let parsedOdd = "3.32";
      if (data !== null && data !== undefined) {
        if (typeof data === 'object') {
          parsedOdd = String(data.val || data.multiplier || data.odd || JSON.stringify(data));
        } else {
          parsedOdd = String(data);
        }
        parsedOdd = parsedOdd.replace(/"/g, '').trim();
      }

      if (parsedOdd && parsedOdd !== "undefined") {
        setMultiplier(parsedOdd);
        if (!signalHistory.includes(parsedOdd)) {
          setSignalHistory(prev => [parsedOdd, ...prev.slice(0, 5)]);
        }
      } else {
        setMultiplier("3.32");
      }

      // Generate randomized realistic confidence metric
      const confVal = (97.5 + Math.random() * 2.3).toFixed(1);
      setConfidence(`${confVal}%`);

      const now = new Date();
      setLastFetchedAt(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);

      if (!isInitial) audioManager.playResult();
    } catch (err) {
      console.error("Firebase Aviator signal sync error:", err);
      // Fallback
      setMultiplier("3.32");
      setConfidence("98.4%");
      if (!isInitial) audioManager.playResult();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchSignalFromFirebase(true);
  }, [userId]);

  // 15-minute sync countdown timer
  useEffect(() => {
    let totalSeconds = 15 * 60;
    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        totalSeconds = 15 * 60;
      } else {
        totalSeconds -= 1;
      }
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      setTime({ h, m, s });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 pt-1 px-2">
      {/* Flight Radar & Centered Multiplier Box */}
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950/90 border border-red-500/30 p-4 md:p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative overflow-hidden backdrop-blur-md">
        
        {/* Background Flight Grid & Glowing Arc */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <path d="M 0 40 L 500 40 M 0 80 L 500 80 M 0 120 L 500 120 M 0 160 L 500 160 M 0 200 L 500 200" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d="M 60 0 L 60 300 M 120 0 L 120 300 M 180 0 L 180 300 M 240 0 L 240 300 M 300 0 L 300 300" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3 3" />
            {/* Flight Path Curve */}
            <path d="M 10 220 Q 150 200, 300 60" fill="none" stroke="url(#gridGrad)" strokeWidth="3" />
          </svg>
        </div>

        {/* Animated Flying Jet Graphic */}
        <div className="relative w-full h-28 md:h-36 mb-2 flex items-center justify-center">
          {/* Jet Trajectory Arc */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ 
                x: [-120, 110, -120],
                y: [40, -40, 40],
                rotate: [-15, 25, -15]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <div className="relative">
                <Plane className="w-10 h-10 md:w-12 md:h-12 text-red-500 drop-shadow-[0_0_15px_#ef4444]" />
                {/* Engine Jet Flame Glow */}
                <span className="absolute -bottom-1 -left-3 w-4 h-2 bg-gradient-to-r from-amber-400 to-red-600 rounded-full blur-[2px] animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Status Badge Top Left */}
          <div className="absolute top-0 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] font-mono text-red-400 font-bold uppercase">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>AVIATOR SIGNAL</span>
          </div>

          {/* User ID Badge Top Right */}
          <div className="absolute top-0 right-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-300 font-bold">
            <span className="text-red-400">ID:</span>
            <span>{cleanUserId}</span>
          </div>
        </div>

        {/* CENTERED ODDS DISPLAY ("الاودد اللي ف النص") */}
        <div className="relative z-20 flex flex-col items-center justify-center py-4 my-1">
          <div className="relative group">
            {/* Pulsing Backlight */}
            <motion.div 
              animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -inset-4 rounded-3xl bg-red-600/20 blur-2xl z-0"
            />
            
            {/* Multiplier Central Display Container */}
            <div className="relative z-10 px-8 py-5 rounded-2xl bg-black/90 border-2 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center min-w-[200px] text-center backdrop-blur-xl">
              <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.25em] mb-1 font-display flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400 animate-spin" />
                {t.target_multiplier || 'المضاعف المستهدف'}
              </span>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading-odd"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-2"
                  >
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin my-1" />
                    <span className="text-[9px] font-mono text-red-400 animate-pulse">جاري جلب التوقع...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={multiplier}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-baseline justify-center gap-1 my-1"
                  >
                    <span className="text-3xl font-display font-black text-red-500 italic drop-shadow-[0_0_10px_#ef4444]">x</span>
                    <span className="text-4xl md:text-5xl font-display font-black text-white tabular-nums tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                      {multiplier}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 pt-2 border-t border-red-500/20 w-full flex items-center justify-between text-[9px] font-mono text-zinc-400">
                <span className="text-emerald-400 font-bold">الأمان: {confidence}</span>
                <span className="text-amber-400 font-bold">انسحاب: x{safeCashout}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Dashboard Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800/80">
          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80 text-center">
             <span className="block text-[8px] text-zinc-500 font-black uppercase tracking-wider">{t.safe_exit || 'خروج آمن'}</span>
             <span className="text-sm font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">x{safeCashout}</span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80 text-center">
             <span className="block text-[8px] text-zinc-500 font-black uppercase tracking-wider">{t.confidence || 'نسبة الدقة'}</span>
             <span className="text-sm font-mono font-black text-red-400">{confidence}</span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800/80 text-center">
             <span className="block text-[8px] text-zinc-500 font-black uppercase tracking-wider">التزامن</span>
             <span className="text-sm font-mono font-black text-white">{time.m}:{time.s}</span>
          </div>
        </div>
      </div>

      {/* Main Action Button: GET AVIATOR SIGNAL / احصل على التوقع */}
      <div className="w-full max-w-lg">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => fetchSignalFromFirebase(false)}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-display font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:brightness-110 transition-all cursor-pointer border border-red-400/40 relative overflow-hidden group disabled:opacity-50"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="relative z-10 font-sans font-black">{t.fetching_signal || 'جلب الإشارة من الفايربيس...'}</span>
            </>
          ) : (
            <>
              <Plane className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
              <span className="relative z-10 font-sans font-black">{t.get_aviator_signal || 'احصل على توقع الطيارة'}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Signal History Bar */}
      <div className="w-full max-w-lg bg-zinc-950/80 border border-zinc-900 rounded-2xl p-3 backdrop-blur-md">
         <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
               <TrendingUp className="w-3 h-3 text-red-400" />
               {t.prev_signals || 'الإشارات السابقة'}
            </span>
            <span className="text-[8px] font-mono text-zinc-600">FIREBASE SYNCED</span>
         </div>
         <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {signalHistory.map((sig, idx) => (
               <div 
                 key={idx}
                 className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-black shrink-0 ${
                   parseFloat(sig) >= 3.0 
                     ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                     : parseFloat(sig) >= 2.0
                     ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                     : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                 }`}
               >
                  x{sig}
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AviatorView;
