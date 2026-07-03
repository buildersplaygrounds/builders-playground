import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { ContactSubmission } from '../types';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ContactSubmission['type']>('partnership');

  const [isSending, setIsSending] = useState(false);
  const [sendStep, setSendStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChipClick = (selectedType: ContactSubmission['type']) => {
    setType(selectedType);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || name.trim() === '') {
      setErrorMsg('PLEASE PROVIDE YOUR NAME.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMsg('A VALID EMAIL IS REQUIRED.');
      return;
    }

    if (!message || message.trim() === '') {
      setErrorMsg('PLEASE ENTER A MESSAGE.');
      return;
    }

    // Start sending simulation
    setIsSending(true);
    setSendStep(1);

    setTimeout(() => {
      setSendStep(2);
    }, 1000);

    setTimeout(() => {
      setSendStep(3);
    }, 2000);

    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      // Reset
      setName('');
      setEmail('');
      setMessage('');
    }, 3200);
  };

  return (
    <section className="bg-[#f9f9f9] min-h-screen py-16 px-4 sm:px-8 md:px-12 flex items-center justify-center">
      <div className="max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-12 border border-brand-charcoal/10 shadow-md bg-white">
        
        {/* Left Column: Communications Information (Cream background) */}
        <div className="lg:col-span-5 bg-brand-cream/60 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-brand-charcoal/10 relative">
          
          <div className="space-y-6">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-red uppercase select-none block">
              CONNECT WITH US
            </span>

            <h1 className="font-display font-black italic text-4xl sm:text-5xl md:text-6xl text-brand-charcoal uppercase leading-[0.9] tracking-tighter">
              GET IN TOUCH
            </h1>

            <p className="font-sans text-brand-charcoal/70 text-sm sm:text-base leading-relaxed uppercase tracking-wider">
              Have questions about an upcoming FIFA watch party? Want to host your own cozy get-together or suggest a lifestyle gathering? Drop us a line. We'd love to hear from you.
            </p>

            {/* Connection coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              
              {/* HQ details */}
              <div className="bg-white/40 border border-brand-charcoal/5 p-5">
                <div className="flex items-center gap-2 mb-2 text-brand-red select-none">
                  <MapPin className="w-4 h-4" />
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">CLUBHOUSE</span>
                </div>
                <p className="font-mono text-xs text-brand-charcoal font-bold leading-relaxed uppercase">
                  PLAYGROUND LOUNGE<br />
                  78 COZY BOULEVARD,<br />
                  SAN FRANCISCO
                </p>
              </div>

              {/* Contact channels */}
              <div className="bg-white/40 border border-brand-charcoal/5 p-5">
                <div className="flex items-center gap-2 mb-2 text-brand-red select-none">
                  <Mail className="w-4 h-4" />
                  <span className="font-mono text-[10px] font-bold tracking-widest uppercase">DIRECT EMAIL</span>
                </div>
                <p className="font-mono text-xs text-brand-charcoal font-bold leading-relaxed lowercase truncate">
                  HELLO@PLAYGROUNDCLUB.CC<br />
                  <span className="text-brand-charcoal/60 lowercase">+1 415-555-0199</span>
                </p>
              </div>

            </div>
          </div>

          {/* Cozy lounge graphic */}
          <div className="mt-8 border border-brand-charcoal/10 relative h-48 overflow-hidden bg-brand-charcoal">
            <img
              src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600"
              alt="Cozy club lounge"
              className="w-full h-full object-cover grayscale opacity-40 blur-[1px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            {/* Pulsing visual tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
              </span>
              <span className="font-mono text-[9px] font-bold text-white tracking-[0.2em] uppercase">
                DOORS OPEN • WELCOMING YOU
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-7 bg-[#f3f3f4] p-8 sm:p-12 flex flex-col justify-between relative">
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col justify-center items-center text-center py-12"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-display font-black italic text-3xl text-brand-charcoal uppercase tracking-tighter mb-2">
                  MESSAGE RECEIVED
                </h3>
                <p className="font-mono text-xs font-bold text-emerald-600 tracking-widest uppercase mb-6">
                  WE WILL GET BACK TO YOU SOON
                </p>
                <div className="bg-white/80 border border-brand-charcoal/10 p-6 max-w-sm text-left font-mono text-xs space-y-2 mb-8 select-none">
                  <p className="text-brand-charcoal/40">RESPONSE GUARANTEE:</p>
                  <p className="font-bold text-brand-charcoal">We review all suggestions and partnership invites within 24 hours.</p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="font-mono text-[11px] font-bold text-brand-charcoal hover:text-brand-red uppercase border-b-2 border-brand-charcoal hover:border-brand-red pb-0.5 transition-colors focus-visible:outline-none"
                  id="contact-new-transmission-btn"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : isSending ? (
              <motion.div
                key="contact-sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col justify-center items-center py-12 font-mono text-center"
              >
                <Sparkles className="w-12 h-12 text-brand-red animate-pulse mb-6" />
                
                {/* Simulated sending states */}
                <div className="space-y-3 max-w-sm w-full">
                  <div className="h-2 bg-brand-charcoal/5 rounded-none overflow-hidden relative">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-brand-red"
                      initial={{ width: '0%' }}
                      animate={{ width: sendStep === 1 ? '35%' : sendStep === 2 ? '75%' : '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  <p className="text-xs font-bold text-brand-red tracking-widest uppercase animate-pulse mt-4">
                    {sendStep === 1 && 'CONNECTING TO PLAYGROUND INBOX...'}
                    {sendStep === 2 && 'DELIVERING YOUR MESSAGE...'}
                    {sendStep === 3 && 'FINALIZING COMMS CONNECTION...'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  
                  {/* Name field */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-charcoal/50 tracking-widest uppercase block mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JOHN DOE"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white text-brand-charcoal placeholder-brand-charcoal/30 font-display font-bold italic text-lg tracking-wider uppercase py-4 px-5 border border-brand-charcoal/10 focus:border-brand-red focus:outline-none transition-colors"
                      id="contact-name-input"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-charcoal/50 tracking-widest uppercase block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. YOU@DOMAIN.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-brand-charcoal placeholder-brand-charcoal/30 font-display font-bold italic text-lg tracking-wider uppercase py-4 px-5 border border-brand-charcoal/10 focus:border-brand-red focus:outline-none transition-colors"
                      id="contact-email-input"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-charcoal/50 tracking-widest uppercase block mb-2">
                      YOUR MESSAGE
                    </label>
                    <textarea
                      placeholder="TELL US WHAT'S ON YOUR MIND..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-white text-brand-charcoal placeholder-brand-charcoal/30 font-display font-bold italic text-lg tracking-wider uppercase py-4 px-5 border border-brand-charcoal/10 focus:border-brand-red focus:outline-none transition-colors resize-none"
                      id="contact-message-input"
                    />
                  </div>

                  {/* Inquiry Type chips */}
                  <div>
                    <label className="font-mono text-[10px] font-bold text-brand-charcoal/50 tracking-widest uppercase block mb-3 select-none">
                      INQUIRY TYPE
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {(['partnership', 'events', 'support', 'feedback'] as const).map((chipType) => {
                        const isActive = type === chipType;
                        return (
                          <button
                            key={chipType}
                            type="button"
                            onClick={() => handleChipClick(chipType)}
                            className={`font-mono text-[10px] font-bold tracking-widest uppercase py-3 px-5 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-brand-charcoal text-white border border-brand-charcoal'
                                : 'bg-white hover:bg-brand-charcoal/5 text-brand-charcoal border border-brand-charcoal/10'
                            }`}
                            id={`contact-chip-${chipType}`}
                          >
                            {chipType}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Submit button and privacy statement */}
                <div className="border-t border-brand-charcoal/10 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Privacy indicator */}
                  <div className="flex items-center gap-3 text-brand-charcoal/50 select-none">
                    <Lock className="w-5 h-5 text-brand-red" />
                    <span className="font-mono text-[9px] font-bold tracking-widest leading-snug uppercase max-w-xs">
                      YOUR INFORMATION IS SECURE. WE WILL NEVER SHARE YOUR EMAIL ADDRESS.
                    </span>
                  </div>

                  <div className="w-full sm:w-auto text-right">
                    {errorMsg && (
                      <p className="font-mono text-[10px] font-bold text-brand-red uppercase mb-3 text-left sm:text-right">
                        ⚠️ {errorMsg}
                      </p>
                    )}
                    
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-brand-red hover:bg-brand-red-dark text-white font-display font-black italic text-2xl tracking-wider px-10 py-4 shadow-lg hover:shadow-brand-red/10 cursor-pointer transition-colors uppercase chamfer-clip-br"
                      id="contact-submit-btn"
                    >
                      SEND MESSAGE
                    </button>
                  </div>

                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
