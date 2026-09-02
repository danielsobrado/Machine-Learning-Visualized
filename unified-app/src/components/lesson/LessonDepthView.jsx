import React from 'react';
import { Link } from 'react-router-dom';
import { allAnimations } from '../../data/animations';

function DepthList({ title, items }) {
  if (!items?.length) return null;

  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function LessonLinks({ lessonIds }) {
  if (!lessonIds?.length) return null;

  const lessons = lessonIds
    .map((lessonId) => allAnimations.find((animation) => animation.id === lessonId))
    .filter(Boolean)
    .slice(0, 4);

  if (!lessons.length) return null;

  return (
    <div>
      <h4>Related lessons</h4>
      <div className="ua-depth-link-list">
        {lessons.map((lesson) => (
          <Link key={lesson.id} to={`/animation/${lesson.id}`}>{lesson.name}</Link>
        ))}
      </div>
    </div>
  );
}

function ComparisonCards({ comparisons }) {
  if (!comparisons?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Concept comparisons">
      <div className="ua-depth-panel-head"><i className="ua-depth-plate" aria-hidden="true">A</i><span>Concept comparisons</span></div>
      <div className="ua-depth-grid">
        {comparisons.map((comparison) => (
          <article key={comparison.id} className="ua-depth-card ua-comparison-card">
            <span>{comparison.title}</span>
            <div><strong>{comparison.left}</strong><p>{comparison.leftSummary}</p></div>
            <div><strong>{comparison.right}</strong><p>{comparison.rightSummary}</p></div>
            {comparison.whenToUseLeft && <p><b>Use {comparison.left} when:</b> {comparison.whenToUseLeft}</p>}
            {comparison.whenToUseRight && <p><b>Use {comparison.right} when:</b> {comparison.whenToUseRight}</p>}
            <p><b>Common mistake:</b> {comparison.commonMistake}</p>
            {comparison.failureIfConfused && <p><b>If confused:</b> {comparison.failureIfConfused}</p>}
            <p><b>Diagnostic:</b> {comparison.diagnostic}</p>
            {comparison.tinyScenario && <p><b>Tiny scenario:</b> {comparison.tinyScenario}</p>}
            <LessonLinks lessonIds={comparison.lessonLinks || comparison.lessonIds} />
          </article>
        ))}
      </div>
    </section>
  );
}

function CaveatCards({ caveats }) {
  if (!caveats?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Caveats and boundaries">
      <div className="ua-depth-panel-head"><i className="ua-depth-plate" aria-hidden="true">B</i><span>What this does not solve</span></div>
      <div className="ua-depth-grid">
        {caveats.map((caveat) => {
          const toyModel = caveat.toyModel || {};
          return (
            <article key={caveat.id} className="ua-depth-card">
              <DepthList title="Solves" items={caveat.solves} />
              <DepthList title="Does not solve" items={caveat.doesNotSolve} />
              <DepthList title="Can go wrong" items={caveat.canGoWrong} />
              {(toyModel.toyFormula || caveat.toyFormula) && <p><b>Toy formula:</b> {toyModel.toyFormula || caveat.toyFormula}</p>}
              <DepthList title="What is simplified" items={toyModel.whatIsSimplified || caveat.whatIsSimplified || caveat.proxyMetrics} />
              <DepthList title="What still holds" items={toyModel.whatStillHolds || caveat.whatStillHolds} />
              <DepthList title="Production reality" items={toyModel.whatWouldChangeInProduction || caveat.productionReality} />
              <DepthList title="How to test it" items={caveat.howToTest} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FailureCards({ failures }) {
  if (!failures?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Failure gallery">
      <div className="ua-depth-panel-head"><i className="ua-depth-plate" aria-hidden="true">C</i><span>Failure gallery</span></div>
      <div className="ua-depth-grid">
        {failures.map((failure) => (
          <article key={failure.id} className="ua-depth-card">
            <span>{failure.track}</span>
            <h3>{failure.title}</h3>
            {(failure.severity || failure.learnerLevel) && <p><b>Signal:</b> {[failure.severity, failure.learnerLevel].filter(Boolean).join(' / ')}</p>}
            {failure.minimalScenario && <p><b>Minimal scenario:</b> {failure.minimalScenario}</p>}
            <p><b>Symptom:</b> {failure.symptom}</p>
            <p><b>Why:</b> {failure.whyItHappens}</p>
            <p><b>Detect:</b> {failure.howToDetect}</p>
            <p><b>Fix:</b> {failure.howToFix}</p>
            {failure.falseFix && <p><b>False fix:</b> {failure.falseFix}</p>}
            {failure.tryInLesson?.lessonId && (
              <p><b>Try in lesson:</b> <Link to={`/animation/${failure.tryInLesson.lessonId}`}>{failure.tryInLesson.control || failure.tryInLesson.lessonId}</Link></p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function PaperSignals({ signals }) {
  if (!signals?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Paper reading mode">
      <div className="ua-depth-panel-head"><i className="ua-depth-plate" aria-hidden="true">D</i><span>Paper-reading mode</span></div>
      <div className="ua-depth-grid">
        {signals.map((signal) => (
          <article key={signal.id} className="ua-depth-card">
            <span>When a paper says</span>
            <h3>{signal.phrase}</h3>
            {(signal.sourceType || signal.sourceName || signal.sourceYear) && <p><b>Provenance:</b> {[signal.sourceType, signal.sourceName, signal.sourceYear].filter(Boolean).join(' / ')}</p>}
            {(signal.claimStatus || signal.freshnessDate || signal.confidence) && <p><b>Claim status:</b> {[signal.claimStatus, signal.freshnessDate, signal.confidence].filter(Boolean).join(' / ')}</p>}
            <DepthList title="Ask" items={signal.ask} />
            <p><b>Means:</b> {signal.means}</p>
            <p><b>Does not mean:</b> {signal.doesNotMean}</p>
            <DepthList title="Check" items={signal.check} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function hasLessonDepth(depth) {
  return Boolean(depth && [depth.comparisons, depth.failures, depth.paperSignals, depth.caveats].some((items) => items?.length));
}

export default function LessonDepthView({ depth }) {
  if (!hasLessonDepth(depth)) {
    return (
      <section className="ds-panel ua-placeholder">
        <div className="ds-panel-body">
          <h2>Deep Dive</h2>
          <p>No deep-dive material is registered for this lesson yet.</p>
        </div>
      </section>
    );
  }

  return (
    <div className="ua-curriculum-depth">
      <ComparisonCards comparisons={depth.comparisons} />
      <CaveatCards caveats={depth.caveats} />
      <FailureCards failures={depth.failures} />
      <PaperSignals signals={depth.paperSignals} />
    </div>
  );
}
