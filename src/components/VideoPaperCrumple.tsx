import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VideoPaperCrumple.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Video Paper Crumple Component
 * Extracts frames from video and plays them on scroll for realistic paper crumpling effect
 */
export default function VideoPaperCrumple() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [totalFrames, setTotalFrames] = useState(0);
    const framesRef = useRef<ImageData[]>([]);
    const currentFrameRef = useRef(0);

    // Extract frames from video
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const extractFrames = async () => {
            // Wait for video metadata to load
            await new Promise<void>((resolve) => {
                if (video.readyState >= 2) {
                    resolve();
                } else {
                    video.addEventListener('loadedmetadata', () => resolve(), { once: true });
                }
            });

            const duration = video.duration;
            const fps = 30; // Extract 30 frames per second
            const frameCount = Math.floor(duration * fps);
            const frameInterval = 1 / fps;

            console.log(`Extracting ${frameCount} frames from video (${duration.toFixed(2)}s)`);

            // Set canvas size to video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const frames: ImageData[] = [];

            // Extract frames
            for (let i = 0; i < frameCount; i++) {
                const time = i * frameInterval;
                
                // Seek to specific time
                video.currentTime = time;
                
                // Wait for seek to complete
                await new Promise<void>((resolve) => {
                    const onSeeked = () => {
                        video.removeEventListener('seeked', onSeeked);
                        resolve();
                    };
                    video.addEventListener('seeked', onSeeked);
                });

                // Draw frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Store frame data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                frames.push(imageData);

                // Update progress
                if (i % 10 === 0) {
                    console.log(`Extracted ${i + 1}/${frameCount} frames`);
                }
            }

            framesRef.current = frames;
            setTotalFrames(frameCount);
            setIsLoaded(true);

            console.log('Frame extraction complete!');

            // Pause and reset video
            video.pause();
            video.currentTime = 0;

            // Render first frame
            if (frames.length > 0) {
                ctx.putImageData(frames[0], 0, 0);
            }
        };

        extractFrames();
    }, []);

    // Setup scroll trigger
    useEffect(() => {
        if (!isLoaded || !containerRef.current || !canvasRef.current || totalFrames === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to fit viewport
        const resizeCanvas = () => {
            const container = containerRef.current;
            if (!container) return;

            // const rect = container.getBoundingClientRect();
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // GSAP ScrollTrigger for frame-by-frame playback
        const scrollTrigger = gsap.to({ frame: 0 }, {
            frame: totalFrames - 1,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: (self) => {
                    const frameIndex = Math.floor(self.progress * (totalFrames - 1));
                    
                    if (frameIndex !== currentFrameRef.current && framesRef.current[frameIndex]) {
                        currentFrameRef.current = frameIndex;
                        ctx.putImageData(framesRef.current[frameIndex], 0, 0);
                    }
                }
            }
        });

        return () => {
            scrollTrigger.scrollTrigger?.kill();
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isLoaded, totalFrames]);

    return (
        <div ref={containerRef} className="video-paper-crumple-container">
            <div className="video-paper-crumple-sticky">
                {/* Hidden video element for frame extraction */}
                <video
                    ref={videoRef}
                    src="/Firefly A static camera in a 16-9 aspect ratio captures a macro close-up of a thick warm beige parch.mp4"
                    preload="auto"
                    muted
                    playsInline
                    autoPlay={false}
                    style={{ display: 'none' }}
                />

                {/* Canvas for displaying frames */}
                <canvas ref={canvasRef} className="paper-canvas" />

                {/* Loading indicator */}
                {!isLoaded && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Extracting frames from video...</p>
                        <p className="loading-subtext">This may take a moment</p>
                    </div>
                )}

                {/* Content overlay */}
                {isLoaded && (
                    <div className="content-overlay">
                        <h2 className="crumple-title">RIWAAZ</h2>
                        <p className="crumple-subtitle">Scroll to Unfold</p>
                    </div>
                )}

                {/* Debug info */}
                {isLoaded && (
                    <div className="debug-info">
                        Frame: {currentFrameRef.current + 1} / {totalFrames}
                    </div>
                )}
            </div>
        </div>
    );
}
