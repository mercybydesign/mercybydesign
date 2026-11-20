import React, { useState, useMemo, useEffect } from 'react';
import {
  DEFAULT_PARAMS,
  REGIONS,
  runSimulation,
  formatCurrency,
  formatHouseholds,
} from './simulation/zakatEngine';
import { TrendChart, LorenzChart, WealthShareBars } from './components/Charts';
import { HumanSocietyGrid, ZakatFlowGraphic } from './components/HumanVisuals';
import { WisdomBanner, SystemComparisonCard } from './components/WisdomBanner';
import { RibaModule } from './components/RibaModule';
import { SalahModule } from './components/SalahModule';
import { SawmModule } from './components/SawmModule';
import { WaqfModule } from './components/WaqfModule';
import { CommunityModule } from './components/CommunityModule';
import { PersonalZakat } from './components/PersonalZakat';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { IdeasPage } from './components/IdeasPage';
import { Logo } from './components/Logo';

const STUDIES = [
  { id: 'salah', num: '01', title: 'Salah', scope: 'Individual Mind & Body' },
  { id: 'zakat', num: '02', title: 'Zakat', scope: 'Society & Wealth' },
  { id: 'sawm', num: '03', title: 'Sawm', scope: 'Fasting & Health' },
  { id: 'riba', num: '04', title: 'No Riba', scope: 'Interest-Free Finance' },
  { id: 'waqf', num: '05', title: 'Waqf', scope: 'Perpetual Endowments' },
  { id: 'community', num: '06', title: 'Community', scope: 'Family & Neighbors' },
];

export default function App() {
  const [activeModule, setActiveModule] = useState('home');
  const [studiesOpen, setStudiesOpen] = useState(false);
  const [zakatTab, setZakatTab] = useState('visual'); // 'visual' | 'compare' | 'charts'
  const [showSettings, setShowSettings] = useState(false);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [currentYear, setCurrentYear] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);

  const sim = useMemo(() => runSimulation(params), [params]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentYear((y) => {
        if (y >= params.years) {
          setIsPlaying(false);
          return params.years;
        }
        return y + 1;
      });
    }, 350);
    return () => clearInterval(timer);
  }, [isPlaying, params.years]);

  const zSnap = sim.zakatTimeline[Math.min(currentYear, params.years)];
  const bSnap = sim.baselineTimeline[Math.min(currentYear, params.years)];
  const tSnap = sim.incomeTaxTimeline[Math.min(currentYear, params.years)];

  const liftedFromPoverty = Math.max(
    0,
    bSnap.povertyHouseholds - zSnap.povertyHouseholds
  );

  const updateParam = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handlePlayToggle = () => {
    if (currentYear >= params.years) setCurrentYear(0);
    setIsPlaying((p) => !p);
  };

  const region = sim.region;
  const maxPovAxis = Math.max(20, Math.ceil(sim.baselineTimeline[0].povertyRate / 10) * 10 + 10);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand-block">
          <div className="brand-row" style={{ alignItems: 'center' }}>
            <Logo size={34} />
            <h1>MercyByDesign</h1>
            <span className="brand-sub-tag">Studies in Islamic Wisdom</span>
          </div>
          <p className="subtitle">
            Interactive models exploring how Islamic principles shape individual, family, and societal well-being.
          </p>
        </div>
        {activeModule === 'zakat' && (
          <div className="nisab-pill">
            <span className="pill-label">Gold Nisab ({params.nisabGrams}g • Yr {currentYear})</span>
            <span className="pill-value">${zSnap.currentNisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        )}
      </header>

      {/* Clean Editorial Navigation with Studies Dropdown */}
      <nav className="module-nav" aria-label="Main navigation">
        <button
          className={`module-tab ${activeModule === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveModule('home'); setStudiesOpen(false); }}
        >
          <span className="mod-text"><strong>Overview</strong></span>
        </button>

        <div className="nav-dropdown-wrap">
          <button
            className={`module-tab ${STUDIES.some((s) => s.id === activeModule) ? 'active' : ''}`}
            onClick={() => setStudiesOpen((o) => !o)}
            aria-expanded={studiesOpen}
          >
            <span className="mod-text">
              <strong>
                {STUDIES.find((s) => s.id === activeModule)
                  ? `Studies: ${STUDIES.find((s) => s.id === activeModule).title}`
                  : 'Studies'}{' '}
                ▾
              </strong>
            </span>
          </button>

          {studiesOpen && (
            <div className="nav-dropdown">
              {STUDIES.map((s) => (
                <button
                  key={s.id}
                  className={`dropdown-item ${activeModule === s.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveModule(s.id);
                    setStudiesOpen(false);
                  }}
                >
                  <span className="dd-num">{s.num}</span>
                  <span className="dd-body">
                    <strong>{s.title}</strong>
                    <small>{s.scope}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={`module-tab ${activeModule === 'ideas' ? 'active' : ''}`}
          onClick={() => { setActiveModule('ideas'); setStudiesOpen(false); }}
        >
          <span className="mod-text"><strong>Ideas &amp; Voting</strong></span>
        </button>

        <button
          className={`module-tab ${activeModule === 'about' ? 'active' : ''}`}
          onClick={() => { setActiveModule('about'); setStudiesOpen(false); }}
        >
          <span className="mod-text"><strong>About</strong></span>
        </button>
      </nav>

      {activeModule === 'home' && <HomePage onSelectModule={setActiveModule} />}
      {activeModule === 'riba' && <RibaModule />}
      {activeModule === 'salah' && <SalahModule />}
      {activeModule === 'sawm' && <SawmModule />}
      {activeModule === 'waqf' && <WaqfModule />}
      {activeModule === 'community' && <CommunityModule />}
      {activeModule === 'ideas' && <IdeasPage />}
      {activeModule === 'about' && <AboutPage />}

      {activeModule === 'zakat' && (
      <>
      {/* Country / Global Selector + Settings Toggle */}
      <div className="zakat-toolbar">
        <nav className="region-bar" aria-label="Select country or world">
          <span className="region-label">Scope:</span>
          <div className="region-pills">
            {Object.values(REGIONS).map((r) => (
              <button
                key={r.id}
                className={`region-pill ${params.regionId === r.id ? 'active' : ''}`}
                onClick={() => updateParam('regionId', r.id)}
              >
                {r.badge}
              </button>
            ))}
          </div>
        </nav>

        <button
          className={`secondary-btn ${showSettings ? 'active-btn' : ''}`}
          onClick={() => setShowSettings((s) => !s)}
        >
          {showSettings ? 'Hide Fiqh Settings' : 'Customize Fiqh Settings'}
        </button>
      </div>

      {/* Collapsible Fiqh & Economy Settings Drawer */}
      {showSettings && (
        <section className="settings-drawer">
          <div className="presets-row">
            <span className="region-label">Quick Presets:</span>
            <button className="region-pill" onClick={() => setParams((p) => ({ ...DEFAULT_PARAMS, regionId: p.regionId }))}>
              Universal (100%)
            </button>
            <button className="region-pill" onClick={() => setParams((p) => ({ ...p, complianceRate: 50 }))}>
              Half Compliance (50%)
            </button>
            <button className="region-pill" onClick={() => setParams((p) => ({ ...p, equityZakatableRatio: 33 }))}>
              33% Liquid Equities
            </button>
          </div>

          <div className="settings-grid">
            <div className="control-group">
              <label><span>Gold Price ($/g)</span><strong>${params.goldPricePerGram}/g</strong></label>
              <input type="range" min="40" max="150" step="1" value={params.goldPricePerGram} onChange={(e) => updateParam('goldPricePerGram', Number(e.target.value))} />
            </div>
            <div className="control-group">
              <label><span>Compliance Rate</span><strong>{params.complianceRate}%</strong></label>
              <input type="range" min="0" max="100" step="5" value={params.complianceRate} onChange={(e) => updateParam('complianceRate', Number(e.target.value))} />
            </div>
            <div className="control-group">
              <label><span>Investment Return (Real)</span><strong>{params.annualReturnRate.toFixed(1)}%/yr</strong></label>
              <input type="range" min="2" max="9" step="0.5" value={params.annualReturnRate} onChange={(e) => updateParam('annualReturnRate', Number(e.target.value))} />
            </div>
            <div className="control-group">
              <label><span>Annual Inflation</span><strong>{params.inflationRate.toFixed(1)}%/yr</strong></label>
              <input type="range" min="0" max="10" step="0.5" value={params.inflationRate} onChange={(e) => updateParam('inflationRate', Number(e.target.value))} />
            </div>
            <div className="control-group">
              <label><span>Equity Zakatable Base</span></label>
              <div className="toggle-row">
                <button className={params.equityZakatableRatio === 100 ? 'active' : ''} onClick={() => updateParam('equityZakatableRatio', 100)}>100% Value</button>
                <button className={params.equityZakatableRatio === 33 ? 'active' : ''} onClick={() => updateParam('equityZakatableRatio', 33)}>33% Liquid</button>
              </div>
            </div>
            <div className="control-group">
              <label><span>Al-Fuqara / Masakin / Debt</span><strong>{params.fuqaraShare}/{params.masakinShare}/{params.ghariminShare}%</strong></label>
              <input type="range" min="10" max="80" step="5" value={params.fuqaraShare} onChange={(e) => updateParam('fuqaraShare', Number(e.target.value))} />
            </div>
          </div>
        </section>
      )}

      {/* Focused Full-Width Dashboard */}
      <main className="dashboard">
          {/* Timeline Scrubber */}
          <section className="timeline-bar">
            <div className="playback-btns">
              <button className="primary-btn" onClick={handlePlayToggle}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button className="secondary-btn" onClick={() => setCurrentYear((y) => Math.max(0, y - 1))}>−1 Yr</button>
              <button className="secondary-btn" onClick={() => setCurrentYear((y) => Math.min(params.years, y + 1))}>+1 Yr</button>
            </div>
            <div className="scrubber">
              <span>Year <strong>{currentYear}</strong> / {params.years}</span>
              <input
                type="range"
                min="0"
                max={params.years}
                value={currentYear}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentYear(Number(e.target.value));
                }}
              />
            </div>
          </section>

          {/* KPI Grid */}
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Annual Zakat Pool (Yr {currentYear})</span>
              <span className="kpi-value">{formatCurrency(zSnap.totalZakatCollected)}</span>
              <span className="kpi-sub">Paid by {zSnap.payingRate.toFixed(1)}% of {region.shortName} households</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Wealth Gini Coefficient</span>
              <span className="kpi-value">{zSnap.gini.toFixed(3)}</span>
              <span className="kpi-sub pos">{(zSnap.gini - bSnap.gini).toFixed(3)} vs Baseline ({bSnap.gini.toFixed(3)})</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">{region.shortName} Poverty Rate</span>
              <span className="kpi-value">{zSnap.povertyRate.toFixed(1)}%</span>
              <span className="kpi-sub pos">{formatHouseholds(liftedFromPoverty)} households lifted</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Median Net Worth</span>
              <span className="kpi-value">{formatCurrency(zSnap.medianNetWorth)}</span>
              <span className="kpi-sub">Baseline: {formatCurrency(bSnap.medianNetWorth)}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Cumulative Inflation ({params.inflationRate.toFixed(1)}%/yr)</span>
              <span className="kpi-value">{((zSnap.cpi - 1) * 100).toFixed(0)}%</span>
              <span className="kpi-sub">
                $1 today = ${(zSnap.purchasingPower / 100).toFixed(2)} • Gold Nisab tracks CPI
              </span>
            </div>
          </section>

          {/* Clean Sub-Tabs so only 1 view shows at a time */}
          <div className="subtab-bar">
            <button className={zakatTab === 'visual' ? 'active' : ''} onClick={() => setZakatTab('visual')}>
              1. Visual Impact (100 Households)
            </button>
            <button className={zakatTab === 'personal' ? 'active' : ''} onClick={() => setZakatTab('personal')}>
              2. What Does My Zakat Do?
            </button>
            <button className={zakatTab === 'compare' ? 'active' : ''} onClick={() => setZakatTab('compare')}>
              3. Zakat vs. Income Tax
            </button>
            <button className={zakatTab === 'charts' ? 'active' : ''} onClick={() => setZakatTab('charts')}>
              4. Economic Charts &amp; Fiqh Rules
            </button>
          </div>

          {zakatTab === 'visual' && (
            <>
              <HumanSocietyGrid zakatSnap={zSnap} baselineSnap={bSnap} region={region} />
              <ZakatFlowGraphic zakatSnap={zSnap} region={region} />
            </>
          )}

          {zakatTab === 'personal' && <PersonalZakat nisab={zSnap.currentNisab} />}

          {zakatTab === 'compare' && (
            <>
              <SystemComparisonCard zakatSnap={zSnap} taxSnap={tSnap} baselineSnap={bSnap} region={region} />
              <WisdomBanner />
            </>
          )}

          {zakatTab === 'charts' && (
            <>
              <section className="charts-grid">
                <TrendChart zakatTimeline={sim.zakatTimeline} baselineTimeline={sim.baselineTimeline} currentYear={currentYear} metric="gini" title="Wealth Inequality (Gini) Over Time" unit="" colorZakat="#1b4332" colorBase="#b54534" minVal={0.4} maxVal={0.95} />
                <TrendChart zakatTimeline={sim.zakatTimeline} baselineTimeline={sim.baselineTimeline} currentYear={currentYear} metric="povertyRate" title="Poverty Rate Over Time" unit="%" colorZakat="#1b4332" colorBase="#c48a2b" minVal={0} maxVal={maxPovAxis} />
                <WealthShareBars zakatSnap={zSnap} baselineSnap={bSnap} />
                <LorenzChart zakatSnap={zSnap} baselineSnap={bSnap} />
              </section>
              <section className="fiqh-note">
                <h3>Fiqh al-Zakah Rules Modeled</h3>
                <ul>
                  <li><strong>Gold Nisab:</strong> {params.nisabGrams}g of 24k gold (${sim.nisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}). Households holding net zakatable wealth ≥ Nisab across a full <strong>Hawl</strong> (1 year) pay <strong>2.5%</strong> on their entire net zakatable wealth.</li>
                  <li><strong>Zakatable vs. Exempt Assets:</strong> Cash, savings, and {params.equityZakatableRatio}% of equities/investments are zakatable after deducting short-term liabilities (<em>Dayn</em>). Primary residences and personal goods (<em>Hawā'ij Aṣliyyah</em>) are exempt.</li>
                  <li><strong>Asnaf Redistribution:</strong> Funds flow to <em>Al-Fuqara</em>, <em>Al-Masakin</em>, and <em>Al-Gharimin</em>, cascading any surplus into community capital once poverty is eliminated.</li>
                </ul>
              </section>
            </>
          )}
      </main>
      </>
      )}
    </div>
  );
}
