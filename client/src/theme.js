// BuildHire design tokens. This file is the single source of truth.
// Every colour, radius, shadow, spacing step and font in the app comes from here.
// `applyTheme()` publishes the same values as CSS custom properties so stylesheets never repeat a hex.
//
// Two layers:
//   1. Brand constants (cream, ink, yellow ...) never change. They are used where a surface is
//      always light or always dark: the yellow CTA band, the footer, text on dark panels.
//   2. Roles (bg, surface, text, solid ...) switch with the theme. Light is the landing page.
//      Dark is "ink and lamp light": warm near-black surfaces, cream text, yellow doing the work.

export const colors = {
  cream: '#fafaf8', // light page background
  white: '#fff', // light cards and inputs, and text on dark panels
  ink: '#1a1a1a', // primary text, dark surfaces, primary buttons
  inkSoft: '#242424', // cards on dark sections
  inkDeep: '#111', // footer
  yellow: '#f5f01a', // accent: button text on ink, highlights, CTA background
  line: '#e5e5e5', // borders (the landing also uses #eee)
  borderStrong: '#d4d4d4', // ghost button border
  muted: '#777', // large text and non-text only (4.3:1 on cream)
  mutedSoft: '#999', // secondary text on DARK surfaces only (6.1:1 on ink)
  mutedText: '#666', // secondary text on LIGHT surfaces (5.5:1 on cream)
  success: '#22c55e', // live dot
};

// Light theme roles (the landing page).
export const light = {
  bg: colors.cream, // page background
  surface: colors.white, // cards, inputs, pills
  inset: colors.cream, // tiles sunk into a card
  text: colors.ink, // primary text
  mutedText: colors.mutedText, // secondary text on bg / surface
  muted: colors.muted, // input borders, switch track, idle dots
  line: colors.line, // hairlines
  borderStrong: colors.borderStrong, // ghost button border
  solid: colors.ink, // primary button, active tab, avatar, logo mark
  onSolid: colors.yellow, // text on `solid`
  panel: colors.ink, // dark panels on a light page
  panelTile: colors.inkSoft, // tiles inside a panel
  panelBorder: colors.ink, // panel outline (invisible in light)
  glass: 'rgba(250,250,248,0.85)', // frosted nav (cream at 85%)
  yellowGlow: 'rgba(245,240,26,0.13)', // the hero's yellow radial (the landing's #f5f01a22)
  shadowLift: '0 12px 32px rgba(0,0,0,0.08)', // the one shadow
};

// Dark theme roles. Every text pair is checked for WCAG AA (most are 7:1 or better).
export const dark = {
  bg: '#0d0d0c',
  surface: '#171715',
  inset: '#0d0d0c',
  text: '#f3f2ea',
  mutedText: '#a9a89f',
  muted: '#8d8c84',
  line: '#2a2a27',
  borderStrong: '#45453f',
  solid: colors.yellow, // primary buttons flip to yellow with ink text
  onSolid: colors.ink,
  panel: '#1c1c19',
  panelTile: '#272724',
  panelBorder: '#2f2f2b',
  glass: 'rgba(13,13,12,0.85)',
  yellowGlow: 'rgba(245,240,26,0.12)',
  shadowLift: '0 12px 32px rgba(0,0,0,0.5)',
};

// Status chips. Use only these pairs.
export const status = {
  light: {
    open: { bg: '#fdf6c7', fg: '#1a1a1a' },
    accepted: { bg: '#1a1a1a', fg: '#f5f01a' },
    in_progress: { bg: '#ecebe6', fg: '#1a1a1a' },
    completed: { bg: '#e6f6ec', fg: '#137a3e' },
    cancelled: { bg: '#fbeae8', fg: '#b42318' },
  },
  dark: {
    open: { bg: '#3a3610', fg: '#f5f01a' },
    accepted: { bg: '#f5f01a', fg: '#1a1a1a' },
    in_progress: { bg: '#2f2f2b', fg: '#ecebe6' },
    completed: { bg: '#10301d', fg: '#62d98e' },
    cancelled: { bg: '#3d1713', fg: '#ff8f84' },
  },
};

export const fonts = {
  display: "'Syne', sans-serif", // headings, numbers, logo, eyebrows (700/800)
  body: "'DM Sans', sans-serif", // body and all UI text (300/400/500)
};

// 8px scale
export const space = { 4: '4px', 8: '8px', 12: '12px', 16: '16px', 24: '24px', 32: '32px', 48: '48px', 64: '64px', 96: '96px' };

export const radius = {
  pill: '100px', // buttons and chips
  card: '24px', // cards
  cardSm: '20px', // compact cards and tiles
  input: '12px', // inputs
  tile: '14px', // icon tiles
  mark: '12px', // logo mark
  markSm: '8px', // small logo mark (footer)
};

export const motion = {
  fast: '150ms',
  base: '200ms',
  reveal: '400ms',
  ease: 'ease-out',
  stagger: '50ms',
};

export const theme = { colors, light, dark, status, fonts, space, radius, motion };

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const decl = (name, value) => `--${name}: ${value};`;

function roleVars(roles, statuses) {
  const lines = Object.entries(roles).map(([k, v]) => decl(kebab(k), v));
  Object.entries(statuses).forEach(([k, v]) => {
    const name = kebab(k).replace(/_/g, '-');
    lines.push(decl(`status-${name}-bg`, v.bg), decl(`status-${name}-fg`, v.fg));
  });
  return lines;
}

export function cssVariables() {
  // brand constants, minus the ones that exist as roles
  const roleNames = new Set(Object.keys(light));
  const fixed = Object.entries(colors)
    .filter(([k]) => !roleNames.has(k))
    .map(([k, v]) => decl(kebab(k), v));
  const rootLines = [
    ...fixed,
    decl('font-display', fonts.display),
    decl('font-body', fonts.body),
    ...Object.entries(space).map(([k, v]) => decl(`space-${k}`, v)),
    ...Object.entries(radius).map(([k, v]) => decl(`radius-${kebab(k)}`, v)),
    ...Object.entries(motion).map(([k, v]) => decl(`motion-${kebab(k)}`, v)),
    ...roleVars(light, status.light),
    'color-scheme: light;',
  ];
  const darkLines = [...roleVars(dark, status.dark), 'color-scheme: dark;'];
  return `:root {\n  ${rootLines.join('\n  ')}\n}\n:root[data-theme='dark'] {\n  ${darkLines.join('\n  ')}\n}`;
}

export function applyTheme() {
  if (typeof document === 'undefined' || document.getElementById('bh-theme')) return;
  const el = document.createElement('style');
  el.id = 'bh-theme';
  el.textContent = cssVariables();
  document.head.appendChild(el);
}

// Publish the variables as soon as the module loads so any stylesheet can rely on them.
applyTheme();

export default theme;
