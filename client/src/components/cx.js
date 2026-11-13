// Join class names, skipping falsy values.
export default function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// Inline style for a staggered entrance (about 50ms apart, capped so long lists stay snappy).
export function stagger(index) {
  return { animationDelay: `${Math.min(index, 8) * 50}ms` };
}
