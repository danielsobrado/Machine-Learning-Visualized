export const DEFAULT_LESSON_SECTION_ID = 'lesson';

export const LESSON_SECTIONS = Object.freeze([
  Object.freeze({
    id: 'lesson',
    label: 'Lesson',
    description: 'Visual explanation',
    path: '',
  }),
  Object.freeze({
    id: 'questions',
    label: 'Lesson Check',
    description: 'Questions & scenarios',
    path: 'questions',
  }),
  Object.freeze({
    id: 'concept-map',
    label: 'Concept Map',
    description: 'Connect the ideas',
    path: 'concept-map',
  }),
  Object.freeze({
    id: 'glossary',
    label: 'Glossary',
    description: 'Key terms',
    path: 'glossary',
  }),
  Object.freeze({
    id: 'code',
    label: 'Code Lab',
    description: 'Practice by coding',
    path: 'code',
  }),
  Object.freeze({
    id: 'deep-dive',
    label: 'Deep Dive',
    description: 'Failure modes and papers',
    path: 'deep-dive',
    optional: true,
  }),
]);

const SECTION_BY_ID = new Map(LESSON_SECTIONS.map((section) => [section.id, section]));
const SECTION_ID_BY_PATH = new Map(
  LESSON_SECTIONS.filter((section) => section.path).map((section) => [section.path, section.id]),
);

export function getLessonSection(sectionId) {
  return SECTION_BY_ID.get(sectionId) || null;
}

export function getLessonSectionPath(lessonId, sectionId = DEFAULT_LESSON_SECTION_ID) {
  const section = getLessonSection(sectionId);
  if (!section) {
    throw new Error(`Unknown lesson section: ${sectionId}`);
  }

  const basePath = `/animation/${encodeURIComponent(lessonId)}`;
  return section.path ? `${basePath}/${section.path}` : basePath;
}

export function getLessonSectionId(pathname, lessonId) {
  const basePath = `/animation/${encodeURIComponent(lessonId)}`;
  const baseIndex = pathname.indexOf(basePath);
  if (baseIndex === -1) return null;

  const suffix = pathname
    .slice(baseIndex + basePath.length)
    .replace(/^\/+|\/+$/g, '');

  if (!suffix) return DEFAULT_LESSON_SECTION_ID;
  return SECTION_ID_BY_PATH.get(suffix) || null;
}

export function getLessonStaticRouteParts(lessonId) {
  return LESSON_SECTIONS.map((section) => [
    'animation',
    lessonId,
    ...(section.path ? [section.path] : []),
  ]);
}
