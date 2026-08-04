import React, { useState } from 'react';
import Header from './components/Header';
import ActionBar from './components/ActionBar';
import PickDisplay from './components/PickDisplay';
import BagsGrid from './components/BagsGrid';
import PickHistory from './components/PickHistory';
import AdminLoginModal from './components/AdminLoginModal';
import MovePersonModal from './components/MovePersonModal';
import AddPersonModal from './components/AddPersonModal';
import ManualPickModal from './components/ManualPickModal';
import { useBags } from './hooks/useBags';
import { useAdmin } from './hooks/useAdmin';

export default function App() {
  const { persons, lastPick, log, isLoading: bagsLoading, pickRandom, markAsUsed, reset, swap, movePerson, addPerson, addManualPick } =
    useBags();
  const { isAdmin, adminName, isLoading: adminLoading, login, logout } = useAdmin();

  const isLoading = bagsLoading || adminLoading;

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [notice, setNotice] = useState('');

  const canPick =
    persons.some(p => p.currentBag === 'conductor') &&
    persons.some(p => p.currentBag === 'vip');

  function showNotice(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  }

  function handlePick() {
    const ok = pickRandom();
    if (!ok) showNotice('Need at least one person in both Conductor and VIP bags.');
  }

  function handleReset() {
    if (window.confirm('Reset everyone back to their home bags?')) reset();
  }

  function handleSwap() {
    if (window.confirm('Swap Conductor and VIP lists? This also resets.')) swap();
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
        canPick={canPick}
        canMark={!!lastPick}
        onPick={handlePick}
        onMark={() => markAsUsed(adminName)}
        onReset={handleReset}
        onSwap={handleSwap}
        onAdd={() => setShowAddPerson(true)}
        onManualEntry={() => setShowManualEntry(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {notice && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
            {notice}
          </div>
        )}

        <PickDisplay lastPick={lastPick} isAdmin={isAdmin} onMark={() => markAsUsed(adminName)} />
        <BagsGrid
          persons={persons}
          isAdmin={isAdmin}
          lastPick={lastPick}
          onMovePerson={setMoveTarget}
        />
        <PickHistory log={log} />
      </main>

      {showAdminLogin && (
        <AdminLoginModal onLogin={handleLogin} onClose={() => setShowAdminLogin(false)} />
      )}
      {moveTarget && (
        <MovePersonModal
          person={moveTarget}
          onMove={movePerson}
          onClose={() => setMoveTarget(null)}
        />
      )}
      {showAddPerson && (
        <AddPersonModal onAdd={addPerson} onClose={() => setShowAddPerson(false)} />
      )}
      {showManualEntry && (
        <ManualPickModal
          persons={persons}
          onSubmit={(conductorId, vipId, timestamp) => {
            addManualPick(conductorId, vipId, adminName, timestamp);
            setShowManualEntry(false);
          }}
          onClose={() => setShowManualEntry(false)}
        />
      )}
    </div>
  );
}
