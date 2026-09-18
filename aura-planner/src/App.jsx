import React, { useState } from 'react';
import HeroLanding from './components/HeroLanding';
import CentralLobby from './components/CentralLobby';

export default function App() {
  const [bgUrl, setBgUrl] = useState('');
  const [showLobby, setShowLobby] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartSession = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLobby(true);
    }, 400); // Trigger curtain blur overlay halfway through scale down
  };

  const handleBackToHero = () => {
    setShowLobby(false);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans overflow-x-hidden">
      {/* Background Visual Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-950/30" />
      </div>

      {/* Hero Landing Layer */}
      <div className="relative z-10">
        <HeroLanding 
          onStart={handleStartSession} 
          isExiting={isTransitioning}
          bgUrl={bgUrl}
          setBgUrl={setBgUrl}
        />
      </div>

      {/* Glass-Curtain Fade Layer */}
      <div 
        className={`fixed inset-0 z-20 backdrop-blur-xl bg-slate-950/60 transition-all duration-700 ease-in-out flex items-center justify-center ${
          showLobby 
            ? 'opacity-100 pointer-events-auto translate-y-0' 
            : 'opacity-0 pointer-events-none translate-y-8'
        }`}
      >
        <div className="w-full max-h-screen overflow-y-auto">
          <CentralLobby onBackToHero={handleBackToHero} />
        </div>
      </div>
    </div>
  );
}
