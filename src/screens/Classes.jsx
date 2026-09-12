// PERSON B OWNS THIS FILE. Screen 1 — the classes a teacher or student sees.
import React from 'react';
import { COURSES } from '../catalog.js';
import { bannerArt } from '../bannerArt.js';

export default function Classes({ go, role }) {
  const open = (course) => {
    if (!course.available) return;
    go({ screen: 2, courseId: course.id });
  };

  return (
    <div className="page">
      <h1 className="page-title">Classes</h1>
      <p className="page-sub">
        {role === 'teacher'
          ? 'Pick a class to open its coursework.'
          : 'Your classes this term.'}
      </p>

      <div className="class-grid">
        {COURSES.map((c) => (
          <button
            key={c.id}
            className={'class-card' + (c.available ? '' : ' is-soon')}
            onClick={() => open(c)}
            disabled={!c.available}
          >
            <div
              className="class-banner"
              style={{
                backgroundColor: c.band,
                backgroundImage: bannerArt(c.id),
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right -10px center',
                backgroundSize: 'auto 100%',
              }}
            >
              <span className="class-banner-name">{c.name}</span>
              <span className="class-banner-section">
                {c.grade} · {c.section}
              </span>
            </div>

            <div className="class-body">
              <span className="class-teacher">{c.teacher}</span>
              <p className="class-desc">{c.description}</p>
              <div className="class-meta">
                <span>
                  {role === 'teacher'
                    ? `${c.students} students`
                    : `${c.topicCount} topics`}
                </span>
                {c.available ? <span>{c.progress}</span> : <span className="pill-soon">Coming soon</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
