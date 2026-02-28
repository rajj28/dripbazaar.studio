import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Plus, Edit2, Trash2, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import './Profile.css';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Address>>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    if (profile) {
      loadAddresses();
    }
  }, [profile]);

  const loadAddresses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('addresses')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading addresses:', error);
      return;
    }

    setAddresses(data?.addresses || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let updatedAddresses: Address[];

      if (editingAddress) {
        // Update existing address
        updatedAddresses = addresses.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : formData.is_default ? { ...addr, is_default: false } : addr
        );
      } else {
        // Add new address
        const newAddress: Address = {
          id: `addr_${Date.now()}`,
          full_name: formData.full_name || '',
          phone: formData.phone || '',
          address_line1: formData.address_line1 || '',
          address_line2: formData.address_line2,
          city: formData.city || '',
          state: formData.state || '',
          pincode: formData.pincode || '',
          is_default: formData.is_default || false
        };

        // If this is the default address, unset others
        updatedAddresses = formData.is_default
          ? [...addresses.map(addr => ({ ...addr, is_default: false })), newAddress]
          : [...addresses, newAddress];
      }

      const { error } = await supabase
        .from('profiles')
        .update({ addresses: updatedAddresses })
        .eq('id', user.id);

      if (error) throw error;

      setAddresses(updatedAddresses);
      resetForm();
      toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddressForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setLoading(true);

    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);

      const { error } = await supabase
        .from('profiles')
        .update({ addresses: updatedAddresses })
        .eq('id', user.id);

      if (error) throw error;

      setAddresses(updatedAddresses);
      toast.success('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      }));

      const { error } = await supabase
        .from('profiles')
        .update({ addresses: updatedAddresses })
        .eq('id', user.id);

      if (error) throw error;

      setAddresses(updatedAddresses);
      toast.success('Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      <div className="profile-container">
        <div className="profile-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
          <h1 className="profile-title">My Profile</h1>
        </div>

        {/* User Info Section */}
        <div className="profile-section">
          <h2 className="section-title">Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{profile?.full_name || 'Not set'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{profile?.phone || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2 className="section-title">
              <MapPin size={24} />
              Saved Addresses
            </h2>
            <button
              className="btn-add-address"
              onClick={() => setShowAddressForm(true)}
            >
              <Plus size={20} />
              Add New Address
            </button>
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="address-form-overlay">
              <div className="address-form-modal">
                <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address Line 1 *</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2 || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-checkbox">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={formData.is_default}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                    />
                    <label htmlFor="is_default">Set as default address</label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Address List */}
          <div className="addresses-grid">
            {addresses.length === 0 ? (
              <div className="no-addresses">
                <MapPin size={48} />
                <p>No saved addresses yet</p>
                <button
                  className="btn-add-first"
                  onClick={() => setShowAddressForm(true)}
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`address-card ${address.is_default ? 'default' : ''}`}
                >
                  {address.is_default && (
                    <div className="default-badge">
                      <Check size={16} />
                      Default
                    </div>
                  )}
                  <div className="address-content">
                    <h4>{address.full_name}</h4>
                    <p>{address.phone}</p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <div className="address-actions">
                    {!address.is_default && (
                      <button
                        className="btn-set-default"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={loading}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(address)}
                      disabled={loading}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(address.id)}
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
