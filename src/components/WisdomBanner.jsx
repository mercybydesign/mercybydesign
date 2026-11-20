import React, { useState } from 'react';
import { formatCurrency } from '../simulation/zakatEngine';

export function WisdomBanner() {
  const [open, setOpen] = useState(true);

  return (
    <section className="wisdom-banner">
      <div className="wisdom-top">
        <div>
          <span className="wisdom-eyebrow">THE WISDOM OF 2.5% (HIKMAH AL-ZAKAH)</span>
          <h2>
            “So that wealth does not merely circulate among the rich among you.”{' '}
            <span className="verse-ref">— Qur’an 59:7</span>
          </h2>
        </div>
        <button className="wisdom-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide Guide' : 'Show Guide'}
        </button>
      </div>

      {open && (
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Taxes Idle Wealth, Not Hard Work</h3>
            <p>
              Unlike income taxes that shrink every paycheck, Zakat leaves wages and primary homes untouched—gently circulating <strong>2.5%</strong> of surplus wealth held for a full year (<em>Hawl</em>).
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Built-In Protection (Gold Nisab)</h3>
            <p>
              Anyone whose net liquid wealth is below <strong>85g of gold</strong> pays <strong>$0</strong> and is eligible to receive support—ensuring struggling families are never burdened.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Turning Recipients into Givers</h3>
            <p>
              By clearing debt (<em>Al-Gharimin</em>) and lifting households above poverty (<em>Al-Fuqara</em> &amp; <em>Al-Masakin</em>), Zakat restores dignity and grows the middle class for everyone.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export function SystemComparisonCard({ zakatSnap, taxSnap, baselineSnap, region }) {
  return (
    <section className="compare-card">
      <div className="compare-header">
        <div>
          <h3>Zakat vs. Income Tax vs. Baseline (Year {zakatSnap.year} • {region.name})</h3>
          <p className="compare-sub">
            Comparing Islam’s 2.5% wealth-based Zakat against a 5% flat income tax on wages and a no-redistribution baseline.
          </p>
        </div>
      </div>

      <div className="compare-grid">
        <div className="compare-col zakat-col">
          <div className="col-badge emerald">2.5% Zakat (Idle Wealth)</div>
          <div className="col-stat">
            <span>Wealth Gini</span>
            <strong>{zakatSnap.gini.toFixed(3)}</strong>
          </div>
          <div className="col-stat">
            <span>Poverty Rate</span>
            <strong>{zakatSnap.povertyRate.toFixed(1)}%</strong>
          </div>
          <div className="col-stat">
            <span>Median Net Worth</span>
            <strong>{formatCurrency(zakatSnap.medianNetWorth)}</strong>
          </div>
          <div className="col-note">0% tax on wages, homes, or anyone below Gold Nisab.</div>
        </div>

        <div className="compare-col tax-col">
          <div className="col-badge sky">5% Income Tax (Wages)</div>
          <div className="col-stat">
            <span>Wealth Gini</span>
            <strong>{taxSnap.gini.toFixed(3)}</strong>
          </div>
          <div className="col-stat">
            <span>Poverty Rate</span>
            <strong>{taxSnap.povertyRate.toFixed(1)}%</strong>
          </div>
          <div className="col-stat">
            <span>Median Net Worth</span>
            <strong>{formatCurrency(taxSnap.medianNetWorth)}</strong>
          </div>
          <div className="col-note">Reduces working-class paychecks while leaving idle wealth untouched.</div>
        </div>

        <div className="compare-col base-col">
          <div className="col-badge slate">Baseline (No Redistribution)</div>
          <div className="col-stat">
            <span>Wealth Gini</span>
            <strong>{baselineSnap.gini.toFixed(3)}</strong>
          </div>
          <div className="col-stat">
            <span>Poverty Rate</span>
            <strong>{baselineSnap.povertyRate.toFixed(1)}%</strong>
          </div>
          <div className="col-stat">
            <span>Median Net Worth</span>
            <strong>{formatCurrency(baselineSnap.medianNetWorth)}</strong>
          </div>
          <div className="col-note">Wealth compounds at the top while poverty persists.</div>
        </div>
      </div>
    </section>
  );
}
