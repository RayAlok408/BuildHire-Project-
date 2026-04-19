import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000';
const socket = io(API);

function WorkerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [acceptedJob, setAcceptedJob] = useState(null);
  const [msg, setMsg] = useState('');
  const [available, setAvailable] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchJobs();
    socket.on(`job_for_${user?.id}`, (newJob) => {
      setMsg(`New job nearby: ${newJob.title}`);
      fetchJobs();
      setTimeout(() => setMsg(''), 5000);
    });
    return () => socket.off(`job_for_${user?.id}`);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/open`, { headers });
      setJobs(res.data);
    } catch (err) { console.log(err); }
  };

  const acceptJob = async (job) => {
    await axios.put(`${API}/api/jobs/accept/${job._id}`, {}, { headers });
    setAcceptedJob(job);
    setMsg('');
    fetchJobs();
  };

  const openMap = (job) => {
    const [lng, lat] = job.location?.coordinates || [75.8573, 30.9010];
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (acceptedJob) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <span style={styles.logo}>BuildHire</span>
          <div style={styles.navRight}>
            <span style={styles.inProgressBadge}>Job In Progress</span>
            <button style={styles.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.successBanner}>
            Job Accepted — Head to client location now
          </div>
          <div style={styles.detailsGrid}>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Job Title</p>
              <p style={styles.detailValue}>{acceptedJob.title}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Skill Required</p>
              <p style={styles.detailValue}>{acceptedJob.skill}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Client Name</p>
              <p style={styles.detailValue}>{acceptedJob.client?.name || 'Client'}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Distance</p>
              <p style={styles.detailValue}>Within 10 km</p>
            </div>
          </div>
          <div style={styles.descBox}>
            <p style={styles.detailLabel}>Job Description</p>
            <p style={styles.detailValue}>{acceptedJob.description}</p>
          </div>
          <div style={styles.mapWrap}>
            <p style={styles.mapLabel}>Client Location</p>
            <iframe
              title="map"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: '12px', display: 'block' }}
              src="https://maps.google.com/maps?q=30.9010,75.8573&z=14&output=embed"
            />
          </div>
          <button style={styles.mapBtn} onClick={() => openMap(acceptedJob)}>
            Get Directions in Google Maps
          </button>
          <button style={styles.backBtn} onClick={() => setAcceptedJob(null)}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.logo}>BuildHire</span>
        <div style={styles.navRight}>
          <div style={styles.availToggle}>
            <span style={{ fontSize: '0.85rem', color: available ? '#16a34a' : '#64748b', fontWeight: '600' }}>
              {available ? 'Available' : 'Unavailable'}
            </span>
            <div style={{ ...styles.toggleTrack, background: available ? '#16a34a' : '#cbd5e1' }} onClick={() => setAvailable(!available)}>
              <div style={{ ...styles.toggleThumb, transform: available ? 'translateX(20px)' : 'translateX(2px)' }} />
            </div>
          </div>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <span style={styles.navName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      {msg && <div style={styles.newJobAlert}>🔔 {msg}</div>}

      <div style={styles.container}>
        <div style={styles.welcomeBar}>
          <div>
            <h2 style={styles.welcomeTitle}>Worker Dashboard</h2>
            <p style={styles.welcomeSub}>You will be notified instantly when a job is posted nearby</p>
          </div>
          <div style={styles.skillBadge}>{user?.skill || 'Worker'}</div>
        </div>

        <h3 style={styles.sectionTitle}>Available Jobs Near You</h3>

        {jobs.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={{ fontSize: '2.5rem', margin: 0 }}>📡</p>
            <p style={{ color: '#64748b', margin: '0.8rem 0 0', fontWeight: '500' }}>No open jobs right now</p>
            <p style={{ color: '#94a3b8', margin: '0.3rem 0 0', fontSize: '0.85rem' }}>You will get a notification the moment a client posts a job nearby</p>
          </div>
        )}

        {jobs.map(job => (
          <div key={job._id} style={styles.jobCard}>
            <div style={styles.jobTop}>
              <div>
                <p style={styles.jobTitle}>{job.title}</p>
                <span style={styles.skillTag}>{job.skill}</span>
              </div>
              <span style={styles.openBadge}>OPEN</span>
            </div>
            <p style={styles.jobDesc}>{job.description}</p>
            <div style={styles.jobMeta}>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>👤</span>
                <span style={styles.metaText}>Posted by {job.client?.name}</span>
              </div>
              <div style={styles.metaItem}>
                <span style={styles.metaIcon}>📍</span>
                <span style={styles.metaText}>Within 10 km</span>
              </div>
            </div>
            <button style={styles.acceptBtn} onClick={() => acceptJob(job)}>
              Accept This Job
            </button>
          </div>
        ))}
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
  inProgressBadge: { background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' },
  availToggle: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  toggleTrack: { width: '44px', height: '24px', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' },
  toggleThumb: { position: 'absolute', top: '2px', width: '20px', height: '20px', background: '#fff', borderRadius: '50%', transition: 'transform 0.2s' },
  newJobAlert: { background: '#2563eb', color: '#fff', padding: '0.8rem 2rem', fontWeight: '600', fontSize: '0.95rem' },
  container: { maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' },
  welcomeBar: { background: '#1e40af', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  welcomeTitle: { color: '#fff', margin: 0, fontSize: '1.3rem', fontWeight: '700' },
  welcomeSub: { color: 'rgba(255,255,255,0.75)', margin: '0.3rem 0 0', fontSize: '0.85rem' },
  skillBadge: { background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: '700', fontSize: '0.95rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' },
  emptyBox: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '3rem', textAlign: 'center' },
  jobCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem' },
  jobTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' },
  jobTitle: { fontWeight: '700', fontSize: '1rem', color: '#1e293b', margin: '0 0 0.4rem' },
  skillTag: { background: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' },
  openBadge: { background: '#dcfce7', color: '#16a34a', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' },
  jobDesc: { fontSize: '0.9rem', color: '#64748b', margin: '0 0 1rem' },
  jobMeta: { display: 'flex', gap: '1.5rem', marginBottom: '1rem' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
  metaIcon: { fontSize: '0.9rem' },
  metaText: { fontSize: '0.85rem', color: '#64748b' },
  acceptBtn: { width: '100%', padding: '0.85rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  successBanner: { background: '#16a34a', color: '#fff', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  detailBox: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem' },
  descBox: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' },
  detailLabel: { fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  detailValue: { fontSize: '1rem', fontWeight: '600', color: '#1e293b', margin: 0 },
  mapWrap: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' },
  mapLabel: { fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  mapBtn: { width: '100%', padding: '0.9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700', marginBottom: '0.8rem' },
  backBtn: { width: '100%', padding: '0.9rem', background: '#fff', color: '#64748b', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }
};

export default WorkerDashboard;