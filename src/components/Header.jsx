import React from 'react';

const IS_LOCAL = !import.meta.env.PROD;

export default function Header({ isAdmin, adminName, onAdminToggle }) {
  return (
    <>
      {IS_LOCAL && (
        <div className="bg-amber-400 text-amber-900 text-xs font-semibold text-center py-1.5 tracking-wide">
          LOCAL ONLY — data is stored in localStorage and will not be persisted to JSONBin
        </div>
      )}
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Last War :: Who is on the Train ?</h1>
        <p className="text-sm text-gray-400 mt-0.5">Random selection manager</p>
      </div>
      <div className="flex items-center gap-3">
        {isAdmin && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            Admin: {adminName}
          </span>
        )}
        <button
          onClick={onAdminToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isAdmin
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isAdmin ? 'Exit Admin' : 'Admin Login'}
        </button>
      </div>
    </header>
    </>
  );
}
