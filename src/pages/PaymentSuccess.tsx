import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dropName, formData } = location.state || { dropName: 'DROP 01', formData: {} };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          <CheckCircle size={80} color="#4ade80" />
        </div>
        
        <h1 className="success-title">Payment Submitted!</h1>
        <p className="success-subtitle">Your pre-booking is being processed</p>

        <div className="success-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Product:</span>
            <span>{dropName}</span>
          </div>
          <div className="detail-row">
            <span>Size:</span>
            <span>{formData.size || 'M'}</span>
          </div>
          <div className="detail-row">
            <span>Amount Paid:</span>
            <span className="amount">₹1234</span>
          </div>
        </div>

        <div className="success-message">
          <p>
            Thank you for your pre-booking! We have received your payment details and will verify them within 24 hours.
          </p>
          <p>
            You will receive a confirmation email once your payment is verified. Your order will be shipped within 15-20 days.
          </p>
        </div>

        <button className="success-button" onClick={() => navigate('/')}>
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
