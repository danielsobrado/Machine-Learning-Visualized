export const NEURAL_CNN_NEXT_QUALITY_OVERRIDES = Object.freeze({
  'gradient-problems': Object.freeze({
    reason: 'Gradient-problems lesson now adds activation-specific sigmoid, tanh, active/dead ReLU, and GELU chain presets so learners can compare local derivatives with the resulting global gradient at the same network depth.',
    nextAction: 'Add Jacobian-spectrum and residual-path diagnostics that connect activation slopes with normalization, skip connections, and dynamical-isometry intuition.',
  }),
  'layer-normalization': Object.freeze({
    reason: 'Layer-normalization lesson already includes a mounted RMSNorm comparison with dedicated regression coverage, extending the original LayerNorm workbench to scale-only normalization rather than leaving the manifest request outstanding.',
    nextAction: 'Add epsilon and mixed-precision stability stress cases comparing LayerNorm and RMSNorm on near-constant and large-magnitude feature vectors.',
  }),
  relu: Object.freeze({
    reason: 'ReLU lesson already includes a mounted dying-ReLU training trace, local derivative visualization, activation comparison, and external recovery probe, covering the negative-side gradient failure that the base manifest still listed as pending.',
    nextAction: 'Add population-level neuron-health diagnostics across initialization and bias distributions, then compare recovery rates with nonzero-negative-slope activations.',
  }),
  'leaky-relu': Object.freeze({
    reason: 'Leaky-ReLU lesson now compares fixed Leaky ReLU, learned-slope PReLU, and smooth ELU negative branches at the same input, including their forward values and backward derivatives.',
    nextAction: 'Add SiLU/GELU/SELU comparisons focused on negative-tail gradient behavior, self-normalization assumptions, and deep-chain stability.',
  }),
  conv2d: Object.freeze({
    reason: 'Conv2D lesson now performs a concrete two-channel, two-filter convolution where each filter exposes per-channel spatial contributions, filter bias, their sum, and the resulting separate output feature maps.',
    nextAction: 'Add grouped, depthwise, and separable convolution comparisons with parameter, MAC, channel-connectivity, and output-shape accounting.',
  }),
  'conv-relu': Object.freeze({
    reason: 'Conv-plus-ReLU lesson now traces a full backward pass from upstream feature-map gradients through the ReLU gate into convolution bias, kernel, and input gradients, making clipped versus active cells explicit.',
    nextAction: 'Extend backward tracing to multi-channel filters, stride/padding, and overlapping receptive fields so gradient accumulation across realistic Conv2D layers is visible.',
  }),
  'max-pooling': Object.freeze({
    reason: 'Pooling lesson now compares max pooling, average pooling, and a learned strided convolution on the same patch, including forward summaries and the distinct input-gradient routing of all three operators.',
    nextAction: 'Add overlapping-window tie behavior, anti-aliased downsampling, and adaptive/global pooling comparisons for modern architecture choices.',
  }),
});
