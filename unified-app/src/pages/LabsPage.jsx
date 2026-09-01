import React from 'react';
import { Link } from 'react-router-dom';
import CodeFixLab from '../labs/code-fix/CodeFixLab';
import { LESSON_CODE_LAB_GROUPS } from '../labs/lesson-code/lessonCodeLabs.js';
import { categories } from '../data/animations';

export default function LabsPage() {
  const [query, setQuery] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('all');
  const [selectedLessonId, setSelectedLessonId] = React.useState(
    LESSON_CODE_LAB_GROUPS[0]?.lessonId || '',
  );

  const filteredGroups = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return LESSON_CODE_LAB_GROUPS.filter((group) => {
      const categoryMatches = categoryId === 'all' || group.categoryId === categoryId;
      const textMatches =
        normalizedQuery === '' ||
        group.lessonName.toLowerCase().includes(normalizedQuery) ||
        group.lessonId.toLowerCase().includes(normalizedQuery) ||
        group.categoryName.toLowerCase().includes(normalizedQuery);

      return categoryMatches && textMatches;
    });
  }, [categoryId, query]);

  React.useEffect(() => {
    if (filteredGroups.some((group) => group.lessonId === selectedLessonId)) return;
    setSelectedLessonId(filteredGroups[0]?.lessonId || '');
  }, [filteredGroups, selectedLessonId]);

  const selectedGroup =
    filteredGroups.find((group) => group.lessonId === selectedLessonId) ||
    filteredGroups[0] ||
    null;

  return (
    <div className="ua-animation-page ua-labs-page-container">
      <header className="ua-animation-header">
        <div className="ds-eyebrow">
          <Link to="/">Catalog</Link>
          <span className="sep">/</span>
          <span>Code labs</span>
          <span className="right">{LESSON_CODE_LAB_GROUPS.length} lessons with labs</span>
        </div>
        <h1 className="ds-title">Code Labs</h1>
        <p className="ds-subtitle">
          Rustlings-style exercises for every active lesson in the catalog.
        </p>
      </header>

      <section className="ds-panel ua-labs-browser">
        <div className="ua-labs-controls">
          <label>
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a lesson"
            />
          </label>
          <label>
            <span>Category</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="ua-labs-layout">
          <aside className="ua-labs-list" aria-label="Lesson labs">
            {filteredGroups.map((group) => (
              <button
                key={group.lessonId}
                type="button"
                className={group.lessonId === selectedGroup?.lessonId ? 'active' : ''}
                onClick={() => setSelectedLessonId(group.lessonId)}
              >
                <strong>{group.groupNumber}. {group.lessonName}</strong>
                <span>{group.categoryName}</span>
              </button>
            ))}
            {filteredGroups.length === 0 && (
              <p>No labs match the current filters.</p>
            )}
          </aside>

          <div className="ua-labs-runner">
            {selectedGroup ? (
              <>
                <div className="ua-labs-selected-head">
                  <div>
                    <span>{selectedGroup.categoryName}</span>
                    <h2>{selectedGroup.lessonName}</h2>
                  </div>
                  <Link to={`/animation/${selectedGroup.lessonId}`}>Open lesson</Link>
                </div>
                <CodeFixLab
                  key={selectedGroup.lessonId}
                  exercises={selectedGroup.exercises}
                  progressScopeId={selectedGroup.lessonId}
                />
              </>
            ) : (
              <div className="ds-panel ua-placeholder">
                <div className="ds-panel-body">Choose a lesson lab.</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
