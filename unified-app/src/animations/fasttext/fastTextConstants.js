export const FASTTEXT_SUBWORD_DEFAULTS = Object.freeze({
  minN: 3,
  maxN: 6,
  bucketCount: 2_000_000,
});

export const FASTTEXT_BUCKET_OPTIONS = Object.freeze([8, 32, 256, 2_000_000]);

export const FASTTEXT_TRAINING_WORDS = Object.freeze(['king', 'kingdom', 'queen', 'royal']);

export const FASTTEXT_OOV_EXAMPLES = Object.freeze(['kingship', 'kingly', 'quokka', 'xylophone']);

export const FASTTEXT_COLLISION_WORDS = Object.freeze({
  first: 'cat',
  second: 'zoo',
});
