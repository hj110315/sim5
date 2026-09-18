import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Sparkles, Trophy, Coffee } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PRESETS = [
  { id: 'focus', label: 'Deep Focus', minutes: 25, color: 'text-amber-300 border-amber-400/40 bg-amber-500/20' },
  { id: 'shortBreak', label: 'Short Break', minutes: 5, color: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/20' },
  { id: 'longBreak', label: 'Rest & Recharge', minutes: 15, color: 'text-sky-300 border-sky-400/40 bg-sky-500/20' },
];

export default function FocusTimer({ onBackToLobby }) {
  const [activePreset, setActivePreset] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useLocalStorage('aura_timer_stats', { completedSessions: 0, totalFocusMinutes: 0 });

  const currentPresetObj = PRESETS.find(p => p.id === activePreset);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (activePreset === 'focus') {
        setStats({
          completedSessions: stats.completedSessions + 1,
          totalFocusMinutes: stats.totalFocusMinutes + currentPresetObj.minutes
        });
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activePreset, currentPresetObj, setStats, stats]);

  const selectPreset = (preset) => {
    setIsRunning(false);
    setActivePreset(preset.id);
    setTimeLeft(preset.minutes * 60);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentPresetObj.minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = ((currentPresetObj.minutes * 60 - timeLeft) / (currentPresetObj.minutes * 60)) * 100;

  return (
    <div className="w-full p-6 text-white max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLobby} className="glass-button p-2 text-xs" title="Return to Lobby">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-300" /> FOCUS & POMODORO TIMER
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
          <Trophy className="w-3.5 h-3.5 text-amber-300" />
          <span>{stats.completedSessions} Sessions ({stats.totalFocusMinutes}m)</span>
        </div>
      </header>

      {/* Main Timer Display */}
      <div className="glass-panel p-8 text-center space-y-8 relative overflow-hidden">
        {/* Progress Bar Top Edge */}
        <div 
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-emerald-400 transition-all duration-500" 
          style={{ width: `${progressPercent}%` }} 
        />

        {/* Mode Selector Buttons */}
        <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPreset(p)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                activePreset === p.id 
                  ? `${p.color} scale-105 shadow-lg border-white/60` 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {p.label} ({p.minutes}m)
            </button>
          ))}
        </div>

        {/* Digital Clock Screen */}
        <div className="py-6">
          <div className="text-7xl sm:text-8xl font-mono font-bold tracking-tighter drop-shadow-lg text-white">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-white/60 uppercase tracking-widest mt-4 flex items-center justify-center gap-1">
            {activePreset === 'focus' ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Coffee className="w-3.5 h-3.5 text-emerald-300" />}
            {isRunning ? 'Timer Running...' : 'Timer Paused'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`glass-button px-8 py-4 text-lg font-bold flex items-center gap-2 border-2 ${
              isRunning ? 'border-rose-400/60 text-rose-200' : 'border-emerald-400/60 text-emerald-200'
            }`}
          >
            {isRunning ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5 fill-current" /> Start</>}
          </button>
          <button
            onClick={resetTimer}
            className="glass-button p-4 text-white/70 hover:text-white"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
