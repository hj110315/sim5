import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon, Sparkles, Trash2, Anchor, RefreshCw, X, HeartHandshake } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CATEGORIES = [
  { id: 'study', label: 'Academic / Study', color: 'bg-amber-500/20 border-amber-400/40 text-amber-200' },
  { id: 'rest', label: 'Guilt-Free Rest Milestone', color: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200', isRest: true },
  { id: 'social', label: 'Social & Fun', color: 'bg-sky-500/20 border-sky-400/40 text-sky-200' },
  { id: 'routine', label: 'Routine / Meals', color: 'bg-purple-500/20 border-purple-400/40 text-purple-200' },
];

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
  const [reanchorNotice, setReanchorNotice] = useState('');

  const todayKey = new Date().toISOString().split('T')[0];
  const todayBlocks = blocks[todayKey] || {};

  const handleSlotClick = (slot) => {
    const updatedToday = { ...todayBlocks };
    if (updatedToday[slot]) {
      delete updatedToday[slot];
    } else {
      const catObj = CATEGORIES.find(c => c.id === selectedCategory);
      updatedToday[slot] = {
        title: blockLabel.trim() || catObj.label,
        category: selectedCategory,
        style: catObj.color,
        isRest: catObj.isRest || false
      };
      setBlockLabel(''); 
    }
    setBlocks({ ...blocks, [todayKey]: updatedToday });
  };

  // 1-Click "Re-anchor Day" Algorithm
  const handleReanchorDay = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes() >= 30 ? '30' : '00';
    const currentTimeSlot = `${String(currentHour).padStart(2, '0')}:${currentMin}`;

    const updatedToday = { ...todayBlocks };
    const orphanedTasks = [];

    // Collect unfulfilled tasks from past time slots
    TIME_SLOTS.forEach((slot) => {
      if (slot < currentTimeSlot && updatedToday[slot]) {
        orphanedTasks.push(updatedToday[slot]);
        delete updatedToday[slot]; // Wipe past missed slots cleanly
      }
    });

    // Re-assign orphaned tasks to upcoming available slots starting from current time
    let availableSlotIndex = TIME_SLOTS.indexOf(currentTimeSlot);
    let shiftedCount = 0;

    orphanedTasks.forEach((task) => {
      while (availableSlotIndex < TIME_SLOTS.length) {
        const slotKey = TIME_SLOTS[availableSlotIndex];
        if (!updatedToday[slotKey]) {
          updatedToday[slotKey] = task;
          shiftedCount++;
          availableSlotIndex++;
          break;
        }
        availableSlotIndex++;
      }
    });

    setBlocks({ ...blocks, [todayKey]: updatedToday });
    setReanchorNotice(`Day Re-anchored: Cleared past slots and pushed ${shiftedCount} remaining task(s) forward.`);
    setTimeout(() => setReanchorNotice(''), 5000);
  };

  return (
    <div className="w-full p-6 text-slate-100 max-w-5xl mx-auto space-y-6">
      <header className="glass-panel p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBackToLobby} className="glass-button p-2 text-xs" title="Return to Lobby">
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-slate-100">30-MIN TIME BLOCKER</h1>
            <p className="text-xs text-slate-400">Structure focus and claim guilt-free rest milestones</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleReanchorDay} 
            className="glass-button px-3.5 py-2 text-xs text-amber-300 flex items-center gap-2 border-amber-400/40 hover:bg-amber-400/10"
            title="Clean past missed slots and push items forward"
          >
            <Anchor className="w-3.5 h-3.5" /> 1-Click Re-anchor
          </button>
        </div>
      </header>

      {reanchorNotice && (
        <div className="glass-panel p-3 bg-amber-500/10 border-amber-400/40 text-xs text-amber-200 text-center font-medium animate-pulse">
          {reanchorNotice}
        </div>
      )}

      <div className="glass-panel p-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Custom activity label (e.g. Organic Chem, Reading)..."
            value={blockLabel}
            onChange={(e) => setBlockLabel(e.target.value)}
            className="glass-input w-full text-sm pr-8"
          />
          {blockLabel && (
            <button
              onClick={() => setBlockLabel('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} scale-105 border-white/50 shadow-md`
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 space-y-3">
        <div className="flex justify-between items-center pb-2 text-xs font-semibold text-slate-400 border-b border-white/10">
          <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-300" /> Morning & Afternoon</span>
          <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-sky-300" /> Evening & Night</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 max-h-[520px] overflow-y-auto pr-2">
          {TIME_SLOTS.map((slot) => {
            const activeData = todayBlocks[slot];
            return (
              <div
                key={slot}
                onClick={() => handleSlotClick(slot)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  activeData
                    ? `${activeData.style} shadow-sm`
                    : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 text-slate-400'
                }`}
              >
                <span className="font-mono font-bold w-12 text-slate-300">{slot}</span>
                <span className="flex-1 text-center font-medium truncate px-2 text-slate-200 flex items-center justify-center gap-1.5">
                  {activeData?.isRest && <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />}
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
