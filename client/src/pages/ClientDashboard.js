import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Button, Card, EmptyState, Field, Icon, Segmented, SkeletonCards, StatBar, StatusBadge, TopNav, skillIcon,
} from '../components';
import './Dashboard.css';

const API = 'https://buildhire-server.onrender.com';
const token = localStorage.getItem('token');
const socket = io(API, { auth: { token } });
const headers = { Authorization: `Bearer ${token}` };

function ClientDashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', skill: '' });
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('post');
  const [reviewingJobId, setReviewingJobId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '', review: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/jobs/myjobs`, { headers });
      setJobs(res.data);
    } catch (err) { console.log(err); }
    finally { setLoaded(true); }
  }, []);

  useEffect(() => {
    fetchJobs();
    const bookingEvents = ['booking:accepted', 'booking:started', 'booking:cancelled'];
    bookingEvents.forEach(event => socket.on(event, fetchJobs));

    return () => bookingEvents.forEach(event => socket.off(event, fetchJobs));
  }, [fetchJobs]);

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
    await axios.put(`${API}/api/jobs/complete/${id}`, {}, { headers });
    setReviewingJobId(id);
    fetchJobs();
  };

  const submitReview = async (id) => {
    if (!reviewForm.rating || !reviewForm.review.trim()) {
      setReviewMsg('Please select a rating and write a review.');
      return;
    }

    try {
      await axios.post(`${API}/api/jobs/${id}/review`, {
        rating: Number(reviewForm.rating),
        review: reviewForm.review
      }, { headers });
      setReviewingJobId(null);
      setReviewForm({ rating: '', review: '' });
      setReviewMsg('Review submitted successfully.');
      fetchJobs();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Unable to submit review.');
    }
  };

  const cancelJob = async (id) => {
    await axios.put(`${API}/api/jobs/cancel/${id}`, { reason: 'Cancelled by client' }, { headers });
    fetchJobs();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const stats = [
    { value: jobs.length, label: 'Total' },
    { value: jobs.filter(j => j.status === 'open').length, label: 'Open' },
    { value: jobs.filter(j => j.status === 'completed').length, label: 'Done' },
  ];

  const tabs = [
    { value: 'post', label: 'Post a Job', icon: 'file-plus' },
    { value: 'jobs', label: 'My Jobs', icon: 'clipboard', badge: jobs.length > 0 ? jobs.length : null },
  ];

  return (
    <div className="bh-dash">
      <TopNav label="Account">
        <Avatar name={user?.name} size="sm" />
        <span className="bh-nav__name">{user?.name}</span>
        <Button variant="ghost" size="sm" icon="log-out" onClick={logout}>Logout</Button>
      </TopNav>

      <main className="bh-dash__main">
        <Card tone="ink" className="bh-welcome bh-rise bh-on-ink">
          <div className="bh-welcome__inner">
            <div>
              <h2 className="bh-welcome__title">Welcome, {user?.name}!</h2>
              <p className="bh-welcome__sub">Post a job and get skilled workers at your doorstep</p>
            </div>
            <StatBar tone="boxes" items={stats} />
          </div>
        </Card>

        <Segmented className="bh-tabs" label="Dashboard sections" options={tabs} value={activeTab} onChange={setActiveTab} />

        {activeTab === 'post' && (
          <Card className="bh-rise">
            <h3 className="bh-form-card__title">Post a New Job</h3>
            <p className="bh-form-card__sub">Nearby workers will be notified instantly</p>
            <div className="bh-form">
              <Field label="Job Title" name="title" placeholder="e.g. Fix my tap, Paint my room" value={form.title} onChange={handle} />
              <Field as="textarea" label="Description" name="description" placeholder="Describe the problem in detail..." value={form.description} onChange={handle} />
              <Field as="select" label="Skill Needed" name="skill" value={form.skill} onChange={handle}>
                <option value="">Select skill needed</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Cleaner">Cleaner</option>
              </Field>
              {msg === 'success' && <Alert tone="success">Job posted! Nearby workers are being notified.</Alert>}
              {msg === 'error' && <Alert tone="error">Something went wrong. Try again.</Alert>}
              {msg === 'fill' && <Alert tone="error">Please fill all fields.</Alert>}
              <Button full loading={loading} icon="file-plus" onClick={postJob}>
                {loading ? 'Posting' : 'Post Job — Notify Nearby Workers'}
              </Button>
            </div>
          </Card>
        )}

        {activeTab === 'jobs' && (
          <div className="bh-list">
            {!loaded && <SkeletonCards count={2} />}
            {loaded && jobs.length === 0 && (
              <EmptyState icon="clipboard" title="No jobs posted yet" text="Jobs you post show up here with their status.">
                <Button onClick={() => setActiveTab('post')}>Post Your First Job</Button>
              </EmptyState>
            )}
            {jobs.map((job, index) => (
              <Card key={job._id} pad="sm" rise={index} className="bh-job">
                <div className="bh-job__head">
                  <span className="bh-job__tile"><Icon name={skillIcon(job.skill)} size={22} /></span>
                  <div className="bh-job__titles">
                    <h3 className="bh-job__title">{job.title}</h3>
                    <p className="bh-job__skill">{job.skill}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                <p className="bh-job__desc">{job.description}</p>
                {job.worker && (
                  <div className="bh-worker">
                    <Avatar name={job.worker.name} size="sm" />
                    <div>
                      <p className="bh-worker__name">Worker: {job.worker.name}</p>
                      <p className="bh-worker__rating">
                        Rating: {job.worker.rating ? job.worker.rating.toFixed(1) : 'New'}
                        {job.worker.rating ? <Icon name="star" size={14} /> : null}
                      </p>
                    </div>
                  </div>
                )}
                {(job.status === 'accepted' || job.status === 'in_progress') && (
                  <div className="bh-job__actions">
                    <Button icon="check" onClick={() => completeJob(job._id)}>Mark Complete</Button>
                    <Button variant="danger" icon="x" onClick={() => cancelJob(job._id)}>Cancel Job</Button>
                  </div>
                )}
                {job.status === 'completed' && (
                  <div className="bh-job__done">
                    <Alert tone="success">Job completed successfully!</Alert>
                    {!job.review && reviewingJobId !== job._id && (
                      <Button icon="star" onClick={() => { setReviewingJobId(job._id); setReviewMsg(''); }}>
                        Review Worker
                      </Button>
                    )}
                    {!job.review && reviewingJobId === job._id && (
                      <Card tone="cream" pad="sm" className="bh-review">
                        <Field
                          as="select"
                          label="Rating"
                          value={reviewForm.rating}
                          onChange={event => setReviewForm({ ...reviewForm, rating: event.target.value })}
                        >
                          <option value="">Select rating</option>
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Very poor</option>
                        </Field>
                        <Field
                          as="textarea"
                          label="Review"
                          maxLength={1000}
                          placeholder="Share your experience..."
                          value={reviewForm.review}
                          onChange={event => setReviewForm({ ...reviewForm, review: event.target.value })}
                        />
                        {reviewMsg && <Alert tone="error">{reviewMsg}</Alert>}
                        <Button onClick={() => submitReview(job._id)}>Submit Review</Button>
                      </Card>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ClientDashboard;
