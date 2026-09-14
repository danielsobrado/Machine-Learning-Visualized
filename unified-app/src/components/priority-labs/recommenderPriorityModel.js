const EPSILON = 1e-12;

function dot(left, right) {
  if (left.length !== right.length) {
    throw new RangeError('Latent vectors must have the same dimension.');
  }
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

export function buildMatrixFactorizationLab({ userFactors, itemFactors, userBias = 0, itemBias = 0, globalBias = 0 }) {
  const latentScore = dot(userFactors, itemFactors);
  return {
    latentScore,
    biasScore: globalBias + userBias + itemBias,
    prediction: globalBias + userBias + itemBias + latentScore,
    contributions: userFactors.map((value, index) => ({
      factor: index + 1,
      user: value,
      item: itemFactors[index],
      contribution: value * itemFactors[index],
    })),
  };
}

export function discountedCumulativeGain(relevances, topK = relevances.length) {
  return relevances
    .slice(0, topK)
    .reduce((sum, relevance, index) => sum + ((2 ** relevance) - 1) / Math.log2(index + 2), 0);
}

export function buildNdcgLab({ relevances, topK }) {
  const k = Math.min(Math.max(1, topK), relevances.length);
  const ideal = [...relevances].sort((left, right) => right - left);
  const dcg = discountedCumulativeGain(relevances, k);
  const idcg = discountedCumulativeGain(ideal, k);

  return {
    topK: k,
    dcg,
    idcg,
    ndcg: dcg / Math.max(EPSILON, idcg),
    ranked: relevances.slice(0, k).map((relevance, index) => ({
      rank: index + 1,
      relevance,
      gain: (2 ** relevance) - 1,
      discount: 1 / Math.log2(index + 2),
      contribution: ((2 ** relevance) - 1) / Math.log2(index + 2),
    })),
    ideal: ideal.slice(0, k),
  };
}
