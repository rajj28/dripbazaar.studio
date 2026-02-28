import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Package, Clock, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../lib/supabaseClient';
import { SkeletonOrderList } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import './Orders.css';

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Loading orders for user:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        throw error;
      }
      
      console.log('Orders loaded:', data);
      console.log('Number of orders:', data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'payment_submitted':
      case 'payment_verified':
        return <CheckCircle size={20} className="status-icon verified" />;
      case 'confirmed':
      case 'shipped':
      case 'delivered':
        return <CheckCircle size={20} className="status-icon success" />;
      case 'cancelled':
        return <XCircle size={20} className="status-icon cancelled" />;
      default:
        return <Clock size={20} className="status-icon" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      payment_submitted: 'Payment Submitted',
      payment_verified: 'Payment Verified',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return 'N/A';
    return `${address.address_line1}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <EmptyState
            type="orders"
            title="Please Log In"
            message="You need to be logged in to view your orders."
            actionLabel="Sign In"
            onAction={() => navigate('/auth')}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <button className="btn-back" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Home
            </button>
            <h1 className="orders-title">
              <Package size={36} />
              My Orders
            </h1>
          </div>
          <SkeletonOrderList count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="orders-title">
            <Package size={36} />
            My Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            type="orders"
            title="No Orders Yet"
            message="You haven't placed any orders yet. Start shopping to see your orders here."
            actionLabel="Start Shopping"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="order-label">Order ID:</span>
                    <span className="order-value">{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-info-row">
                    <div className="order-info-item">
                      <span className="info-label">Date:</span>
                      <span className="info-value">{formatDate(order.created_at)}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Total:</span>
                      <span className="info-value amount">₹{(order.price || order.total_amount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <span className="info-label">Items:</span>
                    <div className="items-list">
                      {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                        <div key={index} className="item-row">
                          <span>{item.name || item.drop_name || 'Product'}</span>
                          <span className="item-qty">x{item.quantity || 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.address && (
                    <div className="order-address">
                      <span className="info-label">Delivery Address:</span>
                      <p className="info-value">{formatAddress(order.address)}</p>
                    </div>
                  )}

                  {order.payment_method && (
                    <div className="order-payment">
                      <span className="info-label">Payment Method:</span>
                      <span className="info-value">{order.payment_method}</span>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
              </div>
              <div className="modal-content">
                <div className="modal-section">
                  <h3>Order Information</h3>
                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
                  <p><strong>Total Amount:</strong> ₹{(selectedOrder.price || selectedOrder.total_amount || 0).toFixed(2)}</p>
                </div>

                <div className="modal-section">
                  <h3>Items</h3>
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="modal-item">
                      <p><strong>{item.name || item.drop_name || 'Product'}</strong></p>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>Price: ₹{item.price || 0}</p>
                    </div>
                  ))}
                </div>

                {selectedOrder.address && (
                  <div className="modal-section">
                    <h3>Delivery Address</h3>
                    <p>{selectedOrder.address.full_name}</p>
                    <p>{selectedOrder.address.phone}</p>
                    <p>{formatAddress(selectedOrder.address)}</p>
                  </div>
                )}

                {selectedOrder.payment_method && (
                  <div className="modal-section">
                    <h3>Payment Information</h3>
                    <p><strong>Method:</strong> {selectedOrder.payment_method}</p>
                    {selectedOrder.razorpay_order_id && (
                      <p><strong>Razorpay Order ID:</strong> {selectedOrder.razorpay_order_id}</p>
                    )}
                    {selectedOrder.razorpay_payment_id && (
                      <p><strong>Payment ID:</strong> {selectedOrder.razorpay_payment_id}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
