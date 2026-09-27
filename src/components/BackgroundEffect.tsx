import React, { useRef, useEffect } from 'react';

export const BackgroundEffect: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure autoplay continues smoothly on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  return (
    <div id="background-container" className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0d0f12]">
      {/* Subtle base lighting matching the dark aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181a1f] via-[#0d0e12] to-[#08090a]" />

      {/* Primary Video Element playing colorflow-animation.mp4 natively */}
      <video
        id="background-video-player"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 transition-opacity duration-700"
        src="/colorflow-animation.mp4"
      >
        <source src="/colorflow-animation.mp4" type="video/mp4" />
      </video>

      {/* Gentle scrim overlay to ensure typography stays high contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(10,12,16,0.15) 0%, rgba(10,12,16,0.65) 100%)',
        }}
      />
    </div>
  );
};

