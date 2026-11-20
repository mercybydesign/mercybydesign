import React, { useState, useMemo } from 'react';
import { TOPICS } from '../studies/registry';

export function HomePage({ onSelectModule }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(TOPICS.map((t) => t.category)))],
    []
  );

  const totalStudies = useMemo(
    () => TOPICS.reduce((sum, t) => sum + t.studies.length, 0),
    []
  );

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOPICS.filter((topic) => {
      if (selectedCategory !== 'All' && topic.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        topic.title,
        topic.subtitle,
        topic.category,
        topic.scope,
        topic.verse,
        ...topic.studies.map((s) => s.title),
        ...(topic.plannedStudies || []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedCategory, query]);

  return (
    <div className="home-wrap">
      {/* Compact Editorial Hero */}
      <section className="hero-card" style={{ padding: '28px 30px' }}>
        <span className="wisdom-eyebrow">OPEN-SOURCE INTERACTIVE ISLAMIC WISDOM LAB</span>
        <h2 className="hero-title" style={{ marginBottom: '10px' }}>
          See How What Allah Prescribed Benefits <span className="hero-accent">All of Humanity</span>
        </h2>
        <p className="hero-sub" style={{ marginBottom: '18px' }}>
          Open-source interactive simulations, scientific study summaries, and research briefs exploring how Islamic principles benefit the <strong>individual</strong>, the <strong>family</strong>, the <strong>community</strong>, and <strong>society as a whole</strong>.
        </p>

        <div className="impact-strip" style={{ marginTop: 0 }}>
          <div className="impact-pill"><strong>Individual</strong> • Body, mind &amp; dignity</div>
          <div className="impact-pill"><strong>Family</strong> • Stability &amp; protection</div>
          <div className="impact-pill"><strong>Community</strong> • Trust &amp; mutual aid</div>
          <div className="impact-pill"><strong>Society</strong> • Justice &amp; prosperity</div>
        </div>
      </section>

      {/* Filterable Studies Directory */}
      <section className="blueprint-section">
        <div className="blueprint-header">
          <div>
            <h2>Studies Directory</h2>
            <p className="subtitle">
              Browse by Islamic principle or category. Each principle can host multiple independent open-source studies.
            </p>
          </div>
          <span className="blueprint-count">
            {TOPICS.length} Principles • {totalStudies} Live {totalStudies === 1 ? 'Study' : 'Studies'}
          </span>
        </div>

        <div className="directory-controls">
          <div className="region-pills" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`region-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            className="directory-search"
            placeholder="Search principles or studies..."
            aria-label="Search principles or studies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filteredTopics.length === 0 ? (
          <div className="directory-empty">
            No principles or studies match “{query}”.{' '}
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setSelectedCategory('All');
                setQuery('');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="blueprint-grid">
            {filteredTopics.map((topic) => (
              <article key={topic.id} className="bp-card is-live">
                <div className="bp-top">
                  <span className="bp-num">
                    {topic.num} • {topic.category}
                  </span>
                  <span className="bp-status live">
                    {topic.studies.length} Live
                  </span>
                </div>

                <h3>
                  {topic.title} — {topic.subtitle}
                </h3>
                <p className="bp-verse">{topic.verse}</p>

                <div className="bp-benefits">
                  {Object.entries(topic.benefits).map(([level, text]) => (
                    <div key={level} className="bp-ben-row">
                      <strong>{level}:</strong> <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="bp-sims">
                  <span className="bp-sims-label">Interactive Studies</span>
                  <ul>
                    {topic.studies.map((study) => (
                      <li key={study.id} className="sim-live">
                        <button
                          type="button"
                          className="study-link-btn"
                          onClick={() => onSelectModule(topic.id, study.id)}
                        >
                          ● {study.title} →
                        </button>
                      </li>
                    ))}
                    {(topic.plannedStudies || []).map((name) => (
                      <li key={name} className="sim-soon">
                        ○ {name} <em>(open to contribute)</em>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="bp-open-btn"
                  onClick={() => onSelectModule(topic.id)}
                >
                  Open {topic.title} →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
