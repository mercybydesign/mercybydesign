import React from 'react';

export function Logo({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="brand-mark"
    >
      <rect width="40" height="40" rx="7" fill="#1b4332" />
      {/* Interlocking 8-pointed Rub el Hizb geometric mark */}
      <rect x="11" y="11" width="18" height="18" stroke="#faf7f2" strokeWidth="1.5" />
      <rect
        x="11"
        y="11"
        width="18"
        height="18"
        transform="rotate(45 20 20)"
        stroke="#d4af6a"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="20" r="3" fill="#d4af6a" />
    </svg>
  );
}
