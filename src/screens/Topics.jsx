// PERSON B OWNS THIS FILE. Screen 2 — coursework inside one class.
import React from 'react';
import { TOPICS, findCourse } from '../catalog.js';

export default function Topics({ nav, go, role }) {
  const course = findCourse(nav.courseId) || findCourse('physics');
  const topics = TOPICS[course.id] || [];

  const open = (topic) => {
    if (!topic.available) return;
    go({ screen: 3, topicId: topic.id });
  };

  return (
    <div className="page">
      <nav className="crumbs">
        <button className="crumb" onClick={() => go({ screen: 1 })}>
          Classes
        </button>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{course.name}</span>
      </nav>

      <div className="hero" style={{ background: course.band }}>
        <h1 className="hero-name">{course.name}</h1>
        <p className="hero-meta">
          {course.grade} · {course.section} · {course.teacher}
          {role === 'teacher' ? ` · ${course.students} students` : ''}
        </p>
      </div>

      <div className="list">
        {topics.map((t) => (
          <button
            key={t.id}
            className={'row' + (t.available ? '' : ' is-soon')}
            onClick={() => open(t)}
            disabled={!t.available}
          >
            <span className="row-icon">{t.icon}</span>
            <span className="row-main">
              <span className="row-title">{t.name}</span>
              <span className="row-desc">{t.description}</span>
            </span>
            {t.available ? (
              <>
                <span className="row-meta">{t.meta}</span>
                <span className="row-arrow">›</span>
              </>
            ) : (
              <span className="pill-soon">Coming soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
