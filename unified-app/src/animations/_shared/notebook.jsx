import React from 'react';

/**
 * Notebook primitives for lesson bodies.
 *
 * Lessons were originally authored as stacks of bordered cards, which is the layout
 * that makes a page read as a dashboard. These primitives express the same content as
 * a laboratory notebook: ruled bands instead of boxes, instrument readouts instead of
 * KPI tiles, and margin notes instead of tinted callouts.
 *
 * Prefer these over raw Tailwind card markup in new lesson work. Existing lessons that
 * still use the card signatures are converted by the composition layer in index.css.
 */

/** A ruled section. The page is the container, so there is no box. */
export function Plate({ label, title, note, children, className = '' }) {
  return (
    <section className={`nb-plate ${className}`.trim()}>
      {(label || title || note) && (
        <header className="nb-plate-head">
          {label && <span className="nb-label">{label}</span>}
          {title && <h3 className="nb-title">{title}</h3>}
          {note && <p className="nb-plate-note">{note}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

/** A row of instrument readouts: mono numerals under a ruled label. */
export function Readouts({ items, columns }) {
  return (
    <div
      className="nb-readouts"
      style={columns ? { '--nb-readout-columns': columns } : undefined}
    >
      {items.map((item) => (
        <div className="nb-readout" key={item.label}>
          <span className="nb-label">{item.label}</span>
          <strong className="nb-readout-value">{item.value}</strong>
          {item.detail && <span className="nb-readout-detail">{item.detail}</span>}
        </div>
      ))}
    </div>
  );
}

/**
 * A margin note. `tone` marks what kind of remark it is, and is carried by a single
 * rule rather than a filled panel.
 */
export function Note({ tone = 'neutral', label, title, children }) {
  return (
    <aside className={`nb-note is-${tone}`}>
      {label && <span className="nb-label">{label}</span>}
      {title && <strong className="nb-note-title">{title}</strong>}
      <div className="nb-note-body">{children}</div>
    </aside>
  );
}

/** Notes set side by side, separated by rules rather than gaps between cards. */
export function NoteRow({ children }) {
  return <div className="nb-note-row">{children}</div>;
}

/** The parameter bench: what the reader can change, and what it currently reads. */
export function ControlBench({ label = 'Controls', children, actions }) {
  return (
    <section className="nb-bench">
      <div className="nb-bench-head">
        <span className="nb-label">{label}</span>
        {actions}
      </div>
      <div className="nb-bench-controls">{children}</div>
    </section>
  );
}

export function Slider({ label, value, min, max, step, onChange, format, help }) {
  return (
    <label className="nb-slider">
      <span className="nb-slider-head">
        <span>{label}</span>
        <b>{format ? format(value) : value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {help && <small>{help}</small>}
    </label>
  );
}

/** A labelled bar, drawn as a ruled track rather than a pill. */
export function BarTrack({ label, value, width, tone = 'accent' }) {
  return (
    <div className="nb-bar">
      <span className="nb-bar-head">
        <span>{label}</span>
        <b>{value}</b>
      </span>
      <span className={`nb-bar-track is-${tone}`}>
        <i style={{ width: `${Math.min(100, Math.max(0, width))}%` }} />
      </span>
    </div>
  );
}

/** A numbered reasoning step, marked pass or open in the margin. */
export function Steps({ items }) {
  return (
    <ol className="nb-steps">
      {items.map((step, index) => (
        <li key={step.title} className={step.pass ? 'is-pass' : 'is-open'}>
          <span className="nb-step-mark" aria-hidden="true">{step.pass ? '×' : '·'}</span>
          <span className="nb-label">Step {String(index + 1).padStart(2, '0')}</span>
          <strong>{step.title}</strong>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Formula({ lines }) {
  return (
    <div className="nb-formula">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}
