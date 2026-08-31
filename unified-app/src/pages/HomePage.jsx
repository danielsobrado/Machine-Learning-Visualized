import React from 'react';
import { Link } from 'react-router-dom';
import ConceptSketch from '../components/catalog/ConceptSketch';
import { allAnimations, categories, curriculumBacklog, curriculumTracks } from '../data/animations';
import { formatLessonCatalogNumber } from '../data/lessonCatalogNumbers';
import { HUB_LEARNING_PATHS } from '../data/learningPaths';
import { LEARNING_PROGRESS_EVENT, readCompletedLessons } from '../data/learningProgress';

const MAP_WINDOW = 12;

function ProgressRule({ completed, total }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="ua-progress-rule" aria-label={`${completed} of ${total} complete`}>
      <span className="ua-progress-rule-count">{completed} / {total}</span>
      <span className="ua-progress-rule-line" aria-hidden="true"><i style={{ width: `${percent}%` }} /></span>
      <span>{percent}%</span>
    </div>
  );
}

export default function HomePage() {
  const totalAnimations = categories.reduce((sum, category) => sum + category.items.length, 0);
  const [activePathId, setActivePathId] = React.useState(HUB_LEARNING_PATHS[0].id);
  const [showCompleted, setShowCompleted] = React.useState(true);
  const [showEntireMap, setShowEntireMap] = React.useState(false);
  const [completedLessons, setCompletedLessons] = React.useState(() => readCompletedLessons());
  const animationById = React.useMemo(() => new Map(allAnimations.map((item) => [item.id, item])), []);
  const activePath = HUB_LEARNING_PATHS.find((path) => path.id === activePathId) || HUB_LEARNING_PATHS[0];
  const getPathProgress = React.useCallback((path) => {
    const completedCount = path.nodes.filter((id) => completedLessons.has(id)).length;
    const nextIndex = path.nodes.findIndex((id) => !completedLessons.has(id));
    const resolvedIndex = nextIndex < 0 ? Math.max(0, path.nodes.length - 1) : nextIndex;
    return {
      completedCount,
      totalCount: path.nodes.length,
      nextIndex: resolvedIndex,
      nextAnimation: animationById.get(path.nodes[resolvedIndex]),
    };
  }, [animationById, completedLessons]);
  const activePathProgress = getPathProgress(activePath);
  const backlogByTrack = curriculumBacklog.reduce((acc, topic) => {
    acc[topic.trackId] = [...(acc[topic.trackId] || []), topic];
    return acc;
  }, {});
  const compactStart = Math.max(0, activePathProgress.nextIndex - 3);
  const visiblePathNodes = showEntireMap ? activePath.nodes : activePath.nodes.slice(compactStart, compactStart + MAP_WINDOW);

  React.useEffect(() => {
    const updateCompletedLessons = () => setCompletedLessons(readCompletedLessons());
    window.addEventListener(LEARNING_PROGRESS_EVENT, updateCompletedLessons);
    window.addEventListener('storage', updateCompletedLessons);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, updateCompletedLessons);
      window.removeEventListener('storage', updateCompletedLessons);
    };
  }, []);

  return (
    <div className="ua-home">
      <section className="ua-home-hero">
        <div className="ua-home-folio"><span>Machine Learning Visualized</span><span>Index / {totalAnimations} experiments</span></div>
        <h1 className="ua-home-title">Machine learning,<br />built so you can <em>see it</em>.</h1>
        <p className="ua-home-subtitle">
          Interactive experiments covering the mathematics, models, and systems behind modern machine learning.
          Read it as a syllabus; use it as a laboratory notebook.
        </p>
        <div className="ua-hero-notation" aria-hidden="true">
          <ConceptSketch animation={{ id: 'linear-regression' }} label="Regression sketch" />
          <span>observations → model → prediction</span>
        </div>
      </section>

      {activePathProgress.nextAnimation && (
        <section className="ua-home-continue" aria-labelledby="continue-title">
          <span className="ua-home-section-label">Continue</span>
          <span className="ua-home-continue-number">{String(activePathProgress.nextIndex + 1).padStart(3, '0')}</span>
          <div>
            <h2 id="continue-title">{activePathProgress.nextAnimation.name}</h2>
            <p>{activePathProgress.nextAnimation.description}</p>
            <ProgressRule completed={activePathProgress.completedCount} total={activePathProgress.totalCount} />
          </div>
          <Link to={`/animation/${activePathProgress.nextAnimation.id}`}>Continue →</Link>
        </section>
      )}

      <section className="ua-tracks" aria-labelledby="curriculum-title">
        <header className="ua-editorial-head">
          <span className="ua-home-section-label">The curriculum</span>
          <h2 id="curriculum-title">A working syllabus</h2>
          <p>Chapters are ordered for study. Individual experiments remain useful as reference notes.</p>
        </header>
        <div className="ua-chapter-list">
          {curriculumTracks.map((track, trackIndex) => {
            const plannedTopics = backlogByTrack[track.id] || [];
            const completedCount = track.animationIds.filter((id) => completedLessons.has(id)).length;
            const nextAnimation = animationById.get(track.animationIds.find((id) => !completedLessons.has(id)) || track.animationIds[0]);
            const sequence = track.animationIds.map((id) => animationById.get(id)?.name).filter(Boolean).slice(0, 6);
            return (
              <article className="ua-chapter-row" key={track.id}>
                <div className="ua-chapter-number">{String(trackIndex + 1).padStart(2, '0')}</div>
                <div className="ua-chapter-copy">
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                  <div className="ua-chapter-sequence" aria-label={`${track.title} sequence`}>
                    {sequence.map((name, index) => <React.Fragment key={name}><span>{name}</span>{index < sequence.length - 1 && <b aria-hidden="true">→</b>}</React.Fragment>)}
                  </div>
                  <div className="ua-chapter-status">
                    <ProgressRule completed={completedCount} total={track.animationIds.length} />
                    <span>{track.animationIds.length} lessons · {plannedTopics.length} field notes planned</span>
                  </div>
                </div>
                <ConceptSketch animation={nextAnimation} label={track.title} />
                {nextAnimation && <Link className="ua-chapter-link" to={`/animation/${nextAnimation.id}`}>{completedCount > 0 ? 'Continue' : 'Begin'} →</Link>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="ua-knowledge-map" aria-labelledby="knowledge-map-title">
        <header className="ua-editorial-head">
          <span className="ua-home-section-label">Knowledge map</span>
          <h2 id="knowledge-map-title">Prerequisites and next steps</h2>
          <p>{activePath.description}</p>
        </header>
        <div className="ua-map-toolbar">
          <div className="ua-path-picker" role="tablist" aria-label="Learning path">
            {HUB_LEARNING_PATHS.map((path) => (
              <button key={path.id} type="button" className={path.id === activePath.id ? 'active' : ''} onClick={() => setActivePathId(path.id)} role="tab" aria-selected={path.id === activePath.id}>
                {path.label} <small>{getPathProgress(path).completedCount}/{path.nodes.length}</small>
              </button>
            ))}
          </div>
          <div className="ua-map-options" aria-label="Knowledge map display">
            <button type="button" className="active">Show prerequisites</button>
            <button type="button" className={showCompleted ? 'active' : ''} onClick={() => setShowCompleted((value) => !value)}>Show completed</button>
            <button type="button" className={showEntireMap ? 'active' : ''} onClick={() => setShowEntireMap((value) => !value)}>Show entire map</button>
          </div>
        </div>
        <div className="ua-knowledge-chain" aria-label={`${activePath.label} concept chain`}>
          {visiblePathNodes.map((animationId, visibleIndex) => {
            const animation = animationById.get(animationId);
            const absoluteIndex = activePath.nodes.indexOf(animationId);
            const isComplete = completedLessons.has(animationId);
            if (!animation) return null;
            return (
              <React.Fragment key={animation.id}>
                <Link className={`ua-knowledge-node ${isComplete && showCompleted ? 'is-complete' : ''} ${absoluteIndex === activePathProgress.nextIndex ? 'is-next' : ''}`} to={`/animation/${animation.id}`}>
                  <span>{String(absoluteIndex + 1).padStart(2, '0')}</span><strong>{animation.name}</strong><small>{isComplete && showCompleted ? 'complete' : animation.categoryName}</small>
                </Link>
                {visibleIndex < visiblePathNodes.length - 1 && <i className="ua-knowledge-edge" aria-hidden="true">→</i>}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      <div className="ua-toc" aria-label="Complete experiment index">
        <header className="ua-editorial-head ua-catalog-head">
          <span className="ua-home-section-label">Reference index</span><h2>Every experiment</h2><p>Browse by subject when you need a specific model, mechanism, or mathematical tool.</p>
        </header>
        {categories.map((category, categoryIndex) => (
          <section className="ua-toc-section" key={category.id}>
            <div className="ua-toc-head"><span>{String(categoryIndex + 1).padStart(2, '0')}</span><h2>{category.name}</h2><small>{category.items.length} entries</small></div>
            <div className="ua-toc-list">
              {category.items.map((item, itemIndex) => (
                <Link className="ua-toc-item" key={item.id} to={`/animation/${item.id}`}>
                  <span className="ua-toc-num">{formatLessonCatalogNumber(categoryIndex, itemIndex)}</span>
                  <span className="ua-toc-title">{item.name}</span><span className="ua-toc-desc">{item.description}</span>
                  <ConceptSketch animation={{ ...item, categoryId: category.id }} label={item.name} /><span className="ua-toc-open">Open ↗</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
