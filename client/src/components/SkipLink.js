import React from 'react';

// First focusable element on a page. Lets keyboard users jump past the nav to <main id="main">.
function SkipLink() {
  return <a className="bh-skip" href="#main">Skip to main content</a>;
}

export default SkipLink;
