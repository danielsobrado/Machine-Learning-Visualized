export const DIFFUSION_CODE_LABS = [
  // --- diffusion-basics ---
  {
    id: 'diff-beta-schedule',
    stepLabel: '72.1',
    group: 'Forward diffusion',
    title: 'Linear Beta Schedule',
    concept: 'Diffusion models inject noise sequentially according to variance schedule parameters beta_i.',
    objective: 'Compute beta_i for step i under a linear schedule from betaMin to betaMax over totalSteps.',
    difficulty: 'warmup',
    starterCode: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    // TODO: Compute beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin)
    const beta_i = 0.0;
    
    const alpha_i = 1.0 - beta_i;
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward beta step', forwardDiffusionSample(1.0, 1, 3, 0.1, 0.5, 0.0), 0.793725);
return results;`,
    hints: [
      'Scale (betaMax - betaMin) by the fraction i / (totalSteps - 1).',
      'Add betaMin to the result.',
    ],
    solution: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    
    const alpha_i = 1.0 - beta_i;
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'A variance schedule controls the noise injection rate, fading structural features gradually.',
  },
  {
    id: 'diff-alpha-computation',
    stepLabel: '72.2',
    group: 'Forward diffusion',
    title: 'Alpha computation',
    concept: 'Alpha represents the fraction of the original signal retained at each step.',
    objective: 'Compute alpha_i as 1.0 minus beta_i.',
    difficulty: 'core',
    starterCode: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    
    // TODO: Compute alpha_i = 1.0 - beta_i
    const alpha_i = 1.0;
    
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward alpha step', forwardDiffusionSample(1.0, 1, 3, 0.1, 0.5, 0.0), 0.793725);
return results;`,
    hints: [
      'Subtract beta_i from 1.0.',
    ],
    solution: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    
    const alpha_i = 1.0 - beta_i;
    
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'Subtracting the noise variance gives us the signal retention coefficient.',
  },
  {
    id: 'diff-alpha-bar',
    stepLabel: '72.3',
    group: 'Forward diffusion',
    title: 'Cumulative Alpha',
    concept: 'Alpha bar is the cumulative product of alphas from step 0 up to step t.',
    objective: 'Multiply alphaBarT by alpha_i.',
    difficulty: 'core',
    starterCode: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    const alpha_i = 1.0 - beta_i;
    
    // TODO: Multiply alphaBarT by alpha_i
    
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward alpha bar', forwardDiffusionSample(1.0, 1, 3, 0.1, 0.5, 0.0), 0.793725);
return results;`,
    hints: [
      'Use the *= operator to accumulate the product.',
    ],
    solution: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    const alpha_i = 1.0 - beta_i;
    
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'The cumulative product gives the total signal retained after sequentially passing through all t noise layers.',
  },
  {
    id: 'diff-forward-sample',
    stepLabel: '72.4',
    group: 'Forward diffusion',
    title: 'Forward Diffusion Sample',
    concept: 'The forward process samples x_t directly from x_0: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Generate and return the noisy sample x_t at step t.',
    difficulty: 'core',
    starterCode: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    const alpha_i = 1.0 - beta_i;
    alphaBarT *= alpha_i;
  }
  
  // TODO: return sqrt(alphaBarT) * x0 + sqrt(1 - alphaBarT) * noise
  return 0.0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward diffuse sample', forwardDiffusionSample(1.5, 1, 3, 0.1, 0.5, -0.8), 0.703966);
return results;`,
    hints: [
      'Use Math.sqrt to get the square root of alphaBarT and (1 - alphaBarT).',
      'Multiply the roots by x0 and noise respectively, then sum them.',
    ],
    solution: `function forwardDiffusionSample(x0, t, totalSteps, betaMin, betaMax, noise) {
  let alphaBarT = 1.0;
  
  for (let i = 0; i <= t; i++) {
    const beta_i = betaMin + (i / (totalSteps - 1)) * (betaMax - betaMin);
    const alpha_i = 1.0 - beta_i;
    alphaBarT *= alpha_i;
  }
  
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'Closed-form forward sampling avoids having to simulate thousands of forward steps just to fetch training data.',
  },

  // --- diffusion-sampling ---
  {
    id: 'diff-scheduler-betas',
    stepLabel: '73.1',
    group: 'Beta scheduling',
    title: 'Linear Beta Schedule',
    concept: 'Denoising Diffusion Probabilistic Models (DDPM) corrupt images by adding noise according to a schedule. A linear beta schedule interpolates variance levels from a small start value to a larger end value across T timesteps.',
    objective: 'Generate a linear beta schedule array of size T, representing variance increments at each step.',
    difficulty: 'warmup',
    starterCode: `/**
 * Generates a linear beta schedule for diffusion variance.
 * @param {number} T - Total diffusion timesteps.
 * @param {number} betaStart - Starting variance (beta_0).
 * @param {number} betaEnd - Ending variance (beta_T).
 * @returns {number[]} Array of beta values of size T.
 */
function makeBetaSchedule(T, betaStart, betaEnd) {
  const betas = [];
  // TODO: Fill betas array with linearly interpolated values
  return betas;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule 5 steps', makeBetaSchedule(5, 0.0001, 0.02), [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
check('beta schedule 2 steps', makeBetaSchedule(2, 0.1, 0.5), [0.1, 0.5]);
return results;`,
    hints: [
      'The step increment is (betaEnd - betaStart) / (T - 1).',
      'Loop i from 0 to T-1, calculate beta_i = betaStart + i * step, and push to betas.',
    ],
    solution: `/**
 * Generates a linear beta schedule for diffusion variance.
 * @param {number} T - Total diffusion timesteps.
 * @param {number} betaStart - Starting variance (beta_0).
 * @param {number} betaEnd - Ending variance (beta_T).
 * @returns {number[]} Array of beta values of size T.
 */
function makeBetaSchedule(T, betaStart, betaEnd) {
  const betas = [];
  if (T <= 1) {
    betas.push(betaStart);
    return betas;
  }
  const step = (betaEnd - betaStart) / (T - 1);
  for (let i = 0; i < T; i++) {
    betas.push(betaStart + i * step);
  }
  return betas;
}`,
    explanation: 'A linear schedule gradually ramps up noise, preserving image structure at early steps and applying strong corruption at later ones.',
  },
  {
    id: 'diff-forward-diffusion-step',
    stepLabel: '73.2',
    group: 'Forward noise scheduler',
    title: 'Closed-Form Forward Diffusion',
    concept: 'A major feature of DDPM is that the corrupted latent at any timestep t (x_t) can be computed directly from clean data x_0 in closed-form: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Implement the closed-form forward diffusion equation to add noise to a clean value.',
    difficulty: 'warmup',
    starterCode: `/**
 * Computes a closed-form forward diffusion latent x_t from clean input x_0.
 * @param {number} x0 - Original clean scalar value.
 * @param {number} noise - Sampled Gaussian noise.
 * @param {number} alphaBarT - Cumulative alpha product (alpha_bar_t).
 * @returns {number} Corrupted latent value x_t.
 */
function forwardDiffuse(x0, noise, alphaBarT) {
  // TODO: Compute and return corrupted latent x_t
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward diffuse standard', forwardDiffuse(1.5, -0.8, 0.64), 0.72); // 0.8 * 1.5 + 0.6 * -0.8 = 1.2 - 0.48 = 0.72
check('forward diffuse zero noise', forwardDiffuse(2.0, 0.0, 0.25), 1.0); // 0.5 * 2.0 = 1.0
check('forward diffuse zero signal', forwardDiffuse(0.0, 1.2, 0.0), 1.2); // 1.0 * 1.2 = 1.2
return results;`,
    hints: [
      'Use Math.sqrt(alphaBarT) as the coefficient for x0.',
      'Use Math.sqrt(1 - alphaBarT) as the coefficient for noise.',
      'Add the scaled components together.',
    ],
    solution: `/**
 * Computes a closed-form forward diffusion latent x_t from clean input x_0.
 * @param {number} x0 - Original clean scalar value.
 * @param {number} noise - Sampled Gaussian noise.
 * @param {number} alphaBarT - Cumulative alpha product (alpha_bar_t).
 * @returns {number} Corrupted latent value x_t.
 */
function forwardDiffuse(x0, noise, alphaBarT) {
  return Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;
}`,
    explanation: 'Closed-form forward steps enable efficient neural network training because we can predict noise at any step without unrolling the chain recurrently.',
  },
  {
    id: 'diff-posterior-mean',
    stepLabel: '73.3',
    group: 'Posterior mean estimation',
    title: 'DDPM Reverse Step Mean',
    concept: 'The reverse denoising step calculates the mean of the posterior distribution: mu_t = 1/sqrt(alpha_t) * (x_t - (beta_t / sqrt(1 - alpha_bar_t)) * eps_theta), representing the cleaned-up value prediction.',
    objective: 'Compute the reverse step mean mu_t given predicted noise and variance parameters.',
    difficulty: 'core',
    starterCode: `/**
 * Calculates the posterior mean mu_t of the reverse diffusion distribution.
 * @param {number} xt - Corrupted latent at timestep t.
 * @param {number} epsTheta - Predicted noise from the neural network.
 * @param {number} alphaT - Alpha at timestep t (1 - beta_t).
 * @param {number} betaT - Beta at timestep t.
 * @param {number} alphaBarT - Cumulative alpha product at timestep t.
 * @returns {number} Estimated posterior mean value.
 */
function ddpmReverseMean(xt, epsTheta, alphaT, betaT, alphaBarT) {
  // TODO: Compute and return the reverse step posterior mean mu_t
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
// xt = 1.2, epsTheta = 0.5, alphaT = 0.96, betaT = 0.04, alphaBarT = 0.64
check('reverse mean standard', ddpmReverseMean(1.2, 0.5, 0.96, 0.04, 0.64), 1.190724);
return results;`,
    hints: [
      'Subtract (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta from xt.',
      'Divide the result by Math.sqrt(alphaT).',
    ],
    solution: `/**
 * Calculates the posterior mean mu_t of the reverse diffusion distribution.
 * @param {number} xt - Corrupted latent at timestep t.
 * @param {number} epsTheta - Predicted noise from the neural network.
 * @param {number} alphaT - Alpha at timestep t (1 - beta_t).
 * @param {number} betaT - Beta at timestep t.
 * @param {number} alphaBarT - Cumulative alpha product at timestep t.
 * @returns {number} Estimated posterior mean value.
 */
function ddpmReverseMean(xt, epsTheta, alphaT, betaT, alphaBarT) {
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  return inner / Math.sqrt(alphaT);
}`,
    explanation: 'The posterior mean directs the reverse Markov step, shifting the latent toward a high-density area of clean data.',
  },
  {
    id: 'diff-reverse-denoise-step',
    stepLabel: '73.4',
    group: 'Denoised reverse step',
    title: 'DDPM Complete Denoising Step',
    concept: 'To sample x_{t-1} from x_t, we calculate the posterior mean. If t > 0, we add scaled random noise zNoise ~ N(0, I) to maintain stochastic variety: x_{t-1} = mu_t + sqrt(beta_t) * zNoise. If t = 0, no noise is added.',
    objective: 'Implement the full reverse step, adding noise only if t > 0.',
    difficulty: 'challenge',
    starterCode: `/**
 * Performs one full step of DDPM reverse denoising, returning the sampled x_{t-1}.
 * @param {number} xt - Corrupted latent at timestep t.
 * @param {number} epsTheta - Predicted noise.
 * @param {number} t - Current timestep index (T-1 down to 0).
 * @param {number} alphaT - Alpha at timestep t.
 * @param {number} betaT - Beta at timestep t.
 * @param {number} alphaBarT - Cumulative alpha product at timestep t.
 * @param {number} zNoise - Random Gaussian noise sample.
 * @returns {number} The denoised latent value x_{t-1}.
 */
function ddpmReverseStep(xt, epsTheta, t, alphaT, betaT, alphaBarT, zNoise) {
  // TODO: Compute posterior mean. If t > 0, add zNoise scaled by sqrt(betaT). Return results.
  return 0;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
// xt = 1.2, epsTheta = 0.5, t = 5, alphaT = 0.96, betaT = 0.04, alphaBarT = 0.64, zNoise = 0.1
// mu = 1.190724. Noise addition: sqrt(0.04) * 0.1 = 0.2 * 0.1 = 0.02.
// Total: 1.190724 + 0.02 = 1.210724
check('reverse step t > 0 with noise', ddpmReverseStep(1.2, 0.5, 5, 0.96, 0.04, 0.64, 0.1), 1.210724);
// t = 0 -> no noise added. Total should be mu = 1.190724
check('reverse step t = 0 no noise', ddpmReverseStep(1.2, 0.5, 0, 0.96, 0.04, 0.64, 0.1), 1.190724);
return results;`,
    hints: [
      'First calculate the posterior mean: mu = (xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta) / Math.sqrt(alphaT).',
      'Check if t > 0. If so, return mu + Math.sqrt(betaT) * zNoise.',
      'Otherwise (t === 0), return mu directly.',
    ],
    solution: `/**
 * Performs one full step of DDPM reverse denoising, returning the sampled x_{t-1}.
 * @param {number} xt - Corrupted latent at timestep t.
 * @param {number} epsTheta - Predicted noise.
 * @param {number} t - Current timestep index (T-1 down to 0).
 * @param {number} alphaT - Alpha at timestep t.
 * @param {number} betaT - Beta at timestep t.
 * @param {number} alphaBarT - Cumulative alpha product at timestep t.
 * @param {number} zNoise - Random Gaussian noise sample.
 * @returns {number} The denoised latent value x_{t-1}.
 */
function ddpmReverseStep(xt, epsTheta, t, alphaT, betaT, alphaBarT, zNoise) {
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  if (t > 0) {
    return mu + Math.sqrt(betaT) * zNoise;
  }
  return mu;
}`,
    explanation: 'Adding random variance during early sampling steps represents Langevin dynamics, helping the model escape local modes and produce diverse images.',
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
