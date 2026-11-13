# BuildHire Frontend: Pre-Revamp Analysis

Produced before any code change, as required by `FRONTEND-REVAMP.md` Step 1.
Scope: everything under `client/src` plus `client/public`. Line numbers refer to the files as they were at commit `753fc63`.

## 1. Routes, pages, components

Routing lives in `client/src/App.js` (`BrowserRouter`). There is no `components/` folder and no shared code: every page repeats its own styles, nav, buttons, avatar, and API constant.

| Route | Page file | Lines | Styling method |
|---|---|---|---|
| `/` | `pages/Home.js` | 241 | CSS string injected into `<head>` in a `useEffect` (classes prefixed `bh-`). Removed on unmount. |
| `/login` | `pages/Login.js` | 129 | Inline `styles` object, no hover/focus/responsive rules possible |
| `/register` | `pages/Register.js` | 129 | Inline `styles` object |
| `/client` | `pages/ClientDashboard.js` | 298 | Inline `styles` object |
| `/worker` | `pages/WorkerDashboard.js` | 249 | Inline `styles` object (two views: job list, accepted-job detail) |
| `/admin` | `pages/AdminDashboard.js` | 165 | Inline `styles` object |

Other files: `index.js` (renders `<App />`, does **not** import `index.css`), `index.css` (13 lines, system-font stack, never loaded), `public/index.html` (title is "React App", `theme-color` `#000000`, no font links), `public/manifest.json` (name "Create React App Sample", theme `#000000`).

Noted but out of scope to fix (not visual): the `build` script is `CI= react-scripts build` (POSIX syntax); `client` and `worker` routes have no auth guard; `Register` inputs are uncontrolled.

## 2. Per-page visual audit

### Home (`/`): the target
- **Colours:** cream `#fafaf8`, ink `#1a1a1a`, yellow `#f5f01a`, `#242424`, `#111`, `#e5e5e5`, `#d4d4d4`, `#22c55e`, greys `#666 #777 #999`. Mostly on palette.
- **Fonts:** Syne (headings, numbers, logo) + DM Sans (body). Loaded via `@import` inside the injected style string, weights Syne 400/700/800, DM Sans 300/400/500. Buttons ask for weight 600, which DM Sans is not loaded in, so the browser fakes bold.
- **Radii:** buttons and pills `100px`; cards `20px` (services, features, stats), `24px` (steps); logo mark `12px`; feature icon tile `14px`; footer mark `8px`.
- **Buttons:** pill. Primary ink bg + yellow text, ghost `1.5px #d4d4d4` border, CTA-section "dark" and "outline" variants. Hover is `translateY(-1px/-2px)` plus changed bg `#333`.
- **Layout:** fixed blurred nav, hero with grid + yellow radial glow, stats bar, marquee, 4 step cards, dark services grid, features grid, yellow CTA, `#111` footer.
- **Side effect:** injects a global `* { margin:0; padding:0; box-sizing:border-box }` reset only while mounted.
- **Motion that exists:** live-dot pulse, marquee scroll, card hover lift. No reduced-motion handling.

### Login (`/login`): generic blue/slate
- **Colours:** left panel `#1e40af`, primary `#2563eb`, page/panel bg `#f8faff`, borders `#e5e7eb`/`#d1d5db`, text `#1e293b #374151 #64748b #94a3b8`, error `#fee2e2/#dc2626`.
- **Fonts:** `sans-serif` only. Brand "BuildHire" is plain bold text.
- **Radii:** card `16px`, input `8px`, button `10px`, test-account tiles `8px`/`10px`, logo tile `12px`.
- **Buttons:** solid blue rectangle with rounded corners, full width. No hover state.
- **Layout:** two-column split (blue brand panel + form). Not responsive: `flex: 1` columns never stack, so the form is squeezed at 375px.

### Register (`/register`): generic blue/slate
- **Colours:** left panel `#2563eb` (a different blue from Login's `#1e40af`), `#f8faff`, `#e5e7eb`, `#1e293b`, `#64748b`, `#374151`, `#d1d5db`, `#f1f5f9`, success `#dcfce7/#16a34a`, error `#fee2e2/#dc2626`.
- **Fonts:** `sans-serif` only.
- **Radii:** card `16px`, input `8px`, button `10px`, role toggle `10px`/`8px`.
- **Buttons:** solid blue; role toggle is a segmented control in blue. No hover state.
- **Layout:** same non-responsive split as Login. Feature list uses a `✓` text glyph in a translucent circle.

### ClientDashboard (`/client`): generic blue/slate
- **Colours:** `#2563eb` (logo, avatar, welcome bar, active tab, primary button), `#f8faff`, `#e5e7eb`, `#1e293b #374151 #64748b`, `#ef4444` tab badge, status colours amber `#f59e0b/#fef3c7`, blue `#2563eb/#dbeafe`, violet `#7c3aed/#ede9fe`, red `#dc2626/#fee2e2`, green `#16a34a/#dcfce7`, review button amber `#f59e0b`.
- **Fonts:** `sans-serif`.
- **Radii:** cards `16px`, buttons `10px`, inputs `8px`, status badge `20px`, tabs `12px`/`8px`.
- **Buttons:** four different solid colours (blue post, green complete, red cancel, amber review) all as rounded rectangles.
- **Layout:** `maxWidth 720px` column; welcome bar with 3 stat boxes; two tabs (Post a Job / My Jobs); job cards; inline review form. Status label is the raw `job.status.toUpperCase()` (so `IN_PROGRESS`).

### WorkerDashboard (`/worker`): generic blue/slate
- **Colours:** as Client plus welcome bar `#1e40af`, alert banner `#2563eb`, green success banner `#16a34a`, availability toggle green `#16a34a`/slate `#cbd5e1`, skill tag `#dbeafe/#1d4ed8`, in-progress badge `#fef3c7/#92400e`.
- **Fonts:** `sans-serif`.
- **Radii:** cards `16px`, buttons `10px`, detail boxes `10px`, toggle `12px`, badges `20px`.
- **Buttons:** blue accept/directions, green start, red cancel, white-bordered back. Rectangles.
- **Layout:** two views. Job list (alert banner, welcome bar, cards) and accepted-job detail (banner, 2x2 details grid, description, map iframe, button stack). The 2-column details grid does not collapse at 375px.

### AdminDashboard (`/admin`): navy + gold
- **Colours:** navy `#0b132b`, `#121d38`, `#17213c`, `#25304d`; gold `#f5d547`; text `#f8fafc #aab4ca`, `#52617d`; badges `#fee2e2/#b91c1c`, `#dcfce7/#166534`; buttons `#dc2626`, `#16a34a`.
- **Fonts:** `sans-serif`.
- **Radii:** rows `10px`, buttons `7px`/`8px`, badge `999px`, avatar circle.
- **Buttons:** gold, red, green rectangles; ghost logout.
- **Layout:** dark theme, `maxWidth 1000px`, hero strip with count, tab bar, user/job rows. Job status is a bare gold uppercase word.

## 3. Emojis and pictograph glyphs in the UI

**26 emoji + 5 text pictograph glyphs = 31 to replace.** Line numbers are file lines.

| File:line | Glyph | Represents | Icon to use |
|---|---|---|---|
| Home.js:96 (marquee) | ⚡ | real-time notifications | `bolt` |
| Home.js:96 | 📍 | location based matching | `map-pin` |
| Home.js:96 | ⭐ | verified workers | `star` |
| Home.js:96 | 🗺️ | live map directions | `map` |
| Home.js:96 | 🔒 | secure platform | `shield` |
| Home.js:158 (step 1) | 📝 | post requirement | `file-plus` |
| Home.js:159 (step 2) | 📡 | workers get notified | `radio` |
| Home.js:160 (step 3) | 🤝 | worker accepts and arrives | `user-check` |
| Home.js:161 (step 4) | ⭐ | rate the service | `star` |
| Home.js:178 | 🔧 | plumber | `wrench` |
| Home.js:179 | ⚡ | electrician | `bolt` |
| Home.js:180 | 🪚 | carpenter | `saw` |
| Home.js:181 | 🖌️ | painter | `brush` |
| Home.js:182 | 🧹 | cleaner | `spray` |
| Home.js:183 | ➕ | more services | `plus` |
| Home.js:199 | ⚡ | real-time matching | `bolt` |
| Home.js:200 | 📍 | location based | `map-pin` |
| Home.js:201 | 🔒 | secure platform | `shield` |
| Home.js:202 | ⭐ | ratings and reviews | `star` |
| Home.js:203 | 🗺️ | live map directions | `map` |
| Home.js:204 | 📱 | any device | `smartphone` |
| ClientDashboard.js:173 | 📋 | empty job list | `clipboard` |
| WorkerDashboard.js:155 | 🔔 | new-job notification banner | `bell` |
| WorkerDashboard.js:170 | 📡 | empty open-jobs list | `radio` |
| WorkerDashboard.js:188 | 👤 | "Posted by" client | `user` |
| WorkerDashboard.js:192 | 📍 | job distance | `map-pin` |

Text pictograph glyphs (not strictly emoji, but they are decorative symbols so they also go):

| File:line | Glyph | Represents | Icon |
|---|---|---|---|
| Home.js:125 | → | "Join as Worker" button | `arrow-right` |
| Home.js:137 | ★ | "4.8★" average rating stat | `star` |
| Login.js:52 | ★ | "4.8★" average rating stat | `star` |
| ClientDashboard.js:195 | ★ | worker rating | `star` |
| Register.js:40 | ✓ | feature list tick | `check` |

Characters intentionally kept as plain typography: `—` (em dash in copy), `·` (separator in admin rows), `©` (footer).

## 4. Colour values NOT in the target palette

Target palette = cream, ink, inkSoft, inkDeep, yellow, line (`#e5e5e5`/`#eee`), borderStrong, muted/mutedSoft/mutedText, success, and the five status pairs. `#fff` is used by the landing for cards and inputs, so it is kept as a `white` token.

| File | Off-palette values |
|---|---|
| Home.js | `#333` (hover bg, x4), `#444` (service desc hover), `#555` (live pill, CTA copy, footer text/links, x4), `rgba(0,0,0,0.2)` (button hover shadow, a second shadow style), `rgba(0,0,0,0.06)` (nav border). `#f5f01a22` and `rgba(250,250,248,0.85)` are alpha forms of yellow/cream and become derived tokens. |
| Login.js | `#1e40af #2563eb #f8faff #e5e7eb #1e293b #64748b #374151 #d1d5db #94a3b8 #fee2e2 #dc2626` |
| Register.js | `#2563eb #f8faff #e5e7eb #1e293b #64748b #374151 #d1d5db #f1f5f9 #dcfce7 #16a34a #fee2e2 #dc2626`, `rgba(255,255,255,0.2)` |
| ClientDashboard.js | `#2563eb #7c3aed #f59e0b #dc2626 #16a34a #ef4444 #fef3c7 #dbeafe #ede9fe #fee2e2 #dcfce7 #f8faff #e5e7eb #1e293b #374151 #64748b #d1d5db`, `rgba(255,255,255,0.15/0.75)` |
| WorkerDashboard.js | `#2563eb #1e40af #1d4ed8 #dbeafe #16a34a #dcfce7 #dc2626 #92400e #fef3c7 #cbd5e1 #94a3b8 #64748b #374151 #1e293b #f8faff #e5e7eb`, `rgba(255,255,255,0.2/0.75)` |
| AdminDashboard.js | `#0b132b #121d38 #17213c #25304d #52617d #aab4ca #f8fafc #f5d547 #fee2e2 #dcfce7 #b91c1c #166534 #dc2626 #16a34a` |

### Contrast findings on the existing tokens (WCAG AA = 4.5:1 body text)
Calculated from relative luminance:

| Pair | Ratio | Verdict |
|---|---|---|
| yellow `#f5f01a` on ink `#1a1a1a` | 14.4:1 | pass |
| ink on cream | 16.7:1 | pass |
| `#666` on cream / white | 5.5 / 5.7:1 | pass |
| `#777` on cream / white | 4.3 / 4.5:1 | **fails on cream**, borderline on white |
| `#999` on cream / white | 2.7 / 2.9:1 | **fails** |
| `#999` on ink / inkSoft / inkDeep | 6.1 / 5.5 / 6.6:1 | pass (use for secondary text on dark) |
| `#666` on ink / inkSoft (landing's dark-section eyebrow and desc) | 3.0 / 2.7:1 | **fails** |
| `#555` on `#111` (landing footer) | 2.5:1 | **fails** |
| `#d4d4d4` on white (ghost button / input border) | 1.5:1 | fails 3:1 for input boundaries, so inputs use `#777` borders (4.5:1) |
| status chips: `#137a3e` on `#e6f6ec` / `#b42318` on `#fbeae8` | 4.8 / 5.6:1 | pass |

Consequence for the revamp: `muted` `#777` is used only for large text and borders, `mutedSoft` `#999` only on dark surfaces, and secondary text on light surfaces uses `mutedText` `#666`. Landing text that used `#777`/`#999`/`#666-on-dark`/`#555` moves to those passing roles.

## 5. Functional wiring that must not change

Shared constant in every API page: `API = 'https://buildhire-server.onrender.com'`.

**App.js:** routes `/`, `/login`, `/register`, `/client`, `/worker`, `/admin` and their elements.

**Login.js**
- `POST ${API}/api/auth/login` with `{ email, password }`; `localStorage.clear()` first; stores `token` and `user` (JSON).
- Role redirect: `admin` -> `/admin`, `client` -> `/client`, else `/worker`.
- Enter key submits; empty-field validation message; error text from `err.response.data.message`.
- Test-account quick-login tiles fill `client@test.com` / `worker@test.com` with `123456`.

**Register.js**
- `POST ${API}/api/auth/register` with `{ ...form, coordinates: [75.8573, 30.9010] }`.
- Success message, then `setTimeout(() => navigate('/login'), 1500)`. Success styling keyed on `msg.includes('success')`.
- Role toggle (`client` / `worker`); skill select only for workers; inputs are uncontrolled.

**ClientDashboard.js**
- Module-level `token`, `socket = io(API, { auth: { token } })`, `headers`; `user` from `localStorage.user`.
- `GET /api/jobs/myjobs`; `POST /api/jobs/create` (with coordinates); `PUT /api/jobs/complete/:id`; `POST /api/jobs/:id/review` (`rating` as Number, `review`); `PUT /api/jobs/cancel/:id` (`reason: 'Cancelled by client'`).
- Socket events: `booking:accepted`, `booking:started`, `booking:cancelled` (on/off in effect cleanup).
- Post flow message states `success | error | fill`; on success the form resets and after 1500 ms the tab switches to My Jobs.
- Review flow: `reviewingJobId`, `reviewForm`, `reviewMsg`, 1-5 rating select, 1000-char review limit; "Review Worker" appears only when `!job.review`.
- Logout: `localStorage.clear()` then `navigate('/login')`.

**WorkerDashboard.js**
- Module-level `token`, `socket`, `headers`; `user` from `localStorage.user`.
- `GET /api/jobs/open`; `PUT /api/jobs/accept/:id`; `PUT /api/jobs/start/:id`; `PUT /api/jobs/cancel/:id` (`reason: 'Cancelled by worker'`).
- Socket events: `job:new` (message, refetch, clears after **5000 ms**), `booking:cancelled`, `booking:completed`.
- Availability toggle (local state, clickable track).
- Accepted-job view: details, map `<iframe src="https://maps.google.com/maps?q=30.9010,75.8573&z=14&output=embed">`, "Get Directions" -> `window.open('https://www.google.com/maps/dir/?api=1&destination=lat,lng', '_blank')`, Start (only when `accepted`), Cancel, Back.
- Logout as above.

**AdminDashboard.js**
- Module-level `token`, `headers`. Redirect to `/login` (`replace: true`) unless `user.role === 'admin'`; renders `null` for non-admins.
- `GET /api/admin/users?page=1&limit=50`, `GET /api/admin/jobs?page=1&limit=50`; `PATCH /api/admin/workers/:id/approval` `{ approved }`; `PATCH /api/admin/users/:id/block` `{ blocked }`.
- Approve/reject (workers only) and block/unblock buttons, disabled while `loading`; message strings per action.
- `localStorage` keys used everywhere: `token`, `user`.

## 6. Plan
1. Foundation: `theme.js` (tokens + CSS variables), `index.css` (fonts, reset, reduced-motion), shared components `Icon Button Card Field StatusBadge TopNav Avatar` plus small helpers `Logo Spinner Alert EmptyState Reveal`.
2. Screens in order: Home, Login, Register, ClientDashboard, WorkerDashboard, AdminDashboard, then a global polish pass. One commit each.
3. Fonts move from the injected `@import` to `<link>` tags in `public/index.html`.
