import React from 'react';
import Icon from './Icon';
import Spinner from './Spinner';
import cx from './cx';

const ICON_SIZE = { sm: 16, md: 18, lg: 20 };

// One pill button system.
//   primary: ink background, yellow text (default)
//   ghost:   transparent with a 1.5px border
//   dark:    dark outline, for the yellow CTA section
//   danger:  ghost in the "cancelled" status colours, for destructive actions
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  full = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  const iconSize = ICON_SIZE[size] || 18;
  return (
    <button
      type={type}
      className={cx('bh-btn', `bh-btn--${variant}`, `bh-btn--${size}`, full && 'bh-btn--full', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size={iconSize - 2} decorative /> : icon && <Icon name={icon} size={iconSize} />}
      <span>{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}

export default Button;
