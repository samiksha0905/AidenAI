import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Phone } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Plumbing', href: '/plumbing' },
    { name: 'Tutoring', href: '/tutoring' },
    { name: 'Landscaping', href: '/landscaping' },
    { name: 'Cleaning', href: '/cleaning' },
    { name: 'Electrical', href: '/electrical' },
    { name: 'HVAC', href: '/hvac' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">🏠</div>
            <span className="logo-text">
              Service<span className="logo-accent">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-only">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${
                    isActive(item.href) ? 'active' : ''
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="header-actions desktop-only">
            <button className="cta-button">
              <Phone size={16} />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu slide-down">
            <div className="mobile-nav-links">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`mobile-nav-link ${
                      isActive(item.href) ? 'active' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mobile-actions">
              <button className="cta-button">
                <Phone size={16} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
