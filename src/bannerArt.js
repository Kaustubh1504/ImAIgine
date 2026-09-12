/**
 * Subject watermarks for the course card banners.
 *
 * Inline SVG encoded as a data URI, so it is a real background image with no
 * file to load and no network request -- the zero-request claim survives. Each
 * one is drawn in white at low opacity, so it reads on whatever band colour the
 * catalog gives the course.
 */
const VIEW = 'viewBox="0 0 150 92" xmlns="http://www.w3.org/2000/svg"';
const STROKE = 'stroke="%23fff" fill="none" stroke-width="2.2"';

const ART = {
  // orbiting electrons
  physics: `
    <g ${STROKE} opacity="0.3">
      <ellipse cx="78" cy="46" rx="36" ry="13"/>
      <ellipse cx="78" cy="46" rx="36" ry="13" transform="rotate(60 78 46)"/>
      <ellipse cx="78" cy="46" rx="36" ry="13" transform="rotate(120 78 46)"/>
    </g>
    <circle cx="78" cy="46" r="5.5" fill="%23fff" opacity="0.42"/>`,

  // axes with a plotted curve. NB: never interpolate STROKE into a tag that
  // also sets stroke-width -- a duplicate attribute is fatal to the XML parse
  // and the whole watermark silently disappears.
  maths: `
    <g stroke="%23fff" fill="none" stroke-width="1.3" opacity="0.26">
      <path d="M30 18 V80"/><path d="M52 18 V80"/><path d="M74 18 V80"/>
      <path d="M96 18 V80"/><path d="M118 18 V80"/>
      <path d="M22 28 H126"/><path d="M22 48 H126"/><path d="M22 68 H126"/>
    </g>
    <path d="M24 80 C46 18, 78 18, 128 60" stroke="%23fff" fill="none" stroke-width="2.8" opacity="0.42" stroke-linecap="round"/>`,

  // benzene ring
  chemistry: `
    <g ${STROKE} opacity="0.3">
      <polygon points="78,16 104,31 104,61 78,76 52,61 52,31"/>
      <circle cx="78" cy="46" r="14"/>
      <path d="M52 31 L34 21"/><path d="M104 61 L122 71"/>
    </g>`,

  // double helix
  biology: `
    <g ${STROKE} opacity="0.3" stroke-linecap="round">
      <path d="M56 12 C88 30, 56 62, 88 80"/>
      <path d="M88 12 C56 30, 88 62, 56 80"/>
      <path d="M62 22 H82"/><path d="M60 38 H84"/>
      <path d="M60 54 H84"/><path d="M62 70 H82"/>
    </g>`,
};

// Anything without its own glyph gets a neutral contour pattern rather than a
// blank band, so a new subject never looks broken.
const FALLBACK = `
  <g ${STROKE} opacity="0.22">
    <path d="M20 74 C50 46, 76 46, 130 26"/>
    <path d="M20 84 C50 56, 76 56, 130 36"/>
    <path d="M20 64 C50 36, 76 36, 130 16"/>
  </g>`;

export function bannerArt(courseId) {
  const body = ART[courseId] || FALLBACK;
  const svg = `<svg ${VIEW}>${body}</svg>`.replace(/\s+/g, ' ').trim();
  return `url("data:image/svg+xml,${svg.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'").replace(/#/g, '%23')}")`;
}
