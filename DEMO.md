# Demo script — ImAIgine

Target 2:40. Person B drives. Rehearse twice before the freeze.

## Before you stand up

- Chrome at **1280×720**, browser zoom **100%**. Every screen fits with no
  scrolling at that size; anything else and the projector clips.
- `npm run dev`, then walk 1 → 5 once to warm the render.
- **Sound on** — the toggle is bottom-right of the stage. Check the room's
  volume on a miss, not on the swish.
- Open the network tab and leave it on the Network panel. You will point at it.
- Have the **presenter presets** in view on the compute step: `Too hard (15)`,
  `Too soft (6)`, `Perfect (8.9)`, left to right. If live typing fumbles, click
  these instead. Never retype a number twice on stage.

## The path

Browse fast, then slow down on screen 5. The browse screens are context, not
content.

| Beat | Screen | What you do | What you say |
|---|---|---|---|
| 0:00 | 1 → 3 | Physics → Kinematics → Projectile Motion | "This is where a teacher already lives. Class, topic, activity." |
| 0:20 | 4 | Pause on the brief | "Grade 11. One equation. And the court on the right is the real thing, sitting still." |
| 0:30 | 4 → 5 | Click **Generate simulation** | "The activity gets built for this topic and this grade." *(the court is revealed behind the overlay — it takes about two seconds; **Skip** is there if you need it)* |
| 0:35 | 5 · Predict | Pick **Goes in**, confidence **Fairly sure** | "Before any maths, commit. Nothing is scored — it just makes the thinking visible." |
| 0:50 | 5 · Compute | Type **15** | "Here's a student who thinks harder is better." |
| 1:00 | 5 · Run | Shoot. **Say nothing.** | *(let the room watch it sail past the backboard and off the screen)* |
| 1:10 | 5 · Outcome | Let the banner sit | *(let them laugh — do not talk over it)* |
| 1:20 | 5 · Outcome | Point at the panel | "We never marked that wrong. There's no grading function in this codebase. The ball just did what 15 m/s does." |
| 1:35 | 5 · Explain | Open it, pick **"I thought throwing harder would always help"** | "This is the part a worksheet can't do. An airball tells you *that* you were wrong. This asks *which* idea was wrong." |
| 1:55 | 5 · Compute | Type **8.9** | "Same student, second attempt." |
| 2:05 | 5 · Run | Shoot → swish, confetti | *(let it land)* |
| 2:15 | 5 · Outcome | Point at the **ghost arc** | "That faded arc is their first attempt. The narrowing *is* the learning, and it's on screen." |
| 2:30 | — | Network tab | "Zero requests after load. Nothing here can fail on a conference network." |

## The three lines that matter

Say these even if you have to cut a beat to fit them in.

1. **"We don't grade you. Reality does."** There is no `isCorrect()` anywhere in
   the codebase. The student's number is the simulation's input and the outcome
   is the assessment.
2. **"A wrong answer has to be wrong in a *specific* way."** Everything
   collapsing teaches nothing. Overshooting by 4.73 m tells you which idea
   broke. That's why the ball keeps flying past the hoop instead of stopping.
3. **"An arithmetic slip is not a misconception."** One explain option is always
   "my reasoning was right, I just slipped." Conflating those two is how
   students get re-taught things they already understand.

## Learning-science framing (one slide line)

Consequential, immediate feedback on a student's own value turns an abstract
symbol into an observable outcome — but outcome feedback alone only tells a
student *that* they were wrong. The explain step is what converts it into
diagnostic feedback, which is the difference the research actually cares about.
Predictions are collected before calculation for the same reason: an unstated
belief cannot be corrected.

## Reliability points (say them, they score)

- **Zero network calls after load.** No LLM, no API, no CDN font, no icon set,
  no audio files. Sound is synthesized with Web Audio at runtime. A judge can
  verify it in the network tab in five seconds.
- **No physics engine.** Hand-rolled integration against a closed-form answer,
  with an acceptance test asserting 8.9 m/s swishes, 6 falls short, and 15 flies
  past the rim and off the right edge. `npm test` proves it.

## The vision line (spoken, not built)

One engine, many subjects. The court is a parameterised template — swap it for a
circuit and the same loop teaches Ohm's law, swap it for a population grid and it
teaches exponential growth. The dimmed rows on screens 1–3 are that roadmap.
**Do not claim these are built.** They are deliberately shown as "Coming soon".

## Be careful how you describe the generating beat

The overlay after **Generate simulation** does no network work and calls no
model — it sets up the court, the equation, and the numbers, which is exactly
what its copy says. Say **"the activity gets built for this topic and grade."**

Do **not** say or imply "our AI is generating this live." It is not, a judge may
well ask, and getting caught overclaiming costs more than the beat is worth.
If asked directly: *"Not at that moment — the activity is assembled from a
parameterised template. Authoring these is where a model belongs, and that's the
roadmap, not today's build."* That answer is stronger than the overclaim,
because it is the same argument as the one-engine-many-subjects vision.

## Two deliberate design choices, in case a judge probes

- **We never reveal the required speed on a miss.** Handing over 8.93 would
  delete the revise loop — the student would type it and learn nothing. The
  outcome describes what happened; the student solves it again.
- **The compute step shows no correctness feedback at all** — no colour, no
  checkmark, no hint. That is load-bearing, not an omission.

## If something breaks

| Problem | Do this |
|---|---|
| Generating overlay drags | Click **Skip** — it is there for exactly this |
| Typed number does not fire | Click the matching preset button instead |
| Animation stutters | Keep talking; the outcome banner still lands |
| No sound | Say "sound's off in here" and carry on — it is decoration |
| Confetti does not appear | Ignore it; do not mention it |
| Any screen scrolls | Reset browser zoom to 100% |
| Anything on 1–4 misbehaves | **Open cold on screen 5.** A flawless activity beats a shaky tour. |
