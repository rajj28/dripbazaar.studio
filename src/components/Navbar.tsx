import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Search, User, LogOut, UserCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    } else {
      navigate('/auth');
    }
  };

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

          {/* Action Icons */}
          <div className="navbar-actions">
            <button className="navbar-icon" aria-label="Search">
              <Search size={20} />
            </button>
            
            {/* Profile Dropdown */}
            <div className="navbar-profile-wrapper" ref={dropdownRef}>
              <button 
                className="navbar-icon" 
                aria-label="Account"
                onClick={handleProfileClick}
              >
                <User size={20} />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileDropdownOpen && user && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <UserCircle size={40} />
                    <div className="profile-dropdown-info">
                      <p className="profile-dropdown-name">{profile?.full_name || 'User'}</p>
                      <p className="profile-dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item"
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileDropdownOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    className="profile-dropdown-item"
                    onClick={() => {
                      navigate('/orders');
                      setIsProfileDropdownOpen(false);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>My Orders</span>
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button 
                    className="profile-dropdown-item profile-dropdown-signout"
                    onClick={handleSignOut}
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
            
            <button className="navbar-icon" aria-label="Shopping Bag" onClick={() => navigate('/cart')}>
              <ShoppingBag size={20} />
            </button>
            <button 
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {/* User Info Section */}
          {user ? (
            <div className="mobile-menu-user">
              <UserCircle size={50} />
              <p className="mobile-menu-user-name">{profile?.full_name || 'User'}</p>
              <p className="mobile-menu-user-email">{user.email}</p>
            </div>
          ) : (
            <button 
              className="mobile-menu-signin"
              onClick={() => {
                navigate('/auth');
                setIsMobileMenuOpen(false);
              }}
            >
              <User size={20} />
              <span>Sign In / Sign Up</span>
            </button>
          )}
          
          <div className="mobile-menu-divider"></div>
          
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="mobile-menu-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          
          {user && (
            <>
              <div className="mobile-menu-divider"></div>
              <button 
                className="mobile-menu-link"
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Settings size={18} />
                <span>Profile Settings</span>
              </button>
              <button 
                className="mobile-menu-link"
                onClick={() => {
                  navigate('/orders');
                  setIsMobileMenuOpen(false);
                }}
              >
                <ShoppingBag size={18} />
                <span>My Orders</span>
              </button>
              <button 
                className="mobile-menu-link mobile-menu-signout"
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
