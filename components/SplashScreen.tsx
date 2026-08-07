import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const duration = 3500; 
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        
        if (next > 15 && next < 40) setLoadingText("CONNECTING SECURE SERVER");
        else if (next > 40 && next < 65) setLoadingText("ANALYZING MARKET DATA");
        else if (next > 65 && next < 85) setLoadingText("DECRYPTING VIP SIGNALS");
        else if (next > 85) setLoadingText("ACCESS GRANTED");

        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, duration - 600); 

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (opacity === 0 && progress >= 100) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent overflow-hidden transition-opacity duration-700 ease-out font-sans"
      style={{ opacity }}
    >
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{ 
             backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
             WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }} 
      />
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black/80 to-black pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center transform transition-transform duration-1000 scale-100">
        
        <div className="relative mb-10 group">
           <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse"></div>
           
           <div className="relative w-28 h-28 bg-zinc-950 border border-green-500/40 rounded-2xl flex items-center justify-center transform rotate-45 shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent z-20 pointer-events-none"></div>
              <div className="absolute inset-1.5 border border-dashed border-green-500/30 rounded-xl animate-[spin_12s_linear_infinite] z-30 pointer-events-none"></div>
              
              <div className="transform -rotate-45 relative w-full h-full flex items-center justify-center p-4">
                 <img
                   src="https://cdn.phototourl.com/free/2026-07-21-889110f1-fd99-452e-be59-ddcf2182e6c0.jpg"
                   alt="GreenBet Logo"
                   className="w-full h-full object-contain rounded-lg"
                   referrerPolicy="no-referrer"
                 />
              </div>
           </div>
        </div>

        <div className="flex flex-col items-center space-y-3 mb-12">
            <h1 className="text-4xl font-display font-black tracking-tighter text-white">
              GREEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">BET</span>
            </h1>
            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center w-64">
           <div className="flex justify-between w-full text-[10px] font-mono font-bold text-green-500 mb-2 uppercase tracking-widest">
              <span className="animate-pulse">{loadingText}</span>
              <span className="font-display">{Math.round(progress)}%</span>
           </div>
           <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
              <div className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              <div 
                className="h-full bg-gradient-to-r from-green-600 to-emerald-400 shadow-[0_0_10px_#22c55e] transition-all duration-75 ease-out relative z-10"
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-[9px] text-zinc-600 font-mono tracking-[0.2em] opacity-60">
        VER 3.0.0 • ENCRYPTED CONNECTION
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;