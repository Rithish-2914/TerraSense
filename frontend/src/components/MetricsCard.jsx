import React from 'react';

const MetricsCard = ({ metrics, scenario, loading }) => {
  if (!metrics) return null;

  // Calculate risk level based on runoff increase
  const runoffIncrease = metrics.peak_runoff_change_pct || 0;
  let riskLevel, riskColor;
  
  if (runoffIncrease <= 10) {
    riskLevel = 'Low';
    riskColor = '#0284C7'; // Blue
  } else if (runoffIncrease <= 30) {
    riskLevel = 'Medium';
    riskColor = '#D97706'; // Amber
  } else {
    riskLevel = 'High';
    riskColor = '#DC2626'; // Crimson Red
  }

  // Heat stress color coding
  const getHeatStressColor = (level) => {
    switch(level) {
      case 'Low': return '#0284C7';
      case 'Medium': return '#D97706'; 
      case 'High': return '#DC2626';
      default: return '#64748B';
    }
  };

  return (
    <div className="section">
      <h3>Impact Metrics</h3>
      <div className="metrics-card" style={{
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        <div className="metric-item">
          <span className="metric-label">Peak Runoff Change:</span>
          <span className="metric-value">
            {loading ? 'Calculating...' : `+${metrics.peak_runoff_change_pct}%`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">People Affected:</span>
          <span className="metric-value">
            {loading ? 'Loading...' : 
              scenario === 'baseline' 
                ? (metrics.baseline_people || 0).toLocaleString()
                : (metrics.scenario_people || 0).toLocaleString()
            }
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Mean Annual Rainfall:</span>
          <span className="metric-value">
            {loading ? 'Loading...' : `${metrics.mean_rain_mm}mm`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Surface Temperature:</span>
          <span className="metric-value">
            {loading ? 'Loading...' : `${metrics.mean_temperature_c}°C`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Heat Stress:</span>
          <span className="metric-value" style={{
            color: loading ? '#999' : getHeatStressColor(metrics.heat_stress_level)
          }}>
            {loading ? 'Calculating...' : `${metrics.heat_stress_level} (${(metrics.heat_affected_people || 0).toLocaleString()} people)`}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Flood Risk Level:</span>
          <span className="metric-value" style={{
            color: loading ? '#999' : riskColor
          }}>
            {loading ? 'Updating...' : riskLevel}
          </span>
        </div>
      </div>
      {loading && (
        <div style={{
          fontSize: '11px',
          color: '#0042A6',
          textAlign: 'center',
          marginTop: '8px',
          fontFamily: 'Overpass, sans-serif',
          fontWeight: '600'
        }}>
          Recalculating with new scenario...
        </div>
      )}
    </div>
  );
};

export default MetricsCard;