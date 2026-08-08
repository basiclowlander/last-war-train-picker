import React, { useState } from 'react';

const STANDARD_BAGS = [
  { id: 'conductor', label: 'Conductor', cls: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' },
  { id: 'vip',       label: 'VIP',       cls: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200' },
  { id: 'used',      label: 'Used',      cls: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200' },
  { id: 'inactive',  label: 'Inactive',  cls: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200' },
];

export default function MovePersonModal({ person, onMove, onChangeRank, onClose }) {
  const [note, setNote] = useState('');
  const [demoteMode, setDemoteMode] = useState(false);
  const [demoteHomeBag, setDemoteHomeBag] = useState('conductor');

  const isR4R5 = person.rank === 'r4' || person.rank === 'r5';
  const isInactive = person.currentBag === 'inactive';

  function handleMove(bagId) {
    onMove(person.id, bagId, note);
    onClose();
  }

  function handleDemote() {
    onChangeRank(person.id, 'standard', demoteHomeBag, note);
    onClose();
  }

  function handlePromote(newRank) {
    onChangeRank(person.id, newRank, null, note);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">Move Person</h2>
        <p className="text-sm text-gray-500 mb-4">
          <strong className="text-gray-800">{person.name}</strong>
          {isR4R5 && (
            <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
              person.rank === 'r5' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {person.rank.toUpperCase()}
            </span>
          )}
        </p>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none mb-4"
        />

        {isR4R5 ? (
          <div className="space-y-3">
            {!demoteMode ? (
              <>
                {isInactive ? (
                  <button
                    onClick={() => handleMove('conductor')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 transition-colors"
                  >
                    Return to Queue
                  </button>
                ) : (
                  <button
                    onClick={() => handleMove('inactive')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 transition-colors"
                  >
                    Mark Inactive
                  </button>
                )}
                <button
                  onClick={() => setDemoteMode(true)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 transition-colors"
                >
                  Demote to Standard
                </button>
              </>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">Choose home bag for standard rank:</p>
                <div className="flex gap-2 mb-3">
                  {['conductor', 'vip'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setDemoteHomeBag(b)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                        demoteHomeBag === b
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleDemote}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200 transition-colors"
                >
                  Confirm Demote
                </button>
                <button
                  onClick={() => setDemoteMode(false)}
                  className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {STANDARD_BAGS.filter(b => b.id !== person.currentBag).map(bag => (
                <button
                  key={bag.id}
                  onClick={() => handleMove(bag.id)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${bag.cls}`}
                >
                  {bag.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handlePromote('r4')}
                className="py-2.5 rounded-xl text-sm font-semibold border bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 transition-colors"
              >
                Promote to R4
              </button>
              <button
                onClick={() => handlePromote('r5')}
                className="py-2.5 rounded-xl text-sm font-semibold border bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 transition-colors"
              >
                Promote to R5
              </button>
            </div>
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
