import React from 'react';

// Thin strip along the top of the stage. Shows the sequence and the active step.
export const STEPS = [
  { id: 'predict', label: 'Predict' },
  { id: 'compute', label: 'Compute' },
  { id: 'run', label: 'Run' },
  { id: 'outcome', label: 'Outcome' },
  { id: 'explain', label: 'Explain' },
];

export default function StepTracker({ step, attempts }) {
  const activeIndex = STEPS.findIndex((s) => s.id === step);
  return (
    <div className="step-tracker">
      {STEPS.map((s, i) => (
        <div
          key={s.id}
          className={
            'step-chip' +
            (i === activeIndex ? ' is-active' : '') +
            (i < activeIndex ? ' is-done' : '')
          }
        >
          <span className="step-num">{i + 1}</span>
          <span className="step-label">{s.label}</span>
        </div>
      ))}
      {attempts > 0 && (
        <div className="step-attempts">
          {attempts} attempt{attempts === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}
