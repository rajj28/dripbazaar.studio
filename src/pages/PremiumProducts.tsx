import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import './PremiumProducts.css';

export default function PremiumProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchPremiumProducts();
  }, []);

  const fetchPremiumProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_premium', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching premium products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="premium-spinner"></div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="premium-hero">
        <h1 className="premium-hero-title">Drip Riwaaz Premium</h1>
        <p className="premium-hero-subtitle">
          Exclusive pieces for those who demand excellence. Limited editions, superior craftsmanship.
        </p>
      </div>

      <div className="premium-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="premium-card"
            onClick={() => handleProductClick(product.id)}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="premium-card-image-wrapper">
              <img 
                src={product.image} 
                alt={product.name}
                className="premium-card-image"
              />
              {product.tag && <span className="premium-card-tag">{product.tag}</span>}
              
              <button 
                className={`premium-quick-add ${hoveredId === product.id ? 'visible' : ''}`}
                onClick={(e) => handleQuickAdd(e, product)}
              >
                Quick Add
              </button>
            </div>
            
            <div className="premium-card-info">
              <div className="premium-card-details">
                <span className="premium-card-category">{product.category}</span>
                <h3 className="premium-card-name">{product.name}</h3>
              </div>
              <span className="premium-card-price">₹{product.price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
