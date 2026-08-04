import { useState, useEffect } from 'react';
import md5 from '../utils/md5';
import { ADMINS as LOCAL_ADMINS } from '../data/admins';
import { loadAdmins } from '../utils/storage';

export function useAdmin() {
  const [admins, setAdmins] = useState(LOCAL_ADMINS);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdmins().then(remote => {
      if (remote) setAdmins(remote);
      setIsLoading(false);
    });
  }, []);

  function login(code) {
    const hash = md5(code);
    const admin = admins.find(a => a.hash === hash);
    if (admin) {
      setCurrentAdmin(admin);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentAdmin(null);
  }

  return {
    isAdmin: currentAdmin !== null,
    adminName: currentAdmin?.name ?? null,
    isLoading,
    login,
    logout,
  };
}
