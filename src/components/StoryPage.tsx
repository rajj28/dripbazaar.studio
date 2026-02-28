import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StoryPage.css';

gsap.registerPlugin(ScrollTrigger);

const reels = [
    { id: 1, video: '/videos/reel1.mp4', thumbnail: '/images/card1.jpg', title: 'Behind the Chaos' },
    { id: 2, video: '/videos/reel2.mp4', thumbnail: '/images/card2.jpg', title: 'Street Culture' },
    { id: 3, video: '/videos/reel3.mp4', thumbnail: '/images/card3.jpg', title: 'Raw Energy' },
    { id: 4, video: '/videos/reel4.mp4', thumbnail: '/images/card4.jpg', title: 'Urban Rebellion' },
    { id: 5, video: '/videos/reel5.mp4', thumbnail: '/images/card5.jpg', title: 'The Movement' },
];

export default function StoryPage() {
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!videoContainerRef.current || !videoRef.current || !titleRef.current) return;
        
        // Prevent double initialization in React StrictMode
        if (isInitialized.current) return;
        isInitialized.current = true;

        // Kill any existing ScrollTriggers to prevent conflicts
        ScrollTrigger.getAll().forEach(trigger => {
            if (trigger.vars.trigger === videoContainerRef.current) {
                trigger.kill();
            }
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();

        // Title fill animation on scroll
        const titleFillTrigger = gsap.to(titleRef.current, {
            '--fill-width': '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: videoContainerRef.current,
                start: 'top top',
                end: 'center center',
                scrub: 1,
                id: 'title-fill'
            }
        });

        // Title italic transformation on scroll
        const titleItalicTrigger = gsap.to(titleRef.current, {
            fontStyle: 'italic',
            ease: 'none',
            scrollTrigger: {
                trigger: videoContainerRef.current,
                start: 'top top',
                end: 'center center',
                scrub: 1,
                id: 'title-italic'
            }
        });

        // Simple video expansion on scroll - cinematic 16:9 aspect ratio
        const videoTrigger = gsap.fromTo(videoRef.current,
            {
                width: '25%',
                height: '25%',
                borderRadius: '20px',
            },
            {
                width: '55vw',
                height: '31vw', // 16:9 aspect ratio (55vw * 9/16)
                borderRadius: '8px',
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: videoContainerRef.current,
                    start: 'top top',
                    end: 'center center',
                    scrub: 0.5,
                    id: 'video-expand',
                    invalidateOnRefresh: true
                }
            }
        );

        return () => {
            isInitialized.current = false;
            titleFillTrigger.kill();
            titleItalicTrigger.kill();
            videoTrigger.kill();
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.id && ['title-fill', 'title-italic', 'video-expand'].includes(trigger.vars.id)) {
                    trigger.kill();
                }
            });
        };
    }, []);

    return (
        <div className="story-page">
            {/* Expanding Video Section */}
            <section className="story-video-section" ref={videoContainerRef}>
                <div className="story-video-wrapper">
                    <div className="story-video-content">
                        <h1 ref={titleRef} className="story-title">THE STORY</h1>
                        <p className="story-subtitle">Born from chaos. Built for rebels.</p>
                    </div>
                    
                    {/* Video container */}
                    <video
                        ref={videoRef}
                        className="story-video"
                        src="/7198205-hd_1920_1080_25fps.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </section>

            {/* Reels Section - Seamlessly connected */}
            <section className="story-reels-section">
                <div className="reels-header">
                    <h2 className="transition-text">MOMENTS</h2>
                    <p className="reels-subtitle">Raw. Unfiltered. Real.</p>
                </div>

                <div className="reels-grid">
                    {reels.map((reel, index) => (
                        <div 
                            key={reel.id} 
                            className="reel-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="reel-thumbnail">
                                <img src={reel.thumbnail} alt={reel.title} />
                                <div className="reel-play-overlay">
                                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                        <circle cx="30" cy="30" r="29" stroke="white" strokeWidth="2"/>
                                        <path d="M24 20L40 30L24 40V20Z" fill="white"/>
                                    </svg>
                                </div>
                            </div>
                            <h3 className="reel-title">{reel.title}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
