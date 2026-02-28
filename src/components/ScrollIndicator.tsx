import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './ScrollIndicator.css';

export default function ScrollIndicator() {
    return (
        <motion.div
            className="scroll-indicator-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
        >
            <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                }}
                className="scroll-indicator-icon"
            >
                <ChevronDown color="white" size={36} strokeWidth={2} />
            </motion.div>
        </motion.div>
    );
}
