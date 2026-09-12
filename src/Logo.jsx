import React from 'react';

/**
 * The mark: a launch arc with the ball on its way down.
 *
 * It is the product in one glyph -- a trajectory the student's own number
 * produced -- and it stays meaningful past projectile motion, since every
 * simulation here is a curve someone's working drives. Inline SVG, so there is
 * no icon font and no network request.
 */
export default function Logo({ size = 26 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="ImAIgine"
      style={{ display: 'block', color: 'var(--primary)' }}
    >
      <rect x="1" y="1" width="30" height="30" rx="8" fill="currentColor" />
      <path
        d="M6.5 24.5 C10 10.5, 21 9.5, 25.5 19.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="25.7" cy="20.4" r="2.9" fill="#fff" />
    </svg>
  );
}
