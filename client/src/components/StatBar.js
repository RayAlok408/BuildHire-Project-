import React from 'react';
import cx from './cx';

// Row of number + label pairs. value may be a node (e.g. a number followed by an <Icon>).
// tone: light (bordered bar, landing hero) | dark (plain, on ink) | boxes (inkSoft tiles, on ink).
function StatBar({ items, tone = 'light', className = '', ...rest }) {
  return (
    <div className={cx('bh-stats', `bh-stats--${tone}`, className)} {...rest}>
      {items.map(item => (
        <div className="bh-stats__item" key={item.label}>
          <span className="bh-stats__num">{item.value}</span>
          <span className="bh-stats__lbl">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StatBar;
