import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtSign, Lock, ShieldCheck, Terminal, AlertCircle, Sparkles, Phone } from 'lucide-react';
import { UserSession } from '../types';
import { supabase } from '../lib/supabaseClient';

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

interface LoginViewProps {
  onLoginSuccess: (session: UserSession) => void;
  redirectMessage?: string;
  onClearRedirectMessage?: () => void;
}

export default function LoginView({ onLoginSuccess, redirectMessage, onClearRedirectMessage }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [logoError, setLogoError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [authError, setAuthError] = useState('');

  const handleInitialize = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!email || email.trim() === '') {
      setAuthError('Email address is required.');
      return;
    }

    if (isRegister) {
      if (!phoneNumber || phoneNumber.trim() === '') {
        setAuthError('Mobile phone number is required.');
        return;
      }
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setAuthError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    if (!password || password.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setLogMessages(['Verifying connection...']);

    try {
      if (isRegister) {
        // --- SIGN UP ---
        setLogMessages((prev) => [...prev, 'Registering auth account...']);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('No user data returned from registration.');

        setLogMessages((prev) => [...prev, 'Creating Gen-Z persona profile...']);
        const username = generateGenzUsername();
        const role = 'ELITE_BUILDER';

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            username: username,
            phone_number: phoneNumber.replace(/\D/g, ''),
            role: role
          });

        if (profileError) {
          console.warn('Failed to insert profile record:', profileError);
          // Non-blocking warning: we proceed to log in anyway
        }

        setLogMessages((prev) => [...prev, 'Finalizing session login...']);
        
        setTimeout(() => {
          setIsLoading(false);
          if (onClearRedirectMessage) onClearRedirectMessage();
          onLoginSuccess({
            isLoggedIn: true,
            personnelId: username,
            email: email,
            role: role,
            phoneNumber: phoneNumber.replace(/\D/g, '')
          });
        }, 800);

      } else {
        // --- SIGN IN ---
        setLogMessages((prev) => [...prev, 'Checking credentials...']);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        if (!signInData.user) throw new Error('No user session active.');

        setLogMessages((prev) => [...prev, 'Syncing profile telemetry...']);
        
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, role, phone_number')
          .eq('id', signInData.user.id)
          .single();

        let username = email.split('@')[0];
        let role = 'OPERATOR_SECTOR_7'; // Default fallback role

        if (profileData) {
          username = profileData.username;
          role = profileData.role;
        }

        setLogMessages((prev) => [...prev, 'Finalizing session login...']);

        setTimeout(() => {
          setIsLoading(false);
          if (onClearRedirectMessage) onClearRedirectMessage();
          onLoginSuccess({
            isLoggedIn: true,
            personnelId: username,
            email: email,
            role: role,
            phoneNumber: profileData?.phone_number || ''
          });
        }, 800);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication Protocol Rejected.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLogMessages(['Connecting to Google Account...']);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Google Auth Connection Failed.');
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#f3f3f4] py-16 px-4 sm:px-8 min-h-screen flex flex-col justify-center items-center blueprint-grid select-none">
      
      {/* Brand logo stack centered on top */}
      <div className="flex flex-col items-center mb-8 text-center">
        {!logoError ? (
          <img 
            src="/logo.jpeg" 
            alt="Builders Playground" 
            className="h-14 w-auto object-contain mb-2"
            onError={() => setLogoError(true)}
          />
        ) : (
          <>
            <div className="flex items-center gap-1.5 justify-center">
              <span className="font-display font-black italic text-4xl tracking-tighter text-brand-red leading-none">BP</span>
              <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center p-[2.5px] shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red"></div>
                </div>
              </div>
            </div>
            <span className="font-display text-xs font-bold tracking-widest text-brand-charcoal mt-1.5 uppercase leading-none">builders playground</span>
            <span className="font-mono text-[7px] text-brand-charcoal/40 tracking-[0.25em] mt-1 uppercase leading-none">BUILD . CONNECT . GROW</span>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="login-loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md bg-white border border-brand-charcoal p-8 font-mono text-xs shadow-lg space-y-4"
          >
            <div className="flex items-center justify-between border-b border-brand-charcoal/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-red animate-pulse" />
                <span className="font-bold text-brand-charcoal">ESTABLISHING CONNECTION...</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping"></span>
            </div>
            
            <div className="bg-[#f9f9f9] border border-brand-charcoal/5 p-4 rounded-none min-h-[160px] flex flex-col justify-end gap-1.5">
              {logMessages.map((msg, i) => (
                <div key={i} className="text-[10px] text-brand-charcoal/60 flex items-start gap-1">
                  <span className="text-brand-red font-bold">▶</span>
                  <span className="tracking-wider uppercase">{msg}</span>
                </div>
              ))}
              <div className="w-4 h-1 bg-brand-red animate-pulse mt-1"></div>
            </div>

            <div className="h-1 bg-brand-charcoal/5 w-full rounded-none overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-brand-red"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={isRegister ? 'register-card' : 'login-card'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white border border-[#e5e5e5] p-8 sm:p-10 shadow-lg text-center relative"
          >
            
            {/* Redirect Header message from Events or else */}
            {redirectMessage && (
              <div className="mb-6 p-4.5 bg-brand-red/5 border-l-4 border-brand-red text-left flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div className="font-mono text-[10px] font-bold text-brand-red uppercase tracking-wide leading-relaxed">
                  {redirectMessage}
                </div>
              </div>
            )}

            <h2 className="font-display font-black italic text-3xl sm:text-4xl text-brand-charcoal uppercase leading-[1.1] tracking-tighter mb-1 select-none">
              {isRegister ? 'SIGN UP' : 'LOG IN'}
            </h2>
            <p className="font-mono text-[11px] font-bold text-brand-charcoal/40 tracking-widest uppercase mb-8 select-none">
              {isRegister ? 'Create a new account' : 'Access your account'}
            </p>

            <form onSubmit={handleInitialize} className="space-y-6 text-left">
              
              {/* Email Address */}
              <div>
                <label className="font-mono text-[10px] font-bold text-brand-red tracking-widest uppercase block mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="flex items-center border-b border-brand-charcoal/10 py-2 focus-within:border-brand-red transition-colors">
                  <AtSign className="w-4 h-4 text-brand-charcoal/30 mr-3" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-brand-charcoal placeholder-brand-charcoal/20 font-display font-bold italic tracking-wider text-base uppercase focus:outline-none"
                    id="login-email-input"
                  />
                </div>
              </div>

              {/* Phone Number (For Sign Up only) */}
              {isRegister && (
                <div>
                  <label className="font-mono text-[10px] font-bold text-brand-red tracking-widest uppercase block mb-1">
                    MOBILE PHONE NUMBER
                  </label>
                  <div className="flex items-center border-b border-brand-charcoal/10 py-2 focus-within:border-brand-red transition-colors">
                    <Phone className="w-4 h-4 text-brand-charcoal/30 mr-3" />
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent text-brand-charcoal placeholder-brand-charcoal/20 font-display font-bold italic tracking-wider text-base uppercase focus:outline-none"
                      id="login-phone-input"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-mono text-[10px] font-bold text-brand-red tracking-widest uppercase">
                    PASSWORD
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset instructions have been sent to your email.')}
                      className="font-mono text-[9px] font-bold text-brand-charcoal/40 hover:text-brand-red italic uppercase tracking-wider"
                      id="login-recover-btn"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="flex items-center border-b border-brand-charcoal/10 py-2 focus-within:border-brand-red transition-colors">
                  <Lock className="w-4 h-4 text-brand-charcoal/30 mr-3" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-brand-charcoal placeholder-brand-charcoal/20 font-display font-bold italic tracking-wider text-base uppercase focus:outline-none"
                    id="login-password-input"
                  />
                </div>
              </div>

              {authError && (
                <p className="font-mono text-[10px] font-bold text-brand-red uppercase tracking-wider">
                  ⚠️ {authError}
                </p>
              )}

              {/* Action Button */}
              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-display font-black italic text-lg sm:text-xl tracking-wider py-3.5 shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase chamfer-clip-br"
                id="login-initialize-btn"
              >
                {isRegister ? 'SIGN UP' : 'LOG IN'} <span className="text-sm">⚡</span>
              </button>

            </form>

            {/* Google Sync */}
            <div className="my-6 flex items-center justify-between select-none">
              <span className="h-[1px] bg-brand-charcoal/10 flex-1"></span>
              <span className="font-mono text-[9px] font-bold text-brand-charcoal/30 tracking-widest uppercase px-4">
                OR
              </span>
              <span className="h-[1px] bg-brand-charcoal/10 flex-1"></span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-mono text-[11px] font-bold tracking-widest py-3 border border-brand-charcoal hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase"
              id="login-google-btn"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.564-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.564-4.437 10.564-10.715 0-.726-.075-1.285-.175-1.714H12.24z" />
              </svg>
              Continue with Google
            </button>

            {/* Bottom Toggle links */}
            <div className="mt-8 border-t border-brand-charcoal/10 pt-5">
              <p className="font-mono text-xs text-brand-charcoal/50 uppercase select-none">
                {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setAuthError('');
                  }}
                  className="font-mono text-xs font-bold text-brand-red hover:underline focus:outline-none ml-1 cursor-pointer uppercase"
                  id="login-toggle-mode-btn"
                >
                  {isRegister ? 'LOG IN' : 'SIGN UP'}
                </button>
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
