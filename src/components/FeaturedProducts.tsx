import { useState } from 'react';
import './FeaturedProducts.css';

const products = [
    {
        id: 1,
        name: 'Urban Rebel Tee',
        category: 'Essentials',
        price: '₹1,299',
        image: '/images/card1.jpg',
        tag: 'Bestseller'
    },
    {
        id: 2,
        name: 'Street Hoodie',
        category: 'Essentials',
        price: '₹2,499',
        image: '/images/card2.jpg',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Chaos Joggers',
        category: 'Essentials',
        price: '₹1,899',
        image: '/images/card3.jpg',
        tag: 'Trending'
    },
    {
        id: 4,
        name: 'Minimal Jacket',
        category: 'Essentials',
        price: '₹3,499',
        image: '/images/card4.jpg',
        tag: 'Limited'
    },
    {
        id: 5,
        name: 'Classic Denim',
        category: 'Essentials',
        price: '₹2,799',
        image: '/images/card5.jpg',
        tag: 'Popular'
    },
    {
        id: 6,
        name: 'Edge Bomber',
        category: 'Essentials',
        price: '₹4,299',
        image: '/images/card6.jpg',
        tag: 'Hot'
    }
];

export default function FeaturedProducts() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="featured-section">
            {/* Section Header */}
            <div className="featured-header">
                <div className="featured-header-content">
                    <span className="featured-eyebrow">Everyday Essentials</span>
                    <h2 className="featured-title">Featured Collection</h2>
                    <p className="featured-subtitle">
                        Street-ready pieces for those who live the chaos daily.
                    </p>
                </div>
                <button className="featured-view-all">
                    View All Products
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* Product Grid */}
            <div className="featured-grid">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="featured-card"
                        onMouseEnter={() => setHoveredId(product.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <div className="featured-card-image-wrapper">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="featured-card-image"
                            />
                            <span className="featured-card-tag">{product.tag}</span>
                            
                            {/* Quick Add Button - appears on hover */}
                            <button 
                                className={`featured-quick-add ${hoveredId === product.id ? 'visible' : ''}`}
                            >
                                Quick Add
                            </button>
                        </div>
                        
                        <div className="featured-card-info">
                            <div className="featured-card-details">
                                <span className="featured-card-category">{product.category}</span>
                                <h3 className="featured-card-name">{product.name}</h3>
                            </div>
                            <span className="featured-card-price">{product.price}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom CTA Banner */}
            <div className="featured-cta-banner">
                <div className="featured-cta-content">
                    <h3 className="featured-cta-title">Every Legend Starts Somewhere</h3>
                    <p className="featured-cta-text">Master the basics. Own the streets. Elevate when ready.</p>
                </div>
                <button className="featured-cta-button">
                    Shop All Essentials
                </button>
            </div>
        </section>
    );
}
