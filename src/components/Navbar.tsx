import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { LogoMark } from './Primitives';
import { AuthModal } from './AuthModal';

const navLinks = ['Dashboard', 'Connect', 'Feels', 'profile'];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    const id = link.toLowerCase();

    // If Dashboard link is clicked, open the Bulletin / Dashboard page
    if (id === 'dashboard') {
      if (location.pathname === '/bulletin' || location.pathname === '/dashboard') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/bulletin');
      }
      return;
    }

    // For landing page sections (Connect, Feels, Profile)
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    scrollToSection(id);
  };

  const scrollToSection = (targetId: string) => {
    const id = targetId.toLowerCase();
    const targetElement = document.getElementById(id);
    if (!targetElement) {
      window.location.hash = id;
      return;
    }

    // Scroll directly to the actual visible content container
    const contentChild = (targetElement.querySelector('.grid') || targetElement) as HTMLElement;
    const offsetPosition =
      id === 'dashboard'
        ? 0
        : contentChild.getBoundingClientRect().top + window.pageYOffset - 28;

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 480; // Immediate response without lag
    let startTime: number | null = null;

    // Ease-in-out sine curve: starts immediately with no initial delay and glides smoothly to rest
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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <header className="relative z-30 pt-6">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-6xl mx-auto px-6 flex items-center justify-between"
      >
        {/* Left: LogoMark linking to Home */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="inline-flex items-center"
          aria-label="Campus Karma Home"
        >
          <LogoMark className="w-8 h-8 text-white transition-opacity hover:opacity-80" />
        </a>

        {/* Center: Desktop links with staggered animation */}
        <div id="nav-links-center" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link, i) => {
            const isDashboard = link.toLowerCase() === 'dashboard';
            const isBulletinPage = location.pathname === '/bulletin' || location.pathname === '/dashboard';
            const isActive = isDashboard && isBulletinPage;

            return (
              <motion.a
                key={link}
                href={isDashboard ? '/bulletin' : `#${link.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, link)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                className={`text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link}
              </motion.a>
            );
          })}
        </div>

        {/* Right desktop: Log In / Sign Up button */}
        <div className="hidden md:block">
          <button
            id="nav-download-cta"
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-2.5 transition-all hover:bg-white/90 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4 text-black/70 group-hover:text-black transition-colors" />
            <span>Log In / Sign Up</span>
          </button>
        </div>

        {/* Mobile right: Menu icon button */}
        <div className="md:hidden">
          <button
            id="mobile-nav-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-colors"
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
            <div className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
              {navLinks.map((link) => {
                const isDashboard = link.toLowerCase() === 'dashboard';
                const isBulletinPage = location.pathname === '/bulletin' || location.pathname === '/dashboard';
                const isActive = isDashboard && isBulletinPage;

                return (
                  <a
                    key={link}
                    href={isDashboard ? '/bulletin' : `#${link.toLowerCase()}`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleNavClick(e, link);
                    }}
                    className={`text-base font-medium py-1 transition-colors cursor-pointer ${
                      isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link}
                  </a>
                );
              })}
              <div className="pt-3 border-t border-white/10">
                <button
                  id="mobile-drawer-download"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer"
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
