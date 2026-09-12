// PERSON B OWNS THIS FILE. Stub for Screen 4 — Launch.
import React from 'react';

export default function Launch({ go }) {
  return (
    <div className="screen-stub">
      <h1>Screen 4 — Launch</h1>
      <p>Person B builds this. Static data from <code>catalog.js</code>.</p>
      <button className="btn-primary" onClick={() => go({ screen: 5 })}>
        Continue →
      </button>
    </div>
  );
}
