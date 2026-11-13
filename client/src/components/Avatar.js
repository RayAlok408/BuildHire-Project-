import React from 'react';
import cx from './cx';

// Initial in a circle. Decorative: the name is always rendered next to it.
function Avatar({ name, size = 'md', className = '' }) {
  return (
    <span className={cx('bh-avatar', `bh-avatar--${size}`, className)} aria-hidden="true">
      {name?.[0]?.toUpperCase()}
    </span>
  );
}

export default Avatar;
