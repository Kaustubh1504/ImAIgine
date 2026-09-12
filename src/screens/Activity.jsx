import React, { useState, useRef, useEffect, useCallback } from 'react';
import Stage from '../Stage.jsx';
import ReasoningPanel from '../ReasoningPanel.jsx';
import Reactions from '../Reactions.jsx';
import StepTracker from '../steps/StepTracker.jsx';
import Predict from '../steps/Predict.jsx';
import Compute from '../steps/Compute.jsx';
import Outcome from '../steps/Outcome.jsx';
import Explain from '../steps/Explain.jsx';
import { simulate } from '../physics.js';
import { FIXED_ANGLE } from '../contract.js';
import '../steps/activity.css';

// Slower than real time. The arc has to be readable from the back of a room.
const PLAYBACK_RATE = 0.55;

export default function Activity({ go, role }) {
  const [step, setStep] = useState('predict');
  const [prediction, setPrediction] = useState(null);
  const [shot, setShot] = useState(null);
  const [ghosts, setGhosts] = useState([]);
  const [progress, setProgress] = useState(1);
  const [attempts, setAttempts] = useState(0);

  const raf = useRef(null);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const shoot = useCallback(
    (velocity) => {
      const result = simulate({ velocity, angle: FIXED_ANGLE });
      setShot(result);
      setStep('run');
      setProgress(0);

      const flightSeconds = result.trajectory[result.trajectory.length - 1].t;
      const duration = (flightSeconds / PLAYBACK_RATE) * 1000;
      const start = performance.now();

      cancelAnimationFrame(raf.current);
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        setProgress(p);
        if (p < 1) {
          raf.current = requestAnimationFrame(tick);
        } else {
          setAttempts((a) => a + 1);
          setStep('outcome');
        }
      };
      raf.current = requestAnimationFrame(tick);
    },
    []
  );

  // Previous attempts persist as ghost arcs.
  const revise = () => {
    if (shot) setGhosts((g) => [...g, shot.trajectory]);
    setShot(null);
    setProgress(1);
    setStep('compute');
  };

  const panelStep =
    step === 'predict'
      ? 'predict'
      : step === 'run'
      ? 'run'
      : step === 'outcome'
      ? 'outcome'
      : step === 'explain'
      ? 'explain'
      : 'compute';

  return (
    <div className="activity">
      <div className="activity-stage-col">
        <StepTracker step={step === 'run' ? 'run' : step} attempts={attempts} />
        <div className="stage-frame">
          <Stage
            velocity={shot ? shot.enteredVelocity : null}
            trajectory={shot ? shot.trajectory : null}
            progress={progress}
            ghosts={ghosts}
          />
          <Reactions outcome={step === 'outcome' ? shot && shot.outcome : null} />
        </div>
      </div>

      <ReasoningPanel step={panelStep} role={role}>
        {step === 'predict' && (
          <Predict
            onDone={(p) => {
              setPrediction(p);
              setStep('compute');
            }}
          />
        )}

        {step === 'compute' && <Compute onShoot={shoot} attempt={attempts} />}

        {step === 'run' && (
          <div className="step-body">
            <h3 className="step-title">In flight…</h3>
            <p className="step-sub">Watch what {shot.enteredVelocity} m/s actually does.</p>
          </div>
        )}

        {step === 'outcome' && shot && (
          <Outcome
            shot={shot}
            prediction={prediction}
            onRevise={revise}
            onExplain={() => setStep('explain')}
            onRestart={() => go({ screen: 1 })}
          />
        )}

        {step === 'explain' && <Explain onBack={revise} />}
      </ReasoningPanel>
    </div>
  );
}
