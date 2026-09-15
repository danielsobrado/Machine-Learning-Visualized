export const OUTPUT_PAIRING_DEFAULTS = Object.freeze({
  task: 'exclusive-multiclass',
  logits: Object.freeze([2.4, 0.3, -1.2]),
});

export const OUTPUT_LOGIT_RANGE = Object.freeze({ min: -8, max: 8, step: 0.1 });

export const OUTPUT_PAIRING_TASKS = Object.freeze([
  Object.freeze({
    id: 'binary',
    label: 'Binary',
    target: Object.freeze([1]),
    targetDescription: 'One yes/no target',
    head: 'One raw logit',
    loss: 'Binary cross-entropy from logits',
  }),
  Object.freeze({
    id: 'exclusive-multiclass',
    label: 'Exclusive multiclass',
    target: Object.freeze([0, 1, 0]),
    targetDescription: 'Exactly one class is true',
    head: 'Competing class logits',
    loss: 'Categorical cross-entropy from logits',
  }),
  Object.freeze({
    id: 'multilabel',
    label: 'Multilabel',
    target: Object.freeze([1, 0, 1]),
    targetDescription: 'Any subset of labels may be true',
    head: 'Independent binary logits',
    loss: 'Binary cross-entropy from logits per label',
  }),
]);

export const OUTPUT_CLASS_LABELS = Object.freeze(['A', 'B', 'C']);
