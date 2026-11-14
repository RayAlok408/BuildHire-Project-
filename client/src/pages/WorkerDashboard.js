import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Button, Card, EmptyState, Icon, SkeletonCards, StatusBadge, Switch, TopNav, cx, skillIcon, useConfirm,
} from '../components';
import { authHeaders, clearSession, getToken, getUser } from '../session';
import { useDocumentTitle } from '../hooks';
import { timeAgo } from '../time';
import './Dashboard.css';

const API = 'https://buildhire-server.onrender.com';

function WorkerDashboard() {
  const navigate = useNavigate();
  useDocumentTitle('Worker dashboard');
  const { confirm, dialog } = useConfirm();
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [acceptedJob, setAcceptedJob] = useState(null);
  const [msg, setMsg] = useState('');
  const [available, setAvailable] = useState(true);
  const user = getUser();

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/open`, { headers: authHeaders() });
      setJobs(res.data);
    } catch (err) { console.log(err); }
    finally { setLoaded(true); }
  }, []);

  useEffect(() => {
    // The socket is opened per visit with the current token (a fresh login is picked up) and closed on leave.
    const socket = io(API, { auth: { token: getToken() } });
    fetchJobs();
    const handleNewJob = newJob => {
      setMsg(`New job nearby: ${newJob.title}`);
      fetchJobs();
      setTimeout(() => setMsg(''), 5000);
    };
    const handleBookingCancelled = () => {
      setAcceptedJob(null);
      setMsg('Booking cancelled by the client');
      fetchJobs();
    };
    const handleBookingCompleted = () => {
      setAcceptedJob(null);
      setMsg('Booking completed');
      fetchJobs();
    };

    socket.on('job:new', handleNewJob);
    socket.on('booking:cancelled', handleBookingCancelled);
    socket.on('booking:completed', handleBookingCompleted);

    return () => {
      socket.off('job:new', handleNewJob);
      socket.off('booking:cancelled', handleBookingCancelled);
      socket.off('booking:completed', handleBookingCompleted);
      socket.disconnect();
    };
  }, [fetchJobs, user?.id]);

  const acceptJob = async (job) => {
    const res = await axios.put(`${API}/api/jobs/accept/${job._id}`, {}, { headers: authHeaders() });
    setAcceptedJob(res.data.job);
    setMsg('');
    fetchJobs();
  };

  const startJob = async () => {
    const res = await axios.put(`${API}/api/jobs/start/${acceptedJob._id}`, {}, { headers: authHeaders() });
    setAcceptedJob(res.data.job);
    setMsg('Job started');
  };

  const cancelJob = async () => {
    await axios.put(`${API}/api/jobs/cancel/${acceptedJob._id}`, { reason: 'Cancelled by worker' }, { headers: authHeaders() });
    setAcceptedJob(null);
    setMsg('Booking cancelled');
    fetchJobs();
  };

  const confirmCancel = async () => {
    const ok = await confirm({
      title: 'Cancel this booking?',
      message: `"${acceptedJob.title}" will go back to the client as cancelled. This cannot be undone.`,
      confirmLabel: 'Cancel job',
      cancelLabel: 'Keep job',
    });
    if (ok) cancelJob();
  };

  const openMap = (job) => {
    const [lng, lat] = job.location?.coordinates || [75.8573, 30.9010];
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  if (acceptedJob) {
    const inProgress = acceptedJob.status === 'in_progress';
    return (
      <div className="bh-dash">
        <TopNav compact label="Account">
          <StatusBadge status={acceptedJob.status}>{inProgress ? 'Job In Progress' : 'Job Accepted'}</StatusBadge>
          <Button variant="ghost" size="sm" icon="log-out" onClick={logout}>Logout</Button>
        </TopNav>
        <main id="main" tabIndex={-1} className="bh-dash__main">
          <Card tone="ink" pad="sm" className="bh-banner bh-rise bh-on-ink">
            <span className="bh-banner__icon"><Icon name={inProgress ? 'play' : 'navigation'} size={22} /></span>
            <h1 className="bh-banner__text">
              {inProgress ? 'Job In Progress — Service is underway' : 'Job Accepted — Head to client location now'}
            </h1>
          </Card>
          <div className="bh-details">
            <Card pad="sm" rise={1}>
              <p className="bh-detail__label">Job Title</p>
              <p className="bh-detail__value">{acceptedJob.title}</p>
            </Card>
            <Card pad="sm" rise={2}>
              <p className="bh-detail__label">Skill Required</p>
              <p className="bh-detail__value">{acceptedJob.skill}</p>
            </Card>
            <Card pad="sm" rise={3}>
              <p className="bh-detail__label">Client Name</p>
              <p className="bh-detail__value">{acceptedJob.client?.name || 'Client'}</p>
            </Card>
            <Card pad="sm" rise={4}>
              <p className="bh-detail__label">Distance</p>
              <p className="bh-detail__value">Within 10 km</p>
            </Card>
          </div>
          <Card pad="sm" rise={5} className="bh-block">
            <p className="bh-detail__label">Job Description</p>
            <p className="bh-detail__value">{acceptedJob.description}</p>
          </Card>
          <Card pad="sm" rise={6} className="bh-block">
            <p className="bh-detail__label">Client Location</p>
            <iframe className="bh-map" title="map" width="100%" height="260" src="https://maps.google.com/maps?q=30.9010,75.8573&z=14&output=embed" />
          </Card>
          <div className="bh-actions bh-rise">
            <Button variant="ghost" icon="navigation" onClick={() => openMap(acceptedJob)}>Get Directions in Google Maps</Button>
            {acceptedJob.status === 'accepted' && (
              <Button icon="play" onClick={startJob}>Start Job</Button>
            )}
            <Button variant="danger" icon="x" onClick={confirmCancel}>Cancel Job</Button>
            <Button variant="ghost" icon="arrow-left" onClick={() => setAcceptedJob(null)}>Back to Dashboard</Button>
          </div>
        </main>
        {dialog}
      </div>
    );
  }

  return (
    <div className="bh-dash">
      <TopNav compact label="Account">
        <div className={cx('bh-avail', available && 'is-on')}>
          <span className="bh-avail__dot" aria-hidden="true" />
          <span className="bh-avail__label">{available ? 'Available' : 'Unavailable'}</span>
          <Switch checked={available} onChange={setAvailable} label="Available for jobs" />
        </div>
        <Avatar name={user?.name} size="sm" />
        <span className="bh-nav__name">{user?.name}</span>
        <Button variant="ghost" size="sm" icon="log-out" onClick={logout}>Logout</Button>
      </TopNav>

      {msg && <Alert key={msg} tone="notice" bar>{msg}</Alert>}

      <main id="main" tabIndex={-1} className="bh-dash__main">
        <Card tone="ink" className="bh-welcome bh-rise bh-on-ink">
          <div className="bh-welcome__inner">
            <div>
              <h1 className="bh-welcome__title">Worker Dashboard</h1>
              <p className="bh-welcome__sub">You will be notified instantly when a job is posted nearby</p>
            </div>
            <span className="bh-skill-chip">
              <Icon name={skillIcon(user?.skill)} size={18} />
              {user?.skill || 'Worker'}
            </span>
          </div>
        </Card>

        <h2 className="bh-section-title">Available Jobs Near You</h2>

        <div className="bh-list">
          {!loaded && <SkeletonCards count={2} />}
          {loaded && jobs.length === 0 && (
            <EmptyState
              icon="radio"
              title="No open jobs right now"
              text="You will get a notification the moment a client posts a job nearby"
            />
          )}

          {jobs.map((job, index) => (
            <Card key={job._id} pad="sm" rise={index} className="bh-job">
              <div className="bh-job__head">
                <span className="bh-job__tile"><Icon name={skillIcon(job.skill)} size={22} /></span>
                <div className="bh-job__titles">
                  <h3 className="bh-job__title">{job.title}</h3>
                  <p className="bh-job__skill">{job.skill}</p>
                </div>
                <StatusBadge status="open" />
              </div>
              <p className="bh-job__desc">{job.description}</p>
              <div className="bh-job__meta">
                <span className="bh-job__meta-item">
                  <Icon name="user" size={16} />
                  Posted by {job.client?.name}
                </span>
                <span className="bh-job__meta-item">
                  <Icon name="map-pin" size={16} />
                  Within 10 km
                </span>
                {job.createdAt && (
                  <span className="bh-job__meta-item">
                    <Icon name="clock" size={16} />
                    {timeAgo(job.createdAt)}
                  </span>
                )}
              </div>
              <Button full icon="check" onClick={() => acceptJob(job)}>Accept This Job</Button>
            </Card>
          ))}
        </div>
      </main>
      {dialog}
    </div>
  );
}

export default WorkerDashboard;
