import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND_IMAGES } from '../../constants';

const Navbar = () => {
  console.log("Navbar component rendering...");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const getNavLink = (item: string) => {
    const id = item.toLowerCase();
    if (location.pathname === '/') {
      return `#${id}`;
    }
    return `/#${id}`;
  };

  const navItems = ['Portfolio', 'Services', 'Consultation', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-bg/90 backdrop-blur-md py-4 border-b border-brand-ink/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 items-center">
          {/* Logo Column */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center group">
              <div className="h-16 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Interiorswala" 
                  className="h-16 w-auto object-contain transition-all duration-300" 
                />
              </div>
            </Link>
          </div>
          
          {/* Nav Links Column (Centered on Desktop) */}
          <div className="hidden md:flex justify-center space-x-12 items-center">
            {navItems.map((item) => (
              <a 
                key={item} 
                href={getNavLink(item)} 
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? 'text-brand-ink hover:text-brand-accent' : 'text-white hover:text-brand-accent drop-shadow-sm'}`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Action Column (Right Aligned) */}
          <div className="flex justify-end items-center space-x-6">
            <div className="hidden md:block">
              <a 
                href={getNavLink('Quotation')} 
                className="px-8 py-3 bg-brand-accent text-white text-xs uppercase tracking-[0.2em] hover:bg-brand-ink transition-all duration-300 shadow-sm"
              >
                Request Quote
              </a>
            </div>
            <button className={`md:hidden ${isScrolled ? 'text-brand-ink' : 'text-white drop-shadow-sm'}`} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center w-screen h-screen"
          >
            {/* Immersive Mobile Menu Background */}
            <div className="absolute inset-0 z-0">
              <img 
                src={BRAND_IMAGES.MODERN_LIVING_ALT} 
                alt="Menu Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-ink/95 backdrop-blur-2xl" />
            </div>

            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10 p-2" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>

            <div className="relative z-10 flex flex-col items-center space-y-12 w-full px-6">
              {navItems.map((item, idx) => (
                <motion.a 
                  key={item} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  href={getNavLink(item)} 
                  className="text-4xl md:text-5xl font-serif text-white hover:text-brand-accent transition-colors tracking-wide text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href={getNavLink('Quotation')} 
                className="mt-12 px-16 py-5 bg-brand-accent text-white text-sm uppercase tracking-[0.3em] font-semibold rounded-full shadow-2xl hover:bg-white hover:text-brand-ink transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request Quote
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
