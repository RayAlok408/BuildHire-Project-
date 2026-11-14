import React from 'react';
import Icon from './Icon';
import Card from './Card';
import cx from './cx';

function EmptyState({ icon = 'clipboard', title, text, children, className = '' }) {
  return (
    <Card pad="lg" className={cx('bh-empty', 'bh-rise', className)}>
      <span className="bh-empty__icon"><Icon name={icon} size={28} /></span>
      <h3 className="bh-empty__title">{title}</h3>
      {text && <p className="bh-empty__text">{text}</p>}
      {children}
    </Card>
  );
}

export default EmptyState;
