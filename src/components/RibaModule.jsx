import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../simulation/zakatEngine';

export function RibaModule() {
  const [principal, setPrincipal] = useState(50000);
  const [apr, setApr] = useState(18);
  const [years, setYears] = useState(10);
  const [hardshipYear, setHardshipYear] = useState(3);

  const data = useMemo(() => {
    const r = apr / 100;
    const annualBasePayment = principal / years;

    // 1. Riba (Compound Interest Loan with 1 hardship year where payment is missed)
    let ribaDebt = principal;
    let ribaTotalPaid = 0;
    let ribaInterestPaid = 0;

    // 2. Qard Hasan (0% Interest Loan — hardship year simply defers payment without penalty)
    let qardDebt = principal;
    let qardTotalPaid = 0;

    const timeline = [{ year: 0, ribaDebt, qardDebt, ribaTotalPaid, qardTotalPaid }];

    for (let y = 1; y <= years + 2; y++) {
      // Riba step
      if (ribaDebt > 0) {
        const interest = ribaDebt * r;
        ribaDebt += interest;
        if (y === hardshipYear) {
          // Missed payment in hardship year -> interest compounds + late penalty
          ribaDebt += ribaDebt * 0.03;
        } else {
          // Standard amortized-like payment
          const payment = Math.min(ribaDebt, annualBasePayment * 1.45);
          ribaDebt -= payment;
          ribaTotalPaid += payment;
          ribaInterestPaid += Math.min(interest, payment);
        }
      }

      // Qard Hasan step (Qur'an 2:280: grant respite in hardship, 0% interest)
      if (qardDebt > 0) {
        if (y !== hardshipYear) {
          const payment = Math.min(qardDebt, annualBasePayment);
          qardDebt -= payment;
          qardTotalPaid += payment;
        }
      }

      timeline.push({
        year: y,
        ribaDebt: Math.max(0, ribaDebt),
        qardDebt: Math.max(0, qardDebt),
        ribaTotalPaid,
        qardTotalPaid,
      });
    }

    const final = timeline[timeline.length - 1];
    return {
      timeline,
      extraCost: Math.max(0, final.ribaTotalPaid + final.ribaDebt - principal),
      ribaRemaining: final.ribaDebt,
      qardRemaining: final.qardDebt,
      ribaTotalPaid: final.ribaTotalPaid,
      qardTotalPaid: final.qardTotalPaid,
    };
  }, [principal, apr, years, hardshipYear]);

  // SVG Chart dimensions
  const width = 560;
  const height = 220;
  const pad = { top: 20, right: 20, bottom: 30, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const maxY = Math.max(
    principal * 1.2,
    ...data.timeline.map((d) => Math.max(d.ribaDebt, d.qardDebt))
  );
  const maxYear = data.timeline[data.timeline.length - 1].year;

  const xScale = (yr) => pad.left + (yr / maxYear) * innerW;
  const yScale = (val) => pad.top + innerH - (val / maxY) * innerH;

  const ribaPath = data.timeline
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year).toFixed(1)} ${yScale(d.ribaDebt).toFixed(1)}`)
    .join(' ');
  const qardPath = data.timeline
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.year).toFixed(1)} ${yScale(d.qardDebt).toFixed(1)}`)
    .join(' ');

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">PROHIBITION OF RIBA (INTEREST-FREE FINANCE)</span>
            <h2>
              “And if someone is in hardship, then let there be postponement until a time of ease.”{' '}
              <span className="verse-ref">— Qur’an 2:280</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>No Compound Debt Traps</h3>
            <p>
              Under compound interest (<em>Riba</em>), a single medical emergency or job loss causes debt to snowball. Islam forbids profiting from another person’s hardship.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Risk-Sharing Over Exploitation</h3>
            <p>
              Instead of guaranteed interest, Islamic finance uses <em>Qard Hasan</em> (0% benevolent loans) and <em>Mudarabah</em> (profit-and-loss sharing), aligning lender and borrower.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Stronger Families &amp; Small Businesses</h3>
            <p>
              Removing interest keeps capital in households and local economies instead of extracting it upward to lenders.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Loan &amp; Hardship Parameters</h2>

          <div className="control-group">
            <label>
              <span>Amount Borrowed</span>
              <strong>{formatCurrency(principal)}</strong>
            </label>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Conventional Interest (APR)</span>
              <strong>{apr}%</strong>
            </label>
            <input
              type="range"
              min="4"
              max="30"
              step="1"
              value={apr}
              onChange={(e) => setApr(Number(e.target.value))}
            />
            <small>Typical credit cards: 20–28% • Small business loans: 10–18%</small>
          </div>

          <div className="control-group">
            <label>
              <span>Repayment Horizon</span>
              <strong>{years} Years</strong>
            </label>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Hardship / Job-Loss Year</span>
              <strong>Year {hardshipYear}</strong>
            </label>
            <input
              type="range"
              min="1"
              max={years}
              step="1"
              value={hardshipYear}
              onChange={(e) => setHardshipYear(Number(e.target.value))}
            />
            <small>Simulates 1 year of financial hardship (missed payment).</small>
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Wealth Saved by Zero Riba</span>
              <span className="kpi-value">{formatCurrency(data.extraCost)}</span>
              <span className="kpi-sub pos">Kept by the family / business</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Riba Remaining Debt (Yr {maxYear})</span>
              <span className="kpi-value" style={{ color: data.ribaRemaining > 0 ? '#f43f5e' : '#10b981' }}>
                {formatCurrency(data.ribaRemaining)}
              </span>
              <span className="kpi-sub">Total paid so far: {formatCurrency(data.ribaTotalPaid)}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Qard Hasan Remaining (Yr {maxYear})</span>
              <span className="kpi-value" style={{ color: '#10b981' }}>
                {formatCurrency(data.qardRemaining)}
              </span>
              <span className="kpi-sub">Total paid: {formatCurrency(data.qardTotalPaid)} (0% interest)</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>Remaining Debt Trajectory: Compound Riba vs. Qard Hasan</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#f43f5e' }} /> Compound Interest ({apr}% APR)
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#10b981' }} /> Qard Hasan (0% + Respite)
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
                      stroke="rgba(148,163,184,0.14)"
                      strokeDasharray="3 3"
                    />
                    <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" className="axis-label">
                      {formatCurrency(v)}
                    </text>
                  </g>
                );
              })}

              {/* Hardship year highlight */}
              <line
                x1={xScale(hardshipYear)}
                x2={xScale(hardshipYear)}
                y1={pad.top}
                y2={height - pad.bottom}
                stroke="rgba(251,191,36,0.55)"
                strokeDasharray="4 3"
              />
              <text x={xScale(hardshipYear)} y={pad.top - 5} textAnchor="middle" className="axis-label" style={{ fill: '#fbbf24' }}>
                Hardship Yr {hardshipYear}
              </text>

              <path d={ribaPath} fill="none" stroke="#f43f5e" strokeWidth="2.8" />
              <path d={qardPath} fill="none" stroke="#10b981" strokeWidth="2.8" />

              {[0, Math.round(maxYear / 2), maxYear].map((yr) => (
                <text key={yr} x={xScale(yr)} y={height - 6} textAnchor="middle" className="axis-label">
                  Yr {yr}
                </text>
              ))}
            </svg>
          </section>
        </main>
      </div>
    </div>
  );
}
