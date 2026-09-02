import React from 'react';
import { Link } from 'react-router-dom';
import { LESSON_SECTIONS, getLessonSectionPath } from '../../data/lessonSections';
import './LessonLayout.css';

export default function LessonLayout({ animation, activeSection, hasDeepDive, children }) {
  const sections = LESSON_SECTIONS.filter((section) => !section.optional || hasDeepDive);

  return (
    <div className="ua-lesson-layout">
      <div className="ua-lesson-layout-content">{children}</div>

      <aside className="ua-lesson-section-nav ds-panel" aria-label={`${animation.name} sections`}>
        <div className="ua-lesson-section-nav-head">
          <span>This lesson</span>
          <strong>{animation.name}</strong>
        </div>
        <nav className="ua-lesson-section-links" aria-label="Lesson learning modes">
          {sections.map((section, index) => {
            const selected = section.id === activeSection;
            return (
              <Link
                key={section.id}
                to={getLessonSectionPath(animation.id, section.id)}
                className={`ua-lesson-section-link${selected ? ' active' : ''}`}
                aria-current={selected ? 'page' : undefined}
              >
                <span className="ua-lesson-section-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="ua-lesson-section-copy">
                  <strong>{section.label}</strong>
                  <small>{section.description}</small>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
