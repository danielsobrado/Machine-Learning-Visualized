export const INITIALIZATION_METHODS = {
  tiny: {
    label: 'Too small',
    description: 'A deliberately weak scale that quickly kills both signals and gradients.',
  },
  xavier: {
    label: 'Xavier / Glorot',
    description: 'Balances fan-in and fan-out for linear or tanh-like layers.',
  },
  he: {
    label: 'He / Kaiming',
    description: 'Preserves forward second moment for ReLU-like activations.',
  },
  huge: {
    label: 'Too large',
    description: 'A deliberately aggressive scale that quickly amplifies the network.',
  },
};

export const ACTIVATION_PROFILES = {
  relu: {
    label: 'ReLU',
    forwardFactor: 0.5,
    backwardFactor: 0.5,
    note: 'For symmetric pre-activations, ReLU keeps about half the second moment and half the squared derivative mass.',
  },
  linear: {
    label: 'Linear',
    forwardFactor: 1,
    backwardFactor: 1,
    note: 'No activation attenuation: forward and backward propagation depend only on width and weight variance.',
  },
  tanh: {
    label: 'tanh',
    forwardFactor: 1,
    backwardFactor: 1,
    note: 'This uses the local-linear regime near zero. Saturated tanh can shrink gradients much more than this approximation shows.',
  },
};

export const ARCHITECTURE_PRESETS = {
  balanced: {
    label: 'Balanced width',
    fanIn: 64,
    fanOut: 64,
    description: 'Same width in and out. The classic initialization derivations are easiest to see here.',
  },
  bottleneck: {
    label: 'Narrow bottleneck',
    fanIn: 256,
    fanOut: 32,
    description: 'Forward ReLU scale can look perfect while gradients collapse on the way back.',
  },
  expansion: {
    label: 'Wide expansion',
    fanIn: 32,
    fanOut: 256,
    description: 'Forward ReLU scale can look perfect while gradients amplify on the way back.',
  },
};

export const INITIALIZATION_DEFAULTS = {
  method: 'he',
  activation: 'relu',
  fanIn: 64,
  fanOut: 64,
  layers: 5,
};

export const CONTROL_LIMITS = {
  fan: { min: 16, max: 256, step: 16 },
  layers: { min: 2, max: 8, step: 1 },
};

export const HEALTH_THRESHOLDS = {
  vanishing: 0.25,
  exploding: 4,
};
