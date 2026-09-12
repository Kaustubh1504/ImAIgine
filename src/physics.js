import {
  G,
  LAUNCH,
  HOOP,
  VIEW,
  SWISH_TOL,
  RIM_TOL,
  FIXED_ANGLE,
  RESTITUTION,
  FLOOR_FRICTION,
  MAX_BOUNCES,
  SETTLE_SPEED,
  RIM_RADIUS,
} from './contract.js';

const DT = 0.005;
const MAX_T = 6;

// On a swish the ball is truncated as it clears the far edge of the ring, so it
// comes to rest inside the net rather than carrying on past the backboard --
// which read as a miss on screen.

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
  let landingX = null; // where it FIRST hits the floor, for "fell short by X"
  let bounces = 0;

  while (t < MAX_T) {
    const prevX = x;
    const prevY = y;

    x += vx * DT;
    y += vy * DT;
    vy -= G * DT;
    t += DT;

    // Rim plane crossing, interpolated rather than snapped to the nearest
    // sample. Only counted on the first airborne pass -- a ball that has
    // already bounced may cross x = HOOP.x again along the floor, and that is
    // not a shot at the hoop.
    if (yAtHoop === null && bounces === 0 && prevX <= HOOP.x && x > HOOP.x && x !== prevX) {
      const f = (HOOP.x - prevX) / (x - prevX);
      yAtHoop = prevY + f * (y - prevY);
      tAtHoop = t - DT + f * DT;
    }

    if (y <= 0) {
      // Land exactly on the floor rather than a step below it.
      const f = prevY > 0 && prevY !== y ? prevY / (prevY - y) : 0;
      const contactX = prevX + f * (x - prevX);
      if (landingX === null) landingX = contactX;

      x = contactX;
      y = 0;
      trajectory.push({ x, y, t });

      bounces += 1;
      vy = -vy * RESTITUTION;
      vx *= FLOOR_FRICTION;

      if (bounces > MAX_BOUNCES || vy < SETTLE_SPEED || x > VIEW.wMeters) break;
      continue;
    }

    trajectory.push({ x, y, t });

    if (x > VIEW.wMeters) break; // off the right edge -- the parking lot shot
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
  if (outcome === 'swish') {
    const cutoff = HOOP.x + RIM_RADIUS;
    const idx = trajectory.findIndex((p) => p.x > cutoff);
    if (idx > 1) finalTrajectory = trajectory.slice(0, idx + 1);
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
