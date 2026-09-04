const EPSILON = 1e-12;

function assertVector(vector, name) {
  if (!Array.isArray(vector) || vector.length === 0 || vector.some((value) => !Number.isFinite(value))) {
    throw new TypeError(`${name} must be a finite numeric vector.`);
  }
}

function assertNonNegativeInteger(value, name) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative integer.`);
  }
}

export function dot(a, b) {
  assertVector(a, 'a');
  assertVector(b, 'b');
  if (a.length !== b.length) throw new RangeError('Vectors must have the same dimensionality.');
  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}

export function norm(vector) {
  assertVector(vector, 'vector');
  return Math.sqrt(dot(vector, vector));
}

export function cosineSimilarity(a, b) {
  const denominator = norm(a) * norm(b);
  if (denominator <= EPSILON) return 0;
  return dot(a, b) / denominator;
}

export function normalizeVector(vector) {
  const length = norm(vector);
  if (length <= EPSILON) return vector.map(() => 0);
  return vector.map((value) => value / length);
}

export function mixVectors(a, b, weight) {
  assertVector(a, 'a');
  assertVector(b, 'b');
  if (a.length !== b.length) throw new RangeError('Vectors must have the same dimensionality.');
  if (!Number.isFinite(weight) || weight < 0 || weight > 1) {
    throw new RangeError('weight must be between 0 and 1.');
  }
  return normalizeVector(a.map((value, index) => (weight * value) + ((1 - weight) * b[index])));
}

export function nearestToken(hiddenState, vocabulary) {
  assertVector(hiddenState, 'hiddenState');
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    throw new RangeError('vocabulary must contain at least one token embedding.');
  }

  return vocabulary
    .map((item) => ({ ...item, similarity: cosineSimilarity(hiddenState, item.vector) }))
    .sort((a, b) => b.similarity - a.similarity)[0];
}

export function projectionError(hiddenState, tokenVector) {
  assertVector(hiddenState, 'hiddenState');
  assertVector(tokenVector, 'tokenVector');
  if (hiddenState.length !== tokenVector.length) throw new RangeError('Vectors must have the same dimensionality.');
  const hidden = normalizeVector(hiddenState);
  const token = normalizeVector(tokenVector);
  return Math.sqrt(hidden.reduce((sum, value, index) => sum + ((value - token[index]) ** 2), 0));
}

export function binaryEntropy(probability) {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError('probability must be between 0 and 1.');
  }
  if (probability <= EPSILON || probability >= 1 - EPSILON) return 0;
  return -(probability * Math.log2(probability)) - ((1 - probability) * Math.log2(1 - probability));
}

export function curriculumLayout({ reasoningSteps, latentSteps, answerTokens }) {
  assertNonNegativeInteger(reasoningSteps, 'reasoningSteps');
  assertNonNegativeInteger(latentSteps, 'latentSteps');
  assertNonNegativeInteger(answerTokens, 'answerTokens');
  if (latentSteps > reasoningSteps) {
    throw new RangeError('latentSteps cannot exceed reasoningSteps in this curriculum toy model.');
  }

  const positions = [
    ...Array.from({ length: latentSteps }, (_, index) => ({
      type: 'latent',
      label: `h${index + 1}`,
      supervised: false,
    })),
    ...Array.from({ length: reasoningSteps - latentSteps }, (_, index) => ({
      type: 'reasoning-token',
      label: `r${latentSteps + index + 1}`,
      supervised: true,
    })),
    ...Array.from({ length: answerTokens }, (_, index) => ({
      type: 'answer-token',
      label: `a${index + 1}`,
      supervised: true,
    })),
  ];

  return {
    positions,
    latentCount: latentSteps,
    supervisedCount: positions.filter((position) => position.supervised).length,
    visibleReasoningCount: reasoningSteps - latentSteps,
    totalReasoningComputeSteps: reasoningSteps,
  };
}

export function buildCoconutLab({
  branchA,
  branchB,
  vocabulary,
  branchWeight,
  latentSteps,
  reasoningSteps,
  answerTokens,
  commitmentThreshold = 0.85,
}) {
  const hiddenState = mixVectors(branchA.vector, branchB.vector, branchWeight);
  const decoded = nearestToken(hiddenState, vocabulary);
  const layout = curriculumLayout({ reasoningSteps, latentSteps, answerTokens });
  const entropy = binaryEntropy(branchWeight);
  const maxBranchProbability = Math.max(branchWeight, 1 - branchWeight);

  return {
    hiddenState,
    decoded,
    projectionError: projectionError(hiddenState, decoded.vector),
    routeASimilarity: cosineSimilarity(hiddenState, branchA.vector),
    routeBSimilarity: cosineSimilarity(hiddenState, branchB.vector),
    branchEntropyBits: entropy,
    delayedCommitment: maxBranchProbability < commitmentThreshold,
    layout,
    latentFeedbackInput: hiddenState,
    decodedFeedbackInput: normalizeVector(decoded.vector),
  };
}
