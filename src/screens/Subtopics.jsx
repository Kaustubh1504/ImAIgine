// PERSON B OWNS THIS FILE. Stub for Screen 3 — Subtopics.
import React from 'react';

export default function Subtopics({ go }) {
  return (
    <div className="screen-stub">
      <h1>Screen 3 — Subtopics</h1>
      <p>Person B builds this. Static data from <code>catalog.js</code>.</p>
      <button className="btn-primary" onClick={() => go({ screen: 4 })}>
        Continue →
      </button>
    </div>
  );
}
