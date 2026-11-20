import React, { useState } from 'react';

export function MethodologyDrawer({
  modelType = 'conceptual', // 'empirical' | 'conceptual'
  summary,
  assumptions = [],
  sources = [],
}) {
  const [open, setOpen] = useState(false);
  const isEmpirical = modelType === 'empirical';

  return (
    <section className="methodology-box" aria-label="Methodology and sources">
      <div className="methodology-header">
        <div className="methodology-meta">
          <span className={`model-badge ${isEmpirical ? 'empirical' : 'conceptual'}`}>
            {isEmpirical ? 'Data-Backed Simulation' : 'Conceptual Model'}
          </span>
          <span className="methodology-summary">{summary}</span>
        </div>
        <button
          type="button"
          className="secondary-btn methodology-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? 'Hide Methodology & Sources' : 'Methodology & Sources'}
        </button>
      </div>

      {open && (
        <div className="methodology-body">
          {assumptions.length > 0 && (
            <div className="methodology-col">
              <h4>Model Assumptions &amp; Limitations</h4>
              <ul>
                {assumptions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {sources.length > 0 && (
            <div className="methodology-col">
              <h4>Scriptural &amp; Research References</h4>
              <ul>
                {sources.map((src, i) => (
                  <li key={i}>
                    <strong>{src.label}:</strong> {src.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
