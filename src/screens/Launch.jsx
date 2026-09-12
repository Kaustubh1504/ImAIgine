// PERSON B OWNS THIS FILE. Stub for Screen 4 — Launch.
import React from 'react';

export default function Launch({ go }) {
  return (
    <div className="screen-stub">
      <h1>Screen 4 — Launch</h1>
      <p>Person B builds this. Static data from <code>catalog.js</code>.</p>
      {/* PERSON B: keep this label. Screen 5 opens on a generating sequence
          that this click is meant to kick off. */}
      <button className="btn-primary" onClick={() => go({ screen: 5 })}>
        Generate simulation
      </button>
    </div>
  );
}
