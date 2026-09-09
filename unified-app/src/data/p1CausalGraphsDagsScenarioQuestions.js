export const P1_CAUSAL_GRAPHS_DAGS_SCENARIOS_BY_LESSON = Object.freeze({
  'causal-graphs-dags': [
    {
      id: 'dag-backdoor-adjustment-set-design',
      level: 'design',
      relatedComparison: 'minimal-backdoor-set-vs-bad-controls',
      scenario: 'The assumed DAG is C → T, C → Y, T → M → Y, and T → Y. C is measured before treatment, while M is measured after treatment. The goal is the total causal effect of T on Y.',
      prompt: 'Which adjustment strategy is the smallest defensible choice under this DAG?',
      choices: ['Adjust for C and leave M unconditioned', 'Adjust for C and M because every predictor of Y should be controlled', 'Adjust only for M because it is closer to Y than C'],
      answerIndex: 0,
      explanation: 'C opens the backdoor path T ← C → Y, so conditioning on C blocks the confounding path. M lies on the causal pathway T → M → Y, so conditioning on it would remove part of the total effect. The minimal sufficient set here is therefore {C}.',
      misconceptionTested: 'A valid causal regression should include every variable that predicts the outcome, including post-treatment mediators.',
    },
    {
      id: 'dag-standardized-ate-worked',
      level: 'calculation',
      relatedComparison: 'stratum-specific-effects-vs-standardized-ate',
      scenario: 'A binary pre-treatment confounder C is sufficient to block the backdoor path from treatment T to outcome Y. In the target population, 60% have C = 0 and 40% have C = 1. After valid within-stratum adjustment, the estimated treatment effect is +10 percentage points for C = 0 and +15 points for C = 1.',
      prompt: 'What standardized average treatment effect follows for this target population?',
      choices: ['+12 percentage points', '+12.5 percentage points', '+25 percentage points'],
      answerIndex: 0,
      explanation: 'Standardize the stratum-specific effects to the target population: 0.60 × 10 + 0.40 × 15 = 6 + 6 = 12 percentage points. A DAG tells you which adjustment is justified; standardization then combines the identified stratum-specific contrasts using the target population weights.',
      misconceptionTested: 'After stratifying on a confounder, the overall causal effect is always the unweighted average of subgroup effects or their sum.',
    },
    {
      id: 'dag-dseparation-path-status-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'fork-blocking-vs-collider-opening',
      scenario: 'Consider two noncausal paths between treatment T and outcome Y: T ← C → Y and T → S ← U → Y. Initially nothing is conditioned on. An analyst then conditions on both C and S.',
      prompt: 'What happens to the two paths after conditioning on C and S?',
      choices: ['The fork through C closes, but conditioning on collider S opens the path through U', 'Both paths close because conditioning can only remove associations', 'The fork through C stays open and the collider path through S stays closed'],
      answerIndex: 0,
      explanation: 'C is a common cause on the open fork T ← C → Y, so conditioning on C blocks that path. S is a collider on T → S ← U → Y, which is closed by default; conditioning on S opens it and can create collider bias. Adjustment must reason about all relevant paths, not just remove one confounder.',
      misconceptionTested: 'Conditioning on additional variables can only close paths and therefore can never introduce causal bias.',
    },
    {
      id: 'dag-positivity-support-decision',
      level: 'decision',
      relatedComparison: 'graphical-adjustment-vs-empirical-overlap',
      scenario: 'A DAG says baseline severity C is the only confounder of treatment T and outcome Y. In the observed data, every patient with severe disease receives treatment and no severe patient is untreated. Mild patients appear in both arms.',
      prompt: 'What is the correct conclusion about estimating the target-population treatment effect by ordinary adjustment for C?',
      choices: ['The graph may specify the right confounder, but the severe stratum lacks treatment-control overlap, so the effect there requires extrapolation or a changed target population', 'Adjustment for C solves the problem automatically because the DAG is correct', 'Drop C from the model so treated and untreated severe patients no longer need to be compared'],
      answerIndex: 0,
      explanation: 'Backdoor identification also requires positivity or empirical support. With no untreated severe patients, the data do not provide the counterfactual contrast for that stratum without extra modeling assumptions. A defensible analysis may restrict the estimand to an overlap population or state the extrapolation explicitly.',
      misconceptionTested: 'A correct adjustment set guarantees causal identification even when one treatment arm is absent in important covariate strata.',
    },
    {
      id: 'dag-randomized-prognostic-adjustment-decision',
      level: 'decision',
      relatedComparison: 'confounding-control-vs-precision-adjustment',
      scenario: 'Treatment T is randomized. A pre-treatment variable X strongly predicts outcome Y but does not cause treatment assignment. The DAG contains X → Y and T → Y with no backdoor path into T.',
      prompt: 'How should X be interpreted in the primary total-effect analysis?',
      choices: ['Adjustment for X is not required to remove confounding, but a preplanned adjustment may improve precision', 'X must be adjusted for or the randomized treatment effect is biased by definition', 'X should be treated as a post-treatment mediator because it predicts Y'],
      answerIndex: 0,
      explanation: 'Randomization leaves no backdoor path from T through X, so the unadjusted treatment comparison is unbiased under the design. Because X is pre-treatment and prognostic, a preplanned covariate adjustment can still reduce residual variance and improve precision without being necessary for confounding control.',
      misconceptionTested: 'Every strong predictor of the outcome is necessarily a confounder that must be adjusted for to obtain an unbiased treatment effect.',
    },
  ],
});

export function getP1CausalGraphsDagsScenariosForLesson(lessonId) {
  return P1_CAUSAL_GRAPHS_DAGS_SCENARIOS_BY_LESSON[lessonId] || [];
}
