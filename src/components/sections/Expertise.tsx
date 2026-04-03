import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../constants';

const ExpertiseSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % SERVICES.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
  };

  return (
    <div className="relative min-h-[550px] md:h-[85vh] w-full max-w-7xl mx-auto px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-6 inset-y-0 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src={SERVICES[currentIndex].image} 
              alt={SERVICES[currentIndex].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/40 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full px-6 md:px-24 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-brand-accent font-serif text-xl md:text-5xl italic mb-4 block">
                {SERVICES[currentIndex].id}
              </span>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-white text-2xl md:text-7xl font-serif mb-6 max-w-2xl leading-[1.1]"
            >
              {SERVICES[currentIndex].title}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/80 text-xs md:text-xl font-light max-w-lg leading-relaxed mb-10"
            >
              {SERVICES[currentIndex].description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link 
                to={`/services/${SERVICES[currentIndex].id}`}
                className="flex items-center gap-3 px-8 py-4 bg-brand-accent text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white hover:text-brand-ink transition-all duration-500 rounded-xl group"
              >
                <span>Explore Expertise</span>
                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-4">
                <button 
                  onClick={prevSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all duration-500 backdrop-blur-sm"
                >
                  <ArrowRight className="rotate-180" size={16} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all duration-500 backdrop-blur-sm"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 md:gap-4">
        {SERVICES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(idx);
            }}
            className={`h-1 md:h-1.5 rounded-full transition-all duration-700 ${idx === currentIndex ? 'w-12 md:w-16 bg-brand-accent' : 'w-3 md:w-4 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

const Expertise = () => {
  return (
    <section id="services" className="relative py-32 md:py-48 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-serif mb-6 leading-none">Our Expertise</h2>
            <div className="w-32 h-1 bg-brand-accent mx-auto mb-8" />
            <p className="text-brand-muted font-light text-lg md:text-xl max-w-2xl mx-auto">
              Specialized interior solutions delivered with architectural precision and premium materiality.
            </p>
          </div>
        </div>
      </div>

      <div className="relative group">
        <ExpertiseSlider />
      </div>
    </section>
  );
};

export default Expertise;
