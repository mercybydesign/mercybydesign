import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

const REGIONS_LIST = ['Africa', 'South Asia', 'Southeast Asia', 'Middle East', 'Europe', 'Americas'];

export function HajjModule() {
  const [inIhram, setInIhram] = useState(true);
  const [pilgrimsMillions, setPilgrimsMillions] = useState(2.0);

  const stats = useMemo(() => {
    const visibleStatusGap = inIhram ? 0 : 88;
    const crossCulturalTies = Math.round(pilgrimsMillions * (inIhram ? 14 : 4));
    const empathyRipple = Math.round(pilgrimsMillions * (inIhram ? 42 : 12));
    return { visibleStatusGap, crossCulturalTies, empathyRipple };
  }, [inIhram, pilgrimsMillions]);

  const dots = useMemo(() => {
    const items = [];
    const colors = ['#1b4332', '#9a7432', '#b54534', '#2d6a4f', '#6b705c', '#3d5a80'];
    for (let i = 0; i < 48; i++) {
      const row = Math.floor(i / 12);
      const col = i % 12;
      items.push({
        id: i,
        x: 55 + col * 42,
        y: 38 + row * 40,
        tierColor: colors[i % colors.length],
        size: inIhram ? 11 : 7 + (i % 4) * 3.5,
      });
    }
    return items;
  }, [inIhram]);

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">HAJJ — GLOBAL PILGRIMAGE &amp; HUMAN EQUALITY</span>
            <h2>
              “O humanity, indeed We have created you from male and female and made you peoples and tribes that you may know one another.”{' '}
              <span className="verse-ref">— Qur’an 49:13</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>The Ihram Equalizer</h3>
            <p>
              Billionaires and laborers stand shoulder-to-shoulder in two simple white garments—visually erasing class, nationality, and status markers.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Prejudice Reduction at Scale</h3>
            <p>
              Millions from 160+ nations share meals, hardship, and worship together—a living embodiment of intergroup contact theory.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Global Empathy Ripple</h3>
            <p>
              Pilgrims return home with lived awareness of the wider human family, strengthening cross-border charity, hospitality, and civic solidarity.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Gathering Controls</h2>

          <div className="control-group">
            <label><span>State of Gathering</span></label>
            <div className="toggle-row">
              <button
                className={!inIhram ? 'active' : ''}
                onClick={() => setInIhram(false)}
              >
                Everyday Status
              </button>
              <button
                className={inIhram ? 'active' : ''}
                onClick={() => setInIhram(true)}
              >
                In Ihram (Hajj)
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>
              <span>Annual Pilgrims</span>
              <strong>{pilgrimsMillions.toFixed(1)}M</strong>
            </label>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.5"
              value={pilgrimsMillions}
              onChange={(e) => setPilgrimsMillions(Number(e.target.value))}
            />
          </div>

          <p className="subtitle" style={{ marginTop: '12px', fontSize: '0.85rem' }}>
            Regions represented: {REGIONS_LIST.join(' • ')}
          </p>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Visible Class / Status Gap</span>
              <span className="kpi-value">{stats.visibleStatusGap}%</span>
              <span className="kpi-sub pos">
                {inIhram ? 'Equal white Ihram for all' : 'Stratified by wealth & rank'}
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Cross-Cultural Encounters</span>
              <span className="kpi-value">{stats.crossCulturalTies}M</span>
              <span className="kpi-sub">Shared worship across 160+ nations</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Home-Community Ripple</span>
              <span className="kpi-value">{stats.empathyRipple}M</span>
              <span className="kpi-sub">Family &amp; neighbors reached on return</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>
                {inIhram
                  ? 'In Ihram: Equal Dignity Across Every Nation & Wealth Tier'
                  : 'Everyday World: Visible Stratification by Status & Origin'}
              </h3>
            </div>
            <svg viewBox="0 0 580 190" className="chart-svg">
              {dots.map((d) => (
                <circle
                  key={d.id}
                  cx={d.x}
                  cy={d.y}
                  r={d.size}
                  fill={inIhram ? '#faf7f2' : d.tierColor}
                  stroke={inIhram ? '#1b4332' : 'none'}
                  strokeWidth={inIhram ? 2.2 : 0}
                  style={{ transition: 'all 0.35s ease' }}
                />
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Visual conceptual model illustrating how the uniform Ihram dress code and shared rites of Hajj erase visible status hierarchies and foster cross-cultural unity."
        assumptions={[
          'Cross-cultural encounter and ripple figures are illustrative order-of-magnitude estimates scaling with annual pilgrim counts (~2M pre-pandemic/recent averages).',
          'Focuses on the sociological and spiritual impact of equality and intergroup contact.',
        ]}
        sources={[
          {
            label: 'Qur’an 49:13 & 22:27',
            detail: 'Human diversity created for mutual recognition, and the universal call to pilgrimage.',
          },
          {
            label: 'Clingingsmith, Khwaja & Kremer (QJE, 2009)',
            detail: '“Estimating the Impact of the Hajj: Religion and Tolerance in Islam’s Global Gathering” — empirical Harvard/MIT study finding Hajj increases belief in equality, harmony, and peace across ethnic and religious groups.',
          },
        ]}
      />
    </div>
  );
}
