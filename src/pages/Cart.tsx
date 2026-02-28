import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 2L7.17 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1h-4.17L15 2H9z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>

              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p className="cart-item-category">{item.product.category}</p>
                {item.size && <p className="cart-item-variant">Size: {item.size}</p>}
                {item.color && <p className="cart-item-variant">Color: {item.color}</p>}
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-price">
                <span className="cart-item-total">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                <span className="cart-item-unit">₹{item.product.price.toLocaleString()} each</span>
              </div>

              <button 
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="cart-summary-divider"></div>
          
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>

          <button 
            className="cart-checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <button 
            className="cart-continue-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
