export const ASSESSMENT_COMPETENCY_EVIDENCE_TYPES = Object.freeze({
  QUIZ: 'quiz',
  SCENARIO: 'scenario',
});

const VALID_EVIDENCE_TYPES = new Set(Object.values(ASSESSMENT_COMPETENCY_EVIDENCE_TYPES));

function freezeEvidence(evidence) {
  return Object.freeze({
    type: evidence.type,
    id: evidence.id,
  });
}

export function quizEvidence(id) {
  return freezeEvidence({ type: ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.QUIZ, id });
}

export function scenarioEvidence(id) {
  return freezeEvidence({ type: ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.SCENARIO, id });
}

export function defineAssessmentCompetency({ id, lessonId, evidence }) {
  return Object.freeze({
    id,
    lessonId,
    evidence: Object.freeze(evidence.map(freezeEvidence)),
  });
}

export function defineQuizCompetency(id, lessonId, quizIds) {
  return defineAssessmentCompetency({
    id,
    lessonId,
    evidence: quizIds.map(quizEvidence),
  });
}

export function defineScenarioCompetenciesFromRequirements(requirements, { idPrefix = '' } = {}) {
  return Object.freeze((requirements || []).map((requirement) => {
    const semanticId = requirement.id || requirement.competency;
    const scenarioIds = requirement.scenarioIds || (requirement.scenarioId ? [requirement.scenarioId] : []);

    return defineAssessmentCompetency({
      id: `${idPrefix}${semanticId}`,
      lessonId: requirement.lessonId,
      evidence: scenarioIds.map(scenarioEvidence),
    });
  }));
}

export function competencyLessonIds(competencies) {
  return Object.freeze([...new Set((competencies || []).map(({ lessonId }) => lessonId))]);
}

function validateIdentifier(value, label, errors) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${label} must be a non-empty string`);
  }
}

export function validateAssessmentCompetencyRegistry({ auditedLessonIds, competencies }) {
  const errors = [];
  const lessonIds = Array.isArray(auditedLessonIds) ? auditedLessonIds : [];
  const requirements = Array.isArray(competencies) ? competencies : [];

  if (new Set(lessonIds).size !== lessonIds.length) {
    errors.push('audited lesson ids must be unique');
  }

  const competencyIds = requirements.map(({ id }) => id);
  if (new Set(competencyIds).size !== competencyIds.length) {
    errors.push('competency ids must be globally unique within the registry');
  }

  for (const competency of requirements) {
    validateIdentifier(competency.id, 'competency id', errors);
    validateIdentifier(competency.lessonId, `${competency.id || 'competency'} lesson id`, errors);

    if (!Array.isArray(competency.evidence) || competency.evidence.length === 0) {
      errors.push(`${competency.id || 'competency'} must declare evidence`);
      continue;
    }

    const evidenceKeys = [];
    for (const evidence of competency.evidence) {
      if (!VALID_EVIDENCE_TYPES.has(evidence.type)) {
        errors.push(`${competency.id}: unsupported evidence type ${String(evidence.type)}`);
      }
      validateIdentifier(evidence.id, `${competency.id} evidence id`, errors);
      evidenceKeys.push(`${evidence.type}:${evidence.id}`);
    }

    if (new Set(evidenceKeys).size !== evidenceKeys.length) {
      errors.push(`${competency.id}: evidence references must be unique`);
    }
  }

  const coveredLessonIds = [...new Set(requirements.map(({ lessonId }) => lessonId))].sort();
  const expectedLessonIds = [...lessonIds].sort();
  if (JSON.stringify(coveredLessonIds) !== JSON.stringify(expectedLessonIds)) {
    errors.push('every audited lesson must have explicit competency protection and no undeclared lesson may appear');
  }

  return errors;
}

function assessmentEvidenceIds(assessment, type) {
  if (type === ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.QUIZ) {
    return new Set((assessment.quiz || []).map(({ id }) => id));
  }
  if (type === ASSESSMENT_COMPETENCY_EVIDENCE_TYPES.SCENARIO) {
    return new Set((assessment.scenarioQuestions || []).map(({ id }) => id));
  }
  return new Set();
}

export function validateAssessmentCompetencyEvidence({ competencies, getAssessment }) {
  const errors = [];

  for (const competency of competencies) {
    const assessment = getAssessment(competency.lessonId);
    const idsByType = new Map();

    for (const evidence of competency.evidence) {
      if (!idsByType.has(evidence.type)) {
        idsByType.set(evidence.type, assessmentEvidenceIds(assessment, evidence.type));
      }

      if (!idsByType.get(evidence.type).has(evidence.id)) {
        errors.push(
          `${competency.lessonId}: missing ${competency.id} ${evidence.type} evidence ${evidence.id}`,
        );
      }
    }
  }

  return errors;
}
