import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioItem } from '../../types';

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

const Portfolio = ({ portfolio }: PortfolioProps) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Residential', 'Commercial', 'Modular Kitchen', 'Bedroom'];
  const filteredPortfolio = filter === 'All' ? portfolio : portfolio.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="py-24 md:py-48 bg-brand-bg px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-32 gap-12 md:gap-16">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand-accent text-[10px] uppercase tracking-[0.5em] font-bold mb-4 md:mb-6 block"
            >
              Curated Works
            </motion.span>
            <h2 className="text-5xl md:text-9xl font-serif mb-6 md:mb-8 leading-none tracking-tighter">Portfolio</h2>
            <p className="text-brand-muted text-lg md:text-3xl font-light leading-relaxed italic">
              A distinguished collection of architectural interiors and bespoke living environments.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-6 border-b border-brand-ink/5 pb-6 w-full lg:w-auto">
            {categories.map(cat => {
              const count = cat === 'All' ? portfolio.length : portfolio.filter(item => item.category === cat).length;
              return (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-all pb-2 relative flex items-center gap-2 md:gap-3 group ${filter === cat ? 'text-brand-accent' : 'text-brand-ink/30 hover:text-brand-ink'}`}
                >
                  <span>{cat}</span>
                  <span className={`text-[7px] md:text-[8px] font-mono transition-colors ${filter === cat ? 'text-brand-accent/50' : 'text-brand-ink/10 group-hover:text-brand-ink/20'}`}>
                    ({count.toString().padStart(2, '0')})
                  </span>
                  {filter === cat && (
                    <motion.div 
                      layoutId="activeFilter" 
                      className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-accent" 
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredPortfolio.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 1, 
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group"
              >
                <Link to={`/portfolio/${item.id}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] md:rounded-[3rem] mb-6 md:mb-10 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-700">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-brand-ink/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="text-center p-8"
                      >
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mx-auto mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">
                          <ExternalLink size={18} />
                        </div>
                        <span className="text-white text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold block mb-2">View Project</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className="px-4 md:px-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="h-px w-6 md:w-8 bg-brand-accent/30 group-hover:w-10 md:group-hover:w-12 transition-all duration-500" />
                      <span className="text-brand-accent text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">{item.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-serif text-brand-ink group-hover:text-brand-accent transition-colors duration-500 leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
