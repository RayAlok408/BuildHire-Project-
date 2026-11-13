import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// A new page should start at the top, like a normal page load.
function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default ScrollToTop;
