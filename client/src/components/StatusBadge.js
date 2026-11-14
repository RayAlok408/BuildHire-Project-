import React from 'react';
import cx from './cx';

// Chip. status: open | accepted | in_progress | completed | cancelled (job states)
//              active | blocked (account states, reuse the completed / cancelled colours)
//              outline (neutral tag, e.g. a skill)
const LABELS = {
  open: 'Open',
  accepted: 'Accepted',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  active: 'Active',
  blocked: 'Blocked',
};

function StatusBadge({ status = 'outline', children, className = '' }) {
  const key = String(status).replace(/_/g, '-');
  return (
    <span className={cx('bh-badge', `bh-badge--${key}`, className)}>
      {children || LABELS[status] || String(status).replace(/_/g, ' ')}
    </span>
  );
}

export default StatusBadge;
