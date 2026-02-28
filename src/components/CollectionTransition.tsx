import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CollectionTransition.css';

gsap.registerPlugin(ScrollTrigger);

export default function CollectionTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !gridRef.current) return;

        const cells = gridRef.current.querySelectorAll('.grid-cell');

        // Create staggered animation for grid cells
        gsap.fromTo(
            cells,
            {
                scale: 0,
                rotation: 45,
                opacity: 0,
            },
            {
                scale: 1,
                rotation: 0,
                opacity: 1,
                stagger: {
                    amount: 1.5,
                    from: 'center',
                    grid: 'auto',
                },
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    end: 'center center',
                    scrub: 1,
                }
            }
        );

        // Morph grid into organized pattern
        gsap.to(cells, {
            borderRadius: '0%',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'center center',
                end: 'bottom 30%',
                scrub: 1,
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="collection-transition" ref={containerRef}>
            <div className="transition-grid" ref={gridRef}>
                {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} className="grid-cell"></div>
                ))}
            </div>
            <div className="transition-overlay"></div>
        </div>
    );
}
