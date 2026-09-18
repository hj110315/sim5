import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, RefreshCw } from 'lucide-react';

const FALLBACK_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
];

const FALLBACK_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
];

export default function HeroLanding({ onStart, isExiting, setBgUrl, bgUrl }) {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.quotable.io/random?tags=inspirational|motivational');
      if (res.ok) {
        const data = await res.json();
        setQuote({ text: data.content, author: data.author });
      } else {
        throw new Error();
      }
    } catch {
      setQuote(FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]);
    }

    const randomImg = `${FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)]}&sig=${Math.random()}`;
    setBgUrl(randomImg);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomData();
  }, []);

  return (
    <div 
      className={`h-screen w-full flex flex-col justify-between p-6 sm:p-10 select-none transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex justify-end z-10">
        <button 
          onClick={fetchRandomData}
          className="glass-button p-3 text-white/80 hover:text-white"
          title="New Image & Quote"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="my-auto max-w-2xl mx-auto text-center px-4 z-10">
        <div className="glass-panel p-8 sm:p-12">
          <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-4 animate-pulse" />
          <p className="text-2xl sm:text-3xl font-light text-white leading-relaxed italic mb-6">
            "{quote.text}"
          </p>
          <p className="text-sm sm:text-base text-white/80 font-medium uppercase tracking-widest">
            — {quote.author}
          </p>
        </div>
      </div>

      <div className="text-center pb-6 z-10">
        <button
          onClick={onStart}
          className="glass-button px-10 py-5 text-xl font-bold tracking-wide text-white flex items-center gap-3 mx-auto border-2 border-white/40 hover:border-white shadow-2xl hover:scale-105"
        >
          <span>공부 시작하자!^^</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </div>
  );
}
