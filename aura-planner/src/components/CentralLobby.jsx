import React, { useState } from 'react';
import { Zap, HeartHandshake, Clock, Calendar, ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
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

  const addDeadline = (e) => {
    e.preventDefault();
    if (!newDeadline.title || !newDeadline.dueDate) return;
    setDeadlines([...deadlines, { id: Date.now(), ...newDeadline }]);
    setNewDeadline({ title: '', dueDate: '', priority: 'Medium' });
    setShowAddDeadline(false);
  };

  const getDDayTag = (dueDateStr) => {
    if (!dueDateStr) return '';
    const diff = differenceInCalendarDays(parseISO(dueDateStr), new Date());
    if (diff === 0) return 'D-Day';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
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
          <button 
            onClick={() => onNavigate && onNavigate('blocker')} 
            className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-amber-500/20"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" /> Blocker
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('timer')} 
            className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-sky-500/20"
          >
            <Clock className="w-3.5 h-3.5 text-sky-300" /> Timer
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('calendar')} 
            className="glass-button px-3 py-1.5 text-xs flex items-center gap-1.5 hover:bg-emerald-500/20"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-300" /> Calendar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-300" /> 오늘의 Top 3
            </h2>
            <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
              {completedCount}/{activeTaskCount || 3}
            </span>
          </div>

          <div className="space-y-3">
            {top3.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button 
                  onClick={() => toggleTop3Done(idx)} 
                  disabled={!item.text.trim()}
                  className="text-white/40 hover:text-amber-300 disabled:opacity-20"
                >
                  {item.done ? <CheckCircle2 className="w-5 h-5 text-amber-300" /> : <Circle className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  placeholder={`Top Priority #${idx + 1}`}
                  value={item.text}
                  onChange={(e) => handleTop3TextChange(idx, e.target.value)}
                  className={`glass-input flex-1 text-sm ${item.done ? 'line-through opacity-50' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-300" /> 습관 & 휴식
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newHabitText.trim()) return;
            setHabits([...habits, { id: Date.now(), name: newHabitText.trim(), completed: false }]);
            setNewHabitText('');
          }} className="flex gap-2">
            <input
              type="text"
              placeholder="Add habit..."
              value={newHabitText}
              onChange={(e) => setNewHabitText(e.target.value)}
              className="glass-input flex-1 text-sm"
            />
            <button type="submit" className="glass-button p-2"><Plus className="w-4 h-4" /></button>
          </form>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {habits.map((h) => (
              <div key={h.id} className="glass-card p-3 flex justify-between items-center text-sm">
                <div onClick={() => setHabits(habits.map(item => item.id === h.id ? { ...item, completed: !item.completed } : item))} className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle2 className={`w-4 h-4 ${h.completed ? 'text-emerald-400' : 'text-white/30'}`} />
                  <span className={h.completed ? 'line-through opacity-50' : ''}>{h.name}</span>
                </div>
                <button onClick={() => setHabits(habits.filter(item => item.id !== h.id))} className="text-white/40 hover:text-rose-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-300" /> 마감기한 레이더
            </h2>
            <button onClick={() => setShowAddDeadline(!showAddDeadline)} className="glass-button p-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddDeadline && (
            <form onSubmit={addDeadline} className="glass-card p-3 space-y-2 text-xs">
              <input
                type="text"
                placeholder="Title (e.g. OS Homework)"
                value={newDeadline.title}
                onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                className="glass-input w-full"
              />
              <input
                type="date"
                value={newDeadline.dueDate}
                onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                className="glass-input w-full text-white/80"
              />
              <button type="submit" className="glass-button w-full py-1.5 text-xs font-bold">Add Deadline</button>
            </form>
          )}

          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {deadlines.map((d) => (
              <div key={d.id} className="glass-card p-3 border-l-4 border-l-rose-400 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{d.title}</p>
                  <p className="text-xs text-white/60">{d.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded border border-rose-400/30">
                    {getDDayTag(d.dueDate)}
                  </span>
                  <button onClick={() => setDeadlines(deadlines.filter(item => item.id !== d.id))} className="text-white/30 hover:text-rose-300">
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
