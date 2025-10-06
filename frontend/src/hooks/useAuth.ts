import { useEffect, useState } from 'react'
import { auth } from '@services/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { toast } from 'sonner'
import api from '@services/api'

export function useAuth() {
  const [user, setUser] = useState<null | { uid: string; email: string | null }>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) setUser({ uid: u.uid, email: u.email })
      else setUser(null)
      try {
        if (u) {
          const res = await api.get('/auth/me')
          setIsAdmin(res.data.role === 'admin')
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return {
    user,
    isAdmin,
    loading,
    async login(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Logged in')
    },
    async register(email: string, password: string) {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success('Registered')
    },
    async logout() {
      await signOut(auth)
      toast.success('Logged out')
    },
  }
}
