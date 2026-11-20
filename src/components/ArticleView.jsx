import React from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

export function ArticleView({ article }) {
  if (!article) return null;

  return (
    <article className="module-wrap article-view">
      <header className="wisdom-banner">
        <span className="wisdom-eyebrow">
          {article.eyebrow || 'RESEARCH BRIEF & FINDINGS'}
        </span>
        <h2>{article.title}</h2>
        {article.author && (
          <p className="article-meta">
            By <strong>{article.author}</strong>
            {article.date ? ` • ${article.date}` : ''}
          </p>
        )}
        {article.lead && <p className="about-lead">{article.lead}</p>}

        {article.keyFindings?.length > 0 && (
          <div className="wisdom-grid">
            {article.keyFindings.map((item, idx) => (
              <div key={idx} className="wisdom-item">
                <div className="wisdom-num">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {article.sections?.length > 0 && (
        <div className="article-body">
          {article.sections.map((sec, idx) => (
            <section key={idx} className="article-section">
              <h3>{sec.heading}</h3>
              {sec.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      )}

      <MethodologyDrawer
        modelType={article.modelType || 'empirical'}
        summary={
          article.methodologySummary ||
          'Editorial research brief synthesizing peer-reviewed findings and classical Islamic sources.'
        }
        assumptions={article.assumptions || []}
        sources={article.sources || []}
      />
    </article>
  );
}
