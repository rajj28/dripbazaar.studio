import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './CarouselMorphTransition.css';

const cards = [
    { id: 1, title: "Heritage Collection", subtitle: "Timeless Elegance", image: "/images/card1.jpg" },
    { id: 2, title: "Royal Ensemble", subtitle: "Regal Traditions", image: "/images/card2.jpg" },
    { id: 3, title: "Artisan Series", subtitle: "Handcrafted Beauty", image: "/images/card3.jpg" },
    { id: 4, title: "Modern Classic", subtitle: "Contemporary Grace", image: "/images/card4.jpg" },
    { id: 5, title: "Signature Line", subtitle: "Exclusive Designs", image: "/images/card5.jpg" },
    { id: 6, title: "Premium Select", subtitle: "Curated Excellence", image: "/images/card6.jpg" },
];

export default function CarouselMorphTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Title animation
    const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
    
    // Cards entrance
    const cardsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
    const cardsY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);

    return (
        <div ref={containerRef} className="portal-container">
            <div className="portal-sticky">
                {/* Premium Background */}
                <div className="premium-background">
                    <div className="premium-pattern" />
                </div>

                {/* Center Title */}
                <motion.div 
                    className="portal-text"
                    style={{
                        opacity: titleOpacity,
                        y: titleY,
                    }}
                >
                    <h2 className="portal-title">RIWAAZ</h2>
                    <p className="portal-subtitle">Premium Collection</p>
                </motion.div>

                {/* Museum-style Card Grid */}
                <motion.div 
                    className="premium-grid"
                    style={{
                        opacity: cardsOpacity,
                        y: cardsY,
                    }}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            className="premium-card"
                            style={{
                                opacity: useTransform(
                                    scrollYProgress,
                                    [0.4 + index * 0.03, 0.5 + index * 0.03],
                                    [0, 1]
                                ),
                            }}
                        >
                            <div className="premium-card-image" style={{ backgroundImage: `url('${card.image}')` }}>
                                <div className="premium-card-overlay" />
                            </div>
                            <div className="premium-card-info">
                                <div className="premium-card-border" />
                                <h3 className="premium-card-title">{card.title}</h3>
                                <p className="premium-card-subtitle">{card.subtitle}</p>
                                <div className="premium-card-accent" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll hint */}
                <motion.div 
                    className="portal-hint"
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0])
                    }}
                >
                    Scroll to explore
                </motion.div>
            </div>
        </div>
    );
}
