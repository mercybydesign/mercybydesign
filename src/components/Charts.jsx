import React from 'react';

export function TrendChart({ zakatTimeline, baselineTimeline, currentYear, metric, title, unit, colorZakat, colorBase, minVal, maxVal }) {
  const width = 460;
  const height = 200;
  const pad = { top: 18, right: 20, bottom: 28, left: 44 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const years = zakatTimeline.length - 1;
  const xScale = (y) => pad.left + (y / Math.max(1, years)) * innerW;
  const yScale = (v) => {
    const clamped = Math.max(minVal, Math.min(maxVal, v));
    return pad.top + innerH - ((clamped - minVal) / (maxVal - minVal)) * innerH;
  };

  const toPath = (timeline) =>
    timeline
      .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xScale(pt.year).toFixed(1)} ${yScale(pt[metric]).toFixed(1)}`)
      .join(' ');

  const toAreaPath = (timeline) => {
    const line = toPath(timeline);
    const lastX = xScale(timeline[timeline.length - 1].year).toFixed(1);
    const firstX = xScale(timeline[0].year).toFixed(1);
    const baseY = (height - pad.bottom).toFixed(1);
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  const gradId = `grad-${metric}`;

  const zVal = zakatTimeline[currentYear][metric];
  const bVal = baselineTimeline[currentYear][metric];
  const cx = xScale(currentYear);

  const yTicks = 4;
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => minVal + ((maxVal - minVal) * i) / yTicks);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="dot" style={{ background: colorZakat }} />
            With Zakat: <strong>{zVal.toFixed(metric === 'gini' ? 3 : 1)}{unit}</strong>
          </span>
          <span className="legend-item">
            <span className="dot" style={{ background: colorBase }} />
            Baseline: <strong>{bVal.toFixed(metric === 'gini' ? 3 : 1)}{unit}</strong>
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorZakat} stopOpacity="0.28" />
            <stop offset="100%" stopColor={colorZakat} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {tickValues.map((tv, idx) => (
          <g key={idx}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={yScale(tv)}
              y2={yScale(tv)}
              stroke="rgba(148, 163, 184, 0.14)"
              strokeDasharray="3 3"
            />
            <text x={pad.left - 8} y={yScale(tv) + 4} textAnchor="end" className="axis-label">
              {metric === 'gini' ? tv.toFixed(2) : `${Math.round(tv)}${unit}`}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {[0, Math.round(years / 2), years].map((yr) => (
          <text key={yr} x={xScale(yr)} y={height - 6} textAnchor="middle" className="axis-label">
            Yr {yr}
          </text>
        ))}

        {/* Zakat area gradient */}
        <path d={toAreaPath(zakatTimeline)} fill={`url(#${gradId})`} />
        {/* Baseline path */}
        <path d={toPath(baselineTimeline)} fill="none" stroke={colorBase} strokeWidth="2.2" strokeDasharray="5 4" />
        {/* Zakat path */}
        <path d={toPath(zakatTimeline)} fill="none" stroke={colorZakat} strokeWidth="2.8" />

        {/* Current year marker */}
        <line x1={cx} x2={cx} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
        <circle cx={cx} cy={yScale(bVal)} r="4" fill={colorBase} />
        <circle cx={cx} cy={yScale(zVal)} r="4.8" fill={colorZakat} stroke="#0f172a" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function LorenzChart({ zakatSnap, baselineSnap }) {
  const size = 240;
  const pad = 34;
  const inner = size - pad * 2;
  const sx = (v) => pad + v * inner;
  const sy = (v) => pad + inner - v * inner;

  const toPath = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(' ');

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Lorenz Curve (Year {zakatSnap.year})</h3>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="dot" style={{ background: '#10b981' }} /> Zakat
          </span>
          <span className="legend-item">
            <span className="dot" style={{ background: '#f43f5e' }} /> Baseline
          </span>
        </div>
      </div>
      <div className="lorenz-wrap">
        <svg viewBox={`0 0 ${size} ${size}`} className="lorenz-svg">
          {/* Grid */}
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={pad} x2={size - pad} y1={sy(t)} y2={sy(t)} stroke="rgba(148,163,184,0.12)" />
              <line x1={sx(t)} x2={sx(t)} y1={pad} y2={size - pad} stroke="rgba(148,163,184,0.12)" />
            </g>
          ))}
          {/* Perfect equality line */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} stroke="rgba(148,163,184,0.45)" strokeDasharray="4 4" />
          {/* Baseline */}
          <path d={toPath(baselineSnap.lorenz)} fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeDasharray="5 3" />
          {/* Zakat */}
          <path d={toPath(zakatSnap.lorenz)} fill="none" stroke="#10b981" strokeWidth="2.8" />
          {/* Axis labels */}
          <text x={size / 2} y={size - 6} textAnchor="middle" className="axis-label">
            Cumulative % of US Households
          </text>
          <text
            x={10}
            y={size / 2}
            textAnchor="middle"
            transform={`rotate(-90 10 ${size / 2})`}
            className="axis-label"
          >
            Cumulative % of Wealth
          </text>
        </svg>
      </div>
    </div>
  );
}

export function WealthShareBars({ zakatSnap, baselineSnap }) {
  const groups = [
    { key: 'bottom50', label: 'Bottom 50%' },
    { key: 'mid40', label: 'Middle 40% (50–90%)' },
    { key: 'next9', label: 'Upper 9% (90–99%)' },
    { key: 'top1', label: 'Top 1%' },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>US Wealth Share by Group (Year {zakatSnap.year})</h3>
        <div className="chart-legend">
          <span className="legend-item"><span className="dot" style={{ background: '#10b981' }} /> With Zakat</span>
          <span className="legend-item"><span className="dot" style={{ background: '#64748b' }} /> Baseline</span>
        </div>
      </div>
      <div className="share-bars">
        {groups.map((g) => {
          const zVal = Math.max(0, zakatSnap.shares[g.key]);
          const bVal = Math.max(0, baselineSnap.shares[g.key]);
          const diff = zVal - bVal;
          return (
            <div className="share-row" key={g.key}>
              <div className="share-row-top">
                <span>{g.label}</span>
                <span className="share-nums">
                  <strong>{zVal.toFixed(1)}%</strong>
                  <span className={`delta ${diff >= 0 ? 'pos' : 'neg'}`}>
                    ({diff >= 0 ? '+' : ''}{diff.toFixed(1)}pp)
                  </span>
                </span>
              </div>
              <div className="bar-track">
                <div className="bar-fill zakat" style={{ width: `${Math.min(100, zVal)}%` }} />
              </div>
              <div className="bar-track thin">
                <div className="bar-fill base" style={{ width: `${Math.min(100, bVal)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
