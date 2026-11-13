import React from 'react';
import Icon from './Icon';
import cx from './cx';

const DEFAULT_ICON = { success: 'check-circle', error: 'alert-circle', info: 'info', notice: 'bell' };

// Inline message / toast. Slides and fades in. tone: success | error | info | notice (ink + yellow).
// bar makes it a full-width strip (used under the nav).
function Alert({ tone = 'info', icon, bar = false, className = '', children, ...rest }) {
  return (
    <div
      className={cx('bh-alert', `bh-alert--${tone}`, bar && 'bh-alert--bar', className)}
      role={tone === 'error' ? 'alert' : 'status'}
      {...rest}
    >
      <Icon name={icon || DEFAULT_ICON[tone]} size={18} />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
