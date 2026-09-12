import { G, LAUNCH, HOOP, VIEW, SWISH_TOL, RIM_TOL, FIXED_ANGLE } from './contract.js';

const DT = 0.005;
const MAX_T = 6;

// Seconds of flight kept past the rim on a swish. The ball still carries its
// forward speed, so a long tail carries it past the backboard and the shot
// reads as a miss. This stops it inside the net, where it belongs.
const SWISH_TAIL = 0.09;

const rad = (deg) => (deg * Math.PI) / 180;

// The launch speed that puts the ball exactly on the rim, derived from the
// contract constants. Never hardcode this — if a constant moves, this moves.
export function correctVelocity(angle = FIXED_ANGLE) {
  const th = rad(angle);
  const D = HOOP.x - LAUNCH.x;
  const h = HOOP.y - LAUNCH.y;
  const denom = 2 * Math.cos(th) ** 2 * (D * Math.tan(th) - h);
  if (denom <= 0) return null; // no solution at this angle
  return Math.sqrt((G * D * D) / denom);
}

export function simulate({ velocity, angle }) {
  const th = rad(angle);
  let vx = velocity * Math.cos(th);
  let vy = velocity * Math.sin(th);
  let x = LAUNCH.x;
  let y = LAUNCH.y;
  let t = 0;

  const trajectory = [{ x, y, t }];

  let yAtHoop = null; // interpolated height as the ball passes the rim plane
  let tAtHoop = null;
  let landingX = null; // where it hits the floor, for "fell short by X"

  while (t < MAX_T) {
    const px = x;
    const py = y;

    x += vx * DT;
    y += vy * DT;
    vy -= G * DT;
    t += DT;

    // Rim plane crossing: interpolate rather than take the nearest sample.
    if (yAtHoop === null && px <= HOOP.x && x > HOOP.x && x !== px) {
      const f = (HOOP.x - px) / (x - px);
      yAtHoop = py + f * (y - py);
      tAtHoop = t - DT + f * DT;
    }

    trajectory.push({ x, y, t });

    if (y <= 0) {
      // Interpolate the floor contact so the arc ends on the ground, not under it.
      if (y !== py && py > 0) {
        const f = py / (py - y);
        landingX = px + f * (x - px);
        trajectory[trajectory.length - 1] = { x: landingX, y: 0, t };
      } else {
        landingX = x;
      }
      break;
    }

    if (x > VIEW.wMeters) break; // off the right edge — the parking lot shot
  }

  let outcome;
  let dy = null;

  if (yAtHoop === null) {
    // Never reached the rim plane at all.
    outcome = 'short';
  } else {
    dy = yAtHoop - HOOP.y;
    if (Math.abs(dy) <= SWISH_TOL) outcome = 'swish';
    else if (Math.abs(dy) <= RIM_TOL) outcome = 'rim';
    else if (dy > RIM_TOL) outcome = 'long';
    else outcome = 'short';
  }

  let finalTrajectory = trajectory;
  if (outcome === 'swish' && tAtHoop !== null) {
    const cutoff = tAtHoop + SWISH_TAIL;
    finalTrajectory = trajectory.filter((p) => p.t <= cutoff);
  }

  return {
    outcome,
    trajectory: finalTrajectory,
    dy,
    yAtHoop,
    landingX,
    enteredVelocity: velocity,
    correctVelocity: correctVelocity(angle),
  };
}
