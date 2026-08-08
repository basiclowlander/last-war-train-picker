import React from 'react';

export default function ActionBar({
  isAdmin,
  canPickR4,
  canPickConductor,
  canPickVip,
  onPickR4,
  onPickConductor,
  onPickVip,
  onManualEntry,
  onAdd,
  onManageRank,
  onManageBags,
  onSwap,
  canUndo,
  onUndo,
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 space-y-2">
      {/* Row 1: Pick actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onPickR4}
          disabled={!canPickR4}
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Pick R4
        </button>
        <button
          onClick={onPickConductor}
          disabled={!canPickConductor}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Pick Conductor
        </button>
        <button
          onClick={onPickVip}
          disabled={!canPickVip}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Pick VIP
        </button>
        {isAdmin && (
          <button
            onClick={onManualEntry}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            Manual Entry
          </button>
        )}
        {canUndo && (
          <button
            onClick={onUndo}
            className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            ↩ Undo
          </button>
        )}
      </div>

      {/* Row 2: People management (admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            + Add Person
          </button>
          <button
            onClick={onManageRank}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Manage Rank
          </button>
          <button
            onClick={onManageBags}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Manage Bags
          </button>
        </div>
      )}

      {/* Row 3: Reset / Swap (admin only) */}
      {isAdmin && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onSwap}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Swap Lists
          </button>
        </div>
      )}
    </div>
  );
}
