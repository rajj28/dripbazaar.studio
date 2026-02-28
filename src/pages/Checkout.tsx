import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Address } from '../types';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount } = useCart();
  
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [address, setAddress] = useState<Address>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState<Partial<Address>>({});

  const validateAddress = () => {
    const newErrors: Partial<Address> = {};
    
    if (!address.full_name.trim()) newErrors.full_name = 'Name is required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }
    if (!address.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('payment');
    }
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (cartCount === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  const shippingCost = cartTotal > 2000 ? 0 : 150;
  const total = cartTotal + shippingCost;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`checkout-step ${step === 'address' ? 'active' : 'completed'}`}>
            <span className="checkout-step-number">1</span>
            <span className="checkout-step-label">Address</span>
          </div>
          <div className="checkout-step-line"></div>
          <div className={`checkout-step ${step === 'payment' ? 'active' : ''}`}>
            <span className="checkout-step-number">2</span>
            <span className="checkout-step-label">Payment</span>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          {step === 'address' && (
            <div className="checkout-section">
              <h2>Delivery Address</h2>
              <form onSubmit={handleAddressSubmit} className="checkout-form">
                <div className="checkout-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={address.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={errors.full_name ? 'error' : ''}
                  />
                  {errors.full_name && <span className="checkout-error">{errors.full_name}</span>}
                </div>

                <div className="checkout-form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="checkout-error">{errors.phone}</span>}
                </div>

                <div className="checkout-form-group">
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    value={address.address_line1}
                    onChange={(e) => handleInputChange('address_line1', e.target.value)}
                    placeholder="House No., Building Name"
                    className={errors.address_line1 ? 'error' : ''}
                  />
                  {errors.address_line1 && <span className="checkout-error">{errors.address_line1}</span>}
                </div>

                <div className="checkout-form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    value={address.address_line2}
                    onChange={(e) => handleInputChange('address_line2', e.target.value)}
                    placeholder="Road Name, Area, Colony"
                  />
                </div>

                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="checkout-error">{errors.city}</span>}
                  </div>

                  <div className="checkout-form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="checkout-error">{errors.state}</span>}
                  </div>

                  <div className="checkout-form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="6-digit pincode"
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="checkout-error">{errors.pincode}</span>}
                  </div>
                </div>

                <button type="submit" className="checkout-continue-btn">
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="checkout-section">
              <button 
                className="checkout-back-btn"
                onClick={() => setStep('address')}
              >
                ← Back to Address
              </button>
              
              <h2>Payment Method</h2>
              
              <div className="checkout-address-summary">
                <h3>Delivering to:</h3>
                <p>{address.full_name}</p>
                <p>{address.address_line1}, {address.address_line2}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p>Phone: {address.phone}</p>
              </div>

              <button 
                className="checkout-payment-btn"
                onClick={() => navigate('/payment', { state: { address, total } })}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>

        <div className="checkout-sidebar">
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            
            <div className="checkout-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="checkout-item-info">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    {item.size && <p>Size: {item.size}</p>}
                  </div>
                  <span className="checkout-item-price">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary-divider"></div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
            </div>

            {shippingCost > 0 && (
              <p className="checkout-free-shipping-note">
                Add ₹{(2000 - cartTotal).toLocaleString()} more for FREE shipping
              </p>
            )}

            <div className="checkout-summary-divider"></div>

            <div className="checkout-summary-row checkout-summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
