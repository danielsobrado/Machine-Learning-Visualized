function assertFinite(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

function clampProbability(value) {
  return Math.min(1 - 1e-12, Math.max(1e-12, value));
}

export function compareDebuggingHypotheses({
  baseline,
  hypotheses,
  targetMetric,
  guardrailMetric,
  collateralMetric,
  minTargetGain,
  maxGuardrailDrop,
  maxCollateralDrop,
}) {
  const evaluated = hypotheses.map((hypothesis) => {
    const targetGain = hypothesis.metrics[targetMetric] - baseline[targetMetric];
    const guardrailDrop = baseline[guardrailMetric] - hypothesis.metrics[guardrailMetric];
    const collateralDrop = baseline[collateralMetric] - hypothesis.metrics[collateralMetric];
    const passes = targetGain >= minTargetGain
      && guardrailDrop <= maxGuardrailDrop
      && collateralDrop <= maxCollateralDrop;
    const score = targetGain - (Math.max(0, guardrailDrop) * 2) - Math.max(0, collateralDrop);
    return Object.freeze({ ...hypothesis, targetGain, guardrailDrop, collateralDrop, passes, score });
  });

  const best = evaluated.reduce((current, candidate) => {
    if (!current) return candidate;
    if (candidate.passes !== current.passes) return candidate.passes ? candidate : current;
    return candidate.score > current.score ? candidate : current;
  }, null);

  return Object.freeze({ evaluated: Object.freeze(evaluated), best });
}

export function deduplicateAlerts({ alerts, windowMinutes }) {
  assertFinite(windowMinutes, 'windowMinutes');
  if (windowMinutes < 0) throw new RangeError('windowMinutes must be non-negative');
  const sorted = [...alerts].sort((left, right) => left.minute - right.minute);
  const activeByFingerprint = new Map();
  const notifications = [];

  for (const alert of sorted) {
    const active = activeByFingerprint.get(alert.fingerprint);
    if (active && alert.minute - active.lastMinute <= windowMinutes) {
      active.lastMinute = alert.minute;
      active.count += 1;
      continue;
    }
    const notification = {
      fingerprint: alert.fingerprint,
      title: alert.title,
      firstMinute: alert.minute,
      lastMinute: alert.minute,
      count: 1,
    };
    notifications.push(notification);
    activeByFingerprint.set(alert.fingerprint, notification);
  }

  return Object.freeze({
    rawCount: alerts.length,
    notificationCount: notifications.length,
    suppressedCount: alerts.length - notifications.length,
    notifications: Object.freeze(notifications.map((item) => Object.freeze({ ...item }))),
  });
}

export function chooseIncidentAction({
  blastRadius,
  rollbackAvailable,
  rollbackRisk,
  forwardFixConfidence,
  dataIntegrityRisk,
}) {
  [blastRadius, rollbackRisk, forwardFixConfidence, dataIntegrityRisk]
    .forEach((value, index) => assertFinite(value, `argument ${index + 1}`));
  const rollbackScore = rollbackAvailable
    ? (blastRadius * 0.45) + (dataIntegrityRisk * 0.35) + ((1 - rollbackRisk) * 0.20)
    : -1;
  const forwardFixScore = (forwardFixConfidence * 0.65)
    + ((1 - dataIntegrityRisk) * 0.20)
    + ((1 - blastRadius) * 0.15);
  return Object.freeze({
    rollbackScore,
    forwardFixScore,
    recommendation: rollbackScore > forwardFixScore ? 'rollback' : 'forward-fix',
  });
}

function softmax(logits, temperature) {
  assertFinite(temperature, 'temperature');
  if (temperature <= 0) throw new RangeError('temperature must be positive');
  const scaled = logits.map((value) => value / temperature);
  const maximum = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function evaluateTemperature(rows, temperature) {
  let nll = 0;
  let confidence = 0;
  let correct = 0;
  for (const row of rows) {
    const probabilities = softmax(row.logits, temperature);
    const predicted = probabilities.indexOf(Math.max(...probabilities));
    nll += -Math.log(clampProbability(probabilities[row.label]));
    confidence += Math.max(...probabilities);
    if (predicted === row.label) correct += 1;
  }
  const accuracy = correct / rows.length;
  const meanConfidence = confidence / rows.length;
  return Object.freeze({
    temperature,
    nll: nll / rows.length,
    accuracy,
    meanConfidence,
    calibrationGap: meanConfidence - accuracy,
  });
}

export function fitTemperatureScaling({ rows, candidateTemperatures }) {
  if (!rows.length) throw new RangeError('rows must not be empty');
  if (!candidateTemperatures.length) throw new RangeError('candidateTemperatures must not be empty');
  const evaluations = candidateTemperatures.map((temperature) => evaluateTemperature(rows, temperature));
  const best = evaluations.reduce((current, candidate) => (
    candidate.nll < current.nll ? candidate : current
  ));
  const baseline = evaluateTemperature(rows, 1);
  return Object.freeze({ baseline, best, evaluations: Object.freeze(evaluations) });
}

export function evaluateGroupThreshold(rows, threshold) {
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;
  const selected = [];
  for (const row of rows) {
    const predictedPositive = row.score >= threshold;
    if (predictedPositive) selected.push(row);
    if (predictedPositive && row.label === 1) truePositives += 1;
    else if (predictedPositive && row.label === 0) falsePositives += 1;
    else if (!predictedPositive && row.label === 1) falseNegatives += 1;
    else trueNegatives += 1;
  }
  const tpr = truePositives / Math.max(1, truePositives + falseNegatives);
  const fpr = falsePositives / Math.max(1, falsePositives + trueNegatives);
  const meanSelectedScore = selected.length
    ? selected.reduce((sum, row) => sum + row.score, 0) / selected.length
    : 0;
  const selectedPositiveRate = selected.length
    ? selected.reduce((sum, row) => sum + row.label, 0) / selected.length
    : 0;
  return Object.freeze({
    threshold,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    tpr,
    fpr,
    selectedCount: selected.length,
    calibrationGap: selected.length ? meanSelectedScore - selectedPositiveRate : 1,
  });
}

export function evaluateFairnessThresholdPair({ rowsByGroup, thresholdA, thresholdB }) {
  const groupA = evaluateGroupThreshold(rowsByGroup.A, thresholdA);
  const groupB = evaluateGroupThreshold(rowsByGroup.B, thresholdB);
  const equalizedOddsGap = Math.max(
    Math.abs(groupA.tpr - groupB.tpr),
    Math.abs(groupA.fpr - groupB.fpr),
  );
  const calibrationError = (Math.abs(groupA.calibrationGap) + Math.abs(groupB.calibrationGap)) / 2;
  const calibrationDisparity = Math.abs(groupA.calibrationGap - groupB.calibrationGap);
  return Object.freeze({ groupA, groupB, equalizedOddsGap, calibrationError, calibrationDisparity });
}

export function sweepFairnessThresholdPairs({ rowsByGroup, candidateThresholds }) {
  const pairs = [];
  for (const thresholdA of candidateThresholds) {
    for (const thresholdB of candidateThresholds) {
      pairs.push(Object.freeze({
        thresholdA,
        thresholdB,
        ...evaluateFairnessThresholdPair({ rowsByGroup, thresholdA, thresholdB }),
      }));
    }
  }
  const bestEqualizedOdds = pairs.reduce((current, candidate) => (
    candidate.equalizedOddsGap < current.equalizedOddsGap
      || (candidate.equalizedOddsGap === current.equalizedOddsGap && candidate.calibrationError < current.calibrationError)
      ? candidate
      : current
  ));
  const bestCalibration = pairs.reduce((current, candidate) => (
    candidate.calibrationError < current.calibrationError
      || (candidate.calibrationError === current.calibrationError && candidate.equalizedOddsGap < current.equalizedOddsGap)
      ? candidate
      : current
  ));
  return Object.freeze({
    pairs: Object.freeze(pairs),
    bestEqualizedOdds,
    bestCalibration,
  });
}
