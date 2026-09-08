# Storefront design refinement

## Storefront theme

Added a scoped light/dark/system selector with a one-year preference cookie. The server reads the preference before rendering; CSS color-scheme handles system mode without a hydration-time theme swap. The store theme does not modify the document-wide admin theme. Brand dialog portals receive the same preference. No backend or CMS changes.

Browser checks covered light/dark/system selection, dark persistence after reload, dark brand dialogs and the 320px header. System mode computed color-scheme was verified; OS preference switching could not be emulated with the available browser tool. Build, TypeScript compilation, targeted lint and the existing 15 tests passed.

Previous functional improvements were committed and pushed to `origin/main` as `da5c0e0`. This subsequent design pass was prepared for commit and push at the user's request. No deployment command was run.

The final theme control uses an icon button and accessible radio menu. It sits to the left of navigation, with the mobile menu button at the far right. Theme switching and Escape dismissal were checked in the browser.

## Direction

A restrained optical storefront: warm off-white surfaces, forest-green actions, generous typography, an editorial hero, category illustrations and quieter navigation. CMS content, image URLs, section ordering and real API integration remain intact. Illustrations are abstract category artwork, not photographs or representations of available stock.

The hero image currently supplied by the CMS is unrelated to eyewear. A suitable approved optical or store photograph remains necessary for the intended visual quality. No production content was modified.

## Changes

- Independent storefront styling in `src/app/(public)/public.css` preserves management portal styling.
- Responsive hero, large collection cards, streamlined service list, brand cards, inset store call to action, readable hours and contact layout.
- Mobile navigation remains available through tablet widths, avoiding crowded navigation links.
- Existing keyboard focus, Escape dismissal, focus restoration and safe links retained.
- Renamed the former GSAP section module and exports to reflect server-rendered storefront components; no animation dependency is required by these sections.

## Verification

- Production build and TypeScript compilation passed.
- Typecheck passed; targeted ESLint passed; 15 existing frontend tests passed.
- Browser inspected at 390px, 768px and 1440px with no horizontal overflow; collection navigation, mobile menu, brand dialog and Escape focus restoration checked.
- No error or warning entries returned from the inspected browser tab console.
- The pre-existing repository-wide lint failures documented in REVIEW.md remain outside this design pass.

Screenshots: `design-home-desktop.png`, `design-home-mobile.png`, `design-collections-desktop.png`, `design-brands-desktop.png`.

## Motion refinement

- Added one-shot, staggered entrance animations using native Web Animations and IntersectionObserver. Content is visible in server HTML and remains readable without JavaScript. Observers and animations are cleaned up on unmount.
- Collection illustrations gently enlarge on hover-capable devices; action arrows have a small hover response.
- Added a continuous CMS-driven brand-name strip while keeping interactive detail cards stationary. Duplicated strip text is hidden from assistive technology.
- The strip pauses on hover, focus within the brand section, an open brand dialog, or the explicit pause button. Reduced-motion preference removes the decorative strip and suppresses entrance/hover motion, including preference changes during a running entrance.
- Browser verification: 1440px and 390px layouts, running strip, manual pause and keyboard-focus pause confirmed; no horizontal overflow or console errors observed. Reduced-motion emulation was unavailable in the browser tool, so this preference was reviewed in code only.
- Existing 15 tests, production build, typecheck and targeted lint passed. CMS/API and backend code were not changed.
