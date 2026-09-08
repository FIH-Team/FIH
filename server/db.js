import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const SEED_USERS = [
  {
    id: "user-aditya",
    name: "Aditya Verma",
    handle: "@aditya_v",
    studentId: "2023-CS-042",
    department: "Computer Science & Design",
    avatarLetter: "AV",
    accent: "#6366f1",
    karmaPoints: 1250,
    followers: 521,
    following: 345,
    creations: 18,
    bio: "Full-stack developer and student UI designer building open infrastructure for campus activities.",
    tags: ["@developer", "@designer", "@react", "@uiux", "@systems"],
    clubs: ["Design Guild", "AI & Code Collective", "Cultural Council"],
    role: "Undergraduate Student / Full-Stack Builder"
  },
  {
    id: "user-kavya",
    name: "Kavya Patel",
    handle: "@kavya_p",
    studentId: "2022-MC-018",
    department: "Media & Cultural Studies",
    avatarLetter: "KP",
    accent: "#ec4899",
    karmaPoints: 3400,
    followers: 890,
    following: 410,
    creations: 34,
    bio: "Cultural Council Head & Stage Director for Ignite 2026. Managing campus fests and audio-visual setups.",
    tags: ["@cultural", "@fest", "@stagecraft", "@logistics"],
    clubs: ["Cultural Council"],
    role: "Cultural Council Head • Ignite 2026"
  },
  {
    id: "user-aarav",
    name: "Aarav Sharma",
    handle: "@aarav_s",
    studentId: "2022-RO-007",
    department: "Robotics & Mechatronics",
    avatarLetter: "AS",
    accent: "#3b82f6",
    karmaPoints: 2850,
    followers: 640,
    following: 220,
    creations: 27,
    bio: "Lead builder for Team Cerberus. ROS 2, quadruped robots, PCB design and autonomous rover telemetry.",
    tags: ["@robotics", "@ros2", "@embedded", "@drones"],
    clubs: ["Robotics Society"],
    role: "Team Cerberus Robotics Lead"
  },
  {
    id: "user-rohan",
    name: "Rohan Verma",
    handle: "@rohan_v",
    studentId: "2023-EE-091",
    department: "Electrical Engineering & E-Cell",
    avatarLetter: "RV",
    accent: "#8b5cf6",
    karmaPoints: 2100,
    followers: 430,
    following: 310,
    creations: 12,
    bio: "E-Cell Technical Lead. Revamping venture portal and startup founder dashboards.",
    tags: ["@ecell", "@startups", "@frontend", "@finance"],
    clubs: ["E-Cell Incubator"],
    role: "E-Cell Technical Council Lead"
  },
  {
    id: "user-priya",
    name: "Priya Nair",
    handle: "@priya_n",
    studentId: "2023-CS-112",
    department: "Computer Science",
    avatarLetter: "PN",
    accent: "#06b6d4",
    karmaPoints: 1950,
    followers: 710,
    following: 380,
    creations: 15,
    bio: "GDSC Lead & AI Researcher. Organizing hands-on LLM bootcamps and PyTorch hackathons.",
    tags: ["@ai", "@gdsc", "@pytorch", "@python"],
    clubs: ["AI & Code Collective"],
    role: "Google Developer Student Club (GDSC) Lead"
  }
];

export const SEED_CLUBS = [
  { id: "club-design", name: "Design Guild", icon: "🎨", description: "UI/UX, 3D, and Branding", members: ["user-aditya"] },
  { id: "club-robotics", name: "Robotics Society", icon: "🤖", description: "Hardware, Drones, and IoT Systems", members: ["user-aarav"] },
  { id: "club-cultural", name: "Cultural Council", icon: "🏛️", description: "Fests, Stagecraft, and Logistics", members: ["user-aditya", "user-kavya"] },
  { id: "club-ai", name: "AI & Code Collective", icon: "⚡", description: "Full-Stack, Agents, and Cloud Systems", members: ["user-aditya", "user-priya"] },
  { id: "club-ecell", name: "E-Cell Incubator", icon: "🚀", description: "Startups, Founders, and Pitch Sprints", members: ["user-rohan"] }
];

export const SEED_ANNOUNCEMENTS = [
  {
    id: "ann-vac-1",
    authorId: "user-kavya",
    title: "Stage Crew: Sound & Light Logistics for Ignite 2026",
    category: "vacancies",
    categoryLabel: "Club Vacancy",
    isVacancy: true,
    isUrgent: true,
    liveBadge: "15 Open Slots",
    openPositions: 15,
    claimedPositions: 9,
    bountyKarma: 800,
    compensation: "🪙 800 Karma Points + Backstage VIP Passes",
    accentColor: "#f59e0b",
    icon: "briefcase",
    organizer: {
      id: "user-kavya",
      name: "Kavya Patel",
      role: "Cultural Council Head • Ignite 2026",
      avatarLetter: "KP",
      accent: "#ec4899"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    targetAudience: "All Undergrads (Sound, Logistics, Stagecraft)",
    summary: "Immediate requirement for 6 student crew members to operate XLR sound consoles, stage lasers, and green room artist coordination.",
    content: `Ignite 2026 is mobilizing our operations brigade! We require student manpower to run the biggest campus weekend of the year.

Open Roles:
1. Stage & Sound Assistant (4 slots) - Assist sound engineers with XLR routing, mics, and artist monitors.
2. Backstage Hospitality Crew (2 slots) - Coordinate green rooms and artist escorts for celebrity night.
3. Crowd Logistics & Entry Marshal (6 slots) - Manage RFID scanner gates and VIP enclosure access.

Perks:
• Free festival crew merch & exclusive hoodie.
• 800 Karma Points credit into your student wallet.
• Certificate signed by Director of Student Welfare.`,
    tags: ["Vacancy", "Manpower", "Fest", "Sound", "Karma Points"],
    rsvps: 24,
    location: "Main Campus Amphitheater",
    clubName: "Cultural Council",
    isClubOnly: false
  },
  {
    id: "ann-club-priv-1",
    authorId: "user-aditya",
    title: "🔒 Design Guild Core: Figma Token Refactor & Secret Theme Sprint",
    category: "club",
    categoryLabel: "Club Exclusive",
    isClubOnly: true,
    clubName: "Design Guild",
    accentColor: "#ec4899",
    icon: "lock",
    liveBadge: "Members Only",
    bountyKarma: 600,
    compensation: "🪙 600 KP Sprint Credit",
    organizer: {
      id: "user-aditya",
      name: "Design Guild Steering Council",
      role: "Design Guild • Core Leads",
      avatarLetter: "DG",
      accent: "#ec4899"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    targetAudience: "Verified Design Guild Members Only",
    summary: "Confidential working session for verified Design Guild members to review internal Design Tokens, Figma variables, and preview confidential Ignite stage themes.",
    content: `RESTRICTED DISPATCH FOR DESIGN GUILD MEMBERS:
Please do not forward or distribute outside the guild channel.

Session Agenda (Studio 4B, Friday 5:30 PM):
1. Component library audit: Design Tokens migration to Figma Variables v3.
2. Confidential preview of the Ignite 2026 branding art directions.
3. Allocation of junior design squad sprint deliverables.`,
    tags: ["Design Guild", "Private", "Figma", "Core Members"],
    rsvps: 18,
    location: "Design Studio 4B (Keycard Access)"
  },
  {
    id: "ann-club-priv-2",
    authorId: "user-aarav",
    title: "🔒 Robotics Society: Autonomous Rover Telemetry & Lab Access Passcodes",
    category: "club",
    categoryLabel: "Club Exclusive",
    isClubOnly: true,
    clubName: "Robotics Society",
    accentColor: "#3b82f6",
    icon: "lock",
    liveBadge: "Members Only",
    bountyKarma: 500,
    compensation: "Hardware Lab RFID Privileges",
    organizer: {
      id: "user-aarav",
      name: "Aarav Sharma",
      role: "Team Cerberus Robotics Lead",
      avatarLetter: "AS",
      accent: "#3b82f6"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    targetAudience: "Enrolled Robotics Society Members",
    summary: "Confidential hardware lab dispatch: New bench assignments, ROS2 micro-controller architecture, and updated RFID biometric access for the Advanced Robotics Lab.",
    content: `MEMBERS-ONLY ANNOUNCEMENT FOR ROBOTICS SOCIETY:
Access to the high-voltage testing bench and 3D printing farm requires biometric enrollment.

Updates:
• ROS2 Humble nodes are compiled on the local Jetson Orin cluster.
• Updated door passcodes have been sent to registered members via GPG mail.`,
    tags: ["Robotics Society", "Private", "Hardware", "Lab Access"],
    rsvps: 14,
    location: "Advanced Robotics Facility, Room 102"
  },
  {
    id: "ann-club-pub-1",
    authorId: "user-aarav",
    title: "🌐 Robotics Society: All-Campus Drone Racing & RoboWars Open Showcase",
    category: "club",
    categoryLabel: "Club Public",
    isClubOnly: false,
    clubName: "Robotics Society",
    accentColor: "#10b981",
    icon: "users",
    liveBadge: "Open To All",
    bountyKarma: 350,
    compensation: "🪙 350 KP Audience Bounties",
    organizer: {
      id: "user-aarav",
      name: "Robotics Society",
      role: "Official University Society",
      avatarLetter: "RS",
      accent: "#10b981"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    targetAudience: "All Students, Faculty & Guests",
    summary: "Open to all university students! Live combat robot exhibition, FPV drone obstacle courses, and hands-on beginner telemetry simulators at the Central Quad.",
    content: `Robotics Society cordially invites the entire campus community to our annual RoboWars Spring Showcase!
• Live 15kg combat bot battles inside the polycarbonate arena.
• Test-drive an FPV quadcopter simulator with student pilot mentors.
• Refreshments and 350 Karma Points for audience participation.`,
    tags: ["Robotics Society", "Public", "Drone", "Showcase"],
    rsvps: 92,
    location: "Central Campus Quadrangle"
  },
  {
    id: "ann-vac-2",
    authorId: "user-rohan",
    title: "UI/UX Designer & Web Lead for E-Cell Incubator Dashboard",
    category: "vacancies",
    categoryLabel: "Club Vacancy",
    isVacancy: true,
    liveBadge: "🪙 1,200 KP Bounty",
    openPositions: 3,
    claimedPositions: 1,
    bountyKarma: 1200,
    compensation: "🪙 1,200 Karma Points / ₹4,000 stipend",
    accentColor: "#8b5cf6",
    icon: "sparkles",
    organizer: {
      id: "user-rohan",
      name: "Rohan Verma",
      role: "E-Cell Technical Council",
      avatarLetter: "RV",
      accent: "#8b5cf6"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    targetAudience: "Designers & Frontend Devs (Figma, React, CSS)",
    summary: "Design and ship the new Venture Cell portal for 20+ incubated startups. Immediate opening for 2 student designers and 1 frontend lead.",
    content: `The Entrepreneurship Cell needs skilled student manpower to revamp our incubation dashboard.

Role Responsibilities:
• Create interactive design systems in Figma for founder pitch portals.
• Build reusable UI components with responsive layouts.
• Work directly with incubated startup founders and VC advisors.`,
    tags: ["Vacancy", "UI/UX", "Frontend", "E-Cell", "Karma Points"],
    rsvps: 18,
    location: "Incubator Hub, 5th Floor"
  },
  {
    id: "ann-2",
    authorId: "user-priya",
    title: "Hands-On Generative AI & Autonomous Agent Architecture",
    category: "workshop",
    categoryLabel: "Timed Workshop",
    isTimed: true,
    liveBadge: "Starts in 18h",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 18 + 1000 * 60 * 30).toISOString(),
    bountyKarma: 400,
    compensation: "🪙 400 KP + Certificate",
    accentColor: "#06b6d4",
    icon: "zap",
    organizer: {
      id: "user-priya",
      name: "Priya Nair",
      role: "Google Developer Student Club (GDSC)",
      avatarLetter: "PN",
      accent: "#06b6d4"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    targetAudience: "Computer Science, AI/ML & Engineering",
    totalSeats: 75,
    claimedSeats: 58,
    summary: "Hands-on intensive bootcamp building production RAG pipelines, local LLM fine-tuning, and multi-agent coordination with PyTorch & LangChain.",
    content: `Join GDSC and the AI Research Guild for a fast-paced coding workshop where you'll build your own autonomous AI agent from scratch.

Prerequisites & Requirements:
• Bring your laptop with Python 3.10+ installed.
• Basic familiarity with Python functions and Git.
• We provide free GPU cloud compute credits for all registered attendees.`,
    tags: ["AI/ML", "Workshop", "Coding", "Hands-On", "Certificate"],
    rsvps: 58,
    location: "Turing Innovation Lab, Block 4"
  }
];

export const SEED_REELS = [
  {
    id: "feel-1",
    authorId: "user-kavya",
    title: "Video Editor: 90s High-Energy Fest Teaser",
    clientName: "Cultural Fest Council",
    clientRole: "Verified Campus Society",
    avatarLetter: "CC",
    accent: "#ec4899",
    problemStatement: "We shot 120GB of 4K footage from the celebrity concert. Need a student editor to cut an energetic 90-second teaser reel with beat sync, glitch transitions, and color grade.",
    skillsRequired: ["Premiere Pro", "After Effects", "Sound Design", "Color Grading"],
    bountyKarma: 1500,
    bountyCash: "₹3,500",
    deadline: "Submit in 48 hours",
    urgency: "First Come First Serve",
    slotsAvailable: 1,
    likesCount: 148,
    claimedBy: []
  },
  {
    id: "feel-2",
    authorId: "user-priya",
    title: "Mobile App Dev: Offline Campus GPS Routing",
    clientName: "Student Tech Guild",
    clientRole: "Tech Council Sponsored",
    avatarLetter: "TG",
    accent: "#06b6d4",
    problemStatement: "Freshers keep getting lost between North Campus and the Innovation Annex! We have the Figma designs ready; need a React Native or Flutter developer to implement offline indoor map routing.",
    skillsRequired: ["React Native", "Flutter", "Figma", "Mapbox SDK"],
    bountyKarma: 2400,
    bountyCash: "₹6,000",
    deadline: "1-Week Sprint",
    urgency: "Featured Gig",
    slotsAvailable: 2,
    likesCount: 312,
    claimedBy: []
  },
  {
    id: "feel-3",
    authorId: "user-aditya",
    title: "Graphic Designer: Vector Streetwear Merch & Posters",
    clientName: "Design Guild",
    clientRole: "Official Student Society",
    avatarLetter: "DG",
    accent: "#f59e0b",
    problemStatement: "Designing custom oversized hoodies and holographic entry wristbands for our national techno-cultural fest. Vector illustrations and print-ready CMYK files required.",
    skillsRequired: ["Adobe Illustrator", "Photoshop", "Typography", "Merch Prep"],
    bountyKarma: 1200,
    bountyCash: "₹2,800",
    deadline: "Friday Evening",
    urgency: "3 Spots Open",
    slotsAvailable: 3,
    likesCount: 226,
    claimedBy: []
  }
];

export const SEED_CONVERSATIONS = [
  {
    id: "conv-kavya-aditya",
    participants: ["user-aditya", "user-kavya"],
    partnerId: "user-kavya",
    partnerName: "Kavya Patel",
    partnerTitle: "Cultural Council Head • Ignite 2026",
    avatarLetter: "KP",
    accent: "#ec4899",
    isOnline: true,
    lastSeen: "Online",
    topicContext: "Ignite 2026 Stage Logistics Vacancy",
    messages: [
      {
        id: "m-1",
        senderId: "user-kavya",
        senderName: "Kavya Patel",
        text: "Hey Aditya! Saw your profile from the sound engineering lab. Are you available for the Ignite 2026 artist sound check on Friday?",
        timestamp: "10:14 AM"
      },
      {
        id: "m-2",
        senderId: "user-aditya",
        senderName: "Aditya Verma",
        text: "Hi Kavya! Yes, I've managed Yamaha digital mixers and XLR patch bays before. I'm completely free after 2 PM.",
        timestamp: "10:18 AM"
      },
      {
        id: "m-3",
        senderId: "user-kavya",
        senderName: "Kavya Patel",
        text: "Awesome! Check out the open vacancy in the feed. Submit your pitch there and I'll confirm your slot!",
        timestamp: "10:22 AM"
      }
    ]
  },
  {
    id: "conv-aarav-aditya",
    participants: ["user-aditya", "user-aarav"],
    partnerId: "user-aarav",
    partnerName: "Aarav Sharma",
    partnerTitle: "Team Cerberus Robotics Lead",
    avatarLetter: "AS",
    accent: "#3b82f6",
    isOnline: true,
    lastSeen: "Active 5m ago",
    topicContext: "Team Cerberus Subsystem Auditions",
    messages: [
      {
        id: "m-4",
        senderId: "user-aarav",
        senderName: "Aarav Sharma",
        text: "Hi Aditya! Thanks for your interest in the autonomous navigation division.",
        timestamp: "Yesterday"
      },
      {
        id: "m-5",
        senderId: "user-aditya",
        senderName: "Aditya Verma",
        text: "Hey Aarav, is the take-home challenge focused on ROS 2 Humble or Foxy?",
        timestamp: "Yesterday"
      },
      {
        id: "m-6",
        senderId: "user-aarav",
        senderName: "Aarav Sharma",
        text: "We use ROS 2 Humble on Ubuntu 22.04 LTS. Check Lab 02 tomorrow for hardware setup.",
        timestamp: "Yesterday"
      }
    ]
  }
];

export const SEED_KARMA_LEDGER = [
  {
    id: "tx-1",
    userId: "user-aditya",
    amount: 500,
    type: "credit",
    reason: "Completed Hackathon UI Prototype (E-Cell)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: "tx-2",
    userId: "user-aditya",
    amount: 350,
    type: "credit",
    reason: "Audience Telemetry Bounty - RoboWars",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: "tx-3",
    userId: "user-aditya",
    amount: 400,
    type: "credit",
    reason: "Design Guild Token Refactor Sprint",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  }
];

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: SEED_USERS,
      clubs: SEED_CLUBS,
      announcements: SEED_ANNOUNCEMENTS,
      reels: SEED_REELS,
      applications: [],
      conversations: SEED_CONVERSATIONS,
      karmaLedger: SEED_KARMA_LEDGER,
      bookmarks: { "user-aditya": ["ann-vac-1", "ann-club-priv-1"] },
      rsvps: { "user-aditya": ["ann-club-pub-1"] }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read db.json, re-initializing...', err);
    return initDb();
  }
}

let dbInstance = initDb();

export function getDb() {
  return dbInstance;
}

export function saveDb(updatedDb) {
  dbInstance = updatedDb;
  fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
}
