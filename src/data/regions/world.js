export default {
  id: 'world',
  name: 'Entire World',
  shortName: 'Global',
  badge: 'Entire World',
  households: 2_200_000_000,
  povertyLine: 6_800, // Global household poverty threshold (PPP-adjusted ~$6.85/day × ~2.7 people)
  description: '2.2B households worldwide • ~$454T total wealth (UBS Global Wealth Report)',
  tiers: [
    { share: 0.20, cash: 120, equities: 0, exemptHome: 600, debt: 450, income: 2_200, mpc: 1.01 },
    { share: 0.25, cash: 650, equities: 150, exemptHome: 4_500, debt: 1_100, income: 6_200, mpc: 0.98 },
    { share: 0.25, cash: 3_200, equities: 2_800, exemptHome: 24_000, debt: 3_500, income: 16_000, mpc: 0.94 },
    { share: 0.15, cash: 14_000, equities: 26_000, exemptHome: 85_000, debt: 8_000, income: 42_000, mpc: 0.88 },
    { share: 0.10, cash: 55_000, equities: 165_000, exemptHome: 230_000, debt: 15_000, income: 95_000, mpc: 0.80 },
    { share: 0.04, cash: 220_000, equities: 980_000, exemptHome: 560_000, debt: 28_000, income: 240_000, mpc: 0.68 },
    { share: 0.009, cash: 1_400_000, equities: 8_800_000, exemptHome: 1_800_000, debt: 70_000, income: 950_000, mpc: 0.48 },
    { share: 0.001, cash: 14_000_000, equities: 92_000_000, exemptHome: 8_500_000, debt: 250_000, income: 6_500_000, mpc: 0.25 },
  ],
};
