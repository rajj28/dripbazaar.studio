import HeroHeadline from './components/HeroHeadline';
import Carousel3D from './components/Carousel3D';
import ScrollIndicator from './components/ScrollIndicator';
import NavOverlay from './components/NavOverlay';
import CollectionShowcase from './components/CollectionShowcase';
import PaperCrumpleScroll from './components/PaperCrumpleScroll';
import FeaturedProducts from './components/FeaturedProducts';
import StoryPage from './components/StoryPage';
import Footer3D from './components/Footer3D';
import './App.css';

function App() {
  return (
    <>
      <NavOverlay />

      {/* Hero section — extended for scroll effect */}
      <section className="hero-section">
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          <HeroHeadline />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '15%', paddingTop: '8vh' }}>
            <div>
              <Carousel3D />
            </div>
            <div className="hero-welcome-text" style={{ marginLeft: '0', alignSelf: 'flex-start' }}>
              <p className="hero-welcome-subtitle">India's First Verified Thrift Marketplace</p>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </section>

      {/* Collection section — separate scroll page */}
      <CollectionShowcase />

      {/* Featured Products - Everyday Essentials */}
      <FeaturedProducts />

      {/* Paper Crumple Scroll Effect - Drip Riwaaz Premium */}
      <PaperCrumpleScroll />

      {/* The Story Page - Video + Reels */}
      <StoryPage />

      {/* Footer with 3D Interactive Head */}
      <Footer3D />
    </>
  );
}

export default App;
