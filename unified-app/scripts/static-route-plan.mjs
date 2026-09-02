import { allAnimations } from '../src/data/animations.js';
import { glossaryTerms } from '../src/data/glossaryRepository.js';
import { getLessonStaticRouteParts } from '../src/data/lessonSections.js';

export function toStaticRouteDirectories(animations = allAnimations, terms = glossaryTerms) {
  const animationRoutes = animations.flatMap((animation) => getLessonStaticRouteParts(animation.id));
  const glossaryRoutes = terms.map((term) => ['glossary', term.slug]);

  return [['labs'], ['settings'], ['glossary'], ...animationRoutes, ...glossaryRoutes];
}
