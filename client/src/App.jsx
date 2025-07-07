import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/common/NotFound'
import { InvoiceManagementSystem } from './pages/InvoiceManagementSystem'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<InvoiceManagementSystem />} />
      </Routes>
    </BrowserRouter>
  )
}