export const P1_INFORMATION_THEORY_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  softmax: [
    {
      id: 'softmax-stable-probabilities-worked',
      level: 'calculation',
      relatedComparison: 'naive-exponentiation-vs-max-shifted-stable-softmax',
      scenario: 'A classifier emits logits z = [1000, 1001, 999]. Directly evaluating exp(z) can overflow, so subtract the maximum logit first. The shifted logits are [-1, 0, -2], with exponentials approximately [0.3679, 1.0000, 0.1353] and total 1.5032.',
      prompt: 'What probability vector does stable softmax produce, and why is subtracting 1001 valid?',
      choices: [
        'Approximately [0.245, 0.665, 0.090]; subtracting the same constant from every logit leaves all softmax probability ratios unchanged',
        'Approximately [0.368, 1.000, 0.135]; subtracting the maximum removes the need to normalize the exponentials',
        'Approximately [0.333, 0.333, 0.333]; subtracting the maximum destroys the original ordering of the logits',
      ],
      answerIndex: 0,
      explanation: 'Dividing each shifted exponential by 1.5032 gives about 0.245, 0.665, and 0.090. Softmax is invariant to adding or subtracting a shared constant because that factor cancels between numerator and denominator, which is why max-shifting improves numerical stability without changing the distribution.',
      misconceptionTested: 'Numerically stabilizing softmax by subtracting the largest logit changes the model probabilities or means normalization is no longer necessary.',
    },
  ],
  entropy: [
    {
      id: 'entropy-bernoulli-worked',
      level: 'calculation',
      relatedComparison: 'high-confidence-distribution-vs-high-uncertainty-distribution',
      scenario: 'Two binary classifiers produce probability distributions A = [0.5, 0.5] and B = [0.9, 0.1]. Using base-2 entropy H(p) = -sum p_i log2(p_i), distribution A has entropy exactly 1 bit. For B, use log2(0.9) about -0.152 and log2(0.1) about -3.322.',
      prompt: 'What is the entropy of B, and which classifier output is more uncertain?',
      choices: [
        'B has about 0.469 bits of entropy, so A is more uncertain because its probability mass is more evenly spread',
        'B has about 1.469 bits of entropy, so B is more uncertain because one class has much larger probability',
        'B has exactly 0.1 bits of entropy, so uncertainty equals the probability assigned to the less likely class',
      ],
      answerIndex: 0,
      explanation: 'H(B) = -(0.9*-0.152 + 0.1*-3.322) = 0.1368 + 0.3322 = about 0.469 bits. Entropy measures spread, so the balanced [0.5, 0.5] output is maximally uncertain for a binary distribution, while [0.9, 0.1] is more concentrated and therefore lower entropy.',
      misconceptionTested: 'A distribution becomes more uncertain when one class receives a dominant probability, or entropy can be read directly from the smallest class probability.',
    },
  ],
  'cross-entropy': [
    {
      id: 'cross-entropy-nll-worked',
      level: 'calculation',
      relatedComparison: 'classification-accuracy-vs-probability-sensitive-negative-log-likelihood',
      scenario: 'Two six-class models both rank the true class first. Model A assigns the true class probability 0.8. Model B assigns the true class 0.2 and spreads the remaining 0.8 evenly across the five incorrect classes, giving each 0.16, so its top-1 prediction is still correct. For a one-hot target, cross-entropy is -ln(p_true): -ln(0.8) is about 0.223 and -ln(0.2) is about 1.609.',
      prompt: 'What does this example show about cross-entropy compared with a 0/1 correctness score?',
      choices: [
        'Model A receives loss about 0.223 while Model B receives about 1.609, so cross-entropy rewards assigning more probability to the true class even when both predictions have the same top-1 correctness',
        'Both models receive the same loss because cross-entropy only checks whether the predicted class label is correct',
        'Model B receives the smaller loss because lower true-class probability prevents the model from becoming overconfident',
      ],
      answerIndex: 0,
      explanation: 'For a one-hot label the loss is the negative log probability assigned to the true class. Raising p_true from 0.2 to 0.8 lowers the loss from about 1.609 to 0.223. This probability sensitivity is why cross-entropy supplies a useful training signal even when two outputs receive the same discrete top-1 correctness score.',
      misconceptionTested: 'Cross-entropy is effectively the same as classification accuracy and therefore cannot distinguish correct predictions with very different probabilities on the true class.',
    },
  ],
});

export function getP1InformationTheoryAppliedScenariosForLesson(lessonId) {
  return P1_INFORMATION_THEORY_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
