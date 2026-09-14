const EPSILON = 1e-12;

function clampProbability(value) {
  return Math.min(1 - EPSILON, Math.max(EPSILON, value));
}

export function buildDistributionAssumptionLab({ residual, scale }) {
  const safeScale = Math.max(EPSILON, scale);
  const standardized = residual / safeScale;
  const gaussianPenalty = 0.5 * standardized ** 2 + Math.log(safeScale);
  const laplacePenalty = Math.abs(standardized) + Math.log(2 * safeScale);

  return {
    residual,
    gaussianPenalty,
    laplacePenalty,
    preferredByPenalty: gaussianPenalty <= laplacePenalty ? 'Gaussian / squared-error view' : 'Laplace / absolute-error view',
    interpretation: Math.abs(standardized) >= 2
      ? 'Large residuals are punished much more aggressively by the Gaussian assumption because the penalty grows quadratically.'
      : 'For modest residuals, both assumptions can be plausible; the important choice is the noise story the model is asserting.',
  };
}

export function buildLabelSmoothingLab({ confidence, smoothing, classes }) {
  if (classes < 2) throw new RangeError('Label smoothing needs at least two classes.');
  const safeConfidence = clampProbability(confidence);
  const safeSmoothing = Math.min(0.99, Math.max(0, smoothing));
  const otherProbability = (1 - safeConfidence) / (classes - 1);
  const hardTargets = Array.from({ length: classes }, (_, index) => index === 0 ? 1 : 0);
  const smoothTargets = Array.from(
    { length: classes },
    (_, index) => index === 0 ? 1 - safeSmoothing + safeSmoothing / classes : safeSmoothing / classes,
  );
  const probabilities = Array.from(
    { length: classes },
    (_, index) => index === 0 ? safeConfidence : otherProbability,
  );
  const crossEntropy = (targets) => -targets.reduce(
    (sum, target, index) => sum + target * Math.log(clampProbability(probabilities[index])),
    0,
  );

  return {
    hardTargets,
    smoothTargets,
    probabilities,
    hardLoss: crossEntropy(hardTargets),
    smoothedLoss: crossEntropy(smoothTargets),
    trueClassTarget: smoothTargets[0],
    otherClassTarget: smoothTargets[1],
  };
}

export function buildMapLab({ successes, trials, alpha, beta }) {
  if (trials <= 0 || successes < 0 || successes > trials) {
    throw new RangeError('Successes must be between zero and the positive trial count.');
  }
  if (alpha <= 1 || beta <= 1) {
    throw new RangeError('This teaching MAP mode uses a Beta prior with alpha and beta greater than one.');
  }

  const mle = successes / trials;
  const map = (successes + alpha - 1) / (trials + alpha + beta - 2);
  const priorMode = (alpha - 1) / (alpha + beta - 2);

  return {
    mle,
    map,
    priorMode,
    shrinkage: map - mle,
    direction: Math.abs(map - mle) < EPSILON ? 'none' : map > mle ? 'up' : 'down',
  };
}
