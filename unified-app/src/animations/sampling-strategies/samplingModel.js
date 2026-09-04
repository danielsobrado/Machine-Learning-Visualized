const MIN_TEMPERATURE = 1e-6;

function validateProbabilities(probabilities) {
  if (!Array.isArray(probabilities) || probabilities.length === 0) throw new TypeError('probabilities must be non-empty');
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  if (probabilities.some((value) => !Number.isFinite(value) || value < 0) || Math.abs(total - 1) > 1e-9) {
    throw new RangeError('probabilities must be non-negative and sum to one');
  }
}

export function softmax(logits, temperature = 1) {
  if (!Array.isArray(logits) || logits.length === 0 || logits.some((value) => !Number.isFinite(value))) {
    throw new TypeError('logits must be a non-empty finite array');
  }
  if (!Number.isFinite(temperature) || temperature <= 0) throw new RangeError('temperature must be positive');
  const scaled = logits.map((value) => value / Math.max(temperature, MIN_TEMPERATURE));
  const max = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - max));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

export function distributionEntropy(probabilities) {
  validateProbabilities(probabilities);
  return probabilities.reduce((sum, probability) => probability === 0 ? sum : sum - probability * Math.log2(probability), 0);
}

function rankRows(tokens, probabilities) {
  validateProbabilities(probabilities);
  if (tokens.length !== probabilities.length) throw new RangeError('tokens and probabilities must have equal length');
  return tokens
    .map((token, index) => ({ ...token, probability: probabilities[index] }))
    .sort((a, b) => b.probability - a.probability);
}

function renormalize(rows) {
  const mass = rows.reduce((sum, row) => sum + row.probability, 0);
  if (mass <= 0) throw new RangeError('filtered probability mass must be positive');
  return rows.map((row) => ({ ...row, samplingProbability: row.probability / mass }));
}

export function applyTopK(rows, k) {
  if (!Number.isInteger(k) || k <= 0) throw new RangeError('k must be positive');
  return renormalize(rows.slice(0, Math.min(k, rows.length)));
}

export function applyTopP(rows, topP) {
  if (!Number.isFinite(topP) || topP <= 0 || topP > 1) throw new RangeError('topP must be in (0, 1]');
  const kept = [];
  let cumulative = 0;
  for (const row of rows) {
    kept.push(row);
    cumulative += row.probability;
    if (cumulative + 1e-15 >= topP) break;
  }
  return renormalize(kept);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function sampleRows(rows, seed) {
  if (!Array.isArray(rows) || rows.length === 0) throw new TypeError('rows must be non-empty');
  const probabilities = rows.map((row) => row.samplingProbability ?? row.probability);
  const total = probabilities.reduce((sum, value) => sum + value, 0);
  const normalized = probabilities.map((value) => value / total);
  validateProbabilities(normalized);
  const random = mulberry32(seed);
  const draw = random();
  let cumulative = 0;
  for (let index = 0; index < rows.length; index += 1) {
    cumulative += normalized[index];
    if (draw <= cumulative || index === rows.length - 1) return rows[index];
  }
  return rows[rows.length - 1];
}

export function buildTokenDistribution(tokens, temperature) {
  const probabilities = softmax(tokens.map((item) => item.logit), temperature);
  return rankRows(tokens, probabilities).map((row) => ({ ...row, samplingProbability: row.probability }));
}

export function applyStrategy({ rows, strategyId, topK, topP, seed }) {
  if (strategyId === 'greedy') {
    return {
      eligible: [{ ...rows[0], samplingProbability: 1 }],
      selected: rows[0],
    };
  }
  if (strategyId === 'temperature') {
    return { eligible: rows, selected: sampleRows(rows, seed) };
  }
  if (strategyId === 'topK') {
    const eligible = applyTopK(rows, topK);
    return { eligible, selected: sampleRows(eligible, seed) };
  }
  if (strategyId === 'topP') {
    const eligible = applyTopP(rows, topP);
    return { eligible, selected: sampleRows(eligible, seed) };
  }
  throw new RangeError(`unsupported stochastic strategy: ${strategyId}`);
}

function validateBeamTree(tree) {
  if (!tree || !Array.isArray(tree.start) || tree.start.length === 0) throw new TypeError('beam tree requires a start layer');
  const checkLayer = (layer) => {
    const total = layer.reduce((sum, item) => sum + item.probability, 0);
    if (layer.some((item) => !Number.isFinite(item.probability) || item.probability <= 0) || Math.abs(total - 1) > 1e-9) {
      throw new RangeError('each beam layer must contain positive probabilities summing to one');
    }
  };
  checkLayer(tree.start);
  for (const item of tree.start) {
    if (item.next) {
      if (!Array.isArray(tree[item.next])) throw new RangeError(`missing beam layer ${item.next}`);
      checkLayer(tree[item.next]);
    }
  }
}

export function beamSearchTwoStep(tree, width) {
  validateBeamTree(tree);
  if (!Number.isInteger(width) || width <= 0) throw new RangeError('beam width must be positive');
  const first = tree.start
    .map((item) => ({
      tokens: [item.token],
      probability: item.probability,
      logProbability: Math.log(item.probability),
      next: item.next,
    }))
    .sort((a, b) => b.logProbability - a.logProbability)
    .slice(0, width);

  const expanded = first.flatMap((beam) => {
    const layer = beam.next ? tree[beam.next] : [];
    if (layer.length === 0) return [beam];
    return layer.map((item) => ({
      tokens: [...beam.tokens, item.token],
      probability: beam.probability * item.probability,
      logProbability: beam.logProbability + Math.log(item.probability),
    }));
  });

  return expanded.sort((a, b) => b.logProbability - a.logProbability).slice(0, width);
}

export function exhaustiveBestTwoStep(tree) {
  validateBeamTree(tree);
  const all = tree.start.flatMap((first) => tree[first.next].map((second) => ({
    tokens: [first.token, second.token],
    probability: first.probability * second.probability,
  })));
  return all.sort((a, b) => b.probability - a.probability)[0];
}

export function buildSamplingLab({ tokens, strategyId, temperature, topK, topP, beamWidth, seed, beamTree }) {
  const rows = buildTokenDistribution(tokens, temperature);
  if (strategyId === 'beam') {
    const beams = beamSearchTwoStep(beamTree, beamWidth);
    return {
      rows,
      eligible: [],
      selected: beams[0],
      beams,
      entropyBefore: distributionEntropy(beamTree.start.map((row) => row.probability)),
      entropyAfter: null,
      retainedMass: null,
      exhaustiveBest: exhaustiveBestTwoStep(beamTree),
    };
  }

  const result = applyStrategy({ rows, strategyId, topK, topP, seed });
  const eligibleTokenSet = new Set(result.eligible.map((row) => row.token));
  const retainedMass = rows.reduce((sum, row) => sum + (eligibleTokenSet.has(row.token) ? row.probability : 0), 0);
  return {
    rows,
    ...result,
    beams: [],
    entropyBefore: distributionEntropy(rows.map((row) => row.probability)),
    entropyAfter: distributionEntropy(result.eligible.map((row) => row.samplingProbability)),
    retainedMass,
    exhaustiveBest: null,
  };
}
