import React from 'react';

const BAG_CONFIG = {
  conductor: {
    label: 'Conductor',
    header: 'bg-blue-600 text-white',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  vip: {
    label: 'VIP',
    header: 'bg-amber-500 text-white',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
  used: {
    label: 'Used',
    header: 'bg-gray-500 text-white',
    border: 'border-gray-200',
    bg: 'bg-gray-50',
  },
  inactive: {
    label: 'Inactive',
    header: 'bg-slate-400 text-white',
    border: 'border-slate-200',
    bg: 'bg-slate-50',
  },
};

function PersonCard({ person, isAdmin, isHighlighted, onMove }) {
  return (
    <div
      className={`bg-white rounded-lg px-3 py-2.5 flex items-center justify-between shadow-sm border transition-all duration-150 ${
        isHighlighted
          ? 'border-indigo-400 ring-1 ring-indigo-300'
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <span className={`text-sm font-medium ${isHighlighted ? 'text-indigo-800' : 'text-gray-800'}`}>
        {person.name}
      </span>
      {isAdmin && (
        <button
          onClick={() => onMove(person)}
          className="text-xs text-gray-300 hover:text-indigo-500 ml-3 flex-shrink-0 transition-colors"
          title={`Move ${person.name}`}
        >
          move
        </button>
      )}
    </div>
  );
}

export default function BagColumn({ bag, persons, isAdmin, highlightIds, onMovePerson }) {
  const cfg = BAG_CONFIG[bag];
  const list = persons.filter(p => p.currentBag === bag);

  return (
    <div className={`flex flex-col rounded-xl border ${cfg.border} overflow-hidden`}>
      <div className={`${cfg.header} px-4 py-3 flex items-center justify-between`}>
        <span className="font-semibold text-sm">{cfg.label}</span>
        <span className="text-white/70 text-sm font-medium tabular-nums">{list.length}</span>
      </div>
      <div className={`${cfg.bg} flex-1 p-3 space-y-2 min-h-40`}>
        {list.length === 0 ? (
          <p className="text-center text-gray-400 text-xs pt-6">Empty</p>
        ) : (
          list.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              isAdmin={isAdmin}
              isHighlighted={highlightIds?.includes(person.id)}
              onMove={onMovePerson}
            />
          ))
        )}
      </div>
    </div>
  );
}
