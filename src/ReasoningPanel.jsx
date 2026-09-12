// PERSON B OWNS THIS FILE.
// The equation stays visible at EVERY step — that is the point of the panel.
// Mid-demo the presenter points here: "your number goes straight into this."
import React from 'react';
import {
  SCENARIO,
  GIVENS,
  SOLVE_FOR_V,
  TRAJECTORY_Y,
} from './equation.js';

export default function ReasoningPanel({ step, role, children }) {
  // While the ball is in the air and just after, the interesting equation is
  // the one describing the curve, not the one being solved.
  const inFlight = step === 'run' || step === 'outcome';

  // A presenter reads the scenario aloud, so a teacher keeps it on screen — but
  // never on the explain step. Five options plus a response plus the scenario
  // overflows 638px and pushes the equation out of view, and the equation
  // staying visible outranks the convenience.
  const showScenario =
    step !== 'explain' && (role === 'teacher' || step === 'predict' || step === 'compute');

  return (
    <aside className="reasoning-panel">
      {showScenario && <p className="panel-scenario">{SCENARIO}</p>}

      {children}

      <div className="panel-maths">
        <div className="brief-label">Solve for</div>
        <div className="eq">
          <span className="eq-unknown">{SOLVE_FOR_V}</span>
        </div>

        {inFlight && (
          <div className="eq eq-secondary">
            <span>{TRAJECTORY_Y}</span>
          </div>
        )}

        <div className="brief-label panel-givens-label">Given</div>
        <div className="givens-grid">
          {GIVENS.map((g) => (
            <div className="given" key={g.label}>
              <span className="given-label">{g.label}</span>
              <span className="given-value">{g.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
