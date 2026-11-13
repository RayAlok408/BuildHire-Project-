// Skill name -> icon name (same mapping the landing page uses for its service cards).
const SKILL_ICONS = {
  plumber: 'wrench',
  electrician: 'bolt',
  carpenter: 'saw',
  painter: 'brush',
  cleaner: 'spray',
};

export function skillIcon(skill) {
  return SKILL_ICONS[String(skill || '').toLowerCase()] || 'briefcase';
}

export default SKILL_ICONS;
