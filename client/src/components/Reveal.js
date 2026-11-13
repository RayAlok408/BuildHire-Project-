import React, { useEffect, useRef, useState } from 'react';
import cx from './cx';

// Fade + rise the first time the block scrolls into view (once, 400ms, ease-out).
// group: don't animate the wrapper itself, stagger its direct children marked .bh-stagger instead.
// Reduced motion is handled in CSS (everything is shown immediately).
function Reveal({ as: Tag = 'div', group = false, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cx('bh-reveal', group && 'bh-reveal--group', visible && 'is-visible', className)} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
