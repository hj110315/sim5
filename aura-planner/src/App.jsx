import React, { useState, useEffect } from 'react';
import HeroLanding from './components/HeroLanding';
import CentralLobby from './components/CentralLobby';
import TimeBlocker from './components/TimeBlocker';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';
import ScratchpadSidebar from './components/ScratchpadSidebar';

export default function App() {
  const [bgUrl, setBgUrl] = useState('');
  const [showCurtain, setShowCurtain] = useState(false);
  const [activeView, setActiveView] = useState('lobby'); // 'lobby' | 'blocker' | 'calendar' | 'timer'
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [circadianClass, setCircadianClass] = useState('circadian-day');

  // Circadian Glass Tinting Calculator based on local hour
  useEffect(() => {
    const updateCircadianMode = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) {
        setCircadianClass('circadian-day');
      } else if (hour >= 17 && hour < 21) {
        setCircadianClass('circadian-sunset');
      } else {
        setCircadianClass('circadian-night');
      }
    };

    updateCircadianMode();
    const interval = setInterval(updateCircadianMode, 60000); // Check every min
    return () => clearInterval(interval);
  }, []);

  // Contextual Glass Haze Shift Mapper
  const getContextualHazeClass = () => {
    switch (activeView) {
      case 'timer': return 'haze-focus';
      case 'blocker': return 'haze-rest';
      default: return 'haze-lobby';
    }
  };

  return (
    <div className={`relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200 ${circadianClass}`}>
      {/* Dynamic Background Image Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: bgUrl ? `url(${bgUrl})` : 'none' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/65 to-slate-950/85" />
      </div>

      {/* Hero Landing View */}
      <div className="relative z-10">
        <HeroLanding 
          onStart={() => setShowCurtain(true)} 
          isExiting={showCurtain}
          bgUrl={bgUrl}
          setBgUrl={setBgUrl}
        />
      </div>

      {/* Workspace Glass Overlay Layer with Contextual Haze Shifts */}
      <div 
        className={`fixed inset-0 z-20 bg-slate-950/70 transition-all duration-700 ease-in-out flex items-center justify-center ${getContextualHazeClass()} ${
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
              onToggleScratchpad={() => setIsScratchpadOpen(!isScratchpadOpen)}
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

      {/* Intrusive Thought Scratchpad Sidebar Component */}
      <ScratchpadSidebar 
        isOpen={isScratchpadOpen} 
        onClose={() => setIsScratchpadOpen(false)} 
      />
    </div>
  );
}
