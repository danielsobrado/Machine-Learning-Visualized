const ECE_BINNING_GROUPS = Object.freeze([
  Object.freeze({ probability: 0.2, positives: 4, count: 10 }),
  Object.freeze({ probability: 0.4, positives: 2, count: 10 }),
  Object.freeze({ probability: 0.6, positives: 8, count: 10 }),
  Object.freeze({ probability: 0.8, positives: 6, count: 10 }),
]);

export const ECE_BIN_COUNTS = Object.freeze([2, 3, 4, 5, 6, 7, 8]);
export const DEFAULT_ECE_BIN_COUNT = 2;

export const ECE_BINNING_ROWS = Object.freeze(
  ECE_BINNING_GROUPS.flatMap((group, groupIndex) =>
    Array.from({ length: group.count }, (_, rowIndex) => Object.freeze({
      id: `ece-${groupIndex + 1}-${rowIndex + 1}`,
      probability: group.probability,
      label: rowIndex < group.positives ? 1 : 0,
    })),
  ),
);
