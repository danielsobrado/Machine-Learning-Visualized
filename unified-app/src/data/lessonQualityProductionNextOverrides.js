export const PRODUCTION_RELIABILITY_NEXT_QUALITY_OVERRIDES = Object.freeze({
  'model-debugging': Object.freeze({
    reason: 'Debugging lesson now compares competing root-cause hypotheses on the same failing slice and rejects interventions whose target improvement comes with incompatible global or collateral signatures.',
    nextAction: 'Add automated slice discovery and dependency graphs that connect candidate causes to expected metric signatures.',
  }),
  'model-monitoring': Object.freeze({
    reason: 'Monitoring lesson now deduplicates repeated alert fingerprints while retaining occurrence history and turns blast radius, data-integrity risk, rollback safety, and fix confidence into an explicit rollback-versus-forward-fix decision.',
    nextAction: 'Add SLO burn-rate windows, delayed-label monitoring, and multi-signal incident correlation across dependent services.',
  }),
  'uncertainty-estimation': Object.freeze({
    reason: 'Uncertainty lesson now fits temperature scaling on a held-out calibration split, compares baseline and calibrated NLL, and shows that confidence changes while positive-temperature scaling preserves class predictions.',
    nextAction: 'Add conformal prediction with empirical coverage under distribution shift and abstention decisions tied to interval or set size.',
  }),
  'model-fairness': Object.freeze({
    reason: 'Group-threshold lesson now sweeps subgroup thresholds jointly and exposes the concrete trade-off between equalized-odds gaps and selected-population calibration rather than treating one operating point as universally appropriate.',
    nextAction: 'Add constrained utility optimization with uncertainty bands so group constraints, decision value, and estimate noise can be inspected together.',
  }),
});
