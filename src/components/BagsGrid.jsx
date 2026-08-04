import React from 'react';
import BagColumn from './BagColumn';

const BAGS = ['conductor', 'vip', 'used', 'inactive'];

export default function BagsGrid({ persons, isAdmin, lastPick, onMovePerson }) {
  const highlightIds = lastPick
    ? [lastPick.conductor?.id, lastPick.vip?.id].filter(Boolean)
    : [];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {BAGS.map(bag => (
        <BagColumn
          key={bag}
          bag={bag}
          persons={persons}
          isAdmin={isAdmin}
          highlightIds={highlightIds}
          onMovePerson={onMovePerson}
        />
      ))}
    </div>
  );
}
