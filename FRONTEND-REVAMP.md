# BuildHire — Frontend Revamp Work Order

## Your role (Kiro IDE)
You do ALL the analysis and ALL the coding. This file is your instruction set and your
standard. Investigate the codebase yourself — do not wait to be hand-fed details. Follow
the rules below exactly. Work screen by screen, commit after each, and stop only if you
hit a real blocker you cannot solve on your own.

## The goal (one sentence)
Make every screen in the app look and feel like the landing page
(`client/src/pages/Home.js`): one design system, zero emojis, tasteful motion, and none
of the generic "AI slop" look — while changing nothing about how the app works.

Right now the app has three clashing looks:
- Landing (`Home.js`): cream / ink / yellow, fonts Syne + DM Sans. **This is the target.**
- Login, Register, Client, Worker: a generic blue/slate theme.
- Admin: a navy + gold theme.
Everything must become the landing look.

---

## STEP 1 — Analyze first (before writing any code)
Read all of `client/src`. Write your findings to `ANALYSIS.md` in the project root:
- Every route / page / component.
- For each page: its current colours, fonts, radii, button style, and whether it uses
  inline `style` objects or CSS.
- Every emoji in the UI, with file + line + what it represents.
- Every colour value that is NOT in the target palette in Step 2.
- Every piece of functional wiring to preserve (see "Do NOT touch").
Commit `ANALYSIS.md` before you change any code.

---

## STEP 2 — The design system (the fixed standard — apply everywhere)
These tokens come from the landing page and are the single source of truth. Build them
ONCE as `client/src/theme.js` (exported tokens) and reuse everywhere. No page may invent
its own palette.

**Colours**
- `cream` `#fafaf8` — default page background
- `ink` `#1a1a1a` — primary text, dark surfaces, primary buttons
- `inkSoft` `#242424` — cards on dark sections
- `inkDeep` `#111` — footer
- `yellow` `#f5f01a` — accent (button text on ink, highlights, CTA background)
- `line` `#e5e5e5` — borders (also `#eee`)
- `borderStrong` `#d4d4d4` — ghost button border
- `muted` `#777`, `mutedSoft` `#999`, `mutedText` `#666` — secondary text
- `success` `#22c55e` — live dot / success
- Status colours (for dashboard chips — use ONLY these, no new ones):
  - open → yellow family (ink text on light-yellow `#fdf6c7`)
  - accepted → ink chip (`#1a1a1a` bg, `#f5f01a` text)
  - in_progress → warm grey (`#ecebe6` bg, `#1a1a1a` text)
  - completed → green (`#e6f6ec` bg, `#137a3e` text)
  - cancelled → red (`#fbeae8` bg, `#b42318` text)

**Fonts** — exactly two, loaded from Google Fonts:
- `Syne` (700/800) — headings, numbers, logo, eyebrows
- `DM Sans` (300/400/500) — body and all UI text

**Spacing** — 8px scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
**Radius** — pill `100px` for buttons/chips; `20–24px` cards; `12–14px` inputs.
**Shadow** — one system only, e.g. hover `0 12px 32px rgba(0,0,0,0.08)`. No shadow spam.

**Components to build once in `client/src/components/` and use on every screen:**
`Icon`, `Button` (primary = ink bg + yellow text; ghost = border; dark = for the yellow
section), `Card`, `Field` (label + input/select/textarea), `StatusBadge`, `TopNav`,
`Avatar`. Buttons are pills and match the landing hover (translateY(-2px) + the one shadow).

---

## STEP 3 — Icons (replace every emoji)
Build one `Icon` component using inline SVG line icons (1.5–2px stroke, `currentColor`,
no fills). Map every emoji you found in Step 1 to a named icon and use it. Examples:
plumber→wrench, electrician→bolt, carpenter→saw, painter→brush, cleaner→spray,
more→plus, notification→bell, location→map-pin, client→user, rating→star, map→map,
secure→shield, device→smartphone, empty-list→clipboard, post→file-plus. Cover every
emoji you find, not just these. **No emoji may remain anywhere in the UI**, including the
landing marquee, step cards, service cards and feature cards.

---

## Anti-AI-slop rules (hard rules — the whole point of this task)
1. Only the tokens in Step 2. No one-off hex values. Remove every blue/slate/navy/gold
   leftover.
2. Exactly two fonts: Syne + DM Sans. Nothing else, no system-font fallback look.
3. No emojis. Icons only, via the `Icon` component.
4. No generic gradients (no purple/blue hero wash, no rainbow). The only glow allowed is
   the landing's subtle yellow radial.
5. Consistent spacing on the 8px scale. No random margins.
6. One shadow style. No drop-shadow everywhere.
7. Copy stays concrete and short. Do NOT add marketing fluff ("seamless", "revolutionize",
   "unlock", "elevate", "empower"). Keep the real copy that exists.
8. Real visual hierarchy. No centred walls of text.
9. One pill button system. No mixed button radii or colours.
10. Motion is purposeful and quick, and respects reduced-motion (see Motion section).
11. Contrast passes WCAG AA — check yellow-on-ink, ink-on-cream, and all muted greys.
12. No placeholder/lorem/dead UI.

Run this as a **self-check at the very end**: go screen by screen and confirm each rule.

---

## STEP 4 — Rebuild screen by screen (one at a time, commit each)
Order:
0. Foundation — `theme.js`, global CSS (fonts, reset, `prefers-reduced-motion`), and the
   shared components above.
1. `Home.js` — it is the reference; mainly swap emojis → icons, move its colours to the
   tokens, keep its layout and identity (dark services section, yellow CTA, marquee,
   grid hero).
2. `Login.js`
3. `Register.js`
4. `ClientDashboard.js`
5. `WorkerDashboard.js`
6. `AdminDashboard.js` (convert navy/gold → the cream/ink/yellow system)
7. Global polish — motion, responsive, accessibility, empty/loading states, spacing.

For EACH screen: re-read this file (so you don't drift), rebuild it with the shared
components and tokens, remove its emojis, keep ALL its functionality, confirm it builds
and renders, then `git add` the changed files and commit with a clear message
(e.g. `revamp: client dashboard to design system`).

---

## Motion
- Section/page reveal: fade + rise 12–16px, 300–400ms, ease-out, once.
- Hover: 150–200ms transform (translateY(-2px)) + the one shadow, like the landing.
- Lists (jobs, users): subtle staggered reveal, ~40–60ms apart.
- Toasts/alerts: slide + fade in; keep the existing auto-dismiss timing.
- Loading: a minimal spinner or skeletons in the palette — never an emoji or text like "...".
- Wrap it all in `@media (prefers-reduced-motion: reduce)` → disable transforms/animations.
- Nothing may block or delay interaction. No long intro animations.

---

## Do NOT touch (visual + UX only)
- The API base URL, every axios endpoint, all socket.io events and usage, `localStorage`
  keys (`token`, `user`), the routes in `App.js`, and role-based redirects.
- The `server/` folder and backend entirely.
- The review flow, the availability toggle, the map iframe + "Get Directions", the
  test-account quick-login buttons, and the admin block/approve/reject logic.
- If a visual change would need a logic change, keep the logic and adapt the visual.
- Do NOT add heavy UI libraries (no Bootstrap/MUI/Tailwind runtime). Plain React + CSS /
  inline styles + small inline SVGs. Prefer CSS animations over adding a motion library.
  If you believe a dependency is truly needed, explain why in the final report instead of
  adding it silently.

---

## Checks
Per screen: `npm run build` passes, no new console errors, the screen renders in `npm start`.
Note: you may not be able to log in locally — the live backend only allows the deployed
site's origin, so API calls from `localhost` can be blocked by CORS. Style the dashboards
from their component structure and their empty/loading states. Do NOT change API or auth
wiring to work around this.

Final:
- Search the codebase for emojis → none remain.
- Search for off-palette hex values → none remain (or each is justified in the report).
- Walk through Home, Login, Register, Client, Worker, Admin.
- Confirm reduced-motion disables animation.
- Confirm it looks right at 375px (mobile) and 1280px (desktop).
- Run the anti-slop self-check, rule by rule.

## Final report
List: what changed per screen; the shared components you created; how many emojis you
removed; any deviations from this file and why; any dependency you added and why;
and a line confirming each final check passed.
