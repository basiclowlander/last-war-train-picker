const USE_API = import.meta.env.PROD;
const LS_STATE_KEY = 'bag-picker-state-v1';
const LS_HISTORY_KEY = 'bag-picker-history-v1';

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

export async function loadHistory() {
  if (USE_API) {
    try {
      const res = await fetch('/api/picks');
      if (!res.ok) return { log: [], activityLog: [] };
      const data = await res.json();
      return { log: data?.log ?? [], activityLog: data?.activityLog ?? [] };
    } catch {
      return { log: [], activityLog: [] };
    }
  }
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    if (!raw) return { log: [], activityLog: [] };
    const data = JSON.parse(raw);
    return { log: data?.log ?? [], activityLog: data?.activityLog ?? [] };
  } catch {
    return { log: [], activityLog: [] };
  }
}

export async function saveHistory(log, activityLog = []) {
  if (USE_API) {
    try {
      await fetch('/api/picks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log, activityLog }),
      });
    } catch {}
    return;
  }
  try {
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify({ log, activityLog }));
  } catch {}
}

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
  return null;
}
