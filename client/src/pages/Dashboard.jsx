import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="p-6">
          <Outlet />
        </main>
        <footer className="bg-white border-t p-4 text-center text-sm text-gray-600">
          <p>Developed by TechDoc Solutions (Pvt) Ltd</p>
        </footer>
      </div>
    </div>
  )
}