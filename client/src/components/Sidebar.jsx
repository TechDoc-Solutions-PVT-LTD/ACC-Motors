import { NavLink } from 'react-router-dom'
import { FileText, List, Package, Settings } from 'lucide-react'

export default function Sidebar() {
  const navItems = [
    { to: '/', icon: FileText, label: 'New Invoice' },
    { to: '/invoices', icon: List, label: 'Invoice List' },
    { to: '/inventory', icon: Package, label: 'Inventory' }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">ACC Motors</h1>
        <p className="text-sm text-gray-600">Service Center</p>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}