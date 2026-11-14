import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Icon, Logo, Reveal, StatBar, TopNav, stagger } from '../components';
import { clearSession, getUser, homePathFor, isSignedIn } from '../session';
import { useDocumentTitle } from '../hooks';
import './Home.css';

const MARQUEE_ITEMS = [
  { icon: 'bolt', label: 'Real-time notifications' },
  { icon: 'map-pin', label: 'Location based matching' },
  { icon: 'star', label: 'Verified workers' },
  { icon: 'map', label: 'Live map directions' },
  { icon: 'shield', label: 'Secure platform' },
];

const STEPS = [
  { num: '01', icon: 'file-plus', title: 'Post your requirement', desc: 'Describe what you need in seconds. Tap repair, wiring, painting, carpentry — we cover it all.' },
  { num: '02', icon: 'radio', title: 'Workers get notified', desc: 'All available skilled workers within 10km receive an instant real-time notification.' },
  { num: '03', icon: 'user-check', title: 'Worker accepts & arrives', desc: 'The nearest available worker accepts your job and gets map directions to your location.' },
  { num: '04', icon: 'star', title: 'Rate the service', desc: 'After completion, rate and review the worker to build community trust.' },
];

const SERVICES = [
  { icon: 'wrench', name: 'Plumber', desc: 'Tap, pipe & drainage repairs' },
  { icon: 'bolt', name: 'Electrician', desc: 'Wiring, switches & fittings' },
  { icon: 'saw', name: 'Carpenter', desc: 'Furniture & woodwork' },
  { icon: 'brush', name: 'Painter', desc: 'Wall & surface painting' },
  { icon: 'spray', name: 'Cleaner', desc: 'Home & office cleaning' },
  { icon: 'plus', name: 'More soon', desc: 'More services coming' },
];

const FEATURES = [
  { icon: 'bolt', title: 'Real-time matching', desc: 'Workers get notified the moment you post. No delays, no waiting around.' },
  { icon: 'map-pin', title: 'Location based', desc: 'Only workers within 10km are notified — guaranteed fast arrival.' },
  { icon: 'shield', title: 'Secure platform', desc: 'JWT authentication and encrypted passwords keep your account safe.' },
  { icon: 'star', title: 'Ratings & reviews', desc: 'Every worker has a public rating so you always know who you are hiring.' },
  { icon: 'map', title: 'Live map directions', desc: 'Workers get Google Maps directions to your location instantly on acceptance.' },
  { icon: 'smartphone', title: 'Any device', desc: 'Use BuildHire on your phone, tablet or computer — fully responsive.' },
];

const HERO_STATS = [
  { value: '500+', label: 'Skilled Workers' },
  { value: '1000+', label: 'Jobs Completed' },
  { value: <>4.8<Icon name="star" size={22} /></>, label: 'Avg Rating' },
  { value: '10km', label: 'Search Radius' },
];

function SectionHead({ eyebrow, title }) {
  return (
    <Reveal>
      <div className="bh-eyebrow">{eyebrow}</div>
      <h2 className="bh-section__title">{title}</h2>
    </Reveal>
  );
}

function Home() {
  const navigate = useNavigate();
  useDocumentTitle();
  // Signed-in visitors get a way back to their dashboard instead of Login / Get Started.
  const [member, setMember] = useState(() => (isSignedIn() ? getUser() : null));
  const dashboard = member ? homePathFor(member.role) : null;
  const logout = () => {
    clearSession();
    setMember(null);
  };

  return (
    <div className="bh-page">
      <TopNav fixed>
        {member ? (
          <>
            <Button variant="ghost" size="sm" icon="log-out" onClick={logout}>Logout</Button>
            <Button size="sm" onClick={() => navigate(dashboard)}>Dashboard</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
          </>
        )}
      </TopNav>

      <main id="main" tabIndex={-1}>
        <section className="bh-hero bh-backdrop">
          <div className="bh-live-pill bh-rise" style={stagger(0)}>
            <span className="bh-live-dot" />
            Workers available near you right now
          </div>
          <h1 className="bh-hero__title bh-rise" style={stagger(1)}>
            Your home problem,<br />
            solved <span className="bh-highlight">instantly</span>
          </h1>
          <p className="bh-hero__lead bh-rise" style={stagger(2)}>
            Post a job and nearby skilled workers get notified in real time. No waiting, no calls — fast, reliable service at your doorstep.
          </p>
          <div className="bh-hero__actions bh-rise" style={stagger(3)}>
            <Button size="lg" onClick={() => navigate('/register')}>Post a Job Now</Button>
            <Button variant="ghost" size="lg" iconRight="arrow-right" onClick={() => navigate('/register')}>Join as Worker</Button>
          </div>
          <StatBar items={HERO_STATS} className="bh-hero__stats bh-rise" style={stagger(4)} />
        </section>

        <div className="bh-marquee-wrap" aria-hidden="true">
          <div className="bh-marquee">
            {[0, 1, 2, 3].map(group => (
              <span className="bh-marquee__group" key={group}>
                {MARQUEE_ITEMS.map(item => (
                  <span className="bh-marquee__item" key={item.label}>
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section className="bh-section">
          <SectionHead eyebrow="How it works" title="Get help in 4 simple steps" />
          <Reveal as="ol" group className="bh-steps">
            {STEPS.map((s, i) => (
              <Card as="li" key={s.num} hover stagger={i}>
                <div className="bh-step__num" aria-hidden="true">{s.num}</div>
                <Icon name={s.icon} size={32} className="bh-step__icon" />
                <h3 className="bh-step__title">{s.title}</h3>
                <p className="bh-step__text">{s.desc}</p>
              </Card>
            ))}
          </Reveal>
        </section>

        <section className="bh-section bh-section--ink bh-on-ink">
          <SectionHead eyebrow="Our services" title="What can we help you with?" />
          <Reveal group className="bh-services-grid">
            {SERVICES.map((s, i) => (
              <Card as="button" type="button" key={s.name} tone="dark" pad="sm" hover stagger={i} className="bh-service" onClick={() => navigate('/register')}>
                <Icon name={s.icon} size={32} className="bh-service__icon" />
                <div className="bh-service__name">{s.name}</div>
                <div className="bh-service__desc">{s.desc}</div>
              </Card>
            ))}
          </Reveal>
        </section>

        <section className="bh-section bh-section--white">
          <SectionHead eyebrow="Why BuildHire" title="Built for speed and trust" />
          <Reveal group className="bh-features-grid">
            {FEATURES.map((f, i) => (
              <Card key={f.title} tone="cream" stagger={i}>
                <div className="bh-feature__icon"><Icon name={f.icon} size={24} /></div>
                <h3 className="bh-feature__title">{f.title}</h3>
                <p className="bh-feature__text">{f.desc}</p>
              </Card>
            ))}
          </Reveal>
        </section>

        <section className="bh-cta">
          <Reveal>
            <h2 className="bh-cta__title">Start using BuildHire today</h2>
            <p className="bh-cta__text">Join thousands of clients and workers — it is completely free to get started</p>
            <div className="bh-cta__actions">
              <Button size="lg" onClick={() => navigate('/register')}>Post a Job</Button>
              <Button variant="dark" size="lg" onClick={() => navigate('/register')}>Become a Worker</Button>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="bh-footer">
        <Logo tone="dark" size="sm" />
        <div className="bh-footer__right">
          <div>© 2026 BuildHire. All rights reserved.</div>
          <div className="bh-footer__links">
            {member ? (
              <>
                <button type="button" className="bh-footer__link" onClick={() => navigate(dashboard)}>Dashboard</button>
                <button type="button" className="bh-footer__link" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <button type="button" className="bh-footer__link" onClick={() => navigate('/register')}>Sign Up</button>
                <button type="button" className="bh-footer__link" onClick={() => navigate('/login')}>Login</button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
