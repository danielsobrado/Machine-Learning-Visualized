export const DIFFUSION_CODE_LABS = [
  // --- diffusion-basics ---
  {
    id: 'diff-beta-schedule',
    stepLabel: '72.1',
    group: 'Noise scale',
    title: 'Linear Beta Schedule',
    concept: 'Diffusion models inject noise sequentially according to variance schedule parameters beta_t.',
    objective: 'Compute beta_t for step t (0-indexed) under a linear schedule from beta_min to beta_max over T total steps.',
    difficulty: 'warmup',
    starterCode: `function getBeta(t, totalSteps, betaMin, betaMax) {
  // TODO: compute beta_t = betaMin + (t / (totalSteps - 1)) * (betaMax - betaMin)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('beta step 0', getBeta(0, 11, 0.1, 0.2), 0.1);
check('beta mid step', getBeta(5, 11, 0.1, 0.2), 0.15);
check('beta end step', getBeta(10, 11, 0.1, 0.2), 0.2);
return results;`,
    hints: [
      'Scale the difference (betaMax - betaMin) by the fraction t / (totalSteps - 1).',
      'Add betaMin to the result.',
    ],
    solution: `function getBeta(t, totalSteps, betaMin, betaMax) {
  return betaMin + (t / (totalSteps - 1)) * (betaMax - betaMin);
}`,
    explanation: 'A variance schedule controls the noise injection rate, fading structural features gradually.',
  },
  {
    id: 'diff-forward-sample',
    stepLabel: '72.2',
    group: 'Alpha bar',
    title: 'Forward Diffusion Sample',
    concept: 'The forward process samples x_t directly from x_0: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Generate the noisy sample x_t at step t.',
    difficulty: 'core',
    starterCode: `function forwardDiffuse(x0, noise, alphaBarT) {
  // TODO: return sqrt(alphaBarT) * x0 + sqrt(1 - alphaBarT) * noise
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward diffuse step', forwardDiffuse(1.5, -0.8, 0.64), 0.72); // 0.8*1.5 + 0.6*-0.8 = 1.2 - 0.48 = 0.72
return results;`,
    hints: [
      'Use Math.sqrt to get the square root of alphaBarT and (1 - alphaBarT).',
      'Multiply the roots by x0 and noise respectively, then sum them.',
    ],
    solution: `function forwardDiffuse(x0, noise, alphaBarT) {
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'Closed-form forward sampling allows training the denoiser network at arbitrary time steps without recurrent unrolling.',
  },

  // --- diffusion-sampling ---
  {
    id: 'diff-reverse-step-calc',
    stepLabel: '73.1',
    group: 'posterior mean',
    title: 'DDPM Reverse Step Mean',
    concept: 'Denoising steps estimate the posterior mean: mu_t = 1/sqrt(alpha_t) * (x_t - (beta_t / sqrt(1 - alpha_bar_t)) * eps_theta).',
    objective: 'Compute the reverse step mean mu_t.',
    difficulty: 'core',
    starterCode: `function ddpmReverseMean(xt, epsTheta, alphaT, betaT, alphaBarT) {
  // TODO: compute and return the posterior mean mu_t
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
// xt = 1.2, epsTheta = 0.5, alphaT = 0.96, betaT = 0.04, alphaBarT = 0.64
// term: 1/sqrt(0.96) * (1.2 - (0.04 / sqrt(1 - 0.64)) * 0.5)
// = 1/0.9797959 * (1.2 - (0.04 / 0.6) * 0.5)
// = 1.02062 * (1.2 - 0.033333) = 1.02062 * 1.166667 = 1.190724
check('reverse mean step', ddpmReverseMean(1.2, 0.5, 0.96, 0.04, 0.64), 1.190724);
return results;`,
    hints: [
      'Numerator inside: betaT * epsTheta.',
      'Denominator inside: Math.sqrt(1 - alphaBarT).',
      'Parenthesis term: xt - (numerator / denominator).',
      'Return parenthesis term divided by Math.sqrt(alphaT).',
    ],
    solution: `function ddpmReverseMean(xt, epsTheta, alphaT, betaT, alphaBarT) {
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  return inner / Math.sqrt(alphaT);
}`,
    explanation: 'The reverse step mean guides the current sample one step backward toward the clean data distribution.',
  },

  // --- classifier-free-guidance ---
  {
    id: 'cfg-combine-noise',
    stepLabel: '74.1',
    group: 'scale mix',
    title: 'CFG Noise Combination',
    concept: 'Classifier-Free Guidance extrapolates predictions away from unconditioned outputs: eps = eps_uncond + s * (eps_cond - eps_uncond).',
    objective: 'Compute the guided noise prediction vector.',
    difficulty: 'warmup',
    starterCode: `function cfgCombine(epsCond, epsUncond, scale) {
  // TODO: return epsUncond + scale * (epsCond - epsUncond)
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0); // 0.2 + 3 * 0.6 = 2.0
check('scale factor 1.0', cfgCombine(0.8, 0.2, 1.0), 0.8);
check('scale factor 0.0', cfgCombine(0.8, 0.2, 0.0), 0.2);
return results;`,
    hints: [
      'Subtract epsUncond from epsCond, multiply by scale, and add epsUncond.',
    ],
    solution: `function cfgCombine(epsCond, epsUncond, scale) {
  return epsUncond + scale * (epsCond - epsUncond);
}`,
    explanation: 'Guidance scales greater than 1 amplify the influence of conditioning signals, boosting text alignment and image contrast.',
  },

  // --- unet-vs-dit ---
  {
    id: 'unet-skip-shape-calc',
    stepLabel: '75.1',
    group: 'skip concat',
    title: 'U-Net Skip Connection Channels',
    concept: 'U-Net decoders concatenate encoder feature maps along the channel dimension via skip connections.',
    objective: 'Compute output shapes [H, W, Channels] after concatenating decoder activations and skip activations.',
    difficulty: 'warmup',
    starterCode: `function concatSkipShape(decShape, skipShape) {
  // Shapes are [H, W, C]
  // TODO: return combined shape. Assert H and W match, and channels sum.
  // Return null if height or width do not match.
  return null;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('matching shapes concat', concatSkipShape([32, 32, 128], [32, 32, 128]), [32, 32, 256]);
check('mismatch height shape', concatSkipShape([32, 32, 128], [16, 32, 128]), null);
return results;`,
    hints: [
      'Compare decShape[0] with skipShape[0] and decShape[1] with skipShape[1].',
      'If not equal, return null.',
      'Otherwise return [decShape[0], decShape[1], decShape[2] + skipShape[2]].',
    ],
    solution: `function concatSkipShape(decShape, skipShape) {
  if (decShape[0] !== skipShape[0] || decShape[1] !== skipShape[1]) {
    return null;
  }
  return [decShape[0], decShape[1], decShape[2] + skipShape[2]];
}`,
    explanation: 'Skip connections preserve fine spatial coordinates, countering downsampling information loss.',
  },
  {
    id: 'dit-patchify-image',
    stepLabel: '75.2',
    group: 'patch tokens',
    title: 'DiT Patchify Flattening',
    concept: 'Diffusion Transformers (DiT) process visual inputs by dividing images into a sequence of flat patch tokens.',
    objective: 'Convert a 2x2 image grid of 2x2 pixel patches into 4 flattened patch tokens (length 4 each).',
    difficulty: 'core',
    starterCode: `function patchifyImage(image2D, patchSize) {
  // image2D is 4x4 array of pixel values
  // patchSize is 2. The output tokens array should have length 4.
  const tokens = [];
  
  // TODO: extract four 2x2 patches, flatten each to a length 4 array, and push to tokens.
  // Grid order: top-left, top-right, bottom-left, bottom-right.
  
  return tokens;
}`,
    testCode: `const results = [];
function sameArr(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
const img = [
  [1, 2,  9, 10],
  [3, 4, 11, 12],
  [5, 6, 13, 14],
  [7, 8, 15, 16]
];
check('extract patches', patchifyImage(img, 2), [
  [1, 2, 3, 4],
  [9, 10, 11, 12],
  [5, 6, 7, 8],
  [13, 14, 15, 16]
]);
return results;`,
    hints: [
      'Top-left patch: row 0-1, col 0-1.',
      'Top-right patch: row 0-1, col 2-3.',
      'Bottom-left patch: row 2-3, col 0-1.',
      'Bottom-right patch: row 2-3, col 2-3.',
      'Store each group in a 4-element array and push to tokens.',
    ],
    solution: `function patchifyImage(image2D, patchSize) {
  const tokens = [];
  const coords = [
    [0, 0], // top-left
    [0, 2], // top-right
    [2, 0], // bottom-left
    [2, 2]  // bottom-right
  ];
  for (let p = 0; p < coords.length; p++) {
    const rStart = coords[p][0];
    const cStart = coords[p][1];
    const patch = [];
    for (let r = 0; r < patchSize; r++) {
      for (let c = 0; c < patchSize; c++) {
        patch.push(image2D[rStart + r][cStart + c]);
      }
    }
    tokens.push(patch);
  }
  return tokens;
}`,
    explanation: 'Patchifying translates spatial grids into coordinate-grouped tokens compatible with sequence transformer heads.',
  },

  // --- sd3-overview ---
  {
    id: 'sd3-latent-dims',
    stepLabel: '76.1',
    group: 'VAE downscale',
    title: 'SD3 Latent Shape Calculation',
    concept: 'Stable Diffusion 3 downsamples images by a factor of 8 during VAE encoding: H_lat = H / 8, W_lat = W / 8.',
    objective: 'Compute VAE latent dimension sizes.',
    difficulty: 'warmup',
    starterCode: `function getSd3LatentShape(width, height) {
  // TODO: divide width and height by 8, return [wLat, hLat]
  return [0, 0];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('512x512 resolution', getSd3LatentShape(512, 512), [64, 64]);
check('1024x768 resolution', getSd3LatentShape(1024, 768), [128, 96]);
return results;`,
    hints: [
      'Divide width and height by 8.',
    ],
    solution: `function getSd3LatentShape(width, height) {
  return [width / 8, height / 8];
}`,
    explanation: 'Latent-space representation minimizes visual redundancies, reducing computation budgets significantly.',
  },

  // --- flow-matching ---
  {
    id: 'flow-linear-interp',
    stepLabel: '77.1',
    group: 'linear interp',
    title: 'Flow Path Interpolation',
    concept: 'Flow matching defines a velocity vector field along linear paths: x_t = (1 - t) * x0 + t * x1.',
    objective: 'Interpolate coordinate x_t at time t (between 0 and 1) between data x0 and noise x1.',
    difficulty: 'warmup',
    starterCode: `function getFlowInterpolation(x0, x1, t) {
  // TODO: compute and return (1 - t) * x0 + t * x1
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('midpoint t=0.5', getFlowInterpolation(2.0, 10.0, 0.5), 6.0);
check('start point t=0.0', getFlowInterpolation(2.0, 10.0, 0.0), 2.0);
check('end point t=1.0', getFlowInterpolation(2.0, 10.0, 1.0), 10.0);
return results;`,
    hints: [
      'Multiply x0 by (1 - t), multiply x1 by t, and add the terms.',
    ],
    solution: `function getFlowInterpolation(x0, x1, t) {
  return (1 - t) * x0 + t * x1;
}`,
    explanation: 'Linear interpolation forms the straight-line trajectory matched by flow velocity predictors.',
  },
  {
    id: 'flow-euler-integration',
    stepLabel: '77.2',
    group: 'linear interp',
    title: 'Euler Integration Step',
    concept: 'Flow matching samples are generated by integrating predicted velocities using Euler steps: x_next = x_t + dt * velocity.',
    objective: 'Compute the next position coordinate using Euler integration.',
    difficulty: 'core',
    starterCode: `function eulerStep(xt, velocity, dt) {
  // TODO: return xt + dt * velocity
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
check('positive velocity step', eulerStep(1.5, 4.0, 0.1), 1.9); // 1.5 + 0.4 = 1.9
check('negative velocity step', eulerStep(1.5, -2.0, 0.05), 1.4);
return results;`,
    hints: [
      'Multiply velocity by dt, then add the result to xt.',
    ],
    solution: `function eulerStep(xt, velocity, dt) {
  return xt + dt * velocity;
}`,
    explanation: 'Integrating velocity steps generates data along straight trajectories, yielding better samples with fewer steps.',
  },

  // --- diffusion-vae ---
  {
    id: 'vae-latent-scaling',
    stepLabel: '78.1',
    group: 'encode scale',
    title: 'VAE Latent Scaling',
    concept: 'Latent vectors are scaled to ensure training stability and match unit-variance Gaussian distributions.',
    objective: 'Apply the standard scaling factor (e.g. 0.18215) to visual latent representation values.',
    difficulty: 'warmup',
    starterCode: `function scaleLatent(val, factor = 0.18215) {
  // TODO: return val multiplied by factor
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard scale', scaleLatent(5.0), 0.91075);
return results;`,
    hints: [
      'Multiply val by factor.',
    ],
    solution: `function scaleLatent(val, factor = 0.18215) {
  return val * factor;
}`,
    explanation: 'Scaling coordinates avoids vanishing activation magnitudes, preserving gradients across deep blocks.',
  },

  // --- tokenizer-bpe ---
  {
    id: 'bpe-count-pair-freqs',
    stepLabel: '79.1',
    group: 'pair count',
    title: 'BPE Pair Frequencies',
    concept: 'Byte-Pair Encoding identifies the most common adjacent token sequences to build vocabulary merges.',
    objective: 'Count frequencies of adjacent token pairs in a tokenized corpus.',
    difficulty: 'core',
    starterCode: `function countPairs(tokensList) {
  const freqs = {};
  
  // tokensList is an array of arrays of strings: [['l', 'o', 'w'], ['n', 'e', 'w', 'e', 'r']]
  // TODO: Iterate over each token list. For each adjacent pair (tokens[i], tokens[i+1]),
  // join them as "tokenA,tokenB" and increment counts in freqs.
  
  return freqs;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
const corpus = [['l', 'o', 'w'], ['l', 'o', 'w', 'e', 'r']];
check('pair counts', countPairs(corpus), { 'l,o': 2, 'o,w': 2, 'w,e': 1, 'e,r': 1 });
return results;`,
    hints: [
      'Loop over each word in tokensList.',
      'For each word, loop index i from 0 to word.length - 2.',
      'Join word[i] and word[i+1] with a comma: const pair = word[i] + "," + word[i+1].',
      'Increment freqs[pair] = (freqs[pair] || 0) + 1.',
    ],
    solution: `function countPairs(tokensList) {
  const freqs = {};
  for (let w = 0; w < tokensList.length; w++) {
    const word = tokensList[w];
    for (let i = 0; i < word.length - 1; i++) {
      const pair = word[i] + ',' + word[i + 1];
      freqs[pair] = (freqs[pair] || 0) + 1;
    }
  }
  return freqs;
}`,
    explanation: 'Counting pair frequencies reveals which tokens appear together most frequently, identifying prospective merge operations.',
  },
  {
    id: 'bpe-merge-tokens-list',
    stepLabel: '79.2',
    group: 'merge rule',
    title: 'BPE Token Merging',
    concept: 'BPE merges occur by replacing adjacent matching token pairs with combined symbols.',
    objective: 'Merge all adjacent instances of a target pair (e.g. ["l", "o"]) into a single symbol ("lo").',
    difficulty: 'core',
    starterCode: `function mergePair(wordTokens, pairTarget) {
  // wordTokens is ['l', 'o', 'w']
  // pairTarget is ['l', 'o']
  const merged = [];
  
  // TODO: Loop through wordTokens and replace adjacent pairTarget values with merged string
  
  return merged;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('merge lo in low', mergePair(['l', 'o', 'w'], ['l', 'o']), ['lo', 'w']);
check('merge duplicate letters', mergePair(['a', 'a', 'a'], ['a', 'a']), ['aa', 'a']);
return results;`,
    hints: [
      'Loop index i from 0 to wordTokens.length - 1.',
      'If i < length - 1 and wordTokens[i] === pairTarget[0] and wordTokens[i+1] === pairTarget[1], push combined string and increment i.',
      'Otherwise, push wordTokens[i].',
    ],
    solution: `function mergePair(wordTokens, pairTarget) {
  const merged = [];
  let i = 0;
  while (i < wordTokens.length) {
    if (i < wordTokens.length - 1 && wordTokens[i] === pairTarget[0] && wordTokens[i + 1] === pairTarget[1]) {
      merged.push(pairTarget[0] + pairTarget[1]);
      i += 2;
    } else {
      merged.push(wordTokens[i]);
      i++;
    }
  }
  return merged;
}`,
    explanation: 'Replacing character pairs progressively builds longer subword vocabularies, reducing sequence token counts.',
  },

  // --- clip-encoder ---
  {
    id: 'clip-l2-norm',
    stepLabel: '80.1',
    group: 'L2 normalize',
    title: 'CLIP Vector L2 Normalization',
    concept: 'CLIP maps text and image embeddings to a shared latent space, normalizing vectors to lie on a unit hypersphere.',
    objective: 'Compute the L2 normalized vector: v / ||v||.',
    difficulty: 'warmup',
    starterCode: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vec;
  
  // TODO: divide each vector coordinate by norm and return the normalized array
  return vec;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('normalize 2D vector', l2Normalize([3.0, 4.0]), [0.6, 0.8]);
return results;`,
    hints: [
      'Map each element coordinate x to x / norm.',
    ],
    solution: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm === 0) return vec;
  return vec.map(x => x / norm);
}`,
    explanation: 'L2 normalization simplifies cosine similarity calculations to basic dot products, accelerating retrieval and matching loops.',
  },

  // --- t5-encoder ---
  {
    id: 't5-pad-attention-mask',
    stepLabel: '81.1',
    group: 'pad mask',
    title: 'T5 Padding Attention Mask',
    concept: 'T5 text encoders block attention to padding tokens by constructing boolean masks.',
    objective: 'Generate a binary attention mask where valid tokens are 1 and pad tokens are 0.',
    difficulty: 'warmup',
    starterCode: `function getAttentionMask(tokenIds, padId) {
  // TODO: map tokenIds to 1 if token is not padId, otherwise 0
  return [];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('mask out padding ID 0', getAttentionMask([42, 107, 0, 0], 0), [1, 1, 0, 0]);
return results;`,
    hints: [
      'Use tokenIds.map(id => id !== padId ? 1 : 0).',
    ],
    solution: `function getAttentionMask(tokenIds, padId) {
  return tokenIds.map(id => (id !== padId ? 1 : 0));
}`,
    explanation: 'Padding masks prevent models from aggregating meaningless information from trailing fill tokens.',
  },

  // --- joint-attention ---
  {
    id: 'joint-attn-concat-seq',
    stepLabel: '82.1',
    group: 'Concat Q',
    title: 'Multimodal Sequence Concatenation',
    concept: 'SD3\'s Joint Attention block concatenates text and image tokens along the sequence dimension, letting them interact directly.',
    objective: 'Concatenate text and image token lists into a combined multimodal sequence.',
    difficulty: 'warmup',
    starterCode: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  // textEmbeds and imageEmbeds are arrays of vectors
  // TODO: return a single array containing textEmbeds followed by imageEmbeds
  return [];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('concat sequences', concatEmbeddings([[1, 2]], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
return results;`,
    hints: [
      'Use the JavaScript concat method: textEmbeds.concat(imageEmbeds) or spread operator [...textEmbeds, ...imageEmbeds].',
    ],
    solution: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  return textEmbeds.concat(imageEmbeds);
}`,
    explanation: 'Concatenating modalities enables bidirectional cross-attention without separate cross-attention layers.',
  },

  // --- dit ---
  {
    id: 'dit-adaln-scale-shift',
    stepLabel: '83.1',
    group: 'adaLN scale/shift',
    title: 'AdaLN Scale and Shift',
    concept: 'Diffusion Transformers modulate layers using adaptive layer normalization (adaLN) scale and shift parameters derived from time embeddings.',
    objective: 'Apply the scale and shift modulation: y = x * (1 + scale) + shift.',
    difficulty: 'core',
    starterCode: `function applyAdaLN(x, scale, shift) {
  // TODO: compute and return x * (1 + scale) + shift
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) {
  return Math.abs(a - b) <= tol;
}
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3); // 1.5 * 1.2 + 0.5 = 1.8 + 0.5 = 2.3
check('scale and shift negative', applyAdaLN(1.5, -0.2, -0.5), 0.7); // 1.5 * 0.8 - 0.5 = 1.2 - 0.5 = 0.7
return results;`,
    hints: [
      'Multiply x by (1 + scale).',
      'Add shift to the result.',
    ],
    solution: `function applyAdaLN(x, scale, shift) {
  return x * (1 + scale) + shift;
}`,
    explanation: 'AdaLN conditioning injects temporal context (like noise level) directly into the transformer\'s layer normalization channels.',
  }
];
