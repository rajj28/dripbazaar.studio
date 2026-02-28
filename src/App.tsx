import { lazy, Suspense } from 'react';
import HeroHeadline from './components/HeroHeadline';
import Carousel3D from './components/Carousel3D';
import ScrollIndicator from './components/ScrollIndicator';
import NavOverlay from './components/NavOverlay';
import CollectionShowcase from './components/CollectionShowcase';
import './App.css';

// Lazy load below-fold components
const PaperCrumpleScroll = lazy(() => import('./components/PaperCrumpleScroll'));
const FeaturedProducts = lazy(() => import('./components/FeaturedProducts'));
const StoryPage = lazy(() => import('./components/StoryPage'));
const Footer3D = lazy(() => import('./components/Footer3D'));

// Simple loading fallback
function SectionLoader() {
  return (
    <div style={{
      minHeight: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent'
    }}>
      <div style={{
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.9rem',
        letterSpacing: '0.2em',
        fontFamily: 'var(--font-primary)'
      }}>
        Loading...
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <NavOverlay />

      {/* Hero section — extended for scroll effect */}
      <section className="hero-section">
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          zIndex: 1,
          paddingTop: '80px'
        }}>
          <HeroHeadline />
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', /* Changed from center to flex-start */
            justifyContent: 'center', 
            padding: '2vh 5% 0',
            paddingLeft: '15%', /* Increased from 10% to 15% to shift right */
            marginTop: '20px'
          }}>
            <div>
              <Carousel3D />
            </div>
            <div className="hero-welcome-text" style={{ marginTop: '2rem', textAlign: 'left', width: '100%', paddingLeft: '0' }}>
              <p className="hero-welcome-subtitle">India's First Verified Thrift Marketplace</p>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </section>

      {/* Collection section — separate scroll page */}
      <CollectionShowcase />

      {/* Lazy loaded sections below */}
      <Suspense fallback={<SectionLoader />}>
        {/* Featured Products - Everyday Essentials */}
        <FeaturedProducts />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        {/* Paper Crumple Scroll Effect - Drip Riwaaz Premium */}
        <PaperCrumpleScroll />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        {/* The Story Page - Video + Reels */}
        <StoryPage />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        {/* Footer with 3D Interactive Head */}
        <Footer3D />
      </Suspense>
    </>
  );
}

export default App;
