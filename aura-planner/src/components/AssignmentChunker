import React, { useState } from 'react';
import { Layers, Sparkles, Plus, Check, X } from 'lucide-react';

export default function AssignmentChunker({ onAddChunks, onClose }) {
  const [title, setTitle] = useState('');
  const [energyLevel, setEnergyLevel] = useState('medium');

  const handleChunk = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Subtask Generator: Creates 4 bite-sized 20-minute action steps
    const chunks = [
      { text: `[1/4] Outline & define scope for: ${title}`, energy: 'low', done: false },
      { text: `[2/4] Gather core research & references for: ${title}`, energy: 'medium', done: false },
      { text: `[3/4] Draft primary section / prototype for: ${title}`, energy: 'high', done: false },
      { text: `[4/4] Review, polish, & verify formatting for: ${title}`, energy: 'low', done: false }
    ];

    onAddChunks(chunks);
    setTitle('');
    onClose();
  };

  return (
    <div className="glass-panel p-5 space-y-4 border-amber-400/30">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-300" />
          <h3 className="text-sm font-bold text-slate-100">Assignment Chunking Engine</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Overcome starting friction. Input a large assignment title to automatically decompose it into 4 bite-sized, 20-minute action steps.
      </p>

      <form onSubmit={handleChunk} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. 10-Page Organic Chemistry Paper..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input w-full text-xs pr-8"
            autoFocus
          />
          {title && (
            <button
              type="button"
              onClick={() => setTitle('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="glass-button w-full py-2 text-xs font-bold text-amber-300 border-amber-400/40 hover:bg-amber-400/20 flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <Sparkles className="w-3.5 h-3.5" /> Generate 4 Action Chunks
        </button>
      </form>
    </div>
  );
}
