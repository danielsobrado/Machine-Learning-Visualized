import {
  BASE_GENERALIZATION_SCORE,
  CROSS_VALIDATION_ROWS,
} from './crossValidationConstants.js';

const EPSILON = 1e-12;

export function buildFolds(k, strategy, rows = CROSS_VALIDATION_ROWS) {
  if (strategy === 'time') return expandingTimeFolds(rows, k);
  if (strategy === 'groupedTime') return groupedTimeFolds(rows, k);

  const assigned = assignSymmetricFolds(rows, k, strategy);
  return Array.from({ length: k }, (_, fold) => ({
    id: fold,
    train: assigned.filter((row) => row.fold !== fold),
    validation: assigned.filter((row) => row.fold === fold),
  }));
}

export function auditFold(fold, preprocessingInsideFold = true) {
  const trainUsers = new Set(fold.train.map((row) => row.user));
  const entityOverlap = [...new Set(fold.validation.filter((row) => trainUsers.has(row.user)).map((row) => row.user))];
  const maxTrainTime = fold.train.length ? Math.max(...fold.train.map((row) => row.time)) : null;
  const minValidationTime = fold.validation.length ? Math.min(...fold.validation.map((row) => row.time)) : null;
  const chronological = maxTrainTime === null || minValidationTime === null || maxTrainTime < minValidationTime;

  return {
    entityOverlap,
    chronological,
    preprocessingContained: preprocessingInsideFold,
    clean: entityOverlap.length === 0 && preprocessingInsideFold,
  };
}

export function evaluateFold(fold, preprocessingInsideFold = true) {
  const audit = auditFold(fold, preprocessingInsideFold);
  const meanDifficulty = average(fold.validation.map((row) => row.difficulty), 0.5);
  const difficultyPenalty = Math.abs(meanDifficulty - 0.52) * 0.08;
  const entityLeakBoost = Math.min(0.08, audit.entityOverlap.length * 0.018);
  const preprocessingBoost = preprocessingInsideFold ? 0 : 0.04;
  const score = clamp(BASE_GENERALIZATION_SCORE - difficultyPenalty + entityLeakBoost + preprocessingBoost, 0, 0.98);

  return { ...fold, audit, score };
}

export function summarizeFolds(folds, preprocessingInsideFold = true) {
  const evaluated = folds.map((fold) => evaluateFold(fold, preprocessingInsideFold));
  const scores = evaluated.map((fold) => fold.score);
  const mean = average(scores, 0);
  const variance = average(scores.map((score) => (score - mean) ** 2), 0);

  return {
    folds: evaluated,
    mean,
    std: Math.sqrt(variance),
    min: Math.min(...scores),
    max: Math.max(...scores),
    entityLeakFolds: evaluated.filter((fold) => fold.audit.entityOverlap.length > 0).length,
    timeViolationFolds: evaluated.filter((fold) => !fold.audit.chronological).length,
  };
}

export function repeatedStratifiedReplay(repeatCount, k) {
  const repeats = Array.from({ length: repeatCount }, (_, repeat) => {
    const scores = Array.from({ length: k }, (_, fold) => (
      BASE_GENERALIZATION_SCORE
      + deterministicNoise(101 + repeat * 17 + fold * 7, 0.045)
      + deterministicNoise(701 + repeat * 29, 0.018)
    ));
    return { repeat: repeat + 1, mean: average(scores, 0), scores };
  });
  const means = repeats.map((repeat) => repeat.mean);
  const mean = average(means, 0);
  const variance = average(means.map((value) => (value - mean) ** 2), 0);

  return {
    repeats,
    mean,
    repeatStd: Math.sqrt(variance),
    min: Math.min(...means),
    max: Math.max(...means),
    firstRepeatMean: repeats[0]?.mean ?? 0,
  };
}

export function nestedSelectionReplay(candidateCount, outerFoldCount = 5) {
  const candidates = Array.from({ length: candidateCount }, (_, index) => candidateProfile(index));
  const naive = candidates.reduce((best, candidate) => (
    candidate.fullInnerScore > best.fullInnerScore ? candidate : best
  ));

  const outerResults = Array.from({ length: outerFoldCount }, (_, outerFold) => {
    const selected = candidates
      .map((candidate) => ({
        ...candidate,
        innerScore: candidate.trueScore + deterministicNoise(2000 + outerFold * 97 + candidate.index * 31, 0.032),
      }))
      .reduce((best, candidate) => (candidate.innerScore > best.innerScore ? candidate : best));
    const outerScore = selected.trueScore + deterministicNoise(9000 + outerFold * 131 + selected.index * 43, 0.012);
    return { outerFold: outerFold + 1, selectedIndex: selected.index, innerScore: selected.innerScore, outerScore };
  });

  const nestedMean = average(outerResults.map((result) => result.outerScore), 0);
  return {
    candidates,
    naive,
    nestedMean,
    outerResults,
    optimism: naive.fullInnerScore - nestedMean,
  };
}

export function positiveRate(rows) {
  return rows.length ? rows.filter((row) => row.target === 1).length / rows.length : 0;
}

function assignSymmetricFolds(rows, k, strategy) {
  if (strategy === 'grouped') {
    return rows.map((row) => ({ ...row, fold: userNumber(row.user) % k }));
  }

  if (strategy === 'stratified') {
    const counters = new Map();
    return [...rows]
      .sort((a, b) => a.target - b.target || a.time - b.time)
      .map((row) => {
        const count = counters.get(row.target) ?? 0;
        counters.set(row.target, count + 1);
        return { ...row, fold: count % k };
      });
  }

  return rows.map((row, index) => ({ ...row, fold: (index * 5 + row.time * 3) % k }));
}

function expandingTimeFolds(rows, k) {
  const sorted = [...rows].sort((a, b) => a.time - b.time);
  const window = Math.max(1, Math.floor(sorted.length / (k + 1)));
  return Array.from({ length: k }, (_, fold) => {
    const trainEnd = window * (fold + 1);
    const validationEnd = fold === k - 1 ? sorted.length : Math.min(sorted.length, trainEnd + window);
    return {
      id: fold,
      train: sorted.slice(0, trainEnd),
      validation: sorted.slice(trainEnd, validationEnd),
    };
  }).filter((fold) => fold.validation.length > 0);
}

function groupedTimeFolds(rows, k) {
  const groups = [...new Set(rows.map((row) => row.user))]
    .map((user) => ({
      user,
      rows: rows.filter((row) => row.user === user).sort((a, b) => a.time - b.time),
    }))
    .sort((a, b) => Math.max(...a.rows.map((row) => row.time)) - Math.max(...b.rows.map((row) => row.time)));
  const initialGroups = Math.max(1, groups.length - k * 2);
  const remainingGroups = groups.length - initialGroups;
  const groupWindow = Math.max(1, Math.floor(remainingGroups / k));

  return Array.from({ length: k }, (_, fold) => {
    const trainGroupEnd = initialGroups + fold * groupWindow;
    const validationGroupEnd = fold === k - 1 ? groups.length : Math.min(groups.length, trainGroupEnd + groupWindow);
    return {
      id: fold,
      train: groups.slice(0, trainGroupEnd).flatMap((group) => group.rows),
      validation: groups.slice(trainGroupEnd, validationGroupEnd).flatMap((group) => group.rows),
    };
  }).filter((fold) => fold.train.length > 0 && fold.validation.length > 0);
}

function candidateProfile(index) {
  const trueScore = 0.758 + (((index + 1) * 7) % 5) * 0.001;
  const searchNoise = deterministicNoise(500 + index * 53, 0.05) + index * 0.0015;
  return {
    index: index + 1,
    trueScore,
    fullInnerScore: trueScore + searchNoise,
  };
}

function deterministicNoise(seed, amplitude) {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  const fraction = raw - Math.floor(raw);
  return (fraction * 2 - 1) * amplitude;
}

function userNumber(user) {
  return Number(user.replace(/\D/g, ''));
}

function average(values, fallback) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  if (Math.abs(max - min) < EPSILON) return min;
  return Math.min(max, Math.max(min, value));
}
