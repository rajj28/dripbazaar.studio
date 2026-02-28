import { motion } from 'framer-motion';
import './HeroHeadline.css';

export default function HeroHeadline() {
  return (
    <div className="headline-container">
      <motion.div
        className="headline-content"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        style={{ transformOrigin: "top center" }}
        transition={{
          type: 'spring',
          stiffness: 80,
          damping: 12,
          mass: 1,
        }}
      >
        <div className="headline-wrapper">
          <img 
            src="/drip bazaar all assests/new logo.png" 
            alt="Drip Bazaar Logo" 
            className="headline-logo"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <h1 className="headline-text">
            DRIP BAZAAR
          </h1>
        </div>
        <p className="headline-tagline">Build from Chaos</p>
      </motion.div>
    </div>
  );
}
