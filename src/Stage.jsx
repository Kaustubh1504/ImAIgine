import React, { useRef, useEffect } from 'react';
import {
  LAUNCH,
  HOOP,
  VIEW,
  RIM_RADIUS,
  BALL_RADIUS,
} from './contract.js';

const W = VIEW.wMeters * VIEW.pxPerMeter; // 660
const H = VIEW.hMeters * VIEW.pxPerMeter; // 520

const COURT_BG = '#fbfbfc';
const FLOOR = '#3c4043';
const GUIDE = '#9aa0a6';
const RIM = '#d93025';
const POLE = '#5f6368';
const BALL = '#f29900';
const TRAIL = 'rgba(230, 145, 0, 0.72)';
const GHOST = 'rgba(95, 99, 104, 0.34)';

// Strip of canvas reserved below the floor for the span dimension. This shifts
// the origin up; it does NOT change the scale (1 m is still VIEW.pxPerMeter).
const GROUND_PAD = 34;

// Headroom actually drawn, in metres. The 15 m/s shot peaks at 8.77 m and must
// stay inside this or nobody sees the arc. Asserted in the acceptance test.
export const VISIBLE_METERS = (H - GROUND_PAD) / VIEW.pxPerMeter;

// meters -> canvas pixels (y flipped)
const px = (x) => x * VIEW.pxPerMeter;
const py = (y) => H - GROUND_PAD - y * VIEW.pxPerMeter;

function drawCourt(c) {
  c.fillStyle = COURT_BG;
  c.fillRect(0, 0, W, H);

  // floor
  c.fillStyle = '#eceff1';
  c.fillRect(0, py(0), W, H - py(0));
  c.fillStyle = '#e0e3e5';
  c.fillRect(0, py(0), W, 3);
  c.strokeStyle = FLOOR;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(0, py(0));
  c.lineTo(W, py(0));
  c.stroke();

  // --- hoop assembly: rim at HOOP, backboard behind it, pole to the floor ---
  const rimL = px(HOOP.x - RIM_RADIUS);
  const rimR = px(HOOP.x + RIM_RADIUS);
  const boardX = rimR + 10;
  const poleX = boardX + 34;

  c.strokeStyle = POLE;
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(poleX, py(0));
  c.lineTo(poleX, py(HOOP.y + 0.75));
  c.lineTo(boardX, py(HOOP.y + 0.75));
  c.stroke();

  // backboard
  c.lineWidth = 5;
  c.strokeStyle = '#80868b';
  c.beginPath();
  c.moveTo(boardX, py(HOOP.y - 0.15));
  c.lineTo(boardX, py(HOOP.y + 1.0));
  c.stroke();

  // rim
  c.strokeStyle = RIM;
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(rimL, py(HOOP.y));
  c.lineTo(rimR, py(HOOP.y));
  c.stroke();

  // net
  c.strokeStyle = 'rgba(95, 99, 104, 0.55)';
  c.lineWidth = 1;
  const netBottom = py(HOOP.y - 0.42);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const top = rimL + (rimR - rimL) * t;
    const bot = rimL + (rimR - rimL) * (0.25 + t * 0.5);
    c.beginPath();
    c.moveTo(top, py(HOOP.y));
    c.lineTo(bot, netBottom);
    c.stroke();
  }

  // --- launch side: release platform ---
  c.strokeStyle = POLE;
  c.lineWidth = 4;
  c.beginPath();
  c.moveTo(px(LAUNCH.x), py(LAUNCH.y));
  c.lineTo(px(LAUNCH.x) + 30, py(LAUNCH.y));
  c.stroke();
  c.beginPath();
  c.moveTo(px(LAUNCH.x) + 3, py(LAUNCH.y));
  c.lineTo(px(LAUNCH.x) + 3, py(0));
  c.stroke();
}

function dashed(c, x1, y1, x2, y2) {
  c.save();
  c.setLineDash([5, 5]);
  c.strokeStyle = GUIDE;
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.restore();
}

function label(c, text, x, y, align = 'center') {
  c.save();
  c.font = '600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  c.textAlign = align;
  c.textBaseline = 'middle';
  const w = c.measureText(text).width;
  const padX = 6;
  const left = align === 'center' ? x - w / 2 - padX : align === 'right' ? x - w - padX : x - padX;
  c.fillStyle = 'rgba(255,255,255,0.92)';
  c.fillRect(left, y - 10, w + padX * 2, 20);
  c.fillStyle = '#5f6368';
  c.fillText(text, x, y);
  c.restore();
}

// On-screen numbers must match the picture, or the stage stops being evidence.
function drawMeasurements(c) {
  const floorY = py(0);
  const rimR = px(HOOP.x + RIM_RADIUS);
  const poleX = rimR + 10 + 34;

  c.strokeStyle = GUIDE;
  c.lineWidth = 1.5;

  // --- horizontal span, launch to hoop, in the reserved strip below the floor
  const spanY = floorY + 20;
  c.beginPath();
  c.moveTo(px(LAUNCH.x), spanY);
  c.lineTo(px(HOOP.x), spanY);
  c.moveTo(px(LAUNCH.x), spanY - 5);
  c.lineTo(px(LAUNCH.x), spanY + 5);
  c.moveTo(px(HOOP.x), spanY - 5);
  c.lineTo(px(HOOP.x), spanY + 5);
  c.stroke();
  label(c, `${HOOP.x.toFixed(1)} m`, px(HOOP.x / 2), spanY);

  // --- rim height, measured off the floor, clear of the pole
  const hx = poleX + 42;
  dashed(c, px(HOOP.x), py(HOOP.y), hx, py(HOOP.y));
  c.beginPath();
  c.moveTo(hx, py(HOOP.y));
  c.lineTo(hx, floorY);
  c.moveTo(hx - 5, py(HOOP.y));
  c.lineTo(hx + 5, py(HOOP.y));
  c.moveTo(hx - 5, floorY);
  c.lineTo(hx + 5, floorY);
  c.stroke();
  label(c, `${HOOP.y.toFixed(2)} m`, hx + 8, py(HOOP.y / 2), 'left');

  // --- release height
  const lx = px(LAUNCH.x) + 40;
  dashed(c, px(LAUNCH.x) + 3, py(LAUNCH.y), lx, py(LAUNCH.y));
  c.beginPath();
  c.moveTo(lx, py(LAUNCH.y));
  c.lineTo(lx, floorY);
  c.moveTo(lx - 5, py(LAUNCH.y));
  c.lineTo(lx + 5, py(LAUNCH.y));
  c.moveTo(lx - 5, floorY);
  c.lineTo(lx + 5, floorY);
  c.stroke();
  label(c, `${LAUNCH.y.toFixed(1)} m`, lx + 8, py(LAUNCH.y / 2), 'left');
}

function drawArc(c, points, stroke, width, dash) {
  if (!points || points.length < 2) return;
  c.save();
  if (dash) c.setLineDash(dash);
  c.strokeStyle = stroke;
  c.lineWidth = width;
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(px(points[0].x), py(points[0].y));
  for (let i = 1; i < points.length; i++) {
    c.lineTo(px(points[i].x), py(points[i].y));
  }
  c.stroke();
  c.restore();
}

// Backspin in radians per metre travelled. True rolling (dist / r) would be
// ~33 revolutions on the 15 m/s shot and read as a blur, so this is tuned to
// roughly 2.5 rev/sec at demo playback: fast enough to see, slow enough to read.
const SPIN_RAD_PER_M = 1.6;

// Purely visual. A regulation ball is 0.24 m across and the rim 0.46 m, so at
// our scale that is a 12 px ball inside a 23 px rim -- true, but an unreadable
// dot on a projector with no room for seams. 1.25x takes the ball to 15 px
// against the same 23 px rim: still plainly narrower than the hoop, so "it fits
// through" reads true, but legible from the back of a room. Physics never uses
// BALL_RADIUS, so nothing downstream is affected.
const BALL_VISUAL_SCALE = 1.25;

// Trail that fades in towards the ball, so the eye is pulled to where the ball
// IS rather than where it has been.
function drawTrail(c, points) {
  if (!points || points.length < 2) return;
  const a = points[0];
  const b = points[points.length - 1];
  const g = c.createLinearGradient(px(a.x), py(a.y), px(b.x), py(b.y));
  g.addColorStop(0, 'rgba(230, 145, 0, 0.10)');
  g.addColorStop(0.55, 'rgba(230, 145, 0, 0.45)');
  g.addColorStop(1, 'rgba(230, 145, 0, 0.9)');
  drawArc(c, points, g, 3.5);
}

function drawBallShadow(c, p) {
  const bx = px(p.x);
  const floorY = py(0);
  const r = BALL_RADIUS * VIEW.pxPerMeter * BALL_VISUAL_SCALE;
  if (bx < -r * 4 || bx > W + r * 4) return;

  // Higher ball -> wider, fainter shadow. Cheap but effective depth cue.
  const w = r * (1.5 + p.y * 0.14);
  const alpha = Math.max(0.04, 0.2 - p.y * 0.018);

  c.save();
  c.fillStyle = 'rgba(60, 64, 67, ' + alpha + ')';
  c.beginPath();
  c.ellipse(bx, floorY - 1, w, w * 0.26, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function drawBall(c, p, spin) {
  // A ball outside the view is simply not drawn. Never crash, never rescale.
  const bx = px(p.x);
  const by = py(p.y);
  const r = BALL_RADIUS * VIEW.pxPerMeter * BALL_VISUAL_SCALE;
  if (bx < -r || bx > W + r || by < -r || by > H + r) return;

  c.save();
  c.translate(bx, by);

  // Sphere shading stays fixed to the light source, so only the seams rotate.
  const g = c.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.12, 0, 0, r * 1.05);
  g.addColorStop(0, '#ffc06b');
  g.addColorStop(0.5, '#f2912f');
  g.addColorStop(1, '#d9691a');
  c.fillStyle = g;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();

  // Seams are clipped to the ball, so the bowed ones read as curving over a
  // sphere instead of poking out the sides.
  c.save();
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.clip();
  c.rotate(spin);

  c.strokeStyle = 'rgba(64, 28, 0, 0.7)';
  c.lineWidth = Math.max(0.9, r * 0.14);
  c.lineCap = 'round';

  c.beginPath();
  c.moveTo(-r, 0);
  c.lineTo(r, 0);
  c.moveTo(0, -r);
  c.lineTo(0, r);
  c.stroke();

  c.beginPath();
  c.moveTo(0, -r);
  c.quadraticCurveTo(-r * 1.5, 0, 0, r);
  c.moveTo(0, -r);
  c.quadraticCurveTo(r * 1.5, 0, 0, r);
  c.stroke();
  c.restore();

  c.strokeStyle = 'rgba(140, 66, 10, 0.5)';
  c.lineWidth = 1;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.stroke();

  c.restore();
}

function drawVelocityEcho(c, velocity) {
  c.save();
  c.font = '700 28px ui-monospace, SFMono-Regular, Menlo, monospace';
  c.textBaseline = 'top';
  const text = `v = ${velocity} m/s`;
  const w = c.measureText(text).width;
  c.fillStyle = 'rgba(26, 115, 232, 0.08)';
  c.fillRect(16, 16, w + 24, 42);
  c.fillStyle = '#1a73e8';
  c.fillText(text, 28, 24);
  c.restore();
}

/**
 * Pure renderer. Draws no success/fail text and makes no sound — that is the
 * reactions layer, overlaid on top.
 *
 * velocity   number | null   null = static frame, nothing moving
 * trajectory array of {x,y,t}
 * progress   0..1 fraction of the trajectory to reveal
 * ghosts     previous attempts, faded
 */
export default function Stage({ velocity = null, trajectory = null, progress = 1, ghosts = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawCourt(c);
    drawMeasurements(c);

    ghosts.forEach((g) => drawArc(c, g, GHOST, 2, [6, 6]));

    if (trajectory && trajectory.length) {
      const n = Math.max(2, Math.round(trajectory.length * Math.min(1, Math.max(0, progress))));
      const shown = trajectory.slice(0, n);
      const ball = shown[shown.length - 1];

      // Distance travelled drives the spin, so the ball slows its rotation as
      // it slows down rather than spinning at a constant rate.
      let dist = 0;
      for (let i = 1; i < shown.length; i++) {
        dist += Math.hypot(shown[i].x - shown[i - 1].x, shown[i].y - shown[i - 1].y);
      }

      drawBallShadow(c, ball);
      drawTrail(c, shown);
      drawBall(c, ball, -dist * SPIN_RAD_PER_M); // negative = backspin
    }

    if (velocity !== null) drawVelocityEcho(c, velocity);
  }, [velocity, trajectory, progress, ghosts]);

  return <canvas ref={ref} className="stage-canvas" style={{ width: W, height: H }} />;
}
