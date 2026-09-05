import React, { useState, useEffect } from 'react';

const extractCostLakhs = (costStr) => {
  if (!costStr) return 50;
  const match = costStr.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 50;
};

const InterventionCard = ({ intervention, index, isSelected, onToggle }) => {
  return (
    <div 
      className={`intervention-card ${isSelected ? 'selected-sandbox-card' : 'unselected-sandbox-card'}`}
      onClick={() => onToggle(index)}
      style={{
        border: isSelected ? '2px solid #2E96F5' : '1px solid rgba(7, 23, 63, 0.1)',
        background: isSelected ? 'rgba(255, 255, 255, 0.98)' : 'rgba(245, 247, 250, 0.7)',
        boxShadow: isSelected ? '0 8px 24px rgba(46, 150, 245, 0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div className="intervention-title" style={{ color: isSelected ? '#0042A6' : '#5A6E85', margin: 0 }}>
          #{index + 1}. {intervention.title || intervention.name}
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: '20px',
          background: isSelected ? '#EBF5FF' : '#E2E8F0',
          color: isSelected ? '#0042A6' : '#64748B',
          border: isSelected ? '1px solid #2E96F5' : '1px solid transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>{isSelected ? '✓ In Policy Sandbox' : '+ Click to Enable'}</span>
        </div>
      </div>

      <div className="intervention-desc" style={{ color: isSelected ? '#2C3E50' : '#7F8C8D' }}>
        {intervention.description}
      </div>

      <div className="intervention-details">
        <div className="detail-item">
          <span className="detail-label">Runoff Reduction:</span>
          <span className="detail-value" style={{ color: isSelected ? '#00875A' : '#7F8C8D', fontWeight: '800' }}>
            -{intervention.runoff_reduction_pct}%
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Estimated Cost:</span>
          <span className="detail-value">{intervention.cost_bracket || `₹${intervention.cost_estimate_inr_lakhs || 60} Lakhs`}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Timeline:</span>
          <span className="detail-value">{intervention.implementation_months || intervention.timeline_months || 10} months</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">KPI:</span>
          <span className="detail-value">{intervention.kpi || 'Stormwater peak velocity attenuation'}</span>
        </div>
        {(intervention.contact || intervention.responsible_department) && (
          <div className="detail-item">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{intervention.contact || intervention.responsible_department}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const InterventionsSection = ({ interventions, loading, simulationData, onMitigationChange }) => {
  const [selectedIndices, setSelectedIndices] = useState([0, 1]); // default top 2 active

  // Reset or initialize when interventions change
  useEffect(() => {
    if (interventions && interventions.length > 0) {
      setSelectedIndices([0, 1]);
    }
  }, [interventions]);

  const handleToggle = (index) => {
    let updated;
    if (selectedIndices.includes(index)) {
      updated = selectedIndices.filter(i => i !== index);
    } else {
      updated = [...selectedIndices, index];
    }
    setSelectedIndices(updated);
  };

  // Calculate live Sandbox metrics
  const activeItems = (interventions || []).filter((_, idx) => selectedIndices.includes(idx));
  
  const totalReductionPct = Math.min(
    65, 
    activeItems.reduce((acc, item) => acc + (parseFloat(item.runoff_reduction_pct) || 15), 0)
  );

  const totalCostLakhs = activeItems.reduce((acc, item) => {
    const cost = item.cost_estimate_inr_lakhs 
      ? parseFloat(item.cost_estimate_inr_lakhs) 
      : extractCostLakhs(item.cost_bracket);
    return acc + cost;
  }, 0);

  const totalCostCr = (totalCostLakhs / 100).toFixed(2);
  const damagePreventedCr = (parseFloat(totalCostCr) * 5.4).toFixed(2);
  const netRoiPct = totalCostLakhs > 0 ? Math.round(((parseFloat(damagePreventedCr) - parseFloat(totalCostCr)) / parseFloat(totalCostCr)) * 100) : 0;
  const basePeopleAtRisk = simulationData?.metrics?.scenario_people || 1500;
  const peopleProtected = Math.round(basePeopleAtRisk * (totalReductionPct / 100));

  // Notify parent of mitigation level
  useEffect(() => {
    if (onMitigationChange) {
      onMitigationChange({
        totalReductionPct,
        activeCount: selectedIndices.length
      });
    }
  }, [totalReductionPct, selectedIndices, onMitigationChange]);

  if (!interventions || interventions.length === 0) return null;

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Green Infrastructure Sandbox</h3>
        <span style={{ fontSize: '11px', color: '#2E96F5', fontWeight: '700' }}>
          {selectedIndices.length} of {interventions.length} Interventions Active
        </span>
      </div>

      {/* Live Municipal ROI Summary Card */}
      {!loading && (
        <div style={{
          background: 'linear-gradient(135deg, #07173F 0%, #0042A6 100%)',
          borderRadius: '16px',
          padding: '18px 20px',
          color: '#FFFFFF',
          marginBottom: '20px',
          boxShadow: '0 12px 28px rgba(7, 23, 63, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#00E5FF', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              ⚡ Live Municipal ROI & Risk Offset
            </span>
            <span style={{ fontSize: '11px', background: 'rgba(0, 229, 255, 0.2)', padding: '3px 8px', borderRadius: '6px', color: '#00E5FF', fontWeight: '700' }}>
              Interactive Simulator
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '4px' }}>Runoff Cut</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#00E5FF' }}>
                -{totalReductionPct}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '4px' }}>Investment</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>
                ₹{totalCostCr} Cr
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '4px' }}>Damage Averted</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#27AE60' }}>
                ₹{damagePreventedCr} Cr
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '4px' }}>Net ROI</div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFD700' }}>
                +{netRoiPct}%
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>👥 <strong>{peopleProtected.toLocaleString()}</strong> residents protected from flood risk</span>
            <span style={{ color: '#00E5FF' }}>Map flood zone adjusted in real-time</span>
          </div>
        </div>
      )}

      {/* Interventions Cards */}
      <div style={{
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        {loading ? (
          <div className="intervention-card" style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(7, 23, 63, 0.1)',
            borderRadius: '12px',
            color: '#0042A6',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: '600'
          }}>
            Generating AI-powered municipal recommendations...
          </div>
        ) : (
          <div className="interventions-list">
            {interventions.map((intervention, index) => (
              <InterventionCard
                key={index}
                intervention={intervention}
                index={index}
                isSelected={selectedIndices.includes(index)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
      
      {!loading && interventions.length > 0 && (
        <div style={{
          fontSize: '11px',
          color: '#5A6E85',
          textAlign: 'center',
          marginTop: '16px',
          fontFamily: 'Overpass, sans-serif'
        }}>
          💡 <em>Click cards above to toggle solutions and test policy combinations on the map.</em>
        </div>
      )}
    </div>
  );
};

// Add CSS styles for the detail structure
const styles = `
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(7, 23, 63, 0.05);
}

.detail-label {
  font-family: 'Overpass', sans-serif;
  font-size: 11px;
  color: #0042A6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  color: #07173F;
  font-weight: 600;
}

.interventions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-sandbox-card:hover {
  transform: translateY(-2px);
}

.unselected-sandbox-card:hover {
  background: rgba(255, 255, 255, 0.9) !important;
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('interventions-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'interventions-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default InterventionsSection;