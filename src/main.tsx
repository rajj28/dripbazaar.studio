import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.tsx'
import Auth from './pages/Auth.tsx'
import PreBook from './pages/PreBook.tsx'
import PreBookPayment from './pages/PreBookPayment.tsx'
import PaymentSuccess from './pages/PaymentSuccess.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/prebook" element={<PreBook />} />
          <Route path="/prebook-payment" element={<PreBookPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
