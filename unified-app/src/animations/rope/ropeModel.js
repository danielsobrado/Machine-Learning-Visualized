import {
  BASE_KEY_PAIR,
  BASE_QUERY_PAIR,
  MAX_VISIBLE_PAIRS,
} from './ropeConstants.js';

export function rotatePair([x, y], angle) {
  if (![x, y, angle].every(Number.isFinite)) throw new TypeError('pair values and angle must be finite');
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - y * sin, x * sin + y * cos];
}

export function dotPair(left, right) {
  validatePair(left, 'left');
  validatePair(right, 'right');
  return left[0] * right[0] + left[1] * right[1];
}

export function inverseFrequency(base, pairIndex, rotaryDimension) {
  if (!Number.isFinite(base) || base <= 1) throw new RangeError('base must be greater than 1');
  if (!Number.isInteger(pairIndex) || pairIndex < 0) throw new RangeError('pairIndex must be a non-negative integer');
  if (!Number.isInteger(rotaryDimension) || rotaryDimension <= 0 || rotaryDimension % 2 !== 0) {
    throw new RangeError('rotaryDimension must be a positive even integer');
  }
  if (pairIndex >= rotaryDimension / 2) throw new RangeError('pairIndex exceeds rotary dimensions');
  return Math.pow(base, (-2 * pairIndex) / rotaryDimension);
}

export function buildRoPEStats({
  queryPosition,
  keyPosition,
  rotaryDimension,
  base,
  pairIndex,
  queryPair = BASE_QUERY_PAIR,
  keyPair = BASE_KEY_PAIR,
}) {
  validatePosition(queryPosition, 'queryPosition');
  validatePosition(keyPosition, 'keyPosition');
  validatePair(queryPair, 'queryPair');
  validatePair(keyPair, 'keyPair');

  const theta = inverseFrequency(base, pairIndex, rotaryDimension);
  const queryAngle = queryPosition * theta;
  const keyAngle = keyPosition * theta;
  const relativeDistance = queryPosition - keyPosition;
  const relativeAngle = relativeDistance * theta;
  const rotatedQuery = rotatePair(queryPair, queryAngle);
  const rotatedKey = rotatePair(keyPair, keyAngle);
  const directPairScore = dotPair(rotatedQuery, rotatedKey);
  const relativeKey = rotatePair(keyPair, -relativeAngle);
  const relativePairScore = dotPair(queryPair, relativeKey);
  const unrotatedPairScore = dotPair(queryPair, keyPair);

  const rows = Array.from(
    { length: Math.min(MAX_VISIBLE_PAIRS, rotaryDimension / 2) },
    (_, index) => {
      const rowTheta = inverseFrequency(base, index, rotaryDimension);
      return {
        pair: index,
        theta: rowTheta,
        queryAngle: queryPosition * rowTheta,
        keyAngle: keyPosition * rowTheta,
        relativeAngle: relativeDistance * rowTheta,
      };
    },
  );

  return {
    theta,
    queryAngle,
    keyAngle,
    relativeDistance,
    relativeAngle,
    rotatedQuery,
    rotatedKey,
    directPairScore,
    relativePairScore,
    unrotatedPairScore,
    scoreShift: directPairScore - unrotatedPairScore,
    rows,
  };
}

function validatePair(pair, name) {
  if (!Array.isArray(pair) || pair.length !== 2 || pair.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must contain exactly two finite values`);
  }
}

function validatePosition(position, name) {
  if (!Number.isInteger(position) || position < 0) throw new RangeError(`${name} must be a non-negative integer`);
}
