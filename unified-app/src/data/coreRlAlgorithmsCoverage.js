export const CORE_RL_ALGORITHMS_AUDITED_LESSON_IDS = Object.freeze([
  'markov-chains',
  'mdp-formalism',
  'value-iteration',
  'policy-iteration',
  'policy-gradients',
  'actor-critic',
  'ppo-clipped-policy-gradient',
  'reward-shaping',
  'pagerank',
]);

export const CORE_RL_ALGORITHMS_DEPTH_REQUIREMENTS = Object.freeze([
  Object.freeze({
    id: 'markov-two-step-transition-probability',
    lessonId: 'markov-chains',
    competency: 'multi-step Markov transition probability',
    scenarioId: 'rlcore-markov-two-step-worked',
  }),
  Object.freeze({
    id: 'mdp-stochastic-bellman-expectation-backup',
    lessonId: 'mdp-formalism',
    competency: 'stochastic Bellman expectation backup',
    scenarioId: 'rlcore-mdp-expected-return-worked',
  }),
  Object.freeze({
    id: 'value-iteration-bellman-optimality-backup',
    lessonId: 'value-iteration',
    competency: 'Bellman optimality value backup',
    scenarioId: 'rlcore-value-bellman-worked',
  }),
  Object.freeze({
    id: 'policy-iteration-greedy-policy-improvement',
    lessonId: 'policy-iteration',
    competency: 'greedy policy improvement from evaluated values',
    scenarioId: 'rlcore-policy-improvement-worked',
  }),
  Object.freeze({
    id: 'policy-gradient-return-weighted-contribution',
    lessonId: 'policy-gradients',
    competency: 'return-weighted policy gradient contribution',
    scenarioId: 'rlcore-reinforce-weight-worked',
  }),
  Object.freeze({
    id: 'actor-critic-one-step-td-advantage',
    lessonId: 'actor-critic',
    competency: 'one-step TD advantage calculation',
    scenarioId: 'rlcore-actor-critic-td-worked',
  }),
  Object.freeze({
    id: 'ppo-clipped-surrogate-calculation',
    lessonId: 'ppo-clipped-policy-gradient',
    competency: 'PPO clipped surrogate calculation',
    scenarioId: 'rlcore-ppo-clipping-worked',
  }),
  Object.freeze({
    id: 'potential-based-reward-shaping-invariance',
    lessonId: 'reward-shaping',
    competency: 'potential-based shaping calculation and policy invariance',
    scenarioId: 'rlcore-potential-shaping-worked',
  }),
  Object.freeze({
    id: 'pagerank-damped-rank-propagation',
    lessonId: 'pagerank',
    competency: 'damped rank-propagation iteration',
    scenarioId: 'rlcore-pagerank-iteration-worked',
  }),
]);
