import React, { useState } from 'react';
import { formatCurrency } from '../simulation/zakatEngine';

export function PersonalZakat({ nisab }) {
  const [savings, setSavings] = useState(25000);
  const [communitySize, setCommunitySize] = useState(10000);

  const aboveNisab = savings >= nisab;
  const annualZakat = aboveNisab ? savings * 0.025 : 0;
  const tenYearZakat = annualZakat * 10;
  const communityPool = annualZakat * communitySize;

  // Tangible human impact estimates (global/developing & local benchmarks)
  const mealsFunded = Math.round(annualZakat / 3.5);
  const monthsFamilyFood = (annualZakat / 150).toFixed(1);
  const familiesLiftedCommunity = Math.round(communityPool / 1800);

  return (
    <section className="personal-zakat">
      <div className="pz-grid">
        <div className="controls-panel">
          <h2>What Does My Zakat Do?</h2>
          <p className="pz-lead">
            Enter your net zakatable savings &amp; investments held for a full year (<em>Hawl</em>), excluding your home and daily necessities.
          </p>

          <div className="control-group">
            <label>
              <span>My Net Zakatable Wealth</span>
              <strong>{formatCurrency(savings)}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="250000"
              step="1000"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
            />
            <small>
              Gold Nisab (85g): <strong>${nisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </small>
          </div>

          <div className="control-group">
            <label>
              <span>If People Like Me Also Give</span>
              <strong>{communitySize.toLocaleString()} people</strong>
            </label>
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={communitySize}
              onChange={(e) => setCommunitySize(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="dashboard">
          <div className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Your Annual Zakat (2.5%)</span>
              <span className="kpi-value">{formatCurrency(annualZakat)}</span>
              <span className="kpi-sub pos">
                {aboveNisab
                  ? 'Above Gold Nisab — 97.5% remains yours'
                  : 'Below Gold Nisab — $0 due (you are protected)'}
              </span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">Your 10-Year Contribution</span>
              <span className="kpi-value">{formatCurrency(tenYearZakat)}</span>
              <span className="kpi-sub">Steady, quiet circulation every year</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label">{communitySize.toLocaleString()} People Like You</span>
              <span className="kpi-value">{formatCurrency(communityPool)}/yr</span>
              <span className="kpi-sub pos">
                ~{familiesLiftedCommunity.toLocaleString()} families lifted out of crisis annually
              </span>
            </div>
          </div>

          <div className="compare-card">
            <h3>Tangible Human Impact of Your Single Annual Payment</h3>
            <p className="compare-sub">
              {aboveNisab
                ? `Even a modest 2.5% (${formatCurrency(annualZakat)}/yr) translates into direct human dignity:`
                : `Because your net liquid wealth is below the Gold Nisab ($${Math.round(nisab).toLocaleString()}), Islam exempts you completely so you can build stability first.`}
            </p>
            {aboveNisab && (
              <div className="compare-grid">
                <div className="compare-col zakat-col">
                  <div className="col-badge emerald">Food Security</div>
                  <div className="col-stat">
                    <span>Nutritious Meals</span>
                    <strong>{mealsFunded.toLocaleString()}</strong>
                  </div>
                  <div className="col-note">Or ~{monthsFamilyFood} months of staple groceries for a family in need.</div>
                </div>
                <div className="compare-col">
                  <div className="col-badge slate">Debt &amp; Emergency Relief</div>
                  <div className="col-stat">
                    <span>Medical / Utility Aid</span>
                    <strong>{Math.max(1, Math.round(annualZakat / 250))}x</strong>
                  </div>
                  <div className="col-note">Prevents eviction, utility shutoff, or predatory payday loans.</div>
                </div>
                <div className="compare-col">
                  <div className="col-badge sky">Collective Scale</div>
                  <div className="col-stat">
                    <span>With {communitySize.toLocaleString()} Givers</span>
                    <strong>{formatCurrency(communityPool)}</strong>
                  </div>
                  <div className="col-note">Enough to fund a community clinic, school scholarships, or micro-enterprise grants.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
