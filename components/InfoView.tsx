import React, { useState, useEffect } from 'react';
import { Users, Radio, User } from 'lucide-react';
import { Platform, GameMode } from '../types';
import { Language } from '../utils/translations';
import { audioManager } from '../utils/audioManager';
import AppleView from './AppleView';
import AviatorView from './AviatorView';

interface InfoViewProps {
  lang: Language;
  t: any;
  userId: string;
  platform: Platform;
  gameMode?: GameMode;
  onGameModeChange?: (mode: GameMode) => void;
}

const InfoView: React.FC<InfoViewProps> = ({ 
  lang, 
  t, 
  userId, 
  platform, 
  gameMode: initialGameMode = 'aviator',
  onGameModeChange
}) => {
  const [activeGameMode, setActiveGameMode] = useState<GameMode>(initialGameMode);
  const [onlineUsers, setOnlineUsers] = useState(2450);

  const platformName = platform === 'avabet' ? "AVABET" : "GreenBet";
  const isAdmin = userId.startsWith("ADMIN_SESS_PROTOCOL_");
  const cleanUserId = isAdmin ? userId.replace("ADMIN_SESS_PROTOCOL_", "") : userId;

  useEffect(() => {
    setActiveGameMode(initialGameMode);
  }, [initialGameMode]);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    }, 3000);
    return () => clearInterval(statsInterval);
  }, []);

  const handleSwitchGameMode = (mode: GameMode) => {
    audioManager.playClick();
    setActiveGameMode(mode);
    if (onGameModeChange) {
      onGameModeChange(mode);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent h-full pb-8">
      <div className="relative z-10 flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Top Online Users Header */}
        <div className="bg-transparent border-b border-white/10 px-4 py-3 backdrop-blur-[2px]">
          <div className="max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-950/40 via-zinc-950/80 to-green-950/40 border border-green-500/30 px-4 py-2.5 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex items-center justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 opacity-40 animate-pulse pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center relative shadow-[0_0_12px_rgba(34,197,94,0.2)] shrink-0">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-wider uppercase text-green-400 font-display flex items-center gap-1">
                    <Radio className="w-3 h-3 text-green-400 animate-pulse" />
                    {t.onlineUsers || 'المستخدمين الان'}
                  </span>
                  <span className="text-[8px] text-zinc-400 font-mono tracking-tight">Active Live Network</span>
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-end">
                <div className="flex items-baseline gap-1 font-mono font-black text-lg text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] tabular-nums">
                  <span className="text-green-400 text-xs font-sans">+</span>
                  {onlineUsers.toLocaleString()}
                </div>
                <span className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="w-full px-5 flex justify-between items-center py-2 border-b border-zinc-900/50">
          <div className="flex flex-col gap-0.5">
             <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest font-display">Auth Status</span>
             <div className="flex items-center gap-1.5">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-green-500">{t.system_active}</span>
             </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1 rounded-md border border-zinc-800">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-300 tracking-wider">{`${platformName} ID: ${cleanUserId}`}</span>
          </div>
        </div>

        {/* Game Mode Switcher Tab Bar */}
        <div className="w-full px-4 pt-3 pb-1">
          <div className="max-w-lg mx-auto bg-black/80 border border-zinc-800 p-1 rounded-2xl flex gap-1 shadow-lg">
            {/* Apple Button */}
            <button
              onClick={() => handleSwitchGameMode('apple')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeGameMode === 'apple'
                  ? 'bg-gradient-to-r from-emerald-900 to-green-800 text-white border border-emerald-400/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span className="text-base">🍎</span>
              <span>{t.apple_game || 'التفاحة'}</span>
            </button>

            {/* Aviator Button */}
            <button
              onClick={() => handleSwitchGameMode('aviator')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-sans font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeGameMode === 'aviator'
                  ? 'bg-gradient-to-r from-red-900 to-rose-800 text-white border border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span className="text-base">✈️</span>
              <span>{t.aviator_game || 'الطيارة'}</span>
            </button>
          </div>
        </div>

        {/* Active Game Prediction View */}
        <div className="flex-1 px-2 py-2">
          {activeGameMode === 'apple' ? (
            <AppleView lang={lang} t={t} userId={userId} />
          ) : (
            <AviatorView lang={lang} t={t} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoView;
