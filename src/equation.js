// PERSON B OWNS THIS FILE.
//
// Every equation the student reads is built here, from the frozen contract —
// never retyped. If a constant in contract.js moves, the displayed maths moves
// with it, so what is on screen can never drift from what the ball does.
//
// The flat-ground range equation R = v² sin(2θ) / g does NOT apply to this
// problem: the ball is released at 2.0 m and the rim is at 3.05 m, so it does
// not land at its launch height. Using it here would give ~8.35 m/s instead of
// ~8.93 — and it would model exactly the mistake the activity is built to
// diagnose.

import { G, LAUNCH, HOOP, FIXED_ANGLE } from './contract.js';

export const D = HOOP.x - LAUNCH.x; // horizontal run to the rim, m
export const H = HOOP.y - LAUNCH.y; // height the ball must gain, m

// Keep the trailing zero: a measurement reads as "7.0 m", not "7 m".
const n = (v, dp = 2) => v.toFixed(dp);

/** Symbolic form of the launch speed the hoop demands. */
export const SOLVE_FOR_V = `v = √( g·D² / (2·cos²θ · (D·tanθ − h)) )`;

/** The same relationship with this court's numbers substituted in. */
export const SOLVE_FOR_V_NUMERIC =
  `v = √( ${n(G, 1)}·${n(D, 1)}² / (2·cos²${FIXED_ANGLE}° · (${n(D, 1)}·tan${FIXED_ANGLE}° − ${n(H)})) )`;

/** Vertical position over time — the curve the student is bending. */
export const TRAJECTORY_Y =
  `y = ${n(LAUNCH.y, 1)} + v·sin(${FIXED_ANGLE}°)·t − ½·${n(G, 1)}·t²`;

/** Horizontal position over time. */
export const TRAJECTORY_X = `x = v·cos(${FIXED_ANGLE}°)·t`;

/** What the student is handed. Labels stay short: the panel has 638px of
 *  height on screen 5 and the prose above already spells the setup out. */
export const GIVENS = [
  { label: 'To the hoop', value: `D = ${n(D, 1)} m` },
  { label: 'Rim', value: `${n(HOOP.y)} m` },
  { label: 'Release', value: `${n(LAUNCH.y, 1)} m` },
  { label: 'To climb', value: `h = ${n(H)} m` },
  { label: 'Angle', value: `θ = ${FIXED_ANGLE}°` },
  { label: 'Gravity', value: `g = ${n(G, 1)}` },
];

/** Short prose statement of the task, used on screen 4 and screen 5. */
export const SCENARIO =
  `The hoop is ${n(D, 1)} m away and its rim sits ${n(HOOP.y)} m up. ` +
  `You release the ball from ${n(LAUNCH.y, 1)} m at a fixed ${FIXED_ANGLE}°. ` +
  `How fast does it have to leave your hands?`;
