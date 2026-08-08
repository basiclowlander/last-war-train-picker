import React, { useState } from 'react';

export default function ManualEntryModal({ persons, onSubmit, onClose }) {
  const [role, setRole] = useState('conductor');
  const [personId, setPersonId] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const eligible = persons
    .filter(p => p.currentBag !== 'inactive')
    .filter(p => role === 'conductor' || (p.rank !== 'r4' && p.rank !== 'r5'))
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleRoleChange(r) {
    setRole(r);
    setPersonId('');
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!personId) { setError('Please select a person.'); return; }
    const person = persons.find(p => p.id === personId);
    if (!person) return;
    onSubmit(person, role, note);
  }

  function rankLabel(p) {
    if (p.rank === 'r5') return ' (R5)';
    if (p.rank === 'r4') return ' (R4)';
    return '';
  }

  function bagLabel(p) {
    if (p.currentBag === 'used') return ' · Used';
    return '';
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Manual Entry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slot</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRoleChange('conductor')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  role === 'conductor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Conductor
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('vip')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  role === 'vip' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                VIP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person</label>
            <select
              value={personId}
              onChange={e => { setPersonId(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— select —</option>
              {eligible.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}{rankLabel(p)}{bagLabel(p)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. VS Winner"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Set {role === 'conductor' ? 'Conductor' : 'VIP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
