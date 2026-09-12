import React, { useState } from 'react';
import Classes from './screens/Classes.jsx';
import Topics from './screens/Topics.jsx';
import Subtopics from './screens/Subtopics.jsx';
import Launch from './screens/Launch.jsx';
import Activity from './screens/Activity.jsx';
import Logo from './Logo.jsx';

// Five screens, no router. One piece of nav state, passed down.
export default function App() {
  const [nav, setNav] = useState({
    screen: 1,
    courseId: null,
    topicId: null,
    subtopicId: null,
    prompt: null, // the teacher's wording, carried through to the loading screen
  });
  const [role, setRole] = useState('teacher');

  const go = (patch) => setNav((n) => ({ ...n, ...patch }));

  const screens = {
    1: <Classes nav={nav} go={go} role={role} />,
    2: <Topics nav={nav} go={go} role={role} />,
    3: <Subtopics nav={nav} go={go} role={role} />,
    4: <Launch nav={nav} go={go} role={role} />,
    5: <Activity nav={nav} go={go} role={role} />,
  };

  return (
    <div className="app">
      <header className="app-header">
        <button className="brand" onClick={() => go({ screen: 1 })}>
          <span className="brand-mark">
            <Logo />
          </span>
          <span className="brand-name">
            Im<span>AI</span>gine
          </span>
        </button>
        <div className="role-toggle">
          {['student', 'teacher'].map((r) => (
            <button
              key={r}
              className={role === r ? 'role-btn is-active' : 'role-btn'}
              onClick={() => setRole(r)}
            >
              {r === 'student' ? 'Student' : 'Teacher'}
            </button>
          ))}
        </div>
      </header>
      <main className="app-main">{screens[nav.screen]}</main>
    </div>
  );
}
