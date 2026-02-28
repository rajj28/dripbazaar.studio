import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, User, LogOut, Settings, ShoppingBag, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavOverlay.css';

const navLinks = [
    { text: "Collection", href: "#collection" },
    { text: "Cart", href: "#cart" },
    { text: "About", href: "#about" },
    { text: "Contact", href: "#contact" }
];

export default function NavOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Prevent scrolling when the menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        setIsProfileDropdownOpen(false);
        setIsOpen(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        if (user) {
            setIsProfileDropdownOpen(!isProfileDropdownOpen);
        } else {
            navigate('/auth');
        }
    };

    return (
        <>
            {/* Profile Icon - Always visible */}
            <div className="nav-profile-icon" ref={dropdownRef}>
                <button
                    className="nav-profile-btn"
                    onClick={handleProfileClick}
                    aria-label="Profile"
                >
                    <User size={24} strokeWidth={2.5} />
                </button>

                {/* Desktop Profile Dropdown */}
                {isProfileDropdownOpen && user && (
                    <div className="nav-profile-dropdown">
                        <div className="nav-profile-dropdown-header">
                            <UserCircle size={40} />
                            <div className="nav-profile-dropdown-info">
                                <p className="nav-profile-dropdown-name">{profile?.full_name || 'User'}</p>
                                <p className="nav-profile-dropdown-email">{user.email}</p>
                            </div>
                        </div>
                        <div className="nav-profile-dropdown-divider"></div>
                        <button
                            className="nav-profile-dropdown-item"
                            onClick={() => {
                                navigate('/profile');
                                setIsProfileDropdownOpen(false);
                            }}
                        >
                            <Settings size={18} />
                            <span>Profile Settings</span>
                        </button>
                        <button
                            className="nav-profile-dropdown-item"
                            onClick={() => {
                                navigate('/orders');
                                setIsProfileDropdownOpen(false);
                            }}
                        >
                            <ShoppingBag size={18} />
                            <span>My Orders</span>
                        </button>
                        <div className="nav-profile-dropdown-divider"></div>
                        <button
                            className="nav-profile-dropdown-item nav-profile-dropdown-signout"
                            onClick={handleSignOut}
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Wrap trigger + panel in one zone so hovering the panel keeps it open */}
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
                            {/* User Section in Mobile Menu */}
                            {user ? (
                                <motion.div
                                    className="nav-user-section"
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{
                                        delay: isOpen ? 0.2 : 0,
                                        duration: 0.5,
                                        type: 'spring',
                                        stiffness: 100
                                    }}
                                >
                                    <UserCircle size={60} />
                                    <p className="nav-user-name">{profile?.full_name || 'User'}</p>
                                    <p className="nav-user-email">{user.email}</p>
                                </motion.div>
                            ) : (
                                <motion.button
                                    className="nav-signin-btn"
                                    onClick={() => {
                                        navigate('/auth');
                                        setIsOpen(false);
                                    }}
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    transition={{
                                        delay: isOpen ? 0.2 : 0,
                                        duration: 0.5,
                                        type: 'spring',
                                        stiffness: 100
                                    }}
                                >
                                    <User size={20} />
                                    <span>Sign In / Sign Up</span>
                                </motion.button>
                            )}

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

                            {/* User Actions in Mobile Menu */}
                            {user && (
                                <>
                                    <motion.button
                                        className="nav-link nav-action-link"
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsOpen(false);
                                        }}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 100, opacity: 0 }}
                                        transition={{
                                            delay: isOpen ? 0.7 : 0,
                                            duration: 0.5,
                                            type: 'spring',
                                            stiffness: 100
                                        }}
                                    >
                                        <Settings size={20} />
                                        <span className="nav-link-text">Profile Settings</span>
                                    </motion.button>
                                    <motion.button
                                        className="nav-link nav-action-link"
                                        onClick={() => {
                                            navigate('/orders');
                                            setIsOpen(false);
                                        }}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 100, opacity: 0 }}
                                        transition={{
                                            delay: isOpen ? 0.8 : 0,
                                            duration: 0.5,
                                            type: 'spring',
                                            stiffness: 100
                                        }}
                                    >
                                        <ShoppingBag size={20} />
                                        <span className="nav-link-text">My Orders</span>
                                    </motion.button>
                                    <motion.button
                                        className="nav-link nav-action-link nav-signout-link"
                                        onClick={handleSignOut}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 100, opacity: 0 }}
                                        transition={{
                                            delay: isOpen ? 0.9 : 0,
                                            duration: 0.5,
                                            type: 'spring',
                                            stiffness: 100
                                        }}
                                    >
                                        <LogOut size={20} />
                                        <span className="nav-link-text">Sign Out</span>
                                    </motion.button>
                                </>
                            )}
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
        </>
    );
}
