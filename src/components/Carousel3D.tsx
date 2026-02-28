import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import './Carousel3D.css';

const cards = [
    { id: 1, text: "Exhibition 01", year: "2024", accent: "#ffffff", image: "/images/a1.png" },
    { id: 2, text: "Neon Dreams", year: "2025", accent: "#ff0055", image: "/images/a2.png" },
    { id: 3, text: "Urban Chaos", year: "2023", accent: "#00ffcc", image: "/images/a3.png" },
    { id: 4, text: "Silent Void", year: "2024", accent: "#f0f0f0", image: "/images/a4.png" },
    { id: 5, text: "Digital Soul", year: "2025", accent: "#ffaa00", image: "/images/a5.png" },
    { id: 6, text: "Future Past", year: "2022", accent: "#cc00ff", image: "/images/a1.png" },
    { id: 7, text: "Static Noise", year: "2024", accent: "#00ff00", image: "/images/a2.png" },
    { id: 8, text: "Final Frame", year: "2025", accent: "#ff3333", image: "/images/a3.png" },
];

export default function Carousel3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const numCards = cards.length;
    // Radius calculation for the cylinder
    // approx card width is 200px
    const radius = Math.round(200 / 2 / Math.tan(Math.PI / numCards)) + 30;

    // Speed increases from 15s to 3s as you scroll
    const rotationDuration = useTransform(scrollYProgress, [0, 1], [15, 3]);
    
    // Fade out as you scroll
    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);

    return (
        <motion.div
            ref={containerRef}
            className="carousel-container"
            initial={{ y: '100vw', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ opacity }}
            transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 1.5 // Wait for headline to stretch and slight bounce
            }}
        >
            <div className="scene">
                <motion.div
                    className="carousel-ring"
                    animate={{ rotateY: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 15,
                        ease: "linear"
                    }}
                    style={{
                        // Speed multiplier based on scroll
                        animationDuration: useTransform(rotationDuration, (d) => `${d}s`)
                    }}
                >
                    {cards.map((card, i) => {
                        const rotateY = i * (360 / numCards);
                        return (
                            <div
                                key={card.id}
                                className="carousel-item"
                                style={{
                                    transform: `rotateY(${rotateY}deg) translateZ(${radius}px)`,
                                    backgroundImage: `url('${card.image}')`
                                }}
                            >
                                <div className="card-content">
                                    <div className="card-top">
                                        <span className="card-year">{card.year}</span>
                                        <ArrowUpRight size={24} color={card.accent} />
                                    </div>
                                    <div className="card-bottom">
                                        <h3 className="card-title">{card.text}</h3>
                                        <div className="card-line" style={{ backgroundColor: card.accent }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
}
