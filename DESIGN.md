---
name: Campus Karma
description: Unified college campus infrastructure combining notices, club vacancies, messaging, and student media reels.
colors:
  bg-base: "#000000"
  bg-surface: "#0a0a0d"
  bg-surface-elevated: "#121216"
  bg-surface-hover: "#18181e"
  bg-surface-active: "#202028"
  text-primary: "#ffffff"
  text-secondary: "#a1a1aa"
  text-muted: "#9ca3af"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-medium: "rgba(255, 255, 255, 0.15)"
  border-highlight: "rgba(255, 255, 255, 0.28)"
  primary: "#f59e0b"
  accent-base: "#ffffff"
  accent-surface: "rgba(255, 255, 255, 0.08)"
  accent-border: "rgba(255, 255, 255, 0.16)"
typography:
  display:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-base}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "{colors.accent-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Campus Karma

## Overview
Campus Karma balances high-density student utility with crisp, modern dark aesthetics ("Smart Black") and an energetic Electric Amber (`#f59e0b`) accent role. The interface is optimized for rapid scanning of urgent notices, active club vacancies, peer chats, and video reels ("Feels").

## Colors
The color architecture relies on high-contrast foundation surfaces and luminous hairline borders:
- **Base Surfaces:** `--bg-base` (`#000000`), `--bg-surface` (`#0a0a0d`), `--bg-surface-elevated` (`#121216`).
- **Hairline Borders:** `--border-subtle` (`rgba(255,255,255,0.08)`), `--border-medium` (`rgba(255,255,255,0.15)`), `--border-highlight` (`rgba(255,255,255,0.28)`).
- **Text:** `--text-primary` (`#ffffff`), `--text-secondary` (`#a1a1aa`), `--text-muted` (`#9ca3af`).
- **Primary / Brand Accent:** Electric Amber (`#f59e0b`), accompanied by contextual status indicators:
  - Emergency/Urgent: Crimson (`#ef4444`)
  - Verification/Success: Emerald (`#10b981`)
  - Tech/Logistics: Sky (`#0ea5e9`)
  - Creative/Cultural: Violet (`#8b5cf6`)

## Typography
Dual-font pairing providing distinct brand personality and effortless readability:
- **Headings & Display:** `Outfit` (weights 600, 700) with tight tracking (`-0.02em`) on display titles.
- **Body & Controls:** `Plus Jakarta Sans` (weights 400, 500, 600) with generous line heights (`1.5`–`1.6`) for rapid scanning.
- **Minimum font scale:** All micro-labels, badges, and captions maintain minimum font sizes >= `0.72rem` (11.5px) for strict accessibility compliance.

## Layout
- **App Shell:** Fixed top navbar with brand identity, live search, Karma wallet pill, and profile trigger.
- **Tabbed Views:** Sticky sub-navigation bar driving instant switches across Announcements, Vacancies, Direct Messaging, Feels (video reels), and Karma Economy.
- **Responsive Geometry:** Adaptive multi-column grid scaling down to single-column card feeds on mobile devices (`<= 768px`) with touch targets enlarged to 44×44px minimum bounding areas.

## Elevation & Depth
- **Depth Paradigm:** Tonal layering through subtle surface variations (`#000000` -> `#0a0a0d` -> `#121216`) paired with razor-thin hairline borders rather than muddy zero-offset drop shadows.
- **Cards & Overlays:** Inset highlight borders (`inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`) and clean, directional elevation shadows (`0 4px 20px rgba(0, 0, 0, 0.85)`).

## Shapes
- **Corner Radii:** Consistent tiered hierarchy:
  - `sm` (6px): Badges, tooltips, sub-controls.
  - `md` (10px): Buttons, form inputs, list items.
  - `lg` (16px): Content cards, modal dialogs, drawers.
  - `full` (9999px): Avatar frames, pill tags, indicator chips.

## Components
- **Notice & Vacancy Cards:** Distinct priority badges, countdown/deadline chips, slot availability bars, and one-click RSVP/Apply action buttons.
- **Buttons:** High-contrast primary action buttons with subtle scale transitions on hover and active click states.
- **Modals & Drawers:** High z-index centered dialogs and right-sliding profile drawers with backdrop blur (`backdrop-filter: blur(12px)`) and explicit focus rings (`:focus-visible`).

## Do's and Don'ts
### Do:
- Always use semantic tokens (`--bg-surface`, `--text-primary`, `--border-subtle`).
- Keep text contrast above WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Use GPU-composited animations (`transform`, `opacity`) with exponential deceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Provide explicit `:focus-visible` outlines on all interactive elements.

### Don't:
- Don't use unilateral single-side borders as active state indicators.
- Don't animate non-composited layout properties (`width`, `height`, `margin`, `padding`).
- Don't use artificial ungrounded pulsing dots or infinite distracting visual noise.
- Don't reduce font sizes below `0.72rem`.
