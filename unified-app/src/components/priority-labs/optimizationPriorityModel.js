const EPSILON = 1e-12;

function quadraticLoss(x, y, conditionNumber) {
  return 0.5 * (x ** 2 + conditionNumber * y ** 2);
}

export function buildConditioningTrajectory({
  conditionNumber,
  learningRate,
  startX = 4,
  startY = 1,
  steps = 12,
}) {
  if (conditionNumber < 1) throw new RangeError('Condition number must be at least one.');
  if (learningRate <= 0) throw new RangeError('Learning rate must be positive.');

  let x = startX;
  let y = startY;
  const trajectory = [{ step: 0, x, y, loss: quadraticLoss(x, y, conditionNumber) }];

  for (let step = 1; step <= steps; step += 1) {
    x -= learningRate * x;
    y -= learningRate * conditionNumber * y;
    trajectory.push({ step, x, y, loss: quadraticLoss(x, y, conditionNumber) });
  }

  const final = trajectory.at(-1);
  const maxStableLearningRate = 2 / conditionNumber;

  return {
    trajectory,
    final,
    maxStableLearningRate,
    stable: learningRate < maxStableLearningRate,
    improvementRatio: trajectory[0].loss <= EPSILON
      ? 1
      : final.loss / trajectory[0].loss,
  };
}

export function buildSaddleDiagnosis({ x, y }) {
  const loss = x ** 2 - y ** 2;
  const gradX = 2 * x;
  const gradY = -2 * y;
  const gradientNorm = Math.hypot(gradX, gradY);

  return {
    loss,
    gradX,
    gradY,
    gradientNorm,
    nearStationary: gradientNorm < 0.2,
    curvatureX: 2,
    curvatureY: -2,
    isMinimum: false,
  };
}
