import React, { useState, useEffect } from 'react';
import { Info, Globe, X, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import PlatformSelection from './components/PlatformSelection';
import InfoView from './components/InfoView';
import SettingsView from './components/SettingsView';
import RulesModal from './components/RulesModal';
import ParticlesBackground from './components/ParticlesBackground';
import { ViewState, Platform, GameMode } from './types';
import { translations, Language } from './utils/translations';
import { audioManager } from './utils/audioManager';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('splash');
  const [activeTab, setActiveTab] = useState<'info' | 'conditions' | 'platform'>('platform');
  const [lang, setLang] = useState<Language>('ar');
  const [userId, setUserId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('greenbet');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('aviator');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const rawT = translations[lang];
  
  const processTranslations = (obj: any): any => {
    const platformName = selectedPlatform === 'avabet' ? 'AVABET' : 'GreenBet';
    const newT: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        newT[key] = obj[key].replace(/1xBet/gi, platformName);
      } else {
        newT[key] = obj[key];
      }
    }
    return newT;
  };

  const t = processTranslations(rawT);
  const isArabic = lang === 'ar';

  useEffect(() => {
    const initAudio = () => {
        audioManager.resume();
        document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, []);

  const handleSplashComplete = () => {
    setView('platform_selection');
    setActiveTab('platform');
  };

  const handlePlatformSelect = (p: Platform) => {
    setSelectedPlatform(p);
    setView('settings');
    setActiveTab('conditions');
  };

  const handleConditionsSubmit = (id: string, mode: GameMode) => {
    setUserId(id);
    setSelectedGameMode(mode);
    setView('info');
    setActiveTab('info');
  };

  const handleBack = () => {
    audioManager.playClick();
    if (view === 'settings') {
      setView('platform_selection');
      setActiveTab('platform');
    } else if (view === 'info') {
      setView('platform_selection');
      setActiveTab('platform');
    }
  };
  
  const toggleLanguage = (l: Language) => {
      audioManager.playClick();
      setLang(l);
      setIsLangMenuOpen(false);
  }

  const renderContent = () => {
    if (view === 'platform_selection') {
      return <PlatformSelection onSelect={handlePlatformSelect} t={t} />;
    }

    switch (activeTab) {
      case 'info':
        return (
          <InfoView 
            lang={lang} 
            t={t} 
            userId={userId} 
            platform={selectedPlatform} 
            gameMode={selectedGameMode}
            onGameModeChange={(m) => setSelectedGameMode(m)}
          />
        );
      case 'conditions':
        return <SettingsView onComplete={handleConditionsSubmit} lang={lang} t={t} platform={selectedPlatform} />;
      default:
        return (
          <InfoView 
            lang={lang} 
            t={t} 
            userId={userId} 
            platform={selectedPlatform} 
            gameMode={selectedGameMode}
            onGameModeChange={(m) => setSelectedGameMode(m)}
          />
        );
    }
  };

  return (
    <div dir="ltr" className={isArabic ? 'font-arabic' : 'font-sans'}>
      <ParticlesBackground />
      {view === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div 
        className={`fixed inset-0 bg-transparent text-white flex flex-col transition-opacity duration-1000 ${view === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <header className="px-6 py-4 flex items-center justify-between border-b border-green-500/10 bg-black/40 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            {view !== 'platform_selection' && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 hover:text-green-500 transition-all group active:scale-90"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-green-500 transition-colors" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <img 
                src="https://cdn.phototourl.com/free/2026-07-21-889110f1-fd99-452e-be59-ddcf2182e6c0.jpg" 
                alt="GreenBet Logo" 
                className="w-7 h-7 rounded object-cover border border-green-500/20"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-xl tracking-tighter text-white">
                GREEN<span className="text-green-500">BET</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <button 
                  onClick={() => { audioManager.playClick(); setIsLangMenuOpen(!isLangMenuOpen); }}
                  className={`flex items-center gap-2 h-8 pl-3 pr-2 rounded bg-zinc-900 border transition-all duration-200 group ${isLangMenuOpen ? 'border-green-500 text-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                    <Globe className={`w-3.5 h-3.5 transition-colors ${isLangMenuOpen ? 'text-green-500' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold font-display uppercase tracking-widest">{lang === 'en' ? 'EN' : 'AR'}</span>
                </button>

                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => { audioManager.playClick(); setIsLangMenuOpen(false); }} />
                    <div className="absolute top-full mt-2 w-32 bg-zinc-950 border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200 right-0">
                       <div className="p-1 space-y-0.5">
                          <button
                            onClick={() => toggleLanguage('en')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all ${lang === 'en' ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                          >
                             <span className="text-[10px] font-bold font-display tracking-widest">ENGLISH</span>
                          </button>
                          
                          <button
                            onClick={() => toggleLanguage('ar')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded transition-all ${lang === 'ar' ? 'bg-green-500/20 text-green-400' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                          >
                             <span className="text-[10px] font-bold font-display tracking-widest">ARABIC</span>
                          </button>
                       </div>
                    </div>
                  </>
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                  backgroundImage: 'linear-gradient(#15803d 1px, transparent 1px), linear-gradient(90deg, #15803d 1px, transparent 1px)', 
                  backgroundSize: '40px 40px'
              }} 
            />
            <div className="h-full w-full max-w-lg mx-auto relative z-10">
                {renderContent()}
            </div>
        </main>

        {showInfoModal && <RulesModal onClose={() => { audioManager.playClick(); setShowInfoModal(false); }} lang={lang} t={t} />}
      </div>
    </div>
  );
};

export default App;