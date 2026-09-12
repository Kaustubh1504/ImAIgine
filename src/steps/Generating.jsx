import React, { useState, useEffect } from 'react';

/**
 * The beat between the teacher clicking "Generate simulation" and the court
 * appearing. It overlays the stage, so the court is revealed behind it.
 *
 * This does no network work and calls no model -- the whole app is offline by
 * design, and the zero-network claim is checked in the network tab. The copy
 * describes what is genuinely being set up, and nothing more.
 */
const PHASES = [
  'Reading the problem setup',
  'Building the court geometry',
  'Wiring the equations of motion',
  'Compiling the simulation',
];

const PHASE_MS = 520;

export default function Generating({ onDone }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= PHASES.length) {
          clearInterval(id);
          setTimeout(onDone, PHASE_MS);
          return PHASES.length;
        }
        return i + 1;
      });
    }, PHASE_MS);
    return () => clearInterval(id);
  }, [onDone]);

  const pct = Math.min(100, Math.round(((index + 1) / PHASES.length) * 100));

  return (
    <div className="generating">
      <div className="generating-card">
        <div className="generating-brand">
          Im<span className="generating-ai">AI</span>gine
        </div>
        <p className="generating-caption">Generating simulation…</p>

        <div className="generating-bar">
          <div className="generating-fill" style={{ width: `${pct}%` }} />
        </div>

        <ul className="generating-list">
          {PHASES.map((label, i) => (
            <li
              key={label}
              className={
                'generating-item' +
                (i < index ? ' is-done' : '') +
                (i === index ? ' is-active' : '')
              }
            >
              <span className="generating-dot">{i < index ? '✓' : ''}</span>
              {label}
            </li>
          ))}
        </ul>

        {/* Stage insurance: never wait on an animation in front of an audience. */}
        <button className="generating-skip" onClick={onDone}>
          Skip
        </button>
      </div>
    </div>
  );
}
