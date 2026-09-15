export const CONV_LAYER_DEFAULTS = Object.freeze({
  batchSize: 10,
  inputChannels: 3,
  inputHeight: 32,
  inputWidth: 40,
  outputChannels: 24,
  kernelSize: 5,
  stride: 2,
  padding: 2,
  dilation: 1,
  useBias: true,
});

export const CONV_LAYER_LIMITS = Object.freeze({
  inputChannels: Object.freeze({ min: 1, max: 16, step: 1 }),
  outputChannels: Object.freeze({ min: 1, max: 64, step: 1 }),
  kernelSize: Object.freeze({ min: 1, max: 7, step: 2 }),
  stride: Object.freeze({ min: 1, max: 4, step: 1 }),
  padding: Object.freeze({ min: 0, max: 6, step: 1 }),
  dilation: Object.freeze({ min: 1, max: 4, step: 1 }),
});
