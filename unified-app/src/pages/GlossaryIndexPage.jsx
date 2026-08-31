import React from 'react';
import { Link } from 'react-router-dom';
import { getGlossaryTermsGroupedByCategory, glossaryTerms } from '../data/glossaryRepository.js';

export default function GlossaryIndexPage() {
  const groups = getGlossaryTermsGroupedByCategory();

  return (
    <main className="ua-glossary-page">
      <Link to="/" className="ua-back-link">
        ← Back to index
      </Link>

      <section className="ds-header">
        <div className="ds-eyebrow">
          <span>Glossary</span>
          <span className="sep">/</span>
          <span>{glossaryTerms.length} terms</span>
        </div>
        <h1 className="ds-title">Machine learning glossary</h1>
        <p className="ds-subtitle">
          Browse definitions, intuition, and concept graphs for terms used across the catalog.
          Each entry links to related lessons and commonly confused concepts.
        </p>
      </section>

      {groups.map(({ category, terms }) => (
        <section key={category} className="ua-glossary-panel">
          <div className="ua-glossary-head">
            <span>{category}</span>
            <h2>{terms.length} terms</h2>
          </div>
          <div className="ua-glossary-grid">
            {terms.map((term) => (
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
        </section>
      ))}
    </main>
  );
}
