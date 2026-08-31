export const P1_PRODUCTION_GOVERNANCE_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'model-interpretability': [
    {
      id: 'interpretability-grouped-correlation-worked',
      level: 'diagnosis',
      relatedComparison: 'individual-permutation-vs-grouped-permutation-under-correlation',
      scenario: 'Two credit-behavior features have correlation 0.96. Permuting feature A alone reduces validation AUC by 0.004 and permuting feature B alone reduces it by 0.006, but permuting both together reduces AUC by 0.081. Predictions remain otherwise stable across repeated evaluation runs.',
      prompt: 'What is the most defensible interpretation of these importance results?',
      choices: [
        'Both features are individually unimportant and can be removed because each single-feature permutation changes AUC by less than 0.01',
        'The grouped AUC drop proves both variables have large independent causal effects on the outcome',
        'The pair carries substantial shared predictive information that individual permutation understates because either correlated feature can substitute for the other',
      ],
      answerIndex: 2,
      explanation: 'With correlation 0.96, leaving one feature intact lets it substitute for information removed from the other, so individual permutation can look deceptively small. The 0.081 grouped drop shows strong joint predictive dependence, but predictive importance still does not establish an independent causal effect for either variable.',
      misconceptionTested: 'Small individual permutation scores prove correlated variables are unimportant, or a large grouped predictive effect can be interpreted automatically as causality.',
    },
  ],
  'ml-security-robustness-track': [
    {
      id: 'security-tool-authorization-boundary',
      level: 'design',
      relatedComparison: 'model-intent-vs-authenticated-user-authorization-vs-tool-side-enforcement',
      scenario: 'A support agent can read account data and request refunds. Retrieved tickets and web pages are untrusted and may contain prompt injection. The business rule allows refunds up to $50 only when the authenticated user has refund permission; larger refunds require human approval. The model may propose actions but must not create new authority.',
      prompt: 'Which execution design preserves the required security boundary?',
      choices: [
        'Have a tool-side policy check authenticated user permission and refund amount on every call, treat retrieved text only as data, and route amounts above $50 to human approval',
        'Let the model call the refund API directly whenever its reasoning says the request is legitimate, because model confidence acts as authorization',
        'Allow retrieved documents to grant temporary refund permission when they contain an instruction formatted as a policy exception',
      ],
      answerIndex: 0,
      explanation: 'Authorization must be enforced outside model-generated text using authenticated identity and explicit business rules. Retrieved content can inform reasoning but cannot grant privileges. A tool-side check ensures even a successfully injected model cannot bypass the $50 boundary or invent permission.',
      misconceptionTested: 'A capable model can safely convert its own confidence or instructions found in retrieved content into authorization for side-effecting tools.',
    },
  ],
  'data-engineering-for-ml-track': [
    {
      id: 'de-point-in-time-parity-worked',
      level: 'decision',
      relatedComparison: 'latest-value-join-vs-as-of-join-vs-serving-time-availability',
      scenario: 'A training example represents a prediction made at 10:05. The feature store has account_balance snapshots at 09:58 with value 320 and at 10:12 with value 110. Online serving at 10:05 could only have observed the 09:58 snapshot, but the offline training join currently selects the latest snapshot in the partition.',
      prompt: 'Which training value should be joined to preserve point-in-time correctness and train/serve parity?',
      choices: [
        'Use 320 from 09:58 through an as-of join constrained to timestamps no later than 10:05',
        'Use 110 from 10:12 because the latest warehouse value is the most accurate description of the account',
        'Average 320 and 110 because combining past and future snapshots reduces variance in the feature',
      ],
      answerIndex: 0,
      explanation: 'The historical training row must reproduce information available when the prediction would have been made. At 10:05 the 10:12 snapshot did not exist, so using 110 leaks future state and creates offline/online semantic skew. An as-of join should select the latest snapshot at or before 10:05: value 320.',
      misconceptionTested: 'Historical feature joins should prefer the newest warehouse record even when that record was unavailable at the original prediction timestamp.',
    },
  ],
});

export function getP1ProductionGovernanceAppliedScenariosForLesson(lessonId) {
  return P1_PRODUCTION_GOVERNANCE_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
