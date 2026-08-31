import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  GitCompare,
  Image as ImageIcon,
  Library,
  ShieldCheck,
} from 'lucide-react';
import Eq from '../../_design-system/Eq';
import { allAnimations } from '../../data/animations';
import { getLessonImages } from '../../data/lessonImages';

const ConceptMindmap = lazy(() => import('./ConceptMindmap'));
const AssessmentPanel = lazy(() => import('./AssessmentPanel'));
const GLOSSARY_PAGE_SIZE = 15;

function GlossaryTerm({ entry }) {
  const [open, setOpen] = useState(false);

  if (!entry) return null;

  return (
    <span className="ua-term-wrap">
      <button
        type="button"
        className="ua-term"
        data-term-id={entry.id}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {entry.term}
      </button>
      {open && (
        <span className="ua-term-popover" role="dialog">
          <img src={entry.image.src} alt={entry.image.alt} />
          <strong>{entry.term}</strong>
          <span>{entry.definition}</span>
          <Link to={entry.href}>Open glossary note</Link>
        </span>
      )}
    </span>
  );
}

function GlossaryTermList({ terms }) {
  if (!terms?.length) return null;

  return (
    <span className="ua-term-list">
      {terms.map((term, index) => (
        <GlossaryTerm key={`${term.id}-${index}`} entry={term} />
      ))}
    </span>
  );
}

function MindmapFallback() {
  return (
    <section className="ua-concept-map" aria-label="Concept mindmap">
      <div className="ua-learning-rail-head">
        <span>Mindmap</span>
      </div>
      <div className="ua-map-canvas ua-map-loading">Loading mindmap</div>
    </section>
  );
}

function LearningCards({ cards }) {
  return (
    <aside className="ua-card-stack" aria-label="Observations and notes">
      <div className="ua-learning-rail-head">
        <span>Field notes</span>
      </div>
      {cards.map((card, index) => (
        <section key={card.type} className={`ua-learning-card ${card.type}`}>
          <div className="ua-learning-card-head">
            <span>{String(index + 1).padStart(2, '0')} / {card.label}</span>
            <h3>{card.title}</h3>
          </div>
          <p>{card.body}</p>
          {card.equation && (
            <div className="ua-card-equation">
              <Eq tex={card.equation} />
            </div>
          )}
          <GlossaryTermList terms={card.terms} />
        </section>
      ))}
    </aside>
  );
}

function DepthList({ title, items }) {
  if (!items?.length) return null;

  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
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
      <h4>Lesson links</h4>
      <div className="ua-depth-link-list">
        {lessons.map((lesson) => (
          <Link key={lesson.id} to={`/animation/${lesson.id}`}>{lesson.name}</Link>
        ))}
      </div>
    </div>
  );
}

function ConceptComparisonCards({ comparisons }) {
  if (!comparisons?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Concept comparisons">
      <div className="ua-depth-panel-head">
        <GitCompare size={17} />
        <span>Concept comparisons</span>
      </div>
      <div className="ua-depth-grid">
        {comparisons.map((comparison) => (
          <article key={comparison.id} className="ua-depth-card ua-comparison-card">
            <span>{comparison.title}</span>
            <div>
              <strong>{comparison.left}</strong>
              <p>{comparison.leftSummary}</p>
            </div>
            <div>
              <strong>{comparison.right}</strong>
              <p>{comparison.rightSummary}</p>
            </div>
            {comparison.whenToUseLeft && (
              <p><b>Use {comparison.left} when:</b> {comparison.whenToUseLeft}</p>
            )}
            {comparison.whenToUseRight && (
              <p><b>Use {comparison.right} when:</b> {comparison.whenToUseRight}</p>
            )}
            <p><b>Common mistake:</b> {comparison.commonMistake}</p>
            {comparison.failureIfConfused && (
              <p><b>If confused:</b> {comparison.failureIfConfused}</p>
            )}
            <p><b>Diagnostic:</b> {comparison.diagnostic}</p>
            {comparison.tinyScenario && (
              <p><b>Tiny scenario:</b> {comparison.tinyScenario}</p>
            )}
            <LessonLinks lessonIds={comparison.lessonLinks || comparison.lessonIds} />
          </article>
        ))}
      </div>
    </section>
  );
}

function FailureGallery({ failures }) {
  if (!failures?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Failure gallery">
      <div className="ua-depth-panel-head">
        <AlertTriangle size={17} />
        <span>Failure gallery</span>
      </div>
      <div className="ua-depth-grid">
        {failures.map((failure) => (
          <article key={failure.id} className="ua-depth-card">
            <span>{failure.track}</span>
            <h3>{failure.title}</h3>
            {(failure.severity || failure.learnerLevel) && (
              <p><b>Signal:</b> {[failure.severity, failure.learnerLevel].filter(Boolean).join(' / ')}</p>
            )}
            {failure.minimalScenario && <p><b>Minimal scenario:</b> {failure.minimalScenario}</p>}
            <p><b>Symptom:</b> {failure.symptom}</p>
            <p><b>Why:</b> {failure.whyItHappens}</p>
            <p><b>Detect:</b> {failure.howToDetect}</p>
            <p><b>Fix:</b> {failure.howToFix}</p>
            {failure.falseFix && <p><b>False fix:</b> {failure.falseFix}</p>}
            {failure.tryInLesson?.lessonId && (
              <p>
                <b>Try in lesson:</b>{' '}
                <Link to={`/animation/${failure.tryInLesson.lessonId}`}>
                  {failure.tryInLesson.control || failure.tryInLesson.lessonId}
                </Link>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function PaperReadingMode({ signals }) {
  if (!signals?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Paper reading mode">
      <div className="ua-depth-panel-head">
        <FileSearch size={17} />
        <span>Paper-reading mode</span>
      </div>
      <div className="ua-depth-grid">
        {signals.map((signal) => (
          <article key={signal.id} className="ua-depth-card">
            <span>When a paper says</span>
            <h3>{signal.phrase}</h3>
            {(signal.sourceType || signal.sourceName || signal.sourceYear) && (
              <p>
                <b>Provenance:</b>{' '}
                {[signal.sourceType, signal.sourceName, signal.sourceYear].filter(Boolean).join(' / ')}
              </p>
            )}
            {(signal.claimStatus || signal.freshnessDate || signal.confidence) && (
              <p>
                <b>Claim status:</b>{' '}
                {[signal.claimStatus, signal.freshnessDate, signal.confidence].filter(Boolean).join(' / ')}
              </p>
            )}
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

function ToyModelNotes({ caveat }) {
  const toyModel = caveat.toyModel || null;
  const whatIsSimplified = toyModel?.whatIsSimplified || caveat.whatIsSimplified || caveat.proxyMetrics;
  const whatStillHolds = toyModel?.whatStillHolds || caveat.whatStillHolds;
  const productionReality = toyModel?.whatWouldChangeInProduction || caveat.productionReality;
  const toyFormula = toyModel?.toyFormula || caveat.toyFormula;

  if (!toyFormula && !whatIsSimplified?.length && !whatStillHolds?.length && !productionReality?.length) {
    return null;
  }

  return (
    <div className="ua-depth-subsection">
      <h4>Teaching simplification</h4>
      {toyFormula && <p><b>Toy formula:</b> {toyFormula}</p>}
      <DepthList title="What is simplified" items={whatIsSimplified} />
      <DepthList title="What still holds" items={whatStillHolds} />
      <DepthList title="Production reality" items={productionReality} />
    </div>
  );
}

function CaveatBoxes({ caveats }) {
  if (!caveats?.length) return null;

  return (
    <section className="ua-depth-panel" aria-label="Caveats and boundaries">
      <div className="ua-depth-panel-head">
        <ShieldCheck size={17} />
        <span>What this does not solve</span>
      </div>
      <div className="ua-depth-grid">
        {caveats.map((caveat) => (
          <article key={caveat.id} className="ua-depth-card">
            <DepthList title="Solves" items={caveat.solves} />
            <DepthList title="Does not solve" items={caveat.doesNotSolve} />
            <DepthList title="Can go wrong" items={caveat.canGoWrong} />
            <ToyModelNotes caveat={caveat} />
            <DepthList title="How to test it" items={caveat.howToTest} />
          </article>
        ))}
      </div>
    </section>
  );
}

function CurriculumDepthPanels({ depth }) {
  const hasDepth = depth && (
    depth.comparisons.length > 0
    || depth.failures.length > 0
    || depth.paperSignals.length > 0
    || depth.caveats.length > 0
  );

  if (!hasDepth) return null;

  return (
    <div className="ua-curriculum-depth">
      <ConceptComparisonCards comparisons={depth.comparisons} />
      <CaveatBoxes caveats={depth.caveats} />
      <FailureGallery failures={depth.failures} />
      <PaperReadingMode signals={depth.paperSignals} />
    </div>
  );
}

function MathControls({
  model,
  activeWorkspaceTab,
  hasImages,
  onReset,
  onFocusStage,
  onOpenGlossary,
  onOpenImages,
}) {
  const [prereq] = model.mindmap.prereqs;
  const [next] = model.mindmap.next;
  const controls = hasImages
    ? model.controls.flatMap((control) => (
        control.id === 'sum'
          ? [control, { id: 'images', sigil: '▧', label: 'Images' }]
          : [control]
      ))
    : model.controls;

  const actions = {
    prereq: prereq ? { as: Link, to: `/animation/${prereq.id}` } : { as: 'button', onClick: onFocusStage },
    reset: { as: 'button', onClick: onReset },
    play: { as: 'button', onClick: onFocusStage },
    sum: { as: 'button', onClick: onOpenGlossary },
    images: { as: 'button', onClick: onOpenImages },
    next: next ? { as: Link, to: `/animation/${next.id}` } : { as: 'button', onClick: onFocusStage },
  };

  return (
    <nav
      className="ua-math-controls"
      aria-label="Math animation controls"
      style={{ '--math-control-count': controls.length }}
    >
      {controls.map((control) => {
        const action = actions[control.id];
        const Component = action.as;
        const props = { ...action };
        const selected = control.id === activeWorkspaceTab;
        delete props.as;

        return (
          <Component
            key={control.id}
            {...props}
            className={`ua-sigil-button${selected ? ' is-active' : ''}`}
            data-math-control="true"
            aria-pressed={Component === 'button' ? selected : undefined}
          >
            <span>{control.sigil}</span>
            {control.label}
          </Component>
        );
      })}
    </nav>
  );
}

function LessonImageGallery({ images, lessonName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[Math.min(activeIndex, images.length - 1)];
  const hasMultipleImages = images.length > 1;

  if (!activeImage) return null;

  return (
    <section className="ua-lesson-images" aria-label={`${lessonName} images`}>
      <div className="ua-lesson-images-head">
        <div>
          <span>Images</span>
          <h2>{lessonName}</h2>
        </div>
        {hasMultipleImages && (
          <div className="ua-lesson-images-count">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      <figure className="ua-lesson-image-frame">
        <img src={activeImage.src} alt={activeImage.alt} />
        <figcaption>{activeImage.title}</figcaption>
      </figure>

      {hasMultipleImages && (
        <nav className="ua-lesson-image-nav" aria-label="Lesson image gallery">
          <button
            type="button"
            onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={15} />
            Previous
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((value) => Math.min(images.length - 1, value + 1))}
            disabled={activeIndex === images.length - 1}
          >
            Next
            <ChevronRight size={15} />
          </button>
        </nav>
      )}
    </section>
  );
}

function Glossary({ terms }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil((terms?.length || 0) / GLOSSARY_PAGE_SIZE));
  const activePage = Math.min(page, pageCount - 1);
  const start = activePage * GLOSSARY_PAGE_SIZE;
  const visibleTerms = terms.slice(start, start + GLOSSARY_PAGE_SIZE);
  const showPagination = terms.length > GLOSSARY_PAGE_SIZE;

  return (
    <section id="math-glossary" className="ua-glossary-panel">
      <div className="ua-glossary-head">
        <span>Glossary</span>
        <h2>Terms in this animation</h2>
        {showPagination && (
          <p>
            Showing {start + 1}-{Math.min(start + GLOSSARY_PAGE_SIZE, terms.length)} of {terms.length} terms
          </p>
        )}
      </div>
      <div className="ua-glossary-grid">
        {visibleTerms.map((term) => (
          <article key={term.id} id={`glossary-${term.slug}`}>
            <img src={term.image.src} alt={term.image.alt} />
            <span>{term.category}</span>
            <h3>
              <Link to={term.href}>{term.term}</Link>
            </h3>
            {(term.symbol || term.aliases?.length > 0) && (
              <div className="ua-glossary-card-meta" aria-label={`${term.term} metadata`}>
                {term.symbol && term.symbol !== term.term.slice(0, 1) && <span>{term.symbol}</span>}
                {term.aliases?.slice(0, 3).map((alias) => (
                  <span key={alias}>{alias}</span>
                ))}
                {term.aliases?.length > 3 && (
                  <span>+{term.aliases.length - 3} more</span>
                )}
              </div>
            )}
            <p>{term.definition}</p>
            {term.intuition && <p className="ua-glossary-intuition">{term.intuition}</p>}
          </article>
        ))}
      </div>
      {showPagination && (
        <nav className="ua-glossary-pagination" aria-label="Lesson glossary pagination">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={activePage === 0}
          >
            Previous
          </button>
          <span>
            Page {activePage + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            disabled={activePage === pageCount - 1}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

function getLessonWorkspaceTabs({
  assessment,
  depth,
  glossaryTerms,
  lessonImages,
  lessonId,
  lessonName,
}) {
  const hasDepth = depth && (
    depth.comparisons.length > 0
    || depth.failures.length > 0
    || depth.paperSignals.length > 0
    || depth.caveats.length > 0
  );

  return [
    assessment && {
      id: 'check',
      label: 'Core questions',
      icon: ClipboardCheck,
      panel: (
        <Suspense fallback={<div className="ua-map-canvas ua-map-loading">Loading questions</div>}>
          <AssessmentPanel lessonId={lessonId} eyebrow="Progress" title="Core questions" />
        </Suspense>
      ),
    },
    glossaryTerms?.length > 0 && {
      id: 'glossary',
      label: 'Glossary',
      icon: Library,
      panel: <Glossary key={lessonId} terms={glossaryTerms} />,
    },
    lessonImages?.length > 0 && {
      id: 'images',
      label: 'Images',
      icon: ImageIcon,
      hideFromTabBar: true,
      panel: <LessonImageGallery key={lessonId} images={lessonImages} lessonName={lessonName} />,
    },
    hasDepth && {
      id: 'deep-dive',
      label: 'Deep dive',
      icon: FileSearch,
      panel: <CurriculumDepthPanels depth={depth} />,
    },
  ].filter(Boolean);
}

function WorkspaceTabBar({ activeTab, tabs, onTabChange, className = '' }) {
  const visibleTabs = tabs.filter((tab) => !tab.hideFromTabBar);
  if (!visibleTabs.length) return null;

  return (
    <div className={`ua-workspace-tabs ${className}`.trim()} aria-label="Lesson workspace sections" role="tablist">
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const selected = tab.id === activeTab;

        return (
          <button
            type="button"
            key={tab.id}
            className="ua-workspace-tab"
            role="tab"
            aria-selected={selected}
            aria-controls={`workspace-panel-${tab.id}`}
            id={`workspace-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={15} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function findLessonToolbar(stage) {
  const stageWrap = stage.querySelector('.ua-stage-wrap');
  const lessonRoot = stageWrap?.firstElementChild;
  const nav = lessonRoot?.matches('nav') ? lessonRoot : lessonRoot?.querySelector('nav');
  if (!nav || nav.parentElement?.firstElementChild !== nav) return null;

  const toolbar = nav.classList.contains('ds-tabs')
    ? nav
    : nav.querySelector(':scope > div > div')
    || nav.querySelector(':scope > div')
    || nav;

  return {
    contentRoot: nav.parentElement,
    toolbar,
  };
}

function isWorkspaceTabActive(activeTab, tabs) {
  return tabs.some((tab) => tab.id === activeTab);
}

function setWorkspaceContentState(contentRoot, active) {
  if (!contentRoot) return;

  contentRoot.classList.add('ua-workspace-content-root');
  contentRoot.toggleAttribute('data-workspace-active', active);
}

function WorkspaceTabPortal({ activeTab, tabs, onTabChange }) {
  const [portalSlot, setPortalSlot] = useState(null);
  const contentRootRef = useRef(null);
  const workspaceActive = isWorkspaceTabActive(activeTab, tabs);
  const visibleTabs = tabs.filter((tab) => !tab.hideFromTabBar);
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    const stage = document.getElementById('math-main-stage');
    if (!stage || tabs.length === 0) return undefined;

    let slot = null;
    const cleanup = () => {
      slot?.remove();
      contentRootRef.current?.removeAttribute('data-workspace-active');
      contentRootRef.current?.classList.remove('ua-workspace-content-root');
      contentRootRef.current = null;
      setPortalSlot(null);
    };

    const attach = () => {
      const placement = findLessonToolbar(stage);
      if (!placement || slot?.isConnected) return Boolean(slot?.isConnected);

      slot = document.createElement('div');
      slot.className = 'ua-workspace-portal-slot';
      placement.toolbar.appendChild(slot);
      contentRootRef.current = placement.contentRoot;
      setWorkspaceContentState(contentRootRef.current, workspaceActive);
      setPortalSlot(slot);
      return true;
    };

    if (attach()) {
      return cleanup;
    }

    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(stage, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [tabs.length]);

  useEffect(() => {
    const stage = document.getElementById('math-main-stage');
    const placement = stage ? findLessonToolbar(stage) : null;
    if (placement?.contentRoot) {
      contentRootRef.current = placement.contentRoot;
    }
    setWorkspaceContentState(contentRootRef.current, workspaceActive);
  }, [workspaceActive]);

  if (activeTabConfig?.hideFromTabBar) return null;

  if (!portalSlot && visibleTabs.length > 0) {
    return (
      <WorkspaceTabBar
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={onTabChange}
        className="ua-workspace-tabs-inline"
      />
    );
  }

  return createPortal(
    <WorkspaceTabBar
      activeTab={activeTab}
      tabs={tabs}
      onTabChange={onTabChange}
      className="ua-workspace-tabs-inline"
    />,
    portalSlot,
  );
}

function LessonWorkspace({
  activeTab,
  tabs,
}) {
  if (tabs.length === 0) return null;

  const selectedTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : null;
  if (!selectedTab) return null;

  const selectedTabConfig = tabs.find((tab) => tab.id === selectedTab);
  const selectedPanel = selectedTabConfig?.panel;
  const labelledBy = selectedTabConfig?.hideFromTabBar ? undefined : `workspace-tab-${selectedTab}`;

  return (
    <section id="lesson-workspace" className="ua-lesson-workspace" aria-label="Lesson workspace">
      <div
        className="ua-workspace-panel"
        id={`workspace-panel-${selectedTab}`}
        role="tabpanel"
        aria-label={labelledBy ? undefined : selectedTabConfig?.label}
        aria-labelledby={labelledBy}
      >
        {selectedPanel}
      </div>
    </section>
  );
}

export default function AnimationShell({ animation, children }) {
  const [resetNonce, setResetNonce] = useState(0);
  const [workspaceTab, setWorkspaceTab] = useState('lesson');
  const [learningState, setLearningState] = useState({
    model: null,
    showShellAssessment: false,
  });
  const { model, showShellAssessment } = learningState;
  const lessonImages = useMemo(
    () => getLessonImages(animation.id, animation.name),
    [animation.id, animation.name],
  );

  useEffect(() => {
    let cancelled = false;
    setLearningState({ model: null, showShellAssessment: false });

    Promise.all([
      import('../../data/animationLearning'),
      import('../../data/lessonAssessments'),
    ]).then(([learning, assessments]) => {
      if (cancelled) return;
      const nextModel = learning.createLearningModel(animation, allAnimations);
      const assessment = assessments.getLessonAssessment(animation.id);
      setLearningState({
        model: nextModel,
        showShellAssessment: assessments.hasAssessmentContent(assessment),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [animation]);

  const workspaceTabs = useMemo(() => getLessonWorkspaceTabs({
    assessment: showShellAssessment,
    depth: model?.depth,
    glossaryTerms: model?.glossary,
    lessonImages,
    lessonId: animation.id,
    lessonName: animation.name,
  }), [animation.id, animation.name, lessonImages, model?.depth, model?.glossary, showShellAssessment]);

  const hasActiveWorkspaceTab = workspaceTabs.some((tab) => tab.id === workspaceTab);

  useEffect(() => {
    setWorkspaceTab('lesson');
  }, [animation.id]);

  useEffect(() => {
    const stage = document.getElementById('math-main-stage');
    if (!stage) return undefined;

    const clearWorkspaceTab = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.ua-workspace-portal-slot')) return;
      const button = target.closest('button');
      if (button?.closest('.ua-stage-wrap nav')) {
        setWorkspaceTab('lesson');
      }
    };

    stage.addEventListener('click', clearWorkspaceTab, true);
    return () => stage.removeEventListener('click', clearWorkspaceTab, true);
  }, [animation.id]);

  const resetStage = () => {
    setWorkspaceTab('lesson');
    setResetNonce((value) => value + 1);
    document.getElementById('math-main-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusStage = () => {
    setWorkspaceTab('lesson');
    document.getElementById('math-main-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const openWorkspaceTab = (tabId) => {
    if (!workspaceTabs.some((tab) => tab.id === tabId)) return;
    setWorkspaceTab(tabId);
  };

  if (!model) {
    return (
      <div className="ua-learning-shell" data-lesson-family={animation.categoryId}>
        <header className="ua-learning-strip">
          <div>
            <span>{animation.categoryName}</span>
            <h2>{animation.name}</h2>
          </div>
          <div className="ua-chip-row">
            <span>Loading learning map</span>
          </div>
        </header>

        <div className="ua-learning-grid">
          <main id="math-main-stage" className="ua-main-stage" aria-label={`${animation.name} animation stage`}>
            <div className="ua-stage-annotation"><span>Fig. {animation.id}</span><span>Main visual / interactive</span></div>
            <div key={resetNonce} className="ua-stage-wrap">
              {children}
            </div>
          </main>

          <aside className="ua-card-stack" aria-label="Learning cards">
            <div className="ua-learning-rail-head">
              <span>Field notes</span>
            </div>
            <section className="ua-learning-card">
              <div className="ua-learning-card-head">
                <span>loading</span>
                <h3>Preparing lesson context</h3>
              </div>
              <p>Loading the mindmap, glossary, assessment, and next-step guidance.</p>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="ua-learning-shell" data-lesson-family={animation.categoryId}>
      <header className="ua-learning-strip">
        <div>
          <span>{model.chips.category}</span>
          <h2>{model.conceptName}</h2>
        </div>
        <div className="ua-headline-eq">
          <Eq tex={model.headlineEquation.latex} />
        </div>
        <div className="ua-chip-row">
          <span title={model.chips.difficulty}>{model.chips.difficulty}</span>
          <span title={model.chips.minutes}>{model.chips.minutes}</span>
          <span title={model.chips.prereq}>{model.chips.prereq}</span>
        </div>
      </header>

      <div className="ua-learning-grid">
        <main id="math-main-stage" className="ua-main-stage" aria-label={`${animation.name} animation stage`}>
          <div className="ua-stage-annotation">
            <span>Fig. {animation.id}</span>
            <span>Main visual / manipulate the experiment</span>
          </div>
          <WorkspaceTabPortal
            activeTab={workspaceTab}
            tabs={workspaceTabs}
            onTabChange={openWorkspaceTab}
          />
          <div
            key={resetNonce}
            className={[
              'ua-stage-wrap',
              showShellAssessment && 'has-shell-assessment',
              hasActiveWorkspaceTab && 'has-workspace-tab',
            ].filter(Boolean).join(' ')}
          >
            {hasActiveWorkspaceTab ? (
              <LessonWorkspace
                activeTab={workspaceTab}
                tabs={workspaceTabs}
              />
            ) : children}
          </div>
        </main>

        <LearningCards cards={model.learningCards} />
      </div>

      <section className="ua-control-bench" aria-label="Lesson controls and references">
        <div className="ua-control-bench-label"><span>What changes if…</span><small>Controls / references</small></div>
        <MathControls
          model={model}
          activeWorkspaceTab={workspaceTab}
          hasImages={lessonImages.length > 0}
          onReset={resetStage}
          onFocusStage={focusStage}
          onOpenGlossary={() => openWorkspaceTab('glossary')}
          onOpenImages={() => openWorkspaceTab('images')}
        />
      </section>

      <Suspense fallback={<MindmapFallback />}>
        <ConceptMindmap mindmap={model.mindmap} />
      </Suspense>
    </div>
  );
}
