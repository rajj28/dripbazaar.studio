import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Order, Payment } from '../lib/supabaseClient';
import { handleError } from '../utils/errorHandler';
import './AdminDashboard.css';

interface OrderWithPayment extends Order {
  payments: Payment[];
  profiles: {
    email: string;
    full_name: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'confirmed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Check if user is admin (you can add admin role check here)
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/admin' } } });
      return;
    }
    
    fetchOrders();
  }, [user, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select(`
          *,
          payments(*),
          profiles:user_id(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'payment_submitted');
      } else if (filter === 'verified') {
        query = query.in('status', ['payment_verified', 'confirmed']);
      } else if (filter === 'confirmed') {
        query = query.eq('status', 'confirmed');
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data as OrderWithPayment[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (order: OrderWithPayment) => {
    if (!order.payments?.[0]) {
      alert('No payment found for this order');
      return;
    }

    setVerifying(true);
    try {
      const payment = order.payments[0];

      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq('id', payment.id);

      if (paymentError) throw paymentError;

      // Update order status to confirmed (payment verified and order confirmed)
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Send verification email
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'payment_verified',
          orderId: order.id,
          userEmail: order.profiles.email,
        }),
      });

      alert('Payment verified successfully! Email sent to customer.');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      const errorMessage = handleError(error, 'Payment verification');
      alert(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const rejectPayment = async (order: OrderWithPayment, reason: string) => {
    if (!order.payments?.[0]) return;

    try {
      const payment = order.payments[0];

      await supabase
        .from('payments')
        .update({
          status: 'failed',
          admin_notes: reason,
        })
        .eq('id', payment.id);

      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id);

      alert('Payment rejected');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      const errorMessage = handleError(error, 'Payment rejection');
      alert(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: '#fbbf24', text: 'Pending' },
      payment_submitted: { color: '#3b82f6', text: 'Payment Submitted' },
      payment_verified: { color: '#4ade80', text: 'Verified' },
      confirmed: { color: '#22c55e', text: 'Confirmed' },
      shipped: { color: '#8b5cf6', text: 'Shipped' },
      delivered: { color: '#10b981', text: 'Delivered' },
      cancelled: { color: '#ef4444', text: 'Cancelled' },
    };

    const badge = badges[status] || { color: '#6b7280', text: status };
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: `${badge.color}22`, color: badge.color }}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage orders and payments</p>
        </div>
        <button className="admin-back" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>

      <div className="admin-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending Verification
        </button>
        <button
          className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
          onClick={() => setFilter('verified')}
        >
          Verified & Confirmed
        </button>
        <button
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3 className="order-drop">{order.drop_name}</h3>
                  <p className="order-id">Order #{order.id.slice(0, 8)}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-card-body">
                <div className="order-info-row">
                  <span className="order-label">Customer:</span>
                  <span className="order-value">{order.full_name}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Email:</span>
                  <span className="order-value">{order.profiles.email}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Phone:</span>
                  <span className="order-value">{order.phone}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Size:</span>
                  <span className="order-value">{order.size}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Amount:</span>
                  <span className="order-value order-amount">₹{order.price}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Date:</span>
                  <span className="order-value">{formatDate(order.created_at)}</span>
                </div>

                {order.payments?.[0] && (
                  <>
                    <div className="order-divider"></div>
                    <div className="order-info-row">
                      <span className="order-label">Transaction ID:</span>
                      <span className="order-value">{order.payments[0].transaction_id}</span>
                    </div>
                    <div className="order-info-row">
                      <span className="order-label">Payment Status:</span>
                      {getStatusBadge(order.payments[0].status)}
                    </div>
                  </>
                )}
              </div>

              <div className="order-card-footer">
                <button
                  className="order-btn order-btn-view"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
                {order.status === 'payment_submitted' && (
                  <button
                    className="order-btn order-btn-verify"
                    onClick={() => verifyPayment(order)}
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying...' : 'Verify Payment'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.full_name}</p>
                <p><strong>Email:</strong> {selectedOrder.profiles.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
              </div>

              <div className="modal-section">
                <h3>Delivery Address</h3>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
              </div>

              <div className="modal-section">
                <h3>Order Details</h3>
                <p><strong>Product:</strong> {selectedOrder.drop_name}</p>
                <p><strong>Size:</strong> {selectedOrder.size}</p>
                <p><strong>Amount:</strong> ₹{selectedOrder.price}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
              </div>

              {selectedOrder.payments?.[0] && (
                <div className="modal-section">
                  <h3>Payment Information</h3>
                  <p><strong>Transaction ID:</strong> {selectedOrder.payments[0].transaction_id}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.payments[0].payment_method}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.payments[0].status)}</p>
                  
                  {selectedOrder.payments[0].payment_screenshot_url && (
                    <div className="payment-screenshot">
                      <p><strong>Payment Screenshot:</strong></p>
                      <img
                        src={selectedOrder.payments[0].payment_screenshot_url}
                        alt="Payment proof"
                        className="screenshot-img"
                      />
                      <a
                        href={selectedOrder.payments[0].payment_screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="screenshot-link"
                      >
                        Open in new tab →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedOrder.status === 'payment_submitted' && (
                <>
                  <button
                    className="modal-btn modal-btn-verify"
                    onClick={() => verifyPayment(selectedOrder)}
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying...' : '✓ Verify Payment'}
                  </button>
                  <button
                    className="modal-btn modal-btn-reject"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) rejectPayment(selectedOrder, reason);
                    }}
                  >
                    ✕ Reject Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
