import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back Home
        </button>
      </div>
    </div>
  )
}