import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ZAKAT_RATE,
  REGIONS,
  DEFAULT_PARAMS,
  runSimulation,
  formatCurrency,
  formatHouseholds,
} from './zakatEngine.js';

describe('zakatEngine', () => {
  it('uses classical 2.5% Zakat rate and valid region tier shares summing to 1.0', () => {
    assert.equal(ZAKAT_RATE, 0.025);
    for (const region of Object.values(REGIONS)) {
      const totalShare = region.tiers.reduce((sum, t) => sum + t.share, 0);
      assert.ok(
        Math.abs(totalShare - 1.0) < 1e-6,
        `Region ${region.id} tier shares should sum to 1.0, got ${totalShare}`
      );
    }
  });

  it('calculates Gold Nisab as nisabGrams * goldPricePerGram', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      nisabGrams: 85,
      goldPricePerGram: 100,
      years: 5,
    });
    assert.equal(sim.nisab, 8500);
    assert.equal(sim.zakatTimeline.length, 6); // Year 0..5
    assert.equal(sim.baselineTimeline.length, 6);
    assert.equal(sim.incomeTaxTimeline.length, 6);
  });

  it('reduces poverty and Gini inequality compared to baseline across all regions', () => {
    for (const regionId of Object.keys(REGIONS)) {
      const sim = runSimulation({
        ...DEFAULT_PARAMS,
        regionId,
        years: 10,
      });
      const z10 = sim.zakatTimeline[10];
      const b10 = sim.baselineTimeline[10];

      assert.ok(
        z10.totalZakatCollected > 0,
        `${regionId}: Zakat pool should be positive`
      );
      assert.ok(
        z10.povertyRate <= b10.povertyRate,
        `${regionId}: Zakat poverty (${z10.povertyRate}) should be <= baseline (${b10.povertyRate})`
      );
      assert.ok(
        z10.gini <= b10.gini,
        `${regionId}: Zakat Gini (${z10.gini}) should be <= baseline (${b10.gini})`
      );
    }
  });

  it('matches baseline when complianceRate is 0%', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      complianceRate: 0,
      years: 5,
    });
    const z5 = sim.zakatTimeline[5];
    const b5 = sim.baselineTimeline[5];
    assert.equal(z5.totalZakatCollected, 0);
    assert.ok(Math.abs(z5.gini - b5.gini) < 1e-6);
    assert.ok(Math.abs(z5.povertyRate - b5.povertyRate) < 1e-6);
  });

  it('tracks inflation CPI in Gold Nisab over time', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      inflationRate: 5,
      years: 10,
    });
    const yr0Nisab = sim.zakatTimeline[0].currentNisab;
    const yr10Nisab = sim.zakatTimeline[10].currentNisab;
    assert.ok(yr10Nisab > yr0Nisab, 'Gold Nisab should rise with CPI');
  });

  it('formats currency and household counts cleanly', () => {
    assert.equal(formatCurrency(1_500_000_000_000), '$1.50T');
    assert.equal(formatCurrency(2_500_000_000), '$2.5B');
    assert.equal(formatCurrency(750_000), '$750.0K');
    assert.equal(formatHouseholds(1_200_000_000), '1.20B');
    assert.equal(formatHouseholds(45_000_000), '45.0M');
  });
});
