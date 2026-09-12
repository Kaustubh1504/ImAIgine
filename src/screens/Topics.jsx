// PERSON B OWNS THIS FILE. Stub for Screen 2 — Topics.
import React from 'react';

export default function Topics({ go }) {
  return (
    <div className="screen-stub">
      <h1>Screen 2 — Topics</h1>
      <p>Person B builds this. Static data from <code>catalog.js</code>.</p>
      <button className="btn-primary" onClick={() => go({ screen: 3 })}>
        Continue →
      </button>
    </div>
  );
}
