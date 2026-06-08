import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { allAnimations, categories, curriculumBacklog, curriculumTracks } from '../data/animations';
import { formatLessonCatalogNumber } from '../data/lessonCatalogNumbers';
import { HUB_LEARNING_PATHS } from '../data/learningPaths';
import { LEARNING_PROGRESS_EVENT, readCompletedLessons } from '../data/learningProgress';

export default function HomePage() {
  const totalAnimations = categories.reduce((sum, category) => sum + category.items.length, 0);
  const [assessmentStats, setAssessmentStats] = React.useState({
    totalLabs: 0,
    totalQuizQuestions: 0,
  });
  const [activePathId, setActivePathId] = React.useState(HUB_LEARNING_PATHS[0].id);
  const [completedLessons, setCompletedLessons] = React.useState(() => readCompletedLessons());
  const animationById = React.useMemo(
    () => new Map(allAnimations.map((animation) => [animation.id, animation])),
    [],
  );
  const activePath = HUB_LEARNING_PATHS.find((path) => path.id === activePathId) || HUB_LEARNING_PATHS[0];
  const getPathProgress = React.useCallback((path) => {
    const completedCount = path.nodes.filter((id) => completedLessons.has(id)).length;
    const nextId = path.nodes.find((id) => !completedLessons.has(id));
    return {
      completedCount,
      totalCount: path.nodes.length,
      percent: path.nodes.length ? Math.round((completedCount / path.nodes.length) * 100) : 0,
      nextAnimation: nextId ? animationById.get(nextId) : animationById.get(path.nodes.at(-1)),
    };
  }, [animationById, completedLessons]);
  const activePathProgress = getPathProgress(activePath);
  const backlogByTrack = curriculumBacklog.reduce((acc, topic) => {
    acc[topic.trackId] = [...(acc[topic.trackId] || []), topic];
    return acc;
  }, {});

  React.useEffect(() => {
    const updateCompletedLessons = () => setCompletedLessons(readCompletedLessons());
    window.addEventListener(LEARNING_PROGRESS_EVENT, updateCompletedLessons);
    window.addEventListener('storage', updateCompletedLessons);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, updateCompletedLessons);
      window.removeEventListener('storage', updateCompletedLessons);
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    import('../data/lessonAssessments').then(({ getAssessmentStats, lessonAssessments }) => {
      if (!cancelled) setAssessmentStats(getAssessmentStats(lessonAssessments));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ua-home">
      <section className="ua-home-hero">
        <div className="ua-home-eyebrow">
          <span>Catalog</span>
          <span className="sep">/</span>
          <span>{totalAnimations} interactive lessons</span>
        </div>
        <h1 className="ua-home-title">
          Machine learning <span className="accent">visualized</span>.
        </h1>
        <p className="ua-home-subtitle">
          A browsable set of animated explanations for optimization, probability,
          neural networks, transformers, diffusion, reinforcement learning, and linear algebra,
          now arranged into guided learning tracks with prerequisites and next steps.
        </p>
      </section>

      <section className="ua-home-stats" aria-label="Catalog statistics">
        <div>
          <strong>{categories.length}</strong>
          <span>Chapters</span>
        </div>
        <div>
          <strong>{totalAnimations}</strong>
          <span>Animations</span>
        </div>
        <div>
          <strong>{assessmentStats.totalLabs}</strong>
          <span>Practice labs</span>
        </div>
        <div>
          <strong>{assessmentStats.totalQuizQuestions}</strong>
          <span>Quiz questions</span>
        </div>
      </section>

      <section className="ua-home-resume" aria-label="Learning progress">
        <div>
          <span>Resume</span>
          <h2>{activePathProgress.nextAnimation ? activePathProgress.nextAnimation.name : activePath.label}</h2>
          <p>
            {activePathProgress.completedCount}/{activePathProgress.totalCount} complete in {activePath.label}.
            {activePathProgress.nextAnimation ? ` Next: ${activePathProgress.nextAnimation.categoryName}.` : ' Path complete.'}
          </p>
        </div>
        <div className="ua-home-resume-meter" aria-label={`${activePathProgress.percent}% complete`}>
          <span style={{ width: `${activePathProgress.percent}%` }} />
        </div>
        {activePathProgress.nextAnimation && (
          <Link className="ua-home-resume-link" to={`/animation/${activePathProgress.nextAnimation.id}`}>
            Resume lesson <ArrowRight size={16} />
          </Link>
        )}
      </section>

      <section className="ua-hub-map" aria-labelledby="hub-map-title">
        <div className="ua-section-head">
          <span>Mindmap</span>
          <h2 id="hub-map-title">Learning paths</h2>
          <p>Pick a path and follow the amber chain. Each numbered badge is a lesson stop.</p>
        </div>
        <div className="ua-path-picker" role="tablist" aria-label="Learning path picker">
          {HUB_LEARNING_PATHS.map((path) => (
            <button
              key={path.id}
              type="button"
              className={`ua-path-tab ${path.id === activePath.id ? 'active' : ''}`}
              onClick={() => setActivePathId(path.id)}
              role="tab"
              aria-selected={path.id === activePath.id}
            >
              -&gt; {path.label}
              <small>{getPathProgress(path).completedCount}/{path.nodes.length}</small>
            </button>
          ))}
        </div>
        <div className="ua-path-line" aria-label={`${activePath.label} lesson chain`}>
          {activePath.nodes.map((animationId, index) => {
            const animation = animationById.get(animationId);
            if (!animation) return null;

            return (
              <Link
                className="ua-path-node"
                to={`/animation/${animation.id}`}
                key={animation.id}
              >
                <span>{index + 1}</span>
                <strong>{animation.name}</strong>
                <small>{animation.categoryName}</small>
              </Link>
            );
          })}
        </div>
        <p className="ua-path-caption">{activePath.description}</p>
      </section>

      <section className="ua-tracks" aria-labelledby="guided-tracks-title">
        <div className="ua-section-head">
          <span>Guided paths</span>
          <h2 id="guided-tracks-title">Curriculum tracks</h2>
          <p>Follow these paths when you want sequencing; use the catalog below when you want reference browsing.</p>
        </div>

        <div className="ua-track-grid">
          {curriculumTracks.map((track, trackIndex) => {
            const activeMinutes = track.animationIds.reduce(
              (sum, id) => sum + (animationById.get(id)?.estimatedMinutes || 0),
              0,
            );
            const plannedTopics = backlogByTrack[track.id] || [];
            const completedCount = track.animationIds.filter((id) => completedLessons.has(id)).length;
            const progressPercent = track.animationIds.length
              ? Math.round((completedCount / track.animationIds.length) * 100)
              : 0;
            const nextAnimation = animationById.get(
              track.animationIds.find((id) => !completedLessons.has(id)) || track.animationIds[0],
            );

            return (
              <article className="ua-track-card" key={track.id}>
                <div className="ua-track-card-head">
                  <span>{String(trackIndex + 1).padStart(2, '0')}</span>
                  <strong>{track.title}</strong>
                </div>
                <p>{track.description}</p>
                <div className="ua-track-meta">
                  <span>{track.animationIds.length} active</span>
                  <span>{activeMinutes} min</span>
                  <span>{plannedTopics.length} planned</span>
                  <span>{completedCount}/{track.animationIds.length} complete</span>
                </div>
                <div className="ua-track-progress" aria-label={`${progressPercent}% complete`}>
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="ua-track-sequence">
                  {track.animationIds.slice(0, 4).map((animationId) => {
                    const animation = animationById.get(animationId);
                    if (!animation) return null;
                    return <span key={animation.id}>{animation.name}</span>;
                  })}
                </div>
                {plannedTopics.length > 0 && (
                  <div className="ua-track-planned">
                    Planned: {plannedTopics.slice(0, 2).map((topic) => topic.title).join('; ')}
                  </div>
                )}
                {nextAnimation && (
                  <Link className="ua-track-link" to={`/animation/${nextAnimation.id}`}>
                    {completedCount > 0 ? 'Resume track' : 'Start track'} <ArrowRight size={16} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <div className="ua-toc">
        {categories.map((category, categoryIndex) => (
          <section className="ua-toc-section" key={category.id}>
            <div className="ua-toc-head">
              <span>{String(categoryIndex + 1).padStart(2, '0')}</span>
              <h2>{category.name}</h2>
              <small>{category.items.length} entries</small>
            </div>
            <div className="ua-toc-list">
              {category.items.map((item, itemIndex) => (
                <Link className="ua-toc-item" key={item.id} to={`/animation/${item.id}`}>
                  <span className="ua-toc-num">
                    {formatLessonCatalogNumber(categoryIndex, itemIndex)}
                  </span>
                  <span className="ua-toc-title">{item.name}</span>
                  <span className="ua-toc-desc">{item.description}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
