// Campus Karma - Minimal & High-Utility Dataset
// Minimalist, authentic styling without heavy AI slop imagery

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-vac-1",
    title: "Stage Crew: Sound & Light Logistics for Ignite 2026",
    category: "vacancies",
    categoryLabel: "Club Vacancy",
    isVacancy: true,
    isUrgent: true,
    liveBadge: "15 Open Slots",
    openPositions: 15,
    claimedPositions: 9,
    compensation: "🪙 800 Karma Points + Backstage VIP Passes",
    accentColor: "#f59e0b",
    icon: "briefcase",
    organizer: {
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
    hasRsvpd: false,
    isBookmarked: true,
    location: "Main Campus Amphitheater",
    clubName: "Cultural Council",
    isClubOnly: false
  },
  {
    id: "ann-club-priv-1",
    title: "🔒 Design Guild Core: Figma Token Refactor & Secret Theme Sprint",
    category: "club",
    categoryLabel: "Club Exclusive",
    isClubOnly: true,
    clubName: "Design Guild",
    accentColor: "#ec4899",
    icon: "lock",
    liveBadge: "Members Only",
    compensation: "🪙 600 KP Sprint Credit",
    organizer: {
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
    hasRsvpd: false,
    isBookmarked: true,
    location: "Design Studio 4B (Keycard Access)"
  },
  {
    id: "ann-club-priv-2",
    title: "🔒 Robotics Society: Autonomous Rover Telemetry & Lab Access Passcodes",
    category: "club",
    categoryLabel: "Club Exclusive",
    isClubOnly: true,
    clubName: "Robotics Society",
    accentColor: "#3b82f6",
    icon: "lock",
    liveBadge: "Members Only",
    compensation: "Hardware Lab RFID Privileges",
    organizer: {
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
    hasRsvpd: false,
    isBookmarked: false,
    location: "Advanced Robotics Facility, Room 102"
  },
  {
    id: "ann-club-pub-1",
    title: "🌐 Robotics Society: All-Campus Drone Racing & RoboWars Open Showcase",
    category: "club",
    categoryLabel: "Club Public",
    isClubOnly: false,
    clubName: "Robotics Society",
    accentColor: "#10b981",
    icon: "users",
    liveBadge: "Open To All",
    compensation: "🪙 350 KP Audience Bounties",
    organizer: {
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
    hasRsvpd: true,
    isBookmarked: true,
    location: "Central Campus Quadrangle"
  },
  {
    id: "ann-club-priv-3",
    title: "🔒 AI & Code Collective: GPU Cluster Allocation & Dev Environment Setup",
    category: "club",
    categoryLabel: "Club Exclusive",
    isClubOnly: true,
    clubName: "AI & Code Collective",
    accentColor: "#8b5cf6",
    icon: "lock",
    liveBadge: "Members Only",
    compensation: "100 GPU Compute Hours",
    organizer: {
      name: "AI & Code Collective Core",
      role: "Infrastructure Lead",
      avatarLetter: "AC",
      accent: "#8b5cf6"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    targetAudience: "Registered AI & Code Collective Members",
    summary: "Private infrastructure dispatch: SSH keys, Slurm queue priority, and HuggingFace enterprise endpoints assigned to members.",
    content: `FOR AI & CODE COLLECTIVE MEMBERS:
We have provisioned NVIDIA A100 GPU node partitions for our campus autonomous agent research teams. Check your student inbox for the RSA private key.`,
    tags: ["AI & Code Collective", "Private", "GPU", "Infrastructure"],
    rsvps: 26,
    hasRsvpd: false,
    isBookmarked: false,
    location: "High Performance Computing Lab"
  },
  {
    id: "ann-2",
    title: "Hands-On Generative AI & Autonomous Agent Architecture",
    category: "workshop",
    categoryLabel: "Timed Workshop",
    isTimed: true,
    liveBadge: "Starts in 18h",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 18 + 1000 * 60 * 30).toISOString(),
    isUrgent: false,
    accentColor: "#06b6d4",
    icon: "zap",
    organizer: {
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
    hasRsvpd: false,
    isBookmarked: true,
    location: "Turing Innovation Lab, Block 4"
  },
  {
    id: "ann-vac-2",
    title: "UI/UX Designer & Web Lead for E-Cell Incubator Dashboard",
    category: "vacancies",
    categoryLabel: "Club Vacancy",
    isVacancy: true,
    liveBadge: "🪙 1,200 KP Bounty",
    openPositions: 3,
    claimedPositions: 1,
    compensation: "🪙 1,200 Karma Points / ₹4,000 stipend",
    accentColor: "#8b5cf6",
    icon: "sparkles",
    organizer: {
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
    hasRsvpd: false,
    isBookmarked: false,
    location: "Incubator Hub, 5th Floor"
  },
  {
    id: "ann-4",
    title: "Team Cerberus Robotics: Autonomous Quadruped Auditions",
    category: "club",
    categoryLabel: "Club Exclusive",
    isSelective: true,
    liveBadge: "Deadline: Friday",
    accentColor: "#3b82f6",
    icon: "cpu",
    organizer: {
      name: "Aarav Sharma",
      role: "Team Cerberus Robotics Lead",
      avatarLetter: "AS",
      accent: "#3b82f6"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    targetAudience: "Mechanical, Mechatronics & CS (2nd & 3rd Year)",
    totalSeats: 20,
    claimedSeats: 14,
    summary: "Recruiting passionate builders for the International Rover Challenge & Autonomous Quadruped project. Openings in CAD, embedded firmware, and ROS.",
    content: `Team Cerberus is opening competitive auditions for our 2026 international competition cycle. We are actively hiring for specialized divisions:

Divisions:
1. Mechanical & Chassis: SolidWorks/Fusion 360, FEA stress simulation.
2. Electronics & Power: KiCAD PCB design, CAN bus protocol.
3. Autonomous Navigation: ROS 2, SLAM, LiDAR point cloud processing.`,
    tags: ["Club", "Recruitment", "Robotics", "Hardware", "Competition"],
    rsvps: 84,
    hasRsvpd: false,
    isBookmarked: false,
    location: "Bionics Center, Lab 02"
  },
  {
    id: "ann-5",
    title: "Colloquium: Superconducting Qubits & Quantum Telemetry",
    category: "seminar",
    categoryLabel: "Academic Seminar",
    isTimed: true,
    liveBadge: "Friday • Auditorium Hall B",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 78).toISOString(),
    accentColor: "#10b981",
    icon: "graduation-cap",
    organizer: {
      name: "Dr. Aris Thorne",
      role: "CERN Visiting Fellow & Physics Chair",
      avatarLetter: "AT",
      accent: "#10b981"
    },
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    targetAudience: "Undergraduates & Research Scholars",
    totalSeats: 300,
    claimedSeats: 245,
    summary: "Distinguished lecture exploring fault-tolerant quantum algorithms, cryogenic interconnects, and astrophysical telemetry decoding.",
    content: `Colloquium exploring the intersection of quantum information theory and deep space telemetry with Dr. Aris Thorne. Attendees receive an official seminar attendance docket for academic credits.`,
    tags: ["Seminar", "Quantum", "Research", "Physics"],
    rsvps: 245,
    hasRsvpd: true,
    isBookmarked: true,
    location: "Grand Auditorium, Hall B"
  },
  {
    id: "ann-6",
    title: "Ignite 2026: Official Inter-University Fest Registration Open",
    category: "fest",
    categoryLabel: "Campus Fest",
    isFest: true,
    liveBadge: "Flagship Event",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    targetAudience: "All Colleges & Students",
    totalSeats: 2500,
    claimedSeats: 1840,
    summary: "Registration portal is now live for 45+ cultural and competitive tracks including Battle of the Bands, Fashion Show, and Hackathon.",
    content: `Ignite 2026 registration is officially live! Over 40 universities competing across 3 days. Early bird passes include concert stage access and student activity kit.`,
    tags: ["Fest", "Cultural", "Music", "Competitions"],
    rsvps: 1840,
    hasRsvpd: false,
    isBookmarked: false,
    location: "Campus Sports Arena & Central Grounds"
  },
  {
    id: "ann-7",
    title: "Office of the Dean: Spring Semester Assessment & Lab Guidelines",
    category: "broadcast",
    categoryLabel: "Official Broadcast",
    isBroadcast: true,
    isUrgent: true,
    liveBadge: "Mandatory Notice",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    targetAudience: "All University Students & Faculty",
    summary: "Important administrative notice regarding mid-semester evaluation timetables, biometric attendance verification, and lab docket submissions.",
    content: `All enrolled undergraduate and postgraduate students are requested to review the revised spring examination calendar released by the Academic Senate. Ensure 75% biometric attendance is logged before the deadline.`,
    tags: ["Broadcast", "Senate", "Exams", "Mandatory"],
    rsvps: 420,
    hasRsvpd: true,
    isBookmarked: true,
    location: "Administrative Block, Circular No. 24"
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Feeds", icon: "sparkles" },
  { id: "vacancies", label: "Manpower & Gigs", icon: "briefcase" },
  { id: "club", label: "Clubs (Selective)", icon: "users" },
  { id: "workshop", label: "Workshops (Timed)", icon: "zap" },
  { id: "seminar", label: "Seminars", icon: "graduation-cap" },
  { id: "fest", label: "Fest & Events", icon: "flame" },
  { id: "broadcast", label: "Broadcasts", icon: "bell" }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv-kavya",
    partnerId: "kavya-patel",
    partnerName: "Kavya Patel",
    partnerTitle: "Cultural Council Head • Ignite 2026",
    avatarLetter: "KP",
    accent: "#ec4899",
    isOnline: true,
    lastSeen: "Online",
    unreadCount: 1,
    topicContext: "Ignite 2026 Stage Logistics Vacancy",
    messages: [
      {
        id: "m-1",
        sender: "them",
        text: "Hey! Saw your profile from the sound engineering lab. Are you available for the Ignite 2026 artist sound check on Friday?",
        timestamp: "10:14 AM"
      },
      {
        id: "m-2",
        sender: "me",
        text: "Hi Kavya! Yes, I've managed Yamaha digital mixers and XLR patch bays before. I'm completely free after 2 PM.",
        timestamp: "10:18 AM"
      },
      {
        id: "m-3",
        sender: "them",
        text: "Awesome! I've reserved one of the sound crew slots for you. You'll get 800 Karma Points credited plus VIP passes!",
        timestamp: "10:22 AM"
      }
    ]
  },
  {
    id: "conv-aarav",
    partnerId: "aarav-sharma",
    partnerName: "Aarav Sharma",
    partnerTitle: "Team Cerberus Robotics Lead",
    avatarLetter: "AS",
    accent: "#3b82f6",
    isOnline: true,
    lastSeen: "Active 5m ago",
    unreadCount: 0,
    topicContext: "Team Cerberus Subsystem Auditions",
    messages: [
      {
        id: "m-4",
        sender: "them",
        text: "Hi there! Thanks for applying to the autonomous navigation division.",
        timestamp: "Yesterday"
      },
      {
        id: "m-5",
        sender: "me",
        text: "Hey Aarav, is the take-home challenge focused on ROS 2 Humble or Foxy?",
        timestamp: "Yesterday"
      },
      {
        id: "m-6",
        sender: "them",
        text: "We use ROS 2 Humble on Ubuntu 22.04 LTS. Check Lab 02 tomorrow for hardware setup.",
        timestamp: "Yesterday"
      }
    ]
  },
  {
    id: "conv-rohan",
    partnerId: "rohan-verma",
    partnerName: "Rohan Verma",
    partnerTitle: "E-Cell Tech Lead",
    avatarLetter: "RV",
    accent: "#8b5cf6",
    isOnline: true,
    lastSeen: "Online",
    unreadCount: 2,
    topicContext: "E-Cell Accelerator Frontend Vacancy",
    messages: [
      {
        id: "m-8",
        sender: "them",
        text: "Hey! We need someone who can whip up an interactive founder dashboard in React by next Tuesday.",
        timestamp: "11:30 AM"
      },
      {
        id: "m-9",
        sender: "them",
        text: "It pays 1,200 Karma Points or ₹4,000 cash. Interested?",
        timestamp: "11:31 AM"
      }
    ]
  }
];

export const INITIAL_REELS = [
  {
    id: "reel-1",
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
    isLiked: false
  },
  {
    id: "reel-2",
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
    isLiked: true
  },
  {
    id: "reel-3",
    title: "Graphic Designer: Vector Streetwear Merch & Posters",
    clientName: "Design Society",
    clientRole: "Official Student Society",
    avatarLetter: "DS",
    accent: "#f59e0b",
    problemStatement: "Designing custom oversized hoodies and holographic entry wristbands for our national techno-cultural fest. Vector illustrations and print-ready CMYK files required.",
    skillsRequired: ["Adobe Illustrator", "Photoshop", "Typography", "Merch Prep"],
    bountyKarma: 1200,
    bountyCash: "₹2,800",
    deadline: "Friday Evening",
    urgency: "3 Spots Open",
    slotsAvailable: 3,
    likesCount: 226,
    isLiked: false
  },
  {
    id: "reel-4",
    title: "Audio Engineer: Mix & Master E-Cell Podcast Series",
    clientName: "E-Cell Media Desk",
    clientRole: "Incubator Cell Media",
    avatarLetter: "EM",
    problemStatement: "Recorded 4 long-form interview episodes with seed-funded alumni founders. Need multi-track noise reduction, leveling, intro/outro stem mixing, and Spotify-compliant mastering.",
    skillsRequired: ["Logic Pro", "FL Studio", "Audacity", "iZotope RX"],
    bountyKarma: 1100,
    bountyCash: "₹2,500",
    deadline: "3 Days",
    urgency: "First Come First Serve",
    slotsAvailable: 1,
    likesCount: 184,
    isLiked: false
  },
  {
    id: "reel-5",
    title: "3D Motion Artist: Stage Drone Hologram Pre-Viz",
    clientName: "Robotics Club",
    clientRole: "Technical Society Lead",
    avatarLetter: "RC",
    problemStatement: "We are coordinating a 50-drone light formation show for inauguration night. Need a 3D animator to build a clean 30-second Blender/Cinema4D flight path visualization.",
    skillsRequired: ["Blender", "Cinema 4D", "3D Animation", "Motion Design"],
    bountyKarma: 2800,
    bountyCash: "₹7,000",
    deadline: "Weekend Sprint",
    urgency: "Priority Gig",
    slotsAvailable: 1,
    likesCount: 405,
    isLiked: false
  }
];

export const AVAILABLE_CLUBS = [
  { id: "club-design", name: "Design Guild", icon: "🎨", description: "UI/UX, 3D, and Branding", memberCount: 142 },
  { id: "club-robotics", name: "Robotics Society", icon: "🤖", description: "Hardware, Drones, and IoT Systems", memberCount: 98 },
  { id: "club-cultural", name: "Cultural Council", icon: "🏛️", description: "Fests, Stagecraft, and Logistics", memberCount: 215 },
  { id: "club-ai", name: "AI & Code Collective", icon: "⚡", description: "Full-Stack, Agents, and Cloud Systems", memberCount: 180 },
  { id: "club-ecell", name: "E-Cell Incubator", icon: "🚀", description: "Startups, Founders, and Pitch Sprints", memberCount: 125 }
];

export const INITIAL_USER_PROFILE = {
  name: "Aditya Verma",
  handle: "@aditya_v",
  studentId: "2023-CS-042",
  department: "Computer Science & Design",
  avatarLetter: "AV",
  karmaPoints: 1250,
  followers: 521,
  following: 345,
  creations: 18,
  bio: "Full-stack developer and student UI designer building open infrastructure for campus activities.",
  tags: ["@developer", "@designer", "@react", "@uiux", "@systems"],
  clubs: ["Design Guild", "AI & Code Collective", "Cultural Council"],
  testimonial: {
    author: "Elena Juni",
    handle: "@elena.juni",
    text: "Thanks for the clean UI components for our campus hackathon portal! Delivered 2 days ahead of schedule."
  }
};
