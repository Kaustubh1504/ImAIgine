// PERSON B OWNS THIS FILE. Confetti and synthesized sound go here.
//
// This is an effects layer overlaid on the stage. Person A's Stage draws no
// success or failure text and makes no sound; it flies the ball and reports.
//
// Audio is synthesized with the Web Audio API — no files, nothing to 404, and
// nothing to load over a network we have promised not to touch. Every audio
// call is wrapped: a browser that refuses to make noise must not take the demo
// down with it.
import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './reactions.css';

const COPY = {
  swish: { headline: 'SWISH! 🔥', sub: 'NOTHING BUT NET', cls: 'reaction-swish' },
  rim:   { headline: 'OOH, RATTLED IN… 😬', sub: 'Off the iron', cls: 'reaction-rim' },
  short: { headline: 'AIRBALL 🙈', sub: 'Physics said no.', cls: 'reaction-short' },
  long:  { headline: 'WAY TOO STRONG 🚀', sub: "That one's in the parking lot", cls: 'reaction-long' },
};

let audioCtx = null;

function ctx() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

/** One shaped tone. Everything below is built out of these. */
function tone(c, { type = 'sine', from, to, start, dur, gain = 0.18 }) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  const t0 = c.currentTime + start;

  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to && to !== from) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);

  // Short fades at both ends, or the speaker clicks.
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.03, dur / 3));
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(amp);
  amp.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const SOUNDS = {
  // Rising major triad — reads as "yes" without needing a sample.
  swish: (c) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(c, { type: 'triangle', from: f, start: i * 0.07, dur: 0.42, gain: 0.16 })
    );
  },
  // Short bright burst: iron.
  rim: (c) => {
    tone(c, { type: 'square', from: 1400, to: 900, start: 0, dur: 0.09, gain: 0.1 });
    tone(c, { type: 'square', from: 980, to: 700, start: 0.1, dur: 0.13, gain: 0.07 });
  },
  // Descending buzzer.
  short: (c) => {
    tone(c, { type: 'sawtooth', from: 300, to: 110, start: 0, dur: 0.42, gain: 0.13 });
  },
  // Falling whoosh, for the one that leaves the building.
  long: (c) => {
    tone(c, { type: 'sine', from: 1200, to: 180, start: 0, dur: 0.6, gain: 0.12 });
  },
};

function play(outcome) {
  try {
    const c = ctx();
    if (!c) return;
    const make = SOUNDS[outcome];
    if (make) make(c);
  } catch {
    /* Audio is decoration. Never let it break the build. */
  }
}

function celebrate() {
  try {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
    setTimeout(() => {
      try {
        confetti({ particleCount: 50, spread: 100, origin: { y: 0.5 }, disableForReducedMotion: true });
      } catch { /* no-op */ }
    }, 220);
  } catch {
    /* no-op */
  }
}

export default function Reactions({ outcome }) {
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState({ makes: 0, attempts: 0 });
  const lastFired = useRef(null);

  // Fire once per outcome, not once per render.
  useEffect(() => {
    if (!outcome) {
      lastFired.current = null;
      return;
    }
    if (lastFired.current === outcome) return;
    lastFired.current = outcome;

    setScore((s) => ({
      makes: s.makes + (outcome === 'swish' ? 1 : 0),
      attempts: s.attempts + 1,
    }));

    if (!muted) play(outcome);
    if (outcome === 'swish') celebrate();
  }, [outcome, muted]);

  const copy = outcome ? COPY[outcome] : null;

  return (
    <div className="reactions">
      {copy && (
        <div className={'reaction-banner ' + copy.cls}>
          <span className="reaction-headline">{copy.headline}</span>
          <span className="reaction-sub">{copy.sub}</span>
        </div>
      )}

      {score.attempts > 0 && (
        <div className="reaction-score">
          <span className="reaction-score-num">
            {score.makes}/{score.attempts}
          </span>
          <span className="reaction-score-label">made</span>
        </div>
      )}

      <button
        className="reaction-mute"
        onClick={() => setMuted((m) => !m)}
        title={muted ? 'Sound off' : 'Sound on'}
      >
        {muted ? '🔇 Sound off' : '🔊 Sound on'}
      </button>
    </div>
  );
}
