import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PaperUnfoldFrames.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 60;
const PAPER_COLOR = '#f5f5dc';
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.3)';
const FOLD_LINE_COLOR = 'rgba(0, 0, 0, 0.1)';

/**
 * Generate realistic paper fiber texture
 */
function generatePaperTexture(width: number, height: number): HTMLCanvasElement {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const textureCtx = textureCanvas.getContext('2d')!;

    // Base paper color
    textureCtx.fillStyle = PAPER_COLOR;
    textureCtx.fillRect(0, 0, width, height);

    // Add noise for paper fibers
    const imageData = textureCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
    }

    textureCtx.putImageData(imageData, 0, 0);

    // Add subtle grain lines for realism
    textureCtx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
    textureCtx.lineWidth = 0.5;
    for (let i = 0; i < 100; i++) {
        textureCtx.beginPath();
        textureCtx.moveTo(Math.random() * width, Math.random() * height);
        textureCtx.lineTo(Math.random() * width, Math.random() * height);
        textureCtx.stroke();
    }

    return textureCanvas;
}

/**
 * Draw a folded paper segment with realistic lighting and shadows
 */
function drawPaperSegment(
    ctx: CanvasRenderingContext2D,
    paperTexture: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
    foldAngle: number,
    foldDirection: 'diagonal-right' | 'diagonal-left',
    lightIntensity: number
) {
    ctx.save();

    const foldProgress = foldAngle / 180;

    // Create gradient for lighting based on fold angle
    const lightGradient = ctx.createLinearGradient(
        x, y,
        x + width * Math.cos(foldAngle * Math.PI / 180),
        y + height
    );

    // Dynamic lighting
    const baseLight = 0.7 + lightIntensity * 0.3;
    const shadowStrength = Math.sin(foldAngle * Math.PI / 180) * 0.4;

    lightGradient.addColorStop(0, `rgba(245, 245, 220, ${baseLight})`);
    lightGradient.addColorStop(0.5, `rgba(245, 245, 220, ${baseLight - shadowStrength * 0.3})`);
    lightGradient.addColorStop(1, `rgba(245, 245, 220, ${baseLight - shadowStrength})`);

    // Draw paper texture
    ctx.globalAlpha = 1;
    ctx.drawImage(paperTexture, x, y, width, height);

    // Apply lighting
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = lightGradient;
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = 'source-over';

    // Draw fold line
    if (foldAngle > 5) {
        ctx.strokeStyle = FOLD_LINE_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (foldDirection === 'diagonal-right') {
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y + height);
        } else {
            ctx.moveTo(x + width, y);
            ctx.lineTo(x, y + height);
        }
        ctx.stroke();
    }

    // Draw shadow on the fold
    if (foldAngle > 10) {
        const shadowGradient = ctx.createLinearGradient(
            x + width / 2, y,
            x + width / 2, y + height
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(0.5, `rgba(0, 0, 0, ${shadowStrength * 0.5})`);
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = shadowGradient;
        ctx.fillRect(x, y, width, height);
    }

    // Add edge highlights for paper thickness
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.restore();
}

/**
 * Render a specific frame of the paper unfolding animation
 */
function renderFrame(
    ctx: CanvasRenderingContext2D,
    paperTexture: HTMLCanvasElement,
    frameNumber: number,
    canvasWidth: number,
    canvasHeight: number
) {
    // Clear canvas
    ctx.fillStyle = '#2c2416';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const progress = frameNumber / TOTAL_FRAMES;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Paper dimensions
    const paperWidth = Math.min(canvasWidth * 0.6, 800);
    const paperHeight = Math.min(canvasHeight * 0.8, 1000);
    const segmentHeight = paperHeight / 6;

    // Draw 6 segments of paper, each folding at different times
    for (let i = 0; i < 6; i++) {
        const segmentProgress = Math.max(0, Math.min(1, (progress - i * 0.12) / 0.25));
        const foldAngle = segmentProgress * 180;
        const foldDirection: 'diagonal-right' | 'diagonal-left' = i % 2 === 0 ? 'diagonal-right' : 'diagonal-left';

        // Calculate position with perspective
        const yOffset = (i - 2.5) * segmentHeight;
        const xOffset = Math.sin(segmentProgress * Math.PI) * (i % 2 === 0 ? -30 : 30);
        const scale = 1 - segmentProgress * 0.1;

        const segmentX = centerX - (paperWidth * scale) / 2 + xOffset;
        const segmentY = centerY + yOffset * scale;
        const segmentW = paperWidth * scale;
        const segmentH = segmentHeight * scale;

        // Light intensity varies with fold
        const lightIntensity = 0.8 + Math.cos(segmentProgress * Math.PI) * 0.2;

        // Apply 3D transformation
        ctx.save();
        ctx.translate(segmentX + segmentW / 2, segmentY + segmentH / 2);

        // Rotate based on fold direction
        if (foldDirection === 'diagonal-right') {
            ctx.rotate((-foldAngle / 180) * Math.PI * 0.3);
        } else {
            ctx.rotate((foldAngle / 180) * Math.PI * 0.3);
        }

        // Add perspective skew
        const skewAmount = Math.sin(segmentProgress * Math.PI) * 0.2;
        ctx.transform(1, skewAmount * (i % 2 === 0 ? 1 : -1), 0, 1, 0, 0);

        ctx.translate(-segmentW / 2, -segmentH / 2);

        // Draw the segment
        drawPaperSegment(ctx, paperTexture, 0, 0, segmentW, segmentH, foldAngle, foldDirection, lightIntensity);

        ctx.restore();

        // Draw cast shadow below each segment
        if (foldAngle > 20) {
            const shadowOpacity = Math.min(0.4, (foldAngle / 180) * 0.4);
            const shadowBlur = 20 + (foldAngle / 180) * 30;

            ctx.save();
            ctx.shadowColor = SHADOW_COLOR;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 15;
            ctx.globalAlpha = shadowOpacity;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(segmentX, segmentY + segmentH, segmentW, 5);
            ctx.restore();
        }
    }
}

export default function PaperUnfoldFrames() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const paperTextureRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Regenerate paper texture on resize
            paperTextureRef.current = generatePaperTexture(canvas.width, canvas.height);
            
            // Re-render current frame
            if (paperTextureRef.current) {
                renderFrame(ctx, paperTextureRef.current, currentFrame, canvas.width, canvas.height);
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initial render
        if (paperTextureRef.current) {
            renderFrame(ctx, paperTextureRef.current, 0, canvas.width, canvas.height);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current || !paperTextureRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // GSAP ScrollTrigger
        const scrollTrigger = gsap.to({ frame: 0 }, {
            frame: TOTAL_FRAMES,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5,
                onUpdate: (self) => {
                    const frame = Math.floor(self.progress * TOTAL_FRAMES);
                    if (frame !== currentFrame && paperTextureRef.current) {
                        setCurrentFrame(frame);
                        renderFrame(ctx, paperTextureRef.current, frame, canvas.width, canvas.height);
                    }
                }
            }
        });

        return () => {
            scrollTrigger.scrollTrigger?.kill();
        };
    }, [currentFrame]);

    return (
        <div ref={containerRef} className="paper-unfold-frames-container">
            <div className="paper-unfold-frames-sticky">
                <canvas ref={canvasRef} />
                <div className="paper-content-overlay">
                    <h2 className="paper-frame-title">RIWAAZ</h2>
                    <p className="paper-frame-subtitle">Unfold the Tradition</p>
                </div>
            </div>
        </div>
    );
}
