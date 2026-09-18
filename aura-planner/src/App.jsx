import React, { useState } from 'react';
import HeroLanding from './components/HeroLanding';
import CentralLobby from './components/CentralLobby';
import TimeBlocker from './components/TimeBlocker';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';

export default function App() {
  const [bgUrl, setBgUrl] = useState('');
  const [showCurtain, setShowCurtain] = useState(false);
  const [activeView, setActiveView] = useState('lobby'); // 'lobby', 'blocker', 'calendar', 'timer'

  const handleStartSession = () => {
    setShowCurtain(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans overflow-x-hidden">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-950/30" />
      </div>

      {/* Hero Landing */}
      <div className="relative z-10">
        <HeroLanding 
          onStart={handleStartSession} 
          isExiting={showCurtain}
          bgUrl={bgUrl}
          setBgUrl={setBgUrl}
        />
      </div>

      {/* Glass Curtain Workspace Overlay */}
      <div 
        className={`fixed inset-0 z-20 backdrop-blur-xl bg-slate-950/60 transition-all duration-700 ease-in-out flex items-center justify-center ${
          showCurtain 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none translate-y-8'
        }`}
      >
        <div className="w-full max-h-screen overflow-y-auto">
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
