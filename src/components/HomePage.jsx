import React from 'react';

const SECTIONS = [
  {
    id: 'salah',
    num: '01',
    title: 'Salah — 5 Daily Prayers',
    category: 'Individual Mind & Body',
    status: 'live',
    verse: '“Verily, in the remembrance of Allah do hearts find rest.” (13:28)',
    benefits: {
      Individual: 'Resets cortisol, restores focus, and anchors sleep.',
      Community: 'Builds daily neighborhood unity through Jama’ah.',
      Society: 'Cultivates mindfulness, discipline, and humility.',
    },
    simulators: [
      { name: '24-Hour Stress & Recovery Curve', live: true },
      { name: 'Circadian Rhythm & Sleep Anchor', live: false },
      { name: 'Congregational (Jama’ah) Community Network', live: false },
    ],
  },
  {
    id: 'zakat',
    num: '02',
    title: 'Zakat — Wealth Circulation',
    category: 'Society & Economy',
    status: 'live',
    verse: '“So that wealth does not merely circulate among the rich among you.” (59:7)',
    benefits: {
      Individual: 'Purifies wealth from greed and nurtures gratitude.',
      Community: 'Turns recipients into self-reliant contributors.',
      Society: 'Eradicates extreme poverty and shrinks wealth inequality.',
    },
    simulators: [
      { name: 'Global & Country 30-Year Macro Model', live: true },
      { name: 'Personal Zakat Multiplier ("What My Zakat Does")', live: true },
      { name: 'Top-1% / Billionaire Impact Spotlight', live: false },
    ],
  },
  {
    id: 'sawm',
    num: '03',
    title: 'Sawm — Fasting & Ramadan',
    category: 'Health & Self-Mastery',
    status: 'live',
    verse: '“Fasting has been prescribed for you… that you may attain mindfulness.” (2:183)',
    benefits: {
      Individual: 'Triggers metabolic renewal, insulin sensitivity, and self-control.',
      Community: 'Sparks the largest annual wave of global charity and shared meals.',
      Society: 'Builds deep empathy for the hungry and reduces overconsumption.',
    },
    simulators: [
      { name: '24-Hour & 30-Day Metabolic / Autophagy Timeline', live: true },
      { name: 'Global Ramadan Charity & Food-Security Surge', live: false },
    ],
  },
  {
    id: 'riba',
    num: '04',
    title: 'No Riba — Interest-Free Finance',
    category: 'Finance & Justice',
    status: 'live',
    verse: '“If someone is in hardship, then let there be postponement until a time of ease.” (2:280)',
    benefits: {
      Individual: 'Protects families from compounding debt traps.',
      Community: 'Aligns lenders and borrowers through risk-sharing.',
      Society: 'Prevents wealth extraction and financial crises.',
    },
    simulators: [
      { name: 'Compound Riba vs. Qard Hasan Debt Simulator', live: true },
      { name: 'Small Business Risk-Sharing (Mudarabah)', live: false },
      { name: 'National Debt & Inflation Stress Test', live: false },
    ],
  },
  {
    id: 'waqf',
    num: '05',
    title: 'Waqf — Perpetual Endowments',
    category: 'Public Goods & Legacy',
    status: 'live',
    verse: '“Ongoing charity (Sadaqah Jariyah) whose benefit continues.” (Hadith)',
    benefits: {
      Individual: 'Leaves a permanent legacy of benefit across generations.',
      Community: 'Funds free schools, hospitals, and clean water locally.',
      Society: 'Creates debt-free public infrastructure independent of taxation.',
    },
    simulators: [
      { name: '100-Year Generational Endowment Compounder', live: true },
      { name: 'Community Hospital & Education Funding Model', live: true },
    ],
  },
  {
    id: 'community',
    num: '06',
    title: 'Silat al-Rahim & Neighbor Rights',
    category: 'Family & Community',
    status: 'live',
    verse: '“He is not a believer whose stomach is filled while his neighbor goes hungry.” (Hadith)',
    benefits: {
      Individual: 'Protects against loneliness, anxiety, and isolation.',
      Community: 'Creates an informal safety net on every street.',
      Society: 'Strengthens social trust and intergenerational care.',
    },
    simulators: [
      { name: 'Social Isolation & Mutual-Aid Network Graph', live: true },
      { name: 'Neighborhood Food & Crisis Resilience Model', live: true },
    ],
  },
];

export function HomePage({ onSelectModule }) {
  return (
    <div className="home-wrap">
      {/* Hero */}
      <section className="hero-card">
        <span className="wisdom-eyebrow">INTERACTIVE ISLAMIC WISDOM LAB</span>
        <h2 className="hero-title">
          See How What Allah Prescribed Benefits <span className="hero-accent">All of Humanity</span>
        </h2>
        <p className="hero-sub">
          MercyByDesign translates Islamic principles into transparent, interactive simulations—showing their measurable impact on the <strong>individual</strong>, the <strong>family</strong>, the <strong>community</strong>, and <strong>society as a whole</strong>.
        </p>
        <div className="hero-actions">
          <button className="primary-btn lg" onClick={() => onSelectModule('salah')}>
            Start with Salah →
          </button>
          <button className="secondary-btn lg" onClick={() => onSelectModule('zakat')}>
            Explore Zakat
          </button>
          <button className="secondary-btn lg" onClick={() => onSelectModule('sawm')}>
            Explore Sawm
          </button>
          <button className="secondary-btn lg" onClick={() => onSelectModule('riba')}>
            Explore No Riba
          </button>
        </div>

        <div className="impact-strip">
          <div className="impact-pill"><strong>Individual</strong> • Body, mind &amp; dignity</div>
          <div className="impact-pill"><strong>Family</strong> • Stability &amp; protection</div>
          <div className="impact-pill"><strong>Community</strong> • Trust &amp; mutual aid</div>
          <div className="impact-pill"><strong>Society</strong> • Justice &amp; prosperity</div>
        </div>
      </section>

      {/* Blueprint Grid */}
      <section className="blueprint-section">
        <div className="blueprint-header">
          <div>
            <h2>Platform Blueprint — All Sections</h2>
            <p className="subtitle">Each section combines multi-level benefits with its own suite of interactive simulators.</p>
          </div>
          <span className="blueprint-count">All 6 Sections Live</span>
        </div>

        <div className="blueprint-grid">
          {SECTIONS.map((sec) => {
            const isLive = sec.status === 'live';
            return (
              <article
                key={sec.id}
                className={`bp-card ${isLive ? 'is-live' : 'is-planned'}`}
                onClick={() => isLive && onSelectModule(sec.id)}
              >
                <div className="bp-top">
                  <span className="bp-num">{sec.num} • {sec.category}</span>
                  <span className={`bp-status ${isLive ? 'live' : 'planned'}`}>
                    {isLive ? '● Live' : 'Blueprint'}
                  </span>
                </div>

                <h3>{sec.title}</h3>
                <p className="bp-verse">{sec.verse}</p>

                <div className="bp-benefits">
                  {Object.entries(sec.benefits).map(([level, text]) => (
                    <div className="bp-ben-row" key={level}>
                      <strong>{level}:</strong> <span>{text}</span>
                    </div>
                  ))}
                </div>

                <div className="bp-sims">
                  <span className="bp-sims-label">Simulators in this section:</span>
                  <ul>
                    {sec.simulators.map((s) => (
                      <li key={s.name} className={s.live ? 'sim-live' : 'sim-soon'}>
                        {s.live ? '✓' : '○'} {s.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {isLive && (
                  <button
                    className="bp-open-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectModule(sec.id);
                    }}
                  >
                    Open {sec.title.split(' — ')[0]} Section →
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
