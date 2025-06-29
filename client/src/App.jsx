import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import InvoicePage from './pages/InvoicePage'
import InvoiceList from './pages/InvoiceList'
import InventoryManagement from './pages/InventoryManagement'
import AddInventory from './pages/AddInventory'
import NotFound from './pages/common/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Dashboard />}>
          <Route path='/' element={<InvoicePage />} />
          <Route path='/invoices' element={<InvoiceList />} />
          <Route path='/inventory' element={<InventoryManagement />} />
          <Route path='/inventory/add' element={<AddInventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}