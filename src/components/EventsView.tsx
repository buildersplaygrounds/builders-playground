import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trophy, Calendar, Users, Shield, Clock, Check, Sparkles, MapPin, Utensils, Gamepad2 } from 'lucide-react';
import { GameEvent, UserSession } from '../types';
import { getUpcomingEvents, getPastEvents } from '../data/eventsData';

interface EventsViewProps {
  session: UserSession;
  activeTab: 'upcoming' | 'past';
  setActiveTab: (tab: 'upcoming' | 'past') => void;
  onNavigateToLogin: (message: string) => void;
}

interface ExtendedGameEvent extends GameEvent {
  simulatedStartTime?: number;
  simulatedEndTime?: number;
}

function getParsedEventDates(event: GameEvent): { start: Date; end: Date } {
  const currentYear = 2026; // Match local system year
  const months: { [key: string]: number } = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };

  // Default fallback: 1 year in future
  let start = new Date(Date.UTC(currentYear + 1, 0, 1));
  
  if (event.date && event.time) {
    const dateParts = event.date.trim().split(/\s+/);
    if (dateParts.length >= 2) {
      const monthStr = dateParts[0].substring(0, 3).toUpperCase();
      const dayNum = parseInt(dateParts[1], 10);
      const monthIdx = months[monthStr] !== undefined ? months[monthStr] : 6;
      
      const timeStr = event.time.replace('UTC', '').replace('IST', '').replace('ONWARDS', '').trim();
      const timeParts = timeStr.split(':');
      const hours = parseInt(timeParts[0], 10) || 0;
      const minutes = parseInt(timeParts[1], 10) || 0;
      
      start = new Date(Date.UTC(currentYear, monthIdx, dayNum, hours, minutes, 0));
    }
  }
  
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
  return { start, end };
}

function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) {
    return '00:00:00';
  }
  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const dStr = days > 0 ? `${days}d ` : '';
  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  
  return `${dStr}${hStr}:${mStr}:${sStr}`;
}

export default function EventsView({ 
  session, 
  activeTab, 
  setActiveTab, 
  onNavigateToLogin 
}: EventsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [liveUpcomingEvents, setLiveUpcomingEvents] = useState<GameEvent[]>([]);
  const [livePastEvents, setLivePastEvents] = useState<GameEvent[]>([]);
  const [embeddedFormUrl, setEmbeddedFormUrl] = useState<string | null>(null);
  
  // Real-time tick
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const loadEvents = () => {
    setLiveUpcomingEvents(getUpcomingEvents());
    setLivePastEvents(getPastEvents());
  };

  useEffect(() => {
    loadEvents();
    window.addEventListener('bp_events_updated', loadEvents);
    return () => {
      window.removeEventListener('bp_events_updated', loadEvents);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (event: GameEvent) => {
    if (!session.isLoggedIn) {
      onNavigateToLogin(`SIGN IN REQUIRED: Please log in or create an account to reserve your spot for ${event.title}.`);
      return;
    }

    if (registeredEventIds.includes(event.id)) {
      if (event.ctaLink) {
        setEmbeddedFormUrl(event.ctaLink);
      }
      return;
    }

    // Register locally
    setRegisteredEventIds((prev) => [...prev, event.id]);
    
    // Decrease spot count if spots are available
    setLiveUpcomingEvents((prevEvents) =>
      prevEvents.map((ev) => {
        if (ev.id === event.id && ev.spotsLeft !== undefined && ev.spotsLeft > 0) {
          return { ...ev, spotsLeft: ev.spotsLeft - 1 };
        }
        return ev;
      })
    );

    // Redirect to the custom RSVP Google Form Link
    if (event.ctaLink) {
      setEmbeddedFormUrl(event.ctaLink);
    }
  };

  // Compute absolute timestamps for active events to identify active live/upcoming
  const resolvedEvents: ExtendedGameEvent[] = liveUpcomingEvents.map(event => {
    const parsed = getParsedEventDates(event);
    const start = parsed.start.getTime();
    const end = parsed.end.getTime();

    return {
      ...event,
      simulatedStartTime: start,
      simulatedEndTime: end
    };
  });

  const liveEvents = resolvedEvents.filter(ev => currentTime >= (ev.simulatedStartTime || 0) && currentTime < (ev.simulatedEndTime || 0));
  const activeLiveEvent = liveEvents[0] || null;

  const nextEvents = resolvedEvents
    .filter(ev => (ev.simulatedStartTime || 0) > currentTime)
    .sort((a, b) => (a.simulatedStartTime || 0) - (b.simulatedStartTime || 0));
  const nearestNextEvent = nextEvents[0] || null;

  const filteredUpcoming = resolvedEvents.filter(ev =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = livePastEvents.filter(ev =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-8 md:px-12 min-h-screen">
      <div className="max-w-[1440px] mx-auto">

        
        {/* Title and Intro Paragraph */}
        <div className="max-w-4xl mb-8">
          <h1 className="font-display font-black italic text-5xl sm:text-6xl md:text-[80px] leading-[0.9] text-brand-charcoal uppercase select-none tracking-tighter">
            COMMUNITY <span className="text-brand-red">SOCIALS</span>
          </h1>
          <p className="font-sans font-medium text-[#111111]/70 text-sm sm:text-base md:text-lg uppercase tracking-wider mt-4 leading-relaxed">
            THE PLATFORM FOR PREMIUM GATHERINGS. JOIN US FOR FANTASTIC LIVE WATCH PARTIES, CONSOLE NIGHTS, AND UNFORGETTABLE COZY LIFESTYLE SCREENINGS.
          </p>
        </div>

        {/* DYNAMIC LIVE SPOTLIGHT MONITOR */}
        <div className="mb-12 border border-brand-charcoal/20 bg-[#111111] text-white p-6 md:p-8 relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${activeLiveEvent ? 'bg-brand-red animate-ping' : 'bg-white/40'} absolute`}></span>
              <span className={`w-2.5 h-2.5 rounded-full ${activeLiveEvent ? 'bg-brand-red' : 'bg-white/20'} relative`}></span>
              <span className="font-mono text-[10px] font-black tracking-widest uppercase text-white/90">
                {activeLiveEvent ? '🔴 LIVE NOW: EVENT IN PROGRESS' : '📡 SPOTLIGHT: UPCOMING'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white/5 font-mono text-[10px] font-bold py-1 px-3 tracking-widest uppercase border border-white/10 flex items-center gap-1.5 text-white/70">
                <Clock className="w-3.5 h-3.5 text-brand-red" />
                <span>UTC: {new Date(currentTime).toISOString().substring(11, 19)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {activeLiveEvent ? (
              <>
                <div className="lg:col-span-5 relative h-48 sm:h-52 bg-brand-charcoal overflow-hidden border border-white/10">
                  <img
                    src={activeLiveEvent.image}
                    alt={activeLiveEvent.title}
                    className="w-full h-full object-cover brightness-75 scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-brand-red text-white font-mono text-[9px] font-black tracking-widest px-2.5 py-1 uppercase border border-brand-red animate-pulse">
                    LIVE NOW
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 font-mono text-[9px] text-white/80 font-bold bg-black/40 px-2.5 py-1 uppercase">
                    <Users className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                    <span>80+ GUESTS ENJOYING</span>
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-red text-white font-mono text-[9px] font-black tracking-widest uppercase mb-3 select-none">
                      ACTIVE EVENT
                    </div>
                    <h2 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase tracking-tight leading-none mb-3">
                      {activeLiveEvent.title}
                    </h2>
                    <p className="font-mono text-[11px] text-white/60 uppercase tracking-wider mb-5">
                      HAPPENING RIGHT NOW • THE LOUNGE IS BUZZING AND THE REFRESHMENTS ARE FLOWING.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 items-end justify-between border-t border-white/10 pt-4">
                    <div className="flex gap-8">
                      <div>
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase block mb-1">ELAPSED TIME</span>
                        <span className="font-mono text-base font-black text-brand-red tracking-wider">
                          {formatCountdown(currentTime - (activeLiveEvent.simulatedStartTime || 0))}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase block mb-1">EVENT BONUSES</span>
                        <span className="font-display font-black text-lg text-white">
                          {activeLiveEvent.prizePool || 'FREE ENTRY'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => alert(`Enjoying active social: ${activeLiveEvent.title}`)}
                      className="bg-brand-red hover:bg-white hover:text-brand-charcoal text-white font-display font-black italic text-xs tracking-wider px-5 py-2.5 transition-all uppercase flex items-center gap-2 cursor-pointer chamfer-clip-br"
                    >
                      VIEW SOCIAL HUB ⚡
                    </button>
                  </div>
                </div>
              </>
            ) : nearestNextEvent ? (
              <>
                <div className="lg:col-span-5 relative h-48 sm:h-52 bg-brand-charcoal overflow-hidden border border-white/10">
                  <img
                    src={nearestNextEvent.image}
                    alt={nearestNextEvent.title}
                    className="w-full h-full object-cover brightness-50 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-amber-500 text-[#111111] font-display font-black text-[10px] tracking-widest px-3 py-1.5 uppercase shadow-md animate-pulse">
                    ⚠️ ABOUT TO START
                  </div>
                </div>
                
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 text-white/70 font-mono text-[9px] font-black tracking-widest uppercase mb-3 border border-white/5">
                      UPCOMING GATHERING
                    </div>
                    <h2 className="font-display font-black italic text-3xl md:text-4xl text-white uppercase tracking-tight leading-none mb-3">
                      {nearestNextEvent.title}
                    </h2>
                    <p className="font-mono text-[11px] text-white/60 uppercase tracking-wider mb-5">
                      PREPARE TO HANG OUT. SECURE YOUR SPOT NOW FOR AN AWESOME GATHERING WITH GREAT COMPANY.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 items-end justify-between border-t border-white/10 pt-4">
                    <div className="flex gap-8">
                      <div>
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase block mb-1">ABOUT TO START IN</span>
                        <span className="font-mono text-base font-black text-amber-400 tracking-widest uppercase">
                          {formatCountdown((nearestNextEvent.simulatedStartTime || 0) - currentTime)}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-white/40 tracking-widest uppercase block mb-1">DATE & TIME</span>
                        <span className="font-mono text-xs font-bold text-white tracking-wide uppercase">
                          {nearestNextEvent.date} / {nearestNextEvent.time}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRegister(nearestNextEvent as GameEvent)}
                      disabled={registeredEventIds.includes(nearestNextEvent.id)}
                      className={`font-display font-black italic text-xs tracking-wider px-5 py-2.5 transition-all uppercase flex items-center gap-2 cursor-pointer chamfer-clip-br ${
                        registeredEventIds.includes(nearestNextEvent.id)
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'bg-white hover:bg-brand-red text-brand-charcoal hover:text-white'
                      }`}
                    >
                      {registeredEventIds.includes(nearestNextEvent.id) ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> RSVP CONFIRMED
                        </>
                      ) : (
                        'RESERVE SPOT'
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="lg:col-span-12 py-8 text-center text-white/40 font-mono text-xs tracking-widest uppercase">
                NO LIFESTYLE GET-TOGETHERS PLANNED RIGHT NOW
              </div>
            )}
          </div>
        </div>

        {/* Tab Selection Navigation Bar and Live Search Filter (Exact layout match of Screenshot 5) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-charcoal/10 pb-6 mb-12 gap-6">
          <div className="flex flex-wrap gap-4 sm:gap-8">
            {[
              { id: 'upcoming', label: 'UPCOMING EVENTS' },
              { id: 'past', label: 'PAST EVENTS' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'upcoming' | 'past')}
                  className={`relative font-display font-black italic text-xl sm:text-2xl uppercase pb-2 transition-colors focus-visible:outline-none ${
                    isActive ? 'text-brand-red' : 'text-brand-charcoal/50 hover:text-brand-charcoal'
                  }`}
                  id={`events-tab-${tab.id}`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="eventsTabUnderline"
                      className="absolute bottom-[-25px] md:bottom-[-25px] left-0 right-0 h-[3px] bg-brand-red z-10"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Precision styled Filter Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="FILTER LIST..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#eeeeee] text-brand-charcoal placeholder-brand-charcoal/40 font-mono text-xs font-bold tracking-widest uppercase py-3.5 pl-10 pr-4 border-b-2 border-brand-charcoal/30 focus:border-brand-red focus:outline-none transition-colors"
              id="events-search-input"
            />
            <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Live Content Stream based on Active Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* UPCOMING EVENTS GRID & FLAGSHIP EXPERIENCE DETAIL */}
            {activeTab === 'upcoming' && (
              filteredUpcoming.length > 0 ? (
                <div className="space-y-12">
                  {filteredUpcoming.map((event, index) => {
                    const isRegistered = registeredEventIds.includes(event.id);
                    const eventStart = event.simulatedStartTime || 0;
                    const eventEnd = event.simulatedEndTime || 0;
                    const isLive = currentTime >= eventStart && currentTime < eventEnd;
                    const isImminent = !activeLiveEvent && nearestNextEvent && nearestNextEvent.id === event.id;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-white border-2 border-brand-charcoal/10 rounded-none shadow-xl overflow-hidden flex flex-col lg:flex-row hover:border-brand-charcoal transition-all duration-300"
                        id={`flagship-event-container-${event.id}`}
                      >
                        {/* LEFT COLUMN: HERO VISUAL WITH BADGES & TICKER */}
                        <div className="lg:w-1/2 relative min-h-[350px] lg:min-h-[550px] bg-brand-charcoal overflow-hidden flex flex-col justify-between">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:scale-105 transition-all duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10"></div>
                          
                          {/* Top floating badges */}
                          <div className="relative z-20 p-6 flex flex-wrap gap-2">
                            <span className="bg-brand-red text-white font-mono text-[10px] font-black tracking-widest px-3 py-1.5 uppercase select-none border border-brand-red animate-pulse">
                              🔥 FLAGSHIP EXPERIENCE
                            </span>
                            {event.spotsLeft !== undefined && (
                              <span className="bg-black/80 text-white font-mono text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase select-none border border-white/10">
                                ONLY <span className="text-brand-red font-display font-extrabold text-xs">{event.spotsLeft}</span> PASSES LEFT
                              </span>
                            )}
                          </div>

                          {/* Bottom Match Title overlay (ARGENTINA vs EGYPT) */}
                          <div className="relative z-20 p-8 text-white mt-auto">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-[2px] bg-brand-red"></span>
                              <span className="font-mono text-xs text-brand-red font-black tracking-widest uppercase">LIVE GURUGRAM WATCH PARTY</span>
                            </div>
                            <h2 className="font-display font-black italic text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tighter leading-[0.9] mb-4">
                              EGYPT / AUSTRALIA vs ARGENTINA
                            </h2>
                            <p className="font-sans text-xs sm:text-sm text-white/70 uppercase tracking-widest max-w-md leading-relaxed">
                              WATCH THE BIGGEST CHAMPIONS CLASH LIVE AT GURUGRAM'S FINEST MICROBREWERY WITH IMMERSIVE STADIUM ATMOSPHERE.
                            </p>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: RICH PDF METADATA, INCLUSIONS & TICKETING */}
                        <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white relative">
                          <div className="space-y-8">
                            
                            {/* Title & Timing Header */}
                            <div>
                              <div className="flex items-center gap-3 mb-2 font-mono text-xs font-bold text-brand-red uppercase tracking-wider">
                                <Calendar className="w-4.5 h-4.5" />
                                <span>{event.date} • {event.time}</span>
                              </div>
                              <h1 className="font-display font-black italic text-3xl sm:text-4xl text-brand-charcoal uppercase leading-tight tracking-tight">
                                {event.title}
                              </h1>
                              
                              {/* Venue Stack */}
                              {event.venue && (
                                <div className="mt-3 flex items-start gap-2.5 bg-[#f4f4f4] p-3 border-l-4 border-brand-red select-none">
                                  <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-mono text-[9px] font-bold text-brand-charcoal/40 tracking-widest uppercase block">VENUE</span>
                                    <span className="font-display font-extrabold italic text-sm text-brand-charcoal tracking-wide uppercase">{event.venue}</span>
                                    {event.mapUrl && (
                                      <a 
                                        href={event.mapUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="font-mono text-[10px] text-brand-red font-bold tracking-widest uppercase hover:underline block mt-1"
                                      >
                                        OPEN IN GOOGLE MAPS →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Detailed Description */}
                            {event.description && (
                              <p className="font-sans text-brand-charcoal/80 text-sm leading-relaxed uppercase tracking-wider">
                                {event.description}
                              </p>
                            )}

                            {/* Inclusions Split Panel (PDF content) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 select-none">
                              
                              {/* Food & Beer */}
                              {event.inclusions && event.inclusions.length > 0 && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 border-b border-brand-charcoal/10 pb-2">
                                    <Utensils className="w-4 h-4 text-brand-red" />
                                    <span className="font-display font-black italic text-sm text-brand-charcoal tracking-wide uppercase">UNLIMITED F&B PASS</span>
                                  </div>
                                  <ul className="space-y-2">
                                    {event.inclusions.map((inc, i) => (
                                      <li key={i} className="flex items-start gap-2 font-sans text-xs text-[#111111]/70 leading-snug uppercase tracking-wide">
                                        <span className="text-brand-red font-bold mt-0.5">•</span>
                                        <span>{inc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Games & Giveaways */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-brand-charcoal/10 pb-2">
                                  <Gamepad2 className="w-4.5 h-4.5 text-brand-red" />
                                  <span className="font-display font-black italic text-sm text-brand-charcoal tracking-wide uppercase">ACTIVITIES & REWARDS</span>
                                </div>
                                <ul className="space-y-2">
                                  {event.games?.map((game, i) => (
                                    <li key={i} className="flex items-start gap-2 font-sans text-xs text-[#111111]/70 leading-snug uppercase tracking-wide">
                                      <span className="text-brand-red font-bold mt-0.5">🎮</span>
                                      <span>{game}</span>
                                    </li>
                                  ))}
                                  {event.predictions?.map((pred, i) => (
                                    <li key={`pred-${i}`} className="flex items-start gap-2 font-sans text-xs text-[#111111]/70 leading-snug uppercase tracking-wide">
                                      <span className="text-brand-red font-bold mt-0.5">⚡</span>
                                      <span>{pred}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                            </div>

                          </div>

                          {/* Ticket Reservation Footer */}
                          <div className="border-t-2 border-brand-charcoal/10 pt-6 mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                            
                            {/* Price / Entry details */}
                            <div>
                              <span className="font-mono text-[10px] text-brand-charcoal/40 font-bold tracking-widest uppercase block mb-0.5">
                                ALL-INCLUSIVE ENTRY TICKET
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-brand-charcoal">
                                  {event.entryFee}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] text-[#111111]/50 tracking-wider block mt-0.5">
                                (INCLUDES ALL FOOD, BREWED BEERS & ACTIVITY ACCESS)
                              </span>
                            </div>

                            {/* CTA Action button redirects to custom RSVP Google Form Link */}
                            <button
                              onClick={() => handleRegister(event)}
                              className={`font-display font-black italic text-sm tracking-wider px-8 py-4 uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-md chamfer-clip-br ${
                                isRegistered
                                  ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                                  : 'bg-brand-red text-white border-brand-red hover:bg-brand-charcoal hover:border-brand-charcoal'
                              }`}
                              id={`flagship-register-btn-${event.id}`}
                            >
                              {isRegistered ? (
                                <>
                                  <Check className="w-5 h-5 stroke-[3px]" /> PASS RESERVED • GO TO FORM
                                </>
                              ) : (
                                <>
                                  RESERVE PASS NOW <span className="text-xs">→</span>
                                </>
                              )}
                            </button>

                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-24 bg-white border border-[#e5e5e5]">
                  <p className="font-mono text-sm tracking-widest text-[#111111]/40 uppercase">NO GATHERINGS FOUND</p>
                </div>
              )
            )}

            {/* PAST EVENTS GRID */}
            {activeTab === 'past' && (
              filteredPast.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPast.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-[#e5e5e5] opacity-80 hover:opacity-100 transition-all duration-300 flex flex-col group"
                      id={`past-event-card-${event.id}`}
                    >
                      <div className="relative h-48 overflow-hidden bg-brand-charcoal">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[#000000]/30"></div>
                        <div className="absolute top-4 left-4 bg-brand-charcoal/80 text-white font-mono text-[9px] tracking-widest px-2.5 py-1 uppercase select-none">
                          COMPLETED
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-brand-charcoal/40" />
                            <span className="font-mono text-xs text-brand-charcoal/60 uppercase tracking-wider">
                              {event.date} ARCHIVE
                            </span>
                          </div>

                          <h3 className="font-display font-black italic text-2xl tracking-tight text-brand-charcoal/80 uppercase mb-4 leading-tight">
                            {event.title}
                          </h3>
                        </div>

                        <div className="border-t border-[#e5e5e5] pt-4 mt-4 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[10px] text-brand-charcoal/40 tracking-widest uppercase block mb-0.5">PRIZE DISTRIBUTED</span>
                            <span className="font-display font-bold text-lg text-brand-charcoal/70 uppercase">
                              {event.prizePool}
                            </span>
                          </div>

                          <div className="font-mono text-[10px] font-bold text-brand-charcoal/40 bg-[#eeeeee] px-3 py-1 uppercase">
                            {event.participants} PARTICIPANTS
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white border border-[#e5e5e5]">
                  <p className="font-mono text-sm tracking-widest text-[#111111]/40 uppercase">NO ARCHIVES MATCHED SEARCH</p>
                </div>
              )
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* EMBEDDED GOOGLE FORM MODAL */}
      <AnimatePresence>
        {embeddedFormUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            id="embedded-form-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white border-4 border-brand-charcoal shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-none w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
              id="embedded-form-modal"
            >
              {/* Header Bar */}
              <div className="bg-brand-charcoal text-white px-6 py-4 flex items-center justify-between border-b-2 border-brand-charcoal">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-pulse"></span>
                  <div>
                    <span className="font-mono text-[9px] font-black tracking-widest text-brand-red block uppercase">OFFICIAL RSVP RESERVATION PORTAL</span>
                    <h3 className="font-display font-black italic text-base sm:text-lg uppercase tracking-tight">THE FOOTBALL BAITHAK</h3>
                  </div>
                </div>
                <button
                  onClick={() => setEmbeddedFormUrl(null)}
                  className="font-display font-black italic text-xs sm:text-sm tracking-wider px-4 py-2 border border-white/20 hover:bg-brand-red hover:border-brand-red text-white uppercase transition-colors cursor-pointer"
                  id="close-embedded-form-btn"
                >
                  CLOSE PORTAL ×
                </button>
              </div>

              {/* Form iFrame Container */}
              <div className="flex-1 bg-[#f0ebf8] relative">
                {/* Subtle Loading indicator in case of slow connection */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
                  <div className="w-12 h-12 border-4 border-brand-charcoal border-t-brand-red rounded-full animate-spin mb-4"></div>
                  <span className="font-mono text-[10px] font-bold text-brand-charcoal/40 tracking-widest uppercase">LOADING RESERVATION PASSPORT...</span>
                </div>

                <iframe
                  src={embeddedFormUrl.endsWith('?embedded=true') ? embeddedFormUrl : `${embeddedFormUrl}?embedded=true`}
                  className="w-full h-full relative z-10 border-none"
                  title="RSVP Registration Pass"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

