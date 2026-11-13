import React from 'react';

// Accessible on/off toggle (button with role="switch").
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="bh-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="bh-switch__thumb" />
    </button>
  );
}

export default Switch;
