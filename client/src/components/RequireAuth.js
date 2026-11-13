import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, homePathFor, isSignedIn } from '../session';

// Route guard. Signed-out visitors go to /login; a signed-in user on the wrong dashboard
// is sent to their own (client -> /client, worker -> /worker, admin -> /admin).
function RequireAuth({ role, children }) {
  if (!isSignedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (role && user.role !== role) return <Navigate to={homePathFor(user.role)} replace />;
  return children;
}

export default RequireAuth;
