import React, { useState, useRef, useEffect, useCallback } from 'react';
import Stage from '../Stage.jsx';
import ReasoningPanel from '../ReasoningPanel.jsx';
import Reactions from '../Reactions.jsx';
import StepTracker from '../steps/StepTracker.jsx';
import Compute from '../steps/Compute.jsx';
import Outcome from '../steps/Outcome.jsx';
import Explain from '../steps/Explain.jsx';
import Generating from '../steps/Generating.jsx';
import { simulate } from '../physics.js';
import { FIXED_ANGLE } from '../contract.js';
import '../steps/activity.css';

// Slower than real time. The arc has to be readable from the back of a room.
const PLAYBACK_RATE = 0.55;

// ...but bounded, because a shot that falls short now bounces on and would sit
// at nearly 7s of playback. The demo has 2:40 total; no single shot gets that.
const MIN_FLIGHT_MS = 1600;
const MAX_FLIGHT_MS = 3200;

export default function Activity({ nav, go, role }) {
  // 'generating' is the beat after the teacher clicks Generate simulation.
  const [phase, setPhase] = useState('generating');
  const [step, setStep] = useState('compute');
  const [shot, setShot] = useState(null);
  const [ghosts, setGhosts] = useState([]);
  const [progress, setProgress] = useState(1);
  const [attempts, setAttempts] = useState(0);

  const raf = useRef(null);
  const safety = useRef(null);

  const clearTimers = () => {
    cancelAnimationFrame(raf.current);
    clearTimeout(safety.current);
  };

  useEffect(() => clearTimers, []);

  const shoot = useCallback(
    (velocity) => {
      const result = simulate({ velocity, angle: FIXED_ANGLE });
      setShot(result);
      setStep('run');
      setProgress(0);

      const flightSeconds = result.trajectory[result.trajectory.length - 1].t;
      const duration = Math.min(
        MAX_FLIGHT_MS,
        Math.max(MIN_FLIGHT_MS, (flightSeconds / PLAYBACK_RATE) * 1000)
      );
      const start = performance.now();

      clearTimers();

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimers();
        setProgress(1);
        setAttempts((a) => a + 1);
        setStep('outcome');
      };

      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        setProgress(p);
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else finish();
      };
      raf.current = requestAnimationFrame(tick);

      // rAF is the normal path. If the tab is backgrounded mid-shot the browser
      // stops producing frames and the step machine would hang on Run forever,
      // which on stage looks like a crash. This guarantees it always lands.
      safety.current = setTimeout(finish, duration + 500);
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
    step === 'run'
      ? 'run'
      : step === 'outcome'
      ? 'outcome'
      : step === 'explain'
      ? 'explain'
      : 'compute';

  return (
    <div className="activity">
      <div className="activity-stage-col">
        <StepTracker step={phase === 'generating' ? null : step} attempts={attempts} />
        <div className="stage-frame">
          <Stage
            velocity={shot ? shot.enteredVelocity : null}
            trajectory={shot ? shot.trajectory : null}
            progress={progress}
            ghosts={ghosts}
          />
          <Reactions outcome={step === 'outcome' ? shot && shot.outcome : null} />
          {phase === 'generating' && <Generating prompt={nav && nav.prompt} onDone={() => setPhase('ready')} />}
        </div>
      </div>

      <ReasoningPanel step={panelStep} role={role}>
        {phase === 'generating' && (
          <div className="step-body">
            <h3 className="step-title">Preparing your activity…</h3>
            <p className="step-sub">
              The court, the equation, and the numbers are being set up.
            </p>
          </div>
        )}

        {phase === 'ready' && step === 'compute' && <Compute onShoot={shoot} attempt={attempts} />}

        {phase === 'ready' && step === 'run' && (
          <div className="step-body">
            <h3 className="step-title">In flight…</h3>
            <p className="step-sub">Watch what {shot.enteredVelocity} m/s actually does.</p>
          </div>
        )}

        {phase === 'ready' && step === 'outcome' && shot && (
          <Outcome
            shot={shot}
            onRevise={revise}
            onExplain={() => setStep('explain')}
            onRestart={() => go({ screen: 1 })}
          />
        )}

        {phase === 'ready' && step === 'explain' && <Explain onBack={revise} />}
      </ReasoningPanel>
    </div>
  );
}
