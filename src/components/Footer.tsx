import { ViewType } from '../types';

interface FooterProps {
  setActiveView: (view: ViewType) => void;
}

export default function Footer({ setActiveView }: FooterProps) {
  const socialLinks = [
    { label: 'INSTAGRAM', url: 'https://instagram.com/builders_playground' },
    { label: 'LINKEDIN', url: 'https://linkedin.com' },
    { label: 'DISCORD', url: 'https://discord.com' },
    { label: 'YOUTUBE', url: 'https://youtube.com' }
  ];

  return (
    <footer className="bg-[#f9f9f9] border-t border-brand-charcoal/10 py-12 px-4 sm:px-8 md:px-12 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Branding - Precise Typography */}
        <div className="text-center md:text-left">
          <button 
            onClick={() => setActiveView('home')}
            className="font-display font-black italic text-xl sm:text-2xl tracking-tighter text-brand-charcoal focus-visible:outline-none"
            id="footer-brand-btn"
          >
            BUILDERS PLAYGROUND
          </button>
          <p className="font-mono text-[10px] text-brand-charcoal/50 tracking-wider mt-1.5 uppercase">
            © {new Date().getFullYear()} BUILDERS PLAYGROUND. ALL RIGHTS RESERVED.
          </p>
        </div>

        {/* Center/Right Social Channels */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] sm:text-xs font-bold text-brand-charcoal/60 hover:text-brand-red tracking-widest transition-colors focus-visible:outline-none"
              id={`footer-social-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
