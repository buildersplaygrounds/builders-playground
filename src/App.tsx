import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, UserSession } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingView from './components/LandingView';
import EventsView from './components/EventsView';
import NewsletterView from './components/NewsletterView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import LoginView from './components/LoginView';
import { supabase } from './lib/supabaseClient';

const coolGenzPrefixes = [
  'neo', 'cyber', 'retro', 'hyper', 'vapor', 'pixel', 'flux', 'sonic', 'orbit', 'meta',
  'static', 'vector', 'alpha', 'zen', 'apex', 'glide', 'pulse', 'sync', 'zero', 'chroma',
  'cosmic', 'prism', 'echo', 'phantom', 'vortex', 'helix', 'turbo', 'lurk', 'giga', 'sigma'
];

const coolGenzSuffixes = [
  'vibe', 'ghost', 'aura', 'flow', 'grid', 'core', 'wave', 'craft', 'mode', 'hacker',
  'maker', 'zephyr', 'nova', 'shift', 'spark', 'dash', 'warp', 'zoom', 'hype', 'pixel',
  'nexus', 'realm', 'surge', 'glow', 'haze', 'glitch', 'drift', 'fuse', 'axis', 'pulse'
];

function generateGenzUsername(): string {
  const p = coolGenzPrefixes[Math.floor(Math.random() * coolGenzPrefixes.length)];
  const s = coolGenzSuffixes[Math.floor(Math.random() * coolGenzSuffixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${p}.${s}_${num}`;
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [eventsTab, setEventsTab] = useState<'upcoming' | 'past'>('upcoming');
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    personnelId: '',
    email: '',
    role: '',
    phoneNumber: ''
  });
  const [loginRedirectMessage, setLoginRedirectMessage] = useState<string>('');
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Mandatory Phone Collection States
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hydrate session from Supabase on mount and listen to changes
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        fetchUserProfile(initialSession.user.id, initialSession.user.email || '');
      }
    });

    // 2. Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        fetchUserProfile(currentSession.user.id, currentSession.user.email || '');
      } else {
        setSession({ isLoggedIn: false, personnelId: '', email: '', role: '', phoneNumber: '' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, role, phone_number')
        .eq('id', userId)
        .single();

      if (error) {
        // Fallback user details if database profile hasn't finished writing or schema mismatch
        const fallBackUsername = email.split('@')[0];
        setSession({
          isLoggedIn: true,
          personnelId: fallBackUsername,
          email: email,
          role: 'ELITE_BUILDER',
          phoneNumber: ''
        });
      } else if (data) {
        setSession({
          isLoggedIn: true,
          personnelId: data.username,
          email: email,
          role: data.role,
          phoneNumber: data.phone_number || ''
        });
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setActiveView('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession({ isLoggedIn: false, personnelId: '', email: '', role: '', phoneNumber: '' });
    setActiveView('home');
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }
    setIsSubmittingPhone(true);
    setPhoneError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No active user session found.');

      const userId = user.id;
      const userEmail = user.email || '';

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        // Create profile (Insert) for first-time login
        const newUsername = generateGenzUsername();
        const newRole = 'ELITE_BUILDER';
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: newUsername,
            phone_number: cleanPhone,
            role: newRole
          });
        if (insertError) throw insertError;
        
        setSession({
          isLoggedIn: true,
          personnelId: newUsername,
          email: userEmail,
          role: newRole,
          phoneNumber: cleanPhone
        });
      } else {
        // Update existing profile with phone number
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ phone_number: cleanPhone })
          .eq('id', userId);
        if (updateError) throw updateError;

        setSession(prev => ({
          ...prev,
          phoneNumber: cleanPhone
        }));
      }
    } catch (err: any) {
      console.error('Error updating phone number:', err);
      setPhoneError(err.message || 'Failed to sync phone number. Try again.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleNavigateToLoginWithRedirect = (message: string) => {
    setLoginRedirectMessage(message);
    setActiveView('login');
  };

  const handleClearRedirectMessage = () => {
    setLoginRedirectMessage('');
  };

  const handleCustomViewChange = (view: ViewType) => {
    // If user clicks login/create account in header and is already logged in, redirect to home
    if (view === 'login' && session.isLoggedIn) {
      setActiveView('home');
    } else {
      setActiveView(view);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isAppLoading ? (
        <motion.div
          key="app-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f9f9f9] blueprint-grid select-none"
        >
          {/* Subtle blueprint mask */}
          <div className="absolute inset-0 bg-[#f9f9f9]/90 backdrop-blur-[1px] pointer-events-none" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="z-10 flex flex-col items-center gap-4 text-center px-4"
          >
            <div className="relative flex items-center justify-center w-24 h-24 p-2 rounded-xl bg-white border border-brand-charcoal/10 shadow-xl overflow-hidden">
              <motion.img 
                src="/logo.jpeg"
                alt="Builders Playground Logo"
                className="w-full h-full object-contain"
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            
            <div className="flex flex-col items-center gap-1 mt-3">
              <span className="font-display font-black italic text-2xl tracking-tighter text-brand-red leading-none">BUILDERS PLAYGROUND</span>
              <span className="font-mono text-[8px] text-brand-charcoal/50 tracking-[0.28em] uppercase mt-1">BUILD . CONNECT . GROW</span>
            </div>

            {/* Premium progress bar */}
            <div className="w-40 h-0.5 bg-brand-charcoal/10 overflow-hidden relative mt-6 rounded-full">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-brand-red"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="app-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen bg-[#f9f9f9] text-brand-charcoal font-sans selection:bg-brand-red selection:text-white"
        >
          
          {/* Header element - Persistent across all tabs */}
          <Header 
            activeView={activeView} 
            setActiveView={handleCustomViewChange} 
            session={session}
            onLogout={handleLogout}
          />

          {/* Main Container - Renders dynamic viewport and micro-animations */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                {activeView === 'home' && (
                  <LandingView 
                    setActiveView={handleCustomViewChange} 
                    setEventsTab={setEventsTab} 
                  />
                )}

                {activeView === 'events' && (
                  <EventsView 
                    session={session} 
                    activeTab={eventsTab} 
                    setActiveTab={setEventsTab} 
                    onNavigateToLogin={handleNavigateToLoginWithRedirect}
                  />
                )}

                {activeView === 'newsletter' && (
                  <NewsletterView />
                )}

                {activeView === 'about' && (
                  <AboutView setActiveView={handleCustomViewChange} />
                )}

                {activeView === 'contact' && (
                  <ContactView />
                )}

                {activeView === 'login' && (
                  <LoginView 
                    onLoginSuccess={handleLoginSuccess} 
                    redirectMessage={loginRedirectMessage}
                    onClearRedirectMessage={handleClearRedirectMessage}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer element - Persistent */}
          <Footer setActiveView={handleCustomViewChange} />

          {/* Mandatory Phone Number Overlay */}
          <AnimatePresence>
            {session.isLoggedIn && !session.phoneNumber && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-brand-charcoal/80 backdrop-blur-md p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-md bg-white border border-brand-charcoal p-8 sm:p-10 shadow-2xl relative text-center"
                >
                  <div className="flex justify-center mb-4 text-brand-red">
                    <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center">
                      <span className="text-xl">📞</span>
                    </div>
                  </div>

                  <h2 className="font-display font-black italic text-2xl sm:text-3xl text-brand-charcoal uppercase leading-[1.1] tracking-tighter mb-2">
                    PHONE VERIFICATION REQUIRED
                  </h2>
                  <p className="font-mono text-[10px] font-bold text-brand-charcoal/50 tracking-wider uppercase mb-6 leading-relaxed">
                    To maintain ecosystem integrity, all operators must link a verified 10-digit mobile phone number.
                  </p>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6 text-left">
                    <div>
                      <label className="font-mono text-[9px] font-bold text-brand-red tracking-widest uppercase block mb-1">
                        MOBILE PHONE NUMBER
                      </label>
                      <div className="flex items-center border-b border-brand-charcoal/10 py-2 focus-within:border-brand-red transition-colors">
                        <span className="text-brand-charcoal/30 mr-3 text-sm">📱</span>
                        <input
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          value={phoneInput}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) setPhoneInput(val);
                          }}
                          className="w-full bg-transparent text-brand-charcoal placeholder-brand-charcoal/20 font-display font-bold italic tracking-wider text-base uppercase focus:outline-none"
                          disabled={isSubmittingPhone}
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="font-mono text-[10px] font-bold text-brand-red uppercase tracking-wider">
                        ⚠️ {phoneError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingPhone}
                      className="w-full bg-brand-red hover:bg-brand-red-dark disabled:bg-brand-red/50 text-white font-display font-black italic text-lg tracking-wider py-3.5 shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase chamfer-clip-br"
                    >
                      {isSubmittingPhone ? 'SYNCHRONIZING...' : 'CONFIRM TELEMETRY'} <span className="text-sm">⚡</span>
                    </button>
                  </form>

                  {/* Visual Brutalist Accents */}
                  <div className="absolute top-2 right-2 font-mono text-[8px] text-brand-charcoal/20 select-none">
                    SYS_V2.0.4 // SECURE
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

