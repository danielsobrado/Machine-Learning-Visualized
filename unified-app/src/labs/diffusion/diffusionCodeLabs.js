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
  results.push({ name, actual: JSON.stringify(actual), expected: JSON.stringify(expected), passed: sameArray(actual, expected) });
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
    id: 'cfg-combine-direction',
    stepLabel: '74.1',
    group: 'scale mix',
    title: 'Guidance Direction',
    concept: 'Classifier-Free Guidance extrapolates predictions away from unconditioned outputs. First, we find the direction vector between the conditional and unconditional predictions.',
    objective: 'Compute the guidance direction: epsCond - epsUncond.',
    difficulty: 'warmup',
    starterCode: `function cfgCombine(epsCond, epsUncond, scale) {
  // TODO: compute guidance direction
  const direction = 0;
  
  const scaledDirection = scale * direction;
  return epsUncond + scaledDirection;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0);
return results;`,
    hints: [
      'Subtract epsUncond from epsCond.',
    ],
    solution: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  
  const scaledDirection = scale * direction;
  return epsUncond + scaledDirection;
}`,
    explanation: 'The direction vector points away from the generic unconditioned output toward the specific prompt-aligned output.',
  },
  {
    id: 'cfg-combine-scaled',
    stepLabel: '74.2',
    group: 'scale mix',
    title: 'Guidance Amplification',
    concept: 'We amplify the guidance direction by multiplying it by the guidance scale (usually > 1.0).',
    objective: 'Compute the scaled direction: scale * direction.',
    difficulty: 'core',
    starterCode: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  
  // TODO: compute the scaled direction
  const scaledDirection = 0;
  
  return epsUncond + scaledDirection;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0);
return results;`,
    hints: [
      'Multiply direction by scale.',
    ],
    solution: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  
  const scaledDirection = scale * direction;
  
  return epsUncond + scaledDirection;
}`,
    explanation: 'A scale greater than 1 forces the model to strongly favor the conditioning signal over the unconditioned prior.',
  },
  {
    id: 'cfg-combine-baseline',
    stepLabel: '74.3',
    group: 'scale mix',
    title: 'Unconditioned Baseline',
    concept: 'The extrapolated direction is anchored back onto the unconditioned baseline prediction to form the final noise estimate.',
    objective: 'Identify the unconditioned baseline to add to the scaled direction.',
    difficulty: 'warmup',
    starterCode: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  const scaledDirection = scale * direction;
  
  // TODO: set the baseline to epsUncond
  const baseline = 0;
  
  return baseline + scaledDirection;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0);
return results;`,
    hints: [
      'Set baseline equal to epsUncond.',
    ],
    solution: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  const scaledDirection = scale * direction;
  
  const baseline = epsUncond;
  
  return baseline + scaledDirection;
}`,
    explanation: 'The unconditioned prediction provides the base structural noise, while the scaled direction steers the semantics.',
  },
  {
    id: 'cfg-combine-full',
    stepLabel: '74.4',
    group: 'scale mix',
    title: 'Full CFG Combination',
    concept: 'The final guided noise prediction vector is the combination of the baseline and the scaled direction.',
    objective: 'Add the baseline and scaled direction together to return the full CFG result.',
    difficulty: 'core',
    starterCode: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  const scaledDirection = scale * direction;
  const baseline = epsUncond;
  
  // TODO: add baseline and scaledDirection
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale factor 3.0', cfgCombine(0.8, 0.2, 3.0), 2.0);
check('scale factor 1.0', cfgCombine(0.8, 0.2, 1.0), 0.8);
check('scale factor 0.0', cfgCombine(0.8, 0.2, 0.0), 0.2);
return results;`,
    hints: [
      'Return baseline + scaledDirection.',
    ],
    solution: `function cfgCombine(epsCond, epsUncond, scale) {
  const direction = epsCond - epsUncond;
  const scaledDirection = scale * direction;
  const baseline = epsUncond;
  
  return baseline + scaledDirection;
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
    id: 'dit-adaln-factor',
    stepLabel: '83.1',
    group: 'adaLN scale/shift',
    title: 'Scale Factor',
    concept: 'Diffusion Transformers modulate layers using adaptive layer normalization (adaLN). The scale parameter acts as a delta, so the true multiplier is 1 + scale.',
    objective: 'Compute the true scale multiplier: 1 + scale.',
    difficulty: 'warmup',
    starterCode: `function applyAdaLN(x, scale, shift) {
  // TODO: compute 1 + scale
  const scaleMultiplier = 0;
  
  const scaledX = x * scaleMultiplier;
  return scaledX + shift;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3);
return results;`,
    hints: [
      'Add 1 to scale.',
    ],
    solution: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  
  const scaledX = x * scaleMultiplier;
  return scaledX + shift;
}`,
    explanation: 'By treating the predicted scale as a delta centered at zero, the network naturally defaults to identity initialization (multiplier = 1).',
  },
  {
    id: 'dit-adaln-apply-scale',
    stepLabel: '83.2',
    group: 'adaLN scale/shift',
    title: 'Apply Scaling',
    concept: 'We apply the scale multiplier directly to the normalized input vector x.',
    objective: 'Multiply the input x by the scale multiplier.',
    difficulty: 'core',
    starterCode: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  
  // TODO: multiply x by scaleMultiplier
  const scaledX = 0;
  
  return scaledX + shift;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3);
return results;`,
    hints: [
      'Compute x * scaleMultiplier.',
    ],
    solution: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  
  const scaledX = x * scaleMultiplier;
  
  return scaledX + shift;
}`,
    explanation: 'This scaling operation injects the magnitude of the conditioning context (like time embedding) into the feature stream.',
  },
  {
    id: 'dit-adaln-apply-shift',
    stepLabel: '83.3',
    group: 'adaLN scale/shift',
    title: 'Apply Shift',
    concept: 'The shift parameter acts as a bias offset applied after scaling.',
    objective: 'Add the shift parameter to the scaled input.',
    difficulty: 'warmup',
    starterCode: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  const scaledX = x * scaleMultiplier;
  
  // TODO: add shift to scaledX
  const shiftedX = 0;
  
  return shiftedX;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3);
return results;`,
    hints: [
      'Compute scaledX + shift.',
    ],
    solution: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  const scaledX = x * scaleMultiplier;
  
  const shiftedX = scaledX + shift;
  
  return shiftedX;
}`,
    explanation: 'The shift biases the mean of the activations based on the conditioning information.',
  },
  {
    id: 'dit-adaln-full',
    stepLabel: '83.4',
    group: 'adaLN scale/shift',
    title: 'Full AdaLN',
    concept: 'The full AdaLN modulation computes the scaled and shifted activation output.',
    objective: 'Return the fully modulated feature value.',
    difficulty: 'core',
    starterCode: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  const scaledX = x * scaleMultiplier;
  const shiftedX = scaledX + shift;
  
  // TODO: return the shiftedX value
  return 0;
}`,
    testCode: `const results = [];
function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Math.abs(actual - expected) < 1e-5 });
}
check('scale and shift positive', applyAdaLN(1.5, 0.2, 0.5), 2.3);
check('scale and shift negative', applyAdaLN(1.5, -0.2, -0.5), 0.7);
return results;`,
    hints: [
      'Return shiftedX.',
    ],
    solution: `function applyAdaLN(x, scale, shift) {
  const scaleMultiplier = 1 + scale;
  const scaledX = x * scaleMultiplier;
  const shiftedX = scaledX + shift;
  
  return shiftedX;
}`,
    explanation: "AdaLN conditioning injects temporal context (like noise level) directly into the transformer's layer normalization channels.",
  }
];
