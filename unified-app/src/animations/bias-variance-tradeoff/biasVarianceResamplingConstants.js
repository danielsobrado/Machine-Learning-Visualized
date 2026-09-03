export const RESAMPLING_PROBE_X = 58;
export const RESAMPLING_CURVE_STEPS = 70;

export const RESAMPLING_SEEDS = Object.freeze([
  11, 23, 37, 41, 53, 67, 71, 83, 97, 101, 113, 127,
]);

export const MODEL_SAMPLE_SENSITIVITY = Object.freeze({
  simple: 1.8,
  balanced: 5.5,
  flexible: 13.5,
});

export const SAMPLE_VARIANCE_MULTIPLIER = Object.freeze({
  small: 1,
  medium: 0.62,
  large: 0.35,
});
