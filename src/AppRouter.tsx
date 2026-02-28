import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import NavOverlay from './components/NavOverlay';

// Eager load HomePage (critical for initial render)
import HomePage from './pages/HomePage';

// Lazy load all other routes
const PremiumProducts = lazy(() => import('./pages/PremiumProducts'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #F97316, #C2410C)',
      color: 'white',
      fontFamily: 'var(--font-hero)',
      fontSize: '1.5rem',
      letterSpacing: '0.2em'
    }}>
      LOADING...
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavOverlay />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/premium" element={<PremiumProducts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </BrowserRouter>
  );
}
