import React, { useState } from 'react';

const STANDARD_BAGS = [
  { id: 'conductor', label: 'Conductor', cls: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' },
  { id: 'vip',       label: 'VIP',       cls: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200' },
  { id: 'used',      label: 'Used',      cls: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200' },
  { id: 'inactive',  label: 'Inactive',  cls: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' },
];

export default function ManageBagsModal({ person, onMove, onClose }) {
  const [note, setNote] = useState('');

  const isR4R5 = person.rank === 'r4' || person.rank === 'r5';
  const isInactive = person.currentBag === 'inactive';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Manage Bags</h2>
        <p className="text-sm text-gray-500 mb-4">
          Move <strong className="text-gray-800">{person.name}</strong> to:
        </p>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none mb-4"
        />

        {isR4R5 ? (
          isInactive ? (
            <button
              onClick={() => { onMove(person.id, 'conductor', note); onClose(); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 transition-colors"
            >
              Return to Queue
            </button>
          ) : (
            <button
              onClick={() => { onMove(person.id, 'inactive', note); onClose(); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 transition-colors"
            >
              Mark Inactive
            </button>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {STANDARD_BAGS.filter(b => b.id !== person.currentBag).map(bag => (
              <button
                key={bag.id}
                onClick={() => { onMove(person.id, bag.id, note); onClose(); }}
                className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${bag.cls}`}
              >
                {bag.label}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
