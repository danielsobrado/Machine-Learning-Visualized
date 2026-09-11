import { defineQuizCompetency } from './assessmentCompetencies.js';

export const FOUNDATION_ARCHITECTURE_AUDITED_LESSON_IDS = Object.freeze([
  'frontier-llm-architecture-overview',
]);

export const FOUNDATION_ARCHITECTURE_COMPETENCIES = Object.freeze([
  defineQuizCompetency(
    'frontier-architecture-bottleneck-family-selection',
    'frontier-llm-architecture-overview',
    ['flao-060-product-capacity', 'flao-061-product-cache', 'flao-062-product-streaming'],
  ),
  defineQuizCompetency(
    'frontier-architecture-generation-and-modality-tradeoffs',
    'frontier-llm-architecture-overview',
    ['flao-013-axis-generation', 'flao-058-paper-omni'],
  ),
]);
