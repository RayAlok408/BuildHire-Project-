import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Button, Card, EmptyState, Icon, Segmented, SkeletonCards, StatusBadge, TopNav, skillIcon,
} from '../components';
import './Dashboard.css';

const API = 'https://buildhire-server.onrender.com';
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const TABS = [
  { value: 'users', label: 'Users', icon: 'users' },
  { value: 'jobs', label: 'Jobs', icon: 'briefcase' },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);
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
    } finally {
      setUsersLoaded(true);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await axios.get(`${API}/api/admin/jobs?page=1&limit=50`, { headers });
      setJobs(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load jobs');
    } finally {
      setJobsLoaded(true);
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
    <div className="bh-dash">
      <TopNav compact label="Account" leading={<StatusBadge status="outline">Admin</StatusBadge>}>
        <Button variant="ghost" size="sm" icon="log-out" onClick={logout}>Logout</Button>
      </TopNav>
      <main className="bh-dash__main bh-dash__main--wide">
        <div className="bh-admin__head bh-rise">
          <div>
            <p className="bh-eyebrow">Control Center</p>
            <h1 className="bh-admin__title">Platform overview</h1>
            <p className="bh-admin__sub">Manage accounts, workers and service requests.</p>
          </div>
          <Card tone="ink" pad="sm" className="bh-count bh-on-ink">
            <span className="bh-count__num">{tab === 'users' ? users.length : jobs.length}</span>
            <span className="bh-count__lbl">loaded</span>
          </Card>
        </div>

        <Segmented className="bh-admin__tabs" label="Admin sections" options={TABS} value={tab} onChange={setTab} />

        {message && <Alert key={message} tone="info" className="bh-toast">{message}</Alert>}

        {tab === 'users' ? (
          <section className="bh-list" aria-label="Users">
            {!usersLoaded && <SkeletonCards count={3} />}
            {usersLoaded && users.length === 0 && (
              <EmptyState icon="users" title="No users yet" text="Accounts show up here as people sign up." />
            )}
            {users.map((account, index) => (
              <Card as="article" key={account._id} pad="sm" rise={index} className="bh-row">
                <div className="bh-row__identity">
                  <Avatar name={account.name} />
                  <div>
                    <strong className="bh-row__name">{account.name}</strong>
                    <div className="bh-row__meta">{account.email} · {account.role}</div>
                  </div>
                </div>
                <div className="bh-row__actions">
                  <StatusBadge status={account.blocked ? 'blocked' : 'active'} />
                  {account.role === 'worker' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={account.approved ? 'x-circle' : 'user-check'}
                      disabled={loading}
                      onClick={() => updateUser(account._id, { approved: !account.approved }, account.approved ? 'Worker rejected' : 'Worker approved')}
                    >
                      {account.approved ? 'Reject worker' : 'Approve worker'}
                    </Button>
                  )}
                  <Button
                    variant={account.blocked ? 'primary' : 'danger'}
                    size="sm"
                    icon={account.blocked ? 'check' : 'slash'}
                    disabled={loading}
                    onClick={() => updateUser(account._id, { blocked: !account.blocked }, account.blocked ? 'User unblocked' : 'User blocked')}
                  >
                    {account.blocked ? 'Unblock' : 'Block'}
                  </Button>
                </div>
              </Card>
            ))}
          </section>
        ) : (
          <section className="bh-list" aria-label="Jobs">
            {!jobsLoaded && <SkeletonCards count={3} />}
            {jobsLoaded && jobs.length === 0 && (
              <EmptyState icon="briefcase" title="No jobs yet" text="Posted jobs show up here with their status." />
            )}
            {jobs.map((job, index) => (
              <Card as="article" key={job._id} pad="sm" rise={index} className="bh-row">
                <div className="bh-row__identity">
                  <span className="bh-job__tile"><Icon name={skillIcon(job.skill)} size={22} /></span>
                  <div>
                    <strong className="bh-row__name">{job.title}</strong>
                    <div className="bh-row__meta">{job.skill} · Client: {job.client?.name || 'Unknown'} · Worker: {job.worker?.name || 'Unassigned'}</div>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
