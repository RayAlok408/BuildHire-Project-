import React from 'react';
import Icon from './Icon';
import cx from './cx';

// Pill segmented control for tabs and two-way choices.
// options: [{ value, label, icon?, badge? }]
function Segmented({ options, value, onChange, label, className = '' }) {
  return (
    <div className={cx('bh-seg', className)} role="group" aria-label={label}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={cx('bh-seg__btn', active && 'is-active')}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <Icon name={option.icon} size={18} />}
            <span>{option.label}</span>
            {option.badge ? <span className="bh-seg__badge">{option.badge}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default Segmented;
