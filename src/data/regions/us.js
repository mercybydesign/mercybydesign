export default {
  id: 'us',
  name: 'United States',
  shortName: 'US',
  badge: 'United States',
  households: 131_200_000,
  povertyLine: 31_200,
  description: '131.2M US households • ~$155T total wealth (Federal Reserve SCF)',
  tiers: [
    { share: 0.10, cash: 400, equities: 0, exemptHome: 2_000, debt: 9_500, income: 16_000, mpc: 1.02 },
    { share: 0.15, cash: 2_200, equities: 800, exemptHome: 15_000, debt: 11_000, income: 31_000, mpc: 0.99 },
    { share: 0.25, cash: 8_500, equities: 12_000, exemptHome: 85_000, debt: 14_000, income: 58_000, mpc: 0.94 },
    { share: 0.25, cash: 32_000, equities: 95_000, exemptHome: 245_000, debt: 16_000, income: 102_000, mpc: 0.87 },
    { share: 0.15, cash: 95_000, equities: 390_000, exemptHome: 460_000, debt: 20_000, income: 185_000, mpc: 0.78 },
    { share: 0.09, cash: 360_000, equities: 2_250_000, exemptHome: 950_000, debt: 35_000, income: 420_000, mpc: 0.65 },
    { share: 0.009, cash: 2_100_000, equities: 16_500_000, exemptHome: 2_800_000, debt: 90_000, income: 1_500_000, mpc: 0.45 },
    { share: 0.001, cash: 18_000_000, equities: 145_000_000, exemptHome: 12_000_000, debt: 300_000, income: 9_500_000, mpc: 0.25 },
  ],
};
