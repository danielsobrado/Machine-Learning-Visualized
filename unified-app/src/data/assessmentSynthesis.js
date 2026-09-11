import { ASSESSMENT_COMPETENCY_EVIDENCE_TYPES } from './assessmentCompetencies.js';

function evidence(lessonId, type, id) {
  return Object.freeze({ lessonId, type, id });
}

function scenario(lessonId, id) {
  return evidence(lessonId, ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.SCENARIO, id);
}

function requirement(id, evidenceItems) {
  return Object.freeze({
    id,
    evidence: Object.freeze(evidenceItems),
  });
}

export const ASSESSMENT_SYNTHESIS_REQUIREMENTS = Object.freeze([
  requirement('synthesis.classification.decision-policy', [
    scenario('classification-metrics', 'metrics-calibration-cost-threshold'),
    scenario('roc-pr-curves', 'roc-pr-threshold-operating-point'),
    scenario('calibration', 'calibration-shift-recalibration'),
  ]),
  requirement('synthesis.linear-algebra.decomposition-choice', [
    scenario('matrix-decompositions', 'compare-decomposition-choice'),
    scenario('least-squares-projection', 'least-squares-normal-equation-worked'),
    scenario('pseudoinverse', 'pseudoinverse-minimum-norm-worked'),
  ]),
  requirement('synthesis.training.failure-localization', [
    scenario('initialization', 'init-he-fan-in-worked'),
    scenario('relu', 'relu-dead-units-lr-decision'),
    scenario('dropout-batchnorm', 'dropout-batchnorm-eval-mode-diagnosis'),
    scenario('gradient-problems', 'gradient-clipping-norm-worked'),
  ]),
  requirement('synthesis.attention.memory-vs-compute', [
    scenario('grouped-query-attention', 'gqa-kv-cache-reduction-worked'),
    scenario('flash-attention', 'compare-attention-flash-vs-gqa'),
    scenario('native-sparse-attention', 'native-sparse-long-range-design'),
  ]),
  requirement('synthesis.rag.failure-localization', [
    scenario('rag-failure-modes', 'rag-failure-missing-vs-unused'),
    scenario('rag-failure-modes', 'rag-failure-context-dilution'),
    scenario('rag-retrieval-evaluation', 'rag-eval-retrieval-vs-generation'),
  ]),
  requirement('synthesis.production-ml.failure-localization', [
    scenario('data-leakage-deep-dive', 'leakage-point-in-time-feature'),
    scenario('model-debugging', 'debugging-slice-first'),
    scenario('model-monitoring', 'monitoring-drift-types'),
  ]),
]);

function evidenceIds(assessment, type) {
  if (type === ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.QUIZ) {
    return new Set((assessment.quiz || []).map(({ id }) => id));
  }
  if (type === ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.SCENARIO) {
    return new Set((assessment.scenarioQuestions || []).map(({ id }) => id));
  }
  return new Set();
}

export function validateAssessmentSynthesis({ requirements = ASSESSMENT_SYNTHESIS_REQUIREMENTS, getAssessment }) {
  const errors = [];
  const ids = requirements.map(({ id }) => id);

  if (new Set(ids).size !== ids.length) errors.push('synthesis ids must be globally unique');

  for (const item of requirements) {
    if (!item.id || !Array.isArray(item.evidence) || item.evidence.length === 0) {
      errors.push(`${item.id || 'synthesis requirement'} must declare evidence`);
      continue;
    }

    if (new Set(item.evidence.map(({ lessonId }) => lessonId)).size < 2) {
      errors.push(`${item.id} must span multiple lessons`);
    }

    for (const itemEvidence of item.evidence) {
      const assessment = getAssessment(itemEvidence.lessonId);
      if (!evidenceIds(assessment, itemEvidence.type).has(itemEvidence.id)) {
        errors.push(`${item.id}: missing ${itemEvidence.lessonId} ${itemEvidence.type} evidence ${itemEvidence.id}`);
      }
    }
  }

  return errors;
}
