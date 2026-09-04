import { ADJUSTMENT_PRESETS, CANONICAL_PATHS, CAUSAL_EDGES } from './causalGraphConstants.js';

function edgeExists(from, to) {
  return CAUSAL_EDGES.some(([source, target]) => source === from && target === to);
}

function validateAdjustment(adjustment) {
  if (!Array.isArray(adjustment)) throw new TypeError('adjustment must be an array');
  const allowed = new Set(['C', 'M', 'S']);
  adjustment.forEach((node) => {
    if (!allowed.has(node)) throw new RangeError(`Unsupported adjustment node: ${node}`);
  });
}

function isCollider(previous, current, next) {
  return edgeExists(previous, current) && edgeExists(next, current);
}

export function isPathActive(pathNodes, adjustment = []) {
  validateAdjustment(adjustment);
  if (!Array.isArray(pathNodes) || pathNodes.length < 2) throw new TypeError('pathNodes must contain at least two nodes');
  const adjusted = new Set(adjustment);

  for (let index = 1; index < pathNodes.length - 1; index += 1) {
    const previous = pathNodes[index - 1];
    const current = pathNodes[index];
    const next = pathNodes[index + 1];
    const collider = isCollider(previous, current, next);

    if (collider && !adjusted.has(current)) return false;
    if (!collider && adjusted.has(current)) return false;
  }

  return true;
}

export function analyzeAdjustment(adjustment = []) {
  validateAdjustment(adjustment);
  const paths = CANONICAL_PATHS.map((path) => ({
    ...path,
    active: isPathActive(path.nodes, adjustment),
  }));

  const causalPaths = paths.filter((path) => path.type === 'causal');
  const openBackdoors = paths.filter((path) => path.type === 'backdoor' && path.active);
  const openedColliders = paths.filter((path) => path.type === 'collider' && path.active);
  const blockedCausalPaths = causalPaths.filter((path) => !path.active);
  const totalEffectPreserved = blockedCausalPaths.length === 0;
  const validForTotalEffect = openBackdoors.length === 0 && openedColliders.length === 0 && totalEffectPreserved;

  return {
    adjustment: [...adjustment],
    paths,
    openBackdoors,
    openedColliders,
    blockedCausalPaths,
    totalEffectPreserved,
    validForTotalEffect,
    verdict: validForTotalEffect
      ? 'Valid adjustment for the total effect in this teaching DAG.'
      : openBackdoors.length > 0
        ? 'A non-causal backdoor path remains open.'
        : openedColliders.length > 0
          ? 'Conditioning opened a collider path.'
          : 'The adjustment blocks part of the causal effect you are trying to estimate.',
  };
}

export function analyzePreset(presetId) {
  const preset = ADJUSTMENT_PRESETS.find((item) => item.id === presetId);
  if (!preset) throw new RangeError(`Unknown preset: ${presetId}`);
  return { preset, ...analyzeAdjustment(preset.nodes) };
}
