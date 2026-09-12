// THE ACCEPTANCE TEST. If 8.9 is not a swish, nothing else matters.
import { simulate, correctVelocity } from '../src/physics.js';
import { FIXED_ANGLE, HOOP, SWISH_TOL, VIEW } from '../src/contract.js';

let failed = 0;

function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  → got ${actual}, want ${expected}`);
}

const a = FIXED_ANGLE;

const perfect = simulate({ velocity: 8.9, angle: a });
const soft = simulate({ velocity: 6, angle: a });
const hard = simulate({ velocity: 15, angle: a });

check('simulate(8.9) is a swish', perfect.outcome, 'swish');
check('simulate(6)   is short', soft.outcome, 'short');
check('simulate(15)  is long', hard.outcome, 'long');

console.log('');
console.log(`correct velocity        ${correctVelocity(a).toFixed(4)} m/s  (spec: ~8.93)`);
console.log(`8.9 height at hoop      ${perfect.yAtHoop.toFixed(3)} m  (rim ${HOOP.y}, tol ${SWISH_TOL})`);
console.log(`8.9 error               ${perfect.dy.toFixed(4)} m`);
console.log(`6    lands at x =       ${soft.landingX.toFixed(2)} m  (${(HOOP.x - soft.landingX).toFixed(2)} m short of hoop)`);
console.log(`15   height at hoop      ${hard.yAtHoop.toFixed(2)} m  (${hard.dy.toFixed(2)} m over the rim)`);

// The overshoot is the joke: the ball must keep flying past the rim, not freeze.
const hardEnd = hard.trajectory[hard.trajectory.length - 1];
check('15 flies past the hoop', hardEnd.x > HOOP.x, true);
check('15 exits the right edge', hardEnd.x > VIEW.wMeters, true);

// A swish must drop through the net, not sail on.
const perfectEnd = perfect.trajectory[perfect.trajectory.length - 1];
check('8.9 truncates past the rim', perfectEnd.x > HOOP.x && perfectEnd.x < HOOP.x + 2, true);
check('8.9 drops below the rim', perfectEnd.y < HOOP.y, true);

// The peak must stay inside the frame at 15 m/s, or nobody sees the arc.
const peak = Math.max(...hard.trajectory.map((p) => p.y));
console.log(`15   peak height        ${peak.toFixed(2)} m  (frame ${VIEW.hMeters} m)`);
check('15 peak stays in frame', peak < VIEW.hMeters, true);

console.log('');
console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
