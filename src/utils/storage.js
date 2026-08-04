// In production (Vercel) reads/writes go through /api/state and /api/picks → JSONBin.
// In development (`npm run dev`) localStorage is used so the app works without the API.
// To test the full API stack locally, run `vercel dev` instead.
const USE_API = import.meta.env.PROD;
const LS_STATE_KEY = 'bag-picker-state-v1';
const LS_HISTORY_KEY = 'bag-picker-history-v1';

// --- State (persons + lastPick) ---

export async function loadState() {
  if (USE_API) {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) return null;
      const data = await res.json();
      return data?.persons?.length > 0 ? data : null;
    } catch {
      return null;
    }
  }
  try {
    const raw = localStorage.getItem(LS_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveState(data) {
  if (USE_API) {
    try {
      await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {}
    return;
  }
  try {
    localStorage.setItem(LS_STATE_KEY, JSON.stringify(data));
  } catch {}
}

// --- History (pick log) ---

export async function loadHistory() {
  if (USE_API) {
    try {
      const res = await fetch('/api/picks');
      if (!res.ok) return [];
      const data = await res.json();
      return data?.log ?? [];
    } catch {
      return [];
    }
  }
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveHistory(log) {
  if (USE_API) {
    try {
      await fetch('/api/picks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
      });
    } catch {}
    return;
  }
  try {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(log));
  } catch {}
}

// --- Admins (read-only from the app — manage directly in JSONBin) ---

export async function loadAdmins() {
  if (USE_API) {
    try {
      const res = await fetch('/api/admins');
      if (!res.ok) return null;
      const data = await res.json();
      return data?.admins?.length > 0 ? data.admins : null;
    } catch {
      return null;
    }
  }
  return null; // dev falls back to src/data/admins.js
}
