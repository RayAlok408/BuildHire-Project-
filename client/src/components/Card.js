import React from 'react';
import cx, { stagger } from './cx';

// Surface. pad: none | sm (24px, 20px radius) | md (32px, 24px radius) | lg (48px, 24px radius).
// tone: light (white) | cream | dark (inkSoft, for dark sections) | ink (dark panels on cream).
// hover lifts the card with the one shadow. rise={i} staggers a mount entrance, stagger={i} is for
// children of <Reveal group>.
function Card({ as: Tag = 'div', tone = 'light', pad = 'md', hover = false, rise, stagger: groupIndex, className = '', style, children, ...rest }) {
  const index = rise !== undefined ? rise : groupIndex;
  const delay = index !== undefined ? { ...stagger(index), ...style } : style;
  return (
    <Tag
      className={cx(
        'bh-card',
        `bh-card--${tone}`,
        `bh-card--pad-${pad}`,
        hover && 'bh-card--hover',
        rise !== undefined && 'bh-rise',
        groupIndex !== undefined && 'bh-stagger',
        className
      )}
      style={delay}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Card;
