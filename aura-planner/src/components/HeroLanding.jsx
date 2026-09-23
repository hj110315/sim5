import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, RefreshCw, Quote as QuoteIcon, Sparkles } from 'lucide-react';

// Curated High-Definition Fallback Wallpapers (Nature & Minimalist Themes)
const FALLBACK_WALLPAPERS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80'
];

// Curated Motivational & Focus Quotes
const FALLBACK_QUOTES = [
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "Simplicity is the prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Your focus determines your reality.", author: "George Lucas" }
];

export default function HeroLanding({ onStart, isExiting, bgUrl, setBgUrl }) {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [timeStr, setTimeStr] = useState('');
  const [greeting, setGreeting] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Digital Clock & Greeting Calculator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      let currentGreeting = 'Good Evening';
      if (hours >= 5 && hours < 12) currentGreeting = 'Good Morning';
      else if (hours >= 12 && hours < 18) currentGreeting = 'Good Afternoon';

      setGreeting(currentGreeting);
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Buffer Preloader for Background Wallpaper
  const preloadAndApplyWallpaper = useCallback((targetUrl) => {
    setIsRefreshing(true);
    const img = new Image();
    img.src = targetUrl;
    img.onload = () => {
      setBgUrl(targetUrl);
      sessionStorage.setItem('aura_cached_bg', targetUrl);
      setIsRefreshing(false);
    };
    img.onerror = () => {
      // Fallback to first verified image if custom load fails
      setBgUrl(FALLBACK_WALLPAPERS[0]);
      sessionStorage.setItem('aura_cached_bg', FALLBACK_WALLPAPERS[0]);
      setIsRefreshing(false);
    };
  }, [setBgUrl]);

  // Select Random Items from Fallback Pools
  const pickRandomWallpaper = useCallback(() => {
    const filtered = FALLBACK_WALLPAPERS.filter(url => url !== bgUrl);
    const randomUrl = filtered[Math.floor(Math.random() * filtered.length)];
    preloadAndApplyWallpaper(randomUrl);
  }, [bgUrl, preloadAndApplyWallpaper]);

  const pickRandomQuote = useCallback(() => {
    const filtered = FALLBACK_QUOTES.filter(q => q.quote !== quote.quote);
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    setQuote(randomQuote);
    sessionStorage.setItem('aura_cached_quote', JSON.stringify(randomQuote));
  }, [quote.quote]);

  // Initial Load with Session Caching Strategy
  useEffect(() => {
    const cachedBg = sessionStorage.getItem('aura_cached_bg');
    const cachedQuote = sessionStorage.getItem('aura_cached_quote');

    if (cachedBg) {
      setBgUrl(cachedBg);
    } else {
      pickRandomWallpaper();
    }

    if (cachedQuote) {
      try {
        setQuote(JSON.parse(cachedQuote));
      } catch {
        pickRandomQuote();
      }
    } else {
      pickRandomQuote();
    }
  }, [setBgUrl, pickRandomWallpaper, pickRandomQuote]);

  const handleShuffleAll = () => {
    pickRandomWallpaper();
    pickRandomQuote();
  };

  return (
    <div 
      className={`min-h-screen w-full flex flex-col justify-between p-8 sm:p-12 transition-all duration-700 ${
        isExiting ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'
      }`}
    >
      {/* Top Bar Navigation */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto z-10">
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-slate-300 bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AURA WORKSPACE v2.0</span>
        </div>

        <button
          onClick={handleShuffleAll}
          disabled={isRefreshing}
          className="glass-button px-3.5 py-2 text-xs flex items-center gap-2 hover:border-amber-400/40 text-slate-200"
          title="Shuffle Background & Quote"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh Scene</span>
        </button>
      </header>

      {/* Main Center Display */}
      <main className="w-full max-w-4xl mx-auto text-center space-y-6 my-auto z-10">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold drop-shadow">
            {greeting}
          </p>
          <h1 className="text-6xl sm:text-8xl font-mono font-bold tracking-tight text-slate-100 drop-shadow-2xl">
            {timeStr || '00:00:00'}
          </h1>
        </div>

        {/* Motivational Quote Glass Panel */}
        <div className="glass-panel p-6 sm:p-8 max-w-2xl mx-auto space-y-3 relative overflow-hidden group border-white/15">
          <QuoteIcon className="w-6 h-6 text-amber-300/40 mx-auto" />
          <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
            "{quote.quote || 'Focus on being productive instead of busy.'}"
          </p>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
            — {quote.author || 'Aura Planner'}
          </p>
        </div>

        {/* Start Session Call to Action */}
        <div className="pt-4">
          <button
            onClick={onStart}
            className="glass-button px-10 py-4 text-base font-bold text-slate-100 border-2 border-amber-400/50 hover:border-amber-300 hover:bg-amber-400/20 shadow-xl inline-flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <span>Enter Planner</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>
        </div>
      </main>

      {/* Footer Minimal Tag */}
      <footer className="w-full text-center text-xs text-slate-400/80 font-mono z-10">
        Designed for Intentional Studying & Rest
      </footer>
    </div>
  );
}
