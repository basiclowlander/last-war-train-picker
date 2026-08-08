import React, { useState } from 'react';

const BAGS = [
  { id: 'conductor', label: 'Conductor' },
  { id: 'vip',       label: 'VIP' },
  { id: 'inactive',  label: 'Inactive' },
];

const RANKS = [
  { id: 'standard', label: 'Standard' },
  { id: 'r4',       label: 'R4' },
  { id: 'r5',       label: 'R5' },
];

export default function AddPersonModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [bag, setBag] = useState('conductor');
  const [rank, setRank] = useState('standard');
  const [note, setNote] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, bag, rank, note);
    onClose();
  }

  const isR4R5 = rank === 'r4' || rank === 'r5';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">Add Person</h2>
        <p className="text-sm text-gray-500 mb-5">Add a new name to a bag.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full name"
              autoFocus
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Rank
            </label>
            <div className="flex gap-2">
              {RANKS.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRank(r.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rank === r.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {!isR4R5 && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Add to
              </label>
              <div className="flex gap-2">
                {BAGS.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBag(b.id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bag === b.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Reason for adding..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              Add
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
