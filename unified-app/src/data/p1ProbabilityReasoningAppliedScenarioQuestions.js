export const P1_PROBABILITY_REASONING_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  'expected-value-variance': [
    {
      id: 'expected-value-payoff-calculation',
      level: 'calculation',
      relatedComparison: 'expected-value-vs-most-likely-outcome',
      scenario: 'An automated triage policy has three possible net values per case after intervention cost: -$20 with probability 0.10, +$5 with probability 0.60, and +$30 with probability 0.30. You are deciding whether the policy has positive average economic value over many comparable cases.',
      prompt: 'What is the expected net value per case?',
      choices: [
        '$10, because (-20)(0.10) + 5(0.60) + 30(0.30) = -2 + 3 + 9',
        '$5, because the most likely outcome should be used as the expected value',
        '$15, because only the two positive outcomes should contribute to the average value',
      ],
      answerIndex: 0,
      explanation: 'Expected value is the probability-weighted average over every possible outcome, including losses. The calculation is -2 + 3 + 9 = $10 per case. The most likely single outcome is +$5, but the mode and the expectation answer different questions.',
      misconceptionTested: 'Expected value is just the most likely outcome, or negative outcomes can be ignored when the decision is usually profitable.',
    },
    {
      id: 'variance-risk-worked',
      level: 'calculation',
      relatedComparison: 'same-mean-low-variance-vs-same-mean-high-variance',
      scenario: 'Two inference configurations have the same mean latency. Configuration A is always 100 ms. Configuration B is 50 ms half the time and 150 ms half the time. For B, the mean is 100 ms and each outcome is 50 ms away from that mean. A strict latency SLO makes variability operationally important.',
      prompt: 'What are the latency variances, and which configuration is less variable?',
      choices: [
        'A has variance 0 ms^2 and B has variance 2,500 ms^2, so A is less variable despite the same mean',
        'Both have variance 100 ms^2 because both have mean latency 100 ms',
        'B has variance 50 ms^2 because variance is the average absolute distance from the mean',
      ],
      answerIndex: 0,
      explanation: 'A never deviates from its mean, so its variance is zero. For B, each squared deviation is 50^2 = 2,500, and averaging two identical squared deviations still gives 2,500 ms^2. Equal expected latency does not imply equal tail or SLO risk.',
      misconceptionTested: 'Two systems with the same expected value must have the same risk, or variance is measured using unsquared distance from the mean.',
    },
  ],
  'conditional-probability': [
    {
      id: 'conditional-probability-counts-worked',
      level: 'calculation',
      relatedComparison: 'p-incident-given-alert-vs-p-alert-given-incident',
      scenario: 'A monitoring system observes 1,000 requests. There are 120 genuine incidents. The alert fires for 90 of those incidents and also for 80 normal requests. Therefore 170 requests trigger an alert in total. The operations team wants the probability that an alerted request is truly an incident.',
      prompt: 'What is P(incident | alert), and how does it differ from alert recall?',
      choices: [
        '90/170, about 52.9%; recall is P(alert | incident) = 90/120 = 75%',
        '90/120 = 75%; conditional probabilities are symmetric so this is also P(incident | alert)',
        '120/1000 = 12%; conditioning on an alert does not change the incident probability',
      ],
      answerIndex: 0,
      explanation: 'Conditioning changes the denominator. Among the 170 alerted requests, 90 are incidents, so P(incident | alert) is about 52.9%. Recall uses the incident population as its denominator instead: 90 of 120 incidents were alerted, giving 75%.',
      misconceptionTested: 'P(A given B) equals P(B given A), or a conditional probability should keep the unconditional population as its denominator.',
    },
    {
      id: 'independence-product-rule-worked',
      level: 'calculation',
      relatedComparison: 'statistical-independence-vs-nonzero-joint-occurrence',
      scenario: 'For two binary events in a dataset, P(A) = 0.40, P(B) = 0.50, and P(A and B) = 0.20. Some observations contain both events, so the joint probability is not zero. You want to determine whether observing B changes the probability of A.',
      prompt: 'Are A and B independent under these probabilities?',
      choices: [
        'Yes; P(A)P(B) = 0.40*0.50 = 0.20, matching P(A and B), and P(A | B) = 0.20/0.50 = 0.40',
        'No; independent events can never occur together, so their joint probability must be zero',
        'No; independence requires P(A) = P(B), but 0.40 and 0.50 are different',
      ],
      answerIndex: 0,
      explanation: 'Independence means the joint factorizes: P(A and B) = P(A)P(B). Here both sides equal 0.20. Equivalently, conditioning on B leaves P(A) unchanged at 0.40. Independence does not mean mutual exclusivity or equal marginal probabilities.',
      misconceptionTested: 'Independent events cannot co-occur, or independence requires the two events to have identical marginal probabilities.',
    },
  ],
});

export function getP1ProbabilityReasoningAppliedScenariosForLesson(lessonId) {
  return P1_PROBABILITY_REASONING_APPLIED_SCENARIOS_BY_LESSON[lessonId] || [];
}
