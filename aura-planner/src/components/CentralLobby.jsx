import React, { useState } from 'react';
import { Zap, HeartHandshake, Clock, Calendar, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CentralLobby({ onBackToHero }) {
  const [top3, setTop3] = useLocalStorage('aura_top3', ['', '', '']);
  const [habits, setHabits] = useLocalStorage('aura_habits', [
    { id: 1, name: '20 Mins Reading', completed: false },
    { id: 2, name: 'Guilt-Free Rest / Walk', completed: false }
  ]);
  const [newHabitText, setNewHabitText] = useState('');
  const [deadlines] = useLocalStorage('aura_deadlines', [
    { id: 1, title: 'Calculus Midterm', dueDate: '2026-09-28', priority: 'High' },
    { id: 2, title: 'Literature Essay', dueDate: '2026-10-02', priority: 'Medium' }
  ]);

  const handleTop3Change = (index, value) => {
    const updated = [...top3];
    updated[index] = value;
    setTop3(updated);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitText.trim(), completed: false }]);
    setNewHabitText('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div className="w-full p-6 text-white max-w-6xl mx-auto space-y-6">
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToHero} className="glass-button p-2 text-xs" title="Return to Hero">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold tracking-wider">AURA PLANNER</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => alert('Time Blocker module coming next!')} className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Blocker
          </button>
          <button onClick={() => alert('Speed Timer module coming next!')} className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-300" /> Timer
          </button>
          <button onClick={() => alert('Calendar module coming next!')} className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Calendar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-300" /> Today's Top 3 Focus
          </h2>
          <div className="space-y-3">
            {top3.map((item, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Priority #${idx + 1}`}
                value={item}
                onChange={(e) => handleTop3Change(idx, e.target.value)}
                className="glass-input w-full text-sm"
              />
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-300" /> Habits & Rest
          </h2>
          <form onSubmit={addHabit} className="flex gap-2">
            <input
              type="text"
              placeholder="Add habit..."
              value={newHabitText}
              onChange={(e) => setNewHabitText(e.target.value)}
              className="glass-input flex-1 text-sm"
            />
            <button type="submit" className="glass-button p-2">
              <Plus className="w-4 h-4" />
            </button>
          </form>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {habits.map((h) => (
              <div key={h.id} className="glass-card p-3 flex justify-between items-center text-sm">
                <div onClick={() => toggleHabit(h.id)} className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className={`w-4 h-4 ${h.completed ? 'text-emerald-400' : 'text-white/30'}`} />
                  <span className={h.completed ? 'line-through opacity-50' : ''}>{h.name}</span>
                </div>
                <button onClick={() => deleteHabit(h.id)} className="text-white/40 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-300" /> Deadline Radar
          </h2>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.id} className="glass-card p-3 border-l-4 border-l-rose-400 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-white/60">Due: {d.dueDate}</p>
                </div>
                <span className="text-xs bg-rose-500/30 px-2 py-1 rounded text-rose-200">
                  {d.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
