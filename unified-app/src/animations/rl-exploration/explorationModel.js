function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function normal(random) {
  const u1 = Math.max(Number.EPSILON, random());
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function epsilonAt(step, start, end, decaySteps) {
  if (![step, start, end, decaySteps].every(Number.isFinite)) throw new TypeError('epsilon schedule inputs must be finite');
  if (start < 0 || start > 1 || end < 0 || end > 1) throw new RangeError('epsilon must be in [0, 1]');
  if (decaySteps <= 0) return end;
  const progress = Math.min(1, Math.max(0, step / decaySteps));
  return start + (end - start) * progress;
}

export function epsilonGreedyProbabilities(estimates, epsilon) {
  if (!Array.isArray(estimates) || estimates.length === 0 || estimates.some((value) => !Number.isFinite(value))) {
    throw new TypeError('estimates must be a non-empty finite array');
  }
  if (!Number.isFinite(epsilon) || epsilon < 0 || epsilon > 1) throw new RangeError('epsilon must be in [0, 1]');
  const max = Math.max(...estimates);
  const greedy = estimates.map((value, index) => value === max ? index : -1).filter((index) => index >= 0);
  const base = epsilon / estimates.length;
  return estimates.map((_, index) => base + (greedy.includes(index) ? (1 - epsilon) / greedy.length : 0));
}

export function updateEstimate(current, reward, count, mode, constantAlpha) {
  if (![current, reward, count, constantAlpha].every(Number.isFinite)) throw new TypeError('estimate inputs must be finite');
  if (count <= 0) throw new RangeError('count must be positive');
  const alpha = mode === 'constant' ? constantAlpha : 1 / count;
  if (!Number.isFinite(alpha) || alpha <= 0 || alpha > 1) throw new RangeError('step size must be in (0, 1]');
  return current + alpha * (reward - current);
}

function meansForStep(scenario, step) {
  if (scenario.meansAfter && scenario.changeStep !== null && step >= scenario.changeStep) return scenario.meansAfter;
  return scenario.meansBefore;
}

export function simulateBandit({
  scenario,
  steps,
  epsilonStart,
  epsilonEnd,
  decaySteps,
  initialValue,
  stepSizeMode,
  constantAlpha,
  seed,
}) {
  if (!scenario || !Array.isArray(scenario.meansBefore)) throw new TypeError('scenario is required');
  if (!Number.isInteger(steps) || steps <= 0) throw new RangeError('steps must be positive');
  const armCount = scenario.meansBefore.length;
  if (scenario.meansAfter && scenario.meansAfter.length !== armCount) throw new RangeError('before/after means must have equal length');
  const estimates = Array.from({ length: armCount }, () => initialValue);
  const counts = Array.from({ length: armCount }, () => 0);
  const random = mulberry32(seed);
  const history = [];
  let cumulativeReward = 0;
  let cumulativeRegret = 0;
  let optimalSelections = 0;
  let randomSelections = 0;

  for (let step = 0; step < steps; step += 1) {
    const means = meansForStep(scenario, step);
    const epsilon = epsilonAt(step, epsilonStart, epsilonEnd, decaySteps);
    const probabilities = epsilonGreedyProbabilities(estimates, epsilon);
    const greedyMax = Math.max(...estimates);
    const greedyArms = estimates.map((value, index) => value === greedyMax ? index : -1).filter((index) => index >= 0);
    const selectedViaRandomBranch = random() < epsilon;
    const arm = selectedViaRandomBranch
      ? Math.min(armCount - 1, Math.floor(random() * armCount))
      : greedyArms[Math.min(greedyArms.length - 1, Math.floor(random() * greedyArms.length))];
    const exploitationProbabilityForArm = greedyArms.includes(arm) ? (1 - epsilon) / greedyArms.length : 0;
    if (selectedViaRandomBranch) randomSelections += 1;

    const reward = means[arm] + scenario.noiseStd * normal(random);
    counts[arm] += 1;
    estimates[arm] = updateEstimate(estimates[arm], reward, counts[arm], stepSizeMode, constantAlpha);
    const bestMean = Math.max(...means);
    const bestArm = means.indexOf(bestMean);
    cumulativeReward += reward;
    cumulativeRegret += bestMean - means[arm];
    if (arm === bestArm) optimalSelections += 1;

    if (step < 20 || step % Math.max(1, Math.floor(steps / 60)) === 0 || step === steps - 1) {
      history.push({
        step: step + 1,
        epsilon,
        arm,
        reward,
        cumulativeReward,
        cumulativeRegret,
        optimalRate: optimalSelections / (step + 1),
        estimates: [...estimates],
        counts: [...counts],
        bestArm,
        selectedViaRandomBranch,
        exploitationProbabilityForArm,
        probabilities,
      });
    }
  }

  const finalMeans = meansForStep(scenario, steps - 1);
  const finalBestArm = finalMeans.indexOf(Math.max(...finalMeans));
  return {
    estimates,
    counts,
    history,
    cumulativeReward,
    cumulativeRegret,
    optimalActionRate: optimalSelections / steps,
    randomBranchRate: randomSelections / steps,
    finalBestArm,
    learnedBestArm: estimates.indexOf(Math.max(...estimates)),
    nonGreedyProbabilityWhenUnique: epsilonStart * (armCount - 1) / armCount,
  };
}
