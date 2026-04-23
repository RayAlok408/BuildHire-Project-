import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.logoIcon}>B</div>
          <span style={styles.logoText}>BuildHire</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/login')}>Login</button>
          <button style={styles.navBtnFill} onClick={() => navigate('/register')}>Sign Up Free</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <div style={styles.heroBadge}>
          <span style={styles.badgeDot}></span>
          Live — Workers available near you
        </div>
        <h1 style={styles.heroTitle}>
          Hire skilled workers<br />
          <span style={styles.heroTitleBlue}>instantly, like Ola</span>
        </h1>
        <p style={styles.heroSub}>
          Post a job in seconds. Nearby plumbers, electricians, carpenters get notified in real time and come to you.
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
        </div>
      </div>

      <div style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How BuildHire works</h2>
        <p style={styles.sectionSub}>Get a skilled worker at your door in minutes</p>
        <div style={styles.steps}>
          {[
            { num: '1', icon: '📝', title: 'Post your job', desc: 'Describe what you need — tap repair, wiring, painting, carpentry and more.' },
            { num: '2', icon: '📡', title: 'Workers notified', desc: 'All available workers within 10km get an instant real-time notification.' },
            { num: '3', icon: '✅', title: 'Worker accepts', desc: 'The first available worker accepts and heads to your location.' },
            { num: '4', icon: '⭐', title: 'Rate the service', desc: 'After the job is done, rate and review to build community trust.' },
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

      <div style={styles.skillsSection}>
        <h2 style={styles.sectionTitle}>Available services</h2>
        <div style={styles.skillsGrid}>
          {[
            { icon: '🔧', name: 'Plumber', desc: 'Tap, pipe & drainage repairs' },
            { icon: '⚡', name: 'Electrician', desc: 'Wiring, switches & fittings' },
            { icon: '🪚', name: 'Carpenter', desc: 'Furniture & woodwork' },
            { icon: '🖌️', name: 'Painter', desc: 'Wall & surface painting' },
            { icon: '🧹', name: 'Cleaner', desc: 'Home & office cleaning' },
            { icon: '🔨', name: 'More coming', desc: 'More services soon' },
          ].map((s, i) => (
            <div key={i} style={styles.skillCard} onClick={() => navigate('/register')}>
              <div style={styles.skillIcon}>{s.icon}</div>
              <h3 style={styles.skillName}>{s.name}</h3>
              <p style={styles.skillDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to get started?</h2>
        <p style={styles.ctaSub}>Join thousands of clients and workers on BuildHire</p>
        <div style={styles.ctaButtons}>
          <button style={styles.ctaBtnWhite} onClick={() => navigate('/register')}>Post a Job</button>
          <button style={styles.ctaBtnOutline} onClick={() => navigate('/register')}>Become a Worker</button>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerLogo}>
          <div style={{ ...styles.logoIcon, width: '28px', height: '28px', fontSize: '0.8rem' }}>B</div>
          <span style={{ ...styles.logoText, fontSize: '1rem' }}>BuildHire</span>
        </div>
        <p style={styles.footerText}>© 2026 BuildHire — Connecting clients with skilled workers</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#ffffff', fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: '#fff', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoIcon: { width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1rem' },
  logoText: { fontSize: '1.3rem', fontWeight: '800', color: '#1e293b' },
  navLinks: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  navBtn: { padding: '0.5rem 1.2rem', background: 'transparent', border: '1.5px solid #e2e8f0', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' },
  navBtnFill: { padding: '0.5rem 1.2rem', background: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' },
  hero: { padding: '5rem 5% 4rem', textAlign: 'center', background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#16a34a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' },
  badgeDot: { width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' },
  heroTitle: { fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1rem', lineHeight: 1.15 },
  heroTitleBlue: { color: '#2563eb' },
  heroSub: { fontSize: '1.1rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.7 },
  heroButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' },
  btnPrimary: { padding: '0.9rem 2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  btnOutline: { padding: '0.9rem 2rem', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  heroStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroStatNum: { fontSize: '1.8rem', fontWeight: '800', color: '#1e293b' },
  heroStatLabel: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' },
  heroStatDivider: { width: '1px', height: '40px', background: '#e2e8f0' },
  howSection: { padding: '5rem 5%', background: '#fff', textAlign: 'center' },
  sectionTitle: { fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem' },
  sectionSub: { fontSize: '1rem', color: '#64748b', margin: '0 0 3rem' },
  steps: { display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' },
  stepCard: { background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem 1.5rem', width: '200px', textAlign: 'center', position: 'relative' },
  stepNum: { position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700' },
  stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  stepTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' },
  stepDesc: { fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 },
  skillsSection: { padding: '5rem 5%', background: '#f8faff', textAlign: 'center' },
  skillsGrid: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' },
  skillCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', width: '160px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
  skillIcon: { fontSize: '2rem', marginBottom: '0.8rem' },
  skillName: { fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' },
  skillDesc: { fontSize: '0.8rem', color: '#94a3b8', margin: 0 },
  ctaSection: { padding: '5rem 5%', background: '#2563eb', textAlign: 'center' },
  ctaTitle: { fontSize: '2.2rem', fontWeight: '800', color: '#fff', margin: '0 0 0.8rem' },
  ctaSub: { fontSize: '1rem', color: 'rgba(255,255,255,0.8)', margin: '0 0 2rem' },
  ctaButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnWhite: { padding: '0.9rem 2rem', background: '#fff', color: '#2563eb', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  ctaBtnOutline: { padding: '0.9rem 2rem', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  footer: { padding: '2rem 5%', background: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  footerText: { color: '#64748b', fontSize: '0.85rem', margin: 0 },
};

export default Home;