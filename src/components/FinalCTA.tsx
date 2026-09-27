import React from 'react';
import { FeelsMarketplace } from './FeelsMarketplace';
import { LogoMark } from './Primitives';

export const FinalCTA: React.FC = () => {
  return (
    <section id="profile" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32 scroll-mt-20">
      <FeelsMarketplace />

      {/* Minimal Footer */}
      <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <div className="flex items-center gap-3">
          <LogoMark className="w-5 h-5 text-white/60" />
          <span>© {new Date().getFullYear()} Campus Karma Systems Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-white/50">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#status" className="hover:text-white transition-colors">Status</a>
        </div>
      </footer>
    </section>
  );
};
