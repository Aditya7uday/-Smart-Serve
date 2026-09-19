import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
