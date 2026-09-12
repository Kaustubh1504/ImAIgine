import React, { useRef, useEffect } from 'react';
import { LAUNCH, HOOP, VIEW, RIM_RADIUS, BALL_RADIUS } from './contract.js';

const W = VIEW.wMeters * VIEW.pxPerMeter; // 660
const H = VIEW.hMeters * VIEW.pxPerMeter; // 520

// Strip of canvas reserved below the floor for the span dimension. This shifts
// the origin up; it does NOT change the scale (1 m is still VIEW.pxPerMeter).
const GROUND_PAD = 34;

// Headroom actually drawn, in metres. The 15 m/s shot peaks at 8.77 m and must
// stay inside this or nobody sees the arc.
export const VISIBLE_METERS = (H - GROUND_PAD) / VIEW.pxPerMeter;

// meters -> canvas pixels (y flipped)
const px = (x) => x * VIEW.pxPerMeter;
const py = (y) => H - GROUND_PAD - y * VIEW.pxPerMeter;

// Backspin in radians per metre travelled. True rolling (dist / r) would be
// ~33 revolutions on the 15 m/s shot and read as a blur, so this is tuned to
// roughly 2.5 rev/sec at demo playback.
const SPIN_RAD_PER_M = 1.6;

// Purely visual. A regulation ball is 0.24 m across and the rim 0.46 m, so at
// our scale that is a 12 px ball inside a 23 px rim -- true, but an unreadable
// dot on a projector. 1.25x takes the ball to 15 px against the same 23 px rim:
// still plainly narrower than the hoop. Physics never reads BALL_RADIUS.
const BALL_VISUAL_SCALE = 1.25;

// Regulation geometry in metres, so the picture matches the numbers. Backboard
// is 1.07 m tall with its face 0.375 m behind the ring centre; net drops 0.40 m.
const BOARD_FACE = 0.375;
const BOARD_BOTTOM = 2.9;
const BOARD_TOP = BOARD_BOTTOM + 1.07;
const NET_DROP = 0.4;

const GUIDE = '#8a8f94';

/* ------------------------------------------------------------------------ */
/* Procedural textures. Built once into offscreen canvases and blitted each    */
/* frame -- regenerating noise at 60fps would be pointless work.              */
/* ------------------------------------------------------------------------ */

let woodTex = null;
let leatherTex = null;

// Deterministic noise, so the court looks identical every run and the demo
// never surprises us with a stray plank.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildWood() {
  const hgt = GROUND_PAD;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = hgt;
  const c = cv.getContext('2d');
  const rnd = seeded(20260912);

  const base = c.createLinearGradient(0, 0, 0, hgt);
  base.addColorStop(0, '#c68b4e');
  base.addColorStop(1, '#9d6a37');
  c.fillStyle = base;
  c.fillRect(0, 0, W, hgt);

  // planks running across the court, each slightly its own tone
  let x = 0;
  while (x < W) {
    const w = 46 + rnd() * 34;
    const shade = rnd() * 0.16 - 0.08;
    c.fillStyle = `rgba(${shade > 0 ? 255 : 60}, ${shade > 0 ? 235 : 40}, ${
      shade > 0 ? 200 : 20
    }, ${Math.abs(shade)})`;
    c.fillRect(x, 0, w, hgt);

    // plank seam
    c.strokeStyle = 'rgba(88, 56, 24, 0.5)';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(x + 0.5, 0);
    c.lineTo(x + 0.5, hgt);
    c.stroke();
    x += w;
  }

  // grain
  c.strokeStyle = 'rgba(104, 66, 28, 0.3)';
  c.lineWidth = 0.8;
  for (let i = 0; i < 70; i++) {
    const gy = rnd() * hgt;
    const gx = rnd() * W;
    const len = 24 + rnd() * 70;
    c.beginPath();
    c.moveTo(gx, gy);
    c.quadraticCurveTo(gx + len / 2, gy + (rnd() - 0.5) * 3, gx + len, gy);
    c.stroke();
  }

  // polished sheen near the top of the boards
  const gloss = c.createLinearGradient(0, 0, 0, hgt * 0.6);
  gloss.addColorStop(0, 'rgba(255, 246, 230, 0.3)');
  gloss.addColorStop(1, 'rgba(255, 246, 230, 0)');
  c.fillStyle = gloss;
  c.fillRect(0, 0, W, hgt * 0.6);

  woodTex = cv;
}

// Pebbled leather, tiled over the ball.
function buildLeather() {
  const S = 64;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const c = cv.getContext('2d');
  const rnd = seeded(77345);

  c.clearRect(0, 0, S, S);
  for (let i = 0; i < 420; i++) {
    const x = rnd() * S;
    const y = rnd() * S;
    const r = 0.5 + rnd() * 0.9;
    c.fillStyle = `rgba(${rnd() > 0.5 ? '255,214,160' : '120,58,10'}, ${
      0.12 + rnd() * 0.2
    })`;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }
  leatherTex = cv;
}

function textures() {
  if (!woodTex) buildWood();
  if (!leatherTex) buildLeather();
}

/* ------------------------------------------------------------------------ */
/* Court                                                                      */
/* ------------------------------------------------------------------------ */

function drawBackground(c) {
  const floorY = py(0);
  const g = c.createLinearGradient(0, 0, 0, floorY);
  g.addColorStop(0, '#e8edf1');
  g.addColorStop(0.7, '#f3f6f8');
  g.addColorStop(1, '#fafbfc');
  c.fillStyle = g;
  c.fillRect(0, 0, W, floorY);

  // corner vignette, so the arc sits in the middle of a lit hall
  const v = c.createRadialGradient(W * 0.45, floorY * 0.55, H * 0.25, W * 0.45, floorY * 0.55, H * 0.95);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(30, 44, 58, 0.07)');
  c.fillStyle = v;
  c.fillRect(0, 0, W, floorY);
}

function drawFloor(c) {
  const floorY = py(0);
  c.drawImage(woodTex, 0, floorY);

  c.strokeStyle = '#6d4519';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(0, floorY);
  c.lineTo(W, floorY);
  c.stroke();
}

// Polished boards reflect. Cheap trick: redraw the uprights mirrored, faded.
function drawFloorReflection(c, drawFn) {
  const floorY = py(0);
  c.save();
  c.beginPath();
  c.rect(0, floorY, W, H - floorY);
  c.clip();
  c.globalAlpha = 0.16;
  c.translate(0, floorY * 2);
  c.scale(1, -1);
  drawFn(c);
  c.restore();
}

// bulge: 0..1, how far the ball is into the net. Drives the swish kick.
function drawNet(c, bulge) {
  const rimL = px(HOOP.x - RIM_RADIUS);
  const rimR = px(HOOP.x + RIM_RADIUS);
  const top = py(HOOP.y);
  const bottom = py(HOOP.y - NET_DROP);
  const taper = (rimR - rimL) * 0.22;
  const sag = bulge * 9;
  const lerp = (a, b, t) => a + (b - a) * t;

  c.save();
  c.lineWidth = 1.1;
  c.strokeStyle = 'rgba(252, 252, 253, 0.95)';
  c.shadowColor = 'rgba(40, 44, 48, 0.45)';
  c.shadowBlur = 1.5;

  const STRANDS = 5;
  for (let i = 0; i <= STRANDS; i++) {
    const t = i / STRANDS;
    const xTop = lerp(rimL, rimR, t);
    c.beginPath();
    c.moveTo(xTop, top);
    c.lineTo(lerp(rimL + taper, rimR - taper, t), bottom + sag);
    c.moveTo(xTop, top);
    c.lineTo(lerp(rimL + taper, rimR - taper, 1 - t), bottom + sag);
    c.stroke();
  }

  for (let i = 1; i <= 2; i++) {
    const t = i / 3;
    const yy = lerp(top, bottom + sag, t);
    const inset = taper * t;
    c.beginPath();
    c.moveTo(rimL + inset, yy);
    c.lineTo(rimR - inset, yy);
    c.stroke();
  }
  c.restore();
}

function drawStructure(c) {
  const rimR = px(HOOP.x + RIM_RADIUS);
  const boardX = px(HOOP.x + BOARD_FACE);
  const poleX = boardX + 48;
  const floorY = py(0);

  // pole, with a little round stock shading
  const pg = c.createLinearGradient(poleX - 5, 0, poleX + 5, 0);
  pg.addColorStop(0, '#7c8288');
  pg.addColorStop(0.4, '#565c62');
  pg.addColorStop(1, '#3c4146');
  c.fillStyle = pg;
  c.fillRect(poleX - 5, py(BOARD_BOTTOM + 0.3), 10, floorY - py(BOARD_BOTTOM + 0.3));

  // base plate
  c.fillStyle = '#3c4146';
  c.fillRect(poleX - 14, floorY - 5, 28, 5);

  // support arm
  c.strokeStyle = '#565c62';
  c.lineWidth = 6;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(poleX, py(BOARD_BOTTOM + 0.3));
  c.lineTo(boardX + 3, py(BOARD_BOTTOM + 0.12));
  c.stroke();

  // tempered glass backboard, seen edge-on
  const bTop = py(BOARD_TOP);
  const bH = py(BOARD_BOTTOM) - bTop;
  const bg = c.createLinearGradient(boardX, bTop, boardX + 8, bTop + bH);
  bg.addColorStop(0, 'rgba(226, 240, 248, 0.95)');
  bg.addColorStop(0.5, 'rgba(198, 222, 236, 0.85)');
  bg.addColorStop(1, 'rgba(228, 242, 250, 0.95)');
  c.fillStyle = bg;
  c.fillRect(boardX, bTop, 8, bH);

  c.strokeStyle = '#9aa3ab';
  c.lineWidth = 1.2;
  c.strokeRect(boardX + 0.5, bTop + 0.5, 7, bH - 1);

  // padded bottom edge
  c.fillStyle = '#2f3438';
  c.fillRect(boardX - 1, py(BOARD_BOTTOM) - 4, 10, 4);

  // ring bracket
  c.strokeStyle = '#b8480c';
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(rimR - 2, py(HOOP.y));
  c.lineTo(boardX, py(HOOP.y - 0.06));
  c.stroke();
}

function drawRing(c) {
  const rimL = px(HOOP.x - RIM_RADIUS);
  const rimR = px(HOOP.x + RIM_RADIUS);
  const y = py(HOOP.y);

  const g = c.createLinearGradient(0, y - 3, 0, y + 3);
  g.addColorStop(0, '#ff8b2d');
  g.addColorStop(0.5, '#e8620a');
  g.addColorStop(1, '#b4470a');
  c.strokeStyle = g;
  c.lineWidth = 6;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(rimL, y);
  c.lineTo(rimR, y);
  c.stroke();
}

// Filled silhouette rather than a stick figure -- gives the court human scale,
// so 2.0 m and 3.05 m read as heights instead of arbitrary numbers.
function drawShooter(c) {
  const floorY = py(0);
  const M = VIEW.pxPerMeter;
  const bx = px(LAUNCH.x) + 24;

  c.save();
  c.fillStyle = 'rgba(47, 54, 62, 0.7)';
  c.strokeStyle = 'rgba(47, 54, 62, 0.7)';
  c.lineCap = 'round';
  c.lineJoin = 'round';

  // legs first, so the torso overlaps them cleanly at the hip
  c.lineWidth = 0.13 * M;
  c.beginPath();
  c.moveTo(bx - 0.02 * M, py(1.02));
  c.lineTo(bx - 0.1 * M, py(0.52));
  c.lineTo(bx - 0.05 * M, floorY - 2);
  c.stroke();
  c.beginPath();
  c.moveTo(bx + 0.03 * M, py(1.02));
  c.lineTo(bx + 0.13 * M, py(0.56));
  c.lineTo(bx + 0.1 * M, floorY - 2);
  c.stroke();

  // torso
  c.beginPath();
  c.moveTo(bx - 0.11 * M, py(1.5));
  c.quadraticCurveTo(bx + 0.14 * M, py(1.32), bx + 0.08 * M, py(0.99));
  c.lineTo(bx - 0.08 * M, py(0.99));
  c.quadraticCurveTo(bx - 0.17 * M, py(1.26), bx - 0.11 * M, py(1.5));
  c.fill();

  // head, clear of both arms
  c.beginPath();
  c.arc(bx + 0.02 * M, py(1.68), 0.12 * M, 0, Math.PI * 2);
  c.fill();

  // shooting arm, up to the release point
  c.lineWidth = 0.1 * M;
  c.beginPath();
  c.moveTo(bx + 0.04 * M, py(1.46));
  c.lineTo(bx - 0.05 * M, py(1.74));
  c.lineTo(px(LAUNCH.x) + 5, py(LAUNCH.y) + 4);
  c.stroke();

  // guide hand, tucked low and left so it never crosses the face
  c.lineWidth = 0.085 * M;
  c.beginPath();
  c.moveTo(bx - 0.1 * M, py(1.44));
  c.lineTo(bx - 0.2 * M, py(1.58));
  c.lineTo(bx - 0.17 * M, py(1.78));
  c.stroke();
  c.restore();
}

function drawCourt(c, bulge) {
  drawBackground(c);
  drawFloor(c);
  drawFloorReflection(c, (cc) => {
    drawStructure(cc);
    drawShooter(cc);
  });
  drawShooter(c);
  drawStructure(c);
  drawNet(c, bulge);
  drawRing(c);
}

/* ------------------------------------------------------------------------ */
/* Measurements                                                               */
/* ------------------------------------------------------------------------ */

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
  c.fillStyle = 'rgba(255,255,255,0.94)';
  c.fillRect(left, y - 10, w + padX * 2, 20);
  c.strokeStyle = 'rgba(0,0,0,0.06)';
  c.lineWidth = 1;
  c.strokeRect(left, y - 10, w + padX * 2, 20);
  c.fillStyle = '#3c4043';
  c.fillText(text, x, y);
  c.restore();
}

// On-screen numbers must match the picture, or the stage stops being evidence.
function drawMeasurements(c) {
  const floorY = py(0);
  const poleX = px(HOOP.x + BOARD_FACE) + 48;

  c.strokeStyle = GUIDE;
  c.lineWidth = 1.5;

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

  const hx = poleX + 44;
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

  const lx = px(LAUNCH.x) + 46;
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

/* ------------------------------------------------------------------------ */
/* Ball and flight                                                            */
/* ------------------------------------------------------------------------ */

function drawArc(c, points, stroke, width, dash) {
  if (!points || points.length < 2) return;
  c.save();
  if (dash) c.setLineDash(dash);
  c.strokeStyle = stroke;
  c.lineWidth = width;
  c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(px(points[0].x), py(points[0].y));
  for (let i = 1; i < points.length; i++) c.lineTo(px(points[i].x), py(points[i].y));
  c.stroke();
  c.restore();
}

// Trail fades in towards the ball, so the eye is pulled to where the ball IS.
function drawTrail(c, points) {
  if (!points || points.length < 2) return;
  const a = points[0];
  const b = points[points.length - 1];
  const g = c.createLinearGradient(px(a.x), py(a.y), px(b.x), py(b.y));
  g.addColorStop(0, 'rgba(230, 145, 0, 0.08)');
  g.addColorStop(0.55, 'rgba(230, 145, 0, 0.42)');
  g.addColorStop(1, 'rgba(230, 145, 0, 0.88)');
  drawArc(c, points, g, 3.5);
}

function drawBallShadow(c, p) {
  const bx = px(p.x);
  const floorY = py(0);
  const r = BALL_RADIUS * VIEW.pxPerMeter * BALL_VISUAL_SCALE;
  if (bx < -r * 4 || bx > W + r * 4) return;

  const w = r * (1.5 + p.y * 0.14);
  const alpha = Math.max(0.04, 0.22 - p.y * 0.018);
  c.save();
  c.fillStyle = `rgba(50, 35, 18, ${alpha})`;
  c.beginPath();
  c.ellipse(bx, floorY - 1, w, w * 0.24, 0, 0, Math.PI * 2);
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

  // contact shading stays fixed to the light; only the leather turns
  const g = c.createRadialGradient(-r * 0.38, -r * 0.42, r * 0.1, 0, 0, r * 1.08);
  g.addColorStop(0, '#ffc774');
  g.addColorStop(0.45, '#f08f2c');
  g.addColorStop(0.85, '#d0651a');
  g.addColorStop(1, '#a44d12');
  c.fillStyle = g;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();

  c.save();
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.clip();
  c.rotate(spin);

  // pebbled leather
  c.globalAlpha = 0.75;
  c.drawImage(leatherTex, -r, -r, r * 2, r * 2);
  c.globalAlpha = 1;

  // seams: horizontal, vertical, and two bowed over the curve of the ball
  c.strokeStyle = 'rgba(58, 24, 0, 0.72)';
  c.lineWidth = Math.max(0.9, r * 0.13);
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

  // specular highlight
  const s = c.createRadialGradient(-r * 0.4, -r * 0.45, 0, -r * 0.4, -r * 0.45, r * 0.62);
  s.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
  s.addColorStop(1, 'rgba(255, 255, 255, 0)');
  c.fillStyle = s;
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();

  // darkened limb
  c.strokeStyle = 'rgba(110, 50, 8, 0.55)';
  c.lineWidth = 1;
  c.beginPath();
  c.arc(0, 0, r - 0.5, 0, Math.PI * 2);
  c.stroke();
  c.restore();
}

// How far the ball is into the net, 0..1. Drives the swish kick.
function netBulge(ball) {
  if (!ball) return 0;
  const dx = Math.abs(ball.x - HOOP.x);
  const below = HOOP.y - ball.y;
  if (dx > RIM_RADIUS + 0.15 || below < -0.1 || below > 0.55) return 0;
  return Math.max(0, 1 - Math.abs(below - 0.2) / 0.35);
}

function drawVelocityEcho(c, velocity) {
  c.save();
  c.font = '700 28px ui-monospace, SFMono-Regular, Menlo, monospace';
  c.textBaseline = 'top';
  const text = `v = ${velocity} m/s`;
  const w = c.measureText(text).width;
  c.fillStyle = 'rgba(26, 115, 232, 0.1)';
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
    textures();
    const canvas = ref.current;
    const c = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Where the ball is has to be known first: the net reacts to it.
    let shown = null;
    if (trajectory && trajectory.length) {
      const n = Math.max(2, Math.round(trajectory.length * Math.min(1, Math.max(0, progress))));
      shown = trajectory.slice(0, n);
    }
    const ball = shown ? shown[shown.length - 1] : null;
    const bulge = netBulge(ball);

    drawCourt(c, bulge);
    drawMeasurements(c);

    ghosts.forEach((g) => drawArc(c, g, 'rgba(95, 99, 104, 0.32)', 2, [6, 6]));

    if (shown && ball) {
      // Distance travelled drives the spin, so rotation slows with the ball.
      let dist = 0;
      for (let i = 1; i < shown.length; i++) {
        dist += Math.hypot(shown[i].x - shown[i - 1].x, shown[i].y - shown[i - 1].y);
      }
      drawBallShadow(c, ball);
      drawTrail(c, shown);
      drawBall(c, ball, -dist * SPIN_RAD_PER_M); // negative = backspin

      // In the net, the strands pass in front of the ball. Without this a swish
      // reads as the ball sailing past the hoop rather than dropping through.
      if (bulge > 0) drawNet(c, bulge);
    }

    if (velocity !== null) drawVelocityEcho(c, velocity);
  }, [velocity, trajectory, progress, ghosts]);

  return <canvas ref={ref} className="stage-canvas" style={{ width: W, height: H }} />;
}
