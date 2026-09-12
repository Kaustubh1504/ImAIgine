# CLAUDE.md — Shoot Your Shot

Read fully before writing code. Shared contract for a 2-person, 2-hour build.
Both people run Claude Code against this repo; the ownership rules are what keep
you from overwriting each other.

Sections 1–7 are shared — both people read them. Then read **only your own**
role section, and do not build from the other person's.

---

## 1. The pitch

A student can solve a projectile equation and still ask *"where would I ever use
this?"* — because the number they solved for didn't do anything. It sat on a page.

So the teacher opens a simulation of the same problem. The student types a launch
speed, the ball flies with *their* number, and the physics decides what happens.
Wrong answers aren't marked wrong; they miss, and the student watches them miss.

**Tagline: "We don't grade you. Reality does."**

No grader exists in this codebase. Nobody writes `isCorrect()`. The student's
number is the simulation's input and the outcome *is* the grade. The demo says
this out loud, so it has to be literally true.

---

## 2. Shape of the build

**One teacher, one class, one populated activity.** Everything else is set
dressing, and set dressing is static.

```
Screen 1  Class page      → Classroom-style banner + classwork list
Screen 2  Activity brief  → assignment-detail view, sets expectations
Screen 3  Activity        → simulation + step machine   ← the product
```

Since there's only one class, a class *picker* has nothing to pick — we open
directly on the class page, which is what Google Classroom looks like once you're
inside a course anyway. Topics and subtopics collapse into a single classwork
list for the same reason Classroom does it: expandable topic sections with
activities nested underneath.

**Grade level is Grade 11 everywhere.** Screen 2 states the grade and the math
must match it. A trig-based range equation at 50° is Class 11 material; a Grade 7
student hasn't met sin, cos, or velocity decomposition. An education judge catches
that instantly and it lands on exactly the claim being judged.

---

## 3. Stack and hard constraints

- Vite + React, **plain JavaScript, no TypeScript**
- **No router.** Three screens, one state object in `App.jsx`. `react-router-dom`
  is a dependency, a lockfile change, and merge pain for zero benefit.
- **No network, at all.** No `fetch()`, no CDN `<script>`, no web fonts from
  `fonts.googleapis.com`, no CDN icon sets. The demo claims zero network calls
  and a judge can verify it in the network tab in five seconds. Use a system font
  stack (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) — it renders
  as Roboto on Chromebooks anyway, the device in the pitch — and inline SVG or
  emoji for icons.
- **One install pass.** Person A installs `canvas-confetti` in the scaffold
  commit. After that nobody runs `npm install` again. `package.json` and the
  lockfile are the only shared files and a lockfile conflict at minute 90 is the
  worst possible time for one.
- Screen 3 must fit **1280×720 with no scrolling**. That's the projector.

Do not install: any physics engine, `three`, Tailwind/MUI/shadcn,
`howler`/`use-sound` (we synthesize audio), KaTeX/MathJax.

---

## 4. The one rule that prevents disaster

**All physics constants live in `src/contract.js`.** The simulation and the
correct-answer formula both import from it. If they drift, the correct answer
stops scoring and the demo's payoff dies on stage. Never hardcode `9.8`, `7.0`,
`3.05`, `50`, or `2.0` anywhere else. Frozen after Person A creates it — changing
a value means both people stop and re-run the acceptance test together.

```js
// SHARED. Person A creates this. Both people import from it. Frozen after creation.
export const G = 9.8;                       // m/s^2
export const LAUNCH = { x: 0, y: 2.0 };     // release point (meters)
export const HOOP   = { x: 7.0, y: 3.05 };  // rim center; 3.05m = regulation 10ft
export const FIXED_ANGLE = 50;              // angle GIVEN to the student (degrees)
export const RIM_RADIUS  = 0.23;
export const BALL_RADIUS = 0.12;
export const SWISH_TOL = 0.12;              // |error at rim| <= this => swish
export const RIM_TOL   = 0.28;              // <= this => rim rattle

// Sized so the 15 m/s demo shot stays on screen (it peaks at 8.74 m).
export const VIEW = { wMeters: 13.2, hMeters: 10.4, pxPerMeter: 50 };

/** @typedef {Object} ShotResult
 *  @property {'swish'|'rim'|'short'|'long'} outcome
 *  @property {{x:number,y:number}[]} trajectory
 *  @property {number} dy                 signed error at hoop x (ballY - HOOP.y)
 *  @property {number} enteredVelocity
 *  @property {number} correctVelocity  */
```

---

## 5. THE ACCEPTANCE TEST

Correct answer ≈ **8.93 m/s**. At 8.9 the ball is at 3.01 m reaching the hoop;
rim is 3.05; error 0.04 m, well inside `SWISH_TOL`.

```js
simulate({ velocity: 8.9, angle: 50 }).outcome === 'swish'
simulate({ velocity: 6,   angle: 50 }).outcome === 'short'   // lands at x ≈ 4.87
simulate({ velocity: 15,  angle: 50 }).outcome === 'long'    // 7.76 m at the rim
```

**If 8.9 is not a swish, nothing else matters.** Usually a degrees/radians
mix-up, gravity sign flipped, launch height ignored, or a constant hardcoded
instead of imported.

---

## 6. Prop signatures — must match exactly

```jsx
// Person A
<Stage          velocity={num|null} angle={num} shotId={num} onResult={fn} ghosts={ShotResult[]} />

// Person B
<ClassPage      role={str} onOpenActivity={fn} onRoleChange={fn} />
<ActivityBrief  role={str} onStart={fn} onBack={fn} />
<ReasoningPanel step={num} draft={str} onDraftChange={fn} result={ShotResult|null} />
<Reactions      result={ShotResult|null} score={{makes,attempts}} history={ShotResult[]} />
<Explain        result={ShotResult} onChoose={(id)=>void} />
```

Do not add required props. Do not rename props. Extra data goes inside `result`.

---

## 7. File ownership — touch only your files

| Person A — physics + activity | Person B — classroom + panels |
|---|---|
| `src/contract.js` | `src/theme.css` |
| `src/physics.js` | `src/classroom.js` |
| `src/Stage.jsx` | `src/screens/ClassPage.jsx` |
| `src/screens/Activity.jsx` | `src/screens/ActivityBrief.jsx` |
| `src/steps/*` except `Explain.jsx` | `src/ReasoningPanel.jsx` |
| `src/App.jsx` | `src/Reactions.jsx` + `src/reactions.css` |
| `package.json` (install pass only) | `src/steps/Explain.jsx` + `src/misconceptions.js` |
| | `DEMO.md` + slides |

If you need a change in a file you don't own, **ask.** Ownership doesn't overlap,
so the only way to create a merge conflict is to break this rule.
`git pull --rebase` before every push. Small commits, often.

**Person A should be your faster coder.** They unblock B in the first 15 minutes
and own the acceptance test, which is the single point of failure for the demo.

---
---

# PERSON A — physics, stage, step machine

## A · 0–15 min — SCAFFOLD, then push

Person B is idle until this lands. Do not start physics before pushing.

1. Vite + React, plain JS. `npm install canvas-confetti`. Confirm `npm run dev`.
2. Create `src/contract.js` exactly as in §4.
3. Create **stubs** for every file B owns, exporting the §6 signatures and
   rendering a labeled placeholder, so the app never crashes while B builds:

```jsx
export default function ClassPage({ role, onOpenActivity, onRoleChange }) {
  return <div style={{padding:40}}>ClassPage stub
    <button onClick={() => onOpenActivity('projectile')}>Open activity</button></div>;
}
export default function ActivityBrief({ role, onStart, onBack }) {
  return <div style={{padding:40}}>ActivityBrief stub
    <button onClick={onStart}>Start</button></div>;
}
export default function ReasoningPanel({ step, draft, onDraftChange, result }) {
  return <div>ReasoningPanel stub (step {step})</div>;
}
export default function Reactions({ result, score, history }) {
  return <div>Reactions stub</div>;
}
export default function Explain({ result, onChoose }) {
  return <button onClick={() => onChoose('stub')}>Explain stub</button>;
}
export const MISCONCEPTIONS = [];   // src/misconceptions.js
```

4. Commit, push, tell B it's ready.

## A · 15–35 min — src/physics.js

Export `simulate({ velocity, angle })` (angle in degrees) and `correctVelocity()`
— B imports the latter from you:

```js
// θ in radians, D = HOOP.x - LAUNCH.x = 7, h = HOOP.y - LAUNCH.y = 1.05
v = Math.sqrt( (G * D*D) / (2 * Math.cos(θ)**2 * (D*Math.tan(θ) - h)) )   // => 8.927
```

`simulate`:

1. `vx = v·cos(θ)`, `vy = v·sin(θ)`, start at `LAUNCH`.
2. Integrate at `dt = 0.005`: `x += vx*dt; y += vy*dt; vy -= G*dt`. Sample every
   few steps into a trajectory array.
3. **Record the height at `x = HOOP.x` by linear interpolation between the two
   straddling samples — but DO NOT STOP THERE.** Keep flying until `y <= 0`, or
   `x > VIEW.wMeters`, or `t > 6`.
4. `dy = ballY_at_hoop - HOOP.y`: `|dy| ≤ SWISH_TOL` → swish; `≤ RIM_TOL` → rim;
   `> RIM_TOL` → long; `< -RIM_TOL` → short; floor before the hoop → short.
5. On a swish, truncate shortly past the hoop so the ball drops through the net.
6. Return `{ outcome, trajectory, dy, enteredVelocity, correctVelocity }`.

> **Step 3 is the one people get wrong.** The script has the ball "flying way
> over the backboard." If you halt at `x = HOOP.x`, the ball freezes mid-air
> level with the rim and the laugh never comes. At 15 m/s it passes the rim
> 7.8 m up and lands 24 m out, exiting the right edge. That is correct.

**No physics engine.** The build rests on a closed-form answer landing inside a
0.12 m window; an engine brings its own integrator and tolerances and will
silently break that. Hand-rolled Euler is the right call, not a shortcut.

Meters internally, pixels only when drawing.

**Run the §5 acceptance test now. Do not write rendering code until it passes.**
Tell B the moment it does.

## A · 35–55 min — src/Stage.jsx

Canvas **660 × 520**, using `VIEW` — 1 m = 50 px, y flipped so up is up.

> **Do not raise `pxPerMeter`.** The first shot on stage is 15 m/s, peaking at
> 8.74 m. At a tempting 70 px/m the ball leaves the top of the frame immediately
> and nobody sees the arc. A slightly small court is the correct trade.

Draw floor line, simple player at `LAUNCH`, backboard + rim at `HOOP`, ball, and
**distance labels** so the numbers in the problem match the picture (B is showing
"7.0 m" in the reasoning panel; the stage has to agree).

When `shotId` changes and `velocity != null`: `simulate()`, animate along the
trajectory with `requestAnimationFrame` (~1.2 s to the hoop, let overshoots run
on), faint dotted trail, then `onResult(result)` **exactly once**.

**Echo the entered velocity on the stage during flight.** The whole point is that
the student's number drives the motion — make it visible.

Draw `ghosts` as faded arcs. A ball outside the view is simply not drawn — never
crash, never rescale. `velocity={null}` renders a clean static frame; B uses this
exact component on Screen 2.

**The stage renders no success/fail text and no sound.** That's B's Reactions
layer overlaid on top. You fly the ball and report.

## A · 55–80 min — Activity.jsx + step machine

Three regions, no scrolling at 1280×720: Stage (~⅔ width) with `<Reactions>`
overlaid, `<ReasoningPanel>` down the right at full height, step tracker strip
above the stage.

State: `step, velocity, shotId, result, history, score, draft, flying`.

```js
handleShoot(v) => setResult(null); setVelocity(v); setShotId(id=>id+1); setFlying(true); setStep(3)
handleResult(r) => setResult(r); setFlying(false); setStep(4);
                   setHistory(h => [...h, r]);
                   setScore(s => ({ makes: s.makes + (r.outcome==='swish'?1:0),
                                    attempts: s.attempts + 1 }))
```

Pass `ghosts={history.slice(-3)}` to Stage.

| # | Step | Demo | Build |
|---|---|---|---|
| 1 | **Predict** | ✅ | Three large choices (short / in / long) + 3-point confidence. Nothing scored. Store it to reference at step 4. |
| 2 | **Compute** | ✅ | Speed input, units labeled. **No hint, no validation, no correctness feedback.** Not a color, not a checkmark. This is the entire thesis. |
| 3 | **Run** | ✅ | "Shoot", disabled while `flying`. |
| 4 | **Outcome** | ✅ | Descriptive, not right/wrong: fell short by X m, overshot by X m, went in. Trajectory stays. **Do not reveal the ideal trajectory on a miss.** |
| 5 | **Explain** | ⚪ | B's `Explain.jsx`, rendered on a miss. `onChoose(id)` → targeted response → back to step 2. |
| 6 | **Revise** | ✅ | Back to step 2, input cleared. Ghost arcs accumulate. |
| 7 | **Transfer** | ❌ | First thing cut. Only if ahead at minute 95. |

**Preset buttons — build at minute 56, not 110.** In script order:
`Too hard (15)` · `Too soft (6)` · `Perfect (8.9)`, calling `handleShoot`
directly. Stage fallback if live typing fumbles, and your test harness until B's
panels land.

## A · src/App.jsx

```js
const [nav, setNav]   = useState({ screen: 1, activityId: null });
const [role, setRole] = useState('student');
```
Screen 1 → `ClassPage` · Screen 2 → `ActivityBrief` · Screen 3 → `Activity`.

## A · 95–110 — integration (yours)

1. Walk 1 → 2 → 3 at **1280×720** at demo zoom. Screen 3 must not scroll.
2. Run **15, then 6, then 8.9**, in that order, watching the screen, not the
   console. The 15 must visibly sail past the backboard and off the right edge;
   the 6 must drop short; the 8.9 must swish and tick the score.
3. Confirm B's real components slot in with no prop warnings.
4. Open the network tab, confirm **zero requests** after load.

If 8.9 stops swishing after integration, it's a constants mismatch — go straight
to `contract.js` and check nobody hardcoded a value.

---
---

# PERSON B — classroom shell, panels, reactions, demo

You own everything the audience looks at that isn't the ball. **You are never
blocked** — everything you own is either static or driven by a `result` object
you can fake.

## B · 0–15 min — design direction, while A scaffolds

Classroom-*inspired*, not a clone. Take the structure, shift the palette — if the
accent is Google blue, judges read it as a Classroom mockup rather than a product
that understands what teachers already use. Pick your own accent.

- **The class banner is the strongest single signal.** Wide header block, flat
  color field, class name large, section and teacher small beneath.
- Light neutral page background, white cards floating on it
- Cards/rows: ~8px radius, hairline border, soft shadow deepening on hover
- **Classwork list:** topic name as a section header with a thin rule under it,
  activity rows beneath with a circular leading icon, title, right-aligned meta.
  Topics expand and collapse.
- Row titles ~16px medium, secondary text ~14px muted
- Coming-soon rows: reduced opacity, no hover lift, small pill label

Local fonts and icons only (§3). Everything projects at 1280×720 — size type for
the back of the room.

## B · 15–35 min — classroom.js + ClassPage

`src/classroom.js` is literals only. No computation, no persistence, no
`localStorage`. Progress strings are static text — set dressing for a 2:40 demo.

```js
export const CLASS_INFO = {
  name: "Physics", grade: "Grade 11", section: "Section B · 32 students",
  teacher: "…", progress: "2 of 9 activities completed"
};

export const TOPICS = [
  { id:'kinematics', name:"Kinematics", expanded:true, activities:[
      { id:'projectile', title:"Projectile Motion",
        blurb:"Work out how fast to throw, then watch it happen.",
        meta:"~10 min", status:'ready' },
      { id:'speed',   title:"Speed and Velocity",     status:'soon' },
      { id:'accel',   title:"Acceleration",           status:'soon' },
      { id:'dtgraph', title:"Distance–Time Graphs",   status:'soon' },
  ]},
  { id:'forces', name:"Forces and Motion", expanded:false, activities:[ /* all soon */ ]},
  { id:'energy', name:"Energy",            expanded:false, activities:[ /* all soon */ ]},
  { id:'waves',  name:"Waves",             expanded:false, activities:[ /* all soon */ ]},
];
```

`ClassPage.jsx`: banner, then the classwork list, Kinematics expanded by default.
**Projectile Motion must be the most inviting row on the page** — full opacity,
clear icon, blurb visible, obvious hover action. Everything else dimmed, pilled
*Coming soon*, non-clickable.

Role toggle in the header: flips label text and shows the section-size line. That
is all it does — no auth, no separate teacher screens.

## B · 35–55 min — ActivityBrief + ReasoningPanel

`ActivityBrief.jsx`, two columns. **Left:** title, breadcrumb, **grade level
stated explicitly (Grade 11)**, learning objective in one sentence,
prerequisites, what the student will do in four short steps (predict, compute,
run, explain), and the actual equation. **Right:**
`<Stage velocity={null} angle={50} shotId={0} onResult={()=>{}} ghosts={[]} />` —
A's real component, nothing moving — with the action below it. Student: *Start
activity*. Teacher: *Present to class* + secondary *Preview alone*.

`ReasoningPanel.jsx`: scenario, given values, current step's input, and **the
equation visible at every step.** This is the panel the presenter points at
mid-demo — *"your number goes right into it, the whole curve changed"* — so there
has to be something worth pointing at. Styled HTML, monospace, large, the `v`
visually highlighted, the student's `draft` substituted live as they type:

```
y = 2.0 + v·sin(50°)·t − ½·(9.8)·t²        v = 15
```

No KaTeX — no time, and it's a dependency. Import `correctVelocity()` from
`physics.js`; never hardcode constants.

## B · 55–80 min — Reactions

**Build a fake-result harness first** so you're not waiting on anyone. Delete
before handoff:

```js
const fake = (outcome, v) => ({ outcome, dy:0, enteredVelocity:v, correctVelocity:8.93, trajectory:[] });
```

Overlay keyed to `result.outcome`; renders nothing (or just the scoreboard) when
`result` is null.

| outcome | reaction |
|---|---|
| `swish` | "SWISH! 🔥" + confetti + "NOTHING BUT NET" + cheer |
| `rim` | "OOH, RATTLED IN… 😬" + clang |
| `short` | "AIRBALL 🙈 — Physics said no." + buzzer |
| `long` | "WAY TOO STRONG 🚀 — that's in the parking lot" + whoosh |

Reality-check line under misses from `enteredVelocity` vs `correctVelocity`:
*"You threw 15.0 m/s. It needed 8.9."*

**Attempt log** from `history`: `15.0 → way long · 6.0 → airball · 8.9 → SWISH`.
The narrowing is the pedagogical claim in one glance.

Scoreboard: makes / attempts, obvious when it ticks.

The miss reaction needs **about a second of presence on its own** — the script
says *let people laugh, don't talk.* Don't make it so brief the room misses it.

**Sound: synthesize with Web Audio.** No audio files — nothing to fail on stage,
no network. Rising chord for swish, short high square-wave burst for rim,
descending buzzer for misses. Wrap every call in `try/catch`; audio must never
crash the app. Mute toggle. `canvas-confetti` is already installed; install
nothing else.

## B · 80–95 min — Explain (step 5)

`src/misconceptions.js` — options in student language, each mapped to a *named*
misunderstanding, not a generic wrong answer:

```js
export const MISCONCEPTIONS = [
  { id:'ignored_height', label:"I forgot the ball starts above the ground",
    response:"Releasing at 2.0 m means the ball only climbs 1.05 m, not 3.05 m. Try again with that." },
  { id:'harder_is_better', label:"I thought throwing harder always helps",
    response:"Past one speed the ball is still rising when it reaches the hoop. There's exactly one that arrives at rim height." },
  { id:'ignored_angle', label:"I didn't use the 50° angle",
    response:"The angle splits your speed into sideways and upward parts. Skipping it means solving a different problem." },
  { id:'arithmetic', label:"My reasoning was right, I just slipped on the arithmetic",
    response:"That happens. Re-run your numbers — the method was sound." },
];
```

**The last option is not optional.** Conflating a slip with a misconception is a
design failure, and this distinction is the most defensible pedagogy claim in the
build. Say it to judges even if the step doesn't get built.

`Explain.jsx`: options as cards, targeted response after a choice, then
`onChoose` hands back to A's step machine.

## B · DEMO.md and the slide

Demo path through screen 3:
**Predict → Compute (15) → Run → Outcome → Revise (6) → Revise (8.9) → swish.**

Predict improves the script: the student commits to "it'll go long," then watches
it go *very* long. Explain and Transfer don't fit 2:40 — mention them verbally.

Rehearse with the **preset buttons** (`15` · `6` · `8.9`, left to right) as the
fallback so a typo on stage can't sink the demo.

Slide into the Master Slides deck **before 4:00 PM** — editing closes 4:10. Needs:
one-line pitch, screenshot, the learning-science line, the no-network reliability
point, and the one-engine-many-subjects vision.

---
---

## 8. Timeline

| Time | A | B |
|---|---|---|
| 0–15 | Scaffold, install, `contract.js`, stubs, push | design direction, `theme.css` |
| 15–35 | `physics.js` + **acceptance test passing** | `classroom.js`, ClassPage |
| 35–55 | `Stage.jsx` + ghost arcs | ActivityBrief, ReasoningPanel |
| 55–80 | Step machine + preset buttons | Reactions + confetti + sound |
| 80–95 | Integration | Explain + `misconceptions.js` |
| 95–110 | Walk 1→3, then 15 / 6 / 8.9 in order | `DEMO.md`, slides |
| 110–120 | Freeze, rehearse twice | Submit slide before 4:00 |

## 9. Cut plan — in this order, without discussion

Transfer → confidence selector → role toggle (ship student-only) → Explain (keep
`misconceptions.js`, it's a talking point unbuilt) → sound → ghost arcs → Screen 2
(Screen 1 rows launch the activity directly).

**Never cut:** the acceptance test, the preset buttons, the always-visible
equation, the ball flying past the hoop on a miss, the confetti, or the
no-correctness-feedback rule on step 2.

If at minute 95 the path doesn't walk cleanly, **open the demo on Screen 3.** A
flawless activity beats a shaky tour.

**Out of scope:** any LLM or API call, authoring UI, persistence, auth, real
progress tracking, a second populated topic, mobile layout, dark mode, 3D, air
resistance. The braking-distance / circuits / orbital-velocity vision is **spoken,
not code.**

## 10. Rules for Claude Code

1. Only edit files in your ownership column.
2. Never hardcode a physics constant. Import from `contract.js`.
3. Never write a grading function. The simulation is the grade.
4. Step 2 shows no correctness feedback. Not a hint, not a color, not a checkmark.
5. Never add a package, a CDN script, a web font, a CDN icon set, or a `fetch()`.
6. Never add TypeScript. Never add a router.
7. Never stop the simulation at the hoop on a miss — the overshoot is the joke.
8. Never raise `pxPerMeter` above 50 — the 15 m/s shot leaves the frame.
9. Screens 1 and 2 are static. Writing logic there means you're off-plan.
10. Screen 3 must fit 1280×720 with no scrolling.
11. If `simulate({velocity:8.9, angle:50})` isn't a swish, fix that first.
12. Prefer the boring working version. This ships in two hours.