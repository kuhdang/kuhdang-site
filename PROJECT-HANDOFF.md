# Personal Website — Project Handoff

Paste this into a new Claude chat to pick up where we left off. Attach the latest
`site-prototype.html` file too, so Claude has the actual code.

---

## What this project is
A personal website for Kevin Dang — a mobile-first, design-led single-page site
that tells his life story, hobbies, goals, and what he's building. Built as a
self-contained HTML/CSS/JS prototype (single file, no framework). Not yet hosted.

## Design language (keep consistent)
- **Aesthetic:** minimal, clean, design-first.
- **Colours:** beige background (`--paper: #F6F4EF`), near-black text
  (`--ink: #1D1C19`), muted sage accent (`--accent: #4C5D56`). A dark-mode
  palette is defined via `prefers-color-scheme` so text stays readable if the
  visitor's device is in dark mode.
- **Fonts:** `Newsreader` (serif, used italic for headings) + `IBM Plex Mono`
  (small mono labels/back buttons).
- **No "Vol. 01 / Era 01" style labels**, no numbered tags on cards — these were
  all removed.

## Page structure / flow
1. **Hero (landing):** big italic "Curious about me?" in the centre. A small
   "Click me" label bounces around DVD-logo style (speed value = 5). Tapping the
   hero (or scrolling) smooth-scrolls down to the category grid. Hamburger menu
   is hidden here and fades in as you scroll toward the grid.
2. **Category grid ("home" view):** 2-column grid of SQUARE cards. Topics:
   `26 Years on Earth`, `Hobbies`, `Goals`, `Relationships`, `What I'm Building`.
   (Achievements was removed.) 5 cards = 2 rows + 1 odd card; the odd card sits
   on the LEFT with empty space to its right. NO back button on this page.
3. **Sub-grids:** same square-card style. Back button top-left in `← LABEL`
   format (`← HOME`).
   - `26 Years on Earth` → `The Early Years`, `Right Now`
   - `Hobbies` → `Driving & Riding`, `Gaming`, `Travelling`
   - `What I'm Building` → `This Site`, `Ecom`
   - `Goals` and `Relationships` have no sub-topics yet (go straight to a
     placeholder detail page with a `← HOME` back button).
4. **Detail pages:** headline + placeholder body copy. Back button shows the
   parent (e.g. `← Hobbies`) or `← HOME` if the topic has no sub-grid. The
   duplicate parent-title text above the heading was removed.
5. **Contact page ("Reach out to me" in the menu):**
   - Heading is just "Get in touch" (the redundant "Reach out to me" heading was
     removed).
   - Social row: LinkedIn (https://www.linkedin.com/in/imkevindang/),
     Instagram (https://www.instagram.com/kdxng/), and a Gmail icon that copies
     `kevinxdang00@gmail.com` to clipboard and shows an "Email copied" toast.
   - Message form: Name field + message box + Send button. Empty-message error =
     "You forgot your message, silly you." Success = "Appreciate the message."

## Navigation
- **Hamburger menu** (top-left, black stripes): Home + the 5 topics +
  "Reach out to me". The word "Navigate" label was removed. Home jumps straight
  to the category grid.
- Hamburger is hidden on the hero, fades in on scroll, visible on all sub-pages.

## Contact form backend (IMPORTANT)
- Wired to a **Google Sheet via Google Apps Script**. The Send button POSTs
  `{name, message}` to this endpoint (uses `mode: 'no-cors'`):
  `https://script.google.com/macros/s/AKfycbwSx6VPO9aUZkiTk7qWOFWnKvFYAoLKQlGSOv1ZdCI8YlnDNtEdk-bh20ipGH-NWKN0bg/exec`
- The sheet has columns: Timestamp | Name | Message.
- **This only works on the hosted site**, NOT in the in-chat preview (sandbox
  blocks cross-origin requests). Test after deploying.
- Because of `no-cors`, the site can't read the response, so it optimistically
  shows success. Fine for a personal site.

## Card-tap zoom animation (the big custom piece)
When a card is tapped:
1. **Phase 1 — isolate:** everything except the tapped card fades out (~0.36s):
   other cards, page title/back button, hamburger.
2. **Phase 2 — zoom:** the isolated card zooms toward the centre of the
   **visual viewport** (mobile-accurate centring via `window.visualViewport`)
   and fades out over 0.5s.
3. **Crossfade:** at ~70% through the zoom (350ms), the destination page is
   mounted invisibly (`prefade` = opacity 0), then faded in over a "luxurious"
   0.3s (`crossfading`) so the still-zooming card dissolves through into the new
   page. A `settled` state then holds the page stable so the base `fadeIn`
   animation never re-runs (this was the cause of a double-flash bug we fixed).
- Uses a double `requestAnimationFrame` to guarantee the opacity-0 state paints
  before the fade triggers.
- Non-zoom navigation (hamburger, back buttons) uses a normal entrance animation,
  NOT the crossfade.

## Desktop 3D tilt hover
- Cards tilt in 3D toward the mouse cursor (mouse-tracking tilt, max 9°).
- Guarded TWICE (CSS `@media (hover: hover) and (pointer: fine)` + JS
  `matchMedia` check) so it NEVER fires on touch devices. Mobile is untouched.

## Known issues / deferred
- **Desktop jitter on page change:** was caused by the scrollbar appearing/
  disappearing between pages, shifting layout width. FIXED with
  `scrollbar-gutter: stable` on `html` (right-side gutter).
- **Real images:** Driving & Riding card has a real optimized photo (helmet +
  gloves + boba), embedded as base64 WebP (1200x1200, ~131KB). Other cards still
  use gradient placeholders. Image workflow: crop to square, resize to ~1200px,
  convert to WebP q80. NOTE: upload photos as JPEG/PNG, not HEIC (the sandbox
  can't decode HEIC).
- Real body copy for all detail pages still needs writing (currently placeholder).
- A custom creature/mask logo was drawn and cleaned up but is NOT currently in
  the site (was experimented with, then removed).

## Next steps when resuming
1. Add real images to remaining cards (optimize same way as Driving & Riding).
2. Write real copy for detail pages.
3. Decide sub-topics for Goals and Relationships.
4. When ready to go live: move to Claude Code, deploy to Netlify/Vercel/etc,
   connect Kevin's own domain, and TEST the Google Sheet contact form live.

## Session update (most recent chat, after this handoff was first written)
- **Hamburger menu bug fixed:** the three lines were set to `height: 1.5px`,
  which rendered inconsistently across lines (sub-pixel rounding made them
  look uneven). Changed to `height: 2px` with `border-radius: 1px`, and the
  open/X-state `translateY` offsets were adjusted from 11.5px to 12px to match.
  This is already applied in the `site-prototype.html` being handed off — no
  action needed, just noting why the values look slightly different from
  earlier versions.
- **Deployment decision:** Kevin's domain is currently blank/unused (no
  existing site, no email/MX records on it). Given that, deploy straight to
  the real domain — no need to test on a throwaway Netlify Drop URL first.
- **Immediate goal for this Claude Code session:** get the site properly
  deployed (Netlify or Vercel, whichever is simpler to wire up) and connected
  to Kevin's domain, then verify the Google Sheet contact form actually works
  on the live, hosted version (it can't be tested in a sandboxed preview).
- **Ongoing workflow going forward:** changes should be made to the local
  project files, previewed, then deployed — never edited directly on the live
  site. Claude Code should set this up so redeploys are simple (e.g. a single
  deploy command or git push) and ideally support rollback if an update
  breaks something.
