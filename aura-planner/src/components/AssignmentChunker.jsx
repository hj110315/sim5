// aura-planner/src/components/AssignmentChunker.jsx
import React, { useState } from 'react';

export default function AssignmentChunker({ onAddChunks, onClose }) {
  const [assignment, setAssignment] = useState('');
  const [energy, setEnergy] = useState('medium');

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = assignment.trim();
    if (!text) return;

    const chunks = text
      .split(/\r?\n|[.!?]+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((text) => ({
        text,
        energy,
      }));

    if (chunks.length > 0) {
      onAddChunks(chunks);
      setAssignment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3">
      <textarea
        value={assignment}
        onChange={(event) => setAssignment(event.target.value)}
        placeholder="Paste an assignment or enter one task per line..."
        className="glass-input w-full min-h-24 text-xs"
      />

      <div className="flex items-center gap-3 text-xs text-slate-300">
        <label>
          Energy:
          <select
            value={energy}
            onChange={(event) => setEnergy(event.target.value)}
            className="ml-2 glass-input"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <button type="submit" className="glass-button px-3 py-1.5">
          Add Chunks
        </button>

        <button
          type="button"
          onClick={onClose}
          className="glass-button px-3 py-1.5"
        >
          Close
        </button>
      </div>
    </form>
  );
}
