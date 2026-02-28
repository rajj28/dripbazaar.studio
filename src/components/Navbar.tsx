import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Collection', href: '#collection' },
    { name: 'Premium', href: '#premium' },
    { name: 'Story', href: '#story' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <a href="#" className="navbar-logo">
            <span className="navbar-logo-text">DRIP</span>
            <span className="navbar-logo-accent">RIWAAZ</span>
          </a>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="navbar-link">
                {link.name}
              </a>
            ))}
          </div>

     