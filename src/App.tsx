import { useState, useEffect } from 'react';
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

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [eventsTab, setEventsTab] = useState<'upcoming' | 'past'>('upcoming');
  const [session, setSession] = useState<UserSession>({
    isLoggedIn: false,
    personnelId: '',
    email: '',
    role: ''
  });
  const [loginRedirectMessage, setLoginRedirectMessage] = useState<string>('');
  const [isAppLoading, setIsAppLoading] = useState(true);

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
        setSession({ isLoggedIn: false, personnelId: '', email: '', role: '' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('id', userId)
        .single();

      if (error) {
        // Fallback user details if database profile hasn't finished writing or schema mismatch
        const fallBackUsername = email.split('@')[0];
        setSession({
          isLoggedIn: true,
          personnelId: fallBackUsername,
          email: email,
          role: 'ELITE_BUILDER'
        });
      } else if (data) {
        setSession({
          isLoggedIn: true,
          personnelId: data.username,
          email: email,
          role: data.role
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
    setSession({ isLoggedIn: false, personnelId: '', email: '', role: '' });
    setActiveView('home');
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

