// PERSON B OWNS THIS FILE. Stub — replace the literals, keep the shape.
// Everything here is static data. Nothing is computed, fetched, or generated.

export const COURSES = [
  {
    id: 'physics',
    name: 'Physics',
    grade: 'Grade 11',
    band: '#1A73E8',
    topicCount: 5,
    progress: '1 of 5 topics started',
    description: 'Motion, forces, and energy.',
    available: true,
  },
];

// keyed by course id
export const TOPICS = {
  physics: [
    {
      id: 'kinematics',
      name: 'Kinematics',
      description: 'How things move, before asking why.',
      subtopicCount: 4,
      available: true,
    },
  ],
};

// keyed by topic id
export const SUBTOPICS = {
  kinematics: [
    {
      id: 'projectile',
      name: 'Projectile Motion',
      objective: 'Work out the launch speed that puts the ball through the hoop.',
      equation: 'R = v² sin(2θ) / g',
      estTime: '10 min',
      available: true,
    },
  ],
};

export const findCourse = (id) => COURSES.find((c) => c.id === id);
export const findTopic = (courseId, id) =>
  (TOPICS[courseId] || []).find((t) => t.id === id);
export const findSubtopic = (topicId, id) =>
  (SUBTOPICS[topicId] || []).find((s) => s.id === id);
