import { motion } from 'motion/react';
import { Shield, Sparkles, Zap, ChevronRight, Swords, Cpu } from 'lucide-react';
import { ViewType } from '../types';

interface AboutViewProps {
  setActiveView: (view: ViewType) => void;
}

export default function AboutView({ setActiveView }: AboutViewProps) {
  
  const handleJoinFaction = () => {
    setActiveView('login');
  };

  const tickerItems = [
    'EXCLUSIVE SCREENINGS',
    'FIFA WATCH PARTIES',
    'CONSOLE & COFFEE',
    'BOARD GAME NIGHTS',
    'COMMUNITY GATHERINGS',
    'LIFESTYLE SOCIALS'
  ];

  return (
    <section className="bg-[#f9f9f9] py-16 px-4 sm:px-8 md:px-12 overflow-hidden blueprint-grid">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-4 h-[2px] bg-brand-red"></span>
          <span className="font-mono text-xs font-bold text-brand-red tracking-widest uppercase">
            WHO WE ARE
          </span>
        </div>

        {/* Big Heading */}
        <h1 className="font-display font-black italic text-5xl sm:text-6xl md:text-8xl text-brand-charcoal uppercase leading-[0.9] tracking-tighter mb-12 select-none">
          THE ULTIMATE <span className="text-brand-red">SOCIAL PLAYGROUND</span>
        </h1>

        {/* Core Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          
          {/* Left Column: Mission Narrative and Statistics */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Impact Text Block with prominent Red Border */}
            <div className="border-l-4 border-brand-red pl-6 py-1">
              <p className="font-display font-bold text-lg sm:text-xl md:text-2xl text-brand-charcoal leading-snug uppercase tracking-wide">
                PLAYGROUND is a premium community hub for lifestyle enthusiasts, sports fans, and gamers alike. We combine incredible live screens with high-vibe social gatherings to create the ultimate destination to watch, play, and connect.
              </p>
            </div>

            {/* Standard narratives */}
            <div className="space-y-6 text-[#111111]/70 font-sans text-sm sm:text-base leading-relaxed uppercase tracking-wider">
              <p>
                Born from a passion for bringing people together, our platform serves as a nexus for sports enthusiasts, casual gamers, and socialites. We don't just put on screenings; we curate high-vibe experiences where everyone can kick back, share a slice of pizza, and share the excitement of live sports and interactive console gaming.
              </p>
              <p>
                Our philosophy is built on cozy atmospheres, top-quality visuals, and friendly competition. Whether you're here to cheer on your favorite football club or challenge a friend to a casual game of FIFA, you're in the right place.
              </p>
            </div>

            {/* Statistical Badges */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
              {/* Stat 1 */}
              <div className="bg-[#eeeeee] border border-brand-charcoal/10 p-6">
                <span className="font-display font-black italic text-4xl sm:text-5xl text-brand-red tracking-tighter block mb-1">
                  12K+
                </span>
                <span className="font-mono text-[10px] font-bold text-brand-charcoal/40 tracking-widest uppercase">
                  ACTIVE MEMBERS
                </span>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#eeeeee] border border-brand-charcoal/10 p-6">
                <span className="font-display font-black italic text-4xl sm:text-5xl text-brand-red tracking-tighter block mb-1">
                  450
                </span>
                <span className="font-mono text-[10px] font-bold text-brand-charcoal/40 tracking-widest uppercase">
                  GATHERINGS HOSTED
                </span>
              </div>
            </div>

            {/* CTA action button */}
            <div className="pt-4">
              <button
                onClick={handleJoinFaction}
                className="w-full sm:w-auto bg-brand-charcoal hover:bg-brand-red hover:text-white text-white font-display font-black italic text-lg tracking-wider px-8 py-4 uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 chamfer-clip-br"
                id="about-join-faction-btn"
              >
                JOIN THE PLAYGROUND <span className="text-sm">→</span>
              </button>
            </div>

          </div>

          {/* Right Column: Visual Bento Grid with high-fidelity representation */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* Arena Live stream visual card */}
            <div className="sm:col-span-8 bg-brand-charcoal border border-brand-charcoal/10 relative h-[280px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
                alt="Neon Shockwave Arena"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-102 group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-brand-red text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase tracking-widest select-none">
                LIVE WATCH PARTY
              </div>
              
              <div className="absolute bottom-4 left-4">
                <span className="font-display font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase">
                  CHAMPIONS LEAGUE SCREENING
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse mt-1 inline-block"></div>
              </div>
            </div>

            {/* Keyboard gear card */}
            <div className="sm:col-span-4 bg-white border border-[#e5e5e5] h-[280px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400"
                alt="Mechanical Keyboard"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Player details */}
            <div className="sm:col-span-5 bg-brand-charcoal h-[220px] overflow-hidden relative group">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400"
                alt="Operator Portrait"
                className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-102 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-brand-charcoal/80 px-2 py-1 border-l-2 border-brand-red">
                <span className="font-mono text-[9px] font-bold text-white tracking-widest block uppercase">MEMBER CARD ACTIVE</span>
              </div>
            </div>

            {/* Structured design block */}
            <div className="sm:col-span-3 bg-[#e5e5e5] h-[220px] flex flex-col justify-between p-6 select-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-charcoal/[0.03] rotate-45 border border-brand-charcoal/10 pointer-events-none"></div>
              <Cpu className="w-8 h-8 text-brand-charcoal/20" />
              <div className="font-mono text-[10px] text-brand-charcoal/50 font-bold uppercase tracking-widest leading-tight">
                COMMUNITY VIBE DESIGNED
              </div>
            </div>

            {/* Industrial Data wars panel */}
            <div className="sm:col-span-12 bg-brand-charcoal border border-brand-charcoal/10 relative h-[120px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                alt="Industrial Site"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#000000]/40"></div>
              
              <div className="absolute bottom-4 left-4">
                <span className="font-display font-black italic text-lg sm:text-xl text-brand-red tracking-widest uppercase">
                  PREMIUM LOUNGE NIGHTS
                </span>
                <span className="font-mono text-[9px] text-white/50 tracking-widest uppercase block mt-0.5">
                  COZY SOCIAL GET-TOGETHERS WEEKLY
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Industrial Slide Marquee Marquee Bar (Exact layout match of Screenshot 6) */}
      <div className="w-full bg-brand-red text-white py-5 transform -skew-y-1 relative z-20 border-y-2 border-brand-charcoal select-none">
        <div className="overflow-hidden whitespace-nowrap flex">
          <div className="animate-marquee flex gap-12 font-display font-black italic text-2xl tracking-wider uppercase">
            {tickerItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="w-3 h-3 bg-brand-charcoal inline-block rotate-45"></span>
              </span>
            ))}
            {/* Repeat items for seamless sliding */}
            {tickerItems.map((item, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="w-3 h-3 bg-brand-charcoal inline-block rotate-45"></span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
