import React, { useState } from 'react';

export default function ConfirmWithNoteModal({ title, message, confirmLabel = 'Confirm', onConfirm, onClose }) {
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-shadow resize-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(note)}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
