import { motion } from 'motion/react';
import { Play, TrendingUp, Cpu, Server, MapPin, Coffee, Trophy, Compass } from 'lucide-react';
import { ViewType } from '../types';

interface LandingViewProps {
  setActiveView: (view: ViewType) => void;
  setEventsTab?: (tab: 'upcoming' | 'past') => void;
}

export default function LandingView({ setActiveView, setEventsTab }: LandingViewProps) {
  
  const handleExploreEvents = () => {
    if (setEventsTab) setEventsTab('upcoming');
    setActiveView('events');
  };

  const handleViewPastEvents = () => {
    if (setEventsTab) setEventsTab('past');
    setActiveView('events');
  };

  // High-fidelity image sets matching the playground lounge aesthetic
  const reelsCol1 = [
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400', // FIFA/Football
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', // Console Gaming
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=400', // Social lounge
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', // Gaming tournaments
  ];

  const reelsCol2 = [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=400', // F1 Sim
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400', // Premium Coffee Brews
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=400', // Cozy Board games
    'https://images.unsplash.com/photo-1550741827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400', // Retro setup
  ];

  const reelsCol3 = [
    'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&q=80&w=400', // Ping Pong / Social
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400', // Creators gathering
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400', // Watch parties
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400', // PC Gaming
  ];

  return (
    <section 
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-[#f9f9f9] blueprint-grid pb-12 pt-8"
      id="landing-hero-section"
    >
      {/* 1. DYNAMIC VERTICAL REELS CAROUSEL BACKGROUND */}
      <div className="absolute inset-0 z-0 flex justify-center gap-4 sm:gap-6 md:gap-8 overflow-hidden opacity-[0.08] pointer-events-none select-none">
        {/* Column 1 - Sliding Up */}
        <div className="flex flex-col gap-4 sm:gap-6 animate-vertical-slide-up h-[200%]">
          {[...reelsCol1, ...reelsCol1].map((img, i) => (
            <div key={i} className="w-[110px] sm:w-[150px] md:w-[190px] h-[180px] sm:h-[260px] md:h-[320px] bg-brand-charcoal border border-brand-charcoal/10 shadow-lg shrink-0">
              <img src={img} className="w-full h-full object-cover grayscale brightness-95" alt="" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>

        {/* Column 2 - Sliding Down */}
        <div className="flex flex-col gap-4 sm:gap-6 animate-vertical-slide-down h-[200%] mt-[-100px] sm:mt-[-200px]">
          {[...reelsCol2, ...reelsCol2].map((img, i) => (
            <div key={i} className="w-[110px] sm:w-[150px] md:w-[190px] h-[180px] sm:h-[260px] md:h-[320px] bg-brand-charcoal border border-brand-charcoal/10 shadow-lg shrink-0">
              <img src={img} className="w-full h-full object-cover grayscale brightness-95" alt="" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>

        {/* Column 3 - Sliding Up (Delayed/Slower) */}
        <div className="flex flex-col gap-4 sm:gap-6 animate-vertical-slide-up-delayed h-[200%] hidden sm:flex">
          {[...reelsCol3, ...reelsCol3].map((img, i) => (
            <div key={i} className="w-[110px] sm:w-[150px] md:w-[190px] h-[180px] sm:h-[260px] md:h-[320px] bg-brand-charcoal border border-brand-charcoal/10 shadow-lg shrink-0">
              <img src={img} className="w-full h-full object-cover grayscale brightness-95" alt="" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. TRANSLUCENT DEPTH MASK OVERLAY FOR PERFECT TEXT CONTRAST */}
      <div className="absolute inset-0 bg-[#f9f9f9]/85 backdrop-blur-[1px] z-[1] pointer-events-none"></div>

      {/* Structural Blueprint Accent Elements - Left & Right Floating Blocks */}
      <div className="absolute left-4 sm:left-8 top-1/4 bottom-1/4 w-12 sm:w-20 hidden md:flex flex-col gap-6 pointer-events-none opacity-50 z-[2]">
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
      </div>
      
      <div className="absolute right-4 sm:right-8 top-1/4 bottom-1/4 w-12 sm:w-20 hidden md:flex flex-col gap-6 pointer-events-none opacity-50 z-[2]">
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
        <div className="flex-1 bg-brand-charcoal/[0.03] border border-brand-charcoal/10 rounded-none h-1/3"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 md:px-12 flex-1 flex flex-col justify-center items-center z-10 text-center relative z-10">
        
        {/* Community Status Indicator Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/5 border border-brand-red/20 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
          </span>
          <span className="font-mono text-xs font-bold tracking-[0.25em] text-brand-red uppercase">
            THE FOOTBALL BAITHAK • JULY 07
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex flex-col items-center justify-center font-display font-black tracking-tighter text-brand-charcoal mb-6 leading-[0.9]"
        >
          <span className="text-5xl sm:text-7xl md:text-[96px] uppercase leading-none select-none">
            JOIN THE
          </span>
          <span className="text-6xl sm:text-8xl md:text-[112px] text-brand-red italic leading-none select-none drop-shadow-sm">
            PLAYGROUND
          </span>
        </motion.h1>

        {/* Hero Subheading Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl text-brand-charcoal font-display font-bold text-sm sm:text-base md:text-lg tracking-widest leading-normal mb-10 text-brand-charcoal/85 uppercase"
        >
          THE ULTIMATE SOCIAL PLAYGROUND FOR PREMIUM GATHERINGS. COZY WATCH PARTIES. CASUAL CONSOLE SOCIALS. DESIGNED FOR AWESOME VIBES.
        </motion.p>

        {/* Action Callouts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md sm:max-w-none"
        >
          {/* Explore Button */}
          <button
            onClick={handleExploreEvents}
            className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-dark text-white font-display font-black italic text-lg sm:text-xl tracking-wider px-10 py-4 shadow-lg hover:shadow-brand-red/10 hover:translate-y-[-2px] transition-all duration-200 uppercase flex items-center justify-center gap-2 cursor-pointer chamfer-clip-br"
            id="landing-explore-btn"
          >
            EXPLORE EVENTS <span className="font-sans font-normal">→</span>
          </button>

          {/* Join WhatsApp Button */}
          <a
            href="https://chat.whatsapp.com/placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-[#25D366] hover:text-white hover:border-[#25D366] text-brand-charcoal border-2 border-brand-charcoal font-display font-black italic text-lg sm:text-xl tracking-wider px-10 py-3.5 hover:translate-y-[-2px] transition-all duration-200 uppercase flex items-center justify-center gap-2 cursor-pointer text-center"
            id="landing-whatsapp-btn"
          >
            JOIN WHATSAPP
          </a>
        </motion.div>
      </div>

      {/* bottom live telemetry bar with community vibe */}
      <div className="w-full border-t border-brand-charcoal/10 bg-[#f9f9f9]/90 mt-12 z-10 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-charcoal/10 py-5">
          
          {/* Active Members */}
          <div className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:py-0">
            <Cpu className="w-5 h-5 text-brand-charcoal/40" />
            <div className="font-mono text-xs uppercase">
              <span className="text-brand-charcoal/60 font-bold mr-1.5">MEMBERS:</span>
              <span className="text-brand-red font-bold font-display text-lg tracking-wider">12,408</span>
            </div>
          </div>

          {/* Perks */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 md:py-0">
            <Trophy className="w-5 h-5 text-brand-charcoal/40" />
            <div className="font-mono text-xs uppercase">
              <span className="text-brand-charcoal/60 font-bold mr-1.5">MEMBER DROPS:</span>
              <span className="text-brand-red font-bold font-display text-lg tracking-wider">EXCLUSIVE</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-3 px-4 py-3 md:py-0">
            <Compass className="w-5 h-5 text-brand-charcoal/40" />
            <div className="font-mono text-xs uppercase">
              <span className="text-brand-charcoal/60 font-bold mr-1.5">LOCATION:</span>
              <span className="text-brand-red font-bold font-display text-lg tracking-wider">GURUGRAM, IN</span>
            </div>
          </div>

          {/* Lounge doors status */}
          <div className="flex items-center justify-center md:justify-end gap-3 px-4 py-3 md:py-0">
            <Coffee className="w-5 h-5 text-brand-charcoal/40" />
            <div className="font-mono text-xs uppercase">
              <span className="text-brand-charcoal/60 font-bold mr-1.5">LOUNGE DOORS:</span>
              <span className="text-emerald-500 font-bold font-display text-lg tracking-wider">OPEN DAILY</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

