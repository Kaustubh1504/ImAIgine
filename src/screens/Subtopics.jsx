// PERSON B OWNS THIS FILE. Screen 3 — activities inside one topic.
import React from 'react';
import { SUBTOPICS, findCourse, findTopic } from '../catalog.js';
import PromptChat from '../PromptChat.jsx';

export default function Subtopics({ nav, go, role }) {
  const course = findCourse(nav.courseId) || findCourse('physics');
  const topic = findTopic(course.id, nav.topicId) || findTopic(course.id, 'kinematics');
  const subtopics = SUBTOPICS[topic.id] || [];

  const open = (sub) => {
    if (!sub.available) return;
    go({ screen: 4, subtopicId: sub.id });
  };

  return (
    <div className="page">
      <nav className="crumbs">
        <button className="crumb" onClick={() => go({ screen: 1 })}>
          Classes
        </button>
        <span className="crumb-sep">›</span>
        <button className="crumb" onClick={() => go({ screen: 2 })}>
          {course.name}
        </button>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{topic.name}</span>
      </nav>

      <h1 className="page-title">{topic.name}</h1>
      <p className="page-sub">{topic.description}</p>

      <PromptChat role={role} onGenerate={(prompt) => go({ screen: 5, prompt })} />

      <div className="list">
        {subtopics.map((s) => (
          <button
            key={s.id}
            className={'row' + (s.available ? '' : ' is-soon')}
            onClick={() => open(s)}
            disabled={!s.available}
          >
            <span className="row-icon">{s.icon}</span>
            <span className="row-main">
              <span className="row-title">{s.name}</span>
              <span className="row-desc">{s.blurb}</span>
            </span>
            {s.available ? (
              <>
                <span className="row-meta">{s.estTime}</span>
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
