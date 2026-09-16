import React from 'react';

import ActivationDepthNextLab from './ActivationDepthNextLab.jsx';
import CnnOperatorNextLab from './CnnOperatorNextLab.jsx';
import { NEURAL_CNN_NEXT_LAB_LESSON_IDS } from './neuralCnnNextConstants.js';

const ACTIVATION_IDS = new Set(['gradient-problems', 'leaky-relu']);
const CNN_IDS = new Set(['conv2d', 'conv-relu', 'max-pooling']);

export function hasNeuralCnnNextLab(lessonId) {
  return NEURAL_CNN_NEXT_LAB_LESSON_IDS.has(lessonId);
}

export default function NeuralCnnNextLab({ lessonId }) {
  if (ACTIVATION_IDS.has(lessonId)) return <ActivationDepthNextLab lessonId={lessonId} />;
  if (CNN_IDS.has(lessonId)) return <CnnOperatorNextLab lessonId={lessonId} />;
  return null;
}
