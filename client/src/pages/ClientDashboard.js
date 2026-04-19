import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';

function ClientDashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', skill: '' });
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('post');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/myjobs`, { headers });
      setJobs(res.data);
    } catch (err) { console.log(err); }
  };

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const postJob = async () => {
    if (!form.title || !form.description || !form.skill) {
      setMsg('fill'); return;
    }
    try {
      setLoading(true);
      await axios.post(`${API}/api/jobs/create`, {
        ...form, coordinates: [75.8573, 30.9010]
      }, { headers });
      setMsg('success');
      setForm({ title: '', description: '', skill: '' });
      fetchJobs();
      setTimeout(() => { setMsg(''); setActiveTab('jobs'); }, 1500);
    } catch (err) {
      setMsg('error');
    } finally { setLoading(false); }
  };

  const completeJob = async (id) => {
    await axios.put(`${API}/api/jobs/complete/${id}`, { rating: 5, review: 'Great work!' }, { headers });
    fetchJobs();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const statusColor = (s) => s === 'open' ? '#f59e0b' : s === 'accepted' ? '#2563eb' : '#16a34a';
  const statusBg = (s) => s === 'open' ? '#fef3c7' : s === 'accepted' ? '#dbeafe' : '#dcfce7';

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>BuildHire</span>
        <div style={styles.navRight}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={styles.navName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.welcomeBar}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome, {user?.name}!</h2>
            <p style={styles.welcomeSub}>Post a job and get skilled workers at your doorstep</p>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{jobs.length}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{jobs.filter(j => j.status === 'open').length}</span>
              <span style={styles.statLabel}>Open</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{jobs.filter(j => j.status === 'completed').length}</span>
              <span style={styles.statLabel}>Done</span>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button style={activeTab === 'post' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('post')}>Post a Job</button>
          <button style={activeTab === 'jobs' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('jobs')}>
            My Jobs {jobs.length > 0 && <span style={styles.tabBadge}>{jobs.length}</span>}
          </button>
        </div>

        {activeTab === 'post' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Post a New Job</h3>
            <p style={styles.cardSub}>Nearby workers will be notified instantly</p>
            <div style={styles.field}>
              <label style={styles.label}>Job Title</label>
              <input style={styles.input} name="title" placeholder="e.g. Fix my tap, Paint my room" value={form.title} onChange={handle} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} name="description" placeholder="Describe the problem in detail..." value={form.description} onChange={handle} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Skill Needed</label>
              <select style={styles.input} name="skill" value={form.skill} onChange={handle}>
                <option value="">Select skill needed</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
              </select>
            </div>
            {msg === 'success' && <div style={styles.successMsg}>Job posted! Nearby workers are being notified.</div>}
            {msg === 'error' && <div style={styles.errorMsg}>Something went wrong. Try again.</div>}
            {msg === 'fill' && <div style={styles.errorMsg}>Please fill all fields.</div>}
            <button style={styles.btn} onClick={postJob} disabled={loading}>
              {loading ? 'Posting...' : 'Post Job — Notify Nearby Workers'}
            </button>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            {jobs.length === 0 && (
              <div style={styles.emptyBox}>
                <p style={{ fontSize: '2.5rem', margin: 0 }}>📋</p>
                <p style={{ color: '#64748b', margin: '0.5rem 0 1rem' }}>No jobs posted yet</p>
                <button style={{ ...styles.btn, width: 'auto', padding: '0.7rem 1.5rem' }} onClick={() => setActiveTab('post')}>Post Your First Job</button>
              </div>
            )}
            {jobs.map(job => (
              <div key={job._id} style={styles.jobCard}>
                <div style={styles.jobTop}>
                  <div>
                    <p style={styles.jobTitle}>{job.title}</p>
                    <p style={styles.jobSkill}>{job.skill}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, background: statusBg(job.status), color: statusColor(job.status) }}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
                <p style={styles.jobDesc}>{job.description}</p>
                {job.worker && (
                  <div style={styles.workerInfo}>
                    <div style={styles.workerAvatar}>{job.worker.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <p style={styles.workerName}>Worker: {job.worker.name}</p>
                      <p style={styles.workerRating}>Rating: {job.worker.rating ? job.worker.rating.toFixed(1) : 'New'} ★</p>
                    </div>
                  </div>
                )}
                {job.status === 'accepted' && (
                  <button style={styles.completeBtn} onClick={() => completeJob(job._id)}>Mark Complete & Rate Worker</button>
                )}
                {job.status === 'completed' && (
                  <div style={styles.completedTag}>Job completed successfully!</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8faff', fontFamily: 'sans-serif' },
  nav: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.4rem', fontWeight: '800', color: '#2563eb' },
  navRight: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  avatar: { width: '36px', height: '36px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.9rem' },
  navName: { fontSize: '0.95rem', color: '#374151', fontWeight: '500' },
  logoutBtn: { padding: '0.4rem 1rem', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem' },
  container: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' },
  welcomeBar: { background: '#2563eb', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  welcomeTitle: { color: '#fff', margin: 0, fontSize: '1.3rem', fontWeight: '700' },
  welcomeSub: { color: 'rgba(255,255,255,0.75)', margin: '0.3rem 0 0', fontSize: '0.9rem' },
  statsRow: { display: 'flex', gap: '1rem' },
  statBox: { background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.7rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { color: '#fff', fontSize: '1.5rem', fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' },
  tabs: { display: 'flex', background: '#fff', borderRadius: '12px', padding: '4px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' },
  tab: { flex: 1, padding: '0.7rem', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '0.95rem', fontWeight: '500' },
  tabActive: { flex: 1, padding: '0.7rem', background: '#2563eb', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.95rem', fontWeight: '600' },
  tabBadge: { background: '#ef4444', color: '#fff', borderRadius: '20px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', marginLeft: '0.4rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb' },
  cardTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.3rem' },
  cardSub: { fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' },
  successMsg: { background: '#dcfce7', color: '#16a34a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' },
  errorMsg: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' },
  btn: { width: '100%', padding: '0.9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  emptyBox: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '3rem', textAlign: 'center' },
  jobCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem' },
  jobTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  jobTitle: { fontWeight: '700', fontSize: '1rem', color: '#1e293b', margin: 0 },
  jobSkill: { fontSize: '0.85rem', color: '#2563eb', margin: '0.2rem 0 0', fontWeight: '500' },
  statusBadge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
  jobDesc: { fontSize: '0.9rem', color: '#64748b', margin: '0.5rem 0 1rem' },
  workerInfo: { display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#f8faff', padding: '0.8rem', borderRadius: '10px', marginBottom: '1rem' },
  workerAvatar: { width: '36px', height: '36px', background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', flexShrink: 0 },
  workerName: { margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
  workerRating: { margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#f59e0b' },
  completeBtn: { width: '100%', padding: '0.8rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
  completedTag: { background: '#dcfce7', color: '#16a34a', padding: '0.6rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600' }
};

export default ClientDashboard;