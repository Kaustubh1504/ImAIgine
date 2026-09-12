// FROZEN. Every physics constant in the build lives here.
// The simulation and the correct-answer formula both import from this file.
// If they drift, the correct answer stops scoring and the demo dies on stage.
// Changing a value means both people stop and re-run the acceptance test.

export const G = 9.8;

export const LAUNCH = { x: 0, y: 2.0 };
export const HOOP = { x: 7.0, y: 3.05 }; // 3.05m = regulation 10ft

export const FIXED_ANGLE = 50;

export const RIM_RADIUS = 0.23;
export const BALL_RADIUS = 0.12;

export const SWISH_TOL = 0.12;
export const RIM_TOL = 0.28;

// Sized so the 15 m/s demo shot stays on screen (it peaks at 8.74 m).
// Do not raise pxPerMeter above 50.
export const VIEW = { wMeters: 13.2, hMeters: 10.4, pxPerMeter: 50 };

// Preset buttons, in demo-script order. Stage insurance if live typing fumbles.
export const PRESETS = [
  { label: 'Too hard', velocity: 15 },
  { label: 'Too soft', velocity: 6 },
  { label: 'Perfect', velocity: 8.9 },
];
