import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMyProfileRequest, logoutRequest } from '../services/authService'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'shifa_auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: null, role: null, user: null }
  })

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
  }, [auth])

  const login = ({ token, role, user }) => {
    setAuth({ token, role, user })
  }

  const logout = async () => {
    try {
      if (auth.token) await logoutRequest(auth.token)
    } finally {
      setAuth({ token: null, role: null, user: null })
    }
  }

  const refreshProfile = async () => {
    if (!auth.token) return null
    const response = await getMyProfileRequest(auth.token)
    const userData = response?.data ?? null
    if (userData) {
      setAuth((prev) => ({ ...prev, user: userData, role: userData.role || prev.role }))
    }
    return userData
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      role: auth.role,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      refreshProfile,
    }),
    [auth.token, auth.role, auth.user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
