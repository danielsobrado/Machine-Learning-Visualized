import React from 'react';
import { Link } from 'react-router-dom';

export default function LessonGlossaryView({ terms = [] }) {
  if (!terms.length) {
    return (
      <section className="ds-panel ua-placeholder">
        <div className="ds-panel-body">
          <h2>Glossary</h2>
          <p>No lesson-specific glossary terms are registered yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ua-glossary-panel" aria-label="Lesson glossary">
      <div className="ua-glossary-head">
        <span>Glossary</span>
        <h2>Terms for this lesson</h2>
        <p>{terms.length} concepts connected to the current topic.</p>
      </div>
      <div className="ua-glossary-grid">
        {terms.map((term) => (
          <article key={term.id} id={`glossary-${term.slug}`}>
            {term.image?.src && <img src={term.image.src} alt={term.image.alt || term.term} />}
            <span>{term.category}</span>
            <h3>
              <Link to={term.href}>{term.term}</Link>
            </h3>
            {(term.symbol || term.aliases?.length > 0) && (
              <div className="ua-glossary-card-meta" aria-label={`${term.term} metadata`}>
                {term.symbol && term.symbol !== term.term.slice(0, 1) && <span>{term.symbol}</span>}
                {term.aliases?.slice(0, 3).map((alias) => <span key={alias}>{alias}</span>)}
                {term.aliases?.length > 3 && <span>+{term.aliases.length - 3} more</span>}
              </div>
            )}
            <p>{term.definition}</p>
            {term.intuition && <p className="ua-glossary-intuition">{term.intuition}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
