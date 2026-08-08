import React from 'react';

export default function R4Queue({ persons, isAdmin, onManageBags, onManageRank, onReorder }) {
  const r4r5 = persons
    .filter(p => p.rank === 'r4' || p.rank === 'r5')
    .sort((a, b) => {
      if (a.currentBag === 'inactive' && b.currentBag !== 'inactive') return 1;
      if (a.currentBag !== 'inactive' && b.currentBag === 'inactive') return -1;
      return (a.queuePosition ?? 0) - (b.queuePosition ?? 0);
    });

  const activeCount = r4r5.filter(p => p.currentBag !== 'inactive').length;

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-slate-800 text-white px-4 py-3 flex items-center gap-2">
        <span className="font-semibold text-sm">R4/R5 Queue</span>
        <span className="bg-slate-600 text-white/80 text-xs font-medium px-2 py-0.5 rounded-full">
          {activeCount} active
        </span>
      </div>

      {r4r5.length === 0 ? (
        <div className="bg-slate-50 px-4 py-6 text-center text-slate-400 text-sm">
          No R4/R5 members yet
        </div>
      ) : (
        <div className="bg-slate-50 divide-y divide-slate-100">
          {r4r5.map((person, idx) => {
            const isInactive = person.currentBag === 'inactive';
            const activeList = r4r5.filter(p => p.currentBag !== 'inactive');
            const activeIdx = activeList.findIndex(p => p.id === person.id);
            const isFirst = !isInactive && activeIdx === 0;
            const isLast = !isInactive && activeIdx === activeList.length - 1;

            return (
              <div
                key={person.id}
                className={`px-4 py-2.5 flex items-center gap-3 ${isInactive ? 'opacity-40' : ''}`}
              >
                <span className="text-slate-400 text-xs font-mono w-5 text-right flex-shrink-0">
                  {isInactive ? '—' : activeIdx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-800">{person.name}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    person.rank === 'r5'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {person.rank.toUpperCase()}
                </span>
                {isAdmin && !isInactive && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => onReorder(person.id, 'up')}
                      disabled={isFirst}
                      className="text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed text-xs px-1 transition-colors"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => onReorder(person.id, 'down')}
                      disabled={isLast}
                      className="text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed text-xs px-1 transition-colors"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onManageBags(person)}
                      className="text-xs text-slate-300 hover:text-indigo-500 transition-colors"
                    >
                      bags
                    </button>
                    <button
                      onClick={() => onManageRank(person)}
                      className="text-xs text-slate-300 hover:text-purple-500 transition-colors"
                    >
                      rank
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
