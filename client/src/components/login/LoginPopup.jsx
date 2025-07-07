import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export const LoginPopup = ({ onClose }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setIsAuthenticated, setIsAdmin } = useAuth()
  const modalRef = useRef(null)

  const handleLogin = () => {
    const hardcodedUsername = 'admin'
    const hardcodedPassword = 'admin123'
    const hardcodedToken = 'sampletoken123456'
    const hardcodedIsAdmin = true

    if (username === hardcodedUsername && password === hardcodedPassword) {
      localStorage.setItem('token', hardcodedToken)
      localStorage.setItem('isAdmin', hardcodedIsAdmin ? 'true' : 'false')

      setIsAuthenticated(true)
      setIsAdmin(hardcodedIsAdmin)

      onClose()
    } else {
      alert('Invalid credentials')
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="mb-4 text-xl font-semibold">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={handleLogin}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
