import React, { useEffect, useMemo, useState } from 'react';
import InlineMathText from '../common/InlineMathText';
import AssessmentVisualState from './AssessmentVisualState';
import {
  CODE_LAB_PROGRESS_EVENT,
  readCodeLabProgress,
  summarizeCodeLabProgress,
} from '../../data/codeLabProgress';
import { getLessonAssessment, hasAssessmentContent } from '../../data/lessonAssessments';
import {
  getCompletionStatus,
  getLessonProgress,
  isAssessmentComplete,
  readAssessmentProgress,
  updateLessonProgress,
} from '../../data/learningProgress';
import { getLessonCodeLabExercises } from '../../labs/lesson-code/lessonCodeLabs';

const QUESTIONS_PER_PAGE = 10;
const SCENARIOS_PER_PAGE = 4;

function renderAssessmentTitle(title) {
  if (typeof title !== 'string') return title;

  const separatorIndex = title.indexOf(': ');
  if (separatorIndex >= 0) {
    return (
      <>
        <span className="ua-assessment-title-line">
          <InlineMathText>{title.slice(0, separatorIndex + 2)}</InlineMathText>
        </span>
        <span className="ua-assessment-title-line">
          <InlineMathText>{title.slice(separatorIndex + 2)}</InlineMathText>
        </span>
      </>
    );
  }

  const checkSuffix = /\s+check$/i;
  if (!checkSuffix.test(title)) return <InlineMathText>{title}</InlineMathText>;

  const lessonTitle = title.replace(checkSuffix, '');

  return (
    <>
      <span className="ua-assessment-title-line">
        <InlineMathText>{lessonTitle}</InlineMathText>
      </span>
      <span className="ua-assessment-title-line ua-assessment-title-kicker">
        <InlineMathText>check</InlineMathText>
      </span>
    </>
  );
}

export default function AssessmentPanel({
  lessonId,
  title = 'Lesson check',
  eyebrow = 'Assessment',
  legacyQuestion,
  legacyAnswer,
  legacyExplanation,
}) {
  const assessment = useMemo(() => getLessonAssessment(lessonId), [lessonId]);
  const scenarioItems = assessment.scenarioQuestions || [];
  const quizItems = assessment.quiz || [];
  const reviewItems = assessment.strategyReview || [];
  const codeLabExercises = useMemo(() => getLessonCodeLabExercises(lessonId), [lessonId]);
  const [scenarioPage, setScenarioPage] = useState(0);
  const [quizPage, setQuizPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [revealedReview, setRevealedReview] = useState(() => new Set());
  const [codeLabProgress, setCodeLabProgress] = useState(() => readCodeLabProgress());
  const [lessonProgress, setLessonProgress] = useState(() => (
    getLessonProgress(readAssessmentProgress(), lessonId)
  ));

  useEffect(() => {
    setScenarioPage(0);
    setQuizPage(0);
    setReviewPage(0);
    setShowReview(false);
    setRevealedReview(new Set());
    setLessonProgress(getLessonProgress(readAssessmentProgress(), lessonId));
  }, [lessonId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const refreshProgress = () => setCodeLabProgress(readCodeLabProgress());

    refreshProgress();
    window.addEventListener(CODE_LAB_PROGRESS_EVENT, refreshProgress);

    return () => {
      window.removeEventListener(CODE_LAB_PROGRESS_EVENT, refreshProgress);
    };
  }, [lessonId]);

  const hasStructuredAssessment = hasAssessmentContent(assessment);
  const hasLegacyCheck = Boolean(legacyQuestion && legacyAnswer);

  if (!hasStructuredAssessment && !hasLegacyCheck) return null;

  const complete = isAssessmentComplete(assessment, lessonProgress);
  const completionStatus = getCompletionStatus(assessment, lessonProgress);
  const scenarioPageCount = Math.max(1, Math.ceil(scenarioItems.length / SCENARIOS_PER_PAGE));
  const activeScenarioPage = Math.min(scenarioPage, scenarioPageCount - 1);
  const scenarioPageStart = activeScenarioPage * SCENARIOS_PER_PAGE;
  const pageScenarioItems = scenarioItems.slice(scenarioPageStart, scenarioPageStart + SCENARIOS_PER_PAGE);
  const quizPageCount = Math.max(1, Math.ceil(quizItems.length / QUESTIONS_PER_PAGE));
  const activeQuizPage = Math.min(quizPage, quizPageCount - 1);
  const pageStart = activeQuizPage * QUESTIONS_PER_PAGE;
  const pageQuestions = quizItems.slice(pageStart, pageStart + QUESTIONS_PER_PAGE);
  const reviewPageCount = Math.max(1, Math.ceil(reviewItems.length / QUESTIONS_PER_PAGE));
  const activeReviewPage = Math.min(reviewPage, reviewPageCount - 1);
  const reviewPageStart = activeReviewPage * QUESTIONS_PER_PAGE;
  const pageReviewItems = reviewItems.slice(reviewPageStart, reviewPageStart + QUESTIONS_PER_PAGE);
  const answeredCount = quizItems.filter((question) => lessonProgress.quiz?.[question.id]?.correct === true).length;
  const codeLabSummary = codeLabExercises.length > 0
    ? summarizeCodeLabProgress(lessonId, codeLabExercises, codeLabProgress)
    : null;
  const activeLevel = pageQuestions.find((question) => question.level)?.level;
  const requiredPercent = Math.round(completionStatus.policy.passThreshold * 100);
  const labRequirement = completionStatus.requiredLabCount > 0
    ? ` plus ${completionStatus.requiredLabCount} lab`
    : '';

  const persist = (updater) => {
    const nextProgress = updateLessonProgress(lessonId, assessment, updater);
    setLessonProgress(getLessonProgress(nextProgress, lessonId));
  };

  const handleAnswer = (question, selectedIndex) => {
    persist((current) => ({
      ...current,
      quiz: {
        ...(current.quiz || {}),
        [question.id]: {
          selectedIndex,
          correct: selectedIndex === question.answerIndex,
          revealed: true,
        },
      },
    }));
  };

  const handleReveal = (question) => {
    persist((current) => ({
      ...current,
      quiz: {
        ...(current.quiz || {}),
        [question.id]: {
          ...(current.quiz?.[question.id] || {}),
          correct: current.quiz?.[question.id]?.correct === true,
          revealed: true,
        },
      },
    }));
  };

  const handleLabToggle = (lab) => {
    persist((current) => ({
      ...current,
      labs: {
        ...(current.labs || {}),
        [lab.id]: current.labs?.[lab.id] !== true,
      },
    }));
  };

  const handleLegacyReveal = () => {
    persist((current) => ({
      ...current,
      legacyCheck: { revealed: true },
    }));
  };

  return (
    <section className="ua-assessment-panel" aria-label={title}>
      <div className="ua-assessment-head">
        <span>{eyebrow}</span>
        <h2 aria-label={typeof title === 'string' ? title : undefined}>{renderAssessmentTitle(title)}</h2>
        <p className="ua-assessment-status">
          {complete
            ? 'Completed locally.'
            : `${completionStatus.correctCoreCount}/${completionStatus.requiredQuestionCount} core correct. ${requiredPercent}% core pass${labRequirement} marks completion; the full ${quizItems.length}-question bank is practice.`}
        </p>
        {codeLabSummary && (
          <p className="ua-assessment-code-progress">
            Code lab progress: {codeLabSummary.passedCount}/{codeLabSummary.totalCount} passed locally.
          </p>
        )}
      </div>

      {scenarioItems.length > 0 && (
        <section className="ua-scenario-deck" aria-label="Scenario questions">
          <div className="ua-quiz-kicker">
            <span className="ua-kicker-mark" aria-hidden="true">EXP</span>
            Scenario questions
          </div>
          {scenarioItems.length > SCENARIOS_PER_PAGE && (
            <nav className="ua-assessment-pager" aria-label="Scenario pages">
              <button
                type="button"
                className="ua-pager-button"
                onClick={() => setScenarioPage((value) => Math.max(0, value - 1))}
                disabled={activeScenarioPage === 0}
              >
                ← Prev
              </button>
              <span>
                Scenarios {scenarioPageStart + 1}-{Math.min(scenarioItems.length, scenarioPageStart + pageScenarioItems.length)} of {scenarioItems.length}
              </span>
              <button
                type="button"
                className="ua-pager-button"
                onClick={() => setScenarioPage((value) => Math.min(scenarioPageCount - 1, value + 1))}
                disabled={activeScenarioPage === scenarioPageCount - 1}
              >
                Next →
              </button>
            </nav>
          )}
          {pageScenarioItems.map((question, questionIndex) => {
            const state = lessonProgress.quiz?.[question.id] || {};
            const answered = Number.isInteger(state.selectedIndex);
            const revealed = answered || state.revealed;
            const absoluteScenarioIndex = scenarioPageStart + questionIndex;

            return (
              <article className="ua-quiz-card ua-scenario-card" key={question.id}>
                <div className="ua-quiz-meta">
                  <span className="ua-quiz-kicker">Scenario {absoluteScenarioIndex + 1} of {scenarioItems.length}</span>
                  {question.level && <span className="ua-question-level">{question.level}</span>}
                </div>
                {question.kind === 'visual-state' && <AssessmentVisualState state={question.visualState} />}
                <p className="ua-scenario-text"><InlineMathText>{question.scenario}</InlineMathText></p>
                <h3><InlineMathText>{question.prompt}</InlineMathText></h3>
                <div className="ua-choice-list">
                  {question.choices.map((choice, choiceIndex) => {
                    const selected = state.selectedIndex === choiceIndex;
                    const correct = question.answerIndex === choiceIndex;
                    const tone = revealed && selected
                      ? selected && correct ? 'correct' : 'incorrect'
                      : revealed && correct ? 'answer' : '';

                    return (
                      <button
                        type="button"
                        key={choice}
                        className={`ua-choice-button ${selected ? 'selected' : ''} ${tone}`}
                        onClick={() => handleAnswer(question, choiceIndex)}
                        aria-pressed={selected}
                      >
                        <span>{String.fromCharCode(65 + choiceIndex)}</span>
                        <InlineMathText>{choice}</InlineMathText>
                      </button>
                    );
                  })}
                </div>
                {!revealed && (
                  <button type="button" className="ua-reveal-button" onClick={() => handleReveal(question)}>
                    Reveal answer
                  </button>
                )}
                {revealed && (
                  <div className={`ua-answer-panel ${state.correct ? 'correct' : ''}`}>
                    <strong>
                      {state.correct ? 'Correct.' : (
                        <>Answer: <InlineMathText>{question.choices[question.answerIndex]}</InlineMathText></>
                      )}
                    </strong>
                    <p><InlineMathText>{question.explanation}</InlineMathText></p>
                    {question.misconceptionTested && (
                      <small>Misconception tested: <InlineMathText>{question.misconceptionTested}</InlineMathText></small>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {quizItems.length > QUESTIONS_PER_PAGE && (
        <nav className="ua-assessment-pager" aria-label="Lesson check pages">
          <button
            type="button"
            className="ua-pager-button"
            onClick={() => setQuizPage((value) => Math.max(0, value - 1))}
            disabled={activeQuizPage === 0}
          >
            ← Prev
          </button>
          <div className="ua-page-dots">
            {Array.from({ length: quizPageCount }, (_, index) => (
              <button
                type="button"
                key={index}
                className={index === activeQuizPage ? 'active' : ''}
                onClick={() => setQuizPage(index)}
                aria-current={index === activeQuizPage ? 'page' : undefined}
                title={`Questions ${(index * QUESTIONS_PER_PAGE) + 1}-${Math.min(quizItems.length, (index + 1) * QUESTIONS_PER_PAGE)}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="ua-pager-button"
            onClick={() => setQuizPage((value) => Math.min(quizPageCount - 1, value + 1))}
            disabled={activeQuizPage === quizPageCount - 1}
          >
            Next →
          </button>
        </nav>
      )}

      {quizItems.length > QUESTIONS_PER_PAGE && (
        <div className="ua-assessment-range">
          <span>Questions {pageStart + 1}-{Math.min(quizItems.length, pageStart + pageQuestions.length)} of {quizItems.length}</span>
          {activeLevel && <strong>{activeLevel}</strong>}
        </div>
      )}

      {pageQuestions.map((question, questionIndex) => {
        const state = lessonProgress.quiz?.[question.id] || {};
        const answered = Number.isInteger(state.selectedIndex);
        const revealed = answered || state.revealed;
        const absoluteQuestionIndex = pageStart + questionIndex;

        return (
          <article className="ua-quiz-card" key={question.id}>
            <div className="ua-quiz-meta">
              <span className="ua-quiz-kicker">Question {absoluteQuestionIndex + 1} of {quizItems.length}</span>
              {question.level && <span className="ua-question-level">{question.level}</span>}
              {question.countsForCompletion && <span className="ua-question-level">Core</span>}
            </div>
            <h3><InlineMathText>{question.prompt}</InlineMathText></h3>
            <div className="ua-choice-list">
              {question.choices.map((choice, choiceIndex) => {
                const selected = state.selectedIndex === choiceIndex;
                const correct = question.answerIndex === choiceIndex;
                const tone = revealed && selected
                  ? selected && correct ? 'correct' : 'incorrect'
                  : revealed && correct ? 'answer' : '';

                return (
                  <button
                    type="button"
                    key={choice}
                    className={`ua-choice-button ${selected ? 'selected' : ''} ${tone}`}
                    onClick={() => handleAnswer(question, choiceIndex)}
                    aria-pressed={selected}
                  >
                    <span>{String.fromCharCode(65 + choiceIndex)}</span>
                    <InlineMathText>{choice}</InlineMathText>
                  </button>
                );
              })}
            </div>
            {!revealed && (
              <button type="button" className="ua-reveal-button" onClick={() => handleReveal(question)}>
                Reveal answer
              </button>
            )}
            {revealed && (
              <div className={`ua-answer-panel ${state.correct ? 'correct' : ''}`}>
                <strong>
                  {state.correct ? 'Correct.' : (
                    <>Answer: <InlineMathText>{question.choices[question.answerIndex]}</InlineMathText></>
                  )}
                </strong>
                <p><InlineMathText>{question.explanation}</InlineMathText></p>
              </div>
            )}
          </article>
        );
      })}

      {quizItems.length > QUESTIONS_PER_PAGE && (
        <nav className="ua-assessment-pager bottom" aria-label="Lesson check pages">
          <button
            type="button"
            className="ua-pager-button"
            onClick={() => setQuizPage((value) => Math.max(0, value - 1))}
            disabled={activeQuizPage === 0}
          >
            ← Prev
          </button>
          <span>Page {activeQuizPage + 1} of {quizPageCount}</span>
          <button
            type="button"
            className="ua-pager-button"
            onClick={() => setQuizPage((value) => Math.min(quizPageCount - 1, value + 1))}
            disabled={activeQuizPage === quizPageCount - 1}
          >
            Next →
          </button>
        </nav>
      )}

      {assessment.labs?.length > 0 && (
        <div className="ua-lab-list">
          <div className="ua-quiz-kicker">
            <span className="ua-kicker-mark" aria-hidden="true">LAB</span>
            Practice labs
          </div>
          {assessment.labs.map((lab) => {
            const done = lessonProgress.labs?.[lab.id] === true;

            return (
              <button
                type="button"
                key={lab.id}
                className={`ua-lab-card ${done ? 'done' : ''}`}
                onClick={() => handleLabToggle(lab)}
                role="checkbox"
                aria-checked={done}
              >
                <span className="ua-lab-check" aria-hidden="true">{done ? '×' : ''}</span>
                <span>
                  <strong>{lab.title}</strong>
                  <em>{lab.prompt}</em>
                  <small>{lab.successCriteria}</small>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {reviewItems.length > 0 && (
        <section className="ua-review-deck" aria-label="Optional interview review">
          <button
            type="button"
            className="ua-review-toggle"
            onClick={() => setShowReview((value) => !value)}
            aria-expanded={showReview}
          >
            <span className="ua-kicker-mark" aria-hidden="true">§</span>
            Optional Interview Review
            <span>{reviewItems.length} strategy prompts</span>
          </button>

          {showReview && (
            <>
              {reviewItems.length > QUESTIONS_PER_PAGE && (
                <nav className="ua-assessment-pager" aria-label="Interview review pages">
                  <button
                    type="button"
                    className="ua-pager-button"
                    onClick={() => setReviewPage((value) => Math.max(0, value - 1))}
                    disabled={activeReviewPage === 0}
                  >
                    ← Prev
                  </button>
                  <span>Review {reviewPageStart + 1}-{Math.min(reviewItems.length, reviewPageStart + pageReviewItems.length)} of {reviewItems.length}</span>
                  <button
                    type="button"
                    className="ua-pager-button"
                    onClick={() => setReviewPage((value) => Math.min(reviewPageCount - 1, value + 1))}
                    disabled={activeReviewPage === reviewPageCount - 1}
                  >
                    Next →
                  </button>
                </nav>
              )}

              {pageReviewItems.map((question, questionIndex) => {
                const reviewKey = `${question.id}-${reviewPageStart + questionIndex}`;
                const revealed = revealedReview.has(reviewKey);

                return (
                  <article className="ua-quiz-card ua-review-card" key={question.id}>
                    <div className="ua-quiz-meta">
                      <span className="ua-quiz-kicker">Review {reviewPageStart + questionIndex + 1}</span>
                      {question.level && <span className="ua-question-level">{question.level}</span>}
                    </div>
                    <h3><InlineMathText>{question.prompt}</InlineMathText></h3>
                    <div className="ua-choice-list">
                      {question.choices.map((choice, choiceIndex) => (
                        <div
                          key={choice}
                          className={`ua-choice-button ${revealed && choiceIndex === question.answerIndex ? 'answer' : ''}`}
                        >
                          <span>{String.fromCharCode(65 + choiceIndex)}</span>
                          <InlineMathText>{choice}</InlineMathText>
                        </div>
                      ))}
                    </div>
                    {!revealed && (
                      <button
                        type="button"
                        className="ua-reveal-button ua-review-reveal"
                        onClick={() => setRevealedReview((current) => new Set(current).add(reviewKey))}
                      >
                        Reveal answer
                      </button>
                    )}
                    {revealed && (
                      <div className="ua-answer-panel correct">
                        <strong>Review answer: <InlineMathText>{question.choices[question.answerIndex]}</InlineMathText></strong>
                        <p><InlineMathText>{question.explanation}</InlineMathText></p>
                      </div>
                    )}
                  </article>
                );
              })}
            </>
          )}
        </section>
      )}

      {!hasStructuredAssessment && hasLegacyCheck && (
        <article className="ua-quiz-card">
          <div className="ua-quiz-kicker">Check yourself</div>
          <h3><InlineMathText>{legacyQuestion}</InlineMathText></h3>
          {!lessonProgress.legacyCheck?.revealed && (
            <button type="button" className="ua-reveal-button" onClick={handleLegacyReveal}>
              Reveal answer
            </button>
          )}
          {lessonProgress.legacyCheck?.revealed && (
            <div className="ua-answer-panel correct">
              <strong><InlineMathText>{legacyAnswer}</InlineMathText></strong>
              {legacyExplanation && <p><InlineMathText>{legacyExplanation}</InlineMathText></p>}
            </div>
          )}
        </article>
      )}
    </section>
  );
}
