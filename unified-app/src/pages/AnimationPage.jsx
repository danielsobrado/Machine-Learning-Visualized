import React, { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { allAnimations, getAnimationById } from '../data/animations';
import { getLessonCatalogNumber } from '../data/lessonCatalogNumbers';
import { getAnimationComponent, isAnimationAvailable } from '../animations';
import AnimationShell from '../components/animation-shell/AnimationShell';

const LessonCodeLab = React.lazy(() => import('../labs/lesson-code/LessonCodeLab'));

export default function AnimationPage() {
  const { id } = useParams();
  const animation = getAnimationById(id);

  if (!animation) {
    return (
      <div className="ua-animation-page">
        <header className="ua-animation-header">
          <div className="ds-eyebrow">Missing entry</div>
          <h1 className="ds-title">Animation not found</h1>
          <p className="ds-subtitle">The animation "{id}" is not registered in the catalog.</p>
        </header>
        <Link to="/" className="ds-btn primary">Back to index</Link>
      </div>
    );
  }

  const currentIndex = allAnimations.findIndex((item) => item.id === id);
  const lessonNumber = getLessonCatalogNumber(animation.id, animation.categoryId);
  const prevAnimation = currentIndex > 0 ? allAnimations[currentIndex - 1] : null;
  const nextAnimation =
    currentIndex < allAnimations.length - 1 ? allAnimations[currentIndex + 1] : null;

  return (
    <div className="ua-animation-page">
      <header className="ua-animation-header">
        <div className="ds-eyebrow">
          <Link to="/">Index</Link>
          <span className="sep">/</span>
          <span>{animation.categoryName}</span>
          <span className="right">{lessonNumber}</span>
        </div>
        <h1 className="ds-title">{animation.name}</h1>
        <p className="ds-subtitle">{animation.description}</p>
      </header>

      <Suspense fallback={<LoadingPanel />}>
        <AnimationContent animationId={id} animation={animation} />
      </Suspense>

      <Suspense fallback={<div className="ds-panel ua-loading">Loading code lab</div>}>
        <LessonCodeLab lessonId={id} />
      </Suspense>

      <footer className="ua-animation-footer">
        {prevAnimation ? (
          <Link to={`/animation/${prevAnimation.id}`}>
            <span>← {prevAnimation.name}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link to="/">All animations</Link>
        {nextAnimation ? (
          <Link to={`/animation/${nextAnimation.id}`}>
            <span>{nextAnimation.name} →</span>
          </Link>
        ) : (
          <span />
        )}
      </footer>
    </div>
  );
}

function AnimationContent({ animationId, animation }) {
  if (!isAnimationAvailable(animationId)) {
    return (
      <AnimationShell animation={animation}>
        <Placeholder animation={animation} animationId={animationId} />
      </AnimationShell>
    );
  }

  const AnimationComponent = getAnimationComponent(animationId);
  return (
    <AnimationShell animation={animation}>
      <AnimationComponent />
    </AnimationShell>
  );
}

function LoadingPanel() {
  return (
    <div className="ds-panel ua-loading">
      <div className="ua-spinner" />
      <span>Loading animation</span>
    </div>
  );
}

function Placeholder({ animation, animationId }) {
  return (
    <div className="ds-panel ua-placeholder">
      <div className="ds-panel-head">
        <span>Pending implementation</span>
        <span>{animationId}</span>
      </div>
      <div className="ds-panel-body">
        <h2>{animation.name}</h2>
        <p>{animation.description}</p>
        <p>
          Add the standalone implementation under{' '}
          <code>unified-app/src/animations/{animationId}/</code> and register it in the
          animation loader.
        </p>
      </div>
    </div>
  );
}
