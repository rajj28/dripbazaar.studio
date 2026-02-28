import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import NavOverlay from './components/NavOverlay';
import HomePage from './pages/HomePage';
import PremiumProducts from './pages/PremiumProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavOverlay />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/premium" element={<PremiumProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
