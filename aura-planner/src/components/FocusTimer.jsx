import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

export default function FocusTimer({ onBackToLobby }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full p-6 text-slate-100 max-w-2xl mx-auto space-y-6">
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLobby} className="glass-button p-2 text-xs" title="Return to Lobby">
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <h1 className="text-lg font-bold tracking-wider text-slate-100">FOCUS TIMER</h1>
        </div>
      </header>

      <div className="glass-panel p-8 text-center space-y-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => resetTimer('work')}
            className={`glass-button px-4 py-2 text-xs flex items-center gap-2 ${
              mode === 'work' ? 'border-amber-400 bg-amber-400/20 text-amber-200' : 'text-slate-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Deep Work (25m)
          </button>
          <button
            onClick={() => resetTimer('break')}
            className={`glass-button px-4 py-2 text-xs flex items-center gap-2 ${
              mode === 'break' ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200' : 'text-slate-400'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-300" /> Rest Break (5m)
          </button>
        </div>

        <div className="text-7xl font-mono font-bold tracking-tight text-slate-100 drop-shadow-lg">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="glass-button px-8 py-3 text-sm font-bold text-amber-300 border-amber-400/50 hover:bg-amber-400/20 flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => resetTimer(mode)}
            className="glass-button p-3 text-slate-400 hover:text-slate-100"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
