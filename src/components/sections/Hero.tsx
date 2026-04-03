import React from 'react';
import { motion } from 'motion/react';
import { BRAND_IMAGES } from '../../constants';

const Hero = () => {
  console.log("Hero component rendering...");
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={BRAND_IMAGES.HERO} 
          alt="Luxury Interior" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-brand-ink/30" />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="text-white/90 text-[10px] md:text-lg uppercase tracking-[0.4em] mb-12 font-light drop-shadow-md leading-relaxed">
            Design. Technical Excellence. <br className="md:hidden" /> Complete Project Delivery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#quotation" 
              className="w-full sm:w-auto inline-block px-10 py-5 bg-brand-accent text-white text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-ink transition-all duration-500 shadow-xl rounded-sm"
            >
              Book Consultation
            </a>
            <a 
              href="#portfolio" 
              className="w-full sm:w-auto inline-block px-10 py-5 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-brand-ink transition-all duration-500 rounded-sm"
            >
              View Portfolio
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-4 bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
