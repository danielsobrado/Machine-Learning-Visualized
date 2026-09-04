export const MODEL = {
  name: '7B decoder model',
  parameters: 7_000_000_000,
  layers: 32,
  kvHeads: 8,
  headDim: 128,
  workspaceGiB: 0.75,
};

export const DEFAULT_SCENARIO = {
  hardwareId: 'balanced-24',
  weightBits: 8,
  kvBits: 8,
  context: 4096,
  batch: 4,
  speculativeAcceptance: 35,
};

export const CONTROL_LIMITS = {
  context: { min: 512, max: 16384, step: 512 },
  batch: { min: 1, max: 16, step: 1 },
  speculativeAcceptance: { min: 0, max: 80, step: 5 },
};

export const HARDWARE_PROFILES = [
  { id: 'compact-16', label: '16 GB compact GPU', vramGiB: 16, bandwidthGBs: 600, peakTflops: 55, prefillUtilization: 0.28 },
  { id: 'balanced-24', label: '24 GB balanced GPU', vramGiB: 24, bandwidthGBs: 900, peakTflops: 82, prefillUtilization: 0.34 },
  { id: 'server-80', label: '80 GB server GPU', vramGiB: 80, bandwidthGBs: 2000, peakTflops: 300, prefillUtilization: 0.48 },
];

export const WEIGHT_FORMATS = [
  { bits: 16, label: 'FP16', kernelFactor: 1.0 },
  { bits: 8, label: 'INT8', kernelFactor: 1.25 },
  { bits: 4, label: 'INT4', kernelFactor: 1.55 },
];

export const KV_FORMATS = [16, 8, 4];

export const SCENARIO_PRESETS = [
  { id: 'latency', label: 'Latency first', values: { hardwareId: 'balanced-24', weightBits: 8, kvBits: 8, context: 2048, batch: 1, speculativeAcceptance: 45 } },
  { id: 'throughput', label: 'Throughput first', values: { hardwareId: 'server-80', weightBits: 8, kvBits: 8, context: 4096, batch: 12, speculativeAcceptance: 35 } },
  { id: 'memory', label: 'Memory squeeze', values: { hardwareId: 'compact-16', weightBits: 4, kvBits: 4, context: 8192, batch: 4, speculativeAcceptance: 20 } },
];
