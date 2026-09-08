import {
  createIcons,
  Bell,
  MessageSquare,
  Play,
  Sparkles,
  Mail,
  Send,
  Search,
  Plus,
  ArrowLeft,
  Clipboard,
  Briefcase,
  Calendar,
  Radio,
  Zap,
  Users,
  Flame,
  GraduationCap,
  Cpu,
  MapPin,
  Clock,
  CheckCircle,
  Bookmark,
  Palette,
  RotateCcw,
  Heart,
  MoreHorizontal,
  Layout,
  ChevronDown,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Award,
  CheckSquare,
  BarChart2,
  Sliders,
  SlidersHorizontal,
  Eye,
  SkipForward,
  ArrowRight,
  ShieldCheck,
  Shield,
  Lock,
  Globe,
  User,
  Edit3,
  Copy,
  Smartphone,
  Menu,
  X,
  Settings,
  LogOut,
  Coins,
  Landmark,
  Bot,
  Rocket,
  Wrench,
  Database,
  Share2,
  Megaphone,
  Video,
  FileText
} from 'lucide';
import confetti from 'canvas-confetti';
import {
  INITIAL_ANNOUNCEMENTS,
  CATEGORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_REELS,
  INITIAL_USER_PROFILE,
  AVAILABLE_CLUBS
} from './mockData.js';
import {
  getActiveUserId,
  setActiveUserId,
  initWebSocket,
  onBackendEvent,
  apiGetUsers,
  apiGetCurrentUser,
  apiUpdateUserProfile,
  apiGetClubs,
  apiToggleClubMembership,
  apiGetAnnouncements,
  apiCreateAnnouncement,
  apiDeleteAnnouncement,
  apiToggleAnnouncementRsvp,
  apiToggleAnnouncementBookmark,
  apiGetReels,
  apiCreateReel,
  apiGetApplications,
  apiGetItemApplications,
  apiSubmitApplication,
  apiUpdateApplicationStatus,
  apiGetConversations,
  apiStartConversation,
  apiSendMessage,
  apiGetKarmaLedger,
  apiGetTelemetry
} from './realBackend.js';


// ============================================================================
// State Management & LocalStorage
// ============================================================================

const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'campus_karma_announcements_v5',
  CONVERSATIONS: 'campus_karma_conversations_v5',
  REELS: 'campus_karma_reels_v5',
  USER_PROFILE: 'campus_karma_user_v5',
  APPLICATIONS: 'campus_karma_applications_v1',
  THEME: 'campus_karma_theme',
  CUSTOM_THEME: 'campus_karma_custom_theme'
};

function loadStorage(key, fallback) {
  const data = localStorage.getItem(key);
  if (data) {
    try { return JSON.parse(data); } catch (e) { console.error(e); }
  }
  return fallback;
}

let announcements = loadStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
let conversations = loadStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
let reels = loadStorage(STORAGE_KEYS.REELS, INITIAL_REELS);
let userProfile = loadStorage(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
let applications = loadStorage(STORAGE_KEYS.APPLICATIONS, []);

// Ensure user profile has joined clubs array
if (!userProfile.clubs || !Array.isArray(userProfile.clubs)) {
  userProfile.clubs = ["Design Guild", "AI & Code Collective", "Cultural Council"];
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
}

// Ensure club announcements from dataset are loaded
const hasClubPrivNotice = announcements.some(a => a.id === 'ann-club-priv-1');
if (!hasClubPrivNotice) {
  const clubAnnouncements = INITIAL_ANNOUNCEMENTS.filter(a => a.id && a.id.startsWith('ann-club-'));
  announcements.splice(1, 0, ...clubAnnouncements);
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

let state = {
  activeTab: 'announcements',
  activeCategory: 'all',
  filterUrgentOnly: false,
  filterVacanciesOnly: false,
  filterClubOnly: false,
  searchQuery: '',
  activeConversationId: conversations[0]?.id || null,
  mobileChatOpen: false,
  uiStyle: 'intelly',
  currentReelIndex: 0,
  activeReelApplying: null,
  demoPersona: 'user' // 'user' (Aditya) or 'partner' (Active chat lead)
};

// ============================================================================
// DOM Elements
// ============================================================================

const tabButtons = document.querySelectorAll('.primary-tab-btn');
const announcementsView = document.getElementById('announcementsView');
const sapphireView = document.getElementById('sapphireView');
const messagingView = document.getElementById('messagingView');
const reelsView = document.getElementById('reelsView');
const userKarmaBalance = document.getElementById('userKarmaBalance');
const messagingUnreadBadge = document.getElementById('messagingUnreadBadge');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const openThemeModalBtn = document.getElementById('openThemeModalBtn');
const toastContainer = document.getElementById('toastContainer');
const uiStyleSelectorBtn = document.getElementById('uiStyleSelectorBtn');
const uiStyleMenu = document.getElementById('uiStyleMenu');
const currentUiStyleLabel = document.getElementById('currentUiStyleLabel');
const mobileNavToggle = document.getElementById('mobileNavToggle');

document.addEventListener('click', (event) => {
  const profileTrigger = event.target.closest('#openUserSwitchBtn');
  if (!profileTrigger) return;
  event.preventDefault();
  event.stopPropagation();
  openProfileDrawer('overview');
}, true);

// Announcements View & Top-Left Controls
const categoryFilterBar = document.getElementById('categoryFilterBar');
const announcementsGrid = document.getElementById('announcementsGrid');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const announcementSearchInput = document.getElementById('announcementSearchInput');
const filterUrgentToggleBtn = document.getElementById('filterUrgentToggleBtn');
const filterVacanciesToggleBtn = document.getElementById('filterVacanciesToggleBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
let announcementResizeObserver = null;
const expandedAnnouncementIds = new Set();
let activeCardId = null;
let announcementAnimationDirection = null;
let announcementAnimationToken = 0;

function applyAnnouncementAnimationClasses(movingCardIds = new Set()) {
  if (!activeCardId || !announcementAnimationDirection || !announcementsGrid) return;

  announcementsGrid.querySelectorAll('.ig-post-card').forEach(card => {
    const isActiveCard = card.dataset.cardId === activeCardId;
    card.classList.remove('is-opening', 'is-closing', 'is-parallax-opening', 'is-parallax-closing');
    void card.offsetWidth;

    if (isActiveCard) {
      card.classList.add(announcementAnimationDirection === 'open' ? 'is-opening' : 'is-closing');
    } else if (movingCardIds.has(card.dataset.cardId)) {
      card.classList.add(announcementAnimationDirection === 'open' ? 'is-parallax-opening' : 'is-parallax-closing');
    }
  });
}

function animateAnnouncementCard(cardId, direction) {
  activeCardId = cardId;
  announcementAnimationDirection = direction;
  const animationToken = ++announcementAnimationToken;
  applyAnnouncementAnimationClasses();

  window.setTimeout(() => {
    if (animationToken !== announcementAnimationToken) return;
    announcementsGrid?.querySelectorAll('.ig-post-card').forEach(card => {
      card.classList.remove('is-opening', 'is-closing', 'is-parallax-opening', 'is-parallax-closing');
    });
    activeCardId = null;
    announcementAnimationDirection = null;
    requestAnimationFrame(layoutAnnouncementCards);
  }, 700);
}

function layoutAnnouncementCards() {
  if (!announcementsGrid) return;

  const cards = [...announcementsGrid.querySelectorAll('.ig-post-card')];
  if (!cards.length) return;

  const gridWidth = announcementsGrid.clientWidth;
  const isTwoColumn = window.innerWidth >= 760 && gridWidth >= 700;
  const columnCount = isTwoColumn ? 2 : 1;
  const gap = parseFloat(getComputedStyle(announcementsGrid).gap) || 24;
  const cardWidth = (gridWidth - gap * (columnCount - 1)) / columnCount;
  const columnHeights = Array(columnCount).fill(0);
  const previousPositions = new Map(cards.map(card => [card, card.getBoundingClientRect()]));
  const movingCardIds = new Set();
  const gridRect = announcementsGrid.getBoundingClientRect();

  announcementsGrid.classList.add('masonry-layout');

  cards.forEach(card => {
    const column = columnHeights.indexOf(Math.min(...columnHeights));
    card.style.width = `${cardWidth}px`;
    card.style.left = `${column * (cardWidth + gap)}px`;
    card.style.top = `${columnHeights[column]}px`;
    const previous = previousPositions.get(card);
    const targetLeft = gridRect.left + column * (cardWidth + gap);
    const targetTop = gridRect.top + columnHeights[column];
    if (previous && (Math.abs(previous.left - targetLeft) > 1 || Math.abs(previous.top - targetTop) > 1)) {
      movingCardIds.add(card.dataset.cardId);
    }
    columnHeights[column] += card.offsetHeight + gap;
  });

  announcementsGrid.style.height = `${Math.max(...columnHeights) - gap}px`;

  requestAnimationFrame(() => {
    if (!activeCardId) {
      applyAnnouncementAnimationClasses();
    }
    cards.forEach(card => {
      const previous = previousPositions.get(card);
      const next = card.getBoundingClientRect();
      if (!previous || Math.abs(previous.top - next.top) < 1) return;
    });
  });
}

window.addEventListener('resize', () => {
  requestAnimationFrame(layoutAnnouncementCards);
});

// Profile Drawer
const profileDrawer = document.getElementById('profileDrawer');
const openProfileDrawerBtn = document.getElementById('openProfileDrawerBtn');
const closeProfileDrawerBtn = document.getElementById('closeProfileDrawerBtn');
const drawerUserHandle = document.getElementById('drawerUserHandle');
const drawerFullName = document.getElementById('drawerFullName');
const drawerSubHandle = document.getElementById('drawerSubHandle');
const drawerBio = document.getElementById('drawerBio');
const drawerFollowersCount = document.getElementById('drawerFollowersCount');
const drawerFollowingCount = document.getElementById('drawerFollowingCount');
const drawerCreationsCount = document.getElementById('drawerCreationsCount');
const drawerTagsRow = document.getElementById('drawerTagsRow');
const drawerTestimonialText = document.getElementById('drawerTestimonialText');
const drawerTestimonialAuthor = document.getElementById('drawerTestimonialAuthor');
const drawerTestimonialHandle = document.getElementById('drawerTestimonialHandle');
const drawerMsgBtn = document.getElementById('drawerMsgBtn');

// Messaging Elements
const conversationsListContainer = document.getElementById('conversationsListContainer');
const chatSearchInput = document.getElementById('chatSearchInput');
const chatBackMobileBtn = document.getElementById('chatBackMobileBtn');
const chatMainPane = document.getElementById('chatMainPane');
const activePartnerOnlineDot = document.getElementById('activePartnerOnlineDot');
const activePartnerName = document.getElementById('activePartnerName');
const activePartnerStatus = document.getElementById('activePartnerStatus');
const activeChatTopic = document.getElementById('activeChatTopic');
const chatMessagesStream = document.getElementById('chatMessagesStream');
const chatComposerForm = document.getElementById('chatComposerForm');
const chatMessageInput = document.getElementById('chatMessageInput');

// Reels Elements
const reelsDeck = document.getElementById('reelsDeck');
const prevReelBtn = document.getElementById('prevReelBtn');
const nextReelBtn = document.getElementById('nextReelBtn');
const openCreateReelModalBtn = document.getElementById('openCreateReelModalBtn');

// Modals
const detailModal = document.getElementById('detailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const detailModalBody = document.getElementById('detailModalBody');
const modalCategoryBadge = document.getElementById('modalCategoryBadge');
const modalUrgentBadge = document.getElementById('modalUrgentBadge');
const modalRsvpBtn = document.getElementById('modalRsvpBtn');
const modalBookmarkBtn = document.getElementById('modalBookmarkBtn');
const modalShareBtn = document.getElementById('modalShareBtn');
const modalMessageOrganizerBtn = document.getElementById('modalMessageOrganizerBtn');

const createModal = document.getElementById('createModal');
const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
const cancelCreateBtn = document.getElementById('cancelCreateBtn');
const createAnnouncementForm = document.getElementById('createAnnouncementForm');

const createReelModal = document.getElementById('createReelModal');
const closeCreateReelModalBtn = document.getElementById('closeCreateReelModalBtn');
const cancelCreateReelBtn = document.getElementById('cancelCreateReelBtn');
const createReelForm = document.getElementById('createReelForm');

const applyGigModal = document.getElementById('applyGigModal');
const closeApplyGigModalBtn = document.getElementById('closeApplyGigModalBtn');
const cancelApplyGigBtn = document.getElementById('cancelApplyGigBtn');
const confirmAcceptGigBtn = document.getElementById('confirmAcceptGigBtn');
const applyGigModalBody = document.getElementById('applyGigModalBody');

// Theme Modal Elements
const themeModal = document.getElementById('themeModal');
const closeThemeModalBtn = document.getElementById('closeThemeModalBtn');
const cancelThemeModalBtn = document.getElementById('cancelThemeModalBtn');
const saveThemeBtn = document.getElementById('saveThemeBtn');
const resetThemeBtn = document.getElementById('resetThemeBtn');
const themePreviewBox = document.getElementById('themePreviewBox');

// ============================================================================
// Utilities: Icons & Confetti & Toasts
// ============================================================================

export function refreshIcons() {
  createIcons({
    icons: {
      Bell,
      MessageSquare,
      Play,
      Sparkles,
      Mail,
      Send,
      Search,
      Plus,
      ArrowLeft,
      Clipboard,
      Briefcase,
      Zap,
      Users,
      Flame,
      GraduationCap,
      Cpu,
      MapPin,
      Clock,
      CheckCircle,
      Bookmark,
      Palette,
      RotateCcw,
      Heart,
      MoreHorizontal,
      Layout,
      ChevronDown,
      Check,
      Maximize2,
      ChevronLeft,
      ChevronRight,
      Activity,
      Calendar,
      Radio,
      Award,
      CheckSquare,
      BarChart2,
      Sliders,
      SlidersHorizontal,
      Eye,
      SkipForward,
      ArrowRight,
      ShieldCheck,
      Shield,
      Lock,
      Globe,
      User,
      Edit3,
      Copy,
      Smartphone,
      Menu,
      X,
      Settings,
      LogOut,
      Coins,
      Landmark,
      Bot,
      Rocket,
      Wrench,
      Database,
      Share2,
      Megaphone,
      Video,
      FileText
    }
  });
}

export function triggerConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a']
  });
}

export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="font-weight: 600;">${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

function updateKarmaDisplay() {
  userKarmaBalance.textContent = userProfile.karmaPoints.toLocaleString();
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
}

function formatRelativeTime(dateString) {
  const diffMinutes = Math.floor((new Date() - new Date(dateString)) / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function formatChatTimestamp(rawTs) {
  if (!rawTs) return '';
  const str = String(rawTs).trim();
  if (str.toLowerCase() === 'yesterday') return 'Yesterday';
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?$/i;
  const match = str.match(timeRegex);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    let meridiem = (match[3] || '').toUpperCase();
    if (!meridiem) {
      meridiem = hour >= 12 ? 'PM' : 'AM';
      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;
    }
    const padHour = String(hour).padStart(2, '0');
    return `${padHour}:${minute} ${meridiem}`;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  return str;
}

// ============================================================================
// TABS NAVIGATION CONTROLLER (Announcements, Messaging, Marketing / Reels)
// ============================================================================

function switchTab(tabName) {
  state.activeTab = tabName;
  document.body.setAttribute('data-active-tab', tabName);
  document.documentElement.setAttribute('data-active-tab', tabName);
  document.querySelector('.app-header')?.classList.remove('mobile-nav-open');
  mobileNavToggle?.setAttribute('aria-expanded', 'false');

  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  announcementsView.classList.toggle('active', tabName === 'announcements');
  messagingView.classList.toggle('active', tabName === 'messaging');
  reelsView.classList.toggle('active', tabName === 'reels');

  // Crimson Glass Dynamic Background Transition between tab-specific surreal artwork
  const slideAnnouncements = document.getElementById('crimsonSlideAnnouncements');
  const slideMessaging = document.getElementById('crimsonSlideMessaging');
  const slideFeels = document.getElementById('crimsonSlideFeels');
  if (slideAnnouncements && slideMessaging && slideFeels) {
    slideAnnouncements.classList.toggle('active', tabName === 'announcements');
    slideMessaging.classList.toggle('active', tabName === 'messaging');
    slideFeels.classList.toggle('active', tabName === 'reels');
  }

  // Intelly Sidebar active navigation sync
  document.querySelectorAll('.intelly-nav-link[data-tab-target]').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab-target') === tabName);
  });

  const appFooter = document.querySelector('.app-footer');
  if (appFooter) {
    appFooter.style.display = tabName === 'announcements' ? 'block' : 'none';
  }

  if (tabName === 'announcements') {
    renderAnnouncements();
    renderApplicationsList();
  } else if (tabName === 'messaging') {
    renderConversationsList();
    renderActiveChat();
    updateMobileChatView();
    updatePersonaUI();
  } else if (tabName === 'reels') {
    renderActiveReel();
  }

  refreshIcons();
}


tabButtons.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
});

// ============================================================================
// USER PROFILE & APPLICATIONS LOCAL DATABASE CONTROLLER
// ============================================================================

function syncUserProfileToUI() {
  if (userKarmaBalance) userKarmaBalance.textContent = userProfile.karmaPoints.toLocaleString();
  const avatarSpan = document.getElementById('headerProfileAvatar');
  if (avatarSpan) avatarSpan.textContent = userProfile.avatarLetter || userProfile.name.substring(0, 2).toUpperCase();

  // Drawer fields
  if (drawerUserHandle) drawerUserHandle.textContent = userProfile.handle;
  if (drawerFullName) drawerFullName.textContent = userProfile.name;
  if (drawerSubHandle) drawerSubHandle.textContent = `${userProfile.handle} • ${userProfile.department}`;
  if (drawerBio) drawerBio.textContent = userProfile.bio;
  if (drawerFollowersCount) drawerFollowersCount.textContent = userProfile.followers.toLocaleString();
  if (drawerFollowingCount) drawerFollowingCount.textContent = userProfile.following.toLocaleString();
  if (drawerCreationsCount) drawerCreationsCount.textContent = userProfile.creations.toLocaleString();
  if (drawerTagsRow && userProfile.tags) {
    drawerTagsRow.innerHTML = userProfile.tags.map(t => `<span class="skill-pill">${t}</span>`).join('');
  }

  // Active Clubs in Profile Dashboard Overview
  const drawerClubsList = document.getElementById('drawerClubsList');
  if (drawerClubsList && userProfile.clubs) {
    drawerClubsList.innerHTML = userProfile.clubs.map(c => `
      <div class="project-item-pill club-badge-pill">
        <span class="club-status-dot"></span>
        <span>${c}</span>
      </div>
    `).join('');
  }

  const drawerManageClubsBtn = document.getElementById('drawerManageClubsBtn');
  if (drawerManageClubsBtn) {
    drawerManageClubsBtn.onclick = (e) => {
      e.stopPropagation();
      switchProfileDashboardTab('edit');
    };
  }

  // Intelly Dossier Sync
  const intellyAvatarRing = document.getElementById('intellyAvatarRing');
  const intellyDossierName = document.getElementById('intellyDossierName');
  const intellyDossierCode = document.getElementById('intellyDossierCode');
  const intellyStudentRegCode = document.getElementById('intellyStudentRegCode');
  const intellyDossierKarma = document.getElementById('intellyDossierKarma');
  const intellyDossierTags = document.getElementById('intellyDossierTags');
  const intellyDossierClubs = document.getElementById('intellyDossierClubs');

  if (intellyAvatarRing) intellyAvatarRing.textContent = userProfile.avatarLetter || userProfile.name.substring(0, 2).toUpperCase();
  if (intellyDossierName) intellyDossierName.textContent = userProfile.name;
  if (intellyDossierCode) intellyDossierCode.textContent = `${userProfile.studentId || '2023-CS-042'} • ${userProfile.department}`;
  if (intellyStudentRegCode) intellyStudentRegCode.textContent = `ST-${userProfile.studentId || '2023-042'}`;
  if (intellyDossierKarma) intellyDossierKarma.textContent = `${userProfile.karmaPoints.toLocaleString()} KP`;
  if (intellyDossierTags && userProfile.tags) {
    const chipClasses = ['chip-pink', 'chip-lilac', 'chip-amber', 'chip-mint'];
    intellyDossierTags.innerHTML = userProfile.tags.slice(0, 3).map((t, i) => `
      <span class="intelly-chip ${chipClasses[i % chipClasses.length]}">${t}</span>
    `).join('');
  }

  // Intelly Joined Clubs Chips with Manage Link
  if (intellyDossierClubs && userProfile.clubs) {
    intellyDossierClubs.innerHTML = userProfile.clubs.map(c => `
      <span class="intelly-chip chip-lilac" style="font-weight: 700;"><i data-lucide="landmark" class="lucide-icon-xs"></i> ${c}</span>
    `).join('');
  }

  const dossierManageClubsBtn = document.getElementById('dossierManageClubsBtn');
  if (dossierManageClubsBtn) {
    dossierManageClubsBtn.onclick = (e) => {
      e.stopPropagation();
      openProfileDrawer('edit');
    };
  }
}

function openEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  if (!modal) return;

  const fName = document.getElementById('editFullName');
  const fHandle = document.getElementById('editHandle');
  const fId = document.getElementById('editStudentId');
  const fDept = document.getElementById('editDepartment');
  const fAvatar = document.getElementById('editAvatarLetter');
  const fTags = document.getElementById('editTags');
  const fBio = document.getElementById('editBio');

  if (fName) fName.value = userProfile.name || '';
  if (fHandle) fHandle.value = userProfile.handle || '';
  if (fId) fId.value = userProfile.studentId || '2023-CS-042';
  if (fDept) fDept.value = userProfile.department || '';
  if (fAvatar) fAvatar.value = userProfile.avatarLetter || '';
  if (fTags) fTags.value = (userProfile.tags || []).join(', ');
  if (fBio) fBio.value = userProfile.bio || '';

  const editClubsContainer = document.getElementById('editClubsContainer');
  if (editClubsContainer) {
    const userClubs = userProfile.clubs || [];
    editClubsContainer.innerHTML = AVAILABLE_CLUBS.map(c => {
      const isChecked = userClubs.includes(c.name);
      return `
        <label class="club-checkbox-item ${isChecked ? 'active' : ''}">
          <input type="checkbox" name="modalClubs" value="${c.name}" ${isChecked ? 'checked' : ''} />
          <span class="club-cb-icon">${c.icon}</span>
          <div class="club-cb-info">
            <strong>${c.name}</strong>
            <small>${c.description}</small>
          </div>
        </label>
      `;
    }).join('');

    editClubsContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.onchange = () => {
        input.closest('.club-checkbox-item').classList.toggle('active', input.checked);
      };
    });
  }

  if (typeof modal.showModal === 'function') modal.showModal();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function ensureInitialUserPosts() {
  const hasUserAnn = announcements.some(a => a.isUserPost || (a.organizer && a.organizer.name === userProfile.name) || a.authorHandle === userProfile.handle);
  if (!hasUserAnn) {
    announcements.unshift({
      id: 'ann-user-demo-1',
      title: 'Wanted: Student UI/UX Lead for Campus Hackathon Portal v2.4',
      category: 'vacancies',
      categoryLabel: 'Club Vacancy',
      isVacancy: true,
      isUrgent: false,
      isUserPost: true,
      authorHandle: userProfile.handle,
      openPositions: 3,
      claimedPositions: 1,
      compensation: '1,200 Karma Points + Council Lead Badge',
      accentColor: '#f59e0b',
      icon: 'briefcase',
      clubName: 'Design Guild',
      isClubOnly: false,
      organizer: {
        name: userProfile.name,
        role: 'Scholar Contributor • Design Guild',
        avatarLetter: userProfile.avatarLetter || 'AV'
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      summary: 'Looking for an energetic student designer to collaborate on wireframes and Figma components for the upcoming 48-hour inter-college hackathon.',
      content: 'Join our core technical design crew! Work directly with college societies to deploy production-grade portals for 800+ participants.',
      tags: ['Vacancy', 'Design', 'UI/UX', 'Hackathon'],
      rsvps: 8,
      hasRsvpd: false
    });
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }

  const hasUserReel = reels.some(r => r.isUserPost || r.clientName === userProfile.name || r.authorHandle === userProfile.handle);
  if (!hasUserReel) {
    reels.unshift({
      id: 'reel-user-demo-1',
      title: 'Frontend Dev Wanted: Realtime Campus Event Map',
      clientName: userProfile.name,
      clientRole: 'Campus Project Lead',
      avatarLetter: userProfile.avatarLetter || 'AV',
      isUserPost: true,
      authorHandle: userProfile.handle,
      problemStatement: 'Building an interactive live map of college halls, auditoriums, and open-air stages with real-time crowd heatmaps for orientation week.',
      skillsRequired: ['Leaflet', 'React', 'WebSocket', 'Tailwind'],
      bountyKarma: 1800,
      bountyCash: '₹4,500',
      deadline: 'Sunday Evening',
      urgency: '2 Spots Open',
      slotsAvailable: 2,
      likesCount: 94,
      isLiked: false
    });
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }
}

function populateDashEditForm() {
  const fName = document.getElementById('dashEditFullName');
  const fHandle = document.getElementById('dashEditHandle');
  const fId = document.getElementById('dashEditStudentId');
  const fDept = document.getElementById('dashEditDepartment');
  const fAvatar = document.getElementById('dashEditAvatarLetter');
  const fTags = document.getElementById('dashEditTags');
  const fBio = document.getElementById('dashEditBio');

  if (fName) fName.value = userProfile.name || '';
  if (fHandle) fHandle.value = userProfile.handle || '';
  if (fId) fId.value = userProfile.studentId || '2023-CS-042';
  if (fDept) fDept.value = userProfile.department || '';
  if (fAvatar) fAvatar.value = userProfile.avatarLetter || '';
  if (fTags) fTags.value = (userProfile.tags || []).join(', ');
  if (fBio) fBio.value = userProfile.bio || '';

  const clubsContainer = document.getElementById('dashEditClubsContainer');
  if (clubsContainer) {
    const userClubs = userProfile.clubs || [];
    clubsContainer.innerHTML = AVAILABLE_CLUBS.map(c => {
      const isChecked = userClubs.includes(c.name);
      return `
        <label class="club-checkbox-item ${isChecked ? 'active' : ''}">
          <input type="checkbox" name="dashClubs" value="${c.name}" ${isChecked ? 'checked' : ''} />
          <span class="club-cb-icon">${c.icon}</span>
          <div class="club-cb-info">
            <strong>${c.name}</strong>
            <small>${c.description}</small>
          </div>
        </label>
      `;
    }).join('');

    clubsContainer.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.onchange = () => {
        input.closest('.club-checkbox-item').classList.toggle('active', input.checked);
      };
    });
  }
}

function setupDashboardProfileEditing() {
  const form = document.getElementById('dashEditProfileForm');
  const cancelBtn = document.getElementById('cancelDashEditBtn');

  if (cancelBtn) {
    cancelBtn.onclick = () => {
      populateDashEditForm();
      showToast('Form reset to saved profile', 'info');
    };
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const fName = document.getElementById('dashEditFullName')?.value.trim();
      const fHandle = document.getElementById('dashEditHandle')?.value.trim();
      const fId = document.getElementById('dashEditStudentId')?.value.trim();
      const fDept = document.getElementById('dashEditDepartment')?.value.trim();
      const fAvatar = document.getElementById('dashEditAvatarLetter')?.value.trim();
      const fTags = document.getElementById('dashEditTags')?.value.trim();
      const fBio = document.getElementById('dashEditBio')?.value.trim();

      if (fName) userProfile.name = fName;
      if (fHandle) userProfile.handle = fHandle.startsWith('@') ? fHandle : `@${fHandle}`;
      if (fId) userProfile.studentId = fId;
      if (fDept) userProfile.department = fDept;
      userProfile.avatarLetter = fAvatar ? fAvatar.toUpperCase() : userProfile.name.substring(0, 2).toUpperCase();
      if (fTags) userProfile.tags = fTags.split(',').map(t => t.trim().startsWith('@') ? t.trim() : `@${t.trim()}`).filter(Boolean);
      if (fBio) userProfile.bio = fBio;

      const checkedClubs = Array.from(document.querySelectorAll('#dashEditClubsContainer input[name="dashClubs"]:checked')).map(cb => cb.value);
      userProfile.clubs = checkedClubs;

      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      syncUserProfileToUI();
      renderAnnouncements();
      renderCategoryBar();
      triggerConfetti();
      showToast('Profile & Club Memberships updated successfully!', 'success');
      switchProfileDashboardTab('overview');
    };
  }
}

function switchProfileDashboardTab(tabName) {
  const tabsNav = document.getElementById('profileDashboardTabs');
  if (!tabsNav) return;

  const tabButtons = tabsNav.querySelectorAll('.profile-tab-btn');
  const tabPanels = document.querySelectorAll('.profile-tab-panel');

  tabButtons.forEach(btn => {
    const target = btn.getAttribute('data-profile-tab');
    btn.classList.toggle('active', target === tabName);
  });

  const panelMap = {
    overview: 'profileTabOverview',
    edit: 'profileTabEdit',
    posts: 'profileTabPosts',
    applications: 'profileTabApplications'
  };

  tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === panelMap[tabName]);
  });

  if (tabName === 'edit') {
    populateDashEditForm();
  } else if (tabName === 'posts') {
    renderUserPosts();
  } else if (tabName === 'applications') {
    renderApplicationsList();
  }

  refreshIcons();
}

function initProfileDashboardTabs() {
  const tabsNav = document.getElementById('profileDashboardTabs');
  if (tabsNav) {
    tabsNav.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const tabName = btn.getAttribute('data-profile-tab');
        if (tabName) switchProfileDashboardTab(tabName);
      };
    });
  }

  const dashNewPostBtn = document.getElementById('dashNewPostBtn');
  if (dashNewPostBtn) {
    dashNewPostBtn.onclick = () => {
      profileDrawer.close();
      createModal.showModal();
    };
  }
}

function deleteUserPost(postId, postType) {
  if (postType === 'feel') {
    reels = reels.filter(r => r.id !== postId);
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
    renderFeelsFeed();
  } else {
    announcements = announcements.filter(a => a.id !== postId);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    renderAnnouncements();
  }
  renderUserPosts();
  showToast('Post removed from campus board', 'info');
}

function handleViewUserPost(postId, postType) {
  profileDrawer.close();
  if (postType === 'feel') {
    switchTab('reels');
    const idx = reels.findIndex(r => r.id === postId);
    if (idx !== -1) {
      state.currentReelIndex = idx;
      renderFeelsFeed();
    }
  } else {
    switchTab('announcements');
    const notice = announcements.find(a => a.id === postId);
    if (notice) {
      openDetailModal(notice);
    }
  }
}

function renderUserPosts() {
  const container = document.getElementById('userPostsList');
  const badge = document.getElementById('profilePostsBadge');

  const userAnnouncements = announcements
    .filter(a => a.isUserPost || (a.organizer && a.organizer.name === userProfile.name) || a.authorHandle === userProfile.handle)
    .map(a => ({ ...a, postType: a.isVacancy ? 'vacancy' : 'notice' }));

  const userReels = reels
    .filter(r => r.isUserPost || r.clientName === userProfile.name || r.authorHandle === userProfile.handle)
    .map(r => ({ ...r, postType: 'feel' }));

  const allUserPosts = [...userAnnouncements, ...userReels];

  if (badge) {
    badge.textContent = `${allUserPosts.length}`;
  }

  if (!container) return;

  if (allUserPosts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary); background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
        <i data-lucide="file-text" style="width: 2rem; height: 2rem; display: block; margin: 0 auto 0.5rem; opacity: 0.6;"></i>
        <strong style="display: block; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.3rem;">No posts published yet</strong>
        <p style="font-size: 0.78rem; margin-bottom: 1rem;">Post announcements, club vacancies, or gig feels to recruit peers.</p>
        <button type="button" class="btn-primary" id="emptyStateNewPostBtn" style="padding: 0.4rem 0.9rem; font-size: 0.78rem; border-radius: 9999px;">
          + Create Announcement
        </button>
      </div>
    `;
    const emptyBtn = document.getElementById('emptyStateNewPostBtn');
    if (emptyBtn) {
      emptyBtn.onclick = () => {
        profileDrawer.close();
        createModal.showModal();
      };
    }
    return;
  }

  container.innerHTML = allUserPosts.map(post => {
    let typeBadge = '';
    if (post.postType === 'vacancy') {
      typeBadge = `<span class="user-post-type-badge badge-type-vacancy"><i data-lucide="briefcase" class="lucide-icon-xs"></i> Vacancy</span>`;
    } else if (post.postType === 'feel') {
      typeBadge = `<span class="user-post-type-badge badge-type-feel"><i data-lucide="video" class="lucide-icon-xs"></i> Feel Gig</span>`;
    } else {
      typeBadge = `<span class="user-post-type-badge badge-type-notice"><i data-lucide="megaphone" class="lucide-icon-xs"></i> Notice</span>`;
    }

    const subtitle = post.postType === 'feel'
      ? `${post.bountyKarma || 1200} KP • ${post.bountyCash || 'Perks'}`
      : `${post.compensation || 'Campus Karma Credit'} • ${post.rsvps || 0} RSVPs`;

    return `
      <div class="user-post-card" data-post-id="${post.id}" data-post-type="${post.postType}">
        <div class="user-post-card-header">
          <div style="display: flex; flex-direction: column; gap: 0.2rem; flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              ${typeBadge}
            </div>
            <span class="user-post-title">${escapeHtml(post.title)}</span>
          </div>
        </div>
        <div class="user-post-meta-row">
          <span>${subtitle}</span>
          <div class="user-post-actions">
            <button type="button" class="btn-post-action action-view" data-post-id="${post.id}" data-post-type="${post.postType}">
              View
            </button>
            <button type="button" class="btn-post-action action-delete" data-post-id="${post.id}" data-post-type="${post.postType}">
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Wire action buttons
  container.querySelectorAll('.action-view').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-post-id');
      const pType = btn.getAttribute('data-post-type');
      handleViewUserPost(pId, pType);
    };
  });

  container.querySelectorAll('.action-delete').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-post-id');
      const pType = btn.getAttribute('data-post-type');
      deleteUserPost(pId, pType);
    };
  });
}

function setupProfileEditing() {
  const editBtn = document.getElementById('editProfileBtn');
  const modal = document.getElementById('editProfileModal');
  const closeBtn = document.getElementById('closeEditProfileModalBtn');
  const cancelBtn = document.getElementById('cancelEditProfileBtn');
  const form = document.getElementById('editProfileForm');

  if (editBtn) {
    editBtn.onclick = () => {
      switchProfileDashboardTab('edit');
    };
  }
  if (closeBtn && modal) closeBtn.onclick = () => modal.close();
  if (cancelBtn && modal) cancelBtn.onclick = () => modal.close();

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const fName = document.getElementById('editFullName')?.value.trim();
      const fHandle = document.getElementById('editHandle')?.value.trim();
      const fId = document.getElementById('editStudentId')?.value.trim();
      const fDept = document.getElementById('editDepartment')?.value.trim();
      const fAvatar = document.getElementById('editAvatarLetter')?.value.trim();
      const fTags = document.getElementById('editTags')?.value.trim();
      const fBio = document.getElementById('editBio')?.value.trim();

      if (fName) userProfile.name = fName;
      if (fHandle) userProfile.handle = fHandle.startsWith('@') ? fHandle : `@${fHandle}`;
      if (fId) userProfile.studentId = fId;
      if (fDept) userProfile.department = fDept;
      userProfile.avatarLetter = fAvatar ? fAvatar.toUpperCase() : userProfile.name.substring(0, 2).toUpperCase();
      if (fTags) userProfile.tags = fTags.split(',').map(t => t.trim().startsWith('@') ? t.trim() : `@${t.trim()}`).filter(Boolean);
      if (fBio) userProfile.bio = fBio;

      const checkedClubs = Array.from(document.querySelectorAll('#editClubsContainer input[name="modalClubs"]:checked')).map(cb => cb.value);
      if (checkedClubs.length > 0) userProfile.clubs = checkedClubs;

      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      syncUserProfileToUI();
      renderAnnouncements();
      renderCategoryBar();
      if (modal) modal.close();
      triggerConfetti();
      showToast('Scholar profile updated successfully!', 'success');
    };
  }

  setupDashboardProfileEditing();
  initProfileDashboardTabs();
  ensureInitialUserPosts();
}

// ----------------------------------------------------------------------------
// Local Applications Database Controller
// ----------------------------------------------------------------------------

function recordApplication(item, type = 'announcement') {
  const existing = applications.find(a => a.itemId === item.id);
  if (existing) return;

  const app = {
    id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    itemId: item.id,
    type,
    title: item.title,
    organizer: item.organizer ? item.organizer.name : (item.clientName || 'Campus Society'),
    role: item.organizer ? item.organizer.role : (item.clientRole || 'Lead'),
    compensation: item.compensation || (item.bountyKarma ? `+${item.bountyKarma} KP` : 'Campus Karma Credit'),
    status: 'Applied',
    appliedAt: new Date().toISOString()
  };

  applications.unshift(app);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  renderApplicationsList();
}

function removeApplicationByItemId(itemId) {
  applications = applications.filter(a => a.itemId !== itemId);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  renderApplicationsList();
}

function withdrawApplication(appId) {
  const app = applications.find(a => a.id === appId);
  if (!app) return;

  // If corresponding announcement, update its rsvp status
  const ann = announcements.find(a => a.id === app.itemId);
  if (ann && ann.hasRsvpd) {
    ann.hasRsvpd = false;
    ann.rsvps = Math.max(0, (ann.rsvps || 1) - 1);
    if (ann.claimedPositions !== undefined) ann.claimedPositions = Math.max(0, ann.claimedPositions - 1);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    renderAnnouncements();
  }

  applications = applications.filter(a => a.id !== appId);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  renderApplicationsList();
  showToast(`Withdrew application for "${app.title.substring(0, 24)}..."`, 'info');
}

function renderApplicationsList() {
  const drawerList = document.getElementById('drawerApplicationsList');
  const drawerCount = document.getElementById('drawerAppsCount');
  const intellyCount = document.getElementById('intellyActiveAppsCount');
  const intellyBadge = document.getElementById('intellyDocketBadge');
  const intellyDocketList = document.getElementById('intellyDocketAppsList');
  const profileAppsBadge = document.getElementById('profileAppsBadge');

  const countStr = `${applications.length}`;
  if (drawerCount) drawerCount.textContent = countStr;
  if (profileAppsBadge) profileAppsBadge.textContent = countStr;
  if (intellyCount) intellyCount.textContent = `${countStr} Active`;
  if (intellyBadge) intellyBadge.textContent = `${countStr} Active`;

  if (drawerList) {
    if (applications.length === 0) {
      drawerList.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-secondary); padding: 0.6rem 0; text-align: center;">
          No active applications filed yet. Apply to vacancies in Announcements or claim a Feel gig!
        </div>
      `;
    } else {
      drawerList.innerHTML = applications.map(app => `
        <div class="app-applied-card">
          <div class="app-applied-card-header">
            <span class="app-applied-title">${app.title}</span>
            <span class="app-status-badge app-status-applied">${app.status}</span>
          </div>
          <div class="app-applied-meta">
            <span><i data-lucide="user" class="lucide-icon-xs"></i> ${app.organizer} • <i data-lucide="zap" class="lucide-icon-xs"></i> ${app.compensation}</span>
            <button class="btn-withdraw-app" data-app-id="${app.id}">Withdraw</button>
          </div>
        </div>
      `).join('');

      drawerList.querySelectorAll('.btn-withdraw-app').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const appId = btn.getAttribute('data-app-id');
          withdrawApplication(appId);
        };
      });
    }
  }

  if (intellyDocketList) {
    if (applications.length === 0) {
      intellyDocketList.innerHTML = `
        <div style="font-size: 0.78rem; color: #71717a; padding: 0.4rem 0;">
          No pending applications. Check out live club vacancies!
        </div>
      `;
    } else {
      intellyDocketList.innerHTML = applications.slice(0, 3).map(app => `
        <div class="docket-app-item">
          <div style="display: flex; flex-direction: column; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
            <strong style="font-size: 0.76rem; overflow: hidden; text-overflow: ellipsis;">${app.title}</strong>
            <small style="font-size: 0.68rem; color: #a1a1aa;">${app.organizer}</small>
          </div>
          <span class="app-status-badge app-status-applied" style="font-size: 0.65rem; padding: 0.1rem 0.35rem;">Active</span>
        </div>
      `).join('');
    }
  }
}

function openProfileDrawer(defaultTab = 'overview') {
  syncUserProfileToUI();
  populateDashEditForm();
  renderUserPosts();
  renderApplicationsList();

  if (userProfile.testimonial && drawerTestimonialText) {
    drawerTestimonialText.textContent = `"${userProfile.testimonial.text}"`;
    if (drawerTestimonialAuthor) drawerTestimonialAuthor.textContent = userProfile.testimonial.author;
    if (drawerTestimonialHandle) drawerTestimonialHandle.textContent = userProfile.testimonial.handle;
  }

  drawerMsgBtn.onclick = () => {
    profileDrawer.close();
    switchTab('messaging');
  };

  switchProfileDashboardTab(defaultTab);
  profileDrawer.showModal();
  refreshIcons();
}

openProfileDrawerBtn.onclick = () => {
  document.getElementById('userSwitchMenu').style.display = 'none';
  openProfileDrawer('overview');
};
closeProfileDrawerBtn.onclick = () => profileDrawer.close();
profileDrawer.onclick = (e) => { if (e.target === profileDrawer) profileDrawer.close(); };
setupProfileEditing();

// ============================================================================
// VIEW 1: ANNOUNCEMENTS & VACANCIES (Clean & Minimalist)
// ============================================================================

const filterClubOnlyToggleBtn = document.getElementById('filterClubOnlyToggleBtn');

function updateFilterControls() {
  if (filterUrgentToggleBtn) {
    filterUrgentToggleBtn.classList.toggle('active', state.filterUrgentOnly);
  }
  if (filterVacanciesToggleBtn) {
    filterVacanciesToggleBtn.classList.toggle('active', state.filterVacanciesOnly);
  }
  if (filterClubOnlyToggleBtn) {
    filterClubOnlyToggleBtn.classList.toggle('active', state.filterClubOnly);
  }
  if (resetFiltersBtn) {
    const hasActive = state.activeCategory !== 'all' ||
      state.filterUrgentOnly ||
      state.filterVacanciesOnly ||
      state.filterClubOnly ||
      state.searchQuery.length > 0;
    resetFiltersBtn.style.display = hasActive ? 'inline-flex' : 'none';
  }
}

function getVisibleAnnouncements() {
  const userClubs = userProfile.clubs || [];
  return announcements.filter(item => {
    // If club-only private announcement, only enrolled members can view it
    if (item.isClubOnly && !userClubs.includes(item.clubName)) {
      return false;
    }
    return true;
  });
}

function renderCategoryBar() {
  if (!categoryFilterBar) return;
  categoryFilterBar.innerHTML = '';

  const visibleAnnouncements = getVisibleAnnouncements();

  CATEGORIES.forEach(cat => {
    const count = cat.id === 'all'
      ? visibleAnnouncements.length
      : visibleAnnouncements.filter(a => a.category === cat.id).length;

    const chip = document.createElement('button');
    chip.className = `category-chip ${state.activeCategory === cat.id ? 'active' : ''}`;
    chip.innerHTML = `
      <i data-lucide="${cat.icon}" class="lucide-icon-sm"></i>
      <span>${cat.label}</span>
      <span class="category-count-badge">${count}</span>
    `;

    chip.onclick = () => {
      state.activeCategory = cat.id;
      renderCategoryBar();
      updateFilterControls();
      renderAnnouncements();
      refreshIcons();
    };

    categoryFilterBar.appendChild(chip);
  });
}

function resetAllFilters() {
  state.activeCategory = 'all';
  state.filterUrgentOnly = false;
  state.filterVacanciesOnly = false;
  state.filterClubOnly = false;
  state.searchQuery = '';
  if (announcementSearchInput) announcementSearchInput.value = '';
  renderCategoryBar();
  updateFilterControls();
  renderAnnouncements();
  refreshIcons();
}

if (filterUrgentToggleBtn) {
  filterUrgentToggleBtn.onclick = () => {
    state.filterUrgentOnly = !state.filterUrgentOnly;
    updateFilterControls();
    renderAnnouncements();
    refreshIcons();
  };
}

if (filterVacanciesToggleBtn) {
  filterVacanciesToggleBtn.onclick = () => {
    state.filterVacanciesOnly = !state.filterVacanciesOnly;
    updateFilterControls();
    renderAnnouncements();
    refreshIcons();
  };
}

// ----------------------------------------------------------------------------
// Announcements Category Tags Toggle Controller (Circular Vector Icon)
// ----------------------------------------------------------------------------
const categoryToggleBtn = document.getElementById('categoryToggleBtn');
const announcementsControlsBar = document.getElementById('announcementsControlsBar');

const savedCategoriesCollapsed = localStorage.getItem('fih_categories_collapsed');
// Default to collapsed so the top row tags are housed inside the circular vector icon
let isCategoriesCollapsed = savedCategoriesCollapsed !== null ? savedCategoriesCollapsed === 'true' : true;

function updateCategoryToggleState() {
  if (announcementsControlsBar) {
    announcementsControlsBar.classList.toggle('categories-collapsed', isCategoriesCollapsed);
  }
  if (categoryToggleBtn) {
    categoryToggleBtn.classList.toggle('active', !isCategoriesCollapsed);
    categoryToggleBtn.setAttribute('aria-expanded', String(!isCategoriesCollapsed));
    categoryToggleBtn.setAttribute('title', isCategoriesCollapsed ? 'Show Category Tags' : 'Hide Category Tags in Icon');
  }
  localStorage.setItem('fih_categories_collapsed', String(isCategoriesCollapsed));
}

if (categoryToggleBtn) {
  categoryToggleBtn.onclick = (e) => {
    e.stopPropagation();
    isCategoriesCollapsed = !isCategoriesCollapsed;
    updateCategoryToggleState();
  };
}

// Apply initial state
updateCategoryToggleState();

if (filterClubOnlyToggleBtn) {
  filterClubOnlyToggleBtn.onclick = () => {
    state.filterClubOnly = !state.filterClubOnly;
    updateFilterControls();
    renderAnnouncements();
    refreshIcons();
  };
}

if (announcementSearchInput) {
  announcementSearchInput.oninput = (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    updateFilterControls();
    renderAnnouncements();
  };
}

if (resetFiltersBtn) {
  resetFiltersBtn.onclick = resetAllFilters;
}

function renderAnnouncements() {
  if (!announcementsGrid) return;
  announcementsGrid.innerHTML = '';

  const userClubs = userProfile.clubs || [];
  const visibleAll = getVisibleAnnouncements();

  // Update Sapphire Bento Telemetry Stats Banner
  const totalNoticesCount = document.getElementById('sapphireTotalNoticesCount');
  if (totalNoticesCount) totalNoticesCount.textContent = visibleAll.length;

  const openSlotsCount = document.getElementById('sapphireOpenSlotsCount');
  if (openSlotsCount) {
    const totalSlots = visibleAll.reduce((sum, a) => sum + (a.openPositions ? Math.max(0, a.openPositions - (a.claimedPositions || 0)) : 0), 0);
    openSlotsCount.textContent = totalSlots;
  }

  const bountyPool = document.getElementById('sapphireBountyPool');
  if (bountyPool) {
    const totalKp = visibleAll.reduce((sum, a) => {
      const match = a.compensation?.match(/(\d+)\s*KP/i);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
    bountyPool.innerHTML = `${(totalKp / 1000).toFixed(1)}k <span style="font-size: 0.95rem; font-weight: 600;">KP</span>`;
  }

  // Update Crimson Glass Telemetry Count
  const crimsonCount = document.getElementById('crimsonActiveCount');
  if (crimsonCount) crimsonCount.textContent = visibleAll.length;

  const filtered = announcements.filter(item => {
    // 0. Club Privacy Check: if private to a club, only members of that club can see it!
    if (item.isClubOnly) {
      if (!userClubs.includes(item.clubName)) {
        return false;
      }
    }
    // 0b. Filter Club-Only Private Announcements
    if (state.filterClubOnly && !item.isClubOnly) {
      return false;
    }
    // 1. Category Filter
    if (state.activeCategory !== 'all' && item.category !== state.activeCategory) {
      return false;
    }
    // 2. Urgent Only Filter
    if (state.filterUrgentOnly && !item.isUrgent) {
      return false;
    }
    // 3. Open Vacancies Only Filter
    if (state.filterVacanciesOnly && !item.isVacancy && !(item.openPositions && item.openPositions > 0)) {
      return false;
    }
    // 4. Search Query Filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(q) || false;
      const summaryMatch = item.summary?.toLowerCase().includes(q) || false;
      const orgMatch = item.organizer?.name?.toLowerCase().includes(q) || false;
      const clubMatch = item.clubName?.toLowerCase().includes(q) || false;
      const tagMatch = item.tags?.some(t => t.toLowerCase().includes(q)) || false;
      if (!titleMatch && !summaryMatch && !orgMatch && !clubMatch && !tagMatch) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    announcementsGrid.innerHTML = `
      <div class="empty-announcements-card">
        <i data-lucide="search" style="width: 32px; height: 32px; opacity: 0.4;"></i>
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">No announcements found</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 380px;">No notices match your active category, filter, or club access. Try clearing filters to see all campus feeds.</p>
        <button class="btn-primary" id="emptyResetFiltersBtn" style="margin-top: 0.5rem; padding: 0.45rem 1.15rem;">
          Reset All Filters
        </button>
      </div>
    `;
    const emptyBtn = document.getElementById('emptyResetFiltersBtn');
    if (emptyBtn) {
      emptyBtn.onclick = resetAllFilters;
    }
    refreshIcons();
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'ig-post-card';
    card.dataset.cardId = item.id;
    const isExpanded = expandedAnnouncementIds.has(item.id);
    card.classList.add(isExpanded ? 'is-expanded' : 'is-collapsed');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', String(isExpanded));
    const positionsLeft = item.openPositions
      ? Math.max(0, item.openPositions - (item.claimedPositions || 0))
      : null;
    const progressPct = (item.openPositions && item.claimedPositions !== undefined)
      ? Math.min(100, Math.round((item.claimedPositions / item.openPositions) * 100))
      : null;

    const clubBadgeHtml = item.isClubOnly
      ? `<span class="club-privacy-badge badge-club-private" title="Exclusive to members of ${item.clubName}"><i data-lucide="lock" class="lucide-icon-xs"></i> ${item.clubName} (Members Only)</span>`
      : (item.clubName ? `<span class="club-privacy-badge badge-club-public" title="Public announcement from ${item.clubName}"><i data-lucide="globe" class="lucide-icon-xs"></i> ${item.clubName}</span>` : '');

    const orgName = item.organizer?.name || (typeof item.organizer === 'string' ? item.organizer : 'Student Lead');
    const orgLetter = item.organizer?.avatarLetter || orgName.substring(0, 2).toUpperCase();
    const orgAccent = item.organizer?.accent || 'var(--bg-surface-elevated)';

    card.innerHTML = `
      <!-- Instagram Post Header -->
      <header class="ig-post-header">
        <div class="ig-user-info" data-action="detail">
          <div class="ig-avatar-ring">
            <div class="ig-avatar-circle" style="border-color: var(--bg-surface); background: ${orgAccent};">
              ${orgLetter}
            </div>
          </div>
          <div class="ig-user-meta">
            <div class="ig-username-row">
              <span class="ig-username">${orgName}</span>
              <span class="ig-badge-dot">•</span>
              <span class="ig-category-tag">${item.categoryLabel || 'Notice'}</span>
              ${clubBadgeHtml}
              ${item.isUrgent ? `<span class="ig-urgent-dot" title="Urgent Notice"><i data-lucide="flame" class="lucide-icon-xs"></i></span>` : ''}
            </div>
            <span class="ig-sub-location">${item.location ? item.location.split(',')[0] : 'Campus Wide'} • ${formatRelativeTime(item.publishedAt)}</span>
          </div>
        </div>

        <button class="ig-more-btn" data-action="detail" title="View options & details">
          <i data-lucide="more-horizontal" class="lucide-icon-sm"></i>
        </button>
      </header>

      <!-- Instagram Post Main Notice Body -->
      <div class="ig-post-body" data-action="detail">
        <h3 class="ig-notice-title">${item.title}</h3>
        <p class="ig-notice-summary">${item.summary}</p>

        <!-- Compensation / Perk Pill -->
        ${item.compensation ? `
          <div class="ig-perk-pill">
            <span>${item.compensation}</span>
          </div>
        ` : ''}

        <!-- Slots / RSVP Progress Bar -->
        ${positionsLeft !== null ? `
          <div class="ig-slots-bar">
            <div class="ig-slots-info">
              <span><i data-lucide="zap" class="lucide-icon-xs"></i> <strong>${positionsLeft}</strong> of ${item.openPositions} slots open</span>
              <span class="ig-slots-pct">${progressPct}% filled</span>
            </div>
            <div class="ig-progress-track">
              <div class="ig-progress-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Instagram Actions Bar: Like/RSVP, Chat, Share, Bookmark -->
      <div class="ig-actions-bar">
        <div class="ig-actions-left">
          <button class="ig-action-btn ${item.hasRsvpd ? 'liked' : ''}" data-action="apply" title="${item.hasRsvpd ? 'Applied / Claimed' : 'RSVP / Claim'}">
            <i data-lucide="${item.hasRsvpd ? 'check-circle' : 'heart'}" class="lucide-icon"></i>
            <span class="ig-action-count">${item.rsvps || 0}</span>
          </button>

          <button class="ig-action-btn" data-action="message" title="Chat with Organizer">
            <i data-lucide="message-square" class="lucide-icon"></i>
            <span>Chat</span>
          </button>

          <button class="ig-action-btn" data-action="share" title="Share Notice">
            <i data-lucide="send" class="lucide-icon"></i>
          </button>
        </div>

        <div class="ig-actions-right">
          <button class="ig-action-btn ${item.isBookmarked ? 'saved' : ''}" data-action="bookmark" title="Bookmark Notice">
            <i data-lucide="bookmark" class="lucide-icon"></i>
          </button>
        </div>
      </div>

      <!-- Instagram Caption & Comments Section -->
      <div class="ig-caption-section">
        <div class="ig-likes-text">
          Liked by <strong>${item.rsvps || 0} students</strong>
        </div>

        <div class="ig-caption-text">
          <strong class="ig-caption-author">${orgName}</strong>
          <span class="ig-caption-body">${item.summary}</span>
        </div>

        ${item.tags && item.tags.length ? `
          <div class="ig-tags-row">
            ${item.tags.map(t => `<span class="ig-hashtag">#${t.replace(/\s+/g, '')}</span>`).join(' ')}
          </div>
        ` : ''}

        <button class="ig-view-all-btn" data-action="detail">
          View all requirements & official details...
        </button>
        <div class="ig-timestamp">${formatRelativeTime(item.publishedAt).toUpperCase()}</div>
      </div>
    `;

    const toggleExpanded = () => {
      const isExpanded = !expandedAnnouncementIds.has(item.id);
      if (isExpanded) {
        expandedAnnouncementIds.add(item.id);
      } else {
        expandedAnnouncementIds.delete(item.id);
      }
      card.classList.toggle('is-expanded', isExpanded);
      card.classList.toggle('is-collapsed', !isExpanded);
      card.setAttribute('aria-expanded', String(isExpanded));
      animateAnnouncementCard(item.id, isExpanded ? 'open' : 'close');

      requestAnimationFrame(layoutAnnouncementCards);
    };

    card.onclick = (e) => {
      const applyBtn = e.target.closest('[data-action="apply"]');
      const msgBtn = e.target.closest('[data-action="message"]');
      const shareBtn = e.target.closest('[data-action="share"]');
      const bookmarkBtn = e.target.closest('[data-action="bookmark"]');

      if (applyBtn) {
        e.stopPropagation();
        toggleRsvp(item.id);
      } else if (msgBtn) {
        e.stopPropagation();
        openChatForNotice(item.id);
      } else if (shareBtn) {
        e.stopPropagation();
        handleShareNotice(item);
      } else if (bookmarkBtn) {
        e.stopPropagation();
        toggleBookmark(item.id);
      } else {
        toggleExpanded();
      }
    };

    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExpanded();
      }
    };

    announcementsGrid.appendChild(card);
  });

  applyAnnouncementAnimationClasses();
  layoutAnnouncementCards();
  if (!announcementResizeObserver) {
    announcementResizeObserver = new ResizeObserver(() => {
      layoutAnnouncementCards();
    });
  }
  announcementResizeObserver.disconnect();
  announcementsGrid.querySelectorAll('.ig-post-card').forEach(card => announcementResizeObserver.observe(card));

  renderSlateStudio();
  refreshIcons();
}

function toggleBookmark(id) {
  const item = announcements.find(a => a.id === id);
  if (!item) return;
  item.isBookmarked = !item.isBookmarked;
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  renderAnnouncements();
  showToast(item.isBookmarked ? 'Notice bookmarked!' : 'Removed from bookmarks', 'info');
}

function handleShareNotice(item) {
  if (navigator.share) {
    navigator.share({
      title: item.title,
      text: item.summary,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${item.title} - ${window.location.href}`);
    showToast('Notice link copied to clipboard!', 'info');
  }
}

async function toggleRsvp(id) {
  try {
    const res = await apiToggleAnnouncementRsvp(id);
    const item = announcements.find(a => a.id === id);
    if (item) {
      item.hasRsvpd = res.hasRsvpd;
      item.rsvps = res.rsvps;
    }
    if (res.hasRsvpd) {
      triggerConfetti();
      showToast('RSVP confirmed on campus network!', 'success');
    } else {
      showToast('RSVP removed', 'info');
    }
    renderAnnouncements();
  } catch (err) {
    showToast(err.message, 'warning');
  }
}

async function openDetailModal(id) {
  const item = announcements.find(a => a.id === id);
  if (!item) return;

  const currentUserId = getActiveUserId();
  const isAuthor = item.authorId === currentUserId || item.isMine;

  modalCategoryBadge.textContent = item.categoryLabel || 'Notice';

  // Fetch real applications for this item from server
  let itemApps = [];
  try {
    itemApps = await apiGetItemApplications(item.id);
  } catch (e) {
    console.warn('Could not fetch applications for item', e);
  }

  const myApp = itemApps.find(a => a.applicantId === currentUserId);

  let applicantsSectionHtml = '';
  if (isAuthor) {
    applicantsSectionHtml = `
      <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
          <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #ffffff;">
            Review Applicants (${itemApps.length})
          </h4>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">Real-time Submissions</span>
        </div>
        ${itemApps.length === 0 ? `
          <div style="padding: 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.03); color: var(--text-secondary); font-size: 0.82rem; text-align: center;">
            No student applicants yet. Share this vacancy across campus!
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${itemApps.map(app => `
              <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.78rem;">
                      ${app.applicantAvatar || 'ST'}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 0.88rem; color: #ffffff;">${app.applicantName}</div>
                      <div style="font-size: 0.72rem; color: var(--text-secondary);">${app.applicantHandle} • ${app.applicantDepartment || 'Student'}</div>
                    </div>
                  </div>
                  <span style="padding: 0.2rem 0.55rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; background: ${app.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'accepted' ? 'rgba(59, 130, 246, 0.2)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${app.status === 'completed' ? '#10b981' : app.status === 'accepted' ? '#3b82f6' : app.status === 'rejected' ? '#ef4444' : '#f59e0b'};">
                    ${app.status}
                  </span>
                </div>
                <div style="background: rgba(0,0,0,0.25); padding: 0.6rem 0.75rem; border-radius: 6px; font-size: 0.82rem; color: #e4e4e7; margin-bottom: 0.65rem; border-left: 3px solid var(--accent-base, #6366f1);">
                  "${escapeHtml(app.pitch || 'Interested in this role!')}"
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
                  <button type="button" class="btn-rsvp-toggle btn-app-chat" data-applicant-id="${app.applicantId}" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;">
                    <i data-lucide="message-square" class="lucide-icon-xs"></i> Chat
                  </button>
                  ${app.status === 'pending' ? `
                    <button type="button" class="btn-rsvp-toggle btn-app-reject" data-app-id="${app.id}" style="padding: 0.35rem 0.65rem; font-size: 0.74rem; color: #ef4444; border-color: rgba(239,68,68,0.3);">
                      Decline
                    </button>
                    <button type="button" class="btn-primary btn-app-accept" data-app-id="${app.id}" style="padding: 0.35rem 0.75rem; font-size: 0.74rem; background: #10b981;">
                      ✓ Accept
                    </button>
                  ` : ''}
                  ${app.status === 'accepted' ? `
                    <button type="button" class="btn-primary btn-app-complete" data-app-id="${app.id}" style="padding: 0.35rem 0.75rem; font-size: 0.74rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;">
                      Complete & Award +${item.bountyKarma || 800} KP
                    </button>
                  ` : ''}
                  ${app.status === 'completed' ? `
                    <span style="font-size: 0.75rem; color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                      ✓ Verified & Paid
                    </span>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  } else {
    // Non-author view: Application form or status banner
    if (myApp) {
      applicantsSectionHtml = `
        <div style="margin-top: 1.25rem; padding: 1rem; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.25);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="color: #60a5fa; font-size: 0.9rem;">Your Application Status:</strong>
            <span style="padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; background: ${myApp.status === 'completed' ? '#10b981' : myApp.status === 'accepted' ? '#3b82f6' : '#f59e0b'}; color: #ffffff;">
              ${myApp.status}
            </span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">
            ${myApp.status === 'completed' ? 'This gig has been marked completed and your Karma Points have been credited!' : myApp.status === 'accepted' ? 'Congratulations! Your application has been accepted. Coordinate directly with the organizer in Messaging.' : 'Your pitch has been submitted and is currently under review by the council lead.'}
          </p>
        </div>
      `;
    } else if (item.isVacancy || item.category === 'vacancies' || item.bountyKarma) {
      applicantsSectionHtml = `
        <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #ffffff; margin-bottom: 0.4rem;">
            Submit Your Application & Pitch
          </label>
          <textarea id="modalPitchInput" class="form-textarea" rows="3" placeholder="Tell ${item.organizer?.name || 'the organizer'} about your relevant skills, tools, and why you're a great fit..."></textarea>
        </div>
      `;
    }
  }

  detailModalBody.innerHTML = `
    <h2 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; line-height: 1.3;">
      ${item.title}
    </h2>
    <div style="font-size: 0.85rem; color: #94a3b8; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
      <span>Organized by <strong>${item.organizer?.name || (typeof item.organizer === 'string' ? item.organizer : 'Student Lead')}</strong> (${item.organizer?.role || 'Campus Lead'})</span>
      ${item.clubName ? `<span class="club-privacy-badge ${item.isClubOnly ? 'badge-club-private' : 'badge-club-public'}"><i data-lucide="${item.isClubOnly ? 'lock' : 'globe'}" class="lucide-icon-xs"></i> ${item.clubName} ${item.isClubOnly ? '(Private)' : '(Public)'}</span>` : ''}
    </div>

    ${item.compensation ? `
      <div style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.14); padding: 0.75rem 1rem; border-radius: var(--radius-sm); color: #ffffff; font-weight: 700; font-size: 0.88rem; margin: 0.75rem 0;">
        Compensation: ${item.compensation}
      </div>
    ` : ''}

    <div style="font-size: 0.9rem; line-height: 1.65; color: var(--text-secondary); white-space: pre-line; margin-top: 0.5rem;">${item.content || item.summary}</div>

    ${applicantsSectionHtml}
  `;

  // Attach applicant action handlers for organizer
  if (isAuthor) {
    detailModalBody.querySelectorAll('.btn-app-accept').forEach(btn => {
      btn.onclick = async () => {
        const appId = btn.getAttribute('data-app-id');
        try {
          await apiUpdateApplicationStatus(appId, 'accepted');
          showToast('✓ Application accepted! Direct chat channel opened.', 'success');
          openDetailModal(item.id);
        } catch (err) {
          showToast(err.message, 'warning');
        }
      };
    });

    detailModalBody.querySelectorAll('.btn-app-reject').forEach(btn => {
      btn.onclick = async () => {
        const appId = btn.getAttribute('data-app-id');
        try {
          await apiUpdateApplicationStatus(appId, 'rejected');
          showToast('Application declined.', 'info');
          openDetailModal(item.id);
        } catch (err) {
          showToast(err.message, 'warning');
        }
      };
    });

    detailModalBody.querySelectorAll('.btn-app-complete').forEach(btn => {
      btn.onclick = async () => {
        const appId = btn.getAttribute('data-app-id');
        try {
          const res = await apiUpdateApplicationStatus(appId, 'completed');
          triggerConfetti();
          showToast(`Awarded +${res.karmaAwarded} Karma Points to student!`, 'success', 4000);
          openDetailModal(item.id);
        } catch (err) {
          showToast(err.message, 'warning');
        }
      };
    });

    detailModalBody.querySelectorAll('.btn-app-chat').forEach(btn => {
      btn.onclick = async () => {
        const applicantId = btn.getAttribute('data-applicant-id');
        detailModal.close();
        const conv = await apiStartConversation(applicantId, `Regarding: ${item.title}`);
        state.activeConversationId = conv.id;
        state.mobileChatOpen = true;
        switchTab('messaging');
      };
    });
  }

  modalMessageOrganizerBtn.onclick = async () => {
    detailModal.close();
    const organizerId = item.authorId || (item.organizer && item.organizer.id) || 'user-kavya';
    const conv = await apiStartConversation(organizerId, `Inquiry: ${item.title}`);
    state.activeConversationId = conv.id;
    state.mobileChatOpen = true;
    switchTab('messaging');
  };

  // Footer button logic: Apply or Status
  if (isAuthor) {
    modalRsvpBtn.innerHTML = `<span>✓ You are Organizer</span>`;
    modalRsvpBtn.disabled = true;
  } else if (myApp) {
    modalRsvpBtn.innerHTML = `<span>Applied (${myApp.status.toUpperCase()})</span>`;
    modalRsvpBtn.disabled = true;
  } else {
    modalRsvpBtn.disabled = false;
    modalRsvpBtn.innerHTML = `<span>Submit Application</span>`;
    modalRsvpBtn.onclick = async () => {
      const pitchInput = document.getElementById('modalPitchInput');
      const pitch = pitchInput ? pitchInput.value.trim() : 'Applied via campus portal';
      try {
        await apiSubmitApplication({
          itemId: item.id,
          title: item.title,
          pitch
        });
        triggerConfetti();
        showToast('Application successfully submitted to organizer!', 'success', 3500);
        openDetailModal(item.id);
        renderAnnouncements();
      } catch (err) {
        showToast(err.message, 'warning');
      }
    };
  }

  detailModal.showModal();
}

closeDetailModalBtn.onclick = () => detailModal.close();
if (openCreateModalBtn) openCreateModalBtn.onclick = () => createModal.showModal();
closeCreateModalBtn.onclick = () => createModal.close();
cancelCreateBtn.onclick = () => createModal.close();

createAnnouncementForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('formTitle').value.trim();
  const category = document.getElementById('formCategory').value;
  const clubName = document.getElementById('formClubName')?.value || '';
  const visibility = document.getElementById('formVisibility')?.value || 'public';
  const organizer = document.getElementById('formOrganizer').value.trim();
  const compensation = document.getElementById('formCompensation').value.trim();
  const summary = document.getElementById('formSummary').value.trim();
  const content = document.getElementById('formContent').value.trim();

  const isClubOnly = visibility === 'club_only' && !!clubName;

  try {
    const newNotice = await apiCreateAnnouncement({
      title,
      category,
      clubName,
      isClubOnly,
      organizer,
      compensation,
      summary,
      content
    });

    createAnnouncementForm.reset();
    createModal.close();
    triggerConfetti();
    showToast('Notice published live to campus network!', 'success');
    renderAnnouncements();
    renderUserPosts();
  } catch (err) {
    showToast(`Failed to publish: ${err.message}`, 'warning');
  }
};

// ============================================================================
// VIEW 2: MESSAGING (Clean & Direct)
// ============================================================================

async function openChatForNotice(announcementId) {
  const notice = announcements.find(a => a.id === announcementId);
  if (!notice) return;

  const partnerId = notice.authorId || (notice.organizer && notice.organizer.id) || 'user-kavya';
  try {
    const conv = await apiStartConversation(partnerId, notice.title);
    const existing = conversations.find(c => c.id === conv.id);
    if (!existing) {
      conversations.unshift(conv);
    }
    state.activeConversationId = conv.id;
    state.mobileChatOpen = true;

    if (state.uiStyle === 'slate') {
      switchSlateTab('messaging');
    } else {
      switchTab('messaging');
      updateMobileChatView();
    }
    renderConversationsList();
    renderActiveChat();
  } catch (err) {
    showToast(`Could not open chat: ${err.message}`, 'warning');
  }
}

function updateMobileChatView() {
  const sidebar = document.querySelector('.conversations-sidebar');
  if (!sidebar || !chatMainPane) return;

  if (window.innerWidth <= 768) {
    if (state.mobileChatOpen) {
      sidebar.style.display = 'none';
      chatMainPane.style.display = 'flex';
    } else {
      sidebar.style.display = 'flex';
      chatMainPane.style.display = 'none';
    }
  } else {
    sidebar.style.display = 'flex';
    chatMainPane.style.display = 'flex';
  }
}

window.addEventListener('resize', updateMobileChatView);

if (chatBackMobileBtn) {
  chatBackMobileBtn.onclick = () => {
    state.mobileChatOpen = false;
    updateMobileChatView();
  };
}

function renderConversationsList() {
  if (!conversationsListContainer) return;
  conversationsListContainer.innerHTML = '';
  const q = chatSearchInput ? chatSearchInput.value.toLowerCase().trim() : '';

  const filtered = conversations.filter(c => !q || (c.partnerName && c.partnerName.toLowerCase().includes(q)));
  if (filtered.length === 0) {
    conversationsListContainer.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
        No active conversations yet.<br>Click "Message Lead" on any notice to start chatting live!
      </div>
    `;
    return;
  }

  filtered.forEach(c => {
    const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
    const item = document.createElement('div');
    item.className = `conversation-item ${c.id === state.activeConversationId ? 'active' : ''}`;

    item.innerHTML = `
      <div class="initials-avatar" style="background: ${c.accent || '#6366f1'};">
        ${c.avatarLetter || (c.partnerName ? c.partnerName.substring(0, 2) : 'CK')}
      </div>
      <div class="conversation-meta">
        <span class="partner-name">${escapeHtml(c.partnerName || 'Peer')}</span>
        <div class="last-msg-preview">${escapeHtml(lastMsg?.text || c.topicContext || 'Start conversation')}</div>
      </div>
      <div class="conversation-trailing">
        <span class="msg-timestamp">${formatChatTimestamp(lastMsg?.timestamp)}</span>
        ${c.unreadCount ? `<span class="unread-pill">${c.unreadCount}</span>` : '<span class="unread-spacer" aria-hidden="true"></span>'}
      </div>
    `;

    item.onclick = () => {
      state.activeConversationId = c.id;
      state.mobileChatOpen = true;
      c.unreadCount = 0;
      renderConversationsList();
      renderActiveChat();
      updateMobileChatView();
    };

    conversationsListContainer.appendChild(item);
  });
}

function renderActiveChat() {
  const currentUserId = getActiveUserId();
  const conv = conversations.find(c => c.id === state.activeConversationId) || conversations[0];
  if (!conv) {
    if (activePartnerName) activePartnerName.textContent = 'Select a Conversation';
    if (chatMessagesStream) chatMessagesStream.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
        Select an active channel from the left sidebar to communicate live.
      </div>
    `;
    return;
  }

  const activePartnerAvatar = document.getElementById('activePartnerAvatar');
  if (activePartnerAvatar) {
    activePartnerAvatar.textContent = conv.avatarLetter || (conv.partnerName ? conv.partnerName.substring(0, 2) : 'CK');
  }
  if (activePartnerOnlineDot) activePartnerOnlineDot.style.display = conv.isOnline ? 'block' : 'none';
  if (activePartnerName) activePartnerName.textContent = conv.partnerName || 'Lead';
  if (activePartnerStatus) activePartnerStatus.textContent = `${conv.partnerTitle || 'Campus Member'} • Live`;
  if (activeChatTopic) activeChatTopic.textContent = conv.topicContext || 'General';

  if (!chatMessagesStream) return;
  chatMessagesStream.innerHTML = '';

  if (!conv.messages || conv.messages.length === 0) {
    chatMessagesStream.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
        No messages in this channel yet. Say hi to begin!
      </div>
    `;
    return;
  }

  conv.messages.forEach(m => {
    const isMe = m.senderId === currentUserId || m.sender === 'me';
    const b = document.createElement('div');
    b.className = `chat-bubble ${isMe ? 'me' : 'them'}`;
    b.innerHTML = `
      <div style="font-size: 0.72rem; color: ${isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'}; margin-bottom: 0.2rem; font-weight: 600;">
        ${m.senderName || (isMe ? 'You' : conv.partnerName)}
      </div>
      <div>${escapeHtml(m.text)}</div>
      <div class="bubble-footer">${formatChatTimestamp(m.timestamp)}</div>
    `;
    chatMessagesStream.appendChild(b);
  });

  chatMessagesStream.scrollTop = chatMessagesStream.scrollHeight;
  refreshIcons();
}

chatComposerForm.onsubmit = async (e) => {
  e.preventDefault();
  const text = chatMessageInput.value.trim();
  if (!text) return;

  const conv = conversations.find(c => c.id === state.activeConversationId);
  if (!conv) return;

  chatMessageInput.value = '';

  try {
    const newMsg = await apiSendMessage(conv.id, text);
    if (!conv.messages) conv.messages = [];
    if (!conv.messages.some(m => m.id === newMsg.id)) {
      conv.messages.push(newMsg);
    }
    renderActiveChat();
    renderConversationsList();
  } catch (err) {
    showToast(`Failed to send: ${err.message}`, 'warning');
  }
};

chatSearchInput.oninput = () => renderConversationsList();

// ============================================================================
// VIEW 3: MARKETING / REELS (Clean Micro-Gig Feed)
// ============================================================================

let feelObserver = null;
let isScrollThrottled = false;

function renderActiveReel() {
  renderFeelsFeed();
}

function renderFeelsFeed() {
  if (!reelsDeck) return;

  reelsDeck.innerHTML = reels.map((reel, index) => `
    <article class="vertical-feel-card ${index === state.currentReelIndex ? 'active' : ''}" data-index="${index}" id="feel-card-${index}">
      <!-- Top Row: Client Info & Urgency -->
      <div class="feel-top-client-row">
        <div class="feel-client-meta">
          <div class="initials-avatar">
            ${reel.avatarLetter || 'CF'}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 0.92rem; color: #ffffff;">${reel.clientName}</div>
            <div style="font-size: 0.74rem; color: #a1a1aa;">${reel.clientRole}</div>
          </div>
        </div>
        <span class="feel-urgency-badge"><i data-lucide="zap" class="lucide-icon-xs"></i> FIRST COME</span>
      </div>

      <!-- Middle Body: Title, Problem Box & Skills -->
      <div class="feel-body-content">
        <h3 class="feel-vertical-title">
          ${reel.title}
        </h3>

        <div class="feel-problem-box">
          ${reel.problemStatement}
        </div>

        <div class="feel-skills-list">
          ${reel.skillsRequired.map(s => `<span class="skill-pill">#${s}</span>`).join('')}
        </div>
      </div>

      <!-- Bottom Footer: Bounty & Action Buttons -->
      <div class="feel-bottom-actions">
        <div class="feel-bounty-row">
          <span class="bounty-amount-text"><i data-lucide="zap" class="lucide-icon-xs"></i> +${reel.bountyKarma.toLocaleString()} Karma Points</span>
          <span class="bounty-stipend-text">${reel.bountyCash} Stipend</span>
        </div>

        <div class="feel-buttons-row">
          <button class="btn-primary btn-claim-feel" data-index="${index}" style="flex: 1; padding: 0.65rem 1rem;">
            <i data-lucide="zap" class="lucide-icon-xs"></i> Claim Problem
          </button>
          <button class="btn-rsvp-toggle btn-chat-feel" data-id="${reel.id}" style="padding: 0.65rem 0.9rem;">
            <i data-lucide="message-square" class="lucide-icon-xs"></i> Chat
          </button>
        </div>
      </div>
    </article>
  `).join('');

  renderProgressDots();
  attachFeelEventListeners();
  initFeelIntersectionObserver();
  updateFeelsCounter();
  refreshIcons();
}

function renderProgressDots() {
  const dotsContainer = document.getElementById('feelsProgressDots');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = reels.map((_, i) => `
    <div class="feels-dot ${i === state.currentReelIndex ? 'active' : ''}" data-index="${i}" title="Feel ${i + 1}"></div>
  `).join('');

  dotsContainer.querySelectorAll('.feels-dot').forEach(dot => {
    dot.onclick = () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      scrollToFeel(idx);
    };
  });
}

function updateFeelsCounter() {
  const counter = document.getElementById('feelsCounter');
  if (counter) {
    counter.textContent = `${state.currentReelIndex + 1} / ${reels.length}`;
  }

  const dots = document.querySelectorAll('.feels-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === state.currentReelIndex);
  });
}

function scrollToFeel(index) {
  if (index < 0) index = 0;
  if (index >= reels.length) index = reels.length - 1;

  state.currentReelIndex = index;
  const targetCard = reelsDeck.querySelector(`[data-index="${index}"]`);
  if (targetCard) {
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  updateFeelsCounter();

  reelsDeck.querySelectorAll('.vertical-feel-card').forEach((c, i) => {
    c.classList.toggle('active', i === index);
  });
}

function initFeelIntersectionObserver() {
  if (feelObserver) {
    feelObserver.disconnect();
  }

  feelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.getAttribute('data-index'), 10);
        state.currentReelIndex = idx;
        updateFeelsCounter();

        reelsDeck.querySelectorAll('.vertical-feel-card').forEach((c, i) => {
          c.classList.toggle('active', i === idx);
        });
      }
    });
  }, {
    root: reelsDeck,
    threshold: 0.55
  });

  reelsDeck.querySelectorAll('.vertical-feel-card').forEach(card => {
    feelObserver.observe(card);
  });
}

function attachFeelEventListeners() {
  reelsDeck.querySelectorAll('.btn-claim-feel').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const reel = reels[idx];
      if (!reel) return;
      state.activeReelApplying = reel;
      applyGigModalBody.innerHTML = `
        <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; color: #ffffff;">${reel.title}</h3>
        <div style="color: #ffffff; font-weight: 700; margin: 0.35rem 0 0.85rem;">
          Claim +${reel.bountyKarma.toLocaleString()} Karma Points (${reel.bountyCash})
        </div>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5;">${reel.problemStatement}</p>
      `;
      applyGigModal.showModal();
    };
  });

  reelsDeck.querySelectorAll('.btn-chat-feel').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      openChatForNotice(id) || switchTab('messaging');
    };
  });
}

confirmAcceptGigBtn.onclick = async () => {
  if (!state.activeReelApplying) return;
  const reel = state.activeReelApplying;
  try {
    const app = await apiSubmitApplication({
      itemId: reel.id,
      title: reel.title,
      pitch: 'Claimed via Feels micro-gig feed'
    });
    triggerConfetti();
    applyGigModal.close();
    showToast(`Gig application submitted to ${reel.clientName} for review!`, 'success', 3500);
    apiGetApplications('mine').then(apps => {
      applications = apps;
      renderApplicationsList();
    });
  } catch (err) {
    showToast(err.message, 'warning');
  }
};

closeApplyGigModalBtn.onclick = () => applyGigModal.close();
cancelApplyGigBtn.onclick = () => applyGigModal.close();

prevReelBtn.onclick = () => {
  scrollToFeel(state.currentReelIndex - 1);
};
nextReelBtn.onclick = () => {
  scrollToFeel(state.currentReelIndex + 1);
};

// Keyboard Arrow & Page Navigation for Feels
window.addEventListener('keydown', (e) => {
  if (state.activeTab === 'reels') {
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      scrollToFeel(state.currentReelIndex - 1);
    } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      scrollToFeel(state.currentReelIndex + 1);
    }
  }
});

// Wheel snap scroll navigation on desktop
const feelsVerticalStage = document.querySelector('.feels-vertical-stage');
if (feelsVerticalStage) {
  feelsVerticalStage.addEventListener('wheel', (e) => {
    if (state.activeTab !== 'reels') return;
    if (Math.abs(e.deltaY) < 20) return;
    e.preventDefault();
    if (isScrollThrottled) return;

    isScrollThrottled = true;
    if (e.deltaY > 0) {
      scrollToFeel(state.currentReelIndex + 1);
    } else {
      scrollToFeel(state.currentReelIndex - 1);
    }
    setTimeout(() => {
      isScrollThrottled = false;
    }, 450);
  }, { passive: false });
}

// Touch swipe gestures
let touchStartY = 0;
if (reelsDeck) {
  reelsDeck.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  reelsDeck.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    if (Math.abs(diffY) > 40) {
      if (diffY > 0) {
        scrollToFeel(state.currentReelIndex + 1);
      } else {
        scrollToFeel(state.currentReelIndex - 1);
      }
    }
  }, { passive: true });
}

openCreateReelModalBtn.onclick = () => createReelModal.showModal();
closeCreateReelModalBtn.onclick = () => createReelModal.close();
cancelCreateReelBtn.onclick = () => createReelModal.close();

createReelForm.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('reelTitle')?.value.trim();
  const clientName = document.getElementById('reelClient')?.value.trim() || userProfile.name;
  const bountyKarma = parseInt(document.getElementById('reelBountyKarma')?.value, 10) || 1200;
  const stipendCash = document.getElementById('reelStipendCash')?.value.trim() || '₹3,000';
  const skillsStr = document.getElementById('reelSkills')?.value.trim() || 'General';
  const problemStatement = document.getElementById('reelProblem')?.value.trim();

  if (!title || !problemStatement) {
    showToast('Please fill in both title and problem statement!', 'warning');
    return;
  }

  try {
    const newReel = await apiCreateReel({
      title,
      clientName,
      bountyKarma,
      bountyCash: stipendCash,
      skillsRequired: skillsStr.split(',').map(s => s.trim()).filter(Boolean),
      problemStatement
    });

    createReelForm.reset();
    createReelModal.close();
    state.currentReelIndex = 0;
    renderFeelsFeed();
    scrollToFeel(0);
    triggerConfetti();
    showToast('New campus feel published live to network!', 'success', 3000);
  } catch (err) {
    showToast(`Failed to post feel: ${err.message}`, 'warning');
  }
};

// ============================================================================
// THEME SYSTEM & CUSTOM PALETTE CUSTOMIZER
// ============================================================================

const THEME_PRESETS = {
  'smart-black': {
    name: 'Smart Black',
    mode: 'dark',
    bgBase: '#000000',
    bgSurface: '#0a0a0d',
    accent: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a'
  },
  'paper-white': {
    name: 'Paper White',
    mode: 'light',
    bgBase: '#f8f9fa',
    bgSurface: '#ffffff',
    accent: '#0f172a',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1'
  },
  'midnight-navy': {
    name: 'Midnight Navy',
    mode: 'dark',
    bgBase: '#090d16',
    bgSurface: '#0f172a',
    accent: '#3b82f6',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#1e293b'
  },
  'cyber-emerald': {
    name: 'Cyber Emerald',
    mode: 'dark',
    bgBase: '#03140a',
    bgSurface: '#062413',
    accent: '#10b981',
    textPrimary: '#ecfdf5',
    textSecondary: '#6ee7b7',
    border: '#0f3922'
  },
  'obsidian-violet': {
    name: 'Obsidian Violet',
    mode: 'dark',
    bgBase: '#0e0a17',
    bgSurface: '#171126',
    accent: '#8b5cf6',
    textPrimary: '#faf5ff',
    textSecondary: '#c084fc',
    border: '#2a1b47'
  },
  'minimal-slate': {
    name: 'Titanium Slate',
    mode: 'dark',
    bgBase: '#121214',
    bgSurface: '#18181b',
    accent: '#e4e4e7',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a'
  }
};

let currentCustomPalette = loadStorage(STORAGE_KEYS.CUSTOM_THEME, null);

function applyThemePalette(palette, save = false) {
  if (!palette) return;
  const root = document.documentElement;

  // Set theme mode (dark or light)
  root.setAttribute('data-theme', palette.mode || 'dark');
  if (themeIcon) {
    themeIcon.setAttribute('data-mode', palette.mode === 'light' ? 'light' : 'dark');
  }

  // Set dynamic CSS properties
  root.style.setProperty('--bg-base', palette.bgBase);
  root.style.setProperty('--bg-surface', palette.bgSurface);
  root.style.setProperty('--bg-surface-elevated', palette.mode === 'light' ? '#f1f3f5' : '#14141a');
  root.style.setProperty('--bg-surface-hover', palette.mode === 'light' ? '#e9ecef' : '#1a1a24');
  root.style.setProperty('--accent-base', palette.accent);
  root.style.setProperty('--text-primary', palette.textPrimary);
  root.style.setProperty('--text-secondary', palette.textSecondary);
  root.style.setProperty('--border-subtle', palette.border);
  root.style.setProperty('--border-medium', palette.border);

  // Sync inputs
  syncPickerInputs(palette);
  updateThemePreview(palette);

  if (save) {
    currentCustomPalette = palette;
    localStorage.setItem(STORAGE_KEYS.THEME, palette.mode || 'dark');
    localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(palette));
  }
}

function syncPickerInputs(palette) {
  const map = {
    pickerBgBase: palette.bgBase,
    hexBgBase: palette.bgBase,
    pickerBgSurface: palette.bgSurface,
    hexBgSurface: palette.bgSurface,
    pickerAccent: palette.accent,
    hexAccent: palette.accent,
    pickerTextPrimary: palette.textPrimary,
    hexTextPrimary: palette.textPrimary,
    pickerTextSecondary: palette.textSecondary,
    hexTextSecondary: palette.textSecondary,
    pickerBorder: palette.border,
    hexBorder: palette.border
  };

  for (const [id, val] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
}

function updateThemePreview(palette) {
  if (!themePreviewBox) return;
  themePreviewBox.style.background = palette.bgBase;
  themePreviewBox.style.border = `1px solid ${palette.border}`;

  const inner = themePreviewBox.querySelector('.preview-card-inner');
  if (inner) {
    inner.style.background = palette.bgSurface;
    inner.style.border = `1px solid ${palette.border}`;
  }

  const heading = themePreviewBox.querySelector('.preview-heading');
  if (heading) heading.style.color = palette.textPrimary;

  const desc = themePreviewBox.querySelector('.preview-desc');
  if (desc) desc.style.color = palette.textSecondary;

  const primaryBtn = themePreviewBox.querySelector('.btn-primary');
  if (primaryBtn) {
    primaryBtn.style.background = palette.accent;
    primaryBtn.style.color = palette.bgBase;
  }

  const secBtn = themePreviewBox.querySelector('.btn-rsvp-toggle');
  if (secBtn) {
    secBtn.style.background = palette.bgSurface;
    secBtn.style.color = palette.textPrimary;
    secBtn.style.border = `1px solid ${palette.border}`;
  }
}

function getPaletteFromInputs() {
  const bgBase = document.getElementById('pickerBgBase')?.value || '#000000';
  const bgSurface = document.getElementById('pickerBgSurface')?.value || '#0a0a0d';
  const accent = document.getElementById('pickerAccent')?.value || '#ffffff';
  const textPrimary = document.getElementById('pickerTextPrimary')?.value || '#ffffff';
  const textSecondary = document.getElementById('pickerTextSecondary')?.value || '#a1a1aa';
  const border = document.getElementById('pickerBorder')?.value || '#27272a';

  const isLight = isColorLight(bgBase);

  return {
    name: 'Custom User Theme',
    mode: isLight ? 'light' : 'dark',
    bgBase,
    bgSurface,
    accent,
    textPrimary,
    textSecondary,
    border
  };
}

function isColorLight(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 140;
}

function setupThemeCustomizer() {
  // Preset buttons
  document.querySelectorAll('.preset-pill-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.preset-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.getAttribute('data-preset');
      const preset = THEME_PRESETS[presetKey];
      if (preset) {
        applyThemePalette(preset, false);
      }
    };
  });

  // Dual bind color picker and hex input
  const pairs = [
    ['pickerBgBase', 'hexBgBase'],
    ['pickerBgSurface', 'hexBgSurface'],
    ['pickerAccent', 'hexAccent'],
    ['pickerTextPrimary', 'hexTextPrimary'],
    ['pickerTextSecondary', 'hexTextSecondary'],
    ['pickerBorder', 'hexBorder']
  ];

  pairs.forEach(([pickerId, hexId]) => {
    const picker = document.getElementById(pickerId);
    const hex = document.getElementById(hexId);
    if (!picker || !hex) return;

    picker.oninput = () => {
      hex.value = picker.value;
      const palette = getPaletteFromInputs();
      updateThemePreview(palette);
    };

    hex.oninput = () => {
      let val = hex.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        picker.value = val;
        const palette = getPaletteFromInputs();
        updateThemePreview(palette);
      }
    };
  });

  // Modal actions
  if (openThemeModalBtn) {
    openThemeModalBtn.onclick = () => {
      themeModal.showModal();
      const current = currentCustomPalette || (
        document.documentElement.getAttribute('data-theme') === 'light'
          ? THEME_PRESETS['paper-white']
          : THEME_PRESETS['smart-black']
      );
      syncPickerInputs(current);
      updateThemePreview(current);
      refreshIcons();
    };
  }

  if (closeThemeModalBtn) closeThemeModalBtn.onclick = () => themeModal.close();
  if (cancelThemeModalBtn) cancelThemeModalBtn.onclick = () => themeModal.close();

  if (saveThemeBtn) {
    saveThemeBtn.onclick = () => {
      const palette = getPaletteFromInputs();
      applyThemePalette(palette, true);
      themeModal.close();
      showToast('Custom Theme & Palette saved!', 'info');
    };
  }

  if (resetThemeBtn) {
    resetThemeBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_THEME);
      currentCustomPalette = null;
      document.querySelectorAll('.preset-pill-btn').forEach(b => b.classList.remove('active'));
      const smartBtn = document.querySelector('[data-preset="smart-black"]');
      if (smartBtn) smartBtn.classList.add('active');
      applyThemePalette(THEME_PRESETS['smart-black'], true);
      showToast('Reset to Smart Black default', 'info');
    };
  }
}

// Quick Dark/Light Theme Toggle in Header
function initTheme() {
  if (currentCustomPalette) {
    applyThemePalette(currentCustomPalette, false);
    return;
  }
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  const preset = saved === 'light' ? THEME_PRESETS['paper-white'] : THEME_PRESETS['smart-black'];
  applyThemePalette(preset, false);
}

let isThemeTransitioning = false;

function toggleThemeWithRadialAnimation(event) {
  if (isThemeTransitioning) return;

  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  const isGoingLight = next === 'light'; // true: expand outward, false: shrink inward
  const preset = isGoingLight ? THEME_PRESETS['paper-white'] : THEME_PRESETS['smart-black'];

  // Button micro-interaction spin animation
  if (themeToggleBtn) {
    themeToggleBtn.classList.remove('theme-toggle-spin-forward', 'theme-toggle-spin-backward');
    void themeToggleBtn.offsetWidth; // Force reflow
    themeToggleBtn.classList.add(isGoingLight ? 'theme-toggle-spin-forward' : 'theme-toggle-spin-backward');
  }

  // Calculate coordinates originating at the themeToggleBtn center
  let x = window.innerWidth - 60;
  let y = 35;
  if (themeToggleBtn) {
    const rect = themeToggleBtn.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else if (event && event.clientX && event.clientY) {
    x = event.clientX;
    y = event.clientY;
  }

  // Maximum radius needed to reach the furthest corner of the viewport
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const applyNewTheme = () => {
    applyThemePalette(preset, true);
    if (state.uiStyle === 'intelly') {
      applyIntellyPastelPalette();
    }
  };

  // Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyNewTheme();
    showToast(next === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode', 'info');
    return;
  }

  // Modern View Transitions API with radial clip-path animation
  if (document.startViewTransition) {
    isThemeTransitioning = true;
    const transitionClass = isGoingLight ? 'theme-transition-expand' : 'theme-transition-shrink';
    document.documentElement.classList.add('in-theme-transition', transitionClass);

    const transition = document.startViewTransition(() => {
      applyNewTheme();
    });

    transition.ready.then(() => {
      if (isGoingLight) {
        // Expand outward from button to reveal new Light theme
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      } else {
        // Shrink inward back into button to reveal Dark theme underneath
        document.documentElement.animate(
          {
            clipPath: [
              `circle(${endRadius}px at ${x}px ${y}px)`,
              `circle(0px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-old(root)'
          }
        );
      }
    }).catch(err => {
      console.warn('View transition notice:', err);
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove('in-theme-transition', 'theme-transition-expand', 'theme-transition-shrink');
      isThemeTransitioning = false;
      showToast(next === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode', 'info');
    });
  } else {
    // Fallback radial overlay for browsers without View Transitions
    isThemeTransitioning = true;
    runRadialFallbackOverlay(isGoingLight, x, y, endRadius, applyNewTheme, () => {
      isThemeTransitioning = false;
      showToast(next === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode', 'info');
    });
  }
}

function runRadialFallbackOverlay(isGoingLight, x, y, endRadius, updateFn, onComplete) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '999999';

  if (isGoingLight) {
    overlay.style.backgroundColor = '#f8f9fa';
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    document.body.appendChild(overlay);

    const anim = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
      ],
      {
        duration: 550,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    );

    anim.onfinish = () => {
      updateFn();
      overlay.remove();
      onComplete();
    };
  } else {
    overlay.style.backgroundColor = '#ffffff';
    overlay.style.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
    document.body.appendChild(overlay);
    updateFn();

    const anim = overlay.animate(
      [
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        { clipPath: `circle(0px at ${x}px ${y}px)` }
      ],
      {
        duration: 550,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    );

    anim.onfinish = () => {
      overlay.remove();
      onComplete();
    };
  }
}

if (themeToggleBtn) {
  themeToggleBtn.onclick = (e) => {
    toggleThemeWithRadialAnimation(e);
  };
}

// ============================================================================
// UI EXPERIENCE SELECTOR (Instagram Feed vs Sapphire UI LMS)
// ============================================================================

function applyUiStyle(style) {
  style = 'intelly';
  state.uiStyle = style;
  localStorage.setItem('campus_karma_ui_style', style);
  document.documentElement.setAttribute('data-ui-style', style);

  if (currentUiStyleLabel) {
    currentUiStyleLabel.textContent = style === 'slate'
      ? 'Slate Studio'
      : style === 'intelly'
        ? 'Intelly Studio'
        : style === 'crimson'
          ? 'Crimson Glass'
          : style === 'sapphire'
            ? 'Sapphire'
            : 'Instagram';
  }

  const floatingLabel = document.getElementById('slateFloatingCurrentLabel');
  if (floatingLabel) {
    floatingLabel.textContent = style === 'slate' ? 'Slate Studio' : 'Switch Layout';
  }

  document.querySelectorAll('.ui-style-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-style') === style);
  });

  // Synchronize Crimson multi-tab background slides with currently active tab
  const slideAnnouncements = document.getElementById('crimsonSlideAnnouncements');
  const slideMessaging = document.getElementById('crimsonSlideMessaging');
  const slideFeels = document.getElementById('crimsonSlideFeels');
  if (slideAnnouncements && slideMessaging && slideFeels) {
    slideAnnouncements.classList.toggle('active', state.activeTab === 'announcements');
    slideMessaging.classList.toggle('active', state.activeTab === 'messaging');
    slideFeels.classList.toggle('active', state.activeTab === 'reels');
  }

  // Intelly Studio light theme & pastel profile palettes
  if (style === 'intelly') {
    applyIntellyPastelPalette();
  }

  if (style === 'slate') {
    renderSlateStudio();
    initSlateStudio();
  }

  renderAnnouncements();

  showToast(
    style === 'slate'
      ? 'Slate Studio Console Active'
      : style === 'intelly'
        ? 'Switched to Intelly Studio'
        : style === 'crimson'
          ? 'Switched to Crimson Glass'
          : style === 'sapphire'
            ? 'Switched to Sapphire UI'
            : 'Switched to Instagram Design',
    'info'
  );
  refreshIcons();
}

function initUiStyleSelector() {
  if (uiStyleSelectorBtn && uiStyleMenu) {
    uiStyleSelectorBtn.onclick = (e) => {
      e.stopPropagation();
      uiStyleMenu.classList.toggle('open');
    };

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.ui-style-selector-wrapper') && !e.target.closest('#slateFloatingSwitchBtn') && !e.target.closest('#slateFilterToggleBtn')) {
        uiStyleMenu.classList.remove('open');
      }
    });

    document.querySelectorAll('.ui-style-opt-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const style = btn.getAttribute('data-style');
        applyUiStyle(style);
        uiStyleMenu.classList.remove('open');
      };
    });
  }

  // Migrate older saved layouts to the single supported theme.
  applyUiStyle('intelly');
}

if (mobileNavToggle) {
  mobileNavToggle.addEventListener('click', () => {
    const header = document.querySelector('.app-header');
    const isOpen = header?.classList.toggle('mobile-nav-open') || false;
    mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    mobileNavToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    mobileNavToggle.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}" class="lucide-icon"></i>`;
    refreshIcons();
  });
}

// ============================================================================
// SAPPHIRE UI - LMS OF UNIVERSITY DASHBOARD CONTROLLER
// ============================================================================

function renderSapphireMatrix() {
  const grid = document.getElementById('sapphireMatrixGrid');
  if (!grid) return;

  // Exact 5 rows x 12 columns matrix from user's screenshot
  const rows = [
    { label: 'FEB', pattern: ['med', 'low', 'low', 'low', 'low', 'best', 'med', 'med', 'med', 'low', 'low', 'med'] },
    { label: 'FTI', pattern: ['low', 'med', 'best', 'low', 'low', 'best', 'best', 'low', 'low', 'best', 'low', 'med'] },
    { label: 'FKG', pattern: ['low', 'med', 'best', 'best', 'best', 'best', 'best', 'best', 'best', 'best', 'low', 'low'] },
    { label: 'FKH', pattern: ['low', 'med', 'best', 'low', 'best', 'best', 'best', 'best', 'best', 'low', 'med', 'low'] },
    { label: 'FKS', pattern: ['low', 'med', 'low', 'low', 'best', 'low', 'low', 'low', 'best', 'best', 'low', 'low'] }
  ];

  grid.innerHTML = '';
  rows.forEach(r => {
    const rowEl = document.createElement('div');
    rowEl.className = 'matrix-row';

    const labelEl = document.createElement('span');
    labelEl.className = 'row-label';
    labelEl.textContent = r.label;
    rowEl.appendChild(labelEl);

    r.pattern.forEach((lvl, i) => {
      const cell = document.createElement('div');
      cell.className = `matrix-cell tile-${lvl}`;
      const day = 18 + i;
      cell.title = `${r.label} - Day ${day}: ${lvl.toUpperCase()} Engagement`;
      cell.onclick = () => {
        showToast(`${r.label} - Day ${day}: ${lvl === 'best' ? '98% Top' : lvl === 'high' ? '76% High' : lvl === 'med' ? '45% Medium' : '18% Low'} Attendance Engagement`, 'info', 2000);
      };
      rowEl.appendChild(cell);
    });

    grid.appendChild(rowEl);
  });
}

function setupSapphireInteractivity() {
  renderSapphireMatrix();

  // Days Ribbon Toggles
  const dayPills = document.querySelectorAll('.sapphire-day-pill');
  dayPills.forEach(p => {
    p.onclick = () => {
      dayPills.forEach(d => d.classList.remove('active'));
      p.classList.add('active');
      const dayName = p.querySelector('.day-name')?.textContent || '';
      const dayNum = p.querySelector('.day-num')?.textContent || '';
      showToast(`Selected date: ${dayName} ${dayNum} Oct 2024`, 'info', 1800);
    };
  });

  // Activities click handlers
  const actItems = document.querySelectorAll('.sapphire-activity-item');
  actItems.forEach((act, idx) => {
    act.onclick = () => {
      if (announcements[idx]) {
        openDetailModal(announcements[idx].id);
      } else {
        openDetailModal(announcements[0]?.id);
      }
    };
  });

  // + Create Activity Button
  const sapphireCreateBtn = document.getElementById('sapphireCreateActivityBtn');
  if (sapphireCreateBtn) {
    sapphireCreateBtn.onclick = () => {
      createModal.showModal();
    };
  }

  // Upgrade to Pro Button
  const sapphireUpgradeBtn = document.getElementById('sapphireUpgradeBtn');
  if (sapphireUpgradeBtn) {
    sapphireUpgradeBtn.onclick = () => {
      userProfile.karmaPoints += 500;
      updateKarmaDisplay();
      triggerConfetti();
      showToast('Upgraded to Campus Pro! +500 Karma Points added!', 'success');
    };
  }

  // Jump to Messaging Button
  const sapphireJumpMsgBtn = document.getElementById('sapphireJumpMessagingBtn');
  if (sapphireJumpMsgBtn) {
    sapphireJumpMsgBtn.onclick = () => {
      switchTab('messaging');
    };
  }

  // Jump to Dashboard from Sapphire LMS sidebar inside Messaging
  const sapphireMsgNavDashboard = document.getElementById('sapphireMsgNavDashboard');
  if (sapphireMsgNavDashboard) {
    sapphireMsgNavDashboard.onclick = () => {
      switchTab('announcements');
    };
  }

  // Reload Engagement Button
  const sapphireReloadBtn = document.getElementById('sapphireReloadEngagementBtn');
  if (sapphireReloadBtn) {
    sapphireReloadBtn.onclick = () => {
      renderSapphireMatrix();
      showToast('Engagement heatmap synced with university database', 'info', 2000);
    };
  }

  // Expand Buttons
  document.querySelectorAll('.sapphire-expand-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      showToast('Detailed telemetry & metrics view', 'info', 1800);
    };
  });

  // View All buttons
  const viewAllEngagementBtn = document.getElementById('sapphireViewAllEngagementBtn');
  if (viewAllEngagementBtn) {
    viewAllEngagementBtn.onclick = () => {
      showToast('Showing all department engagement streams', 'info', 2000);
    };
  }
}

// ============================================================================
// INTELLY STUDIO CONTROLLER & PASTEL PALETTE ENGINE
// ============================================================================

const INTELLY_PASTEL_PALETTE = [
  { bg: '#fce7f3', text: '#db2777', border: '#fbcfe8' }, // Blush Pink
  { bg: '#ede9fe', text: '#7c3aed', border: '#ddd6fe' }, // Soft Lilac
  { bg: '#fef3c7', text: '#d97706', border: '#fde68a' }, // Honey Amber
  { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' }, // Sage Mint
  { bg: '#e0f2fe', text: '#0284c7', border: '#bae6fd' }, // Sky Blue
  { bg: '#edf4df', text: '#4d7c0f', border: '#dcfce7' }, // Soft Olive
];

function applyIntellyPastelPalette() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const userAvatarBtn = document.getElementById('headerProfileAvatar');
  if (userAvatarBtn) {
    if (isDark) {
      userAvatarBtn.style.background = '#22222f';
      userAvatarBtn.style.color = '#f472b6';
      userAvatarBtn.style.border = '2px solid #3b3b4f';
    } else {
      userAvatarBtn.style.background = '#fce7f3';
      userAvatarBtn.style.color = '#db2777';
      userAvatarBtn.style.border = '2px solid #fbcfe8';
    }
  }

  const darkPastel = [
    { bg: 'rgba(244, 114, 182, 0.18)', text: '#f472b6', border: 'rgba(244, 114, 182, 0.35)' },
    { bg: 'rgba(167, 139, 250, 0.18)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.35)' },
    { bg: 'rgba(251, 191, 36, 0.18)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.35)' },
    { bg: 'rgba(52, 211, 153, 0.18)', text: '#34d399', border: 'rgba(52, 211, 153, 0.35)' },
    { bg: 'rgba(56, 189, 248, 0.18)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.35)' }
  ];

  // Update author avatars across notice cards and lists
  document.querySelectorAll('.ig-avatar-ring, .author-avatar, .conversation-avatar, .intelly-avatar-ring').forEach((el, index) => {
    const p = isDark ? darkPastel[index % darkPastel.length] : INTELLY_PASTEL_PALETTE[index % INTELLY_PASTEL_PALETTE.length];
    el.style.background = p.bg;
    el.style.color = p.text;
    el.style.borderColor = p.border;
  });

  // Also sync profile fields to dossier card
  syncUserProfileToUI();
}

function initIntellyControls() {
  document.querySelectorAll('.intelly-nav-link[data-tab-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab-target');
      switchTab(target);
      document.querySelectorAll('.intelly-nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const paletteBtn = document.getElementById('intellyPaletteTrigger');
  if (paletteBtn) {
    paletteBtn.addEventListener('click', () => {
      const themeModal = document.getElementById('themeCustomizerModal');
      if (themeModal && typeof themeModal.showModal === 'function') themeModal.showModal();
    });
  }

  const settingsBtn = document.getElementById('intellySettingsTrigger');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openProfileDrawer);
  }

  const logoutBtn = document.getElementById('intellyLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      showToast('Signed out of Intelly Studio session', 'info');
    });
  }

  // Assistant widget replaced by post-notice-fab-btn
  // No floating assistant to wire up

  const assistantCtaBtn = document.getElementById('intellyAssistantCtaBtn');
  if (assistantCtaBtn) {
    assistantCtaBtn.addEventListener('click', () => {
      showToast('Intelly: Filtered active vacancies matching your skills!', 'success');
      state.filterVacanciesOnly = true;
      updateFilterControls();
      renderAnnouncements();
      if (bubble) bubble.style.display = 'none';
      const grid = document.getElementById('announcementsGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ============================================================================
// PHONE PREVIEW MODAL CONTROLLER
// ============================================================================

function setupPhonePreviewModal() {
  const openBtn = document.getElementById('openPhonePreviewBtn');
  const modal = document.getElementById('phonePreviewModal');
  const closeBtn = document.getElementById('closePhonePreviewModalBtn');
  const closeFooterBtn = document.getElementById('closePhonePreviewFooterBtn');
  const copyBtn = document.getElementById('copyPhoneUrlBtn');
  const input = document.getElementById('phoneNetworkUrlInput');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      if (typeof modal.showModal === 'function') modal.showModal();
    });
  }

  const closeModal = () => {
    if (modal && typeof modal.close === 'function') modal.close();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (copyBtn && input) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(input.value)
        .then(() => showToast('Network URL copied to clipboard!', 'success'))
        .catch(() => {
          input.select();
          showToast('URL selected for copying', 'info');
        });
    });
  }
}

// ============================================================================
// SLATE STUDIO - MONOLITHIC BENTO CONSOLE CONTROLLER
// ============================================================================

let slateDeckOffset = 0;
let slateActiveTab = 'spotlight';

export function stripEmojis(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u{1F300}-\u{1FAFF}]/gu, '').trim();
}

export function switchSlateTab(tabName) {
  slateActiveTab = tabName;

  document.querySelectorAll('.slate-dock-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-slate-tab') === tabName);
  });

  document.querySelectorAll('.slate-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`slateTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  const promptInput = document.getElementById('slatePromptInput');
  if (promptInput) {
    if (tabName === 'messaging') {
      promptInput.placeholder = "Transmit message into live transceiver...";
    } else if (tabName === 'applications') {
      promptInput.placeholder = "Filter submitted applications...";
    } else if (tabName === 'feels') {
      promptInput.placeholder = "Search creative sprint bounties...";
    } else if (tabName === 'analytics') {
      promptInput.placeholder = "Query campus telemetry index...";
    } else {
      promptInput.placeholder = "Broadcast notice, filter dispatches...";
    }
  }

  renderSlateStudio();
}

export function renderSlateStudio() {
  const consoleEl = document.getElementById('slateStudioConsole');
  if (!consoleEl) return;

  const visibleNotices = getVisibleAnnouncements();
  
  // 1. Tab 1: Spotlight Notice
  const spotlightItem = visibleNotices.find(n => n.isVacancy) || visibleNotices[0] || announcements[0];
  if (spotlightItem) {
    const titleEl = document.getElementById('slateSpotlightTitle');
    const authorChip = document.getElementById('slateSpotlightAuthorChip');
    const clubChip = document.getElementById('slateSpotlightClubChip');
    const bountyChip = document.getElementById('slateSpotlightBountyChip');
    const summaryEl = document.getElementById('slateSpotlightSummary');
    const viewBtn = document.getElementById('slateSpotlightViewBtn');
    const applyBtn = document.getElementById('slateSpotlightApplyBtn');

    if (titleEl) titleEl.textContent = stripEmojis(spotlightItem.title);
    if (authorChip) authorChip.textContent = stripEmojis(spotlightItem.organizer?.name || 'Aditya Verma');
    if (clubChip) clubChip.textContent = stripEmojis(spotlightItem.clubName || 'Design Guild');
    if (bountyChip) bountyChip.textContent = stripEmojis(spotlightItem.compensation || '1,200 KP Bounty');
    if (summaryEl) summaryEl.textContent = stripEmojis(spotlightItem.summary || spotlightItem.content || 'Collaborate on interactive wireframes, design tokens, and modular components for the upcoming collegiate portal.');

    if (viewBtn) {
      viewBtn.onclick = (e) => {
        e.stopPropagation();
        openDetailModal(spotlightItem.id);
      };
    }
    if (applyBtn) {
      const isApplied = (applications || []).some(a => a.itemId === spotlightItem.id);
      applyBtn.innerHTML = `<i data-lucide="${isApplied ? 'check' : 'send'}" class="lucide-icon-xs"></i><span>${isApplied ? 'Applied' : 'Quick Apply'}</span>`;
      applyBtn.onclick = (e) => {
        e.stopPropagation();
        toggleRsvp(spotlightItem.id);
        renderSlateStudio();
      };
    }
  }

  // 2. Tab 2: Transceiver Messaging Preview
  const conv = conversations[0];
  if (conv) {
    const partnerEl = document.getElementById('slateChatPartner');
    const roleEl = document.getElementById('slateChatPartnerRole');
    const avatarEl = document.getElementById('slateChatPartnerAvatar');
    const streamEl = document.getElementById('slateChatStream');

    if (partnerEl) partnerEl.textContent = stripEmojis(conv.partnerName);
    if (roleEl) roleEl.textContent = `${stripEmojis(conv.partnerRole || 'Robotics Guild Lead')} • Online Now`;
    if (avatarEl) avatarEl.textContent = conv.partnerName ? conv.partnerName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'SC';

    if (streamEl && conv.messages) {
      streamEl.innerHTML = conv.messages.slice(-4).map(m => `
        <div class="slate-bubble ${m.sender === 'user' ? 'bubble-out' : 'bubble-in'}">
          <span class="slate-bubble-text">${stripEmojis(m.text)}</span>
          <span class="slate-bubble-time">${m.timestamp || 'Now'}</span>
        </div>
      `).join('');
      streamEl.scrollTop = streamEl.scrollHeight;
    }
  }

  // 3. Tab 3: Creative Gigs / Feels
  if (reels && reels.length > 0) {
    const currentReel = reels[state.currentReelIndex % reels.length];
    if (currentReel) {
      const feelsTitle = document.getElementById('slateFeelsTitle');
      const clientChip = document.getElementById('slateFeelsClientChip');
      const bountyChip = document.getElementById('slateFeelsBountyChip');
      const feelsSummary = document.getElementById('slateFeelsSummary');
      const feelsApply = document.getElementById('slateFeelsApplyBtn');
      const feelsNext = document.getElementById('slateFeelsNextBtn');

      if (feelsTitle) feelsTitle.textContent = stripEmojis(currentReel.title || currentReel.taskTitle || 'Creative Sprint Gig');
      if (clientChip) clientChip.textContent = stripEmojis(currentReel.clientName || 'Design Guild & Arts Council');
      if (bountyChip) {
        const bountyCash = currentReel.bountyCash ? stripEmojis(currentReel.bountyCash) + ' • ' : '';
        const bountyKp = currentReel.bountyKarma || 850;
        bountyChip.textContent = `${bountyCash}${bountyKp} KP`;
      }
      if (feelsSummary) feelsSummary.textContent = stripEmojis(currentReel.taskDescription || currentReel.caption || 'Produce modular particle animations, interactive stage projections, and ambient visuals for the main stage showcase.');

      if (feelsApply) {
        const isApplied = (applications || []).some(a => a.itemId === currentReel.id);
        feelsApply.innerHTML = `<i data-lucide="check" class="lucide-icon-xs"></i><span>${isApplied ? 'Accepted' : 'Accept Gig'}</span>`;
        feelsApply.onclick = (e) => {
          e.stopPropagation();
          recordApplication(currentReel, 'feel');
          triggerConfetti();
          renderSlateStudio();
        };
      }
      if (feelsNext) {
        feelsNext.onclick = (e) => {
          e.stopPropagation();
          state.currentReelIndex = (state.currentReelIndex + 1) % reels.length;
          renderSlateStudio();
        };
      }
    }
  }

  // 4. Tab 4: Application Vault
  const appsListEl = document.getElementById('slateAppsList');
  if (appsListEl) {
    const activeApps = (applications && applications.length > 0) ? applications : [
      {
        id: 'seed-app-1',
        itemId: 'announcement-1',
        title: 'Student UI/UX Lead for Campus Hackathon Portal',
        organizer: 'Design Guild',
        type: 'vacancy',
        status: 'UNDER REVIEW',
        timestamp: '2 hours ago'
      },
      {
        id: 'seed-app-2',
        itemId: 'announcement-2',
        title: 'Autonomous Drone Swarm Flight Pilot',
        organizer: 'Robotics Guild',
        type: 'vacancy',
        status: 'ACCEPTED',
        timestamp: '1 day ago'
      },
      {
        id: 'seed-app-3',
        itemId: 'announcement-3',
        title: 'Creative Sprint: Interactive 3D Visuals',
        organizer: 'Arts Council',
        type: 'feel',
        status: 'SUBMITTED',
        timestamp: '3 days ago'
      }
    ];

    appsListEl.innerHTML = activeApps.slice(0, 3).map(app => `
      <div class="slate-app-row" data-item-id="${app.itemId || ''}">
        <div style="display: flex; flex-direction: column; text-align: left; gap: 2px;">
          <strong style="color: #ffffff; font-size: 0.72rem;">${stripEmojis(app.title.substring(0, 32))}${app.title.length > 32 ? '...' : ''}</strong>
          <small style="color: #aaaaaa; font-size: 0.62rem;">${stripEmojis(typeof app.organizer === 'string' ? app.organizer : app.organizer?.name || 'Campus Society')} • ${app.type === 'feel' ? 'Gig Bounty' : 'Vacancy'}</small>
        </div>
        <span style="background: ${app.status === 'ACCEPTED' ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.12)'}; color: #ffffff; padding: 3px 8px; border-radius: 6px; font-weight: 800; font-size: 0.60rem; letter-spacing: 0.5px; border: 1px solid rgba(255, 255, 255, 0.16);">${app.status || 'SUBMITTED'}</span>
      </div>
    `).join('');

    appsListEl.querySelectorAll('.slate-app-row').forEach(row => {
      row.onclick = () => {
        const itemId = row.getAttribute('data-item-id');
        if (itemId) {
          const notice = announcements.find(a => a.id === itemId);
          if (notice) openDetailModal(notice.id);
        }
      };
    });
  }

  // 5. Cascading Deck (Campus Dispatch Deck - strictly cards, not navigation tabs)
  if (visibleNotices.length > 0) {
    const total = visibleNotices.length;
    const card0 = visibleNotices[slateDeckOffset % total];
    const card1 = visibleNotices[(slateDeckOffset + 1) % total];
    const card2 = visibleNotices[(slateDeckOffset + 2) % total];

    const idxEl = document.getElementById('slateStackIndex');
    if (idxEl) idxEl.textContent = `${(slateDeckOffset % total) + 1}/${total}`;

    // Front Card (Card 0)
    if (card0) {
      const frontBadge = document.getElementById('slateFrontBadge');
      const frontTitle = document.getElementById('slateFrontTitle');
      const frontSummary = document.getElementById('slateFrontSummary');
      const frontReward = document.getElementById('slateFrontReward');
      const frontAction = document.getElementById('slateFrontActionBtn');

      if (frontBadge) frontBadge.textContent = stripEmojis(card0.isClubOnly ? `${card0.clubName || 'Private'}` : (card0.categoryLabel || 'Dispatch'));
      if (frontTitle) frontTitle.textContent = stripEmojis(card0.title);
      if (frontSummary) frontSummary.textContent = stripEmojis(card0.summary || card0.content || '');
      if (frontReward) frontReward.textContent = stripEmojis(card0.compensation || 'Verified Notice');
      if (frontAction) frontAction.onclick = (e) => {
        e.stopPropagation();
        openDetailModal(card0.id);
      };
    }

    // Mid Card (Card 1)
    if (card1) {
      const midTitle = document.getElementById('slateMidTitle');
      const midSub = document.getElementById('slateMidSub');
      if (midTitle) midTitle.textContent = stripEmojis(card1.title);
      if (midSub) midSub.textContent = stripEmojis(card1.clubName ? `${card1.clubName} • ${card1.categoryLabel || 'Notice'}` : 'Queued Opportunity');
    }

    // Back Card (Card 2)
    if (card2) {
      const backTitle = document.getElementById('slateBackTitle');
      const backSub = document.getElementById('slateBackSub');
      if (backTitle) backTitle.textContent = stripEmojis(card2.title);
      if (backSub) backSub.textContent = stripEmojis(card2.clubName ? `${card2.clubName} • Upcoming` : 'Upcoming Notice');
    }
  }

  // 6. User Avatar Initials
  const avatarInitialsEl = document.getElementById('slateAvatarInitials');
  if (avatarInitialsEl && userProfile?.avatarLetter) {
    avatarInitialsEl.textContent = userProfile.avatarLetter;
  }

  refreshIcons();
}

export function initSlateStudio() {
  // Dock Pill Tab Switching (Primary Functional Navigation)
  document.querySelectorAll('.slate-dock-pill-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const tab = btn.getAttribute('data-slate-tab') || 'spotlight';
      switchSlateTab(tab);
    };
  });

  // Floating Layout Switcher & Dock Switcher
  const floatingBtn = document.getElementById('slateFloatingSwitchBtn');
  const floatingMenu = document.getElementById('slateFloatingMenu');
  const dockToolBtn = document.getElementById('slateFilterToggleBtn');

  const toggleFloatingMenu = (e) => {
    e.stopPropagation();
    if (floatingMenu) {
      floatingMenu.classList.toggle('open');
    }
  };

  if (floatingBtn) floatingBtn.onclick = toggleFloatingMenu;
  if (dockToolBtn) dockToolBtn.onclick = toggleFloatingMenu;

  document.addEventListener('click', (e) => {
    if (floatingMenu && !e.target.closest('.slate-floating-switcher') && !e.target.closest('#slateFilterToggleBtn')) {
      floatingMenu.classList.remove('open');
    }
  });

  document.querySelectorAll('.slate-menu-opt-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const style = btn.getAttribute('data-style');
      applyUiStyle(style);
      if (floatingMenu) floatingMenu.classList.remove('open');
    };
  });

  // Cascading Stack Cycling & Direct Card Clicking
  const cycleBtn = document.getElementById('slateCycleStackBtn');
  const stackCard0 = document.getElementById('slateStackCard0');
  const stackCard1 = document.getElementById('slateStackCard1');
  const stackCard2 = document.getElementById('slateStackCard2');

  const advanceStackBy = (offsetDelta) => {
    const visibleNotices = getVisibleAnnouncements();
    if (visibleNotices.length > 1) {
      slateDeckOffset = (slateDeckOffset + offsetDelta) % visibleNotices.length;
      const frontCard = document.getElementById('slateStackCard0');
      if (frontCard) {
        frontCard.style.transform = 'translateY(-8px) scale(1.02)';
        setTimeout(() => {
          frontCard.style.transform = '';
          renderSlateStudio();
        }, 120);
      } else {
        renderSlateStudio();
      }
    }
  };

  if (cycleBtn) cycleBtn.onclick = (e) => { e.stopPropagation(); advanceStackBy(1); };
  if (stackCard0) stackCard0.onclick = (e) => {
    if (e.target.closest('#slateFrontActionBtn') || e.target.closest('#slateCycleStackBtn')) return;
    advanceStackBy(1);
  };
  if (stackCard1) stackCard1.onclick = (e) => { e.stopPropagation(); advanceStackBy(1); };
  if (stackCard2) stackCard2.onclick = (e) => { e.stopPropagation(); advanceStackBy(2); };

  // Transceiver Mini Message Sending with Live Intelligent Auto-Reply
  const chatInput = document.getElementById('slateChatInput');
  const chatSendBtn = document.getElementById('slateChatSendBtn');
  const sendChatMessage = async () => {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    const conv = conversations.find(c => c.id === state.activeConversationId) || conversations[0];
    if (conv) {
      chatInput.value = '';
      try {
        const newMsg = await apiSendMessage(conv.id, text);
        if (!conv.messages) conv.messages = [];
        if (!conv.messages.some(m => m.id === newMsg.id)) {
          conv.messages.push(newMsg);
        }
        renderSlateStudio();
        showToast('Message transmitted live over campus network', 'success');
      } catch (err) {
        showToast(`Failed to send: ${err.message}`, 'warning');
      }
    }
  };

  if (chatSendBtn) chatSendBtn.onclick = sendChatMessage;
  if (chatInput) {
    chatInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    };
  }

  // Prompt Bar
  const promptPlusBtn = document.getElementById('slatePromptPlusBtn');
  const promptExecBtn = document.getElementById('slatePromptExecBtn');
  const promptInput = document.getElementById('slatePromptInput');

  if (promptPlusBtn) {
    promptPlusBtn.onclick = () => {
      createModal.showModal();
    };
  }

  const handlePromptSubmit = () => {
    if (!promptInput) return;
    const query = promptInput.value.trim();
    if (slateActiveTab === 'messaging') {
      if (query) {
        const chatInput = document.getElementById('slateChatInput');
        if (chatInput) chatInput.value = query;
        sendChatMessage();
        promptInput.value = '';
      }
      return;
    }
    if (query) {
      state.searchQuery = query;
      if (announcementSearchInput) announcementSearchInput.value = query;
      renderAnnouncements();
      renderSlateStudio();
      switchSlateTab('spotlight');
    } else {
      createModal.showModal();
    }
  };

  if (promptExecBtn) promptExecBtn.onclick = handlePromptSubmit;
  if (promptInput) {
    promptInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePromptSubmit();
      }
    };
  }

  // Deadlines & Calendar Grid Sub-Panel Interactivity
  const calGridCells = document.querySelectorAll('.slate-grid-cell:not(.dim), .slate-cal-day');
  const deadlineItems = document.querySelectorAll('.slate-deadline-item');

  calGridCells.forEach(dayBtn => {
    dayBtn.onclick = (e) => {
      e.stopPropagation();
      calGridCells.forEach(d => d.classList.remove('active'));
      dayBtn.classList.add('active');

      const day = dayBtn.getAttribute('data-day');
      const match = Array.from(deadlineItems).find(item => item.getAttribute('data-day') === day);
      deadlineItems.forEach(item => item.classList.remove('active'));
      if (match) {
        match.classList.add('active');
        const noticeId = match.getAttribute('data-notice-id');
        if (noticeId) {
          const notice = announcements.find(a => a.id === noticeId);
          if (notice) {
            switchSlateTab('spotlight');
            renderSlateStudio();
            showToast(`Selected deadline for Sep ${day}: ${notice.title}`, 'info');
          }
        }
      } else {
        showToast(`Calendar: Sep ${day}, 2026 — Next active deadline is Today 23:59`, 'info');
      }
    };
  });

  deadlineItems.forEach(item => {
    item.onclick = (e) => {
      e.stopPropagation();
      deadlineItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const day = item.getAttribute('data-day');
      if (day) {
        calGridCells.forEach(d => {
          d.classList.toggle('active', d.getAttribute('data-day') === day);
        });
      }

      const noticeId = item.getAttribute('data-notice-id');
      if (noticeId) {
        const notice = announcements.find(a => a.id === noticeId);
        if (notice) {
          openDetailModal(notice.id);
        }
      }
    };
  });

  const calPrevBtn = document.getElementById('slateCalPrevBtn');
  if (calPrevBtn) {
    calPrevBtn.onclick = (e) => {
      e.stopPropagation();
      showToast('Viewing previous period: August 2026 (All deadlines cleared)', 'info');
    };
  }

  const calNextBtn = document.getElementById('slateCalNextBtn');
  if (calNextBtn) {
    calNextBtn.onclick = (e) => {
      e.stopPropagation();
      showToast('Viewing upcoming horizon: October 2026 (6 sprint deadlines queued)', 'info');
    };
  }

  // Timeline Horizon Scrub Rail
  const sliderTrack = document.getElementById('slateSliderTrack');
  const sliderFill = document.getElementById('slateSliderFill');
  const sliderThumb = document.getElementById('slateSliderThumb');
  const sliderVal = document.getElementById('slateSliderVal');

  if (sliderTrack) {
    const updateSlider = (e) => {
      const rect = sliderTrack.getBoundingClientRect();
      const pct = Math.max(0.05, Math.min(1, (e.clientX - rect.left) / rect.width));
      const pctInt = Math.round(pct * 100);
      if (sliderFill) sliderFill.style.width = `${pctInt}%`;
      if (sliderThumb) sliderThumb.style.left = `${pctInt}%`;

      if (sliderVal) {
        if (pct < 0.35) {
          sliderVal.textContent = "Horizon: 7 Days (2 Active Deadlines)";
        } else if (pct < 0.7) {
          sliderVal.textContent = "Horizon: 14 Days (4 Active Deadlines)";
        } else {
          sliderVal.textContent = "Horizon: 30 Days (8 Active Deadlines)";
        }
      }
    };

    sliderTrack.onclick = (e) => {
      updateSlider(e);
    };

    let isDragging = false;
    sliderTrack.onmousedown = (e) => {
      isDragging = true;
      updateSlider(e);
    };
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e);
    });
    window.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });
  }

  // Telemetry metric pills click interactivity
  document.querySelectorAll('.slate-metric-pill').forEach(pill => {
    pill.onclick = () => {
      const lbl = pill.querySelector('.metric-lbl')?.textContent || 'Metric';
      const num = pill.querySelector('.metric-num')?.textContent || '';
      triggerConfetti();
      showToast(`Telemetry: ${lbl} index verified at ${num}`, 'info');
    };
  });

  // Fanned Credential Cards (Clickable with rich feedback)
  document.querySelectorAll('.slate-fan-card').forEach(card => {
    card.onclick = (e) => {
      e.stopPropagation();
      const title = card.getAttribute('data-pass-title') || 'Credential Pass';
      const desc = card.getAttribute('data-pass-desc') || 'Verified campus credential.';
      triggerConfetti();
      showToast(`Credential Verified: ${title} — ${desc}`, 'success');
    };
  });

  // Seam Notch & Sparkle buttons
  const notchBtn = document.getElementById('slateNotchBtn');
  if (notchBtn) {
    notchBtn.onclick = (e) => {
      e.stopPropagation();
      notchBtn.classList.toggle('active');
      const isOn = notchBtn.classList.contains('active');
      showToast(isOn ? 'Live collegiate broadcast stream connected' : 'Broadcast stream disconnected', isOn ? 'success' : 'info');
    };
  }

  const sparkleBtn = document.getElementById('slateSparkleBtn');
  if (sparkleBtn) {
    sparkleBtn.onclick = (e) => {
      e.stopPropagation();
      triggerConfetti();
      switchSlateTab('spotlight');
      showToast(`AI Spotlight: ${userProfile.name}'s profile in top 4% of campus scholars`, 'success');
    };
  }

  // Dock Avatar profile shortcut
  const dockAvatar = document.getElementById('slateDockAvatar');
  if (dockAvatar) {
    dockAvatar.onclick = (e) => {
      e.stopPropagation();
      openProfileDrawer();
    };
  }
}

window.applyUiStyle = applyUiStyle;
window.switchSlateTab = switchSlateTab;
window.renderSlateStudio = renderSlateStudio;
window.initSlateStudio = initSlateStudio;

// ============================================================================
// REAL BACKEND & MULTI-USER LIVE SYNC (NO MORE LARP)
// ============================================================================

let allUsersList = [];
let allClubsList = [];

async function updateDynamicTelemetry() {
  try {
    const telemetry = await apiGetTelemetry();
    if (!telemetry) return;

    const activeBadge = document.getElementById('telemetryActiveCountBadge');
    if (activeBadge) activeBadge.textContent = `${telemetry.totalContributions} Contributions`;

    const weekGainBadge = document.getElementById('telemetryWeekGainBadge');
    if (weekGainBadge) weekGainBadge.textContent = `+${telemetry.weekTotal} KP This Week`;

    const curveHeaderBadge = document.getElementById('telemetryCurveHeaderBadge');
    if (curveHeaderBadge) curveHeaderBadge.textContent = `+${telemetry.weekTotal} KP this week`;

    const peakGainVal = document.getElementById('telemetryPeakGainVal');
    if (peakGainVal) peakGainVal.textContent = `+${telemetry.peakGain} KP`;

    const peakDayLbl = document.getElementById('telemetryPeakDayLbl');
    if (peakDayLbl) peakDayLbl.textContent = `${telemetry.peakDay} Peak Gain`;

    const weekTotalVal = document.getElementById('telemetryWeekTotalVal');
    if (weekTotalVal) weekTotalVal.textContent = `${telemetry.weekTotal} KP`;

    const rankVal = document.getElementById('telemetryRankVal');
    if (rankVal) rankVal.textContent = telemetry.campusRank;

    const docketBadge = document.getElementById('intellyDocketBadge');
    if (docketBadge) docketBadge.textContent = `${telemetry.activeApplications} Active`;

    const scoreHack = document.getElementById('telemetryScoreHackathons');
    if (scoreHack && telemetry.scores) scoreHack.textContent = telemetry.scores.hackathons;

    const scoreGuild = document.getElementById('telemetryScoreGuilds');
    if (scoreGuild && telemetry.scores) scoreGuild.textContent = telemetry.scores.guilds;

    const scoreBounty = document.getElementById('telemetryScoreBounties');
    if (scoreBounty && telemetry.scores) scoreBounty.textContent = telemetry.scores.bounties;

    // Dynamic SVG Curve
    const curvePath = document.getElementById('telemetryCurvePath');
    const curveDot = document.getElementById('telemetryCurveDot');
    if (curvePath && telemetry.dailyPoints && telemetry.dailyPoints.length) {
      const maxPt = Math.max(...telemetry.dailyPoints, 100);
      const points = telemetry.dailyPoints.map((pt, i) => {
        const x = Math.round((i / (telemetry.dailyPoints.length - 1)) * 320);
        const y = Math.round(48 - (pt / maxPt) * 40);
        return { x, y };
      });

      let d = `M ${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        d += ` Q ${(prev.x + curr.x) / 2},${prev.y} ${curr.x},${curr.y}`;
      }
      curvePath.setAttribute('d', d);

      const maxVal = Math.max(...telemetry.dailyPoints);
      const maxIdx = telemetry.dailyPoints.indexOf(maxVal);
      if (curveDot && points[maxIdx]) {
        curveDot.setAttribute('cx', points[maxIdx].x);
        curveDot.setAttribute('cy', points[maxIdx].y);
      }
    }
  } catch (err) {
    console.warn('Telemetry fetch error', err);
  }
}

function initUserSwitcher() {
  const switchBtn = document.getElementById('openUserSwitchBtn');
  const switchMenu = document.getElementById('userSwitchMenu');
  const userListEl = document.getElementById('userSwitchList');

  if (!switchBtn || !switchMenu || !userListEl) return;

  switchBtn.onclick = (e) => {
    e.stopPropagation();
    const profileId = switchBtn.getAttribute('data-profile-id') || getActiveUserId();
    switchBtn.setAttribute('data-profile-id', profileId);
    openProfileDrawer('overview');
  };

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#userSwitchWrapper')) {
      switchMenu.style.display = 'none';
      switchBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const settingsBtn = document.getElementById('profileSettingsBtn');
  const signOutBtn = document.getElementById('profileSignOutBtn');
  if (settingsBtn) {
    settingsBtn.onclick = () => showToast('Settings are available from the theme controls.', 'info');
  }
  if (signOutBtn) {
    signOutBtn.onclick = () => showToast('Sign out is not available in this local demo.', 'info');
  }

  apiGetUsers().then(users => {
    allUsersList = users;
    renderUserSwitcherMenu(users);
  }).catch(err => console.warn('Could not fetch users for switcher', err));
}

function renderUserSwitcherMenu(users) {
  const userListEl = document.getElementById('userSwitchList');
  const labelEl = document.getElementById('headerUserIdentityLabel');
  const roleEl = document.querySelector('.profile-role');
  const avatarEl = document.getElementById('headerProfileAvatar');
  if (!userListEl || !users || !users.length) return;

  const activeId = getActiveUserId();
  const current = users.find(u => u.id === activeId) || users[0];
  if (labelEl && current) {
    labelEl.textContent = current.name.split(' ')[0];
    if (roleEl) roleEl.textContent = current.id === 'user-aditya' ? 'Student' : (current.role || 'Lead');
    if (avatarEl) avatarEl.textContent = current.avatarLetter || current.name.substring(0, 2).toUpperCase();
    const profileButton = document.getElementById('openUserSwitchBtn');
    if (profileButton) {
      profileButton.setAttribute('data-profile-id', current.id);
      profileButton.setAttribute('aria-label', `Open profile for ${current.name}`);
      profileButton.setAttribute('title', `Open ${current.name}'s profile`);
    }
  }

  userListEl.innerHTML = users.map(u => `
    <button class="user-switch-item-btn ${u.id === activeId ? 'active' : ''}" data-user-id="${u.id}" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.45rem 0.6rem; border-radius: 8px; border: 1px solid ${u.id === activeId ? 'var(--accent-base, #6366f1)' : 'transparent'}; background: ${u.id === activeId ? 'rgba(99, 102, 241, 0.15)' : 'transparent'}; color: var(--text-primary); cursor: pointer; text-align: left; width: 100%; transition: background 0.15s;">
      <div style="width: 28px; height: 28px; border-radius: 50%; background: ${u.accent || '#6366f1'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800;">
        ${u.avatarLetter}
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 700; font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.name}</div>
        <div style="font-size: 0.68rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.role || u.department}</div>
      </div>
      <div style="font-size: 0.72rem; font-weight: 700; color: #f59e0b;">
        ${u.karmaPoints} KP
      </div>
    </button>
  `).join('');

  userListEl.querySelectorAll('.user-switch-item-btn').forEach(btn => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const selectedId = btn.getAttribute('data-user-id');
      if (selectedId === activeId) {
        document.getElementById('userSwitchMenu').style.display = 'none';
        return;
      }
      setActiveUserId(selectedId);
      document.getElementById('userSwitchMenu').style.display = 'none';
      const selectedUser = users.find(u => u.id === selectedId);
      showToast(`Active identity switched to: ${selectedUser ? selectedUser.name : selectedId}`, 'info', 2500);
      await loadAllBackendData();
    };
  });
}

function handleRealtimeEvent(event) {
  if (!event || !event.type) return;

  switch (event.type) {
    case 'EVENT_NEW_ANNOUNCEMENT': {
      const exists = announcements.some(a => a.id === event.announcement.id);
      if (!exists) {
        announcements.unshift(event.announcement);
        renderAnnouncements();
        renderCategoryBar();
        showToast(`New: ${event.announcement.title.substring(0, 30)}...`, 'info');
      }
      break;
    }
    case 'EVENT_ANNOUNCEMENT_DELETED': {
      announcements = announcements.filter(a => a.id !== event.announcementId);
      renderAnnouncements();
      renderCategoryBar();
      break;
    }
    case 'EVENT_ANNOUNCEMENT_UPDATED': {
      const ann = announcements.find(a => a.id === event.announcementId);
      if (ann) {
        ann.rsvps = event.rsvps;
        renderAnnouncements();
      }
      break;
    }
    case 'EVENT_NEW_REEL': {
      const exists = reels.some(r => r.id === event.reel.id);
      if (!exists) {
        reels.unshift(event.reel);
        renderFeelsFeed();
        showToast(`New Campus Gig Reel: ${event.reel.title.substring(0, 30)}...`, 'info');
      }
      break;
    }
    case 'EVENT_NEW_APPLICATION': {
      const isMyNotice = event.organizerId === getActiveUserId();
      if (isMyNotice) {
        triggerConfetti();
        showToast(`New applicant for "${event.application.itemTitle}": ${event.application.applicantName}!`, 'success', 5000);
      }
      apiGetApplications('mine').then(apps => {
        applications = apps;
        renderApplicationsList();
      });
      break;
    }
    case 'EVENT_APPLICATION_UPDATED': {
      const isMyApplication = event.applicantId === getActiveUserId();
      if (isMyApplication) {
        if (event.application.status === 'accepted') {
          triggerConfetti();
          showToast(`Your application for "${event.application.itemTitle}" was ACCEPTED!`, 'success', 6000);
        } else if (event.application.status === 'completed') {
          triggerConfetti();
          showToast(`+${event.karmaAwarded} Karma Points awarded for completing "${event.application.itemTitle}"!`, 'success', 6000);
        }
      }
      loadAllBackendData();
      break;
    }
    case 'EVENT_NEW_MESSAGE': {
      const isParticipant = event.participants && event.participants.includes(getActiveUserId());
      if (!isParticipant) return;

      const conv = conversations.find(c => c.id === event.conversationId);
      if (conv) {
        if (!conv.messages) conv.messages = [];
        if (!conv.messages.some(m => m.id === event.message.id)) {
          conv.messages.push(event.message);
        }
        if (state.activeConversationId === event.conversationId) {
          renderActiveChat();
        } else {
          showToast(`${event.message.senderName}: "${event.message.text.substring(0, 25)}..."`, 'info');
        }
        renderConversationsList();
      } else {
        apiGetConversations().then(convs => {
          conversations = convs;
          renderConversationsList();
          if (state.activeConversationId === event.conversationId) {
            renderActiveChat();
          }
        });
      }
      break;
    }
    case 'USER_UPDATED': {
      if (event.user && event.user.id === getActiveUserId()) {
        userProfile = event.user;
        syncUserProfileToUI();
        updateKarmaDisplay();
      }
      break;
    }
    case 'CLUB_UPDATED': {
      apiGetClubs().then(clubs => {
        allClubsList = clubs;
        syncUserProfileToUI();
      });
      break;
    }
  }
}

async function loadAllBackendData() {
  try {
    const [user, annList, reelList, convList, appList, clubs, users] = await Promise.all([
      apiGetCurrentUser().catch(err => { console.warn('User fetch fallback', err); return userProfile; }),
      apiGetAnnouncements().catch(() => announcements),
      apiGetReels().catch(() => reels),
      apiGetConversations().catch(() => conversations),
      apiGetApplications('mine').catch(() => applications),
      apiGetClubs().catch(() => AVAILABLE_CLUBS),
      apiGetUsers().catch(() => [])
    ]);

    if (user) {
      userProfile = user;
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
    }
    if (annList) {
      announcements = annList;
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    }
    if (reelList) {
      reels = reelList;
      localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
    }
    if (convList) {
      conversations = convList;
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
      if (!state.activeConversationId && conversations[0]) {
        state.activeConversationId = conversations[0].id;
      }
    }
    if (appList) {
      applications = appList;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    }
    if (clubs) {
      allClubsList = clubs;
    }
    if (users && users.length) {
      allUsersList = users;
      renderUserSwitcherMenu(users);
    }

    syncUserProfileToUI();
    updateKarmaDisplay();
    renderCategoryBar();
    renderAnnouncements();
    renderConversationsList();
    renderActiveChat();
    renderApplicationsList();
    renderFeelsFeed();
    updateDynamicTelemetry();
    refreshIcons();
  } catch (err) {
    console.error('Error loading backend data:', err);
  }
}

// Initialization
initTheme();
setupThemeCustomizer();
initUiStyleSelector();
setupSapphireInteractivity();
initIntellyControls();
initSlateStudio();
setupPhonePreviewModal();
initUserSwitcher();
const headerProfileTrigger = document.getElementById('openUserSwitchBtn');
if (headerProfileTrigger) {
  headerProfileTrigger.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openProfileDrawer('overview');
  };
}
syncUserProfileToUI();
renderApplicationsList();
updateKarmaDisplay();
renderCategoryBar();
renderAnnouncements();
renderConversationsList();
renderActiveReel();
document.body.setAttribute('data-active-tab', state.activeTab || 'announcements');
document.documentElement.setAttribute('data-active-tab', state.activeTab || 'announcements');
refreshIcons();

// Start WebSocket connection and fetch fresh backend database
initWebSocket(handleRealtimeEvent);
loadAllBackendData();

