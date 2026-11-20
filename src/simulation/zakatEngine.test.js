import { describe, it, expect } from 'vitest';
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
    expect(ZAKAT_RATE).toBe(0.025);
    for (const region of Object.values(REGIONS)) {
      const totalShare = region.tiers.reduce((sum, t) => sum + t.share, 0);
      expect(Math.abs(totalShare - 1.0)).toBeLessThan(1e-6);
      expect(region.households).toBeGreaterThan(0);
      expect(region.povertyLine).toBeGreaterThan(0);
    }
  });

  it('calculates Gold Nisab as nisabGrams * goldPricePerGram', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      nisabGrams: 85,
      goldPricePerGram: 100,
      years: 5,
    });
    expect(sim.nisab).toBe(8500);
    expect(sim.zakatTimeline).toHaveLength(6); // Year 0..5
    expect(sim.baselineTimeline).toHaveLength(6);
    expect(sim.incomeTaxTimeline).toHaveLength(6);
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

      expect(z10.totalZakatCollected).toBeGreaterThan(0);
      expect(z10.povertyRate).toBeLessThanOrEqual(b10.povertyRate);
      expect(z10.gini).toBeLessThanOrEqual(b10.gini);
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
    expect(z5.totalZakatCollected).toBe(0);
    expect(Math.abs(z5.gini - b5.gini)).toBeLessThan(1e-6);
    expect(Math.abs(z5.povertyRate - b5.povertyRate)).toBeLessThan(1e-6);
  });

  it('tracks inflation CPI in Gold Nisab over time', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      inflationRate: 5,
      years: 10,
    });
    const yr0Nisab = sim.zakatTimeline[0].currentNisab;
    const yr10Nisab = sim.zakatTimeline[10].currentNisab;
    expect(yr10Nisab).toBeGreaterThan(yr0Nisab);
  });

  it('falls back to world region when an unknown regionId is provided', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      regionId: 'nonexistent',
      years: 2,
    });
    expect(sim.region.id).toBe('world');
  });

  it('handles 0% inflation and high admin cost / equity zakatable ratio', () => {
    const sim = runSimulation({
      ...DEFAULT_PARAMS,
      inflationRate: 0,
      equityZakatableRatio: 100,
      adminCostPct: 12.5,
      years: 3,
    });
    expect(sim.zakatTimeline[3].currentNisab).toBe(sim.nisab);
    expect(sim.zakatTimeline[3].amilinAdmin).toBeGreaterThan(0);
    expect(sim.incomeTaxTimeline[3].totalZakatCollected).toBeGreaterThan(0);
  });

  it('formats currency across all magnitude tiers', () => {
    expect(formatCurrency(1_500_000_000_000)).toBe('$1.50T');
    expect(formatCurrency(2_500_000_000)).toBe('$2.5B');
    expect(formatCurrency(3_250_000)).toBe('$3.25M');
    expect(formatCurrency(750_000)).toBe('$750.0K');
    expect(formatCurrency(420)).toBe('$420');
    expect(formatCurrency(-2_000)).toBe('$-2.0K');
  });

  it('formats household counts across all magnitude tiers', () => {
    expect(formatHouseholds(1_200_000_000)).toBe('1.20B');
    expect(formatHouseholds(45_000_000)).toBe('45.0M');
    expect(formatHouseholds(12_500)).toBe('13K');
    expect(formatHouseholds(350)).toBe('350');
  });
});
