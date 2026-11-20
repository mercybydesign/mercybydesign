import React, { useState } from 'react';
import { formatCurrency, formatHouseholds } from '../simulation/zakatEngine';

// Crisp human silhouette SVG icon
function PersonIcon({ color, glow = false }) {
  return (
    <svg
      viewBox="0 0 24 36"
      className={`person-icon ${glow ? 'glow' : ''}`}
      style={{ color }}
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="4.5" fill="currentColor" />
      <path
        d="M5.5 16.5C5.5 14 7.5 12.5 12 12.5C16.5 12.5 18.5 14 18.5 16.5V24.5C18.5 25.6 17.6 26.5 16.5 26.5H15.5V33.5C15.5 34.6 14.6 35.5 13.5 35.5H10.5C9.4 35.5 8.5 34.6 8.5 33.5V26.5H7.5C6.4 26.5 5.5 25.6 5.5 24.5V16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function buildPeopleArray(snap) {
  const povertyCount = Math.round(snap.povertyRate);
  const belowNisabOnly = Math.max(0, Math.round(snap.belowNisabRate) - povertyCount);
  const top1Count = 1;
  const payerCount = Math.max(0, 100 - povertyCount - belowNisabOnly - top1Count);

  const people = [];
  for (let i = 0; i < povertyCount; i++) people.push('poverty');
  for (let i = 0; i < belowNisabOnly; i++) people.push('nisab');
  for (let i = 0; i < payerCount; i++) people.push('payer');
  for (let i = 0; i < top1Count; i++) people.push('top1');
  return people.slice(0, 100);
}

const STATUS_META = {
  poverty: { label: 'In Poverty (Al-Fuqara)', color: '#b54534' },
  nisab: { label: 'Below Gold Nisab (Al-Masakin)', color: '#c48a2b' },
  payer: { label: 'Above Nisab (Zakat Payer)', color: '#1b4332' },
  top1: { label: 'Top 1% Wealthy Payer', color: '#6b3fa0', glow: false },
};

export function HumanSocietyGrid({ zakatSnap, baselineSnap, region }) {
  const [view, setView] = useState('compare'); // 'compare' | 'zakat' | 'baseline'

  const zPeople = buildPeopleArray(zakatSnap);
  const bPeople = buildPeopleArray(baselineSnap);

  const zPov = Math.round(zakatSnap.povertyRate);
  const bPov = Math.round(baselineSnap.povertyRate);
  const zNisab = Math.max(0, Math.round(zakatSnap.belowNisabRate) - zPov);
  const bNisab = Math.max(0, Math.round(baselineSnap.belowNisabRate) - bPov);
  const perIcon = formatHouseholds(region.households / 100);

  return (
    <section className="society-card">
      <div className="society-header">
        <div>
          <h2>If {region.name === 'Entire World' ? 'the World' : region.name} Were 100 Households (Year {zakatSnap.year})</h2>
          <p className="society-sub">
            Each silhouette represents <strong>{perIcon} households</strong>. Press <strong>Play</strong> to watch households move out of poverty and above the Gold Nisab.
          </p>
        </div>
        <div className="view-toggle">
          <button className={view === 'compare' ? 'active' : ''} onClick={() => setView('compare')}>
            Side-by-Side
          </button>
          <button className={view === 'zakat' ? 'active' : ''} onClick={() => setView('zakat')}>
            With Zakat
          </button>
          <button className={view === 'baseline' ? 'active' : ''} onClick={() => setView('baseline')}>
            No Zakat
          </button>
        </div>
      </div>

      <div className="silhouette-legend">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div className="sil-legend-item" key={key}>
            <span className="sil-mini">
              <PersonIcon color={meta.color} glow={meta.glow} />
            </span>
            <span>{meta.label}</span>
          </div>
        ))}
      </div>

      <div className={`society-grids ${view === 'compare' ? 'dual' : 'single'}`}>
        {(view === 'compare' || view === 'zakat') && (
          <div className="society-panel zakat-panel">
            <div className="panel-title-row">
              <span className="badge emerald">With Universal Zakat</span>
              <span className="panel-stats">
                <strong style={{ color: '#f43f5e' }}>{zPov}</strong> in poverty •{' '}
                <strong style={{ color: '#f59e0b' }}>{zNisab}</strong> below Nisab •{' '}
                <strong style={{ color: '#10b981' }}>{100 - zPov - zNisab}</strong> above Nisab
              </span>
            </div>
            <div className="people-grid">
              {zPeople.map((status, idx) => (
                <div className="person-cell" key={idx} title={STATUS_META[status].label}>
                  <PersonIcon color={STATUS_META[status].color} glow={STATUS_META[status].glow} />
                </div>
              ))}
            </div>
          </div>
        )}

        {(view === 'compare' || view === 'baseline') && (
          <div className="society-panel baseline-panel">
            <div className="panel-title-row">
              <span className="badge slate">Baseline (No Zakat)</span>
              <span className="panel-stats">
                <strong style={{ color: '#f43f5e' }}>{bPov}</strong> in poverty •{' '}
                <strong style={{ color: '#f59e0b' }}>{bNisab}</strong> below Nisab •{' '}
                <strong style={{ color: '#10b981' }}>{100 - bPov - bNisab}</strong> above Nisab
              </span>
            </div>
            <div className="people-grid">
              {bPeople.map((status, idx) => (
                <div className="person-cell" key={idx} title={STATUS_META[status].label}>
                  <PersonIcon color={STATUS_META[status].color} glow={STATUS_META[status].glow} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ZakatFlowGraphic({ zakatSnap, region }) {
  const total = zakatSnap.totalZakatCollected || 0;
  const flows = [
    { label: 'Al-Fuqara (Poverty Relief)', amount: zakatSnap.fuqaraDistributed || 0, color: '#f43f5e' },
    { label: 'Al-Masakin (Below Nisab)', amount: zakatSnap.masakinDistributed || 0, color: '#f59e0b' },
    { label: 'Al-Gharimin (Debt Relief)', amount: zakatSnap.ghariminDistributed || 0, color: '#38bdf8' },
    { label: 'Fi Sabilillah / Community Surplus', amount: zakatSnap.surplusPublicPool || 0, color: '#a855f7' },
  ];

  return (
    <section className="flow-card">
      <div className="flow-header">
        <h3>Annual Zakat Flow (Year {zakatSnap.year})</h3>
        <span className="flow-total">
          2.5% Collected: <strong>{formatCurrency(total)}</strong>
        </span>
      </div>
      <div className="flow-diagram">
        <div className="flow-node payers">
          <div className="node-icons">
            <PersonIcon color="#c084fc" glow />
            <PersonIcon color="#10b981" />
            <PersonIcon color="#10b981" />
          </div>
          <div className="node-title">Eligible Payers</div>
          <div className="node-metric">{zakatSnap.payingRate.toFixed(1)}% of {region.shortName}</div>
        </div>

        <div className="flow-arrow">
          <span>2.5%</span>
          <div className="arrow-line" />
        </div>

        <div className="flow-node pool">
          <div className="pool-ring">{formatCurrency(total)}</div>
          <div className="node-title">{region.shortName} Zakat Pool</div>
        </div>

        <div className="flow-arrow">
          <span>Asnaf</span>
          <div className="arrow-line" />
        </div>

        <div className="flow-destinations">
          {flows.map((f) => {
            const pct = total > 0 ? (f.amount / total) * 100 : 0;
            return (
              <div className="dest-row" key={f.label}>
                <div className="dest-top">
                  <span>{f.label}</span>
                  <strong>{formatCurrency(f.amount)}</strong>
                </div>
                <div className="dest-track">
                  <div
                    className="dest-fill"
                    style={{ width: `${Math.min(100, pct)}%`, background: f.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
