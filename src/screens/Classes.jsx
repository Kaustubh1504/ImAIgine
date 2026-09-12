// PERSON B OWNS THIS FILE. Stub for Screen 1 — Classes.
import React from 'react';

export default function Classes({ go }) {
  return (
    <div className="screen-stub">
      <h1>Screen 1 — Classes</h1>
      <p>Person B builds this. Static data from <code>catalog.js</code>.</p>
      <button className="btn-primary" onClick={() => go({ screen: 2 })}>
        Continue →
      </button>
    </div>
  );
}
