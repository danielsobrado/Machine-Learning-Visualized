import { FRONTIER_CASE_STUDY_METADATA } from './frontierCaseStudyMetadata.js';

export const LESSON_METADATA_OVERRIDES = {
  'attention-mechanism': {
    description: 'Core learned routing for language, vision, audio, and multimodal transformer models',
  },
  relu: {
    name: 'Activation Functions & ReLU',
    description: 'Compare ReLU, Leaky ReLU, sigmoid, tanh, and GELU through their outputs, local derivatives, saturation, and gradient-flow tradeoffs',
  },
  transformer: {
    description: 'Canonical Transformer block mechanics: attention, feed-forward layers, residual flow, normalization, shapes, and parameters',
  },
  'transformer-architecture-families': {
    description: 'Compare encoder-only, decoder-only, and encoder-decoder topologies and choose the right family for a workload',
  },
  'transformer-token-generation': {
    description: 'Autoregressive runtime mechanics: prefill, decode, logits, sampling, token append, stopping, and KV-cache reuse',
  },
  rag: {
    description: 'End-to-end retrieval-augmented generation pipeline, system boundaries, and retrieval-to-generation quality ceilings',
  },
  'knn-naive-bayes-svm': {
    description: 'Compare neighbor voting, probabilistic assumptions, and margin classifiers; choose among kNN, Naive Bayes, and SVM from data geometry and assumptions',
  },
  'dropout-batchnorm': {
    description: 'Compare dropout regularization with BatchNorm activation normalization, including their different train and evaluation behavior',
  },
  'loss-functions-likelihoods': {
    description: 'Connect observation models to negative log-likelihood losses and explain why squared error and cross-entropy arise from different assumptions',
  },
};

export function applyLessonMetadataOverrides(animation) {
  if (!animation) return animation;
  const override = LESSON_METADATA_OVERRIDES[animation.id];
  const caseStudyMetadata = FRONTIER_CASE_STUDY_METADATA[animation.id];

  if (!override && !caseStudyMetadata) return animation;
  return { ...animation, ...override, ...caseStudyMetadata };
}
