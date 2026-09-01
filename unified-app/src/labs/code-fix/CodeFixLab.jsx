import React from 'react';
import {
  CODE_LAB_PROGRESS_EVENT,
  exportCodeLabProgressJson,
  importCodeLabProgressJson,
  markCodeLabExercisePassed,
  readCodeLabProgress,
  summarizeCodeLabProgress,
} from '../../data/codeLabProgress';
import { runJavaScriptExercise } from './jsWorkerRunner';

function statusForResults(results, error) {
  if (error) return 'error';
  if (!results?.length) return 'idle';
  return results.every((result) => result.passed) ? 'passed' : 'failed';
}

function formatValue(value) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

const JS_TOKEN_PATTERN = /(\/\/.*|\/\*[\s\S]*?\*\/|(["'`])(?:\\.|(?!\2)[^\\])*\2|\b(?:const|let|var|function|return|if|else|for|while|new|throw|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_$][\w$]*(?=\s*\())/g;

function highlightJavaScript(code) {
  const parts = [];
  let cursor = 0;

  for (const match of code.matchAll(JS_TOKEN_PATTERN)) {
    if (match.index > cursor) {
      parts.push(code.slice(cursor, match.index));
    }

    const token = match[0];
    let tokenClass = 'plain';
    if (token.startsWith('//') || token.startsWith('/*')) tokenClass = 'comment';
    else if (/^["'`]/.test(token)) tokenClass = 'string';
    else if (/^\d/.test(token)) tokenClass = 'number';
    else if (/^(const|let|var|function|return|if|else|for|while|new|throw|true|false|null|undefined)$/.test(token)) tokenClass = 'keyword';
    else tokenClass = 'call';

    parts.push(
      <span key={`${match.index}-${token}`} className={`ua-code-token-${tokenClass}`}>
        {token}
      </span>,
    );
    cursor = match.index + token.length;
  }

  if (cursor < code.length) {
    parts.push(code.slice(cursor));
  }

  return parts;
}

export default function CodeFixLab({ exercises, progressScopeId, onProgressChange }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeExercise = exercises[activeIndex];
  const highlightRef = React.useRef(null);
  const importInputRef = React.useRef(null);

  const [codeById, setCodeById] = React.useState(() => (
    Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.starterCode]))
  ));
  const [hintLevelById, setHintLevelById] = React.useState({});
  const [resultById, setResultById] = React.useState({});
  const [persistedProgress, setPersistedProgress] = React.useState(() => (
    progressScopeId ? readCodeLabProgress() : {}
  ));
  const [progressMessage, setProgressMessage] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const exitExpanded = React.useCallback(() => setExpanded(false), []);

  const code = codeById[activeExercise.id];
  const currentResult = resultById[activeExercise.id];
  const progressSummary = React.useMemo(() => (
    progressScopeId
      ? summarizeCodeLabProgress(progressScopeId, exercises, persistedProgress)
      : null
  ), [exercises, persistedProgress, progressScopeId]);
  const statusForExercise = React.useCallback((exercise) => {
    const result = resultById[exercise.id];
    const runtimeStatus = statusForResults(result?.results, result?.error);

    if (runtimeStatus !== 'idle') return runtimeStatus;
    if (progressScopeId && progressSummary?.passedIds.has(exercise.id)) return 'passed';
    return 'idle';
  }, [progressScopeId, progressSummary, resultById]);
  const status = statusForExercise(activeExercise);
  const hintLevel = hintLevelById[activeExercise.id] || 0;
  const visibleHints = activeExercise.hints.slice(0, hintLevel);
  const canRevealSolution = Boolean(currentResult || hintLevel > 0);
  const exerciseGroups = React.useMemo(() => {
    const groups = [];

    exercises.forEach((exercise, index) => {
      const groupName = exercise.group || 'Exercises';
      const lastGroup = groups[groups.length - 1];

      if (lastGroup?.name === groupName) {
        lastGroup.items.push({ exercise, index });
        return;
      }

      groups.push({
        name: groupName,
        items: [{ exercise, index }],
      });
    });

    return groups;
  }, [exercises]);

  React.useEffect(() => {
    setExpanded(false);
  }, [progressScopeId]);

  React.useEffect(() => {
    if (!expanded || typeof document === 'undefined') return undefined;

    const syncMainOffset = () => {
      const main = document.querySelector('.ua-main');
      const left = main?.getBoundingClientRect().left ?? 0;
      document.documentElement.style.setProperty('--ua-code-lab-expand-left', `${left}px`);
    };

    document.documentElement.classList.add('ua-code-lab-expanded');
    syncMainOffset();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', syncMainOffset);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', syncMainOffset);
      document.documentElement.classList.remove('ua-code-lab-expanded');
      document.documentElement.style.removeProperty('--ua-code-lab-expand-left');
    };
  }, [expanded]);

  React.useEffect(() => {
    if (!progressScopeId || typeof window === 'undefined') return undefined;

    const refreshProgress = () => setPersistedProgress(readCodeLabProgress());
    refreshProgress();
    window.addEventListener(CODE_LAB_PROGRESS_EVENT, refreshProgress);

    return () => {
      window.removeEventListener(CODE_LAB_PROGRESS_EVENT, refreshProgress);
    };
  }, [progressScopeId]);

  React.useEffect(() => {
    if (!progressSummary || !onProgressChange) return;
    onProgressChange(progressSummary);
  }, [onProgressChange, progressSummary]);

  async function runTests() {
    setRunning(true);
    setShowSolution(false);

    const runResult = await runJavaScriptExercise({
      userCode: code,
      testCode: activeExercise.testCode,
    });

    setResultById((previous) => ({
      ...previous,
      [activeExercise.id]: runResult,
    }));

    const passed = runResult.results?.length && runResult.results.every((check) => check.passed);

    if (passed && progressScopeId) {
      const nextProgress = markCodeLabExercisePassed({
        scopeId: progressScopeId,
        exerciseId: activeExercise.id,
        checkCount: runResult.results.length,
      });
      setPersistedProgress(nextProgress);
      setProgressMessage('Progress saved locally.');
    }

    setRunning(false);
  }

  function resetExercise() {
    setCodeById((previous) => ({
      ...previous,
      [activeExercise.id]: activeExercise.starterCode,
    }));
    setResultById((previous) => ({
      ...previous,
      [activeExercise.id]: null,
    }));
    setHintLevelById((previous) => ({
      ...previous,
      [activeExercise.id]: 0,
    }));
    setShowSolution(false);
  }

  function showNextHint() {
    setHintLevelById((previous) => ({
      ...previous,
      [activeExercise.id]: Math.min(activeExercise.hints.length, hintLevel + 1),
    }));
  }

  function applySolution() {
    setCodeById((previous) => ({
      ...previous,
      [activeExercise.id]: activeExercise.solution,
    }));
    setShowSolution(false);
  }

  function syncHighlightScroll(event) {
    if (!highlightRef.current) return;
    highlightRef.current.scrollTop = event.currentTarget.scrollTop;
    highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
  }

  function exportProgress() {
    const blob = new Blob([exportCodeLabProgressJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ml-animations-code-lab-progress.json';
    link.click();
    URL.revokeObjectURL(url);
    setProgressMessage('Progress JSON exported.');
  }

  async function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const nextProgress = importCodeLabProgressJson(await file.text());
      setPersistedProgress(nextProgress);
      setProgressMessage('Progress JSON imported.');
    } catch {
      setProgressMessage('Import failed. Choose a valid progress JSON file.');
    } finally {
      event.target.value = '';
    }
  }

  const localPassedCount = Object.values(resultById).filter((result) => (
    result?.results?.length && result.results.every((check) => check.passed)
  )).length;
  const passedCount = progressSummary ? progressSummary.passedCount : localPassedCount;

  return (
    <section className={['ua-codefix-lab', expanded && 'ua-codefix-lab--expanded'].filter(Boolean).join(' ')}>
      <div className="ua-codefix-toolbar">
        {expanded ? (
          <button
            type="button"
            className="ua-map-expand-back"
            onClick={exitExpanded}
            aria-label="Exit big screen mode"
          >
            <span>← Back</span>
          </button>
        ) : null}
        <div className="ua-codefix-toolbar-title">
          <span>Code lab</span>
        </div>
        {expanded ? (
          <span className="ua-map-expand-esc">Esc to exit</span>
        ) : (
          <button
            type="button"
            className="ua-map-expand-toggle"
            onClick={() => setExpanded(true)}
            aria-label="Open code lab in big screen mode"
          >
            <span>Big screen ↗</span>
          </button>
        )}
      </div>

      <div className="ua-codefix-head">
        <span>Code Completion-style lab</span>
        <h2>Fix the TODOs, run the tests</h2>
        <p>
          Each exercise is almost complete. Change the smallest piece of code needed
          to make the tests pass.
        </p>
        <div className="ua-codefix-persistence">
          <strong>Passed {passedCount}/{exercises.length} locally</strong>
          {progressScopeId && (
            <div className="ua-codefix-persistence-actions">
              <button type="button" onClick={exportProgress}>
                Export progress ↓
              </button>
              <button type="button" onClick={() => importInputRef.current?.click()}>
                Import progress ↑
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                onChange={importProgress}
                hidden
              />
            </div>
          )}
          {progressMessage && <small>{progressMessage}</small>}
        </div>
      </div>

      <div className="ua-codefix-progress">
        {exerciseGroups.map((group) => {
          const passedInGroup = group.items.filter(({ exercise }) => {
            return statusForExercise(exercise) === 'passed';
          }).length;

          return (
            <div className="ua-codefix-progress-group" key={group.name}>
              <div className="ua-codefix-progress-label">
                <strong>{group.name}</strong>
                <span>{passedInGroup}/{group.items.length}</span>
              </div>

              <div className="ua-codefix-progress-steps">
                {group.items.map(({ exercise, index }) => {
                  const exerciseStatus = statusForExercise(exercise);

                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => {
                        setActiveIndex(index);
                        setShowSolution(false);
                      }}
                      className={`ua-codefix-step ${index === activeIndex ? 'active' : ''} ${exerciseStatus}`}
                    >
                      <span className="ua-lab-check" aria-hidden="true">{exerciseStatus === 'passed' ? '×' : ''}</span>
                      <span>{exercise.stepLabel || `${index + 1}.`} {exercise.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ua-codefix-grid">
        <article className="ua-codefix-card ua-codefix-instructions">
          <span>{activeExercise.difficulty}</span>
          <h3>{activeExercise.title}</h3>
          <p>{activeExercise.objective}</p>

          <div className="ua-codefix-concept">
            <strong>Concept</strong>
            <p>{activeExercise.concept}</p>
          </div>

          <div className="ua-codefix-explanation">
            <strong>After you pass</strong>
            <p>{activeExercise.explanation}</p>
          </div>
        </article>

        <article className="ua-codefix-card ua-codefix-editor-card">
          <div className="ua-codefix-card-head">
            <div>
              <span>Editor</span>
              <h3>Complete the TODO</h3>
            </div>
            <button type="button" onClick={resetExercise}>
              Reset
            </button>
          </div>

          <div className="ua-codefix-editor-shell">
            <pre className="ua-codefix-highlight" aria-hidden="true" ref={highlightRef}>
              {highlightJavaScript(code)}
            </pre>
            <textarea
              className="ua-codefix-editor"
              value={code}
              spellCheck={false}
              aria-label={`${activeExercise.title} code editor`}
              onScroll={syncHighlightScroll}
              onChange={(event) => setCodeById((previous) => ({
                ...previous,
                [activeExercise.id]: event.target.value,
              }))}
            />
          </div>

          <div className="ua-codefix-actions">
            <button type="button" onClick={runTests} disabled={running}>
              {running ? 'Running...' : 'Run tests'}
            </button>
            <button type="button" onClick={showNextHint} disabled={hintLevel >= activeExercise.hints.length}>
              {hintLevel === 0 ? 'Show hint' : 'Next hint'}
            </button>
            <button
              type="button"
              onClick={() => setShowSolution((value) => !value)}
              disabled={!canRevealSolution}
              title={canRevealSolution ? undefined : 'Run tests or use a hint before revealing the solution.'}
            >
              {showSolution ? 'Hide solution' : canRevealSolution ? 'See solution' : 'Try first'}
            </button>
          </div>
        </article>

        <article className="ua-codefix-card ua-codefix-feedback">
          <span>Checks</span>
          <h3>
            {status === 'passed' && 'All tests passed'}
            {status === 'failed' && 'Keep going'}
            {status === 'error' && 'Code error'}
            {status === 'idle' && 'Run tests to begin'}
          </h3>

          {currentResult?.error && (
            <pre className="ua-codefix-error">{currentResult.error}</pre>
          )}

          {currentResult?.results?.length > 0 ? (
            <ul className="ua-codefix-checks">
              {currentResult.results.map((check) => (
                <li key={check.name} className={check.passed ? 'passed' : 'failed'}>
                  <strong>{check.passed ? 'Pass' : 'Fail'}: {check.name}</strong>
                  {!check.passed && (
                    <small>
                      Expected {formatValue(check.expected)}, got {formatValue(check.actual)}
                    </small>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="ua-codefix-empty">
              Run the tests. If one fails, use the smallest hint that helps.
            </p>
          )}

          {visibleHints.length > 0 && (
            <div className="ua-codefix-hints">
              <strong>Hints</strong>
              {visibleHints.map((hint, index) => (
                hint.includes('\n') ? (
                  <div key={hint} className="ua-codefix-hint">
                    <b>Hint {index + 1}:</b>
                    <pre className="ua-codefix-hint-code">{hint}</pre>
                  </div>
                ) : (
                  <p key={hint}>
                    <b>Hint {index + 1}:</b> {hint}
                  </p>
                )
              ))}
            </div>
          )}

          {showSolution && (
            <div className="ua-codefix-solution">
              <strong>Solution</strong>
              <pre>{activeExercise.solution}</pre>
              <button type="button" onClick={applySolution}>
                Apply solution to editor
              </button>
            </div>
          )}
        </article>
      </div>

      <div className="ua-codefix-footer">
        <strong>{passedCount} / {exercises.length}</strong>
        <span>exercises passed</span>
      </div>
    </section>
  );
}
