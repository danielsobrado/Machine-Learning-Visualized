export const FRONTIER_LLM_CODE_LABS = [
  // --- FRONTIER LLM ARCHITECTURE OVERVIEW ---
  {
    id: 'frontier-weight-raw-params',
    stepLabel: '19.1',
    group: 'Weight bytes',
    title: 'Raw Parameter Count',
    concept: 'Frontier LLM serving memory is dominated by parameters. First, we expand the billions shorthand to the absolute number of parameters.',
    objective: 'Expand the billions count by multiplying by 10^9.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: calculate absolute parameter count
  const absoluteParams = 0;
  
  const rawBytes = absoluteParams * bytesPerParam;
  return rawBytes / 1e9;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Multiply numParamsBillions by 1e9.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  const rawBytes = absoluteParams * bytesPerParam;
  return rawBytes / 1e9;
}`,
    explanation: 'A 70B model technically means 70,000,000,000 floating point numbers in memory.',
  },
  {
    id: 'frontier-weight-raw-bytes',
    stepLabel: '19.2',
    group: 'Weight bytes',
    title: 'Raw Byte Size',
    concept: 'Next, we compute the total memory footprint in raw bytes by multiplying the parameter count by the bytes per parameter.',
    objective: 'Multiply absoluteParams by bytesPerParam.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  // TODO: calculate total raw bytes
  const rawBytes = 0;
  
  return rawBytes / 1e9;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Multiply absoluteParams by bytesPerParam.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  
  const rawBytes = absoluteParams * bytesPerParam;
  
  return rawBytes / 1e9;
}`,
    explanation: 'At 16-bit precision, each parameter occupies 2 bytes. At 8-bit precision, each takes 1 byte.',
  },
  {
    id: 'frontier-weight-gb',
    stepLabel: '19.3',
    group: 'Weight bytes',
    title: 'Gigabyte Conversion',
    concept: 'Server memory is measured in Gigabytes (GB). We must divide the raw byte count by 10^9 to convert it to GB.',
    objective: 'Convert rawBytes into GBs.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  const rawBytes = absoluteParams * bytesPerParam;
  
  // TODO: convert rawBytes to Gigabytes
  const gigabytes = 0;
  
  return gigabytes;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Divide rawBytes by 1e9.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const absoluteParams = numParamsBillions * 1e9;
  const rawBytes = absoluteParams * bytesPerParam;
  
  const gigabytes = rawBytes / 1e9;
  
  return gigabytes;
}`,
    explanation: 'Converting to GB puts the memory requirement in the same units used by GPU specs (e.g. 80GB for an A100).',
  },
  {
    id: 'frontier-weight-cancel',
    stepLabel: '19.4',
    group: 'Weight bytes',
    title: 'Cancellation Insight',
    concept: 'Notice that multiplying by 10^9 (billion scale) and dividing by 10^9 (GB scale) perfectly cancels out! We can simplify the entire calculation.',
    objective: 'Replace the 3-step calculation with the simplified direct multiplication.',
    difficulty: 'core',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: use the cancellation insight to simplify
  const gigabytes = 0;
  
  return gigabytes;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
return results;`,
    hints: [
      'Just multiply numParamsBillions by bytesPerParam.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  const gigabytes = numParamsBillions * bytesPerParam;
  
  return gigabytes;
}`,
    explanation: 'Because 1 billion parameters is exactly 1 GB per 1 byte-per-param, we can skip the intermediate 1e9 conversions entirely.',
  },
  {
    id: 'frontier-weight-full',
    stepLabel: '19.5',
    group: 'Weight bytes',
    title: 'Optimized Finalization',
    concept: 'Return the simplified expression directly.',
    objective: 'Return the directly calculated GB footprint.',
    difficulty: 'warmup',
    starterCode: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  // TODO: return the optimized product directly
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Llama 70B FP16', getWeightBytesGB(70, 2), 140);
check('Llama 8B INT8', getWeightBytesGB(8, 1), 8);
return results;`,
    hints: [
      'Return numParamsBillions * bytesPerParam.',
    ],
    solution: `function getWeightBytesGB(numParamsBillions, bytesPerParam) {
  return numParamsBillions * bytesPerParam;
}`,
    explanation: 'Parameter size represents the static memory baseline required to load a model before processing any inputs.',
  },
  {
    id: 'frontier-kv-bytes',
    stepLabel: '19.2',
    group: 'KV bytes',
    title: 'KV Cache size calculation',
    concept: 'The Key-Value (KV) cache grows linearly with sequence length, batch size, and number of layers: size = 2 * layers * kvHeads * headDim * seqLen * bytesPerParam.',
    objective: 'Compute total KV cache bytes for the given inputs.',
    difficulty: 'core',
    starterCode: `function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  // TODO: return total bytes of KV cache
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('Llama 8B layer cache size', getKVCacheBytes(32, 8, 128, 2048, 2), 268435456);
return results;`,
    hints: [
      'Multiply all parameters together along with the factor of 2 (for both Keys and Values).',
      'return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;',
    ],
    solution: `function getKVCacheBytes(layers, kvHeads, headDim, seqLen, bytesPerParam) {
  return 2 * layers * kvHeads * headDim * seqLen * bytesPerParam;
}`,
    explanation: 'KV cache size is the main bottleneck for long-context generation, often exceeding parameter sizes at large batch sizes.',
  },

  // --- FRONTIER MOE SYSTEMS ---
  {
    id: 'moe-active-ratio',
    stepLabel: '20.1',
    group: 'Active fraction',
    title: 'Active Ratio',
    concept: 'At Frontier scale, Mixture of Experts (MoE) models only activate a subset of experts per token to minimize computational costs (FLOPs). First, we find the routing ratio.',
    objective: 'Calculate the active fraction of experts: activeExperts / totalExperts.',
    difficulty: 'warmup',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  // TODO: compute the active ratio
  const activeRatio = 0;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  return nonAttnBase + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Divide activeExperts by totalExperts.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  return nonAttnBase + activeExpertParams;
}`,
    explanation: 'In an 8x7B model that activates 2 experts per token, the active ratio is 2/8 (or 25%).',
  },
  {
    id: 'moe-active-expert-params',
    stepLabel: '20.2',
    group: 'Active fraction',
    title: 'Active Expert Footprint',
    concept: 'We apply the routing ratio to the total expert parameters to find how many expert parameters are actually used during a single forward pass.',
    objective: 'Multiply totalExpertParams by the activeRatio.',
    difficulty: 'core',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  // TODO: compute active expert parameters
  const activeExpertParams = 0;
  
  return nonAttnBase + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Multiply totalExpertParams by activeRatio.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  
  const activeExpertParams = activeRatio * totalExpertParams;
  
  return nonAttnBase + activeExpertParams;
}`,
    explanation: 'This drastically reduces the FLOPs required. You get the capacity of a massive model with the latency of a much smaller one.',
  },
  {
    id: 'moe-active-base',
    stepLabel: '20.3',
    group: 'Active fraction',
    title: 'Static Baseline',
    concept: 'MoE layers only replace the Feed-Forward Network (FFN). The self-attention layers and embeddings (nonAttnBase) still run for every token.',
    objective: 'Identify the static baseline parameters that must always be added.',
    difficulty: 'warmup',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  
  // TODO: set the baseline
  const baseline = 0;
  
  return baseline + activeExpertParams;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'The baseline is nonAttnBase.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  
  const baseline = nonAttnBase;
  
  return baseline + activeExpertParams;
}`,
    explanation: 'The attention mechanism isn\'t conditionally routed, so its parameter footprint is constant.',
  },
  {
    id: 'moe-active-total',
    stepLabel: '20.4',
    group: 'Active fraction',
    title: 'Total Active Parameters',
    concept: 'The final active parameter count per token is the sum of the dense attention layers and the sparse routed experts.',
    objective: 'Add the baseline to the active expert parameters.',
    difficulty: 'core',
    starterCode: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  const baseline = nonAttnBase;
  
  // TODO: return the total active parameters sum
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('Mixtral 8x7B active params', getActiveParams(12, 35, 2, 8), 20.75);
return results;`,
    hints: [
      'Return baseline + activeExpertParams.',
    ],
    solution: `function getActiveParams(nonAttnBase, totalExpertParams, activeExperts, totalExperts) {
  const activeRatio = activeExperts / totalExperts;
  const activeExpertParams = activeRatio * totalExpertParams;
  const baseline = nonAttnBase;
  
  return baseline + activeExpertParams;
}`,
    explanation: 'By activating only 2 out of 8 experts per token, MoE models keep latency low while offering massive model capacities.',
  },

  // --- MULTI-HEAD LATENT ATTENTION ---
  {
    id: 'mla-compression-bottleneck',
    stepLabel: '21.1',
    group: 'Cache size ratio',
    title: 'Latent Bottleneck',
    concept: 'Multi-head Latent Attention (MLA) compresses the KV cache. First, we identify the dimension of the compressed latent space.',
    objective: 'Extract the compressed latent dimension size.',
    difficulty: 'warmup',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  // TODO: identify the compressed size
  const compressedSize = 0;
  
  const standardSize = kvHeads * headDim;
  return compressedSize / standardSize;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Assign compressedSize to latentDim.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  const standardSize = kvHeads * headDim;
  return compressedSize / standardSize;
}`,
    explanation: 'Instead of caching full keys and values for every head, MLA only caches this tiny latent representation.',
  },
  {
    id: 'mla-compression-dense',
    stepLabel: '21.2',
    group: 'Cache size ratio',
    title: 'Dense KV Size',
    concept: 'To understand the savings, we need to know what the memory footprint would have been using standard Multi-Head Attention.',
    objective: 'Calculate the uncompressed KV size: kvHeads * headDim.',
    difficulty: 'core',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  // TODO: compute standard size
  const standardSize = 0;
  
  return compressedSize / standardSize;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Multiply kvHeads by headDim.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  
  const standardSize = kvHeads * headDim;
  
  return compressedSize / standardSize;
}`,
    explanation: 'A model with 128 heads of dimension 128 normally requires 16,384 floats per token just for the cache!',
  },
  {
    id: 'mla-compression-math',
    stepLabel: '21.3',
    group: 'Cache size ratio',
    title: 'Compression Math',
    concept: 'The ratio is exactly the new compressed size divided by the old standard size.',
    objective: 'Compute the ratio of compressedSize to standardSize.',
    difficulty: 'core',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  
  // TODO: calculate the ratio
  const ratio = 0;
  
  return ratio;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Divide compressedSize by standardSize.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  
  const ratio = compressedSize / standardSize;
  
  return ratio;
}`,
    explanation: 'For DeepSeek-V2, this ratio reaches an incredible 1/128th of the original size (0.0078).',
  },
  {
    id: 'mla-compression-full',
    stepLabel: '21.4',
    group: 'Cache size ratio',
    title: 'Full MLA Ratio',
    concept: 'Return the computed MLA compression ratio.',
    objective: 'Return the final ratio value.',
    difficulty: 'warmup',
    starterCode: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  const ratio = compressedSize / standardSize;
  
  // TODO: return the ratio
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('DeepSeek-V2 MLA ratio', getMLACacheRatio(128, 128, 128), 0.0078125);
return results;`,
    hints: [
      'Return the ratio.',
    ],
    solution: `function getMLACacheRatio(latentDim, kvHeads, headDim) {
  const compressedSize = latentDim;
  const standardSize = kvHeads * headDim;
  const ratio = compressedSize / standardSize;
  
  return ratio;
}`,
  explanation: 'MLA reduces the memory footprint of KV caches by more than 90%, allowing much larger batch sizes and context lengths.',
  },

  // --- REASONING RLVR GRPO ---
  {
    id: 'grpo-relative-advantage-sum',
    stepLabel: 'GRPO.1',
    group: 'Relative advantage',
    title: 'Group Score Sum',
    concept: 'Group Relative Policy Optimization (GRPO) calculates advantages relative to a group baseline. First, we need the sum of all scores in the group.',
    objective: 'Compute the sum of all scores in the array.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  
  // TODO: compute the sum of all scores
  const sum = 0;
  
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const adv = getRelativeAdvantages([2, 4, 6]);
check('advantages test', Math.abs(adv[0] - -1.22474) < 1e-4, true);
return results;`,
    hints: [
      'Use reduce, e.g. scores.reduce((sum, s) => sum + s, 0);',
    ],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  
  const mean = sum / n;
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'The sum is the first step to finding the group baseline.',
  },
  {
    id: 'grpo-relative-advantage-mean',
    stepLabel: 'GRPO.2',
    group: 'Relative advantage',
    title: 'Group Baseline Mean',
    concept: 'The mean score acts as the baseline for the group. We subtract this from each individual score to find if it was above or below average.',
    objective: 'Compute the mean by dividing the sum by n.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  
  // TODO: compute mean
  const mean = 0;
  
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const adv = getRelativeAdvantages([2, 4, 6]);
check('advantages test', Math.abs(adv[0] - -1.22474) < 1e-4, true);
return results;`,
    hints: [
      'mean = sum / n;',
    ],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  const mean = sum / n;
  
  let variance = scores.reduce((s, val) => s + Math.pow(val - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'Subtracting the mean centers the advantages around zero.',
  },
  {
    id: 'grpo-relative-advantage-center',
    stepLabel: 'GRPO.3',
    group: 'Relative advantage',
    title: 'Centering Scores',
    concept: 'By subtracting the mean from each score, we get raw centered advantages. Positive means better than average.',
    objective: 'Inside the loop, push (scores[i] - mean) into the advantages array.',
    difficulty: 'warmup',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: push centered score: scores[i] - mean
    advantages.push(0);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('centered scores', getRelativeAdvantages([2, 4, 6]), [-2, 0, 2]);
return results;`,
    hints: [
      'advantages.push(scores[i] - mean);',
    ],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push(scores[i] - mean);
  }
  return advantages;
}`,
    explanation: 'Centered scores act as unscaled advantages.',
  },
  {
    id: 'grpo-relative-advantage',
    stepLabel: 'GRPO.4',
    group: 'Relative advantage',
    title: 'GRPO Advantage Calculation',
    concept: 'To finalize the GRPO advantages, we divide the centered scores by the standard deviation. This normalizes the advantages.',
    objective: 'Divide the centered score by std.',
    difficulty: 'core',
    starterCode: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    // TODO: compute full advantage: (scores[i] - mean) / std
    advantages.push(scores[i] - mean);
  }
  return advantages;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('advantages test', getRelativeAdvantages([2, 4, 6]), [-1.22474, 0, 1.22474]);
return results;`,
    hints: [
      'advantage = (scores[i] - mean) / std;',
    ],
    solution: `function getRelativeAdvantages(scores) {
  const n = scores.length;
  const mean = scores.reduce((sum, s) => sum + s, 0) / n;
  
  let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / n;
  const std = Math.sqrt(variance) || 1e-8;
  
  const advantages = [];
  for (let i = 0; i < n; i++) {
    advantages.push((scores[i] - mean) / std);
  }
  return advantages;
}`,
    explanation: 'By standardizing scores within a group, GRPO avoids needing a learned value network, simplifying the RL pipeline.',
  },

  // --- TEST-TIME COMPUTE THINKING BUDGETS ---
  {
    id: 'budget-thinking-check-complete',
    stepLabel: '23.1',
    group: 'Budget split',
    title: 'Thinking Token Search',
    concept: 'Test-time compute thinking models generate reasoning steps between <thought> and </thought> tags before emitting the final answer.',
    objective: 'Check if the tokens array includes the </thought> tag.',
    difficulty: 'warmup',
    starterCode: `function parseThinkingOutput(tokens) {
  // TODO: set isComplete to true if tokens includes '</thought>'
  const isComplete = false;
  
  const thoughtTokens = [];
  const answerTokens = [];
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('thought ongoing', parseThinkingOutput(['<thought>', 'Let', 'me', 'think']).isComplete, false);
check('thought ended', parseThinkingOutput(['<thought>', 'Okay', '</thought>', 'Answer:']).isComplete, true);
return results;`,
    hints: [
      "Use tokens.includes('</thought>')",
    ],
    solution: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  
  const thoughtTokens = [];
  const answerTokens = [];
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    explanation: 'Detecting the end tag allows the server to switch from reasoning mode to output generation mode.',
  },
  {
    id: 'budget-thinking-check-index',
    stepLabel: '23.2',
    group: 'Budget split',
    title: 'Find Thought Boundary',
    concept: 'To split the output, we need to locate exactly where the reasoning ends.',
    objective: 'Find the index of </thought> using indexOf().',
    difficulty: 'warmup',
    starterCode: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  
  // TODO: find the index of '</thought>'
  const endIndex = -1;
  
  const thoughtTokens = [];
  const answerTokens = [];
  
  return { isComplete, endIndex, thoughtTokens, answerTokens };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('boundary index', parseThinkingOutput(['<thought>', 'Okay', '</thought>', 'Answer:']).endIndex, 2);
return results;`,
    hints: [
      'endIndex = tokens.indexOf("</thought>");',
    ],
    solution: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  const endIndex = tokens.indexOf('</thought>');
  
  const thoughtTokens = [];
  const answerTokens = [];
  
  return { isComplete, endIndex, thoughtTokens, answerTokens };
}`,
    explanation: 'Finding the index is required before slicing the array.',
  },
  {
    id: 'budget-thinking-check-thoughts',
    stepLabel: '23.3',
    group: 'Budget split',
    title: 'Extracting Thoughts',
    concept: 'We can now isolate the internal thought process by slicing the array from the start tag to the end tag.',
    objective: 'Slice the tokens array from index 1 to endIndex to get the thought tokens.',
    difficulty: 'warmup',
    starterCode: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  const endIndex = tokens.indexOf('</thought>');
  
  let thoughtTokens = [];
  let answerTokens = [];
  
  if (isComplete) {
    // TODO: set thoughtTokens by slicing from index 1 to endIndex
    thoughtTokens = [];
  }
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = parseThinkingOutput(['<thought>', 'Step', '1', '</thought>', 'Answer']);
check('thought extracted', out.thoughtTokens, ['Step', '1']);
return results;`,
    hints: [
      'thoughtTokens = tokens.slice(1, endIndex);',
    ],
    solution: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  const endIndex = tokens.indexOf('</thought>');
  
  let thoughtTokens = [];
  let answerTokens = [];
  
  if (isComplete) {
    thoughtTokens = tokens.slice(1, endIndex);
  }
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    explanation: 'Test-time compute models use these thoughts internally to structure their final response.',
  },
  {
    id: 'budget-thinking-check',
    stepLabel: '23.4',
    group: 'Budget split',
    title: 'Extracting Final Answer',
    concept: 'Once thinking is complete, any tokens emitted after the closing tag form the final user-facing response.',
    objective: 'Slice the tokens array from endIndex + 1 to the end to get the answer tokens.',
    difficulty: 'core',
    starterCode: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  const endIndex = tokens.indexOf('</thought>');
  
  let thoughtTokens = [];
  let answerTokens = [];
  
  if (isComplete) {
    thoughtTokens = tokens.slice(1, endIndex);
    // TODO: set answerTokens by slicing from endIndex + 1
    answerTokens = [];
  }
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const out = parseThinkingOutput(['<thought>', 'Step', '1', '</thought>', 'Final', 'Answer']);
check('answer extracted', out.answerTokens, ['Final', 'Answer']);
return results;`,
    hints: [
      'answerTokens = tokens.slice(endIndex + 1);',
    ],
    solution: `function parseThinkingOutput(tokens) {
  const isComplete = tokens.includes('</thought>');
  const endIndex = tokens.indexOf('</thought>');
  
  let thoughtTokens = [];
  let answerTokens = [];
  
  if (isComplete) {
    thoughtTokens = tokens.slice(1, endIndex);
    answerTokens = tokens.slice(endIndex + 1);
  }
  
  return { isComplete, thoughtTokens, answerTokens };
}`,
    explanation: 'By splitting thoughts and answers, the UI can render reasoning chains dynamically in an accordion while displaying the answer plainly.',
  },

  // --- LONG CONTEXT FRONTIER MODELS ---
  {
    id: 'long-context-scale-factor',
    stepLabel: '24.1',
    group: 'Linear seq scaling',
    title: 'Context Growth Factor',
    concept: 'Long context models scale their KV cache memory footprint linearly with context length. The first step is to compute the growth factor.',
    objective: 'Compute the growth factor: newLen / baselineLen.',
    difficulty: 'warmup',
    starterCode: `function scaleMemory(baselineMB, baselineLen, newLen) {
  // TODO: compute growth factor
  const factor = 1;
  
  const scaled = baselineMB * factor;
  return Math.floor(scaled);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale from 4k to 32k', scaleMemory(256, 4096, 32768), 2048);
return results;`,
    hints: [
      'factor = newLen / baselineLen;',
    ],
    solution: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  const scaled = baselineMB * factor;
  return Math.floor(scaled);
}`,
    explanation: 'The factor represents how many times larger the new sequence is compared to the baseline.',
  },
  {
    id: 'long-context-scale-direct',
    stepLabel: '24.2',
    group: 'Linear seq scaling',
    title: 'Direct Scaling Application',
    concept: 'With the growth factor calculated, we apply it directly to the baseline memory footprint.',
    objective: 'Multiply baselineMB by the factor.',
    difficulty: 'warmup',
    starterCode: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  
  // TODO: multiply baselineMB by factor
  const scaled = baselineMB;
  
  return Math.floor(scaled);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale from 4k to 32k', scaleMemory(256, 4096, 32768), 2048);
return results;`,
    hints: [
      'scaled = baselineMB * factor;',
    ],
    solution: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  const scaled = baselineMB * factor;
  return Math.floor(scaled);
}`,
    explanation: 'Because attention memory scales linearly with context length (for KV cache), a 8x longer sequence requires 8x the memory.',
  },
  {
    id: 'long-context-scale-floor',
    stepLabel: '24.3',
    group: 'Linear seq scaling',
    title: 'Integer Memory Bounds',
    concept: 'Memory allocations are often chunked. Using Math.floor ensures we provide a safe lower bound integer.',
    objective: 'Apply Math.floor to the scaled memory.',
    difficulty: 'warmup',
    starterCode: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  const scaled = baselineMB * factor;
  
  // TODO: return the floored value of scaled
  return scaled;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale with floor', scaleMemory(100, 1000, 2500), 250);
return results;`,
    hints: [
      'return Math.floor(scaled);',
    ],
    solution: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  const scaled = baselineMB * factor;
  return Math.floor(scaled);
}`,
    explanation: 'Bounding the memory usage prevents out-of-memory errors from floating point imprecision.',
  },
  {
    id: 'long-context-scale-kv',
    stepLabel: '24.4',
    group: 'Linear seq scaling',
    title: 'Linear sequence memory scaling',
    concept: 'We can optimize the computation into a single step.',
    objective: 'Combine the calculation into a single return statement: Math.floor(baselineMB * (newLen / baselineLen)).',
    difficulty: 'core',
    starterCode: `function scaleMemory(baselineMB, baselineLen, newLen) {
  const factor = newLen / baselineLen;
  const scaled = baselineMB * factor;
  
  // TODO: optimize to a single line
  return Math.floor(scaled);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('scale from 4k to 32k', scaleMemory(256, 4096, 32768), 2048);
return results;`,
    hints: [
      'return Math.floor(baselineMB * (newLen / baselineLen));',
    ],
    solution: `function scaleMemory(baselineMB, baselineLen, newLen) {
  return Math.floor(baselineMB * (newLen / baselineLen));
}`,
    explanation: 'Linear scaling shows how cache requirements grow directly with the input sequence length.',
  },

  // --- OMNI MULTIMODAL ARCHITECTURES ---
  {
    id: 'omni-fuse-vision-scale',
    stepLabel: '25.1',
    group: 'Weighted fuse',
    title: 'Vision Scaling',
    concept: 'Omni models fuse text and vision tokens by applying gating layers. The gate value controls how much of the vision embedding to keep.',
    objective: 'Scale the vision embedding: multiply visionEmb[i] by gate.',
    difficulty: 'warmup',
    starterCode: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    // TODO: compute the scaled vision value
    const vScaled = 0;
    
    fused.push(vScaled);
  }
  return fused;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('vision scale', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [1.5, 2.0]);
return results;`,
    hints: [
      'vScaled = gate * visionEmb[i];',
    ],
    solution: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    const vScaled = gate * visionEmb[i];
    fused.push(vScaled);
  }
  return fused;
}`,
    explanation: 'The gating value allows the network to dynamically attend more to vision or text depending on the input context.',
  },
  {
    id: 'omni-fuse-text-scale',
    stepLabel: '25.2',
    group: 'Weighted fuse',
    title: 'Text Scaling',
    concept: 'The remaining portion of the representation (1 - gate) is allocated to the text embedding.',
    objective: 'Scale the text embedding: multiply textEmb[i] by (1 - gate).',
    difficulty: 'warmup',
    starterCode: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    const vScaled = gate * visionEmb[i];
    
    // TODO: compute the scaled text value
    const tScaled = 0;
    
    fused.push(vScaled + tScaled);
  }
  return fused;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('text scale', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [2.0, 3.0]);
return results;`,
    hints: [
      'tScaled = (1 - gate) * textEmb[i];',
    ],
    solution: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    const vScaled = gate * visionEmb[i];
    const tScaled = (1 - gate) * textEmb[i];
    fused.push(vScaled + tScaled);
  }
  return fused;
}`,
    explanation: 'By strictly tying the two scales together (they sum to 1), the fusion operation preserves the overall magnitude of the activation.',
  },
  {
    id: 'omni-fuse-add',
    stepLabel: '25.3',
    group: 'Weighted fuse',
    title: 'Modality Addition',
    concept: 'Now we merge the scaled embeddings together by adding them.',
    objective: 'Add the scaled vision and text values and push them into the fused array.',
    difficulty: 'warmup',
    starterCode: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    const vScaled = gate * visionEmb[i];
    const tScaled = (1 - gate) * textEmb[i];
    
    // TODO: add vScaled and tScaled and push to fused array
  }
  return fused;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('fuse add', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [2.0, 3.0]);
return results;`,
    hints: [
      'fused.push(vScaled + tScaled);',
    ],
    solution: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    const vScaled = gate * visionEmb[i];
    const tScaled = (1 - gate) * textEmb[i];
    fused.push(vScaled + tScaled);
  }
  return fused;
}`,
    explanation: 'This produces a single, combined sequence vector that can be processed by later transformer blocks natively.',
  },
  {
    id: 'omni-fuse-embeddings',
    stepLabel: '25.4',
    group: 'Weighted fuse',
    title: 'Weighted multimodal embedding fusion',
    concept: 'We can optimize this fusion step into a single line inside the loop.',
    objective: 'Fuse the embeddings directly: output[i] = gate * vision[i] + (1 - gate) * text[i].',
    difficulty: 'core',
    starterCode: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    // TODO: compute the final weighted sum and push directly
    const vScaled = gate * visionEmb[i];
    const tScaled = (1 - gate) * textEmb[i];
    fused.push(vScaled + tScaled);
  }
  return fused;
}`,
    testCode: `const results = [];
function approxArray(a, b, tol = 1e-5) {
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: approxArray(actual, expected) });
}
check('fuse half-half', fuseModalEmbeddings([1.0, 2.0], [3.0, 4.0], 0.5), [2.0, 3.0]);
return results;`,
    hints: [
      'fused.push(gate * visionEmb[i] + (1 - gate) * textEmb[i]);',
    ],
    solution: `function fuseModalEmbeddings(textEmb, visionEmb, gate) {
  const fused = [];
  for (let i = 0; i < textEmb.length; i++) {
    fused.push(gate * visionEmb[i] + (1 - gate) * textEmb[i]);
  }
  return fused;
}`,
    explanation: 'Many modern multimodal architectures, like Gemini, rely heavily on dynamic routing and gating mechanisms for cross-modality understanding.',
  },

  // --- DIFFUSION LANGUAGE MODELS ---
  {
    id: 'diffusion-lm-mask-factor',
    stepLabel: '26.1',
    group: 'Mask ratio',
    title: 'Diffusion Noise Schedule',
    concept: 'Diffusion language models iteratively denoise sequences. The noise schedule defines the fraction of tokens masked at time step t out of T.',
    objective: 'Compute the masking fraction: t / T.',
    difficulty: 'warmup',
    starterCode: `function getMaskCount(seqLen, t, T) {
  // TODO: compute the fraction of tokens to mask
  const fraction = 0;
  
  const rawCount = seqLen * fraction;
  return Math.round(rawCount);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mid diffusion step', getMaskCount(100, 50, 100), 50);
return results;`,
    hints: [
      'fraction = t / T;',
    ],
    solution: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  const rawCount = seqLen * fraction;
  return Math.round(rawCount);
}`,
    explanation: 'The linear noise schedule masks progressively fewer tokens as generation proceeds from t=T down to t=0.',
  },
  {
    id: 'diffusion-lm-mask-raw',
    stepLabel: '26.2',
    group: 'Mask ratio',
    title: 'Sequence Fraction',
    concept: 'We apply the masking fraction to the total sequence length to find how many tokens should be masked.',
    objective: 'Multiply the seqLen by the fraction.',
    difficulty: 'warmup',
    starterCode: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  
  // TODO: multiply seqLen by fraction
  const rawCount = seqLen;
  
  return Math.round(rawCount);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('start diffusion step', getMaskCount(100, 90, 100), 90);
return results;`,
    hints: [
      'rawCount = seqLen * fraction;',
    ],
    solution: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  const rawCount = seqLen * fraction;
  return Math.round(rawCount);
}`,
    explanation: 'This determines the theoretical continuous number of tokens to corrupt.',
  },
  {
    id: 'diffusion-lm-mask-round',
    stepLabel: '26.3',
    group: 'Mask ratio',
    title: 'Discrete Mask Count',
    concept: 'Because we can only mask whole tokens, we round the raw count to the nearest integer.',
    objective: 'Apply Math.round to the raw count.',
    difficulty: 'warmup',
    starterCode: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  const rawCount = seqLen * fraction;
  
  // TODO: return the rounded value
  return rawCount;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('rounding step', getMaskCount(100, 33, 100), 33);
return results;`,
    hints: [
      'return Math.round(rawCount);',
    ],
    solution: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  const rawCount = seqLen * fraction;
  return Math.round(rawCount);
}`,
    explanation: 'Rounding provides the exact discrete number of [MASK] tokens to insert into the input sequence.',
  },
  {
    id: 'diffusion-lm-mask-ratio',
    stepLabel: '26.4',
    group: 'Mask ratio',
    title: 'Diffusion language model mask ratio',
    concept: 'We can optimize the computation into a single step.',
    objective: 'Combine the calculation into a single return statement: Math.round(seqLen * (t / T)).',
    difficulty: 'core',
    starterCode: `function getMaskCount(seqLen, t, T) {
  const fraction = t / T;
  const rawCount = seqLen * fraction;
  
  // TODO: optimize to a single line
  return Math.round(rawCount);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('mid diffusion step', getMaskCount(100, 50, 100), 50);
check('start diffusion step', getMaskCount(100, 90, 100), 90);
return results;`,
    hints: [
      'return Math.round(seqLen * (t / T));',
    ],
    solution: `function getMaskCount(seqLen, t, T) {
  return Math.round(seqLen * (t / T));
}`,
    explanation: 'The noise schedule defines how many tokens are masked/corrupted at each stage of the diffusion generation process.',
  },

  // --- EFFICIENT LLM SERVING ---
  {
    id: 'serving-batch-valid',
    stepLabel: '27.1',
    group: 'Continuous batching',
    title: 'Validate Active Slots',
    concept: 'In continuous batching LLM serving, tokens are processed in shared batch slots. First, we must ensure the active slot count does not exceed the maximum capacity.',
    objective: 'Return Math.min(activeSlots, maxBatchSlots) to ensure we do not exceed capacity.',
    difficulty: 'warmup',
    starterCode: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  // TODO: clamp activeSlots to maxBatchSlots
  const validActive = activeSlots;
  
  return validActive / (maxBatchSlots || 1);
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('clamp slots', getBatchUtilization(40, 32), 1);
return results;`,
    hints: [
      'validActive = Math.min(activeSlots, maxBatchSlots);',
    ],
    solution: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  const validActive = Math.min(activeSlots, maxBatchSlots);
  return validActive / (maxBatchSlots || 1);
}`,
    explanation: 'Hardware limits the maximum parallel requests a GPU can serve.',
  },
  {
    id: 'serving-batch-zero',
    stepLabel: '27.2',
    group: 'Continuous batching',
    title: 'Handle Zero Capacity',
    concept: 'If there are no batch slots available (e.g., node is offline), we must prevent division by zero.',
    objective: 'If maxBatchSlots is 0, return 0.',
    difficulty: 'warmup',
    starterCode: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  // TODO: return 0 if maxBatchSlots is 0
  
  const validActive = Math.min(activeSlots, maxBatchSlots);
  return validActive / maxBatchSlots;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('zero capacity', getBatchUtilization(16, 0), 0);
return results;`,
    hints: [
      'if (maxBatchSlots === 0) return 0;',
    ],
    solution: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  if (maxBatchSlots === 0) return 0;
  const validActive = Math.min(activeSlots, maxBatchSlots);
  return validActive / maxBatchSlots;
}`,
    explanation: 'Checking for zero capacity prevents NaN errors in system monitoring.',
  },
  {
    id: 'serving-batch-ratio',
    stepLabel: '27.3',
    group: 'Continuous batching',
    title: 'Calculate Ratio',
    concept: 'To monitor system load, we divide the active slots by the total available slots.',
    objective: 'Compute the utilization ratio: validActive / maxBatchSlots.',
    difficulty: 'warmup',
    starterCode: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  if (maxBatchSlots === 0) return 0;
  const validActive = Math.min(activeSlots, maxBatchSlots);
  
  // TODO: calculate and return the ratio
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('half utilized', getBatchUtilization(16, 32), 0.5);
return results;`,
    hints: [
      'return validActive / maxBatchSlots;',
    ],
    solution: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  if (maxBatchSlots === 0) return 0;
  const validActive = Math.min(activeSlots, maxBatchSlots);
  return validActive / maxBatchSlots;
}`,
    explanation: 'A ratio near 1.0 indicates the hardware is fully saturated.',
  },
  {
    id: 'serving-batch-utilization',
    stepLabel: '27.4',
    group: 'Continuous batching',
    title: 'Serving batch slot utilization',
    concept: 'We can shorten this logic using a ternary operator.',
    objective: 'Combine into: maxBatchSlots === 0 ? 0 : Math.min(activeSlots, maxBatchSlots) / maxBatchSlots.',
    difficulty: 'core',
    starterCode: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  // TODO: shorten logic with a ternary operator
  if (maxBatchSlots === 0) return 0;
  const validActive = Math.min(activeSlots, maxBatchSlots);
  return validActive / maxBatchSlots;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('half utilized percentage', getBatchUtilization(16, 32), 0.5);
return results;`,
    hints: [
      'return maxBatchSlots === 0 ? 0 : Math.min(activeSlots, maxBatchSlots) / maxBatchSlots;',
    ],
    solution: `function getBatchUtilization(activeSlots, maxBatchSlots) {
  return maxBatchSlots === 0 ? 0 : Math.min(activeSlots, maxBatchSlots) / maxBatchSlots;
}`,
    explanation: 'Continuous batching increases hardware utilization by dynamically packing incoming requests into active GPU scheduling slots.',
  },

  // --- TOOL-USING REASONING MODELS ---
  {
    id: 'tool-use-parse',
    stepLabel: '29.1',
    group: 'Tool call parser',
    title: 'XML Tool Call Parsing',
    concept: 'Tool-using models emit <call:toolName>arguments</call> tags. The agent runtime parses those tags before dispatching.',
    objective: 'Inside runAgentToolStep, parse the first tool call from assistantText using a regex.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  // TODO: match /<call:(\\w+)>(.*?)<\\/call>/ and set toolCall = { name, args } or null.

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { search: (q) => 'found ' + q };
const out = runAgentToolStep('Try <call:search>ml</call>', [], reg);
check('parsed tool call', out.nextMessage, { role: 'tool', name: 'search', content: 'found ml' });
check('no tool means stop', runAgentToolStep('done', [], reg).shouldStop, true);
return results;`,
    hints: [
      'Use text.match(/<call:(\\w+)>(.*?)<\\/call>/).',
      'If matched, toolCall = { name: match[1], args: match[2] }.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) {
    toolCall = { name: match[1], args: match[2] };
  }

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Parsing tool tags is the boundary between free-form LLM text and structured runtime actions.',
  },
  {
    id: 'tool-use-dispatch',
    stepLabel: '29.2',
    group: 'Action dispatcher',
    title: 'Tool Call Dispatcher',
    concept: 'After parsing, the dispatcher looks up the handler, catches failures, and returns a string result.',
    objective: 'Inside runAgentToolStep, dispatch toolCall to registry with missing-tool and error handling.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    let content = '';
    // TODO: dispatch toolCall through registry with try/catch and missing-tool fallback strings.

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const reg = { upper: (s) => s.toUpperCase(), fail: () => { throw new Error('timeout'); } };
check('dispatch success', runAgentToolStep('<call:upper>hi</call>', [], reg).nextMessage.content, 'HI');
check('missing tool', runAgentToolStep('<call:missing>x</call>', [], reg).nextMessage.content, 'Error: Tool "missing" not found');
check('caught error', runAgentToolStep('<call:fail></call>', [], reg).nextMessage.content, 'Error: timeout');
return results;`,
    hints: [
      'Look up registry[toolCall.name].',
      'Return an error string if the tool is missing or throws.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) {
      content = 'Error: Tool "' + toolCall.name + '" not found';
    } else {
      try {
        content = toolFn(toolCall.args);
      } catch (err) {
        content = 'Error: ' + err.message;
      }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Safe dispatch prevents one bad tool call from crashing the whole agent loop.',
  },
  {
    id: 'tool-use-history',
    stepLabel: '29.3',
    group: 'History integration',
    title: 'Tool History Integration',
    concept: 'Successful tool execution appends a tool-role message so the model can read the result on the next turn.',
    objective: 'Inside runAgentToolStep, append the tool result to history without mutating the input array.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    let nextHistory = history;
    // TODO: append { role: 'tool', name: toolCall.name, content } to a copied history array.

    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const hist = [{ role: 'user', content: 'weather?' }];
const out = runAgentToolStep('<call:get_weather>Paris</call>', hist, { get_weather: (x) => 'sunny in ' + x });
check('history append', out.history, [{ role: 'user', content: 'weather?' }, { role: 'tool', name: 'get_weather', content: 'sunny in Paris' }]);
check('input history untouched', hist.length, 1);
return results;`,
    hints: [
      'Copy history with [...history].',
      'Push the tool message object onto the copy.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }

    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'Tool-role messages distinguish execution feedback from assistant prose in the dialog state.',
  },
  {
    id: 'tool-use-agent-loop',
    stepLabel: '29.4',
    group: 'Agent execution loop',
    title: 'Agent Reason-Action Loop',
    concept: 'When no tool call is present the agent stops; when a tool executes the loop continues with shouldStop = false.',
    objective: 'Inside runAgentToolStep, return shouldStop false for tool calls and true for plain assistant text.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: true,
      history: nextHistory,
    };
  }

  // TODO: return assistant nextMessage and the correct shouldStop flag when no tool call is found.
  return { nextMessage: {}, shouldStop: false, history };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const reg = { get_weather: (loc) => 'sunny in ' + loc };
check('tool path continues', runAgentToolStep('<call:get_weather>Paris</call>', [], reg), {
  nextMessage: { role: 'tool', name: 'get_weather', content: 'sunny in Paris' },
  shouldStop: false,
  history: [{ role: 'tool', name: 'get_weather', content: 'sunny in Paris' }],
});
check('plain text stops', runAgentToolStep('All done.', [], reg), {
  nextMessage: { role: 'assistant', content: 'All done.' },
  shouldStop: true,
  history: [],
});
return results;`,
    hints: [
      'Tool execution should set shouldStop to false so the loop continues.',
      'Plain assistant text should set shouldStop to true.',
    ],
    solution: `/**
 * Runs one agent tool step: parse optional tool call, dispatch, append history, decide whether to stop.
 * @param {string} assistantText - Latest assistant message text.
 * @param {Object[]} history - Conversation history updated when a tool executes.
 * @param {Object.<string, function>} registry - Tool name to handler map.
 * @returns {{ nextMessage: Object, shouldStop: boolean, history: Object[] }} Step result.
 */
function runAgentToolStep(assistantText, history, registry) {
  let toolCall = null;
  const match = assistantText.match(/<call:(\\w+)>(.*?)<\\/call>/);
  if (match) toolCall = { name: match[1], args: match[2] };

  if (toolCall) {
    const toolFn = registry[toolCall.name];
    let content = '';
    if (!toolFn) content = 'Error: Tool "' + toolCall.name + '" not found';
    else {
      try { content = toolFn(toolCall.args); } catch (err) { content = 'Error: ' + err.message; }
    }
    const nextHistory = [...history, { role: 'tool', name: toolCall.name, content }];
    return {
      nextMessage: { role: 'tool', name: toolCall.name, content },
      shouldStop: false,
      history: nextHistory,
    };
  }

  return {
    nextMessage: { role: 'assistant', content: assistantText },
    shouldStop: true,
    history,
  };
}`,
    explanation: 'The stop flag is what lets an outer loop alternate between model generation and tool execution.',
  },

  // --- AGENTIC CODING SYSTEMS ---
  {
    id: 'agentic-apply-presence',
    stepLabel: '30.1',
    group: 'Hunk apply',
    title: 'Verify target string',
    concept: 'Agentic coding engines edit code bases by applying diff patches. Before replacing, the agent must verify the target block exists.',
    objective: 'Return true if content includes the targetString.',
    difficulty: 'warmup',
    starterCode: `function applyPatch(content, targetString, replacementString) {
  // TODO: check if the content contains the target block
  const found = false;
  return found;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('found match', applyPatch('let x = 1;\\nreturn x;', 'let x = 1;', 'let x = 2;'), true);
check('missing match', applyPatch('let x = 1;', 'let y = 1;', 'let y = 2;'), false);
return results;`,
    hints: [
      'Use content.includes(targetString);',
    ],
    solution: `function applyPatch(content, targetString, replacementString) {
  const found = content.includes(targetString);
  return found;
}`,
    explanation: 'Strict matching ensures the AI agent does not accidentally modify the wrong section of a file.',
  },
  {
    id: 'agentic-apply-index',
    stepLabel: '30.2',
    group: 'Hunk apply',
    title: 'Locate target string',
    concept: 'Finding the exact index of the target block helps debugging if there are multiple identical blocks.',
    objective: 'Find the index of targetString in content.',
    difficulty: 'warmup',
    starterCode: `function applyPatch(content, targetString, replacementString) {
  // TODO: locate the index of targetString
  const index = -1;
  return index;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('index match', applyPatch('// top\\nlet x = 1;', 'let x = 1;', 'let x = 2;'), 7);
return results;`,
    hints: [
      'Use content.indexOf(targetString);',
    ],
    solution: `function applyPatch(content, targetString, replacementString) {
  const index = content.indexOf(targetString);
  return index;
}`,
    explanation: 'Advanced code agents often use AST parsers or line-number tracking instead of simple string searches.',
  },
  {
    id: 'agentic-apply-error',
    stepLabel: '30.3',
    group: 'Hunk apply',
    title: 'Handle missing targets',
    concept: 'If the target string cannot be found (perhaps due to a hallucination or an outdated read), the system should abort rather than silently corrupting the file.',
    objective: 'If targetString is not in content, throw an Error.',
    difficulty: 'warmup',
    starterCode: `function applyPatch(content, targetString, replacementString) {
  const index = content.indexOf(targetString);
  
  // TODO: throw an Error('Target not found') if index is -1
  
  return true;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
try {
  applyPatch('let x = 1;', 'let y = 1;', 'let y = 2;');
  check('throw error', false, true);
} catch (e) {
  check('throw error', true, true);
}
return results;`,
    hints: [
      "if (index === -1) throw new Error('Target not found');",
    ],
    solution: `function applyPatch(content, targetString, replacementString) {
  const index = content.indexOf(targetString);
  if (index === -1) {
    throw new Error('Target not found');
  }
  return true;
}`,
    explanation: 'Failing fast ensures human operators can review the conflict before it cascades.',
  },
  {
    id: 'agentic-apply-patch',
    stepLabel: '30.4',
    group: 'Hunk apply',
    title: 'Agentic text replacement',
    concept: 'Once verified, the replacement block is swapped into the exact location of the target block.',
    objective: 'Return the updated content using content.replace.',
    difficulty: 'core',
    starterCode: `function applyPatch(content, targetString, replacementString) {
  const index = content.indexOf(targetString);
  if (index === -1) {
    throw new Error('Target not found');
  }
  
  // TODO: replace targetString with replacementString
  return content;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('replace line', applyPatch('let x = 1;\\nreturn x;', 'let x = 1;', 'let x = 2;'), 'let x = 2;\\nreturn x;');
return results;`,
    hints: [
      'return content.replace(targetString, replacementString);',
    ],
    solution: `function applyPatch(content, targetString, replacementString) {
  const index = content.indexOf(targetString);
  if (index === -1) {
    throw new Error('Target not found');
  }
  return content.replace(targetString, replacementString);
}`,
    explanation: 'Applying localized replacements enables developer agents to make targeted code changes without rewriting entire files.',
  }
];
