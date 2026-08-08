import React from 'react';

function Slot({ label, person, colorClass, placeholderText }) {
  if (person) {
    return (
      <div className={`flex-1 rounded-xl p-4 ${colorClass.filled}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colorClass.label}`}>{label}</p>
        <p className={`text-xl font-bold ${colorClass.name}`}>{person.name}</p>
      </div>
    );
  }
  return (
    <div className={`flex-1 rounded-xl p-4 border-2 border-dashed ${colorClass.empty}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colorClass.label}`}>{label}</p>
      <p className="text-sm text-gray-400 italic">{placeholderText}</p>
    </div>
  );
}

function SkippedList({ skipped, label }) {
  if (!skipped?.length) return null;
  return (
    <div className="mb-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
      <p className="text-xs font-semibold text-amber-700 mb-1">{label} — skipped:</p>
      <ul className="space-y-0.5">
        {skipped.map((s, i) => (
          <li key={i} className="text-xs text-amber-700">• {s.name} — {s.reason}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PickDisplay({ lastPick, isAdmin, onMark, pickResult, markNote, onMarkNoteChange, dayType }) {
  const hasConductor = !!lastPick?.conductor;
  const hasVip = !!lastPick?.vip;
  const hasBoth = hasConductor && hasVip;

  const conductorSkipped = pickResult?.conductorSkipped ?? [];
  const vipSkipped = pickResult?.vipSkipped ?? [];
  const conductorNeedsOverride = pickResult?.conductorNeedsOverride ?? false;
  const vipNeedsOverride = pickResult?.vipNeedsOverride ?? false;
  const hasSkipped = conductorSkipped.length > 0 || vipSkipped.length > 0;
  const hasOverride = conductorNeedsOverride || vipNeedsOverride;

  if (!lastPick && !hasSkipped && !hasOverride) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 text-center text-gray-400 text-sm">
        No pick yet — use <strong>Pick Conductor</strong> and <strong>Pick VIP</strong> to select from each bag
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl px-6 py-5 border-2 ${hasBoth ? 'border-indigo-200' : 'border-gray-200'}`}>
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">Current Pick</p>

      <SkippedList skipped={conductorSkipped} label="Conductor" />
      <SkippedList skipped={vipSkipped} label="VIP" />

      {hasOverride && (
        <div className="mb-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
          <p className="text-xs text-rose-700">All options exhausted — switch to Random or use Manual Entry</p>
        </div>
      )}

      {lastPick && (
        <>
          <div className="flex gap-4">
            <Slot
              label="Conductor"
              person={lastPick.conductor}
              colorClass={{
                filled: 'bg-blue-50 border border-blue-100',
                empty: 'border-blue-200',
                label: 'text-blue-400',
                name: 'text-blue-900',
              }}
              placeholderText="Not selected yet"
            />
            <Slot
              label="VIP"
              person={lastPick.vip}
              colorClass={{
                filled: 'bg-amber-50 border border-amber-100',
                empty: 'border-amber-200',
                label: 'text-amber-500',
                name: 'text-amber-900',
              }}
              placeholderText="Not selected yet"
            />
          </div>

          {isAdmin && (
            <div className="mt-4">
              {hasBoth && (
                <textarea
                  value={markNote}
                  onChange={e => onMarkNoteChange(e.target.value)}
                  placeholder="Note (optional)"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none mb-2"
                />
              )}
              <div className="text-right">
                <button
                  onClick={onMark}
                  disabled={!hasBoth}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Used
                </button>
                {!hasBoth && (
                  <p className="text-xs text-gray-400 mt-1">Select both a Conductor and a VIP to mark as used</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
