import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Order, Payment } from '../lib/supabaseClient';
import { handleError } from '../utils/errorHandler';
import './AdminDashboard.css';

interface OrderAddress {
  full_name?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface OrderWithPayment extends Order {
  payments: Payment[];
  address: OrderAddress;
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/auth', { state: { from: { pathname: '/admin' } } });
        return;
      }

      // Check if user has admin role in profile
      if (profile?.role === 'admin') {
        setIsAdmin(true);
        setCheckingAdmin(false);
        return;
      }

      // If no role in profile, check email (you can add your admin emails here)
      const adminEmails = [
        'admin@dripbazaar.studio',
        'your-email@example.com', // Add your admin email here
      ];

      if (adminEmails.includes(user.email || '')) {
        setIsAdmin(true);
        setCheckingAdmin(false);
        return;
      }

      // Not an admin
      setIsAdmin(false);
      setCheckingAdmin(false);
      alert('Access denied. Admin privileges required.');
      navigate('/');
    };

    checkAdminStatus();
  }, [user, profile, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders with filter:', filter);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          payments(*)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        console.log('Filtering for pending orders (statuses: pending, payment_submitted, payment_verified)');
        query = query.in('status', ['pending', 'payment_submitted', 'payment_verified']);
      } else if (filter === 'verified') {
        console.log('Filtering for verified orders (statuses: confirmed, shipped, delivered)');
        query = query.in('status', ['confirmed', 'shipped', 'delivered']);
      } else {
        console.log('Fetching all orders');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        alert(`Failed to load orders: ${error.message}`);
        throw error;
      }
      
      console.log('Fetched orders:', data);
      console.log('Number of orders:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Order statuses:', data.map(o => ({ id: o.id.slice(0, 8), status: o.status })));
        console.log('First order details:', {
          id: data[0].id.slice(0, 8),
          status: data[0].status,
          payment_method: data[0].payment_method,
          total_amount: data[0].total_amount
        });
        
        // Alert to help debug
        const statusList = data.map(o => `${o.id.slice(0, 8)}: ${o.status}`).join(', ');
        console.log('📋 ORDER STATUS SUMMARY:', statusList);
      }
      setOrders(data as OrderWithPayment[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (order: OrderWithPayment) => {
    setVerifying(true);
    try {
      console.log('🔄 Confirming order:', order.id.slice(0, 8));
      
      // Update payment status if payment exists
      if (order.payments?.[0]) {
        const payment = order.payments[0];
        
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString(),
            verified_by: user?.id,
          })
          .eq('id', payment.id);

        if (paymentError) {
          console.error('Payment update error:', paymentError);
          throw paymentError;
        }
        console.log('✅ Payment status updated');
      }

      // Update order status to confirmed
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', order.id);

      if (orderError) {
        console.error('Order update error:', orderError);
        throw orderError;
      }
      console.log('✅ Order status updated to confirmed');
      
      // Verify the update worked
      const { data: verifyData } = await supabase
        .from('orders')
        .select('id, status')
        .eq('id', order.id)
        .single();
      console.log('🔍 Verification - Order status in DB:', verifyData?.status);

      // Send confirmation email
      const userEmail = order.address?.email || order.address?.full_name;
      if (userEmail) {
        try {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              type: 'payment_verified',
              orderId: order.id,
              userEmail: userEmail,
            }),
          });
          console.log('✅ Email sent');
        } catch (emailError) {
          console.warn('Email send failed (non-critical):', emailError);
        }
      }

      alert('Order confirmed successfully!');
      setSelectedOrder(null);
      
      // Force refresh the orders list
      console.log('🔄 Refreshing orders list...');
      await fetchOrders();
      console.log('✅ Orders list refreshed');
    } catch (error) {
      const errorMessage = handleError(error, 'Order confirmation');
      console.error('❌ Order confirmation failed:', error);
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

  // Show loading while checking admin status
  if (checkingAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Checking admin access...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="admin-empty">
          <h2>Access Denied</h2>
          <p>You do not have permission to access the admin dashboard.</p>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage orders and payments</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="admin-back" 
            onClick={() => {
              console.log('Refreshing orders...');
              fetchOrders();
            }}
            style={{ background: 'rgba(249, 115, 22, 0.2)', borderColor: '#F97316', color: '#F97316' }}
          >
            🔄 Refresh
          </button>
          <button className="admin-back" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
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
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            // Debug: Log order status
            const shouldShowButton = !['confirmed', 'shipped', 'delivered', 'cancelled'].includes(order.status);
            console.log(`Order ${order.id.slice(0, 8)} - Status: "${order.status}" - Show button: ${shouldShowButton}`);
            
            return (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3 className="order-drop">{order.drop_name || order.items?.[0]?.name || 'Order'}</h3>
                  <p className="order-id">Order #{order.id.slice(0, 8)}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-card-body">
                <div className="order-info-row">
                  <span className="order-label">Customer:</span>
                  <span className="order-value">{order.full_name || order.address?.full_name || 'N/A'}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Email:</span>
                  <span className="order-value">{order.address?.email || 'N/A'}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Phone:</span>
                  <span className="order-value">{order.phone || order.address?.phone || 'N/A'}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Size:</span>
                  <span className="order-value">{order.size || 'N/A'}</span>
                </div>
                <div className="order-info-row">
                  <span className="order-label">Amount:</span>
                  <span className="order-value order-amount">₹{order.price || order.total_amount}</span>
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
                {/* Show confirm button for orders that need confirmation */}
                {!['confirmed', 'shipped', 'delivered', 'cancelled'].includes(order.status) && (
                  <button
                    className="order-btn order-btn-verify"
                    onClick={() => verifyPayment(order)}
                    disabled={verifying}
                    style={{ 
                      display: 'block',
                      width: '100%',
                      marginTop: '8px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {verifying ? 'Confirming...' : '✓ Confirm Order'}
                  </button>
                )}
              </div>
            </div>
            );
          })}
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
                <p><strong>Name:</strong> {selectedOrder.full_name || selectedOrder.address?.full_name}</p>
                <p><strong>Email:</strong> {selectedOrder.address?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone || selectedOrder.address?.phone}</p>
              </div>

              <div className="modal-section">
                <h3>Delivery Address</h3>
                <p>{selectedOrder.address?.address_line1 || selectedOrder.address?.address || 'N/A'}</p>
                {selectedOrder.address?.address_line2 && <p>{selectedOrder.address.address_line2}</p>}
                <p>{selectedOrder.address?.city || selectedOrder.city}, {selectedOrder.address?.state || selectedOrder.state} - {selectedOrder.address?.pincode || selectedOrder.pincode}</p>
              </div>

              <div className="modal-section">
                <h3>Order Details</h3>
                <p><strong>Product:</strong> {selectedOrder.drop_name || selectedOrder.items?.[0]?.name || 'N/A'}</p>
                <p><strong>Size:</strong> {selectedOrder.size || selectedOrder.items?.[0]?.size || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{selectedOrder.price || selectedOrder.total_amount}</p>
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error('Image failed to load:', selectedOrder.payments[0].payment_screenshot_url);
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.screenshot-error')) {
                            const errorMsg = document.createElement('p');
                            errorMsg.className = 'screenshot-error';
                            errorMsg.style.color = '#ef4444';
                            errorMsg.style.fontSize = '0.9rem';
                            errorMsg.textContent = 'Failed to load screenshot. Check if bucket is public.';
                            parent.appendChild(errorMsg);
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', selectedOrder.payments[0].payment_screenshot_url);
                        }}
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
                  {!selectedOrder.payments[0].payment_screenshot_url && selectedOrder.payments[0].payment_method === 'razorpay' && (
                    <div className="payment-screenshot">
                      <p><strong>Payment Method:</strong> Razorpay (No screenshot required)</p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                        Transaction verified through Razorpay gateway
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              {/* Show confirm button for orders that need confirmation */}
              {!['confirmed', 'shipped', 'delivered', 'cancelled'].includes(selectedOrder.status) && (
                <>
                  <button
                    className="modal-btn modal-btn-verify"
                    onClick={() => verifyPayment(selectedOrder)}
                    disabled={verifying}
                  >
                    {verifying ? 'Confirming...' : '✓ Confirm Order'}
                  </button>
                  <button
                    className="modal-btn modal-btn-reject"
                    onClick={() => {
                      const reason = prompt('Enter rejection reason:');
                      if (reason) rejectPayment(selectedOrder, reason);
                    }}
                  >
                    ✕ Reject Order
                  </button>
                </>
              )}
              {selectedOrder.status === 'confirmed' && (
                <div className="modal-verified-badge">
                  ✓ Order Confirmed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
