import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { handleError, validateTransactionId } from '../utils/errorHandler';
import './PreBookPayment.css';

export default function PreBookPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { dropName, formData, orderId } = location.state || { dropName: 'DROP 01', formData: {}, orderId: null };
  
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      setPaymentProof(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    if (!orderId) {
      setError('Order not found. Please start over.');
      return;
    }

    // Validate transaction ID
    const validation = validateTransactionId(transactionId);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }

    if (!paymentProof) {
      setError('Please upload payment screenshot');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Upload payment screenshot
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${user.id}/${orderId}.${fileExt}`;
      
      setUploadProgress(30);
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      setUploadProgress(80);

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          user_id: user.id,
          transaction_id: transactionId,
          amount: 1234.00,
          payment_method: 'UPI',
          payment_screenshot_url: publicUrl,
          status: 'pending'
        });

      if (paymentError) throw paymentError;

      // Update order status
      await supabase
        .from('orders')
        .update({ status: 'payment_submitted' })
        .eq('id', orderId);

      setUploadProgress(100);

      // Send payment received email
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'payment_received',
            orderId: orderId,
            userEmail: user.email,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send payment email:', emailError);
        // Don't block the flow if email fails
      }

      // Navigate to success page
      navigate('/payment-success', { state: { dropName, formData, orderId } });
    } catch (err) {
      const errorMessage = handleError(err, 'Payment submission');
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <button className="payment-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="payment-header">
          <h1 className="payment-title">Complete Payment</h1>
          <p className="payment-subtitle">{dropName} Pre-Booking</p>
        </div>

        <div className="payment-content">
          <div className="payment-left">
            <div className="qr-section">
              <h2 className="qr-title">Scan QR Code to Pay</h2>
              <div className="qr-container">
                <img 
                  src="/qrcode.png" 
                  alt="Payment QR Code" 
                  className="qr-image"
                />
              </div>
              <div className="payment-amount">
                <span className="amount-label">Amount to Pay:</span>
                <span className="amount-value">₹1234</span>
              </div>
              <div className="payment-instructions">
                <h3>Payment Instructions:</h3>
                <ol>
                  <li>Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
                  <li>Scan the QR code above</li>
                  <li>Enter amount: ₹1234</li>
                  <li>Complete the payment</li>
                  <li>Note down your Transaction ID</li>
                  <li>Upload payment screenshot below</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="payment-right">
            <form className="payment-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Confirm Payment</h2>
              
              <div className="form-group">
                <label htmlFor="transactionId">Transaction ID / UTR Number *</label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="Enter 12-digit transaction ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentProof">Upload Payment Screenshot *</label>
                <input
                  type="file"
                  id="paymentProof"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="file-input"
                />
                {paymentProof && (
                  <span className="file-name">✓ {paymentProof.name}</span>
                )}
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Product:</span>
                  <span>{dropName}</span>
                </div>
                <div className="summary-row">
                  <span>Size:</span>
                  <span>{formData.size || 'M'}</span>
                </div>
                <div className="summary-row">
                  <span>Name:</span>
                  <span>{formData.name || 'N/A'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹1234</span>
                </div>
              </div>

              {error && (
                <div className="payment-error">
                  {error}
                </div>
              )}

              {loading && uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% uploaded</span>
                </div>
              )}

              <button type="submit" className="payment-submit" disabled={loading}>
                {loading ? 'PROCESSING...' : 'CONFIRM PAYMENT'}
              </button>

              <p className="payment-note">
                * Your order will be confirmed once we verify your payment. You will receive a confirmation email within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
