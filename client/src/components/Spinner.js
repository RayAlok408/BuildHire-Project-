import React from 'react';
import cx from './cx';

// Minimal ring spinner in currentColor. Pass decorative when a text label sits beside it.
function Spinner({ size = 20, decorative = false, label = 'Loading', className = '' }) {
  const a11y = decorative ? { 'aria-hidden': 'true' } : { role: 'status' };
  return (
    <span className={cx('bh-spinner', className)} style={{ width: size, height: size }} {...a11y}>
      {!decorative && <span className="bh-sr-only">{label}</span>}
    </span>
  );
}

export default Spinner;
