import React from 'react';
import Card from './Card';
import cx from './cx';

// Loading placeholders in the palette (a quiet opacity pulse, no gradients).
export function Skeleton({ width = '100%', height = 16, className = '', style }) {
  return <span className={cx('bh-skeleton', className)} style={{ width, height, ...style }} aria-hidden="true" />;
}

// A stack of card-shaped placeholders for job / user lists.
export function SkeletonCards({ count = 2 }) {
  return (
    <div className="bh-skeleton-list" role="status" aria-busy="true">
      <span className="bh-sr-only">Loading</span>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} pad="sm" className="bh-skeleton-card">
          <div className="bh-skeleton-row">
            <Skeleton width="45%" height={20} />
            <Skeleton width={72} height={24} style={{ borderRadius: 'var(--radius-pill)' }} />
          </div>
          <Skeleton width="30%" height={14} />
          <Skeleton width="90%" height={14} />
          <Skeleton width="70%" height={14} />
        </Card>
      ))}
    </div>
  );
}

export default Skeleton;
