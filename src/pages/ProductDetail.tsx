import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="product-detail-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="product-detail-page">
      <button className="product-detail-back" onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="product-detail-container">
        <div className="product-detail-gallery">
          <div className="product-detail-main-image">
            <img src={images[selectedImage]} alt={product.name} />
            {product.tag && <span className="product-detail-tag">{product.tag}</span>}
          </div>
          
          {images.length > 1 && (
            <div className="product-detail-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`product-detail-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-header">
            <span className="product-detail-category">{product.category}</span>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-price">₹{product.price.toLocaleString()}</p>
          </div>

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="product-detail-option">
              <label>Size</label>
              <div className="product-detail-sizes">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`product-detail-size ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="product-detail-option">
              <label>Color</label>
              <div className="product-detail-colors">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`product-detail-color ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ background: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-option">
            <label>Quantity</label>
            <div className="product-detail-quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className="product-detail-add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          {product.material && (
            <div className="product-detail-specs">
              <h3>Material</h3>
              <p>{product.material}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className="product-detail-specs">
              <h3>Care Instructions</h3>
              <p>{product.care_instructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
