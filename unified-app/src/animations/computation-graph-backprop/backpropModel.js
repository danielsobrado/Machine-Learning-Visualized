import { NUMERICAL_GRADIENT_EPSILON } from './backpropConstants.js';

function requireFinite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
}

export function relu(value) {
  requireFinite(value, 'value');
  return Math.max(0, value);
}

export function computeChainGraph({ x, w, b, target, learningRate }) {
  [x, w, b, target, learningRate].forEach((value, index) => {
    requireFinite(value, ['x', 'w', 'b', 'target', 'learningRate'][index]);
  });
  if (learningRate <= 0) throw new RangeError('learningRate must be positive');

  const wx = w * x;
  const z = wx + b;
  const a = relu(z);
  const error = a - target;
  const loss = 0.5 * error * error;
  const dLossDa = error;
  const dAdZ = z > 0 ? 1 : 0;
  const dLossDz = dLossDa * dAdZ;
  const dLossDw = dLossDz * x;
  const dLossDb = dLossDz;
  const dLossDx = dLossDz * w;
  const nextW = w - learningRate * dLossDw;
  const nextB = b - learningRate * dLossDb;
  const nextA = relu(nextW * x + nextB);
  const nextLoss = 0.5 * (nextA - target) ** 2;

  return {
    wx,
    z,
    a,
    error,
    loss,
    dLossDa,
    dAdZ,
    dLossDz,
    dLossDw,
    dLossDb,
    dLossDx,
    nextW,
    nextB,
    nextLoss,
  };
}

function branchLoss({ h, targetA, targetB, branchScale }) {
  const errorA = h - targetA;
  const branchB = h * h;
  const errorB = branchB - targetB;
  return 0.5 * errorA * errorA + branchScale * 0.5 * errorB * errorB;
}

export function computeBranchGraph({ h, targetA, targetB, branchScale }) {
  [h, targetA, targetB, branchScale].forEach((value, index) => {
    requireFinite(value, ['h', 'targetA', 'targetB', 'branchScale'][index]);
  });
  if (branchScale < 0) throw new RangeError('branchScale must be non-negative');

  const errorA = h - targetA;
  const lossA = 0.5 * errorA * errorA;
  const branchB = h * h;
  const errorB = branchB - targetB;
  const lossB = branchScale * 0.5 * errorB * errorB;
  const totalLoss = lossA + lossB;

  const gradientFromA = errorA;
  const dLossBDbranchB = branchScale * errorB;
  const dBranchBDh = 2 * h;
  const gradientFromB = dLossBDbranchB * dBranchBDh;
  const totalGradient = gradientFromA + gradientFromB;

  return {
    h,
    branchA: h,
    branchB,
    lossA,
    lossB,
    totalLoss,
    gradientFromA,
    dLossBDbranchB,
    dBranchBDh,
    gradientFromB,
    totalGradient,
    onePathOnlyGradient: gradientFromA,
    missedGradient: gradientFromB,
  };
}

export function numericalDerivative(fn, value, epsilon = NUMERICAL_GRADIENT_EPSILON) {
  requireFinite(value, 'value');
  requireFinite(epsilon, 'epsilon');
  if (epsilon <= 0) throw new RangeError('epsilon must be positive');
  return (fn(value + epsilon) - fn(value - epsilon)) / (2 * epsilon);
}

export function branchGradientCheck(config) {
  const analytic = computeBranchGraph(config);
  const numerical = numericalDerivative(
    (h) => branchLoss({ ...config, h }),
    config.h,
  );
  const absoluteError = Math.abs(analytic.totalGradient - numerical);
  const onePathAbsoluteError = Math.abs(analytic.onePathOnlyGradient - numerical);

  return {
    analytic: analytic.totalGradient,
    numerical,
    absoluteError,
    onePathOnly: analytic.onePathOnlyGradient,
    onePathAbsoluteError,
    passes: absoluteError < 1e-6,
  };
}
