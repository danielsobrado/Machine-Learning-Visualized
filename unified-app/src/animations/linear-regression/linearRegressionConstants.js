export const RESIDUAL_SCENARIOS = Object.freeze({
  wellBehaved: Object.freeze({
    label: 'Healthy residuals',
    short: 'Roughly constant spread with no obvious shape.',
    detail: 'A linear mean function is plausible and residual spread is reasonably stable across x.',
    points: Object.freeze([
      { id: 'w01', x: 1, y: 3.0 }, { id: 'w02', x: 2, y: 5.1 }, { id: 'w03', x: 3, y: 6.0 },
      { id: 'w04', x: 4, y: 8.1 }, { id: 'w05', x: 5, y: 8.7 }, { id: 'w06', x: 6, y: 10.6 },
      { id: 'w07', x: 7, y: 11.4 }, { id: 'w08', x: 8, y: 13.6 }, { id: 'w09', x: 9, y: 14.5 },
      { id: 'w10', x: 10, y: 16.3 }, { id: 'w11', x: 11, y: 17.2 }, { id: 'w12', x: 12, y: 19.0 },
    ]),
  }),
  heteroscedastic: Object.freeze({
    label: 'Variance fan-out',
    short: 'The line is plausible, but uncertainty grows with x.',
    detail: 'Residual magnitude expands from left to right. Point predictions may remain useful while constant-variance uncertainty estimates become misleading.',
    points: Object.freeze([
      { id: 'h01', x: 1, y: 3.3 }, { id: 'h02', x: 2, y: 4.95 }, { id: 'h03', x: 3, y: 6.0 },
      { id: 'h04', x: 4, y: 7.85 }, { id: 'h05', x: 5, y: 8.65 }, { id: 'h06', x: 6, y: 10.9 },
      { id: 'h07', x: 7, y: 11.0 }, { id: 'h08', x: 8, y: 14.3 }, { id: 'h09', x: 9, y: 13.1 },
      { id: 'h10', x: 10, y: 17.8 }, { id: 'h11', x: 11, y: 15.0 }, { id: 'h12', x: 12, y: 21.7 },
    ]),
  }),
  nonlinear: Object.freeze({
    label: 'Curved residual pattern',
    short: 'A high R² can coexist with the wrong functional form.',
    detail: 'Residuals bend systematically above and below zero. The problem is the mean function, not merely random noise.',
    points: Object.freeze([
      { id: 'n01', x: 1, y: 8.725 }, { id: 'n02', x: 2, y: 8.725 }, { id: 'n03', x: 3, y: 9.575 },
      { id: 'n04', x: 4, y: 10.125 }, { id: 'n05', x: 5, y: 11.275 }, { id: 'n06', x: 6, y: 12.325 },
      { id: 'n07', x: 7, y: 13.525 }, { id: 'n08', x: 8, y: 14.975 }, { id: 'n09', x: 9, y: 16.725 },
      { id: 'n10', x: 10, y: 18.525 }, { id: 'n11', x: 11, y: 20.725 }, { id: 'n12', x: 12, y: 22.675 },
    ]),
  }),
});

const INFLUENCE_BASE_POINTS = Object.freeze([
  { id: 'p01', x: 1, y: 3.3 }, { id: 'p02', x: 2, y: 5.2 }, { id: 'p03', x: 3, y: 6.4 },
  { id: 'p04', x: 4, y: 8.15 }, { id: 'p05', x: 5, y: 9.35 }, { id: 'p06', x: 6, y: 11.1 },
  { id: 'p07', x: 7, y: 12.45 }, { id: 'p08', x: 8, y: 14.05 },
]);

export const INFLUENCE_SCENARIOS = Object.freeze({
  verticalOutlier: Object.freeze({
    label: 'Large residual, ordinary x',
    short: 'Obviously wrong vertically, but low leverage limits slope damage.',
    specialId: 'special',
    points: Object.freeze([...INFLUENCE_BASE_POINTS, { id: 'special', x: 4.5, y: 16 }]),
  }),
  highLeverageAligned: Object.freeze({
    label: 'High leverage, aligned',
    short: 'Far from the x center, yet consistent with the existing trend.',
    specialId: 'special',
    points: Object.freeze([...INFLUENCE_BASE_POINTS, { id: 'special', x: 14, y: 23 }]),
  }),
  influential: Object.freeze({
    label: 'High leverage + large residual',
    short: 'Far in x and inconsistent in y: this point pulls the fitted line.',
    specialId: 'special',
    points: Object.freeze([...INFLUENCE_BASE_POINTS, { id: 'special', x: 14, y: 14 }]),
  }),
});

export const LINEAR_REGRESSION_DIAGNOSTIC_THRESHOLDS = Object.freeze({
  heteroscedasticSpreadRatio: 2.5,
  nonlinearCorrelation: 0.65,
  standardizedResidual: 2,
  leverageMultiplier: 2,
  cooksDistanceMultiplier: 4,
});

export const LINEAR_REGRESSION_CHART_LIMITS = Object.freeze({
  diagnostics: Object.freeze({ x: Object.freeze([0, 13]), y: Object.freeze([0, 25]) }),
  influence: Object.freeze({ x: Object.freeze([0, 16]), y: Object.freeze([0, 26]) }),
});
