import React from 'react';
import Logo from './Logo';
import SkipLink from './SkipLink';
import ThemeToggle from './ThemeToggle';
import cx from './cx';

// Frosted top bar. fixed: pinned over the page (landing). Default is sticky (dashboards).
// compact: on phones the wordmark collapses to the BH mark (keeps busy dashboard navs on one line).
// leading: node shown next to the logo. children: the right-hand actions.
function TopNav({ fixed = false, compact = false, leading, children, className = '', label = 'Main' }) {
  return (
    <header className={cx('bh-nav', fixed && 'bh-nav--fixed', compact && 'bh-nav--compact', className)}>
      <SkipLink />
      <div className="bh-nav__lead">
        <Logo />
        {leading}
      </div>
      <nav className="bh-nav__actions" aria-label={label}>
        <ThemeToggle />
        {children}
      </nav>
    </header>
  );
}

export default TopNav;
