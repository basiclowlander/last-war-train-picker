import { useState, useEffect, useRef } from 'react';
import { INITIAL_PERSONS } from '../data/initialData';
import { loadState, saveState, loadHistory, saveHistory } from '../utils/storage';

function makeActivity(action, summary, note, adminName) {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    adminName: adminName ?? 'Unknown',
    action,
    summary,
    note: note?.trim() || '',
  };
}

function maxQueuePosition(persons) {
  const r4r5 = persons.filter(p => p.rank === 'r4' || p.rank === 'r5');
  if (!r4r5.length) return 0;
  return Math.max(...r4r5.map(p => p.queuePosition ?? 0));
}

export function useBags() {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const prevSnapshot = useRef(null);

  function snapshot(current) {
    prevSnapshot.current = current;
    setCanUndo(true);
  }

  function undo() {
    if (!prevSnapshot.current) return;
    const s = prevSnapshot.current;
    prevSnapshot.current = null;
    setCanUndo(false);
    setState(s);
    saveState({ persons: s.persons, lastPick: s.lastPick, settings: s.settings, weeklySession: s.weeklySession });
    saveHistory(s.log, s.activityLog);
  }

  useEffect(() => {
    Promise.all([loadState(), loadHistory()]).then(([savedState, savedHistory]) => {
      setState({
        persons: savedState?.persons ?? INITIAL_PERSONS,
        lastPick: savedState?.lastPick ?? null,
        settings: savedState?.settings ?? { r4Days: [2, 3, 4] },
        weeklySession: savedState?.weeklySession ?? { mvpList: [], donorList: [] },
        log: savedHistory.log,
        activityLog: savedHistory.activityLog,
      });
      setIsLoading(false);
    });
  }, []);

  function restoreR4QueuePos(persons, lastPick) {
    const prev = lastPick?.conductor;
    if (!prev || (prev.rank !== 'r4' && prev.rank !== 'r5')) return persons;
    if (!lastPick || !('r4OriginalQueuePos' in lastPick)) return persons;
    return persons.map(p => p.id === prev.id ? { ...p, queuePosition: lastPick.r4OriginalQueuePos } : p);
  }

  function pickConductor(dayType) {
    if (!state) return { ok: false, skipped: [] };
    snapshot(state);

    if (dayType === 'r4') {
      const queue = state.persons
        .filter(p => (p.rank === 'r4' || p.rank === 'r5') && p.currentBag !== 'inactive')
        .sort((a, b) => (a.queuePosition ?? 0) - (b.queuePosition ?? 0));

      if (!queue.length) return { ok: false, skipped: [{ name: 'R4/R5 queue', reason: 'No active R4/R5 members' }] };

      const pick = queue[0];
      const maxPos = maxQueuePosition(state.persons);
      const newPersons = state.persons.map(p =>
        p.id === pick.id ? { ...p, queuePosition: maxPos + 1 } : p
      );
      const newLastPick = { conductor: pick, vip: state.lastPick?.vip ?? null, r4OriginalQueuePos: pick.queuePosition };
      const next = { ...state, persons: newPersons, lastPick: newLastPick };
      setState(next);
      saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
      return { ok: true, skipped: [] };
    }

    if (dayType === 'monday') {
      const { mvpList } = state.weeklySession;
      const skipped = [];

      for (const name of mvpList) {
        const person = state.persons.find(p => p.name === name);
        if (!person) { skipped.push({ name, reason: 'Not found in member list' }); continue; }
        if (person.currentBag === 'inactive') { skipped.push({ name, reason: 'Inactive' }); continue; }
        if (person.currentBag === 'used') { skipped.push({ name, reason: 'Already in Used bag' }); continue; }

        const newLastPick = { conductor: person, vip: state.lastPick?.vip ?? null };
        const next = { ...state, lastPick: newLastPick };
        setState(next);
        saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
        return { ok: true, skipped };
      }

      return { ok: false, skipped, needsOverride: true, reason: 'All MVP options exhausted' };
    }

    const basePersons = restoreR4QueuePos(state.persons, state.lastPick);
    const pool = basePersons.filter(p => p.currentBag === 'conductor' && p.rank === 'standard');
    if (!pool.length) return { ok: false, skipped: [{ name: 'Conductor bag', reason: 'Empty' }] };

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const newLastPick = { conductor: pick, vip: state.lastPick?.vip ?? null };
    const next = { ...state, persons: basePersons, lastPick: newLastPick };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    return { ok: true, skipped: [] };
  }

  function pickVip(dayType) {
    if (!state) return { ok: false, skipped: [] };
    snapshot(state);

    const conductorId = state.lastPick?.conductor?.id ?? null;

    if (dayType === 'monday') {
      const { donorList } = state.weeklySession;
      const skipped = [];

      for (const name of donorList) {
        const person = state.persons.find(p => p.name === name);
        if (!person) { skipped.push({ name, reason: 'Not found in member list' }); continue; }
        if (person.rank === 'r4' || person.rank === 'r5') { skipped.push({ name, reason: 'R4/R5 cannot be VIP' }); continue; }
        if (person.currentBag === 'inactive') { skipped.push({ name, reason: 'Inactive' }); continue; }
        if (person.currentBag === 'used') { skipped.push({ name, reason: 'Already in Used bag' }); continue; }
        if (person.id === conductorId) { skipped.push({ name, reason: 'Already selected as Conductor' }); continue; }

        const newLastPick = { conductor: state.lastPick?.conductor ?? null, vip: person };
        const next = { ...state, lastPick: newLastPick };
        setState(next);
        saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
        return { ok: true, skipped };
      }

      return { ok: false, skipped, needsOverride: true, reason: 'All Donor options exhausted' };
    }

    const pool = state.persons.filter(
      p => p.currentBag === 'vip' && p.rank === 'standard' && p.id !== conductorId
    );
    if (!pool.length) return { ok: false, skipped: [{ name: 'VIP bag', reason: 'Empty' }] };

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const newLastPick = { conductor: state.lastPick?.conductor ?? null, vip: pick };
    const next = { ...state, lastPick: newLastPick };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    return { ok: true, skipped: [] };
  }

  function markAsUsed(adminName, note) {
    if (!state?.lastPick?.conductor || !state?.lastPick?.vip) return;
    snapshot(state);
    const { lastPick } = state;

    const conductorIsR4R5 = lastPick.conductor.rank === 'r4' || lastPick.conductor.rank === 'r5';
    const autoNote = note?.trim() || (conductorIsR4R5 ? 'R4 selected' : 'Random selection');

    const logEntry = {
      id: crypto.randomUUID(),
      conductorPick: { id: lastPick.conductor.id, name: lastPick.conductor.name },
      vipPick: { id: lastPick.vip.id, name: lastPick.vip.name },
      adminName: adminName ?? 'Unknown',
      timestamp: new Date().toISOString(),
      note: autoNote,
    };

    const newPersons = state.persons.map(p => {
      if (p.id === lastPick.conductor.id && !conductorIsR4R5) return { ...p, currentBag: 'used' };
      if (p.id === lastPick.vip.id) return { ...p, currentBag: 'used' };
      return p;
    });

    const newLog = [logEntry, ...state.log];
    const next = { ...state, persons: newPersons, lastPick: null, log: newLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function swap(note, adminName) {
    if (!state) return;
    snapshot(state);
    const newPersons = state.persons.map(p => {
      if (p.rank === 'r4' || p.rank === 'r5') return p;
      if (p.currentBag === 'inactive') return p;
      const newHome = p.homeBag === 'conductor' ? 'vip' : p.homeBag === 'vip' ? 'conductor' : p.homeBag;
      return { ...p, homeBag: newHome, currentBag: newHome };
    });
    const activity = makeActivity('swap', 'Conductor and VIP lists swapped', note, adminName);
    const newActivityLog = [activity, ...state.activityLog];
    const next = { ...state, persons: newPersons, lastPick: null, activityLog: newActivityLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function movePerson(personId, targetBag, note, adminName) {
    if (!state) return;
    snapshot(state);
    const person = state.persons.find(p => p.id === personId);
    if (!person) return;

    let newPersons;
    if (person.rank === 'r4' || person.rank === 'r5') {
      newPersons = state.persons.map(p => {
        if (p.id !== personId) return p;
        if (targetBag === 'inactive') return { ...p, currentBag: 'inactive' };
        if (targetBag === 'conductor') {
          const maxPos = maxQueuePosition(state.persons);
          return { ...p, currentBag: 'conductor', queuePosition: maxPos + 1 };
        }
        return p;
      });
    } else {
      newPersons = state.persons.map(p => {
        if (p.id !== personId) return p;
        const newHomeBag = targetBag === 'conductor' || targetBag === 'vip' ? targetBag : p.homeBag;
        return { ...p, currentBag: targetBag, homeBag: newHomeBag };
      });
    }

    let newLastPick = state.lastPick;
    if (newLastPick) {
      if (newLastPick.conductor?.id === personId) newLastPick = { ...newLastPick, conductor: null };
      else if (newLastPick.vip?.id === personId) newLastPick = { ...newLastPick, vip: null };
      if (!newLastPick.conductor && !newLastPick.vip) newLastPick = null;
    }

    const activity = makeActivity('move', `${person.name} moved to ${targetBag}`, note, adminName);
    const newActivityLog = [activity, ...state.activityLog];
    const next = { ...state, persons: newPersons, lastPick: newLastPick, activityLog: newActivityLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function addPerson(name, bag, rank, note, adminName) {
    if (!state) return;
    snapshot(state);
    const trimmedName = name.trim();
    let newPerson;

    if (rank === 'r4' || rank === 'r5') {
      const maxPos = maxQueuePosition(state.persons);
      newPerson = {
        id: crypto.randomUUID(),
        name: trimmedName,
        rank,
        currentBag: 'conductor',
        homeBag: null,
        queuePosition: maxPos + 1,
      };
    } else {
      const homeBag = bag === 'conductor' || bag === 'vip' ? bag : 'conductor';
      newPerson = {
        id: crypto.randomUUID(),
        name: trimmedName,
        rank: 'standard',
        currentBag: bag,
        homeBag,
        queuePosition: null,
      };
    }

    const newPersons = [...state.persons, newPerson];
    const activity = makeActivity('addPerson', `${trimmedName} added (${rank ?? 'standard'})`, note, adminName);
    const newActivityLog = [activity, ...state.activityLog];
    const next = { ...state, persons: newPersons, activityLog: newActivityLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function setRank(personId, newRank, homeBag, note, adminName) {
    if (!state) return;
    snapshot(state);
    const person = state.persons.find(p => p.id === personId);
    if (!person) return;

    let newPersons;
    if (newRank === 'r4' || newRank === 'r5') {
      const maxPos = maxQueuePosition(state.persons);
      newPersons = state.persons.map(p =>
        p.id !== personId ? p : { ...p, rank: newRank, queuePosition: maxPos + 1, currentBag: 'conductor', homeBag: null }
      );
    } else {
      const targetHome = homeBag ?? 'conductor';
      newPersons = state.persons.map(p =>
        p.id !== personId ? p : { ...p, rank: 'standard', queuePosition: null, homeBag: targetHome, currentBag: targetHome }
      );
    }

    let newLastPick = state.lastPick;
    if (newLastPick && (newRank === 'r4' || newRank === 'r5')) {
      if (newLastPick.conductor?.id === personId) newLastPick = { ...newLastPick, conductor: null };
      else if (newLastPick.vip?.id === personId) newLastPick = { ...newLastPick, vip: null };
      if (!newLastPick.conductor && !newLastPick.vip) newLastPick = null;
    }

    const activity = makeActivity('setRank', `${person.name} rank changed to ${newRank}`, note, adminName);
    const newActivityLog = [activity, ...state.activityLog];
    const next = { ...state, persons: newPersons, lastPick: newLastPick, activityLog: newActivityLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function setWeeklySession(mvpList, donorList, note, adminName) {
    if (!state) return;
    const newWeeklySession = { mvpList, donorList };
    const activity = makeActivity('setWeeklySession', `Weekly session updated (${mvpList.length} MVPs, ${donorList.length} Donors)`, note, adminName);
    const newActivityLog = [activity, ...state.activityLog];
    const next = { ...state, weeklySession: newWeeklySession, activityLog: newActivityLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  function updateSettings(newSettings) {
    if (!state) return;
    const merged = { ...state.settings, ...newSettings };
    const next = { ...state, settings: merged };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
  }

  function reorderR4Queue(personId, direction) {
    if (!state) return;
    const sorted = state.persons
      .filter(p => p.rank === 'r4' || p.rank === 'r5')
      .sort((a, b) => (a.queuePosition ?? 0) - (b.queuePosition ?? 0));

    const idx = sorted.findIndex(p => p.id === personId);
    if (idx === -1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const posA = sorted[idx].queuePosition;
    const posB = sorted[swapIdx].queuePosition;

    const newPersons = state.persons.map(p => {
      if (p.id === sorted[idx].id) return { ...p, queuePosition: posB };
      if (p.id === sorted[swapIdx].id) return { ...p, queuePosition: posA };
      return p;
    });

    const next = { ...state, persons: newPersons };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
  }

  function setPickSlot(person, role) {
    if (!state) return;
    snapshot(state);
    const newPersons = role === 'conductor'
      ? restoreR4QueuePos(state.persons, state.lastPick)
      : state.persons;
    const newLastPick = role === 'conductor'
      ? { conductor: person, vip: state.lastPick?.vip ?? null }
      : { conductor: state.lastPick?.conductor ?? null, vip: person };
    const next = { ...state, persons: newPersons, lastPick: newLastPick };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
  }

  function addManualPick(conductorId, vipId, adminName, timestamp, conductorNote, vipNote) {
    if (!state) return;
    snapshot(state);
    const conductor = state.persons.find(p => p.id === conductorId);
    const vip = state.persons.find(p => p.id === vipId);
    if (!conductor || !vip) return;

    const logEntry = {
      id: crypto.randomUUID(),
      conductorPick: { id: conductor.id, name: conductor.name },
      vipPick: { id: vip.id, name: vip.name },
      adminName: adminName ?? 'Unknown',
      timestamp,
      conductorNote: conductorNote?.trim() || '',
      vipNote: vipNote?.trim() || '',
      manual: true,
    };

    const newPersons = state.persons.map(p =>
      p.id === conductorId || p.id === vipId ? { ...p, currentBag: 'used' } : p
    );
    const newLog = [...state.log, logEntry].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const next = { ...state, persons: newPersons, log: newLog };
    setState(next);
    saveState({ persons: next.persons, lastPick: next.lastPick, settings: next.settings, weeklySession: next.weeklySession });
    saveHistory(next.log, next.activityLog);
  }

  return {
    persons: state?.persons ?? [],
    lastPick: state?.lastPick ?? null,
    log: state?.log ?? [],
    activityLog: state?.activityLog ?? [],
    settings: state?.settings ?? { r4Days: [2, 3, 4] },
    weeklySession: state?.weeklySession ?? { mvpList: [], donorList: [] },
    isLoading,
    canUndo,
    pickConductor,
    pickVip,
    markAsUsed,
    swap,
    movePerson,
    addPerson,
    addManualPick,
    setPickSlot,
    setRank,
    setWeeklySession,
    updateSettings,
    reorderR4Queue,
    undo,
  };
}
