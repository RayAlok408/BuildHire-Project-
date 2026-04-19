import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>BuildHire</span>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/login')}>Login</button>
          <button style={styles.navBtnFill} onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </nav>
      <div style={styles.hero}>
        <div style={styles.badge}>Ola/Uber model for skilled workers</div>
        <h1 style={styles.heroTitle}>Find skilled workers near you instantly</h1>
        <p style={styles.heroSub}>Post a job, get notified workers accept in real time.</p>
        <div style={styles.heroButtons}>
          <button style={styles.btnPrimary} onClick={() => navigate('/register')}>Get Started Free</button>
          <button style={styles.btnSecondary} onClick={() => navigate('/login')}>I have an account</button>
        </div>
      </div>
      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📋</div>
          <h3 style={styles.cardTitle}>Post a Job</h3>
          <p style={styles.cardDesc}>Describe what you need — tap repair, wiring, painting.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📍</div>
          <h3 style={styles.cardTitle}>Workers Notified</h3>
          <p style={styles.cardDesc}>Workers within 10km get instant real-time notifications.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>✅</div>
          <h3 style={styles.cardTitle}>Worker Accepts</h3>
          <p style={styles.cardDesc}>First available worker accepts and comes to you.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>⭐</div>
          <h3 style={styles.cardTitle}>Rate and Review</h3>
          <p style={styles.cardDesc}>Rate the worker to build trust in the community.</p>
        </div>
      </div>
      <div style={styles.footer}>
        <p style={{ margin: 0, color: '#888' }}>BuildHire 2026 — Connecting clients with skilled workers</p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8faff', fontFamily: 'sans-serif' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e5e7eb' },
  logo: { fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' },
  navLinks: { display: 'flex', gap: '0.8rem' },
  navBtn: { padding: '0.5rem 1.2rem', background: 'transparent', border: '1px solid #2563eb', color: '#2563eb', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  navBtnFill: { padding: '0.5rem 1.2rem', background: '#2563eb', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  hero: { textAlign: 'center', padding: '5rem 2rem 3rem' },
  badge: { display: 'inline-block', background: '#dbeafe', color: '#1d4ed8', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1.5rem' },
  heroTitle: { fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 1rem', lineHeight: 1.2 },
  heroSub: { fontSize: '1.1rem', color: '#64748b', maxWidth: '500px', margin: '0 auto 2rem' },
  heroButtons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { padding: '0.9rem 2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
  btnSecondary: { padding: '0.9rem 2rem', background: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
  cards: { display: 'flex', gap: '1.5rem', padding: '2rem', justifyContent: 'center', flexWrap: 'wrap' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', width: '200px', textAlign: 'center' },
  cardIcon: { fontSize: '2rem', marginBottom: '0.8rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem' },
  cardDesc: { fontSize: '0.85rem', color: '#64748b', margin: 0 },
  footer: { textAlign: 'center', padding: '2rem', borderTop: '1px solid #e5e7eb', marginTop: '2rem' }
};

export default Home;