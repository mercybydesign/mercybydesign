// Central Topic & Study Registry (Single Source of Truth)
//
// MercyByDesign is organized as: Principle / Teaching (Topic) -> One or more Interactive Studies.
// - To add a new study under an existing principle (e.g., a second Salah simulation):
//     1. Create your component in src/components/<Name>.jsx (include <MethodologyDrawer />)
//     2. Append an entry to that topic's `studies` array below.
//     Overview directory, study switcher tabs, and deep links (/<topic>/<studyId>) update automatically!
// - To add a new Islamic principle / category:
//     Append a new topic object to TOPICS below.

import { TawhidModule } from '../components/TawhidModule';
import { AkhirahModule } from '../components/AkhirahModule';
import { SalahModule } from '../components/SalahModule';
import { ZakatModule } from '../components/ZakatModule';
import { SawmModule } from '../components/SawmModule';
import { HajjModule } from '../components/HajjModule';
import { RibaModule } from '../components/RibaModule';
import { WaqfModule } from '../components/WaqfModule';
import { CommunityModule } from '../components/CommunityModule';

export const TOPICS = [
  {
    id: 'tawhid',
    num: '01',
    path: '/tawhid',
    title: 'Tawhid',
    subtitle: 'Belief in One Allah',
    category: 'Belief',
    scope: 'Purpose & Inner Anchor',
    verse: '“Say: He is Allah, the One.” (112:1)',
    benefits: {
      Individual: 'Frees the heart from status anxiety and grounds resilience.',
      Community: 'Establishes equal dignity for every human being.',
      Society: 'Replaces tribalism with shared moral purpose.',
    },
    studies: [
      {
        id: 'inner-anchor',
        title: 'Identity Anchor & Emotional Resilience',
        component: TawhidModule,
      },
    ],
    plannedStudies: ['Gratitude (Shukr) & Well-Being'],
  },
  {
    id: 'akhirah',
    num: '02',
    path: '/akhirah',
    title: 'Day of Judgement',
    subtitle: 'Ultimate Accountability (Akhirah)',
    category: 'Belief',
    scope: 'Integrity & High-Trust Society',
    verse: '“Whoever does an atom’s weight of good will see it, and whoever does an atom’s weight of evil will see it.” (99:7–8)',
    benefits: {
      Individual: 'Cultivates integrity even when nobody is watching.',
      Community: 'Builds high-trust relationships without constant policing.',
      Society: 'Lowers corruption and gives hope to the oppressed.',
    },
    studies: [
      {
        id: 'accountability-trust',
        title: 'Internal Accountability vs. External Policing',
        component: AkhirahModule,
      },
    ],
    plannedStudies: ['Long-Horizon Stewardship & Intergenerational Ethics'],
  },
  {
    id: 'salah',
    num: '03',
    path: '/salah',
    title: 'Salah',
    subtitle: '5 Daily Prayers',
    category: 'Individual',
    scope: 'Individual Mind & Body',
    verse: '“Verily, in the remembrance of Allah do hearts find rest.” (13:28)',
    benefits: {
      Individual: 'Resets cortisol, restores focus, and anchors sleep.',
      Community: 'Builds daily neighborhood unity through Jama’ah.',
      Society: 'Cultivates mindfulness, discipline, and humility.',
    },
    studies: [
      {
        id: 'stress-reset',
        title: '24-Hour Stress & Cortisol Reset',
        component: SalahModule,
      },
    ],
    plannedStudies: [
      'Circadian Rhythm & Sleep Anchor',
      'Congregational (Jama’ah) Community Network',
    ],
  },
  {
    id: 'zakat',
    num: '04',
    path: '/zakat',
    title: 'Zakat',
    subtitle: 'Wealth Circulation',
    category: 'Economy & Finance',
    scope: 'Society & Wealth',
    verse: '“So that wealth does not merely circulate among the rich among you.” (59:7)',
    benefits: {
      Individual: 'Purifies wealth from greed and nurtures gratitude.',
      Community: 'Turns recipients into self-reliant contributors.',
      Society: 'Eradicates extreme poverty and shrinks wealth inequality.',
    },
    studies: [
      {
        id: 'wealth-redistribution',
        title: 'Global & National 30-Year Macro Model',
        component: ZakatModule,
      },
    ],
    plannedStudies: ['Top-1% / Billionaire Impact Spotlight'],
  },
  {
    id: 'sawm',
    num: '05',
    path: '/sawm',
    title: 'Sawm',
    subtitle: 'Fasting & Ramadan',
    category: 'Individual',
    scope: 'Fasting & Health',
    verse: '“Fasting has been prescribed for you… that you may attain mindfulness.” (2:183)',
    benefits: {
      Individual: 'Triggers metabolic renewal, insulin sensitivity, and self-control.',
      Community: 'Sparks the largest annual wave of global charity and shared meals.',
      Society: 'Builds deep empathy for the hungry and reduces overconsumption.',
    },
    studies: [
      {
        id: 'metabolic-fast',
        title: 'Daily Fast Metabolism & 30-Day Habit',
        component: SawmModule,
      },
    ],
    plannedStudies: ['Global Ramadan Charity & Food-Security Surge'],
  },
  {
    id: 'hajj',
    num: '06',
    path: '/hajj',
    title: 'Hajj',
    subtitle: 'Global Pilgrimage & Equality',
    category: 'Community & Society',
    scope: 'Equality Across Nations',
    verse: '“We made you peoples and tribes that you may know one another.” (49:13)',
    benefits: {
      Individual: 'Humbles the ego and renews spiritual focus.',
      Community: 'Erases class and racial barriers through equal Ihram.',
      Society: 'Fosters global tolerance, empathy, and solidarity.',
    },
    studies: [
      {
        id: 'ihram-equality',
        title: 'The Ihram Effect — Erasing Status & Borders',
        component: HajjModule,
      },
    ],
    plannedStudies: ['Contact Theory & Tolerance (Harvard/MIT Hajj Study)'],
  },
  {
    id: 'riba',
    num: '07',
    path: '/riba',
    title: 'No Riba',
    subtitle: 'Interest-Free Finance',
    category: 'Economy & Finance',
    scope: 'Interest-Free Finance',
    verse: '“If someone is in hardship, then let there be postponement until a time of ease.” (2:280)',
    benefits: {
      Individual: 'Protects families from compounding debt traps.',
      Community: 'Aligns lenders and borrowers through risk-sharing.',
      Society: 'Prevents wealth extraction and financial crises.',
    },
    studies: [
      {
        id: 'compound-vs-qard',
        title: 'Compound Riba vs. Qard Hasan Simulator',
        component: RibaModule,
      },
    ],
    plannedStudies: [
      'Small Business Risk-Sharing (Mudarabah)',
      'National Debt & Inflation Stress Test',
    ],
  },
  {
    id: 'waqf',
    num: '08',
    path: '/waqf',
    title: 'Waqf',
    subtitle: 'Perpetual Endowments',
    category: 'Economy & Finance',
    scope: 'Perpetual Endowments',
    verse: '“Ongoing charity (Sadaqah Jariyah) whose benefit continues.” (Sahih Muslim 1631)',
    benefits: {
      Individual: 'Leaves a permanent legacy of benefit across generations.',
      Community: 'Funds free schools, hospitals, and clean water locally.',
      Society: 'Creates debt-free public infrastructure independent of taxation.',
    },
    studies: [
      {
        id: 'generational-endowment',
        title: '100-Year Generational Endowment Compounder',
        component: WaqfModule,
      },
    ],
    plannedStudies: ['Historical Waqf Civic Infrastructure Map'],
  },
  {
    id: 'community',
    num: '09',
    path: '/community',
    title: 'Community',
    subtitle: 'Silat al-Rahim & Neighbor Rights',
    category: 'Community & Society',
    scope: 'Family & Neighbors',
    verse: '“He is not a believer whose stomach is filled while his neighbor goes hungry.” (Hadith)',
    benefits: {
      Individual: 'Protects against loneliness, anxiety, and isolation.',
      Community: 'Creates an informal safety net on every street.',
      Society: 'Strengthens social trust and intergenerational care.',
    },
    studies: [
      {
        id: 'mutual-aid-network',
        title: 'Social Isolation & Mutual-Aid Network Graph',
        component: CommunityModule,
      },
    ],
    plannedStudies: ['Intergenerational Household Care Model'],
  },
];

export const STUDIES = TOPICS;
