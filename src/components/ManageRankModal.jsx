import React, { useState } from 'react';

export default function ManageRankModal({ person, persons, onChangeRank, onClose }) {
  const [note, setNote] = useState('');
  const [homeBag, setHomeBag] = useState('conductor');
  const [confirmDemote, setConfirmDemote] = useState(false);
  const [error, setError] = useState('');

  const isR4R5 = person.rank === 'r4' || person.rank === 'r5';
  const existingR5 = persons.find(p => p.rank === 'r5' && p.id !== person.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Manage Rank</h2>
        <p className="text-sm text-gray-500 mb-4">
          <strong className="text-gray-800">{person.name}</strong>
          <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            person.rank === 'r5' ? 'bg-purple-100 text-purple-700'
            : person.rank === 'r4' ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600'
          }`}>
            {isR4R5 ? person.rank.toUpperCase() : 'Standard'}
          </span>
        </p>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none mb-4"
        />

        {isR4R5 ? (
          !confirmDemote ? (
            <button
              onClick={() => setConfirmDemote(true)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 transition-colors"
            >
              Demote to Standard
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Choose home bag after demotion:</p>
              <div className="flex gap-2">
                {['conductor', 'vip'].map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setHomeBag(b)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      homeBag === b ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { onChangeRank(person.id, 'standard', homeBag, note); onClose(); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 transition-colors"
              >
                Confirm Demote
              </button>
              <button
                onClick={() => setConfirmDemote(false)}
                className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Back
              </button>
            </div>
          )
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => { onChangeRank(person.id, 'r4', null, note); onClose(); }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 transition-colors"
            >
              Promote to R4
            </button>
            <button
              onClick={() => {
                if (existingR5) {
                  setError(`${existingR5.name} is already R5. Demote them first.`);
                  return;
                }
                onChangeRank(person.id, 'r5', null, note);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 transition-colors"
            >
              Promote to R5
            </button>
            {error && <p className="text-xs text-red-600 pt-1">{error}</p>}
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
