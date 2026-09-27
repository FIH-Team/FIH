import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { LogoMark } from './Primitives';
import { AuthModal } from './AuthModal';

interface NavItem {
  name: string;
  id: string;
  isPage?: boolean;
}

const navLinks: NavItem[] = [
  { name: 'Dashboard', id: 'dashboard', isPage: true },
  { name: 'Connect', id: 'connect', isPage: false },
  { name: 'Feels', id: 'feels', isPage: false },
  { name: 'Profile', id: 'profile', isPage: false },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    const id = targetId.toLowerCase();

    if (id === 'dashboard') {
      navigate('/dashboard');
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return;
    }

    const targetElement = document.getElementById(id);
    if (!targetElement) {
      window.location.hash = id;
      return;
    }

    // Scroll directly to the actual visible content container
    const contentChild = (targetElement.querySelector('.grid') || targetElement) as HTMLElement;
    const offsetPosition = contentChild.getBoundingClientRect().top + window.pageYOffset - 28;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 480;
    let startTime: number | null = null;

    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutSine(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, offsetPosition);
        window.history.pushState(null, '', `#${id}`);
      }
    };

    requestAnimationFrame(step);
  };

  const isCurrentActive = (item: NavItem) => {
    if (item.id === 'dashboard') {
      return location.pathname === '/dashboard';
    }
    return false;
  };

  return (
    <header className="relative z-30 pt-6">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-6xl mx-auto px-6 flex items-center justify-between"
      >
        {/* Left: LogoMark */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="inline-flex items-center cursor-pointer"
          aria-label="Campus Karma Home"
        >
          <LogoMark className="w-8 h-8 text-white transition-opacity hover:opacity-80" />
        </button>

        {/* Center: Desktop links with snappy staggered spring animations */}
        <div
          id="nav-links-center"
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 p-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
        >
          {navLinks.map((item, i) => {
            const active = isCurrentActive(item);
            return (
              <motion.button
                key={item.name}
                type="button"
                onClick={(e) => scrollToSection(e, item.id)}
                initial={{ opacity: 0, y: -14, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 22,
                  delay: 0.08 + i * 0.06,
                }}
                whileHover={{
                  scale: 1.06,
                  y: -1,
                  transition: { type: 'spring', stiffness: 500, damping: 15 },
                }}
                whileTap={{
                  scale: 0.94,
                  transition: { type: 'spring', stiffness: 500, damping: 15 },
                }}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? 'text-white bg-white/15 shadow-sm font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {item.name}
              </motion.button>
            );
          })}
        </div>

        {/* Right desktop: Log In / Sign Up button */}
        <div className="hidden md:block">
          <button
            id="nav-download-cta"
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-xs px-5 py-2.5 transition-all hover:bg-white/90 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-black/70 group-hover:text-black transition-colors" />
            <span>Log In / Sign Up</span>
          </button>
        </div>

        {/* Mobile right: Menu icon button */}
        <div className="md:hidden">
          <button
            id="mobile-nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden max-w-6xl mx-auto px-6 mt-4"
          >
            <div className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col gap-3">
              {navLinks.map((item, i) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    scrollToSection(e, item.id);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-left text-white/80 hover:text-white text-sm font-medium py-1.5 transition-colors cursor-pointer"
                >
                  {item.name}
                </motion.button>
              ))}
              <div className="pt-3 border-t border-white/10">
                <button
                  id="mobile-drawer-download"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-xs px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer"
                >
                  <User className="w-4 h-4 text-black/70" />
                  <span>Log In / Sign Up</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;
