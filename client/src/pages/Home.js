import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>BH</div>
          <span style={styles.logoText}>BuildHire</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/login')}>Login</button>
          <button style={styles.navBtnFill} onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.badgeDot}></span>
          Workers available near you right now
        </div>
        <h1 style={styles.heroTitle}>
          Your home problem,<br />
          <span style={styles.heroTitleBlue}>solved in minutes</span>
        </h1>
        <p style={styles.heroSub}>
          Post a job and skilled workers near you get notified instantly. No waiting, no calls — just fast, reliable service at your doorstep.
        </p>
        <div style={styles.heroButtons}>
          <button style={styles.btnPrimary} onClick={() => navigate('/register')}>
            Post a Job Now
          </button>
          <button style={styles.btnOutline} onClick={() => navigate('/register')}>
            Join as Worker
          </button>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <span style={styles.heroStatNum}>500+</span>
            <span style={styles.heroStatLabel}>Skilled Workers</span>
          </div>
          <div style={styles.heroStatDivider}></div>
          <div style={styles.heroStat}>
            <span style={styles.heroStatNum}>1000+</span>
            <span style={styles.heroStatLabel}>Jobs Completed</span>
          </div>
          <div style={styles.heroStatDivider}></div>
          <div style={styles.heroStat}>
            <span style={styles.heroStatNum}>4.8★</span>
            <span style={styles.heroStatLabel}>Average Rating</span>
          </div>
          <div style={styles.heroStatDivider}></div>
          <div style={styles.heroStat}>
            <span style={styles.heroStatNum}>10km</span>
            <span style={styles.heroStatLabel}>Search Radius</span>
          </div>
        </div>
      </div>

      <div style={styles.howSection}>
        <div style={styles.sectionTag}>How it works</div>
        <h2 style={styles.sectionTitle}>Get help in 4 simple steps</h2>
        <p style={styles.sectionSub}>From posting to completion — fast, simple and reliable</p>
        <div style={styles.steps}>
          {[
            { num: '1', icon: '📝', title: 'Post your requirement', desc: 'Describe what you need — tap repair, wiring, painting, carpentry and more. Takes less than a minute.' },
            { num: '2', icon: '📡', title: 'Instant notifications', desc: 'All available workers within 10km receive a real-time alert on their phone immediately.' },
            { num: '3', icon: '🤝', title: 'Worker accepts', desc: 'The nearest available worker accepts your job and heads to your location with directions.' },
            { num: '4', icon: '⭐', title: 'Rate the service', desc: 'After the job is done, rate and review to help others choose trusted workers.' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.num}</div>
              <div style={styles.stepIcon}>{s.icon}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.featuresSection}>
        <div style={styles.sectionTag}>Why BuildHire</div>
        <h2 style={styles.sectionTitle}>Built for speed and trust</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: '⚡', title: 'Real-time matching', desc: 'Workers get notified the moment you post. No delays, no waiting.' },
            { icon: '📍', title: 'Location based', desc: 'Only workers within 10km of you are notified — guaranteed fast arrival.' },
            { icon: '🔒', title: 'Secure login', desc: 'Your account is protected with JWT authentication and encrypted passwords.' },
            { icon: '⭐', title: 'Ratings & reviews', desc: 'Every worker has a public rating so you always know who you are hiring.' },
            { icon: '🗺️', title: 'Live map directions', desc: 'Workers get Google Maps directions to your location the moment they accept.' },
            { icon: '📱', title: 'Works on any device', desc: 'Use BuildHire on your phone, tablet or computer — fully responsive.' },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.skillsSection}>
        <div style={styles.sectionTag}>Services</div>
        <h2 style={styles.sectionTitle}>What can we help you with?</h2>
        <div style={styles.skillsGrid}>
          {[
            { icon: '🔧', name: 'Plumber', desc: 'Tap, pipe & drainage repairs' },
            { icon: '⚡', name: 'Electrician', desc: 'Wiring, switches & fittings' },
            { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
            { icon: '🖌️', name: 'Painter', desc: 'Wall & surface painting' },
            { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
            { icon: '➕', name: 'More soon', desc: 'More services coming' },
          ].map((s, i) => (
            <div key={i} style={styles.skillCard} onClick={() => navigate('/register')}>
              <div style={styles.skillIcon}>{s.icon}</div>
              <h3 style={styles.skillName}>{s.name}</h3>
              <p style={styles.skillDesc}>{s.desc}</p>
              <span style={styles.skillArrow}>→</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to get started?</h2>
          <p style={styles.ctaSub}>Join thousands of clients and skilled workers on BuildHire today</p>
          <div style={styles.ctaButtons}>
            <button style={styles.ctaBtnWhite} onClick={() => navigate('/register')}>Post a Job</button>
            <button style={styles.ctaBtnOutline} onClick={() => navigate('/register')}>Become a Worker</button>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.navLogo}>
            <div style={{ ...styles.logoIcon, width: '32px', height: '32px', fontSize: '0.75rem' }}>BH</div>
            <span style={{ ...styles.logoText, color: '#fff' }}>BuildHire</span>
          </div>
          <p style={styles.footerTagline}>Connecting clients with skilled workers</p>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerText}>© 2026 BuildHire. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate('/register')}>Sign Up</span>
            <span style={styles.footerLink} onClick={() => navigate('/login')}>Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#ffffff', fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 6%', background: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoIcon: { width: '38px', height: '38px', background: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.75rem' },
  logoText: { fontSize: '1.3rem', fontWeight: '800', color: '#1e293b' },
  navLinks: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  navBtn: { padding: '0.5rem 1.2rem', background: 'transparent', border: '1.5px solid #e2e8f0', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
  navBtnFill: { padding: '0.5rem 1.2rem', background: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  hero: { padding: '6rem 6% 5rem', textAlign: 'center', background: 'linear-gradient(160deg, #eff6ff 0%, #f8faff 60%, #ffffff 100%)' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#16a34a', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.8rem' },
  badgeDot: { width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' },
  heroTitle: { fontSize: '3.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1.2rem', lineHeight: 1.15 },
  heroTitleBlue: { color: '#2563eb' },
  heroSub: { fontSize: '1.15rem', color: '#64748b', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.75 },
  heroButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' },
  btnPrimary: { padding: '1rem 2.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' },
  btnOutline: { padding: '1rem 2.2rem', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  heroStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', background: '#fff', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroStatNum: { fontSize: '1.6rem', fontWeight: '800', color: '#1e293b' },
  heroStatLabel: { fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' },
  heroStatDivider: { width: '1px', height: '36px', background: '#e2e8f0' },
  howSection: { padding: '6rem 6%', background: '#fff', textAlign: 'center' },
  sectionTag: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  sectionTitle: { fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem' },
  sectionSub: { fontSize: '1rem', color: '#64748b', margin: '0 0 3rem' },
  steps: { display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' },
  stepCard: { background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2.5rem 1.5rem 2rem', width: '220px', textAlign: 'center', position: 'relative' },
  stepNum: { position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '800' },
  stepIcon: { fontSize: '2.8rem', marginBottom: '1rem' },
  stepTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' },
  stepDesc: { fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.6 },
  featuresSection: { padding: '6rem 6%', background: '#f8faff', textAlign: 'center' },
  featuresGrid: { display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' },
  featureCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.8rem', width: '240px', textAlign: 'left' },
  featureIcon: { fontSize: '2rem', marginBottom: '1rem' },
  featureTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' },
  featureDesc: { fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.6 },
  skillsSection: { padding: '6rem 6%', background: '#fff', textAlign: 'center' },
  skillsGrid: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' },
  skillCard: { background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', width: '160px', textAlign: 'center', cursor: 'pointer', position: 'relative' },
  skillIcon: { fontSize: '2.2rem', marginBottom: '0.8rem' },
  skillName: { fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' },
  skillDesc: { fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.8rem' },
  skillArrow: { fontSize: '0.85rem', color: '#2563eb', fontWeight: '700' },
  ctaSection: { padding: '6rem 6%', background: '#0f172a' },
  ctaInner: { maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
  ctaTitle: { fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '0 0 1rem' },
  ctaSub: { fontSize: '1rem', color: '#94a3b8', margin: '0 0 2.5rem', lineHeight: 1.7 },
  ctaButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnWhite: { padding: '1rem 2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  ctaBtnOutline: { padding: '1rem 2rem', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  footer: { background: '#0f172a', borderTop: '1px solid #1e293b', padding: '2rem 6%' },
  footerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem' },
  footerTagline: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
  footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  footerText: { color: '#475569', fontSize: '0.85rem', margin: 0 },
  footerLinks: { display: 'flex', gap: '1.5rem' },
  footerLink: { color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' },
};

export default Home;