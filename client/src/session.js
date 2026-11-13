import axios from 'axios';

// Session helpers. Same localStorage keys as before ('token', 'user').
// Everything reads localStorage at call time, so a fresh login is picked up without a page reload.

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    return null;
  }
};

export const isSignedIn = () => Boolean(getToken() && getUser());

export const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export const homePathFor = role => {
  if (role === 'admin') return '/admin';
  if (role === 'client') return '/client';
  return '/worker';
};

// Remove only the session keys so other preferences (like the theme) survive logout.
export const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// A 401 on any authenticated call means the token is missing, expired or the account was blocked.
// Clear the session and send the user to the login page with a notice.
let installed = false;
export function installSessionGuard() {
  if (installed) return;
  installed = true;
  axios.interceptors.response.use(
    response => response,
    error => {
      const status = error.response?.status;
      const url = error.config?.url || '';
      if (status === 401 && !url.includes('/api/auth/') && getToken()) {
        clearSession();
        window.location.replace('/login?expired=1');
      }
      return Promise.reject(error);
    }
  );
}
