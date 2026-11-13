import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Field, Icon, Logo, StatBar, stagger } from '../components';
import './Auth.css';

const API = 'https://buildhire-server.onrender.com';

const BRAND_STATS = [
  { value: '500+', label: 'Workers' },
  { value: '1000+', label: 'Jobs Done' },
  { value: <>4.8<Icon name="star" size={22} /></>, label: 'Avg Rating' },
];

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
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'client') navigate('/client');
      else navigate('/worker');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') submit(); };

  return (
    <div className="bh-auth">
      <aside className="bh-auth__brand bh-on-ink">
        <Logo tone="dark" />
        <div>
          <h1 className="bh-auth__headline bh-rise">
            Your trusted platform for hiring skilled workers <span className="bh-auth__accent">nearby</span>
          </h1>
          <StatBar tone="dark" items={BRAND_STATS} className="bh-rise" style={stagger(1)} />
        </div>
      </aside>

      <main className="bh-auth__main bh-backdrop">
        <Card className="bh-auth__card bh-rise" style={stagger(1)}>
          <h2 className="bh-auth__title">Welcome back</h2>
          <p className="bh-auth__sub">
            Don't have an account? <button type="button" className="bh-link" onClick={() => navigate('/register')}>Sign up free</button>
          </p>

          <div className="bh-auth__form">
            <Field
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handle}
              onKeyDown={handleKey}
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handle}
              onKeyDown={handleKey}
            />

            {msg && <Alert tone="error">{msg}</Alert>}

            <Button full loading={loading} onClick={submit}>
              {loading ? 'Logging in' : 'Login to BuildHire'}
            </Button>

            <div className="bh-divider">or use test account</div>
          </div>

          <div className="bh-test">
            <p className="bh-test__title">Quick login for testing</p>
            <div className="bh-test__row">
              <button type="button" className="bh-test__tile" onClick={() => setForm({ email: 'client@test.com', password: '123456' })}>
                <span className="bh-test__role"><Icon name="user" size={16} />Client</span>
                <span className="bh-test__email">client@test.com</span>
              </button>
              <button type="button" className="bh-test__tile" onClick={() => setForm({ email: 'worker@test.com', password: '123456' })}>
                <span className="bh-test__role"><Icon name="wrench" size={16} />Worker</span>
                <span className="bh-test__email">worker@test.com</span>
              </button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default Login;
