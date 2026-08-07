import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ChevronLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';

interface AppleViewProps {
  lang: Language;
  t: any;
  userId: string;
}

const AppleView: React.FC<AppleViewProps> = ({ lang, t, userId }) => {
  const [isActionActive, setIsActionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [safeCells, setSafeCells] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidID, setIsValidID] = useState<boolean | null>(null);
  const [time, setTime] = useState({ h: "00", m: "15", s: "00" });

  const oddSequence = ["0.00", "1.23", "1.54", "1.93", "2.41", "4.02", "6.71", "11.18", "27.97", "69.93", "349.68"];
  const currentOdd = oddSequence[currentStep] || oddSequence[oddSequence.length - 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValidID(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const calculateSafeCells = (step: number) => {
    const safeCount = step <= 4 ? 4 : step <= 7 ? 3 : step <= 9 ? 2 : 1;
    const cells = [1, 2, 3, 4, 5];
    
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    
    return cells.slice(0, safeCount);
  };

  const handleLevelOneClick = () => {
    audioManager.playClick();
    setIsActionActive(true);
    setIsLoading(true);
    setSafeCells([]);
    setCurrentStep(1);
    
    setTimeout(() => {
      setIsLoading(false);
      setSafeCells(calculateSafeCells(1));
      audioManager.playResult();
    }, 1500);
  };

  const handleStartClick = () => {
    audioManager.playClick();
    if (currentStep < oddSequence.length - 1) {
      setIsLoading(true);
      setSafeCells([]);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      setTimeout(() => {
        setIsLoading(false);
        setSafeCells(calculateSafeCells(nextStep));
        audioManager.playResult();
      }, 1500);
    }
  };

  const handleResetClick = () => {
    audioManager.playClick();
    setIsActionActive(false);
    setCurrentStep(0);
    setSafeCells([]);
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 pt-2">
      {/* Apple Countdown */}
      <div className="flex items-center justify-center gap-4">
        {[
          { label: t.hours || 'ساعة', value: time.h },
          { label: t.minutes || 'دقيقة', value: time.m },
          { label: t.seconds || 'ثانية', value: time.s }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="relative w-14 h-14 md:w-20 md:h-20 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl z-0"
              />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-[spin_3s_linear_infinite]" />
              
              <div className="absolute inset-[2px] rounded-full bg-zinc-950/80 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                <span className="text-white font-display font-black text-base md:text-2xl tabular-nums drop-shadow-md">
                  {item.value}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Apple Multiplier Display */}
      <div className="w-full max-w-[130px] aspect-[1.8/1] rounded-2xl bg-zinc-950/70 border border-emerald-500/30 flex flex-col items-center justify-center p-2 shadow-[0_0_20px_rgba(34,197,94,0.15)] relative overflow-hidden group backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.15em] mb-0.5 font-display">{t.odds || 'الاحتمال'}</p>
        <div className="flex items-center gap-1">
          <span className="text-emerald-400 font-display font-black text-lg italic">x</span>
          <span className="text-2xl font-display font-black text-white tabular-nums drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]">{currentOdd}</span>
        </div>
      </div>

      {/* Apples Grid Container */}
      <div className="w-full px-4 max-w-lg flex flex-col items-center gap-5">
        <div className="w-full py-8 px-3 md:px-6 rounded-3xl bg-zinc-950/80 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,0.12)] relative overflow-hidden shrink-0 backdrop-blur-md">
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-transparent blur-md pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-emerald-500/20 to-transparent blur-md pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {isValidID === null ? (
              <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest leading-none">{t.verifyingIdentity || 'جاري التحقق...'}</span>
              </motion.div>
            ) : (
              <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center w-full gap-2 md:gap-3" dir="ltr">
                {[1, 2, 3, 4, 5].map((i) => {
                  const isSafe = safeCells.includes(i);
                  const isRevealed = safeCells.length > 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className={`w-14 h-14 md:w-20 md:h-20 relative flex flex-col items-center justify-center rounded-full transition-all duration-300 border-2 overflow-hidden ${
                        isRevealed
                          ? isSafe
                            ? 'bg-emerald-900/90 border-emerald-400 shadow-[0_0_25px_rgba(34,197,94,0.6)] scale-105'
                            : 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'bg-emerald-950/50 border-emerald-500/60 hover:border-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.25)]'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                          </motion.div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-1">
                            {isSafe ? (
                              <motion.img 
                                key="win"
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                src="https://cdn.phototourl.com/free/2026-05-18-61f67480-0081-4d3a-9c67-0ff977815125.png" 
                                alt="Apple"
                                className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(34,197,94,0.6)]"
                                referrerPolicy="no-referrer"
                              />
                            ) : isRevealed ? (
                              <motion.img 
                                key="lose"
                                initial={{ scale: 0 }}
                                animate={{ scale: 0.95 }}
                                src="https://cdn.phototourl.com/free/2026-05-18-eba04c4d-5272-46b8-9371-84a55204f87c.png" 
                                alt="Rotten"
                                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)] opacity-80"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div key="empty" className="w-full h-full rounded-full flex items-center justify-center bg-emerald-900/30">
                                <span className="text-emerald-400 font-mono font-bold text-sm drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">#{i}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Level Switcher Action Buttons */}
        <div className="w-full min-h-[60px]">
          <AnimatePresence mode="wait">
            {!isActionActive ? (
              <motion.button
                key="level-one"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLevelOneClick}
                className="w-full py-4 rounded-2xl bg-transparent border-2 border-emerald-500 text-emerald-400 font-display font-black text-lg uppercase tracking-wider relative overflow-hidden group shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 transition-all flex items-center justify-center gap-3 cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6 flex-shrink-0 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
                <span className="relative z-10 font-sans font-black tracking-wide">{t.levelOne || 'المستوي الاول'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
            ) : (
              <div key="split" className="w-full flex gap-3">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartClick}
                  className="flex-1 py-4 rounded-2xl bg-transparent border-2 border-emerald-500 text-emerald-400 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 transition-all relative overflow-hidden group cursor-pointer backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-emerald-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-emerald-400" />
                  <span className="relative z-10 font-sans font-black">{t.start || 'بدأ'}</span>
                </motion.button>
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetClick}
                  className="flex-1 py-4 rounded-2xl bg-transparent border-2 border-emerald-500 text-emerald-400 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300 transition-all relative overflow-hidden group cursor-pointer backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-emerald-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform text-emerald-400" />
                  <span className="relative z-10 font-sans font-black">{t.reset || 'اعاده بدأ'}</span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppleView;
