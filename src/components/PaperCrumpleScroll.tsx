import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PaperCrumpleScroll.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

/**
 * Paper Crumple Scroll Component
 * Uses pre-extracted frames for smooth scroll-based animation
 */
export default function PaperCrumpleScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);

    // Preload all frame images
    useEffect(() => {
        let loadedCount = 0;

        const loadImage = (index: number): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const frameNumber = String(index + 1).padStart(4, '0');
                img.src = `/frames/frame_${frameNumber}.jpg`;
                
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    resolve(img);
                };
                
                img.onerror = () => {
                    console.error(`Failed to load frame ${frameNumber}`);
                    reject();
                };
            });
        };

        // Load all images
        Promise.all(
            Array.from({ length: TOTAL_FRAMES }, (_, i) => loadImage(i))
        ).then((loadedImages) => {
            imagesRef.current = loadedImages;
            setImagesLoaded(true);
            console.log(`✅ All ${TOTAL_FRAMES} frames loaded!`);
        }).catch((error) => {
            console.error('Error loading frames:', error);
        });
    }, []);

    // Setup canvas and render first frame
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current || imagesRef.current.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size based on first image
        const firstImage = imagesRef.current[0];
        canvas.width = firstImage.width;
        canvas.height = firstImage.height;

        // Render LAST frame first (frame 240)
        const lastFrame = imagesRef.current[TOTAL_FRAMES - 1];
        ctx.drawImage(lastFrame, 0, 0);
        currentFrameRef.current = TOTAL_FRAMES - 1;

        // Resize handler
        const handleResize = () => {
            if (imagesRef.current[currentFrameRef.current]) {
                ctx.drawImage(imagesRef.current[currentFrameRef.current], 0, 0);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded]);

    // Setup scroll trigger
    useEffect(() => {
        if (!imagesLoaded || !containerRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // GSAP ScrollTrigger for frame-by-frame playback (reversed) with pause at end
        const scrollTrigger = gsap.to({ frame: TOTAL_FRAMES - 1 }, {
            frame: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: (self) => {
                    // Animation completes at 70% of scroll, then holds for remaining 30%
                    const animationProgress = Math.min(self.progress / 0.7, 1);
                    
                    // Reverse: start from last frame (239) to first frame (0)
                    const frameIndex = Math.floor((TOTAL_FRAMES - 1) - (animationProgress * (TOTAL_FRAMES - 1)));
                    
                    if (frameIndex !== currentFrameRef.current && imagesRef.current[frameIndex]) {
                        currentFrameRef.current = frameIndex;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(imagesRef.current[frameIndex], 0, 0);
                    }
                }
            }
        });

        return () => {
            scrollTrigger.scrollTrigger?.kill();
        };
    }, [imagesLoaded]);

    return (
        <div ref={containerRef} className="paper-crumple-scroll-container">
            <div className="paper-crumple-scroll-sticky">
                <canvas ref={canvasRef} className="paper-crumple-canvas" />

                {/* Loading overlay */}
                {!imagesLoaded && (
                    <div className="crumple-loading-overlay">
                        <div className="crumple-loading-spinner"></div>
                        <p className="crumple-loading-text">Loading Paper Animation</p>
                        <div className="crumple-progress-bar">
                            <div 
                                className="crumple-progress-fill" 
                                style={{ width: `${loadProgress}%` }}
                            >
                                {loadProgress}%
                            </div>
                        </div>
                        <p className="crumple-loading-subtext">
                            {loadProgress < 100 ? `Loading frames... ${loadProgress}%` : 'Ready!'}
                        </p>
                    </div>
                )}

                {/* Content overlay - centered minimal design */}
                {imagesLoaded && (
                    <div className="crumple-content-overlay">
                        <div className="premium-content-wrapper">
                            {/* Top Label */}
                            <div className="premium-label">Our Premium Collection</div>
                            
                            {/* Main Title */}
                            <h2 className="premium-title">
                                <span className="typing-letter">D</span>
                                <span className="typing-letter">R</span>
                                <span className="typing-letter">I</span>
                                <span className="typing-letter">P</span>
                                <span className="typing-space"> </span>
                                <span className="typing-letter golden">R</span>
                                <span className="typing-letter golden">I</span>
                                <span className="typing-letter golden">W</span>
                                <span className="typing-letter golden">A</span>
                                <span className="typing-letter golden">A</span>
                                <span className="typing-letter golden">Z</span>
                            </h2>
                            
                            {/* Description */}
                            <p className="premium-description">
                                Where heritage meets streetwear. A fusion of timeless Indian craftsmanship 
                                and contemporary urban style.
                            </p>
                            
                            {/* Product Grid - Horizontal */}
                            <div className="premium-product-grid">
                                <div className="premium-card">
                                    <div className="premium-card-image" style={{ backgroundImage: "url('/images/card1.jpg')" }}></div>
                                    <div className="premium-card-info">
                                        <span className="premium-card-name">Heritage Bomber</span>
                                        <span className="premium-card-price">₹12,999</span>
                                    </div>
                                </div>

                                <div className="premium-card">
                                    <div className="premium-card-image" style={{ backgroundImage: "url('/images/card2.jpg')" }}></div>
                                    <div className="premium-card-info">
                                        <span className="premium-card-name">Royal Kurta Set</span>
                                        <span className="premium-card-price">₹8,499</span>
                                    </div>
                                </div>

                                <div className="premium-card">
                                    <div className="premium-card-image" style={{ backgroundImage: "url('/images/card3.jpg')" }}></div>
                                    <div className="premium-card-info">
                                        <span className="premium-card-name">Artisan Jacket</span>
                                        <span className="premium-card-price">₹15,999</span>
                                    </div>
                                </div>

                                <div className="premium-card">
                                    <div className="premium-card-image" style={{ backgroundImage: "url('/images/card4.jpg')" }}></div>
                                    <div className="premium-card-info">
                                        <span className="premium-card-name">Urban Sherwani</span>
                                        <span className="premium-card-price">₹18,999</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CTA Button */}
                            <button className="premium-cta">
                                <span>Explore Collection</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
