import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioItem } from '../types';
import SEO from '../components/SEO';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'portfolio', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as PortfolioItem);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent" size={48} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-500 mb-6" size={64} />
        <h2 className="text-4xl font-serif mb-4 text-brand-ink">Project Not Found</h2>
        <p className="text-brand-muted mb-8 max-w-md">{error || "The project you are looking for does not exist or has been moved."}</p>
        <Link to="/" className="px-10 py-4 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-ink transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <SEO 
        title={project.title}
        description={project.description || `Explore the ${project.title} project by INTERIORSWALA. A bespoke ${project.category} interior design solution.`}
        keywords={`${project.category}, ${project.title}, interior design, premium interiors, interiorswala`}
        image={project.image}
      />
      <Navbar />
      
      <main className="pt-32 pb-24 md:pb-48 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-brand-ink/50 hover:text-brand-accent transition-colors mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Gallery</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] md:aspect-[16/10] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-brand-accent text-[10px] md:text-[12px] uppercase tracking-[0.6em] font-bold mb-8 md:mb-12 block">{project.category}</span>
                <h1 className="text-5xl md:text-8xl font-serif text-brand-ink mb-8 md:mb-12 leading-[1.1] tracking-tighter">{project.title}</h1>
                <div className="w-24 md:w-32 h-px bg-brand-accent/30 mb-10 md:mb-16" />
                <p className="text-brand-muted text-lg md:text-2xl font-light leading-relaxed mb-12 md:mb-20 italic">
                  {project.description || "A bespoke interior solution delivered with technical excellence and premium materiality, reflecting the unique lifestyle of our client. Our design philosophy focuses on the intersection of form, function, and the emotional resonance of space."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-4 px-12 py-6 bg-brand-accent text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-ink transition-all duration-500 shadow-2xl rounded-2xl group flex-1"
                    >
                      <span>Visit Project</span>
                      <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  <button 
                    onClick={() => navigate('/#quotation')}
                    className="px-12 py-6 border-2 border-brand-ink/5 text-brand-ink text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-all duration-500 rounded-2xl flex-1"
                  >
                    Discuss Similar Project
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={null} />
    </div>
  );
};

export default PortfolioDetail;
