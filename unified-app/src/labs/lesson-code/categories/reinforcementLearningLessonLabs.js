import { replaceLessonLabGroup } from '../lessonLabFactory.js';
import { createMappedCategoryLessonLabs } from '../createMappedCategoryLessonLabs.js';

const generatedLabs = createMappedCategoryLessonLabs('reinforcement-learning', {
  kind: 'reinforcement-learning loop',
  signalName: 'return or action-value score',
  stages: ['observe', 'act', 'learn'],
  stageExplanation: 'RL loops observe state, choose actions, and update behavior from feedback.',
});

export const REINFORCEMENT_LEARNING_LESSON_LABS = replaceLessonLabGroup(
  generatedLabs,
  'ppo-clipped-policy-gradient',
  () => [
    {
      id: 'ppo-policy-ratio',
      title: 'Compute the policy ratio',
      concept: 'PPO compares the new policy probability with the old collection-policy probability for the sampled action.',
      objective: 'Return pi_new divided by pi_old.',
      difficulty: 'core',
      starterCode: `function policyRatio(newProbability, oldProbability) {
  // TODO: return the new-to-old probability ratio.
  return 0;
}`,
      testCode: `const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('more likely action', policyRatio(0.36, 0.3), 1.2);
check('less likely action', policyRatio(0.16, 0.4), 0.4);
check('unchanged probability', policyRatio(0.25, 0.25), 1);

return results;`,
      hints: [
        'The ratio is multiplicative: 1 means unchanged probability.',
        'Use newProbability / oldProbability.',
        'return newProbability / oldProbability;',
      ],
      solution: `function policyRatio(newProbability, oldProbability) {
  return newProbability / oldProbability;
}`,
      explanation: 'The ratio is the small scalar that lets PPO reuse an old sampled action while asking how much the new policy changed it.',
    },
    {
      id: 'ppo-clip-ratio-bounds',
      title: 'Clip the ratio band',
      concept: 'Clip epsilon defines the allowed ratio band [1 - epsilon, 1 + epsilon].',
      objective: 'Clamp a ratio into the PPO epsilon band.',
      difficulty: 'core',
      starterCode: `function clipRatio(ratio, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;

  // TODO: clamp ratio between lower and upper.
  return ratio;
}`,
      testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('inside band unchanged', clipRatio(1.1, 0.2), 1.1);
check('above band capped', clipRatio(1.5, 0.2), 1.2);
check('below band lifted', clipRatio(0.4, 0.2), 0.8);

return results;`,
      hints: [
        'Use Math.max for the lower bound and Math.min for the upper bound.',
        'Clamp in either order: first lower, then upper.',
        'return Math.min(upper, Math.max(lower, ratio));',
      ],
      solution: `function clipRatio(ratio, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;

  return Math.min(upper, Math.max(lower, ratio));
}`,
      explanation: 'The clipped ratio is not the whole PPO objective; it is one candidate used by the surrogate calculation.',
    },
    {
      id: 'ppo-clipped-surrogate',
      title: 'Select the clipped surrogate',
      concept: 'PPO uses the minimum of the unclipped and clipped objective terms, which makes negative advantages sign-sensitive.',
      objective: 'Return min(ratio * advantage, clip(ratio) * advantage).',
      difficulty: 'core',
      starterCode: `function clippedSurrogate(ratio, advantage, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;
  const clippedRatio = Math.min(upper, Math.max(lower, ratio));
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;

  // TODO: return the conservative PPO objective term.
  return unclipped;
}`,
      testCode: `const results = [];

function approx(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: approx(actual, expected) });
}

check('positive advantage upper clips', clippedSurrogate(1.5, 2, 0.2), 2.4);
check('positive advantage inside band', clippedSurrogate(1.1, 2, 0.2), 2.2);
check('negative advantage lower clips', clippedSurrogate(0.5, -2, 0.2), -1.6);
check('negative advantage high ratio remains conservative', clippedSurrogate(1.5, -2, 0.2), -3);

return results;`,
      hints: [
        'Compute both candidates before choosing.',
        'PPO uses Math.min, even when advantage is negative.',
        'return Math.min(unclipped, clipped);',
      ],
      solution: `function clippedSurrogate(ratio, advantage, epsilon) {
  const lower = 1 - epsilon;
  const upper = 1 + epsilon;
  const clippedRatio = Math.min(upper, Math.max(lower, ratio));
  const unclipped = ratio * advantage;
  const clipped = clippedRatio * advantage;

  return Math.min(unclipped, clipped);
}`,
      explanation: 'This exercise catches the common mistake of treating clipping as symmetric without checking advantage sign.',
    },
    {
      id: 'ppo-count-clipped-rows',
      title: 'Audit clipped minibatch rows',
      concept: 'A PPO minibatch contains a mix of clipped and unclipped samples depending on ratio, epsilon, and advantage sign.',
      objective: 'Count rows where the clipped surrogate differs from the unclipped surrogate.',
      difficulty: 'challenge',
      starterCode: `function countClippedRows(rows, epsilon) {
  let clippedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const ratio = rows[i].ratio;
    const advantage = rows[i].advantage;
    const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
    const unclipped = ratio * advantage;
    const clipped = clippedRatio * advantage;

    // TODO: increment clippedCount when PPO selects the clipped candidate.
  }

  return clippedCount;
}`,
      testCode: `const results = [];

function check(name, actual, expected) {
  results.push({ name, actual, expected, passed: Object.is(actual, expected) });
}

check('mixed signs', countClippedRows([
  { ratio: 1.4, advantage: 2 },
  { ratio: 0.7, advantage: -1 },
  { ratio: 1.1, advantage: 3 },
  { ratio: 1.5, advantage: -2 },
], 0.2), 2);

check('all inside band', countClippedRows([
  { ratio: 0.95, advantage: 1 },
  { ratio: 1.05, advantage: -1 },
], 0.2), 0);

return results;`,
      hints: [
        'PPO selects Math.min(unclipped, clipped).',
        'A row is clipped when the selected value equals clipped and differs from unclipped.',
        'if (Math.min(unclipped, clipped) !== unclipped) clippedCount += 1;',
      ],
      solution: `function countClippedRows(rows, epsilon) {
  let clippedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const ratio = rows[i].ratio;
    const advantage = rows[i].advantage;
    const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
    const unclipped = ratio * advantage;
    const clipped = clippedRatio * advantage;

    if (Math.min(unclipped, clipped) !== unclipped) clippedCount += 1;
  }

  return clippedCount;
}`,
      explanation: 'The minibatch audit links the PPO formula to the lesson table: not every out-of-band ratio clips, because the advantage sign decides which side is conservative.',
    },
  ],
);
