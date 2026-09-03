export const INITIALIZATION_METHODS = {
  tiny: {
    label: 'Too small',
    formula: 'Var(W)=0.0064/fan-in',
    description: 'A deliberately weak random scale that makes second moments collapse through depth.',
  },
  xavier: {
    label: 'Xavier / Glorot',
    formula: 'Var(W)=2/(fan-in+fan-out)',
    description: 'A forward/backward compromise for linear or tanh-like layers under mean-field assumptions.',
  },
  heFanIn: {
    label: 'He / Kaiming · fan-in',
    formula: 'Var(W)=2/fan-in',
    description: 'Preserves ReLU forward second moment; rectangular layers can still distort backward scale.',
  },
  heFanOut: {
    label: 'He / Kaiming · fan-out',
    formula: 'Var(W)=2/fan-out',
    description: 'Preserves ReLU backward second moment; rectangular layers can distort forward scale instead.',
  },
  huge: {
    label: 'Too large',
    formula: 'Var(W)=9/fan-in',
    description: 'A deliberately aggressive scale that exposes explosion and nonlinear saturation.',
  },
};

export const ACTIVATION_PROFILES = {
  relu: {
    label: 'ReLU',
    note: 'For centered Gaussian pre-activations, E[ReLU(z)^2]=q/2 and E[(ReLU′(z))^2]=1/2.',
  },
  linear: {
    label: 'Linear',
    note: 'No nonlinear attenuation: activation and derivative second moments are exact from the weight scale.',
  },
  tanh: {
    label: 'tanh',
    note: 'The lab numerically integrates tanh over the current Gaussian pre-activation variance, so saturation is visible instead of assumed away.',
  },
};

export const ARCHITECTURE_PRESETS = {
  balanced: {
    label: 'Balanced stack',
    inputWidth: 64,
    hiddenWidth: 64,
    description: '64 → 64, followed by square hidden layers.',
  },
  bottleneck: {
    label: 'Input bottleneck',
    inputWidth: 256,
    hiddenWidth: 32,
    description: '256 → 32 once, then valid 32 → 32 hidden layers.',
  },
  expansion: {
    label: 'Input expansion',
    inputWidth: 32,
    hiddenWidth: 256,
    description: '32 → 256 once, then valid 256 → 256 hidden layers.',
  },
};

export const INITIALIZATION_DEFAULTS = {
  method: 'heFanIn',
  activation: 'relu',
  inputWidth: 64,
  hiddenWidth: 64,
  layers: 6,
};

export const CONTROL_LIMITS = {
  width: { min: 16, max: 256, step: 16 },
  layers: { min: 2, max: 10, step: 1 },
};

export const HEALTH_THRESHOLDS = {
  vanishing: 0.25,
  exploding: 4,
  tanhDerivativeSaturated: 0.25,
};

export const GAUSSIAN_INTEGRATION = {
  minStandardDeviations: -8,
  maxStandardDeviations: 8,
  steps: 320,
};

export const SYMMETRY_DEFAULTS = {
  input: 1,
  target: 1,
  hiddenWeight: 0,
  outputWeight: 0.5,
  learningRate: 0.2,
  perturbation: 0.08,
};
