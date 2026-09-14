import React, { Suspense, lazy } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { allAnimations, getAnimationById } from '../data/animations';
import { getLessonCatalogNumber } from '../data/lessonCatalogNumbers';
import { applyLessonMetadataOverrides } from '../data/lessonMetadataOverrides';
import {
  getAvailableLessonSections,
  getLessonSection,
  getLessonSectionId,
  getLessonSectionPath,
} from '../data/lessonSections';
import { getAnimationComponent, isAnimationAvailable } from '../animations';
import AnimationShell from '../components/animation-shell/AnimationShell';
import { P1_LAB_LESSON_IDS } from '../components/priority-labs/p1PriorityConstants.js';
import LessonLayout from '../components/lesson/LessonLayout';
import useLessonDepthAvailability from '../hooks/useLessonDepthAvailability.js';

const P1PriorityLab = lazy(() => import('../components/priority-labs/P1PriorityLab'));
const LessonSectionTabs = lazy(() => import('../components/lesson/LessonSectionTabs'));
const LessonSectionView = lazy(() => import('../components/lesson/LessonSectionView'));

export default function AnimationPage() {
  const { id } = useParams();
  const location = useLocation();
  const animation = applyLessonMetadataOverrides(getAnimationById(id));
  const activeSection = animation ? getLessonSectionId(location.pathname, animation.id) : null;
  const { isReady: depthReady, hasDeepDive } = useLessonDepthAvailability({
    lessonId: animation?.id,
    categoryId: animation?.categoryId,
    eager: activeSection === 'deep-dive',
  });

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

  if (!activeSection) {
    return <Navigate replace to={getLessonSectionPath(animation.id)} />;
  }

  if (activeSection === 'deep-dive' && !depthReady) {
    return (
      <div className="ua-animation-page">
        <LoadingPanel label="deep-dive metadata" />
      </div>
    );
  }

  if (activeSection === 'deep-dive' && !hasDeepDive) {
    return <Navigate replace to={getLessonSectionPath(animation.id)} />;
  }

  const currentIndex = allAnimations.findIndex((item) => item.id === id);
  const lessonNumber = getLessonCatalogNumber(animation.id, animation.categoryId);
  const prevAnimation = currentIndex > 0 ? allAnimations[currentIndex - 1] : null;
  const nextAnimation = currentIndex < allAnimations.length - 1 ? allAnimations[currentIndex + 1] : null;
  const sections = getAvailableLessonSections(hasDeepDive);
  const sectionIndex = sections.findIndex((section) => section.id === activeSection);
  const activeSectionDefinition = getLessonSection(activeSection);
  const previousSection = sectionIndex > 0 ? sections[sectionIndex - 1] : null;
  const nextSection = sectionIndex < sections.length - 1 ? sections[sectionIndex + 1] : null;
  const compactHeader = activeSection !== 'lesson';

  return (
    <div className="ua-animation-page">
      <LessonLayout animation={animation} activeSection={activeSection} hasDeepDive={hasDeepDive}>
        <header className={`ua-animation-header${compactHeader ? ' compact' : ''}`}>
          <div className="ds-eyebrow">
            <Link to="/">Index</Link>
            <span className="sep">/</span>
            <span>{animation.categoryName}</span>
            {compactHeader && (
              <>
                <span className="sep">/</span>
                <span className="ua-animation-mode-label">{activeSectionDefinition?.label}</span>
              </>
            )}
            <span className="right">{lessonNumber}</span>
          </div>
          <h1 className="ds-title">{animation.name}</h1>
          <p className="ds-subtitle">{animation.description}</p>
        </header>

        {activeSection === 'code' && (
          <Suspense fallback={<LoadingPanel label="section navigation" />}>
            <LessonSectionTabs
              animationId={animation.id}
              activeSection={activeSection}
              hasDeepDive={hasDeepDive}
            />
          </Suspense>
        )}

        {activeSection === 'lesson' ? (
          <Suspense fallback={<LoadingPanel />}>
            <AnimationContent animationId={id} animation={animation} />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingPanel label={activeSectionDefinition?.label || 'lesson section'} />}>
            <LessonSectionView animation={animation} sectionId={activeSection} />
          </Suspense>
        )}

        <nav className="ua-lesson-mode-footer" aria-label="Lesson section navigation">
          {previousSection ? (
            <Link className="previous" to={getLessonSectionPath(animation.id, previousSection.id)}>
              <small>Previous section</small>
              <strong>← {previousSection.label}</strong>
            </Link>
          ) : <span />}
          <span className="ua-lesson-mode-position">
            {sectionIndex + 1} / {sections.length}
          </span>
          {nextSection ? (
            <Link className="next" to={getLessonSectionPath(animation.id, nextSection.id)}>
              <small>Next section</small>
              <strong>{nextSection.label} →</strong>
            </Link>
          ) : <span />}
        </nav>

        <footer className="ua-animation-footer ua-curriculum-footer">
          {prevAnimation ? (
            <Link to={`/animation/${prevAnimation.id}`}><span>← {prevAnimation.name}</span></Link>
          ) : (
            <span />
          )}
          <Link to="/">All lessons</Link>
          {nextAnimation ? (
            <Link to={`/animation/${nextAnimation.id}`}><span>{nextAnimation.name} →</span></Link>
          ) : (
            <span />
          )}
        </footer>
      </LessonLayout>
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
      {P1_LAB_LESSON_IDS.has(animationId) && <P1PriorityLab lessonId={animationId} />}
    </AnimationShell>
  );
}

function LoadingPanel({ label = 'animation' }) {
  return (
    <div className="ds-panel ua-loading">
      <div className="ua-spinner" />
      <span>Loading {label}</span>
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
