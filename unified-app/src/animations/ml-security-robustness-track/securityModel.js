import {
  ATTACK_CASES,
  BENIGN_CASES,
  DEFAULT_SCENARIO,
  DEFENSE_PROFILES,
  LAYER_EFFECTIVENESS,
  LAYERS,
} from './securityConfig.js';

const SUCCESS_THRESHOLD = 0.44;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function profileById(profileId) {
  return DEFENSE_PROFILES.find((profile) => profile.id === profileId) ?? DEFENSE_PROFILES[0];
}

function attackScale(attackPressure) {
  return 0.55 + clamp(attackPressure / 100) * 0.75;
}

function defenseScale(strictness) {
  return 0.45 + clamp(strictness / 100) * 0.75;
}

export function evaluateAttack(testCase, scenario = DEFAULT_SCENARIO, profile = profileById(scenario.profileId)) {
  let residual = clamp(testCase.strength * attackScale(scenario.attackPressure), 0, 1.25);
  const layerTrace = [];

  profile.layers.forEach((layerId) => {
    const baseEffect = LAYER_EFFECTIVENESS[layerId]?.[testCase.vector] ?? 0;
    const appliedEffect = clamp(baseEffect * defenseScale(scenario.strictness), 0, 0.92);
    residual *= 1 - appliedEffect;
    layerTrace.push({ layerId, appliedEffect, residual });
  });

  const success = residual >= SUCCESS_THRESHOLD;
  const sensitivity = clamp(scenario.sensitiveData / 100);
  const sensitiveExposure = success ? testCase.privacy * sensitivity : 0;

  return {
    ...testCase,
    residual,
    success,
    blocked: !success,
    sensitiveExposure,
    layerTrace,
  };
}

export function evaluateBenign(testCase, scenario = DEFAULT_SCENARIO, profile = profileById(scenario.profileId)) {
  const strictness = clamp(scenario.strictness / 100);
  const layerLoad = profile.layers.length / Math.max(1, LAYERS.length);
  const blockScore = testCase.friction * strictness * (0.55 + layerLoad * 0.85);
  const blocked = blockScore >= 0.48;

  return {
    ...testCase,
    blockScore,
    blocked,
    allowed: !blocked,
  };
}

export function evaluateProfile(scenario = DEFAULT_SCENARIO, profileId = scenario.profileId) {
  const profile = profileById(profileId);
  const attacks = ATTACK_CASES.map((testCase) => evaluateAttack(testCase, scenario, profile));
  const benign = BENIGN_CASES.map((testCase) => evaluateBenign(testCase, scenario, profile));
  const successes = attacks.filter((testCase) => testCase.success);
  const allowedBenign = benign.filter((testCase) => testCase.allowed);
  const sensitiveExposure = successes.reduce((sum, testCase) => sum + testCase.sensitiveExposure, 0);
  const maxSensitiveExposure = ATTACK_CASES.reduce((sum, testCase) => sum + testCase.privacy, 0)
    * clamp(scenario.sensitiveData / 100);

  return {
    profile,
    attacks,
    benign,
    metrics: {
      attackSuccessRate: successes.length / ATTACK_CASES.length,
      blockedAttackRate: 1 - successes.length / ATTACK_CASES.length,
      benignPassRate: allowedBenign.length / BENIGN_CASES.length,
      falsePositiveRate: 1 - allowedBenign.length / BENIGN_CASES.length,
      sensitiveExposureRate: maxSensitiveExposure > 0 ? sensitiveExposure / maxSensitiveExposure : 0,
      attackSuccesses: successes.length,
      benignBlocked: benign.length - allowedBenign.length,
    },
  };
}

export function compareProfiles(scenario = DEFAULT_SCENARIO) {
  return DEFENSE_PROFILES.map((profile) => evaluateProfile(scenario, profile.id));
}

export function familyBreakdown(profileEvaluation) {
  const grouped = new Map();

  profileEvaluation.attacks.forEach((testCase) => {
    if (!grouped.has(testCase.family)) grouped.set(testCase.family, []);
    grouped.get(testCase.family).push(testCase);
  });

  return [...grouped.entries()].map(([family, cases]) => ({
    family,
    attempts: cases.length,
    successes: cases.filter((testCase) => testCase.success).length,
    successRate: cases.filter((testCase) => testCase.success).length / cases.length,
  }));
}

export function layerAblations(scenario = DEFAULT_SCENARIO) {
  const fullProfile = profileById('defense-in-depth');
  const baseline = evaluateProfile(scenario, fullProfile.id);

  return LAYERS.map((layer) => {
    const profile = {
      id: `without-${layer.id}`,
      label: `Without ${layer.label}`,
      layers: fullProfile.layers.filter((layerId) => layerId !== layer.id),
    };
    const attacks = ATTACK_CASES.map((testCase) => evaluateAttack(testCase, scenario, profile));
    const successes = attacks.filter((testCase) => testCase.success).length;
    return {
      layer,
      attackSuccessRate: successes / ATTACK_CASES.length,
      delta: successes / ATTACK_CASES.length - baseline.metrics.attackSuccessRate,
    };
  });
}

export function buildSecurityLab(scenario = DEFAULT_SCENARIO) {
  const comparisons = compareProfiles(scenario);
  const selected = comparisons.find((evaluation) => evaluation.profile.id === scenario.profileId) ?? comparisons[0];
  return {
    scenario,
    comparisons,
    selected,
    families: familyBreakdown(selected),
    ablations: layerAblations(scenario),
  };
}
