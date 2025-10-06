import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, watchAuth } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = watchAuth(async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdTokenResult();
        const r = (token.claims.role as string) || 'user';
        setRole(r === 'admin' ? 'admin' : 'user');
      } else {
        setRole(null);
      }
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  return { user, role, initializing };
}
