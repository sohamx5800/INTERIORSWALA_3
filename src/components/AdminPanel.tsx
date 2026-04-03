import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Image as ImageIcon, 
  MessageSquare, 
  Save, 
  Plus, 
  Trash2, 
  LogOut,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  User,
  Sparkles,
  Loader2
} from 'lucide-react';
import { SiteProfile, PortfolioItem, QuotationRequest, SocialLink } from '../types';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  query, 
  orderBy,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loginError, setLoginError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'google' | 'email'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'quotations'>('profile');
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [newQueriesCount, setNewQueriesCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Blank fields on mount for security
    setEmail('');
    setPassword('');

    // Check for existing local session
    const localSession = localStorage.getItem('admin_session');
    if (localSession) {
      try {
        const session = JSON.parse(localSession);
        const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        if (now - session.timestamp < fifteenDaysInMs) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (e) {
        localStorage.removeItem('admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'sohamadhikary707@gmail.com') {
        setCurrentUser(user);
        setIsLoggedIn(true);
        // Save session for Google login too
        const session = {
          userId: user.uid,
          timestamp: Date.now()
        };
        localStorage.setItem('admin_session', JSON.stringify(session));
      } else {
        setCurrentUser(null);
        // Only set isLoggedIn to false if there's no valid local session
        const localSession = localStorage.getItem('admin_session');
        if (localSession) {
          try {
            const session = JSON.parse(localSession);
            const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
            if (Date.now() - session.timestamp < fifteenDaysInMs) {
              setIsLoggedIn(true);
              return;
            }
          } catch (e) {}
        }
        
        setIsLoggedIn(false);
        if (user) {
          setLoginError('Access denied. Only the administrator can access this panel.');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Portfolio Form State
  const [newProject, setNewProject] = useState({ 
    title: '', 
    category: 'Residential', 
    image: '',
    description: '',
    link: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to WebP with 0.8 quality
          const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(webpDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const optimizedImage = await optimizeImage(file);
      setNewProject(prev => ({ ...prev, image: optimizedImage }));
    } catch (error) {
      console.error('Image optimization error:', error);
      alert('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!db || Object.keys(db).length === 0) {
      console.warn("Firestore db is not initialized. Skipping AdminPanel listeners.");
      return;
    }

    const seedInitialData = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profile', 'main'));
        if (!profileDoc.exists()) {
          const initialProfile: SiteProfile = {
            phone: '+91 98765 43210',
            email: 'hello@interiorswala.com',
            address: 'Siliguri, West Bengal',
            socialLinks: [
              { platform: 'Instagram', url: '#' },
              { platform: 'Facebook', url: '#' },
              { platform: 'LinkedIn', url: '#' }
            ]
          };
          await setDoc(doc(db, 'profile', 'main'), initialProfile);
        }
      } catch (error) {
        console.error('Seed error:', error);
      }
    };

    seedInitialData();

    // Real-time sync for all data
    const unsubscribeProfile = onSnapshot(doc(db, 'profile', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setProfile(snapshot.data() as SiteProfile);
      }
    });

    const unsubscribePortfolio = onSnapshot(collection(db, 'portfolio'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
      setPortfolio(items);
    });

    const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
    const unsubscribeQuotations = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QuotationRequest[];
      
      // Handle new queries count
      if (activeTab !== 'quotations' && quotations.length > 0 && items.length > quotations.length) {
        setNewQueriesCount(prev => prev + (items.length - quotations.length));
      }
      
      setQuotations(items);
    });

    return () => {
      unsubscribeProfile();
      unsubscribePortfolio();
      unsubscribeQuotations();
    };
  }, [isLoggedIn, activeTab]);

  const handleProfileSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), profile);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.message?.includes('permission-denied')) {
        alert('Permission denied. Please ensure you are logged in as an administrator.');
      } else {
        alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.image) return;
    try {
      await addDoc(collection(db, 'portfolio'), newProject);
      setNewProject({ 
        title: '', 
        category: 'Residential', 
        image: '',
        description: '',
        link: ''
      });
    } catch (error: any) {
      console.error('Add project error:', error);
      alert(`Failed to add project: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (error) {
      console.error('Delete project error:', error);
      alert('Failed to delete project');
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    try {
      await deleteDoc(doc(db, 'quotations', id));
    } catch (error) {
      console.error('Delete quotation error:', error);
      alert('Failed to delete query');
    }
  };

  const addSocialLink = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialLinks: [...profile.socialLinks, { platform: 'New Platform', url: '' }]
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    if (!profile) return;
    const newLinks = [...profile.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setProfile({ ...profile, socialLinks: newLinks });
  };

  const removeSocialLink = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.filter((_, i) => i !== index)
    });
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Failed to sign in. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    // Local Credential Check (Bypass for local testing)
    if (email === 'admin_456' && password === 'Admin@5632') {
      const session = {
        userId: 'admin_456',
        timestamp: Date.now()
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      setIsLoggedIn(true);
      setIsLoggingIn(false);
      return;
    }

    try {
      // If not the local bypass, try real Firebase Auth (assuming User ID is an email)
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Email login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setLoginError('Invalid email or password.');
      } else {
        setLoginError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_session');
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[110] bg-brand-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-brand-ink/5 p-10 md:p-12 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10">
              <img src="/logo.png" alt="Interiorswala" className="h-16 w-auto mb-6" />
              <h2 className="text-2xl font-serif text-brand-ink">Admin Authentication</h2>
              <p className="text-brand-ink/40 text-sm mt-2">
                {loginMethod === 'google' ? 'Sign in with your Google account' : 'Sign in with your email and password'}
              </p>
            </div>

            <div className="space-y-6">
              {loginError && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-medium text-center"
                >
                  {loginError}
                </motion.p>
              )}

              {loginMethod === 'google' ? (
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-5 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
                  <span>{isLoggingIn ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-ink/40 ml-1 font-bold">User ID</label>
                  <input 
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-ink/10 rounded-2xl py-4 px-6 focus:border-brand-accent outline-none transition-all font-light text-sm"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-ink/40 ml-1 font-bold">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-ink/10 rounded-2xl py-4 px-6 focus:border-brand-accent outline-none transition-all font-light text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-5 bg-brand-accent text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                  <span>{isLoggingIn ? 'Signing in...' : 'Sign In'}</span>
                </button>
              </form>
            )}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-ink/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-white px-4 text-brand-ink/20 font-bold">OR</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setLoginMethod(loginMethod === 'google' ? 'email' : 'google');
                  setLoginError('');
                }}
                className="w-full py-4 text-brand-ink/40 text-[10px] uppercase tracking-widest font-bold hover:text-brand-accent transition-colors"
              >
                {loginMethod === 'google' ? 'Use User ID & Password Instead' : 'Use Google Authentication Instead'}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full text-brand-ink/20 text-[10px] uppercase tracking-widest font-bold hover:text-brand-ink transition-colors"
              >
                Return to Website
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-brand-bg flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-brand-ink p-8 flex flex-col border-r border-white/5">
        <div className="flex flex-col items-center mb-12">
          <img src="/logo.png" alt="Interiorswala" className="h-12 w-auto mb-6" />
          <div className="h-px w-full bg-white/10 mb-6" />
          <div className="flex items-center space-x-3 w-full px-2">
            <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shrink-0">
              <Settings className="text-white" size={16} />
            </div>
            <h1 className="text-white font-serif text-lg truncate">Admin Dashboard</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <Globe size={18} />
            <span className="text-sm font-medium">Profile Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <ImageIcon size={18} />
            <span className="text-sm font-medium">Portfolio Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('quotations')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'quotations' ? 'bg-brand-accent text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare size={18} />
              <span className="text-sm font-medium">Client Queries</span>
            </div>
            {newQueriesCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white text-brand-accent text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
              >
                {newQueriesCount}
              </motion.span>
            )}
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-white transition-all group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout & Exit</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-brand-bg p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'profile' && profile && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Profile Management</h2>
                <button 
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-6 py-3 bg-brand-accent text-white rounded-xl hover:bg-brand-accent/90 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Contact Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={18} />
                    <input 
                      type="text" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={18} />
                    <input 
                      type="email" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Office Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-brand-ink/30" size={18} />
                  <textarea 
                    rows={3}
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full bg-white border border-brand-ink/10 rounded-xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Social Media Links</label>
                  <button onClick={addSocialLink} className="text-brand-accent flex items-center space-x-1 text-sm font-semibold hover:underline">
                    <Plus size={16} />
                    <span>Add Link</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {profile.socialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-brand-ink/5">
                      <input 
                        type="text" 
                        placeholder="Platform (e.g. Instagram)"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        className="flex-1 bg-brand-bg/50 border border-brand-ink/5 rounded-lg py-2 px-3 outline-none focus:border-brand-accent"
                      />
                      <input 
                        type="text" 
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="flex-[2] bg-brand-bg/50 border border-brand-ink/5 rounded-lg py-2 px-3 outline-none focus:border-brand-accent"
                      />
                      <button onClick={() => removeSocialLink(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Portfolio Management</h2>
              </div>

              {/* Add New Project */}
              <div className="bg-white p-8 rounded-2xl border border-brand-ink/5 shadow-sm space-y-6">
                <h3 className="text-lg font-serif text-brand-ink">Add New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Project Title</label>
                    <input 
                      type="text" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="e.g. Urban Sanctuary"
                      className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Category</label>
                    <select 
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent appearance-none"
                    >
                      <option>Residential</option>
                      <option>Kitchen</option>
                      <option>Bedroom</option>
                      <option>Living</option>
                      <option>Commercial</option>
                      <option>Storage</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">Project Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Briefly describe the project details, materials, and design philosophy..."
                    rows={3}
                    className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 px-4 outline-none focus:border-brand-accent resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold">External Link (e.g. Instagram)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/30" size={16} />
                    <input 
                      type="text" 
                      value={newProject.link}
                      onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                      placeholder="https://instagram.com/p/..."
                      className="w-full bg-brand-bg/50 border border-brand-ink/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-brand-ink/40 font-semibold block">Project Image</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-2xl bg-brand-bg border-2 border-dashed border-brand-ink/10 flex items-center justify-center overflow-hidden relative group">
                      {newProject.image ? (
                        <>
                          <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setNewProject(prev => ({ ...prev, image: '' }))} className="text-white">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          {isUploading ? (
                            <Loader2 className="animate-spin text-brand-accent mx-auto" size={24} />
                          ) : (
                            <>
                              <ImageIcon className="text-brand-ink/20 mx-auto mb-2" size={24} />
                              <span className="text-[8px] uppercase tracking-widest text-brand-ink/40">No Image</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-block px-6 py-3 bg-white border border-brand-ink/10 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-bg transition-all">
                        {newProject.image ? 'Change Image' : 'Select Image File'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                      <p className="text-[10px] text-brand-ink/40 mt-2 font-medium">
                        Max 5MB. Automatically optimized to WebP for speed.
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleAddProject}
                  disabled={!newProject.title || !newProject.image || isUploading}
                  className="w-full py-4 bg-brand-accent text-white rounded-xl font-semibold uppercase tracking-widest text-xs hover:bg-brand-accent/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Plus size={18} />
                  <span>Add Project to Portfolio</span>
                </button>
              </div>

              {/* Project List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-brand-ink/5 shadow-sm group">
                    <div className="h-48 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => handleDeleteProject(item.id)}
                          className="bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-1 block">{item.category}</span>
                      <h4 className="text-xl font-serif text-brand-ink">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'quotations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-ink">Client Queries</h2>
                <span className="bg-brand-accent/10 text-brand-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {quotations.length} Total Requests
                </span>
              </div>

              <div className="space-y-6">
                {quotations.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-brand-ink/5">
                    <MessageSquare size={48} className="mx-auto text-brand-ink/10 mb-4" />
                    <p className="text-brand-ink/40 font-medium">No client queries yet.</p>
                  </div>
                ) : (
                  quotations.map((q) => (
                    <div key={q.id} className="bg-white p-8 rounded-3xl border border-brand-ink/5 shadow-sm space-y-6 relative group">
                      <button 
                        onClick={() => q.id && handleDeleteQuotation(q.id)}
                        className="absolute top-8 right-8 text-brand-ink/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-2 block">Client Info</span>
                          <h4 className="text-2xl font-serif text-brand-ink mb-1">{q.name}</h4>
                          <div className="flex flex-col space-y-1">
                            <a href={`mailto:${q.email}`} className="text-sm text-brand-ink/60 hover:text-brand-accent flex items-center space-x-2">
                              <Mail size={14} />
                              <span>{q.email}</span>
                            </a>
                            <a href={`tel:${q.phone}`} className="text-sm text-brand-ink/60 hover:text-brand-accent flex items-center space-x-2">
                              <Phone size={14} />
                              <span>{q.phone}</span>
                            </a>
                          </div>
                        </div>
                        <div className="md:border-l border-brand-ink/5 md:pl-12">
                          <span className="text-[10px] uppercase tracking-widest text-brand-accent font-bold mb-2 block">Project Details</span>
                          <div className="space-y-1">
                            <p className="text-sm text-brand-ink font-semibold">{q.projectType}</p>
                            <p className="text-sm text-brand-ink/60">Budget: {q.budget}</p>
                            <p className="text-[10px] text-brand-ink/30 uppercase tracking-widest mt-2">
                              {new Date(q.createdAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-bg/50 p-6 rounded-2xl border border-brand-ink/5">
                        <span className="text-[10px] uppercase tracking-widest text-brand-ink/40 font-bold mb-3 block">Message</span>
                        <p className="text-brand-ink/70 leading-relaxed text-sm">{q.message}</p>
                      </div>

                      {q.aiConcept && (
                        <div className="bg-brand-accent/5 border border-brand-accent/10 p-6 rounded-2xl space-y-4">
                          <div className="flex items-center space-x-2 text-brand-accent">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Attached AI Design Plan</span>
                          </div>
                          {(() => {
                            try {
                              const concept = JSON.parse(q.aiConcept);
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest">Theme & Vision</p>
                                    <p className="text-sm text-brand-ink font-serif italic">{concept.theme}</p>
                                    <p className="text-xs text-brand-ink/60 leading-relaxed">{concept.description}</p>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Color Palette</p>
                                      <div className="grid grid-cols-5 gap-2">
                                        {concept.colorPalette.map((color: string, i: number) => (
                                          <div key={i} className="flex flex-col items-center gap-1">
                                            <div 
                                              className="w-full aspect-square rounded border border-brand-ink/10 shadow-sm"
                                              style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}
                                            />
                                            <span className="text-[8px] font-mono text-brand-ink/40 uppercase">{color}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Key Features</p>
                                      <div className="flex flex-wrap gap-2">
                                        {concept.keyFeatures.map((f: string, i: number) => (
                                          <span key={i} className="text-[10px] bg-white px-2 py-1 rounded border border-brand-ink/5 text-brand-ink/60">{f}</span>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-brand-ink/40 uppercase tracking-widest mb-2">Materials</p>
                                      <div className="flex flex-wrap gap-2">
                                        {concept.materials.map((m: string, i: number) => (
                                          <span key={i} className="text-[10px] bg-brand-accent/10 px-2 py-1 rounded text-brand-accent">{m}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } catch (e) {
                              return <p className="text-xs text-red-500">Error parsing AI concept</p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
