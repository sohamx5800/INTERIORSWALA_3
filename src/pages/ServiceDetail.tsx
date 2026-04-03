import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { SERVICES } from '../constants';
import SEO from '../components/SEO';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const service = SERVICES.find(s => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-500 mb-6" size={64} />
        <h2 className="text-4xl font-serif mb-4 text-brand-ink">Service Not Found</h2>
        <p className="text-brand-muted mb-8 max-w-md">The service you are looking for does not exist or has been moved.</p>
        <Link to="/" className="px-10 py-4 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-ink transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  const features = [
    "Bespoke design concepts tailored to your lifestyle",
    "Technical architectural precision in every detail",
    "Premium materiality and high-end finishes",
    "End-to-end project management and execution",
    "Sustainable and innovative design solutions"
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      <SEO 
        title={service.title}
        description={service.description}
        keywords={`${service.title}, interior design services, luxury interiors, interiorswala`}
        image={service.image}
      />
      <Navbar />
      
      <main className="pt-32 pb-24 md:pb-48">
        <div className="max-w-7xl mx-auto px-6">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-brand-ink/50 hover:text-brand-accent transition-colors mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Services</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent text-[10px] md:text-[12px] uppercase tracking-[0.6em] font-bold mb-8 md:mb-12 block">Service Expertise {service.id}</span>
              <h1 className="text-5xl md:text-8xl font-serif text-brand-ink mb-8 md:mb-12 leading-[1.1] tracking-tighter">{service.title}</h1>
              <div className="w-24 md:w-32 h-1 bg-brand-accent mb-10 md:mb-16" />
              <p className="text-brand-muted text-lg md:text-2xl font-light leading-relaxed mb-12 md:mb-20">
                {service.description} Our approach to {service.title.toLowerCase()} is rooted in a deep understanding of spatial dynamics and the emotional impact of design. We create environments that are not only visually stunning but also highly functional and enduring.
              </p>
              
              <div className="space-y-6 mb-12 md:mb-20">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle2 className="text-brand-accent" size={20} />
                    <span className="text-brand-ink text-sm md:text-lg font-light">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/#quotation')}
                className="px-12 py-6 bg-brand-accent text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-ink transition-all duration-500 shadow-2xl rounded-2xl"
              >
                Request Consultation
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/5] md:aspect-[1/1] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative"
            >
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-ink/10" />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer profile={null} />
    </div>
  );
};

export default ServiceDetail;
