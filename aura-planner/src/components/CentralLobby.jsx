import React, { useState } from 'react';
import { 
  Zap, HeartHandshake, Clock, Calendar, ArrowLeft, Plus, Trash2, 
  CheckCircle2, Circle, X, RefreshCw, Battery, BatteryCharging, 
  BatteryLow, Layers, Brain, Sparkles, Check
} from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AssignmentChunker from './components/AssignmentChunker';

export default function CentralLobby({ onBackToHero, onNavigate, onToggleScratchpad }) {
  const [tasks, setTasks] = useLocalStorage('aura_tasks', [
    { id: 1, text: 'Review Calculus Ch. 4 Proofs', done: false, energy: 'high' },
    { id: 2, text: 'Organize Biology Lab Notes', done: false, energy: 'low' },
    { id: 3, text: 'Draft Essay Intro Paragraph', done: false, energy: 'medium' }
  ]);

  const [habits, setHabits] = useLocalStorage('aura_habits', [
    { id: 1, name: '20 Mins Reading', completed: false, isRest: false },
    { id: 2, name: 'Guilt-Free Rest Walk', completed: false, isRest: true }
  ]);

  const [deadlines, setDeadlines] = useLocalStorage('aura_deadlines', [
    { id: 1, title: 'Calculus Midterm', dueDate: '2026-09-28', priority: 'High' }
  ]);

  const [newTaskText, setNewTaskText] = useState('');
  const [selectedEnergy, setSelectedEnergy] = useState('medium');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [showChunker, setShowChunker] = useState(false);

  // Guilt-Free Rest Milestones Counter
  const restMilestonesCount = habits.filter(h => h.isRest && h.completed).length;

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTaskText.trim(), done: false, energy: selectedEnergy }]);
    setNewTaskText('');
  };

  const handleAddChunks = (chunks) => {
    const formatted = chunks.map((c, i) => ({
      id: Date.now() + i,
      text: c.text,
      done: false,
      energy: c.energy
    }));
    setTasks([...tasks, ...formatted]);
  };

  const toggleTaskDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true;
    return t.energy === activeFilter;
  });

  const getDDayTag = (dueDateStr) => {
    if (!dueDateStr) return '';
    const diff = differenceInCalendarDays(parseISO(dueDateStr), new Date());
    if (diff === 0) return 'D-Day';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  return (
    <div className="w-full p-6 text-slate-100 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="glass-panel p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBackToHero} className="glass-button p-2 text-xs" title="Return to Hero">
            <ArrowLeft className="w-4 h-4 text-slate-300" />
          </button>
          <h1 className="text-lg font-bold tracking-wider text-slate-100">AURA PLANNER</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onToggleScratchpad} 
            className="glass-button px-3.5 py-2 text-xs flex items-center gap-2 hover:border-purple-400/50 text-purple-200"
          >
            <Brain className="w-3.5 h-3.5 text-purple-300" /> Scratchpad (Alt+S)
          </button>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Energy-Based Task Router */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-300" />
              <div>
                <h2 className="text-base font-bold text-slate-100">Energy-Based Task Router</h2>
                <p className="text-xs text-slate-400">Match tasks to your current cognitive bandwidth</p>
              </div>
            </div>

            <button 
              onClick={() => setShowChunker(!showChunker)} 
              className="glass-button px-3 py-1.5 text-xs text-amber-300 flex items-center gap-1.5 border-amber-400/30"
            >
              <Layers className="w-3.5 h-3.5" /> Chunk Assignment
            </button>
          </div>

          {/* Expandable Chunking Engine */}
          {showChunker && (
            <AssignmentChunker 
              onAddChunks={handleAddChunks} 
              onClose={() => setShowChunker(false)} 
            />
          )}

          {/* Energy Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'all' ? 'bg-slate-200 text-slate-900' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveFilter('high')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                activeFilter === 'high' ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BatteryCharging className="w-3 h-3 text-amber-400" /> High Focus
            </button>
            <button
              onClick={() => setActiveFilter('medium')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                activeFilter === 'medium' ? 'bg-sky-400/20 text-sky-200 border border-sky-400/50' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Battery className="w-3 h-3 text-sky-400" /> Medium Energy
            </button>
            <button
              onClick={() => setActiveFilter('low')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                activeFilter === 'low' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/50' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <BatteryLow className="w-3 h-3 text-emerald-400" /> Low Energy Wins
            </button>
          </div>

          {/* Add Task Input with Energy Tag Selector */}
          <form onSubmit={addTask} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Add a new goal or action item..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="glass-input w-full text-xs pr-8"
                />
                {newTaskText && (
                  <button
                    type="button"
                    onClick={() => setNewTaskText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button type="submit" className="glass-button p-2 text-amber-300">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Required Energy:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="energy"
                  value="high"
                  checked={selectedEnergy === 'high'}
                  onChange={() => setSelectedEnergy('high')}
                  className="accent-amber-400"
                />
                <span className="text-amber-200">High</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="energy"
                  value="medium"
                  checked={selectedEnergy === 'medium'}
                  onChange={() => setSelectedEnergy('medium')}
                  className="accent-sky-400"
                />
                <span className="text-sky-200">Medium</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="energy"
                  value="low"
                  checked={selectedEnergy === 'low'}
                  onChange={() => setSelectedEnergy('low')}
                  className="accent-emerald-400"
                />
                <span className="text-emerald-200">Low</span>
              </label>
            </div>
          </form>

          {/* Task List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-8">No tasks in this energy tier.</p>
            ) : (
              filteredTasks.map((t) => (
                <div key={t.id} className="glass-card p-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5 flex-1">
                    <button onClick={() => toggleTaskDone(t.id)} className="text-slate-500 hover:text-amber-300">
                      {t.done ? <CheckCircle2 className="w-4 h-4 text-amber-300" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <span className={t.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                      {t.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      t.energy === 'high' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                      t.energy === 'medium' ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30' :
                      'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    }`}>
                      {t.energy.toUpperCase()}
                    </span>
                    <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Rest Validation & Radar */}
        <div className="space-y-6">
          
          {/* Guilt-Free Rest Validation Panel */}
          <div className="glass-panel p-6 space-y-4 border-emerald-400/30">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-100">
                <HeartHandshake className="w-4 h-4 text-emerald-300" /> Guilt-Free Rest Validation
              </h2>
              <span className="text-[10px] font-mono bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                {restMilestonesCount} Claimed
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Downtime is not empty time—it is a cognitive recharge milestone.
            </p>

            <div className="glass-card p-3 space-y-2 border-emerald-400/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Today's Recharge Goal</span>
                <span className="text-emerald-300 font-mono font-bold">{restMilestonesCount}/2 Milestones</span>
              </div>
              <div className="w-full bg-slate-900/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-500" 
                  style={{ width: `${Math.min((restMilestonesCount / 2) * 100, 100)}%` }}
                />
              </div>
              {restMilestonesCount >= 2 && (
                <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 pt-1">
                  <Sparkles className="w-3 h-3" /> Burnout Shield Active: Target rest achieved!
                </p>
              )}
            </div>
          </div>

          {/* Deadline Radar Brief */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold flex items-center gap-2 text-slate-100">
                <Clock className="w-4 h-4 text-sky-300" /> Urgent Radar
              </h2>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {deadlines.map((d) => (
                <div key={d.id} className="glass-card p-2.5 flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{d.title}</span>
                  <span className="font-mono text-rose-300 font-bold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-400/30">
                    {getDDayTag(d.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
