import React from 'react';
import { Instagram, Facebook, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SiteProfile } from '../../types';

interface FooterProps {
  profile: SiteProfile | null;
}

const Footer = ({ profile }: FooterProps) => {
  const location = useLocation();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'facebook': return <Facebook size={20} />;
      default: return <MessageSquare size={20} />;
    }
  };

  const getNavLink = (item: string) => {
    const id = item.toLowerCase().replace(' ', '-');
    if (location.pathname === '/') {
      return `#${id}`;
    }
    return `/#${id}`;
  };

  return (
    <footer className="bg-black py-24 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <Link to="/">
              <img src="/logo.png" alt="Interiorswala" className="h-16 w-auto mb-8" />
            </Link>
            <p className="text-white/60 text-lg font-light max-w-sm leading-relaxed italic">
              A premium interior design studio dedicated to technical excellence and luxury aesthetics.
            </p>
          </div>
          
          <div>
            <h4 className="text-brand-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Portfolio', 'Services', 'Consultation', 'Quotation'].map(item => (
                <li key={item}>
                  <a href={getNavLink(item)} className="text-white/60 hover:text-brand-accent transition-colors text-sm font-light">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-brand-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-8">Social</h4>
            <div className="flex gap-4">
              {profile?.socialLinks?.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-accent hover:bg-brand-accent/10 transition-all duration-500"
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
              {(!profile || !profile.socialLinks || profile.socialLinks.length === 0) && (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-accent transition-colors cursor-pointer"><Instagram size={20} /></div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-accent transition-colors cursor-pointer"><Facebook size={20} /></div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-accent transition-colors cursor-pointer"><MessageSquare size={20} /></div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold">
            © {new Date().getFullYear()} Interiorswala. All Rights Reserved.
          </p>
          <div className="flex gap-12">
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[9px] uppercase tracking-[0.3em] font-bold">Privacy Policy</a>
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[9px] uppercase tracking-[0.3em] font-bold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
