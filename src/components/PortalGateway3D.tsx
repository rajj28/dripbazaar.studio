import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';
import * as THREE from 'three';
import './PortalGateway3D.css';

function ArchModel({ scrollProgress: _scrollProgress }: { scrollProgress: MotionValue<number> }) {
    const { scene } = useGLTF('/models/ancient_arch/scene.gltf');
    const meshRef = useRef<THREE.Group>(null);

    return (
        <primitive 
            ref={meshRef}
            object={scene} 
            scale={1.8}
            position={[0, -8, 0]}
            rotation={[0, 0, 0]}
        />
    );
}

function ArchInnerImage() {
    const texture = useTexture('/download (12).jpg');
    
    // Set texture to cover and center crop
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
    
    return (
        <mesh position={[0, -2.5, -0.5]} rotation={[0, 0, 0]}>
            <planeGeometry args={[6, 10]} />
            <meshBasicMaterial 
                map={texture} 
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

function AnimatedCamera({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useFrame(() => {
        if (cameraRef.current) {
            const progress = scrollProgress.get();
            // Camera moves from far away (z=28) to through the gate (z=-10)
            const z = 28 - (progress * 38); // 28 to -10
            cameraRef.current.position.z = z;
        }
    });

    return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1, 28]} fov={75} />;
}

const cards = [
    { id: 1, title: "Heritage Collection", subtitle: "Timeless Elegance", image: "/images/card1.jpg" },
    { id: 2, title: "Royal Ensemble", subtitle: "Regal Traditions", image: "/images/card2.jpg" },
    { id: 3, title: "Artisan Series", subtitle: "Handcrafted Beauty", image: "/images/card3.jpg" },
    { id: 4, title: "Modern Classic", subtitle: "Contemporary Grace", image: "/images/card4.jpg" },
    { id: 5, title: "Signature Line", subtitle: "Exclusive Designs", image: "/images/card5.jpg" },
    { id: 6, title: "Premium Select", subtitle: "Curated Excellence", image: "/images/card6.jpg" },
];

export default function PortalGateway3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // 3D Portal animation phases
    const portalOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.75], [0, 1, 1, 0]);
    
    // Background transition
    const bgOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
    
    // Cards entrance
    const cardsOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
    const cardsY = useTransform(scrollYProgress, [0.7, 0.9], [100, 0]);

    return (
        <div ref={containerRef} className="portal-3d-container">
            <div className="portal-3d-sticky">
                {/* 3D Ancient Arch Portal */}
                <motion.div 
                    className="portal-3d-canvas"
                    style={{ opacity: portalOpacity }}
                >
                    <Canvas>
                        <AnimatedCamera scrollProgress={scrollYProgress} />
                        
                        {/* Lighting */}
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[0, 5, 5]} intensity={1.5} color="#FFD700" />
                        <directionalLight position={[5, 3, 3]} intensity={0.8} color="#FFA500" />
                        <directionalLight position={[-5, 3, 3]} intensity={0.8} color="#FFA500" />
                        <pointLight position={[0, 0, 5]} intensity={3} color="#FFD700" />
                        <spotLight position={[0, 5, 8]} angle={0.5} intensity={2} color="#FFD700" />
                        
                        {/* 3D Arch Model */}
                        <ArchModel scrollProgress={scrollYProgress} />
                        
                        {/* Image filling the inner space of the arch */}
                        <ArchInnerImage />
                        
                        {/* Environment for reflections */}
                        <Environment preset="sunset" />
                    </Canvas>

                    {/* Portal glow overlay */}
                    <div className="portal-3d-glow" />
                </motion.div>

                {/* Center text */}
                <motion.div 
                    className="portal-3d-text"
                    style={{
                        opacity: useTransform(scrollYProgress, [0.15, 0.3, 0.55], [0, 1, 0]),
                        z: useTransform(scrollYProgress, [0, 0.5], [0, 100])
                    }}
                >
                    <h2 className="portal-3d-title">RIWAAZ</h2>
                    <p className="portal-3d-subtitle">Enter the Collection</p>
                </motion.div>

                {/* Premium Collection Background */}
                <motion.div 
                    className="premium-background"
                    style={{ opacity: bgOpacity }}
                >
                    <div className="premium-pattern" />
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
                                    [0.75 + index * 0.03, 0.85 + index * 0.03],
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
                    className="portal-3d-hint"
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0])
                    }}
                >
                    Scroll to enter
                </motion.div>
            </div>
        </div>
    );
}

// Preload the model
useGLTF.preload('/models/ancient_arch/scene.gltf');
