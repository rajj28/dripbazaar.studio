import { motion } from 'framer-motion';
import './SmokeParticles.css';

// Only smoke particles (no ember/fire)
export default function SmokeParticles() {
  const smokeParticles = Array.from({ length: 32 });
  return (
    <div className="smoke-particles">
      {smokeParticles.map((_, i) => {
        const left = 10 + Math.random() * 80; // 10% to 90% across width
        return (
          <motion.span
            key={"smoke-" + i}
            className="smoke-particle"
            style={{ left: `${left}%` }}
            initial={{ opacity: 0, y: 40, scale: 0.7 }}
            animate={{
              opacity: [0, 0.5, 0.2, 0],
              y: [40, -60 - Math.random() * 40, -120 - Math.random() * 60],
              scale: [0.7, 1.1 + Math.random() * 0.3, 0.9],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
