import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Loader2, Phone, Mail, MapPin, Sparkles, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { SiteProfile, ProjectConcept } from '../../types';
import { BRAND_IMAGES } from '../../constants';

interface QuotationFormProps {
  profile: SiteProfile | null;
  initialMessage?: string;
  initialConcept?: ProjectConcept | null;
}

const QuotationForm = ({ profile, initialMessage, initialConcept }: QuotationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attachedConcept, setAttachedConcept] = useState<ProjectConcept | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    budget: '',
    message: ''
  });

  // Update message when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setFormData(prev => ({ ...prev, message: initialMessage }));
    }
  }, [initialMessage]);

  // Update attachedConcept when initialConcept changes
  useEffect(() => {
    if (initialConcept) {
      setAttachedConcept(initialConcept);
    }
  }, [initialConcept]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!db || Object.keys(db).length === 0) {
      alert('Database connection is not available at the moment. Please try again later.');
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'quotations'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        aiConcept: attachedConcept ? JSON.stringify(attachedConcept) : null
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', projectType: 'Residential', budget: '', message: '' });
      setAttachedConcept(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'quotations');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-48 relative px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={BRAND_IMAGES.CONTACT_BG} 
          alt="Contact Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-ink/90 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/5 backdrop-blur-2xl rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 border border-white/10 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <span className="text-brand-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Contact</span>
              <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">
                Begin Your <br /> Transformation
              </h2>
              <p className="text-white/60 text-base md:text-lg font-light mb-12 md:mb-16 leading-relaxed max-w-md">
                Every great project starts with a conversation. Share your vision, and our team will provide a comprehensive consultation and preliminary quotation.
              </p>
              
              <div className="space-y-8 md:space-y-10">
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent border border-white/10">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-brand-accent text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-1 block">Call Us</span>
                    <p className="text-xl md:text-2xl font-serif text-white tracking-wide">{profile?.phone || '+91 73808 72754'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent border border-white/10">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-brand-accent text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-1 block">Email</span>
                    <p className="text-xl md:text-2xl font-serif text-white break-all tracking-wide">{profile?.email || 'info.interiorswala@gmail.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent border border-white/10 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-brand-accent text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-1 block">Office</span>
                    <p className="text-sm md:text-base font-serif text-white max-w-xs leading-relaxed tracking-wide">
                      {profile?.address || 'Mangal Pandey Sarani, Ward 38, East Vivekananda Pally, Rabindra Sarani, Siliguri, West Bengal 734001'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div id="quotation" className="w-full">
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/10">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-8">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-serif text-white mb-4">Request Received</h3>
                      <p className="text-white/60 text-sm font-light mb-10">Our design team will contact you shortly.</p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="px-10 py-4 bg-brand-accent text-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-brand-ink transition-all"
                      >
                        Send Another
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Full Name</label>
                          <input 
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light text-white"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Email Address</label>
                          <input 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light text-white"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Project Type</label>
                          <select 
                            value={formData.projectType}
                            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light appearance-none text-white [&>option]:bg-brand-ink [&>option]:text-white"
                          >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Modular Kitchen">Modular Kitchen</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Estimated Budget</label>
                          <input 
                            type="text"
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light text-white"
                            placeholder="e.g. ₹20L - ₹50L"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Phone Number</label>
                        <input 
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light text-white"
                          placeholder="+91 00000 00000"
                        />
                      </div>

                      <AnimatePresence>
                        {attachedConcept && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-6 relative group">
                              <button 
                                type="button"
                                onClick={() => setAttachedConcept(null)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                              >
                                <X size={16} />
                              </button>
                              
                              <div className="flex items-center gap-3 text-brand-accent mb-4">
                                <Sparkles size={18} />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Attached Design Plan</span>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-white font-serif text-lg mb-1">{attachedConcept.theme}</h4>
                                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{attachedConcept.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {attachedConcept.colorPalette.map((color, i) => (
                                    <div 
                                      key={i} 
                                      className="w-6 h-6 rounded-full border border-white/10 shadow-sm"
                                      style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                                      title={color}
                                    />
                                  ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {attachedConcept.keyFeatures.slice(0, 3).map((f, i) => (
                                    <span key={i} className="text-[9px] bg-white/5 px-2 py-1 rounded border border-white/5 text-white/40 uppercase tracking-wider">
                                      {f}
                                    </span>
                                  ))}
                                  {attachedConcept.keyFeatures.length > 3 && (
                                    <span className="text-[9px] text-white/20">+{attachedConcept.keyFeatures.length - 3} more</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Message</label>
                        <textarea 
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full bg-white/10 border border-white/10 rounded-xl py-4 px-5 focus:border-brand-accent outline-none transition-all text-sm font-light min-h-[100px] resize-none text-white"
                          placeholder="Tell us about your project vision..."
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-brand-accent text-white rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-brand-ink transition-all flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Submit Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuotationForm;
