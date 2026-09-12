import React, { useState } from 'react';

// Surfaces a belief before the math. Nothing here is scored.
const CHOICES = [
  { id: 'short', label: 'Falls short', hint: 'lands before the hoop' },
  { id: 'in', label: 'Goes in', hint: 'straight through' },
  { id: 'long', label: 'Sails long', hint: 'flies past the hoop' },
];

const CONFIDENCE = ['Just guessing', 'Fairly sure', 'Certain'];

export default function Predict({ onDone }) {
  const [choice, setChoice] = useState(null);
  const [confidence, setConfidence] = useState(null);

  return (
    <div className="step-body">
      <h3 className="step-title">Before you calculate — what do you think happens?</h3>
      <p className="step-sub">No marks for this. It just makes your thinking visible.</p>

      <div className="predict-choices">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            className={'predict-btn' + (choice === c.id ? ' is-picked' : '')}
            onClick={() => setChoice(c.id)}
          >
            <span className="predict-label">{c.label}</span>
            <span className="predict-hint">{c.hint}</span>
          </button>
        ))}
      </div>

      <div className="confidence">
        <span className="confidence-caption">How sure are you?</span>
        <div className="confidence-row">
          {CONFIDENCE.map((c, i) => (
            <button
              key={c}
              className={'confidence-btn' + (confidence === i ? ' is-picked' : '')}
              onClick={() => setConfidence(i)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn-primary btn-block"
        disabled={!choice}
        onClick={() => onDone({ choice, confidence })}
      >
        Lock it in →
      </button>
    </div>
  );
}
