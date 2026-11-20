import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

const HOUSEHOLD_COUNT = 20;

export function CommunityModule() {
  const [careLevel, setCareLevel] = useState(70); // 0 = isolated suburb, 100 = active neighbor rights
  const [crisisCount, setCrisisCount] = useState(3); // households facing sudden hardship

  const network = useMemo(() => {
    const cx = 210;
    const cy = 130;
    const rx = 155;
    const ry = 95;

    const nodes = Array.from({ length: HOUSEHOLD_COUNT }, (_, i) => {
      const angle = (i / HOUSEHOLD_COUNT) * Math.PI * 2 - Math.PI / 2;
      const inCrisis = i < crisisCount;
      return {
        id: i,
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        inCrisis,
      };
    });

    // Build deterministic neighbor & family ties based on careLevel
    const edges = [];
    const maxStep = careLevel < 20 ? 0 : careLevel < 45 ? 1 : careLevel < 75 ? 2 : 3;
    for (let i = 0; i < HOUSEHOLD_COUNT; i++) {
      for (let step = 1; step <= maxStep; step++) {
        const j = (i + step) % HOUSEHOLD_COUNT;
        if (i < j || step === 1) {
          edges.push({ from: nodes[i], to: nodes[j] });
        }
      }
      // Cross-neighborhood family ties (Silat al-Rahim) at higher care levels
      if (careLevel >= 55 && i % 3 === 0) {
        const kin = (i + 7) % HOUSEHOLD_COUNT;
        edges.push({ from: nodes[i], to: nodes[kin], isFamily: true });
      }
    }

    const lonelinessRate = Math.max(4, Math.round(58 - careLevel * 0.54));
    const crisisCoveredPct = Math.min(100, Math.round(careLevel * 1.15));
    const recoveryWeeks = Math.max(2, Math.round(24 - careLevel * 0.21));

    return { nodes, edges, lonelinessRate, crisisCoveredPct, recoveryWeeks };
  }, [careLevel, crisisCount]);

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">SILAT AL-RAHIM &amp; NEIGHBOR RIGHTS</span>
            <h2>
              “He is not a believer whose stomach is filled while the neighbor to his side goes hungry.”{' '}
              <span className="verse-ref">— Al-Adab Al-Mufrad</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Antidote to the Loneliness Epidemic</h3>
            <p>
              Regularly checking on relatives (<em>Silat al-Rahim</em>) and greeting neighbors creates a living web of belonging that lowers depression and isolation.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>First-Line Community Safety Net</h3>
            <p>
              When illness or job loss strikes, connected neighbors share meals, childcare, and interest-free help before a family ever falls into crisis.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>High-Trust Society</h3>
            <p>
              Neighborhoods where people know and protect one another experience lower crime, stronger youth mentorship, and dignified elder care.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Neighborhood Parameters</h2>

          <div className="control-group">
            <label>
              <span>Neighbor &amp; Family Care Level</span>
              <strong>{careLevel}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={careLevel}
              onChange={(e) => setCareLevel(Number(e.target.value))}
            />
            <small>0% = isolated modern street • 100% = active neighbor &amp; family ties</small>
          </div>

          <div className="control-group">
            <label>
              <span>Households Facing Sudden Crisis</span>
              <strong>{crisisCount} of {HOUSEHOLD_COUNT}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={crisisCount}
              onChange={(e) => setCrisisCount(Number(e.target.value))}
            />
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Chronic Loneliness Rate</span>
              <span className="kpi-value">{network.lonelinessRate}%</span>
              <span className="kpi-sub pos">Down from ~58% in isolated neighborhoods</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Crisis Needs Covered Locally</span>
              <span className="kpi-value">{network.crisisCoveredPct}%</span>
              <span className="kpi-sub">Meals, childcare &amp; emergency support</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Avg. Hardship Recovery</span>
              <span className="kpi-value">{network.recoveryWeeks} wks</span>
              <span className="kpi-sub">vs. ~24 weeks without community ties</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>20-Household Neighborhood Mutual-Aid Graph</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#1b4332' }} /> Connected Household
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#b54534' }} /> Household in Hardship
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#9a7432' }} /> Family Tie (Silat al-Rahim)
                </span>
              </div>
            </div>
            <svg viewBox="0 0 420 260" className="chart-svg">
              {network.edges.map((e, idx) => (
                <line
                  key={idx}
                  x1={e.from.x}
                  y1={e.from.y}
                  x2={e.to.x}
                  y2={e.to.y}
                  stroke={e.isFamily ? 'rgba(154, 116, 50, 0.55)' : 'rgba(27, 67, 50, 0.35)'}
                  strokeWidth={e.isFamily ? '1.6' : '1.2'}
                  strokeDasharray={e.isFamily ? '4 3' : undefined}
                />
              ))}

              {network.nodes.map((n) => (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.inCrisis ? 9 : 7}
                    fill={n.inCrisis ? '#b54534' : '#1b4332'}
                    stroke="#faf7f2"
                    strokeWidth="2"
                  />
                </g>
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="20-household network graph illustrating how kinship ties (Silat al-Rahim) and neighbor rights absorb localized financial or personal shocks."
        assumptions={[
          'Each node represents a household with a stylized resilience buffer; active kinship/neighbor links allow surplus households to buffer adjacent nodes in distress.',
          'Designed to visualize social-capital network effects rather than predict a specific city’s empirical welfare statistics.',
        ]}
        sources={[
          {
            label: 'Sahih al-Bukhari 6014 & 5986',
            detail: 'Neighbor rights (“Jibril kept advising me regarding the neighbor…”) and upholding ties of kinship (Silat al-Rahim).',
          },
          {
            label: 'Social Capital & Mutual Aid',
            detail: 'Research on neighborhood cohesion and informal risk-sharing networks shows faster recovery from household shocks when local trust is high.',
          },
        ]}
      />
    </div>
  );
}
