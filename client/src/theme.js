// BuildHire design tokens. This file is the single source of truth.
// Every colour, radius, shadow, spacing step and font in the app comes from here.
// `applyTheme()` publishes the same values as CSS custom properties (--cream, --ink, ...)
// so stylesheets never repeat a hex value.

export const colors = {
  cream: '#fafaf8', // default page background
  white: '#fff', // cards and inputs on cream (the landing uses it for every card)
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

// Alpha forms of the tokens above, needed for the frosted nav and the hero glow.
export const derived = {
  creamGlass: 'rgba(250,250,248,0.85)', // cream at 85%
  yellowGlow: 'rgba(245,240,26,0.13)', // yellow at 13% (the landing's #f5f01a22)
};

// Status chips. Use only these pairs.
export const status = {
  open: { bg: '#fdf6c7', fg: '#1a1a1a' },
  accepted: { bg: '#1a1a1a', fg: '#f5f01a' },
  in_progress: { bg: '#ecebe6', fg: '#1a1a1a' },
  completed: { bg: '#e6f6ec', fg: '#137a3e' },
  cancelled: { bg: '#fbeae8', fg: '#b42318' },
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

// The only shadow in the app. Used on hover.
export const shadow = { lift: '0 12px 32px rgba(0,0,0,0.08)' };

export const motion = {
  fast: '150ms',
  base: '200ms',
  reveal: '400ms',
  ease: 'ease-out',
  stagger: '50ms',
};

export const theme = { colors, derived, status, fonts, space, radius, shadow, motion };

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export function cssVariables() {
  const lines = [];
  Object.entries(colors).forEach(([k, v]) => lines.push(`--${kebab(k)}: ${v};`));
  Object.entries(derived).forEach(([k, v]) => lines.push(`--${kebab(k)}: ${v};`));
  Object.entries(status).forEach(([k, v]) => {
    const name = kebab(k).replace(/_/g, '-');
    lines.push(`--status-${name}-bg: ${v.bg};`, `--status-${name}-fg: ${v.fg};`);
  });
  lines.push(`--font-display: ${fonts.display};`, `--font-body: ${fonts.body};`);
  Object.entries(space).forEach(([k, v]) => lines.push(`--space-${k}: ${v};`));
  Object.entries(radius).forEach(([k, v]) => lines.push(`--radius-${kebab(k)}: ${v};`));
  lines.push(`--shadow-lift: ${shadow.lift};`);
  Object.entries(motion).forEach(([k, v]) => lines.push(`--motion-${kebab(k)}: ${v};`));
  return `:root {\n  ${lines.join('\n  ')}\n}`;
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
