import { replaceLessonLabGroup } from '../lessonLabFactory.js';
import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

const generatedLabs = createMappedCategoryLessonLabs('neural-networks', {
  kind: 'neural-network computation',
  signalName: 'activation or gradient signal',
  stages: ['forward', 'loss', 'update'],
  stageExplanation: 'Neural-network code is built around forward computation, loss measurement, and parameter updates.',
});

export const NEURAL_NETWORK_LESSON_LABS = replaceLessonLabGroup(
  generatedLabs,
  'optimizers',
  () => [
    {
      id: 'optimizers-minibatch-mean-gradient',
      title: 'Average mini-batch gradients',
      concept: 'Mini-batch optimizers update from the mean of noisy per-example gradients, not from one arbitrary example.',
      objective: 'Return the coordinate-wise mean gradient for a batch of gradient vectors.',
      difficulty: 'core',
      starterCode: `function meanGradient(gradients) {
  const totals = Array(gradients[0].length).fill(0);

  for (let row = 0; row < gradients.length; row++) {
    for (let col = 0; col < gradients[row].length; col++) {
      // TODO: accumulate this gradient coordinate.
    }
  }

  // TODO: divide each total by the batch size.
  return totals;
}`,
      testCode: `const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('two gradients', meanGradient([[2, 4], [4, 8]]), [3, 6]);
check('noise cancels', meanGradient([[1, -1], [3, 1], [2, 0]]), [2, 0]);
check('single example', meanGradient([[-0.5, 2]]), [-0.5, 2]);

return results;`,
      hints: [
        'Add gradients[row][col] into totals[col].',
        'After accumulation, divide each total by gradients.length.',
        'return totals.map((total) => total / gradients.length);',
      ],
      solution: `function meanGradient(gradients) {
  const totals = Array(gradients[0].length).fill(0);

  for (let row = 0; row < gradients.length; row++) {
    for (let col = 0; col < gradients[row].length; col++) {
      totals[col] += gradients[row][col];
    }
  }

  return totals.map((total) => total / gradients.length);
}`,
      explanation: 'Larger batches reduce random gradient jitter because independent positive and negative noise partly cancels before the optimizer step.',
    },
    {
      id: 'optimizers-sgd-step',
      title: 'Take an SGD step',
      concept: 'SGD moves parameters opposite the mini-batch gradient by learningRate times the gradient.',
      objective: 'Return theta - learningRate * gradient coordinate by coordinate.',
      difficulty: 'core',
      starterCode: `function sgdStep(theta, gradient, learningRate) {
  const next = [];

  for (let i = 0; i < theta.length; i++) {
    // TODO: push the updated coordinate.
  }

  return next;
}`,
      testCode: `const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('downhill both axes', sgdStep([1, 2], [0.5, -1], 0.2), [0.9, 2.2]);
check('zero gradient unchanged', sgdStep([3, -2], [0, 0], 0.1), [3, -2]);
check('larger learning rate', sgdStep([0, 0], [2, 4], 0.5), [-1, -2]);

return results;`,
      hints: [
        'The update sign is negative because optimizers minimize loss.',
        'Each coordinate uses theta[i] - learningRate * gradient[i].',
        'next.push(theta[i] - learningRate * gradient[i]);',
      ],
      solution: `function sgdStep(theta, gradient, learningRate) {
  const next = [];

  for (let i = 0; i < theta.length; i++) {
    next.push(theta[i] - learningRate * gradient[i]);
  }

  return next;
}`,
      explanation: 'The first-step prediction in the Optimizers lesson is the sign of this delta on the shared deterministic gradient.',
    },
    {
      id: 'optimizers-momentum-velocity',
      title: 'Update momentum velocity',
      concept: 'Momentum keeps a velocity term so repeated gradient directions accumulate across steps.',
      objective: 'Return beta * velocity + gradient for each coordinate.',
      difficulty: 'core',
      starterCode: `function momentumVelocity(velocity, gradient, beta) {
  const nextVelocity = [];

  for (let i = 0; i < velocity.length; i++) {
    // TODO: combine old velocity and current gradient.
  }

  return nextVelocity;
}`,
      testCode: `const results = [];

function sameArray(actual, expected) {
  return actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) <= 1e-9);
}

function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}

check('build velocity', momentumVelocity([1, -2], [0.5, 1], 0.9), [1.4, -0.8]);
check('first step equals gradient', momentumVelocity([0, 0], [3, -1], 0.9), [3, -1]);
check('damped old velocity', momentumVelocity([10], [-2], 0.5), [3]);

return results;`,
      hints: [
        'Momentum keeps part of the old velocity.',
        'Add the current gradient after beta * velocity[i].',
        'nextVelocity.push(beta * velocity[i] + gradient[i]);',
      ],
      solution: `function momentumVelocity(velocity, gradient, beta) {
  const nextVelocity = [];

  for (let i = 0; i < velocity.length; i++) {
    nextVelocity.push(beta * velocity[i] + gradient[i]);
  }

  return nextVelocity;
}`,
      explanation: 'Velocity explains why momentum can cross shallow valleys faster but can overshoot when the accumulated direction becomes too large.',
    },
    {
      id: 'optimizers-adam-bias-corrected-step',
      title: 'Apply Adam bias correction',
      concept: 'Adam corrects early first and second moments before scaling the parameter step.',
      objective: 'Compute one coordinate update using corrected m and v.',
      difficulty: 'challenge',
      starterCode: `function adamCoordinateStep(theta, gradient, mPrev, vPrev, step, learningRate, beta1, beta2, epsilon = 1e-8) {
  const m = beta1 * mPrev + (1 - beta1) * gradient;
  const v = beta2 * vPrev + (1 - beta2) * gradient * gradient;

  // TODO: bias-correct m and v, then return theta - learningRate * correctedM / (sqrt(correctedV) + epsilon).
  return theta;
}`,
      testCode: `const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('first step normalizes gradient sign', adamCoordinateStep(1, 4, 0, 0, 1, 0.1, 0.9, 0.999), 0.90000000025);
check('negative gradient increases theta', adamCoordinateStep(1, -2, 0, 0, 1, 0.1, 0.9, 0.999), 1.0999999995);
check('later biased moments corrected', Number(adamCoordinateStep(2, 3, 0.2, 0.5, 3, 0.05, 0.8, 0.9).toFixed(6)), 1.965112);

return results;`,
      hints: [
        'Use 1 - Math.pow(beta, step) as the bias-correction denominator.',
        'Correct both moments before the square-root scaling.',
        'const mHat = m / (1 - Math.pow(beta1, step)); const vHat = v / (1 - Math.pow(beta2, step));',
      ],
      solution: `function adamCoordinateStep(theta, gradient, mPrev, vPrev, step, learningRate, beta1, beta2, epsilon = 1e-8) {
  const m = beta1 * mPrev + (1 - beta1) * gradient;
  const v = beta2 * vPrev + (1 - beta2) * gradient * gradient;
  const correctedM = m / (1 - Math.pow(beta1, step));
  const correctedV = v / (1 - Math.pow(beta2, step));

  return theta - learningRate * correctedM / (Math.sqrt(correctedV) + epsilon);
}`,
      explanation: 'Bias correction keeps Adam from underestimating early moments, while the second moment still rescales coordinates with different gradient magnitudes.',
    },
  ],
);
