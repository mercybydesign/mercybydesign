import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

const EVENTS = [
  { day: 1, label: 'Baseline', shock: 0 },
  { day: 2, label: 'Career Win', shock: 22 },
  { day: 3, label: 'Social Criticism', shock: -28 },
  { day: 4, label: 'Financial Dip', shock: -34 },
  { day: 5, label: 'Praise & Status', shock: 24 },
  { day: 6, label: 'Personal Loss', shock: -38 },
  { day: 7, label: 'Recovery', shock: 12 },
];

export function TawhidModule() {
  const [tawakkul, setTawakkul] = useState(80); // 10–100%
  const [shockIntensity, setShockIntensity] = useState(75); // 20–100%

  const data = useMemo(() => {
    const scale = shockIntensity / 100;
    const anchorFactor = 1 - (tawakkul / 100) * 0.72;

    const pts = EVENTS.map((ev) => {
      const externalMood = Math.max(
        10,
        Math.min(95, 55 + ev.shock * scale * 1.15)
      );
      const tawhidMood = Math.max(
        35,
        Math.min(88, 72 + ev.shock * scale * anchorFactor * 0.65)
      );
      return { ...ev, externalMood, tawhidMood };
    });

    const extRange =
      Math.max(...pts.map((p) => p.externalMood)) -
      Math.min(...pts.map((p) => p.externalMood));
    const tawRange =
      Math.max(...pts.map((p) => p.tawhidMood)) -
      Math.min(...pts.map((p) => p.tawhidMood));
    const stabilityGain = Math.round(((extRange - tawRange) / Math.max(1, extRange)) * 100);

    return { pts, extRange, tawRange, stabilityGain };
  }, [tawakkul, shockIntensity]);

  const width = 580;
  const height = 220;
  const pad = { top: 24, right: 20, bottom: 34, left: 46 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const xScale = (idx) => pad.left + (idx / (EVENTS.length - 1)) * innerW;
  const yScale = (v) => pad.top + innerH - (v / 100) * innerH;

  const extPath = data.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(p.externalMood).toFixed(1)}`)
    .join(' ');
  const tawPath = data.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(p.tawhidMood).toFixed(1)}`)
    .join(' ');

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">TAWHID — BELIEF IN ONE ALLAH</span>
            <h2>
              “Say: He is Allah, the One.”{' '}
              <span className="verse-ref">— Qur’an 112:1</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Liberation from False Anchors</h3>
            <p>
              When identity is tied to wealth, followers, or status, every market swing or criticism destabilizes the heart. <em>Tawhid</em> anchors worth to One unchanging Creator.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Grounded Resilience (Tawakkul)</h3>
            <p>
              Effort remains a duty, while outcomes are entrusted to Allah—reducing chronic anxiety during hardship and preventing arrogance during success.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Universal Human Dignity</h3>
            <p>
              If all people are created by One God, no race, class, or tribe holds inherent superiority—laying the moral foundation for justice and mercy.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Resilience Controls</h2>

          <div className="control-group">
            <label>
              <span>Trust &amp; God-Consciousness (Tawakkul)</span>
              <strong>{tawakkul}%</strong>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={tawakkul}
              onChange={(e) => setTawakkul(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Life Shock Intensity</span>
              <strong>{shockIntensity}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={shockIntensity}
              onChange={(e) => setShockIntensity(Number(e.target.value))}
            />
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Emotional Volatility Reduced</span>
              <span className="kpi-value">{data.stabilityGain}%</span>
              <span className="kpi-sub pos">Steadier through highs &amp; lows</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">External-Anchor Swing</span>
              <span className="kpi-value" style={{ color: '#b54534' }}>
                {data.extRange.toFixed(0)} pts
              </span>
              <span className="kpi-sub">Tied to status &amp; approval</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Tawhid-Anchored Swing</span>
              <span className="kpi-value" style={{ color: '#1b4332' }}>
                {data.tawRange.toFixed(0)} pts
              </span>
              <span className="kpi-sub">Grounded in purpose &amp; trust</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>Inner Stability Across Life’s Highs &amp; Lows</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#b54534' }} /> External Validation Anchor
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#1b4332' }} /> Tawhid &amp; Tawakkul Anchor
                </span>
              </div>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              {[20, 50, 80].map((v) => (
                <g key={v}>
                  <line
                    x1={pad.left}
                    x2={width - pad.right}
                    y1={yScale(v)}
                    y2={yScale(v)}
                    stroke="rgba(100,95,85,0.15)"
                    strokeDasharray="3 3"
                  />
                  <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" className="axis-label">
                    {v}
                  </text>
                </g>
              ))}
              <path d={extPath} fill="none" stroke="#b54534" strokeWidth="2.4" strokeDasharray="5 4" />
              <path d={tawPath} fill="none" stroke="#1b4332" strokeWidth="2.8" />
              {data.pts.map((p, i) => (
                <text key={p.label} x={xScale(i)} y={height - 8} textAnchor="middle" className="axis-label">
                  {p.label.split(' ')[0]}
                </text>
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Conceptual psychological-resilience model illustrating how an intrinsic, transcendent anchor dampens emotional volatility compared to external validation."
        assumptions={[
          'Stability scores (0–100) are illustrative heuristics showing relative dampening of highs and lows, not clinical psychiatric measurements.',
          'Assumes active Tawakkul (effort paired with trust), not fatalism or passivity.',
        ]}
        sources={[
          {
            label: 'Qur’an 112:1–4 & 65:3',
            detail: 'Oneness of Allah (Tawhid) and sufficiency for those who place their trust in Him (Tawakkul).',
          },
          {
            label: 'Intrinsic Purpose & Resilience Research',
            detail: 'Psychological studies consistently link intrinsic meaning and secure spiritual attachment with lower anxiety and greater resilience under adversity (e.g., Koenig, ISRN Psychiatry 2012).',
          },
        ]}
      />
    </div>
  );
}
