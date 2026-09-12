import React, { useState, useRef, useEffect } from 'react';
import './promptchat.css';

/**
 * Where a teacher asks for an activity in their own words.
 *
 * STAGED FOR THE DEMO. There is no model behind this and no request leaves the
 * page -- the app is offline by design. The prompt is a fixed string and the
 * reply is scripted; what it is really doing is carrying the teacher's wording
 * through to the generating screen so the simulation feels asked for rather
 * than picked off a list.
 */
const SUGGESTED =
  'A student launches a basketball at a fixed 50°, releasing it 2.0 m above the floor. The hoop is 7.0 m away with its rim 3.05 m up. Let them solve for the launch speed and watch their own number play out.';

const CHIPS = [
  'Projectile motion — basketball shot',
  'Braking distance on a wet road',
  'Orbital velocity of a satellite',
];

export default function PromptChat({ onGenerate, role }) {
  const [value, setValue] = useState(SUGGESTED);
  const [sent, setSent] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || sent) return;
    setSent(text);
    // A beat so the exchange reads as a conversation, then hand off to the
    // generating screen, which does the actual waiting.
    timer.current = setTimeout(() => onGenerate(text), 750);
  };

  return (
    <section className="pchat">
      <header className="pchat-head">
        <span className="pchat-badge">AI</span>
        <div>
          <h2 className="pchat-title">Generate an activity</h2>
          <p className="pchat-sub">
            {role === 'teacher'
              ? 'Describe the activity you want your class to run.'
              : 'This is how your teacher builds the activities you run.'}
          </p>
        </div>
      </header>

      <div className="pchat-thread">
        <div className="pchat-msg is-bot">
          Tell me the scenario and what you want students to solve for. I'll build a
          runnable simulation from it.
        </div>

        {sent && <div className="pchat-msg is-user">{sent}</div>}
        {sent && (
          <div className="pchat-msg is-bot is-typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      {!sent && (
        <>
          <div className="pchat-chips">
            {CHIPS.map((chip, i) => (
              <button
                key={chip}
                type="button"
                className={'pchat-chip' + (i === 0 ? ' is-ready' : '')}
                disabled={i !== 0}
                onClick={() => setValue(SUGGESTED)}
              >
                {chip}
              </button>
            ))}
          </div>

          <form className="pchat-form" onSubmit={submit}>
            <textarea
              className="pchat-input"
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Describe the activity…"
            />
            <button className="pchat-send" type="submit" disabled={!value.trim()}>
              Generate simulation →
            </button>
          </form>
        </>
      )}
    </section>
  );
}
