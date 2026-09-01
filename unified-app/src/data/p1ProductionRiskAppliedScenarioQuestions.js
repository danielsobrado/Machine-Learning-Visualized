export const P1_PRODUCTION_RISK_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'model-interpretability': [
    {
      id: 'interpretability-background-shift-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'model-behavior-change-vs-explanation-reference-change',
      scenario: 'A fixed validation sample is scored by the same frozen model before and after an interpretability pipeline update. Predictions are numerically identical, but the global SHAP ranking changes substantially after the explainer background dataset is switched from last year\'s population to a recent population with different feature distributions.',
      prompt: 'What is the most defensible interpretation before claiming that the model changed which features it relies on?',
      choices: [
        'The model definitely changed its internal behavior because any global attribution ranking change proves a model change',
        'The explanation reference distribution changed, so attribution shifts may come from the new background; compare explanations under matched references before attributing the change to model behavior',
        'The new SHAP ranking is automatically more causal because it uses more recent data',
      ],
      answerIndex: 1,
      explanation: 'For the fixed sample, model outputs did not change; what changed was the explainer reference population. SHAP values are conditional on the explanation setup and background distribution, so a global ranking shift can be an explanation-pipeline effect. A matched-reference comparison is needed before claiming the model itself changed.',
      misconceptionTested: 'Feature-attribution changes can always be interpreted as model-behavior changes without controlling the explainer background or reference distribution.',
    },
  ],
  'ml-security-robustness-track': [
    {
      id: 'security-credential-scope-boundary',
      level: 'design',
      relatedComparison: 'shared-broad-credential-vs-scoped-capability-separation',
      scenario: 'An agent can search a customer knowledge base and also issue account credits. Today both tools run under one broad service credential that can read all customer records and create credits up to $5,000. Retrieved documents are untrusted and could contain prompt injection, while most support cases only require read access and credits below $25.',
      prompt: 'Which redesign most directly reduces blast radius if the model or retrieved content is compromised?',
      choices: [
        'Keep one broad credential but add more prompt examples telling the model not to misuse it',
        'Let the model dynamically decide its own permission level from the text of each retrieved document',
        'Separate read and write capabilities, use least-privilege credentials, enforce credit limits tool-side, and require stronger approval for higher-value actions',
      ],
      answerIndex: 2,
      explanation: 'Capability separation limits what a compromised reasoning loop can do. Read-only search should not inherit write authority, low-value credits should be bounded by tool-side policy, and exceptional actions should require an external approval path. Prompt instructions alone cannot provide the same authorization boundary.',
      misconceptionTested: 'A single powerful service credential is safe if the model is instructed to behave, so privilege separation and tool-side limits add little security value.',
    },
  ],
  'data-engineering-for-ml-track': [
    {
      id: 'de-transformation-version-parity',
      level: 'diagnosis',
      relatedComparison: 'offline-transform-version-vs-online-transform-version-parity',
      scenario: 'Training and batch evaluation use feature-pipeline version v3, where purchase_amount is transformed with log1p before inference. A newly deployed online service accidentally loads v2 and sends the raw purchase_amount instead. For the same raw value 99, offline produces about 4.61 while online produces 99, and the model artifact itself is identical.',
      prompt: 'What production contract is broken and what should be fixed first?',
      choices: [
        'The model needs retraining because identical weights cannot be expected to tolerate different feature semantics',
        'Train/serve transformation-version parity is broken; pin or validate the same feature transformation contract online before changing the model',
        'The raw value should replace log1p everywhere because larger feature values always preserve more information',
      ],
      answerIndex: 1,
      explanation: 'The model was trained against the v3 feature semantics, so sending raw v2 values changes the meaning and scale of its inputs. The first fix is to restore and enforce transformation-version parity through schema/version checks or shared transformation artifacts, not to retrain around an accidental serving mismatch.',
      misconceptionTested: 'Matching feature names and model weights is enough for train/serve parity even when the offline and online transformation versions produce different numerical semantics.',
    },
  ],
});

export function getP1ProductionRiskAppliedScenariosForLesson(lessonId) {
  return P1_PRODUCTION_RISK_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
