import { qLearningTarget, qUpdate, sarsaTarget } from './qLearningModel.js';
import {
  Q_LEARNING_ACTIONS,
  Q_LEARNING_ENVIRONMENT,
  Q_LEARNING_TRAINING_DEFAULTS,
} from './qLearningTrainingConfig.js';

const ALGORITHMS = Object.freeze(['q-learning', 'sarsa']);

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function samePosition(left, right) {
  return left[0] === right[0] && left[1] === right[1];
}

function validateTrainingConfig(config) {
  const numeric = [config.alpha, config.gamma, config.epsilon, config.episodes, config.maxStepsPerEpisode, config.seed];
  if (numeric.some((value) => !Number.isFinite(value))) throw new TypeError('training configuration must be finite');
  if (config.alpha <= 0 || config.alpha > 1) throw new RangeError('alpha must be in (0, 1]');
  if (config.gamma < 0 || config.gamma > 1) throw new RangeError('gamma must be in [0, 1]');
  if (config.epsilon < 0 || config.epsilon > 1) throw new RangeError('epsilon must be in [0, 1]');
  if (!Number.isInteger(config.episodes) || config.episodes <= 0) throw new RangeError('episodes must be a positive integer');
  if (!Number.isInteger(config.maxStepsPerEpisode) || config.maxStepsPerEpisode <= 0) throw new RangeError('maxStepsPerEpisode must be a positive integer');
}

export function stateKey(position) {
  return `${position[0]},${position[1]}`;
}

export function actionValues(table, position) {
  const values = table[stateKey(position)];
  return values ? [...values] : Array.from({ length: Q_LEARNING_ACTIONS.length }, () => 0);
}

export function greedyActionIndex(values) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError('values must be a non-empty finite array');
  }
  return values.reduce((best, value, index) => value > values[best] ? index : best, 0);
}

export function epsilonGreedyAction(values, epsilon, random) {
  if (typeof random !== 'function') throw new TypeError('random must be a function');
  if (!Number.isFinite(epsilon) || epsilon < 0 || epsilon > 1) throw new RangeError('epsilon must be in [0, 1]');
  const exploreDraw = random();
  const actionDraw = random();
  const greedyIndex = greedyActionIndex(values);
  return exploreDraw < epsilon
    ? Math.min(values.length - 1, Math.floor(actionDraw * values.length))
    : greedyIndex;
}

export function transition(position, actionIndex, environment = Q_LEARNING_ENVIRONMENT) {
  if (!Array.isArray(position) || position.length !== 2 || position.some((value) => !Number.isInteger(value))) {
    throw new TypeError('position must contain integer row and column values');
  }
  if (!Number.isInteger(actionIndex) || actionIndex < 0 || actionIndex >= Q_LEARNING_ACTIONS.length) {
    throw new RangeError('actionIndex is outside the action set');
  }
  const action = Q_LEARNING_ACTIONS[actionIndex];
  const row = Math.min(environment.rows - 1, Math.max(0, position[0] + action.dr));
  const column = Math.min(environment.columns - 1, Math.max(0, position[1] + action.dc));
  const candidate = [row, column];
  const hitCliff = environment.cliff.some((cell) => samePosition(cell, candidate));
  if (hitCliff) {
    return {
      nextPosition: [...environment.start],
      reward: environment.rewards.cliff,
      terminal: false,
      hitCliff: true,
    };
  }
  const reachedGoal = samePosition(candidate, environment.goal);
  return {
    nextPosition: candidate,
    reward: reachedGoal ? environment.rewards.goal : environment.rewards.step,
    terminal: reachedGoal,
    hitCliff: false,
  };
}

function setActionValue(table, position, actionIndex, value) {
  const key = stateKey(position);
  const values = table[key] ? [...table[key]] : Array.from({ length: Q_LEARNING_ACTIONS.length }, () => 0);
  values[actionIndex] = value;
  table[key] = values;
}

function summarizeEpisodes(episodes) {
  const window = episodes.slice(-Math.min(20, episodes.length));
  const denominator = Math.max(1, window.length);
  return {
    recentAverageReturn: window.reduce((sum, episode) => sum + episode.return, 0) / denominator,
    recentAverageSteps: window.reduce((sum, episode) => sum + episode.steps, 0) / denominator,
    cliffFalls: episodes.reduce((sum, episode) => sum + episode.cliffFalls, 0),
    successRate: episodes.filter((episode) => episode.reachedGoal).length / Math.max(1, episodes.length),
  };
}

export function simulateTdControl({
  algorithm,
  config = Q_LEARNING_TRAINING_DEFAULTS,
  environment = Q_LEARNING_ENVIRONMENT,
}) {
  if (!ALGORITHMS.includes(algorithm)) throw new RangeError(`algorithm must be one of: ${ALGORITHMS.join(', ')}`);
  validateTrainingConfig(config);

  const random = mulberry32(config.seed);
  const table = {};
  const transitions = [];
  const episodes = [];

  for (let episodeIndex = 0; episodeIndex < config.episodes; episodeIndex += 1) {
    let position = [...environment.start];
    let actionIndex = epsilonGreedyAction(actionValues(table, position), config.epsilon, random);
    let totalReturn = 0;
    let cliffFalls = 0;
    let reachedGoal = false;
    let steps = 0;

    for (let stepIndex = 0; stepIndex < config.maxStepsPerEpisode; stepIndex += 1) {
      const currentValues = actionValues(table, position);
      const currentValue = currentValues[actionIndex];
      const outcome = transition(position, actionIndex, environment);
      const nextValuesBeforeUpdate = actionValues(table, outcome.nextPosition);
      const sarsaNextActionIndex = outcome.terminal || algorithm !== 'sarsa'
        ? null
        : epsilonGreedyAction(nextValuesBeforeUpdate, config.epsilon, random);
      const bootstrapActionIndex = outcome.terminal
        ? null
        : algorithm === 'q-learning'
          ? greedyActionIndex(nextValuesBeforeUpdate)
          : sarsaNextActionIndex;
      const target = algorithm === 'q-learning'
        ? qLearningTarget({
          reward: outcome.reward,
          gamma: config.gamma,
          nextActionValues: nextValuesBeforeUpdate,
          terminal: outcome.terminal,
        })
        : sarsaTarget({
          reward: outcome.reward,
          gamma: config.gamma,
          nextActionValues: nextValuesBeforeUpdate,
          nextActionIndex: sarsaNextActionIndex,
          terminal: outcome.terminal,
        });
      const updatedValue = qUpdate({ current: currentValue, target, alpha: config.alpha });
      const bootstrapValue = bootstrapActionIndex === null ? 0 : nextValuesBeforeUpdate[bootstrapActionIndex];

      setActionValue(table, position, actionIndex, updatedValue);
      const nextBehaviorActionIndex = outcome.terminal
        ? null
        : algorithm === 'sarsa'
          ? sarsaNextActionIndex
          : epsilonGreedyAction(actionValues(table, outcome.nextPosition), config.epsilon, random);
      totalReturn += outcome.reward;
      cliffFalls += outcome.hitCliff ? 1 : 0;
      steps = stepIndex + 1;
      reachedGoal = outcome.terminal;

      transitions.push({
        algorithm,
        episode: episodeIndex + 1,
        step: stepIndex + 1,
        state: [...position],
        actionIndex,
        reward: outcome.reward,
        nextState: [...outcome.nextPosition],
        nextBehaviorActionIndex,
        bootstrapActionIndex,
        bootstrapValue,
        currentValue,
        target,
        tdError: target - currentValue,
        updatedValue,
        terminal: outcome.terminal,
        hitCliff: outcome.hitCliff,
      });

      if (outcome.terminal) break;
      position = outcome.nextPosition;
      actionIndex = nextBehaviorActionIndex;
    }

    episodes.push({
      episode: episodeIndex + 1,
      return: totalReturn,
      steps,
      cliffFalls,
      reachedGoal,
    });
  }

  return {
    algorithm,
    table,
    transitions,
    episodes,
    summary: summarizeEpisodes(episodes),
  };
}

export function compareTdControl(config = Q_LEARNING_TRAINING_DEFAULTS) {
  return {
    qLearning: simulateTdControl({ algorithm: 'q-learning', config }),
    sarsa: simulateTdControl({ algorithm: 'sarsa', config }),
  };
}
