import React from 'react';
import Icon from './Icon';
import cx from './cx';
import { toggleMode, useThemeMode } from '../themeMode';

// Sun / moon button. Both icons are always rendered; CSS swaps them with a turn so the change
// matches the circular reveal.
function ThemeToggle({ className = '' }) {
  const mode = useThemeMode();
  const label = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  const onClick = event => {
    const box = event.currentTarget.getBoundingClientRect();
    toggleMode({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
  };
  return (
    <button type="button" className={cx('bh-theme-toggle', className)} aria-label={label} title={label} onClick={onClick}>
      <Icon name="sun" size={20} className="bh-theme-toggle__sun" />
      <Icon name="moon" size={20} className="bh-theme-toggle__moon" />
    </button>
  );
}

export default ThemeToggle;
