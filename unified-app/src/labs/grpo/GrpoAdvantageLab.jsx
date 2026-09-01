import React from 'react';
import { GRPO_CANDIDATES, DEFAULT_GRPO_WEIGHTS } from './grpoLabData';
import { GRPO_STARTER_CODE } from './grpoStarterCode';
import { buildGrpoCheckScript } from './grpoChecker';
import { GRPO_HINTS } from './grpoHints';
import { GRPO_FULL_SOLUTION, GRPO_SOLUTIONS } from './grpoSolutions';
import { runPythonInBrowser } from '../runtime/pyodideClient';

const TODO_KEYS = ['total_reward', 'group_advantages', 'update_direction'];

const STEP_DEFS = [
  {
    id: 'inspect',
    title: 'Inspect candidates',
    learnerGoal: 'Read the sampled traces and predict which ones should get positive pressure.',
    checkFocus: 'Input features',
    relatedTodo: null,
  },
  {
    id: 'reward',
    title: 'Implement total_reward',
    learnerGoal: 'Score correctness, format, length, and language consistency.',
    checkFocus: 'Reward function',
    relatedTodo: 'total_reward',
  },
  {
    id: 'advantages',
    title: 'Implement group_advantages',
    learnerGoal: 'Normalize rewards relative to this prompt group.',
    checkFocus: 'Group mean and std',
    relatedTodo: 'group_advantages',
  },
  {
    id: 'direction',
    title: 'Implement update_direction',
    learnerGoal: 'Map advantage signs and thresholds to update pressure.',
    checkFocus: 'Policy direction',
    relatedTodo: 'update_direction',
  },
  {
    id: 'analyze',
    title: 'Analyze reward design',
    learnerGoal: 'Use sliders to expose reward hacking, overthinking, and language penalties.',
    checkFocus: 'Interpretation',
    relatedTodo: null,
  },
];

const WEIGHT_CONTROLS = [
  { key: 'correctnessWeight', label: 'Correctness reward', min: 0, max: 2, step: 0.1 },
  { key: 'formatWeight', label: 'Format reward', min: 0, max: 0.5, step: 0.05 },
  { key: 'languagePenalty', label: 'Language penalty', min: 0, max: 0.5, step: 0.05 },
  { key: 'lengthPenalty', label: 'Length penalty', min: 0, max: 0.05, step: 0.005 },
];

const EXPERIMENTS = [
  {
    id: 'format-heavy',
    title: 'Format over-optimization',
    prompt: 'Increase format reward to 0.5. What happens to malformed vs formatted traces?',
    question: 'Which candidate benefits from being formatted even when it is wrong?',
    failureMode: 'reward hacking',
    weights: { correctnessWeight: 0, formatWeight: 0.5, languagePenalty: 0, lengthPenalty: 0 },
  },
  {
    id: 'language-mixing',
    title: 'Language-mixing penalty',
    prompt: 'Increase language penalty to 0.5. What happens to candidate G?',
    question: 'Does the correct language-mixed trace fall below other correct traces?',
    failureMode: 'language-mixing penalty',
    weights: { languagePenalty: 0.5 },
  },
  {
    id: 'overthinking',
    title: 'Overthinking penalty',
    prompt: 'Increase length penalty to 0.03. What happens to overthinking candidate H?',
    question: 'Which correct candidate changed the most?',
    failureMode: 'overthinking penalty',
    weights: { lengthPenalty: 0.03 },
  },
  {
    id: 'weak-signal',
    title: 'Weak correctness signal',
    prompt: 'Set correctness reward low and format reward high. Can a polished wrong trace become too attractive?',
    question: 'What failure mode does this demonstrate?',
    failureMode: 'all-negative / weak signal risk',
    weights: { correctnessWeight: 0.2, formatWeight: 0.5, languagePenalty: 0, lengthPenalty: 0.005 },
  },
];

function parseLabOutput(stdout) {
  const lines = stdout.trim().split('\n').filter(Boolean);
  const jsonLine = [...lines].reverse().find((line) => line.trim().startsWith('{'));
  if (!jsonLine) throw new Error('No JSON result was printed by the checker.');
  return JSON.parse(jsonLine);
}

function formatNumber(value, digits = 3) {
  return Number.isFinite(value) ? value.toFixed(digits) : '-';
}

function directionMeta(direction) {
  if (direction === 'up') {
    return {
      label: 'Probability up',
      baseline: 'Above group baseline',
      className: 'ua-grpo-direction up',
      mark: '↑',
    };
  }

  if (direction === 'down') {
    return {
      label: 'Probability down',
      baseline: 'Below group baseline',
      className: 'ua-grpo-direction down',
      mark: '↓',
    };
  }

  return {
    label: 'Neutral',
    baseline: 'Near baseline',
    className: 'ua-grpo-direction neutral',
    mark: '→',
  };
}

function getCandidateResult(result, index) {
  if (!result) {
    return {
      reward: null,
      advantage: null,
      direction: null,
    };
  }

  return {
    reward: result.rewards[index],
    advantage: result.advantages[index],
    direction: result.directions[index],
  };
}

function getCheck(result, id) {
  return result?.checks?.find((check) => check.id === id) || null;
}

function countPassedChecks(result) {
  return result?.checks?.filter((check) => check.passed).length || 0;
}

function replaceFunctionInCode(source, functionName, replacement) {
  const pattern = new RegExp(`def ${functionName}\\([\\s\\S]*?(?=\\n\\ndef |\\n?$)`, 'm');
  if (pattern.test(source)) {
    return source.replace(pattern, replacement);
  }
  return `${source.trim()}\n\n${replacement}\n`;
}

function parsePythonError(message) {
  const lineMatch = message.match(/line (\d+)/i) || message.match(/<exec>, line (\d+)/i);
  const kindMatch = message.match(/([A-Za-z]+Error):?\s*([^(\n]*)/);

  let likelyCause = 'Check the highlighted function for a Python syntax or return-value issue.';
  if (/SyntaxError|was never closed|unexpected EOF|invalid syntax/i.test(message)) {
    likelyCause = 'A bracket, quote, colon, or indentation block is probably incomplete.';
  } else if (/NoneType|not iterable/i.test(message)) {
    likelyCause = 'One function returned None where the checker expected a list.';
  } else if (/NameError/i.test(message)) {
    likelyCause = 'A variable or helper name is used before it is defined.';
  } else if (/KeyError/i.test(message)) {
    likelyCause = 'A candidate or weights dictionary key may be misspelled.';
  }

  return {
    title: 'Python error',
    line: lineMatch ? lineMatch[1] : null,
    message: kindMatch ? `${kindMatch[1]}: ${kindMatch[2].trim()}` : message.split('\n')[0],
    likelyCause,
    raw: message,
  };
}

function buildSteps(result, activeStep) {
  const passed = new Set(result?.checks?.filter((check) => check.passed).map((check) => check.id) || []);

  return STEP_DEFS.map((step) => {
    if (step.id === 'inspect') {
      return { ...step, status: activeStep === step.id ? 'active' : 'passed' };
    }

    if (step.id === 'analyze') {
      if (result?.passed) return { ...step, status: activeStep === step.id ? 'active' : 'passed' };
      return { ...step, status: 'locked' };
    }

    if (passed.has(step.relatedTodo)) return { ...step, status: 'passed' };
    return { ...step, status: activeStep === step.id ? 'active' : 'active' };
  });
}

export default function GrpoAdvantageLab() {
  const [code, setCode] = React.useState(GRPO_STARTER_CODE);
  const [weights, setWeights] = React.useState(DEFAULT_GRPO_WEIGHTS);
  const [running, setRunning] = React.useState(false);
  const [runtimeHasLoaded, setRuntimeHasLoaded] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState('inspect');
  const [activeTodo, setActiveTodo] = React.useState('total_reward');
  const [hintLevel, setHintLevel] = React.useState(0);
  const [hintsVisible, setHintsVisible] = React.useState(false);
  const [revealed, setRevealed] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const steps = React.useMemo(() => buildSteps(result, activeStep), [result, activeStep]);
  const passedChecks = countPassedChecks(result);
  const activeHints = GRPO_HINTS[activeTodo] || [];
  const currentHint = activeHints[hintLevel - 1];
  const activeCheck = getCheck(result, activeTodo);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        runLab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // runLab intentionally reads latest state from the component closure.
  });

  function updateWeight(key, value) {
    setWeights((current) => ({
      ...current,
      [key]: Number(value),
    }));
  }

  function applyWeights(nextWeights) {
    setWeights((current) => ({
      ...current,
      ...nextWeights,
    }));
  }

  function resetLab() {
    setCode(GRPO_STARTER_CODE);
    setWeights(DEFAULT_GRPO_WEIGHTS);
    setResult(null);
    setError(null);
    setActiveStep('inspect');
    setActiveTodo('total_reward');
    setHintLevel(0);
    setHintsVisible(false);
    setRevealed(null);
  }

  async function runLab(codeOverride = null) {
    if (running) return;
    setRunning(true);
    setError(null);
    setResult(null);

    const sourceCode = typeof codeOverride === 'string' ? codeOverride : code;
    const script = buildGrpoCheckScript(sourceCode, GRPO_CANDIDATES, weights);
    const response = await runPythonInBrowser(script);

    setRunning(false);
    setRuntimeHasLoaded(true);

    if (response.error) {
      setError(parsePythonError(response.stderr ? `${response.error}\n\n${response.stderr}` : response.error));
      setResult(null);
      return;
    }

    try {
      const parsed = parseLabOutput(response.stdout);
      setResult(parsed);
      setActiveStep(parsed.passed ? 'analyze' : activeStep);
    } catch (err) {
      setError({
        title: 'Result parsing error',
        line: null,
        message: err.message,
        likelyCause: 'The Python code may have printed non-JSON output after the checker result.',
        raw: response.stdout,
      });
      setResult(null);
    }
  }

  function selectStep(step) {
    if (step.status === 'locked') return;
    setActiveStep(step.id);
    if (step.relatedTodo) {
      setActiveTodo(step.relatedTodo);
      setHintLevel(0);
      setHintsVisible(false);
      setRevealed(null);
    }
  }

  function showHint() {
    setHintsVisible(true);
    setHintLevel((level) => Math.min(level + 1 || 1, activeHints.length));
  }

  function hideHints() {
    setHintsVisible(false);
    setHintLevel(0);
  }

  function revealCurrentSolution() {
    setRevealed(activeTodo);
  }

  function revealFullSolution() {
    setRevealed('full');
  }

  function applySolutionToEditor() {
    if (revealed === 'full') {
      setCode(GRPO_FULL_SOLUTION);
      return;
    }

    if (GRPO_SOLUTIONS[revealed]) {
      setCode((current) => replaceFunctionInCode(current, revealed, GRPO_SOLUTIONS[revealed]));
    }
  }

  async function copySolution() {
    const text = revealed === 'full' ? GRPO_FULL_SOLUTION : GRPO_SOLUTIONS[revealed] || GRPO_FULL_SOLUTION;
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard permission can be unavailable in embedded or automated browsers.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function runReferenceSolution() {
    setCode(GRPO_FULL_SOLUTION);
    window.setTimeout(() => runLab(GRPO_FULL_SOLUTION), 0);
  }

  return (
    <section className="ua-grpo-lab-panel">
      <div className="ua-grpo-lab-head">
        <span>Interactive Lab</span>
        <div>
          <h2>Compute GRPO group advantages</h2>
          <p>
            GRPO samples a group of answers for the same prompt. Each answer receives a reward,
            then rewards are normalized inside the group. Positive advantage means "better than
            this group's baseline," not "perfect in an absolute sense."
          </p>
        </div>
      </div>

      <div className="ua-grpo-lab-note">
        <strong>Teaching abstraction:</strong>
        <span>
          This lab uses a simplified reward and advantage calculation. Production GRPO also
          includes policy ratios, clipping, KL control, batching details, and optimizer dynamics.
        </span>
      </div>

      <div className="ua-grpo-stepper" aria-label="GRPO lab steps">
        {steps.map((step, index) => {
          const stepMark = step.status === 'passed' ? '×' : step.status === 'locked' ? '–' : '→';
          return (
            <button
              key={step.id}
              type="button"
              data-math-control
              onClick={() => selectStep(step)}
              className={`ua-grpo-step ${step.status} ${activeStep === step.id ? 'selected' : ''}`}
              disabled={step.status === 'locked'}
            >
              <span className="ua-grpo-step-index">Step {index + 1}</span>
              <strong>{step.title}</strong>
              <small>{step.checkFocus}</small>
              <span className="ua-step-mark" aria-hidden="true">{stepMark}</span>
            </button>
          );
        })}
      </div>

      <div className="ua-grpo-progress-row">
        <span>{passedChecks} / 4 checks passed</span>
        <strong>
          {result
            ? result.checks.map((check) => `${check.label.replace(' match reference', '')} ${check.passed ? 'passed' : 'pending'}`).join(' | ')
            : 'Run checks to map each TODO to feedback'}
        </strong>
      </div>

      <div className="ua-grpo-lab-controls" aria-label="Reward weights">
        {WEIGHT_CONTROLS.map((control) => (
          <label key={control.key} className="ua-grpo-slider">
            <span>
              {control.label}
              <strong>{weights[control.key].toFixed(control.step < 0.01 ? 3 : 2)}</strong>
            </span>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={weights[control.key]}
              onChange={(event) => updateWeight(control.key, event.target.value)}
              className="ds-range"
            />
          </label>
        ))}
      </div>

      <div className="ua-grpo-lab-grid">
        <div className="ua-grpo-lab-card ua-grpo-candidates">
          <div className="ua-grpo-card-head">
            <h3>Candidate group</h3>
            <span>Solve: 3x + 2 = 11</span>
          </div>

          <div className="ua-grpo-candidate-list">
            {GRPO_CANDIDATES.map((candidate, index) => {
              const rowResult = getCandidateResult(result, index);
              const meta = directionMeta(rowResult.direction);
    
              return (
                <article key={candidate.id} className="ua-grpo-candidate-card">
                  <div>
                    <strong>
                      {candidate.id} - {candidate.label}
                    </strong>
                    <p>{candidate.summary}</p>
                  </div>
                  <div className="ua-grpo-candidate-tags">
                    <span>{candidate.isCorrect ? 'correct' : 'wrong'}</span>
                    <span>{candidate.hasValidFormat ? 'format' : 'malformed'}</span>
                    <span>{candidate.tokenCount} tokens</span>
                    <span>{candidate.languageMixed ? 'mixed language' : 'no language mix'}</span>
                  </div>
                  <div className="ua-grpo-candidate-metrics">
                    <span>Reward: {rowResult.reward === null ? '-' : formatNumber(rowResult.reward)}</span>
                    <span>Advantage: {rowResult.advantage === null ? '-' : formatNumber(rowResult.advantage)}</span>
                    <span className={meta.className}>
                      <span aria-hidden="true">{meta.mark}</span>
                      {rowResult.direction ? meta.label : 'Not run'}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="ua-grpo-lab-card ua-grpo-python-card">
          <div className="ua-grpo-card-head">
            <h3>Python editor</h3>
            <span>Fix TODOs, then run checks</span>
          </div>

          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            rows={28}
            spellCheck={false}
            className="ua-grpo-code-editor"
            aria-label="GRPO Python lab code"
          />

          <div className="ua-grpo-actions">
            <button
              type="button"
              data-math-control
              onClick={runLab}
              disabled={running}
              className="ds-btn ua-grpo-run-button"
            >
              {running && !runtimeHasLoaded ? 'Loading Python runtime...' : running ? 'Running checks...' : 'Run checks'}
            </button>
            <button type="button" data-math-control onClick={runReferenceSolution} disabled={running} className="ds-btn">
              Run reference solution
            </button>
            <button
              type="button"
              data-math-control
              onClick={resetLab}
              disabled={running}
              className="ds-btn ua-grpo-reset-button"
            >
              Reset starter
            </button>
          </div>
        </div>

        <aside className="ua-grpo-lab-card ua-grpo-guide-card">
          <div className="ua-grpo-card-head">
            <h3>Guidance and checks</h3>
            <span>{STEP_DEFS.find((step) => step.id === activeStep)?.learnerGoal}</span>
          </div>

          <div className="ua-grpo-todo-tabs" aria-label="TODO selector">
            {TODO_KEYS.map((todo) => {
              const check = getCheck(result, todo);
              return (
                <button
                  key={todo}
                  type="button"
                  data-math-control
                  onClick={() => {
                    setActiveTodo(todo);
                    setHintLevel(0);
                    setHintsVisible(false);
                    setRevealed(null);
                  }}
                  className={activeTodo === todo ? 'active' : ''}
                >
                  <span className="ua-step-mark" aria-hidden="true">{check?.passed ? '×' : '·'}</span>
                  {todo}
                </button>
              );
            })}
          </div>

          <div className="ua-grpo-hint-panel">
            <div className="ua-grpo-hint-head">
              <strong>{activeTodo}</strong>
              <span>{hintsVisible ? `Hint ${hintLevel} / ${activeHints.length}` : 'Hints hidden'}</span>
            </div>

            {hintsVisible && currentHint ? (
              currentHint.code ? (
                <pre>{currentHint.body}</pre>
              ) : (
                <p>
                  <strong>{currentHint.title}:</strong> {currentHint.body}
                </p>
              )
            ) : (
              <p>Use hints progressively. Try one hint, edit the code, then rerun checks.</p>
            )}

            <div className="ua-grpo-mini-actions">
              <button type="button" data-math-control onClick={showHint}>
                {hintsVisible ? 'Next hint' : 'Show hint'}
              </button>
              <button type="button" data-math-control onClick={hideHints}>
                Hide hints
              </button>
            </div>
          </div>

          <div className="ua-grpo-solution-panel">
            <p>
              Try the hints first. Revealing the solution is useful for study, but implementing it
              yourself is better for retention.
            </p>
            <div className="ua-grpo-mini-actions">
              <button type="button" data-math-control onClick={revealCurrentSolution}>
                Reveal current function solution
              </button>
              <button type="button" data-math-control onClick={revealFullSolution}>
                Reveal full solution
              </button>
            </div>

            {revealed && (
              <div className="ua-grpo-reveal-box">
                <strong>
                  {revealed === 'full' ? 'Complete reference implementation' : `${revealed} solution`}
                </strong>
                <pre>{revealed === 'full' ? GRPO_FULL_SOLUTION : GRPO_SOLUTIONS[revealed]}</pre>
                <div className="ua-grpo-mini-actions">
                  <button type="button" data-math-control onClick={applySolutionToEditor}>
                    Apply solution to editor
                  </button>
                  <button type="button" data-math-control onClick={copySolution}>
                    {copied ? 'Copied' : 'Copy solution'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="ua-grpo-error-card">
              <strong>{error.title}</strong>
              {error.line && <span>Line {error.line}</span>}
              <p>{error.message}</p>
              <small>
                <strong>Likely cause:</strong> {error.likelyCause}
              </small>
            </div>
          )}

          {!result && !error && (
            <div className="ua-grpo-empty-state">
              <p>
                {running
                  ? 'Python is checking your reward, advantage, and update functions.'
                  : 'Run the starter code to see TODO-specific feedback.'}
              </p>
            </div>
          )}

          {result && (
            <div className="ua-grpo-results">
              <div className={`ua-grpo-status ${result.passed ? 'passed' : 'pending'}`}>
                <span className="ua-step-mark" aria-hidden="true">{result.passed ? '×' : '!'}</span>
                <strong>{result.passed ? 'All checks passed' : 'Not passed yet'}</strong>
              </div>

              <ul className="ua-grpo-check-list">
                {result.checks.map((check) => (
                  <li key={check.id} className={check.passed ? 'passed' : 'failed'}>
                    <span className="ua-step-mark" aria-hidden="true">{check.passed ? '×' : '!'}</span>
                    <span>
                      <strong>
                        {check.id === 'sanity' ? 'sanity' : check.id}: {check.label}
                      </strong>
                      <small>{check.feedback}</small>
                    </span>
                  </li>
                ))}
              </ul>

              {activeCheck && (
                <div className={`ua-grpo-active-feedback ${activeCheck.passed ? 'passed' : 'failed'}`}>
                  <strong>{activeCheck.passed ? 'Current TODO passed' : 'Current TODO needs work'}</strong>
                  <p>{activeCheck.feedback}</p>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      <div className="ua-grpo-output-grid">
        <section className="ua-grpo-lab-card ua-grpo-pressure-card">
          <div className="ua-grpo-card-head">
            <h3>Candidate pressure chart</h3>
            <span>Reward bar - advantage bar - update arrow</span>
          </div>

          <div className="ua-grpo-baseline-row">
            <span>Group mean reward: {result ? formatNumber(result.groupMean) : '-'}</span>
            <span>Reward std: {result ? formatNumber(result.groupStd) : '-'}</span>
          </div>

          <div className="ua-grpo-pressure-list">
            {GRPO_CANDIDATES.map((candidate, index) => {
              const rowResult = getCandidateResult(result, index);
              const meta = directionMeta(rowResult.direction);
                  const rewardScale = result ? Math.max(...result.rewards.map((reward) => Math.abs(reward)), 1) : 1;
              const advantageScale = result ? Math.max(...result.advantages.map((adv) => Math.abs(adv)), 1) : 1;
              const rewardWidth = rowResult.reward === null ? '0%' : `${Math.min(Math.abs(rowResult.reward) / rewardScale, 1) * 100}%`;
              const advantageWidth = rowResult.advantage === null ? '0%' : `${Math.min(Math.abs(rowResult.advantage) / advantageScale, 1) * 100}%`;

              return (
                <div key={candidate.id} className="ua-grpo-pressure-row">
                  <span className="ua-grpo-pressure-id">{candidate.id}</span>
                  <div className="ua-grpo-pressure-bars">
                    <label>
                      Reward
                      <span className="ua-grpo-track">
                        <span className="ua-grpo-reward-bar" style={{ width: rewardWidth }} />
                      </span>
                    </label>
                    <label>
                      Advantage
                      <span className="ua-grpo-track">
                        <span className={`ua-grpo-advantage-bar ${rowResult.direction || 'neutral'}`} style={{ width: advantageWidth }} />
                      </span>
                    </label>
                  </div>
                  <span className={meta.className}>
                    <span aria-hidden="true">{meta.mark}</span>
                    {rowResult.direction ? meta.baseline : 'Not run'}
                  </span>
                </div>
              );
            })}
          </div>

          {result?.insights?.length > 0 && (
            <div className="ua-grpo-insights">
              <strong>Interpretive summary</strong>
              {result.insights.map((insight) => (
                <p key={insight}>{insight}</p>
              ))}
            </div>
          )}

          {result?.passed && (
            <div className="ua-grpo-success-panel">
              <span className="ua-step-mark" aria-hidden="true">×</span>
              <p>
                You implemented the core intuition: reward is first designed, then normalized
                relative to the group. The model would increase probability for above-baseline
                traces and decrease or constrain below-baseline traces. This is why reward design
                matters: the model optimizes what you score, not what you merely intended.
              </p>
            </div>
          )}
        </section>

        <section className="ua-grpo-lab-card ua-grpo-experiment-card">
          <div className="ua-grpo-card-head">
            <h3>Experiment after passing</h3>
            <span>{result?.passed ? 'Try reward-design stress tests' : 'Unlocks after checks pass'}</span>
          </div>

          <div className="ua-grpo-experiment-list">
            {EXPERIMENTS.map((experiment) => (
              <article key={experiment.id} className={result?.passed ? '' : 'locked'}>
                <strong>{experiment.title}</strong>
                <p>{experiment.prompt}</p>
                <small>{experiment.question}</small>
                <span>{experiment.failureMode}</span>
                <button
                  type="button"
                  data-math-control
                  disabled={!result?.passed}
                  onClick={() => applyWeights(experiment.weights)}
                >
                  Apply preset
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
