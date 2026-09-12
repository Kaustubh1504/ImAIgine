// PERSON B OWNS THIS FILE.
//
// Each option maps to a NAMED misunderstanding, not a generic wrong answer. That
// is the difference between this and a worksheet: an airball tells a student
// THAT they were wrong, and nothing about WHY.
//
// The last option is not optional. Treating an arithmetic slip as a
// misconception is a design failure — a student whose method was sound needs to
// be told so, not re-taught something they already understand.
//
// No response reveals the required speed. The student goes back to step 2 and
// solves it again; handing them the number would delete the revise loop.

import { HOOP, FIXED_ANGLE } from './contract.js';
import { H } from './equation.js';

const n = (v, dp = 2) => v.toFixed(dp);

export const MISCONCEPTIONS = [
  {
    id: 'ignored_height',
    label: 'I forgot the ball starts above the ground',
    response:
      `The rim is ${n(HOOP.y)} m up, but you are not throwing from the floor. ` +
      `The ball only has to climb ${n(H)} m. Solving for the full rim height ` +
      `asks for a harder throw than the court needs.`,
  },
  {
    id: 'harder_is_better',
    label: 'I thought throwing harder would always help',
    response:
      'Past a certain speed the ball is still on its way up when it reaches the ' +
      'rim, so it crosses above the hoop and keeps going. There is exactly one ' +
      'speed that arrives at rim height.',
  },
  {
    id: 'ignored_angle',
    label: `I did not use the ${FIXED_ANGLE}° angle`,
    response:
      `At ${FIXED_ANGLE}° your speed splits into a sideways part and an upward ` +
      'part, and neither one is the full value. Skipping the split means solving ' +
      'a different problem than the one on the court.',
  },
  {
    id: 'flat_ground',
    label: 'I used the range formula for a ball landing at the same height',
    response:
      'That formula assumes the ball finishes where it started. Here it finishes ' +
      'higher than it began, so the run to the hoop and the climb have to be ' +
      'handled separately.',
  },
  {
    id: 'arithmetic_slip',
    label: 'My reasoning was right, I just slipped on the arithmetic',
    response:
      'Then the method is sound and there is nothing to relearn. Run the numbers ' +
      'again and shoot.',
  },
];
