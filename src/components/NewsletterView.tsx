import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, Calendar, Gift, MessageSquare, Ticket, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function NewsletterView() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [operatorId, setOperatorId] = useState('');

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('EMAIL ADDRESS REQUIRED.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('INVALID EMAIL FREQUENCY PROTOCOL.');
      return;
    }

    const randId = `BP-BROADCAST-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({
          email: email.trim().toLowerCase(),
          operator_id: randId
        });

      if (error) {
        if (error.code === '23505') {
          setErrorMessage('EMAIL ADDRESS ALREADY SUBSCRIBED TO BROADCAST.');
          return;
        }
        throw error;
      }

      setOperatorId(randId);
      setIsSubscribed(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'DATABASE TRANSACTION FAILED.');
    }
  };

  const benefits = [
    {
      num: '01. GATHERINGS',
      title: 'PRIORITY RSVP',
      desc: 'Reserve your couch or seat for high-profile FIFA screenings and watch parties 48 hours before public release.',
      icon: Calendar
    },
    {
      num: '02. PERKS',
      title: 'MEMBER SWAG',
      desc: 'Automatic entry into custom merchandise, limited-edition jerseys, and dining voucher giveaways.',
      icon: Gift
    },
    {
      num: '03. COMMUNITY',
      title: 'EXCLUSIVE CHAT',
      desc: 'Access our private lounge community server to organize casual local matchups and banter.',
      icon: MessageSquare
    }
  ];

  return (
    <section className="bg-[#f9f9f9] py-20 px-4 sm:px-8 md:px-12 min-h-screen flex items-center justify-center blueprint-grid">
      <div className="max-w-4xl w-full text-center">
        
        <AnimatePresence mode="wait">
          {!isSubscribed ? (
            <motion.div
              key="subscribe-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Priority Access Badge */}
              <div className="inline-block bg-brand-red text-white font-mono text-xs font-bold px-3 py-1 uppercase tracking-widest mb-6">
                PRIORITY ACCESS
              </div>

              {/* Title Section */}
              <h1 className="font-display font-black italic text-5xl sm:text-6xl md:text-8xl text-brand-charcoal uppercase leading-[0.9] tracking-tighter mb-4 select-none">
                THE PLAYGROUND FEED
              </h1>
              
              <p className="max-w-xl mx-auto font-display font-bold text-sm sm:text-base md:text-lg text-brand-charcoal/60 tracking-widest uppercase leading-normal mb-10 select-none">
                EXCLUSIVE INVITATIONS. LIVE SCREENING ALERTS. COZY MEMBER DROPS. DIRECT TO YOUR INBOX.
              </p>

              {/* Newsletter Submission Form */}
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ENTER YOUR EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-brand-charcoal font-mono text-xs font-bold tracking-widest text-center uppercase py-4 px-6 border border-brand-charcoal/20 focus:border-brand-red focus:outline-none transition-colors"
                      id="newsletter-email-input"
                    />
                    <Mail className="w-4 h-4 text-brand-charcoal/30 absolute left-4 top-1/2 -translate-y-1/2 hidden sm:block" />
                  </div>
                  
                  {errorMessage && (
                    <p className="font-mono text-[11px] font-bold text-brand-red text-left tracking-wider uppercase">
                      ⚠️ {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-display font-black italic text-lg sm:text-xl tracking-wider py-4 shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer chamfer-clip-br"
                    id="newsletter-submit-btn"
                  >
                    SUBSCRIBE TO INVITATIONS <span className="text-sm">⚡</span>
                  </button>
                </div>
              </form>

              {/* Operatives Counter Stats */}
              <div className="flex items-center justify-center gap-6 font-mono text-[10px] sm:text-xs font-bold text-brand-charcoal/50 uppercase tracking-widest select-none mb-16">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 bg-brand-red"></span>
                  <span>2.4K ACTIVE MEMBERS</span>
                </div>
                <span className="text-brand-charcoal/20">|</span>
                <span>WEEKLY MEETUPS</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="subscribe-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto bg-white border border-brand-charcoal p-8 sm:p-12 mb-16 shadow-lg text-center relative"
            >
              {/* Visual Ticket Accent */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#f9f9f9] border-r border-brand-charcoal -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#f9f9f9] border-l border-brand-charcoal -translate-y-1/2"></div>

              <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="font-display font-black italic text-4xl text-brand-charcoal uppercase tracking-tighter mb-2">
                INVITATION ACTIVATED
              </h2>
              <p className="font-mono text-xs font-bold text-emerald-600 tracking-widest uppercase mb-8">
                MEMBER PROFILE SYNCED SECURELY
              </p>

              {/* Generated VIP Pass Ticket */}
              <div className="bg-[#f9f9f9] border-2 border-dashed border-brand-charcoal/20 p-6 text-left font-mono">
                <div className="flex justify-between items-start border-b border-brand-charcoal/10 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] text-brand-charcoal/40 font-bold block">MEMBERSHIP CARD</span>
                    <span className="text-xs font-bold text-brand-charcoal">PLAYGROUND MEMBER ID</span>
                  </div>
                  <Ticket className="w-5 h-5 text-brand-red" />
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-charcoal/40">EMAIL:</span>
                    <span className="font-bold text-brand-charcoal">{email.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-charcoal/40">PASSPORT ID:</span>
                    <span className="font-bold text-brand-red tracking-wider">{operatorId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-charcoal/40">TIER LEVEL:</span>
                    <span className="font-bold text-brand-charcoal">LIFELONG_MEMBER</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSubscribed(false);
                  setEmail('');
                }}
                className="mt-8 font-mono text-[11px] font-bold text-brand-charcoal hover:text-brand-red tracking-widest uppercase border-b-2 border-brand-charcoal hover:border-brand-red pb-1 transition-colors focus-visible:outline-none"
                id="reset-newsletter-btn"
              >
                SUBSCRIBE ANOTHER CHANNEL
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefit Card Grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.num}
                className="bg-white border border-[#e5e5e5] hover:border-brand-charcoal p-8 transition-colors flex flex-col justify-between"
                id={`benefit-card-${index}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xs font-bold text-brand-charcoal/40 tracking-wider">
                      {benefit.num}
                    </span>
                    <Icon className="w-5 h-5 text-brand-red/40" />
                  </div>
                  <h3 className="font-display font-black italic text-2xl tracking-tight text-brand-charcoal uppercase mb-3">
                    {benefit.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-brand-charcoal/60 leading-relaxed uppercase tracking-wide">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
