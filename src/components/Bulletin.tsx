import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Sparkles, ShieldCheck, Flame, Radio } from 'lucide-react';
import { InboxMockup } from './InboxMockup';

export const Bulletin: React.FC = () => {
  // Always scroll to top when opening the Bulletin / Dashboard page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-24">
      {/* Top Header / Hero Banner for Bulletin Dashboard */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-6 pb-2">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium tracking-tight">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Live Campus Dispatch</span>
          </div>
        </div>

        {/* Dashboard Title & Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-xs font-medium mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Karma Official Bulletin</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white"
          >
            Campus Bulletin & Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed"
          >
            All verified announcements, society recruitments, urgent cohort notices, and exclusive academic updates in one live dashboard.
          </motion.p>
        </div>

        {/* Highlight Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-4"
        >
          <div className="liquid-glass rounded-xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">4 Active</div>
              <div className="text-[11px] text-white/50">Notices & Vacancies</div>
            </div>
          </div>

          <div className="liquid-glass rounded-xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">First Come</div>
              <div className="text-[11px] text-white/50">Priority Deadlines</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 liquid-glass rounded-xl p-3 sm:p-4 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">Source Verified</div>
              <div className="text-[11px] text-white/50">Zero Spam / Leaks</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Announcements / Inbox Window */}
      <div className="-mt-8">
        <InboxMockup />
      </div>
    </div>
  );
};

export default Bulletin;
