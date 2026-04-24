import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { overflow-x: hidden; }
      .bh-page { font-family: 'DM Sans', sans-serif; background: #fafaf8; color: #1a1a1a; }
      .bh-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 6%; background: rgba(250,250,248,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,0,0,0.06); }
      .bh-logo { display: flex; align-items: center; gap: 0.7rem; cursor: pointer; }
      .bh-logo-mark { width: 40px; height: 40px; background: #1a1a1a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f5f01a; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; }
      .bh-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; color: #1a1a1a; }
      .bh-nav-links { display: flex; gap: 0.8rem; align-items: center; }
      .bh-nav-login { padding: 0.6rem 1.3rem; background: transparent; border: 1.5px solid #d4d4d4; color: #1a1a1a; border-radius: 100px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
      .bh-nav-login:hover { border-color: #1a1a1a; }
      .bh-nav-cta { padding: 0.6rem 1.3rem; background: #1a1a1a; border: none; color: #f5f01a; border-radius: 100px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
      .bh-nav-cta:hover { background: #333; transform: translateY(-1px); }
      .bh-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 8rem 6% 5rem; position: relative; overflow: hidden; }
      .bh-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 20%, #f5f01a22 0%, transparent 70%); pointer-events: none; }
      .bh-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px); background-size: 40px 40px; opacity: 0.4; pointer-events: none; }
      .bh-live-pill { display: inline-flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid #e5e5e5; padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.82rem; font-weight: 500; color: #555; margin-bottom: 2rem; }
      .bh-live-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; animation: livePulse 2s infinite; }
      @keyframes livePulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.3); } }
      .bh-hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(3rem, 7vw, 6rem); font-weight: 800; line-height: 1.05; color: #1a1a1a; margin-bottom: 1.5rem; position: relative; z-index: 1; }
      .bh-hero h1 em { font-style: normal; color: transparent; -webkit-text-stroke: 2px #1a1a1a; }
      .bh-hero h1 .bh-highlight { position: relative; display: inline-block; }
      .bh-hero h1 .bh-highlight::after { content:''; position:absolute; bottom: 4px; left:0; right:0; height:12px; background:#f5f01a; z-index:-1; border-radius:4px; }
      .bh-hero p { font-size: 1.15rem; color: #666; max-width: 500px; line-height: 1.75; margin-bottom: 2.5rem; font-weight: 300; position: relative; z-index: 1; }
      .bh-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; margin-bottom: 4rem; }
      .bh-btn-main { padding: 1rem 2.2rem; background: #1a1a1a; color: #f5f01a; border: none; border-radius: 100px; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
      .bh-btn-main:hover { background: #333; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
      .bh-btn-ghost { padding: 1rem 2.2rem; background: transparent; color: #1a1a1a; border: 1.5px solid #d4d4d4; border-radius: 100px; font-size: 1rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
      .bh-btn-ghost:hover { border-color: #1a1a1a; transform: translateY(-2px); }
      .bh-stats-bar { display: flex; gap: 0; background: #fff; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; position: relative; z-index: 1; }
      .bh-stat-item { padding: 1.2rem 2rem; text-align: center; border-right: 1px solid #e5e5e5; flex: 1; }
      .bh-stat-item:last-child { border-right: none; }
      .bh-stat-num { font-family: 'Syne', sans-serif; font-size: 1.8rem; font-weight: 800; color: #1a1a1a; display: block; }
      .bh-stat-lbl { font-size: 0.78rem; color: #999; margin-top: 0.2rem; display: block; }
      .bh-marquee-wrap { background: #1a1a1a; color: #f5f01a; padding: 1rem 0; overflow: hidden; white-space: nowrap; }
      .bh-marquee { display: inline-block; animation: marquee 20s linear infinite; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.05em; }
      @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .bh-how { padding: 7rem 6%; background: #fafaf8; }
      .bh-section-eyebrow { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 0.8rem; }
      .bh-section-h2 { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #1a1a1a; margin-bottom: 4rem; }
      .bh-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
      .bh-step { background: #fff; border: 1px solid #e5e5e5; border-radius: 24px; padding: 2.5rem 2rem; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
      .bh-step:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      .bh-step-num { font-family: 'Syne', sans-serif; font-size: 4rem; font-weight: 800; color: #f5f01a; line-height: 1; margin-bottom: 1rem; }
      .bh-step-icon { font-size: 2rem; margin-bottom: 1rem; }
      .bh-step h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
      .bh-step p { font-size: 0.88rem; color: #777; line-height: 1.65; }
      .bh-services { padding: 7rem 6%; background: #1a1a1a; }
      .bh-services .bh-section-eyebrow { color: #666; }
      .bh-services .bh-section-h2 { color: #fff; }
      .bh-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
      .bh-service-card { background: #242424; border: 1px solid #333; border-radius: 20px; padding: 1.8rem 1.5rem; cursor: pointer; transition: all 0.2s; }
      .bh-service-card:hover { background: #f5f01a; border-color: #f5f01a; transform: translateY(-4px); }
      .bh-service-card:hover .bh-service-name { color: #1a1a1a; }
      .bh-service-card:hover .bh-service-desc { color: #444; }
      .bh-service-icon { font-size: 2.2rem; margin-bottom: 1rem; }
      .bh-service-name { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.3rem; }
      .bh-service-desc { font-size: 0.8rem; color: #666; line-height: 1.5; }
      .bh-features { padding: 7rem 6%; background: #fff; }
      .bh-features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
      .bh-feature { background: #fafaf8; border: 1px solid #eee; border-radius: 20px; padding: 2rem; }
      .bh-feature-icon { width: 48px; height: 48px; background: #f5f01a; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.2rem; }
      .bh-feature h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
      .bh-feature p { font-size: 0.88rem; color: #777; line-height: 1.65; }
      .bh-cta { padding: 7rem 6%; background: #f5f01a; text-align: center; }
      .bh-cta h2 { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; }
      .bh-cta p { font-size: 1.1rem; color: #555; margin-bottom: 2.5rem; }
      .bh-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
      .bh-cta-btn-dark { padding: 1rem 2.5rem; background: #1a1a1a; color: #f5f01a; border: none; border-radius: 100px; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
      .bh-cta-btn-dark:hover { background: #333; transform: translateY(-2px); }
      .bh-cta-btn-outline { padding: 1rem 2.5rem; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; border-radius: 100px; font-size: 1rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
      .bh-cta-btn-outline:hover { background: #1a1a1a; color: #f5f01a; transform: translateY(-2px); }
      .bh-footer { background: #111; padding: 2.5rem 6%; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
      .bh-footer-left { display: flex; align-items: center; gap: 0.7rem; }
      .bh-footer-logo-mark { width: 32px; height: 32px; background: #f5f01a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.75rem; }
      .bh-footer-logo-text { font-family: 'Syne', sans-serif; font-weight: 700; color: #fff; font-size: 1rem; }
      .bh-footer-right { color: #555; font-size: 0.85rem; }
      .bh-footer-links { display: flex; gap: 1.5rem; margin-top: 0.3rem; }
      .bh-footer-link { color: #555; cursor: pointer; font-size: 0.85rem; transition: color 0.2s; }
      .bh-footer-link:hover { color: #f5f01a; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const marqueeText = '⚡ Real-time notifications &nbsp;&nbsp;&nbsp; 📍 Location based matching &nbsp;&nbsp;&nbsp; ⭐ Verified workers &nbsp;&nbsp;&nbsp; 🗺️ Live map directions &nbsp;&nbsp;&nbsp; 🔒 Secure platform &nbsp;&nbsp;&nbsp; ';

  return (
    <div className="bh-page">
      <nav className="bh-nav">
        <div className="bh-logo">
          <div className="bh-logo-mark">BH</div>
          <span className="bh-logo-text">BuildHire</span>
        </div>
        <div className="bh-nav-links">
          <button className="bh-nav-login" onClick={() => navigate('/login')}>Login</button>
          <button className="bh-nav-cta" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <div className="bh-hero" ref={heroRef}>
        <div className="bh-hero-bg"></div>
        <div className="bh-hero-grid"></div>
        <div className="bh-live-pill">
          <span className="bh-live-dot"></span>
          Workers available near you right now
        </div>
        <h1>
          Your home problem,<br />
          solved <span className="bh-highlight">instantly</span>
        </h1>
        <p>Post a job and nearby skilled workers get notified in real time. No waiting, no calls — fast, reliable service at your doorstep.</p>
        <div className="bh-hero-btns">
          <button className="bh-btn-main" onClick={() => navigate('/register')}>Post a Job Now</button>
          <button className="bh-btn-ghost" onClick={() => navigate('/register')}>Join as Worker →</button>
        </div>
        <div className="bh-stats-bar">
          <div className="bh-stat-item">
            <span className="bh-stat-num">500+</span>
            <span className="bh-stat-lbl">Skilled Workers</span>
          </div>
          <div className="bh-stat-item">
            <span className="bh-stat-num">1000+</span>
            <span className="bh-stat-lbl">Jobs Completed</span>
          </div>
          <div className="bh-stat-item">
            <span className="bh-stat-num">4.8★</span>
            <span className="bh-stat-lbl">Avg Rating</span>
          </div>
          <div className="bh-stat-item">
            <span className="bh-stat-num">10km</span>
            <span className="bh-stat-lbl">Search Radius</span>
          </div>
        </div>
      </div>

      <div className="bh-marquee-wrap">
        <span className="bh-marquee">
          {marqueeText.repeat(4)}
        </span>
      </div>

      <div className="bh-how">
        <div className="bh-section-eyebrow">How it works</div>
        <h2 className="bh-section-h2">Get help in 4 simple steps</h2>
        <div className="bh-steps">
          {[
            { num: '01', icon: '📝', title: 'Post your requirement', desc: 'Describe what you need in seconds. Tap repair, wiring, painting, carpentry — we cover it all.' },
            { num: '02', icon: '📡', title: 'Workers get notified', desc: 'All available skilled workers within 10km receive an instant real-time notification.' },
            { num: '03', icon: '🤝', title: 'Worker accepts & arrives', desc: 'The nearest available worker accepts your job and gets map directions to your location.' },
            { num: '04', icon: '⭐', title: 'Rate the service', desc: 'After completion, rate and review the worker to build community trust.' },
          ].map((s, i) => (
            <div key={i} className="bh-step">
              <div className="bh-step-num">{s.num}</div>
              <div className="bh-step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bh-services">
        <div className="bh-section-eyebrow">Our services</div>
        <h2 className="bh-section-h2">What can we help you with?</h2>
        <div className="bh-services-grid">
          {[
            { icon: '🔧', name: 'Plumber', desc: 'Tap, pipe & drainage repairs' },
            { icon: '⚡', name: 'Electrician', desc: 'Wiring, switches & fittings' },
            { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
            { icon: '🖌️', name: 'Painter', desc: 'Wall & surface painting' },
            { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
            { icon: '➕', name: 'More soon', desc: 'More services coming' },
          ].map((s, i) => (
            <div key={i} className="bh-service-card" onClick={() => navigate('/register')}>
              <div className="bh-service-icon">{s.icon}</div>
              <div className="bh-service-name">{s.name}</div>
              <div className="bh-service-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bh-features">
        <div className="bh-section-eyebrow">Why BuildHire</div>
        <h2 className="bh-section-h2">Built for speed and trust</h2>
        <div className="bh-features-grid">
          {[
            { icon: '⚡', title: 'Real-time matching', desc: 'Workers get notified the moment you post. No delays, no waiting around.' },
            { icon: '📍', title: 'Location based', desc: 'Only workers within 10km are notified — guaranteed fast arrival.' },
            { icon: '🔒', title: 'Secure platform', desc: 'JWT authentication and encrypted passwords keep your account safe.' },
            { icon: '⭐', title: 'Ratings & reviews', desc: 'Every worker has a public rating so you always know who you are hiring.' },
            { icon: '🗺️', title: 'Live map directions', desc: 'Workers get Google Maps directions to your location instantly on acceptance.' },
            { icon: '📱', title: 'Any device', desc: 'Use BuildHire on your phone, tablet or computer — fully responsive.' },
          ].map((f, i) => (
            <div key={i} className="bh-feature">
              <div className="bh-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bh-cta">
        <h2>Start using BuildHire today</h2>
        <p>Join thousands of clients and workers — it is completely free to get started</p>
        <div className="bh-cta-btns">
          <button className="bh-cta-btn-dark" onClick={() => navigate('/register')}>Post a Job</button>
          <button className="bh-cta-btn-outline" onClick={() => navigate('/register')}>Become a Worker</button>
        </div>
      </div>

      <footer className="bh-footer">
        <div className="bh-footer-left">
          <div className="bh-footer-logo-mark">BH</div>
          <span className="bh-footer-logo-text">BuildHire</span>
        </div>
        <div className="bh-footer-right">
          <div>© 2026 BuildHire. All rights reserved.</div>
          <div className="bh-footer-links">
            <span className="bh-footer-link" onClick={() => navigate('/register')}>Sign Up</span>
            <span className="bh-footer-link" onClick={() => navigate('/login')}>Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;