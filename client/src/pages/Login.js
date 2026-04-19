import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://buildhire-server.onrender.com';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.email || !form.password) {
      setMsg('Please enter email and password'); return;
    }
    try {
      setLoading(true);
      localStorage.clear();
      const res = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'client') navigate('/client');
      else navigate('/worker');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') submit(); };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <h1 style={styles.brand}>BuildHire</h1>
        <p style={styles.tagline}>Your trusted platform for hiring skilled workers nearby</p>
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>500+</span>
            <span style={styles.statLabel}>Workers</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>1000+</span>
            <span style={styles.statLabel}>Jobs Done</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNum}>4.8★</span>
            <span style={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>BH</div>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Don't have an account? <span style={styles.link} onClick={() => navigate('/register')}>Sign up free</span></p>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handle} onKeyDown={handleKey} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handle} onKeyDown={handleKey} />
          </div>

          {msg && <div style={styles.errorBox}>{msg}</div>}

          <button style={styles.btn} onClick={submit} disabled={loading}>
            {loading ? 'Logging in...' : 'Login to BuildHire'}
          </button>

          <div style={styles.divider}>or use test account</div>

          <div style={styles.testAccounts}>
            <p style={styles.testTitle}>Quick login for testing</p>
            <div style={styles.testRow}>
              <div style={styles.testCard} onClick={() => setForm({ email: 'client@test.com', password: '123456' })}>
                <span style={styles.testRole}>Client</span>
                <span style={styles.testEmail}>client@test.com</span>
              </div>
              <div style={styles.testCard} onClick={() => setForm({ email: 'worker@test.com', password: '123456' })}>
                <span style={styles.testRole}>Worker</span>
                <span style={styles.testEmail}>worker@test.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  left: { flex: 1, background: '#1e40af', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' },
  brand: { fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem' },
  tagline: { fontSize: '1.1rem', opacity: 0.85, margin: '0 0 3rem', lineHeight: 1.6, maxWidth: '320px' },
  statsRow: { display: 'flex', gap: '2rem' },
  stat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  statNum: { fontSize: '1.8rem', fontWeight: '800' },
  statLabel: { fontSize: '0.85rem', opacity: 0.75 },
  right: { flex: 1, background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', width: '100%', maxWidth: '400px' },
  iconCircle: { width: '48px', height: '48px', background: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1rem', marginBottom: '1.2rem' },
  title: { fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.8rem' },
  link: { color: '#2563eb', cursor: 'pointer', fontWeight: '600' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', boxSizing: 'border-box' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' },
  btn: { width: '100%', padding: '0.9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700', marginBottom: '1.2rem' },
  divider: { textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1rem' },
  testAccounts: { background: '#f8faff', borderRadius: '10px', padding: '1rem', border: '1px solid #e5e7eb' },
  testTitle: { fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  testRow: { display: 'flex', gap: '0.8rem' },
  testCard: { flex: 1, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.7rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  testRole: { fontSize: '0.75rem', color: '#2563eb', fontWeight: '700' },
  testEmail: { fontSize: '0.75rem', color: '#64748b' },
};

export default Login;