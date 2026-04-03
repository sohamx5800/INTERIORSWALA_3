import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { BRAND_IMAGES } from '../../constants';

const FadeInSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const EditorialSections = () => {
  return (
    <section className="bg-brand-bg overflow-hidden py-12 md:py-32 space-y-24 md:space-y-48">
      {/* Living Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 aspect-[16/11] relative rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full h-full rounded-[3rem] overflow-hidden border border-brand-ink/5">
              <img 
                src={BRAND_IMAGES.LIVING} 
                alt="Living Room" 
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-ink/5" />
            </div>
          </motion.div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <FadeInSection>
              <span className="text-brand-accent text-xs uppercase tracking-[0.3em] mb-4 block">Refined Living</span>
              <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">The Art of the Living Space</h3>
              <p className="text-brand-muted text-lg leading-relaxed mb-8 font-light">
                We create living environments that balance social energy with private tranquility. Our designs utilize natural light, premium materials, and custom-tailored layouts to enhance your daily rhythm.
              </p>
              <a href="#portfolio" className="flex items-center text-xs uppercase tracking-widest group">
                View Collection <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
              </a>
            </FadeInSection>
          </div>
        </div>
      </div>

      {/* Kitchen Section - Reversed */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 aspect-[16/11] relative rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="w-full h-full rounded-[3rem] overflow-hidden border border-brand-ink/5">
              <img 
                src={BRAND_IMAGES.KITCHEN} 
                alt="Modular Kitchen" 
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-brand-ink/5" />
            </div>
          </motion.div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <FadeInSection>
              <span className="text-brand-accent text-xs uppercase tracking-[0.3em] mb-4 block">Technical Precision</span>
              <h3 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Culinary Engineering</h3>
              <p className="text-brand-muted text-lg leading-relaxed mb-8 font-light">
                Our modular kitchens are masterpieces of functional planning. We integrate the latest hardware with timeless aesthetics, creating a workspace that is as efficient as it is beautiful.
              </p>
              <a href="#portfolio" className="flex items-center text-xs uppercase tracking-widest group">
                Explore Details <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} />
              </a>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSections;
