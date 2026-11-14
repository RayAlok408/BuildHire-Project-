import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cx from './cx';

// BH mark + wordmark. It links to the landing page (and scrolls to the top when you are already there).
// tone="dark" is for dark surfaces (footer), size="sm" for compact spots. plain renders a non-link.
function Logo({ tone = 'light', size = 'md', plain = false, className = '' }) {
  const location = useLocation();
  const classes = cx('bh-logo', `bh-logo--${tone}`, `bh-logo--${size}`, !plain && 'bh-logo--link', className);
  const inner = (
    <>
      <span className="bh-logo__mark">BH</span>
      <span className="bh-logo__text">BuildHire</span>
    </>
  );
  if (plain) return <span className={classes}>{inner}</span>;

  const onClick = event => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <Link to="/" className={classes} onClick={onClick}>
      {inner}
      <span className="bh-sr-only"> home</span>
    </Link>
  );
}

export default Logo;
