export const P1_TREE_ENSEMBLES_SCENARIOS_BY_LESSON = Object.freeze({
  'tree-ensembles': [
    {
      id: 'tree-oob-bootstrap-membership-worked',
      level: 'calculation',
      relatedComparison: 'bootstrap-in-bag-vs-out-of-bag-evaluation',
      scenario: 'A training set has rows A, B, C, and D. One tree is trained on the bootstrap sample [A, A, C, D]. For this tree, predictions are available for every row after fitting.',
      prompt: 'Which row is out-of-bag for this tree and may contribute to its OOB evaluation?',
      choices: [
        'B, because B was omitted from this tree’s bootstrap sample',
        'A, because appearing twice makes A out-of-bag once',
        'C and D, because rows sampled exactly once are out-of-bag',
      ],
      answerIndex: 0,
      explanation: 'Out-of-bag rows are training rows not selected at all for a particular bootstrap sample. B is absent, while A, C, and D are in-bag. OOB scoring aggregates predictions for each row only from trees that omitted that row.',
      misconceptionTested: 'A row is out-of-bag when it appears only once, or duplicate bootstrap draws create an out-of-bag copy of the same row.',
    },
    {
      id: 'tree-boosting-residual-update-worked',
      level: 'calculation',
      relatedComparison: 'current-prediction-vs-residual-correction',
      scenario: 'For squared-error gradient boosting, the current ensemble predicts 30 for an example whose target is 42. The next weak tree predicts a residual correction of +8 for that example, and the learning rate is 0.25.',
      prompt: 'What is the updated ensemble prediction after this boosting step?',
      choices: [
        '32, because 30 + 0.25 × 8 = 32',
        '38, because the full residual-tree output is always added regardless of learning rate',
        '44, because the target residual 12 must be added to the tree correction 8',
      ],
      answerIndex: 0,
      explanation: 'Boosting adds a shrunken contribution from the next learner. With learning rate 0.25, the +8 correction contributes only +2, so the prediction moves from 30 to 32. Multiple rounds can continue reducing the remaining error.',
      misconceptionTested: 'Boosting always adds an entire weak-tree prediction, so the learning rate does not affect the numerical update.',
    },
    {
      id: 'tree-regression-extrapolation-support-decision',
      level: 'diagnosis',
      relatedComparison: 'interpolation-within-leaves-vs-out-of-range-extrapolation',
      scenario: 'A tree ensemble is trained on homes whose floor area ranges from 50 to 300 square meters. Deployment now includes 700-square-meter estates. Predictions for those estates remain close to the largest leaf values seen during training instead of continuing the historical price trend upward.',
      prompt: 'What is the strongest diagnosis?',
      choices: [
        'This is an extrapolation limitation: tree leaves reuse learned regional values and do not automatically extend a smooth trend beyond observed support',
        'The model must be leaking future labels because tree ensembles always extrapolate linearly beyond the training range',
        'Feature scaling is the only issue because multiplying floor area by a constant forces trees to extrapolate correctly',
      ],
      answerIndex: 0,
      explanation: 'Standard regression trees make piecewise predictions from learned leaves. Outside the feature range represented during training, they usually continue using leaf values rather than extending a linear or physical trend. Deployment beyond support therefore needs explicit validation or a model structure that can extrapolate appropriately.',
      misconceptionTested: 'Tree ensembles automatically continue numeric trends outside the range of feature values represented during training.',
    },
  ],
});
