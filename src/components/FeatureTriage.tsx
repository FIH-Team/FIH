import React from 'react';
import { motion } from 'motion/react';
import { SectionEyebrow } from './Primitives';

const chips = [
  'Auto-categorize',
  'Snooze for later',
  'Silent newsletters',
  'One-tap unsubscribe',
];

const categories = [
  {
    title: 'Priority',
    count: 2,
    dotColor: '#ffffff',
    items: ['Alankrit Juglan: On it!', "Vinamra: I've been waiting for your arrival."],
  },
  {
    title: 'Btech Cyber',
    count: 2,
    dotColor: '#e5e5e5',
    items: ['CC: Class room changed to cr14', 'Arjun|CR: submit assignments to me directly'],
  },
  {
    title: 'Club',
    count: 2,
    dotColor: '#a3a3a3',
    items: ['TBI: NEW HACKATHON 2k26-', 'Kavyanjali: Reach at 6 p.m.'],
  },
  {
    title: 'Unknown',
    count: 1,
    dotColor: '#525252',
    items: ['Riya(AI/ML-3): Prepare for upcoming PBL-'],
  },
];

export const FeatureTriage: React.FC = () => {
  return (
    <section id="connect" className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16 scroll-mt-6">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left column */}
        <div>
          <SectionEyebrow label="Triage" tag="AI-native" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Connect with piers <br /> without private information.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            End to End encrypted chats. A well curated hub for all your conversational needs. No more confusions on validity of senders, all information directly from the source.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right column card */}
        <div className="liquid-glass rounded-2xl p-5 border border-white/10 shadow-2xl">
          <div className="text-xs text-white/40 font-medium mb-4 tracking-tight px-1">
            Today · {categories.reduce((acc, cat) => acc + cat.items.length, 0)} messages triaged
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="liquid-glass rounded-lg p-3 border border-white/5 transition-all hover:border-white/15"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.dotColor }}
                    />
                    <span className="text-xs font-semibold text-white tracking-tight">
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40 font-medium">
                    {cat.count}
                  </span>
                </div>

                <div className="space-y-1">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-white/60 pl-4 py-0.5 border-l border-white/10 hover:text-white transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
