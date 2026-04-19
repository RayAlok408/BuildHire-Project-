import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://buildhire-server.onrender.com';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', skill: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setMsg('Please fill all fields'); return;
    }
    try {
      setLoading(true);
      const coords = [75.8573, 30.9010];
      await axios.post(`${API}/api/auth/register`, { ...form, coordinates: coords });
      setMsg('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <h1 style={styles.brand}>BuildHire</h1>
        <p style={styles.tagline}>Connect with skilled workers near you — instantly</p>
        <div style={styles.features}>
          {['Post jobs in seconds', 'Workers notified in real time', 'Rate and review workers', 'Safe and trusted platform'].map((f, i) => (
            <div key={i} style={styles.feature}>
              <span style={styles.tick}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Already have an account? <span style={styles.link} onClick={() => navigate('/login')}>Login</span></p>

          <div style={styles.roleToggle}>
            <button
              style={form.role === 'client' ? styles.roleActive : styles.roleInactive}
              onClick={() => setForm({ ...form, role: 'client' })}>
              I need workers
            </button>
            <button
              style={form.role === 'worker' ? styles.roleActive : styles.roleInactive}
              onClick={() => setForm({ ...form, role: 'worker' })}>
              I am a worker
            </button>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="name" placeholder="Enter your full name" onChange={handle} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input style={styles.input} name="email" type="email" placeholder="Enter your email" onChange={handle} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} name="password" type="password" placeholder="Create a password" onChange={handle} />
          </div>

          {form.role === 'worker' && (
            <div style={styles.field}>
              <label style={styles.label}>Your Skill</label>
              <select style={styles.input} name="skill" onChange={handle}>
                <option value="">Select your skill</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
              </select>
            </div>
          )}

          {msg && (
            <div style={{ ...styles.msgBox, background: msg.includes('success') ? '#dcfce7' : '#fee2e2', color: msg.includes('success') ? '#16a34a' : '#dc2626' }}>
              {msg}
            </div>
          )}

          <button style={styles.btn} onClick={submit} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' },
  left: { flex: 1, background: '#2563eb', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' },
  brand: { fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem' },
  tagline: { fontSize: '1.1rem', opacity: 0.85, margin: '0 0 2.5rem', lineHeight: 1.6 },
  features: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  feature: { fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.9 },
  tick: { background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 },
  right: { flex: 1, background: '#f8faff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' },
  link: { color: '#2563eb', cursor: 'pointer', fontWeight: '600' },
  roleToggle: { display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' },
  roleActive: { flex: 1, padding: '0.6rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  roleInactive: { flex: 1, padding: '0.6rem', background: 'transparent', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  msgBox: { padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' },
  btn: { width: '100%', padding: '0.9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
};

export default Register;