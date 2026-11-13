import React from 'react';
import cx from './cx';

// BH mark + wordmark. tone="dark" is for dark surfaces (footer), size="sm" for compact spots.
function Logo({ tone = 'light', size = 'md', className = '' }) {
  return (
    <span className={cx('bh-logo', `bh-logo--${tone}`, `bh-logo--${size}`, className)}>
      <span className="bh-logo__mark" aria-hidden="true">BH</span>
      <span className="bh-logo__text">BuildHire</span>
    </span>
  );
}

export default Logo;
