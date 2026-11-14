import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TopNav } from '../components';
import { getUser, homePathFor, isSignedIn } from '../session';
import { useDocumentTitle } from '../hooks';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();
  const signedIn = isSignedIn();
  useDocumentTitle('Page not found');

  return (
    <div className="bh-notfound">
      <TopNav compact>
        {signedIn
          ? <Button size="sm" onClick={() => navigate(homePathFor(getUser().role))}>Dashboard</Button>
          : <Button size="sm" onClick={() => navigate('/login')}>Login</Button>}
      </TopNav>
      <main id="main" tabIndex={-1} className="bh-notfound__main bh-backdrop">
        <p className="bh-eyebrow bh-rise">Error 404</p>
        <h1 className="bh-notfound__title bh-rise">
          This page <span className="bh-highlight">does not exist</span>
        </h1>
        <p className="bh-notfound__text bh-rise">The link may be broken, or the page may have moved.</p>
        <div className="bh-notfound__actions bh-rise">
          <Button size="lg" icon="home" onClick={() => navigate('/')}>Back to home</Button>
          {signedIn && (
            <Button variant="ghost" size="lg" onClick={() => navigate(homePathFor(getUser().role))}>Go to dashboard</Button>
          )}
        </div>
      </main>
    </div>
  );
}

export default NotFound;
