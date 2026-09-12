import React, { useState } from 'react';
import { MISCONCEPTIONS } from '../misconceptions.js';

/**
 * Only reachable on a miss. Each option maps to a NAMED misunderstanding,
 * not a generic wrong answer — and one option is always the arithmetic slip,
 * because a slip is not a misconception.
 */
export default function Explain({ onBack }) {
  const [picked, setPicked] = useState(null);
  const chosen = MISCONCEPTIONS.find((m) => m.id === picked);

  return (
    <div className="step-body">
      <h3 className="step-title">Which one sounds like you?</h3>
      <p className="step-sub">Nothing here is marked. Pick the closest.</p>

      <div className="explain-options">
        {MISCONCEPTIONS.map((m) => (
          <button
            key={m.id}
            className={'explain-btn' + (picked === m.id ? ' is-picked' : '')}
            onClick={() => setPicked(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {chosen && <p className="explain-response">{chosen.response}</p>}

      <button className="btn-primary btn-block" disabled={!chosen} onClick={onBack}>
        Back to the calculation →
      </button>
    </div>
  );
}
