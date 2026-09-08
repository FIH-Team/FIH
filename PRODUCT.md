# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Primary: University students seeking campus opportunities, club activities, peer collaboration, and project recognition.
- Secondary: Student club leads, event organizers, and cultural/technical council coordinators needing to mobilize crew, announce vacancies, and coordinate logistics.

## Product Purpose
Campus Karma serves as a unified college campus infrastructure. It bridges the gap between official student organization opportunities and peer-to-peer engagement by combining campus notices, club recruitment, direct messaging, and creative skill showcases into an integrated student ecosystem.

## Positioning
A cohesive student ecosystem that pairs rapid vacancy fulfillment with an active Karma Points incentive economy and short-form portfolio/skill video reels ("Feels"), eliminating fragmented communication across disjointed chat apps and bulletin boards.

## Operating Context
- College campuses with active student societies, cultural fests, hackathons, and technical clubs.
- High-frequency updates during campus festivals, recruitment drives, and project sprints.
- Primary interaction surfaces: desktop & mobile browsers, fast navigation between announcements, real-time messaging, and media feeds.

## Capabilities and Constraints
- Announcements & Vacancies: Rich notice feed with category filtering, urgency flags, RSVP tracking, vacancy slot claims, and applicant tracking.
- Direct & Club Messaging: Real-time style peer chat and club communication with unread indicators and quick replies.
- Marketing (Feels): Short-form student marketing and portfolio video reels with engagement metrics and creator profiles.
- Karma Points Economy: Micro-incentive wallet tracking student contributions, event volunteering credits, and peer recognition.
- Multi-Experience Theme Engine: Dynamic theme switching (Slate Modern, Instagram Feed, Sapphire LMS, Crimson Glass, Intelly Studio) across light/dark modes.
- Technical Constraints: Client-side single-page application built with Vite, Vanilla JavaScript, and Vanilla CSS; persistent state stored in `localStorage`.

## Brand Commitments
- Name: Campus Karma
- Identity: Star prism emblem, vibrant accent lighting, crisp typography (`Outfit` and `Plus Jakarta Sans`).
- Tone: Dynamic, energetic, authentic student voice without corporate bloat or synthetic filler.

## Evidence on Hand
- Functional single-page web app in [index.html](file:///c:/Users/USER-2/Desktop/FIH%20internal%20local/index.html) and [src/main.js](file:///c:/Users/USER-2/Desktop/FIH%20internal%20local/src/main.js).
- Realistic campus dataset in [src/mockData.js](file:///c:/Users/USER-2/Desktop/FIH%20internal%20local/src/mockData.js) detailing club vacancies (Ignite 2026 stage crew, Design Guild Figma token sprints, Robotics Society telemetry, etc.).
- Complete UI styles and multi-theme switchers in [src/style.css](file:///c:/Users/USER-2/Desktop/FIH%20internal%20local/src/style.css).

## Product Principles
1. High Utility First: Real actions (applying to vacancies, claiming slots, earning points) take precedence over passive consumption.
2. Authentic Student Voice: Clear, punchy information hierarchy tailored to busy campus lifestyles.
3. Fluid Multi-Surface Experience: Frictionless transitions between announcements, messaging, and showcase media.
4. Seamless Identity & Recognition: Immediate visual feedback for contributions, status badges, and Karma achievements.

## Accessibility & Inclusion
- High-contrast visual modes and semantic headings.
- Keyboard-accessible tab navigation and clear button labeling.
- Reduced motion consideration for ambient glow meshes and animations.
