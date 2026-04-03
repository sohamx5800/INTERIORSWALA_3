import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteProfile, PortfolioItem } from '../types';

// Components
import AdminPanel from '../components/AdminPanel';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import BrandStatement from '../components/sections/BrandStatement';
import EditorialSections from '../components/sections/EditorialSections';
import Expertise from '../components/sections/Expertise';
import Portfolio from '../components/sections/Portfolio';
import Consultation from '../components/sections/Consultation';
import QuotationForm from '../components/sections/QuotationForm';
import SEO from '../components/SEO';

const Home = () => {
  console.log("Home component rendering...");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [sharedMessage, setSharedMessage] = useState('');
  const [sharedConcept, setSharedConcept] = useState<any>(null);

  // Initial Data Listeners
  useEffect(() => {
    const profilePath = 'profile/main';
    const portfolioPath = 'portfolio';

    let unsubProfile = () => {};
    let unsubPortfolio = () => {};

    if (!db || Object.keys(db).length === 0) {
      return;
    }

    try {
      unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (doc) => {
        if (doc.exists()) setProfile(doc.data() as SiteProfile);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, profilePath);
      });

      unsubPortfolio = onSnapshot(query(collection(db, 'portfolio'), orderBy('title')), (snapshot) => {
        setPortfolio(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem)));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, portfolioPath);
      });
    } catch (err) {
      console.error("Error setting up Firestore listeners:", err);
    }

    return () => {
      unsubProfile();
      unsubPortfolio();
    };
  }, []);

  // Handle Admin View via URL Hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-accent selection:text-white">
      <SEO />
      <Navbar />
      
      <main>
        <Hero />
        <BrandStatement />
        <EditorialSections />
        <Expertise />
        <Portfolio portfolio={portfolio} />
        <Consultation onAttach={(msg, concept) => {
          setSharedMessage(msg);
          setSharedConcept(concept);
        }} />
        <QuotationForm 
          profile={profile} 
          initialMessage={sharedMessage} 
          initialConcept={sharedConcept} 
        />
      </main>

      <Footer profile={profile} />

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <AdminPanel onClose={() => {
              setIsAdminOpen(false);
              window.location.hash = '';
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
