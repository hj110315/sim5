import React, { useState } from 'react';
import HeroLanding from './components/HeroLanding';
import CentralLobby from './components/CentralLobby';
import TimeBlocker from './components/TimeBlocker';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';

export default function App() {
  const [bgUrl, setBgUrl] = useState('');
  const [showCurtain, setShowCurtain] = useState(false);
  const [activeView, setActiveView] = useState('lobby');

  const handleStartSession = () => {
    setShowCurtain(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Background Image Layer with Preloaded Glass Shield */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/65 to-slate-950/85" />
      </div>

      {/* Hero Landing Layer */}
      <div className="relative z-10">
        <HeroLanding 
          onStart={handleStartSession} 
          isExiting={showCurtain}
          bgUrl={bgUrl}
          setBgUrl={setBgUrl}
        />
      </div>

      {/* Workspace Glass Curtain Overlay */}
      <div 
        className={`fixed inset-0 z-20 backdrop-blur-2xl bg-slate-950/70 transition-all duration-700 ease-in-out flex items-center justify-center ${
          showCurtain 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none translate-y-8'
        }`}
      >
        <div className="w-full max-h-screen overflow-y-auto py-8">
          {activeView === 'lobby' ? (
            <CentralLobby 
              onBackToHero={() => setShowCurtain(false)} 
              onNavigate={(route) => setActiveView(route)}
            />
          ) : activeView === 'blocker' ? (
            <TimeBlocker onBackToLobby={() => setActiveView('lobby')} />
          ) : activeView === 'calendar' ? (
            <CalendarView onBackToLobby={() => setActiveView('lobby')} />
          ) : activeView === 'timer' ? (
            <FocusTimer onBackToLobby={() => setActiveView('lobby')} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
