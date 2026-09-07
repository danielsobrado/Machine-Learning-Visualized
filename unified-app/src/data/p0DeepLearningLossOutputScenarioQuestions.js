export const P0_DEEP_LEARNING_LOSS_OUTPUT_SCENARIOS_BY_LESSON = Object.freeze({
  'loss-functions-likelihoods': [
    {
      id: 'loss-output-logits-api-contract',
      level: 'diagnosis',
      relatedComparison: 'raw-logits-vs-pretransformed-probabilities',
      scenario: 'A binary classifier ends with a sigmoid layer, but the training code uses a loss documented to accept raw logits and internally apply the stable sigmoid-plus-binary-cross-entropy calculation. Training is much slower than an equivalent implementation that feeds the pre-sigmoid score directly.',
      prompt: 'What output/loss contract should be corrected first?',
      choices: [
        'Feed the raw binary logit to the logits-aware loss and apply sigmoid only when probabilities are needed for interpretation or decisions',
        'Keep the sigmoid before the logits-aware loss because every classification loss must receive probabilities rather than raw scores',
        'Replace the binary target with a three-class one-hot vector so the extra sigmoid transform becomes mathematically necessary',
      ],
      answerIndex: 0,
      explanation: 'A logits-aware binary cross-entropy implementation already combines the sigmoid and log-loss algebra in a numerically stable form. Applying sigmoid first changes the API contract and effectively introduces an unnecessary transform before a loss that expects the raw score. Probability conversion can still be applied outside the loss for reporting or threshold decisions.',
      misconceptionTested: 'Every classification loss API should receive probabilities even when it explicitly expects raw logits.',
    },
    {
      id: 'loss-output-bce-vs-ce-task-structure',
      level: 'decision',
      relatedComparison: 'bernoulli-independent-labels-vs-categorical-exclusive-class',
      scenario: 'Dataset A assigns exactly one label from {cat, dog, bird} to every image. Dataset B assigns any subset of {indoor, night, person} to each image, so several labels can be true at once. Both teams are considering the same three-output softmax head with categorical cross-entropy.',
      prompt: 'Which loss/output design matches the two target structures?',
      choices: [
        'Use categorical cross-entropy with competing class logits for Dataset A, and independent binary logits with binary cross-entropy per label for Dataset B',
        'Use one softmax with categorical cross-entropy for both because every task with three output numbers is a three-class problem',
        'Use independent binary cross-entropy for Dataset A and require all three class probabilities to be simultaneously one for each example',
      ],
      answerIndex: 0,
      explanation: 'Exactly-one-of-K targets are categorical: the classes compete for one probability budget, which naturally matches a softmax-style multiclass head and categorical cross-entropy. Multi-label targets are separate Bernoulli decisions, so independent logits and binary cross-entropy allow several labels to be true simultaneously.',
      misconceptionTested: 'The number of output units alone determines whether BCE or categorical cross-entropy is the correct loss.',
    },
    {
      id: 'loss-output-softmax-vs-independent-labels',
      level: 'diagnosis',
      relatedComparison: 'softmax-coupled-probability-budget-vs-independent-sigmoids',
      scenario: 'A medical tagging model predicts five findings that can co-occur. Its current head applies one softmax across all five scores. Raising the score for one finding automatically reduces the reported probabilities of the other findings, even when the findings are clinically independent.',
      prompt: 'What is the output-layer bug?',
      choices: [
        'Softmax incorrectly forces the findings to compete for one unit of probability mass; use independent binary outputs when multiple findings may coexist',
        'Softmax is required because independent labels must always sum to one, so the coupling is evidence that the model is calibrated',
        'The only problem is that the softmax temperature is too high; lowering it makes independent labels stop competing',
      ],
      answerIndex: 0,
      explanation: 'Softmax represents mutually exclusive alternatives by coupling every class through a shared normalization denominator. That semantics is wrong when several labels may be true together. Independent Bernoulli outputs avoid the artificial competition and pair naturally with binary cross-entropy.',
      misconceptionTested: 'Softmax is a universal probability output layer even when labels are not mutually exclusive.',
    },
    {
      id: 'loss-output-fused-loss-numerical-stability',
      level: 'diagnosis',
      relatedComparison: 'manual-softmax-log-vs-fused-logit-loss',
      scenario: 'A 50,000-class classifier occasionally emits logits near 1000 and -1000. A custom training loop computes exp(logit), divides by the exponential sum, then takes log(probability). The run produces inf and NaN values, while the framework fused cross-entropy-from-logits function remains finite on the same batch.',
      prompt: 'Why is the fused logits-based loss the safer implementation?',
      choices: [
        'It can use log-sum-exp or equivalent algebra that avoids materializing overflow-prone exponentials and zero probabilities before taking logs',
        'It clips every gradient to zero, so numerical overflow cannot happen because the model stops learning on extreme examples',
        'It changes categorical cross-entropy into mean squared error whenever logits exceed the floating-point range',
      ],
      answerIndex: 0,
      explanation: 'Naively exponentiating very large logits can overflow, while very small normalized probabilities can underflow to zero before the logarithm. Stable fused losses rearrange the same objective with max subtraction and log-sum-exp-style computations, preserving the intended gradients without fragile probability intermediates.',
      misconceptionTested: 'Computing softmax probabilities first and then taking their logarithm is numerically equivalent in practice to a stable fused logits loss.',
    },
    {
      id: 'loss-output-incorrect-pairing-diagnosis',
      level: 'diagnosis',
      relatedComparison: 'task-semantics-output-head-loss-contract',
      scenario: 'A three-class mutually exclusive classifier uses three independent sigmoid outputs with binary cross-entropy. Validation examples often receive high probability for two classes at once, even though the data guarantees exactly one class is correct. The team plans to fix this only by changing the decision threshold.',
      prompt: 'What should be fixed before threshold tuning?',
      choices: [
        'Use a categorical output/loss pairing that models the classes as competing alternatives, then tune any downstream decision policy on validation data if needed',
        'Keep independent sigmoid outputs because mutually exclusive classes are best modeled as unrelated Bernoulli events and thresholding will enforce normalization automatically',
        'Replace the labels with continuous regression targets because multiple high sigmoid scores prove classification loss cannot model the dataset',
      ],
      answerIndex: 0,
      explanation: 'The data says exactly one class can be true, so the model should encode that categorical structure rather than train three unrelated Bernoulli objectives. Thresholds are downstream decision rules and cannot repair a loss/output pair whose probabilistic assumptions contradict the target structure.',
      misconceptionTested: 'A threshold can repair any mismatch between target semantics, output activation, and training loss.',
    },
  ],
});

export function getP0DeepLearningLossOutputScenariosForLesson(lessonId) {
  return P0_DEEP_LEARNING_LOSS_OUTPUT_SCENARIOS_BY_LESSON[lessonId] || [];
}
