import React from 'react';
import Button from './Button';
import Card from './Card';
import Icon from './Icon';

// Catches render errors so a crash shows a way out instead of a blank page.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main id="main" className="bh-fallback bh-backdrop">
        <Card pad="lg" className="bh-fallback__card bh-rise">
          <span className="bh-empty__icon"><Icon name="alert-circle" size={28} /></span>
          <h1 className="bh-fallback__title">Something went wrong</h1>
          <p className="bh-empty__text">The page hit an unexpected error. Reloading usually fixes it.</p>
          <div className="bh-fallback__actions">
            <Button icon="rotate-cw" onClick={() => window.location.reload()}>Reload page</Button>
            <Button variant="ghost" icon="home" onClick={() => window.location.assign('/')}>Go to home</Button>
          </div>
        </Card>
      </main>
    );
  }
}

export default ErrorBoundary;
