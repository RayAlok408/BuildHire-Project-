import React from 'react';
import Logo from './Logo';
import cx from './cx';

// Frosted top bar. fixed: pinned over the page (landing). Default is sticky (dashboards).
// leading: node shown next to the logo. children: the right-hand actions.
function TopNav({ fixed = false, leading, children, className = '', label = 'Main' }) {
  return (
    <header className={cx('bh-nav', fixed && 'bh-nav--fixed', className)}>
      <div className="bh-nav__lead">
        <Logo />
        {leading}
      </div>
      <nav className="bh-nav__actions" aria-label={label}>{children}</nav>
    </header>
  );
}

export default TopNav;
