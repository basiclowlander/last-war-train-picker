import React from 'react';

export default function ActionBar({ isAdmin, canPick, canMark, onPick, onMark, onReset, onSwap, onAdd, onManualEntry }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
      <button
        onClick={onPick}
        disabled={!canPick}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Pick Random
      </button>

      {isAdmin && (
        <>
          <button
            onClick={onMark}
            disabled={!canMark}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Mark as Used
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            onClick={onReset}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onSwap}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Swap Lists
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            onClick={onAdd}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            + Add Person
          </button>
          <button
            onClick={onManualEntry}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            Manual Entry
          </button>
        </>
      )}
    </div>
  );
}
