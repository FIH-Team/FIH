import React from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { AppleLogo } from './Primitives';

const menuItems = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

export const MacMenuBar: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10 relative z-10 select-none"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
        {/* Left items */}
        <div className="flex items-center gap-4 text-white/70">
          <div className="flex items-center gap-3">
            <AppleLogo className="w-3.5 h-3.5 text-white" />
            <span className="font-bold text-white tracking-tight">Campus Karma</span>
          </div>

          <div className="flex items-center gap-4">
            {menuItems.map((item, index) => {
              let visibilityClass = 'inline';
              if (index > 3) {
                visibilityClass = 'hidden md:inline';
              } else if (index > 2) {
                visibilityClass = 'hidden sm:inline';
              }
              return (
                <span
                  key={item}
                  className={`cursor-default hover:text-white transition-colors ${visibilityClass}`}
                >
                  {item}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right items */}
        <div className="flex items-center gap-3 text-white/70 font-medium">
          <Search className="w-3.5 h-3.5 text-white/70 cursor-pointer hover:text-white transition-colors" />
          <span className="tracking-tight text-[11px] sm:text-xs">Wed May 6 1:09 PM</span>
        </div>
      </div>
    </motion.div>
  );
};
