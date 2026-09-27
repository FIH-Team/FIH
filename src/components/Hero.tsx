import React from 'react';
import { motion } from 'motion/react';
import { AppleButton, gradientStyle } from './Primitives';

export const Hero: React.FC = () => {
  const handleExplore = () => {
    const targetElement = document.getElementById('connect');
    if (!targetElement) return;

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
        window.history.pushState(null, '', '#connect');
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <section
      id="dashboard"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-12 pb-24 mb-16"
      style={{ minHeight: 'calc(100vh + 60px)' }}
    >
      {/* Motion H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-7xl lg:text-8xl font-bold md:font-extrabold tracking-[-0.035em] leading-[0.95] flex flex-col items-center justify-center text-center"
      >
        <span
          id="hero-title-main"
          className="text-white font-geist-pixel font-bold md:font-extrabold tracking-[-0.035em] text-center"
          style={{
            fontFamily: 'var(--font-geist-pixel), "Geist Pixel", monospace, sans-serif',
            fontWeight: 700,
          }}
        >
          Your Campus
        </span>
        <span
          id="hero-gradient-text"
          className="animate-shiny mt-2 font-geist-pixel font-medium text-center"
          style={{
            ...gradientStyle,
            fontFamily: 'var(--font-geist-pixel), "Geist Pixel", monospace, sans-serif'
          }}
        >
          Dashboard
        </span>
      </motion.h1>

      {/* Motion paragraph */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        id="hero-subtitle"
        className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
      >
        Connect with piers without Private information. Space for all the institutional conversational needs. In house market place for early experiance.
      </motion.p>

      {/* Motion div with AppleButton and platform label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <AppleButton
          id="hero-download-btn"
          label="Explore"
          showAppleLogo={false}
          onClick={handleExplore}
        />
        <span className="text-xs text-white/40 tracking-tight">
          Explore campus features & insights
        </span>
      </motion.div>
    </section>
  );
};
