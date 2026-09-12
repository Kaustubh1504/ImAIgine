import React from 'react';
import { HOOP } from '../contract.js';

/**
 * Descriptive, never right/wrong. We report what the court did.
 * On a miss we do NOT reveal the ideal trajectory or the correct value.
 */
function describe(shot) {
  const { outcome, dy, landingX, enteredVelocity } = shot;

  if (outcome === 'swish') {
    return {
      headline: 'Through the hoop.',
      detail: `${enteredVelocity} m/s put the ball ${Math.abs(dy).toFixed(2)} m from the centre of the rim.`,
    };
  }
  if (outcome === 'rim') {
    return {
      headline: 'Off the rim.',
      detail: `It arrived ${Math.abs(dy).toFixed(2)} m ${dy > 0 ? 'above' : 'below'} the ring — close enough to hit iron, not enough to drop.`,
    };
  }
  if (outcome === 'long') {
    return {
      headline: 'Sailed long.',
      detail: `The ball crossed the hoop ${dy.toFixed(2)} m above the rim and kept going.`,
    };
  }
  // short
  if (dy === null && landingX !== null) {
    return {
      headline: 'Fell short.',
      detail: `It landed ${(HOOP.x - landingX).toFixed(2)} m before the hoop.`,
    };
  }
  return {
    headline: 'Fell short.',
    detail: `It reached the hoop ${Math.abs(dy).toFixed(2)} m below the rim.`,
  };
}

export default function Outcome({ shot, prediction, onRevise, onExplain, onRestart }) {
  const { headline, detail } = describe(shot);
  const missed = shot.outcome !== 'swish';

  const predictedRight =
    prediction &&
    ((prediction.choice === 'in' && shot.outcome === 'swish') ||
      (prediction.choice === 'long' && shot.outcome === 'long') ||
      (prediction.choice === 'short' && shot.outcome === 'short'));

  return (
    <div className="step-body">
      <h3 className={'outcome-headline' + (missed ? '' : ' is-swish')}>{headline}</h3>
      <p className="outcome-detail">{detail}</p>

      {prediction && (
        <p className="outcome-predict">
          You predicted it would{' '}
          <strong>
            {prediction.choice === 'in' ? 'go in' : prediction.choice === 'long' ? 'sail long' : 'fall short'}
          </strong>
          . {predictedRight ? 'That is what happened.' : 'That is not what happened.'}
        </p>
      )}

      {missed ? (
        <>
          <button className="btn-primary btn-block" onClick={onRevise}>
            Try again →
          </button>
          <button className="btn-ghost btn-block" onClick={onExplain}>
            What went wrong in my thinking?
          </button>
        </>
      ) : (
        <>
          <button className="btn-primary btn-block" onClick={onRevise}>
            Shoot again
          </button>
          <button className="btn-ghost btn-block" onClick={onRestart}>
            Back to activities
          </button>
        </>
      )}
    </div>
  );
}
