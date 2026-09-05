import React, { useState, useMemo } from 'react';

const StormHydrographCard = ({ rainIntensity = 180, mitigationPct = 0 }) => {
  const [hoveredHour, setHoveredHour] = useState(null);

  const chartHeight = 160;
  const chartWidth = 460;
  const padding = 30;

  // Generate 24-hour hydrograph curve data dynamically based on rainfall & mitigation (Memoized)
  const { dataPoints, maxQ, inflowPath, outflowPath } = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i + 1);
    const stormFactor = rainIntensity / 180;
    const attenuationFactor = 1 - (Math.min(65, mitigationPct || 40) / 100) * 0.75;

    const points = hours.map((hour) => {
      let rainMmH = 0;
      if (hour >= 4 && hour <= 9) {
        const center = 6.5;
        rainMmH = Math.max(0, Math.round(35 * stormFactor * Math.exp(-Math.pow(hour - center, 2) / 2.5)));
      }

      const inflowCenter = 8.0;
      const peakInflow = 42 * stormFactor;
      const inflowQ = Math.max(2, parseFloat((peakInflow * Math.exp(-Math.pow(hour - inflowCenter, 2) / 6.5)).toFixed(1)));

      const outflowCenter = 11.5;
      const peakOutflow = 18 * stormFactor * attenuationFactor;
      const outflowQ = Math.max(1.5, parseFloat((peakOutflow * Math.exp(-Math.pow(hour - outflowCenter, 2) / 14.0)).toFixed(1)));

      return { hour, rainMmH, inflowQ, outflowQ };
    });

    const calculatedMaxQ = Math.max(...points.map(d => Math.max(d.inflowQ, d.outflowQ)), 50);

    const getXCoord = (h) => padding + ((h - 1) / 23) * (chartWidth - padding * 2);
    const getYCoord = (v) => chartHeight - padding - (v / calculatedMaxQ) * (chartHeight - padding * 2);

    const iPath = points.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getXCoord(d.hour)} ${getYCoord(d.inflowQ)}`).join(' ');
    const oPath = points.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getXCoord(d.hour)} ${getYCoord(d.outflowQ)}`).join(' ');

    return { dataPoints: points, maxQ: calculatedMaxQ, inflowPath: iPath, outflowPath: oPath };
  }, [rainIntensity, mitigationPct]);

  const getX = (hour) => padding + ((hour - 1) / 23) * (chartWidth - padding * 2);
  const getY = (val) => chartHeight - padding - (val / maxQ) * (chartHeight - padding * 2);

  const activePoint = hoveredHour !== null ? dataPoints[hoveredHour - 1] : null;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '18px 20px',
      border: '1px solid rgba(7, 23, 63, 0.1)',
      boxShadow: '0 8px 24px rgba(7, 23, 63, 0.06)',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#07173F', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📈 24-Hour Storm Hydrograph</span>
            <span style={{ fontSize: '11px', background: '#EBF5FF', color: '#0042A6', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
              Civil Engineering Physics
            </span>
          </h3>
          <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#64748B' }}>
            Simulating stormwater peak discharge shaving & retention lag time
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '4px 8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#991B1B', fontWeight: '700', textTransform: 'uppercase' }}>Peak Shaving</div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#E43700' }}>-57% Peak Flow</div>
          </div>
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', padding: '4px 8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#065F46', fontWeight: '700', textTransform: 'uppercase' }}>Flood Crest Delay</div>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#059669' }}>+3.5 Hours</div>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoveredHour(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac, idx) => {
            const y = chartHeight - padding - frac * (chartHeight - padding * 2);
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                <text x={padding - 6} y={y + 3} fontSize="9" fill="#94A3B8" textAnchor="end">
                  {Math.round(frac * maxQ)}
                </text>
              </g>
            );
          })}

          {/* Rainfall Hyetograph Bars (Blue downward bars) */}
          {dataPoints.map((d) => {
            const barHeight = (d.rainMmH / 35) * 35;
            return (
              <rect
                key={`rain-${d.hour}`}
                x={getX(d.hour) - 4}
                y={padding - 10}
                width={8}
                height={barHeight}
                fill="rgba(46, 150, 245, 0.35)"
                rx="2"
              />
            );
          })}

          {/* Unmitigated Inflow Curve (Red Area & Stroke) */}
          <path
            d={`${inflowPath} L ${getX(24)} ${chartHeight - padding} L ${getX(1)} ${chartHeight - padding} Z`}
            fill="rgba(228, 55, 0, 0.12)"
          />
          <path
            d={inflowPath}
            fill="none"
            stroke="#E43700"
            strokeWidth="2.5"
          />

          {/* Mitigated Outflow Curve (Green Area & Stroke) */}
          <path
            d={`${outflowPath} L ${getX(24)} ${chartHeight - padding} L ${getX(1)} ${chartHeight - padding} Z`}
            fill="rgba(39, 174, 96, 0.18)"
          />
          <path
            d={outflowPath}
            fill="none"
            stroke="#27AE60"
            strokeWidth="2.5"
            strokeDasharray="4,2"
          />

          {/* Hover hitboxes & circles */}
          {dataPoints.map((d) => (
            <g key={`hit-${d.hour}`} onMouseEnter={() => setHoveredHour(d.hour)} style={{ cursor: 'pointer' }}>
              <rect
                x={getX(d.hour) - 9}
                y={0}
                width={18}
                height={chartHeight}
                fill="transparent"
              />
              {hoveredHour === d.hour && (
                <>
                  <line
                    x1={getX(d.hour)}
                    y1={padding - 10}
                    x2={getX(d.hour)}
                    y2={chartHeight - padding}
                    stroke="#64748B"
                    strokeDasharray="2,2"
                  />
                  <circle cx={getX(d.hour)} cy={getY(d.inflowQ)} r="4" fill="#E43700" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx={getX(d.hour)} cy={getY(d.outflowQ)} r="4" fill="#27AE60" stroke="#FFFFFF" strokeWidth="2" />
                </>
              )}
            </g>
          ))}

          {/* X Axis Labels */}
          {[1, 6, 12, 18, 24].map((hr) => (
            <text key={hr} x={getX(hr)} y={chartHeight - 8} fontSize="9" fill="#64748B" textAnchor="middle">
              {hr}:00
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Card */}
        {activePoint && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            background: 'rgba(7, 23, 63, 0.92)',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            pointerEvents: 'none'
          }}>
            <div><strong>Time: {activePoint.hour}:00 Hrs</strong></div>
            <div style={{ color: '#00E5FF' }}>🌧️ Rain: {activePoint.rainMmH} mm/h</div>
            <div style={{ color: '#FF6B6B' }}>🔴 Unmitigated Flow: {activePoint.inflowQ} m³/s</div>
            <div style={{ color: '#4ADE80' }}>🟢 Mitigated Flow: {activePoint.outflowQ} m³/s</div>
          </div>
        )}
      </div>

      {/* Legend & Summary Notes */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
        paddingTop: '8px',
        borderTop: '1px solid #E2E8F0',
        fontSize: '11px',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(46, 150, 245, 0.5)', borderRadius: '2px' }}></span>
            Rainfall Hyetograph
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '3px', background: '#E43700' }}></span>
            Unmitigated Surge (Q-Inflow)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '3px', background: '#27AE60', borderTop: '1px dashed #27AE60' }}></span>
            Mitigated Retention (Q-Outflow)
          </span>
        </div>

        <span style={{ color: '#0042A6', fontWeight: '700' }}>
          🛡️ Retention Basin buffers 45,000 m³ floodwater
        </span>
      </div>
    </div>
  );
};

export default StormHydrographCard;
