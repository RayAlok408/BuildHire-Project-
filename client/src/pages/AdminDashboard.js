import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://buildhire-server.onrender.com';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/users?page=1&limit=50`, { headers });
      setUsers(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load users');
    }
  };

  const loadJobs = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/jobs?page=1&limit=50`, { headers });
      setJobs(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load jobs');
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') return;
    if (tab === 'users') loadUsers();
    else loadJobs();
  }, [tab, user?.role]);

  const updateUser = async (id, body, successMessage) => {
    setLoading(true);
    try {
      const endpoint = body.blocked === undefined
        ? `/api/admin/workers/${id}/approval`
        : `/api/admin/users/${id}/block`;
      await axios.patch(`${API}${endpoint}`, body, { headers });
      setMessage(successMessage);
      await loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin action failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>BuildHire Admin</span>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </nav>
      <main style={styles.container}>
        <div style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>CONTROL CENTER</p>
            <h1 style={styles.title}>Platform overview</h1>
            <p style={styles.subtitle}>Manage accounts, workers and service requests.</p>
          </div>
          <div style={styles.stat}>{tab === 'users' ? users.length : jobs.length}<span> loaded</span></div>
        </div>
        <div style={styles.tabs}>
          <button style={tab === 'users' ? styles.activeTab : styles.tab} onClick={() => setTab('users')}>Users</button>
          <button style={tab === 'jobs' ? styles.activeTab : styles.tab} onClick={() => setTab('jobs')}>Jobs</button>
        </div>
        {message && <div style={styles.message}>{message}</div>}
        {tab === 'users' ? (
          <section style={styles.list}>
            {users.map(account => (
              <article key={account._id} style={styles.row}>
                <div style={styles.identity}>
                  <div style={styles.avatar}>{account.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <strong style={styles.name}>{account.name}</strong>
                    <div style={styles.meta}>{account.email} · {account.role}</div>
                  </div>
                </div>
                <div style={styles.actions}>
                  <span style={{ ...styles.badge, background: account.blocked ? '#fee2e2' : '#dcfce7', color: account.blocked ? '#b91c1c' : '#166534' }}>
                    {account.blocked ? 'Blocked' : 'Active'}
                  </span>
                  {account.role === 'worker' && (
                    <button disabled={loading} style={styles.secondaryButton} onClick={() => updateUser(account._id, { approved: !account.approved }, account.approved ? 'Worker rejected' : 'Worker approved')}>
                      {account.approved ? 'Reject worker' : 'Approve worker'}
                    </button>
                  )}
                  <button disabled={loading} style={account.blocked ? styles.successButton : styles.dangerButton} onClick={() => updateUser(account._id, { blocked: !account.blocked }, account.blocked ? 'User unblocked' : 'User blocked')}>
                    {account.blocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section style={styles.list}>
            {jobs.map(job => (
              <article key={job._id} style={styles.row}>
                <div>
                  <strong style={styles.name}>{job.title}</strong>
                  <div style={styles.meta}>{job.skill} · Client: {job.client?.name || 'Unknown'} · Worker: {job.worker?.name || 'Unassigned'}</div>
                </div>
                <span style={styles.jobStatus}>{job.status}</span>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0b132b', color: '#f8fafc', fontFamily: 'sans-serif' },
  nav: { padding: '1.2rem 6%', borderBottom: '1px solid #25304d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#f5d547', fontSize: '1.25rem', fontWeight: '800' },
  logout: { background: 'transparent', border: '1px solid #52617d', color: '#f8fafc', borderRadius: '8px', padding: '0.55rem 1rem', cursor: 'pointer' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' },
  hero: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'end', marginBottom: '2rem' },
  eyebrow: { color: '#f5d547', letterSpacing: '0.14em', fontSize: '0.72rem', fontWeight: '800', margin: 0 },
  title: { fontSize: '2.2rem', margin: '0.4rem 0', color: '#fff' },
  subtitle: { color: '#aab4ca', margin: 0 },
  stat: { color: '#f5d547', fontSize: '2rem', fontWeight: '800' },
  tabs: { display: 'flex', gap: '0.5rem', borderBottom: '1px solid #25304d', marginBottom: '1rem' },
  tab: { background: 'transparent', border: 0, color: '#aab4ca', padding: '0.8rem 1.2rem', cursor: 'pointer', fontSize: '1rem' },
  activeTab: { background: '#f5d547', border: 0, color: '#0b132b', padding: '0.8rem 1.2rem', cursor: 'pointer', fontWeight: '800', borderRadius: '8px 8px 0 0' },
  message: { background: '#17213c', color: '#f5d547', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  list: { display: 'grid', gap: '0.8rem' },
  row: { background: '#121d38', border: '1px solid #25304d', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  identity: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', background: '#f5d547', color: '#0b132b', display: 'grid', placeItems: 'center', fontWeight: '800' },
  name: { color: '#fff' },
  meta: { color: '#aab4ca', fontSize: '0.85rem', marginTop: '0.25rem' },
  actions: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  badge: { borderRadius: '999px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: '700' },
  secondaryButton: { background: '#f5d547', border: 0, color: '#0b132b', borderRadius: '7px', padding: '0.5rem 0.7rem', cursor: 'pointer' },
  dangerButton: { background: '#dc2626', border: 0, color: '#fff', borderRadius: '7px', padding: '0.5rem 0.7rem', cursor: 'pointer' },
  successButton: { background: '#16a34a', border: 0, color: '#fff', borderRadius: '7px', padding: '0.5rem 0.7rem', cursor: 'pointer' },
  jobStatus: { color: '#f5d547', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800' }
};

export default AdminDashboard;
