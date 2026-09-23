import React, { useState, useEffect } from 'react';
import { Brain, X, Plus, Trash2, Check } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ScratchpadSidebar({ isOpen, onClose }) {
  const [thoughts, setThoughts] = useLocalStorage('aura_scratchpad_thoughts', []);
  const [inputVal, setInputVal] = useState('');

  // Hotkey support (Alt + S) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const addThought = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setThoughts([
      {
        id: Date.now(),
        text: inputVal.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...thoughts
    ]);
    setInputVal('');
  };

  const removeThought = (id) => {
    setThoughts(thoughts.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setThoughts([]);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 sm:w-96 z-50 glass-panel haze-lobby border-l border-white/20 p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">Intrusive Thought Dump</h2>
              <p className="text-[10px] text-slate-400">Offload distractions without breaking flow</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Input */}
        <form onSubmit={addThought} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Dump thought (e.g. reply to email)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="glass-input w-full text-xs pr-7"
              autoFocus={isOpen}
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button type="submit" className="glass-button p-2 text-amber-300">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Thought Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
          {thoughts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic space-y-1">
              <p>Mind is clear.</p>
              <p className="text-[10px]">Type any random thought above to safely log it.</p>
            </div>
          ) : (
            thoughts.map((t) => (
              <div
                key={t.id}
                className="glass-card p-3 text-xs flex justify-between items-start gap-2 border-l-2 border-l-amber-400/60"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-slate-200 break-words font-medium">{t.text}</p>
                  <span className="text-[9px] font-mono text-slate-500">{t.timestamp}</span>
                </div>
                <button
                  onClick={() => removeThought(t.id)}
                  className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                  title="Dismiss thought"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer controls */}
      {thoughts.length > 0 && (
        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-mono">{thoughts.length} logged items</span>
          <button
            onClick={clearAll}
            className="text-[10px] text-rose-300 hover:underline flex items-center gap-1 font-mono"
          >
            <Trash2 className="w-3 h-3" /> Clear Dump
          </button>
        </div>
      )}
    </div>
  );
}
