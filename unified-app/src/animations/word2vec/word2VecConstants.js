export const NEGATIVE_SAMPLING_COUNTS = Object.freeze({
  the: 1000,
  model: 100,
  tensor: 25,
  quokka: 1,
});

export const NEGATIVE_SAMPLING_EXPONENTS = Object.freeze([
  { value: 0, label: 'Uniform' },
  { value: 0.75, label: 'Word2Vec 0.75' },
  { value: 1, label: 'Raw unigram' },
]);

export const NEGATIVE_SAMPLING_DEFAULTS = Object.freeze({
  exponent: 0.75,
  samples: 8,
  seed: 17,
});

export const NEGATIVE_SAMPLING_LIMITS = Object.freeze({
  samples: { min: 1, max: 24, step: 1 },
});
