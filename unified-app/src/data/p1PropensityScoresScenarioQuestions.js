export const P1_PROPENSITY_SCORES_SCENARIOS_BY_LESSON = Object.freeze({
  'propensity-scores': [
    {
      id: 'propensity-ipw-ate-worked',
      level: 'calculation',
      relatedComparison: 'raw-outcome-difference-vs-ate-ipw',
      scenario: 'A tiny ATE-IPW example has two treated units and two controls. Treated unit 1 has outcome 1 and e(x)=0.80; treated unit 2 has outcome 0 and e(x)=0.20. Control unit 1 has outcome 1 and e(x)=0.80; control unit 2 has outcome 0 and e(x)=0.20. Use treated weight 1/e(x), control weight 1/(1-e(x)), then compare the weighted outcome means.',
      prompt: 'What weighted treated-minus-control effect does this example produce?',
      choices: ['Negative 60 percentage points', 'Positive 60 percentage points', 'Zero percentage points'],
      answerIndex: 0,
      explanation: 'The treated weights are 1.25 and 5, so the treated weighted mean is 1.25 / 6.25 = 0.20. The control weights are 5 and 1.25, so the control weighted mean is 5 / 6.25 = 0.80. The ATE-IPW contrast is therefore 0.20 - 0.80 = -0.60, or -60 percentage points.',
      misconceptionTested: 'Inverse-propensity weighting can be understood from raw treated and control outcomes without applying treatment-specific weights and renormalizing the weighted means.',
    },
    {
      id: 'propensity-att-estimand-selection',
      level: 'decision',
      relatedComparison: 'ate-vs-att-target-population',
      scenario: 'A hospital retrospectively studies a treatment that physicians already gave to a selected group of patients. Leadership asks: “Among the patients who actually received this treatment, how much did it change outcomes compared with what would have happened to those same types of patients without treatment?”',
      prompt: 'Which estimand most directly matches that question?',
      choices: ['ATT, the average treatment effect for the treated population', 'ATE over every patient in the hospital regardless of who was treated', 'The treatment-model AUC'],
      answerIndex: 0,
      explanation: 'The question explicitly targets patients who actually received treatment, so ATT is the matching estimand. ATE targets the broader population. Matching, weighting, trimming, and support restrictions should all be interpreted relative to the estimand they actually identify.',
      misconceptionTested: 'ATE and ATT are interchangeable labels even when the decision targets different populations.',
    },
    {
      id: 'propensity-balance-over-auc-model-selection',
      level: 'decision',
      relatedComparison: 'assignment-prediction-vs-covariate-balance',
      scenario: 'Two candidate propensity models use the same pre-treatment covariates. Model A has treatment-prediction AUC 0.88 but leaves several weighted covariates with |SMD| around 0.20. Model B has AUC 0.72, good overlap, and all key weighted |SMD| values below 0.06.',
      prompt: 'Which model is more defensible for the propensity design based on these diagnostics?',
      choices: ['Model B because the design goal is covariate balance and support, not maximum treatment-classification accuracy', 'Model A because the highest AUC always gives the least biased causal estimate', 'Model A because balance diagnostics should only be checked after outcome analysis'],
      answerIndex: 0,
      explanation: 'A propensity model is a balancing device, not a treatment classifier deployed for prediction. High assignment AUC can reflect severe separation. When model B produces materially better measured balance with credible support, those design diagnostics are more relevant than predictive accuracy alone.',
      misconceptionTested: 'The best propensity model is whichever predicts treatment assignment most accurately, even if weighted covariates remain imbalanced.',
    },
    {
      id: 'propensity-post-treatment-covariate-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'pretreatment-confounder-vs-posttreatment-variable',
      scenario: 'A drug propensity model includes baseline severity, age, and adherence measured one month after the prescription. Adherence is partly caused by whether the drug was prescribed. The target is the total effect of prescription on recovery.',
      prompt: 'What should be changed in the primary propensity design?',
      choices: ['Remove post-treatment adherence from the assignment adjustment and rely on justified pre-treatment covariates for the total-effect estimand', 'Keep adherence because every predictor of recovery should be balanced regardless of timing', 'Drop baseline severity and age because treatment assignment already happened'],
      answerIndex: 0,
      explanation: 'Propensity covariates should describe treatment assignment using information available before treatment. Conditioning on a treatment consequence can block part of the causal pathway or create other post-treatment bias, changing the total-effect question.',
      misconceptionTested: 'Any variable that predicts outcome or treatment should be added to a propensity model even when it is measured after treatment and affected by treatment.',
    },
    {
      id: 'propensity-negative-control-residual-bias',
      level: 'diagnosis',
      relatedComparison: 'observed-balance-vs-hidden-confounding-check',
      scenario: 'After weighting, all measured baseline covariates look well balanced. As a diagnostic, the analyst tests a pre-treatment outcome that the later treatment cannot possibly cause and still finds a large “treatment effect” on that negative-control outcome.',
      prompt: 'What should the analyst conclude from this negative-control finding?',
      choices: ['Residual confounding or design bias is still plausible, so good observed balance is not enough to trust the causal effect', 'The negative-control result proves the treatment works before it is delivered', 'Measured balance guarantees the negative-control association must be causal'],
      answerIndex: 0,
      explanation: 'A treatment cannot cause an outcome that occurred before treatment. A strong negative-control association therefore warns that the adjusted groups may still differ through unmeasured causes, misspecification, or other design problems. Propensity adjustment only addresses measured covariates under its assumptions.',
      misconceptionTested: 'Good measured covariate balance proves conditional exchangeability and rules out hidden confounding.',
    },
  ],
});

export function getP1PropensityScoresScenariosForLesson(lessonId) {
  return P1_PROPENSITY_SCORES_SCENARIOS_BY_LESSON[lessonId] || [];
}
