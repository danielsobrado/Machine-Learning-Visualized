import { P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON } from './p1CoreRlAlgorithmsAppliedScenarioQuestions.js';

export const P1_REINFORCEMENT_LEARNING_APPLIED_SCENARIOS_BY_LESSON = Object.freeze({
  ...P1_CORE_RL_ALGORITHMS_APPLIED_SCENARIOS_BY_LESSON,
  'rl-foundations': [
    {
      id: 'rl-discounted-return-worked',
      level: 'calculation',
      relatedComparison: 'immediate-reward-vs-discounted-return',
      scenario: 'Starting from time t, an agent receives rewards 2 now, 0 one step later, and 8 two steps later. The discount factor is gamma = 0.5, and the episode ends after the third listed reward.',
      prompt: 'What discounted return G_t should be assigned to the starting state-action decision?',
      choices: [
        '4 because 2 + 0.5 * 0 + 0.5^2 * 8 = 4',
        '10 because return is always the undiscounted sum of all future rewards',
        '2 because return contains only the reward received immediately after the action',
      ],
      answerIndex: 0,
      explanation: 'Discounted return accumulates future rewards with powers of gamma. Here the delayed reward contributes 0.25 * 8 = 2, so the total is 2 + 0 + 2 = 4.',
      misconceptionTested: 'Return is either identical to immediate reward or always an undiscounted sum regardless of gamma.',
    },
  ],
  'q-learning': [
    {
      id: 'qlearn-terminal-update-worked',
      level: 'calculation',
      relatedComparison: 'terminal-target-vs-bootstrapped-target',
      scenario: 'For a transition that ends the episode, Q(s,a) is currently 4.0, the terminal reward is 2.0, and learning rate alpha = 0.25. Because the next state is terminal, no future Q-value should be bootstrapped into the target.',
      prompt: 'What is the updated Q(s,a) after this one Q-learning step?',
      choices: [
        '3.5 because 4.0 + 0.25 * (2.0 - 4.0) = 3.5',
        '4.75 because a max next-state Q-value should still be added after termination',
        '2.0 because Q-learning always replaces the old estimate with the target in one step',
      ],
      answerIndex: 0,
      explanation: 'A terminal transition has target equal to the terminal reward, so the TD error is 2 - 4 = -2. Multiplying by alpha gives -0.5, moving Q from 4.0 to 3.5 rather than fully replacing it.',
      misconceptionTested: 'Q-learning should bootstrap through terminal states or ignore the learning rate on terminal updates.',
    },
  ],
  'rl-exploration': [
    {
      id: 'epsilon-greedy-action-probability-worked',
      level: 'calculation',
      relatedComparison: 'greedy-exploitation-vs-random-exploration-probability',
      scenario: 'An epsilon-greedy policy has 4 available actions and epsilon = 0.20. With probability 0.80 it chooses the unique greedy action; during the 0.20 exploration branch it samples uniformly from all 4 actions, including the greedy one.',
      prompt: 'What is the total probability of selecting the greedy action on a decision step?',
      choices: [
        '0.85 because 0.80 + 0.20 * 1/4 = 0.85',
        '0.80 because the exploration branch can never choose the greedy action',
        '0.25 because epsilon-greedy always samples uniformly from every action',
      ],
      answerIndex: 0,
      explanation: 'The greedy action is chosen through exploitation with probability 0.80 and can also be selected during uniform exploration with probability 0.20 * 0.25 = 0.05, giving 0.85 total.',
      misconceptionTested: 'The epsilon exploration branch necessarily excludes the action that is currently greedy.',
    },
  ],
  'grpo-reasoning': [
    {
      id: 'grpo-group-advantage-worked',
      level: 'calculation',
      relatedComparison: 'absolute-reward-vs-group-relative-advantage',
      scenario: 'Four completions for the same reasoning prompt receive verifier rewards [1, 1, 3, 5]. For this simplified exercise, define each group-relative advantage as A_i = r_i - mean(r) without standard-deviation normalization.',
      prompt: 'What mean-centered advantage is assigned to the completion with reward 5?',
      choices: [
        '2.5 because the group mean is 2.5 and 5 - 2.5 = 2.5',
        '5 because group-relative methods use the raw reward as the advantage',
        '0 because the best completion is treated as the baseline and cannot receive positive advantage',
      ],
      answerIndex: 0,
      explanation: 'The group mean is (1 + 1 + 3 + 5) / 4 = 2.5. Under the explicitly stated mean-centering rule, the reward-5 completion receives advantage 5 - 2.5 = 2.5.',
      misconceptionTested: 'Group-relative optimization uses raw verifier reward directly without comparing sibling completions.',
    },
  ],
  'dapo-reasoning-rl': [
    {
      id: 'dapo-dynamic-sampling-worked',
      level: 'calculation',
      relatedComparison: 'all-same-groups-vs-frontier-groups',
      scenario: 'A DAPO rollout batch contains 64 prompt groups. After scoring, 20 groups are all correct, 16 are all wrong, and 28 contain a mix of successful and failed completions. Dynamic Sampling keeps only groups with within-group reward contrast.',
      prompt: 'How many groups remain effective for the optimizer, and what fraction of the original groups is that?',
      choices: [
        '28 groups, which is 43.75% of the original 64 groups',
        '48 groups, because all-correct groups should also create strong relative advantages',
        '64 groups, because Dynamic Sampling changes clipping but never filters rollout groups',
      ],
      answerIndex: 0,
      explanation: 'Only the 28 mixed groups provide the contrast Dynamic Sampling is designed to keep. Dividing 28 by 64 gives 0.4375, or 43.75%, showing how much rollout budget actually reaches the optimizer.',
      misconceptionTested: 'All-correct and all-wrong groups are equally informative for group-relative reasoning updates.',
    },
  ],
  'coconut-latent-reasoning': [
    {
      id: 'coconut-visible-vs-compute-worked',
      level: 'calculation',
      relatedComparison: 'visible-token-count-vs-latent-compute-steps',
      scenario: 'A Coconut response uses 4 latent reasoning positions between <bot> and <eot>, then emits 6 visible answer tokens. Assume each latent position and each visible generated token requires one transformer forward step for this simplified comparison.',
      prompt: 'How many reasoning/generation forward steps should be counted, and how many of them are visible tokens?',
      choices: [
        '10 forward steps in total, of which only 6 are visible tokens',
        '6 forward steps in total because latent positions are free when they are not decoded to text',
        '4 forward steps in total because answer tokens do not require model computation',
      ],
      answerIndex: 0,
      explanation: 'The four latent positions still execute model computation, and the six visible output tokens add six more generation steps. That gives 10 forward steps even though the user sees only 6 output tokens.',
      misconceptionTested: 'Reducing visible chain-of-thought tokens makes latent reasoning positions computationally free.',
    },
  ],
  'reasoning-rlvr-grpo': [
    {
      id: 'rlvr-verifier-generalization-decision',
      level: 'decision',
      relatedComparison: 'training-verifier-reward-vs-hidden-correctness-generalization',
      scenario: 'After RLVR, training-verifier reward rises from 0.62 to 0.91, but a separately authored hidden correctness suite remains near 0.63. Inspection shows the training verifier strongly rewards a formatting pattern that can appear on incorrect solutions.',
      prompt: 'What should be changed before trusting further policy optimization?',
      choices: [
        'Strengthen and diversify the verifier/evaluation signal so reward tracks hidden correctness rather than the exploitable formatting proxy',
        'Increase policy-update magnitude because the high training reward proves the reward definition is already aligned',
        'Remove the hidden correctness suite because disagreement with the training verifier makes the hidden tests invalid',
      ],
      answerIndex: 0,
      explanation: 'The gap between training reward and independent correctness is evidence of verifier exploitation. Continuing to optimize the same proxy is likely to amplify the shortcut, so the reward and held-out evaluation need repair first.',
      misconceptionTested: 'A rising verifiable reward is sufficient evidence of reasoning improvement even when independent correctness does not move.',
    },
  ],
});