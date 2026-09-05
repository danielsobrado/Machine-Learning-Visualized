import {
  ADJUSTMENT_PRESETS,
  CANONICAL_PATHS,
  CAUSAL_EDGES,
  FRONT_DOOR_SCENARIOS,
  M_BIAS_EDGES,
  M_BIAS_PATH,
} from './causalGraphConstants.js';

function edgeExists(edges, from, to) {
  return edges.some(([source, target]) => source === from && target === to);
}

function validateAdjustment(adjustment) {
  if (!Array.isArray(adjustment)) throw new TypeError('adjustment must be an array');
  const allowed = new Set(['C', 'M', 'S']);
  adjustment.forEach((node) => {
    if (!allowed.has(node)) throw new RangeError(`Unsupported adjustment node: ${node}`);
  });
}

function isCollider(edges, previous, current, next) {
  return edgeExists(edges, previous, current) && edgeExists(edges, next, current);
}

function isPathActiveWithEdges(pathNodes, edges, adjustment = []) {
  if (!Array.isArray(pathNodes) || pathNodes.length < 2) throw new TypeError('pathNodes must contain at least two nodes');
  const adjusted = new Set(adjustment);

  for (let index = 1; index < pathNodes.length - 1; index += 1) {
    const previous = pathNodes[index - 1];
    const current = pathNodes[index];
    const next = pathNodes[index + 1];
    const collider = isCollider(edges, previous, current, next);

    if (collider && !adjusted.has(current)) return false;
    if (!collider && adjusted.has(current)) return false;
  }

  return true;
}

export function isPathActive(pathNodes, adjustment = []) {
  validateAdjustment(adjustment);
  return isPathActiveWithEdges(pathNodes, CAUSAL_EDGES, adjustment);
}

export function analyzeAdjustment(adjustment = []) {
  validateAdjustment(adjustment);
  const paths = CANONICAL_PATHS.map((path) => ({
    ...path,
    active: isPathActiveWithEdges(path.nodes, CAUSAL_EDGES, adjustment),
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

export function analyzeMBias(conditionCollider = false) {
  const adjustment = conditionCollider ? ['K'] : [];
  const active = isPathActiveWithEdges(M_BIAS_PATH.nodes, M_BIAS_EDGES, adjustment);
  return {
    conditionCollider,
    active,
    path: { ...M_BIAS_PATH, active },
    verdict: active
      ? 'Conditioning on K opens the M-shaped non-causal path and can create M-bias.'
      : 'Leaving collider K unconditioned keeps the M-shaped non-causal path blocked.',
  };
}

export function analyzeFrontDoor(scenarioId = 'valid') {
  const scenario = FRONT_DOOR_SCENARIOS[scenarioId];
  if (!scenario) throw new RangeError(`Unknown front-door scenario: ${scenarioId}`);

  const criteria = [
    {
      id: 'intercept-directed-paths',
      label: 'M intercepts every directed T → Y path',
      pass: !scenario.directBypass,
      detail: scenario.directBypass
        ? 'A direct T → Y path bypasses the mediator.'
        : 'All directed causal flow from T to Y passes through M.',
    },
    {
      id: 'treatment-mediator-backdoor',
      label: 'No unblocked backdoor path from T to M',
      pass: !scenario.treatmentMediatorConfounding,
      detail: scenario.treatmentMediatorConfounding
        ? 'A common cause of T and M confounds the first front-door stage.'
        : 'The T → M relationship has no open backdoor in this scenario.',
    },
    {
      id: 'mediator-outcome-backdoor',
      label: 'T blocks every backdoor path from M to Y',
      pass: !scenario.mediatorOutcomeConfounding,
      detail: scenario.mediatorOutcomeConfounding
        ? 'A mediator-outcome common cause remains open even after conditioning on T.'
        : 'Conditioning on T blocks the mediator-outcome backdoor path.',
    },
  ];
  const identified = criteria.every((criterion) => criterion.pass);

  return {
    scenarioId,
    scenario,
    criteria,
    identified,
    verdict: identified
      ? 'The front-door criterion is satisfied in this teaching graph.'
      : 'Front-door identification fails because at least one structural criterion is violated.',
  };
}
