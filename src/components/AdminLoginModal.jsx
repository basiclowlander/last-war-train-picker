import React, { useState } from 'react';

export default function AdminLoginModal({ onLogin, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const ok = onLogin(code);
    if (!ok) {
      setError(true);
      setCode('');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-5">Enter the admin code to unlock all features.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={code}
            onChange={e => { setCode(e.target.value); setError(false); }}
            placeholder="Admin code"
            autoFocus
            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 transition-shadow ${
              error
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-400'
            }`}
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect code. Try again.</p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
