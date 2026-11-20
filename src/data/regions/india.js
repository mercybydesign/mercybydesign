export default {
  id: 'india',
  name: 'India',
  shortName: 'India',
  badge: 'India',
  households: 300_000_000,
  povertyLine: 4_800,
  description: '300M households • ~$15.4T total wealth (UBS / World Bank)',
  tiers: [
    { share: 0.22, cash: 90, equities: 0, exemptHome: 800, debt: 400, income: 2_100, mpc: 1.01 },
    { share: 0.28, cash: 450, equities: 100, exemptHome: 4_200, debt: 800, income: 4_600, mpc: 0.98 },
    { share: 0.25, cash: 1_800, equities: 1_200, exemptHome: 15_000, debt: 1_600, income: 9_800, mpc: 0.92 },
    { share: 0.15, cash: 6_500, equities: 8_500, exemptHome: 42_000, debt: 3_000, income: 21_000, mpc: 0.85 },
    { share: 0.07, cash: 24_000, equities: 55_000, exemptHome: 110_000, debt: 6_000, income: 48_000, mpc: 0.76 },
    { share: 0.025, cash: 95_000, equities: 340_000, exemptHome: 280_000, debt: 12_000, income: 135_000, mpc: 0.64 },
    { share: 0.004, cash: 650_000, equities: 3_600_000, exemptHome: 950_000, debt: 35_000, income: 580_000, mpc: 0.45 },
    { share: 0.001, cash: 5_500_000, equities: 36_000_000, exemptHome: 4_500_000, debt: 120_000, income: 3_600_000, mpc: 0.25 },
  ],
};
