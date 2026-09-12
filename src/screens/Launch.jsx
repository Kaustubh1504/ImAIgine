// PERSON B OWNS THIS FILE. Screen 4 — the activity brief.
// Sets expectations, states the grade, and shows the real Stage sitting still.
import React from 'react';
import Stage from '../Stage.jsx';
import { findCourse, findTopic, findSubtopic } from '../catalog.js';
import { SOLVE_FOR_V, SCENARIO } from '../equation.js';

export default function Launch({ nav, go }) {
  const course = findCourse(nav.courseId) || findCourse('physics');
  const topic = findTopic(course.id, nav.topicId) || findTopic(course.id, 'kinematics');
  const sub = findSubtopic(topic.id, nav.subtopicId) || findSubtopic(topic.id, 'projectile');

  return (
    <div className="launch">
      <nav className="crumbs">
        <button className="crumb" onClick={() => go({ screen: 1 })}>
          Classes
        </button>
        <span className="crumb-sep">›</span>
        <button className="crumb" onClick={() => go({ screen: 2 })}>
          {course.name}
        </button>
        <span className="crumb-sep">›</span>
        <button className="crumb" onClick={() => go({ screen: 3 })}>
          {topic.name}
        </button>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{sub.name}</span>
      </nav>

      <div className="launch-cols">
        <div>
          <h1 className="launch-title">{sub.name}</h1>
          {/* Grade is stated outright: the maths on screen has to match it. */}
          <div className="grade-badge">{course.grade} · {sub.estTime}</div>

          <div className="brief-block">
            <div className="brief-label">What you are working out</div>
            <p className="brief-text">{sub.objective}</p>
          </div>

          <div className="brief-block">
            <div className="brief-label">The court</div>
            <p className="brief-text">{SCENARIO}</p>
          </div>

          <div className="brief-block">
            <div className="brief-label">The relationship</div>
            <div className="eq">
              <span className="eq-unknown">{SOLVE_FOR_V}</span>
            </div>
            <p className="eq-note">
              The ball leaves your hands above the floor, so it only has to climb
              the difference between the two heights — not the full rim height.
            </p>
          </div>

          <div className="brief-block">
            <div className="brief-label">What you will do</div>
            <ol className="brief-steps">
              {sub.studentSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="brief-block">
            <div className="brief-label">You should already know</div>
            <ul className="brief-prereqs">
              {sub.prereqs.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {/* Person A's real Stage, nothing moving. Same component as screen 5,
              so what is previewed here is literally what the student gets. */}
          <div className="launch-preview">
            <Stage />
          </div>

          {/* Label is Person A's: screen 5 opens on a generating sequence that
              this click kicks off, so it reads the same for both roles. */}
          <div className="launch-actions">
            <button className="btn-primary btn-lg" onClick={() => go({ screen: 5 })}>
              Generate simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
