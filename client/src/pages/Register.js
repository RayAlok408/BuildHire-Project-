import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Field, Icon, Logo, Segmented, stagger } from '../components';
import './Auth.css';

const API = 'https://buildhire-server.onrender.com';

const FEATURES = ['Post jobs in seconds', 'Workers notified in real time', 'Rate and review workers', 'Safe and trusted platform'];

const ROLES = [
  { value: 'client', label: 'I need workers', icon: 'user' },
  { value: 'worker', label: 'I am a worker', icon: 'wrench' },
];

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
    <div className="bh-auth">
      <aside className="bh-auth__brand bh-on-ink">
        <Logo tone="dark" />
        <div>
          <h1 className="bh-auth__headline bh-rise">
            Connect with skilled workers near you — <span className="bh-auth__accent">instantly</span>
          </h1>
          <ul className="bh-auth__list">
            {FEATURES.map((f, i) => (
              <li key={f} className="bh-rise" style={stagger(i + 1)}>
                <span className="bh-auth__tick"><Icon name="check" size={16} /></span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="bh-auth__main bh-backdrop">
        <Card className="bh-auth__card bh-rise" style={stagger(1)}>
          <h2 className="bh-auth__title">Create your account</h2>
          <p className="bh-auth__sub">
            Already have an account? <button type="button" className="bh-link" onClick={() => navigate('/login')}>Login</button>
          </p>

          <Segmented
            className="bh-auth__roles"
            label="Account type"
            options={ROLES}
            value={form.role}
            onChange={role => setForm({ ...form, role })}
          />

          <div className="bh-auth__form">
            <Field label="Full Name" name="name" autoComplete="name" placeholder="Enter your full name" onChange={handle} />
            <Field label="Email Address" name="email" type="email" autoComplete="email" placeholder="Enter your email" onChange={handle} />
            <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" onChange={handle} />

            {form.role === 'worker' && (
              <Field as="select" label="Your Skill" name="skill" onChange={handle}>
                <option value="">Select your skill</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
              </Field>
            )}

            {msg && <Alert tone={msg.includes('success') ? 'success' : 'error'}>{msg}</Alert>}

            <Button full loading={loading} onClick={submit}>
              {loading ? 'Creating account' : 'Create Account'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default Register;
