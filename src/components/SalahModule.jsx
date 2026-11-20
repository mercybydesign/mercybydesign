import React, { useState, useMemo } from 'react';
import { MethodologyDrawer } from './MethodologyDrawer';

const PRAYERS = [
  { name: 'Fajr', hour: 5.5, time: '5:30 AM', benefit: 'Early circadian anchor, quiet intention, lowers morning anxiety before screens.' },
  { name: 'Dhuhr', hour: 12.5, time: '12:30 PM', benefit: 'Midday cognitive reset, posture decompression, interrupts peak work stress.' },
  { name: 'Asr', hour: 16.0, time: '4:00 PM', benefit: 'Prevents late-afternoon burnout and decision fatigue; restores calm focus.' },
  { name: 'Maghrib', hour: 18.5, time: '6:30 PM', benefit: 'Clean psychological boundary between work and family/evening presence.' },
  { name: 'Isha', hour: 20.5, time: '8:30 PM', benefit: 'Evening gratitude & parasympathetic wind-down for deeper restorative sleep.' },
];

export function SalahModule() {
  const [workStress, setWorkStress] = useState(75); // 20–100
  const [khushuLevel, setKhushuLevel] = useState(80); // mindfulness / presence %

  const curve = useMemo(() => {
    const pts = [];
    let stressNoSalah = 20;
    let stressWithSalah = 15;

    for (let h = 5; h <= 23; h += 0.5) {
      // Natural workday stress accumulation (8 AM – 6 PM)
      const isWork = h >= 8 && h <= 18;
      const buildup = isWork ? (workStress / 100) * 6.5 : 1.2;

      stressNoSalah = Math.min(98, stressNoSalah + buildup * (h > 19 ? -0.4 : 1));
      stressWithSalah = Math.min(95, stressWithSalah + buildup * (h > 19 ? -0.6 : 0.88));

      // Check if prayer occurs at this half-hour
      const prayer = PRAYERS.find((p) => Math.abs(p.hour - h) < 0.01);
      if (prayer) {
        const drop = 16 + (khushuLevel / 100) * 18;
        stressWithSalah = Math.max(10, stressWithSalah - drop);
      }

      pts.push({ hour: h, noSalah: stressNoSalah, withSalah: stressWithSalah, prayer });
    }

    const avgNo = pts.reduce((a, p) => a + p.noSalah, 0) / pts.length;
    const avgWith = pts.reduce((a, p) => a + p.withSalah, 0) / pts.length;
    const peakNo = Math.max(...pts.map((p) => p.noSalah));
    const peakWith = Math.max(...pts.map((p) => p.withSalah));

    return { pts, avgNo, avgWith, peakNo, peakWith };
  }, [workStress, khushuLevel]);

  const width = 580;
  const height = 220;
  const pad = { top: 24, right: 20, bottom: 30, left: 46 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const xScale = (h) => pad.left + ((h - 5) / 18) * innerW;
  const yScale = (v) => pad.top + innerH - (v / 100) * innerH;

  const noPath = curve.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.hour).toFixed(1)} ${yScale(p.noSalah).toFixed(1)}`)
    .join(' ');
  const withPath = curve.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.hour).toFixed(1)} ${yScale(p.withSalah).toFixed(1)}`)
    .join(' ');

  return (
    <div className="module-wrap">
      <section className="wisdom-banner">
        <div className="wisdom-top">
          <div>
            <span className="wisdom-eyebrow">SALAH — INDIVIDUAL MIND, BODY &amp; CIRCADIAN RHYTHM</span>
            <h2>
              “Verily, in the remembrance of Allah do hearts find rest.”{' '}
              <span className="verse-ref">— Qur’an 13:28</span>
            </h2>
          </div>
        </div>
        <div className="wisdom-grid">
          <div className="wisdom-item">
            <div className="wisdom-num">01</div>
            <h3>5 Built-In Cortisol Resets</h3>
            <p>
              Modern workdays create unbroken sympathetic stress. Five 5–10 minute pauses spaced across the solar day interrupt chronic stress accumulation.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">02</div>
            <h3>Mindful Movement &amp; Posture</h3>
            <p>
              Standing, bowing (<em>Ruku</em>), and prostrating (<em>Sujud</em>) gently decompress the spine, improve circulation, and pull attention away from screens.
            </p>
          </div>
          <div className="wisdom-item">
            <div className="wisdom-num">03</div>
            <h3>Anchored Sleep &amp; Time</h3>
            <p>
              Waking for <em>Fajr</em> and winding down after <em>Isha</em> aligns human biology with natural light-dark cycles, supporting deeper sleep and mental clarity.
            </p>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="controls-panel">
          <h2>Daily Rhythm Controls</h2>

          <div className="control-group">
            <label>
              <span>Daily Work / Life Stress</span>
              <strong>{workStress}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={workStress}
              onChange={(e) => setWorkStress(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>
              <span>Presence &amp; Mindfulness (Khushu)</span>
              <strong>{khushuLevel}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={khushuLevel}
              onChange={(e) => setKhushuLevel(Number(e.target.value))}
            />
            <small>Higher presence deepens parasympathetic calm during each prayer.</small>
          </div>

          <hr className="divider" />
          <h3>5 Daily Anchor Points</h3>
          <div className="prayer-list">
            {PRAYERS.map((p) => (
              <div className="prayer-item" key={p.name}>
                <div className="prayer-top">
                  <strong>{p.name}</strong>
                  <span>{p.time}</span>
                </div>
                <p>{p.benefit}</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="dashboard">
          <section className="kpi-grid">
            <div className="kpi-card highlight">
              <span className="kpi-label">Average Daily Stress Load</span>
              <span className="kpi-value">{Math.round(curve.avgWith)}%</span>
              <span className="kpi-sub pos">
                −{Math.round(curve.avgNo - curve.avgWith)} pts lower vs. Unbroken Day ({Math.round(curve.avgNo)}%)
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Peak Burnout Level</span>
              <span className="kpi-value">{Math.round(curve.peakWith)}%</span>
              <span className="kpi-sub">Without pauses: {Math.round(curve.peakNo)}%</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Daily Time Invested</span>
              <span className="kpi-value">~35 min</span>
              <span className="kpi-sub">Only 2.4% of your 24-hour day</span>
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-header">
              <h3>24-Hour Stress &amp; Recovery Curve (5 AM – 11 PM)</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot" style={{ background: '#1b4332' }} /> With 5 Daily Prayers
                </span>
                <span className="legend-item">
                  <span className="dot" style={{ background: '#b54534' }} /> Unbroken Workday
                </span>
              </div>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line
                    x1={pad.left}
                    x2={width - pad.right}
                    y1={yScale(v)}
                    y2={yScale(v)}
                    stroke="rgba(100,95,85,0.15)"
                    strokeDasharray="3 3"
                  />
                  <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" className="axis-label">
                    {v}%
                  </text>
                </g>
              ))}

              {/* Prayer markers */}
              {PRAYERS.map((p) => (
                <g key={p.name}>
                  <line
                    x1={xScale(p.hour)}
                    x2={xScale(p.hour)}
                    y1={pad.top}
                    y2={height - pad.bottom}
                    stroke="rgba(16,185,129,0.35)"
                    strokeDasharray="3 3"
                  />
                  <text x={xScale(p.hour)} y={pad.top - 6} textAnchor="middle" className="axis-label" style={{ fill: '#1b4332', fontWeight: 600 }}>
                    {p.name}
                  </text>
                </g>
              ))}

              <path d={noPath} fill="none" stroke="#b54534" strokeWidth="2.4" strokeDasharray="5 4" />
              <path d={withPath} fill="none" stroke="#1b4332" strokeWidth="2.8" />

              {[6, 12, 18, 22].map((hr) => (
                <text key={hr} x={xScale(hr)} y={height - 6} textAnchor="middle" className="axis-label">
                  {hr > 12 ? `${hr - 12} PM` : hr === 12 ? '12 PM' : `${hr} AM`}
                </text>
              ))}
            </svg>
          </section>
        </main>
      </div>

      <MethodologyDrawer
        modelType="conceptual"
        summary="Stylized 24-hour stress curve illustrating how spaced meditative pauses interrupt sympathetic nervous system buildup."
        assumptions={[
          'Stress index (0–100) is an illustrative heuristic, not a direct clinical cortisol assay; individual stress responses vary widely.',
          'Prayer times (Fajr through Isha) are fixed to an equinox-like schedule for clarity; real prayer times shift seasonally by latitude.',
          'The recovery drop scales with self-reported mindfulness (Khushu) to reflect the difference between rushed and attentive prayer.',
        ]}
        sources={[
          {
            label: 'Qur’an 13:28 & 4:103',
            detail: 'Remembrance of Allah bringing tranquility to hearts, and prayer prescribed at fixed times.',
          },
          {
            label: 'Mindfulness & Cortisol Literature',
            detail: 'Brief, recurring mindfulness and slow-breathing breaks are associated with lower perceived stress and improved parasympathetic recovery (e.g., Pascoe et al., J. Psychiatr. Res. 2017).',
          },
          {
            label: 'Circadian Anchor Research',
            detail: 'Consistent early-morning wake/light exposure and evening wind-down support circadian alignment and sleep quality.',
          },
        ]}
      />
    </div>
  );
}
