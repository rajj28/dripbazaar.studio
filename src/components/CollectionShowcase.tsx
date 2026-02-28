import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './CollectionShowcase.css';
import SmokeParticles from './SmokeParticles';

const chapters = [
    {
        id: 0,
        drop: 'DROP 01',
        title: 'LIFE',
        subtitle: 'Life Is Chaos.',
        philosophy: 'Born into the noise.\nDressed for the storm.',
        price: '₹1234',
        originalPrice: '₹4999',
        stock: 50,
        image: '/drip bazaar all assests/drop1.png',
        accent: '#F97316',
        // Warm, gritty orange energy — like dawn before the riot
        bg: 'radial-gradient(ellipse at 40% 60%, #2a0f00 0%, #0a0400 70%, #000 100%)',
        ghostColor: 'rgba(249, 115, 22, 0.05)',
        overlay: 'rgba(249, 115, 22, 0.03)',
        noiseClass: 'noise-life',
        cardBorder: '1px solid rgba(249,115,22,0.3)',
        tilt: '-3deg',
        locked: false,
    },
    {
        id: 1,
        drop: 'DROP 02',
        title: 'CONQUER',
        subtitle: "Take What's Yours.",
        philosophy: 'Power is not given.\nIt is worn.',
        price: '₹1234',
        originalPrice: '₹4999',
        stock: 50,
        image: '/drip bazaar all assests/drop2.png',
        accent: '#cc1111',
        // Blood red, hard shadows — dominant and unforgiving
        bg: 'radial-gradient(ellipse at 60% 40%, #200000 0%, #0a0000 70%, #000 100%)',
        ghostColor: 'rgba(180, 0, 0, 0.06)',
        overlay: 'rgba(140, 0, 0, 0.04)',
        noiseClass: 'noise-conquer',
        cardBorder: '1px solid rgba(204,17,17,0.4)',
        tilt: '2deg',
        locked: false,
    },
    {
        id: 2,
        drop: 'DROP 03',
        title: 'DEATH',
        subtitle: 'Nothing Lasts.',
        philosophy: 'In every end,\nthere is truth.',
        price: '₹1234',
        originalPrice: '₹4999',
        stock: 50,
        image: '/drip bazaar all assests/drop3.png',
        accent: 'rgba(255,255,255,0.85)',
        // Cold silence. Pure black. Let it breathe.
        bg: 'radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%)',
        ghostColor: 'rgba(255, 255, 255, 0.025)',
        overlay: 'rgba(0,0,0,0.2)',
        noiseClass: 'noise-death',
        cardBorder: '1px solid rgba(255,255,255,0.1)',
        tilt: '-1deg',
        locked: false,
    },
    {
        id: 3,
        drop: 'DROP 04 - ??',
        title: '??',
        subtitle: 'They Thought It Was Over.',
        philosophy: 'The fourth piece.\nThe supremacy.',
        price: 'UNLOCK',
        originalPrice: null,
        stock: null,
        image: '/images/card7.jpg',
        accent: '#F97316',
        // Rebirth — embers glow from the void
        bg: 'radial-gradient(ellipse at 50% 80%, #1a0800 0%, #080300 60%, #000 100%)',
        ghostColor: 'rgba(249, 115, 22, 0.04)',
        overlay: 'rgba(249, 115, 22, 0.02)',
        noiseClass: 'noise-rise',
        cardBorder: '1px solid rgba(249,115,22,0.2)',
        tilt: '3deg',
        locked: true,
    },
];


export default function CollectionShowcase() {
    const [activeChapter, setActiveChapter] = useState(0);
    const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handlePreBook = (chapter: typeof chapters[0]) => {
        if (!chapter.locked) {
            navigate(`/prebook?drop=${chapter.id + 1}&name=${encodeURIComponent(chapter.drop)}`);
        }
    };

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        chapters.forEach((_, i) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveChapter(i);
                    }
                },
                { threshold: 0.5 }
            );

            if (sentinelRefs.current[i]) {
                observer.observe(sentinelRefs.current[i]!);
            }
            observers.push(observer);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, []);

    const chapter = chapters[activeChapter];

    return (
        <div className="collection-wrapper" ref={wrapperRef}>
            {/* Sticky Stage */}
            <div 
                className="collection-stage"
            >
                {/* Background gradient morphs per chapter */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`bg-${activeChapter}`}
                        className="stage-bg"
                        style={{ background: chapter.bg }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </AnimatePresence>

                {/* Giant blurred chapter word behind everything — tinted per chapter */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={`ghost-${activeChapter}`}
                        className="stage-ghost-text"
                        style={{ color: chapter.ghostColor }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                    >
                        {chapter.title}
                    </motion.span>
                </AnimatePresence>

                {/* Per-chapter color overlay tint on top of bg */}
                <div className="stage-overlay" style={{ background: chapter.overlay }} />

                {/* Drop number top-left */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`drop-${activeChapter}`}
                        className="stage-drop-badge"
                        style={{ color: chapter.accent }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {chapter.drop}
                    </motion.div>
                </AnimatePresence>

                {/* Chapter counter top-right */}
                <div className="stage-counter">
                    <span style={{ color: chapter.accent }}>0{activeChapter + 1}</span>
                    <span className="stage-counter-sep">/</span>
                    <span>04</span>
                </div>

                {/* Product card — center stage, tilted */}
                <div className="stage-center" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Particle animation video background for Rise from ashes */}
                    {chapter.id === 3 && (
                        <video
                            className="stage-particle-bg"
                            src="/7198205-hd_1920_1080_25fps.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 1,
                                pointerEvents: 'none',
                                opacity: 0.55,
                                borderRadius: 'inherit',
                                filter: 'blur(2px) brightness(1.1)'
                            }}
                        />
                    )}
                    {/* Smoke particles for Rise from ashes (side area, not on card) */}
                    {chapter.id === 3 && (
                        <SmokeParticles />
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`card-${activeChapter}`}
                            className="stage-card"
                            style={{
                                rotate: chapter.tilt,
                                filter: chapter.locked ? 'blur(30px) brightness(0.6)' : 'none',
                                border: chapter.cardBorder,
                            }}
                            initial={{ opacity: 0, y: 60, rotate: chapter.tilt }}
                            animate={{ opacity: 1, y: 0, rotate: chapter.tilt }}
                            exit={{ opacity: 0, y: -60 }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                        >
                            <img
                                src={chapter.image}
                                alt={chapter.title}
                                className="stage-card-img"
                            />
                            {/* Per-chapter accent glow beneath/around card */}
                            <div
                                className="stage-card-glow"
                                style={{ boxShadow: `0 0 100px 30px ${chapter.accent}44, inset 0 0 30px rgba(0,0,0,0.4)` }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Locked overlay for Rise From Ashes with marketing line - no reveal button */}
                    {chapter.locked && (
                        <motion.div
                            className="stage-locked-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="stage-locked-content"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, type: 'spring', stiffness: 50 }}
                            >
                                <motion.p
                                    className="stage-marketing-line"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                >
                                    The Ultimate Drop.
                                    <br />
                                    <span className="stage-marketing-sub">Where legends are born.</span>
                                </motion.p>
                                <motion.span
                                    className="stage-locked-text"
                                    initial={{ opacity: 0, y: 32, scale: 0.92 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 1.1, delay: 0.5, type: 'spring', stiffness: 60, damping: 12 }}
                                >
                                    DROP 04
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Bottom info bar */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`info-${activeChapter}`}
                        className="stage-info"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="stage-info-left">
                            <h2 className="stage-subtitle">{chapter.subtitle}</h2>
                            <p className="stage-philosophy">
                                {chapter.philosophy.split('\n').map((line, i) => (
                                    <span key={i}>{line}<br /></span>
                                ))}
                            </p>
                        </div>
                        <div className="stage-info-right">
                            <div className="stage-price-container">
                                {chapter.originalPrice && (
                                    <span className="stage-price-original">
                                        {chapter.originalPrice}
                                    </span>
                                )}
                                <span className="stage-price" style={{ color: chapter.accent }}>
                                    {chapter.price}
                                </span>
                            </div>
                            {chapter.stock && (
                                <span className="stage-stock">
                                    Only {chapter.stock} pieces available
                                </span>
                            )}
                            <button
                                className="stage-cta"
                                style={{ borderColor: chapter.accent }}
                                disabled={chapter.locked}
                                onClick={() => handlePreBook(chapter)}
                            >
                                {chapter.locked ? 'COMING SOON' : 'PRE-BOOK NOW'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Scroll progress dots */}
                <div className="stage-progress">
                    {chapters.map((_, i) => (
                        <div
                            key={i}
                            className={`stage-dot ${i === activeChapter ? 'active' : ''}`}
                            style={{ background: i === activeChapter ? chapter.accent : 'rgba(255,255,255,0.2)' }}
                        />
                    ))}
                </div>
            </div>

            {/* Invisible sentinel sections — drive Intersection Observer */}
            {chapters.map((_, i) => (
                <div
                    key={i}
                    ref={el => { sentinelRefs.current[i] = el; }}
                    className="chapter-sentinel"
                />
            ))}
            {/* Buffer sentinel to allow last product to remain sticky and transition */}
            <div className="chapter-sentinel" style={{ height: '200vh' }} />
        </div>
    );
}
