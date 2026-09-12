export const LEAKAGE_MODES = Object.freeze({
  duplicates: {
    label: 'Duplicate / entity overlap',
    leak: 'Rows from the same user appear on both sides of an evaluation boundary, so identity-specific signal can be memorized.',
    fix: 'Group by user before splitting so every row for one user stays in a single partition.',
    repairLabel: 'Group by user',
    crossedInformation: 'user identity',
    violationUnit: 'cross-boundary entities',
    unsafeFlow: 'same user → training + validation',
    safeFlow: 'whole user → one partition only',
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
  },
});

export const LEAKAGE_ROWS = Object.freeze([
  { id: 'A', user: 'user_101', time: 'Jan', timeIndex: 1, split: 'train', target: 0, postOutcomeCode: 'resolved_negative' },
  { id: 'B', user: 'user_104', time: 'Feb', timeIndex: 2, split: 'train', target: 1, postOutcomeCode: 'resolved_positive' },
  { id: 'C', user: 'user_118', time: 'Mar', timeIndex: 3, split: 'train', target: 0, postOutcomeCode: 'resolved_negative' },
  { id: 'D', user: 'user_104', time: 'Apr', timeIndex: 4, split: 'validation', target: 1, postOutcomeCode: 'resolved_positive' },
  { id: 'E', user: 'user_132', time: 'May', timeIndex: 5, split: 'validation', target: 0, postOutcomeCode: 'resolved_negative' },
  { id: 'F', user: 'user_150', time: 'Jun', timeIndex: 6, split: 'test', target: 1, postOutcomeCode: 'resolved_positive' },
]);

export function getLeakageState(modeId, repairApplied = false, rows = LEAKAGE_ROWS) {
  const mode = LEAKAGE_MODES[modeId] ?? LEAKAGE_MODES.target;
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
  };
}

export function scenarioSplitForRow(row, modeId, repairApplied = false) {
  if (modeId === 'duplicates' && repairApplied && row.id === 'D') return 'train';
  if (modeId === 'time' && !repairApplied && row.id === 'E') return 'train';
  return row.split;
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
      .map((row) => [row.id, { kind: 'source', label: 'same entity crosses boundary' }]),
  );

  return {
    violationCount: crossingUsers.length,
    evidence: crossingUsers.length
      ? `${crossingUsers.length} user (${crossingUsers.join(', ')}) appears in training and evaluation.`
      : 'Every user is contained within one partition.',
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
      ? `${holdoutContributors.length} holdout rows (${holdoutContributors.map((row) => row.id).join(', ')}) contribute to learned preprocessing statistics.`
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
      evidence: 'Model-selection decisions use validation feedback; the final test result is report-only.',
      rowRoles: {},
    };
  }

  const testRows = rows.filter((row) => row.split === 'test');
  return {
    violationCount: 1,
    evidence: 'The final test result is reused to choose the next recipe, so it is no longer untouched evidence.',
    rowRoles: Object.fromEntries(
      testRows.map((row) => [row.id, { kind: 'source', label: 'test feedback reused' }]),
    ),
  };
}
