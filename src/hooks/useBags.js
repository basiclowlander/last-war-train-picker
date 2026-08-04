import { useState, useEffect } from 'react';
import { INITIAL_PERSONS } from '../data/initialData';
import { loadState, saveState, loadHistory, saveHistory } from '../utils/storage';

export function useBags() {
  const [state, setState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadState(), loadHistory()]).then(([savedState, savedLog]) => {
      setState({
        persons: savedState?.persons ?? INITIAL_PERSONS,
        lastPick: savedState?.lastPick ?? null,
        log: savedLog,
      });
      setIsLoading(false);
    });
  }, []);

  // Saves persons + lastPick to the state bin
  function persistState(persons, lastPick) {
    saveState({ persons, lastPick });
  }

  // Saves the log to the history bin — only called by markAsUsed
  function persistHistory(log) {
    saveHistory(log);
  }

  function pickRandom() {
    if (!state) return false;
    const conductors = state.persons.filter(p => p.currentBag === 'conductor');
    const vips = state.persons.filter(p => p.currentBag === 'vip');
    if (!conductors.length || !vips.length) return false;

    const conductorPick = conductors[Math.floor(Math.random() * conductors.length)];
    const vipPick = vips[Math.floor(Math.random() * vips.length)];
    const lastPick = { conductor: conductorPick, vip: vipPick };

    setState(prev => ({ ...prev, lastPick }));
    persistState(state.persons, lastPick);
    return true;
  }

  function markAsUsed(adminName) {
    if (!state?.lastPick) return;
    const { lastPick } = state;

    const logEntry = {
      id: crypto.randomUUID(),
      conductorPick: { id: lastPick.conductor.id, name: lastPick.conductor.name },
      vipPick: { id: lastPick.vip.id, name: lastPick.vip.name },
      adminName: adminName ?? 'Unknown',
      timestamp: new Date().toISOString(),
    };

    const newPersons = state.persons.map(p =>
      p.id === lastPick.conductor.id || p.id === lastPick.vip.id
        ? { ...p, currentBag: 'used' }
        : p
    );
    const newLog = [logEntry, ...state.log];

    setState(prev => ({ ...prev, persons: newPersons, lastPick: null, log: newLog }));
    persistState(newPersons, null);
    persistHistory(newLog);
  }

  function reset() {
    if (!state) return;
    const newPersons = state.persons.map(p =>
      p.currentBag === 'inactive' ? p : { ...p, currentBag: p.homeBag }
    );
    setState(prev => ({ ...prev, persons: newPersons, lastPick: null }));
    persistState(newPersons, null);
  }

  function swap() {
    if (!state) return;
    const newPersons = state.persons.map(p => {
      if (p.currentBag === 'inactive') return p;
      const newHome = p.homeBag === 'conductor' ? 'vip' : p.homeBag === 'vip' ? 'conductor' : p.homeBag;
      return { ...p, homeBag: newHome, currentBag: newHome };
    });
    setState(prev => ({ ...prev, persons: newPersons, lastPick: null }));
    persistState(newPersons, null);
  }

  function movePerson(personId, targetBag) {
    if (!state) return;
    const newPersons = state.persons.map(p => {
      if (p.id !== personId) return p;
      const newHomeBag = targetBag === 'conductor' || targetBag === 'vip' ? targetBag : p.homeBag;
      return { ...p, currentBag: targetBag, homeBag: newHomeBag };
    });
    const newLastPick =
      state.lastPick &&
      (state.lastPick.conductor?.id === personId || state.lastPick.vip?.id === personId)
        ? null
        : state.lastPick;

    setState(prev => ({ ...prev, persons: newPersons, lastPick: newLastPick }));
    persistState(newPersons, newLastPick);
  }

  function addPerson(name, bag) {
    if (!state) return;
    const homeBag = bag === 'conductor' || bag === 'vip' ? bag : 'conductor';
    const newPersons = [
      ...state.persons,
      { id: crypto.randomUUID(), name: name.trim(), currentBag: bag, homeBag },
    ];
    setState(prev => ({ ...prev, persons: newPersons }));
    persistState(newPersons, state.lastPick);
  }

  function addManualPick(conductorId, vipId, adminName, timestamp) {
    if (!state) return;
    const conductor = state.persons.find(p => p.id === conductorId);
    const vip = state.persons.find(p => p.id === vipId);
    if (!conductor || !vip) return;

    const logEntry = {
      id: crypto.randomUUID(),
      conductorPick: { id: conductor.id, name: conductor.name },
      vipPick: { id: vip.id, name: vip.name },
      adminName: adminName ?? 'Unknown',
      timestamp,
      manual: true,
    };

    const newPersons = state.persons.map(p =>
      p.id === conductorId || p.id === vipId ? { ...p, currentBag: 'used' } : p
    );
    const newLog = [...state.log, logEntry].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setState(prev => ({ ...prev, persons: newPersons, log: newLog }));
    persistState(newPersons, state.lastPick);
    persistHistory(newLog);
  }

  return {
    persons: state?.persons ?? [],
    lastPick: state?.lastPick ?? null,
    log: state?.log ?? [],
    isLoading,
    pickRandom,
    markAsUsed,
    reset,
    swap,
    movePerson,
    addPerson,
    addManualPick,
  };
}
