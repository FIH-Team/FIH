import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {geistSans, geistMono, geistPixel} from './lib/fonts';
import {BackgroundEffect} from './components/BackgroundEffect';
import {Navbar} from './components/Navbar';
import {Hero} from './components/Hero';
import {MacMenuBar} from './components/MacMenuBar';
import {FeatureTriage} from './components/FeatureTriage';
import {LogoCloud} from './components/LogoCloud';
import {Testimonials} from './components/Testimonials';
import {FinalCTA} from './components/FinalCTA';
import {FeelsMarketplace} from './components/FeelsMarketplace';
import {Bulletin} from './components/Bulletin';

export const App: React.FC = () => {
  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white selection:bg-brand/30 selection:text-white ${geistSans.variable} ${geistMono.variable} ${geistPixel.variable}`}>
      {/* Root SVG noise filter for the shiny headline */}
      <svg
        width="0"
        height="0"
        style={{position: 'absolute', width: 0, height: 0, pointerEvents: 'none'}}
        aria-hidden="true"
      >
        <defs>
          <filter id="c3-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
            />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Global background media effect */}
      <BackgroundEffect />

      {/* Hidden-on-mobile fixed vertical guide lines at the 36rem container edges */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Page Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <MacMenuBar />
                <FeatureTriage />
                <FeelsMarketplace />
                <LogoCloud />
                <Testimonials />
                <FinalCTA />
              </>
            } />
            <Route path="/bulletin" element={<Bulletin />} />
            <Route path="/dashboard" element={<Navigate to="/bulletin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
