import React, { useState } from 'react';

const RANK_BADGE = {
  r5: 'bg-purple-100 text-purple-700',
  r4: 'bg-indigo-100 text-indigo-700',
};

const BAG_LABEL = {
  conductor: 'Conductor',
  vip: 'VIP',
  used: 'Used',
  inactive: 'Inactive',
};

export default function PersonPickerModal({ persons, onSelect, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Select Person</h2>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name…"
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No matches</p>
          ) : (
            filtered.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <span className="flex-1 text-sm font-medium text-gray-800">{p.name}</span>
                {(p.rank === 'r4' || p.rank === 'r5') ? (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RANK_BADGE[p.rank]}`}>
                    {p.rank.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">
                    {BAG_LABEL[p.currentBag] ?? p.currentBag}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
