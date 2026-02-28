import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="order-success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h1>Order Placed Successfully!</h1>
        <p className="order-success-message">
          Thank you for your purchase. Your order has been confirmed and will be delivered soon.
        </p>

        {orderId && (
          <div className="order-success-id">
            <span>Order ID:</span>
            <strong>{orderId}</strong>
          </div>
        )}

        <div className="order-success-actions">
          <button 
            className="order-success-primary-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>

        <div className="order-success-info">
          <p>You will receive an email confirmation shortly with your order details.</p>
        </div>
      </div>
    </div>
  );
}
