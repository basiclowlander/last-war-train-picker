import React from 'react';

export default function PickDisplay({ lastPick, isAdmin, onMark }) {
  if (!lastPick) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 text-center text-gray-400 text-sm">
        No pick yet — press <strong>Pick Random</strong> to get started
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-xl px-6 py-5">
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">
        Current Pick
      </p>
      <div className="flex gap-4">
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Conductor</p>
          <p className="text-xl font-bold text-blue-900">{lastPick.conductor.name}</p>
        </div>
        <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide mb-1">VIP</p>
          <p className="text-xl font-bold text-amber-900">{lastPick.vip.name}</p>
        </div>
      </div>
      {isAdmin && (
        <div className="mt-4 text-right">
          <button
            onClick={onMark}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Mark as Used
          </button>
        </div>
      )}
    </div>
  );
}
