// AuthContext.js (no TypeScript)
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin') === 'true'
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setIsAdmin(admin)
  }, [])

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
