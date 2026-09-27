import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Heart,
  MessageSquare,
  Bookmark,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  Award,
  Layers,
  ChevronRight,
  ArrowLeft,
  X,
  User,
  SlidersHorizontal,
  Home,
  PlusCircle,
  Share2,
  Sparkles,
  Paperclip,
  Check,
} from 'lucide-react';
import { ANNOUNCEMENTS_DATA, AnnouncementItem } from '../data/announcements';

/**
 * Minimalist Apple/Nothing-style default profile avatar
 */
const DefaultAvatar: React.FC<{
  name?: string;
  size?: number;
  className?: string;
}> = ({ name, size = 26, className = '' }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 border border-white/15 bg-white/[0.08] text-white/70 select-none shadow-xs transition-colors group-hover:border-white/25 group-hover:bg-white/[0.12] ${className}`}
      style={{ width: size, height: size }}
      title={name || 'Profile'}
    >
      <User
        className="text-white/70"
        style={{ width: Math.max(12, Math.round(size * 0.52)), height: Math.max(12, Math.round(size * 0.52)) }}
        strokeWidth={2.2}
      />
    </div>
  );
};

/**
 * Verified tick badge matching the Instagram/Twitter verified checkmark
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

/**
 * Slim animated progress bar
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
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(ANNOUNCEMENTS_DATA);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'vacancy' | 'exclusive' | 'academic' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Interactive state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>(() =>
    ANNOUNCEMENTS_DATA.reduce((acc, item) => ({ ...acc, [item.id]: item.likes }), {})
  );
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});
  const [quickReply, setQuickReply] = useState<string>('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // New announcement form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const selectedAnnouncement =
    announcements.find((a) => a.id === selectedId) || announcements[0];

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeFilter === 'saved' && !savedMap[item.id]) return false;
    if (activeFilter === 'vacancy' && item.category !== 'vacancy') return false;
    if (activeFilter === 'exclusive' && item.category !== 'exclusive') return false;
    if (activeFilter === 'academic' && item.category !== 'academic') return false;

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

  const showToast = (message: string) => {
    setToastNotice(message);
    setTimeout(() => {
      setToastNotice(null);
    }, 3200);
  };

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
    const isSaved = !savedMap[id];
    setSavedMap((prev) => ({ ...prev, [id]: isSaved }));
    showToast(isSaved ? 'Notice saved to bookmarks' : 'Removed from bookmarks');
  };

  const handleApply = (id: string) => {
    const isApplied = !appliedMap[id];
    setAppliedMap((prev) => ({ ...prev, [id]: isApplied }));
    showToast(isApplied ? 'Application submitted! Check your Campus Karma inbox.' : 'Application withdrawn');
  };

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReply.trim()) return;
    showToast(`Reply sent to ${selectedAnnouncement.author}`);
    setQuickReply('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;
    const newItem: AnnouncementItem = {
      id: String(Date.now()),
      avatarText: newAuthor.slice(0, 2).toUpperCase(),
      avatarBg: 'bg-emerald-600/90 text-white',
      author: newAuthor,
      subCategory: 'Club Vacancy',
      tag: 'New Dispatch',
      tagColor: 'green',
      location: 'Campus Wide',
      timeAgo: 'Just now',
      title: newTitle,
      description: newDesc || 'Newly published campus announcement.',
      fullBody: [newDesc || 'Newly published campus announcement.'],
      responsibilities: ['Actively collaborate with student team leads'],
      requirements: ['Valid campus ID badge'],
      perk: '500 Karma Points',
      slotsText: '1 of 2 slots open',
      fillPercentage: 50,
      likes: 1,
      commentsCount: 0,
      socialNote: 'Just posted',
      hashtags: ['#CampusNotice', '#Opportunity'],
      category: 'vacancy',
      verified: true,
    };
    setAnnouncements((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setIsComposeOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewAuthor('');
    showToast('New announcement published to Live Feed!');
  };

  const getTagBadge = (tag?: string, color?: string) => {
    if (!tag) return null;
    let badgeClass = 'bg-white/5 text-white/70 border-white/10';
    if (color === 'green') {
      badgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
    } else if (color === 'pink') {
      badgeClass = 'bg-pink-950/40 text-pink-400 border-pink-500/20';
    } else if (color === 'blue') {
      badgeClass = 'bg-blue-950/40 text-blue-400 border-blue-500/20';
    } else if (color === 'amber') {
      badgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/20';
    }
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-tight ${badgeClass}`}>
        {tag}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto px-2 sm:px-6 pt-2 pb-6 h-[calc(100dvh-5.5rem)] min-h-[580px]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/95 border border-white/20 text-white text-xs shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mail Workstation App Window - Frosted Glass Container */}
      <div className="flex-1 flex flex-col w-full h-full rounded-2xl border border-white/15 bg-[#0f1013]/90 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header: macOS Traffic Lights + App Title + Quick Actions */}
        <header className="h-11 px-4 sm:px-6 border-b border-white/10 bg-[#141518]/95 flex items-center justify-between select-none z-20 flex-shrink-0">
          {/* Left: Window Controls + Back to Landing */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                title="Close to Home"
                className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 hover:opacity-80 transition-opacity cursor-pointer"
              />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50 cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50 cursor-pointer" />
            </div>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </Link>
          </div>

          {/* Center: Title matching screenshot */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 font-medium tracking-tight">
            <Layers className="w-4 h-4 text-white/60" />
            <span className="truncate">Campus Bulletin · Announcements & Opportunities</span>
          </div>

          {/* Right: Live Feed Badge + New Post Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsComposeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-black hover:bg-white/90 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Dispatch</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-[11px]">Live Feed</span>
            </div>
          </div>
        </header>

        {/* Secondary Outlook/Gmail Command Bar: Filter Tabs & Search */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-white/10 bg-[#16171a] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 flex-shrink-0 z-10">
          {/* Filter Pills matching screenshot */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/5 font-medium'
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
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'vacancy'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Club Vacancies</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'vacancy' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {announcements.filter((a) => a.category === 'vacancy').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('exclusive')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'exclusive'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Club Exclusive</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'exclusive' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {announcements.filter((a) => a.category === 'exclusive').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('academic')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'academic'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <span>Academic & CR</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'academic' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {announcements.filter((a) => a.category === 'academic').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('saved')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeFilter === 'saved'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/5 font-medium'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Saved</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === 'saved' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/60'}`}>
                {Object.values(savedMap).filter(Boolean).length}
              </span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-8 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.1] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dual-Pane Outlook/Gmail Workstation Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANE: Notice/Mail List (380px-440px) */}
          <div
            className={`w-full md:w-[420px] lg:w-[460px] flex-shrink-0 border-r border-white/10 flex flex-col bg-[#111214] ${
              mobileView === 'detail' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* List Sub-header matching screenshot */}
            <div className="px-5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-white/50 bg-[#141518] flex-shrink-0">
              <span className="font-medium text-white/70">
                {filteredAnnouncements.length} Available Notices
              </span>
              <span className="text-[11px] text-white/40 tracking-tight">
                Click to view mail details
              </span>
            </div>

            {/* Scrollable list of notices */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              {filteredAnnouncements.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-xs flex flex-col items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6 text-white/20" />
                  <span>No dispatches found matching your filter</span>
                </div>
              ) : (
                filteredAnnouncements.map((item) => {
                  const isSelected = item.id === selectedId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setMobileView('detail');
                      }}
                      className={`p-4 transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'bg-white/[0.08] border-l-2 border-white'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Top Row: Author + Verified + Society + Time */}
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 pr-2">
                          <span className="font-semibold text-white truncate text-[13px]">
                            {item.author}
                          </span>
                          <VerifiedTick size={13} />
                          <span className="text-white/40 text-[11px] truncate">
                            · {item.tag || item.subCategory}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/40 flex-shrink-0">
                          {item.timeAgo}
                        </span>
                      </div>

                      {/* Title matching screenshot */}
                      <h3 className="text-sm font-semibold text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors mb-2.5">
                        {item.title}
                      </h3>

                      {/* Progress bar and Slots Open */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-white/50">
                          <span>{item.slotsText}</span>
                          <span className="text-white/40">{item.location}</span>
                        </div>
                        <SlimProgressBar percentage={item.fillPercentage} heightClass="h-[2.5px]" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT PANE: Mail Reading View */}
          <div
            className={`flex-1 flex flex-col bg-[#0e0f11] overflow-hidden ${
              mobileView === 'list' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Action Bar Header matching screenshot */}
            <div className="h-12 px-6 border-b border-white/10 bg-[#131417] flex items-center justify-between flex-shrink-0 z-10">
              {/* Left on mobile: Back to list button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="md:hidden inline-flex items-center gap-1 text-xs text-white/70 hover:text-white mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>List</span>
                </button>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleLike(selectedAnnouncement.id, e)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    likedMap[selectedAnnouncement.id]
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedMap[selectedAnnouncement.id] ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  <span>{likeCountMap[selectedAnnouncement.id] || 0}</span>
                </button>

                {/* Chat Button */}
                <button
                  type="button"
                  onClick={() => {
                    const replyInput = document.getElementById('dashboard-quick-reply-input');
                    if (replyInput) replyInput.focus();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(selectedAnnouncement.id, e)}
                  className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                    savedMap[selectedAnnouncement.id]
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      savedMap[selectedAnnouncement.id] ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Right: Apply for Slot primary CTA */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleApply(selectedAnnouncement.id)}
                  className={`inline-flex items-center gap-2 rounded-full font-medium text-xs px-5 py-2 transition-all cursor-pointer active:scale-95 shadow-md ${
                    appliedMap[selectedAnnouncement.id]
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {appliedMap[selectedAnnouncement.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied ✓</span>
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

            {/* Reading Content Pane */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
              {/* Author & Header Metadata matching screenshot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <DefaultAvatar name={selectedAnnouncement.author} size={36} />

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-white text-sm">
                        {selectedAnnouncement.author}
                      </span>
                      <VerifiedTick size={14} />
                      <span className="text-white/40 text-xs">
                        · {selectedAnnouncement.subCategory} · {selectedAnnouncement.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-white/40" />
                        {selectedAnnouncement.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-white/40" />
                        {selectedAnnouncement.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {getTagBadge(selectedAnnouncement.tag, selectedAnnouncement.tagColor)}
                </div>
              </div>

              {/* Big Bold Headline matching screenshot */}
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                {selectedAnnouncement.title}
              </h1>

              {/* Capacity Progress Bar & Karma Points Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="space-y-1.5 flex-1 max-w-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white/80">
                      {selectedAnnouncement.slotsText}
                    </span>
                    <span className="text-white/40">
                      ({selectedAnnouncement.fillPercentage}% capacity)
                    </span>
                  </div>
                  <SlimProgressBar percentage={selectedAnnouncement.fillPercentage} heightClass="h-[3px]" />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedAnnouncement.perk}</span>
                </div>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3.5 text-white/80 text-sm leading-relaxed">
                {selectedAnnouncement.fullBody.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Deliverables & Responsibilities */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Key Deliverables & Responsibilities
                </h2>
                <ul className="space-y-2 text-sm text-white/85">
                  {selectedAnnouncement.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements & Eligibility */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Requirements & Eligibility
                </h2>
                <ul className="space-y-2 text-sm text-white/85">
                  {selectedAnnouncement.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hashtags & Social footer */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedAnnouncement.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/45 hover:text-white/80 transition-colors cursor-pointer bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-white/45 pt-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedAnnouncement.socialNote}</span>
                  </div>
                  <span className="text-[11px] text-white/40 uppercase tracking-wide">
                    {selectedAnnouncement.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Outlook/Gmail-Style Bottom Quick Reply Box */}
            <div className="p-4 border-t border-white/10 bg-[#121316] flex-shrink-0">
              <form onSubmit={handleSendQuickReply} className="flex items-center gap-2">
                <input
                  id="dashboard-quick-reply-input"
                  type="text"
                  value={quickReply}
                  onChange={(e) => setQuickReply(e.target.value)}
                  placeholder={`Write quick message or dispatch inquiry to ${selectedAnnouncement.author}...`}
                  className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.1] transition-all"
                />
                <button
                  type="submit"
                  disabled={!quickReply.trim()}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141518] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-semibold text-sm text-white">Create Campus Dispatch / Opportunity</h3>
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="p-1 rounded-full text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Author / Society</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Design Guild or Student Name"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Notice Title / Role</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer: Zero-Knowledge Event Ticketing"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Description / Details</label>
                  <textarea
                    rows={4}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe responsibilities, requirements, and open slots..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 rounded-full text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all"
                  >
                    Publish to Feed
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
