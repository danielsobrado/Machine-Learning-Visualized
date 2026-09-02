import { allAnimations } from '../src/data/animations.js';

export const APP_BASE_PATH = (process.env.CURRICULUM_SMOKE_BASE || '/Machine-Learning-Visualized').replace(/\/+$/, '');

export const EXPLICIT_ROUTES = [
  '/',
  '/labs',
  '/settings',
  '/glossary',
  '/animation/matrix-multiplication',
  '/animation/linear-regression',
  '/animation/linear-regression/questions',
  '/animation/linear-regression/glossary',
  '/animation/linear-regression/code',
  '/animation/linear-regression/deep-dive',
  '/animation/kv-cache/questions',
  '/animation/kv-cache/concept-map',
  '/animation/cross-validation',
  '/animation/feature-scaling-preprocessing',
  '/animation/transformer-token-generation',
  '/animation/rag-vector-indexing',
  '/animation/value-iteration',
  '/animation/diffusion-basics',
];

export function toUniqueRoutes(animations = allAnimations) {
  const allAnimationRoutes = animations.map((animation) => `/animation/${animation.id}`);
  return [...new Set([...EXPLICIT_ROUTES, ...allAnimationRoutes])];
}

export function normalizeRoute(route, basePath = APP_BASE_PATH) {
  if (route === '/') {
    return `${basePath}/`;
  }

  const normalized = route.startsWith(`${basePath}/`)
    ? route
    : `${basePath}${route.startsWith('/') ? route : `/${route}`}`;

  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}
