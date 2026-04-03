import React from 'react';
import { motion } from 'motion/react';

const BrandStatement = () => {
  return (
    <section className="relative py-32 md:py-72 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          src="https://images.unsplash.com/photo-1678762200388-51e11225d4de?q=80&w=1163&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Luxury Interior Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-ink/65" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-7xl font-serif text-white mb-12 md:mb-16 leading-[1.2] tracking-tight drop-shadow-2xl">
              Spaces That Reflect <br className="hidden md:block" />
              <span className="italic text-brand-accent">Precision</span> & Lifestyle
            </h2>
          </motion.div>

          <div className="space-y-12 max-w-4xl">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 md:w-32 h-px bg-brand-accent/60 mx-auto"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-brand-accent text-lg md:text-3xl font-serif italic leading-relaxed tracking-wide"
            >
              Serving discerning clients across Siliguri, Sikkim, Kalimpong, and Darjeeling with thoughtful design and complete project delivery.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
