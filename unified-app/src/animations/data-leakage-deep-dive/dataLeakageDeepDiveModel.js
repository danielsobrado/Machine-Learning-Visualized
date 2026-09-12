export const LEAKAGE_MODES = Object.freeze({
  duplicates: {
    label: 'Entity overlap',
    leak: 'Under an unseen-user evaluation contract, rows from the same user appear on both sides of the boundary, so identity-specific signal can be memorized.',
    fix: 'When deployment must generalize to unseen users, group by user before splitting. If deployment predicts later events for known users, use a time-aware contract instead of grouping by habit.',
    repairLabel: 'Honor unseen-user boundary',
    crossedInformation: 'evaluation-user identity',
    violationUnit: 'users crossing unseen-user boundary',
    unsafeFlow: 'same user → training + unseen-user evaluation',
    safeFlow: 'whole user → one partition only',
    contract: 'Generalize to entirely unseen users',
    contractNote: 'Entity overlap is not universally leakage. It is invalid here because the deployment question requires performance on users absent from fitting.',
  },
  preprocessing: {
    label: 'Preprocessing leakage',
    leak: 'A learned scaler, imputer, or feature selector is fitted with validation or test rows before those rows are scored.',
    fix: 'Fit every learned preprocessing step on training data only, then apply the frozen transform to validation and test rows.',
    repairLabel: 'Fit transforms on training only',
    crossedInformation: 'holdout statistics',
    violationUnit: 'holdout rows used by preprocessing',
    unsafeFlow: 'validation/test rows → fitted transform → model',
    safeFlow: 'training rows → fitted transform → frozen holdout transform',
    contract: 'Holdout rows must not influence fitted preprocessing state',
    contractNote: 'The problem is contamination of learned state. Leakage does not guarantee that the contaminated score will be higher on every dataset.',
  },
  target: {
    label: 'Target / post-outcome leakage',
    leak: 'The model receives post_outcome_code even though that field is only created after the event being predicted.',
    fix: 'Remove post-outcome and target-derived fields from the prediction-time schema, regardless of how predictive they look offline.',
    repairLabel: 'Remove post-outcome feature',
    crossedInformation: 'post_outcome_code',
    violationUnit: 'forbidden feature paths',
    unsafeFlow: 'future outcome → post_outcome_code → model',
    safeFlow: 'prediction-time features → model',
    contract: 'Predict before post_outcome_code exists',
    contractNote: 'Feature availability is defined at the prediction timestamp, not by whether a column exists later in the warehouse.',
  },
  time: {
    label: 'Temporal leakage',
    leak: 'A May observation enters fitting while an April observation is used for validation, so future information influences an earlier evaluation.',
    fix: 'Use a forward-only boundary: every fitted row and learned statistic must exist before the validation window begins.',
    repairLabel: 'Restore forward-only split',
    crossedInformation: 'future observation',
    violationUnit: 'future rows used in fitting',
    unsafeFlow: 'May training row → model → April validation row',
    safeFlow: 'Jan–Mar training → Apr–May validation → Jun test',
    contract: 'Estimate future performance from past-only information',
    contractNote: 'Chronology matters because deployment predicts events that occur after the data used for fitting.',
  },
  testTuning: {
    label: 'Repeated test tuning',
    leak: 'The final test result feeds the next modeling decision, turning the test set into development feedback.',
    fix: 'Use validation or nested resampling for iteration and keep the final test outside every model-selection decision.',
    repairLabel: 'Remove test feedback loop',
    crossedInformation: 'test result',
    violationUnit: 'forbidden feedback paths',
    unsafeFlow: 'test result → recipe choice → next experiment',
    safeFlow: 'validation → recipe choice; final test → report only',
    contract: 'The final test is report-only evidence',
    contractNote: 'Looking once is not the issue. Adapting recipes to the result makes the same test sample part of development.',
  },
});

export const LEAKAGE_ROWS = Object.freeze([
  { id: 'A', user: 'user_101', time: 'Jan', timeIndex: 1, split: 'train', target: 0, measurement: 10, postOutcomeCode: 'resolved_negative' },
  { id: 'B', user: 'user_104', time: 'Feb', timeIndex: 2, split: 'train', target: 1, measurement: 12, postOutcomeCode: 'resolved_positive' },
  { id: 'C', user: 'user_118', time: 'Mar', timeIndex: 3, split: 'train', target: 0, measurement: 14, postOutcomeCode: 'resolved_negative' },
  { id: 'D', user: 'user_104', time: 'Apr', timeIndex: 4, split: 'validation', target: 1, measurement: 18, postOutcomeCode: 'resolved_positive' },
  { id: 'E', user: 'user_132', time: 'May', timeIndex: 5, split: 'validation', target: 0, measurement: 20, postOutcomeCode: 'resolved_negative' },
  { id: 'F', user: 'user_150', time: 'Jun', timeIndex: 6, split: 'test', target: 1, measurement: 22, postOutcomeCode: 'resolved_positive' },
]);

const TEST_TUNING_CANDIDATE_COUNT = 12;
const TEST_TUNING_TRUE_ACCURACY = 0.76;
const TEST_TUNING_SAMPLE_SIZE = 50;
const TEST_TUNING_FRESH_SAMPLE_SIZE = 400;
const FINAL_TEST_SEED = 1000;
const VALIDATION_SEED = 22192;
const FRESH_AUDIT_SEED = 71000;

export function getLeakageState(modeId, repairApplied = false, rows = LEAKAGE_ROWS) {
  const mode = getMode(modeId);
  validateRows(rows);

  const scenarioSplits = Object.fromEntries(rows.map((row) => [
    row.id,
    scenarioSplitForRow(row, modeId, repairApplied),
  ]));
  const diagnosis = diagnose(modeId, repairApplied, rows, scenarioSplits);

  return {
    mode,
    repairApplied,
    scenarioSplits,
    unsafe: diagnosis.violationCount > 0,
    violationCount: diagnosis.violationCount,
    evidence: diagnosis.evidence,
    rowRoles: diagnosis.rowRoles,
    crossedInformation: mode.crossedInformation,
    flow: repairApplied ? mode.safeFlow : mode.unsafeFlow,
    experiment: buildExperiment(modeId, repairApplied, rows, scenarioSplits),
  };
}

export function scenarioSplitForRow(row, modeId, repairApplied = false) {
  getMode(modeId);
  if (modeId === 'duplicates' && repairApplied && row.id === 'D') return 'train';
  if (modeId === 'time' && !repairApplied && row.id === 'E') return 'train';
  return row.split;
}

function getMode(modeId) {
  const mode = LEAKAGE_MODES[modeId];
  if (!mode) throw new RangeError(`Unknown leakage mode: ${modeId}`);
  return mode;
}

function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new TypeError('Leakage rows must be a non-empty array.');
  }

  const ids = new Set();
  for (const row of rows) {
    if (!row?.id || ids.has(row.id)) throw new TypeError('Leakage rows must have unique non-empty ids.');
    if (!Number.isFinite(row.timeIndex)) throw new TypeError(`Row ${row.id} must have a finite timeIndex.`);
    if (!Number.isFinite(row.measurement)) throw new TypeError(`Row ${row.id} must have a finite measurement.`);
    ids.add(row.id);
  }
}

function diagnose(modeId, repairApplied, rows, scenarioSplits) {
  if (modeId === 'duplicates') return diagnoseDuplicateOverlap(rows, scenarioSplits);
  if (modeId === 'preprocessing') return diagnosePreprocessing(repairApplied, rows, scenarioSplits);
  if (modeId === 'time') return diagnoseTime(rows, scenarioSplits);
  if (modeId === 'testTuning') return diagnoseTestTuning(repairApplied, rows);
  return diagnoseTarget(repairApplied, rows);
}

function diagnoseDuplicateOverlap(rows, scenarioSplits) {
  const memberships = new Map();
  for (const row of rows) {
    if (!memberships.has(row.user)) memberships.set(row.user, new Set());
    memberships.get(row.user).add(scenarioSplits[row.id]);
  }

  const crossingUsers = [...memberships.entries()]
    .filter(([, splits]) => splits.has('train') && (splits.has('validation') || splits.has('test')))
    .map(([user]) => user);
  const crossingSet = new Set(crossingUsers);
  const rowRoles = Object.fromEntries(
    rows
      .filter((row) => crossingSet.has(row.user))
      .map((row) => [row.id, { kind: 'source', label: 'same entity crosses unseen-user boundary' }]),
  );

  return {
    violationCount: crossingUsers.length,
    evidence: crossingUsers.length
      ? `Under the unseen-user contract, ${crossingUsers.length} user (${crossingUsers.join(', ')}) appears in both fitting and evaluation.`
      : 'No user crosses the unseen-user evaluation boundary.',
    rowRoles,
  };
}

function diagnoseTarget(repairApplied, rows) {
  if (repairApplied) {
    return {
      violationCount: 0,
      evidence: 'post_outcome_code is excluded from the prediction-time feature schema.',
      rowRoles: {},
    };
  }

  return {
    violationCount: 1,
    evidence: `post_outcome_code is created after the outcome but is used as an offline input on all ${rows.length} rows.`,
    rowRoles: Object.fromEntries(
      rows.map((row) => [row.id, { kind: 'source', label: 'post-outcome feature exposed' }]),
    ),
  };
}

function diagnoseTime(rows, scenarioSplits) {
  const trainingRows = rows.filter((row) => scenarioSplits[row.id] === 'train');
  const validationRows = rows.filter((row) => scenarioSplits[row.id] === 'validation');
  const validationStart = validationRows.length
    ? Math.min(...validationRows.map((row) => row.timeIndex))
    : Number.POSITIVE_INFINITY;
  const futureTrainingRows = trainingRows.filter((row) => row.timeIndex >= validationStart);
  const earliestValidation = validationRows.find((row) => row.timeIndex === validationStart);
  const rowRoles = Object.fromEntries(
    futureTrainingRows.map((row) => [row.id, { kind: 'source', label: 'future row used in fitting' }]),
  );
  if (futureTrainingRows.length && earliestValidation) {
    rowRoles[earliestValidation.id] = { kind: 'affected', label: 'earlier validation row' };
  }

  return {
    violationCount: futureTrainingRows.length,
    evidence: futureTrainingRows.length
      ? `${futureTrainingRows.map((row) => row.time).join(', ')} enters fitting although validation begins in ${earliestValidation.time}.`
      : 'All fitted rows occur strictly before the validation window.',
    rowRoles,
  };
}

function diagnosePreprocessing(repairApplied, rows, scenarioSplits) {
  const transformFitRows = repairApplied
    ? rows.filter((row) => scenarioSplits[row.id] === 'train')
    : rows;
  const holdoutContributors = transformFitRows.filter((row) => scenarioSplits[row.id] !== 'train');

  return {
    violationCount: holdoutContributors.length,
    evidence: holdoutContributors.length
      ? `${holdoutContributors.length} holdout rows (${holdoutContributors.map((row) => row.id).join(', ')}) change the learned preprocessing statistics.`
      : 'Learned preprocessing parameters come from training rows only.',
    rowRoles: Object.fromEntries(
      holdoutContributors.map((row) => [row.id, { kind: 'source', label: 'holdout affects transform' }]),
    ),
  };
}

function diagnoseTestTuning(repairApplied, rows) {
  if (repairApplied) {
    return {
      violationCount: 0,
      evidence: 'Recipe selection uses validation feedback; the final test result is opened only after the recipe is frozen.',
      rowRoles: {},
    };
  }

  const testRows = rows.filter((row) => row.split === 'test');
  return {
    violationCount: 1,
    evidence: 'The final test result is reused to choose the next recipe, so the reported winner is selected partly for favorable test-sample noise.',
    rowRoles: Object.fromEntries(
      testRows.map((row) => [row.id, { kind: 'source', label: 'test feedback reused' }]),
    ),
  };
}

function buildExperiment(modeId, repairApplied, rows, scenarioSplits) {
  if (modeId === 'preprocessing') {
    return buildPreprocessingExperiment(rows, scenarioSplits, repairApplied);
  }
  if (modeId === 'testTuning') {
    return buildTestTuningExperiment(repairApplied);
  }
  return null;
}

function buildPreprocessingExperiment(rows, scenarioSplits, repairApplied) {
  const trainingRows = rows.filter((row) => scenarioSplits[row.id] === 'train');
  const holdoutRows = rows.filter((row) => scenarioSplits[row.id] !== 'train');
  if (!trainingRows.length || !holdoutRows.length) {
    throw new RangeError('Preprocessing experiment requires training and holdout rows.');
  }

  const trainOnlyFit = fitStandardizer(trainingRows.map((row) => row.measurement));
  const leakedFit = fitStandardizer(rows.map((row) => row.measurement));
  const example = holdoutRows[0];
  const safeTransformed = standardize(example.measurement, trainOnlyFit);
  const leakedTransformed = standardize(example.measurement, leakedFit);

  return {
    type: 'preprocessing',
    trainOnlyFit,
    leakedFit,
    activeFit: repairApplied ? trainOnlyFit : leakedFit,
    activeFitSource: repairApplied ? 'training rows only' : 'all rows',
    meanShift: leakedFit.mean - trainOnlyFit.mean,
    scaleShift: leakedFit.std - trainOnlyFit.std,
    example: {
      id: example.id,
      raw: example.measurement,
      safeTransformed,
      leakedTransformed,
      activeTransformed: repairApplied ? safeTransformed : leakedTransformed,
    },
  };
}

function fitStandardizer(values) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  const std = Math.sqrt(variance);
  if (std === 0) throw new RangeError('Standardizer requires non-zero training variance.');
  return { mean, std };
}

function standardize(value, fit) {
  return (value - fit.mean) / fit.std;
}

function buildTestTuningExperiment(repairApplied) {
  const selectionSeed = repairApplied ? VALIDATION_SEED : FINAL_TEST_SEED;
  const candidateScores = Array.from({ length: TEST_TUNING_CANDIDATE_COUNT }, (_, index) => ({
    index: index + 1,
    trueAccuracy: TEST_TUNING_TRUE_ACCURACY,
    selectionScore: sampleAccuracy(index, TEST_TUNING_SAMPLE_SIZE, selectionSeed),
  }));
  const selected = candidateScores.reduce((best, candidate) => (
    candidate.selectionScore > best.selectionScore ? candidate : best
  ));
  const selectedIndex = selected.index - 1;

  if (repairApplied) {
    const finalTestScore = sampleAccuracy(selectedIndex, TEST_TUNING_SAMPLE_SIZE, FINAL_TEST_SEED);
    return {
      type: 'testTuning',
      candidateCount: TEST_TUNING_CANDIDATE_COUNT,
      trueAccuracy: TEST_TUNING_TRUE_ACCURACY,
      sampleSize: TEST_TUNING_SAMPLE_SIZE,
      selectionSource: 'validation',
      reportSource: 'untouched final test',
      selectedCandidate: selected.index,
      selectionScore: selected.selectionScore,
      reportScore: finalTestScore,
      referenceScore: TEST_TUNING_TRUE_ACCURACY,
      optimism: finalTestScore - TEST_TUNING_TRUE_ACCURACY,
      candidateScores,
    };
  }

  const freshAuditScore = sampleAccuracy(selectedIndex, TEST_TUNING_FRESH_SAMPLE_SIZE, FRESH_AUDIT_SEED);
  return {
    type: 'testTuning',
    candidateCount: TEST_TUNING_CANDIDATE_COUNT,
    trueAccuracy: TEST_TUNING_TRUE_ACCURACY,
    sampleSize: TEST_TUNING_SAMPLE_SIZE,
    selectionSource: 'final test',
    reportSource: 'same reused final test',
    selectedCandidate: selected.index,
    selectionScore: selected.selectionScore,
    reportScore: selected.selectionScore,
    referenceScore: freshAuditScore,
    optimism: selected.selectionScore - freshAuditScore,
    candidateScores,
  };
}

function sampleAccuracy(candidateIndex, sampleSize, sampleSeed) {
  let correct = 0;
  for (let index = 0; index < sampleSize; index += 1) {
    const seed = sampleSeed + candidateIndex * 1009 + index * 9176;
    if (pseudoRandom01(seed) < TEST_TUNING_TRUE_ACCURACY) correct += 1;
  }
  return correct / sampleSize;
}

function pseudoRandom01(seed) {
  let value = (seed ^ 0x9e3779b9) >>> 0;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35) >>> 0;
  value ^= value >>> 16;
  return (value >>> 0) / 4294967296;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
