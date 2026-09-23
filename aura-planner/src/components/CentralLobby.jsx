import React, { useState } from 'react';
import { Zap, HeartHandshake, Clock, Calendar, ArrowLeft, Plus, Trash2, CheckCircle2, Circle, X, RefreshCw } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CentralLobby({ onBackToHero, onNavigate }) {
  const [top3, setTop3] = useLocalStorage('aura_top3', [
    { text: '', done: false },
    { text: '', done: false },
    { text: '', done: false }
  ]);
  
  const [habits, setHabits] = useLocalStorage('aura_habits', [
    { id: 1, name: '20 Mins Reading', completed: false },
    { id: 2, name: 'Guilt-Free Rest / Walk', completed: false }
  ]);
  const [newHabitText, setNewHabitText] = useState('');

  const [deadlines, setDeadlines] = useLocalStorage('aura_deadlines', [
    { id: 1, title: 'Calculus Midterm', dueDate: '2026-09-28', priority: 'High' }
  ]);
  const [newDeadline, setNewDeadline] = useState({ title: '', dueDate: '', priority: 'Medium' });
  const [showAddDeadline, setShowAddDeadline] = useState(false);

  const completedCount = top3.filter(t => t.text.trim() !== '' && t.done).length;
  const activeTaskCount = top3.filter(t => t.text.trim() !== '').length;

  const handleTop3TextChange = (index, val) => {
    const updated = [...top3];
    updated[index].text = val;
    setTop3(updated);
  };

  const toggleTop3Done = (index) => {
    const updated = [...top3];
    updated[index].done = !updated[index].done;
    setTop3(updated);
  };

  const resetTop3 = () => {
    setTop3([
      { text: '', done: false },
      { text: '', done: false },
      { text: '', done: false }
    ]);
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, { id: Date.now(), name: newHabitText.trim(), completed: false }]);
    setNewHabitText(''); // Explicit State Flush
  };

  const addDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title.trim() || !newDeadline.dueDate) return;
    setDeadlines([...deadlines, { id: Date.now(), ...newDeadline }]);
    setNewDeadline({ title: '', dueDate: '', priority: 'Medium' }); // Explicit State Flush
    setShowAddDeadline(false);
  };

  const getDDayTag = (dueDateStr) => {
    if (!dueDateStr) return '';
    const diff = differenceInCalendarDays(parseISO(dueDateStr), new Date());
    if (diff === 0) return 'D-Day';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  return (
    <div className="w-full p-6 text-slate-100 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="glass-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToHero} className="glass-button p-2 text-xs" title="Return to Hero">
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <h1 className="text-lg font-bold tracking-wider text-slate-100">AURA PLANNER</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate && onNavigate('blocker')} 
            className="glass-button px-3.5 py-2 text-xs flex items-center gap-2 hover:border-amber-400/50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Blocker
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('timer')} 
            className="glass-button px-3.5 py-2 text-xs flex items-center gap-2 hover:border-sky-400/50"
          >
            <Clock className="w-3.5 h-3.5 text-sky-300" /> Timer
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('calendar')} 
            className="glass-button px-3.5 py-2 text-xs flex items-center gap-2 hover:border-emerald-400/50"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Calendar
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top 3 Priorities */}
        <div className="glass-panel p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2 text-slate-100">
              <Zap className="w-4 h-4 text-amber-300" /> Today's Top 3
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-amber-400/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-400/30 font-semibold">
                {completedCount}/{activeTaskCount || 3}
              </span>
              <button 
                onClick={resetTop3} 
                className="text-slate-400 hover:text-amber-300 p-1 transition-colors"
                title="Reset Top 3"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {top3.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button 
                  onClick={() => toggleTop3Done(idx)} 
                  disabled={!item.text.trim()}
                  className="text-slate-500 hover:text-amber-300 transition-colors disabled:opacity-30"
                >
                  {item.done ? <CheckCircle2 className="w-5 h-5 text-amber-300" /> : <Circle className="w-5 h-5" />}
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Top Priority #${idx + 1}`}
                    value={item.text}
                    onChange={(e) => handleTop3TextChange(idx, e.target.value)}
                    className={`glass-input w-full text-sm font-medium pr-8 ${
                      item.done ? 'line-through text-slate-400 bg-slate-900/40' : 'text-slate-100'
                    }`}
                  />
                  {item.text && (
                    <button
                      onClick={() => handleTop3TextChange(idx, '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits & Rest */}
        <div className="glass-panel p-6 space-y-5">
          <h2 className="text-base font-bold flex items-center gap-2 text-slate-100">
            <HeartHandshake className="w-4 h-4 text-emerald-300" /> Habits & Rest
          </h2>
          <form onSubmit={addHabit} className="flex gap-2 relative">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Add habit or rest goal..."
                value={newHabitText}
                onChange={(e) => setNewHabitText(e.target.value)}
                className="glass-input w-full text-sm pr-8"
              />
              {newHabitText && (
                <button
                  type="button"
                  onClick={() => setNewHabitText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button type="submit" className="glass-button p-2.5 text-emerald-300"><Plus className="w-4 h-4" /></button>
          </form>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {habits.map((h) => (
              <div key={h.id} className="glass-card p-3 flex justify-between items-center text-sm">
                <div onClick={() => setHabits(habits.map(item => item.id === h.id ? { ...item, completed: !item.completed } : item))} className="flex items-center gap-2.5 cursor-pointer flex-1">
                  <CheckCircle2 className={`w-4 h-4 ${h.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={h.completed ? 'line-through text-slate-400' : 'text-slate-200'}>{h.name}</span>
                </div>
                <button onClick={() => setHabits(habits.filter(item => item.id !== h.id))} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline Radar */}
        <div className="glass-panel p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2 text-slate-100">
              <Clock className="w-4 h-4 text-sky-300" /> Deadline Radar
            </h2>
            <button onClick={() => setShowAddDeadline(!showAddDeadline)} className="glass-button p-1.5 text-xs text-sky-300">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddDeadline && (
            <form onSubmit={addDeadline} className="glass-card p-3.5 space-y-3 text-xs border-sky-400/30">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title (e.g. OS Homework)"
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                  className="glass-input w-full pr-8"
                />
                {newDeadline.title && (
                  <button
                    type="button"
                    onClick={() => setNewDeadline({ ...newDeadline, title: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                type="date"
                value={newDeadline.dueDate}
                onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                className="glass-input w-full text-slate-200"
              />
              <button type="submit" className="glass-button w-full py-2 text-xs font-bold text-sky-300 border-sky-400/40">Add Deadline</button>
            </form>
          )}

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {deadlines.map((d) => (
              <div key={d.id} className="glass-card p-3 border-l-4 border-l-rose-400 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-slate-100">{d.title}</p>
                  <p className="text-xs text-slate-400">{d.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded border border-rose-400/30">
                    {getDDayTag(d.dueDate)}
                  </span>
                  <button onClick={() => setDeadlines(deadlines.filter(item => item.id !== d.id))} className="text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
