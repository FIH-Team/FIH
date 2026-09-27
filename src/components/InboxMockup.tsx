import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Share2,
  Send,
  CheckCircle2,
  Sparkles,
  Clock,
  MapPin,
  Users,
  Award,
  ChevronRight,
  ArrowLeft,
  Tag,
  Check,
  Flame,
  Layers,
  FileText,
  SlidersHorizontal,
  User,
  X,
  Lock,
} from 'lucide-react';

interface AnnouncementItem {
  id: string;
  avatarText: string;
  avatarBg: string;
  author: string;
  subCategory: string;
  tag?: string;
  tagColor?: 'green' | 'pink' | 'blue' | 'amber';
  location: string;
  timeAgo: string;
  title: string;
  description: string;
  fullBody: string[];
  responsibilities: string[];
  requirements: string[];
  perk: string;
  slotsText: string;
  fillPercentage: number;
  likes: number;
  commentsCount: number;
  socialNote: string;
  hashtags: string[];
  category: 'vacancy' | 'exclusive' | 'academic' | 'notice';
  urgent?: boolean;
  verified?: boolean;
}

/**
 * Minimalist Apple/Nothing-style default profile avatar.
 * Renders a clean frosted neutral container with a default silhouette icon,
 * keeping the interface minimal and consistent unless explicitly customized.
 */
const DefaultAvatar: React.FC<{
  name?: string;
  size?: number;
  className?: string;
}> = ({ name, size = 22, className = '' }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 border border-white/15 bg-white/[0.08] text-white/70 select-none shadow-xs transition-colors group-hover:border-white/25 group-hover:bg-white/[0.12] ${className}`}
      style={{ width: size, height: size }}
      title={name || 'Profile'}
    >
      <User
        className="text-white/70"
        style={{ width: Math.max(10, Math.round(size * 0.54)), height: Math.max(10, Math.round(size * 0.54)) }}
        strokeWidth={2.2}
      />
    </div>
  );
};

/**
 * Slim animated progress bar with refined Apple/Nothing fluid deceleration curve.
 */
const SlimProgressBar: React.FC<{
  percentage: number;
  heightClass?: string;
  className?: string;
}> = ({ percentage, heightClass = 'h-[3px]', className = '' }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  return (
    <div className={`w-full bg-white/[0.12] rounded-full overflow-hidden ${heightClass} ${className}`}>
      <motion.div
        className="h-full bg-white rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${clampedPercentage}%` }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1], // Apple-style fluid deceleration curve
        }}
      />
    </div>
  );
};

/**
 * Minimalist Instagram-style subtle verified tick badge.
 * Clean, recognizable, and non-obtrusive.
 */
const VerifiedTick: React.FC<{ size?: number; className?: string }> = ({
  size = 12,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#0095f6] text-white flex-shrink-0 align-middle ${className}`}
      style={{ width: size, height: size }}
      title="Verified Campus Entity"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[62%] h-[62%] stroke-white"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
};

const announcements: AnnouncementItem[] = [
  {
    id: '1',
    avatarText: 'AV',
    avatarBg: 'bg-zinc-800 text-white',
    author: 'Aditya Verma',
    subCategory: 'Club Vacancy',
    tag: 'Design Guild',
    tagColor: 'green',
    location: 'Campus Wide',
    timeAgo: '9d ago',
    title: 'Wanted: Student UI/UX Lead for Campus Hackathon Portal v2.4',
    description:
      'Looking for an energetic student designer to collaborate on wireframes and Figma components for the upcoming 48-hour inter-college hackathon.',
    fullBody: [
      'The Design Guild and Tech Council are assembling the core product team for the Campus Hackathon Portal v2.4. We need a dedicated student UI/UX designer who can translate complex registration, team matching, and live project submission workflows into an effortless experience.',
      'You will work alongside senior student engineers and direct feedback from the Hackathon Organizing Committee. All prototypes will be directly implemented into production.',
    ],
    responsibilities: [
      'Design high-fidelity responsive wireframes in Figma',
      'Create reusable design tokens and responsive UI components',
      'Conduct rapid user testing with campus cohort participants',
      'Deliver final design specs to frontend developers before sprint freeze',
    ],
    requirements: [
      'Proficiency in Figma (auto-layout, components, variants)',
      'Basic understanding of Tailwind CSS design patterns is a plus',
      'Enrolled undergraduate student available 4-6 hrs/week',
    ],
    perk: '1,200 Karma Points + Council Lead Badge',
    slotsText: '2 of 3 slots open',
    fillPercentage: 33,
    likes: 8,
    commentsCount: 3,
    socialNote: 'Liked by 8 students',
    hashtags: ['#Vacancy', '#Design', '#UI/UX', '#Hackathon'],
    category: 'vacancy',
  },
  {
    id: '2',
    avatarText: 'KA',
    avatarBg: 'bg-pink-600/90 text-white',
    author: 'Kavya Patel',
    subCategory: 'Club Vacancy',
    tag: 'Cultural Council',
    tagColor: 'pink',
    location: 'Campus Center',
    timeAgo: '8d ago',
    title: 'Sound Tech Required for Battle of the Bands',
    description:
      'Looking for an audio engineer or music tech student to manage mixer boards, sound checks, and stage acoustics for the annual Battle of the Bands night.',
    fullBody: [
      'The Cultural Council Music Board is looking for 2 hands-on student audio engineers. You will coordinate with 12 performing student bands across genre sets, calibrating monitors, balancing inputs, and managing the main front-of-house sound.',
      'Prior experience with digital mixing consoles (Yamaha / Behringer) or stage equipment setup is preferred.',
    ],
    responsibilities: [
      'Manage stage audio routing, wireless mics, and drum kits',
      'Conduct live 15-minute sound checks per performance slot',
      'Calibrate acoustic EQ levels in the open-air Campus Amphitheater',
    ],
    requirements: [
      'Hands-on experience with PA systems or live audio mixers',
      'Availability for technical rehearsal and event night (Nov 14-15)',
    ],
    perk: '850 Karma Points + Backstage Pass',
    slotsText: '1 of 2 slots open',
    fillPercentage: 50,
    likes: 14,
    commentsCount: 5,
    socialNote: 'Liked by 14 students',
    hashtags: ['#Vacancy', '#Music', '#SoundEngineering', '#CampusLife'],
    category: 'vacancy',
  },
  {
    id: '3',
    avatarText: 'KP',
    avatarBg: 'bg-pink-600/90 text-white',
    author: 'Kavya Patel',
    subCategory: 'Club Vacancy',
    tag: 'Cultural Council',
    tagColor: 'green',
    location: 'Main Campus Amphitheater',
    timeAgo: '9d ago',
    title: 'Stage Crew: Sound & Light Logistics for Ignite 2026',
    description:
      'Join the core production crew for Ignite 2026. Managing DMX lighting consoles, truss setup, and real-time stage transitions.',
    fullBody: [
      'Ignite 2026 is our annual cultural festival. The stage operations crew is responsible for the central amphitheater production, coordinating with visiting guest performers, student dance troupes, and visual arts installations.',
      'Volunteers receive hands-on training with campus production equipment and certified credentials from the Dean of Student Affairs.',
    ],
    responsibilities: [
      'Operate stage spotlights, moving heads, and atmosphere fog machines',
      'Maintain cue sheets and synchronized visual transition timings',
      'Oversee backstage clearance, security access, and performer greenrooms',
    ],
    requirements: [
      'Punctual, team-first attitude with energetic communication skills',
      'Commitment during the festival setup weekend',
    ],
    perk: '1,500 Karma Points + Official Certificate',
    slotsText: '4 of 6 slots open',
    fillPercentage: 33,
    likes: 19,
    commentsCount: 6,
    socialNote: 'Liked by 19 students',
    hashtags: ['#StageCrew', '#Ignite2026', '#Lighting', '#Events'],
    category: 'vacancy',
  },
  {
    id: '4',
    avatarText: 'DG',
    avatarBg: 'bg-purple-600/90 text-white',
    author: 'Design Guild Steering Council',
    subCategory: 'Club Exclusive',
    tag: 'Design Guild (Members Only)',
    tagColor: 'pink',
    location: 'Design Studio 4B (Keycard Access)',
    timeAgo: '9d ago',
    title: 'Design Guild Core: Figma Token Refactor & Secret Theme Sprint',
    description:
      'Exclusive sprint for verified design guild members. We are revamping universal campus component tokens and prototyping the secret theme for spring semester.',
    fullBody: [
      'This is a private invitation-only workshop for accredited Design Guild contributors. We will be refactoring our multi-brand token system in Figma, streamlining typography variables, and architecting the new fluid dark-mode palette for university sub-domains.',
      'Access requires Studio 4B keycard clearance or an invitation token from the Lead Architect.',
    ],
    responsibilities: [
      'Map legacy color palettes to new OKLCH variable architecture',
      'Test nested component performance across 100+ production frames',
      'Synthesize review notes for the Dean’s communications briefing',
    ],
    requirements: [
      'Verified Design Guild Active Member status',
      'Completed Design Guild Onboarding Primer',
    ],
    perk: '2,000 Karma Points + Core Contributor Status',
    slotsText: 'Member Restricted · 8 Active',
    fillPercentage: 80,
    likes: 27,
    commentsCount: 8,
    socialNote: 'Liked by 27 verified members',
    hashtags: ['#ClubExclusive', '#FigmaTokens', '#DesignSprint'],
    category: 'exclusive',
  },
  {
    id: '5',
    avatarText: 'TB',
    avatarBg: 'bg-cyan-600/90 text-white',
    author: 'TBI Incubation Cell',
    subCategory: 'Campus Notice',
    tag: 'Incubation Hub',
    tagColor: 'blue',
    location: 'Tech Park Block C',
    timeAgo: '2d ago',
    title: 'NEW HACKATHON 2k26: Ideation Phase Open & Seed Grants',
    description:
      'Registrations open for the flagship 36-hour inter-institutional hackathon. Mentorship from alumni founders, $10,000 seed grants, and incubation fast-track.',
    fullBody: [
      'The Technology Business Incubator (TBI) has launched the call for submissions for Hackathon 2k26. Teams can submit problem statements across AI/ML, Decentralized Security, Campus Utilities, and CleanTech.',
      'Selected student teams will receive dedicated cloud credits, hardware bench equipment, and 1-on-1 coaching from venture mentors.',
    ],
    responsibilities: [
      'Submit problem abstract and 3-slide pitch deck by Friday midnight',
      'Attend mandatory virtual orientation with track mentors',
    ],
    requirements: [
      'Teams of 2 to 4 enrolled campus students',
      'Interdisciplinary teams strongly encouraged',
    ],
    perk: '3,000 Karma Points + Seed Grant Eligibility',
    slotsText: '18 of 25 team slots open',
    fillPercentage: 28,
    likes: 42,
    commentsCount: 12,
    socialNote: 'Liked by 42 students',
    hashtags: ['#Hackathon2k26', '#TBI', '#SeedGrants', '#Innovation'],
    category: 'notice',
  },
  {
    id: '6',
    avatarText: 'CS',
    avatarBg: 'bg-emerald-700/90 text-white',
    author: 'Arjun | CR (BTech Cyber)',
    subCategory: 'Academic Notice',
    tag: 'BTech Cyber',
    tagColor: 'blue',
    location: 'CR14 / Lab 304',
    timeAgo: '1d ago',
    title: 'Classroom Changed to CR14 & PBL Submission Directives',
    description:
      'All Cyber batches: today’s practical and theory sessions shift to CR14 due to server maintenance. Submit Project-Based Learning assignments directly to CR.',
    fullBody: [
      'Urgent reminder for all Section A and B students: Academic Block 3 server upgrade is ongoing. All practical sessions move to CR14 with immediate effect.',
      'Hard copies and GitHub repository links for the Network Defense PBL assignment must be signed off by CR Arjun before 4:30 PM today.',
    ],
    responsibilities: [
      'Assemble in CR14 by 10:15 AM with lab manuals',
      'Verify GitHub repository accessibility with your lab partner',
    ],
    requirements: [
      'Signed attendance verification slip',
      'Student ID badge required for CR14 swipe access',
    ],
    perk: 'Mandatory Notice · Academic Verification',
    slotsText: 'Mandatory for Cyber Cohort',
    fillPercentage: 100,
    likes: 31,
    commentsCount: 9,
    socialNote: 'Liked by 31 students in batch',
    hashtags: ['#BtechCyber', '#CR14', '#PBLSubmission', '#Academic'],
    category: 'academic',
  },
];

export const InboxMockup: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'vacancy' | 'exclusive' | 'academic' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Interactive state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>(() =>
    announcements.reduce((acc, item) => ({ ...acc, [item.id]: item.likes }), {})
  );
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatSentNotice, setChatSentNotice] = useState<string | null>(null);

  const selectedAnnouncement =
    announcements.find((a) => a.id === selectedId) || announcements[0];

  const filteredAnnouncements = announcements.filter((item) => {
    // Filter tab
    if (activeFilter === 'saved' && !savedMap[item.id]) return false;
    if (activeFilter === 'vacancy' && item.category !== 'vacancy') return false;
    if (activeFilter === 'exclusive' && item.category !== 'exclusive') return false;
    if (activeFilter === 'academic' && item.category !== 'academic') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchTag = item.tag?.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchHashtags = item.hashtags.some((h) => h.toLowerCase().includes(q));
      return matchTitle || matchAuthor || matchTag || matchDesc || matchHashtags;
    }
    return true;
  });

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [id]: isLiked ? (prev[id] || 1) - 1 : (prev[id] || 0) + 1,
    }));
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApply = (id: string) => {
    setAppliedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatSentNotice(`Message dispatched to ${selectedAnnouncement.author}`);
    setChatMessage('');
    setChatOpen(false);
    setTimeout(() => {
      setChatSentNotice(null);
    }, 4000);
  };

  const renderTagBadge = (tag?: string, color?: string) => {
    if (!tag) return null;
    let badgeClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    if (color === 'pink') {
      badgeClass = 'border-pink-500/30 bg-pink-500/10 text-pink-300';
    } else if (color === 'blue') {
      badgeClass = 'border-sky-500/30 bg-sky-500/10 text-sky-300';
    } else if (color === 'amber') {
      badgeClass = 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    }
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-tight ${badgeClass}`}
      >
        {tag}
      </span>
    );
  };

  return (
    <section id="announcements-portal" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
      {/* Toast notification */}
      <AnimatePresence>
        {chatSentNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900/95 border border-white/15 text-white text-xs shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{chatSentNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
      >
        {/* Frosted Glass Depth Highlights */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl opacity-50"
        />

        {/* macOS Apple Window Header - Slightly darker frosted glass */}
        <div className="relative z-10 h-11 px-4 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between select-none">
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 hover:opacity-80 transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50 hover:opacity-80 transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50 hover:opacity-80 transition-opacity cursor-pointer" />
          </div>

          {/* Centered Window Title */}
          <div className="flex items-center gap-2 text-xs text-white/70 font-medium tracking-tight">
            <Layers className="w-3.5 h-3.5 text-white/50" />
            <span>Campus Bulletin · Announcements & Opportunities</span>
          </div>

          {/* Right indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline text-[11px] text-white/40 font-medium">Live Feed</span>
          </div>
        </div>

        {/* Apple Segmented Filter & Search Bar - Moderate dark frosted glass */}
        <div className="relative z-10 px-4 py-3 border-b border-white/10 bg-black/35 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>All Bulletins</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'all' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {announcements.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('vacancy')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'vacancy'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Club Vacancies</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'vacancy' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('exclusive')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'exclusive'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Club Exclusive</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'exclusive' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                1
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('academic')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'academic'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Academic & CR</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'academic' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                1
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('saved')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'saved'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Saved</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'saved' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {Object.values(savedMap).filter(Boolean).length}
              </span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Master-Detail Mail Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:h-[640px] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Left Column: Announcement List (Mail list) - Frosted semi-translucent */}
          <div
            className={`lg:col-span-5 flex flex-col bg-black/20 backdrop-blur-md overflow-hidden ${
              mobileView === 'detail' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Left Column Subheader - Slightly lighter frosted tint */}
            <div className="p-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-between text-[11px] text-white/50 font-medium px-4">
              <span>{filteredAnnouncements.length} Available Notices</span>
              <span>Click to view mail details</span>
            </div>

            <div className="divide-y divide-white/5 flex-1 overflow-y-auto apple-scrollbar font-apple-mail">
              {filteredAnnouncements.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-xs space-y-2">
                  <SlidersHorizontal className="w-6 h-6 mx-auto text-white/20" />
                  <p>No notices matching your filter.</p>
                </div>
              ) : (
                filteredAnnouncements.map((item) => {
                  const isSelected = selectedId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setMobileView('detail');
                      }}
                      className={`p-3.5 sm:p-4 transition-colors cursor-pointer relative group ${
                        isSelected
                          ? 'bg-white/[0.07] text-white'
                          : 'hover:bg-white/[0.03] text-white/80'
                      }`}
                    >
                      {/* Active subtle indicator bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-white rounded-r" />
                      )}

                      {/* Header row: Author, Verified Tick, Category/Tag, Time */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
                          <span className="font-medium text-[12.5px] text-white truncate flex items-center gap-1">
                            <span>{item.author}</span>
                            <VerifiedTick size={11} />
                          </span>
                          <span className="text-[10px] text-white/30">•</span>
                          <span className="text-[11px] text-white/50 truncate">
                            {item.tag || item.subCategory}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/40 flex-shrink-0 font-normal">
                          {item.timeAgo}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-[13px] font-medium leading-snug line-clamp-2 mb-2 transition-colors ${
                          isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Minimal Slots & Location with Slim Animated Bar */}
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between text-[11px] text-white/50 font-normal">
                          <span className="text-white/70">{item.slotsText}</span>
                          <span className="text-white/40 truncate">{item.location}</span>
                        </div>
                        <SlimProgressBar percentage={item.fillPercentage} heightClass="h-[3px]" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Mail-Format Announcement Reader - Frosted translucent backdrop */}
          <div
            className={`lg:col-span-7 flex flex-col bg-black/35 backdrop-blur-md overflow-hidden ${
              mobileView === 'list' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Mobile Back Button (Top of reader) - Dark frosted header */}
            <div className="lg:hidden p-3 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Bulletins</span>
              </button>
              <span className="text-xs text-white/40">Announcement Mail</span>
            </div>

            {/* Apple Mail Action Toolbar - Moderately dark frosted toolbar */}
            <div className="h-11 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between text-white/70 bg-black/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleLike(selectedAnnouncement.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    likedMap[selectedAnnouncement.id]
                      ? 'border-pink-500/40 bg-pink-500/15 text-pink-300'
                      : 'border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedMap[selectedAnnouncement.id] ? 'fill-pink-400' : ''
                    }`}
                  />
                  <span>{likeCountMap[selectedAnnouncement.id] || selectedAnnouncement.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleBookmark(selectedAnnouncement.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    savedMap[selectedAnnouncement.id]
                      ? 'border-white/40 bg-white/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Bookmark Announcement"
                >
                  {savedMap[selectedAnnouncement.id] ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* 1-Click Apply Action Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApply(selectedAnnouncement.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-[0.98] shadow-sm flex items-center gap-1.5 ${
                    appliedMap[selectedAnnouncement.id]
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {appliedMap[selectedAnnouncement.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied / Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply for Slot</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Chat Drawer / Dialog */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-3.5 bg-black/70 backdrop-blur-lg border-b border-white/10 space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/80 font-medium">
                      Direct Message to {selectedAnnouncement.author}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChatOpen(false)}
                      className="text-white/40 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Ask ${selectedAnnouncement.author} a question about this role...`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/30"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mail Reader Content */}
            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto apple-scrollbar font-apple-mail">
              {/* Mail Sender Header */}
              <div className="border-b border-white/10 pb-5 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <DefaultAvatar
                      name={selectedAnnouncement.author}
                      size={34}
                      className="flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                          <span>{selectedAnnouncement.author}</span>
                          <VerifiedTick size={13} />
                        </h3>
                        <span className="text-xs text-white/30">•</span>
                        <span className="text-xs text-white/65 font-medium">
                          {selectedAnnouncement.subCategory}
                        </span>
                        {selectedAnnouncement.tag && (
                          <>
                            <span className="text-xs text-white/30">•</span>
                            <span className="text-xs text-white/45">{selectedAnnouncement.tag}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11.5px] text-white/40 flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/35" />
                          {selectedAnnouncement.location}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-white/35" />
                          {selectedAnnouncement.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>{renderTagBadge(selectedAnnouncement.tag, selectedAnnouncement.tagColor)}</div>
                </div>

                {/* Prominent Announcement Title */}
                <h1 className="text-xl md:text-2xl font-semibold text-white leading-snug tracking-tight">
                  {selectedAnnouncement.title}
                </h1>

                {/* Minimal Status & Slim Animated Slots Bar - Nothing / Apple Clean Bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-medium text-white/90">{selectedAnnouncement.slotsText}</span>
                      <span className="text-white/40 text-[11px]">
                        ({selectedAnnouncement.fillPercentage}% capacity)
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-white/75 text-[12px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{selectedAnnouncement.perk}</span>
                    </div>
                  </div>

                  <SlimProgressBar
                    key={`slot-${selectedAnnouncement.id}`}
                    percentage={selectedAnnouncement.fillPercentage}
                    heightClass="h-[4px]"
                  />
                </div>
              </div>

              {/* Mail Body Paragraphs */}
              <div className="space-y-4 text-[13.5px] md:text-[14px] text-white/80 leading-relaxed font-normal">
                {selectedAnnouncement.fullBody.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Responsibilities Block */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Key Deliverables & Responsibilities
                </h4>
                <ul className="space-y-2 text-[13px] md:text-[13.5px] text-white/80 font-normal">
                  {selectedAnnouncement.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements Block */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Requirements & Eligibility
                </h4>
                <ul className="space-y-2 text-[13px] md:text-[13.5px] text-white/80 font-normal">
                  {selectedAnnouncement.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white/50 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hashtags & Social Engagement Footer */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedAnnouncement.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/40 hover:text-white/80 transition-colors cursor-pointer font-normal"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-white/45 pt-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedAnnouncement.socialNote}</span>
                  </div>
                  <span className="text-[11px] text-white/40 uppercase tracking-wide">
                    {selectedAnnouncement.timeAgo.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
