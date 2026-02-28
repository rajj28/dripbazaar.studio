import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './Footer3D.css';

export default function Footer3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const headRef = useRef<THREE.Group | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Disable 3D model on mobile devices
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            console.log('3D model disabled on mobile for performance');
            setIsLoaded(true); // Set loaded to hide loader
            return;
        }

        // Scene setup with white background
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff); // White background
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // Studio lighting setup for glossy model
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        // Key light (main light from front-top)
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
        keyLight.position.set(3, 4, 3);
        scene.add(keyLight);

        // Fill light (softer light from side)
        const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
        fillLight.position.set(-3, 2, 2);
        scene.add(fillLight);

        // Back light (rim light for definition)
        const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
        backLight.position.set(0, 2, -3);
        scene.add(backLight);

        // Top light for glossy highlights
        const topLight = new THREE.SpotLight(0xffffff, 2.5);
        topLight.position.set(0, 6, 0);
        topLight.angle = Math.PI / 3;
        topLight.penumbra = 0.3;
        scene.add(topLight);

        // Create white environment for reflections
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xffffff);
        const envMap = pmremGenerator.fromScene(envScene).texture;
        scene.environment = envMap;

        // Mouse move handler with smooth tracking relative to footer
        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;
            
            // Get footer bounds
            const rect = containerRef.current.getBoundingClientRect();
            
            // Calculate mouse position relative to footer section
            const relativeX = event.clientX - rect.left;
            const relativeY = event.clientY - rect.top;
            
            // Normalize to -1 to 1 range based on footer dimensions
            mouseRef.current.x = (relativeX / rect.width) * 2 - 1;
            mouseRef.current.y = -((relativeY / rect.height) * 2 - 1); // Negative for correct up/down
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation loop with smooth eye tracking
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            if (headRef.current) {
                // Limited rotation range for subtle, natural movement
                const targetRotationY = mouseRef.current.x * 0.4; // Reduced from 0.8 to 0.4
                const targetRotationX = -mouseRef.current.y * 0.25; // Reduced from 0.5 to 0.25

                // Clamp rotation angles to prevent extreme movements
                const maxRotationY = Math.PI / 6; // 30 degrees max
                const maxRotationX = Math.PI / 8; // 22.5 degrees max
                
                const clampedTargetY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
                const clampedTargetX = Math.max(-maxRotationX, Math.min(maxRotationX, targetRotationX));

                // Smoother interpolation for natural, fluid movement
                headRef.current.rotation.y += (clampedTargetY - headRef.current.rotation.y) * 0.05;
                headRef.current.rotation.x += (clampedTargetX - headRef.current.rotation.x) * 0.05;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Load 3D model from New folder
        const loader = new GLTFLoader();
        loader.load(
            '/New folder/scene.gltf',
            (gltf) => {
                const model = gltf.scene;
                headRef.current = model;

                // Calculate model bounds for gradient mapping
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const minY = box.min.y;
                const maxY = box.max.y;

                // Apply gradient material that blends with background
                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        const geometry = mesh.geometry;
                        
                        // Create vertex colors for gradient effect
                        const colors: number[] = [];
                        const positions = geometry.attributes.position;
                        
                        for (let i = 0; i < positions.count; i++) {
                            const y = positions.getY(i);
                            // Normalize Y position (0 = bottom, 1 = top)
                            const normalizedY = (y - minY) / (maxY - minY);
                            
                            // Gradient from orange (bottom) to white (top)
                            const r = 1.0; // White/Orange both have full red
                            const g = 0.45 + (normalizedY * 0.55); // 0.45 (orange) to 1.0 (white)
                            const b = 0.09 + (normalizedY * 0.91); // 0.09 (orange) to 1.0 (white)
                            
                            colors.push(r, g, b);
                        }
                        
                        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                        
                        mesh.material = new THREE.MeshStandardMaterial({
                            vertexColors: true,
                            metalness: 0.4,
                            roughness: 0.4,
                            envMapIntensity: 1.2,
                        });
                    }
                });

                // Center and scale the model
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.5 / maxDim; // Increased from 2.5 to 3.5
                model.scale.setScalar(scale);

                // Position in upper half
                model.position.y = 0.3;

                scene.add(model);
                setIsLoaded(true);
                
                console.log('3D Model loaded with gradient material');
            },
            undefined,
            (error) => {
                console.error('Error loading 3D model:', error);
            }
        );

        // Handle resize
        const handleResize = () => {
            if (!canvasRef.current) return;
            camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
        };
    }, []);

    return (
        <footer className="footer-3d" ref={containerRef}>
            <div className="footer-3d-canvas-container">
                <canvas ref={canvasRef} className="footer-3d-canvas" />
                {!isLoaded && (
                    <div className="footer-3d-loader">
                        <div className="loader-spinner"></div>
                        <p>Loading...</p>
                    </div>
                )}
            </div>

            <div className="footer-content">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div className="footer-column">
                        <h3 className="footer-brand">DRIP BAZAAR</h3>
                        <p className="footer-tagline">Born from chaos.<br />Built for rebels.</p>
                        <div className="footer-socials">
                            <a href="https://www.instagram.com/dripbazaar.studio?igsh=MW45ZnFuZ3BveDV2NQ==" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="https://wa.me/917028549428" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Shop</h4>
                        <ul className="footer-links">
                            <li><a href="#">New Arrivals</a></li>
                            <li><a href="#">Collections</a></li>
                            <li><a href="#">Drip Riwaaz</a></li>
                            <li><a href="#">Sale</a></li>
                        </ul>
                    </div>

                    {/* About Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">About</h4>
                        <ul className="footer-links">
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Philosophy</a></li>
                            <li><a href="#">Sustainability</a></li>
                            <li><a href="#">Careers</a></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Support</h4>
                        <ul className="footer-links">
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Shipping</a></li>
                            <li><a href="#">Returns</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="footer-column footer-newsletter">
                        <h4 className="footer-column-title">Stay Updated</h4>
                        <p className="footer-newsletter-text">Join the rebellion. Get exclusive drops.</p>
                        <form className="footer-newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="footer-newsletter-input"
                            />
                            <button type="submit" className="footer-newsletter-button">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">© 2024 DRIP BAZAAR. All rights reserved.</p>
                    <p className="footer-founder">Founded by Rajvardhan Mane</p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
