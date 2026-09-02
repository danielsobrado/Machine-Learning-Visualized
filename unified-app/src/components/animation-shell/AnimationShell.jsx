import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Eq from '../../_design-system/Eq';
import { allAnimations } from '../../data/animations';
import { getLessonImages } from '../../data/lessonImages';

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

function LearningCards({ cards }) {
  return (
    <aside className="ua-card-stack" aria-label="Observations and notes">
      <div className="ua-learning-rail-head"><span>Field notes</span></div>
      {cards.map((card, index) => (
        <section key={card.type} className={`ua-learning-card ${card.type}`}>
          <div className="ua-learning-card-head">
            <span>{String(index + 1).padStart(2, '0')} / {card.label}</span>
            <h3>{card.title}</h3>
          </div>
          <p>{card.body}</p>
          {card.equation && (
            <div className="ua-card-equation"><Eq tex={card.equation} /></div>
          )}
          <GlossaryTermList terms={card.terms} />
        </section>
      ))}
    </aside>
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
          <div className="ua-lesson-images-count">{activeIndex + 1} / {images.length}</div>
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
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((value) => Math.min(images.length - 1, value + 1))}
            disabled={activeIndex === images.length - 1}
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}

function MathControls({ model, hasImages, showImages, onReset, onFocusStage, onToggleImages }) {
  const [prereq] = model.mindmap.prereqs;
  const [next] = model.mindmap.next;
  const nextControl = model.controls.find((control) => control.id === 'next');
  const controls = [
    ...model.controls.filter((control) => !['sum', 'next'].includes(control.id)),
    ...(hasImages ? [{ id: 'images', sigil: '▧', label: 'Images' }] : []),
    nextControl,
  ].filter(Boolean);

  const actions = {
    prereq: prereq
      ? { Component: Link, props: { to: `/animation/${prereq.id}` } }
      : { Component: 'button', props: { type: 'button', onClick: onFocusStage } },
    reset: { Component: 'button', props: { type: 'button', onClick: onReset } },
    play: { Component: 'button', props: { type: 'button', onClick: onFocusStage } },
    images: { Component: 'button', props: { type: 'button', onClick: onToggleImages } },
    next: next
      ? { Component: Link, props: { to: `/animation/${next.id}` } }
      : { Component: 'button', props: { type: 'button', onClick: onFocusStage } },
  };

  return (
    <nav
      className="ua-math-controls"
      aria-label="Math animation controls"
      style={{ '--math-control-count': controls.length }}
    >
      {controls.map((control) => {
        const action = actions[control.id];
        const Component = action.Component;
        const selected = control.id === 'images' && showImages;

        return (
          <Component
            key={control.id}
            {...action.props}
            className={`ua-sigil-button${selected ? ' is-active' : ''}`}
            data-math-control="true"
            aria-pressed={Component === 'button' && control.id === 'images' ? selected : undefined}
          >
            <span>{control.sigil}</span>
            {control.label}
          </Component>
        );
      })}
    </nav>
  );
}

const MUTED_ICON_ATTR = 'data-ua-muted-icon';
const MAX_DECORATIVE_ICON_PX = 26;

function muteLabelledControlIcons() {
  const stageWrap = document.querySelector('#math-main-stage .ua-stage-wrap');
  if (!stageWrap) return;

  const labelledSelector = 'button, a, summary, label, h1, h2, h3, h4, h5, h6,'
    + ' [class*="uppercase"], [class*="font-black"]';
  const headingRowSelector = '[class*="items-center"]';
  const maxHeadingChars = 60;

  const mute = (control, strict) => {
    const icons = control.querySelectorAll(':scope > svg, :scope > span > svg');
    if (!icons.length) return;
    const text = control.textContent.trim();
    if (!text) return;
    if (strict && (icons.length > 1 || text.length > maxHeadingChars)) return;

    icons.forEach((icon) => {
      if (icon.hasAttribute(MUTED_ICON_ATTR)) return;
      const box = icon.getBoundingClientRect();
      if (box.width > MAX_DECORATIVE_ICON_PX || box.height > MAX_DECORATIVE_ICON_PX) return;
      icon.setAttribute(MUTED_ICON_ATTR, '');
    });
  };

  stageWrap.querySelectorAll(labelledSelector).forEach((element) => mute(element, false));
  stageWrap.querySelectorAll(headingRowSelector).forEach((element) => mute(element, true));
}

export default function AnimationShell({ animation, children }) {
  const [resetNonce, setResetNonce] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const [model, setModel] = useState(null);
  const lessonImages = useMemo(
    () => getLessonImages(animation.id, animation.name),
    [animation.id, animation.name],
  );

  useEffect(() => {
    setShowImages(false);
  }, [animation.id]);

  useEffect(() => {
    let cancelled = false;
    setModel(null);

    import('../../data/animationLearning').then(({ createLearningModel }) => {
      if (!cancelled) setModel(createLearningModel(animation, allAnimations));
    });

    return () => {
      cancelled = true;
    };
  }, [animation]);

  useEffect(() => {
    const page = document.querySelector('.ua-animation-page');
    if (!page) return undefined;

    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(muteLabelledControlIcons, 0);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(page, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [animation.id, resetNonce, showImages]);

  const resetStage = () => {
    setShowImages(false);
    setResetNonce((value) => value + 1);
    document.getElementById('math-main-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusStage = () => {
    setShowImages(false);
    document.getElementById('math-main-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (!model) {
    return (
      <div className="ua-learning-shell" data-lesson-family={animation.categoryId}>
        <header className="ua-learning-strip">
          <div><span>Governing relation</span></div>
          <div className="ua-chip-row"><span>Loading lesson context</span></div>
        </header>

        <div className="ua-learning-grid">
          <main id="math-main-stage" className="ua-main-stage" aria-label={`${animation.name} animation stage`}>
            <div className="ua-stage-annotation"><span>Fig. {animation.id}</span><span>Main visual / interactive</span></div>
            <div key={resetNonce} className="ua-stage-wrap">{children}</div>
          </main>

          <aside className="ua-card-stack" aria-label="Learning cards">
            <div className="ua-learning-rail-head"><span>Field notes</span></div>
            <section className="ua-learning-card">
              <div className="ua-learning-card-head"><span>loading</span><h3>Preparing lesson context</h3></div>
              <p>Loading the lesson context and next-step guidance.</p>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="ua-learning-shell" data-lesson-family={animation.categoryId}>
      <header className="ua-learning-strip">
        <div><span>Governing relation</span></div>
        <div className="ua-headline-eq"><Eq tex={model.headlineEquation.latex} /></div>
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
            <span>{showImages ? 'Reference images' : 'Main visual / manipulate the experiment'}</span>
          </div>
          <div key={`${resetNonce}-${showImages ? 'images' : 'lesson'}`} className="ua-stage-wrap">
            {showImages ? (
              <LessonImageGallery images={lessonImages} lessonName={animation.name} />
            ) : children}
          </div>
        </main>

        <LearningCards cards={model.learningCards} />
      </div>

      <section className="ua-control-bench" aria-label="Lesson controls and references">
        <div className="ua-control-bench-label"><span>What changes if…</span><small>Controls / references</small></div>
        <MathControls
          model={model}
          hasImages={lessonImages.length > 0}
          showImages={showImages}
          onReset={resetStage}
          onFocusStage={focusStage}
          onToggleImages={() => setShowImages((value) => !value)}
        />
      </section>
    </div>
  );
}
