import React, { useState } from 'react';

function toLocalDatetimeValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ManualPickModal({ persons, onSubmit, onClose }) {
  const conductors = persons.filter(p => p.homeBag === 'conductor');
  const vips = persons.filter(p => p.homeBag === 'vip');

  const [conductorId, setConductorId] = useState('');
  const [vipId, setVipId] = useState('');
  const [datetime, setDatetime] = useState(toLocalDatetimeValue(new Date()));
  const [error, setError] = useState('');

  function bagLabel(p) {
    if (p.currentBag === 'used') return ' (Used)';
    if (p.currentBag === 'inactive') return ' (Inactive)';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!conductorId) { setError('Please select a Conductor.'); return; }
    if (!vipId) { setError('Please select a VIP.'); return; }
    if (!datetime) { setError('Please set a date and time.'); return; }
    onSubmit(conductorId, vipId, new Date(datetime).toISOString());
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Manual Pick Entry</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-xs text-gray-500">
            Records a past pick directly to history and moves both people to Used.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
            <select
              value={conductorId}
              onChange={e => { setConductorId(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— select —</option>
              {conductors.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}{bagLabel(p)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VIP</label>
            <select
              value={vipId}
              onChange={e => { setVipId(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— select —</option>
              {vips.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}{bagLabel(p)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => { setDatetime(e.target.value); setError(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Record Pick
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
