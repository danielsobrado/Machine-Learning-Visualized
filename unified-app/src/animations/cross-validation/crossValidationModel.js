import {
  BASE_GENERALIZATION_SCORE,
  CROSS_VALIDATION_ROWS,
  CV_LIMITS,
  NESTED_SELECTION_EXPERIMENT,
  REPEATED_CV_EXPERIMENT,
  SPLIT_STRATEGIES,
} from './crossValidationConstants.js';

const EPSILON = 1e-12;

export function buildFolds(k, strategy, rows = CROSS_VALIDATION_ROWS, seed = 0) {
  validateK(k);
  validateStrategy(strategy);
  validateRows(rows, k);
  if (!Number.isInteger(seed)) throw new TypeError('seed must be an integer');

  if (strategy === 'grouped' || strategy === 'groupedTime') validateGroupCapacity(rows, k);
  if (strategy === 'time') return expandingTimeFolds(rows, k);
  if (strategy === 'groupedTime') return groupedTimeFolds(rows, k);

  const assigned = assignSymmetricFolds(rows, k, strategy, seed);
  return Array.from({ length: k }, (_, fold) => ({
    id: fold,
    train: assigned.filter((row) => row.fold !== fold),
    validation: assigned.filter((row) => row.fold === fold),
  }));
}

export function auditFold(fold, preprocessingInsideFold = true) {
  validateFold(fold);
  if (typeof preprocessingInsideFold !== 'boolean') {
    throw new TypeError('preprocessingInsideFold must be a boolean');
  }

  const trainUsers = new Set(fold.train.map((row) => row.user));
  const entityOverlap = [...new Set(fold.validation.filter((row) => trainUsers.has(row.user)).map((row) => row.user))];
  const maxTrainTime = fold.train.length ? Math.max(...fold.train.map((row) => row.time)) : null;
  const minValidationTime = fold.validation.length ? Math.min(...fold.validation.map((row) => row.time)) : null;
  const chronological = maxTrainTime === null || minValidationTime === null || maxTrainTime < minValidationTime;
  const preprocessing = preprocessingInfluence(fold);

  return {
    entityOverlap,
    chronological,
    preprocessingContained: preprocessingInsideFold,
    preprocessing,
    clean: entityOverlap.length === 0 && preprocessingInsideFold,
  };
}

export function evaluateFold(fold, preprocessingInsideFold = true) {
  const audit = auditFold(fold, preprocessingInsideFold);
  const meanDifficulty = average(fold.validation.map((row) => row.difficulty), 0.5);
  const difficultyPenalty = Math.abs(meanDifficulty - 0.52) * 0.08;
  const score = clamp(BASE_GENERALIZATION_SCORE - difficultyPenalty, 0, 0.98);

  return { ...fold, audit, score };
}

export function summarizeFolds(folds, preprocessingInsideFold = true) {
  if (!Array.isArray(folds) || folds.length === 0) throw new RangeError('folds must be a non-empty array');
  const evaluated = folds.map((fold) => evaluateFold(fold, preprocessingInsideFold));
  const scores = evaluated.map((fold) => fold.score);
  const mean = average(scores, 0);
  const variance = average(scores.map((score) => (score - mean) ** 2), 0);
  const validationCounts = new Map();
  const rowsById = new Map();
  let validationRowCount = 0;
  let weightedScoreSum = 0;

  for (const fold of evaluated) {
    for (const row of [...fold.train, ...fold.validation]) rowsById.set(row.id, row);
    for (const row of fold.validation) {
      validationCounts.set(row.id, (validationCounts.get(row.id) ?? 0) + 1);
    }
    validationRowCount += fold.validation.length;
    weightedScoreSum += fold.score * fold.validation.length;
  }

  const neverValidated = [...rowsById.keys()].filter((id) => !validationCounts.has(id));
  const multiplyValidated = [...validationCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));

  return {
    folds: evaluated,
    mean,
    weightedMean: validationRowCount ? weightedScoreSum / validationRowCount : 0,
    std: Math.sqrt(variance),
    min: Math.min(...scores),
    max: Math.max(...scores),
    entityLeakFolds: evaluated.filter((fold) => fold.audit.entityOverlap.length > 0).length,
    timeViolationFolds: evaluated.filter((fold) => !fold.audit.chronological).length,
    coverage: {
      totalRows: rowsById.size,
      validatedRows: validationCounts.size,
      neverValidated,
      multiplyValidated,
    },
  };
}

export function repeatedStratifiedReplay(repeatCount, k, rows = CROSS_VALIDATION_ROWS) {
  validateIntegerRange(repeatCount, CV_LIMITS.repeatMin, CV_LIMITS.repeatMax, 'repeatCount');
  validateK(k);
  validateRows(rows, k);

  const datasetRate = positiveRate(rows);
  const repeats = Array.from({ length: repeatCount }, (_, repeat) => {
    const seed = REPEATED_CV_EXPERIMENT.seed + repeat;
    const folds = buildFolds(k, 'stratified', rows, seed);
    const summary = summarizeFolds(folds, true);
    const classBalanceDrift = average(
      summary.folds.map((fold) => Math.abs(positiveRate(fold.validation) - datasetRate)),
      0,
    );
    return {
      repeat: repeat + 1,
      mean: summary.mean,
      scores: summary.folds.map((fold) => fold.score),
      classBalanceDrift,
      fingerprint: foldFingerprint(folds),
    };
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
    firstRepeatMean: repeats[0].mean,
    uniquePartitionCount: new Set(repeats.map((repeat) => repeat.fingerprint)).size,
    meanClassBalanceDrift: average(repeats.map((repeat) => repeat.classBalanceDrift), 0),
  };
}

export function nestedSelectionReplay(
  candidateCount,
  outerFoldCount = NESTED_SELECTION_EXPERIMENT.defaultOuterFolds,
) {
  validateIntegerRange(candidateCount, CV_LIMITS.candidateMin, CV_LIMITS.candidateMax, 'candidateCount');
  validateIntegerRange(outerFoldCount, CV_LIMITS.outerFoldMin, CV_LIMITS.outerFoldMax, 'outerFoldCount');

  let naiveScoreSum = 0;
  let nestedScoreSum = 0;
  let nestedScoreCount = 0;
  let representative = null;

  for (let trial = 0; trial < NESTED_SELECTION_EXPERIMENT.trials; trial += 1) {
    const candidates = Array.from({ length: candidateCount }, (_, index) => ({
      index: index + 1,
      trueScore: NESTED_SELECTION_EXPERIMENT.trueAccuracy,
      fullInnerScore: sampleAccuracy(
        NESTED_SELECTION_EXPERIMENT.innerSampleSize,
        NESTED_SELECTION_EXPERIMENT.trueAccuracy,
        nestedSeed(trial, index, 0),
      ),
    }));
    const naive = maxBy(candidates, (candidate) => candidate.fullInnerScore);
    naiveScoreSum += naive.fullInnerScore;

    const outerResults = Array.from({ length: outerFoldCount }, (_, outerFold) => {
      const innerCandidates = candidates.map((candidate, index) => ({
        ...candidate,
        innerScore: sampleAccuracy(
          NESTED_SELECTION_EXPERIMENT.innerSampleSize,
          candidate.trueScore,
          nestedSeed(trial, index, outerFold + 1),
        ),
      }));
      const selected = maxBy(innerCandidates, (candidate) => candidate.innerScore);
      const outerScore = sampleAccuracy(
        NESTED_SELECTION_EXPERIMENT.outerSampleSize,
        selected.trueScore,
        nestedSeed(trial, selected.index - 1, 100 + outerFold),
      );
      nestedScoreSum += outerScore;
      nestedScoreCount += 1;
      return {
        outerFold: outerFold + 1,
        selectedIndex: selected.index,
        innerScore: selected.innerScore,
        outerScore,
      };
    });

    if (trial === 0) representative = { candidates, naive, outerResults };
  }

  const meanNaiveScore = naiveScoreSum / NESTED_SELECTION_EXPERIMENT.trials;
  const nestedMean = nestedScoreSum / nestedScoreCount;
  return {
    candidates: representative.candidates,
    naive: representative.naive,
    meanNaiveScore,
    nestedMean,
    outerResults: representative.outerResults,
    optimism: meanNaiveScore - nestedMean,
    trueAccuracy: NESTED_SELECTION_EXPERIMENT.trueAccuracy,
    trials: NESTED_SELECTION_EXPERIMENT.trials,
  };
}

export function positiveRate(rows) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  return rows.length ? rows.filter((row) => row.target === 1).length / rows.length : 0;
}

function assignSymmetricFolds(rows, k, strategy, seed) {
  if (strategy === 'grouped') {
    const users = [...new Set(rows.map((row) => row.user))]
      .sort((a, b) => stableHash(`${seed}:${a}`) - stableHash(`${seed}:${b}`) || a.localeCompare(b));
    const foldByUser = new Map(users.map((user, index) => [user, index % k]));
    return rows.map((row) => ({ ...row, fold: foldByUser.get(row.user) }));
  }

  if (strategy === 'stratified') {
    const counters = new Map();
    return [...rows]
      .sort((a, b) => a.target - b.target || stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`))
      .map((row) => {
        const count = counters.get(row.target) ?? 0;
        counters.set(row.target, count + 1);
        return { ...row, fold: count % k };
      });
  }

  return [...rows]
    .sort((a, b) => stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`) || String(a.id).localeCompare(String(b.id)))
    .map((row, index) => ({ ...row, fold: index % k }));
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

function preprocessingInfluence(fold) {
  if (!fold.train.length || !fold.validation.length) {
    return {
      trainMean: null,
      combinedMean: null,
      trainStd: null,
      combinedStd: null,
      validationMeanZTrainFit: null,
      validationMeanZCombinedFit: null,
    };
  }

  const trainStats = summaryStats(fold.train.map((row) => row.difficulty));
  const combinedStats = summaryStats([...fold.train, ...fold.validation].map((row) => row.difficulty));
  return {
    trainMean: trainStats.mean,
    combinedMean: combinedStats.mean,
    trainStd: trainStats.std,
    combinedStd: combinedStats.std,
    validationMeanZTrainFit: average(
      fold.validation.map((row) => standardize(row.difficulty, trainStats)),
      0,
    ),
    validationMeanZCombinedFit: average(
      fold.validation.map((row) => standardize(row.difficulty, combinedStats)),
      0,
    ),
  };
}

function foldFingerprint(folds) {
  return folds
    .map((fold) => fold.validation.map((row) => row.id).sort().join(','))
    .join('|');
}

function nestedSeed(trial, candidateIndex, stream) {
  return (
    NESTED_SELECTION_EXPERIMENT.seed
    ^ Math.imul(trial + 1, 0x85ebca6b)
    ^ Math.imul(candidateIndex + 1, 0xc2b2ae35)
    ^ Math.imul(stream + 1, 0x27d4eb2f)
  ) >>> 0;
}

function sampleAccuracy(size, accuracy, seed) {
  let successes = 0;
  for (let index = 0; index < size; index += 1) {
    const drawSeed = (seed + Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    if (uniform(drawSeed) < accuracy) successes += 1;
  }
  return successes / size;
}

function uniform(seed) {
  return hash32(seed) / 4294967296;
}

function hash32(value) {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function stableHash(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function summaryStats(values) {
  const mean = average(values, 0);
  const variance = average(values.map((value) => (value - mean) ** 2), 0);
  return { mean, std: Math.sqrt(variance) };
}

function standardize(value, stats) {
  if (stats.std < EPSILON) return 0;
  return (value - stats.mean) / stats.std;
}

function maxBy(values, selector) {
  return values.reduce((best, value) => (selector(value) > selector(best) ? value : best));
}

function validateK(k) {
  validateIntegerRange(k, CV_LIMITS.kMin, CV_LIMITS.kMax, 'k');
}

function validateStrategy(strategy) {
  if (!Object.hasOwn(SPLIT_STRATEGIES, strategy)) throw new RangeError(`Unknown CV strategy: ${strategy}`);
}

function validateRows(rows, k) {
  if (!Array.isArray(rows) || rows.length < k) throw new RangeError(`rows must contain at least ${k} examples`);
  const ids = new Set();
  for (const row of rows) {
    if (!row || typeof row !== 'object') throw new TypeError('every row must be an object');
    if (typeof row.id !== 'string' || row.id.length === 0) throw new TypeError('row.id must be a non-empty string');
    if (ids.has(row.id)) throw new RangeError(`duplicate row id: ${row.id}`);
    ids.add(row.id);
    if (typeof row.user !== 'string' || row.user.length === 0) throw new TypeError('row.user must be a non-empty string');
    if (!Number.isFinite(row.time)) throw new TypeError('row.time must be finite');
    if (row.target !== 0 && row.target !== 1) throw new RangeError('row.target must be 0 or 1');
    if (!Number.isFinite(row.difficulty)) throw new TypeError('row.difficulty must be finite');
  }
}

function validateGroupCapacity(rows, k) {
  const groupCount = new Set(rows.map((row) => row.user)).size;
  if (groupCount < k) throw new RangeError(`grouped CV requires at least ${k} distinct users`);
}

function validateFold(fold) {
  if (!fold || typeof fold !== 'object') throw new TypeError('fold must be an object');
  if (!Array.isArray(fold.train) || !Array.isArray(fold.validation)) {
    throw new TypeError('fold.train and fold.validation must be arrays');
  }
}

function validateIntegerRange(value, min, max, name) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
}

function average(values, fallback) {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value, min, max) {
  if (Math.abs(max - min) < EPSILON) return min;
  return Math.min(max, Math.max(min, value));
}
