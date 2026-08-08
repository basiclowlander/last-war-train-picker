import React, { useState } from 'react';

const ACTION_COLORS = {
  reset: 'bg-amber-100 text-amber-700',
  swap: 'bg-purple-100 text-purple-700',
  move: 'bg-blue-100 text-blue-700',
  addPerson: 'bg-emerald-100 text-emerald-700',
  setRank: 'bg-indigo-100 text-indigo-700',
  setWeeklySession: 'bg-teal-100 text-teal-700',
};

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityLog({ activityLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full bg-slate-700 text-white px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Activity Log</span>
          <span className="text-white/60 text-sm">({activityLog.length})</span>
        </div>
        <span className="text-white/60 text-xs">{expanded ? 'collapse' : 'expand'}</span>
      </button>

      {expanded && (
        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {activityLog.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No activity recorded yet</p>
          ) : (
            activityLog.map(entry => (
              <div key={entry.id} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                    ACTION_COLORS[entry.action] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {entry.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{entry.summary}</p>
                  {entry.note && (
                    <p className="text-xs text-gray-400 italic mt-0.5">{entry.note}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
                    {entry.adminName && (
                      <>
                        <span className="text-gray-200 text-xs">·</span>
                        <span className="text-xs text-indigo-400 font-medium">{entry.adminName}</span>
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
