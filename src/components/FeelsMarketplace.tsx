import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  MessageCircle,
  Heart,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  Check,
  Smartphone,
  Minimize2,
  Send,
  X,
  ArrowRight,
  Flame,
  Wifi,
} from 'lucide-react';

export interface FeelItem {
  id: string;
  author: string;
  societySubtitle: string;
  avatarText: string;
  avatarBg: string;
  badge: string;
  title: string;
  description: string;
  hashtags: string[];
  karmaPoints: number;
  stipend: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
}

export const FEELS_DATA: FeelItem[] = [
  {
    id: 'feel-1',
    author: 'Design Guild',
    societySubtitle: 'Official Student Society',
    avatarText: 'DG',
    avatarBg: 'bg-[#181a20] text-white',
    badge: 'FIRST COME',
    title: 'Graphic Designer: Vector Streetwear Merch & Posters',
    description:
      'Designing custom oversized hoodies and holographic entry wristbands for our national techno-cultural fest. Vector illustrations and print-ready CMYK files required.',
    hashtags: ['#Adobe Illustrator', '#Photoshop', '#Typography', '#Merch Prep'],
    karmaPoints: 1200,
    stipend: '₹2,800 Stipend',
    likes: 142,
    commentsCount: 18,
    timeAgo: '2h ago',
  },
  {
    id: 'feel-2',
    author: 'Robotics Lab',
    societySubtitle: 'Autonomous Systems Guild',
    avatarText: 'RL',
    avatarBg: 'bg-[#181a20] text-white',
    badge: 'URGENT',
    title: 'ROS2 & LiDAR SLAM Pipeline Developer',
    description:
      'Refining real-time PointCloud registration and 2D occupancy grid mapping on our Jetson Orin Nano AGV for the upcoming Autonomous Rover Challenge.',
    hashtags: ['#ROS2', '#C++', '#LiDAR', '#SLAM'],
    karmaPoints: 2500,
    stipend: '₹6,500 Stipend',
    likes: 98,
    commentsCount: 12,
    timeAgo: '4h ago',
  },
  {
    id: 'feel-3',
    author: 'E-Cell Incubator',
    societySubtitle: 'Campus Startup Guild',
    avatarText: 'EC',
    avatarBg: 'bg-[#181a20] text-white',
    badge: 'HOT PICK',
    title: 'Frontend Engineer: Zero-Knowledge Event Ticketing',
    description:
      'Ship a fast Web3/Next.js dynamic QR check-in terminal with offline local SQLite caching for 4,000+ attendee collegiate summits.',
    hashtags: ['#Next.js', '#TypeScript', '#TailwindCSS', '#PWA'],
    karmaPoints: 1800,
    stipend: '₹4,200 Stipend',
    likes: 215,
    commentsCount: 29,
    timeAgo: '6h ago',
  },
  {
    id: 'feel-4',
    author: 'Editorial Board',
    societySubtitle: 'Campus Publications',
    avatarText: 'EB',
    avatarBg: 'bg-[#181a20] text-white',
    badge: 'FEATURED',
    title: 'Chronicles Lead Investigative Copywriter',
    description:
      'Author 3 deep-dive interview profiles featuring alumni YC founders and faculty researchers for the semesterly print magazine and digital publication.',
    hashtags: ['#Editorial', '#Copywriting', '#Journalism', '#Publishing'],
    karmaPoints: 950,
    stipend: '₹2,000 Stipend',
    likes: 76,
    commentsCount: 8,
    timeAgo: '1d ago',
  },
  {
    id: 'feel-5',
    author: 'Kavyanjali Council',
    societySubtitle: 'Performing Arts & Stage',
    avatarText: 'KC',
    avatarBg: 'bg-[#181a20] text-white',
    badge: 'LIMITED SLOTS',
    title: 'Stage Lighting & DMX Controller Engineer',
    description:
      'Program automated moving-head fixtures and synchronized cue sequences via QLC+ / grandMA onPC for annual auditorium concert night.',
    hashtags: ['#StageLighting', '#DMX512', '#SoundEng', '#LiveProduction'],
    karmaPoints: 1400,
    stipend: '₹3,500 Stipend',
    likes: 164,
    commentsCount: 14,
    timeAgo: '1d ago',
  },
];

export const FeelsMarketplace: React.FC = () => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'next' | 'prev'>('next');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [claimedMap, setClaimedMap] = useState<Record<string, boolean>>({});
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const isWheelLockedRef = React.useRef<boolean>(false);
  const touchStartYRef = React.useRef<number | null>(null);

  const scrollPositionRef = React.useRef<number>(0);

  const openPhoneMode = () => {
    scrollPositionRef.current = window.scrollY;
    setIsPhoneMode(true);
  };

  const closePhoneMode = () => {
    setIsPhoneMode(false);
    if (window.location.hash === '#feels') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Ensure clean state on mount: never auto-open phone mode on restart/reload
  useEffect(() => {
    if (window.location.hash === '#feels') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Scroll-lock body when phone mode is active (useLayoutEffect prevents paint flash)
  useLayoutEffect(() => {
    if (isPhoneMode) {
      const scrollY = scrollPositionRef.current;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollPositionRef.current);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isPhoneMode]);

  // Keyboard navigation for reels (Up/Down arrows & Escape to exit)
  useEffect(() => {
    if (!isPhoneMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePhoneMode();
        return;
      }
      if (chatOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setScrollDirection('next');
        setCurrentIndex((prev) => (prev + 1) % FEELS_DATA.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setScrollDirection('prev');
        setCurrentIndex((prev) => (prev - 1 + FEELS_DATA.length) % FEELS_DATA.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPhoneMode, chatOpen]);

  const activeFeel = FEELS_DATA[currentIndex];

  const handleNext = () => {
    setScrollDirection('next');
    setCurrentIndex((prev) => (prev + 1) % FEELS_DATA.length);
  };

  const handlePrev = () => {
    setScrollDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + FEELS_DATA.length) % FEELS_DATA.length);
  };

  // Shorts-style wheel scrolling (looping seamlessly)
  const handleWheel = (e: React.WheelEvent) => {
    if (!isPhoneMode || chatOpen) return;
    if (Math.abs(e.deltaY) < 18) return;
    if (isWheelLockedRef.current) return;

    isWheelLockedRef.current = true;
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }

    setTimeout(() => {
      isWheelLockedRef.current = false;
    }, 380);
  };

  // Shorts-style touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 35) {
      if (diffY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartYRef.current = null;
  };

  const handleToggleLike = (id: string) => {
    setLikedMap((prev) => {
      const wasLiked = !!prev[id];
      const baseLikes = activeFeel.likes;
      const current = likeCountMap[id] ?? baseLikes;
      setLikeCountMap((counts) => ({
        ...counts,
        [id]: wasLiked ? current - 1 : current + 1,
      }));
      return { ...prev, [id]: !wasLiked };
    });
  };

  const handleToggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClaimProblem = (id: string) => {
    setClaimedMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleShare = () => {
    setCopiedToast(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  return (
    <>
      {/* Dimmed & blurred backdrop overlay when phone mode is focused */}
      <AnimatePresence>
        {isPhoneMode && (
          <motion.div
            key="feels-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePhoneMode}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm cursor-pointer"
            aria-label="Click outside to exit phone view"
          />

        )}
      </AnimatePresence>

      <motion.div
        id="feels"
        layout
        transition={{
          layout: {
            duration: 0.32,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`overflow-hidden transform-gpu will-change-transform ${
          isPhoneMode
            ? 'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[min(700px,calc(100dvh-3rem))] aspect-[9/18.5] max-w-[380px] rounded-[48px] sm:rounded-[52px] bg-gradient-to-b from-[#2e323b] via-[#16181e] to-[#0d0f13] p-[8px] sm:p-[10px] shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18)] select-none'
            : 'relative z-10 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 liquid-glass shadow-2xl p-6 sm:p-12 md:p-16 text-center min-h-[420px] max-h-[86dvh] flex flex-col items-center justify-center'
        }`}
      >
      {/* Subtle radial backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.14), transparent 70%)',
        }}
      />

      <AnimatePresence mode="popLayout">
        {!isPhoneMode ? (
          /* ========================================================================= */
          /* WIDE RECTANGLE DIVISION: "EXPLORE MARKETPLACE"                            */
          /* ========================================================================= */
          <motion.div
            key="wide-marketplace-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Top Eyebrow Tag & Mode Hint */}
            <div className="flex items-center justify-between w-full mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] font-mono uppercase tracking-widest text-white/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Feels • Text Opportunities</span>
              </div>

              <button
                type="button"
                onClick={openPhoneMode}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[11px] text-white/60 hover:text-white hover:bg-white/10 transition-colors font-mono cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Shape</span>
              </button>
            </div>

            {/* Main Title: Explore Marketplace */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-white">
              Explore Marketplace
            </h2>

            {/* Subtitle describing Feels wordplay & text job opportunities */}
            <p className="mt-5 text-white/65 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Experience <span className="text-white font-medium">Feels</span> — like reels, but for text job opportunities, freelance bounties, and verified student society quests.
            </p>

            {/* Trigger Button: Reshapes the rectangle into a phone shape */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                id="explore-marketplace-btn"
                onClick={openPhoneMode}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white text-black font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black stroke-none" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <div className="flex items-center gap-2 text-xs text-white/50 px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Opportunities Feed</span>
              </div>
            </div>

            {/* Featured Opportunity Preview Bar */}
            <div className="mt-10 pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
              <div className="flex items-center gap-2 text-white/75">
                <span className="font-semibold text-white">Featured Opportunity:</span>
                <span className="truncate max-w-[240px]">Graphic Designer: Vector Streetwear Merch</span>
              </div>
              <div className="font-mono text-white/80 font-medium inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300 inline shrink-0" />
                <span>+1,200 Karma • ₹2,800 Stipend</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* RESHAPED PHONE SHAPE DIVISION: "FEELS" SECTION                            */
          /* ========================================================================= */
          <motion.div
            key="phone-feels-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full h-full rounded-[42px] bg-[#000000] overflow-hidden flex flex-col justify-between border border-white/15 shadow-inner"
          >
            {/* Phone Hardware Side Buttons (Simulated on inner bezel edge) */}
            <div className="absolute -left-[2px] top-24 w-[2px] h-6 bg-white/20 rounded-l-sm pointer-events-none" />
            <div className="absolute -left-[2px] top-34 w-[2px] h-10 bg-white/20 rounded-l-sm pointer-events-none" />
            <div className="absolute -left-[2px] top-48 w-[2px] h-10 bg-white/20 rounded-l-sm pointer-events-none" />
            <div className="absolute -right-[2px] top-36 w-[2px] h-14 bg-white/20 rounded-r-sm pointer-events-none" />

            {/* Micro Speaker Slit at Top Bezel */}
            <div className="w-12 h-[3px] bg-[#14161c] rounded-full mx-auto mt-1 opacity-70 shrink-0 ring-1 ring-white/5" />

            {/* Authentic iOS Status Bar with Real Dynamic Island */}
            <div className="h-10 px-5 pt-0.5 flex items-center justify-between text-white shrink-0 select-none z-20">
              {/* Left Clock */}
              <span className="font-semibold text-[13px] tracking-tight text-white/90 pl-1 font-sans">
                9:41
              </span>

              {/* Center Dynamic Island */}
              <div className="w-[110px] h-[27px] rounded-full bg-black shadow-md border border-white/10 flex items-center justify-between px-2.5 mx-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0a1122] ring-1 ring-white/15 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                </div>
              </div>

              {/* Right Status Indicators: Cellular, Wi-Fi, Battery */}
              <div className="flex items-center gap-1.5 pr-1">
                {/* 4-bar cell signal */}
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <div className="w-[2.5px] h-1 bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-1.5 bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-2 bg-white rounded-[0.5px]" />
                  <div className="w-[2.5px] h-2.5 bg-white rounded-[0.5px]" />
                </div>
                <Wifi className="w-3 h-3 text-white" />
                {/* iOS Battery Icon */}
                <div className="flex items-center gap-[1px]">
                  <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
                    <div className="w-full h-full bg-white rounded-[1.5px]" />
                  </div>
                  <div className="w-[1px] h-1 bg-white/80 rounded-r-[1px]" />
                </div>
              </div>
            </div>

            {/* Quick Floating Reels Header */}
            <div className="px-4 py-1 flex items-center justify-between shrink-0 select-none z-20">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10.5px] font-medium text-white/90 backdrop-blur-md">
                <Flame className="w-3 h-3 text-pink-500" />
                <span>Feels Reel</span>
              </div>

              <button
                type="button"
                onClick={closePhoneMode}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/15 bg-white/10 text-[10.5px] font-medium text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer"
                title="Expand to Marketplace Overview"
              >
                <Minimize2 className="w-3 h-3" />
                <span>Wide View</span>
              </button>
            </div>

            {/* Active Reel Card Viewport (Seamless vertical sliding with physics spring) */}
            <div className="relative flex-1 w-full min-h-0 overflow-hidden px-3.5 sm:px-4 py-1">
              <AnimatePresence mode="popLayout" custom={scrollDirection}>
                <motion.div
                  key={activeFeel.id}
                  custom={scrollDirection}
                  variants={{
                    enter: (dir: 'next' | 'prev') => ({
                      y: dir === 'next' ? '100%' : '-100%',
                      opacity: 0,
                    }),
                    center: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        y: { type: 'spring', stiffness: 340, damping: 34, mass: 0.7 },
                        opacity: { duration: 0.2 },
                      },
                    },
                    exit: (dir: 'next' | 'prev') => ({
                      y: dir === 'next' ? '-100%' : '100%',
                      opacity: 0,
                      transition: {
                        y: { type: 'spring', stiffness: 340, damping: 34, mass: 0.7 },
                        opacity: { duration: 0.18 },
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -35 || info.velocity.y < -200) {
                      handleNext();
                    } else if (info.offset.y > 35 || info.velocity.y > 200) {
                      handlePrev();
                    }
                  }}
                  className="w-full h-full flex flex-col justify-between py-1 relative cursor-grab active:cursor-grabbing select-none"
                >
                {/* Floating Action Controls on Right Side (Reels Style) */}
                <div className="absolute right-0 top-6 sm:top-8 z-20 flex flex-col items-center gap-3 text-white/70">
                  {/* Like button */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(activeFeel.id)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                    title="Like Feel"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${
                        likedMap[activeFeel.id]
                          ? 'bg-pink-500 text-white border-pink-500 scale-110 shadow-lg'
                          : 'bg-black/60 border-white/15 text-white/70 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          likedMap[activeFeel.id] ? 'fill-white' : ''
                        }`}
                      />
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-medium text-white/60">
                      {likeCountMap[activeFeel.id] ?? activeFeel.likes}
                    </span>
                  </button>

                  {/* Bookmark button */}
                  <button
                    type="button"
                    onClick={() => handleToggleSave(activeFeel.id)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                    title="Save Opportunity"
                  >
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all ${
                        savedMap[activeFeel.id]
                          ? 'bg-white text-black border-white'
                          : 'bg-black/60 border-white/15 text-white/70 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      {savedMap[activeFeel.id] ? (
                        <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-medium text-white/60">Save</span>
                  </button>

                  {/* Share button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                    title="Share Feel"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-medium text-white/60">Share</span>
                  </button>
                </div>

                {/* Main Opportunity Card Content */}
                <div className="pr-11 sm:pr-12 space-y-2 sm:space-y-2.5">
                  {/* Author Row: DG Avatar + Name + First Come Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border border-white/15 shadow-sm ${activeFeel.avatarBg}`}
                      >
                        {activeFeel.avatarText}
                      </div>
                      <div>
                        <div className="font-bold text-[13px] sm:text-[13.5px] text-white tracking-tight leading-tight">
                          {activeFeel.author}
                        </div>
                        <div className="text-[10.5px] sm:text-[11px] text-white/50 font-normal leading-tight mt-0.5">
                          {activeFeel.societySubtitle}
                        </div>
                      </div>
                    </div>

                    {/* Badge (e.g. FIRST COME with lightning) */}
                    <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-black border border-white/20 text-[9.5px] sm:text-[10px] font-bold tracking-wider text-white shadow-sm">
                      <Zap className="w-3 h-3 fill-white stroke-none" />
                      <span>{activeFeel.badge}</span>
                    </div>
                  </div>

                  {/* Heading / Role Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug pt-0.5 line-clamp-2">
                    {activeFeel.title}
                  </h3>

                  {/* Description Box Container */}
                  <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-2.5 sm:p-3 text-[11.5px] sm:text-[12px] text-white/85 leading-relaxed font-normal shadow-inner line-clamp-3 sm:line-clamp-4">
                    {activeFeel.description}
                  </div>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {activeFeel.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/15 text-[10px] sm:text-[10.5px] text-white/70 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compensation & Rewards Row */}
                <div className="mt-2 rounded-2xl bg-white/[0.03] border border-white/10 p-2 sm:p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white font-bold text-[12px] sm:text-[13px] tracking-tight">
                    <Zap className="w-3.5 h-3.5 fill-white stroke-none text-white" />
                    <span>+{activeFeel.karmaPoints.toLocaleString()} Karma Points</span>
                  </div>

                  <div className="text-[11px] sm:text-[11.5px] font-semibold text-white/70">
                    {activeFeel.stipend}
                  </div>
                </div>

                {/* Bottom Action Row: Claim Problem + Chat */}
                <div className="mt-2 flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleClaimProblem(activeFeel.id)}
                    className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
                      claimedMap[activeFeel.id]
                        ? 'bg-emerald-400 text-black'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {claimedMap[activeFeel.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Problem Claimed!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-black stroke-none" />
                        <span>Claim Problem</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-full bg-black/60 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
            </div>

            {/* iOS Home Indicator */}
            <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mb-2 mt-1 shrink-0 select-none" />

            {/* Chat Drawer Overlay inside Phone */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 bottom-0 top-16 bg-[#0a0c10]/95 backdrop-blur-md rounded-b-[40px] z-30 p-4 flex flex-col justify-between border-t border-white/15 shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-semibold text-white">
                          Direct Inquiry: {activeFeel.author}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChatOpen(false)}
                        className="p-1 text-white/40 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white/70 space-y-1.5">
                      <div className="font-semibold text-white">Regarding Quest:</div>
                      <div className="line-clamp-2 text-white/90">{activeFeel.title}</div>
                    </div>

                    <div className="mt-4 text-[12px] text-white/50 leading-relaxed">
                      Send a message directly to the coordinators of {activeFeel.author}. They typically respond within 2 hours.
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!chatMessage.trim()) return;
                      setChatMessage('');
                      setChatOpen(false);
                    }}
                    className="flex items-center gap-2 pt-3"
                  >
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type inquiry or roll number..."
                      className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toast confirmation */}
            <AnimatePresence>
              {copiedToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold shadow-lg whitespace-nowrap"
                >
                  Link copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};
