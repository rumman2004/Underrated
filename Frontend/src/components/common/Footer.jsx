import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-surface)] border-t border-[var(--color-sapling-200)] pt-12 pb-8 md:pt-20 md:pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid: Compact gap on mobile, wider on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-20">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4 md:space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--color-darkblue-600)] text-[var(--color-sapling-300)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-darkblue-600)]/20 group-hover:rotate-12 transition-transform duration-300">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              </div>
              <span className="text-xl md:text-2xl font-serif font-bold text-[var(--color-darkblue-900)] tracking-tight">
                Underrated<span className="text-[var(--color-darkblue-600)]">.</span>
              </span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              Curating the world's hidden gems. We help travelers discover 
              places that maps often forget, creating deeper connections with nature and history.
            </p>
            <div className="flex gap-3 md:gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-sapling-100)] flex items-center justify-center text-[var(--color-darkblue-600)] hover:bg-[var(--color-darkblue-600)] hover:text-[var(--color-sapling-300)] transition-all duration-300">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-[var(--color-darkblue-900)] text-base md:text-lg mb-4 md:mb-6">Company</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-medium text-[var(--color-text-muted)]">
              <li><Link to="/about" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Careers</Link></li>
              <li><Link to="/admin/login" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Curator Login</Link></li>
              <li><a href="#" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-serif font-bold text-[var(--color-darkblue-900)] text-base md:text-lg mb-4 md:mb-6">Resources</h4>
            <ul className="space-y-3 md:space-y-4 text-sm font-medium text-[var(--color-text-muted)]">
              <li><a href="#" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Travel Safety</a></li>
              <li><a href="#" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Suggest a Place</a></li>
              <li><a href="#" className="hover:text-[var(--color-darkblue-600)] hover:translate-x-1 transition-all inline-block">Support Center</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="font-serif font-bold text-[var(--color-darkblue-900)] text-base md:text-lg mb-4 md:mb-6">Stay Updated</h4>
            <p className="text-[var(--color-text-muted)] text-sm mb-4 md:mb-6 leading-relaxed">
              Get the latest hidden gems delivered to your inbox weekly. No spam, just adventure.
            </p>
            <form className="relative max-w-sm">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white border border-[var(--color-sapling-200)] rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none transition-all placeholder:text-[var(--color-darkblue-200)]"
              />
              <button className="absolute right-2 top-1.5 p-1.5 bg-[var(--color-darkblue-600)] text-white rounded-lg hover:bg-[var(--color-darkblue-700)] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-sapling-200)] pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs md:text-sm text-[var(--color-darkblue-400)] font-medium">
            © {currentYear} Underrated Inc. All rights reserved.
          </p>
          <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-[var(--color-darkblue-400)] font-medium">
            <a href="#" className="hover:text-[var(--color-darkblue-900)]">Terms</a>
            <a href="#" className="hover:text-[var(--color-darkblue-900)]">Cookies</a>
            <a href="#" className="hover:text-[var(--color-darkblue-900)]">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;