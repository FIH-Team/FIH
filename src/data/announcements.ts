export interface AnnouncementItem {
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

export const ANNOUNCEMENTS_DATA: AnnouncementItem[] = [
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
    socialNote: 'Liked by 8 students in cohort',
    hashtags: ['#Vacancy', '#Design', '#UI/UX', '#Hackathon'],
    category: 'vacancy',
    verified: true,
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
    verified: true,
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
    verified: true,
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
      'Internal working sprint for Design Guild active contributors. Migrating our component library variables to native Figma variables 2.0.',
    fullBody: [
      'This sprint is strictly reserved for active Design Guild members who have completed their guild probationary period. We will be auditing our campus visual assets, building high-res vector kits, and establishing tokens for the upcoming university branding refresh.',
      'Pizza, drinks, and guild merchandise provided at the studio.',
    ],
    responsibilities: [
      'Audit 40+ legacy Figma templates for token compatibility',
      'Build auto-layout button and input kits in light/dark mode',
      'Publish token changes to guild GitHub repository',
    ],
    requirements: [
      'Active Design Guild membership ID',
      'Keycard access to Design Studio 4B',
    ],
    perk: 'Member Restricted · 8 Active Contributors',
    slotsText: 'Member Restricted · 8 Active',
    fillPercentage: 80,
    likes: 27,
    commentsCount: 8,
    socialNote: 'Active internal thread',
    hashtags: ['#Exclusive', '#FigmaTokens', '#DesignGuild', '#MembersOnly'],
    category: 'exclusive',
    urgent: true,
    verified: true,
  },
  {
    id: '5',
    avatarText: 'TB',
    avatarBg: 'bg-blue-600/90 text-white',
    author: 'TBI Incubation Cell',
    subCategory: 'Incubation Hub',
    tag: 'TBI Cell',
    tagColor: 'blue',
    location: 'Tech Park Block B',
    timeAgo: '2d ago',
    title: 'NEW HACKATHON 2k26: Ideation Phase Open & Seed Grants',
    description:
      'Technology Business Incubator announces ₹2.5L equity-free micro-grants for student-led hardware and software MVPs.',
    fullBody: [
      'The Innovation and Entrepreneurship Development Centre (IEDC) invites pitch decks for the annual New Hackathon 2k26 cohort. Selected teams receive university lab facilities, cloud compute credits ($5,000 via partner AWS), and 1-on-1 mentorship with venture-backed alumni founders.',
      'Top 3 teams pitch in the Grand Finale during the Annual Investors Summit.',
    ],
    responsibilities: [
      'Submit 2-page problem statement and prototype architectural blueprint',
      'Participate in mandatory weekly progress standups at the incubation hub',
      'Demonstrate working proof-of-concept before the mid-term jury',
    ],
    requirements: [
      'Team size: 2 to 4 enrolled students',
      'Original intellectual property developed during the semester',
    ],
    perk: '₹2.5L Seed Fund · 5 Teams Selected',
    slotsText: '5 Teams Selected',
    fillPercentage: 20,
    likes: 58,
    commentsCount: 16,
    socialNote: 'Liked by 58 student founders',
    hashtags: ['#Hackathon2k26', '#SeedGrants', '#Startups', '#Incubation'],
    category: 'vacancy',
    verified: true,
  },
  {
    id: '6',
    avatarText: 'CC',
    avatarBg: 'bg-amber-600/90 text-white',
    author: 'Arjun | Class Representative',
    subCategory: 'Academic Cohort Notice',
    tag: 'BTech Cyber 3A',
    tagColor: 'amber',
    location: 'Classroom CR14',
    timeAgo: 'Today',
    title: 'Class Room Relocation: All PBL Submissions Moved to CR14',
    description:
      'Official notification from academic coordinator: Afternoon Project-Based Learning evaluations will now be held in CR14 rather than Hall 3.',
    fullBody: [
      'Attention BTech Cyber 3A & 3B batches: Due to maintenance in Lecture Hall 3, today afternoon PBL evaluations with the faculty review board will convene in CR14 on the second floor.',
      'Ensure your project demo slides and GitHub repositories are cloned locally on thumb drives before 1:30 PM.',
    ],
    responsibilities: [
      'Assemble in CR14 by 1:15 PM sharp with printed evaluation rubric',
      'Verify GitHub repository accessibility with your project partner',
    ],
    requirements: [
      'Signed attendance verification slip from respective lab mentor',
      'Student ID badge required for CR14 smart-door swipe access',
    ],
    perk: 'Mandatory Notice · Academic Verification',
    slotsText: 'Mandatory for Cyber Cohort',
    fillPercentage: 100,
    likes: 31,
    commentsCount: 9,
    socialNote: 'Liked by 31 students in batch',
    hashtags: ['#BtechCyber', '#CR14', '#PBLSubmission', '#Academic'],
    category: 'academic',
    verified: true,
  },
];
