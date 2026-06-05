export const DIFFUSION_CODE_LABS = [
  // --- diffusion-basics ---
  {
    id: 'diffbasics-beta-schedule',
    stepLabel: '72.1',
    group: 'Noise scale',
    title: 'Linear Beta Schedule',
    concept: 'Diffusion models inject noise according to a variance schedule beta_t. A linear schedule ramps from betaMin to betaMax across T steps.',
    objective: 'Inside diffusionBasicsStep, fill the betas array with linearly spaced schedule values.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  // TODO: push totalSteps linearly spaced beta values from betaMin to betaMax (single step => betaMin).

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule', diffusionBasicsStep(1, 0, 0, 5, 0.0001, 0.02).betas, [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
check('single step', diffusionBasicsStep(1, 0, 0, 1, 0.1, 0.2).betas, [0.1]);
return results;`,
    hints: [
      'Loop i from 0 to totalSteps - 1 and push each beta.',
      'When totalSteps === 1, push betaMin only; otherwise interpolate with i / (totalSteps - 1).',
      'betas.push(betaMin + (totalSteps === 1 ? 0 : i / (totalSteps - 1)) * (betaMax - betaMin));',
    ],
    solution: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    explanation: 'The beta schedule controls how quickly noise is injected across diffusion timesteps.',
  },
  {
    id: 'diffbasics-alpha-bar',
    stepLabel: '72.2',
    group: 'Alpha bar',
    title: 'Cumulative Alpha Bar',
    concept: 'Alpha bar is the cumulative product of (1 - beta_t). It measures how much clean signal survives at step t.',
    objective: 'Inside diffusionBasicsStep, update the alphaBars loop so running accumulates the product of (1 - beta_i).',
    difficulty: 'core',
    starterCode: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    // TODO: multiply running by (1 - betas[i]) and push the updated running value.
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  const passed = Array.isArray(actual) ? sameArray(actual, expected) : approxEqual(actual, expected);
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed });
}
const out = diffusionBasicsStep(1, 0, 2, 3, 0.1, 0.3);
check('alpha bars', out.alphaBars, [0.9, 0.9 * 0.8, 0.9 * 0.8 * 0.7]);
check('alpha bar at t', out.alphaBarT, 0.9 * 0.8 * 0.7);
return results;`,
    hints: [
      'Before pushing, update running *= (1 - betas[i]).',
      'Push running after each multiplication.',
      'Alpha bar at step i is the product of all (1 - beta_j) for j <= i.',
    ],
    solution: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    explanation: 'Cumulative alpha bars let us sample x_t in closed form without unrolling the forward chain.',
  },
  {
    id: 'diffbasics-forward-sample',
    stepLabel: '72.3',
    group: 'Forward sample',
    title: 'Forward Diffusion Sample',
    concept: 'The forward process samples x_t directly from x_0: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Inside diffusionBasicsStep, compute xt from x0, noise, and alphaBarT.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  // TODO: xt = sqrt(alphaBarT) * x0 + sqrt(1 - alphaBarT) * noise

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('forward matches closed form', (() => {
  const out = diffusionBasicsStep(1.5, -0.8, 5, 11, 0.1, 0.2);
  const ab = out.alphaBarT;
  return out.xt;
})(), (() => {
  const out = diffusionBasicsStep(1.5, -0.8, 5, 11, 0.1, 0.2);
  const ab = out.alphaBarT;
  return Math.sqrt(ab) * 1.5 + Math.sqrt(1 - ab) * (-0.8);
})());
check('zero noise', diffusionBasicsStep(2, 0, 0, 5, 0.0001, 0.02).xt, Math.sqrt(0.9999) * 2);
return results;`,
    hints: [
      'Use Math.sqrt for alphaBarT and (1 - alphaBarT).',
      'Scale x0 by sqrt(alphaBarT) and noise by sqrt(1 - alphaBarT).',
      'xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;',
    ],
    solution: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    explanation: 'Closed-form forward sampling trains the denoiser at arbitrary timesteps without recurrent unrolling.',
  },
  {
    id: 'diffbasics-signal-noise',
    stepLabel: '72.4',
    group: 'Signal-to-noise ratio',
    title: 'Signal-to-Noise Ratio',
    concept: 'At timestep t the signal-to-noise ratio SNR = alpha_bar_t / (1 - alpha_bar_t) summarizes how much structure remains versus noise.',
    objective: 'Inside diffusionBasicsStep, compute snr from alphaBarT.',
    difficulty: 'core',
    starterCode: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  // TODO: snr = alphaBarT / (1 - alphaBarT)

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('snr mid schedule', (() => {
  const out = diffusionBasicsStep(1, 0, 5, 11, 0.1, 0.2);
  return out.snr;
})(), (() => {
  const out = diffusionBasicsStep(1, 0, 5, 11, 0.1, 0.2);
  return out.alphaBarT / (1 - out.alphaBarT);
})());
check('snr early step', (() => {
  const out = diffusionBasicsStep(1, 0, 0, 11, 0.1, 0.2);
  return out.snr;
})(), (() => {
  const out = diffusionBasicsStep(1, 0, 0, 11, 0.1, 0.2);
  return out.alphaBarT / (1 - out.alphaBarT);
})());
return results;`,
    hints: [
      'Divide alphaBarT by its noise complement (1 - alphaBarT).',
      'High SNR at early timesteps means the sample is still mostly signal.',
      'snr = alphaBarT / (1 - alphaBarT);',
    ],
    solution: `/**
 * Runs one diffusion basics forward step: beta schedule, alpha-bar accumulation, noisy sample, SNR.
 * @param {number} x0 - Clean signal value.
 * @param {number} noise - Standard normal noise sample paired with x0.
 * @param {number} t - Timestep index (0-based).
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaMin - Starting beta value.
 * @param {number} betaMax - Ending beta value.
 * @returns {{ betas: number[], alphaBars: number[], xt: number, snr: number, alphaBarT: number }} Schedule and forward sample outputs.
 */
function diffusionBasicsStep(x0, noise, t, totalSteps, betaMin, betaMax) {
  const betas = [];
  for (let i = 0; i < totalSteps; i++) {
    const frac = totalSteps === 1 ? 0 : i / (totalSteps - 1);
    betas.push(betaMin + frac * (betaMax - betaMin));
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  const alphaBarT = alphaBars[t];
  let xt = 0;
  xt = Math.sqrt(alphaBarT) * x0 + Math.sqrt(1 - alphaBarT) * noise;

  let snr = 0;
  snr = alphaBarT / (1 - alphaBarT);

  return { betas, alphaBars, xt, snr, alphaBarT };
}`,
    explanation: 'SNR tracks how denoising difficulty grows as more variance is injected through the schedule.',
  },

  // --- diffusion-sampling ---
  {
    id: 'diff-scheduler-betas',
    stepLabel: '73.1',
    group: 'Beta scheduling',
    title: 'Linear Beta Schedule',
    concept: 'DDPM uses a linear beta schedule that ramps noise variance from betaStart to betaEnd across T timesteps.',
    objective: 'Inside ddpmSamplingStep, fill the betas array with linearly interpolated values.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  // TODO: push T linearly spaced beta values from betaStart to betaEnd.

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function sameArray(a, b) { return a.length === b.length && a.every((v, i) => approxEqual(v, b[i])); }
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
}
check('beta schedule', ddpmSamplingStep(0, 0, 0, 5, 0.0001, 0.02, 0, null, null).betas, [0.0001, 0.005075, 0.01005, 0.015025, 0.02]);
return results;`,
    hints: [
      'Step size is (betaEnd - betaStart) / (totalSteps - 1) when totalSteps > 1.',
      'Push betaStart + i * step for each i.',
    ],
    solution: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) {
    betas.push(betaStart);
  } else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) {
      betas.push(betaStart + i * step);
    }
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    explanation: 'The beta schedule controls how quickly signal is replaced by noise across the forward process.',
  },
  {
    id: 'diff-forward-diffusion-step',
    stepLabel: '73.2',
    group: 'Forward noise scheduler',
    title: 'Closed-Form Forward Diffusion',
    concept: 'DDPM can jump directly to x_t with x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise.',
    objective: 'Inside ddpmSamplingStep, compute forwardXt when x0 and forwardNoise are provided.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    // TODO: set forwardXt using closed-form forward diffusion.
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(0, 0, 1, 4, 0.01, 0.04, 0, 1.5, -0.8);
check('forward diffuse', out.forwardXt, 1.339380);
return results;`,
    hints: [
      'Use alphaBars[t] as alpha_bar_t.',
      'forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise.',
    ],
    solution: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    explanation: 'Closed-form forward diffusion lets training sample any noisy timestep without unrolling the chain.',
  },
  {
    id: 'diff-posterior-mean',
    stepLabel: '73.3',
    group: 'Posterior mean estimation',
    title: 'DDPM Reverse Step Mean',
    concept: 'The reverse posterior mean is mu_t = (x_t - (beta_t / sqrt(1 - alpha_bar_t)) * eps_theta) / sqrt(alpha_t).',
    objective: 'Inside ddpmSamplingStep, compute reverseXt as the posterior mean when t = 0 (no extra noise).',
    difficulty: 'core',
    starterCode: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  let reverseXt = 0;
  // TODO: set reverseXt to the posterior mean mu_t (without extra sampling noise).

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const out = ddpmSamplingStep(1.2, 0.5, 2, 5, 0.0001, 0.02, 0.1, null, null);
check('posterior mean', out.reverseXt, 1.175099);
return results;`,
    hints: [
      'Subtract (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta from xt.',
      'Divide by Math.sqrt(alphaT).',
    ],
    solution: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    explanation: 'The posterior mean points the latent toward higher-density regions of the data distribution.',
  },
  {
    id: 'diff-reverse-denoise-step',
    stepLabel: '73.4',
    group: 'Denoised reverse step',
    title: 'DDPM Complete Denoising Step',
    concept: 'For t > 0 the reverse step adds sqrt(beta_t) * zNoise to the posterior mean; at t = 0 it returns the mean alone.',
    objective: 'Inside ddpmSamplingStep, add sampling noise to reverseXt when t > 0.',
    difficulty: 'challenge',
    starterCode: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  // TODO: if t > 0, add Math.sqrt(betaT) * zNoise to reverseXt.

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
const noisy = ddpmSamplingStep(1.2, 0.5, 4, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse with noise', noisy.reverseXt, 1.184866);
const final = ddpmSamplingStep(1.2, 0.5, 0, 10, 0.0001, 0.02, 0.1, null, null);
check('reverse without noise at t=0', final.reverseXt, 1.195060);
return results;`,
    hints: [
      'Start from mu = reverseXt.',
      'Add Math.sqrt(betaT) * zNoise only when t > 0.',
    ],
    solution: `/**
 * Runs one DDPM sampling kernel step: build schedule, optional forward diffuse, reverse denoise sample.
 * @param {number} xt - Noisy latent at timestep t (reverse path input).
 * @param {number} epsTheta - Predicted noise from the denoiser network.
 * @param {number} t - Current timestep index.
 * @param {number} totalSteps - Number of diffusion steps T.
 * @param {number} betaStart - Starting beta value.
 * @param {number} betaEnd - Ending beta value.
 * @param {number} zNoise - Gaussian noise for reverse sampling when t > 0.
 * @param {number|null} x0 - Clean value for forward diffuse tests (null skips forward branch).
 * @param {number|null} forwardNoise - Noise paired with x0 for forward diffuse tests.
 * @returns {{ betas: number[], alphaBars: number[], forwardXt: number|null, reverseXt: number }} Schedule and sample outputs.
 */
function ddpmSamplingStep(xt, epsTheta, t, totalSteps, betaStart, betaEnd, zNoise, x0, forwardNoise) {
  const betas = [];
  if (totalSteps <= 1) betas.push(betaStart);
  else {
    const step = (betaEnd - betaStart) / (totalSteps - 1);
    for (let i = 0; i < totalSteps; i++) betas.push(betaStart + i * step);
  }

  const alphaBars = [];
  let running = 1;
  for (let i = 0; i < totalSteps; i++) {
    running *= (1 - betas[i]);
    alphaBars.push(running);
  }

  let forwardXt = null;
  if (x0 !== null && forwardNoise !== null) {
    const ab = alphaBars[t];
    forwardXt = Math.sqrt(ab) * x0 + Math.sqrt(1 - ab) * forwardNoise;
  }

  const betaT = betas[t];
  const alphaT = 1 - betaT;
  const alphaBarT = alphaBars[t];
  const inner = xt - (betaT / Math.sqrt(1 - alphaBarT)) * epsTheta;
  const mu = inner / Math.sqrt(alphaT);
  let reverseXt = mu;
  if (t > 0) reverseXt = mu + Math.sqrt(betaT) * zNoise;

  return { betas, alphaBars, forwardXt, reverseXt };
}`,
    explanation: 'Stochastic reverse steps maintain sample diversity while the t = 0 step returns a deterministic denoised value.',
  },

  // --- classifier-free-guidance ---
  {
    id: 'cfg-uncond-branch',
    stepLabel: 'CFG.1',
    group: 'Uncond branch',
    title: 'Unconditional Generation',
    concept: 'Classifier-Free Guidance blends a conditional and an unconditional prediction. If the scale is 0, we simply return the unconditional prediction.',
    objective: 'Implement the unconditional branch when scale is 0.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one CFG denoise step on a noise prediction (scalar).
 * @param {number} epsCond - Conditional noise prediction.
 * @param {number} epsUncond - Unconditional noise prediction.
 * @param {number} scale - Guidance scale s (1 = no extra guidance, 0 = fully uncond).
 * @returns {{ guided: number, delta: number }}
 */
function cfgGuidanceStep(epsCond, epsUncond, scale) {
  // TODO: if scale is 0, return the unconditional prediction (and a delta of 0)
  
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  return { guided, delta };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = cfgGuidanceStep(0.8, 0.2, 0);
check('guided equals uncond', res.guided, 0.2);
check('delta is 0', res.delta, 0);
return results;`,
    hints: [
      'Check if scale === 0.',
      'Return { guided: epsUncond, delta: 0 }.',
    ],
    solution: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  if (scale === 0) {
    return { guided: epsUncond, delta: 0 };
  }
  
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  return { guided, delta };
}`,
    explanation: 'A scale of 0 completely ignores the text prompt, generating an unguided image.',
  },
  {
    id: 'cfg-cond-branch',
    stepLabel: 'CFG.2',
    group: 'Cond branch',
    title: 'Standard Generation',
    concept: "If the scale is exactly 1, we don't apply any extra guidance amplification. We simply use the conditional prediction.",
    objective: 'Implement the conditional branch when scale is 1.',
    difficulty: 'warmup',
    starterCode: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  if (scale === 0) {
    return { guided: epsUncond, delta: 0 };
  }
  
  // TODO: if scale is 1, return the conditional prediction
  
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  return { guided, delta };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = cfgGuidanceStep(0.8, 0.2, 1);
check('guided equals cond', res.guided, 0.8);
check('delta equals difference', res.delta, 0.6);
return results;`,
    hints: [
      'Check if scale === 1.',
      'Return { guided: epsCond, delta: epsCond - epsUncond }.',
    ],
    solution: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  if (scale === 0) {
    return { guided: epsUncond, delta: 0 };
  }
  
  if (scale === 1) {
    return { guided: epsCond, delta: epsCond - epsUncond };
  }
  
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  return { guided, delta };
}`,
    explanation: 'A scale of 1 means standard diffusion generation without over-amplifying the text conditioning.',
  },
  {
    id: 'cfg-scale-mix',
    stepLabel: 'CFG.3',
    group: 'Scale mix',
    title: 'Guidance Amplification',
    concept: 'The true power of CFG comes from setting the scale > 1. We calculate the direction pointing from unconditional to conditional, and amplify it.',
    objective: 'Compute the guided prediction using the CFG formula: epsUncond + scale * (epsCond - epsUncond).',
    difficulty: 'core',
    starterCode: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  if (scale === 0) return { guided: epsUncond, delta: 0 };
  if (scale === 1) return { guided: epsCond, delta: epsCond - epsUncond };
  
  // TODO: compute delta and guided prediction
  const delta = 0;
  const guided = 0;
  
  return { guided, delta };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = cfgGuidanceStep(0.8, 0.2, 3.0);
check('guided is amplified', res.guided, 2.0);
check('delta is correct', res.delta, 0.6);
return results;`,
    hints: [
      'Compute delta = epsCond - epsUncond.',
      'Compute guided = epsUncond + scale * delta.',
    ],
    solution: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  if (scale === 0) return { guided: epsUncond, delta: 0 };
  if (scale === 1) return { guided: epsCond, delta: epsCond - epsUncond };
  
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  
  return { guided, delta };
}`,
    explanation: 'By pushing the prediction further away from the unconditional baseline, the model generates images that are much more strongly aligned with the text prompt.',
  },
  {
    id: 'cfg-zero-identity',
    stepLabel: 'CFG.4',
    group: 'Zero-scale identity',
    title: 'Mathematical Identity',
    concept: 'The branches for scale 0 and scale 1 are actually mathematically redundant! If we just evaluate the core formula for scale 0, it gives the exact same result.',
    objective: 'Verify that the core formula inherently handles the scale 0 and 1 cases.',
    difficulty: 'warmup',
    starterCode: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  // Notice we removed the special case branches
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  
  // TODO: Just return the result to prove the math works everywhere
  return { guided: 0, delta: 0 };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res0 = cfgGuidanceStep(0.8, 0.2, 0.0);
check('scale 0 guided', res0.guided, 0.2);
check('scale 0 delta', res0.delta, 0.6);

const res1 = cfgGuidanceStep(0.8, 0.2, 1.0);
check('scale 1 guided', res1.guided, 0.8);
return results;`,
    hints: [
      'Return { guided, delta } directly.',
    ],
    solution: `function cfgGuidanceStep(epsCond, epsUncond, scale) {
  const delta = epsCond - epsUncond;
  const guided = epsUncond + scale * delta;
  
  return { guided, delta };
}`,
    explanation: 'The CFG formula epsUncond + scale * (epsCond - epsUncond) gracefully handles all scale values natively. The branches were just pedagogical steps!',
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
    id: 'sd3-latent-dims-w',
    stepLabel: '76.1',
    group: 'VAE downscale',
    title: 'SD3 Latent Width Calculation',
    concept: 'Stable Diffusion 3 downsamples images by a factor of 8 during VAE encoding. First, we compute the latent width.',
    objective: 'Divide the pixel width by the spatial compression factor (8).',
    difficulty: 'warmup',
    starterCode: `function getSd3LatentShape(width, height) {
  // TODO: calculate the latent width
  const wLat = 0;
  
  return [wLat, 0];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('512 width', getSd3LatentShape(512, 512), [64, 0]);
return results;`,
    hints: [
      'Divide width by 8.',
    ],
    solution: `function getSd3LatentShape(width, height) {
  const wLat = width / 8;
  return [wLat, 0];
}`,
    explanation: 'The latent dimension is significantly smaller, making it easier for the network to process spatial features.',
  },
  {
    id: 'sd3-latent-dims-h',
    stepLabel: '76.2',
    group: 'VAE downscale',
    title: 'SD3 Latent Height Calculation',
    concept: 'Next, we compute the latent height using the same downscale factor of 8.',
    objective: 'Divide the pixel height by 8.',
    difficulty: 'warmup',
    starterCode: `function getSd3LatentShape(width, height) {
  const wLat = width / 8;
  
  // TODO: calculate the latent height
  const hLat = 0;
  
  return [wLat, hLat];
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('512x512 resolution', getSd3LatentShape(512, 512), [64, 64]);
return results;`,
    hints: [
      'Divide height by 8.',
    ],
    solution: `function getSd3LatentShape(width, height) {
  const wLat = width / 8;
  const hLat = height / 8;
  
  return [wLat, hLat];
}`,
    explanation: 'Both width and height are compressed independently by the VAE.',
  },
  {
    id: 'sd3-latent-dims-array',
    stepLabel: '76.3',
    group: 'VAE downscale',
    title: 'Array Construction',
    concept: 'We store the resulting downscaled dimensions in a shape array.',
    objective: 'Construct the array holding the width and height.',
    difficulty: 'warmup',
    starterCode: `function getSd3LatentShape(width, height) {
  const wLat = width / 8;
  const hLat = height / 8;
  
  // TODO: Create an array with the two dimensions
  const shape = [];
  
  return shape;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('512x512 resolution', getSd3LatentShape(512, 512), [64, 64]);
return results;`,
    hints: [
      'Use [wLat, hLat].',
    ],
    solution: `function getSd3LatentShape(width, height) {
  const wLat = width / 8;
  const hLat = height / 8;
  
  const shape = [wLat, hLat];
  
  return shape;
}`,
    explanation: 'The shape array represents the spatial footprint of the latent representation.',
  },
  {
    id: 'sd3-latent-dims',
    stepLabel: '76.4',
    group: 'VAE downscale',
    title: 'SD3 Latent Shape Calculation',
    concept: 'Stable Diffusion 3 downsamples images by a factor of 8 during VAE encoding: H_lat = H / 8, W_lat = W / 8.',
    objective: 'Optimize the function to return the downscaled dimensions directly.',
    difficulty: 'core',
    starterCode: `function getSd3LatentShape(width, height) {
  // TODO: divide width and height by 8, return [wLat, hLat] in one line
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
    id: 'vae-latent-scaling-factor',
    stepLabel: '78.1',
    group: 'encode scale',
    title: 'Scale Factor Definition',
    concept: 'Latent vectors are scaled to ensure training stability and match unit-variance Gaussian distributions.',
    objective: 'Define the standard SD scaling factor of 0.18215.',
    difficulty: 'warmup',
    starterCode: `function scaleLatent(val) {
  // TODO: Define the constant factor 0.18215
  const factor = 1.0;
  
  return val;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('identity', scaleLatent(5.0), 5.0);
return results;`,
    hints: [
      'Set factor to 0.18215.',
    ],
    solution: `function scaleLatent(val) {
  const factor = 0.18215;
  return val;
}`,
    explanation: 'The factor is empirically determined during VAE pre-training to enforce unit variance across the latent space.',
  },
  {
    id: 'vae-latent-scaling-multiply',
    stepLabel: '78.2',
    group: 'encode scale',
    title: 'Latent Scaling Application',
    concept: 'We multiply the raw latent values by the scaling factor.',
    objective: 'Multiply the latent val by the scaling factor.',
    difficulty: 'warmup',
    starterCode: `function scaleLatent(val) {
  const factor = 0.18215;
  
  // TODO: scale the latent value by multiplying it with the factor
  const scaled = val;
  
  return scaled;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard scale', scaleLatent(5.0), 0.91075);
return results;`,
    hints: [
      'scaled = val * factor;',
    ],
    solution: `function scaleLatent(val) {
  const factor = 0.18215;
  
  const scaled = val * factor;
  
  return scaled;
}`,
    explanation: 'Multiplying by the scale factor adjusts the standard deviation of the latents.',
  },
  {
    id: 'vae-latent-scaling-return',
    stepLabel: '78.3',
    group: 'encode scale',
    title: 'Optimized Latent Scaling',
    concept: 'We can supply the factor as a default argument and perform the multiplication inline.',
    objective: 'Return val multiplied by factor directly.',
    difficulty: 'warmup',
    starterCode: `function scaleLatent(val, factor = 0.18215) {
  // TODO: return the multiplied value directly
  return val;
}`,
    testCode: `const results = [];
function approxEqual(a, b, tol = 1e-5) { return Math.abs(a - b) <= tol; }
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approxEqual(actual, expected) });
}
check('standard scale', scaleLatent(5.0), 0.91075);
return results;`,
    hints: [
      'return val * factor;',
    ],
    solution: `function scaleLatent(val, factor = 0.18215) {
  return val * factor;
}`,
    explanation: 'This clean abstraction allows us to scale latents easily without hardcoding the factor inside the logic.',
  },
  {
    id: 'vae-latent-scaling',
    stepLabel: '78.4',
    group: 'encode scale',
    title: 'VAE Latent Scaling',
    concept: 'Scaling coordinates avoids vanishing activation magnitudes, preserving gradients across deep blocks.',
    objective: 'Apply the standard scaling factor (e.g. 0.18215) to visual latent representation values.',
    difficulty: 'core',
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
    id: 'clip-l2-norm-sumsq',
    stepLabel: '80.1',
    group: 'L2 normalize',
    title: 'Sum of Squares',
    concept: 'CLIP maps text and image embeddings to a shared latent space. To compute L2 normalization, we first find the sum of squared elements.',
    objective: 'Accumulate the square of each element in the vector.',
    difficulty: 'warmup',
    starterCode: `function l2Normalize(vec) {
  let sumSq = 0;
  
  for (let i = 0; i < vec.length; i++) {
    // TODO: add the square of vec[i] to sumSq
    sumSq += 0;
  }
  
  return vec;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('no op yet', l2Normalize([3.0, 4.0]), [3.0, 4.0]);
return results;`,
    hints: [
      'sumSq += vec[i] * vec[i];',
    ],
    solution: `function l2Normalize(vec) {
  let sumSq = 0;
  
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  
  return vec;
}`,
    explanation: 'Squaring the elements removes negative signs and emphasizes larger magnitudes.',
  },
  {
    id: 'clip-l2-norm-sqrt',
    stepLabel: '80.2',
    group: 'L2 normalize',
    title: 'L2 Vector Norm',
    concept: 'The L2 norm (magnitude) is the square root of the sum of squares.',
    objective: 'Compute the square root of sumSq.',
    difficulty: 'warmup',
    starterCode: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  
  // TODO: compute the square root to find the norm
  const norm = 0;
  
  return vec;
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('no op yet', l2Normalize([3.0, 4.0]), [3.0, 4.0]);
return results;`,
    hints: [
      'const norm = Math.sqrt(sumSq);',
    ],
    solution: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  
  const norm = Math.sqrt(sumSq);
  
  return vec;
}`,
    explanation: 'This represents the geometric length of the vector in high-dimensional space.',
  },
  {
    id: 'clip-l2-norm-div',
    stepLabel: '80.3',
    group: 'L2 normalize',
    title: 'Vector Normalization',
    concept: 'To project the vector onto a unit hypersphere, we divide each coordinate by the calculated norm.',
    objective: 'Return a new array where each element is divided by norm.',
    difficulty: 'warmup',
    starterCode: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  
  // TODO: map the array, dividing each element x by norm
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
      'return vec.map(x => x / norm);',
    ],
    solution: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  
  return vec.map(x => x / norm);
}`,
    explanation: 'Now the vector has a length of exactly 1.0, making dot products directly equivalent to cosine similarity.',
  },
  {
    id: 'clip-l2-norm',
    stepLabel: '80.4',
    group: 'L2 normalize',
    title: 'CLIP Vector L2 Normalization',
    concept: 'We must also add a safeguard to avoid dividing by zero if an empty or zero vector is passed in.',
    objective: 'Add a check to return vec directly if norm is 0.',
    difficulty: 'core',
    starterCode: `function l2Normalize(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  
  // TODO: if norm is 0, return vec early
  
  return vec.map(x => x / norm);
}`,
    testCode: `const results = [];
function sameArr(a, b, tol = 1e-5) {
  return a.every((v, i) => Math.abs(v - b[i]) <= tol);
}
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArr(actual, expected) });
}
check('normalize 2D vector', l2Normalize([3.0, 4.0]), [0.6, 0.8]);
check('zero vector', l2Normalize([0.0, 0.0]), [0.0, 0.0]);
return results;`,
    hints: [
      'if (norm === 0) return vec;',
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
    id: 't5-pad-attention-mask-init',
    stepLabel: '81.1',
    group: 'pad mask',
    title: 'Mask Array Initialization',
    concept: 'T5 text encoders block attention to padding tokens by constructing boolean masks. We start with an empty array.',
    objective: 'Create and return an empty mask array.',
    difficulty: 'warmup',
    starterCode: `function getAttentionMask(tokenIds, padId) {
  // TODO: initialize and return an empty mask array
  return null;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('init empty', getAttentionMask([42], 0), []);
return results;`,
    hints: [
      'return [];',
    ],
    solution: `function getAttentionMask(tokenIds, padId) {
  const mask = [];
  return mask;
}`,
    explanation: 'The attention mask has the same sequence length as the tokenized text input.',
  },
  {
    id: 't5-pad-attention-mask-loop',
    stepLabel: '81.2',
    group: 'pad mask',
    title: 'Token Iteration',
    concept: 'We iterate through each token in the token sequence.',
    objective: 'Create a loop over the tokenIds and append 1 for each token.',
    difficulty: 'warmup',
    starterCode: `function getAttentionMask(tokenIds, padId) {
  const mask = [];
  
  // TODO: Loop over tokenIds and push 1 to the mask
  
  return mask;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('push ones', getAttentionMask([42, 107], 0), [1, 1]);
return results;`,
    hints: [
      'for (let i = 0; i < tokenIds.length; i++) { mask.push(1); }',
    ],
    solution: `function getAttentionMask(tokenIds, padId) {
  const mask = [];
  for (let i = 0; i < tokenIds.length; i++) {
    mask.push(1);
  }
  return mask;
}`,
    explanation: 'A 1 indicates that the attention mechanism should process this token.',
  },
  {
    id: 't5-pad-attention-mask-cond',
    stepLabel: '81.3',
    group: 'pad mask',
    title: 'Padding Condition',
    concept: 'If the token matches the padId, it should be masked out with a 0 instead of a 1.',
    objective: 'Add a condition to push 0 if the token is padId.',
    difficulty: 'core',
    starterCode: `function getAttentionMask(tokenIds, padId) {
  const mask = [];
  for (let i = 0; i < tokenIds.length; i++) {
    // TODO: If tokenIds[i] is padId, push 0, else push 1
    mask.push(1);
  }
  return mask;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('mask out padding ID 0', getAttentionMask([42, 107, 0, 0], 0), [1, 1, 0, 0]);
return results;`,
    hints: [
      'if (tokenIds[i] === padId) { mask.push(0); } else { mask.push(1); }',
    ],
    solution: `function getAttentionMask(tokenIds, padId) {
  const mask = [];
  for (let i = 0; i < tokenIds.length; i++) {
    if (tokenIds[i] === padId) {
      mask.push(0);
    } else {
      mask.push(1);
    }
  }
  return mask;
}`,
    explanation: 'This manual loop explicitly builds the binary padding mask.',
  },
  {
    id: 't5-pad-attention-mask',
    stepLabel: '81.4',
    group: 'pad mask',
    title: 'T5 Padding Attention Mask',
    concept: 'We can optimize this into a single mapping operation.',
    objective: 'Generate a binary attention mask using tokenIds.map.',
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
    id: 'joint-attn-concat-init',
    stepLabel: '82.1',
    group: 'Concat Q',
    title: 'Array Expansion',
    concept: "SD3's Joint Attention block concatenates text and image tokens along the sequence dimension. We start by copying the text embeddings.",
    objective: 'Create a new array containing all elements of textEmbeds.',
    difficulty: 'warmup',
    starterCode: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  // TODO: Create a new array from textEmbeds
  const joint = [];
  
  return joint;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('copy text', concatEmbeddings([[1, 2]], []), [[1, 2]]);
return results;`,
    hints: [
      'Use the spread operator [...textEmbeds].',
    ],
    solution: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  const joint = [...textEmbeds];
  
  return joint;
}`,
    explanation: 'We must not mutate the original sequence, so we create a new joint sequence array.',
  },
  {
    id: 'joint-attn-concat-loop',
    stepLabel: '82.2',
    group: 'Concat Q',
    title: 'Image Append Loop',
    concept: 'Next, we append each image token sequentially to the end of the text tokens.',
    objective: 'Loop through imageEmbeds and push each token to joint.',
    difficulty: 'warmup',
    starterCode: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  const joint = [...textEmbeds];
  
  // TODO: Loop over imageEmbeds and push to joint
  
  return joint;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: JSON.stringify(actual) === JSON.stringify(expected) });
}
check('concat sequences', concatEmbeddings([[1, 2]], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
return results;`,
    hints: [
      'for (let i = 0; i < imageEmbeds.length; i++) { joint.push(imageEmbeds[i]); }',
    ],
    solution: `function concatEmbeddings(textEmbeds, imageEmbeds) {
  const joint = [...textEmbeds];
  
  for (let i = 0; i < imageEmbeds.length; i++) {
    joint.push(imageEmbeds[i]);
  }
  
  return joint;
}`,
    explanation: 'The resulting sequence length is seq_txt + seq_img.',
  },
  {
    id: 'joint-attn-concat-seq',
    stepLabel: '82.3',
    group: 'Concat Q',
    title: 'Multimodal Sequence Concatenation',
    concept: 'We can optimize this significantly using native array concatenation methods.',
    objective: 'Concatenate text and image token lists into a combined multimodal sequence in one line.',
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
    id: 'dit-time-embed',
    stepLabel: 'DiT.1',
    group: 'Time embed inject',
    title: 'Time Embed Injection',
    concept: 'Diffusion Transformers (DiT) use a time-conditioned embedding (tEmb) to derive per-dimension scale and shift parameters for adaptive Layer Normalization (adaLN).',
    objective: 'Accept precomputed scale and shift from the time embedding, and return an empty block state.',
    difficulty: 'warmup',
    starterCode: `/**
 * Runs one DiT block step: time embedding → adaLN modulation → self-attn stub → MLP residual.
 * @param {number[]} x - Token hidden state.
 * @param {number[]} scale - adaLN scale from tEmb.
 * @param {number[]} shift - adaLN shift from tEmb.
 * @param {number[]} attnOut - Self-attention output.
 * @param {number[]} mlpOut - MLP output.
 * @returns {{ modulated: number[], afterAttn: number[], afterMlp: number[] }}
 */
function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  // TODO: initialize empty arrays for the subsequent steps
  const modulated = [];
  const afterAttn = [];
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}
const res = ditBlockStep([1, 1], [0.1, 0.2], [0.5, 0.5], [0, 0], [0, 0]);
check('empty initialization', res.modulated.length, 0);
return results;`,
    hints: [
      'The arrays are already initialized. Just run the test.',
    ],
    solution: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = [];
  const afterAttn = [];
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    explanation: 'In a real implementation, the time embedding is passed through a linear projection to derive these scale and shift vectors dynamically.',
  },
  {
    id: 'dit-adaln',
    stepLabel: 'DiT.2',
    group: 'adaLN scale/shift',
    title: 'Adaptive LayerNorm',
    concept: 'We apply the adaLN modulation by scaling and shifting the hidden state x using the time-derived parameters.',
    objective: 'Compute the modulated state: x[i] * (1 + scale[i]) + shift[i].',
    difficulty: 'core',
    starterCode: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  
  // TODO: apply adaLN scaling and shifting per dimension
  for (let i = 0; i < x.length; i++) {
    modulated[i] = 0;
  }
  
  const afterAttn = [];
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = ditBlockStep([2.0, -1.0], [0.5, 0.2], [0.1, -0.1], [0, 0], [0, 0]);
check('modulated dim 0', res.modulated[0], 3.1);
check('modulated dim 1', res.modulated[1], -1.3);
return results;`,
    hints: [
      'Iterate over x using a for loop.',
      'For each element, multiply x[i] by (1 + scale[i]) and add shift[i].',
    ],
    solution: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  
  for (let i = 0; i < x.length; i++) {
    modulated[i] = x[i] * (1 + scale[i]) + shift[i];
  }
  
  const afterAttn = [];
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    explanation: 'By shifting and scaling the activations, the time step conditions the network to denoise properly at that specific noise level.',
  },
  {
    id: 'dit-attn-residual',
    stepLabel: 'DiT.3',
    group: 'Self-attn residual',
    title: 'Attention Residual Connection',
    concept: 'After calculating self-attention (which we stub here with attnOut), we add a residual connection from the modulated state.',
    objective: 'Compute the afterAttn state: modulated[i] + attnOut[i].',
    difficulty: 'warmup',
    starterCode: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    modulated[i] = x[i] * (1 + scale[i]) + shift[i];
  }
  
  const afterAttn = new Array(x.length).fill(0);
  // TODO: apply the residual connection around attention
  for (let i = 0; i < x.length; i++) {
    afterAttn[i] = 0;
  }
  
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = ditBlockStep([2.0, -1.0], [0.5, 0.2], [0.1, -0.1], [0.5, -0.5], [0, 0]);
check('afterAttn dim 0', res.afterAttn[0], 3.6);
check('afterAttn dim 1', res.afterAttn[1], -1.8);
return results;`,
    hints: [
      'Iterate over the elements.',
      'Set afterAttn[i] to modulated[i] + attnOut[i].',
    ],
    solution: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    modulated[i] = x[i] * (1 + scale[i]) + shift[i];
  }
  
  const afterAttn = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    afterAttn[i] = modulated[i] + attnOut[i];
  }
  
  const afterMlp = [];
  
  return { modulated, afterAttn, afterMlp };
}`,
    explanation: 'Residual connections ensure smooth gradient flow and allow the network to learn perturbations rather than entirely new states.',
  },
  {
    id: 'dit-mlp-residual',
    stepLabel: 'DiT.4',
    group: 'MLP residual',
    title: 'MLP Residual Connection',
    concept: 'The final step of the DiT block adds a residual connection around the Multi-Layer Perceptron (MLP) component.',
    objective: 'Compute the afterMlp state: afterAttn[i] + mlpOut[i].',
    difficulty: 'warmup',
    starterCode: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    modulated[i] = x[i] * (1 + scale[i]) + shift[i];
  }
  
  const afterAttn = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    afterAttn[i] = modulated[i] + attnOut[i];
  }
  
  const afterMlp = new Array(x.length).fill(0);
  // TODO: apply the residual connection around the MLP
  for (let i = 0; i < x.length; i++) {
    afterMlp[i] = 0;
  }
  
  return { modulated, afterAttn, afterMlp };
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
const res = ditBlockStep([2.0, -1.0], [0.5, 0.2], [0.1, -0.1], [0.5, -0.5], [1.0, 2.0]);
check('afterMlp dim 0', res.afterMlp[0], 4.6);
check('afterMlp dim 1', res.afterMlp[1], 0.2);
return results;`,
    hints: [
      'Iterate over the elements.',
      'Set afterMlp[i] to afterAttn[i] + mlpOut[i].',
    ],
    solution: `function ditBlockStep(x, scale, shift, attnOut, mlpOut) {
  const modulated = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    modulated[i] = x[i] * (1 + scale[i]) + shift[i];
  }
  
  const afterAttn = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    afterAttn[i] = modulated[i] + attnOut[i];
  }
  
  const afterMlp = new Array(x.length).fill(0);
  for (let i = 0; i < x.length; i++) {
    afterMlp[i] = afterAttn[i] + mlpOut[i];
  }
  
  return { modulated, afterAttn, afterMlp };
}`,
    explanation: 'This completes one entire Diffusion Transformer block, incorporating the time conditioning, attention mechanism, and feed-forward MLP.',
  }
];
