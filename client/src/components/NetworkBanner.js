import React from 'react';
import Alert from './Alert';
import { useOnlineStatus } from '../hooks';

// Shown while the browser is offline, so failed requests are not a mystery.
function NetworkBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="bh-offline">
      <Alert tone="notice" icon="wifi-off">You are offline. Changes will fail until you reconnect.</Alert>
    </div>
  );
}

export default NetworkBanner;
