export const PCA_DEFAULTS = Object.freeze({
  correlation: 0.65,
  noise: 0.25,
  components: 1,
});

export const RAW_POINTS = Object.freeze([
  [-2.4, -1.8], [-2.0, -1.1], [-1.7, -1.4], [-1.4, -0.6], [-1.0, -0.9],
  [-0.7, -0.2], [-0.3, -0.4], [0.0, 0.1], [0.4, 0.3], [0.8, 0.5],
  [1.1, 1.0], [1.4, 0.7], [1.8, 1.5], [2.1, 1.2], [2.5, 2.0],
]);

export const SCALE_TRAP_POINTS = Object.freeze([
  [1.0, 100], [1.2, 130], [1.4, 160], [1.6, 190], [1.8, 220],
  [2.0, 250], [2.2, 280], [2.4, 310], [2.6, 340], [2.8, 370],
]);

export const TASK_SIGNAL_POINTS = Object.freeze(
  [-3, -2, -1, 0, 1, 2, 3].flatMap((x) => [
    Object.freeze({ point: [x, -0.25], label: 'A' }),
    Object.freeze({ point: [x, 0.25], label: 'B' }),
  ]),
);
