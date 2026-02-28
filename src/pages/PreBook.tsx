import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { handleError, validatePhone, validatePincode } from '../utils/errorHandler';
import './PreBook.css';

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  size: string;
}

export default function PreBook() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const dropName = searchParams.get('name') || 'DROP 01';
  const dropId = parseInt(searchParams.get('drop') || '1');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    size: 'M'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);

  // Pre-fill name from profile
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    // Validate phone
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      setError(phoneValidation.error!);
      return;
    }

    // Validate pincode
    const pincodeValidation = validatePincode(formData.pincode);
    if (!pincodeValidation.valid) {
      setError(pincodeValidation.error!);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          drop_name: dropName,
          drop_id: dropId,
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          size: formData.size,
          price: 1234.00,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Send order confirmation email
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'order_confirmation',
            orderId: order.id,
            userEmail: user.email,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't block the flow if email fails
      }

      // Navigate to payment with order ID
      navigate('/prebook-payment', { 
        state: { 
          dropName, 
          formData,
          orderId: order.id
        } 
      });
    } catch (err) {
      const errorMessage = handleError(err, 'PreBook submission');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="prebook-page">
        <div className="prebook-container">
          <p style={{ textAlign: 'center', color: 'white' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="prebook-page">
      <div className="prebook-container">
        <button className="prebook-back" onClick={() => navigate('/')}>
          ← Back to Collection
        </button>

        <div className="prebook-header">
          <h1 className="prebook-title">PRE-BOOK {dropName}</h1>
          <p className="prebook-subtitle">Secure your exclusive piece</p>
          <div className="prebook-price-info">
            <span className="prebook-price-original">₹4999</span>
            <span className="prebook-price">₹1234</span>
          </div>
        </div>

        <form className="prebook-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Personal Details</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Delivery Address</h2>
            
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="House no., Building name, Street"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Product Details</h2>
            
            <div className="form-group">
              <label htmlFor="size">Select Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="XS">XS - Extra Small</option>
                <option value="S">S - Small</option>
                <option value="M">M - Medium</option>
                <option value="L">L - Large</option>
                <option value="XL">XL - Extra Large</option>
                <option value="XXL">XXL - Double XL</option>
              </select>
            </div>
          </div>

          <div className="prebook-summary">
            <div className="summary-row">
              <span>Product:</span>
              <span>{dropName}</span>
            </div>
            <div className="summary-row">
              <span>Size:</span>
              <span>{formData.size}</span>
            </div>
            <div className="summary-row">
              <span>Pre-booking Amount:</span>
              <span className="summary-price">₹1234</span>
            </div>
          </div>

          {error && (
            <div className="prebook-error">
              {error}
            </div>
          )}

          <button type="submit" className="prebook-submit" disabled={loading}>
            {loading ? 'PROCESSING...' : 'CONFIRM PRE-BOOKING'}
          </button>

          <p className="prebook-note">
            * Pre-booking amount is non-refundable. Product will be shipped within 15-20 days.
          </p>
        </form>
      </div>
    </div>
  );
}
