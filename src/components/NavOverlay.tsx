import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import './NavOverlay.css';

const navLinks = [
    { text: "Collection", href: "#collection" },
    { text: "Cart", href: "#cart" },
    { text: "About", href: "#about" },
    { text: "Contact", href: "#contact" }
];

export default function NavOverlay() {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when the menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        // Wrap trigger + panel in one zone so hovering the panel keeps it open
        <div
            className="nav-hover-zone"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="nav-trigger-btn"
                aria-label="Open Menu"
            >
                <Plus size={48} strokeWidth={3} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="nav-overlay"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
                    >
                        <div className="nav-overlay-header">
                            <button
                                className="nav-close-btn"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close Menu"
                            >
                                <X size={48} strokeWidth={3} />
                            </button>
                        </div>

                        <nav className="nav-links-container">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.text}
                                    href={link.href}
                                    className="nav-link"
                                    onClick={() => setIsOpen(false)}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{
                                        delay: isOpen ? 0.3 + (i * 0.1) : 0,
                                        duration: 0.5,
                                        type: 'spring',
                                        stiffness: 100
                                    }}
                                >
                                    <span className="nav-link-number">0{i + 1}</span>
                                    <span className="nav-link-text">{link.text}</span>
                                </motion.a>
                            ))}
                        </nav>

                        <div className="nav-footer">
                            <span className="nav-footer-text">DRIPBAZAAR &copy; 2026</span>
                            <div className="nav-socials">
                                <a href="#ig">IG</a>
                                <a href="#tw">TW</a>
                                <a href="#tk">TK</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
