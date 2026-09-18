import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon, Sparkles, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CATEGORIES = [
  { id: 'study', label: 'Academic / Study', color: 'bg-amber-500/30 border-amber-400/50 text-amber-200' },
  { id: 'rest', label: 'Guilt-Free Rest', color: 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200' },
  { id: 'social', label: 'Social & Fun', color: 'bg-sky-500/30 border-sky-400/50 text-sky-200' },
  { id: 'routine', label: 'Routine / Meals', color: 'bg-purple-500/30 border-purple-400/50 text-purple-200' },
];

// Generate 30-minute time slots from 06:00 to 24:00
const GENERATE_TIME_SLOTS = () => {
  const slots = [];
  for (let hour = 6; hour < 24; hour++) {
    const formattedHour = String(hour).padStart(2, '0');
    slots.push(`${formattedHour}:00`);
    slots.push(`${formattedHour}:30`);
  }
  return slots;
};

const TIME_SLOTS = GENERATE_TIME_SLOTS();

export default function TimeBlocker({ onBackToLobby }) {
  const [selectedCategory, setSelectedCategory] = useState('study');
  const [blockLabel, setBlockLabel] = useState('');
  const [blocks, setBlocks] = useLocalStorage('aura_time_blocks', {});

  const todayKey = new Date().toISOString().split('T')[0];
  const todayBlocks = blocks[todayKey] || {};

  const handleSlotClick = (slot) => {
    const updatedToday = { ...todayBlocks };
    if (updatedToday[slot]) {
      // Toggle off if clicking existing block
      delete updatedToday[slot];
    } else {
      // Assign active category and text
      const catObj = CATEGORIES.find(c => c.id === selectedCategory);
      updatedToday[slot] = {
        title: blockLabel.trim() || catObj.label,
        category: selectedCategory,
        style: catObj.color,
      };
    }
    setBlocks({ ...blocks, [todayKey]: updatedToday });
  };

  const clearDaySchedule = () => {
    const updated = { ...blocks };
    delete updated[todayKey];
    setBlocks(updated);
  };

  return (
    <div className="w-full p-6 text-white max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <header className="glass-panel p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLobby} className="glass-button p-2 text-xs" title="Return to Lobby">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wider">30-MIN TIME BLOCKER</h1>
            <p className="text-xs text-white/60">Proactive daily mapping with intentional downtime</p>
          </div>
        </div>
        <button onClick={clearDaySchedule} className="glass-button px-3 py-1.5 text-xs text-rose-300 flex items-center gap-1.5 hover:bg-rose-500/20">
          <Trash2 className="w-3.5 h-3.5" /> Clear Today
        </button>
      </header>

      {/* Control Panel: Label Input & Category Selector */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Block activity (e.g. Organic Chem, Reading, Nap)..."
            value={blockLabel}
            onChange={(e) => setBlockLabel(e.target.value)}
            className="glass-input flex-1 text-sm"
          />
        </div>

        {/* Category Color Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} scale-105 shadow-md border-white/60`
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 30-Minute Schedule Grid */}
      <div className="glass-panel p-6 space-y-2">
        <div className="flex justify-between items-center pb-2 text-xs font-semibold text-white/50 border-b border-white/10">
          <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-300" /> Morning & Afternoon</span>
          <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-sky-300" /> Evening & Night</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 max-h-[550px] overflow-y-auto pr-2">
          {TIME_SLOTS.map((slot) => {
            const activeData = todayBlocks[slot];
            return (
              <div
                key={slot}
                onClick={() => handleSlotClick(slot)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${
                  activeData
                    ? activeData.style
                    : 'bg-white/5 border-white/10 hover:bg-white/15 text-white/70'
                }`}
              >
                <span className="font-mono font-bold w-14 text-white/80">{slot}</span>
                <span className="flex-1 text-center font-medium truncate px-2">
                  {activeData ? activeData.title : '— Free Slot —'}
                </span>
                <Sparkles className={`w-3.5 h-3.5 ${activeData ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
