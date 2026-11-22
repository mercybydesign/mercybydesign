import React, { useState } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

const FAST_STAGES = [
  { start: 0, end: 4, title: 'Fed State & Digestion', desc: 'Blood glucose rises after Suhoor; insulin stores energy as glycogen.' },
  { start: 4, end: 8, title: 'Post-Absorptive Transition', desc: 'Insulin begins to drop; the body shifts from digesting food to drawing on stored glycogen.' },
  { start: 8, end: 12, title: 'Insulin Sensitivity & Calm', desc: 'Blood sugar stabilizes, digestive tract rests, and mental clarity sharpens.' },
  { start: 12, end: 15, title: 'Metabolic Switch (Lipolysis)', desc: 'Liver glycogen depletes; the body transitions to burning stored fat for clean energy.' },
  { start: 15, end: 18, title: 'Early Cellular Renewal', desc: 'Autophagy pathways begin activating, clearing damaged cellular proteins while discipline peaks.' },
];

export function SawmModule() {
  const [fastHour, setFastHour] = useState(14);
  const [ramadanDay, setRamadanDay] = useState(15);

  const currentStage =
    FAST_STAGES.find((s) => fastHour >= s.start && fastHour <= s.end) || FAST_STAGES[FAST_STAGES.length - 1];

  // Evidence-based qualitative stage indicators (avoiding invented linear percentages)
  const insulinState =
    fastHour < 4
      ? 'Elevated (Fed)'
      : fastHour < 8
      ? 'Declining'
      : fastHour < 12
      ? 'Low Baseline'
      : 'High Sensitivity';

  const fuelSource =
    fastHour < 4
      ? 'Dietary Glucose'
      : fastHour < 12
      ? 'Liver Glycogen'
      : fastHour < 15
      ? 'Glycogen → Fat'
      : 'Lipolysis & Ketones';

  const habitPhase =
    ramadanDay <= 3
      ? 'Adaptation'
      : ramadanDay <= 10
      ? 'Routine Forming'
      : ramadanDay <= 20
      ? 'Consolidation'
      : 'Deepened Habit';

  const communityPhase =
    ramadanDay <= 10
      ? 'Shared Iftars'
      : ramadanDay <= 20
      ? 'Charity Momentum'
      : 'Peak Giving & Zakat al-Fitr';

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">SAWM — FASTING, HEALTH &amp; SELF-MASTERY</span>
            <h2>
              “Fasting has been prescribed for you… so that you may attain mindfulness.”{' '}
              <span className="verse-ref">— Qur’an 2:183</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>Metabolic &amp; Cellular Reset</h3>
            <p>
              Giving the digestive system 12–16 hours of daily rest lowers baseline insulin, improves metabolic flexibility, and supports cellular repair.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Breaking Impulse &amp; Dopamine Loops</h3>
            <p>
              Voluntarily pausing even lawful desires (food and drink) trains the prefrontal cortex to master habits, anger, and modern overconsumption.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Empathy in Action</h3>
            <p>
              Experiencing hunger firsthand turns abstract sympathy into real generosity—making Ramadan the largest annual wave of global charity and shared meals.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Fasting &amp; Ramadan Controls</h2>

          <div className="control-group">
            <label>
              <span>Hours Into Daily Fast</span>
              <strong>Hour {fastHour}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="18"
              step="1"
              value={fastHour}
              onChange={(e) => setFastHour(Number(e.target.value))}
            />
            <small>Typical dawn-to-sunset fast ranges from 12 to 16 hours.</small>
          </div>

          <div className="control-group">
            <label>
              <span>Day of Ramadan</span>
              <strong>Day {ramadanDay} / 30</strong>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={ramadanDay}
              onChange={(e) => setRamadanDay(Number(e.target.value))}
            />
            <small>30 consecutive days rewire habits and deepen community solidarity.</small>
          </div>

          <hr className="divider" />
          <h3>Current Biological Stage</h3>
          <div className="prayer-item">
            <div className="prayer-top">
              <strong>{currentStage.title}</strong>
              <span>{currentStage.start}–{currentStage.end}h</span>
            </div>
            <p>{currentStage.desc}</p>
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Insulin State</span>
              <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{insulinState}</span>
              <span className="kpi-sub pos">At Hour {fastHour} of daily fast</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Primary Fuel Source</span>
              <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{fuelSource}</span>
              <span className="kpi-sub">Metabolic switch begins ~12h</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Behavioral Habit Phase</span>
              <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{habitPhase}</span>
              <span className="kpi-sub">Day {ramadanDay} of 30</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Community Solidarity</span>
              <span className="kpi-value" style={{ fontSize: '1.25rem' }}>{communityPhase}</span>
              <span className="kpi-sub pos">Peaks in final 10 nights + Zakat al-Fitr</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>Daily Fast Progression (Hours 0 – 18)</h3>
            </div>
            <div className="stage-timeline">
              {FAST_STAGES.map((st) => {
                const active = fastHour >= st.start && fastHour <= st.end;
                const passed = fastHour > st.end;
                return (
                  <div
                    key={st.title}
                    className={`stage-row ${active ? 'active' : passed ? 'passed' : ''}`}
                    onClick={() => setFastHour(Math.round((st.start + st.end) / 2))}
                  >
                    <div className="stage-time">{st.start}–{st.end}h</div>
                    <div className="stage-body">
                      <strong>{st.title}</strong>
                      <p>{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Educational timeline mapping typical human metabolic shifts during a 12–18 hour daily fast alongside a 30-day habit tracker."
        assumptions={[
          'Metabolic phase timings (glycogen depletion, lipolysis, early autophagy signaling) are population averages and vary by prior meal composition, activity level, and individual metabolism.',
          'This study is for educational reflection only and is not medical advice; Islam explicitly exempts the ill, travelers, pregnant/nursing mothers, and the elderly (Qur’an 2:184–185).',
        ]}
        sources={[
          {
            label: 'Qur’an 2:183–185',
            detail: 'Prescription of fasting to cultivate self-restraint (Taqwa), with explicit mercy and exemptions for hardship.',
          },
          {
            label: 'de Cabo & Mattson (NEJM, 2019)',
            detail: '“Effects of Intermittent Fasting on Health, Aging, and Disease” — overview of metabolic switching from glucose to ketone bodies.',
          },
        ]}
      />
    </div>
  );
}
