import React, { useState } from 'react';

function ListSection({ title, items, persons, onAdd, onRemove, onMove }) {
  const [selected, setSelected] = useState('');

  const available = persons
    .filter(p => !items.includes(p.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleAdd() {
    if (!selected) return;
    onAdd(selected);
    setSelected('');
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
      <div className="flex gap-2 mb-3">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">— select person —</option>
          {available.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selected}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">None added yet</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((name, idx) => (
            <li key={name} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <span className="text-xs text-gray-400 w-4 text-right">{idx + 1}</span>
              <span className="flex-1 text-sm text-gray-800">{name}</span>
              <button
                type="button"
                onClick={() => onMove(idx, 'up')}
                disabled={idx === 0}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed text-xs transition-colors"
              >↑</button>
              <button
                type="button"
                onClick={() => onMove(idx, 'down')}
                disabled={idx === items.length - 1}
                className="text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed text-xs transition-colors"
              >↓</button>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-300 hover:text-red-500 text-xs transition-colors ml-1"
              >✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SessionSetupModal({ persons, weeklySession, onSubmit, onClose }) {
  const [mvpList, setMvpList] = useState(weeklySession?.mvpList ?? []);
  const [donorList, setDonorList] = useState(weeklySession?.donorList ?? []);
  const [note, setNote] = useState('');

  function moveItem(list, setList, idx, direction) {
    const next = [...list];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setList(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(mvpList, donorList, note);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-5">Weekly Session Setup</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ListSection
            title="MVPs"
            items={mvpList}
            persons={persons}
            onAdd={name => setMvpList(prev => [...prev, name])}
            onRemove={idx => setMvpList(prev => prev.filter((_, i) => i !== idx))}
            onMove={(idx, dir) => moveItem(mvpList, setMvpList, idx, dir)}
          />

          <ListSection
            title="Top Donors"
            items={donorList}
            persons={persons}
            onAdd={name => setDonorList(prev => [...prev, name])}
            onRemove={idx => setDonorList(prev => prev.filter((_, i) => i !== idx))}
            onMove={(idx, dir) => moveItem(donorList, setDonorList, idx, dir)}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Week 32 session"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Save Session
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
