import React from 'react';
import { motion } from 'motion/react';

const logos = [
  'Linear',
  'Vercel',
  'Figma',
  'Stripe',
  'Ramp',
  'Notion',
  'Loom',
  'Arc',
];

export const LogoCloud: React.FC = () => {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
      <p className="text-xs uppercase tracking-widest text-white/40 font-medium">
        Trusted by the world&apos;s most thoughtful teams
      </p>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
        {logos.map((logo, index) => (
          <motion.div
            key={logo}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex items-center justify-center p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
          >
            <span className="text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors cursor-default select-none">
              {logo}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
