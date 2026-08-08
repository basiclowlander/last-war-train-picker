import React, { useState } from 'react';

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function PickHistory({ log }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full bg-gray-700 text-white px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Pick History</span>
          <span className="text-white/60 text-sm">({log.length})</span>
        </div>
        <span className="text-white/60 text-xs">{expanded ? 'collapse' : 'expand'}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No picks recorded yet</p>
          ) : (
            log.map((entry, idx) => (
              <div key={entry.id} className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <span className="text-xs text-gray-300 w-5 text-right flex-shrink-0 pt-0.5">
                  {log.length - idx}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-blue-500">Conductor</span>
                      <span className="text-sm text-gray-800">{entry.conductorPick.name}</span>
                      {entry.conductorNote && (
                        <span className="text-xs text-gray-400 italic">({entry.conductorNote})</span>
                      )}
                    </span>
                    <span className="text-gray-200 text-xs hidden sm:inline">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-amber-500">VIP</span>
                      <span className="text-sm text-gray-800">{entry.vipPick.name}</span>
                      {entry.vipNote && (
                        <span className="text-xs text-gray-400 italic">({entry.vipNote})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
                    {entry.adminName && (
                      <>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-xs text-indigo-400 font-medium">{entry.adminName}</span>
                      </>
                    )}
                    {entry.note && (
                      <>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-xs text-gray-500 italic">{entry.note}</span>
                      </>
                    )}
                    {entry.manual && (
                      <>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-xs text-rose-400 font-medium">manual</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
