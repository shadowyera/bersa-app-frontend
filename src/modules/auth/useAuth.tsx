import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type { User } from './auth.types'
import {
  loginRequest,
  meRequest,
  logoutRequest,
} from './auth.api'
import { setAuthSnapshot } from './auth.snapshot'

/* ================================
   Tipos del contexto
================================ */

interface AuthContextValue {
  user: User | null
  loading: boolean

  // 👇 derivado del nuevo modelo
  sucursalId: string | null

  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(
  null
)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  /* -------------------------------
     Snapshot
  -------------------------------- */
  useEffect(() => {
    setAuthSnapshot(user)
  }, [user])

  /* -------------------------------
     Restaurar sesión
  -------------------------------- */
  useEffect(() => {
    let cancelled = false

    meRequest()
      .then((user) => {
        if (!cancelled) {
          setUser(user)
        }
      })
      .catch((err) => {
        console.warn('[AUTH] me failed', err)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  /* -------------------------------
     Login
  -------------------------------- */
  const login = async (
    email: string,
    password: string
  ) => {
    const user = await loginRequest(
      email,
      password
    )
    setUser(user)
    return user
  }

  /* -------------------------------
     Logout
  -------------------------------- */
  const logout = async () => {
    await logoutRequest()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // 🔥 ahora correctamente derivado
        sucursalId: user?.sucursal.id ?? null,

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      'useAuth debe usarse dentro de <AuthProvider>'
    )
  }
  return ctx
}