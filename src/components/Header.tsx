import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert, LogOut, Terminal } from 'lucide-react';
import { ViewType, UserSession } from '../types';

interface HeaderProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  session: UserSession;
  onLogout: () => void;
}

export default function Header({ activeView, setActiveView, session, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navItems: { label: string; view: ViewType }[] = [
    { label: 'EVENTS', view: 'events' },
    { label: 'NEWSLETTER', view: 'newsletter' },
    { label: 'ABOUT US', view: 'about' },
    { label: 'CONTACT US', view: 'contact' },
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f9f9f9]/90 backdrop-blur-md border-b border-brand-charcoal/10 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between h-20">
        
        {/* Brand Logo - Styled strictly to match the visual layouts */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none"
          id="btn-logo"
        >
          {!logoError ? (
            <img 
              src="/logo.jpeg" 
              alt="Builders Playground" 
              className="h-10 sm:h-12 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <span className="font-display font-black italic text-2xl tracking-tighter text-brand-red leading-none">BP</span>
                <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                  </div>
                </div>
              </div>
              <span className="font-display text-[10px] font-bold tracking-widest text-brand-charcoal leading-none mt-0.5">BUILDERS PLAYGROUND</span>
              <span className="font-mono text-[6px] text-brand-charcoal/40 tracking-[0.2em] leading-none mt-0.5">BUILD . CONNECT . GROW</span>
            </div>
          )}
        </button>

        {/* Center Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`relative font-display font-bold italic text-lg lg:text-xl tracking-wide uppercase transition-colors py-2 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none ${
                  isActive ? 'text-brand-red' : 'text-brand-charcoal hover:text-brand-red'
                }`}
                id={`nav-${item.view}`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Desktop Action Button / Account Center */}
        <div className="hidden md:flex items-center gap-4">
          <AnimatePresence mode="wait">
            {session.isLoggedIn ? (
              <motion.div 
                key="logged-in-badge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div 
                  className="flex items-center gap-2 bg-brand-charcoal text-white font-mono text-xs px-4 py-2 border border-brand-charcoal select-none"
                  id="header-profile-status"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold tracking-widest">MEMBER: {session.personnelId}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Disconnect Session"
                  className="p-2 border border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white transition-colors focus-visible:outline-none"
                  aria-label="Disconnect Session"
                  id="header-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="create-account-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => handleNavClick('login')}
                className="bg-brand-red hover:bg-brand-red-dark text-white font-display font-bold italic tracking-wider text-sm lg:text-base uppercase px-6 py-2.5 shadow-md hover:shadow-lg transition-all focus-visible:outline-none chamfer-clip-br"
                id="header-create-account-btn"
              >
                CREATE ACCOUNT
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brand-charcoal hover:text-brand-red transition-colors focus-visible:outline-none"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-charcoal/10 bg-[#f9f9f9] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`text-left font-display font-bold italic text-xl tracking-wide uppercase py-2 border-b border-brand-charcoal/5 focus-visible:outline-none ${
                    activeView === item.view ? 'text-brand-red pl-2 border-l-2 border-l-brand-red' : 'text-brand-charcoal'
                  }`}
                  id={`mobile-nav-${item.view}`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-2 border-t border-brand-charcoal/10 flex flex-col gap-3">
                {session.isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 bg-brand-charcoal text-white font-mono text-xs px-4 py-3 justify-center select-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="font-bold tracking-widest">MEMBER: {session.personnelId}</span>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 border border-brand-red text-brand-red py-2.5 font-display font-bold italic uppercase hover:bg-brand-red hover:text-white transition-colors"
                      id="mobile-logout-btn"
                    >
                      <LogOut className="w-4 h-4" /> DISCONNECT SESSION
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full bg-brand-red text-white py-3 font-display font-bold italic tracking-wider uppercase text-center chamfer-clip-br"
                    id="mobile-create-account-btn"
                  >
                    CREATE ACCOUNT
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
