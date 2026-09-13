export const ATTENTION_ROW_KEYS = Object.freeze([
  Object.freeze([1, 0]),
  Object.freeze([0, 1]),
  Object.freeze([-1, 0]),
]);

export const ATTENTION_ROW_VALUES = Object.freeze([
  Object.freeze([8, 1]),
  Object.freeze([0, 6]),
  Object.freeze([-4, 2]),
]);

export const ATTENTION_ROW_LABELS = Object.freeze(['Token A', 'Token B', 'Token C']);

export const ATTENTION_ROW_DEFAULTS = Object.freeze({
  queryX: 1,
  queryY: 0,
  scale: true,
});
