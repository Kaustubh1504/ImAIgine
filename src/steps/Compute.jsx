import React, { useState } from 'react';
import { PRESETS } from '../contract.js';

/**
 * THE THESIS STEP.
 *
 * No hint. No validation. No correctness feedback. Not a colour, not a
 * checkmark, not a nudge. The student types a number and the simulation
 * answers. Anything that evaluates the number before it is fired breaks the
 * entire pitch.
 */
export default function Compute({ onShoot, attempt }) {
  const [value, setValue] = useState('');

  const num = parseFloat(value);
  const ready = value !== '' && Number.isFinite(num) && num > 0;

  const submit = (e) => {
    e.preventDefault();
    if (ready) onShoot(num);
  };

  return (
    <div className="step-body">
      <h3 className="step-title">
        {attempt === 0 ? 'Work out the launch speed.' : 'Try another value.'}
      </h3>
      <p className="step-sub">
        Solve for <code>v</code>, then fire it. The court decides what happens.
      </p>

      <form onSubmit={submit}>
        <label className="input-label" htmlFor="velocity">
          Launch speed
        </label>
        <div className="input-row">
          <input
            id="velocity"
            className="velocity-input"
            type="number"
            step="0.1"
            min="0"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          <span className="input-unit">m/s</span>
        </div>

        <button className="btn-primary btn-block btn-shoot" disabled={!ready} type="submit">
          Shoot 🏀
        </button>
      </form>

      {/* Stage insurance for whoever is driving the demo. */}
      <div className="presets">
        <span className="presets-caption">Presenter</span>
        <div className="presets-row">
          {PRESETS.map((p) => (
            <button key={p.label} className="preset-btn" onClick={() => onShoot(p.velocity)}>
              {p.label} ({p.velocity})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
