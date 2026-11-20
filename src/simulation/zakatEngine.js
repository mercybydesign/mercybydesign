// MercyByDesign — Multi-Country & Global Fiqh al-Zakah Simulation Engine
// Uses Gold Nisab Standard (85g / 87.48g), Hawl (1 year), 2.5% rate, and Asnaf cascade redistribution.

import { REGIONS } from '../data/regions/index.js';

export const ZAKAT_RATE = 0.025; // 2.5% (1/40th)
export { REGIONS };

export const DEFAULT_PARAMS = {
  regionId: 'world',
  goldPricePerGram: 85, // ~$2,644/oz -> 85g = $7,225 Nisab
  nisabGrams: 85, // 85g (Majority / AAOIFI) or 87.48g (Hanafi)
  complianceRate: 100,
  equityZakatableRatio: 100,
  annualReturnRate: 5.5,
  inflationRate: 3.0, // Annual fiat inflation (%)
  fuqaraShare: 50,
  masakinShare: 30,
  ghariminShare: 18,
  amilinShare: 2,
  years: 30,
};

function createInitialCohorts(region) {
  const cohorts = [];
  const subDivisions = 10;

  region.tiers.forEach((tier, tierIdx) => {
    for (let s = 0; s < subDivisions; s++) {
      const spread = 0.65 + (s / (subDivisions - 1)) * 0.7;
      const households = (region.households * tier.share) / subDivisions;
      cohorts.push({
        id: `${tierIdx}-${s}`,
        tierIdx,
        households,
        cash: tier.cash * spread,
        equities: tier.equities * spread,
        exemptHome: tier.exemptHome * spread,
        debt: tier.debt * (1.2 - 0.4 * (s / (subDivisions - 1))),
        income: tier.income * spread,
        mpc: tier.mpc,
        hawlEligibleStart: false,
      });
    }
  });
  return cohorts;
}

export function computeNetZakatableWealth(cohort, equityRatio) {
  const zakatableAssets = cohort.cash + cohort.equities * (equityRatio / 100);
  return zakatableAssets - cohort.debt;
}

export function computeTotalNetWorth(cohort) {
  return cohort.cash + cohort.equities + cohort.exemptHome - cohort.debt;
}

function computeGini(cohorts) {
  const sorted = cohorts
    .map((c) => ({ w: Math.max(0, computeTotalNetWorth(c)), h: c.households }))
    .sort((a, b) => a.w - b.w);

  const totalH = sorted.reduce((acc, c) => acc + c.h, 0);
  const totalW = sorted.reduce((acc, c) => acc + c.w * c.h, 0);
  if (totalW <= 0) return 0;

  let cumH = 0;
  let cumW = 0;
  let areaUnderLorenz = 0;

  for (const item of sorted) {
    const prevHFrac = cumH / totalH;
    const prevWFrac = cumW / totalW;
    cumH += item.h;
    cumW += item.w * item.h;
    const currHFrac = cumH / totalH;
    const currWFrac = cumW / totalW;
    areaUnderLorenz += ((prevWFrac + currWFrac) / 2) * (currHFrac - prevHFrac);
  }

  return Math.max(0, Math.min(1, 1 - 2 * areaUnderLorenz));
}

function computeLorenzPoints(cohorts) {
  const sorted = cohorts
    .map((c) => ({ w: Math.max(0, computeTotalNetWorth(c)), h: c.households }))
    .sort((a, b) => a.w - b.w);

  const totalH = sorted.reduce((acc, c) => acc + c.h, 0);
  const totalW = sorted.reduce((acc, c) => acc + c.w * c.h, 0);

  const points = [{ x: 0, y: 0 }];
  let cumH = 0;
  let cumW = 0;

  for (let i = 0; i < sorted.length; i++) {
    cumH += sorted[i].h;
    cumW += sorted[i].w * sorted[i].h;
    if (i % 4 === 3 || i === sorted.length - 1) {
      points.push({
        x: cumH / totalH,
        y: totalW > 0 ? cumW / totalW : cumH / totalH,
      });
    }
  }
  return points;
}

function computeSnapshot(cohorts, region, nisab, year, zakatStats, equityZakatableRatio, cpi = 1) {
  const sorted = [...cohorts].sort(
    (a, b) => computeTotalNetWorth(a) - computeTotalNetWorth(b)
  );
  const effectivePovertyLine = region.povertyLine * cpi;

  let totalNetWorth = 0;
  let totalZakatable = 0;
  let povertyHouseholds = 0;
  let belowNisabHouseholds = 0;

  let bottom50W = 0;
  let mid40W = 0;
  let next9W = 0;
  let top1W = 0;

  let cumH = 0;
  let medianNetWorth = 0;
  let medianFound = false;

  for (const c of sorted) {
    const nw = computeTotalNetWorth(c);
    const netZak = computeNetZakatableWealth(c, equityZakatableRatio);
    const tierW = nw * c.households;
    totalNetWorth += tierW;
    totalZakatable += Math.max(0, netZak) * c.households;

    const effectiveSupport = c.income + Math.max(0, c.cash - c.debt) * 0.15;
    if (effectiveSupport < effectivePovertyLine) {
      povertyHouseholds += c.households;
    }

    if (netZak < nisab) {
      belowNisabHouseholds += c.households;
    }

    const frac = (cumH + c.households / 2) / region.households;
    if (!medianFound && cumH + c.households >= region.households * 0.5) {
      medianNetWorth = nw;
      medianFound = true;
    }

    if (frac <= 0.5) bottom50W += tierW;
    else if (frac <= 0.9) mid40W += tierW;
    else if (frac <= 0.99) next9W += tierW;
    else top1W += tierW;

    cumH += c.households;
  }

  const safeTotal = totalNetWorth > 0 ? totalNetWorth : 1;

  return {
    year,
    cpi,
    purchasingPower: (1 / cpi) * 100,
    currentNisab: nisab,
    totalNetWorth,
    totalZakatable,
    gini: computeGini(cohorts),
    povertyRate: (povertyHouseholds / region.households) * 100,
    povertyHouseholds,
    belowNisabRate: (belowNisabHouseholds / region.households) * 100,
    medianNetWorth,
    shares: {
      bottom50: (bottom50W / safeTotal) * 100,
      mid40: (mid40W / safeTotal) * 100,
      next9: (next9W / safeTotal) * 100,
      top1: (top1W / safeTotal) * 100,
    },
    lorenz: computeLorenzPoints(cohorts),
    ...zakatStats,
  };
}

function stepEconomy(cohorts, region, params, applyZakat, cpi = 1) {
  const nisab = params.goldPricePerGram * params.nisabGrams * cpi;
  const inf = (params.inflationRate || 0) / 100;
  const r = params.annualReturnRate / 100 + inf; // Nominal return = real + inflation
  const homeAppreciation = 0.02 + inf;
  const compliance = params.complianceRate / 100;

  for (const c of cohorts) {
    const startZakatable = computeNetZakatableWealth(c, params.equityZakatableRatio);
    c.hawlEligibleStart = startZakatable >= nisab;

    c.income *= 1 + inf * 0.85; // Wages lag inflation slightly
    c.equities *= 1 + r;
    c.cash *= 1 + 0.015;
    c.exemptHome *= 1 + homeAppreciation;

    const netSavings = c.income * (1 - c.mpc);
    if (netSavings >= 0) {
      const investRatio = c.tierIdx >= 3 ? 0.7 : 0.3;
      c.equities += netSavings * investRatio;
      c.cash += netSavings * (1 - investRatio);
    } else {
      const deficit = -netSavings;
      if (c.cash >= deficit) {
        c.cash -= deficit;
      } else {
        c.debt += deficit - c.cash;
        c.cash = 0;
      }
    }

    c.debt *= 1.03;
  }

  let totalZakatCollected = 0;
  let payingHouseholds = 0;
  let fuqaraDistributed = 0;
  let masakinDistributed = 0;
  let ghariminDistributed = 0;
  let amilinAdmin = 0;

  if (applyZakat && compliance > 0) {
    for (const c of cohorts) {
      const netZakatable = computeNetZakatableWealth(c, params.equityZakatableRatio);
      if (c.hawlEligibleStart && netZakatable >= nisab) {
        const zakatDuePerHousehold = netZakatable * ZAKAT_RATE * compliance;
        totalZakatCollected += zakatDuePerHousehold * c.households;
        payingHouseholds += c.households * compliance;

        if (c.cash >= zakatDuePerHousehold) {
          c.cash -= zakatDuePerHousehold;
        } else {
          const rem = zakatDuePerHousehold - c.cash;
          c.cash = 0;
          c.equities = Math.max(0, c.equities - rem);
        }
      }
    }

    const shareSum =
      params.fuqaraShare +
      params.masakinShare +
      params.ghariminShare +
      params.amilinShare;
    const norm = shareSum > 0 ? 1 / shareSum : 0;

    let fuqaraPool = totalZakatCollected * params.fuqaraShare * norm;
    let masakinPool = totalZakatCollected * params.masakinShare * norm;
    let ghariminPool = totalZakatCollected * params.ghariminShare * norm;
    amilinAdmin = totalZakatCollected * params.amilinShare * norm;
    let surplusPublicPool = 0;

    // A. Al-Fuqara
    const effectivePovertyLine = region.povertyLine * cpi;
    const fuqaraCohorts = cohorts.filter(
      (c) => c.income + Math.max(0, c.cash - c.debt) * 0.15 < effectivePovertyLine
    );
    const fuqaraTotalH = fuqaraCohorts.reduce((acc, c) => acc + c.households, 0);
    if (fuqaraTotalH > 0 && fuqaraPool > 0) {
      const perH = fuqaraPool / fuqaraTotalH;
      for (const c of fuqaraCohorts) {
        const debtPay = Math.min(c.debt, perH * 0.35);
        c.debt -= debtPay;
        c.cash += (perH - debtPay) * 0.7;
      }
      fuqaraDistributed = fuqaraPool;
    } else if (fuqaraPool > 0) {
      masakinPool += fuqaraPool;
    }

    // B. Al-Gharimin
    const indebtedCohorts = cohorts.filter((c) => c.debt > 0 && c.tierIdx <= 3);
    const totalDebt = indebtedCohorts.reduce((acc, c) => acc + c.debt * c.households, 0);
    if (totalDebt > 0 && ghariminPool > 0) {
      const used = Math.min(ghariminPool, totalDebt);
      const reliefRatio = used / totalDebt;
      for (const c of indebtedCohorts) {
        c.debt *= 1 - reliefRatio;
      }
      ghariminDistributed = used;
      if (ghariminPool > used) {
        masakinPool += ghariminPool - used;
      }
    } else if (ghariminPool > 0) {
      masakinPool += ghariminPool;
    }

    // C. Al-Masakin
    const masakinCohorts = cohorts.filter(
      (c) => computeNetZakatableWealth(c, params.equityZakatableRatio) < nisab
    );
    const masakinTotalH = masakinCohorts.reduce((acc, c) => acc + c.households, 0);
    if (masakinTotalH > 0 && masakinPool > 0) {
      const perH = masakinPool / masakinTotalH;
      for (const c of masakinCohorts) {
        c.cash += perH * 0.75;
      }
      masakinDistributed = masakinPool;
    } else if (masakinPool > 0) {
      surplusPublicPool = masakinPool;
      const bottomHalf = cohorts.filter((c) => c.tierIdx <= 2);
      const bottomHalfH = bottomHalf.reduce((acc, c) => acc + c.households, 0);
      if (bottomHalfH > 0) {
        const perH = surplusPublicPool / bottomHalfH;
        for (const c of bottomHalf) {
          c.cash += perH * 0.5;
          c.equities += perH * 0.3;
        }
      }
    }

    return {
      totalZakatCollected,
      payingHouseholds,
      payingRate: (payingHouseholds / region.households) * 100,
      fuqaraDistributed,
      masakinDistributed,
      ghariminDistributed,
      surplusPublicPool,
      amilinAdmin,
    };
  }

  return {
    totalZakatCollected,
    payingHouseholds,
    payingRate: (payingHouseholds / region.households) * 100,
    fuqaraDistributed,
    masakinDistributed,
    ghariminDistributed,
    surplusPublicPool: 0,
    amilinAdmin,
  };
}

function stepIncomeTax(cohorts, region, params) {
  const r = params.annualReturnRate / 100;
  const homeAppreciation = 0.02;
  const taxRate = 0.05 * (params.complianceRate / 100); // 5% income tax on all wages

  let totalTaxCollected = 0;

  for (const c of cohorts) {
    c.equities *= 1 + r;
    c.cash *= 1 + 0.015;
    c.exemptHome *= 1 + homeAppreciation;

    const taxPaid = c.income * taxRate;
    totalTaxCollected += taxPaid * c.households;

    const afterTaxIncome = c.income - taxPaid;
    const netSavings = afterTaxIncome - c.income * c.mpc;
    if (netSavings >= 0) {
      const investRatio = c.tierIdx >= 3 ? 0.7 : 0.3;
      c.equities += netSavings * investRatio;
      c.cash += netSavings * (1 - investRatio);
    } else {
      const deficit = -netSavings;
      if (c.cash >= deficit) {
        c.cash -= deficit;
      } else {
        c.debt += deficit - c.cash;
        c.cash = 0;
      }
    }
    c.debt *= 1.03;
  }

  // Redistribute income tax to lower-income households (bottom 25%)
  const recipients = cohorts.filter((c) => c.tierIdx <= 1);
  const recipH = recipients.reduce((acc, c) => acc + c.households, 0);
  if (recipH > 0 && totalTaxCollected > 0) {
    const perH = totalTaxCollected / recipH;
    for (const c of recipients) {
      const debtPay = Math.min(c.debt, perH * 0.25);
      c.debt -= debtPay;
      c.cash += (perH - debtPay) * 0.65;
    }
  }

  return {
    totalZakatCollected: totalTaxCollected,
    payingHouseholds: region.households,
    payingRate: 100,
    fuqaraDistributed: totalTaxCollected,
    masakinDistributed: 0,
    ghariminDistributed: 0,
    surplusPublicPool: 0,
    amilinAdmin: 0,
  };
}

export function runSimulation(params) {
  const region = REGIONS[params.regionId] || REGIONS.world;
  const nisab = params.goldPricePerGram * params.nisabGrams;
  const zakatCohorts = createInitialCohorts(region);
  const baselineCohorts = createInitialCohorts(region);
  const incomeTaxCohorts = createInitialCohorts(region);

  const zakatTimeline = [];
  const baselineTimeline = [];
  const incomeTaxTimeline = [];

  const emptyStats = {
    totalZakatCollected: 0,
    payingHouseholds: 0,
    payingRate: 0,
    fuqaraDistributed: 0,
    masakinDistributed: 0,
    ghariminDistributed: 0,
    surplusPublicPool: 0,
    amilinAdmin: 0,
  };

  zakatTimeline.push(computeSnapshot(zakatCohorts, region, nisab, 0, emptyStats, params.equityZakatableRatio, 1));
  baselineTimeline.push(computeSnapshot(baselineCohorts, region, nisab, 0, emptyStats, params.equityZakatableRatio, 1));
  incomeTaxTimeline.push(computeSnapshot(incomeTaxCohorts, region, nisab, 0, emptyStats, params.equityZakatableRatio, 1));

  const inf = (params.inflationRate || 0) / 100;
  for (let y = 1; y <= params.years; y++) {
    const cpi = Math.pow(1 + inf, y);
    const currentNisab = nisab * cpi;
    const zStats = stepEconomy(zakatCohorts, region, params, true, cpi);
    stepEconomy(baselineCohorts, region, params, false, cpi);
    const tStats = stepIncomeTax(incomeTaxCohorts, region, params);

    zakatTimeline.push(computeSnapshot(zakatCohorts, region, currentNisab, y, zStats, params.equityZakatableRatio, cpi));
    baselineTimeline.push(computeSnapshot(baselineCohorts, region, currentNisab, y, emptyStats, params.equityZakatableRatio, cpi));
    incomeTaxTimeline.push(computeSnapshot(incomeTaxCohorts, region, currentNisab, y, tStats, params.equityZakatableRatio, cpi));
  }

  return {
    region,
    nisab,
    zakatTimeline,
    baselineTimeline,
    incomeTaxTimeline,
  };
}

export function formatCurrency(num) {
  if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${Math.round(num).toLocaleString()}`;
}

export function formatHouseholds(num) {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
  return `${Math.round(num)}`;
}
