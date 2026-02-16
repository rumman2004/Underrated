import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { PrimaryButton } from './Buttons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-[var(--color-bg-surface)]/90 backdrop-blur-md border-b border-[var(--color-sapling-200)] z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--color-darkblue-600)] text-[var(--color-sapling-300)] rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-darkblue-600)]/20 group-hover:rotate-12 transition-transform duration-300">
            <MapPin className="w-4 h-4 md:w-6 md:h-6 fill-current" />
          </div>
          <span className="text-lg md:text-xl font-serif font-bold text-[var(--color-darkblue-900)] tracking-tight">
            Underrated<span className="text-[var(--color-darkblue-600)]">.</span>
          </span>
        </Link>

        {/* 2. Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all duration-200 ${
                  isActive(link.path) 
                    ? 'text-[var(--color-darkblue-600)]' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-800)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link to="/contact">
            <PrimaryButton className="py-2.5 px-5 text-sm bg-[var(--color-darkblue-600)] text-white hover:bg-[var(--color-darkblue-700)] shadow-md border-none">
              Suggest Place
            </PrimaryButton>
          </Link>
        </div>

        {/* 3. Mobile Menu Toggle */}
        <button 
          className="md:hidden text-[var(--color-darkblue-600)] p-1.5 hover:bg-[var(--color-sapling-100)] rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-bg-surface)] border-t border-[var(--color-sapling-200)] absolute w-full left-0 shadow-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-base font-serif font-bold p-3 rounded-xl transition-colors ${
                isActive(link.path) 
                  ? 'bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)]' 
                  : 'text-[var(--color-darkblue-900)] hover:bg-[var(--color-sapling-50)]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-[var(--color-sapling-200)] my-1" />
          <Link to="/contact" onClick={() => setIsOpen(false)}>
            <PrimaryButton className="w-full justify-center bg-[var(--color-darkblue-600)] text-white py-3">
              Suggest a Place
            </PrimaryButton>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;