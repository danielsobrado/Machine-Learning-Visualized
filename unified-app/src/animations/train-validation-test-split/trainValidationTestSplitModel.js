import {
  BUCKETS,
  DEFAULT_SPLIT,
  EVALUATION_TARGETS,
  PIPELINE_CONTRACTS,
  PREPROCESSING_LEAKAGE_DEMO,
  SELECTION_EXPERIMENT,
  SPLIT_MODES,
} from './trainValidationTestSplitConstants.js';

export const TRAIN_VALIDATION_ROWS = Object.freeze([
  { id: '01', entity: 'A', time: 1, segment: 'north', y: 0, x: 12 },
  { id: '02', entity: 'A', time: 2, segment: 'north', y: 0, x: 16 },
  { id: '03', entity: 'B', time: 3, segment: 'south', y: 0, x: 18 },
  { id: '04', entity: 'B', time: 4, segment: 'south', y: 1, x: 45 },
  { id: '05', entity: 'C', time: 5, segment: 'north', y: 1, x: 42 },
  { id: '06', entity: 'C', time: 6, segment: 'north', y: 1, x: 48 },
  { id: '07', entity: 'D', time: 7, segment: 'east', y: 0, x: 24 },
  { id: '08', entity: 'D', time: 8, segment: 'east', y: 0, x: 31 },
  { id: '09', entity: 'E', time: 9, segment: 'east', y: 1, x: 52 },
  { id: '10', entity: 'E', time: 10, segment: 'east', y: 1, x: 61 },
  { id: '11', entity: 'F', time: 11, segment: 'south', y: 0, x: 28 },
  { id: '12', entity: 'F', time: 12, segment: 'south', y: 1, x: 66 },
  { id: '13', entity: 'G', time: 13, segment: 'north', y: 1, x: 56 },
  { id: '14', entity: 'G', time: 14, segment: 'north', y: 1, x: 64 },
  { id: '15', entity: 'H', time: 15, segment: 'south', y: 0, x: 33 },
  { id: '16', entity: 'H', time: 16, segment: 'south', y: 0, x: 39 },
  { id: '17', entity: 'I', time: 17, segment: 'north', y: 1, x: 72 },
  { id: '18', entity: 'I', time: 18, segment: 'north', y: 1, x: 74 },
  { id: '19', entity: 'J', time: 19, segment: 'east', y: 0, x: 35 },
  { id: '20', entity: 'J', time: 20, segment: 'east', y: 1, x: 69 },
  { id: '21', entity: 'K', time: 21, segment: 'east', y: 1, x: 77 },
  { id: '22', entity: 'K', time: 22, segment: 'east', y: 1, x: 82 },
  { id: '23', entity: 'L', time: 23, segment: 'south', y: 0, x: 41 },
  { id: '24', entity: 'L', time: 24, segment: 'south', y: 1, x: 71 },
]);

export function splitCounts(total, validationPercent = DEFAULT_SPLIT.validation, testPercent = DEFAULT_SPLIT.test) {
  if (!Number.isInteger(total) || total < 3) {
    throw new RangeError('total must be an integer of at least 3');
  }
  validateSplitRatio(validationPercent, 'validationPercent');
  validateSplitRatio(testPercent, 'testPercent');
  if (validationPercent + testPercent >= 1) {
    throw new RangeError('validationPercent + testPercent must be less than 1');
  }

  const test = Math.max(1, Math.round(total * testPercent));
  const validation = Math.max(1, Math.round(total * validationPercent));
  const train = total - validation - test;
  if (train < 1) {
    throw new RangeError('split ratios leave no training rows after rounding');
  }
  return { train, validation, test };
}

export function assignByMode(mode, validationPercent, testPercent, rows = TRAIN_VALIDATION_ROWS) {
  if (!Object.hasOwn(SPLIT_MODES, mode)) throw new RangeError(`Unknown split mode: ${mode}`);
  if (!Array.isArray(rows) || rows.length < 3) throw new RangeError('rows must contain at least 3 examples');
  const counts = splitCounts(rows.length, validationPercent, testPercent);

  if (mode === 'time') return splitInOrder([...rows].sort((a, b) => a.time - b.time), counts);
  if (mode === 'stratified') return stratifiedSplit(rows, counts);
  if (mode === 'group') return groupedSplit(rows, counts, false);
  if (mode === 'groupTime') return groupedSplit(rows, counts, true);
  return splitInOrder([...rows].sort((a, b) => randomRank(a) - randomRank(b)), counts);
}

export function positiveRate(rows) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  if (!rows.length) return 0;
  return rows.filter((row) => row.y === 1).length / rows.length;
}

export function meanX(rows) {
  if (!Array.isArray(rows)) throw new TypeError('rows must be an array');
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + row.x, 0) / rows.length;
}

export function driftGap(trainRows, targetRows) {
  return Math.abs(meanX(targetRows) - meanX(trainRows));
}

export function entityOverlap(splits) {
  validateSplitShape(splits);
  const membership = new Map();
  for (const bucket of BUCKETS) {
    for (const row of splits[bucket]) {
      if (!membership.has(row.entity)) membership.set(row.entity, new Set());
      membership.get(row.entity).add(bucket);
    }
  }
  return [...membership.entries()]
    .filter(([, buckets]) => buckets.size > 1)
    .map(([entity, buckets]) => ({ entity, buckets: [...buckets] }));
}

export function chronologyViolations(splits) {
  validateSplitShape(splits, true);
  const trainMax = Math.max(...splits.train.map((row) => row.time));
  const validationMin = Math.min(...splits.validation.map((row) => row.time));
  const validationMax = Math.max(...splits.validation.map((row) => row.time));
  const testMin = Math.min(...splits.test.map((row) => row.time));
  return {
    trainIntoValidation: trainMax >= validationMin,
    validationIntoTest: validationMax >= testMin,
  };
}

export function auditSplit(mode, targetId, splits) {
  if (!Object.hasOwn(SPLIT_MODES, mode)) throw new RangeError(`Unknown split mode: ${mode}`);
  if (!Object.hasOwn(EVALUATION_TARGETS, targetId)) throw new RangeError(`Unknown evaluation target: ${targetId}`);

  const overlap = entityOverlap(splits);
  const chronology = chronologyViolations(splits);
  const target = EVALUATION_TARGETS[targetId];
  const needsEntityIsolation = targetId === 'unseenEntity' || targetId === 'futureEntity';
  const needsChronology = targetId === 'future' || targetId === 'futureEntity';
  const failures = [];
  const warnings = [];

  if (needsEntityIsolation && overlap.length) failures.push(`${overlap.length} entities cross partitions`);
  if (needsChronology && (chronology.trainIntoValidation || chronology.validationIntoTest)) failures.push('future rows leak backward across the boundary');
  if (targetId === 'exchangeable' && mode === 'random') {
    warnings.push('label proportions can drift by chance; stratification can reduce split-to-split variance when classes are imbalanced');
  }

  return {
    target,
    overlap,
    chronology,
    failures,
    warnings,
    valid: failures.length === 0,
  };
}

export function trainServeSkew(contractId) {
  if (!Object.hasOwn(PIPELINE_CONTRACTS, contractId)) throw new RangeError(`Unknown pipeline contract: ${contractId}`);
  const contract = PIPELINE_CONTRACTS[contractId];
  const semanticSkew = contract.trainWindowDays !== contract.serveWindowDays;
  const missingSkew = contract.trainMissing !== contract.serveMissing;
  const issues = [];
  if (semanticSkew) issues.push(`feature window differs: ${contract.trainWindowDays}d in training vs ${contract.serveWindowDays}d in serving`);
  if (missingSkew) issues.push(`missing values differ: ${contract.trainMissing} in training vs ${contract.serveMissing} in serving`);
  return { ...contract, semanticSkew, missingSkew, issues, aligned: issues.length === 0 };
}

export function simulateRepeatedSelection(
  candidateCount,
  testSize = SELECTION_EXPERIMENT.defaultTestSize,
) {
  validateExperimentInteger(
    candidateCount,
    SELECTION_EXPERIMENT.candidateMin,
    SELECTION_EXPERIMENT.candidateMax,
    'candidateCount',
  );
  validateExperimentInteger(
    testSize,
    SELECTION_EXPERIMENT.testSizeMin,
    SELECTION_EXPERIMENT.testSizeMax,
    'testSize',
  );

  let selectedTestTotal = 0;
  let freshTotal = 0;
  let representative = null;

  for (let trial = 0; trial < SELECTION_EXPERIMENT.trials; trial += 1) {
    const candidates = Array.from({ length: candidateCount }, (_, index) => ({
      id: index + 1,
      testScore: sampleAccuracy(
        testSize,
        SELECTION_EXPERIMENT.trueAccuracy,
        candidateSeed(trial, index, 0),
      ),
    }));
    const selected = candidates.reduce((best, candidate) => (
      candidate.testScore > best.testScore ? candidate : best
    ), candidates[0]);
    const freshScore = sampleAccuracy(
      SELECTION_EXPERIMENT.freshSize,
      SELECTION_EXPERIMENT.trueAccuracy,
      candidateSeed(trial, selected.id - 1, 1),
    );

    selectedTestTotal += selected.testScore;
    freshTotal += freshScore;
    if (trial === 0) {
      representative = {
        candidates,
        selected: { ...selected, freshScore },
      };
    }
  }

  const meanSelectedTestScore = selectedTestTotal / SELECTION_EXPERIMENT.trials;
  const meanFreshScore = freshTotal / SELECTION_EXPERIMENT.trials;
  return {
    count: candidateCount,
    testSize,
    trueAccuracy: SELECTION_EXPERIMENT.trueAccuracy,
    trials: SELECTION_EXPERIMENT.trials,
    meanSelectedTestScore,
    meanFreshScore,
    optimism: meanSelectedTestScore - meanFreshScore,
    representative,
  };
}

export function preprocessingLeakageDemo(holdoutShift = PREPROCESSING_LEAKAGE_DEMO.defaultShift) {
  validateRange(
    holdoutShift,
    PREPROCESSING_LEAKAGE_DEMO.shiftMin,
    PREPROCESSING_LEAKAGE_DEMO.shiftMax,
    'holdoutShift',
  );

  const trainValues = [...PREPROCESSING_LEAKAGE_DEMO.trainValues];
  const holdoutValues = PREPROCESSING_LEAKAGE_DEMO.holdoutBaseValues.map((value) => value + holdoutShift);
  const trainStats = summaryStats(trainValues);
  const leakedStats = summaryStats([...trainValues, ...holdoutValues]);
  const trainOnlyHoldoutZ = holdoutValues.map((value) => (value - trainStats.mean) / trainStats.std);
  const leakedHoldoutZ = holdoutValues.map((value) => (value - leakedStats.mean) / leakedStats.std);

  return {
    holdoutShift,
    trainValues,
    holdoutValues,
    trainStats,
    leakedStats,
    trainOnlyHoldoutMeanZ: mean(trainOnlyHoldoutZ),
    leakedHoldoutMeanZ: mean(leakedHoldoutZ),
  };
}

function splitInOrder(rows, counts) {
  return {
    train: rows.slice(0, counts.train),
    validation: rows.slice(counts.train, counts.train + counts.validation),
    test: rows.slice(counts.train + counts.validation),
  };
}

function stratifiedSplit(rows, counts) {
  const buckets = { train: [], validation: [], test: [] };
  const remaining = { ...counts };
  const groups = [...new Set(rows.map((row) => row.y))]
    .sort((a, b) => a - b)
    .map((label) => rows.filter((row) => row.y === label));

  groups.forEach((group, groupIndex) => {
    const allocation = groupIndex === groups.length - 1
      ? { ...remaining }
      : allocateGroup(group.length, rows.length, counts, remaining);
    for (const bucket of BUCKETS) {
      const assigned = group.splice(0, allocation[bucket]);
      buckets[bucket].push(...assigned);
      remaining[bucket] -= assigned.length;
    }
  });
  return buckets;
}

function groupedSplit(rows, counts, byTime) {
  const groups = [...new Set(rows.map((row) => row.entity))].map((entity) => {
    const entityRows = rows.filter((row) => row.entity === entity).sort((a, b) => a.time - b.time);
    return { entity, rows: entityRows, firstTime: entityRows[0].time };
  });
  groups.sort(byTime
    ? (a, b) => a.firstTime - b.firstTime
    : (a, b) => randomEntityRank(a.entity) - randomEntityRank(b.entity));

  const buckets = { train: [], validation: [], test: [] };
  const desired = { ...counts };
  for (const group of groups) {
    const bucket = BUCKETS
      .map((name) => ({ name, remaining: desired[name] - buckets[name].length }))
      .sort((a, b) => b.remaining - a.remaining)[0].name;
    buckets[bucket].push(...group.rows);
  }

  if (byTime) {
    const ordered = [...groups].sort((a, b) => a.firstTime - b.firstTime);
    const trainTarget = counts.train;
    const validationTarget = counts.validation;
    let seen = 0;
    const chronological = { train: [], validation: [], test: [] };
    for (const group of ordered) {
      const bucket = seen < trainTarget ? 'train' : seen < trainTarget + validationTarget ? 'validation' : 'test';
      chronological[bucket].push(...group.rows);
      seen += group.rows.length;
    }
    return chronological;
  }

  return buckets;
}

function allocateGroup(groupSize, totalSize, counts, remaining) {
  const allocation = Object.fromEntries(BUCKETS.map((bucket) => [bucket, 0]));
  const targets = BUCKETS.map((bucket) => {
    const target = (groupSize * counts[bucket]) / totalSize;
    const floor = Math.min(Math.floor(target), remaining[bucket]);
    allocation[bucket] = floor;
    return { bucket, remainder: target - floor };
  });
  let leftover = groupSize - BUCKETS.reduce((sum, bucket) => sum + allocation[bucket], 0);
  const ranked = targets.sort((a, b) => b.remainder - a.remainder || remaining[b.bucket] - remaining[a.bucket]);
  while (leftover > 0) {
    const target = ranked.find(({ bucket }) => allocation[bucket] < remaining[bucket]);
    if (!target) break;
    allocation[target.bucket] += 1;
    leftover -= 1;
  }
  return allocation;
}

function randomRank(row) {
  return (Number(row.id) * 7 + 3) % 29;
}

function randomEntityRank(entity) {
  return entity.charCodeAt(0) * 17 % 31;
}

function validateSplitRatio(value, name) {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new RangeError(`${name} must be a finite number between 0 and 1`);
  }
}

function validateSplitShape(splits, requireNonEmpty = false) {
  if (!splits || typeof splits !== 'object') throw new TypeError('splits must be an object');
  for (const bucket of BUCKETS) {
    if (!Array.isArray(splits[bucket])) throw new TypeError(`splits.${bucket} must be an array`);
    if (requireNonEmpty && splits[bucket].length === 0) throw new RangeError(`splits.${bucket} must not be empty`);
  }
}

function validateExperimentInteger(value, min, max, name) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
}

function validateRange(value, min, max, name) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}`);
  }
}

function candidateSeed(trial, candidateIndex, stream) {
  return (
    SELECTION_EXPERIMENT.seed
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

function summaryStats(values) {
  const average = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  if (std === 0) throw new RangeError('standard deviation must be positive');
  return { mean: average, std };
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
