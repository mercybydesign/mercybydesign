import React from 'react';
import { TOPICS } from '../studies/registry';
import { ArticleView } from './ArticleView';

export function TopicShell({ topic, activeStudyId, onSelectStudy }) {
  const studies = topic.studies || [];
  const activeStudy =
    studies.find((s) => s.id === activeStudyId) || studies[0];

  if (!activeStudy) return null;

  const StudyComponent = activeStudy.component;
  const currentIdx = TOPICS.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIdx > 0 ? TOPICS[currentIdx - 1] : null;
  const nextTopic =
    currentIdx >= 0 && currentIdx < TOPICS.length - 1
      ? TOPICS[currentIdx + 1]
      : null;

  return (
    <div className="topic-shell">
      <nav className="topic-breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="breadcrumb-link"
          onClick={() => onSelectStudy('home')}
        >
          ← All Studies
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-cat">{topic.category}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">
          {topic.num}. {topic.title}
        </span>
      </nav>

      {studies.length > 1 && (
        <div
          className="subtab-bar"
          role="tablist"
          aria-label={`${topic.title} studies`}
        >
          {studies.map((study, idx) => (
            <button
              key={study.id}
              role="tab"
              aria-selected={study.id === activeStudy.id}
              className={study.id === activeStudy.id ? 'active' : ''}
              onClick={() => onSelectStudy(topic.id, study.id)}
            >
              {idx + 1}. {study.title}
            </button>
          ))}
        </div>
      )}

      {activeStudy.article ? (
        <ArticleView article={activeStudy.article} />
      ) : (
        <StudyComponent />
      )}

      <footer className="topic-pager" aria-label="Study navigation">
        {prevTopic ? (
          <button
            type="button"
            className="pager-btn prev"
            onClick={() => onSelectStudy(prevTopic.id)}
          >
            <span className="pager-label">← Previous Principle</span>
            <strong>
              {prevTopic.num}. {prevTopic.title}
            </strong>
          </button>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <button
            type="button"
            className="pager-btn next"
            onClick={() => onSelectStudy(nextTopic.id)}
          >
            <span className="pager-label">Next Principle →</span>
            <strong>
              {nextTopic.num}. {nextTopic.title}
            </strong>
          </button>
        ) : (
          <div />
        )}
      </footer>
    </div>
  );
}
