import React, { useState } from 'react';
import Header from './components/Header';
import ActionBar from './components/ActionBar';
import PickDisplay from './components/PickDisplay';
import BagsGrid from './components/BagsGrid';
import PickHistory from './components/PickHistory';
import ActivityLog from './components/ActivityLog';
import AdminLoginModal from './components/AdminLoginModal';
import ManageRankModal from './components/ManageRankModal';
import ManageBagsModal from './components/ManageBagsModal';
import AddPersonModal from './components/AddPersonModal';
import ManualEntryModal from './components/ManualEntryModal';
import PersonPickerModal from './components/PersonPickerModal';
import R4Queue from './components/R4Queue';
import ConfirmWithNoteModal from './components/ConfirmWithNoteModal';
import { useBags } from './hooks/useBags';
import { useAdmin } from './hooks/useAdmin';

const EMPTY_PICK_RESULT = {
  conductorSkipped: [],
  vipSkipped: [],
  conductorNeedsOverride: false,
  vipNeedsOverride: false,
};

export default function App() {
  const {
    persons,
    lastPick,
    log,
    activityLog,
    settings,
    weeklySession,
    isLoading: bagsLoading,
    pickConductor,
    pickVip,
    markAsUsed,
    swap,
    movePerson,
    addPerson,
    addManualPick,
    setPickSlot,
    setRank,
    updateSettings,
    reorderR4Queue,
    canUndo,
    undo,
  } = useBags();

  const { isAdmin, adminName, isLoading: adminLoading, login, logout } = useAdmin();

  const isLoading = bagsLoading || adminLoading;

  const [pickResult, setPickResult] = useState(EMPTY_PICK_RESULT);
  const [markNote, setMarkNote] = useState('');
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [personPickerMode, setPersonPickerMode] = useState(null); // 'rank' | 'bags' | null
  const [bagsTarget, setBagsTarget] = useState(null);
  const [rankTarget, setRankTarget] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [notice, setNotice] = useState('');

  const canPickR4 = persons.some(p => (p.rank === 'r4' || p.rank === 'r5') && p.currentBag !== 'inactive');
  const canPickConductor = persons.some(p => p.currentBag === 'conductor' && p.rank === 'standard');
  const canPickVip = persons.some(p => p.currentBag === 'vip' && p.rank === 'standard');
  const canMark = !!(lastPick?.conductor && lastPick?.vip);

  function showNotice(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  }

  function handlePickR4() {
    const result = pickConductor('r4');
    if (!result.ok) {
      setPickResult(prev => ({
        ...prev,
        conductorSkipped: result.skipped ?? [],
        conductorNeedsOverride: result.needsOverride ?? false,
      }));
      if (!result.skipped?.length) showNotice('No active R4/R5 members.');
    } else {
      setPickResult(prev => ({ ...prev, conductorSkipped: [], conductorNeedsOverride: false }));
    }
  }

  function handlePickConductor() {
    const result = pickConductor('random');
    if (!result.ok) {
      setPickResult(prev => ({
        ...prev,
        conductorSkipped: result.skipped ?? [],
        conductorNeedsOverride: result.needsOverride ?? false,
      }));
      if (!result.skipped?.length) showNotice('No one available for Conductor.');
    } else {
      setPickResult(prev => ({ ...prev, conductorSkipped: [], conductorNeedsOverride: false }));
    }
  }

  function handlePickVip() {
    const result = pickVip('random');
    if (!result.ok) {
      setPickResult(prev => ({
        ...prev,
        vipSkipped: result.skipped ?? [],
        vipNeedsOverride: result.needsOverride ?? false,
      }));
      if (!result.skipped?.length) showNotice('No one available for VIP.');
    } else {
      setPickResult(prev => ({ ...prev, vipSkipped: [], vipNeedsOverride: false }));
    }
  }

  function handleManualEntry(person, role, note) {
    setPickSlot(person, role);
    if (note?.trim()) setMarkNote(note.trim());
    setShowManualEntry(false);
  }

  function handleAdminToggle() {
    if (isAdmin) {
      logout();
    } else {
      setShowAdminLogin(true);
    }
  }

  function handleLogin(code) {
    const ok = login(code);
    if (ok) setShowAdminLogin(false);
    return ok;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAdmin={false} adminName={null} onAdminToggle={() => {}} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={isAdmin} adminName={adminName} onAdminToggle={handleAdminToggle} />
      <ActionBar
        isAdmin={isAdmin}
        canPickR4={canPickR4}
        canPickConductor={canPickConductor}
        canPickVip={canPickVip}
        onPickR4={handlePickR4}
        onPickConductor={handlePickConductor}
        onPickVip={handlePickVip}
        onManualEntry={() => setShowManualEntry(true)}
        onAdd={() => setShowAddPerson(true)}
        onManageRank={() => setPersonPickerMode('rank')}
        onManageBags={() => setPersonPickerMode('bags')}
        onSwap={() => setShowConfirmSwap(true)}
        canUndo={canUndo}
        onUndo={undo}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {notice && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
            {notice}
          </div>
        )}

        <PickDisplay
          lastPick={lastPick}
          isAdmin={isAdmin}
          onMark={() => {
            markAsUsed(adminName, markNote);
            setMarkNote('');
            setPickResult(EMPTY_PICK_RESULT);
          }}
          pickResult={pickResult}
          markNote={markNote}
          onMarkNoteChange={setMarkNote}
        />

        <R4Queue
          persons={persons}
          isAdmin={isAdmin}
          onManageBags={setBagsTarget}
          onManageRank={setRankTarget}
          onReorder={reorderR4Queue}
        />

        <BagsGrid
          persons={persons}
          isAdmin={isAdmin}
          lastPick={lastPick}
          onManageBags={setBagsTarget}
          onManageRank={setRankTarget}
        />
        <PickHistory log={log} />
        <ActivityLog activityLog={activityLog} />
      </main>

      {showAdminLogin && (
        <AdminLoginModal onLogin={handleLogin} onClose={() => setShowAdminLogin(false)} />
      )}
      {personPickerMode && (
        <PersonPickerModal
          persons={persons}
          onSelect={p => {
            if (personPickerMode === 'rank') setRankTarget(p);
            else setBagsTarget(p);
            setPersonPickerMode(null);
          }}
          onClose={() => setPersonPickerMode(null)}
        />
      )}
      {bagsTarget && (
        <ManageBagsModal
          person={bagsTarget}
          onMove={(id, bag, note) => movePerson(id, bag, note, adminName)}
          onClose={() => setBagsTarget(null)}
        />
      )}
      {rankTarget && (
        <ManageRankModal
          person={rankTarget}
          persons={persons}
          onChangeRank={(id, rank, home, note) => setRank(id, rank, home, note, adminName)}
          onClose={() => setRankTarget(null)}
        />
      )}
      {showAddPerson && (
        <AddPersonModal
          onAdd={(name, bag, rank, note) => addPerson(name, bag, rank, note, adminName)}
          onClose={() => setShowAddPerson(false)}
        />
      )}
      {showManualEntry && (
        <ManualEntryModal
          persons={persons}
          onSubmit={handleManualEntry}
          onClose={() => setShowManualEntry(false)}
        />
      )}
      {showConfirmSwap && (
        <ConfirmWithNoteModal
          title="Swap Lists"
          message="Swap Conductor and VIP lists? This also resets."
          confirmLabel="Swap"
          onConfirm={note => { swap(note, adminName); setShowConfirmSwap(false); }}
          onClose={() => setShowConfirmSwap(false)}
        />
      )}
    </div>
  );
}
