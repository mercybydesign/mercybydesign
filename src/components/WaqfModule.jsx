import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';
import { formatCurrency } from '../simulation/zakatEngine';

export function WaqfModule() {
  const [initialGift, setInitialGift] = useState(500000);
  const [returnRate, setReturnRate] = useState(6.0);
  const [payoutRate, setPayoutRate] = useState(4.0);
  const [horizon, setHorizon] = useState(50);

  const sim = useMemo(() => {
    let principal = initialGift;
    let cumulativePayout = 0;
    const timeline = [{ year: 0, principal, cumulativePayout }];

    for (let y = 1; y <= horizon; y++) {
      const growth = principal * (returnRate / 100);
      const payout = principal * (payoutRate / 100);
      principal = Math.max(0, principal + growth - payout);
      cumulativePayout += payout;
      timeline.push({ year: y, principal, cumulativePayout });
    }

    const final = timeline[timeline.length - 1];
    return {
      timeline,
      finalPrincipal: final.principal,
      totalFunded: final.cumulativePayout,
      multiplier: final.cumulativePayout / Math.max(1, initialGift),
      scholarships: Math.round(final.cumulativePayout / 5000),
      clinicVisits: Math.round(final.cumulativePayout / 75),
    };
  }, [initialGift, returnRate, payoutRate, horizon]);

  const width = 560;
  const height = 220;
  const pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxY = Math.max(
    initialGift * 2,
    ...sim.timeline.map((d) => Math.max(d.principal, d.cumulativePayout))
  );
  const xScale = (yr) => pad.left + (yr / horizon) * innerW;
  const yScale = (val) => pad.top + innerH - (val / maxY) * innerH;

  const payoutPath = sim.timeline
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year).toFixed(1)} ${yScale(d.cumulativePayout).toFixed(1)}`)
    .join(' ');
  const principalPath = sim.timeline
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year).toFixed(1)} ${yScale(d.principal).toFixed(1)}`)
    .join(' ');

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">WAQF — PERPETUAL ENDOWMENTS (SADAQAH JARIYAH)</span>
            <h2>
              “When a person dies, their deeds end except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for them.”{' '}
              <span className="verse-ref">— Sahih Muslim</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Principal Preserved Forever</h3>
            <p>
              Unlike one-time spending, a <em>Waqf</em> locks the core asset in trust so only its yield is spent—funding schools, hospitals, and clean water for centuries.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Debt-Free Public Goods</h3>
            <p>
              Historically, Islamic civilizations built free universities (like Al-Qarawiyyin), public hospitals, and water fountains entirely through community Waqf—without government debt.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Intergenerational Legacy</h3>
            <p>
              Over {horizon} years, a single endowment multiplies its impact many times over while leaving an even stronger fund for grandchildren.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Endowment Parameters</h2>

          <div className="control-group">
            <label>
              <span>Initial Waqf Principal</span>
              <strong>{formatCurrency(initialGift)}</strong>
            </label>
            <input
              type="range"
              min="25000"
              max="5000000"
              step="25000"
              value={initialGift}
              onChange={(e) => setInitialGift(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Annual Asset Yield</span>
              <strong>{returnRate.toFixed(1)}%</strong>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Annual Community Payout</span>
              <strong>{payoutRate.toFixed(1)}%</strong>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={payoutRate}
              onChange={(e) => setPayoutRate(Number(e.target.value))}
            />
            <small>Keeping payout below yield lets the endowment grow perpetually.</small>
          </div>

          <div className="control-group">
            <label>
              <span>Generational Horizon</span>
              <strong>{horizon} Years</strong>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
            />
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Total Community Aid Funded</span>
              <span className="kpi-value">{formatCurrency(sim.totalFunded)}</span>
              <span className="kpi-sub pos">{sim.multiplier.toFixed(1)}× the original gift</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Remaining Principal (Yr {horizon})</span>
              <span className="kpi-value">{formatCurrency(sim.finalPrincipal)}</span>
              <span className="kpi-sub">Still intact for future generations</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Public Goods Equivalent</span>
              <span className="kpi-value">{sim.scholarships.toLocaleString()}</span>
              <span className="kpi-sub">Scholarships (or {sim.clinicVisits.toLocaleString()} clinic visits)</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>{horizon}-Year Waqf Compounding vs. One-Time Gift</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#1b4332' }} /> Cumulative Aid Funded
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#9a7432' }} /> Endowment Principal
                </span>
              </div>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                const v = maxY * t;
                return (
                  <g key={i}>
                    <line
                      x1={pad.left}
                      x2={width - pad.right}
                      y1={yScale(v)}
                      y2={yScale(v)}
                      stroke="rgba(100,95,85,0.15)"
                      strokeDasharray="3 3"
                    />
                    <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" className="axis-label">
                      {formatCurrency(v)}
                    </text>
                  </g>
                );
              })}

              {/* One-time charity flat baseline */}
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={yScale(initialGift)}
                y2={yScale(initialGift)}
                stroke="#b54534"
                strokeWidth="1.6"
                strokeDasharray="4 4"
              />

              <path d={principalPath} fill="none" stroke="#9a7432" strokeWidth="2.4" />
              <path d={payoutPath} fill="none" stroke="#1b4332" strokeWidth="2.8" />

              {[0, Math.round(horizon / 2), horizon].map((yr) => (
                <text key={yr} x={xScale(yr)} y={height - 6} textAnchor="middle" className="axis-label">
                  Yr {yr}
                </text>
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Long-horizon endowment compounding model contrasting a one-time charitable gift with a perpetual Waqf that preserves principal."
        assumptions={[
          'Assumes constant real annual yield and fixed payout/reinvestment ratios over the 10–100 year horizon; real markets experience volatility and management fees.',
          'Public-goods equivalents (scholarships, clinic visits) are illustrative unit-cost conversions to make dollar totals tangible.',
        ]}
        sources={[
          {
            label: 'Sahih Muslim 1631',
            detail: 'The principle of Sadaqah Jariyah (ongoing charity) whose benefit continues across generations.',
          },
          {
            label: 'Historical Waqf Institutions',
            detail: 'Classical endowments funded universities (e.g., Al-Qarawiyyin, Al-Azhar), hospitals, water fountains, and public infrastructure for centuries.',
          },
        ]}
      />
    </div>
  );
}
