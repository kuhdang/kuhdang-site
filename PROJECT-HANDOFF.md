# Personal Website — Project Handoff

Paste this into a new Claude chat to pick up where we left off. The project
lives at `C:\Users\kevin\Documents\kuhdang-site` (a git repo) — Claude should
open that folder rather than needing an attached file.

---

## What this project is

A personal website for Kevin Dang — a mobile-first, design-led single-page
site that tells his life story, hobbies, goals, and what he's building. Built
as a self-contained HTML/CSS/JS file (`index.html`, no framework, no build
step).

**Live at https://kuhdang.com**, hosted on GitHub Pages, deployed from
`github.com/kuhdang/kuhdang-site` (public repo). See `README.md` in this
folder for exactly how hosting/deploy/rollback work — this file is about the
design and the code, not the infra.

## Design language (keep consistent)

- **Aesthetic:** minimal, clean, design-first.
- **Colours:** beige background (`--paper: #F6F4EF`), near-black text
  (`--ink: #1D1C19`), muted sage accent (`--accent: #4C5D56`). A dark-mode
  palette is defined via `prefers-color-scheme` so text stays readable if the
  visitor's device is in dark mode.
- **Fonts:** `Newsreader` (serif, used italic for headings) + `IBM Plex Mono`
  (small mono labels/back buttons).
- **No "Vol. 01 / Era 01" style labels**, no numbered tags on cards.

## Page structure / flow

1. **Hero (landing):** big italic "Curious about me?" in the centre. A small
   "Click me" label bounces around DVD-logo style. Tapping the hero (or
   scrolling) scrolls down to the category grid — see "Hero shatter effect"
   below for what actually happens visually. Hamburger menu is hidden here
   and fades in as you scroll toward the grid.
2. **Category grid ("home" view):** 2-column grid of SQUARE cards. Topics:
   `26 Years on Earth`, `Hobbies`, `Goals`, `Relationships`, `What I'm
   Building`. 5 cards = 2 rows + 1 odd card on the LEFT. NO back button on
   this page.
3. **Sub-grids:** same square-card style. Back button top-left, `← LABEL`
   format (`← HOME`).
   - `26 Years on Earth` → `The Early Years`, `Right Now`
   - `Hobbies` → `Driving & Riding`, `Gaming`, `Travelling`
   - `What I'm Building` → `This Site`, `Ecom`
   - `Goals` and `Relationships` have no sub-topics yet — go straight to a
     placeholder detail page with a `← HOME` back button.
4. **Detail pages:** headline + placeholder body copy. Back button shows the
   parent (e.g. `← Hobbies`) or `← HOME` if the topic has no sub-grid.
5. **Contact page ("Reach out to me" in the menu):**
   - Heading: "Get in touch".
   - Social row: LinkedIn (linkedin.com/in/imkevindang/), Instagram
     (instagram.com/kdxng/), and a Gmail icon that copies
     `kevinxdang00@gmail.com` to clipboard with an "Email copied" toast.
   - Message form: Name field + message box + Send button. Empty-message
     error = "You forgot your message, silly you." Success = "Appreciate the
     message."

## Navigation

- **Hamburger menu** (top-left): Home + the 5 topics + "Reach out to me".
  Home jumps straight to the category grid.
- Hamburger is hidden on the hero, fades in on scroll, visible on all
  sub-pages.

## Contact form backend

- Wired to a **Google Sheet via Google Apps Script**. POSTs `{name, message}`
  (mode: `'no-cors'`) to:
  `https://script.google.com/macros/s/AKfycbwSx6VPO9aUZkiTk7qWOFWnKvFYAoLKQlGSOv1ZdCI8YlnDNtEdk-bh20ipGH-NWKN0bg/exec`
- Sheet columns: Timestamp | Name | Message.
- **Confirmed working live** on the hosted domain (verified after both the
  original Netlify deploy and the later GitHub Pages migration). It only
  ever works on the real hosted domain — a sandboxed preview can't test it
  (CORS-blocked).
- Because of `no-cors`, the site can't read the response, so it
  optimistically shows success.

## Page-transition architecture (rewritten this session — read before touching)

This changed substantially from earlier versions. Current model:

- `#view-home` is the only view that uses the browser's own document scroll
  (`window.scrollY`) — needed because the hero-to-grid shatter effect (below)
  is driven continuously by scroll position.
- `#view-subgrid`, `#view-detail`, `#view-contact` all carry a `panel-view`
  class. Whenever one is `.active`, CSS (`.panel-view.active`) makes it
  `position: fixed; inset: 0; overflow-y: auto` — i.e. it's **always** an
  independently-scrolling panel pinned to the screen, completely decoupled
  from `#view-home`'s scroll position. This is deliberate: earlier attempts
  to reset `window.scrollY` at the right moment (timing locks, cancelling
  in-flight scroll animations, disabling CSS scroll-anchoring) all failed to
  reliably stop a destination page from landing scrolled-down when the
  source page had been scrolled down. Making destination pages structurally
  incapable of depending on document scroll fixed it outright — they can
  only ever render starting at their own top.
- **Card-tap crossfade** (`zoomIntoCard` in the JS): tap isolates the card
  (~360ms, everything else fades out) → card zooms toward the visual-viewport
  center while fading (~500ms total) → ~200ms into that zoom, the destination
  view mounts as its permanent fixed panel, invisible (`prefade`), then fades
  in (`crossfading`, ~300ms) *while the outgoing view is still visible
  underneath* — a true overlapping dissolve, not a fade-out-then-fade-in.
  At ~700ms the outgoing view is finally hidden and the incoming view
  settles (`settled` class — freezes opacity:1/animation:none so the base
  `.view` fadeIn animation never re-triggers and causes a flash).
- Non-crossfade navigation (hamburger menu, back-crumb links) just shows the
  target view directly with a normal fade/scale entrance (`entering` class).
- `showView(id, crossfade)` always resets `target.scrollTop = 0` on the
  target view and cancels any in-flight custom scroll animation
  (`cancelSmoothScroll()`) — see below.

## Hero shatter effect

Tapping/scrolling past the hero doesn't just scroll it away — the heading
"Curious about me?" visually shatters into a 3×3 grid of clipped shard
fragments that fly outward 360° (like debris from a center impact / a
droplet dispersing) and fade, while the hamburger and hero corner labels fade
alongside it.

- **It's not a timed animation** — it's driven directly by scroll position
  (`updateShatter(progress)`, called from the same scroll listener that
  fades in the hamburger). Progress 0 = fully assembled (shards sit stacked,
  pixel-identical to the real heading, so swapping to them is invisible),
  progress 1 = fully dispersed, reached at ~40% of the hero's height scrolled.
  This means it **scrubs**: stop scrolling partway and it freezes at that
  partial state; scroll back up and it reverses exactly, only ever settling
  back to "assembled" once you're actually back at the top.
- The real `#question` heading is hidden (`visibility: hidden`) once the
  shard container is built (at page load) and stays that way — the shards
  are its permanent visual stand-in. No timer ever restores it; only
  scrolling back near the top does (via the scroll listener), so it can't
  pop back in mid-transition.
- Shard geometry comes from wrapping the real heading in `.question-wrap`
  (`position: relative`), with `.shatter-container` as `position: absolute;
  inset: 0` inside it — sizing is 100% CSS layout, no JS-measured pixel
  values to keep in sync as fonts load or the window resizes (an earlier
  JS-measurement approach caused a font-size/cutoff bug; this fixed it).
- Each shard clone keeps its own natural block layout (important: the
  heading has a `<br>` for its two-line break, and making the *clone itself*
  `display: flex` broke that — centering is done by the shard wrapper
  instead, not the clone).
- Hero height uses `100lvh` (not `100dvh`) so it's immune to iOS Safari's
  address-bar show/hide animation — this also happens to be what stopped
  scroll-jitter during the hero-to-grid auto-scroll, since the target
  position no longer shifts mid-scroll.
- The hero-to-grid scroll itself is a **custom-driven** smooth scroll
  (`smoothScrollTo`, quintic ease-in-out, 1s duration, obvious slow-start
  ramp) rather than native `scrollIntoView`/`behavior:'smooth'` — native
  smooth scroll on iOS Safari can overshoot and spring back at the end.
  `smoothScrollTo` has a cancellation token (`cancelSmoothScroll()`) so a
  still-running scroll (e.g. from tapping the hero) gets killed the instant
  any navigation happens afterward — an uncancelled scroll animation was the
  root cause of an earlier "lands at the bottom of the next page" bug.

## Desktop 3D tilt hover

- Cards tilt in 3D toward the mouse cursor (max 9°).
- Guarded TWICE (CSS `@media (hover: hover) and (pointer: fine)` + JS
  `matchMedia` check) so it never fires on touch devices.

## Known issues / deferred

- **Real images:** Driving & Riding card has a real optimized photo, embedded
  as base64 WebP (1200×1200, ~131KB). Other cards still use gradient
  placeholders. Workflow: crop to square, resize to ~1200px, WebP q80.
  Upload as JPEG/PNG, not HEIC.
- Real body copy for all detail pages still needs writing (currently
  placeholder).
- Sub-topics for `Goals` and `Relationships` still undecided.
- A custom creature/mask logo was drawn and cleaned up but is NOT currently
  in the site.

## Next steps when resuming

1. Add real images to remaining cards (optimize same way as Driving &
   Riding).
2. Write real copy for detail pages.
3. Decide sub-topics for Goals and Relationships.
4. Deployment/hosting is done — see `README.md` for the git-push-to-deploy
   workflow. Just make the change, preview locally, commit, push.

## Session history

**Session 1 (design/prototype phase):** Built the whole prototype in-chat —
page structure, card-tap zoom animation v1, hamburger menu, contact form
wiring, hamburger-line rendering fix (1.5px → 2px height for consistent
sub-pixel rendering). Not yet hosted.

**Session 2 (this one — deploy + hosting migration + heavy animation work):**
- Deployed the site for the first time: GitHub repo created
  (`kuhdang/kuhdang-site`), Netlify connected for git-push auto-deploy,
  `kuhdang.com` DNS pointed at Netlify, HTTPS confirmed, contact form tested
  live and confirmed working. Hit and fixed a Netlify "unrecognized git
  contributor" block (repo had to be made public — free-tier Netlify blocks
  auto-deploy on private repos from unrecognized pushers).
- Iterated on mobile UX bugs, in order: hero height using `100dvh` letting
  the grid peek through on iOS Safari (fixed with `100lvh`) → pages not
  landing at scroll-top after card-tap navigation → hero-to-grid auto-scroll
  jitter/overshoot on iOS (native smooth-scroll physics → custom
  `smoothScrollTo`) → a flash before the auto-scroll (a redundant
  `showView()` call replaying the entrance animation) → wanting a true
  overlapping crossfade instead of fade-out-then-fade-in (outgoing view was
  being hidden the instant the incoming view mounted; fixed by keeping the
  outgoing view visible until the incoming view finishes fading in) → a
  category-card position jump (scroll reset was yanking the still-visible
  outgoing view) → landing at the wrong scroll position again, eventually
  root-caused to an **uncancelled scroll animation** racing the reset →
  finally, a full architectural fix making destination pages permanently
  independent fixed/scrolling panels (`panel-view`), removing the whole
  class of scroll-position bugs by construction rather than by timing fixes.
- Built the hero "shatter" effect from scratch (see above), then iterated
  it from a one-shot 3×3-grid click animation into a scroll-scrubbed,
  reversible, 360°-radial-dispersal effect that permanently hides the real
  heading in favor of shard clones, fixing a font-size/cutoff bug along the
  way (flexbox breaking the heading's `<br>` line-break) by switching from
  JS-measured shard geometry to pure CSS layout sizing.
- **Migrated hosting from Netlify to GitHub Pages** (Kevin's choice, to
  avoid Netlify plan limits): same repo, added `CNAME` + `.nojekyll`, GitHub
  Pages enabled deploying from `master` root, DNS at Porkbun repointed to
  GitHub's Pages IPs, HTTPS/cert issuance confirmed, contact form re-tested
  and confirmed working, then the old Netlify project and all local Netlify
  tooling (`.netlify` folder, `netlify-cli`) were deleted — no Netlify
  infrastructure remains anywhere.
- Current live workflow: edit `index.html` locally → preview by opening the
  file in a browser → `git commit` + `git push` → GitHub Pages auto-deploys.
  Rollback is `git revert` + push (no one-click deploy-history UI like
  Netlify had). Full detail in `README.md`.
