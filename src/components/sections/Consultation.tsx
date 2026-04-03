import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { ProjectConcept } from '../../types';
import { generateInteriorConcept } from '../../services/geminiService';
import { BRAND_IMAGES } from '../../constants';

interface ConsultationProps {
  onAttach?: (message: string, concept: ProjectConcept) => void;
}

const Consultation = ({ onAttach }: ConsultationProps) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAttached, setIsAttached] = useState(false);
  const [concept, setConcept] = useState<ProjectConcept | null>(null);

  const handleAttach = () => {
    if (!concept || !onAttach) return;
    
    const message = `I'm interested in the "${concept.theme}" concept.
    
Description: ${concept.description}

Key Features:
${concept.keyFeatures.map(f => `- ${f}`).join('\n')}

Materials:
${concept.materials.map(m => `- ${m}`).join('\n')}

Color Palette: ${concept.colorPalette.join(', ')}`;

    onAttach(message, concept);
    setIsAttached(true);
    
    // Smooth scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset attached state after 3 seconds
    setTimeout(() => setIsAttached(false), 3000);
  };

  const handleGenerateConcept = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateInteriorConcept(aiPrompt);
      setConcept(result);
    } catch (error) {
      console.error('Concept generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="consultation" className="py-24 md:py-48 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={BRAND_IMAGES.SERVICES_BG} 
          alt="Consultation Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-ink/60 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-brand-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Digital Studio</span>
          <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">Private Design Consultation</h2>
          <p className="text-white/60 text-base md:text-lg font-light mb-12 md:mb-16 leading-relaxed max-w-2xl mx-auto">
            Describe your vision, and our intelligent design engine will architect a bespoke concept with technical precision and editorial flair.
          </p>

          <div className="relative max-w-3xl mx-auto group">
            <div className="bg-brand-ink/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 flex flex-col md:flex-row items-center gap-6 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your dream space..."
                className="w-full md:flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white text-sm font-light focus:ring-0 focus:border-brand-accent outline-none min-h-[120px] md:min-h-[60px] resize-none transition-all"
              />
              <button 
                onClick={handleGenerateConcept}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full md:w-auto px-12 py-5 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-brand-ink transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl whitespace-nowrap"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Concept</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-16 md:mt-24 text-center"
            >
              <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-8">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-brand-accent/30"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 rounded-full border-2 border-brand-accent flex items-center justify-center"
                    >
                      <Sparkles className="text-brand-accent" size={32} />
                    </motion.div>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-serif text-white mb-4">Architecting Your Vision</h3>
                  <p className="text-white/40 text-sm md:text-base font-light tracking-[0.2em] uppercase">
                    Analyzing spatial dynamics & material palettes...
                  </p>
                  
                  <div className="mt-12 w-full max-w-md h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-brand-accent to-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : concept && (
            <motion.div
              key="concept"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-16 md:mt-24 text-left"
            >
              <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-accent/20 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mb-10 md:mb-12">
                    <span className="text-brand-accent text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Generated Concept</span>
                    <h3 className="text-3xl md:text-6xl font-serif text-white mb-6 leading-tight">{concept.theme}</h3>
                    <p className="text-white/70 text-base md:text-xl font-light leading-relaxed max-w-3xl">{concept.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    <div className="space-y-8">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Color Palette</h4>
                      <div className="flex flex-wrap gap-4">
                        {concept.colorPalette.map((color, idx) => (
                          <div key={idx} className="group/color relative">
                            <div className="w-12 h-12 rounded-2xl shadow-lg border border-white/10 transition-transform duration-500 group-hover/color:scale-110" style={{ backgroundColor: color }} />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-white/40 opacity-0 group-hover/color:opacity-100 transition-opacity uppercase tracking-widest">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Key Features</h4>
                      <div className="space-y-4">
                        {concept.keyFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-4 text-white/80 text-sm md:text-base font-light">
                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="text-brand-accent" size={12} />
                            </div>
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setConcept(null)}
                      className="w-full py-5 border border-white/10 rounded-2xl text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-white/10 hover:text-white transition-all duration-500"
                    >
                      Reset Design Engine
                    </button>
                    <button 
                      onClick={handleAttach}
                      disabled={isAttached}
                      className={`w-full py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 flex items-center justify-center gap-3 ${
                        isAttached 
                          ? 'bg-green-500 text-white' 
                          : 'bg-brand-accent text-white hover:bg-brand-ink'
                      }`}
                    >
                      {isAttached ? (
                        <>
                          <CheckCircle2 size={14} />
                          Attached Successfully
                        </>
                      ) : (
                        <>
                          <ArrowRight size={14} />
                          Attach in Query
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Consultation;
