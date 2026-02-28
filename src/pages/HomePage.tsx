import HeroHeadline from '../components/HeroHeadline';
import Carousel3D from '../components/Carousel3D';
import ScrollIndicator from '../components/ScrollIndicator';
import CollectionShowcase from '../components/CollectionShowcase';
import PaperCrumpleScroll from '../components/PaperCrumpleScroll';
import FeaturedProducts from '../components/FeaturedProducts';
import StoryPage from '../components/StoryPage';
import Footer3D from '../components/Footer3D';

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <HeroHeadline />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Carousel3D />
          </div>
          <ScrollIndicator />
        </div>
      </section>

      <CollectionShowcase />
      <FeaturedProducts />
      <PaperCrumpleScroll />
      <StoryPage />
      <Footer3D />
    </>
  );
}
