// PERSON B OWNS THIS FILE.
// Static course structure. Nothing here is computed, fetched, or generated.
//
// Physics > Kinematics > Projectile Motion is the one populated path. Everything
// else is set dressing: visible, dimmed, not clickable. It exists so the
// navigation reads as a real product and so the one-engine-many-subjects claim
// has something to point at.
//
// Physics constants and equations are NOT here — they come from contract.js via
// equation.js. Never restate a constant in a content file.

export const COURSES = [
  {
    id: 'physics',
    name: 'Physics',
    grade: 'Grade 11',
    section: 'Section B',
    students: 32,
    teacher: 'Ms. Anand',
    band: '#4338ca',
    description: 'Motion, forces, and energy.',
    topicCount: 5,
    progress: '1 of 5 topics started',
    available: true,
  },
  {
    id: 'maths',
    name: 'Mathematics',
    grade: 'Grade 11',
    section: 'Section B',
    students: 32,
    teacher: 'Ms. Anand',
    band: '#0f766e',
    description: 'Functions, trigonometry, and rates of change.',
    topicCount: 6,
    progress: 'Not started',
    available: false,
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    grade: 'Grade 11',
    section: 'Section A',
    students: 29,
    teacher: 'Mr. Okafor',
    band: '#b45309',
    description: 'Reactions, moles, and equilibrium.',
    topicCount: 5,
    progress: 'Not started',
    available: false,
  },
  {
    id: 'biology',
    name: 'Biology',
    grade: 'Grade 11',
    section: 'Section A',
    students: 29,
    teacher: 'Mr. Okafor',
    band: '#9d174d',
    description: 'Genetics, cells, and inheritance.',
    topicCount: 4,
    progress: 'Not started',
    available: false,
  },
];

// keyed by course id
export const TOPICS = {
  physics: [
    {
      id: 'kinematics',
      name: 'Kinematics',
      description: 'How things move, before asking why.',
      icon: '📐',
      subtopicCount: 4,
      meta: '1 of 4 ready',
      available: true,
    },
    {
      id: 'forces',
      name: 'Forces and Motion',
      description: "Newton's laws, friction, and free-body diagrams.",
      icon: '🧲',
      subtopicCount: 5,
      available: false,
    },
    {
      id: 'energy',
      name: 'Energy',
      description: 'Work, power, and conservation.',
      icon: '⚡',
      subtopicCount: 4,
      available: false,
    },
    {
      id: 'waves',
      name: 'Waves',
      description: 'Oscillation, frequency, and interference.',
      icon: '🌊',
      subtopicCount: 4,
      available: false,
    },
    {
      id: 'circuits',
      name: 'Electricity and Circuits',
      description: 'Current, resistance, and series versus parallel.',
      icon: '🔌',
      subtopicCount: 4,
      available: false,
    },
  ],
};

// keyed by topic id
export const SUBTOPICS = {
  kinematics: [
    {
      id: 'projectile',
      name: 'Projectile Motion',
      icon: '🏀',
      blurb: 'Work out how fast to throw, then watch it happen.',
      objective:
        'Solve for the launch speed that puts a ball through a hoop, given a fixed launch angle and a release point above the ground.',
      prereqs: [
        'Splitting a velocity into horizontal and vertical components',
        'Reading sine, cosine, and tangent of a given angle',
        'Rearranging an equation with a squared term',
      ],
      studentSteps: [
        'Predict what will happen before calculating anything.',
        'Solve for the launch speed and enter it.',
        'Shoot — the ball flies with your number.',
        'If it misses, work out which part of your reasoning was wrong.',
      ],
      estTime: '10 min',
      available: true,
    },
    {
      id: 'speed',
      name: 'Speed and Velocity',
      icon: '🚗',
      blurb: 'Distance over time, and why direction matters.',
      available: false,
    },
    {
      id: 'accel',
      name: 'Acceleration',
      icon: '📈',
      blurb: 'How quickly velocity itself changes.',
      available: false,
    },
    {
      id: 'dtgraph',
      name: 'Distance–Time Graphs',
      icon: '📊',
      blurb: 'Reading motion off a gradient.',
      available: false,
    },
  ],
};

export const findCourse = (id) => COURSES.find((c) => c.id === id);
export const findTopic = (courseId, id) =>
  (TOPICS[courseId] || []).find((t) => t.id === id);
export const findSubtopic = (topicId, id) =>
  (SUBTOPICS[topicId] || []).find((s) => s.id === id);
