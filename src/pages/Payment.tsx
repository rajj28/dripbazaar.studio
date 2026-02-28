import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Payment.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { address, total } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | null>(null);

  useEffect(() => {
    if (!address || !total) {
      navigate('/checkout');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [address, total, navigate]);

  const createOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          items: cart,
          total_amount: total,
          address: address, // Store the full address object as JSONB
          status: 'pending',
          payment_method: 'razorpay'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      const order = await createOrder();
      if (!order) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Drip Riwaaz',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Create payment record
            const { error: paymentError } = await supabase
              .from('payments')
              .insert({
                order_id: order.id,
                user_id: user?.id,
                amount: total,
                payment_method: 'razorpay',
                transaction_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: 'pending'
              })
              .select()
              .single();

            if (paymentError) throw paymentError;

            // Update order status to payment_submitted
            await supabase
              .from('orders')
              .update({
                status: 'payment_submitted'
              })
              .eq('id', order.id);

            clearCart();
            navigate('/order-success', { state: { orderId: order.id } });
          } catch (error) {
            console.error('Error updating order:', error);
          }
        },
        prefill: {
          name: address.full_name,
          contact: address.phone
        },
        theme: {
          color: '#F97316'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!address || !total) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Payment Method</h1>

        <div className="payment-methods">
          <div 
            className={`payment-method ${selectedMethod === 'razorpay' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('razorpay')}
          >
            <div className="payment-method-header">
              <div className="payment-method-radio">
                {selectedMethod === 'razorpay' && <div className="payment-method-radio-dot"></div>}
              </div>
              <h3>Pay with Razorpay</h3>
            </div>
            
            <div className="payment-method-options">
              <div className="payment-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8H4V6h16m0 12H4v-6h16m0-8H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                </svg>
                <span>Credit/Debit Card</span>
              </div>
              
              <div className="payment-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
                <span>UPI</span>
              </div>
              
              <div className="payment-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
                </svg>
                <span>Net Banking</span>
              </div>
              
              <div className="payment-option">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 18c-1.11 0-2 .89-2 2a2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2M1 2v2h2l3.6 7.59-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 002 2h12v-2H7.42a.25.25 0 01-.25-.25c0-.05.01-.09.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 00-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z"/>
                </svg>
                <span>Wallets (GPay, PhonePe, Paytm)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-summary">
          <h2>Order Total</h2>
          <div className="payment-total">₹{total.toLocaleString()}</div>
        </div>

        <button 
          className="payment-submit-btn"
          onClick={handlePayment}
          disabled={!selectedMethod || loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>

        <div className="payment-secure">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <span>Secure payment powered by Razorpay</span>
        </div>
      </div>
    </div>
  );
}
