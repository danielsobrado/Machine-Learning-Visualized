export const MODEL_RELIABILITY_AUDITED_LESSON_IDS = Object.freeze([
  'uncertainty-estimation',
  'model-fairness',
]);

export const MODEL_RELIABILITY_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({ lessonId: 'uncertainty-estimation', competency: 'ensemble disagreement distinguishes epistemic uncertainty from mean predictive entropy', scenarioId: 'uncertainty-ensemble-disagreement-worked' }),
  Object.freeze({ lessonId: 'uncertainty-estimation', competency: 'selective prediction trades coverage for lower automated risk', scenarioId: 'uncertainty-selective-risk-worked' }),
  Object.freeze({ lessonId: 'model-fairness', competency: 'equalized-odds auditing compares subgroup true-positive and false-positive rates', scenarioId: 'fairness-equalized-odds-worked' }),
  Object.freeze({ lessonId: 'model-fairness', competency: 'intersectional slices can reveal disparities hidden by broad-group aggregates', scenarioId: 'fairness-intersectional-slice-diagnosis' }),
]);
