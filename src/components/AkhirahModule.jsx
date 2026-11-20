import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

export function AkhirahModule() {
  const [oversight, setOversight] = useState(25); // % of daily actions observable by law/cameras
  const [accountability, setAccountability] = useState(80); // % internal Akhirah accountability
  const [temptation, setTemptation] = useState(60); // short-term temptation pressure

  const sim = useMemo(() => {
    const pts = [];
    for (let o = 0; o <= 100; o += 10) {
      const unobserved = (100 - o) / 100;
      const tempFactor = temptation / 100;

      // Without internal accountability: honesty drops sharply when unobserved
      const honestyExternalOnly = Math.max(
        12,
        Math.min(98, o * 0.92 + (100 - o) * (0.42 - tempFactor * 0.28))
      );

      // With Akhirah accountability: high honesty even when completely unobserved
      const internalBoost = (accountability / 100) * (0.58 + tempFactor * 0.22);
      const honestyWithAkhirah = Math.max(
        20,
        Math.min(98, honestyExternalOnly + unobserved * 100 * internalBoost)
      );

      pts.push({ o, honestyExternalOnly, honestyWithAkhirah });
    }

    const currentUnobs = (100 - oversight) / 100;
    const tempFactor = temptation / 100;
    const extNow = Math.max(
      12,
      Math.min(98, oversight * 0.92 + (100 - oversight) * (0.42 - tempFactor * 0.28))
    );
    const akhNow = Math.max(
      20,
      Math.min(
        98,
        extNow + currentUnobs * 100 * (accountability / 100) * (0.58 + tempFactor * 0.22)
      )
    );
    const trustGain = Math.max(0, akhNow - extNow);
    const policingSaved = Math.round(trustGain * 0.85);

    return { pts, extNow, akhNow, trustGain, policingSaved };
  }, [oversight, accountability, temptation]);

  const width = 580;
  const height = 220;
  const pad = { top: 24, right: 20, bottom: 32, left: 46 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const xScale = (o) => pad.left + (o / 100) * innerW;
  const yScale = (v) => pad.top + innerH - (v / 100) * innerH;

  const extPath = sim.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.o).toFixed(1)} ${yScale(p.honestyExternalOnly).toFixed(1)}`)
    .join(' ');
  const akhPath = sim.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.o).toFixed(1)} ${yScale(p.honestyWithAkhirah).toFixed(1)}`)
    .join(' ');

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">AKHIRAH — BELIEF IN THE DAY OF JUDGEMENT</span>
            <h2>
              “So whoever does an atom’s weight of good will see it, and whoever does an atom’s weight of evil will see it.”{' '}
              <span className="verse-ref">— Qur’an 99:7–8</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Integrity When Nobody Is Watching</h3>
            <p>
              No legal system can police every private contract, family interaction, or quiet act of kindness. Belief in ultimate accountability builds an internal moral compass.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>High-Trust, Low-Friction Society</h3>
            <p>
              When citizens believe every injustice will be answered, societies spend far less on surveillance, litigation, and fraud prevention—and more on productive trust.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Hope for the Oppressed</h3>
            <p>
              Even when earthly courts fail, the Day of Judgement assures victims that no sacrifice or wrong is forgotten—preventing despair and cycles of vengeance.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Accountability Controls</h2>

          <div className="control-group">
            <label>
              <span>External Oversight / Policing</span>
              <strong>{oversight}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={oversight}
              onChange={(e) => setOversight(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Belief in Ultimate Accountability</span>
              <strong>{accountability}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={accountability}
              onChange={(e) => setAccountability(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Short-Term Temptation / Gain</span>
              <strong>{temptation}%</strong>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={temptation}
              onChange={(e) => setTemptation(Number(e.target.value))}
            />
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Social Trust &amp; Honesty Index</span>
              <span className="kpi-value">{sim.akhNow.toFixed(0)}%</span>
              <span className="kpi-sub pos">+{sim.trustGain.toFixed(0)} pts vs. policing alone</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Policing-Only Honesty</span>
              <span className="kpi-value" style={{ color: '#b54534' }}>
                {sim.extNow.toFixed(0)}%
              </span>
              <span className="kpi-sub">At {oversight}% external oversight</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Monitoring Friction Avoided</span>
              <span className="kpi-value">{sim.policingSaved}%</span>
              <span className="kpi-sub">Less surveillance &amp; legal overhead</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>Honesty &amp; Trust vs. External Surveillance Coverage</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#b54534' }} /> External Policing Only
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#1b4332' }} /> With Akhirah Accountability
                </span>
              </div>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              {[25, 50, 75, 100].map((v) => (
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
                    {v}%
                  </text>
                </g>
              ))}
              <line
                x1={xScale(oversight)}
                x2={xScale(oversight)}
                y1={pad.top}
                y2={height - pad.bottom}
                stroke="#9a7432"
                strokeDasharray="4 3"
              />
              <path d={extPath} fill="none" stroke="#b54534" strokeWidth="2.4" strokeDasharray="5 4" />
              <path d={akhPath} fill="none" stroke="#1b4332" strokeWidth="2.8" />
              {[0, 25, 50, 75, 100].map((o) => (
                <text key={o} x={xScale(o)} y={height - 8} textAnchor="middle" className="axis-label">
                  {o}% Oversight
                </text>
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Behavioral-ethics model comparing compliance under external surveillance alone versus internalized moral accountability (Akhirah)."
        assumptions={[
          'Honesty index is a stylized function of observability, temptation, and internalized accountability—intended to illustrate the economics of high-trust societies.',
          'Real-world societies combine both legal institutions and moral norms; this model isolates the gap where formal oversight cannot reach.',
        ]}
        sources={[
          {
            label: 'Qur’an 99:7–8 & 4:135',
            detail: 'Complete accountability for every atom’s weight of good or evil, and standing firmly for justice even against oneself.',
          },
          {
            label: 'Trust & Institutional Economics',
            detail: 'Research on social trust (e.g., Fukuyama; Arrow; Norenzayan on prosocial moralizing norms) highlights how internalized ethics lower transaction and enforcement costs.',
          },
        ]}
      />
    </div>
  );
}
